#!/usr/bin/env node
/**
 * Audit /products/all/ product-card images for duplicates.
 *
 * Replays the image-resolution priority from catalog-pages.ts offline:
 *   1. WP_IMAGE_OVERRIDES[route]
 *   2. CATALOG_IMAGE_OVERRIDES[route]
 *   3. For editorial landings: heroImage
 *   4. For WP products: extractFirstImage(bodyHtml)
 *
 * Writes image-audit.json (all products + their final image) and
 * image-duplicates.json (groups where ≥ 2 products share an image).
 */

import fs from "node:fs/promises";
import path from "node:path";
import { load } from "cheerio";

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const PAGES_DIR = path.join(REPO, "src", "data", "pages");
const EDITORIAL_DIR = path.join(REPO, "src", "content", "editorial");
const CATALOG_SRC = path.join(REPO, "src", "lib", "catalog-pages.ts");

// ── Parse CATALOG_IMAGE_OVERRIDES and WP_IMAGE_OVERRIDES from catalog-pages.ts ──
function parseOverrideMap(src, varName) {
  const re = new RegExp(`const ${varName}: Record<string, string> = \\{([\\s\\S]*?)^\\};`, "m");
  const match = src.match(re);
  if (!match) return {};
  const body = match[1];
  const out = {};
  const entryRe = /"([^"]+)"\s*:\s*"([^"]+)"/g;
  let m;
  while ((m = entryRe.exec(body)) !== null) {
    out[m[1]] = m[2];
  }
  return out;
}

async function loadOverrides() {
  const src = await fs.readFile(CATALOG_SRC, "utf8");
  return {
    catalog: parseOverrideMap(src, "CATALOG_IMAGE_OVERRIDES"),
    wp: parseOverrideMap(src, "WP_IMAGE_OVERRIDES"),
  };
}

// ── Walk src/data/pages/product/*.json ──
async function walkDir(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walkDir(full)));
    else if (e.name.endsWith(".json")) out.push(full);
  }
  return out;
}

async function loadWpProducts() {
  const productDir = path.join(PAGES_DIR, "product");
  const files = await walkDir(productDir);
  const out = [];
  for (const f of files) {
    try {
      const data = JSON.parse(await fs.readFile(f, "utf8"));
      if (!data.route || !data.route.startsWith("/product/")) continue;
      out.push(data);
    } catch {}
  }
  return out;
}

async function loadEditorialLandings() {
  const files = await walkDir(EDITORIAL_DIR);
  const out = [];
  for (const f of files) {
    try {
      const data = JSON.parse(await fs.readFile(f, "utf8"));
      if (data.group !== "products") continue;
      if (!data.route) continue;
      // Editorial /industries/* are excluded from catalog
      if (data.route.startsWith("/industries/")) continue;
      out.push(data);
    } catch {}
  }
  return out;
}

function extractFirstImage(bodyHtml) {
  if (!bodyHtml) return "";
  const $ = load(bodyHtml, { decodeEntities: false });
  const selectors = [".woocommerce-product-gallery__image img", ".entry-content img", ".product img", "img"];
  for (const sel of selectors) {
    const el = $(sel).get(0);
    if (!el) continue;
    const src = ($(el).attr("data-large_image") ?? $(el).attr("src") ?? "").trim();
    if (src.startsWith("/site-assets/")) return src;
  }
  return "";
}

async function main() {
  const { catalog, wp } = await loadOverrides();
  const wpProducts = await loadWpProducts();
  const landings = await loadEditorialLandings();

  const products = [];

  for (const p of wpProducts) {
    // Priority: WP_IMAGE_OVERRIDES > CATALOG_IMAGE_OVERRIDES > extractFirstImage
    let image = wp[p.route] ?? catalog[p.route] ?? extractFirstImage(p.bodyHtml) ?? "";
    let src = wp[p.route] ? "wp_override" : catalog[p.route] ? "catalog_override" : image ? "extracted" : "none";
    products.push({
      route: p.route,
      title: p.title || "",
      kind: "wp",
      image,
      imageSource: src,
    });
  }

  for (const d of landings) {
    // Priority: CATALOG_IMAGE_OVERRIDES > heroImage > (not attempting source-route extraction here)
    let image = catalog[d.route] ?? d.heroImage ?? "";
    let src = catalog[d.route] ? "catalog_override" : d.heroImage ? "heroImage" : "none";
    products.push({
      route: d.route,
      title: d.title || "",
      kind: "editorial",
      image,
      imageSource: src,
    });
  }

  products.sort((a, b) => a.route.localeCompare(b.route));

  // Group by image URL
  const groups = new Map();
  for (const p of products) {
    const key = p.image || "__EMPTY__";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(p);
  }

  const duplicates = [];
  const emptyImages = [];
  for (const [url, entries] of groups) {
    if (url === "__EMPTY__") {
      emptyImages.push(...entries);
    } else if (entries.length >= 2) {
      duplicates.push({ image: url, count: entries.length, routes: entries });
    }
  }

  duplicates.sort((a, b) => b.count - a.count);

  const summary = {
    totalProducts: products.length,
    uniqueImages: groups.size - (groups.has("__EMPTY__") ? 1 : 0),
    duplicateGroups: duplicates.length,
    routesAffectedByDup: duplicates.reduce((n, g) => n + g.count, 0),
    emptyImageCount: emptyImages.length,
  };

  await fs.writeFile(
    path.join(REPO, "image-audit.json"),
    JSON.stringify({ summary, products }, null, 2),
  );
  await fs.writeFile(
    path.join(REPO, "image-duplicates.json"),
    JSON.stringify({ summary, duplicates, emptyImages }, null, 2),
  );

  console.log("── Catalog image audit ──");
  console.log(`Total products:           ${summary.totalProducts}`);
  console.log(`Unique images:            ${summary.uniqueImages}`);
  console.log(`Duplicate groups:         ${summary.duplicateGroups}`);
  console.log(`Routes affected by dup:   ${summary.routesAffectedByDup}`);
  console.log(`Products with no image:   ${summary.emptyImageCount}`);
  console.log("");
  console.log("Top 15 duplicate groups:");
  for (const g of duplicates.slice(0, 15)) {
    console.log(`  ×${g.count}  ${g.image}`);
    for (const r of g.routes) {
      console.log(`        ${r.route}   [${r.kind}/${r.imageSource}]`);
    }
  }
  console.log("");
  console.log("Wrote: image-audit.json, image-duplicates.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

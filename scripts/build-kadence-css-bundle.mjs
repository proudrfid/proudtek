#!/usr/bin/env node
/**
 * build-kadence-css-bundle.mjs — combine 29 separate Kadence / WordPress /
 * WooCommerce / TranslatePress / kadence-blocks CSS files into a single
 * concatenated bundle, served via one HTTP request instead of 16+.
 *
 * Why
 * ───
 * The WP snapshot pages emit one `<link rel="stylesheet">` per Kadence
 * theme module + each kadence-blocks block actually used on the page +
 * fonts + plugin CSS. Even with HTTP/2 multiplexing, 16+ parallel requests
 * still cost per-resource fixed overhead (request header + parse) and the
 * slowest request gates first paint. Pre-cold load measurement (May 20,
 * 2026): the 16 Kadence CSS requests on `/` clustered around 280-570ms
 * each, with DomReady at 2988ms. Bundling these into a single ~150KB CSS
 * file (gzipped ~30KB) and rewriting the snapshot link tags should shave
 * 300-500ms off LCP by eliminating 15+ HTTP requests.
 *
 * Strategy
 * ────────
 * 1. Scan every page JSON in src/data/pages/ and every editorial JSON in
 *    src/content/editorial/ for `<link rel="stylesheet" href="/site-assets/...">`
 *    URLs. Collect the union.
 * 2. Sort by source-cascade priority: WP core → WC → TranslatePress →
 *    Kadence theme → kadence-blocks → fonts → other plugins → easy-table-of-contents.
 *    Within each tier, alphabetical for stability.
 * 3. Read each `public/<url>` file and concatenate with a `@source: url`
 *    CSS comment delimiter so unminify / debug is possible.
 * 4. SHA256 the concat result; write to
 *    `public/site-assets/codex-kadence-bundle.<hash>.css`.
 * 5. Emit a manifest JSON to `src/data/.codex-kadence-bundle.json`
 *    containing { bundleUrl, sourceUrls[] }. render-snapshot.ts reads
 *    this at build time and replaces all `<link>` tags accordingly.
 *
 * Idempotency
 * ───────────
 * The hash in the bundle filename means content-addressed caching — if
 * no source CSS changed, the bundle name is the same and CDN caches
 * persist. Re-running this script is safe.
 *
 * Skip path
 * ─────────
 * If `PROUDTEK_SKIP_KADENCE_BUNDLE` env var is set, the script no-ops
 * and prints a notice. Useful for local dev when you'd rather see the
 * raw Kadence link tags for debugging.
 */

import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC = join(ROOT, "public");
const PAGES_DIR = join(ROOT, "src/data/pages");
const EDITORIAL_DIR = join(ROOT, "src/content/editorial");
const MANIFEST_PATH = join(ROOT, "src/data/.codex-kadence-bundle.json");

if (process.env.PROUDTEK_SKIP_KADENCE_BUNDLE) {
  console.log("[kadence-bundle] PROUDTEK_SKIP_KADENCE_BUNDLE set — skipping bundle build.");
  process.exit(0);
}

// ── Priority tiers for the cascade order. Smaller number = earlier in the bundle. ──
function tierFor(url) {
  if (url.includes("/wp-includes/css/dist/block-library/")) return 10;
  if (url.includes("/woocommerce/packages/woocommerce-blocks/")) return 20;
  if (url.includes("/woocommerce/assets/")) return 25;
  if (url.includes("/translatepress-multilingual/")) return 30;
  if (url.includes("/themes/kadence/assets/css/global")) return 40;
  if (url.includes("/themes/kadence/assets/css/header")) return 41;
  if (url.includes("/themes/kadence/assets/css/content")) return 42;
  if (url.includes("/themes/kadence/assets/css/sidebar")) return 43;
  if (url.includes("/themes/kadence/assets/css/woocommerce")) return 44;
  if (url.includes("/themes/kadence/assets/css/footer")) return 45;
  if (url.includes("/themes/kadence/assets/css/kadence-splide")) return 46;
  if (url.includes("/themes/kadence/assets/css/")) return 49;
  if (url.includes("/kadence-blocks/")) return 50;
  if (url.includes("/easy-table-of-contents/")) return 60;
  if (url.includes("/wp-content/fonts/")) return 70;
  return 80;
}

async function collectCssUrlsFromHtml(html) {
  const found = new Set();
  if (!html) return found;
  const regex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
  let m;
  while ((m = regex.exec(html)) !== null) {
    if (m[1].startsWith("/site-assets/")) found.add(m[1]);
  }
  return found;
}

async function walkJsonFiles(dir, accumulator) {
  if (!existsSync(dir)) return;
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkJsonFiles(full, accumulator);
    } else if (entry.name.endsWith(".json")) {
      try {
        const raw = await readFile(full, "utf8");
        const data = JSON.parse(raw);
        const html = (data.headHtml || data.bodyHtml || "");
        const urls = await collectCssUrlsFromHtml(html);
        for (const u of urls) accumulator.add(u);
      } catch (e) {
        // Non-JSON or unreadable — skip.
      }
    }
  }
}

async function main() {
  const allUrls = new Set();
  console.log("[kadence-bundle] Scanning page snapshots for /site-assets/*.css references…");
  await walkJsonFiles(PAGES_DIR, allUrls);
  await walkJsonFiles(EDITORIAL_DIR, allUrls);
  console.log(`[kadence-bundle]   ${allUrls.size} unique CSS URLs found across snapshots.`);

  if (allUrls.size === 0) {
    console.log("[kadence-bundle] Nothing to bundle. Removing stale manifest if any.");
    if (existsSync(MANIFEST_PATH)) await writeFile(MANIFEST_PATH, JSON.stringify({ bundleUrl: null, sourceUrls: [] }, null, 2));
    return;
  }

  // Sort by tier, then alphabetical.
  const ordered = [...allUrls].sort((a, b) => {
    const ta = tierFor(a);
    const tb = tierFor(b);
    if (ta !== tb) return ta - tb;
    return a.localeCompare(b);
  });

  // Read each file from public/ and concat.
  const chunks = [];
  for (const url of ordered) {
    const filePath = join(PUBLIC, url);
    if (!existsSync(filePath)) {
      console.warn(`[kadence-bundle]   ⚠ source CSS missing on disk, skipping: ${url}`);
      continue;
    }
    const content = await readFile(filePath, "utf8");
    chunks.push(`/* @source: ${url} */\n${content.trim()}\n`);
  }

  const bundleContent = chunks.join("\n");
  const hash = createHash("sha256").update(bundleContent).digest("hex").slice(0, 12);
  const bundleUrl = `/site-assets/codex-kadence-bundle.${hash}.css`;
  const bundlePath = join(PUBLIC, bundleUrl);
  await mkdir(dirname(bundlePath), { recursive: true });
  await writeFile(bundlePath, bundleContent);
  console.log(`[kadence-bundle] Wrote bundle: ${bundleUrl} (${bundleContent.length} bytes, ${ordered.length} files combined)`);

  // Emit manifest for render-snapshot.ts to consume.
  await mkdir(dirname(MANIFEST_PATH), { recursive: true });
  await writeFile(MANIFEST_PATH, JSON.stringify({ bundleUrl, sourceUrls: ordered }, null, 2));
  console.log(`[kadence-bundle] Wrote manifest: ${MANIFEST_PATH}`);
}

main().catch((err) => {
  console.error("[kadence-bundle] Build failed:", err);
  process.exit(1);
});

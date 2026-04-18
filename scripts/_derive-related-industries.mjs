#!/usr/bin/env node
/**
 * Auto-derive `relatedIndustries: []` for SKU pages by reverse-scanning the
 * 15 industry editorial JSONs for SKU route references.
 *
 * Strategy:
 *  1. For each industry JSON (excluding _pillar.json), recursively scan all
 *     string fields for /products/<cluster>/<slug>/ paths.
 *  2. Build reverse map  SKU route → Set<industrySlug>.
 *  3. For each SKU JSON, write the discovered industry slugs into
 *     `relatedIndustries`. Preserve any pre-existing manual entries.
 *
 * Run:    node scripts/_derive-related-industries.mjs           (dry run)
 *         node scripts/_derive-related-industries.mjs --write   (apply)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const INDUSTRY_DIR = path.join(ROOT, "src/content/editorial/industries");
const PRODUCT_DIR = path.join(ROOT, "src/content/editorial/products");
const APPLY = process.argv.includes("--write");

// ── Scan industries → build reverse map ──────────────────────────────────
const SKU_PATTERN = /\/products\/(rfid-labels|rfid-tags|rfid-cards|rfid-wristbands|rfid-keyfobs)\/([a-z0-9\-]+)\//g;
const reverseMap = new Map(); // SKU route → Set<industrySlug>

function walkStrings(node, visit) {
  if (typeof node === "string") visit(node);
  else if (Array.isArray(node)) node.forEach((child) => walkStrings(child, visit));
  else if (node && typeof node === "object") Object.values(node).forEach((child) => walkStrings(child, visit));
}

const industryFiles = fs
  .readdirSync(INDUSTRY_DIR)
  .filter((f) => f.endsWith(".json") && !f.startsWith("_"));

for (const file of industryFiles) {
  const slug = file.replace(/\.json$/, "");
  const data = JSON.parse(fs.readFileSync(path.join(INDUSTRY_DIR, file), "utf8"));
  const found = new Set();
  walkStrings(data, (s) => {
    let m;
    SKU_PATTERN.lastIndex = 0;
    while ((m = SKU_PATTERN.exec(s)) !== null) {
      found.add(`/products/${m[1]}/${m[2]}/`);
    }
  });
  for (const route of found) {
    if (!reverseMap.has(route)) reverseMap.set(route, new Set());
    reverseMap.get(route).add(slug);
  }
}

// ── Walk SKU pages → assign relatedIndustries ────────────────────────────
let touched = 0;
let unchanged = 0;
let noMatch = 0;
const samples = [];

const clusters = fs.readdirSync(PRODUCT_DIR).filter((d) => fs.statSync(path.join(PRODUCT_DIR, d)).isDirectory());
for (const cluster of clusters) {
  const dir = path.join(PRODUCT_DIR, cluster);
  const skuFiles = fs.readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "_pillar.json");
  for (const file of skuFiles) {
    const slug = file.replace(/\.json$/, "");
    const route = `/products/${cluster}/${slug}/`;
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw);

    const derived = reverseMap.get(route) ?? new Set();
    const existing = new Set(Array.isArray(data.relatedIndustries) ? data.relatedIndustries : []);
    const merged = new Set([...existing, ...derived]);
    const sorted = [...merged].sort();

    if (sorted.length === 0) {
      noMatch += 1;
      continue;
    }

    const before = JSON.stringify([...existing].sort());
    const after = JSON.stringify(sorted);
    if (before === after) {
      unchanged += 1;
      continue;
    }

    if (samples.length < 8) {
      samples.push({ route, before: [...existing], after: sorted });
    }

    if (APPLY) {
      data.relatedIndustries = sorted;
      // Re-serialize preserving 2-space indent + trailing newline, matching existing files
      const next = JSON.stringify(data, null, 2) + "\n";
      fs.writeFileSync(filePath, next, "utf8");
    }
    touched += 1;
  }
}

console.log(`Industry pages scanned:        ${industryFiles.length}`);
console.log(`Distinct SKU routes referenced: ${reverseMap.size}`);
console.log(`SKU pages updated:             ${touched}${APPLY ? "" : "  (DRY RUN — pass --write to apply)"}`);
console.log(`SKU pages already correct:     ${unchanged}`);
console.log(`SKU pages with no industry mention: ${noMatch}`);
console.log("\nSample changes:");
for (const s of samples) {
  console.log(`  ${s.route}`);
  console.log(`    before: [${s.before.join(", ")}]`);
  console.log(`    after:  [${s.after.join(", ")}]`);
}

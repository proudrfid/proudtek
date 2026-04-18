#!/usr/bin/env node
/**
 * Backfill environment-tag (envFamilies) facet values on SKU JSONs.
 *
 * The catalog index filter (W3-4d) derives env-tag facets from
 * title + summary + route only. Many tag / label SKUs carry
 * environmental claims ("IP68 waterproof", "200 °C autoclave",
 * "anti-metal UHF", "tamper-evident breakaway") deep in spec tables
 * or bullet lists, which the top-level scanner never sees.
 *
 * This script walks src/content/editorial/products/{rfid-tags,
 * rfid-labels,rfid-cards,rfid-keyfobs,rfid-wristbands}/**\/*.json,
 * scans the FULL JSON text for env signals using the same regex
 * vocabulary as FACET_RULES.env in catalog-pages.ts, and appends an
 * explicit `envFamilies` array. The code change in the same commit
 * makes that array take precedence over the regex scan.
 *
 * Idempotent: skips SKUs that already carry a non-empty envFamilies.
 * Dry-run by default. Re-run with --write to apply.
 */

import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

// Same vocabulary + regex as FACET_RULES.env in catalog-pages.ts.
const ENV_RULES = [
  { value: "anti-metal", rx: /\b(anti[\s-]?metal|on[\s-]?metal|metal[\s-]?surface|metal[\s-]?asset|on[\s-]?metal\s?UHF)\b/i },
  { value: "high-temp",  rx: /\b(high[\s-]?temp(?:erature)?|200\s?°?\s?C|180\s?°?\s?C|150\s?°?\s?C|cure[\s-]?press|autoclave|pasteuriz|thermal[\s-]?cycling|heat[\s-]?resistant)\b/i },
  { value: "outdoor",    rx: /\b(IP6[7-9]|IP7\d|outdoor|UV[\s-]?(?:resistant|stable|stabili[sz]ed)|weather[\s-]?proof|waterproof|submersible)\b/i },
  { value: "embed",      rx: /\b(concrete[\s-]?embed|cast[\s-]?in|epoxy[\s-]?embed|insert[\s-]?mold|in[\s-]?mould|embedded\s?in)\b/i },
  { value: "tamper",     rx: /\b(tamper[\s-]?(?:evident|proof|detection)|frangible|destructible|breakaway|tear[\s-]?off|TT\s?card)\b/i },
  { value: "sensor",     rx: /\b(sensor[\s-]?(?:tag|enabled)|temp(?:erature)?[\s-]?logger|moisture\s?sensor|pressure\s?sensor|EM4325)\b/i },
];

const TARGET_DIRS = [
  "src/content/editorial/products/rfid-cards",
  "src/content/editorial/products/rfid-labels",
  "src/content/editorial/products/rfid-tags",
  "src/content/editorial/products/rfid-keyfobs",
  "src/content/editorial/products/rfid-wristbands",
];

function detectEnvFamilies(doc) {
  const text = JSON.stringify(doc);
  const hits = new Set();
  for (const rule of ENV_RULES) {
    if (rule.rx.test(text)) hits.add(rule.value);
  }
  return ENV_RULES.map((r) => r.value).filter((v) => hits.has(v));
}

function writeWithEnvFamilies(filePath, envFamilies) {
  const raw = fs.readFileSync(filePath, "utf8");
  const doc = JSON.parse(raw);
  delete doc.envFamilies;
  doc.envFamilies = envFamilies;
  fs.writeFileSync(filePath, JSON.stringify(doc, null, 2) + "\n");
}

function main() {
  const write = process.argv.includes("--write");
  const stats = {
    scanned: 0,
    skippedAlreadyTagged: 0,
    skippedEmpty: 0,
    tagged: 0,
    byCategory: {},
  };
  const detail = [];

  for (const dir of TARGET_DIRS) {
    const cat = path.basename(dir);
    stats.byCategory[cat] = { tagged: 0, envValueCounts: {} };
    const full = path.join(ROOT, dir);
    const entries = fs
      .readdirSync(full)
      .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
      .sort();
    for (const entry of entries) {
      stats.scanned++;
      const filePath = path.join(full, entry);
      const doc = JSON.parse(fs.readFileSync(filePath, "utf8"));
      if (Array.isArray(doc.envFamilies) && doc.envFamilies.length > 0) {
        stats.skippedAlreadyTagged++;
        continue;
      }
      const envs = detectEnvFamilies(doc);
      if (envs.length === 0) {
        stats.skippedEmpty++;
        detail.push({ cat, slug: entry.replace(".json", ""), envs: [], status: "no-signal" });
        continue;
      }
      stats.tagged++;
      stats.byCategory[cat].tagged++;
      for (const e of envs) {
        stats.byCategory[cat].envValueCounts[e] =
          (stats.byCategory[cat].envValueCounts[e] || 0) + 1;
      }
      detail.push({ cat, slug: entry.replace(".json", ""), envs, status: "tag" });
      if (write) writeWithEnvFamilies(filePath, envs);
    }
  }

  console.log(`\n${write ? "APPLIED" : "DRY-RUN"} envFamilies backfill\n`);
  console.log(`SKUs scanned:            ${stats.scanned}`);
  console.log(`Already tagged (skip):   ${stats.skippedAlreadyTagged}`);
  console.log(`No env signal (skip):    ${stats.skippedEmpty}`);
  console.log(`Newly tagged:            ${stats.tagged}`);
  console.log("\nBy category:");
  for (const [cat, v] of Object.entries(stats.byCategory)) {
    console.log(`  ${cat}: ${v.tagged} tagged`);
    const pairs = Object.entries(v.envValueCounts).sort((a, b) => b[1] - a[1]);
    for (const [env, count] of pairs) {
      console.log(`    ${env}: ${count}`);
    }
  }
  if (!write) console.log("\nRe-run with --write to apply.");
}

main();

#!/usr/bin/env node
/**
 * Backfill chip-family facet tags on keyfob + wristband SKUs.
 *
 * The catalog index filter (W3-4d) derives chip-family facets from
 * title + summary + route only. Keyfobs and wristbands typically list
 * 6-12 supported chips in a compatibility table deep in the JSON body,
 * which the top-level facet scan never sees — so those SKUs were
 * invisible to the chip filter.
 *
 * This script walks src/content/editorial/products/rfid-keyfobs/ and
 * rfid-wristbands/, scans the FULL JSON text (sections + bullets +
 * table cells) for chip-family signals, and appends an explicit
 * `chipFamilies` array to each SKU. The catalog-pages.ts change in the
 * same commit makes that array take precedence over the regex scan.
 *
 * Idempotent: skips SKUs that already carry a chipFamilies field. Safe
 * to re-run.
 *
 * Usage:
 *   node scripts/_backfill-chip-families.mjs             # dry run
 *   node scripts/_backfill-chip-families.mjs --write     # apply
 */

import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

// Same vocabulary + regex as FACET_RULES.chip in catalog-pages.ts, but
// using plain JS regex objects (not TypeScript).
const CHIP_RULES = [
  { value: "ntag21x",           rx: /\bNTAG\s?21[3567]\b/i },
  { value: "ntag424",           rx: /\bNTAG\s?424\b/i },
  { value: "mifare-classic",    rx: /\bMIFARE\s?Classic\b/i },
  { value: "mifare-desfire",    rx: /\bDESFire\b/i },
  { value: "mifare-ultralight", rx: /\b(MIFARE\s?)?Ultralight\b/i },
  { value: "mifare-plus",       rx: /\bMIFARE\s?Plus\b/i },
  { value: "icode",             rx: /\bICODE\b/i },
  { value: "em-tk5",            rx: /\b(EM41[02]0|EM4305|T5577|TK4100|HID\s?Prox)\b/i },
  { value: "impinj-m7",         rx: /\b(Impinj\s?M(?:700|730|750|800)|Monza\s?R6(?:-?P)?|Monza\s?X)\b/i },
  { value: "alien-higgs",       rx: /\bAlien\s?Higgs(?:[\s-]?\d)?\b/i },
  { value: "ucode",             rx: /\bUCODE(?:\s?[89])?\b/i },
];

const TARGET_DIRS = [
  "src/content/editorial/products/rfid-keyfobs",
  "src/content/editorial/products/rfid-wristbands",
  "src/content/editorial/products/rfid-cards",
  "src/content/editorial/products/rfid-labels",
  "src/content/editorial/products/rfid-tags",
];

function detectChipFamilies(doc) {
  // Stringify the whole JSON and regex-scan — catches chip references
  // in compatibility tables, deployment examples, and sector callouts.
  const text = JSON.stringify(doc);
  const hits = new Set();
  for (const rule of CHIP_RULES) {
    if (rule.rx.test(text)) hits.add(rule.value);
  }
  // Return in FACET_RULES order for stable output.
  return CHIP_RULES.map((r) => r.value).filter((v) => hits.has(v));
}

/**
 * Rewrite `doc` to include `chipFamilies` after `relatedIndustries` if
 * present, otherwise at the end. Preserves field order for git-friendly
 * diffs.
 */
function writeWithChipFamilies(filePath, chipFamilies) {
  const raw = fs.readFileSync(filePath, "utf8");
  const doc = JSON.parse(raw);
  // Remove existing, then re-add at the end — simpler than splicing.
  delete doc.chipFamilies;
  doc.chipFamilies = chipFamilies;
  const out = JSON.stringify(doc, null, 2) + "\n";
  fs.writeFileSync(filePath, out);
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
    stats.byCategory[cat] = { tagged: 0, chipValueCounts: {} };
    const full = path.join(ROOT, dir);
    const entries = fs
      .readdirSync(full)
      .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
      .sort();
    for (const entry of entries) {
      stats.scanned++;
      const filePath = path.join(full, entry);
      const doc = JSON.parse(fs.readFileSync(filePath, "utf8"));
      if (Array.isArray(doc.chipFamilies) && doc.chipFamilies.length > 0) {
        stats.skippedAlreadyTagged++;
        continue;
      }
      const chips = detectChipFamilies(doc);
      if (chips.length === 0) {
        stats.skippedEmpty++;
        detail.push({ cat, slug: entry.replace(".json", ""), chips: [], status: "no-signal" });
        continue;
      }
      stats.tagged++;
      stats.byCategory[cat].tagged++;
      for (const c of chips) {
        stats.byCategory[cat].chipValueCounts[c] =
          (stats.byCategory[cat].chipValueCounts[c] || 0) + 1;
      }
      detail.push({ cat, slug: entry.replace(".json", ""), chips, status: "tag" });
      if (write) writeWithChipFamilies(filePath, chips);
    }
  }

  console.log(`\n${write ? "APPLIED" : "DRY-RUN"} chipFamilies backfill\n`);
  console.log(`SKUs scanned:            ${stats.scanned}`);
  console.log(`Already tagged (skip):   ${stats.skippedAlreadyTagged}`);
  console.log(`No chip signal (skip):   ${stats.skippedEmpty}`);
  console.log(`Newly tagged:            ${stats.tagged}`);
  console.log("\nBy category:");
  for (const [cat, v] of Object.entries(stats.byCategory)) {
    console.log(`  ${cat}: ${v.tagged} tagged`);
    const pairs = Object.entries(v.chipValueCounts).sort((a, b) => b[1] - a[1]);
    for (const [chip, count] of pairs) {
      console.log(`    ${chip}: ${count}`);
    }
  }
  console.log("\nPer-SKU:");
  for (const d of detail) {
    const tag = d.status === "tag" ? d.chips.join(",") : "(none)";
    console.log(`  ${d.cat}/${d.slug}: ${tag}`);
  }
  if (!write) console.log("\nRe-run with --write to apply.");
}

main();

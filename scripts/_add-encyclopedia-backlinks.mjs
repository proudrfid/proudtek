#!/usr/bin/env node
/**
 * Add encyclopedia / comparison back-links to SKU resourceCards.
 *
 * Two passes:
 *  1. NTAG424 DNA SKUs → link to /guides/ntag424-dna-sun-cmac-authentication/
 *     Match rule: title || kicker || summary contains "NTAG424" (case-insensitive).
 *
 *  2. UHF chip SKUs (UCODE / Monza / Higgs / RAIN-named) → link to
 *     /compare/ucode8-vs-ucode9-vs-monza-r6-vs-higgs9/
 *     Match rule: any string field on the SKU (title, kicker, summary,
 *     heroPoints, brief.text, sections.bullets) explicitly names UCODE,
 *     Monza R6, Monza R6-P, Higgs-9, M730, M750 or M800. (M700 is a
 *     family alias and intentionally NOT matched here — it links via the
 *     existing M700 page's own resourceCards.)
 *
 * Idempotent: re-runs detect existing back-links by their `href` and skip.
 * Preserves all pre-existing resourceCards and ordering — appends a new
 * "Chip-level technical reference" section at the end of the resourceCards array.
 *
 * Run:    node scripts/_add-encyclopedia-backlinks.mjs           (dry run)
 *         node scripts/_add-encyclopedia-backlinks.mjs --write   (apply)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PRODUCT_DIR = path.join(ROOT, "src/content/editorial/products");
const APPLY = process.argv.includes("--write");

const NTAG424_GUIDE = {
  href: "/guides/ntag424-dna-sun-cmac-authentication/",
  label: "NTAG424 DNA SUN + CMAC authentication encyclopedia",
};
const UHF_COMPARE = {
  href: "/compare/ucode8-vs-ucode9-vs-monza-r6-vs-higgs9/",
  label: "UCODE 8 vs UCODE 9 vs Monza R6 vs Higgs-9 — full UHF chip comparison",
};

const NTAG424_RX = /\bntag\s?424\b/i;
const UHF_CHIP_RX = /\b(ucode\s?[89]|monza\s?r6(?:-p)?|higgs[-\s]?9|m730|m750|m800)\b/i;

function gatherText(data) {
  const parts = [];
  const visit = (node) => {
    if (typeof node === "string") parts.push(node);
    else if (Array.isArray(node)) node.forEach(visit);
    else if (node && typeof node === "object") Object.values(node).forEach(visit);
  };
  visit(data);
  return parts.join(" \n ");
}

function hasLink(cards, href) {
  if (!Array.isArray(cards)) return false;
  return cards.some((c) => Array.isArray(c.links) && c.links.some((l) => l.href === href));
}

function appendBacklinkCard(data, link) {
  if (!Array.isArray(data.resourceCards)) data.resourceCards = [];
  // Find or create a "Chip-level technical reference" section
  const titleMatch = "Chip-level technical reference";
  let card = data.resourceCards.find((c) => c.title === titleMatch);
  if (!card) {
    card = {
      title: titleMatch,
      description: "Deep-dive specifications and chip-family comparisons relevant to this SKU.",
      links: [],
    };
    data.resourceCards.push(card);
  }
  if (!card.links.some((l) => l.href === link.href)) {
    card.links.push({ href: link.href, label: link.label });
  }
}

let ntagTouched = 0;
let uhfTouched = 0;
let unchanged = 0;
const samples = [];

const clusters = fs.readdirSync(PRODUCT_DIR).filter((d) => fs.statSync(path.join(PRODUCT_DIR, d)).isDirectory());
for (const cluster of clusters) {
  const dir = path.join(PRODUCT_DIR, cluster);
  const skuFiles = fs.readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "_pillar.json");
  for (const file of skuFiles) {
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw);
    const route = data.route ?? `/products/${cluster}/${file.replace(/\.json$/, "")}/`;

    // Header-only fields drive the NTAG424 match (avoid noisy bullet mentions)
    const headerText = [data.title, data.kicker, data.summary].filter(Boolean).join(" ");
    const fullText = gatherText(data);

    const isNtag424 = NTAG424_RX.test(headerText);
    const isUhfChip = UHF_CHIP_RX.test(fullText);

    let touchedThis = false;

    if (isNtag424 && !hasLink(data.resourceCards, NTAG424_GUIDE.href)) {
      appendBacklinkCard(data, NTAG424_GUIDE);
      ntagTouched += 1;
      touchedThis = true;
    }
    if (isUhfChip && !hasLink(data.resourceCards, UHF_COMPARE.href)) {
      appendBacklinkCard(data, UHF_COMPARE);
      uhfTouched += 1;
      touchedThis = true;
    }

    if (!touchedThis) {
      unchanged += 1;
      continue;
    }

    if (samples.length < 8) {
      samples.push({ route, ntag: isNtag424, uhf: isUhfChip });
    }

    if (APPLY) {
      const next = JSON.stringify(data, null, 2) + "\n";
      fs.writeFileSync(filePath, next, "utf8");
    }
  }
}

console.log(`NTAG424 back-links added: ${ntagTouched}${APPLY ? "" : "  (DRY RUN — pass --write to apply)"}`);
console.log(`UHF comparison back-links added: ${uhfTouched}${APPLY ? "" : "  (DRY RUN)"}`);
console.log(`SKU pages unchanged: ${unchanged}`);
console.log("\nSample touches:");
for (const s of samples) {
  console.log(`  ${s.route} (ntag424=${s.ntag} uhf=${s.uhf})`);
}

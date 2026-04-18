#!/usr/bin/env node
/**
 * Add industry-pillar back-links to SKU resourceCards.
 *
 * Five independent passes, one per industry pillar shipped in the W3-4
 * industry-backlog batch (/industries/<slug>/). Each SKU may touch
 * multiple industries (e.g. aircraft part tag -> aerospace + defense).
 *
 * Match rules are deliberately narrow to avoid over-tagging. Each regex
 * is tested against the full concatenated JSON text (title, summary,
 * heroPoints, brief.text, sections.bullets, faq.answer). Links are
 * appended to a single "Industry applications" resourceCard on the SKU.
 *
 * Idempotent: re-runs detect existing back-links by href and skip.
 *
 * Run:   node scripts/_add-industry-backlinks.mjs           (dry run)
 *        node scripts/_add-industry-backlinks.mjs --write   (apply)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PRODUCT_DIR = path.join(ROOT, "src/content/editorial/products");
const APPLY = process.argv.includes("--write");

// Each rule: name, regex that must match, link to append.
// Match is deliberately narrow — rather miss a few than over-tag.
const RULES = [
  {
    name: "automotive-tire-oem",
    // "tire"/"tyre"/"tpms" are specific enough; "automotive" a weaker signal.
    rx: /\b(tire|tyre|tpms|automotive cure|tire[\s-]cure|cure[\s-]press)\b/i,
    link: {
      href: "/industries/automotive-tire-oem/",
      label: "Automotive & tire OEM — Tier-1 programs, cure-survivable labels, TPMS pairing",
    },
  },
  {
    name: "aerospace-aviation-mro",
    // "aircraft"/"aviation"/"airframe"/"MRO"/"ATA Spec"/"FAA" are specific.
    rx: /\b(aircraft|aerospace|aviation|airframe|MRO shop|ATA Spec|FAA\s?AC|DO-160|EASA|Part\s?145)\b/i,
    link: {
      href: "/industries/aerospace-aviation-mro/",
      label: "Aerospace & aviation MRO — ATA Spec 2000 Ch. 9-5, FAA AC 20-162A, 30-year part life",
    },
  },
  {
    name: "data-center-it-asset-tracking",
    // Narrow: explicit data-center / IT-asset / server-chassis language.
    // Intentionally NOT matching SOX / PCI DSS alone — those generic
    // compliance acronyms surface on payment/access-control cards too.
    // Require explicit data-center / IT-asset / sanitization context.
    rx: /\b(data[\s-]?center|datacenter|server\s?(?:chassis|rack|room)|IT asset|NIST 800-88|NIST SP 800-88|CMDB|DCIM|e-waste|R2v3)\b/i,
    link: {
      href: "/industries/data-center-it-asset-tracking/",
      label: "Data center & IT asset tracking — SOX / PCI / NIST 800-53 asset audit",
    },
  },
  {
    name: "government-defense-supply-chain",
    // Very specific acronyms — very low false-positive risk.
    rx: /\b(MIL-STD|DoD\b|DFARS|IUID\b|UID compliance|WAWF|Berry Amendment|TAA[- ]compliant|armor(?:y|ies)|weapon tracking|ammo can|FISMA|FOB armory)\b/i,
    link: {
      href: "/industries/government-defense-supply-chain/",
      label: "Government & defense supply chain — MIL-STD-129R / 130N, IUID, weapon accountability",
    },
  },
  {
    name: "cold-chain-food-traceability",
    // "cold chain"/"FSMA"/"EUDR"/"reefer"/"vaccine"/"GDST"/"EPCIS" are all specific.
    // "frozen" alone matches e.g. rfid-frozen-food-label but we also allow "frozen tunnel".
    rx: /\b(cold[\s-]?chain|FSMA[\s-]?204|EUDR\b|reefer|vaccine cold|GDST|EPCIS|Food Traceability List|FTL-listed|food traceability|frozen[\s-]?tunnel|frozen food|ultra[\s-]cold)\b/i,
    link: {
      href: "/industries/cold-chain-food-traceability/",
      label: "Cold chain & food traceability — FSMA 204, EUDR, vaccine cold chain, reefer logging",
    },
  },
];

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

function appendIndustryCard(data, link) {
  if (!Array.isArray(data.resourceCards)) data.resourceCards = [];
  const titleMatch = "Industry applications";
  let card = data.resourceCards.find((c) => c.title === titleMatch);
  if (!card) {
    card = {
      title: titleMatch,
      description: "Industry deep-dives where this SKU is commonly specified.",
      links: [],
    };
    data.resourceCards.push(card);
  }
  if (!card.links.some((l) => l.href === link.href)) {
    card.links.push({ href: link.href, label: link.label });
  }
}

const counts = Object.fromEntries(RULES.map((r) => [r.name, 0]));
let touchedFiles = 0;
let unchanged = 0;
const samples = [];

const clusters = fs.readdirSync(PRODUCT_DIR).filter((d) =>
  fs.statSync(path.join(PRODUCT_DIR, d)).isDirectory()
);
for (const cluster of clusters) {
  const dir = path.join(PRODUCT_DIR, cluster);
  const skuFiles = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json") && f !== "_pillar.json");
  for (const file of skuFiles) {
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw);
    const route = data.route ?? `/products/${cluster}/${file.replace(/\.json$/, "")}/`;

    const fullText = gatherText(data);
    let touchedThis = false;
    const matched = [];

    for (const rule of RULES) {
      if (rule.rx.test(fullText) && !hasLink(data.resourceCards, rule.link.href)) {
        appendIndustryCard(data, rule.link);
        counts[rule.name] += 1;
        touchedThis = true;
        matched.push(rule.name);
      }
    }

    if (!touchedThis) {
      unchanged += 1;
      continue;
    }

    touchedFiles += 1;
    if (samples.length < 12) {
      samples.push({ route, matched });
    }

    if (APPLY) {
      const next = JSON.stringify(data, null, 2) + "\n";
      fs.writeFileSync(filePath, next, "utf8");
    }
  }
}

console.log(`\n${APPLY ? "APPLIED" : "DRY RUN — pass --write to apply"}\n`);
for (const rule of RULES) {
  console.log(`  ${rule.name.padEnd(36)} ${counts[rule.name]}`);
}
console.log(`\nSKU files touched:        ${touchedFiles}`);
console.log(`SKU files unchanged:      ${unchanged}`);
console.log("\nSample touches:");
for (const s of samples) {
  console.log(`  ${s.route}  ->  [${s.matched.join(", ")}]`);
}

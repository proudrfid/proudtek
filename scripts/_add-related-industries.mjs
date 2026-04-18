#!/usr/bin/env node
/**
 * Auto-tag SKUs with `relatedIndustries` based on keyword matches.
 *
 * Touches ONLY SKUs that currently lack a `relatedIndustries` field
 * (or whose array is empty). Existing tags are never overwritten.
 *
 * Strategy:
 *   1. Test each SKU against 20 narrow regex rules (one per industry).
 *   2. Collect matching slugs in priority order (specific industries first).
 *   3. Cap the resulting array at 4 entries.
 *   4. If still 0 matches, fall back to cluster defaults so every SKU
 *      gets at least 2 industries — drives the "Used in these industries"
 *      grid that surfaces on every SKU page.
 *
 * Run:   node scripts/_add-related-industries.mjs           (dry run)
 *        node scripts/_add-related-industries.mjs --write   (apply)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PRODUCT_DIR = path.join(ROOT, "src/content/editorial/products");
const APPLY = process.argv.includes("--write");

const MAX_TAGS = 4;

// Rules ordered by specificity. Highly-specific verticals first so they
// "claim" a slot before broader buckets like industrial/logistics.
const RULES = [
  { slug: "pharmaceutical",
    rx: /\b(pharmaceutic|DSCSA|EU FMD|medication|vial|prescription|infusion|blood bag|hospital pharmacy|drug serializ|GS1 SGTIN.{0,30}drug)\b/i },
  { slug: "healthcare",
    rx: /\b(healthcare|patient ID|patient[\s-]?wristband|hospital|medical device|UDI|surgical|sterilization|operating room|specimen|laboratory specimen|clinic\b)\b/i },
  { slug: "cold-chain-food-traceability",
    rx: /\b(cold[\s-]?chain|FSMA[\s-]?204|EUDR|reefer|vaccine cold|GDST|EPCIS|frozen[\s-]?(?:food|tunnel)|food traceability|ultra[\s-]?cold|FTL[\s-]listed)\b/i },
  { slug: "aerospace-aviation-mro",
    rx: /\b(aircraft|aerospace|aviation|airframe|MRO|ATA Spec|FAA\s?AC|DO-160|EASA|Part\s?145|airline\b|baggage tag)\b/i },
  { slug: "government-defense-supply-chain",
    rx: /\b(MIL-STD|DoD\b|DFARS|IUID\b|WAWF|Berry Amendment|TAA[- ]compliant|armor(?:y|ies)|weapon tracking|ammo can|FISMA|military issue|defense supply)\b/i },
  { slug: "data-center-it-asset-tracking",
    rx: /\b(data[\s-]?center|datacenter|server\s?(?:chassis|rack|room)|IT asset|NIST 800-88|NIST SP 800-88|CMDB|DCIM|e-waste|R2v3)\b/i },
  { slug: "automotive-tire-oem",
    rx: /\b(tire|tyre|tpms|automotive cure|tire[\s-]cure|cure[\s-]press|vulcaniz)\b/i },
  { slug: "libraries",
    rx: /\b(librar(?:y|ies)|book(?:s)?\b|archive|patron|circulation|inventory loop|RFID book|library card|book tag|book label)\b/i },
  { slug: "laundry-services",
    rx: /\b(laundry|linen|uniform tracking|workwear|hospital textile|hotel linen|industrial wash|autoclave|wash cycle|tunnel washer)\b/i },
  { slug: "agriculture",
    rx: /\b(agricultur|livestock|cattle|ear tag|farm\b|crop\b|nursery|plant tag|seedling|orchard|vineyard|greenhouse|tree tag|forestry|aquaculture)\b/i },
  { slug: "fitness",
    // Deliberately NOT matching "cycling" — in SKU copy it almost always
    // means thermal/freeze-thaw/wash cycling, never the sport.
    rx: /\b(fitness|gym\b|membership card|wellness center|locker room|sauna|cycling studio|spin class|treadmill|club member|wellbeing)\b/i },
  { slug: "events-venues",
    rx: /\b(event\b|festival|concert|venue|cashless|VIP|ticket(?:ing)?\b|conference|expo\b|trade show|access control wristband|wristband.{0,15}(?:event|festival|concert))\b/i },
  { slug: "hospitality",
    rx: /\b(hotel|hospitality|room key|guest\b|resort|cruise|casino|amenity|key card|guest experience)\b/i },
  { slug: "education",
    rx: /\b(school|student|education|university|college|campus|classroom|attendance|student ID|child(?:ren)?\b|kid)\b/i },
  { slug: "luxury-brands",
    // Deliberately NOT matching "premium\b" on its own — too much
    // marketing boilerplate uses it non-industry-specifically.
    rx: /\b(luxury|leather goods|handbag|jewelry|jewellery|fine watches?|wine\b|spirits\b|bamboo card|wooden card|wooden business|wooden nfc|engraved|bespoke|olive oil|cannabis tracking|fine art|collectible|premium fashion)\b/i },
  { slug: "brand-protection",
    rx: /\b(brand protect|anti[\s-]counterfeit|tamper|authentication|provenance|grey market|gray market|NTAG424|SUN message|CMAC|product authentic|secure auth|tap[\s-]to[\s-]verify)\b/i },
  { slug: "eu-compliance",
    rx: /\b(EUDR|GS1 EPCIS|Digital Product Passport|DPP\b|ESPR\b|EU GSR2|CE mark|RoHS|REACH|ETSI EN|EU 2023\/|EN 18031)\b/i },
  { slug: "retail-apparel",
    rx: /\b(apparel|garment|clothing|fashion|hangtag|loss prevention|EAS\b|store inventory|shrink|self[\s-]checkout|RFID hangtag|footwear|sportswear|item-level)\b/i },
  { slug: "logistics",
    rx: /\b(logistics|supply chain|warehouse|pallet|shipping|distribution|carton|bulk handling|3PL\b|reverse logistics|returnable transport|RTI\b|cross[\s-]?dock|yard management)\b/i },
  { slug: "industrial",
    rx: /\b(industrial|manufacturing|tool tracking|asset tracking|equipment|machinery|factory|plant\b|production line|preventive maintenance|forklift|harsh environment|on[\s-]metal|anti[\s-]metal|outdoor)\b/i },
];

// If a SKU produces 0 matches, fall back to these per cluster so every
// page renders at least a 2-card "Used in these industries" grid.
const CLUSTER_DEFAULTS = {
  "rfid-cards":      ["hospitality", "education"],
  "rfid-keyfobs":    ["hospitality", "fitness"],
  "rfid-wristbands": ["events-venues", "hospitality"],
  "rfid-labels":     ["industrial",   "logistics"],
  "rfid-tags":       ["industrial",   "logistics"],
};

// Walk only the SKU's own editorial fields. We deliberately skip
// `resourceCards` because those now contain the industry-pillar back-link
// labels from commit 3db154a ("Automotive & tire OEM — …", "Aerospace
// & aviation MRO — …"), which would otherwise cross-match every SKU
// already back-linked to one of the 5 new pillars.
const SCAN_FIELDS = [
  "title", "kicker", "summary", "heroPoints",
  "brief", "sections", "faq", "keywords",
  "productTable", "timeline",
];

function gatherText(data) {
  const parts = [];
  const visit = (node) => {
    if (typeof node === "string") parts.push(node);
    else if (Array.isArray(node)) node.forEach(visit);
    else if (node && typeof node === "object") Object.values(node).forEach(visit);
  };
  for (const field of SCAN_FIELDS) {
    if (data[field] !== undefined) visit(data[field]);
  }
  return parts.join(" \n ");
}

let touched = 0;
let unchanged = 0;
let zeroMatchFallback = 0;
const slugCounts = Object.fromEntries(RULES.map((r) => [r.slug, 0]));
const samples = [];

const clusters = fs
  .readdirSync(PRODUCT_DIR)
  .filter((d) => fs.statSync(path.join(PRODUCT_DIR, d)).isDirectory());

for (const cluster of clusters) {
  const dir = path.join(PRODUCT_DIR, cluster);
  const skuFiles = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json") && f !== "_pillar.json");

  for (const file of skuFiles) {
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(raw);

    if (Array.isArray(data.relatedIndustries) && data.relatedIndustries.length > 0) {
      unchanged += 1;
      continue;
    }

    const fullText = gatherText(data);
    const matched = [];
    for (const rule of RULES) {
      if (rule.rx.test(fullText)) matched.push(rule.slug);
      if (matched.length >= MAX_TAGS) break;
    }

    let usedFallback = false;
    if (matched.length === 0) {
      matched.push(...(CLUSTER_DEFAULTS[cluster] ?? ["industrial", "logistics"]));
      usedFallback = true;
      zeroMatchFallback += 1;
    }

    data.relatedIndustries = matched;
    matched.forEach((s) => { slugCounts[s] = (slugCounts[s] ?? 0) + 1; });
    touched += 1;

    if (samples.length < 16) {
      samples.push({
        route: `/products/${cluster}/${file.replace(/\.json$/, "")}/`,
        tags: matched,
        fallback: usedFallback,
      });
    }

    if (APPLY) {
      const next = JSON.stringify(data, null, 2) + "\n";
      fs.writeFileSync(filePath, next, "utf8");
    }
  }
}

console.log(`\n${APPLY ? "APPLIED" : "DRY RUN — pass --write to apply"}\n`);
console.log(`SKUs tagged this pass:    ${touched}`);
console.log(`SKUs untouched (already): ${unchanged}`);
console.log(`Cluster-default fallback: ${zeroMatchFallback}`);
console.log("\nPer-slug count this pass:");
Object.entries(slugCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([k, v]) => console.log(`  ${k.padEnd(36)} ${v}`));

console.log("\nSample tags applied:");
for (const s of samples) {
  console.log(`  ${s.route}  ->  [${s.tags.join(", ")}]${s.fallback ? "  (fallback)" : ""}`);
}

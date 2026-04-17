#!/usr/bin/env node
/**
 * Inject cross-group links (solutions/compare/guides) into product pages.
 *
 * Classifies each of the 189 product pages into a topic cluster,
 * then adds a "Buying guides & comparisons" resourceCard with 2-4
 * topically relevant links to solutions, compare, and guide pages.
 *
 * Usage:
 *   node scripts/inject-cross-group-links.mjs --dry-run   # preview only
 *   node scripts/inject-cross-group-links.mjs              # apply changes
 */
import fs from "node:fs/promises";
import path from "node:path";
import { glob } from "node:fs";
import { promisify } from "node:util";

const globP = promisify(glob);
const PRODUCTS_DIR = path.join(process.cwd(), "src", "content", "editorial", "products");

const CARD_TITLE = "Buying guides & comparisons";
const CARD_DESC = "Compare options and learn best practices before ordering.";

// ---------------------------------------------------------------------------
// Cluster → target link mapping
// ---------------------------------------------------------------------------

const CLUSTER_TARGETS = {
  HOTEL: [
    { href: "/solutions/hotel-key-cards/", label: "Hotel key card compatibility guide" },
    { href: "/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/", label: "MIFARE Classic vs Plus vs DESFire for hotels" },
    { href: "/guides/hotel-key-card-encoding/", label: "Hotel key card encoding guide" },
    { href: "/compare/rfid-vs-magnetic-hotel-key-cards/", label: "RFID vs magnetic stripe hotel keys" },
  ],
  LAUNDRY: [
    { href: "/solutions/rfid-laundry-management/", label: "RFID laundry management solution" },
    { href: "/compare/pps-vs-silicone-vs-textile-rfid-laundry-tags/", label: "PPS vs silicone vs textile laundry tags" },
    { href: "/compare/uhf-vs-hf-rfid-laundry-tags/", label: "UHF vs HF RFID for laundry" },
  ],
  GOOGLE_REVIEW: [
    { href: "/solutions/google-review-nfc-card/", label: "Google Review NFC card solution" },
    { href: "/compare/google-review-nfc-card-vs-nfc-sticker/", label: "Review card vs NFC sticker" },
    { href: "/guides/google-review-nfc-card-setup/", label: "Google Review card setup guide" },
    { href: "/guides/google-review-card-placement-guide/", label: "Review card placement guide" },
  ],
  NFC_BUSINESS: [
    { href: "/solutions/nfc-business-card/", label: "NFC business card solution" },
    { href: "/compare/metal-vs-wood-vs-pvc-nfc-business-cards/", label: "Metal vs wood vs PVC NFC cards" },
    { href: "/guides/nfc-business-card-iphone-android-compatibility/", label: "NFC card phone compatibility guide" },
  ],
  NFC_AUTH: [
    { href: "/solutions/nfc-brand-authentication/", label: "NFC brand authentication solution" },
    { href: "/solutions/digital-product-passport/", label: "Digital product passport solution" },
    { href: "/guides/eu-digital-product-passport-2027/", label: "EU Digital Product Passport guide" },
  ],
  EVENT: [
    { href: "/solutions/rfid-event-wristbands/", label: "RFID event wristband solution" },
    { href: "/compare/silicone-vs-fabric-vs-woven-rfid-wristbands/", label: "Silicone vs fabric vs woven wristbands" },
    { href: "/compare/rfid-wristband-vs-rfid-card/", label: "RFID wristband vs card comparison" },
  ],
  RACE_TIMING: [
    { href: "/solutions/rfid-race-timing/", label: "RFID race timing solution" },
    { href: "/compare/active-vs-passive-rfid/", label: "Active vs passive RFID comparison" },
    { href: "/guides/rain-rfid-explained/", label: "RAIN RFID explained" },
  ],
  LIBRARY: [
    { href: "/solutions/rfid-library-management/", label: "RFID library management solution" },
    { href: "/compare/rfid-vs-barcode/", label: "RFID vs barcode comparison" },
    { href: "/guides/iso-14443-explained/", label: "ISO 14443 standard explained" },
  ],
  MEDICAL: [
    { href: "/solutions/rfid-patient-tracking/", label: "RFID patient tracking solution" },
    { href: "/compare/rfid-vs-barcode/", label: "RFID vs barcode comparison" },
    { href: "/guides/fda-rfid-pharmaceutical-tracking/", label: "FDA RFID pharmaceutical tracking guide" },
  ],
  LIVESTOCK: [
    { href: "/compare/active-vs-passive-rfid/", label: "Active vs passive RFID comparison" },
    { href: "/compare/125khz-vs-13.56mhz-rfid/", label: "125 kHz vs 13.56 MHz RFID" },
    { href: "/guides/iso-14443-explained/", label: "ISO 14443 standard explained" },
  ],
  VEHICLE: [
    { href: "/solutions/vehicle-rfid-identification/", label: "Vehicle RFID identification solution" },
    { href: "/solutions/rfid-parking-management/", label: "RFID parking management solution" },
    { href: "/guides/rain-rfid-explained/", label: "RAIN RFID explained" },
  ],
  RETAIL_APPAREL: [
    { href: "/solutions/rfid-inventory-tracking/", label: "RFID inventory tracking solution" },
    { href: "/guides/walmart-rfid-tagging-mandate/", label: "Walmart RFID tagging mandate guide" },
    { href: "/guides/item-level-rfid-tagging-mandate/", label: "Item-level RFID tagging mandate" },
  ],
  SUPPLY_CHAIN: [
    { href: "/solutions/rfid-supply-chain-management/", label: "RFID supply chain management" },
    { href: "/solutions/rfid-warehouse-management/", label: "RFID warehouse management solution" },
    { href: "/guides/gs1-epc-encoding-guide/", label: "GS1 EPC encoding guide" },
  ],
  ACCESS_CONTROL: [
    { href: "/solutions/rfid-access-control/", label: "RFID access control solution" },
    { href: "/solutions/rfid-keyfobs-access-control/", label: "RFID keyfob access control guide" },
    { href: "/compare/keyfob-vs-card-vs-wristband-access-control/", label: "Keyfob vs card vs wristband" },
    { href: "/compare/125khz-vs-13.56mhz-rfid/", label: "125 kHz vs 13.56 MHz RFID" },
  ],
  NFC_STICKER: [
    { href: "/compare/ntag213-vs-ntag215-vs-ntag216/", label: "NTAG213 vs NTAG215 vs NTAG216" },
    { href: "/guides/nfc-tag-programming-android-guide/", label: "NFC tag programming guide (Android)" },
    { href: "/guides/nfc-ndef-format-explained/", label: "NFC NDEF format explained" },
  ],
  ASSET_TRACKING_UHF: [
    { href: "/solutions/rfid-asset-tracking-labels/", label: "RFID asset tracking label solution" },
    { href: "/solutions/rfid-tool-tracking/", label: "RFID tool tracking solution" },
    { href: "/compare/hf-vs-uhf-rfid-for-asset-tracking/", label: "HF vs UHF RFID for asset tracking" },
    { href: "/guides/epc-gen2-uhf-rfid/", label: "EPC Gen2 UHF RFID guide" },
  ],
};

// ---------------------------------------------------------------------------
// Classification function
// ---------------------------------------------------------------------------

function classify(route, subcategory, title, kicker) {
  const combined = `${route} ${title} ${kicker}`.toLowerCase();

  // Priority order: most specific first
  if (/laundry|textile-laundry|pps-laundry/.test(combined)) return "LAUNDRY";

  // Wristbands go to EVENT even if title mentions "hotel" or "resort"
  if (subcategory === "rfid-wristbands") return "EVENT";

  if (/hotel|key-card|assa.abloy|vingcard|saflok|salto|onity|hafele|dialock|be-tech|miwa/.test(combined))
    return "HOTEL";

  if (/google.review|review-card|review-stand|table-stand/.test(combined))
    return "GOOGLE_REVIEW";

  if (/business.card|metal.business|wooden.business|bamboo.card|wood.card|wooden.card|transparent.card|clear.nfc|social.media/.test(combined))
    return "NFC_BUSINESS";

  if (/authenticat|tamper.evident|provenance|luxury|wine.bottle|spirits|cosmetic|sneaker|handbag|olive.oil|pharmaceutical.label|warranty.seal|digital.product.passport|battery.passport|ntag424/.test(combined))
    return "NFC_AUTH";

  if (/event.wristband|festival|cashless.payment.wristband|event.ticket|waterpark|resort|cruise/.test(combined))
    return "EVENT";

  if (/race.timing|timing.tag|sports.timing|marathon/.test(combined)) return "RACE_TIMING";
  if (/library|book.spine|icode.slix/.test(combined)) return "LIBRARY";

  if (/hospital|patient|medical|blood.bag|surgical|medication|specimen|cryogenic/.test(combined))
    return "MEDICAL";

  if (/animal.ear|livestock|ear.tag|fish.tag|pet.tag|glass.capsule|pigeon/.test(combined))
    return "LIVESTOCK";

  if (/windshield|parking.card|parking.token|vehicle|tire.tag|tire.label|headlight/.test(combined))
    return "VEHICLE";

  if (/garment.source|apparel.hang|woven.care|hang.tag|jewelry.tag|jewelry.label|retail.price|hard.tag|fashion/.test(combined))
    return "RETAIL_APPAREL";

  if (/shipping.label|pallet|warehouse|supply.chain|frozen.food|food.traceab|keg|drum|returnable.container|ibc|airline.baggage|logistics/.test(combined))
    return "SUPPLY_CHAIN";

  if (subcategory === "rfid-keyfobs" || /access.control|employee.badge|student.id|membership.card|guard.tour|prison|door.lock|entrance/.test(combined))
    return "ACCESS_CONTROL";

  if (/ntag21[356]|nfc.sticker|nfc.shelf|nfc.gaming|nfc.cannabis|nfc.food|nfc.tap|smart.poster|nfc.label/.test(combined))
    return "NFC_STICKER";

  // Default catch-all
  return "ASSET_TRACKING_UHF";
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  // Load all product JSON files
  const files = await globP(path.join(PRODUCTS_DIR, "**/*.json"));
  const products = [];
  for (const file of files) {
    const content = await fs.readFile(file, "utf8");
    products.push({ file, def: JSON.parse(content) });
  }

  console.log(`\n🔗 Cross-Group Link Injector — ${products.length} product pages`);
  console.log(`   Mode: ${dryRun ? "DRY RUN" : "LIVE"}\n`);

  // Classify and track stats
  const clusterCounts = {};
  let totalLinksAdded = 0;
  let filesModified = 0;

  for (const { file, def } of products) {
    const relPath = path.relative(PRODUCTS_DIR, file);
    const subcategory = relPath.split(path.sep)[0]; // rfid-cards, rfid-tags, etc.
    const cluster = classify(def.route, subcategory, def.title, def.kicker ?? "");
    clusterCounts[cluster] = (clusterCounts[cluster] ?? 0) + 1;

    const targets = CLUSTER_TARGETS[cluster];
    if (!targets) {
      console.log(`   ⚠️  No targets for cluster "${cluster}": ${def.route}`);
      continue;
    }

    // Ensure resourceCards exists
    if (!def.resourceCards) def.resourceCards = [];

    // Collect ALL existing hrefs across all resourceCards
    const existingHrefs = new Set();
    for (const card of def.resourceCards) {
      for (const link of card.links ?? []) {
        if (link.href) existingHrefs.add(link.href);
      }
    }

    // Filter targets to only new ones
    const newLinks = targets.filter((t) => !existingHrefs.has(t.href));
    if (newLinks.length === 0) continue;

    // Find or create the cross-group card
    let crossCard = def.resourceCards.find((c) => c.title === CARD_TITLE);
    if (!crossCard) {
      crossCard = { title: CARD_TITLE, description: CARD_DESC, links: [] };
      def.resourceCards.push(crossCard);
    }

    // Append only truly new links
    const cardHrefs = new Set(crossCard.links.map((l) => l.href));
    let addedCount = 0;
    for (const link of newLinks) {
      if (!cardHrefs.has(link.href)) {
        crossCard.links.push(link);
        cardHrefs.add(link.href);
        addedCount++;
      }
    }

    if (addedCount > 0) {
      totalLinksAdded += addedCount;
      filesModified++;

      if (dryRun) {
        console.log(`   [${cluster.padEnd(18)}] ${def.route}  +${addedCount} links`);
      } else {
        await fs.writeFile(file, JSON.stringify(def, null, 2) + "\n", "utf8");
      }
    }
  }

  // Summary
  console.log(`\n📊 Cluster distribution:`);
  const sorted = Object.entries(clusterCounts).sort((a, b) => b[1] - a[1]);
  for (const [cluster, count] of sorted) {
    const bar = "█".repeat(Math.ceil(count / 3));
    console.log(`   ${cluster.padEnd(20)} ${String(count).padStart(3)} pages  ${bar}`);
  }

  console.log(`\n   Files to modify: ${filesModified}`);
  console.log(`   Total links to add: ${totalLinksAdded}`);

  if (dryRun) {
    console.log(`\n   Run without --dry-run to apply.\n`);
  } else {
    console.log(`\n   ✅ Done — ${filesModified} files modified with ${totalLinksAdded} new links.\n`);
  }
}

main().catch(console.error);

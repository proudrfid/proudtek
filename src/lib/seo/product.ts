/**
 * Product page data extraction & content building.
 *
 * Pulls procurement-relevant data from product page bodies (specs,
 * spec sheet metadata) and constructs the supporting content (FAQ,
 * meta description, quote checklist, breadcrumb-related pages,
 * spec-sheet table HTML).
 *
 * No cheerio mutation — these functions read DOM via cheerio and
 * return plain data / pre-rendered HTML strings.
 *
 * Extracted from seo.ts during the P3 split (2026-05-08).
 */
import type { CheerioAPI } from "cheerio";

import type {
  BreadcrumbItem,
  FaqEntry,
  ProcurementField,
  ProductSpec,
} from "../seo";
import type { PageContext } from "./types";

import {
  PRODUCT_BEST_FIT_OVERRIDES,
  PRODUCT_HEADING_OVERRIDES,
  PRODUCT_LEAD_PARAGRAPH_OVERRIDES,
  PRODUCT_SOURCE_LINKS,
} from "../seo-content";

import { PRODUCT_SPEC_SHEETS } from "../product-specs";

import {
  cleanText,
  truncateText,
  firstSentence,
  escapeRegExp,
  escapeXml,
  absoluteUrl,
  findProductSpecValue,
  parseDimension,
} from "./utils";

export function buildProductTitleQualifier(route: string, contentTitle: string): string {
  const haystack = `${route} ${contentTitle}`.toLowerCase();

  if (/reader|scanner|acr122u/.test(haystack)) {
    return "RFID Reader Supplier";
  }

  if (/sticker|label/.test(haystack)) {
    return "RFID Label Manufacturer";
  }

  if (/wristband/.test(haystack)) {
    return "RFID Wristband Manufacturer";
  }

  if (/key ?fob|keyfob|fobs/.test(haystack)) {
    return "RFID Keyfob Manufacturer";
  }

  if (/ring/.test(haystack)) {
    return "NFC Ring Supplier";
  }

  if (/(^|[^a-z])(tag|tags)([^a-z]|$)/.test(haystack) && !/hotel-key/.test(haystack)) {
    return "RFID Tag Manufacturer";
  }

  if (/chip/.test(haystack)) {
    return "RFID Chip Supplier";
  }

  return "RFID Card Manufacturer";
}

export function optimizeProductHeading(value: string, route: string): string {
  const override = PRODUCT_HEADING_OVERRIDES[route];
  if (override) {
    return override;
  }

  const normalized = cleanText(value)
    .replace(/\b125\s*khz\b/gi, "125 kHz")
    .replace(/\b13\.?56\s*mhz\b/gi, "13.56 MHz")
    .replace(/\b915\s*mhz\b/gi, "915 MHz")
    .replace(/\s+/g, " ");

  const tokenMap: Record<string, string> = {
    rfid: "RFID",
    nfc: "NFC",
    uhf: "UHF",
    hf: "HF",
    lf: "LF",
    pvc: "PVC",
    pet: "PET",
    abs: "ABS",
    pps: "PPS",
    id: "ID",
    sdks: "SDKs",
    sdk: "SDK",
    acr122u: "ACR122U",
    mifare: "MIFARE",
    desfire: "DESFire",
    ev2: "EV2",
    felica: "FeliCa",
    legic: "LEGIC",
    hitag: "Hitag",
    em4200: "EM4200",
    em4305: "EM4305",
    t5577: "T5577",
    google: "Google",
  };

  return normalized
    .split(/\s+/)
    .map((token) => {
      const mapped = tokenMap[token.toLowerCase()];
      if (mapped) {
        return mapped;
      }

      if (/^\d+(?:\.\d+)?$/.test(token) || /kHz|MHz/.test(token)) {
        return token;
      }

      return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
    })
    .join(" ");
}

export function buildProductMetaDescription(contentTitle: string, extracted: string, route: string, $body: CheerioAPI): string {
  const specs = extractProductSpecs($body, contentTitle, route);
  const intro = firstSentence(extracted) || extracted;
  const optionSummary = summarizeSpecLine(specs, [
    "Chip",
    "Protocol",
    "Frequency",
    "125 kHz Chip Options",
    "13.56 MHz Chip Options",
    "915 MHz Chip Options",
    "Material",
    "Form Factor",
  ]);
  const applicationSummary =
    summarizeSpecLine(specs, ["Applications", "Read Range", "Customization", "Personalization", "Printing"]) ||
    deriveProductBestFit(contentTitle, specs, route);

  return truncateText([intro, optionSummary, applicationSummary].filter(Boolean).join(" "), 155);
}

export function buildProductProcurementFields(
  contentTitle: string,
  description: string,
  specs: ProductSpec[],
  route: string,
): ProcurementField[] {
  const fields: ProcurementField[] = [];
  const pushField = (label: string, value: string): void => {
    const normalized = truncateText(cleanText(value), 240);

    if (!normalized || fields.some((entry) => entry.label === label)) {
      return;
    }

    fields.push({ label, value: normalized });
  };

  pushField("Best fit", deriveProductBestFit(contentTitle, specs, route));
  pushField(
    "Key options",
    summarizeSpecLine(specs, [
      "Chip",
      "Protocol",
      "Frequency",
      "125 kHz Chip Options",
      "13.56 MHz Chip Options",
      "915 MHz Chip Options",
      "Material",
      "Form Factor",
      "Size",
      "Dimensions",
    ]),
  );
  pushField(
    "Customization",
    summarizeSpecLine(specs, ["Customization", "Personalization", "Printing", "Printing Options", "Encoding", "Finishing Options"]) ||
      "Confirm artwork, encoding, material, chip, and finish requirements before quoting.",
  );
  pushField("Quote checklist", buildProductQuoteChecklist(contentTitle, specs, description, route));

  return fields.slice(0, 4);
}

export function buildProductFaqEntries(
  contentTitle: string,
  description: string,
  specs: ProductSpec[],
  route: string,
): FaqEntry[] {
  const entries: FaqEntry[] = [];
  const pushEntry = (question: string, answer: string): void => {
    const normalizedAnswer = truncateText(cleanText(answer), 360);

    if (!normalizedAnswer || entries.some((entry) => entry.question === question)) {
      return;
    }

    entries.push({ question, answer: normalizedAnswer });
  };

  pushEntry(buildProductUsageQuestion(contentTitle), deriveProductBestFit(contentTitle, specs, route));

  const options = summarizeSpecLine(specs, [
    "Chip",
    "Protocol",
    "Frequency",
    "125 kHz Chip Options",
    "13.56 MHz Chip Options",
    "915 MHz Chip Options",
    "Read Range",
  ]);
  if (options) {
    pushEntry(`Which chip, protocol, or frequency options are available for ${contentTitle}?`, options);
  }

  const materials = summarizeSpecLine(specs, ["Material", "Form Factor", "Size", "Dimensions", "Color", "Finish"]);
  if (materials) {
    pushEntry(`What material or form-factor options are available for ${contentTitle}?`, materials);
  }

  const customization = summarizeSpecLine(specs, ["Customization", "Personalization", "Printing", "Printing Options", "Encoding", "Finishing Options"]);
  if (customization) {
    pushEntry(`How can ${contentTitle} be customized?`, customization);
  }

  pushEntry(`What details should I send to quote ${contentTitle}?`, buildProductQuoteChecklist(contentTitle, specs, description, route));
  return entries.slice(0, 4);
}

export function buildProductUsageQuestion(contentTitle: string): string {
  return /s$/i.test(contentTitle) ? `What are ${contentTitle} commonly used for?` : `What is ${contentTitle} commonly used for?`;
}

export function deriveProductBestFit(contentTitle: string, specs: ProductSpec[], route: string): string {
  const override = PRODUCT_BEST_FIT_OVERRIDES[route];
  if (override) {
    return override;
  }

  const applications = findProductSpecValue(specs, ["Applications"]);
  if (applications) {
    return applications;
  }

  const haystack = `${route} ${contentTitle}`.toLowerCase();

  if (/hotel|key card/.test(haystack)) {
    return "Best for hotel room access, guest credential programs, and hospitality check-in workflows.";
  }

  if (/laundry/.test(haystack)) {
    return "Best for linen, garment, and uniform identification in commercial laundry and textile tracking workflows.";
  }

  if (/event|wristband/.test(haystack)) {
    return "Best for event access control, resort cashless programs, membership, and wearable identification workflows.";
  }

  if (/reader|scanner|acr122u/.test(haystack)) {
    return "Best for desktop or embedded RFID and NFC reading, testing, and software-integration workflows.";
  }

  if (/sticker|label/.test(haystack)) {
    return "Best for asset tagging, packaging, authentication, access control, and smart-label projects.";
  }

  if (/key ?fob|keyfob|fobs/.test(haystack)) {
    return "Best for access control, parking, elevator, and membership credential projects.";
  }

  if (/ring/.test(haystack)) {
    return "Best for NFC tap interactions, wearable access, and smart identity applications.";
  }

  if (/chip/.test(haystack)) {
    return "Best for automotive, credential, or embedded-transponder integration workflows.";
  }

  return `${contentTitle} is suitable for RFID or NFC identification, access, and OEM customization projects.`;
}

export function buildProductQuoteChecklist(contentTitle: string, specs: ProductSpec[], description: string, route: string): string {
  const checklist = [
    summarizeQuoteNeed(contentTitle, route),
    findProductSpecValue(specs, ["Chip", "Protocol", "Frequency", "125 kHz Chip Options", "13.56 MHz Chip Options", "915 MHz Chip Options"]),
    findProductSpecValue(specs, ["Material", "Form Factor", "Size", "Dimensions"]),
    findProductSpecValue(specs, ["Customization", "Personalization", "Printing", "Printing Options", "Encoding"]),
  ]
    .filter(Boolean)
    .slice(0, 4);

  const generic = "Share target chip or protocol, quantity, format or size, print or encoding requirements, and the intended application.";
  return truncateText([...checklist, generic].join(" "), 260);
}

export function summarizeQuoteNeed(contentTitle: string, route: string): string {
  const haystack = `${route} ${contentTitle}`.toLowerCase();

  if (/reader|scanner|acr122u/.test(haystack)) {
    return "Confirm interface, software environment, and reader integration needs.";
  }

  if (/wristband/.test(haystack)) {
    return "Confirm wristband material, wearing environment, and access or event workflow.";
  }

  if (/sticker|label|tag/.test(haystack)) {
    return "Confirm mounting surface, adhesive or on-metal requirements, and expected reading distance.";
  }

  return `Reference ${contentTitle} in your inquiry so the matching product page stays attached to the quote.`;
}

export function summarizeSpecLine(specs: ProductSpec[], names: string[]): string {
  const lines = names
    .map((name) => specs.find((entry) => entry.name.toLowerCase() === name.toLowerCase()))
    .filter((entry): entry is ProductSpec => Boolean(entry))
    .map((entry) => `${entry.name}: ${entry.value}`);

  return truncateText(lines.join(" "), 220);
}

export function renderProductSpecSheet(route: string): string {
  const sheet = PRODUCT_SPEC_SHEETS[route];
  if (!sheet) {
    return "";
  }

  const specsRows = sheet.specs
    .map(
      (spec) =>
        `<tr><th scope="row">${escapeXml(spec.label)}</th><td>${escapeXml(spec.value)}</td></tr>`,
    )
    .join("");

  const applicationsHtml = sheet.applications
    .map((app) => `<li>${escapeXml(app)}</li>`)
    .join("");

  const buyerNotesHtml = sheet.buyerNotes
    .map(
      (note, i) =>
        `<li class="codex-spec-note"><span class="codex-spec-note__num">${i + 1}</span><span>${escapeXml(note)}</span></li>`,
    )
    .join("");

  const compatHtml = sheet.compatibility
    ? `<div class="codex-spec-compat"><strong>Compatibility:</strong> ${escapeXml(sheet.compatibility)}</div>`
    : "";

  // DS-12 #5B (2026-04-27): wrap the spec table in .codex-scroll-region so
  // it inherits the same overflow + focus-ring + max-height treatment as the
  // compare table. ARIA: tabindex=0 + role=region + aria-label so keyboard
  // users can Tab into the region and scroll horizontally on narrow viewports
  // (the table has 6+ data rows that overflow on mobile <360px). The h2 sits
  // outside the scroll region so it's always visible.
  return `<section class="codex-product-spec-sheet" aria-label="Technical specifications">
    <h2 class="codex-spec-table-heading">Technical Specifications</h2>
    <div class="codex-scroll-region codex-spec-table-wrap"
         tabindex="0"
         role="region"
         aria-label="Technical specifications table — scroll horizontally on narrow viewports">
      <table class="codex-spec-table">
        <tbody>${specsRows}</tbody>
      </table>
      ${compatHtml}
    </div>
    <div class="codex-spec-sidebar">
      <div class="codex-spec-applications">
        <h3>Applications</h3>
        <ul>${applicationsHtml}</ul>
      </div>
      <div class="codex-spec-buyer-notes">
        <h3>Buyer Notes</h3>
        <ol>${buyerNotesHtml}</ol>
      </div>
    </div>
  </section>`;
}

export function renderProductSupportBlock(context: PageContext): string {
  if (context.procurementFields.length === 0) {
    return "";
  }

  return `<section class="codex-product-support" aria-label="Product inquiry support"><div class="codex-product-support__grid"><section class="codex-product-support__panel codex-product-procurement"><h2>Before you request a quote</h2><dl>${context.procurementFields
    .map(
      (entry) =>
        `<div class="codex-product-support__row"><dt>${escapeXml(entry.label)}</dt><dd>${escapeXml(entry.value)}</dd></div>`,
    )
    .join("")}</dl></section></div></section>`;
}

export function buildProductSourceLinks(route: string): BreadcrumbItem[] {
  return PRODUCT_SOURCE_LINKS[route]?.slice(0, 6) ?? [];
}

export function buildProductRelatedPages(route: string): BreadcrumbItem[] {
  const entries: BreadcrumbItem[] = [];
  const seen = new Set<string>();

  const pushRoute = (name: string, internalRoute: string): void => {
    const url = absoluteUrl(ROUTE_CANONICAL_OVERRIDES[internalRoute] ?? internalRoute);

    if (seen.has(url)) {
      return;
    }

    seen.add(url);
    entries.push({ name, url });
  };

  if (/\/product\/hotel-key-cards\//.test(route)) {
    pushRoute("Hotel key card solution guide", "/solutions/hotel-key-cards/");
    pushRoute("RFID vs magnetic hotel key cards", "/compare/rfid-vs-magnetic-hotel-key-cards/");
    pushRoute("Hotel key card material selection", "/guides/hotel-key-card-material-selection/");
    pushRoute("Hotel key card encoding guide", "/guides/hotel-key-card-encoding/");
    pushRoute("Hotel key card sample planning", "/guides/hotel-key-card-sample-planning/");
    pushRoute("Hotel key card artwork and printing", "/guides/hotel-key-card-artwork-and-printing-checklist/");
    pushRoute("Saflok-compatible hotel key cards", "/compatibility/saflok-hotel-key-cards/");
    pushRoute("MIWA-compatible hotel key cards", "/compatibility/miwa-hotel-key-cards/");
  }

  if (/\/product\/(mifare-4k-card|mifare-classic-card|mifare-plus-card|mifare-desfire-cards|mifare-desfire-ev2-cards|desfire-tag)\//.test(route)) {
    pushRoute("MIFARE Classic vs Plus vs DESFire", "/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/");
    pushRoute("MIFARE Plus EV2 vs DESFire EV3", "/compare/mifare-plus-ev2-vs-desfire-ev3/");
    pushRoute("Hotel key card solution guide", "/solutions/hotel-key-cards/");
    pushRoute("SALTO-compatible hotel key cards", "/compatibility/salto-hotel-key-cards/");
    pushRoute("VingCard-compatible hotel key cards", "/compatibility/vingcard-hotel-key-cards/");
  }

  if (/\/product\/(rfid-laundry-tags|pps-rfid-laundry-tag|rfid-silicone-laundry-tag)\//.test(route)) {
    pushRoute("RFID laundry tag buying guide", "/solutions/rfid-laundry-tags/");
    pushRoute("PPS vs silicone vs textile laundry tags", "/compare/pps-vs-silicone-vs-textile-rfid-laundry-tags/");
    pushRoute("UHF vs HF laundry tags", "/compare/uhf-vs-hf-rfid-laundry-tags/");
    pushRoute("RFID tag lifespan guide", "/guides/rfid-tag-card-wristband-lifespan/");
  }

  if (/\/product\/google-review-nfc-card\//.test(route)) {
    pushRoute("Google review NFC card guide", "/solutions/google-review-nfc-card/");
    pushRoute("Google review card placement guide", "/guides/google-review-card-placement-guide/");
    pushRoute("Google review cards for multi-location brands", "/guides/google-review-cards-for-multi-location-brands/");
    pushRoute("Google review cards for restaurant franchises", "/guides/google-review-cards-for-restaurant-franchises/");
    pushRoute("Google review cards for dental groups", "/guides/google-review-cards-for-dental-groups/");
    pushRoute("Google review cards for hotel groups", "/guides/google-review-cards-for-hotel-groups/");
    pushRoute("Google review card design and copy", "/guides/google-review-card-design-and-copy/");
    pushRoute("Google review cards for restaurants", "/solutions/google-review-cards-for-restaurants/");
    pushRoute("Google review cards for hotels", "/solutions/google-review-cards-for-hotels/");
    pushRoute("NFC review card vs QR review stand", "/compare/nfc-review-card-vs-qr-review-stand/");
    pushRoute("Google review NFC card vs NFC sticker", "/compare/google-review-nfc-card-vs-nfc-sticker/");
    pushRoute("Google review NFC card setup guide", "/guides/google-review-nfc-card-setup/");
  }

  if (/\/product\/(nfc-business-card|metal-nfc-card|nfc-cards)\//.test(route)) {
    pushRoute("NFC business card buying guide", "/solutions/nfc-business-card/");
    pushRoute("Google review NFC card guide", "/solutions/google-review-nfc-card/");
    pushRoute("Google review card design and copy", "/guides/google-review-card-design-and-copy/");
    pushRoute("NTAG213 vs NTAG215 vs NTAG216", "/compare/ntag213-vs-ntag215-vs-ntag216/");
    pushRoute("NFC review card vs QR review stand", "/compare/nfc-review-card-vs-qr-review-stand/");
    pushRoute("NFC business card iPhone and Android compatibility", "/guides/nfc-business-card-iphone-android-compatibility/");
  }

  if (/\/product\/(wooden-rfid-card|eco_rfid_card)\//.test(route)) {
    pushRoute("Hotel key card solution guide", "/solutions/hotel-key-cards/");
    pushRoute("PVC vs wood vs PLA hotel key cards", "/compare/pvc-vs-wood-vs-pla-hotel-key-cards/");
    pushRoute("Hotel key card material selection", "/guides/hotel-key-card-material-selection/");
    pushRoute("Hotel key card sample planning", "/guides/hotel-key-card-sample-planning/");
    pushRoute("Hotel key card artwork and printing", "/guides/hotel-key-card-artwork-and-printing-checklist/");
    pushRoute("NFC business card buying guide", "/solutions/nfc-business-card/");
    pushRoute("Custom RFID cards inquiry page", "/contact/custom-rfid-cards/");
  }

  if (/\/product\/(nfc-sticker|nfc-stickers)\//.test(route)) {
    pushRoute("Google review cards for restaurants", "/solutions/google-review-cards-for-restaurants/");
    pushRoute("Google review card placement guide", "/guides/google-review-card-placement-guide/");
    pushRoute("Google review cards for restaurant franchises", "/guides/google-review-cards-for-restaurant-franchises/");
    pushRoute("Google review cards for auto dealerships", "/guides/google-review-cards-for-auto-dealerships/");
    pushRoute("Google review card design and copy", "/guides/google-review-card-design-and-copy/");
    pushRoute("Google review NFC card vs NFC sticker", "/compare/google-review-nfc-card-vs-nfc-sticker/");
    pushRoute("Google review NFC card setup guide", "/guides/google-review-nfc-card-setup/");
    pushRoute("NTAG213 vs NTAG215 vs NTAG216", "/compare/ntag213-vs-ntag215-vs-ntag216/");
    pushRoute("On-metal NFC labels vs standard NFC stickers", "/compare/on-metal-nfc-labels-vs-standard-nfc-stickers/");
    pushRoute("Google review NFC card guide", "/solutions/google-review-nfc-card/");
  }

  if (/\/product\/mifare-stickers\//.test(route)) {
    pushRoute("MIFARE Classic vs Plus vs DESFire", "/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/");
    pushRoute("MIFARE Plus EV2 vs DESFire EV3", "/compare/mifare-plus-ev2-vs-desfire-ev3/");
    pushRoute("RFID labels collection", "/products/rfid-labels/");
    pushRoute("RFID labels inquiry page", "/contact/rfid-labels-tags/");
  }

  if (/\/product\/rfid-wristbands-for-hotels\//.test(route)) {
    pushRoute("Hotel key card solution guide", "/solutions/hotel-key-cards/");
    pushRoute("Hotel key cards vs hotel wristbands", "/compare/hotel-key-cards-vs-hotel-wristbands/");
    pushRoute("RFID wristbands for hotels vs events vs resorts", "/compare/rfid-wristbands-hotels-vs-events-vs-resorts/");
  }

  if (/\/product\/(rfid-event-wristband|rfid-wristbands-for-events|rfid-silicone-wristbands|uhf-wristband|coconut-shell-rfid-wristband)\//.test(route)) {
    pushRoute("RFID event access control", "/solutions/rfid-event-access-control/");
    pushRoute("RFID wristbands for hotels vs events vs resorts", "/compare/rfid-wristbands-hotels-vs-events-vs-resorts/");
    pushRoute("Silicone vs fabric vs woven RFID wristbands", "/compare/silicone-vs-fabric-vs-woven-rfid-wristbands/");
    pushRoute("RFID tag lifespan guide", "/guides/rfid-tag-card-wristband-lifespan/");
  }

  if (/\/product\/(rfid-key-fob|proximity-fobs)\//.test(route)) {
    pushRoute("Keyfob vs card vs wristband for access control", "/compare/keyfob-vs-card-vs-wristband-access-control/");
    pushRoute("RFID access-control solutions", "/solutions/hotel-rfid-access-control/");
    pushRoute("RFID keyfob access-control guide", "/solutions/rfid-keyfobs-access-control/");
    pushRoute("Keyfob inquiry page", "/contact/access-control-keyfobs/");
  }

  if (/\/product\/(em4200-card|em4305-card|hitag-2-card)\//.test(route)) {
    pushRoute("Keyfob vs card vs wristband for access control", "/compare/keyfob-vs-card-vs-wristband-access-control/");
    pushRoute("RFID access-control solutions", "/solutions/hotel-rfid-access-control/");
    pushRoute("Custom RFID cards inquiry page", "/contact/custom-rfid-cards/");
  }

  if (/\/product\/(clamshell-card|125-khz-rfid-card|t5577-card|blank-rfid-card|combi-card)\//.test(route)) {
    pushRoute("Keyfob vs card vs wristband for access control", "/compare/keyfob-vs-card-vs-wristband-access-control/");
    pushRoute("RFID access-control solutions", "/solutions/hotel-rfid-access-control/");
    pushRoute("Custom RFID cards inquiry page", "/contact/custom-rfid-cards/");
  }

  if (/\/product\/printed-rfid-cards\//.test(route)) {
    pushRoute("RFID cards collection", "/products/rfid-cards/");
    pushRoute("Hotel key card solution guide", "/solutions/hotel-key-cards/");
    pushRoute("Hotel key card material selection", "/guides/hotel-key-card-material-selection/");
    pushRoute("Hotel key card sample planning", "/guides/hotel-key-card-sample-planning/");
    pushRoute("Hotel key card artwork and printing", "/guides/hotel-key-card-artwork-and-printing-checklist/");
    pushRoute("Custom RFID cards inquiry page", "/contact/custom-rfid-cards/");
  }

  if (/\/product\/(felica-card|legic-card|java-card|dual-interface-card)\//.test(route)) {
    pushRoute("RFID cards collection", "/products/rfid-cards/");
    pushRoute("RFID solutions by application", "/solutions/");
    pushRoute("Custom RFID cards inquiry page", "/contact/custom-rfid-cards/");
  }

  if (/\/product\/nfc-ring\//.test(route)) {
    pushRoute("RFID keyfobs collection", "/products/rfid-keyfobs/");
    pushRoute("RFID solutions by application", "/solutions/");
    pushRoute("NFC branding cards inquiry page", "/contact/nfc-branding-cards/");
  }

  if (/\/product\/(inkjet-pvc-id-card|rfid-paper-card)\//.test(route)) {
    pushRoute("RFID cards collection", "/products/rfid-cards/");
    pushRoute("RFID event access control", "/solutions/rfid-event-access-control/");
    pushRoute("Custom RFID cards inquiry page", "/contact/custom-rfid-cards/");
  }

  if (/\/product\/125khz-rfid-sticker\//.test(route)) {
    pushRoute("RFID labels collection", "/products/rfid-labels/");
    pushRoute("RFID access-control solutions", "/solutions/hotel-rfid-access-control/");
    pushRoute("RFID labels inquiry page", "/contact/rfid-labels-tags/");
  }

  if (/\/product\/(rfid-windshield-tag|rfid-sticker-on-headlight)\//.test(route)) {
    pushRoute("Vehicle RFID identification solution", "/solutions/vehicle-rfid-identification/");
    pushRoute("Vehicle RFID inquiry page", "/contact/vehicle-rfid/");
  }

  if (/\/product\/rfid-tag-with-led-light\//.test(route)) {
    pushRoute("RFID asset tracking labels", "/solutions/rfid-asset-tracking-labels/");
    pushRoute("HF vs UHF RFID for asset tracking", "/compare/hf-vs-uhf-rfid-for-asset-tracking/");
    pushRoute("RFID labels inquiry page", "/contact/rfid-labels-tags/");
  }

  if (/\/product\/car-transponder-chip\//.test(route)) {
    pushRoute("Vehicle RFID identification solution", "/solutions/vehicle-rfid-identification/");
    pushRoute("Vehicle RFID inquiry page", "/contact/vehicle-rfid/");
  }

  if (/\/product\/(acr122u|nfc-reader-writer-with-free-sdks)\//.test(route)) {
    pushRoute("RFID readers and encoding guide", "/solutions/rfid-readers-and-encoding/");
    pushRoute("RFID reader and writer selection", "/guides/rfid-reader-writer-selection/");
    pushRoute("Hotel key card encoding guide", "/guides/hotel-key-card-encoding/");
    pushRoute("NTAG213 vs NTAG215 vs NTAG216", "/compare/ntag213-vs-ntag215-vs-ntag216/");
    pushRoute("RFID reader inquiry page", "/contact/rfid-readers/");
  }

  if (/\/product\/bluetooth-rfid-scanner\//.test(route)) {
    pushRoute("RFID readers and encoding guide", "/solutions/rfid-readers-and-encoding/");
    pushRoute("RFID reader and writer selection", "/guides/rfid-reader-writer-selection/");
    pushRoute("RFID reader inquiry page", "/contact/rfid-readers/");
    pushRoute("RFID solutions by application", "/solutions/");
  }

  return entries.slice(0, 6);
}

export function extractProductSpecs($body: CheerioAPI, contentTitle = "", route = ""): ProductSpec[] {
  const specs: ProductSpec[] = [];
  const seen = new Set<string>();

  const pushSpec = (rawName: string, rawValue: string): void => {
    const normalizedName = normalizeProductSpecName(rawName);
    const normalizedValue = normalizeProductSpecValue(rawValue);

    if (!normalizedName || !normalizedValue) {
      return;
    }

    const key = normalizedName.toLowerCase();
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    specs.push({
      name: normalizedName,
      value: normalizedValue,
    });
  };

  $body(".entry-content table tr, .woocommerce-Tabs-panel table tr").each((_, element) => {
    const cells = $body(element).find("th, td");

    if (cells.length !== 2) {
      return;
    }

    pushSpec($body(cells[0]).text(), $body(cells[1]).text());
  });

  $body(".kt-blocks-info-box, .wp-block-kadence-infobox").each((_, element) => {
    const name = $body(element).find(".kt-blocks-info-box-title").first().text();
    const value = $body(element).find(".kt-blocks-info-box-text").first().text();
    pushSpec(name, value);
  });

  $body(".entry-content p, .woocommerce-product-details__short-description p").each((_, element) => {
    const strong = $body(element).find("strong").first();
    const paragraphText = cleanText($body(element).text());

    if (!paragraphText) {
      return;
    }

    if (strong.length) {
      const label = cleanText(strong.text()).replace(/:$/, "");
      if (!label) {
        return;
      }

      const value = paragraphText.replace(new RegExp(`^${escapeRegExp(label)}\\s*:?\\s*`, "i"), "");
      pushSpec(label, value);
      return;
    }

    const colonSpec = extractColonPatternSpec(paragraphText);
    if (!colonSpec) {
      return;
    }

    pushSpec(colonSpec.name, colonSpec.value);
  });

  inferProductSpecsFromCopy($body, contentTitle, route).forEach((entry) => {
    pushSpec(entry.name, entry.value);
  });

  return specs.slice(0, 12);
}

export function normalizeProductSpecName(value: string): string {
  const cleaned = cleanText(value).replace(/:$/, "");

  if (!cleaned) {
    return "";
  }

  if (/^item$/i.test(cleaned) || /^types?$/i.test(cleaned)) {
    return "Model";
  }

  if (/^contactless$/i.test(cleaned)) {
    return "Operation";
  }

  if (/^with adhesive layer$/i.test(cleaned)) {
    return "Adhesive Backing";
  }

  if (/^thin and flexible$/i.test(cleaned) || /^ultra-thin design$/i.test(cleaned)) {
    return "Form Factor";
  }

  if (/^customizability$/i.test(cleaned)) {
    return "Customization";
  }

  if (/^wide selection$/i.test(cleaned)) {
    return "Model Range";
  }

  if (/^fine mold$/i.test(cleaned)) {
    return "Build Quality";
  }

  if (/^various material$/i.test(cleaned) || /^paper$/i.test(cleaned)) {
    return "Material";
  }

  if (/^high quality personalization$/i.test(cleaned)) {
    return "Personalization";
  }

  if (/^access control$/i.test(cleaned)) {
    return "Applications";
  }

  if (/^lift control$/i.test(cleaned)) {
    return "Applications";
  }

  if (/^product name$/i.test(cleaned) || /^brand name$/i.test(cleaned)) {
    return "";
  }

  if (/^model no\.?$/i.test(cleaned) || /^model number$/i.test(cleaned)) {
    return "Model";
  }

  if (/^protocol$/i.test(cleaned)) {
    return "Protocol";
  }

  if (/^supported standards?$/i.test(cleaned)) {
    return "Protocol";
  }

  if (/^125\s*khz$/i.test(cleaned)) {
    return "125 kHz Chip Options";
  }

  if (/^(?:13(?:\.56)?|13\.56|56)\s*mhz$/i.test(cleaned)) {
    return "13.56 MHz Chip Options";
  }

  if (/^915\s*mhz$/i.test(cleaned)) {
    return "915 MHz Chip Options";
  }

  if (/^frequency(?: range)?$/i.test(cleaned)) {
    return "Frequency";
  }

  if (/^(?:micro)?chip(?: type| available)?$/i.test(cleaned)) {
    return "Chip";
  }

  if (/^material$/i.test(cleaned)) {
    return "Material";
  }

  if (/^(standard size|size)$/i.test(cleaned)) {
    return "Size";
  }

  if (/^dimension(?:s)?$/i.test(cleaned)) {
    return "Dimensions";
  }

  if (/^printing$/i.test(cleaned)) {
    return "Printing";
  }

  if (/^(life ?time|lifespan)$/i.test(cleaned)) {
    return "Lifespan";
  }

  if (/^(usage|application|applications)$/i.test(cleaned)) {
    return "Applications";
  }

  if (/^reading distance$/i.test(cleaned) || /^long reading distance$/i.test(cleaned) || /^tested read range$/i.test(cleaned)) {
    return "Read Range";
  }

  if (/^read range$/i.test(cleaned) || /^superior reading distance$/i.test(cleaned)) {
    return "Read Range";
  }

  if (/^working temperature$/i.test(cleaned)) {
    return "Operating Temperature";
  }

  if (/^storage temperature$/i.test(cleaned)) {
    return "Storage Temperature";
  }

  if (/^write endurance$/i.test(cleaned)) {
    return "Write Cycles";
  }

  if (/^data retention time$/i.test(cleaned)) {
    return "Data Retention";
  }

  if (/^crafts?( available)?$/i.test(cleaned)) {
    return "Finishing Options";
  }

  if (/^package$/i.test(cleaned) || /^packing details$/i.test(cleaned)) {
    return "Packaging";
  }

  if (/^using times$/i.test(cleaned)) {
    return "Reuse Cycle";
  }

  if (/^working mode$/i.test(cleaned)) {
    return "Operating Mode";
  }

  if (/^humidity$/i.test(cleaned)) {
    return "Operating Humidity";
  }

  if (/^plating$/i.test(cleaned)) {
    return "Finish";
  }

  if (/^memory$/i.test(cleaned)) {
    return "Memory";
  }

  if (/^thickness$/i.test(cleaned)) {
    return "Thickness";
  }

  if (/^temperature(?: range)?$/i.test(cleaned)) {
    return "Temperature Range";
  }

  if (/^feature\s+\w+/i.test(cleaned)) {
    return "";
  }

  if (/^(?:em\d+[a-z0-9-]*|ata\d+[a-z0-9-]*|t\d+[a-z0-9-]*|uem)$/i.test(cleaned)) {
    return "";
  }

  if (/^\d+\s*,/i.test(cleaned) || /^\d+\s*[.)-]/i.test(cleaned)) {
    return "";
  }

  if (/(?:card|cards|tag|tags|wristband|reader|keyfob|key fob|ring)/i.test(cleaned) && cleaned.split(/\s+/).length >= 2) {
    return "";
  }

  return cleaned.length > 40 ? "" : cleaned;
}

export function normalizeProductSpecValue(value: string): string {
  const cleaned = truncateText(cleanText(value), 220);

  if (!cleaned) {
    return "";
  }

  if (/^(continue|loading|done)$/i.test(cleaned)) {
    return "";
  }

  return cleaned;
}

export function extractColonPatternSpec(text: string): ProductSpec | null {
  const match = text.match(/^(?:\d+\s*[,).-]\s*)?([^:]{2,40}):\s*(.+)$/);

  if (!match) {
    return null;
  }

  return {
    name: match[1],
    value: match[2],
  };
}

export function inferProductSpecsFromCopy($body: CheerioAPI, contentTitle: string, route: string): ProductSpec[] {
  const textBlocks = $body(".entry-content p, .woocommerce-product-details__short-description p")
    .toArray()
    .map((element) => cleanText($body(element).text()))
    .filter(Boolean);
  const combined = textBlocks.join(" ");
  const specs: ProductSpec[] = [];
  const push = (name: string, value: string): void => {
    const normalizedName = normalizeProductSpecName(name);
    const normalizedValue = normalizeProductSpecValue(value);

    if (!normalizedName || !normalizedValue || specs.some((entry) => entry.name === normalizedName)) {
      return;
    }

    specs.push({
      name: normalizedName,
      value: normalizedValue,
    });
  };

  if (/contact interface/i.test(combined) && /contactless interface/i.test(combined)) {
    push("Interface", "Dual interface card with contact and contactless communication.");
  }

  if (/\bonly one chip\b|\bsingle chip\b/i.test(combined)) {
    push("Chip Architecture", "Single-chip design supporting both contact and contactless functions.");
  }

  if (/customized printing|branding options|printed design|encoding according to client requirement|customizable options/i.test(combined)) {
    const source =
      textBlocks.find((entry) => /customized printing|branding options|printed design|encoding according to client requirement|customizable options/i.test(entry)) ??
      "Custom printing, branding, and encoding are supported.";
    push("Customization", source);
  }

  if (/adhesive layer/i.test(combined)) {
    push("Adhesive Backing", "Self-adhesive layer for direct application to target surfaces.");
  }

  if (/thin and flexible/i.test(combined)) {
    push("Form Factor", "Thin and flexible label format for flat or curved surfaces.");
  }

  if (/coated with\s+paper,\s*pvc,\s*pet/i.test(combined)) {
    push("Material", "Paper, PVC, and PET coating options are available.");
  }

  if (/wave-absorbing layer|on metal surface/i.test(combined)) {
    push("On-Metal Performance", "Available with wave-absorbing layer for stable operation on metal surfaces.");
  }

  const applicationSentences = textBlocks.filter((entry) =>
    /access control|inventory management|asset identification|event management|public traffic|transport|hospitality|security/i.test(entry),
  );
  if (applicationSentences.length > 0) {
    push("Applications", applicationSentences.slice(0, 2).join(" "));
  }

  if (/wristband|card|sticker|label|key fob|keyfob|reader|tag/i.test(contentTitle)) {
    const formFactor = inferFormFactorFromTitle(contentTitle, route);
    if (formFactor) {
      push("Form Factor", formFactor);
    }
  }

  return specs;
}

export function inferFormFactorFromTitle(contentTitle: string, route: string): string {
  const haystack = `${contentTitle} ${route}`.toLowerCase();

  if (haystack.includes("sticker") || haystack.includes("label")) {
    return "Adhesive label format for direct application to objects or packaging.";
  }

  if (haystack.includes("key fob") || haystack.includes("keyfob")) {
    return "Compact keyfob form factor for handheld access credentials.";
  }

  if (haystack.includes("wristband")) {
    return "Wearable wristband form factor for access control or event use.";
  }

  if (haystack.includes("reader")) {
    return "Desktop or embedded reader hardware for RFID or NFC identification workflows.";
  }

  if (haystack.includes("card")) {
    return "Card format compatible with common access-control, ID, or NFC workflows.";
  }

  return "";
}


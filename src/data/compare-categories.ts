/**
 * Compare-page sub-category definitions.
 *
 * Maps each /compare/{category}/ hub page to:
 *   - A display label, icon, and intro paragraph
 *   - The list of compare-page slugs that belong to the category
 *   - SEO meta (title / description) for the category hub
 *   - Pillar copy (3-4 short value props for the hero card)
 *
 * Category hubs are rendered by `src/pages/compare/[category].astro` via a
 * `getStaticPaths` over this array. The /compare/ aggregation hub renders
 * every compare card grouped by these categories, with a shared left rail.
 *
 * Mirrors the architecture of `src/data/guide-clusters.ts`.
 */

export interface CompareCategory {
  /** URL slug (`/compare/{id}/`) */
  id: string;
  /** Display label shown in hero, breadcrumb, sidebar */
  label: string;
  /** Single-emoji visual marker */
  icon: string;
  /** 1–2 sentence category intro (used in hero + meta description) */
  description: string;
  /** SEO page title — usually `${label} — Proud Tek Comparison Library` */
  seoTitle: string;
  /** 3–4 short value-prop pillars shown in the hero */
  pillars: string[];
  /** Compare JSON slugs that belong to this category (order = display order) */
  slugs: string[];
}

export const COMPARE_CATEGORIES: CompareCategory[] = [
  {
    id: "chip-vs-chip",
    label: "Chip vs Chip",
    icon: "💾",
    description:
      "Side-by-side chip-family comparisons for the HF, NFC and UHF silicon that ships in 99% of card, label and tag deployments. Use these to settle the chip-selection question before you spec a sample.",
    seoTitle: "Chip vs Chip Comparisons — MIFARE, NTAG, UCODE, Monza, Higgs, EM4100 vs T5577 | Proud Tek",
    pillars: [
      "MIFARE Classic vs Plus vs DESFire EV3 selection for hotel-lock retrofits",
      "NXP NTAG213 vs NTAG215 vs NTAG216 memory and price ladder",
      "MIFARE Plus EV2 vs DESFire EV3 family-level decision",
      "UHF RAIN comparison — UCODE 8 / 9 vs Impinj Monza R6 vs Alien Higgs-9",
      "EM4100 vs T5577 — read-only vs rewritable 125 kHz LF chip choice",
    ],
    slugs: [
      "mifare-classic-vs-plus-vs-desfire-hotel-locks",
      "mifare-plus-ev2-vs-desfire-ev3",
      "ntag213-vs-ntag215-vs-ntag216",
      "ucode8-vs-ucode9-vs-monza-r6-vs-higgs9",
      "em4100-vs-t5577",
    ],
  },

  {
    id: "reader-vs-reader",
    label: "Reader vs Reader",
    icon: "📡",
    description:
      "Practical reader-vs-reader comparisons for procurement teams shortlisting desktop NFC encoders and fixed UHF readers. Each page covers the deployment trade-offs that don't show up on the datasheet.",
    seoTitle: "RFID Reader Comparisons — Desktop NFC & Fixed UHF | Proud Tek",
    pillars: [
      "Desktop encoders: ACS ACR1252U vs HID Omnikey 5022",
      "Fixed UHF readers: Impinj R700 vs Zebra FX9600",
      "Deployment notes: power-over-ethernet, RSSI tuning, host SDK fit",
      "When to pick which reader for hotels, retail and warehouses",
    ],
    slugs: [
      "acr1252u-vs-omnikey-5022",
      "impinj-r700-vs-zebra-fx9600",
    ],
  },

  {
    id: "form-factor-material",
    label: "Form Factor & Material",
    icon: "🎨",
    description:
      "Form-factor and material comparisons for the cards, wristbands, keyfobs, labels and review-collection devices that actually reach end users. Use these pages to pick the right shell before deciding on the chip inside.",
    seoTitle: "Form Factor & Material Comparisons — Cards, Wristbands, Keyfobs, Labels | Proud Tek",
    pillars: [
      "Hotel keycards vs hotel wristbands — credential program design",
      "Keyfob vs card vs wristband for access control",
      "Card-material decisions: PVC, wood, PLA, metal",
      "Wristband construction: silicone, fabric, woven polyester",
    ],
    slugs: [
      "hotel-key-cards-vs-hotel-wristbands",
      "keyfob-vs-card-vs-wristband-access-control",
      "rfid-wristband-vs-rfid-card",
      "rfid-wristbands-hotels-vs-events-vs-resorts",
      "silicone-vs-fabric-vs-woven-rfid-wristbands",
      "pvc-vs-wood-vs-pla-hotel-key-cards",
      "metal-vs-wood-vs-pvc-nfc-business-cards",
      "pps-vs-silicone-vs-textile-rfid-laundry-tags",
      "on-metal-nfc-labels-vs-standard-nfc-stickers",
      "google-review-nfc-card-vs-nfc-sticker",
      "nfc-review-card-vs-qr-review-stand",
    ],
  },

  {
    id: "frequency-tech",
    label: "Frequency & Tech",
    icon: "📊",
    description:
      "Frequency-band and technology comparisons — LF vs HF vs UHF RFID, RFID vs barcode, RFID vs BLE, NFC vs Bluetooth — written to settle the air-interface question before you start sourcing readers and tags.",
    seoTitle: "Frequency & Technology Comparisons — LF, HF, UHF, BLE, NFC, Barcode | Proud Tek",
    pillars: [
      "125 kHz vs 13.56 MHz vs 860-960 MHz frequency-band selection",
      "Active vs passive RFID — range, cost, refresh cycle",
      "RFID vs barcode vs QR code for tracking and authentication",
      "RFID vs BLE for asset tracking — chokepoint reads vs RTLS",
    ],
    slugs: [
      "uhf-vs-hf-rfid",
      "125khz-vs-13.56mhz-rfid",
      "hf-vs-uhf-rfid-for-asset-tracking",
      "uhf-vs-hf-rfid-laundry-tags",
      "active-vs-passive-rfid",
      "rfid-vs-barcode",
      "rfid-vs-qr-code",
      "rfid-vs-ble-asset-tracking",
      "nfc-vs-bluetooth",
      "rfid-vs-magnetic-hotel-key-cards",
      "rfid-hotel-card-vs-magnetic-stripe",
    ],
  },
];

/**
 * Quick lookup by slug → category (used by /compare/{slug}/ pages to show
 * "Part of: <category>" breadcrumb segment and highlight the active rail link).
 */
export function getCategoryForCompareSlug(slug: string): CompareCategory | undefined {
  return COMPARE_CATEGORIES.find((c) => c.slugs.includes(slug));
}

/** Total compare-page count across all categories (sanity check). */
export function getTotalCompareCount(): number {
  return COMPARE_CATEGORIES.reduce((sum, c) => sum + c.slugs.length, 0);
}

/**
 * Resolve the "active" category for any /compare/* route.
 *  - /compare/                  → undefined (highlight "All comparisons")
 *  - /compare/{category}/       → category id (if id is a known category)
 *  - /compare/{compare-slug}/   → category id of the compare page (via lookup)
 *  - any other route            → undefined
 */
export function getActiveCategoryForCompareRoute(route: string): string | undefined {
  if (route === "/compare/") return undefined;
  const m = route.match(/^\/compare\/([^/]+)\/$/);
  if (!m) return undefined;
  const slug = m[1];
  if (COMPARE_CATEGORIES.some((c) => c.id === slug)) return slug;
  return getCategoryForCompareSlug(slug)?.id;
}

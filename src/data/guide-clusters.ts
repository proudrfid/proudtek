/**
 * Guide cluster definitions.
 *
 * Maps each /guides/{cluster}/ hub page to:
 *   - A display label, icon, and intro paragraph
 *   - The list of guide slugs that belong to the cluster
 *   - SEO meta (title / description) for the cluster hub
 *   - Pillar copy (3-4 short value props for the hero card)
 *
 * Cluster hubs are rendered by `src/pages/guides/[cluster].astro` via a
 * `getStaticPaths` over this array. Adding a new cluster: add an entry
 * here and rebuild — the new URL appears automatically.
 *
 * Sidebar nav on `/guides/` hub also reads from this file (see the
 * cheerio inject in src/lib/seo/enhance-page.ts).
 */

export interface GuideCluster {
  /** URL slug (`/guides/{id}/`) */
  id: string;
  /** Display label shown in hero, breadcrumb, sidebar */
  label: string;
  /** Single-emoji visual marker */
  icon: string;
  /** 1–2 sentence cluster intro (used in hero + meta description) */
  description: string;
  /** SEO page title — usually `${label} — Proud Tek Buyer's Guides` */
  seoTitle: string;
  /** 3–5 short value-prop pillars shown in the hero */
  pillars: string[];
  /** Guide JSON slugs that belong to this cluster (order = display order) */
  slugs: string[];
}

export const GUIDE_CLUSTERS: GuideCluster[] = [
  {
    id: "google-review-cards",
    label: "Google Review Cards",
    icon: "⭐",
    description:
      "Tap-to-review NFC cards that lift Google Business Profile review volume by 5–10× with zero staff training overhead. Vertical playbooks for restaurants, hotels, dental, fitness, salons, auto dealers, and multi-location brands.",
    seoTitle: "Google Review NFC Cards — Design & Placement Guides | Proud Tek",
    pillars: [
      "Design & copy templates that respect Google's review-solicitation policy",
      "Placement maps for table-tents, host stands, checkout counters, and exit gates",
      "Staff prompt scripts in 13 vertical-specific variants",
      "Setup workflow including Google Business Profile link, NFC encoding, and QR fallback",
    ],
    slugs: [
      "google-review-card-design-and-copy",
      "google-review-card-placement-guide",
      "google-review-card-staff-prompt-playbook",
      "google-review-nfc-card-setup",
      "google-review-cards-for-restaurant-franchises",
      "google-review-cards-for-hotel-groups",
      "google-review-cards-for-dental-groups",
      "google-review-cards-for-fitness-franchises",
      "google-review-cards-for-salon-chains",
      "google-review-cards-for-auto-dealerships",
      "google-review-cards-for-multi-location-brands",
    ],
  },

  {
    id: "hotel-keycards",
    label: "Hotel Keycards",
    icon: "🏨",
    description:
      "Procurement-ready guides for hotel RFID keycards: artwork files, encoding workflow, substrate selection, and supplier sample planning. Compatible with Salto, dormakaba, ASSA ABLOY VingCard, and Onity Saflok lock systems.",
    seoTitle: "Hotel Keycard Buyer's Guides — Artwork to Samples | Proud Tek",
    pillars: [
      "ISO 7810 ID-1 artwork files with 3 mm bleed and Pantone-vs-CMYK guidance",
      "Encoding workflow for MIFARE Classic, DESFire EV3, and Ultralight C",
      "Substrate selection across PVC, PET, FSC wood, bamboo, and recycled stock",
      "14-day sample-round cadence with supplier RFQ template",
    ],
    slugs: [
      "hotel-key-card-artwork-and-printing-checklist",
      "hotel-key-card-encoding",
      "hotel-key-card-material-selection",
      "hotel-key-card-sample-planning",
    ],
  },

  {
    id: "chip-encyclopedias",
    label: "Chip Encyclopedias",
    icon: "🔬",
    description:
      "Datasheet-grade technical references for the chip families that ship in 99% of RFID and NFC deployments: NXP MIFARE / NTAG / UCODE / ICODE, Impinj Monza, EM Microelectronic LF chips, and the NTAG 424 DNA SUN+CMAC authentication flow.",
    seoTitle: "RFID & NFC Chip Encyclopedias — Memory Maps & Costs | Proud Tek",
    pillars: [
      "Memory maps with hex addresses verified against NXP / Impinj / EM Micro datasheets",
      "Command-set tables and authentication flow diagrams",
      "Real cost profiles at 1K / 100K / 1M MOQ tiers",
      "Security analysis covering Crypto-1, Fudan FM11RF08 backdoor, and EAL5+ chips",
    ],
    slugs: [
      "ntag21x-family-memory-map-commands",
      "ntag424-dna-sun-cmac-authentication",
      "mifare-classic-1k-4k-chip-encyclopedia",
      "mifare-desfire-ev3-commands-reference",
      "mifare-ultralight-c-chip-encyclopedia",
      "icode-slix-chip-encyclopedia",
      "monza-r6-family-chip-encyclopedia",
      "ucode-8-uhf-chip-encyclopedia",
      "ucode-9-uhf-chip-encyclopedia",
      "em4100-em4305-t5577-lf-chip-encyclopedia",
    ],
  },

  {
    id: "standards-encoding",
    label: "Standards & Encoding",
    icon: "📐",
    description:
      "Authoritative explainers for the air-interface standards and encoding schemes that govern interoperable RFID and NFC: EPC Gen2 v3, ISO/IEC 14443 + 18000-63, RAIN RFID Alliance, NFC NDEF, and the GS1 EPC Tag Data Standard.",
    seoTitle: "RFID Standards & Encoding Guides — EPC Gen2 to NDEF | Proud Tek",
    pillars: [
      "EPC Gen2 v3 (2025) air-interface walkthrough",
      "ISO/IEC 14443 Type A vs Type B + ISO/IEC 18000-63:2021",
      "GS1 EPC Tag Data Standard 2.3 — SGTIN-96, SSCC-96, GRAI-96, GIAI-96",
      "NFC NDEF record types and IEC 63652-2:2026 formal adoption",
    ],
    slugs: [
      "epc-gen2-uhf-rfid",
      "iso-14443-explained",
      "iso-18000-6c-uhf-rfid-standard",
      "rain-rfid-explained",
      "nfc-ndef-format-explained",
      "gs1-epc-encoding-guide",
    ],
  },

  {
    id: "compliance-regulatory",
    label: "Compliance & Regulatory",
    icon: "⚖️",
    description:
      "Compliance officer references for the eight regulations that touch every RFID program: Walmart's mandate, Target T2/T3, FDA DSCSA, EU Digital Product Passport (ESPR 2024/1781), CE / RoHS / REACH, California CCPA, and FSMA 204 food traceability.",
    seoTitle: "RFID Compliance & Regulatory Guides — Walmart to CE | Proud Tek",
    pillars: [
      "Walmart RFID mandate by department + Target T2/T3 vendor requirements",
      "FDA DSCSA Phase 3 (Nov 2025) and EU FMD comparison",
      "EU Digital Product Passport — ESPR 2024/1781 phased rollout 2026–2030",
      "CE marking, RoHS 3, REACH SVHC list, California Civil Code §1798.79",
    ],
    slugs: [
      "walmart-rfid-tagging-mandate",
      "item-level-rfid-tagging-mandate",
      "fda-rfid-pharmaceutical-tracking",
      "rfid-food-safety-traceability",
      "eu-digital-product-passport-2027",
      "rfid-ce-marking-europe",
      "nfc-rohs-reach-compliance",
      "california-rfid-privacy-law",
    ],
  },

  {
    id: "integration-tools",
    label: "Integration & Tools",
    icon: "🛠️",
    description:
      "Engineering integration guides covering UHF RFID reader APIs (LLRP + vendor SDKs), Android / iPhone NFC programming, the Python RFID toolchain, and ERP integrations for SAP S/4HANA EWM, Oracle NetSuite, and Shopify.",
    seoTitle: "RFID Integration & Tooling Guides — SDKs, ERP, NFC | Proud Tek",
    pillars: [
      "LLRP + Impinj Octane / Zebra IoT Connector / Honeywell SDK reference",
      "Android NFC API, iPhone Core NFC, Apple Wallet HCE",
      "Python toolchain — nfcpy, sllurp, pyscard, MFRC522, libnfc",
      "ERP integration — SAP IDoc, NetSuite SuiteScript, Shopify Inventory API",
    ],
    slugs: [
      "uhf-rfid-reader-api-guide",
      "rfid-sap-wms-integration",
      "rfid-oracle-netsuite-integration",
      "rfid-shopify-inventory-integration",
      "nfc-tag-programming-iphone",
      "nfc-tag-programming-android-guide",
      "python-rfid-reader-library",
    ],
  },

  {
    id: "buying-reference",
    label: "Buying & Reference",
    icon: "📚",
    description:
      "General-purpose buyer's references that don't fit one vertical: how to choose RFID readers and writers, real-world card and wristband cost breakdowns, how long RFID tags last in different environments, and iPhone-vs-Android NFC business card compatibility.",
    seoTitle: "RFID Buyer's References — Cost, Readers, Lifespan & NFC | Proud Tek",
    pillars: [
      "Reader / writer selection across handheld, fixed, USB desktop, and BLE",
      "Card and wristband cost breakdowns by chip, material, and volume tier",
      "Tag, card, and wristband lifespan benchmarks by environment",
      "iPhone and Android NFC business card capability matrix (2026)",
    ],
    slugs: [
      "rfid-reader-writer-selection",
      "rfid-card-cost",
      "rfid-wristband-cost",
      "rfid-tag-card-wristband-lifespan",
      "nfc-business-card-iphone-android-compatibility",
    ],
  },
];

/**
 * Quick lookup by slug → cluster (used by /guides/{slug}/ pages to show
 * "Part of: <cluster>" breadcrumb segment).
 */
export function getClusterForGuideSlug(slug: string): GuideCluster | undefined {
  return GUIDE_CLUSTERS.find((c) => c.slugs.includes(slug));
}

/** Total guide count across all clusters (sanity check, expected = 51). */
export function getTotalGuideCount(): number {
  return GUIDE_CLUSTERS.reduce((sum, c) => sum + c.slugs.length, 0);
}

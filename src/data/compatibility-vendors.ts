/**
 * Hotel-lock vendor metadata for /compatibility/ hub cards.
 *
 * Each entry corresponds to one editorial JSON under
 * `src/content/editorial/compatibility/{slug}-hotel-key-cards.json`.
 *
 * The hub at `src/pages/compatibility/index.astro` renders a card grid in
 * the declared order below. Order is "by search volume + procurement
 * relevance" — Saflok and Vingcard first because they have the largest
 * installed bases globally; thinner / regional vendors lower.
 *
 * Each vendor's full editorial JSON (title, summary, hero, sections,
 * FAQ, sources, etc.) is read by the hub at build time via
 * `getCollection("editorial")`. The metadata here is *card-display only* —
 * short vendor name, parent-company badge, one-sentence pitch and
 * market-segment tag — so the cards stay scannable even though the
 * underlying editorial titles are SEO-long.
 *
 * Companion to:
 *   - src/data/guide-clusters.ts (used by /guides/ hub)
 *   - src/data/compare-categories.ts (used by /compare/ hub)
 *   - src/data/blog-topics.ts (used by /blog/ hub)
 */

export interface CompatibilityVendor {
  /** URL-safe slug. Editorial JSON lives at compatibility/{slug}-hotel-key-cards.json. */
  slug: string;
  /** Short brand name for the card heading (e.g. "Saflok", not the SEO title). */
  displayName: string;
  /** Parent company / legal entity, shown as a small tag on the card. */
  parentCompany: string;
  /** One-sentence pitch shown on the card body (max ~140 chars for layout consistency). */
  shortDescription: string;
  /** Market-segment label (e.g. "Premium hotels", "Cruise & resorts", "Budget hotels APAC"). */
  marketSegment: string;
  /** Procurement-grouping bucket; matches one entry in COMPATIBILITY_CATEGORIES. */
  category: "major-brands" | "independent-specialists" | "budget-value";
}

export interface CompatibilityCategory {
  /** URL-safe id used in data-rail-key attribute. */
  id: "major-brands" | "independent-specialists" | "budget-value";
  /** Display label shown in the rail. */
  label: string;
  /** Single-emoji visual marker. */
  icon: string;
  /** One-sentence procurement framing for the category (used in the rail tooltip if extended). */
  description: string;
}

/**
 * Procurement-grouping for the rail. Three buckets cover the seven vendors
 * in a way that maps to how buyers think about hotel-lock vendor selection:
 *   - the major conglomerate-owned brands (the safe-bet defaults)
 *   - the independent specialists with regional or vertical strengths
 *   - the budget / value tier for cost-led deployments
 */
export const COMPATIBILITY_CATEGORIES: CompatibilityCategory[] = [
  {
    id: "major-brands",
    label: "Major hospitality brands",
    icon: "🏢",
    description:
      "Saflok (dormakaba), Vingcard (ASSA ABLOY) and Onity (Honeywell Building Automation) — the three conglomerate-owned brands with the largest global installed bases.",
  },
  {
    id: "independent-specialists",
    label: "Independent & specialist",
    icon: "🛡️",
    description:
      "SALTO Systems (independent, fastest growth in boutiques), MIWA (Japan / APAC specialist with FeliCa support), and Häfele Dialock (single-credential door + furniture + locker ecosystem).",
  },
  {
    id: "budget-value",
    label: "Budget & value",
    icon: "💰",
    description:
      "Be-Tech (Guangdong Bida) — value-tier hotel locks deployed across budget hotels in China, APAC, the Middle East and Africa.",
  },
];

export const COMPATIBILITY_VENDORS: CompatibilityVendor[] = [
  {
    slug: "saflok",
    displayName: "Saflok",
    parentCompany: "dormakaba",
    shortDescription:
      "Quantum IV / RT, Messenger LENS, Quantum Plus and Quantum Pixel. System 6000 → Ambiance migration; CVE-2024-29916 remediation status.",
    marketSegment: "Premium hotels worldwide",
    category: "major-brands",
  },
  {
    slug: "vingcard",
    displayName: "Vingcard",
    parentCompany: "ASSA ABLOY",
    shortDescription:
      "Classic / Essence / Signature / Allure / Flex. Vision → Visionline → Vostio cloud lifecycle. Cruise & marine dominance (~1,000 vessels).",
    marketSegment: "Cruise, resorts & large properties",
    category: "major-brands",
  },
  {
    slug: "onity",
    displayName: "Onity",
    parentCompany: "Honeywell Building Automation",
    shortDescription:
      "HT / ADVANCE / integra / Trillium plus DirectKey BLE. 2012 Brocious DEF CON 20 remediation; Hilton Honors Digital Key precedent.",
    marketSegment: "Mid-market & branded hotels",
    category: "major-brands",
  },
  {
    slug: "salto",
    displayName: "SALTO",
    parentCompany: "SALTO Systems",
    shortDescription:
      "XS4 Original / One / Mini / Locker / AElement Fusion + Neo BLE. SALTO Space → SALTO KS cloud; JustIN Mobile with Apple/Google Wallet.",
    marketSegment: "Boutique & independent hotels",
    category: "independent-specialists",
  },
  {
    slug: "miwa",
    displayName: "MIWA",
    parentCompany: "MIWA Lock Co. (美和ロック)",
    shortDescription:
      "ALV2 / ALV3 / V3HTM + AL5H magstripe hybrid. Unique FeliCa IDm support for Japanese transit IC cards; KEYMO BLE mobile key.",
    marketSegment: "Japan & APAC hospitality",
    category: "independent-specialists",
  },
  {
    slug: "hafele-dialock",
    displayName: "Häfele Dialock",
    parentCompany: "Häfele",
    shortDescription:
      "DT 100 → DT 750 door terminals + WT wall, FT furniture and EFL / LL locker terminals on one credential. Engineered in Nagold, Germany.",
    marketSegment: "European serviced apartments",
    category: "independent-specialists",
  },
  {
    slug: "be-tech",
    displayName: "Be-Tech",
    parentCompany: "Guangdong Bida Security (必达保安)",
    shortDescription:
      "BASE / SHADOW / VISUAL / GUARDIAN series. BIS HOTEL back-end; 11 free MIFARE Classic sectors reserved for All-in-One programmes.",
    marketSegment: "Budget hotels APAC, MEA & Africa",
    category: "budget-value",
  },
];

/** Resolve the active category for any /compatibility/* route. */
export function getActiveCategoryForCompatibilityRoute(route: string): string | undefined {
  if (route === "/compatibility/") return undefined;
  const m = route.match(/^\/compatibility\/(.+?)\/?$/);
  if (!m) return undefined;
  const slug = m[1];
  // Single vendor pages are named {slug}-hotel-key-cards
  for (const v of COMPATIBILITY_VENDORS) {
    if (`${v.slug}-hotel-key-cards` === slug) return v.category;
  }
  return undefined;
}

/** Total count for hub SEO + JSON-LD ItemList. */
export function getTotalCompatibilityVendorCount(): number {
  return COMPATIBILITY_VENDORS.length;
}

/** Quick lookup by slug. */
export function getCompatibilityVendor(slug: string): CompatibilityVendor | undefined {
  return COMPATIBILITY_VENDORS.find((v) => v.slug === slug);
}

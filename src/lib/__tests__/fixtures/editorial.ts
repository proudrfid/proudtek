/**
 * Shared fixtures for editorial-pages snapshot tests.
 *
 * Each export is a minimal, deterministic input. Snapshot tests pair these
 * with editorial-pages.ts renderers and lock the HTML output. If a renderer
 * changes its output, the diff is visible against these fixtures.
 *
 * Naming:
 *   - `minimal*`  — smallest valid input
 *   - `typical*`  — representative production input
 *   - `full*`     — exercises all optional fields
 */

export const minimalLink = {
  href: "/products/rfid-cards/",
  label: "RFID cards",
};

export const linkWithDesc = {
  href: "/products/rfid-tags/",
  label: "RFID tags",
  description: "Industrial RAIN RFID tags for warehouse asset tracking.",
};

// --- Resource cards -------------------------------------------------------

export const minimalResourceCard = {
  title: "RFID products",
  description: "Browse our RFID product catalog.",
  links: [minimalLink],
};

export const fullResourceCard = {
  title: "Hotel keycard solutions",
  description: "MIFARE Classic, DESFire EV3, and custom-printed RFID hotel keycards.",
  links: [minimalLink, linkWithDesc],
};

export const minimalResourceCards = [minimalResourceCard];
export const fullResourceCards = [minimalResourceCard, fullResourceCard];

// --- FAQ ------------------------------------------------------------------

export const minimalFaq = [
  {
    question: "What is RFID?",
    answer: "Radio-frequency identification — wireless tag-and-reader tech.",
  },
];

export const typicalFaq = [
  {
    question: "What is RFID?",
    answer: "Radio-frequency identification — wireless tag-and-reader tech.",
  },
  {
    question: "How far can a UHF RFID tag be read?",
    answer: "Typically 3–10 m for passive UHF tags; up to 30 m for fixed portals.",
  },
  {
    question: "Are Walmart and Target RFID requirements interchangeable?",
    answer: "Mostly yes for chip and inlay; differences are in placement and EDI.",
  },
];

// --- Sections -------------------------------------------------------------

export const minimalSection = {
  title: "Section title",
  intro: "Intro paragraph for the section.",
  bullets: ["First bullet point.", "Second bullet point with [a link](/products/rfid-cards/)."],
};

export const fullSection = {
  title: "Full section",
  intro: "An intro line.",
  paragraphs: ["First paragraph.", "Second paragraph."],
  bullets: ["Bullet a", "Bullet b"],
  table: {
    columns: ["Chip", "Memory"],
    rows: [
      ["NTAG213", "144 B"],
      ["NTAG215", "504 B"],
    ],
  },
  callout: {
    label: "Note",
    text: "Use NTAG215 for 80%+ of consumer NFC use cases.",
    href: "/products/nfc-stickers/",
  },
};

// --- Tables ---------------------------------------------------------------

export const minimalTable = {
  columns: ["Chip", "Memory"],
  rows: [
    ["NTAG213", "144 B"],
    ["NTAG215", "504 B"],
    ["NTAG216", "888 B"],
  ],
};

// --- Citation context (for variants that route text through renderInlineLinks)
//
// Section bodies emit `[^N]` markers that renderInlineLinks rewrites into
// `<sup class="codex-citation">` anchors when a CitationCtx is supplied. We
// lock both paths (with / without citations) for every variant that touches
// `text` fields.

export const noCitations = undefined;

export const typicalCitations = {
  sourcesId: "sources",
  sourcesCount: 3,
};

// --- Section variant fixtures --------------------------------------------
//
// Each variant exercises:
//   - a `minimal*` shape (smallest valid input, no optional fields)
//   - a `typical*` shape (realistic production input, optional fields set)
//   - branch-specific shapes where the renderer forks on input form
//     (e.g. featureGrid icon path-vs-glyph; dataHighlight with-or-without
//     source; comparePanel custom headings).
//
// To keep variant snapshots focused, each fixture is paired with a neutrally
// titled section ("Test variant block") so detectSectionType() never tags
// data-section-type — that classifier is exercised by the page-level
// snapshot tests instead.

/**
 * Wraps a variant's payload in the minimum surrounding section so renderSection
 * can be called as a black box. Title is deliberately neutral.
 */
export function sectionWithVariant<T>(variantKey: string, payload: T): Record<string, unknown> {
  return {
    title: "Test variant block",
    [variantKey]: payload,
  };
}

// --- statBar
export const minimalStatBar = { items: [{ value: "99%", label: "Read rate" }] };
export const typicalStatBar = {
  items: [
    { value: "99%", label: "Read rate" },
    { value: "<50ms", label: "Per-tag latency" },
    { value: "10 m", label: "Read range" },
  ],
};

// --- comparePanel
export const minimalComparePanel = {
  before: ["Manual scan"],
  after: ["UHF portal"],
};
export const typicalComparePanel = {
  beforeHeading: "Without RFID",
  afterHeading: "With RAIN RFID",
  before: ["Manual scan", "Bottlenecked at receiving dock"],
  after: ["UHF portal at the loading bay", "Inventory accuracy [a link](/products/rfid-tags/)"],
};
export const citationsComparePanel = {
  before: ["Manual scan with citation [^1]"],
  after: ["Tagged read [^2] versus baseline"],
};

// --- featureGrid — branches on icon shape (path vs glyph)
export const minimalFeatureGrid = {
  features: [
    { icon: "🎟️", title: "Event credentials", text: "Quick-issue wristbands." },
  ],
};
export const typicalFeatureGrid = {
  features: [
    { icon: "🎟️", title: "Event credentials", text: "Quick-issue wristbands." },
    { icon: "/landing-images/icons/industries/healthcare.svg", title: "Asset tags", text: "RAIN RFID for hospital fleets." },
    { icon: "https://example.com/icon.svg", title: "External icon", text: "Hosted CDN path with [an inline link](/products/rfid-tags/)." },
    { icon: "data:image/svg+xml;base64,PHN2Zy8+", title: "Inline data URL", text: "Data-URL icon source." },
  ],
};

// --- dataHighlight — branches on `source` presence
export const minimalDataHighlight = {
  value: "30 m",
  heading: "Read range",
  text: "Fixed UHF portals reach 30 m line-of-sight.",
};
export const typicalDataHighlight = {
  value: "30 m",
  heading: "Read range",
  text: "Fixed UHF portals reach 30 m line-of-sight, citation [^1].",
  source: "GS1 EPC HF/UHF gen 2 reference.",
};

// --- timeline
export const minimalTimeline = {
  items: [{ label: "Day 1", text: "Kickoff." }],
};
export const typicalTimeline = {
  items: [
    { label: "Week 1", text: "Audit & artwork." },
    { label: "Week 3", text: "Encoding pilot batch [^2]." },
    { label: "Week 6", text: "Production [run](/products/rfid-cards/)." },
  ],
};

// --- testimonial
export const minimalTestimonial = {
  text: "Cut receiving time by 40%.",
  source: "Operations Director, retail DC",
};

// --- checklist
export const minimalChecklist = ["Confirm chip"];
export const typicalChecklist = [
  "Confirm chip family (MIFARE Classic, DESFire, NTAG)",
  "Order [a sample](/contact/) before bulk run",
  "Lock artwork by deadline [^1]",
];

// --- image
export const minimalImage = {
  src: "/landing-images/heroes/test.jpg",
  alt: "Test image alt text.",
};

// --- callout
export const minimalCallout = { label: "Note", text: "Inline callout copy." };
export const typicalCallout = {
  label: "Note",
  text: "Use NTAG215 for 80%+ of NFC use cases — see [our guide](/guides/ntag-chips/) [^3].",
  href: "/products/nfc-stickers/",
};

// --- intro + paragraphs + bullets (basic body slots)
export const introOnlySection = {
  title: "Test variant block",
  intro: "An intro paragraph for the test.",
};
export const paragraphsSection = {
  title: "Test variant block",
  paragraphs: [
    "First production-style paragraph.",
    "Second paragraph with [an inline link](/products/rfid-tags/) and a citation [^1].",
  ],
};
export const bulletsPlainSection = {
  title: "Test variant block",
  bullets: ["First bullet", "Second bullet with [link](/products/rfid-cards/)"],
};
export const bulletsWorkflowSection = {
  // isWorkflowSection() triggers on /workflow|steps|playbook/i in the title
  title: "Implementation steps",
  bullets: ["Discovery", "Encoding pilot", "Production rollout"],
};

// --- Hub data (rail / hub-grid / resources-category fixtures) ----------------
//
// HubEntry shape: { slug, route, label, emoji, iconSlug, summary, heroImage }.
// `iconSlug` must match an entry in src/lib/icons.ts so getIcon(slug) returns
// a real SVG; use known-good slugs ("folder", "tag", "card") in fixtures.

export const minimalHubEntries = [
  {
    slug: "hospitality",
    route: "/industries/hospitality/",
    label: "Hospitality",
    emoji: "🏨",
    iconSlug: "folder",
    summary: "RFID for hotels — room keys, mini-bar, F&B.",
    heroImage: "/landing-images/heroes/hospitality.webp",
  },
];

export const typicalHubEntries = [
  ...minimalHubEntries,
  {
    slug: "events",
    route: "/industries/events/",
    label: "Events & Wristbands",
    emoji: "🎟️",
    iconSlug: "tag",
    summary: 'Event credentials, "wristbands" & cashless flow.',
    heroImage: "/landing-images/heroes/events.webp",
  },
  {
    slug: "retail-apparel",
    route: "/industries/retail-apparel/",
    label: "Retail & Apparel",
    emoji: "👕",
    iconSlug: "card",
    summary: "Item-level inventory and shrink reduction.",
    heroImage: "",
  },
];

export const minimalGroupedHubData = [
  {
    groupLabel: "Buying Guides",
    groupSlug: "guides",
    emoji: "📘",
    iconSlug: "folder",
    items: minimalHubEntries,
  },
];

export const typicalGroupedHubData = [
  {
    groupLabel: "Buying Guides",
    groupSlug: "guides",
    emoji: "📘",
    iconSlug: "folder",
    items: typicalHubEntries,
  },
  {
    groupLabel: "Product Comparisons",
    groupSlug: "compare",
    emoji: "⚖️",
    iconSlug: "tag",
    items: [
      {
        slug: "ntag213-vs-215",
        route: "/compare/ntag213-vs-ntag215/",
        label: "NTAG213 vs NTAG215",
        emoji: "🔍",
        iconSlug: "card",
        summary: "Pick chip by required memory.",
        heroImage: "",
      },
    ],
  },
];

export const resourcesCategoryHubData = [
  {
    groupLabel: "Blog",
    groupSlug: "blog",
    emoji: "📝",
    iconSlug: "folder",
    items: typicalHubEntries.slice(0, 2),
  },
  {
    groupLabel: "Buying Guides",
    groupSlug: "guides",
    emoji: "📘",
    iconSlug: "tag",
    items: typicalHubEntries.slice(0, 1),
  },
  {
    groupLabel: "Comparisons",
    groupSlug: "compare",
    emoji: "⚖️",
    iconSlug: "card",
    items: typicalHubEntries,
  },
  {
    groupLabel: "Compatibility",
    groupSlug: "compatibility",
    emoji: "🔐",
    iconSlug: "folder",
    items: typicalHubEntries.slice(1),
  },
];

// --- Layout variants (split / split-reverse) ---------------------------------
// renderSection emits data-section-layout for non-default layouts.
export const splitLayoutSection = {
  title: "Test variant block",
  layout: "split" as const,
  paragraphs: ["Paragraph for split layout."],
};
export const splitReverseLayoutSection = {
  title: "Test variant block",
  layout: "split-reverse" as const,
  paragraphs: ["Paragraph for split-reverse layout."],
};

// --- Brief ----------------------------------------------------------------

export const minimalBriefFields = [
  {
    label: "Chip",
    text: "MIFARE DESFire EV3 8K",
  },
  {
    label: "Reader compatibility",
    items: ["Salto JustIN", "ASSA ABLOY VingCard Visionline"],
  },
  {
    label: "Reference links",
    links: [minimalLink, linkWithDesc],
  },
];

// --- Editorial definition (top-level, used by canary tests) --------------

export const minimalDefinition = {
  route: "/blog/test-blog-post/",
  group: "blog" as const,
  title: "Test Blog Post",
  kicker: "Test Kicker",
  summary: "A short summary for the test blog post fixture.",
  heroPoints: ["Point 1", "Point 2", "Point 3"],
  imageAlt: "Test image alt text.",
  imageSourceRoutes: ["/products/rfid-cards/"],
  heroImage: "/blog-images/test-blog-post.jpg",
  sections: [minimalSection],
  resourceCards: minimalResourceCards,
  faq: minimalFaq,
  primaryAction: { href: "/contact/", label: "Contact us" },
  secondaryActions: [],
  authorSlug: "editorial-board",
  reviewedBySlug: "peter-zhang",
  reviewedAt: "2026-05-10",
};

export const typicalDefinition = {
  ...minimalDefinition,
  route: "/blog/typical-blog-post/",
  title: "Typical Blog Post — A Realistic Example with Subtitle",
  faq: typicalFaq,
  resourceCards: fullResourceCards,
  sections: [minimalSection, fullSection],
  brief: minimalBriefFields,
  publishedAt: "2026-04-01",
  modifiedAt: "2026-05-10",
};

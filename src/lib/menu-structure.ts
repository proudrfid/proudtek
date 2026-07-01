/**
 * menu-structure.ts — site navigation configuration.
 *
 * Defines the three new top-level dropdowns (Industries, Solutions, Resources),
 * the footer expansion (Markets / About credibility pages), and the Mobile
 * hamburger-menu sync.
 *
 * Consumed by `render-snapshot.ts` at build time: cheerio injects these items
 * into the WP `<ul id="primary-menu">`, `<ul id="mobile-menu">`, and
 * `<ul id="footer-menu">` so every generated page (WP snapshot + editorial +
 * catalog) gets the updated nav automatically.
 */

export interface MenuLink {
  href: string;
  label: string;
}

export interface MenuGroup {
  /** Optional heading shown above the column in the mega-menu. */
  heading?: string;
  /**
   * Optional href to make the heading clickable. When set, the heading
   * renders as `<a>` linking here (desktop mega-menu only — mobile keeps
   * the accordion toggle button). Used for the 6 product category columns
   * so the heading itself is a direct shortcut to the category pillar.
   */
  headingHref?: string;
  links: MenuLink[];
}

export interface MenuDropdown {
  /** Top-level label shown in the bar. */
  label: string;
  /** Top-level href (the dropdown is clickable in mobile and taps to the hub). */
  href: string;
  /** Column groups inside the dropdown. 1 group = simple list; 2+ = mega-menu. */
  groups: MenuGroup[];
}

// ---------------------------------------------------------------------------
// PRODUCTS — 6 product-family columns, mirroring the Industries mega-menu
// ---------------------------------------------------------------------------

// All hrefs below point at the canonical destination (no legacy /product/*
// stubs). Mappings sourced from ROUTE_CANONICAL_OVERRIDES in
// src/lib/route-overrides.ts. Three legacy stubs collapse to the same
// canonical as a sibling menu item — those have been redirected to their
// category pillar instead so the menu shows distinct destinations:
//   • Hotel Wristbands  → /products/rfid-wristbands/   (was /solutions/rfid-event-wristbands/ — collision with Event Wristbands)
//   • MIFARE Stickers   → /products/rfid-labels/       (was /products/rfid-labels/ntag213-nfc-sticker/ — collision with NFC Stickers)
//   • NFC Reader/Writer → /products/rfid-readers/      (was /products/rfid-readers/desktop-nfc-reader-encoder/ — collision with ACR122U USB Reader)
export const PRODUCTS_MENU: MenuDropdown = {
  label: "Products",
  href: "/products/all/",
  groups: [
    {
      heading: "RFID Cards",
      headingHref: "/products/rfid-cards/",
      links: [
        { href: "/products/rfid-cards/", label: "All RFID Cards" },
        { href: "/solutions/hotel-key-cards/", label: "Hotel Key Cards" },
        { href: "/products/rfid-cards/", label: "NFC Cards" },
        { href: "/products/rfid-cards/mifare-classic-1k-card/", label: "MIFARE Cards" },
        { href: "/solutions/google-review-nfc-card/", label: "Google Review Cards" },
        { href: "/products/rfid-cards/rfid-employee-badge/", label: "Employee Badges" },
      ],
    },
    {
      heading: "RFID Keyfobs",
      headingHref: "/products/rfid-keyfobs/",
      links: [
        { href: "/products/rfid-keyfobs/", label: "All Keyfobs" },
        { href: "/products/rfid-keyfobs/", label: "Proximity Fobs" },
        { href: "/products/rfid-keyfobs/", label: "RFID Key Fobs" },
        // NFC Rings and DESFire Fobs renamed to match their actual destinations.
        // Until a dedicated /products/rfid-rings/ page exists the closest
        // canonical destination is the Wristbands pillar (wearable form factor);
        // labelling it "Wearable Tags" is honest about that. "DESFire Fobs"
        // pointed at the DESFire EV3 *card* page, which surprised buyers
        // expecting a fob — renamed to match the page H1.
        { href: "/products/rfid-wristbands/", label: "Wearable Tags" },
        { href: "/products/rfid-cards/mifare-desfire-ev3-card/", label: "DESFire EV3" },
      ],
    },
    {
      heading: "RFID Wristbands",
      headingHref: "/products/rfid-wristbands/",
      links: [
        { href: "/products/rfid-wristbands/", label: "All Wristbands" },
        { href: "/solutions/rfid-event-wristbands/", label: "Event Wristbands" },
        { href: "/products/rfid-wristbands/", label: "Hotel Wristbands" },
        { href: "/products/rfid-wristbands/rfid-adjustable-silicone-wristband/", label: "Silicone Wristbands" },
        { href: "/products/rfid-wristbands/uhf-rfid-wristband/", label: "UHF Wristbands" },
      ],
    },
    {
      heading: "RFID Labels",
      headingHref: "/products/rfid-labels/",
      links: [
        { href: "/products/rfid-labels/", label: "All Labels" },
        { href: "/products/rfid-labels/ntag213-nfc-sticker/", label: "NFC Stickers" },
        { href: "/products/rfid-labels/", label: "MIFARE Stickers" },
        { href: "/products/rfid-labels/long-range-uhf-windshield-sticker/", label: "Windshield Tags" },
        { href: "/products/rfid-labels/", label: "125 kHz Stickers" },
      ],
    },
    {
      heading: "RFID Readers",
      headingHref: "/products/rfid-readers/",
      links: [
        { href: "/products/rfid-readers/", label: "All Readers" },
        { href: "/products/rfid-readers/desktop-nfc-reader-encoder/", label: "ACR122U USB Reader" },
        { href: "/products/rfid-readers/handheld-uhf-rfid-reader/", label: "Bluetooth Scanner" },
        { href: "/products/rfid-readers/", label: "NFC Reader/Writer" },
      ],
    },
    {
      heading: "RFID Tags",
      headingHref: "/products/rfid-tags/",
      links: [
        { href: "/products/rfid-tags/", label: "All Tags" },
        { href: "/solutions/rfid-laundry-tags/", label: "Laundry Tags" },
        { href: "/products/rfid-tags/rfid-animal-ear-tag/", label: "Animal Ear Tags" },
        { href: "/products/rfid-tags/rfid-anti-metal-tag/", label: "Anti-Metal Tags" },
        { href: "/products/rfid-tags/high-temperature-rfid-tag-200c/", label: "High-Temp Tags" },
        { href: "/products/rfid-tags/anti-metal-uhf-it-asset-tag/", label: "IT Asset Tags" },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// INDUSTRIES — 15 vertical landing pages in 3 groups
// ---------------------------------------------------------------------------

export const INDUSTRIES_MENU: MenuDropdown = {
  label: "Industries",
  href: "/industries/",
  groups: [
    {
      heading: "Consumer & Hospitality",
      links: [
        { href: "/industries/hospitality/", label: "Hospitality" },
        { href: "/industries/retail-apparel/", label: "Retail & Apparel" },
        { href: "/industries/fitness/", label: "Fitness Centers" },
        { href: "/industries/events-venues/", label: "Events & Venues" },
        { href: "/industries/libraries/", label: "Libraries" },
        { href: "/industries/luxury-brands/", label: "Luxury Brands" },
      ],
    },
    {
      heading: "Industrial & Operations",
      links: [
        { href: "/industries/industrial/", label: "Manufacturing" },
        { href: "/industries/logistics/", label: "Logistics & Supply Chain" },
        { href: "/industries/agriculture/", label: "Agriculture" },
        { href: "/industries/laundry-services/", label: "Laundry Services" },
        { href: "/industries/education/", label: "Education" },
      ],
    },
    {
      heading: "Regulated & High-Stakes",
      links: [
        { href: "/industries/healthcare/", label: "Healthcare" },
        { href: "/industries/pharmaceutical/", label: "Pharmaceutical" },
        { href: "/industries/brand-protection/", label: "Brand Protection" },
        { href: "/industries/eu-compliance/", label: "EU Compliance (DPP)" },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// SOLUTIONS — 37 application pages in 7 groups (mega-menu)
// ---------------------------------------------------------------------------

export const SOLUTIONS_MENU: MenuDropdown = {
  label: "Solutions",
  href: "/solutions/",
  groups: [
    {
      heading: "Access Control",
      links: [
        { href: "/solutions/rfid-access-control/", label: "RFID Access Control" },
        { href: "/solutions/rfid-keyfobs-access-control/", label: "Keyfob Access" },
        { href: "/solutions/hotel-rfid-access-control/", label: "Hotel Access" },
        { href: "/solutions/rfid-attendance-system/", label: "Attendance System" },
        { href: "/solutions/rfid-parking-management/", label: "Parking Management" },
        { href: "/solutions/vehicle-rfid-identification/", label: "Vehicle ID" },
      ],
    },
    {
      heading: "Inventory & Supply Chain",
      links: [
        { href: "/solutions/rfid-inventory-tracking/", label: "Inventory Tracking" },
        { href: "/solutions/rfid-asset-tracking-labels/", label: "Asset Tracking" },
        { href: "/solutions/rfid-warehouse-management/", label: "Warehouse Management" },
        { href: "/solutions/rfid-tool-tracking/", label: "Tool Tracking" },
        { href: "/solutions/rfid-supply-chain-management/", label: "Supply Chain" },
      ],
    },
    {
      heading: "Hotels & Laundry",
      links: [
        { href: "/solutions/hotel-key-cards/", label: "Hotel Key Cards" },
        { href: "/solutions/rfid-laundry-management/", label: "Laundry Management" },
        { href: "/solutions/rfid-laundry-tags/", label: "Laundry Tags" },
        { href: "/solutions/rfid-laundry-tracking/", label: "Laundry Tracking" },
      ],
    },
    {
      heading: "Events & Race",
      links: [
        { href: "/solutions/rfid-event-wristbands/", label: "Event Wristbands" },
        { href: "/solutions/rfid-event-access-control/", label: "Event Access" },
        { href: "/solutions/rfid-race-timing/", label: "Race Timing" },
      ],
    },
    {
      heading: "NFC Brand & Authentication",
      links: [
        { href: "/solutions/nfc-brand-authentication/", label: "Brand Authentication" },
        { href: "/solutions/nfc-luxury-authentication/", label: "Luxury Authentication" },
        { href: "/solutions/nfc-business-card/", label: "NFC Business Cards" },
        { href: "/solutions/nfc-business-card-programs/", label: "Business Card Programs" },
        { href: "/solutions/digital-product-passport/", label: "Digital Product Passport" },
      ],
    },
    {
      heading: "Google Review Cards",
      links: [
        { href: "/solutions/google-review-nfc-card/", label: "Overview" },
        { href: "/solutions/google-review-cards-for-restaurants/", label: "Restaurants" },
        { href: "/solutions/google-review-cards-for-hotels/", label: "Hotels" },
        { href: "/solutions/google-review-cards-for-retail-stores/", label: "Retail Stores" },
        { href: "/solutions/google-review-cards-for-salons-and-spas/", label: "Salons & Spas" },
        { href: "/solutions/google-review-cards-for-gyms-and-fitness-studios/", label: "Gyms & Fitness" },
        { href: "/solutions/google-review-cards-for-clinics/", label: "Clinics" },
        { href: "/solutions/google-review-cards-for-front-desks/", label: "Front Desks" },
        { href: "/solutions/google-review-cards-for-checkout-counters/", label: "Checkout Counters" },
        { href: "/solutions/google-review-cards-for-pickup-counters/", label: "Pickup Counters" },
        { href: "/solutions/google-review-cards-for-tabletop-prompts/", label: "Tabletop Prompts" },
      ],
    },
    {
      heading: "Specialty",
      links: [
        { href: "/solutions/rfid-patient-tracking/", label: "Patient Tracking" },
        { href: "/solutions/rfid-library-management/", label: "Library Management" },
        { href: "/solutions/rfid-readers-and-encoding/", label: "Readers & Encoding" },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// RESOURCES — hub pages for content discovery
// ---------------------------------------------------------------------------

export const RESOURCES_MENU: MenuDropdown = {
  label: "Resources",
  href: "/resources/",
  groups: [
    {
      heading: "Decide",
      links: [
        { href: "/blog/", label: "Blog — Industry Articles" },
        { href: "/guides/", label: "Buying Guides" },
        { href: "/compare/", label: "Product Comparisons" },
        { href: "/compatibility/", label: "Hotel Lock Compatibility" },
        { href: "/case-studies/", label: "Case Studies — Real Deployments" },
        { href: "/research/", label: "Research & Industry Reports" },
        { href: "/faq/", label: "FAQ" },
      ],
    },
    {
      heading: "Downloads",
      links: [
        { href: "/resources/downloads/", label: "Resource Center — All Downloads" },
        { href: "/downloads/gs1-sgtin-96-encoding-template.xlsx", label: "GS1 SGTIN-96 Template (XLSX)" },
        { href: "/downloads/hotel-key-card-artwork-template.pdf", label: "Hotel Key Card Artwork Template" },
        { href: "/downloads/dscsa-item-level-rfid-brief.pdf", label: "DSCSA Compliance Brief" },
      ],
    },
    {
      heading: "Get started",
      links: [
        { href: "/sample-pack/", label: "Free Sample Pack" },
        { href: "/tools/rfid-tag-cost-estimator/", label: "Cost Estimator Tool" },
        { href: "/rfq/", label: "Request a Quote (5-step wizard)" },
        { href: "/contact/?intent=engineering", label: "Talk to Engineering" },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// ABOUT — trust / credibility pages
// ---------------------------------------------------------------------------

/**
 * Top-level "About" dropdown for the primary nav bar (added 2026-05-12 when
 * the /about/ hub was rewritten for B2B procurement audience and four new
 * trust pages — factory / certifications / leadership / case-studies — were
 * added alongside the original five E-E-A-T transparency pages).
 *
 * Two-column structure:
 *   - "Who we are" — credibility-forward pages procurement buyers visit
 *     during supplier qualification.
 *   - "Editorial standards" — transparency / audit pages procurement
 *     compliance teams look at to verify content integrity.
 */
export const ABOUT_MENU: MenuDropdown = {
  label: "About",
  href: "/about/",
  groups: [
    {
      heading: "Who we are",
      links: [
        { href: "/about/", label: "About Proud Tek" },
        { href: "/about/factory/", label: "Factory & Production" },
        { href: "/about/certifications/", label: "Certifications & Compliance" },
        { href: "/about/leadership/", label: "Leadership & Team" },
        // 2026-06-11: /about/case-studies/ 301s to the standalone hub now.
        { href: "/case-studies/", label: "Case Studies" },
      ],
    },
    {
      heading: "Editorial standards",
      links: [
        { href: "/about/editorial-policy/", label: "Editorial Policy" },
        { href: "/about/methodology/", label: "Testing Methodology" },
        { href: "/about/review-board/", label: "Editorial & Review Board" },
        { href: "/about/disclosures/", label: "Disclosures" },
        { href: "/about/corrections/", label: "Corrections Log" },
        // Legal pages (added 2026-06-11 with the C-9 privacy/terms work) —
        // surfaced here as well as the footer Legal row for supplier-
        // qualification reviewers who navigate via the About dropdown.
        { href: "/about/privacy-policy/", label: "Privacy Policy" },
        { href: "/about/terms-of-use/", label: "Terms of Use" },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// FOOTER EXPANSION — sections appended after the existing product list
// ---------------------------------------------------------------------------

export interface FooterSection {
  heading: string;
  links: MenuLink[];
}

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    heading: "Products",
    links: [
      { href: "/products/rfid-tags/", label: "RFID Tags" },
      { href: "/products/rfid-labels/", label: "RFID Labels" },
      { href: "/products/rfid-readers/", label: "RFID Readers" },
      { href: "/products/rfid-cards/", label: "RFID Cards" },
      { href: "/products/rfid-keyfobs/", label: "RFID Keyfobs" },
      { href: "/products/rfid-wristbands/", label: "RFID Wristbands" },
    ],
  },
  {
    heading: "Industries",
    links: [
      { href: "/industries/hospitality/", label: "Hospitality" },
      { href: "/industries/retail-apparel/", label: "Retail & Apparel" },
      { href: "/industries/healthcare/", label: "Healthcare" },
      { href: "/industries/logistics/", label: "Logistics" },
      { href: "/industries/events-venues/", label: "Events & Venues" },
      { href: "/industries/", label: "All industries →" },
    ],
  },
  {
    heading: "Solutions",
    links: [
      { href: "/solutions/rfid-access-control/", label: "Access Control" },
      { href: "/solutions/rfid-inventory-tracking/", label: "Inventory Tracking" },
      { href: "/solutions/hotel-key-cards/", label: "Hotel Key Cards" },
      { href: "/solutions/rfid-event-wristbands/", label: "Event Wristbands" },
      { href: "/solutions/google-review-nfc-card/", label: "Google Review Cards" },
      { href: "/solutions/", label: "All solutions →" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { href: "/blog/", label: "Blog" },
      { href: "/guides/", label: "Guides" },
      { href: "/compare/", label: "Comparisons" },
      { href: "/compatibility/", label: "Hotel Lock Compatibility" },
      { href: "/case-studies/", label: "Case Studies" },
      { href: "/resources/downloads/", label: "Resource Center" },
      { href: "/sample-pack/", label: "Free Sample Pack" },
      { href: "/tools/rfid-tag-cost-estimator/", label: "Cost Estimator Tool" },
      { href: "/rfq/", label: "Request a Quote" },
      { href: "/faq/", label: "FAQ" },
    ],
  },
  {
    heading: "Markets",
    links: [
      { href: "/markets/usa/", label: "USA" },
      { href: "/markets/uk/", label: "United Kingdom" },
      { href: "/markets/germany/", label: "Germany" },
      { href: "/markets/japan/", label: "Japan" },
      { href: "/markets/india/", label: "India" },
      { href: "/markets/dubai-uae/", label: "UAE & Dubai" },
      { href: "/markets/australia/", label: "Australia" },
      { href: "/markets/brazil/", label: "Brazil" },
      { href: "/markets/africa/", label: "Africa" },
      { href: "/markets/south-africa/", label: "South Africa" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about/", label: "About Proud Tek" },
      { href: "/about/factory/", label: "Factory & Production" },
      { href: "/about/certifications/", label: "Certifications & Compliance" },
      { href: "/about/leadership/", label: "Leadership & Team" },
      { href: "/about/case-studies/", label: "Case Studies" },
      { href: "/about/editorial-policy/", label: "Editorial Policy" },
      { href: "/about/methodology/", label: "Testing Methodology" },
      { href: "/about/review-board/", label: "Editorial & Review Board" },
      { href: "/about/disclosures/", label: "Disclosures" },
      { href: "/about/corrections/", label: "Corrections Log" },
      { href: "/contact/", label: "Contact" },
    ],
  },
];

// ---------------------------------------------------------------------------
// The three top-level dropdowns, in insertion order (after the Products dropdown).
// ---------------------------------------------------------------------------

export const PRIMARY_MENU_DROPDOWNS: MenuDropdown[] = [
  PRODUCTS_MENU,
  INDUSTRIES_MENU,
  SOLUTIONS_MENU,
  RESOURCES_MENU,
  ABOUT_MENU,
];

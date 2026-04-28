import { load } from "cheerio";
import { getCollection } from "astro:content";

import type { SiteData, SnapshotPage } from "./site-data";
import { loadPageFromDisk } from "./site-data";
import { INDUSTRY_CATEGORIES } from "./catalog-pages";
import { getIcon } from "./icons";

export type EditorialGroup = "solutions" | "compare" | "contact" | "compatibility" | "guides" | "blog" | "products" | "resources";

interface EditorialLink {
  href: string;
  label: string;
  description?: string;
}

interface EditorialTable {
  columns: string[];
  rows: string[][];
}

interface EditorialSection {
  title: string;
  intro?: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: EditorialTable;
  image?: { src: string; alt: string };
  callout?: { label: string; text: string; href?: string };
}

interface EditorialBriefField {
  label: string;
  text?: string;
  items?: string[];
  links?: EditorialLink[];
}

interface EditorialResourceCard {
  title: string;
  description: string;
  links: EditorialLink[];
}

interface EditorialFaq {
  question: string;
  answer: string;
}

export interface EditorialDefinition {
  route: string;
  group: EditorialGroup;
  title: string;
  kicker: string;
  summary: string;
  heroPoints: string[];
  imageAlt: string;
  imageSourceRoutes: string[];
  heroImage?: string;
  brief?: EditorialBriefField[];
  sections: EditorialSection[];
  resourceCards: EditorialResourceCard[];
  faq: EditorialFaq[];
  primaryAction: EditorialLink;
  secondaryActions: EditorialLink[];
  /** Optional ISO-8601 content freshness dates; injected into bodyHtml as <time.entry-date.published> and <time.updated> so resolveArticleMeta picks them up for JSON-LD. */
  publishedAt?: string;
  modifiedAt?: string;
  /** Optional keyword phrases for Article/Product JSON-LD; preferred over tokenized title. */
  keywords?: string[];
  /** Authority / EEAT signals — see src/content.config.ts for field contract. */
  authorSlug?: string;
  author?: string;
  reviewedBySlug?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  sources?: Array<{
    label: string;
    url: string;
    publisher?: string;
    publishedAt?: string;
    accessedAt?: string;
    note?: string;
  }>;
  /** Industry slugs where this SKU is deployed (e.g. ["retail-apparel", "hospitality"]). */
  relatedIndustries?: string[];
}

const EDITORIAL_LINK_REWRITES: Record<string, EditorialLink> = {
  "/2024/12/25/rfid-hotel-key-card/": {
    href: "/solutions/hotel-key-cards/",
    label: "Hotel key card compatibility guide",
  },
  "/2024/12/22/rfid-laundry-tags/": {
    href: "/solutions/rfid-laundry-tags/",
    label: "RFID laundry tag buyer's guide",
  },
  "/2024/12/24/rfid-event-wristband/": {
    href: "/solutions/rfid-event-access-control/",
    label: "RFID event access control guide",
  },
  "/2024/12/24/rfid-wooden-card/": {
    href: "/compare/metal-vs-wood-vs-pvc-nfc-business-cards/",
    label: "Metal vs wood vs PVC NFC business cards",
  },
  "/2025/11/04/mifare_plus_card/": {
    href: "/compare/mifare-plus-ev2-vs-desfire-ev3/",
    label: "MIFARE Plus EV2 vs DESFire EV3",
  },
  "/compare/pps-vs-silicone-laundry-tags/": {
    href: "/compare/pps-vs-silicone-vs-textile-rfid-laundry-tags/",
    label: "PPS vs silicone vs textile RFID laundry tags",
  },
  "/compare/mifare-plus-vs-desfire/": {
    href: "/compare/mifare-plus-ev2-vs-desfire-ev3/",
    label: "MIFARE Plus EV2 vs DESFire EV3",
  },
};

const EDITORIAL_PRIMARY_ACTION_LABELS: Record<string, string> = {
  "/solutions/hotel-key-cards/": "Get hotel lock compatibility check",
  "/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/": "Request chip recommendation",
  "/compare/rfid-vs-magnetic-hotel-key-cards/": "Ask for upgrade quote",
  "/solutions/rfid-laundry-tags/": "Request laundry tag samples",
  "/compare/pps-vs-silicone-vs-textile-rfid-laundry-tags/": "Get tag selection help",
  "/solutions/google-review-nfc-card/": "Request custom review card",
  "/compare/ntag213-vs-ntag215-vs-ntag216/": "Ask which NTAG fits your project",
  "/solutions/nfc-business-card/": "Get custom NFC card quote",
  "/compatibility/saflok-hotel-key-cards/": "Send your lock model for matching",
  "/compatibility/onity-hotel-key-cards/": "Check Onity card compatibility",
  "/compatibility/salto-hotel-key-cards/": "Check SALTO chip options",
  "/compare/rfid-wristbands-hotels-vs-events-vs-resorts/": "Get wristband recommendation",
  "/compare/silicone-vs-fabric-vs-woven-rfid-wristbands/": "Request wristband samples",
  "/compare/uhf-vs-hf-rfid-laundry-tags/": "Match tag with your reader setup",
  "/guides/hotel-key-card-encoding/": "Ask about pre-encoding service",
  "/compare/pvc-vs-wood-vs-pla-hotel-key-cards/": "Request eco card samples",
  "/compare/nfc-review-card-vs-qr-review-stand/": "Choose the right review format",
  "/compare/mifare-plus-ev2-vs-desfire-ev3/": "Get security-level recommendation",
  "/compare/keyfob-vs-card-vs-wristband-access-control/": "Tell us your access scenario",
  "/guides/rfid-tag-card-wristband-lifespan/": "Ask for durability test data",
  "/solutions/rfid-keyfobs-access-control/": "Discuss keyfob options",
  "/solutions/rfid-readers-and-encoding/": "Ask for reader recommendation",
  "/solutions/google-review-cards-for-restaurants/": "Request restaurant review card sample",
  "/solutions/google-review-cards-for-hotels/": "Request hotel review card sample",
  "/solutions/google-review-cards-for-clinics/": "Request clinic review card sample",
  "/solutions/google-review-cards-for-salons-and-spas/": "Request salon review card sample",
  "/solutions/google-review-cards-for-retail-stores/": "Request retail review card sample",
  "/solutions/google-review-cards-for-gyms-and-fitness-studios/": "Request gym review card sample",
  "/solutions/google-review-cards-for-front-desks/": "Request front-desk review card sample",
  "/solutions/google-review-cards-for-checkout-counters/": "Request checkout review card sample",
  "/solutions/google-review-cards-for-tabletop-prompts/": "Request tabletop review card sample",
  "/solutions/google-review-cards-for-pickup-counters/": "Request pickup review card sample",
  "/compare/hf-vs-uhf-rfid-for-asset-tracking/": "Match frequency to your workflow",
  "/compare/google-review-nfc-card-vs-nfc-sticker/": "Choose card or sticker",
  "/compatibility/vingcard-hotel-key-cards/": "Check VingCard compatibility",
  "/compatibility/miwa-hotel-key-cards/": "Check MIWA card compatibility",
  "/compatibility/hafele-dialock-hotel-key-cards/": "Check Dialock card compatibility",
  "/compatibility/be-tech-hotel-key-cards/": "Check Be-Tech card compatibility",
  "/guides/rfid-reader-writer-selection/": "Ask which reader fits your workflow",
  "/guides/nfc-business-card-iphone-android-compatibility/": "Check phone compatibility",
  "/guides/google-review-nfc-card-setup/": "Ask for review card setup help",
  "/guides/hotel-key-card-material-selection/": "Ask which hotel card material fits",
  "/guides/google-review-card-placement-guide/": "Ask about review card placement",
  "/guides/google-review-card-staff-prompt-playbook/": "Ask for staff-prompt guidance",
  "/guides/google-review-cards-for-multi-location-brands/": "Ask about multi-location routing",
  "/guides/google-review-card-design-and-copy/": "Ask about review card design",
  "/guides/hotel-key-card-sample-planning/": "Ask for hotel sample planning",
  "/guides/hotel-key-card-artwork-and-printing-checklist/": "Ask about hotel card artwork",
  "/guides/google-review-cards-for-restaurant-franchises/": "Ask about franchise review rollout",
  "/guides/google-review-cards-for-dental-groups/": "Ask about dental-group rollout",
  "/guides/google-review-cards-for-salon-chains/": "Ask about salon-chain rollout",
  "/guides/google-review-cards-for-auto-dealerships/": "Ask about dealership review rollout",
  "/guides/google-review-cards-for-hotel-groups/": "Ask about hotel-group rollout",
  "/guides/google-review-cards-for-fitness-franchises/": "Ask about fitness-franchise rollout",
  "/products/rfid-cards/mifare-desfire-ev3-cards/": "Request DESFire EV3 quote",
  "/products/rfid-cards/mifare-ultralight-c-cards/": "Request Ultralight C quote",
  "/products/rfid-cards/rfid-blocking-card/": "Request blocking card quote",
  "/products/rfid-cards/rfid-membership-card/": "Request membership card quote",
  "/products/rfid-labels/ntag213-nfc-sticker/": "Request NTAG213 sticker quote",
  "/products/rfid-labels/ntag215-nfc-sticker/": "Request NTAG215 sticker quote",
  "/products/rfid-labels/ntag216-nfc-sticker/": "Request NTAG216 sticker quote",
  "/products/rfid-labels/nfc-anti-metal-sticker/": "Request anti-metal sticker quote",
  "/products/rfid-labels/ntag424-dna-tamper-evident-tag/": "Request NTAG424 DNA quote",
  "/products/rfid-tags/uhf-rfid-apparel-hang-tag/": "Request apparel tag quote",
  "/products/rfid-tags/uhf-rfid-woven-care-label/": "Request woven label quote",
  "/products/rfid-labels/nfc-wet-inlay/": "Request wet inlay quote",
  "/products/rfid-labels/nfc-dry-inlay/": "Request dry inlay quote",
  "/products/rfid-labels/nfc-wine-bottle-tag/": "Request wine bottle tag quote",
  "/products/rfid-tags/nfc-pet-tag/": "Request pet tag quote",
  "/products/rfid-labels/uhf-rfid-paper-label/": "Request RFID label quote",
  "/products/rfid-tags/uhf-rfid-hard-tag/": "Request hard tag quote",
  "/products/rfid-tags/rfid-jewelry-tag/": "Request jewelry tag quote",
  "/products/rfid-wristbands/pvc-rfid-wristband/": "Request PVC wristband quote",
  "/products/rfid-keyfobs/nfc-epoxy-key-tag/": "Request epoxy key tag quote",
  "/products/rfid-keyfobs/rfid-coin-tag/": "Request coin tag quote",
  "/products/rfid-wristbands/hospital-patient-id-wristband/": "Request hospital wristband quote",
  "/products/rfid-keyfobs/rfid-abs-keyfob/": "Request ABS keyfob quote",
  "/products/rfid-labels/nfc-social-media-tag/": "Request social media tag quote",
  "/products/rfid-tags/rfid-anti-metal-tag/": "Request anti-metal tag quote",
  "/products/rfid-wristbands/nfc-payment-wristband/": "Request payment wristband quote",
  "/products/rfid-cards/rfid-parking-card/": "Request parking card quote",
  "/products/rfid-cards/dual-frequency-rfid-card/": "Request dual-frequency card quote",
  "/products/rfid-tags/rfid-library-book-tag/": "Request library tag quote",
  "/products/rfid-tags/rfid-animal-ear-tag/": "Request animal ear tag quote",
  "/products/rfid-tags/rfid-temperature-sensor-tag/": "Request temperature tag quote",
  "/products/rfid-cards/mifare-ultralight-c-card/": "Request Ultralight C card quote",
  "/products/rfid-labels/uhf-rfid-inlay/": "Request UHF inlay quote",
  "/products/rfid-wristbands/tyvek-rfid-wristband/": "Request Tyvek wristband quote",
  "/products/rfid-tags/rfid-tamper-seal-tag/": "Request tamper seal quote",
  "/products/rfid-tags/rfid-guard-tour-tag/": "Request guard tour tag quote",
  "/products/rfid-labels/nfc-smart-poster-tag/": "Request smart poster tag quote",
  "/products/rfid-tags/rfid-pallet-tag/": "Request pallet tag quote",
  "/products/rfid-tags/rfid-race-timing-tag/": "Request race timing tag quote",
  "/products/rfid-tags/rfid-glass-capsule-tag/": "Request glass capsule tag quote",
  "/products/rfid-tags/rfid-waste-bin-tag/": "Request waste bin tag quote",
  "/products/rfid-labels/nfc-shelf-label/": "Request NFC shelf label quote",
  "/products/rfid-labels/rfid-shipping-label/": "Request RFID shipping label quote",
  "/products/rfid-tags/rfid-cable-tie-tag/": "Request cable tie tag quote",
  "/products/rfid-tags/rfid-tire-tag/": "Request tire tag quote",
  "/products/rfid-labels/nfc-table-stand/": "Request NFC table stand quote",
  "/products/rfid-keyfobs/dual-frequency-key-fob/": "Request dual-frequency fob quote",
  "/products/rfid-keyfobs/nfc-wood-keychain-tag/": "Request wood keychain tag quote",
  "/products/rfid-tags/rfid-textile-laundry-tag/": "Request textile laundry tag quote",
  "/products/rfid-labels/uhf-rfid-blank-label/": "Request blank RFID label quote",
  "/products/rfid-labels/nfc-sneaker-authentication-tag/": "Request sneaker authentication tag quote",
  "/products/rfid-labels/nfc-luxury-handbag-tag/": "Request luxury authentication tag quote",
  "/products/rfid-labels/nfc-cosmetics-authentication-label/": "Request cosmetics authentication label quote",
  "/products/rfid-labels/nfc-digital-product-passport-tag/": "Request DPP NFC tag quote",
  "/products/rfid-labels/nfc-battery-passport-tag/": "Request battery passport tag quote",
  "/products/rfid-cards/nfc-warranty-card/": "Request NFC warranty card quote",
  "/products/rfid-tags/rfid-bolt-seal/": "Request RFID bolt seal quote",
  "/products/rfid-tags/rfid-gas-cylinder-tag/": "Request gas cylinder tag quote",
  "/products/rfid-tags/rfid-surgical-instrument-tag/": "Request surgical instrument tag quote",
  "/products/rfid-tags/rfid-blood-bag-tag/": "Request blood bag tag quote",
  "/products/rfid-labels/rfid-medication-vial-label/": "Request medication RFID label quote",
  "/products/rfid-tags/rfid-high-temperature-ceramic-tag/": "Request ceramic RFID tag quote",
  "/products/rfid-tags/rfid-pcb-screw-mount-tag/": "Request PCB screw-mount tag quote",
  "/products/rfid-tags/rfid-keg-tag/": "Request keg tag quote",
  "/products/rfid-labels/rfid-airline-baggage-tag/": "Request airline baggage tag quote",
  "/products/rfid-tags/rfid-returnable-container-tag/": "Request RTI container tag quote",
  "/products/rfid-labels/rfid-document-tracking-label/": "Request document tracking label quote",
  "/products/rfid-labels/rfid-cryogenic-specimen-label/": "Request cryogenic label quote",
  "/products/rfid-labels/rfid-garment-source-tag/": "Request garment source tag quote",
  "/products/rfid-tags/rfid-ibc-chemical-drum-tag/": "Request IBC/drum tag quote",
  "/products/rfid-tags/rfid-aircraft-part-tag/": "Request aircraft part tag quote",
  "/products/rfid-tags/rfid-tool-tracking-tag/": "Request tool tracking tag quote",
  "/products/rfid-labels/nfc-gaming-collectible-tag/": "Request NFC gaming tag quote",
  "/products/rfid-labels/nfc-warranty-seal-tag/": "Request NFC warranty seal quote",
  "/industries/hospitality/": "Request hotel RFID samples",
  "/industries/retail-apparel/": "Request retail RFID samples",
  "/industries/brand-protection/": "Request authentication tag samples",
  "/solutions/rfid-event-wristbands/": "Request event wristband samples",
  "/industries/events-venues/": "Request event wristband samples",
  "/industries/healthcare/": "Request healthcare RFID samples",
  "/industries/logistics/": "Request logistics RFID samples",
  "/industries/industrial/": "Request industrial RFID samples",
  "/industries/eu-compliance/": "Request DPP NFC tag samples",
};


/* ── Load definitions from Astro Content Collections ─────────────────── */

let _editorialDefsCache: EditorialDefinition[] | null = null;

export async function loadEditorialDefinitions(): Promise<EditorialDefinition[]> {
  if (_editorialDefsCache) return _editorialDefsCache;
  const entries = await getCollection("editorial");
  const active = entries
    .filter((e) => !e.id.startsWith("_unused/"))
    .map((e) => e.data as unknown as EditorialDefinition);
  _editorialDefsCache = active.map((d) => normalizeEditorialDefinition(d));
  return _editorialDefsCache;
}

/**
 * Routes where an editorial JSON is authoritative and MUST replace any
 * existing WooCommerce stub or snapshot at the same route.
 *
 * These are the product-cluster pillar pages ("Complete guide to ...") that
 * supersede the imported WooCommerce category listings. Without this override
 * list `mergeEditorialPages` would silently skip the pillar because the
 * legacy /products/<cluster>/ stub is already present in siteData.pages.
 */
const EDITORIAL_OVERRIDE_ROUTES = new Set<string>([
  // Product family pillars
  "/products/rfid-labels/",
  "/products/rfid-tags/",
  "/products/rfid-cards/",
  "/products/rfid-wristbands/",
  "/products/rfid-keyfobs/",
  // Section roots
  "/industries/",
  "/resources/",
  // Layer-A removal P1 hubs (added 2026-04-28): without these, the editorial
  // JSON authored under src/content/editorial/{about,contact,faq,blog,
  // markets,lp,products/all,compare,compatibility,guides,solutions}.json was
  // silently dropped and the WP snapshot continued to render. See
  // LAYER_A_REMOVAL_PLAN.md P1.12.
  //
  // P1.15 (2026-04-28): "/" intentionally excluded — the editorial /index.json
  // exists in repo for future use but the WP snapshot home is the canonical
  // homepage. Re-adding "/" requires a content review on src/content/editorial/
  // index.json first.
  //
  // P1.16 (2026-04-28): "/products/all/" intentionally excluded — same reason
  // as "/". The editorial /products/all.json describes a "Filter by chip /
  // environment" catalog meta-page, but the WP snapshot at /products/all/ is
  // the actual WooCommerce catalog grid that buyers use. Re-adding requires
  // a content match against the WP catalog UX first.
  "/about/",
  "/contact/",
  "/faq/",
  "/blog/",
  "/markets/",
  "/lp/",
  "/compare/",
  "/compatibility/",
  "/guides/",
  "/solutions/",
]);

/**
 * Route-pattern overrides — same intent as EDITORIAL_OVERRIDE_ROUTES but
 * matches a family of routes by regex instead of exact URL. Used for the
 * 15+ /industries/<slug>/ pages whose WP snapshots predate the editorial
 * pillar rewrite (and therefore lack the left rail). Any pattern listed
 * here forces the editorial JSON to replace the on-disk snapshot.
 *
 * Layer-A removal P1.12 adds patterns for /about/<slug>/, /contact/<slug>/,
 * /markets/<slug>/, /lp/<slug>/, /blog/<slug>/, /compare/<slug>/,
 * /compatibility/<slug>/, /guides/<slug>/ — every editorial JSON in those
 * subtrees was previously rendering the snapshot bodyHtml instead of its
 * own sections (~417 routes affected per the dark-matter audit).
 */
const EDITORIAL_OVERRIDE_PATTERNS: RegExp[] = [
  /^\/industries\/[^/]+\/$/,
  /^\/solutions\/[^/]+\/$/,
  /^\/about\/[^/]+\/$/,
  /^\/contact\/[^/]+\/$/,
  /^\/markets\/[^/]+\/$/,
  /^\/lp\/[^/]+\/$/,
  /^\/blog\/[^/]+\/$/,
  /^\/compare\/[^/]+\/$/,
  /^\/compatibility\/[^/]+\/$/,
  /^\/guides\/[^/]+\/$/,
];

function isEditorialOverrideRoute(route: string): boolean {
  return EDITORIAL_OVERRIDE_ROUTES.has(route)
    || EDITORIAL_OVERRIDE_PATTERNS.some((pattern) => pattern.test(route));
}

/**
 * Cluster ids that have both a `/products/{id}/` editorial pillar and a
 * matching `#{id}` section in the `/products/all/` catalog. Used to render
 * a pillar→catalog "Browse all SKUs" bridge CTA, mirroring the catalog→pillar
 * "Read the {label} guide" link in `renderCatalogMain`. The two CTAs let
 * informational and SKU-discovery intent stay on their own pages while still
 * being one click apart.
 */
const PILLAR_CLUSTER_LABELS: Record<string, string> = {
  "rfid-cards": "RFID Cards",
  "rfid-keyfobs": "RFID Keyfobs",
  "rfid-labels": "RFID Labels",
  "rfid-readers": "RFID Readers",
  "rfid-tags": "RFID Tags",
  "rfid-wristbands": "RFID Wristbands",
};

function getPillarClusterId(route: string): string | null {
  const match = /^\/products\/([^/]+)\/$/.exec(route);
  if (!match) return null;
  return match[1] in PILLAR_CLUSTER_LABELS ? match[1] : null;
}

export async function mergeEditorialPages(siteData: SiteData): Promise<SiteData> {
  const extraPages = await buildEditorialPages(siteData);
  const existingIndex = new Map<string, number>();
  siteData.pages.forEach((page, index) => existingIndex.set(page.route, index));
  const pages = [...siteData.pages];

  extraPages.forEach((page) => {
    const existingAt = existingIndex.get(page.route);
    if (existingAt === undefined) {
      pages.push(page);
    } else if (isEditorialOverrideRoute(page.route)) {
      // Pillar editorial page replaces the WP snapshot at the cluster root
      // (and at every /industries/<slug>/ vertical, so the left rail and
      // any other render-time additions actually reach the rendered page).
      pages[existingAt] = page;
    }
    // Otherwise: keep the existing page (SKU pages already map 1:1 to JSON).
  });

  return {
    ...siteData,
    pageCount: pages.length,
    pages,
  };
}

function rewriteEditorialLink(link: EditorialLink): EditorialLink {
  const rewrite = EDITORIAL_LINK_REWRITES[link.href];
  return rewrite ? { ...link, ...rewrite } : link;
}

function rewriteEditorialLinks(links: EditorialLink[]): EditorialLink[] {
  const seen = new Set<string>();

  return links
    .map((link) => rewriteEditorialLink(link))
    .filter((link) => {
      if (seen.has(link.href)) {
        return false;
      }

      seen.add(link.href);
      return true;
    });
}

function normalizeEditorialDefinition(definition: EditorialDefinition): EditorialDefinition {
  const primaryAction = rewriteEditorialLink(definition.primaryAction);
  const secondaryActions = rewriteEditorialSecondaryActions(definition, primaryAction);

  return {
    ...definition,
    brief: definition.brief?.map((field) =>
      field.links && field.links.length > 0
        ? {
            ...field,
            links: rewriteEditorialLinks(field.links),
          }
        : field,
    ),
    resourceCards: definition.resourceCards.map((card) => ({
      ...card,
      links: rewriteEditorialLinks(card.links),
    })),
    primaryAction: {
      ...primaryAction,
      label: EDITORIAL_PRIMARY_ACTION_LABELS[definition.route] ?? primaryAction.label,
    },
    secondaryActions,
  };
}

function rewriteEditorialSecondaryActions(
  definition: EditorialDefinition,
  primaryAction: EditorialLink,
): EditorialLink[] {
  const specialistPrimary =
    definition.group !== "contact" &&
    primaryAction.href !== "/contact/" &&
    !primaryAction.href.startsWith("mailto:");

  return rewriteEditorialLinks(definition.secondaryActions).filter((link) => {
    if (!specialistPrimary) {
      return true;
    }

    return link.href !== "/contact/";
  });
}

async function buildEditorialPages(siteData: SiteData): Promise<SnapshotPage[]> {
  // Load template page from disk
  let template: SnapshotPage | undefined;
  for (const route of ["/about/", "/"]) {
    if (siteData.pages.some((p) => p.route === route)) {
      try { template = await loadPageFromDisk(route); break; } catch { /* skip */ }
    }
  }
  if (!template) {
    return [];
  }

  // Build WordPress product image lookup for industry product grids
  _wpProductImageMap.clear();
  for (const stub of siteData.pages) {
    if (stub.route.startsWith("/product/")) {
      try {
        const page = await loadPageFromDisk(stub.route);
        const $ = load(`<body>${page.bodyHtml}</body>`);
        const img = $(".woocommerce-product-gallery__image img, .wp-post-image").first().attr("src") ?? "";
        if (img) {
          _wpProductImageMap.set(page.route, { title: page.title, image: img });
        }
      } catch { /* skip missing pages */ }
    }
  }

  const headHtml = sanitizeTemplateHead(template.headHtml);

  const EDITORIAL_DEFINITIONS = await loadEditorialDefinitions();

  // Populate editorial image map for industry product grids
  _editorialImageMap.clear();
  for (const def of EDITORIAL_DEFINITIONS) {
    if (def.heroImage) {
      _editorialImageMap.set(def.route, { title: def.title, heroImage: def.heroImage });
    }
  }

  // Populate keyword map so seo.ts buildSchemaKeywords can prefer
  // editorial-authored keyword phrases over title tokenization.
  EDITORIAL_KEYWORDS_MAP.clear();
  for (const def of EDITORIAL_DEFINITIONS) {
    if (def.keywords && def.keywords.length > 0) {
      EDITORIAL_KEYWORDS_MAP.set(def.route, def.keywords);
    }
  }

  // Populate the /industries/ hub data — join the curated INDUSTRY_HUB_META
  // ordering with the loaded definitions so the hub rail + card grid pull
  // authored summaries and hero images. Slugs missing a definition are
  // silently dropped (they'll just be omitted from the hub).
  _industriesHubData.length = 0;
  for (const meta of INDUSTRY_HUB_META) {
    const route = `/industries/${meta.slug}/`;
    const def = EDITORIAL_DEFINITIONS.find((d) => d.route === route);
    if (!def) continue;
    _industriesHubData.push({
      slug: meta.slug,
      route,
      label: meta.label,
      emoji: meta.emoji,
      iconSlug: meta.iconSlug,
      summary: def.summary,
      heroImage: def.heroImage ?? "",
    });
  }

  // Same join-and-cache for /solutions/. SOLUTION_HUB_META drives display
  // order; entries without a matching editorial JSON are silently skipped.
  _solutionsHubData.length = 0;
  for (const meta of SOLUTION_HUB_META) {
    const route = `/solutions/${meta.slug}/`;
    const def = EDITORIAL_DEFINITIONS.find((d) => d.route === route);
    if (!def) continue;
    _solutionsHubData.push({
      slug: meta.slug,
      route,
      label: meta.label,
      emoji: meta.emoji,
      iconSlug: meta.iconSlug,
      summary: def.summary,
      heroImage: def.heroImage ?? "",
    });
  }

  /* DS-9 #4 — Bucket _solutionsHubData into SOLUTIONS_RAIL_GROUPS. Each
     group keeps the SOLUTION_HUB_META display order within its slug list,
     and any slug not in any group falls into a synthetic "More" tail group
     so we never silently drop pages from the rail. */
  _solutionsGroupedHubData.length = 0;
  const _solutionsBySlug = new Map(_solutionsHubData.map((e) => [e.slug, e] as const));
  const _claimedSlugs = new Set<string>();
  for (const groupMeta of SOLUTIONS_RAIL_GROUPS) {
    const items: HubEntry[] = [];
    for (const slug of groupMeta.slugs) {
      const entry = _solutionsBySlug.get(slug);
      if (!entry) continue;
      items.push(entry);
      _claimedSlugs.add(slug);
    }
    if (items.length > 0) {
      _solutionsGroupedHubData.push({
        groupLabel: groupMeta.groupLabel,
        groupSlug: groupMeta.groupSlug,
        emoji: groupMeta.emoji,
        iconSlug: groupMeta.iconSlug,
        items,
      });
    }
  }
  const _orphanItems = _solutionsHubData.filter((e) => !_claimedSlugs.has(e.slug));
  if (_orphanItems.length > 0) {
    _solutionsGroupedHubData.push({
      groupLabel: "More",
      groupSlug: "more",
      emoji: "📂",
      iconSlug: "folder-open",
      items: _orphanItems,
    });
  }

  // Build the /resources/ grouped hub data — auto-pulled from every editorial
  // definition matching one of the four Resources groups (blog, guides, compare,
  // compatibility). No hand-curated meta per item: label is derived from the
  // editorial title (preferring the part before " — " / " | " for brevity),
  // emoji is the group's shared emoji. Items sort alphabetically by label.
  _resourcesHubData.length = 0;
  for (const groupMeta of RESOURCES_GROUP_META) {
    const items: HubEntry[] = [];
    for (const def of EDITORIAL_DEFINITIONS) {
      // Skip the resources pillar itself and any nested non-leaf routes.
      if (def.route === "/resources/") continue;
      if (!def.route.startsWith(groupMeta.routePrefix)) continue;
      // Match the leaf form /<prefix>/<slug>/ — exclude the group root if it exists.
      const slugMatch = def.route.match(new RegExp(`^${groupMeta.routePrefix}([^/]+)/$`));
      if (!slugMatch) continue;
      const slug = slugMatch[1];

      // Prefer the part before " — " / " – " / " | " for a short rail label.
      const shortTitle = def.title.split(/—|–|\||:/, 1)[0]?.trim() || def.title;
      const label = shortTitle.length > 60 ? shortTitle.slice(0, 57).trimEnd() + "…" : shortTitle;

      items.push({
        slug,
        route: def.route,
        label,
        emoji: groupMeta.emoji,
        iconSlug: groupMeta.iconSlug,
        summary: def.summary,
        heroImage: def.heroImage ?? "",
      });
    }
    items.sort((a, b) => a.label.localeCompare(b.label));
    _resourcesHubData.push({
      groupLabel: groupMeta.groupLabel,
      groupSlug: groupMeta.groupSlug,
      emoji: groupMeta.emoji,
      iconSlug: groupMeta.iconSlug,
      items,
    });
  }

  // Flat 4-item rail nav for the /resources/ left rail — mirrors the dropdown
  // menu shown in the global header. Each entry links DIRECTLY to the
  // matching sub-hub landing page (/blog/, /guides/, /compare/,
  // /compatibility/) so the rail works as cross-section navigation on every
  // /blog/<slug>/, /guides/<slug>/ etc. leaf page (not just an in-page TOC
  // on /resources/). Per user request 2026-04-26.
  _resourcesRailData.length = 0;
  for (const group of _resourcesHubData) {
    _resourcesRailData.push({
      slug: group.groupSlug,
      route: `/${group.groupSlug}/`,
      label: `${group.groupLabel} (${group.items.length})`,
      emoji: group.emoji,
      iconSlug: group.iconSlug,
      summary: "",
      heroImage: "",
    });
  }

  /* ─── Per-hub rail data populators (DS-9 2026-04-26) ─────────────────
     Build separate rail datasets so /guides/, /compare/, /compatibility/
     drill into their own subcategories instead of showing the cross-family
     siblings list. Reuses GROUP rules declared above. */

  /** Helper: bucket leaves under a route prefix into GroupedHubData by
     applying first-match matcher rules. Unmatched leaves get an "Other"
     tail group so nothing is silently dropped. */
  function buildGroupedRail(routePrefix: string, groupRules: HubGroupRule[]): GroupedHubData {
    const result: GroupedHubData = groupRules.map((g) => ({
      groupLabel: g.groupLabel,
      groupSlug: g.groupSlug,
      emoji: "",
      iconSlug: g.iconSlug,
      items: [],
    }));
    const otherGroup = {
      groupLabel: "Other",
      groupSlug: "other",
      emoji: "",
      iconSlug: "folder",
      items: [] as HubEntry[],
    };
    for (const def of EDITORIAL_DEFINITIONS) {
      if (!def.route.startsWith(routePrefix)) continue;
      const slugMatch = def.route.match(new RegExp(`^${routePrefix}([^/]+)/$`));
      if (!slugMatch) continue;
      const slug = slugMatch[1];
      // Short label — drop suffix after em-dash / pipe / colon for rail readability.
      const shortTitle = def.title.split(/—|–|\||:/, 1)[0]?.trim() || def.title;
      const label = shortTitle.length > 60 ? shortTitle.slice(0, 57).trimEnd() + "…" : shortTitle;
      const ruleIdx = groupRules.findIndex((g) => g.matcher(slug));
      const targetGroup = ruleIdx >= 0 ? result[ruleIdx] : otherGroup;
      targetGroup.items.push({
        slug,
        route: def.route,
        label,
        emoji: "",
        iconSlug: targetGroup.iconSlug,
        summary: def.summary,
        heroImage: def.heroImage ?? "",
      });
    }
    // Sort items alphabetically inside each group for predictability.
    for (const g of result) g.items.sort((a, b) => a.label.localeCompare(b.label));
    otherGroup.items.sort((a, b) => a.label.localeCompare(b.label));
    // Drop empty groups + append Other tail if it has items.
    const out: GroupedHubData = result.filter((g) => g.items.length > 0);
    if (otherGroup.items.length > 0) out.push(otherGroup);
    return out;
  }

  // /guides/ — 49 leaves bucketed by topic.
  _guidesGroupedRailData.length = 0;
  _guidesGroupedRailData.push(...buildGroupedRail("/guides/", GUIDES_RAIL_GROUPS));

  // /compare/ — 30 leaves bucketed by comparison axis.
  _compareGroupedRailData.length = 0;
  _compareGroupedRailData.push(...buildGroupedRail("/compare/", COMPARE_RAIL_GROUPS));

  // /compatibility/ — 7 hotel-lock vendors. Small enough for a flat list,
  // no grouping needed; each item links to its vendor compatibility page.
  _compatibilityRailData.length = 0;
  for (const def of EDITORIAL_DEFINITIONS) {
    if (!def.route.startsWith("/compatibility/")) continue;
    const slugMatch = def.route.match(/^\/compatibility\/([^/]+)\/$/);
    if (!slugMatch) continue;
    const slug = slugMatch[1];
    const shortTitle = def.title.split(/—|–|\||:/, 1)[0]?.trim() || def.title;
    const label = shortTitle.length > 60 ? shortTitle.slice(0, 57).trimEnd() + "…" : shortTitle;
    _compatibilityRailData.push({
      slug,
      route: def.route,
      label,
      emoji: "",
      iconSlug: "key",
      summary: def.summary,
      heroImage: def.heroImage ?? "",
    });
  }
  _compatibilityRailData.sort((a, b) => a.label.localeCompare(b.label));

  const pages: SnapshotPage[] = [];
  for (const definition of EDITORIAL_DEFINITIONS) {
    pages.push({
    route: definition.route,
    sourceUrl: `${siteData.siteOrigin}${definition.route}`,
    title: definition.title,
    htmlAttrs: { ...template.htmlAttrs },
    bodyAttrs: buildBodyAttrs(template.bodyAttrs, definition),
    headHtml,
    bodyHtml: buildBodyHtml(template.bodyHtml, definition, await resolveIllustration(definition)),
    });
  }
  return pages;
}

function sanitizeTemplateHead(headHtml: string): string {
  const $ = load(`<head>${headHtml}</head>`);

  $(
    [
      "title",
      'meta[name="description"]',
      'meta[name="robots"]',
      'meta[property^="og:"]',
      'meta[name^="twitter:"]',
      'link[rel="canonical"]',
      'link[rel="alternate"]',
      'link[rel="shortlink"]',
      'link[rel="EditURI"]',
      'link[rel="https://api.w.org/"]',
      'script[type="application/ld+json"]',
    ].join(","),
  ).remove();

  return $("head").html() ?? "";
}

function buildBodyAttrs(baseAttrs: Record<string, string>, definition: EditorialDefinition): Record<string, string> {
  const classTokens = (baseAttrs.class ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => !/^page-id-\d+$/.test(token))
    .filter((token) => !/^post-\d+$/.test(token))
    .filter((token) => token !== "post")
    .filter((token) => token !== "page-id-14");

  classTokens.push("codex-editorial-body", `codex-editorial-${definition.group}`);

  return {
    ...baseAttrs,
    class: Array.from(new Set(classTokens)).join(" "),
  };
}

function buildBodyHtml(templateBodyHtml: string, definition: EditorialDefinition, illustration: { src: string; alt: string } | null): string {
  const $ = load(`<body>${templateBodyHtml}</body>`);
  const main = $("main#main, main.site-main").first();

  if (!main.length) {
    return templateBodyHtml;
  }

  main.html(renderEditorialMain(definition, illustration));
  return $("body").html() ?? templateBodyHtml;
}

/** Lookup maps for product images — populated in buildEditorialPages() */
const _editorialImageMap: Map<string, { title: string; heroImage: string }> = new Map();
const _wpProductImageMap: Map<string, { title: string; image: string }> = new Map();

/**
 * Display metadata for industry sub-pages on the /industries/ hub.
 * Order in this map drives both the rail order and the card-grid order.
 * Short labels (vs. the long editorial titles) are used in the rail and on
 * each card; the emoji becomes a quick visual key. INDUSTRY_CATEGORIES has
 * its own emoji set for the 8 "core" verticals — we mirror those here for
 * consistency, then add the remaining 12 verticals that exist as editorial
 * pillars but aren't in the homepage rail.
 */
const INDUSTRY_HUB_META: Array<{ slug: string; label: string; emoji: string; iconSlug: string }> = [
  { slug: "hospitality",                      label: "Hospitality",                      emoji: "🏨", iconSlug: "hotel" },
  { slug: "retail-apparel",                   label: "Retail & Apparel",                 emoji: "🛍️", iconSlug: "shopping-bag" },
  { slug: "brand-protection",                 label: "Brand Protection",                 emoji: "🛡️", iconSlug: "shield" },
  { slug: "events-venues",                    label: "Events & Venues",                  emoji: "🎪", iconSlug: "tent" },
  { slug: "healthcare",                       label: "Healthcare",                       emoji: "🏥", iconSlug: "hospital" },
  { slug: "logistics",                        label: "Logistics & Supply Chain",         emoji: "📦", iconSlug: "package" },
  { slug: "industrial",                       label: "Industrial & Manufacturing",       emoji: "🏭", iconSlug: "factory" },
  { slug: "eu-compliance",                    label: "EU Compliance",                    emoji: "🇪🇺", iconSlug: "globe" },
  { slug: "luxury-brands",                    label: "Luxury Brands",                    emoji: "👜", iconSlug: "handbag" },
  { slug: "pharmaceutical",                   label: "Pharmaceutical",                   emoji: "💊", iconSlug: "pill" },
  { slug: "libraries",                        label: "Libraries",                        emoji: "📚", iconSlug: "library" },
  { slug: "laundry-services",                 label: "Laundry Services",                 emoji: "🧺", iconSlug: "basket" },
  { slug: "education",                        label: "Education",                        emoji: "🎓", iconSlug: "graduation-cap" },
  { slug: "fitness",                          label: "Fitness",                          emoji: "💪", iconSlug: "dumbbell" },
  { slug: "agriculture",                      label: "Agriculture",                      emoji: "🌾", iconSlug: "wheat" },
  { slug: "automotive-tire-oem",              label: "Automotive & Tire OEM",            emoji: "🚗", iconSlug: "car" },
  { slug: "aerospace-aviation-mro",           label: "Aerospace & Aviation MRO",         emoji: "✈️", iconSlug: "plane" },
  { slug: "data-center-it-asset-tracking",    label: "Data Center & IT Assets",          emoji: "💻", iconSlug: "monitor" },
  { slug: "government-defense-supply-chain",  label: "Government & Defense",             emoji: "🪖", iconSlug: "helmet" },
  { slug: "cold-chain-food-traceability",     label: "Cold Chain & Food Traceability",   emoji: "❄️", iconSlug: "snowflake" },
];

/**
 * Industries hub data — populated in buildEditorialPages() by joining the
 * INDUSTRY_HUB_META display table with the loaded editorial definitions
 * (so we can pull authored summary + heroImage). Used by both the left rail
 * and the card grid on /industries/.
 *
 * `HubEntry` is the generic shape used by all hub-style sections (industries,
 * solutions, …). Adding a new hub means: declare a META list, populate a
 * `_<section>HubData: HubEntry[]` in buildEditorialPages, and call
 * `renderHubRail` / `renderHubGrid` from `renderEditorialMain`.
 */
type HubEntry = { slug: string; route: string; label: string; emoji: string; iconSlug: string; summary: string; heroImage: string };
type IndustryHubEntry = HubEntry;
const _industriesHubData: HubEntry[] = [];

/**
 * Display metadata for solution sub-pages on the /solutions/ hub. Order in
 * this map drives both the rail order and the card-grid order. Themes are
 * grouped contiguously (hospitality → events → laundry → healthcare → library
 * → brand auth → cards → asset/inventory → warehouse → vehicle → access
 * control → attendance → google review variants) so the rail scans naturally
 * even though it's a flat list.
 */
const SOLUTION_HUB_META: Array<{ slug: string; label: string; emoji: string; iconSlug: string }> = [
  { slug: "hotel-key-cards",                           label: "Hotel Key Cards",                emoji: "🔑", iconSlug: "key" },
  { slug: "hotel-rfid-access-control",                 label: "Hotel Access Control",           emoji: "🏨", iconSlug: "hotel" },
  { slug: "rfid-event-access-control",                 label: "Event Access Control",           emoji: "🎟️", iconSlug: "ticket" },
  { slug: "rfid-event-wristbands",                     label: "Event Wristbands",               emoji: "🎫", iconSlug: "ticket" },
  { slug: "rfid-race-timing",                          label: "Race Timing",                    emoji: "🏁", iconSlug: "flag" },
  { slug: "rfid-laundry-tags",                         label: "Laundry Tags",                   emoji: "🏷️", iconSlug: "tag" },
  { slug: "rfid-laundry-management",                   label: "Laundry Management",             emoji: "🧺", iconSlug: "basket" },
  { slug: "rfid-laundry-tracking",                     label: "Laundry Tracking",               emoji: "🔁", iconSlug: "refresh" },
  { slug: "rfid-patient-tracking",                     label: "Patient Tracking",               emoji: "🏥", iconSlug: "heart-pulse" },
  { slug: "rfid-library-management",                   label: "Library Management",             emoji: "📚", iconSlug: "library" },
  { slug: "nfc-brand-authentication",                  label: "Brand Authentication",           emoji: "🛡️", iconSlug: "shield-check" },
  { slug: "nfc-luxury-authentication",                 label: "Luxury Authentication",          emoji: "💎", iconSlug: "gem" },
  { slug: "digital-product-passport",                  label: "Digital Product Passport",       emoji: "🇪🇺", iconSlug: "globe" },
  { slug: "nfc-business-card",                         label: "NFC Business Cards",             emoji: "💳", iconSlug: "credit-card" },
  { slug: "nfc-business-card-programs",                label: "Business Card Programs",         emoji: "🪪", iconSlug: "id-card" },
  { slug: "rfid-asset-tracking-labels",                label: "Asset-Tracking Labels",          emoji: "📦", iconSlug: "package" },
  { slug: "rfid-inventory-tracking",                   label: "Inventory Tracking",             emoji: "📊", iconSlug: "bar-chart" },
  { slug: "rfid-tool-tracking",                        label: "Tool Tracking",                  emoji: "🔧", iconSlug: "wrench" },
  { slug: "rfid-warehouse-management",                 label: "Warehouse Management",           emoji: "🏭", iconSlug: "warehouse" },
  { slug: "rfid-supply-chain-management",              label: "Supply Chain",                   emoji: "🚚", iconSlug: "truck" },
  { slug: "vehicle-rfid-identification",               label: "Vehicle ID",                     emoji: "🚗", iconSlug: "car" },
  { slug: "rfid-parking-management",                   label: "Parking Management",             emoji: "🅿️", iconSlug: "parking" },
  { slug: "rfid-access-control",                       label: "Access Control",                 emoji: "🚪", iconSlug: "door" },
  { slug: "rfid-keyfobs-access-control",               label: "Keyfob Access",                  emoji: "🔐", iconSlug: "lock" },
  { slug: "rfid-attendance-system",                    label: "Attendance System",              emoji: "⏱️", iconSlug: "clock" },
  { slug: "rfid-readers-and-encoding",                 label: "Readers & Encoding",             emoji: "📡", iconSlug: "radio" },
  { slug: "google-review-nfc-card",                    label: "Google Review NFC Cards",        emoji: "⭐", iconSlug: "star" },
  { slug: "google-review-cards-for-restaurants",       label: "Review · Restaurants",           emoji: "🍽️", iconSlug: "utensils" },
  { slug: "google-review-cards-for-hotels",            label: "Review · Hotels",                emoji: "🛎️", iconSlug: "bell" },
  { slug: "google-review-cards-for-clinics",           label: "Review · Clinics",               emoji: "🩺", iconSlug: "stethoscope" },
  { slug: "google-review-cards-for-salons-and-spas",   label: "Review · Salons & Spas",         emoji: "💇", iconSlug: "scissors" },
  { slug: "google-review-cards-for-retail-stores",     label: "Review · Retail Stores",         emoji: "🛍️", iconSlug: "shopping-bag" },
  { slug: "google-review-cards-for-gyms-and-fitness-studios", label: "Review · Gyms & Fitness", emoji: "💪", iconSlug: "dumbbell" },
  { slug: "google-review-cards-for-front-desks",       label: "Review · Front Desks",           emoji: "📋", iconSlug: "clipboard" },
  { slug: "google-review-cards-for-checkout-counters", label: "Review · Checkout Counters",     emoji: "🧾", iconSlug: "receipt" },
  { slug: "google-review-cards-for-tabletop-prompts",  label: "Review · Tabletop Prompts",      emoji: "🍴", iconSlug: "fork" },
  { slug: "google-review-cards-for-pickup-counters",   label: "Review · Pickup Counters",       emoji: "🛒", iconSlug: "shopping-cart" },
];

/** Solutions hub data — built in buildEditorialPages() (same shape as industries). */
const _solutionsHubData: HubEntry[] = [];

/* DS-9 #4 (2026-04-26) — Grouped variant for the /solutions/* left rail.
   Mirrors the SOLUTIONS_MENU groupings used in the global header dropdown
   (menu-structure.ts). Each entry is a slug → group lookup; the rail
   builder consumes this map plus _solutionsHubData to render a grouped
   <renderGroupedHubRail> instead of one flat list of 37 items. */
const SOLUTIONS_RAIL_GROUPS: Array<{ groupLabel: string; groupSlug: string; emoji: string; iconSlug: string; slugs: string[] }> = [
  {
    groupLabel: "Access Control",
    groupSlug: "access-control",
    emoji: "🚪",
    iconSlug: "door",
    slugs: [
      "rfid-access-control",
      "rfid-keyfobs-access-control",
      "hotel-rfid-access-control",
      "rfid-attendance-system",
      "rfid-parking-management",
      "vehicle-rfid-identification",
    ],
  },
  {
    groupLabel: "Inventory & Supply Chain",
    groupSlug: "inventory-supply-chain",
    emoji: "📦",
    iconSlug: "package",
    slugs: [
      "rfid-inventory-tracking",
      "rfid-asset-tracking-labels",
      "rfid-warehouse-management",
      "rfid-tool-tracking",
      "rfid-supply-chain-management",
    ],
  },
  {
    groupLabel: "Hotels & Laundry",
    groupSlug: "hotels-laundry",
    emoji: "🏨",
    iconSlug: "hotel",
    slugs: [
      "hotel-key-cards",
      "rfid-laundry-management",
      "rfid-laundry-tags",
      "rfid-laundry-tracking",
    ],
  },
  {
    groupLabel: "Events & Race",
    groupSlug: "events-race",
    emoji: "🎟️",
    iconSlug: "ticket",
    slugs: [
      "rfid-event-wristbands",
      "rfid-event-access-control",
      "rfid-race-timing",
    ],
  },
  {
    groupLabel: "NFC Brand & Auth",
    groupSlug: "nfc-brand-auth",
    emoji: "🛡️",
    iconSlug: "shield-check",
    slugs: [
      "nfc-brand-authentication",
      "nfc-luxury-authentication",
      "nfc-business-card",
      "nfc-business-card-programs",
      "digital-product-passport",
    ],
  },
  {
    groupLabel: "Google Review Cards",
    groupSlug: "google-review-cards",
    emoji: "⭐",
    iconSlug: "star",
    slugs: [
      "google-review-nfc-card",
      "google-review-cards-for-restaurants",
      "google-review-cards-for-hotels",
      "google-review-cards-for-retail-stores",
      "google-review-cards-for-salons-and-spas",
      "google-review-cards-for-gyms-and-fitness-studios",
      "google-review-cards-for-clinics",
      "google-review-cards-for-front-desks",
      "google-review-cards-for-checkout-counters",
      "google-review-cards-for-pickup-counters",
      "google-review-cards-for-tabletop-prompts",
    ],
  },
  {
    groupLabel: "Specialty",
    groupSlug: "specialty",
    emoji: "🔬",
    iconSlug: "microscope",
    slugs: [
      "rfid-patient-tracking",
      "rfid-library-management",
      "rfid-readers-and-encoding",
    ],
  },
];

/** Solutions rail — grouped variant of _solutionsHubData. Built alongside it
   in buildEditorialPages(). Drives renderGroupedHubRail() for /solutions/* leaf pages. */
const _solutionsGroupedHubData: GroupedHubData = [];

/**
 * Grouped hub shape — used by sections that aggregate multiple editorial
 * groups under one umbrella (e.g. /resources/ pulls guides + compare +
 * compatibility into a single rail with group headers). Each group renders
 * as its own labelled section in both the rail and the card grid.
 */
type GroupedHubData = Array<{
  groupLabel: string;
  groupSlug: string;
  emoji: string;
  /** DS-9 icon-replacement: SVG icon name for the group heading. */
  iconSlug: string;
  items: HubEntry[];
}>;

/**
 * Display metadata for the /resources/ aggregate hub. Four groups in the
 * order they appear in the Resources dropdown menu: Blog → Buying Guides →
 * Product Comparisons → Hotel Lock Compatibility. Labels are intentionally
 * the same as the menu wording so the rail feels like the menu "stayed open".
 * Items inside each group are auto-derived from matching editorial JSONs
 * (no per-item curation — there are 170+, and the per-page emoji is replaced
 * by a single group emoji).
 */
const RESOURCES_GROUP_META: Array<{ groupLabel: string; groupSlug: string; emoji: string; iconSlug: string; routePrefix: string; editorialGroup: EditorialGroup }> = [
  { groupLabel: "Blog — Industry Articles",   groupSlug: "blog",          emoji: "📰", iconSlug: "clipboard",   routePrefix: "/blog/",          editorialGroup: "blog" },
  { groupLabel: "Buying Guides",              groupSlug: "guides",        emoji: "📖", iconSlug: "library",     routePrefix: "/guides/",        editorialGroup: "guides" },
  { groupLabel: "Product Comparisons",        groupSlug: "compare",       emoji: "⚖️", iconSlug: "layers",      routePrefix: "/compare/",       editorialGroup: "compare" },
  { groupLabel: "Hotel Lock Compatibility",   groupSlug: "compatibility", emoji: "🔌", iconSlug: "key",         routePrefix: "/compatibility/", editorialGroup: "compatibility" },
];

/** Resources hub data — built in buildEditorialPages() (grouped shape). */
const _resourcesHubData: GroupedHubData = [];

/* ─── Per-hub rail data — DS-9 (2026-04-26) ─────────────────────────────────
   The flat 4-item Resources rail (`_resourcesRailData`) is still used on
   `/resources/` itself + on `/blog/*` (the snapshot-driven blog tree). On the
   three editorial sub-hubs (Buying Guides / Product Comparisons / Hotel Lock
   Compatibility), users want a rail that drills INTO that hub — its own
   subcategories — not back out to siblings. These three datasets are built
   in buildEditorialPages() via slug-pattern matching against each hub's leaf
   editorial JSONs.

   Grouping rules per hub are declared via `(slug) => boolean` matchers below.
   First matching group wins, so order of GROUPS arrays matters. Anything
   that doesn't match any group falls into a synthetic "Other" tail group
   so we never silently drop pages. */

type HubGroupRule = {
  groupLabel: string;
  groupSlug: string;
  iconSlug: string;
  matcher: (slug: string) => boolean;
};

const GUIDES_RAIL_GROUPS: HubGroupRule[] = [
  { groupLabel: "Google Review Cards", groupSlug: "google-review",        iconSlug: "star",         matcher: (s) => s.startsWith("google-review-") },
  { groupLabel: "Hotel Key Cards",     groupSlug: "hotel-key-cards",      iconSlug: "key",          matcher: (s) => s.startsWith("hotel-key-card-") },
  { groupLabel: "Chip Encyclopedias",  groupSlug: "chip-encyclopedias",   iconSlug: "credit-card",  matcher: (s) => /chip-encyclopedia|memory-map|commands-reference|sun-cmac/.test(s) },
  { groupLabel: "Standards & Encoding", groupSlug: "standards-encoding",  iconSlug: "layers",       matcher: (s) => /^epc-gen2|^gs1-|^iso-|^nfc-ndef|^rain-rfid|^nfc-tag-programming/.test(s) },
  { groupLabel: "Regulatory & Compliance", groupSlug: "regulatory",       iconSlug: "shield-check", matcher: (s) => /privacy|passport|fda|tagging-mandate|rohs-reach|ce-marking|food-safety/.test(s) },
  { groupLabel: "Integration & Tools", groupSlug: "integration-tools",    iconSlug: "wrench",       matcher: (s) => /^python-|sap-wms|oracle-netsuite|shopify-inventory|api-guide|reader-writer-selection|iphone-android-compatibility/.test(s) },
];

const COMPARE_RAIL_GROUPS: HubGroupRule[] = [
  { groupLabel: "Chip vs Chip",        groupSlug: "chip-vs-chip",         iconSlug: "credit-card",  matcher: (s) => /^mifare-|^ntag\d|^ucode\d|desfire-ev3$/.test(s) },
  { groupLabel: "Reader vs Reader",    groupSlug: "reader-vs-reader",     iconSlug: "radio",        matcher: (s) => /(acr\d|omnikey|impinj|zebra-fx)/.test(s) },
  { groupLabel: "Form Factor & Material", groupSlug: "form-factor",       iconSlug: "package",      matcher: (s) => /(keyfob|wristband|sticker|laundry-tag|business-card|hotel-(key-)?card|on-metal)/.test(s) },
  { groupLabel: "Frequency & Tech",    groupSlug: "frequency-tech",       iconSlug: "radio",        matcher: (s) => /(125khz|13[.-]56mhz|hf-vs-uhf|uhf-vs-hf|active-vs-passive|nfc-vs|rfid-vs-)/.test(s) },
];

/** Per-hub rail datasets — populated in buildEditorialPages(). */
const _guidesGroupedRailData: GroupedHubData = [];
const _compareGroupedRailData: GroupedHubData = [];
const _compatibilityRailData: HubEntry[] = [];

/**
 * Resources rail nav data — flat 4-item list mirroring the dropdown menu.
 * Each entry links to the matching group's anchor on /resources/ itself
 * (TOC pattern), NOT to a sub-page. Built from RESOURCES_GROUP_META so
 * label / emoji / count stay in sync with the body grid.
 */
const _resourcesRailData: HubEntry[] = [];

/**
 * Route → keyword-phrase lookup for JSON-LD `keywords` field.
 * Populated from editorial JSON's optional `keywords` array.
 * Consumed by seo.ts buildSchemaKeywords() to prefer authored phrases over
 * naive title tokenization. Exported so other modules can read it.
 */
export const EDITORIAL_KEYWORDS_MAP: Map<string, string[]> = new Map();

/**
 * Render a "Used in these industries" card grid for SKU pages that declare
 * `relatedIndustries` in their editorial JSON. Slugs map to INDUSTRY_CATEGORIES
 * entries for title / hero / description; unknown slugs are silently dropped.
 */
function renderRelatedIndustriesGrid(definition: EditorialDefinition): string {
  const slugs = definition.relatedIndustries ?? [];
  if (slugs.length === 0) return "";
  // Scope: SKU pages only (inside a product cluster, excluding the cluster roots themselves).
  if (!/^\/products\/rfid-[a-z]+\/[a-z0-9\-]+\/$/.test(definition.route)) return "";

  type IndustryCard = { href: string; title: string; description: string; heroImage: string; emoji: string };
  const entries: IndustryCard[] = slugs
    .map((slug): IndustryCard | null => {
      const known = INDUSTRY_CATEGORIES.find((c) => c.id === slug);
      if (known) {
        return {
          href: known.href,
          title: known.title,
          description: known.description,
          heroImage: known.heroImage,
          emoji: known.emoji,
        };
      }
      // Fallback for industries not in the homepage rail (education, fitness,
      // agriculture, libraries, laundry-services, luxury-brands, pharmaceutical, …).
      // Pull title + hero from the industry editorial JSON via _editorialImageMap.
      const route = `/industries/${slug}/`;
      const editorial = _editorialImageMap.get(route);
      if (!editorial) return null;
      const title = editorial.title.split(/—|–|-|\|/, 1)[0]?.trim() || slug;
      return {
        href: route,
        title,
        description: "Real-world deployments, compliance notes and product picks for this vertical.",
        heroImage: editorial.heroImage,
        emoji: "→",
      };
    })
    .filter((c): c is IndustryCard => Boolean(c));
  if (entries.length === 0) return "";

  const cards = entries
    .map(
      (cat) => `
        <a href="${escapeAttribute(cat.href)}" class="codex-card codex-card--media codex-related-industry-card">
          ${cat.heroImage ? `<img src="${escapeAttribute(cat.heroImage)}" alt="${escapeAttribute(cat.title)}" loading="lazy" decoding="async">` : ""}
          <div class="codex-related-industry-card__body">
            <span class="codex-related-industry-card__emoji" aria-hidden="true">${escapeHtml(cat.emoji)}</span>
            <strong>${escapeHtml(cat.title)}</strong>
            <p>${escapeHtml(cat.description)}</p>
          </div>
        </a>`,
    )
    .join("");

  return `<section class="codex-editorial-section codex-related-industries" id="used-in-industries">
    <h2>Used in these industries</h2>
    <p class="codex-editorial-section-intro">Deployments where this product is referenced on our industry landing pages.</p>
    <div class="codex-related-industries-grid">
      ${cards}
    </div>
  </section>`;
}

/** Render a product card grid for industry landing pages */
function renderIndustryProductGrid(definition: EditorialDefinition): string {
  if (!definition.route.startsWith("/industries/")) return "";

  const category = INDUSTRY_CATEGORIES.find((cat) => cat.href === definition.route);
  if (!category || category.productRoutes.length === 0) return "";

  const cards = category.productRoutes.map((route) => {
    // Try editorial (landing pages) first, then WordPress products
    const editorial = _editorialImageMap.get(route);
    const wpProduct = _wpProductImageMap.get(route);
    const name = editorial?.title
      ?? wpProduct?.title
      ?? route.split("/").filter(Boolean).pop()?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      ?? route;
    const shortName = name.length > 50 ? name.slice(0, 47).trimEnd() + "..." : name;
    const img = editorial?.heroImage ?? wpProduct?.image ?? "";

    return `
      <a href="${escapeAttribute(route)}" class="codex-card codex-card--media codex-industries-cat-card">
        ${img ? `<img src="${escapeAttribute(img)}" alt="${escapeAttribute(shortName)}" loading="lazy">` : `<div class="codex-industries-cat-card__placeholder"></div>`}
        <div class="codex-industries-cat-card__body">
          <h3>${escapeHtml(shortName)}</h3>
          <span class="codex-industries-cat-card__arrow">&rarr;</span>
        </div>
      </a>`;
  }).join("");

  return `
    <section class="codex-industries-cat-products" aria-label="Products for ${escapeAttribute(category.title)}">
      <h2 class="codex-industries-cat-products__title">Featured ${escapeHtml(category.title)} Products</h2>
      <p class="codex-industries-cat-products__sub">Explore our complete range of RFID solutions for ${escapeHtml(category.title.toLowerCase())}.</p>
      <div class="codex-industries-cat-products__grid">${cards}</div>
    </section>`;
}

/**
 * Render a product card grid for a /solutions/<slug>/ sub-page. Auto-driven
 * off the editorial JSON's `imageSourceRoutes` field — same data the hero
 * illustration picker uses — so each solution gets a relevant SKU shortlist
 * without a hand-curated mapping. Reuses the industry product grid styles
 * (.codex-industries-cat-*) so the visual treatment matches.
 */
function renderSolutionProductGrid(definition: EditorialDefinition): string {
  // Hub itself doesn't get this grid (it has the full-section card grid instead).
  if (!/^\/solutions\/[^/]+\/$/.test(definition.route)) return "";
  const routes = definition.imageSourceRoutes ?? [];
  if (routes.length === 0) return "";

  // Prefer the short rail label over the long editorial title for the
  // section heading. Falls back to a slug-derived title if the slug isn't
  // in SOLUTION_HUB_META yet.
  const hubEntry = _solutionsHubData.find((e) => e.route === definition.route);
  const sectionLabel = hubEntry?.label
    ?? definition.route
        .replace(/^\/solutions\//, "")
        .replace(/\/$/, "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

  const cards = routes.map((route) => {
    const editorial = _editorialImageMap.get(route);
    const wpProduct = _wpProductImageMap.get(route);
    const name = editorial?.title
      ?? wpProduct?.title
      ?? route.split("/").filter(Boolean).pop()?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      ?? route;
    const shortName = name.length > 50 ? name.slice(0, 47).trimEnd() + "..." : name;
    const img = editorial?.heroImage ?? wpProduct?.image ?? "";

    return `
      <a href="${escapeAttribute(route)}" class="codex-card codex-card--media codex-industries-cat-card">
        ${img ? `<img src="${escapeAttribute(img)}" alt="${escapeAttribute(shortName)}" loading="lazy">` : `<div class="codex-industries-cat-card__placeholder"></div>`}
        <div class="codex-industries-cat-card__body">
          <h3>${escapeHtml(shortName)}</h3>
          <span class="codex-industries-cat-card__arrow">&rarr;</span>
        </div>
      </a>`;
  }).join("");

  return `
    <section class="codex-industries-cat-products" aria-label="Products for ${escapeAttribute(sectionLabel)}">
      <h2 class="codex-industries-cat-products__title">Featured ${escapeHtml(sectionLabel)} Products</h2>
      <p class="codex-industries-cat-products__sub">SKUs we typically deploy for ${escapeHtml(sectionLabel.toLowerCase())}. Tap a card for specs and samples.</p>
      <div class="codex-industries-cat-products__grid">${cards}</div>
    </section>`;
}

/**
 * Build the floating left rail used by hub pages (/industries/, /solutions/).
 * Mirrors the /products/all/ pattern — each rail entry deep-links to a
 * specific sub-page (NOT an on-page anchor). The list is driven by the
 * relevant *_HUB_META order, joined with editorial JSON to skip slugs that
 * don't have a definition. Hidden below 1280px; opens as a drawer behind a
 * floating toggle on narrow viewports.
 *
 * `sectionLabel` is used in the toggle text, the aside title, and aria
 * labels — pass "Industries", "Solutions", etc.
 */
function renderHubRail(items: HubEntry[], currentRoute: string, sectionLabel: string): string {
  if (items.length === 0) return "";

  const links = items
    .map((entry) => {
      const isActive = entry.route === currentRoute;
      const classAttr = isActive
        ? "codex-industries-rail__link active"
        : "codex-industries-rail__link";
      const ariaCurrent = isActive ? ' aria-current="page"' : "";
      return `<a href="${escapeAttribute(entry.route)}" class="${classAttr}" data-slug="${escapeAttribute(entry.slug)}"${ariaCurrent}>
          <span class="codex-industries-rail__emoji codex-icon" aria-hidden="true">${getIcon(entry.iconSlug)}</span>
          <span class="codex-industries-rail__label">${escapeHtml(entry.label)}</span>
        </a>`;
    })
    .join("");

  const lowerSection = sectionLabel.toLowerCase();
  const railModifier = sectionLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return `
    <button type="button"
            class="codex-catalog-rail-toggle"
            aria-expanded="false"
            aria-controls="codex-catalog-rail-panel"
            aria-label="Show ${escapeAttribute(lowerSection)}">
      <span class="codex-catalog-rail-toggle__icon codex-icon" aria-hidden="true">${getIcon("folder")}</span>
      <span class="codex-catalog-rail-toggle__label">${escapeHtml(sectionLabel)}</span>
    </button>
    <div class="codex-catalog-rail-backdrop" hidden></div>
    <aside id="codex-catalog-rail-panel" class="codex-catalog-rail codex-catalog-rail--${escapeAttribute(railModifier)}" aria-label="${escapeAttribute(sectionLabel)}">
      <button type="button" class="codex-catalog-rail__close" aria-label="Close ${escapeAttribute(lowerSection)}">✕</button>
      <nav class="codex-industries-rail__nav">
        <div class="codex-industries-rail__title">${escapeHtml(sectionLabel)}</div>
        ${links}
      </nav>
    </aside>
    <script>
    (function(){
      var rail = document.getElementById('codex-catalog-rail-panel');
      var toggle = document.querySelector('.codex-catalog-rail-toggle');
      var backdrop = document.querySelector('.codex-catalog-rail-backdrop');
      var closeBtn = rail ? rail.querySelector('.codex-catalog-rail__close') : null;
      if (!rail) return;

      function openRail(){
        rail.classList.add('is-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'true');
        if (backdrop) backdrop.hidden = false;
        document.body.classList.add('codex-catalog-rail-locked');
      }
      function closeRail(){
        rail.classList.remove('is-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
        if (backdrop) backdrop.hidden = true;
        document.body.classList.remove('codex-catalog-rail-locked');
      }
      if (toggle) toggle.addEventListener('click', function(){
        if (rail.classList.contains('is-open')) closeRail(); else openRail();
      });
      if (closeBtn) closeBtn.addEventListener('click', closeRail);
      if (backdrop) backdrop.addEventListener('click', closeRail);
      document.addEventListener('keydown', function(e){
        if (e.key === 'Escape' && rail.classList.contains('is-open')) closeRail();
      });
    })();
    </script>
  `;
}

/**
 * Render a hub card grid — one card per sub-page. Lives directly under the
 * pillar hero so visitors can jump straight into the relevant page without
 * scrolling through the body. Uses the editorial heroImage when available,
 * falling back to an emoji placeholder.
 *
 * `sectionLabel` is used in the section heading and aria label — pass
 * "industries", "solutions", etc. (lower-case noun, the function adds
 * "all N" prefix and "Browse" verb).
 */
function renderHubGrid(items: HubEntry[], sectionLabel: string): string {
  if (items.length === 0) return "";

  const lowerSection = sectionLabel.toLowerCase();
  const sectionId = `${lowerSection.replace(/[^a-z0-9]+/g, "-")}-hub-grid`;
  const introCopy = lowerSection === "industries"
    ? "Pick the vertical closest to your project — each page lists the relevant SKUs, real-world deployments and any compliance notes."
    : `Pick the ${lowerSection.replace(/s$/, "")} closest to your use case — each page covers the relevant SKUs, deployment notes and compatible hardware.`;

  const cards = items
    .map(
      (entry) => `
        <a href="${escapeAttribute(entry.route)}" class="codex-card codex-card--media codex-industries-hub-card">
          <div class="codex-industries-hub-card__media">
            ${entry.heroImage
              ? `<img src="${escapeAttribute(entry.heroImage)}" alt="${escapeAttribute(entry.label)}" loading="lazy" decoding="async">`
              : `<div class="codex-industries-hub-card__placeholder codex-icon" aria-hidden="true">${getIcon(entry.iconSlug)}</div>`}
            <span class="codex-industries-hub-card__emoji codex-icon" aria-hidden="true">${getIcon(entry.iconSlug)}</span>
          </div>
          <div class="codex-industries-hub-card__body">
            <h3 class="codex-industries-hub-card__title">${escapeHtml(entry.label)}</h3>
            <p class="codex-industries-hub-card__summary">${escapeHtml(truncateEditorialText(entry.summary, 140))}</p>
            <span class="codex-industries-hub-card__cta">Explore ${escapeHtml(entry.label)} <span aria-hidden="true">→</span></span>
          </div>
        </a>`,
    )
    .join("");

  return `
    <section class="codex-editorial-section codex-industries-hub-grid" id="${escapeAttribute(sectionId)}" aria-label="All ${escapeAttribute(lowerSection)}">
      <h2>Browse all ${items.length} ${escapeHtml(lowerSection)}</h2>
      <p class="codex-editorial-section-intro">${escapeHtml(introCopy)}</p>
      <div class="codex-industries-hub-grid__list">
        ${cards}
      </div>
    </section>
  `;
}

/**
 * Grouped variant of `renderHubRail`. Same drawer/toggle structure (so the
 * mobile interaction + CSS classes match), but each group renders its own
 * labelled `<div class="codex-industries-rail__group-title">` header
 * followed by the items belonging to that group. Used by /resources/ to keep
 * Guides / Compare / Compatibility visually distinct in a single rail.
 */
function renderGroupedHubRail(groups: GroupedHubData, currentRoute: string, sectionLabel: string): string {
  const totalItems = groups.reduce((sum, g) => sum + g.items.length, 0);
  if (totalItems === 0) return "";

  const groupHtml = groups
    .filter((g) => g.items.length > 0)
    .map((group) => {
      const links = group.items
        .map((entry) => {
          const isActive = entry.route === currentRoute;
          const classAttr = isActive
            ? "codex-industries-rail__link active"
            : "codex-industries-rail__link";
          const ariaCurrent = isActive ? ' aria-current="page"' : "";
          return `<a href="${escapeAttribute(entry.route)}" class="${classAttr}" data-slug="${escapeAttribute(entry.slug)}"${ariaCurrent}>
              <span class="codex-industries-rail__emoji codex-icon" aria-hidden="true">${getIcon(entry.iconSlug)}</span>
              <span class="codex-industries-rail__label">${escapeHtml(entry.label)}</span>
            </a>`;
        })
        .join("");
      return `<div class="codex-industries-rail__group">
          <div class="codex-industries-rail__group-title">
            <span class="codex-industries-rail__group-icon codex-icon" aria-hidden="true">${getIcon(group.iconSlug)}</span>
            ${escapeHtml(group.groupLabel)}
            <span class="codex-industries-rail__group-count">${group.items.length}</span>
          </div>
          ${links}
        </div>`;
    })
    .join("");

  const lowerSection = sectionLabel.toLowerCase();
  const railModifier = sectionLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return `
    <button type="button"
            class="codex-catalog-rail-toggle"
            aria-expanded="false"
            aria-controls="codex-catalog-rail-panel"
            aria-label="Show ${escapeAttribute(lowerSection)}">
      <span class="codex-catalog-rail-toggle__icon codex-icon" aria-hidden="true">${getIcon("folder")}</span>
      <span class="codex-catalog-rail-toggle__label">${escapeHtml(sectionLabel)}</span>
    </button>
    <div class="codex-catalog-rail-backdrop" hidden></div>
    <aside id="codex-catalog-rail-panel" class="codex-catalog-rail codex-catalog-rail--${escapeAttribute(railModifier)} codex-catalog-rail--grouped" aria-label="${escapeAttribute(sectionLabel)}">
      <button type="button" class="codex-catalog-rail__close" aria-label="Close ${escapeAttribute(lowerSection)}">✕</button>
      <nav class="codex-industries-rail__nav">
        <div class="codex-industries-rail__title">${escapeHtml(sectionLabel)}</div>
        ${groupHtml}
      </nav>
    </aside>
    <script>
    (function(){
      var rail = document.getElementById('codex-catalog-rail-panel');
      var toggle = document.querySelector('.codex-catalog-rail-toggle');
      var backdrop = document.querySelector('.codex-catalog-rail-backdrop');
      var closeBtn = rail ? rail.querySelector('.codex-catalog-rail__close') : null;
      if (!rail) return;

      function openRail(){
        rail.classList.add('is-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'true');
        if (backdrop) backdrop.hidden = false;
        document.body.classList.add('codex-catalog-rail-locked');
      }
      function closeRail(){
        rail.classList.remove('is-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
        if (backdrop) backdrop.hidden = true;
        document.body.classList.remove('codex-catalog-rail-locked');
      }
      if (toggle) toggle.addEventListener('click', function(){
        if (rail.classList.contains('is-open')) closeRail(); else openRail();
      });
      if (closeBtn) closeBtn.addEventListener('click', closeRail);
      if (backdrop) backdrop.addEventListener('click', closeRail);
      document.addEventListener('keydown', function(e){
        if (e.key === 'Escape' && rail.classList.contains('is-open')) closeRail();
      });
    })();
    </script>
  `;
}

/**
 * Grouped variant of `renderHubGrid`. Renders one `<section>` per group, each
 * with its own heading + count + grid of cards. Reuses .codex-industries-hub-*
 * card styles so visual treatment matches the flat /industries/ + /solutions/
 * grids. Used on the /resources/ hub to surface all 80+ resources at once,
 * grouped by type so visitors can scan by intent (learn vs. compare vs. integrate).
 */
function renderGroupedHubGrid(groups: GroupedHubData, sectionLabel: string): string {
  const totalItems = groups.reduce((sum, g) => sum + g.items.length, 0);
  if (totalItems === 0) return "";

  const lowerSection = sectionLabel.toLowerCase();
  const sectionId = `${lowerSection.replace(/[^a-z0-9]+/g, "-")}-hub-grid`;

  const groupSections = groups
    .filter((g) => g.items.length > 0)
    .map((group) => {
      const cards = group.items
        .map(
          (entry) => `
            <a href="${escapeAttribute(entry.route)}" class="codex-card codex-card--media codex-industries-hub-card">
              <div class="codex-industries-hub-card__media">
                ${entry.heroImage
                  ? `<img src="${escapeAttribute(entry.heroImage)}" alt="${escapeAttribute(entry.label)}" loading="lazy" decoding="async">`
                  : `<div class="codex-industries-hub-card__placeholder codex-icon" aria-hidden="true">${getIcon(entry.iconSlug)}</div>`}
                <span class="codex-industries-hub-card__emoji codex-icon" aria-hidden="true">${getIcon(entry.iconSlug)}</span>
              </div>
              <div class="codex-industries-hub-card__body">
                <h3 class="codex-industries-hub-card__title">${escapeHtml(entry.label)}</h3>
                <p class="codex-industries-hub-card__summary">${escapeHtml(truncateEditorialText(entry.summary, 140))}</p>
                <span class="codex-industries-hub-card__cta">Read ${escapeHtml(entry.label)} <span aria-hidden="true">→</span></span>
              </div>
            </a>`,
        )
        .join("");
      const groupId = `${sectionId}-${group.groupSlug}`;
      const blurb = group.groupSlug === "guides"
        ? "Long-form technical reference: protocol internals, chip family encyclopedias, integration walkthroughs, regulatory deep-dives."
        : group.groupSlug === "compare"
          ? "Side-by-side picker pages: chip vs chip, frequency band vs band, form-factor vs form-factor — for buyers narrowing a shortlist."
          : "Vendor lock cross-reference: which RFID/NFC card encodes for which OEM lock estate, with chip family + sample-request notes.";
      return `<section class="codex-editorial-section codex-resources-group" id="${escapeAttribute(groupId)}" aria-label="${escapeAttribute(group.groupLabel)}">
        <h2 class="codex-resources-group__title"><span class="codex-resources-group__emoji codex-icon" aria-hidden="true">${getIcon(group.iconSlug)}</span> ${escapeHtml(group.groupLabel)} <span class="codex-resources-group__count">${group.items.length}</span></h2>
        <p class="codex-editorial-section-intro">${escapeHtml(blurb)}</p>
        <div class="codex-industries-hub-grid__list">
          ${cards}
        </div>
      </section>`;
    })
    .join("");

  return `
    <section class="codex-editorial-section codex-industries-hub-grid codex-industries-hub-grid--grouped" id="${escapeAttribute(sectionId)}" aria-label="All ${escapeAttribute(lowerSection)}">
      <h2>Browse all ${totalItems} ${escapeHtml(lowerSection)}</h2>
      <p class="codex-editorial-section-intro">Three ways into the catalog: read the long-form guides, compare two options head-to-head, or look up vendor compatibility. Pick the one that matches where you are in the buying cycle.</p>
      ${groupSections}
    </section>
  `;
}

/**
 * /resources/ hub renderer — 4 large category cards, one per group, mirroring
 * the products summary page (`/industries/`) hub-grid pattern but at a higher
 * abstraction level (one card per category, not one card per leaf). Each card
 * holds a count badge, a one-line summary, a short list of sample leaf links
 * (so visitors get an immediate taste of what's inside), and a "Browse all N
 * <items>" CTA that drops the visitor onto the dedicated category landing
 * page (`/blog/`, `/guides/`, `/compare/`, `/compatibility/`).
 *
 * The leaf-card grid (176 cards) lives on each of those four landing pages,
 * not here — `/resources/` stays at the category-router level.
 */
function renderResourcesCategoryHub(groups: GroupedHubData, sectionLabel: string): string {
  const totalItems = groups.reduce((sum, g) => sum + g.items.length, 0);
  if (totalItems === 0) return "";

  const lowerSection = sectionLabel.toLowerCase();
  const sectionId = `${lowerSection.replace(/[^a-z0-9]+/g, "-")}-hub-grid`;

  const cards = groups
    .filter((g) => g.items.length > 0)
    .map((group) => {
      const groupId = `${sectionId}-${group.groupSlug}`;
      const browseHref = `/${group.groupSlug}/`;
      const itemNoun =
        group.groupSlug === "blog"
          ? "articles"
          : group.groupSlug === "guides"
            ? "guides"
            : group.groupSlug === "compare"
              ? "comparisons"
              : "compatibility pages";
      const blurb =
        group.groupSlug === "blog"
          ? "Industry articles, deployment notes and field reports — written for buyers and integrators in the field."
          : group.groupSlug === "guides"
            ? "Long-form technical reference: protocol internals, chip family encyclopedias, integration walkthroughs, regulatory deep-dives."
            : group.groupSlug === "compare"
              ? "Side-by-side picker pages: chip vs chip, frequency band vs band, form-factor vs form-factor — for buyers narrowing a shortlist."
              : "Vendor lock cross-reference: which RFID/NFC card encodes for which OEM lock estate, with chip family + sample-request notes.";

      const sampleItems = group.items.slice(0, 4);
      const sampleLinks = sampleItems
        .map(
          (entry) =>
            `<li><a href="${escapeAttribute(entry.route)}">${escapeHtml(entry.label)}</a></li>`,
        )
        .join("");

      return `
        <article class="codex-card codex-resources-category-card" id="${escapeAttribute(groupId)}">
          <header class="codex-resources-category-card__header">
            <span class="codex-resources-category-card__emoji codex-icon" aria-hidden="true">${getIcon(group.iconSlug)}</span>
            <div class="codex-resources-category-card__heading">
              <h3 class="codex-resources-category-card__title">${escapeHtml(group.groupLabel)}</h3>
              <p class="codex-resources-category-card__count">${group.items.length} ${itemNoun}</p>
            </div>
          </header>
          <p class="codex-resources-category-card__summary">${escapeHtml(blurb)}</p>
          <ul class="codex-resources-category-card__samples" aria-label="Sample ${escapeAttribute(itemNoun)}">
            ${sampleLinks}
          </ul>
          <a class="codex-resources-category-card__cta" href="${escapeAttribute(browseHref)}">Browse all ${group.items.length} ${escapeHtml(itemNoun)} <span aria-hidden="true">→</span></a>
        </article>`;
    })
    .join("");

  return `
    <section class="codex-editorial-section codex-resources-category-hub" id="${escapeAttribute(sectionId)}" aria-label="Resource categories">
      <h2>Browse the ${groups.filter((g) => g.items.length > 0).length} resource categories</h2>
      <p class="codex-editorial-section-intro">${totalItems} resources across four categories. Pick the one that matches where you are in the buying cycle — read the blog for field stories, guides for technical depth, comparisons for shortlisting, compatibility for vendor lock-in checks.</p>
      <div class="codex-resources-category-hub__grid">
        ${cards}
      </div>
    </section>
  `;
}

function renderEditorialMain(definition: EditorialDefinition, illustration: { src: string; alt: string } | null): string {
  const outline = buildEditorialOutline(definition);

  // Freshness signal — resolveArticleMeta in seo.ts scrapes these <time> tags
  // to populate JSON-LD datePublished / dateModified. Fallback to build-time if missing.
  const published = definition.publishedAt || new Date().toISOString();
  const modified = definition.modifiedAt || published;
  const publishedLabel = new Date(published).toISOString().slice(0, 10);
  const modifiedLabel = new Date(modified).toISOString().slice(0, 10);

  // Industries + Solutions sections opt into the same left-rail pattern that
  // /products/all/ and /blog/ use. The rail appears on the section hub AND on
  // every sub-page so visitors can hop between siblings without backtracking.
  // Each rail entry deep-links to a specific sub-page (NOT an on-page TOC);
  // the entry matching the current route gets an `active` class so the
  // visitor's location is visible. Only the hub also gets the aggregate
  // card grid below the hero.
  const isIndustriesHub = definition.route === "/industries/";
  const isIndustriesPage = isIndustriesHub || /^\/industries\/[^/]+\/$/.test(definition.route);
  const isSolutionsHub = definition.route === "/solutions/";
  const isSolutionsPage = isSolutionsHub || /^\/solutions\/[^/]+\/$/.test(definition.route);
  // Resources hub aggregates Blog + Buying Guides + Product Comparisons +
  // Hotel Lock Compatibility under one rail. The hub gets the grouped card
  // grid; each /blog/<slug>/, /guides/<slug>/, /compare/<slug>/,
  // /compatibility/<slug>/ leaf gets only the rail (so visitors can hop
  // back to the resources hub from any leaf).
  const isResourcesHub = definition.route === "/resources/";
  /* Match `/resources/` itself, the four sub-hub landing pages
     (`/guides/`, `/compare/`, `/compatibility/`, `/blog/`) AND any of their
     leaf pages (`/guides/<slug>/` etc). The optional `([^/]+/)?` captures
     either zero or one path segment after the prefix, so the same regex
     handles both hub and leaf in one match. Per user 2026-04-26 — the
     three editorial hub pages (Buying Guides / Product Comparisons /
     Hotel Lock Compatibility) need the rail just like Blog already has it. */
  const isResourcesPage = isResourcesHub || /^\/(?:blog|guides|compare|compatibility)\/(?:[^/]+\/)?$/.test(definition.route);

  let railHtml = "";
  let hubGridHtml = "";
  if (isIndustriesPage) {
    railHtml = renderHubRail(_industriesHubData, definition.route, "Industries");
    if (isIndustriesHub) hubGridHtml = renderHubGrid(_industriesHubData, "industries");
  } else if (isSolutionsPage) {
    /* DS-9 #4 (2026-04-26) — Switched to grouped rail. The flat 37-item
       rail was the #4 critical issue from the design-critique pass: no
       grouping, no current-page highlight, no visual hierarchy → IA
       failure. renderGroupedHubRail uses the same drawer/toggle CSS so
       responsive behaviour is unchanged. */
    railHtml = renderGroupedHubRail(_solutionsGroupedHubData, definition.route, "Solutions");
    if (isSolutionsHub) hubGridHtml = renderHubGrid(_solutionsHubData, "solutions");
  } else if (isResourcesPage) {
    /* DS-9 2026-04-26 — per-hub rail dispatch. /resources/ keeps the
       cross-family rail (4 sub-hubs); /guides/, /compare/, /compatibility/
       and their leaves get hub-specific drilldown rails so visitors browse
       INTO the topic, not back out to siblings. /blog/* keeps the resources
       rail (it's snapshot-driven; no editorial buckets to group on). */
    if (isResourcesHub) {
      railHtml = renderHubRail(_resourcesRailData, definition.route, "Resources");
      hubGridHtml = renderResourcesCategoryHub(_resourcesHubData, "resources");
    } else if (definition.route.startsWith("/guides/")) {
      railHtml = renderGroupedHubRail(_guidesGroupedRailData, definition.route, "Buying Guides");
    } else if (definition.route.startsWith("/compare/")) {
      railHtml = renderGroupedHubRail(_compareGroupedRailData, definition.route, "Comparisons");
    } else if (definition.route.startsWith("/compatibility/")) {
      railHtml = renderHubRail(_compatibilityRailData, definition.route, "Lock Compatibility");
    } else {
      // /blog/* (snapshot-driven) and any future leaves still get the
      // cross-family Resources rail as a fallback.
      railHtml = renderHubRail(_resourcesRailData, definition.route, "Resources");
    }
  }

  const contentWrapClass = (isIndustriesPage || isSolutionsPage || isResourcesPage)
    ? "content-wrap codex-editorial-pillar--with-rail"
    : "content-wrap";

  return `
    <div class="woocommerce kadence-woo-messages-none-woo-pages woocommerce-notices-wrapper"></div>
    ${railHtml}
    <div class="${contentWrapClass}">
      <article class="entry content-bg single-entry page type-page status-publish hentry codex-editorial-page">
        <div class="entry-content-wrap">
          <div class="entry-content single-content">
            <div class="codex-editorial-dates" hidden aria-hidden="true">
              <time class="entry-date published" datetime="${escapeAttribute(published)}">${escapeHtml(publishedLabel)}</time>
              <time class="updated" datetime="${escapeAttribute(modified)}">${escapeHtml(modifiedLabel)}</time>
            </div>
            ${renderTrail(definition)}
            <section class="codex-editorial-hero" data-page-type="${escapeAttribute(resolvePageType(definition.group))}">
              <div class="codex-editorial-hero-copy">
                <p class="codex-editorial-kicker">${escapeHtml(definition.kicker)}</p>
                <h1>${escapeHtml(definition.title)}</h1>
                <div class="codex-editorial-answer" aria-label="Quick answer">
                  <p class="codex-editorial-answer-label">Quick answer</p>
                  <p class="codex-editorial-summary">${escapeHtml(definition.summary)}</p>
                </div>
                <ul class="codex-editorial-points">
                  ${definition.heroPoints.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                </ul>
                ${definition.group !== "contact" ? `<div class="codex-hero-cta">
                  <a class="codex-hero-cta-btn" data-cta-tier="hero" href="/contact/?intent=samples&amp;route=${escapeAttribute(encodeURIComponent(definition.route))}">Request samples</a>
                  ${(() => {
                    const pillarClusterId = getPillarClusterId(definition.route);
                    if (!pillarClusterId) return "";
                    const label = PILLAR_CLUSTER_LABELS[pillarClusterId];
                    return `<a class="codex-hero-cta-btn codex-hero-cta-btn--ghost" href="/products/all/#${escapeAttribute(pillarClusterId)}" data-pillar-bridge="${escapeAttribute(pillarClusterId)}">Browse all ${escapeHtml(label)} SKUs <span aria-hidden="true">→</span></a>`;
                  })()}
                </div>
                <div class="codex-hero-trust-bar">
                  <span><strong>10+</strong> Years</span>
                  <span><strong>ISO 9001</strong></span>
                  <span><strong>500+</strong> Clients</span>
                  <span><strong>50+</strong> Countries</span>
                </div>` : ""}
              </div>
              ${
                illustration
                  // DS-15 Phase 6 #2 + #6 — width/height intrinsics +
                  // <picture> WebP-first markup. Mirror of
                  // EditorialPage.astro:222. WebP variants live alongside
                  // originals in /landing-images/ (built by
                  // scripts/build-image-variants.py).
                  ? (() => {
                      const imgTag = `<img src="${escapeAttribute(illustration.src)}" alt="${escapeAttribute(illustration.alt)}" width="1200" height="675" loading="eager" fetchpriority="high" decoding="async">`;
                      if (illustration.src.startsWith("/landing-images/")) {
                        const webp = illustration.src.replace(/\.(jpe?g|png)$/i, ".webp");
                        return `<figure class="codex-editorial-figure">
                          <picture>
                            <source srcset="${escapeAttribute(webp)}" type="image/webp">
                            ${imgTag}
                          </picture>
                        </figure>`;
                      }
                      return `<figure class="codex-editorial-figure">${imgTag}</figure>`;
                    })()
                  : ""
              }
            </section>
            ${definition.group === "contact" ? renderContactChannels(definition) : ""}
            ${hubGridHtml}
            ${renderIndustryProductGrid(definition)}
            ${renderSolutionProductGrid(definition)}
            ${renderRelatedIndustriesGrid(definition)}
            ${renderDecisionSnapshot(definition, outline.snapshotId)}
            ${renderJumpNav(outline.jumpLinks)}
            ${(() => {
              // DS-10 #2: build a CitationCtx so any `[^N]` markers in section
              // bodies render as <sup> links into the Sources block. Skipped
              // when the page has no sources.
              const citationCtx: CitationCtx | undefined = outline.sourcesId && (definition.sources?.length ?? 0) > 0
                ? { sourcesId: outline.sourcesId, sourcesCount: definition.sources!.length }
                : undefined;
              return outline.filteredSections
                .map((section, index) => renderSection(section, outline.sectionLinks[index]?.id ?? "section", citationCtx))
                .join("");
            })()}
            ${renderResourceGrid(definition.resourceCards, outline.resourcesId)}
            ${definition.faq.length > 0 && outline.faqId ? renderFaq(definition.faq, outline.faqId) : ""}
            ${outline.sourcesId ? renderSources(definition, outline.sourcesId) : ""}
            ${definition.group !== "contact" ? renderTrustSignals() : ""}
            ${renderInlineRfqForm(definition)}
            ${renderActionBar(definition, outline.nextStepId)}
          </div>
        </div>
      </article>
    </div>
  `;
}

function renderTrail(definition: EditorialDefinition): string {
  const links: EditorialLink[] = [{ href: "/", label: "Home" }];

  if (definition.route.startsWith("/products/rfid-cards/")) {
    links.push({ href: "/products/rfid-cards/", label: "RFID Cards" });
  } else if (definition.route.startsWith("/products/rfid-labels/")) {
    links.push({ href: "/products/rfid-labels/", label: "RFID Labels" });
  } else if (definition.route.startsWith("/products/rfid-tags/")) {
    links.push({ href: "/products/rfid-tags/", label: "RFID Tags" });
  } else if (definition.route.startsWith("/industries/")) {
    links.push({ href: "/industries/hospitality/", label: "Industries" });
  } else if (definition.route.startsWith("/products/rfid-wristbands/")) {
    links.push({ href: "/products/rfid-wristbands/", label: "RFID Wristbands" });
  } else if (definition.route.startsWith("/products/rfid-keyfobs/")) {
    links.push({ href: "/products/rfid-keyfobs/", label: "RFID Keyfobs" });
  } else if (definition.route.startsWith("/products/")) {
    links.push({ href: "/products/all/", label: "Products" });
  } else if (definition.group === "solutions") {
    links.push({ href: "/solutions/", label: "Solutions" });
  } else if (definition.group === "compare") {
    // /compare/, /guides/, /compatibility/, /blog/ have no standalone hub of
    // their own — route through the new aggregate /resources/ hub instead,
    // with a group-specific anchor so the visitor lands at the right band
    // of cards. Labels mirror the dropdown menu wording.
    links.push({ href: "/resources/", label: "Resources" });
    links.push({ href: "/resources/#resources-hub-grid-compare", label: "Product Comparisons" });
  } else if (definition.group === "compatibility") {
    links.push({ href: "/resources/", label: "Resources" });
    links.push({ href: "/resources/#resources-hub-grid-compatibility", label: "Hotel Lock Compatibility" });
  } else if (definition.group === "guides") {
    links.push({ href: "/resources/", label: "Resources" });
    links.push({ href: "/resources/#resources-hub-grid-guides", label: "Buying Guides" });
  } else if (definition.group === "blog") {
    links.push({ href: "/resources/", label: "Resources" });
    links.push({ href: "/resources/#resources-hub-grid-blog", label: "Blog — Industry Articles" });
  } else if (definition.group === "resources") {
    // The /resources/ pillar itself — already a section root, no extra crumb.
    links.push({ href: "/resources/", label: "Resources" });
  } else {
    links.push({ href: "/contact/", label: "Contact" });
  }

  if (!isSectionRoot(definition.route)) {
    /* DS-9 KPI cleanup (2026-04-26) — Breadcrumbs should show a SHORT
       page label, not the full SEO title. Many editorial titles carry a
       chip-spec or compliance suffix after an em-dash / pipe / colon
       (e.g. "RFID Access Control — HID Seos / DESFire EV3 / OSDP v2.2 /
       UL 294 / NIST SP 800-116 PACS") which makes the breadcrumb wrap to
       3+ lines on narrow viewports. Split on the same separators
       _resourcesHubData already uses, then cap at 60 chars to be safe. */
    const shortTitle = definition.title.split(/—|–|\||:/, 1)[0]?.trim() || definition.title;
    const trimmed = shortTitle.length > 60 ? shortTitle.slice(0, 57).trimEnd() + "…" : shortTitle;
    links.push({ href: definition.route, label: trimmed });
  }

  return `<nav class="codex-editorial-trail" aria-label="Breadcrumb">
    ${links
      .map((link, index) =>
        index === links.length - 1
          ? `<span aria-current="page">${escapeHtml(link.label)}</span>`
          : `<a href="${escapeAttribute(link.href)}">${escapeHtml(link.label)}</a>`,
      )
      .join("<span>/</span>")}
  </nav>`;
}

function buildEditorialOutline(definition: EditorialDefinition): {
  snapshotId: string;
  briefId: string | null;
  sectionLinks: Array<{ id: string; label: string }>;
  filteredSections: EditorialSection[];
  resourcesId: string;
  faqId: string | null;
  sourcesId: string | null;
  nextStepId: string;
  jumpLinks: Array<{ id: string; label: string }>;
} {
  const used = new Set<string>();
  const createId = (label: string): string => {
    const base =
      label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "section";
    let candidate = base;
    let suffix = 2;

    while (used.has(candidate)) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
    }

    used.add(candidate);
    return candidate;
  };

  const snapshotId = createId("At a glance");
  const briefId = definition.brief && definition.brief.length > 0 ? createId("Project checklist") : null;
  // Filter out "Where this ... fits" sections — their content is redundant with the snapshot
  const filteredSections = definition.sections.filter(
    (section) => !/^where\s+this\s+/i.test(section.title),
  );
  const sectionLinks = filteredSections.map((section) => ({ id: createId(section.title), label: section.title }));
  const resourcesId = createId("Useful next pages");
  const faqId = definition.faq.length > 0 ? createId("FAQ") : null;
  const sourcesId = definition.sources && definition.sources.length > 0 ? createId("Sources") : null;
  const nextStepId = createId("Next step");
  const jumpLinks = [
    { id: snapshotId, label: "At a glance" },
    ...sectionLinks,
    { id: resourcesId, label: "Useful next pages" },
    ...(faqId ? [{ id: faqId, label: "FAQ" }] : []),
    ...(sourcesId ? [{ id: sourcesId, label: "Sources" }] : []),
    { id: nextStepId, label: "Next step" },
  ];

  return {
    snapshotId,
    briefId,
    sectionLinks,
    filteredSections,
    resourcesId,
    faqId,
    sourcesId,
    nextStepId,
    jumpLinks,
  };
}

function renderJumpNav(links: Array<{ id: string; label: string }>): string {
  if (links.length === 0) {
    return "";
  }

  return `<nav class="codex-editorial-jump-nav" aria-label="On this page">
    <p class="codex-editorial-kicker">On this page</p>
    <div class="codex-editorial-jump-links">
      ${links.map((link) => `<a class="codex-editorial-jump-link" href="#${escapeAttribute(link.id)}">${escapeHtml(link.label)}</a>`).join("")}
    </div>
  </nav>`;
}

function renderDecisionSnapshot(definition: EditorialDefinition, id: string): string {
  const cards = buildDecisionSnapshotCards(definition);

  // Include extra brief fields (beyond the first 2 already in cards) as supplementary items
  const extraBriefFields = (definition.brief ?? []).slice(2);
  const extraBriefHtml = extraBriefFields.length > 0
    ? `<dl class="codex-editorial-brief-grid codex-editorial-brief-grid--extra">
        ${extraBriefFields.map((field) => renderBriefField(field)).join("")}
      </dl>`
    : "";

  return `<section class="codex-editorial-section codex-editorial-snapshot" id="${escapeAttribute(id)}">
    <h2>At a glance</h2>
    <p class="codex-editorial-section-intro">Use these short answers to decide whether this page matches the project before moving into the detail.</p>
    <div class="codex-editorial-snapshot-grid">
      ${cards
        .map(
          (card) => `<article class="codex-card codex-editorial-snapshot-card">
            <p class="codex-editorial-answer-label">${escapeHtml(card.label)}</p>
            <p>${escapeHtml(card.text)}</p>
            ${card.link ? `<a class="codex-editorial-snapshot-link" href="${escapeAttribute(card.link.href)}">${escapeHtml(card.link.label)}</a>` : ""}
          </article>`,
        )
        .join("")}
    </div>
    ${extraBriefHtml}
  </section>`;
}

function buildDecisionSnapshotCards(definition: EditorialDefinition): Array<{ label: string; text: string; link?: EditorialLink }> {
  if (definition.group === "compare") {
    return buildComparisonDecisionSnapshot(definition);
  }

  const cards: Array<{ label: string; text: string; link?: EditorialLink }> = [];
  const primaryField = definition.brief?.[0];
  const secondaryField = definition.brief?.[1];
  const secondarySection = definition.sections[0];

  if (primaryField) {
    cards.push({ label: primaryField.label, text: summarizeBriefField(primaryField) });
  } else if (definition.heroPoints[0]) {
    cards.push({ label: "Key takeaway", text: definition.heroPoints[0] });
  }

  if (secondaryField) {
    cards.push({ label: secondaryField.label, text: summarizeBriefField(secondaryField) });
  } else if (secondarySection) {
    cards.push({ label: secondarySection.title, text: summarizeSection(secondarySection) });
  }

  cards.push({
    label: "Next step",
    text: "Ready to move forward? Start your inquiry to get specific answers for this project.",
    link: definition.primaryAction,
  });

  return cards.slice(0, 3);
}

function buildComparisonDecisionSnapshot(definition: EditorialDefinition): Array<{ label: string; text: string; link?: EditorialLink }> {
  const decisionTable = definition.sections.find((section) => Boolean(section.table))?.table;
  const decidingSection = definition.sections.find((section) => /decides/i.test(section.title));
  const confirmSection = definition.sections.find((section) => /confirm/i.test(section.title));
  const cards: Array<{ label: string; text: string; link?: EditorialLink }> = [];

  if (decisionTable && decisionTable.rows.length > 0) {
    const [firstRow] = decisionTable.rows;
    cards.push({
      label: "Best-fit option",
      text: truncateEditorialText(firstRow.slice(0, 3).join(" - "), 170),
    });
  }

  if (decidingSection) {
    cards.push({
      label: "Fastest decision filter",
      text: summarizeSection(decidingSection),
    });
  }

  cards.push({
    label: "Next step",
    text: confirmSection ? summarizeSection(confirmSection) : "Ready to narrow the options? Start a conversation with the details from this comparison.",
    link: definition.primaryAction,
  });

  return cards.slice(0, 3);
}

function summarizeBriefField(field: EditorialBriefField): string {
  if (field.text) {
    return truncateEditorialText(field.text, 170);
  }

  if (field.items && field.items.length > 0) {
    return truncateEditorialText(field.items.slice(0, 2).join(" "), 170);
  }

  if (field.links && field.links.length > 0) {
    return truncateEditorialText(field.links.slice(0, 2).map((link) => link.label).join(" / "), 170);
  }

  return "Use the checklist below to prepare a clear inquiry before you contact the team.";
}

function summarizeSection(section: EditorialSection): string {
  if (section.intro) {
    return truncateEditorialText(section.intro, 170);
  }

  if (section.paragraphs && section.paragraphs.length > 0) {
    return truncateEditorialText(section.paragraphs[0], 170);
  }

  if (section.bullets && section.bullets.length > 0) {
    return truncateEditorialText(section.bullets.slice(0, 2).join(" "), 170);
  }

  return "Use the section below to choose the best option and what your inquiry should include.";
}

function truncateEditorialText(value: string, limit: number): string {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= limit) {
    return normalized;
  }

  return `${normalized.slice(0, Math.max(0, limit - 1)).trimEnd()}...`;
}

/**
 * Optional citation context passed through the render pipeline so authors can
 * use `[^N]` markers in body text to link a contested claim to source #N in
 * the page's Sources block. DS-10 #2 — turn the sources block from a passive
 * "credentialing badge" at the page bottom into an active in-read trust
 * mechanism.
 */
type CitationCtx = {
  sourcesId: string;
  sourcesCount: number;
};

function renderInlineLinks(text: string, citations?: CitationCtx): string {
  // Convert markdown-style [label](url) to HTML links, escape everything else.
  // Citation markers are rewritten BEFORE escapeHtml so the produced markup
  // survives. We use a temporary token so the inner HTML is reintroduced after
  // escaping the surrounding plain text.
  const CITE_OPEN = "CITEOPEN";
  const CITE_CLOSE = "CITECLOSE";

  let working = text;

  if (citations && citations.sourcesCount > 0) {
    working = working.replace(/\[\^(\d+)\]/g, (match, raw) => {
      const n = Number(raw);
      if (!Number.isInteger(n) || n < 1 || n > citations.sourcesCount) return match;
      return `${CITE_OPEN}${n}${CITE_CLOSE}`;
    });
  }

  let html = escapeHtml(working).replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_match, label, url) => `<a href="${escapeAttribute(url)}">${label}</a>`,
  );

  if (citations) {
    const re = new RegExp(`${CITE_OPEN}(\\d+)${CITE_CLOSE}`, "g");
    html = html.replace(re, (_match, n) => {
      const href = `#${citations.sourcesId}-${n}`;
      return `<sup class="codex-citation"><a href="${escapeAttribute(href)}" aria-label="Citation ${n}, see Sources block">[${n}]</a></sup>`;
    });
  }

  return html;
}

function detectSectionType(title: string): string {
  const lower = title.toLowerCase();
  // Check solution FIRST — "How Proud Tek solves ... challenges" should be green, not red
  if (/solution|how .* solve|how .* help|our approach|how proud tek|what we offer/.test(lower)) return "solution";
  if (/result|case|success|outcome|client|customer .* story|impact|roi/.test(lower)) return "results";
  if (/pain|problem|challenge|issue|common .* face|why .* fail|risk|obstacle/.test(lower)) return "pain";
  return "";
}

function renderSection(section: EditorialSection, id: string, citations?: CitationCtx): string {
  const introHtml = section.intro ? `<p class="codex-editorial-section-intro">${renderInlineLinks(section.intro, citations)}</p>` : "";
  const paragraphsHtml = (section.paragraphs ?? []).map((paragraph) => `<p>${renderInlineLinks(paragraph, citations)}</p>`).join("");
  const bulletsHtml = renderSectionList(section, citations);
  const tableHtml = section.table ? renderTable(section.table) : "";
  const imageHtml = section.image
    ? `<figure class="codex-editorial-figure"><img src="${escapeAttribute(section.image.src)}" alt="${escapeAttribute(section.image.alt)}" loading="lazy" decoding="async"></figure>`
    : "";
  const calloutHtml = section.callout
    ? `<aside class="codex-editorial-callout">
        <strong>${escapeHtml(section.callout.label)}</strong>
        <p>${renderInlineLinks(section.callout.text, citations)}</p>
        ${section.callout.href ? `<a href="${escapeAttribute(section.callout.href)}" class="codex-editorial-callout__link">Learn more <span aria-hidden="true">→</span></a>` : ""}
      </aside>`
    : "";

  const sectionType = detectSectionType(section.title);
  const typeAttr = sectionType ? ` data-section-type="${sectionType}"` : "";

  return `<section class="codex-editorial-section"${typeAttr} id="${escapeAttribute(id)}">
    <h2>${escapeHtml(section.title)}</h2>
    ${introHtml}
    ${imageHtml}
    ${paragraphsHtml}
    ${bulletsHtml}
    ${tableHtml}
    ${calloutHtml}
  </section>`;
}

function renderSectionList(section: EditorialSection, citations?: CitationCtx): string {
  if (!section.bullets || section.bullets.length === 0) {
    return "";
  }

  if (isWorkflowSection(section.title)) {
    return `<ol class="codex-editorial-step-list">
      ${section.bullets
        .map(
          (item, index) => `<li class="codex-editorial-step">
            <span class="codex-editorial-step-index">Step ${index + 1}</span>
            <div class="codex-editorial-step-copy">${renderInlineLinks(item, citations)}</div>
          </li>`,
        )
        .join("")}
    </ol>`;
  }

  return `<ul class="codex-editorial-list">${section.bullets.map((item) => `<li>${renderInlineLinks(item, citations)}</li>`).join("")}</ul>`;
}

function isWorkflowSection(title: string): boolean {
  return /workflow|steps|playbook/i.test(title);
}

function renderBrief(fields: EditorialBriefField[], id: string): string {
  // DS-10 #3 — collapse Brief into <details> by default. Most evaluators
  // arriving at a flagship page want spec → CTA, not 4–6 paragraphs of prose.
  // The body of the Brief stays in the DOM (so search and a11y pick it up)
  // but is closed on first paint. An inline script in BaseLayout auto-opens
  // it when the user came from a long-form context (blog / guides / compare /
  // compatibility) or explicitly requested reading mode via `?reading=true`.
  //
  // Read-time estimate: ~80 words/field × 0.4s = rough 30s per field. Capped
  // at 6 minutes so the label stays believable on long briefs.
  const wordCount = fields.reduce((sum, field) => {
    let n = 0;
    if (field.text) n += field.text.split(/\s+/).length;
    if (field.items) n += field.items.reduce((s, item) => s + item.split(/\s+/).length, 0);
    return sum + n;
  }, 0);
  const minutes = Math.max(1, Math.min(6, Math.round(wordCount / 220)));
  const summaryLabel = `Read the full project checklist (~${minutes} min)`;

  return `<section class="codex-editorial-section codex-editorial-brief" id="${escapeAttribute(id)}" data-collapsible-brief>
    <h2>Project checklist</h2>
    <p class="codex-editorial-section-intro">Use this checklist to write a clear first inquiry and shorten the back-and-forth on samples, pricing, or compatibility.</p>
    <details class="codex-disclosure codex-editorial-brief-details">
      <summary class="codex-disclosure__summary">
        <span class="codex-disclosure__label">${escapeHtml(summaryLabel)}</span>
        <span class="codex-disclosure__hint" aria-hidden="true">${fields.length} field${fields.length === 1 ? "" : "s"}</span>
      </summary>
      <dl class="codex-disclosure__body codex-editorial-brief-grid">
        ${fields.map((field) => renderBriefField(field)).join("")}
      </dl>
    </details>
  </section>`;
}

function renderBriefField(field: EditorialBriefField): string {
  const textHtml = field.text ? `<p>${escapeHtml(field.text)}</p>` : "";
  const itemsHtml =
    field.items && field.items.length > 0
      ? `<ul class="codex-editorial-list">${field.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
      : "";
  const linksHtml =
    field.links && field.links.length > 0
      ? `<div class="codex-editorial-brief-links">
          ${field.links
            .map((link) => `<a class="codex-editorial-brief-link" href="${escapeAttribute(link.href)}">${escapeHtml(link.label)}</a>`)
            .join("")}
        </div>`
      : "";

  return `<div class="codex-card codex-editorial-brief-card">
    <dt>${escapeHtml(field.label)}</dt>
    <dd>
      ${textHtml}
      ${itemsHtml}
      ${linksHtml}
    </dd>
  </div>`;
}

/**
 * Wrap glyph-only cell values (✓ / ✗ / Yes / No / —) in a centered span so
 * the cell meets WCAG 2.5.5 (44×44 touch target) and the symbol stays
 * visually centered. The wrapper carries `data-cell-glyph` so CSS can
 * target it without depending on the literal character. DS-10 #4.
 */
function renderTableCellValue(value: string): string {
  const trimmed = value.trim();
  // Detect a small set of glyphs that act as semantic icons in compare tables.
  // We keep the original character on screen but wrap it for hit-target sizing.
  const glyphMap: Record<string, string> = {
    "✓": "yes",
    "✔": "yes",
    "✗": "no",
    "✘": "no",
    "—": "neutral",
    "–": "neutral",
    "-": "neutral",
    "Yes": "yes",
    "No": "no",
    "N/A": "neutral",
    "n/a": "neutral",
  };
  const glyphKey = glyphMap[trimmed];
  if (glyphKey) {
    const ariaLabel =
      glyphKey === "yes" ? "Supported" : glyphKey === "no" ? "Not supported" : "Not applicable";
    return `<span class="codex-cell-glyph" data-cell-glyph="${glyphKey}" aria-label="${ariaLabel}" role="img">${escapeHtml(trimmed)}</span>`;
  }
  return escapeHtml(value);
}

function renderTable(table: EditorialTable): string {
  // DS-10 #4 — sortable column headers + sticky first column.
  // The first column is row-label (entity being compared); subsequent columns
  // are data the user might want to sort by. We mark the table data-sortable
  // and let the inline script in BaseLayout wire click handlers on
  // <th scope="col">. Initial aria-sort=none on each. The script is a
  // progressive enhancement — without JS the table reads top-to-bottom as
  // authored.
  const headerHtml = table.columns
    .map(
      (column, index) =>
        `<th scope="col" ${index === 0 ? "" : `data-sort-col="${index}" aria-sort="none" tabindex="0" role="columnheader button"`}>` +
        `<span class="codex-th-label">${escapeHtml(column)}</span>` +
        `${index === 0 ? "" : `<span class="codex-th-indicator" aria-hidden="true"></span>`}` +
        `</th>`,
    )
    .join("");
  const rowsHtml = table.rows
    .map((row) => {
      const [first, ...rest] = row;
      return `<tr><th scope="row">${escapeHtml(first)}</th>${rest.map((value) => `<td>${renderTableCellValue(value)}</td>`).join("")}</tr>`;
    })
    .join("");

  return `<div class="codex-scroll-region codex-editorial-table-wrap" tabindex="0" role="region" aria-label="Comparison table — scroll horizontally to see more columns">
    <table class="codex-editorial-table" data-sortable="true">
      <thead><tr>${headerHtml}</tr></thead>
      <tbody>${rowsHtml}</tbody>
    </table>
  </div>`;
}

function renderResourceCard(card: EditorialResourceCard): string {
  return `<section class="codex-card codex-editorial-card">
    <h2>${escapeHtml(card.title)}</h2>
    <p>${escapeHtml(card.description)}</p>
    <div class="codex-editorial-link-list">
      ${card.links
        .map(
          (link) => `<a class="codex-editorial-link-card" href="${escapeAttribute(link.href)}">
            <strong>${escapeHtml(link.label)}</strong>
            ${link.description ? `<span>${escapeHtml(link.description)}</span>` : ""}
          </a>`,
        )
        .join("")}
    </div>
  </section>`;
}

function renderResourceGrid(cards: EditorialResourceCard[], id: string): string {
  return `<section class="codex-editorial-section codex-editorial-resource-shell" id="${escapeAttribute(id)}">
    <h2>Useful next pages</h2>
    <p class="codex-editorial-section-intro">Use these linked product, guide and comparison pages to keep the next click specific and practical.</p>
    <div class="codex-editorial-resource-grid">
      ${cards.map((card) => renderResourceCard(card)).join("")}
    </div>
  </section>`;
}

function renderFaq(faq: EditorialFaq[], id: string): string {
  return `<section class="codex-editorial-section" id="${escapeAttribute(id)}">
    <h2>FAQ</h2>
    <div class="codex-editorial-faq">
      ${faq
        .map(
          (entry) => `<details>
            <summary>${escapeHtml(entry.question)}</summary>
            <p>${escapeHtml(entry.answer)}</p>
          </details>`,
        )
        .join("")}
    </div>
  </section>`;
}

/**
 * renderSources — mirror of SourceList.astro for the legacy HTML-render
 * pathway used by snapshot pages via mergeEditorialPages. JSON-LD citation[]
 * emission for these pages is handled in editorial-authority-ld.ts and is NOT
 * duplicated here.
 */
function renderSources(definition: EditorialDefinition, id: string): string {
  const sources = definition.sources ?? [];
  if (sources.length === 0) return "";

  const formatDate = (iso: string | undefined): string | null => {
    if (!iso) return null;
    try {
      const d = new Date(iso.length === 4 ? `${iso}-01-01` : iso);
      if (Number.isNaN(d.getTime())) return iso;
      return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return iso;
    }
  };

  const displayHost = (url: string): string => {
    try {
      return new URL(url).host.replace(/^www\./, "");
    } catch {
      return url;
    }
  };

  const items = sources
    .map((src, index) => {
      const pub = src.publisher ? src.publisher : displayHost(src.url);
      const published = formatDate(src.publishedAt);
      const accessed = formatDate(src.accessedAt);
      const note = src.note ? `<p class="codex-sources-note">${escapeHtml(src.note)}</p>` : "";
      // DS-10 #2: each <li> gets a stable id (`<sourcesId>-<1-based>`) so an
      // inline `[^N]` marker can deep-link to it. Also adds tabindex=-1 so a
      // keyboard user landing here via the sup link gets a focus outline.
      const itemId = `${id}-${index + 1}`;
      return `<li id="${escapeAttribute(itemId)}" class="codex-sources-item" tabindex="-1">
        <span class="codex-sources-num" aria-hidden="true">${index + 1}.</span>
        <a class="codex-sources-link" href="${escapeAttribute(src.url)}" rel="noopener external" target="_blank">${escapeHtml(src.label)}</a>
        <span class="codex-sources-meta">
          <span class="codex-sources-publisher">${escapeHtml(pub)}</span>${published ? ` <span class="codex-sources-date"> · ${escapeHtml(published)}</span>` : ""}${accessed ? ` <span class="codex-sources-accessed"> · accessed ${escapeHtml(accessed)}</span>` : ""}
        </span>${note}
      </li>`;
    })
    .join("");

  return `<section id="${escapeAttribute(id)}" class="codex-sources" aria-labelledby="${escapeAttribute(id)}-heading">
    <h2 id="${escapeAttribute(id)}-heading" class="codex-sources-heading">Sources &amp; references</h2>
    <p class="codex-sources-lead">Primary standards, OEM datasheets and regulatory documents cited by this article. All URLs were verified on the access date shown below.</p>
    <ol class="codex-sources-list">${items}</ol>
  </section>`;
}

function renderTrustSignals(): string {
  return `<section class="codex-trust-signals">
    <div class="codex-trust-stats">
      <div class="codex-trust-stat">
        <strong>10+</strong>
        <span>Years RFID Manufacturing</span>
      </div>
      <div class="codex-trust-stat">
        <strong>ISO 9001</strong>
        <span>Certified Factory</span>
      </div>
      <div class="codex-trust-stat">
        <strong>500+</strong>
        <span>Enterprise Clients</span>
      </div>
      <div class="codex-trust-stat">
        <strong>50+</strong>
        <span>Countries Served</span>
      </div>
    </div>
    <p class="codex-trust-note">Proud Tek is a Shenzhen-based RFID &amp; NFC manufacturer supplying hotel chains, transit operators, event venues and retail brands worldwide. Every order includes free samples, RF testing and dedicated project support.</p>
  </section>`;
}

function renderContactChannels(definition: EditorialDefinition): string {
  // Use the page-specific mailto if primaryAction is one; otherwise build a default
  // tied to this routing page's title.
  const primary = definition.primaryAction;
  const mailtoFromPrimary =
    primary && typeof primary.href === "string" && primary.href.toLowerCase().startsWith("mailto:")
      ? primary.href
      : null;
  const fallbackSubject = encodeURIComponent(`Inquiry: ${definition.title}`);
  const fallbackBody = encodeURIComponent(
    `Hi Proud Tek,\n\nI'm reaching out via the ${definition.kicker} contact route about: ${definition.title}\n\nProject details:\n- Application:\n- Chip / frequency requirement:\n- Quantity:\n- Target date:\n\nThanks`,
  );
  const mailtoHref = mailtoFromPrimary ?? `mailto:info@proudtek.com?subject=${fallbackSubject}&body=${fallbackBody}`;

  // Phone / WhatsApp number kept consistent with the global contact page and footer.
  const phoneDisplay = "+86 186 6582 0632";
  const phoneHref = "tel:+8618665820632";
  const whatsappHref = "https://wa.me/8618665820632";

  // Inline SVG icons (stroke-based, sized to fit the 40px circle).
  const iconEmail = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>`;
  const iconPhone = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92Z"/></svg>`;
  const iconWhatsApp = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 1 1-3.86-7.13L21 3l-1.37 3.86A8.46 8.46 0 0 1 21 11.5Z"/><path d="M8.5 9.5c.5 2 2 3.5 4 4l1-1c.4-.4 1-.5 1.5-.3l1.5.6c.3.13.5.43.5.77V15a1 1 0 0 1-1 1c-4.42 0-8-3.58-8-8a1 1 0 0 1 1-1h.43c.34 0 .64.2.77.5l.6 1.5c.2.5.1 1.1-.3 1.5l-1 1Z"/></svg>`;
  const iconForm = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;

  return `<section class="codex-editorial-channels" aria-label="How to contact us about ${escapeAttribute(definition.kicker)}">
    <div class="codex-editorial-channels__head">
      <p class="codex-editorial-kicker">How to reach us</p>
      <h2>Three ways to start this ${escapeHtml(definition.kicker.toLowerCase())} conversation</h2>
      <p class="codex-editorial-channels__lede">Pick whichever channel fits your team. Email opens with the recommended subject and project checklist already filled in for this route.</p>
    </div>
    <div class="codex-editorial-channels__grid">
      <a class="codex-editorial-channel" href="${escapeAttribute(mailtoHref)}">
        <span class="codex-editorial-channel__icon" aria-hidden="true">${iconEmail}</span>
        <span class="codex-editorial-channel__body">
          <span class="codex-editorial-channel__label">Email</span>
          <span class="codex-editorial-channel__value">info@proudtek.com</span>
          <span class="codex-editorial-channel__hint">Opens prefilled with the ${escapeHtml(definition.kicker.toLowerCase())} brief <span aria-hidden="true">→</span></span>
        </span>
      </a>
      <a class="codex-editorial-channel" href="${escapeAttribute(phoneHref)}">
        <span class="codex-editorial-channel__icon" aria-hidden="true">${iconPhone}</span>
        <span class="codex-editorial-channel__body">
          <span class="codex-editorial-channel__label">Phone</span>
          <span class="codex-editorial-channel__value">${escapeHtml(phoneDisplay)}</span>
          <span class="codex-editorial-channel__hint">Mon–Fri, 9:00–18:00 (UTC+8)</span>
        </span>
      </a>
      <a class="codex-editorial-channel" href="${escapeAttribute(whatsappHref)}" target="_blank" rel="noopener">
        <span class="codex-editorial-channel__icon" aria-hidden="true">${iconWhatsApp}</span>
        <span class="codex-editorial-channel__body">
          <span class="codex-editorial-channel__label">WhatsApp</span>
          <span class="codex-editorial-channel__value">${escapeHtml(phoneDisplay)}</span>
          <span class="codex-editorial-channel__hint">Fastest for quick spec checks</span>
        </span>
      </a>
      <a class="codex-editorial-channel codex-editorial-channel--alt" href="/contact/">
        <span class="codex-editorial-channel__icon" aria-hidden="true">${iconForm}</span>
        <span class="codex-editorial-channel__body">
          <span class="codex-editorial-channel__label">Contact form</span>
          <span class="codex-editorial-channel__value">Send a structured brief</span>
          <span class="codex-editorial-channel__hint">Use the main form on /contact/ <span aria-hidden="true">→</span></span>
        </span>
      </a>
    </div>
  </section>`;
}

function renderInlineRfqForm(definition: EditorialDefinition): string {
  // DS-11 #5a — full a11y rebuild. Each field gets a real <label>, the
  // placeholder is dropped (placeholders disappear on focus and don't
  // satisfy WCAG 3.3.2 Labels or Instructions). Required fields are
  // marked with HTML5 `required` + `aria-required="true"` and linked to a
  // sibling hint via `aria-describedby`. Each input has an empty error
  // container with `role="alert" aria-live="polite"` that the form
  // enhancement script in BaseLayout fills on validation. The form itself
  // is data-codex-rfq so the script can opt in cleanly.
  const productName = escapeAttribute(definition.title);
  // Generate a per-form id prefix so multiple forms on the same page (rare
  // but possible) don't collide on input IDs.
  const seed = (definition.route || "rfq")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 32) || "rfq";

  const field = (name: string, opts: {
    type: string;
    label: string;
    hint: string;
    required?: boolean;
    rows?: number;
    autocomplete?: string;
    inputmode?: string;
  }): string => {
    const id = `codex-rfq-${seed}-${name}`;
    const hintId = `${id}-hint`;
    const errId = `${id}-error`;
    const reqMark = opts.required
      ? ` <span class="codex-rfq-required" aria-hidden="true">*</span>`
      : "";
    const reqAttrs = opts.required ? ` required aria-required="true"` : "";
    const ac = opts.autocomplete ? ` autocomplete="${opts.autocomplete}"` : "";
    const im = opts.inputmode ? ` inputmode="${opts.inputmode}"` : "";
    const control = opts.type === "textarea"
      ? `<textarea id="${id}" name="${name}" rows="${opts.rows ?? 3}"${reqAttrs} aria-describedby="${hintId} ${errId}"></textarea>`
      : `<input id="${id}" name="${name}" type="${opts.type}"${reqAttrs} aria-describedby="${hintId} ${errId}"${ac}${im} />`;
    return `<div class="codex-inline-rfq-field">
      <label for="${id}" class="codex-inline-rfq-label">${escapeHtml(opts.label)}${reqMark}</label>
      <span id="${hintId}" class="codex-inline-rfq-hint">${escapeHtml(opts.hint)}</span>
      ${control}
      <span id="${errId}" class="codex-inline-rfq-error" role="alert" aria-live="polite"></span>
    </div>`;
  };

  return `<section class="codex-inline-rfq">
    <h2>Get a Quick Quote</h2>
    <p>Tell us about your project and we'll respond within one business day. Fields marked <span class="codex-rfq-required" aria-hidden="true">*</span><span class="codex-sr-only">(asterisk)</span> are required.</p>
    <form action="https://formspree.io/f/xlgorlog" method="POST" class="codex-inline-rfq-form" data-codex-rfq novalidate>
      <input type="hidden" name="_subject" value="Inquiry: ${productName}" />
      <input type="hidden" name="product" value="${productName}" />
      <div class="codex-inline-rfq-row">
        ${field("email", { type: "email", label: "Your email", hint: "We'll only use this to reply to your inquiry.", required: true, autocomplete: "email", inputmode: "email" })}
        ${field("company", { type: "text", label: "Company name", hint: "Optional, but helps us route your inquiry faster.", autocomplete: "organization" })}
      </div>
      <div class="codex-inline-rfq-row">
        ${field("quantity", { type: "text", label: "Quantity", hint: "e.g. 5,000 pcs", inputmode: "numeric" })}
        ${field("application", { type: "text", label: "Application", hint: "e.g. hotel, event, asset tracking" })}
      </div>
      ${field("message", { type: "textarea", label: "Additional details", hint: "Chip preference, timeline, special requirements...", rows: 3 })}
      <button type="submit" class="codex-inline-rfq-submit">Send Inquiry</button>
    </form>
  </section>`;
}

function renderActionBar(definition: EditorialDefinition, id: string): string {
  const heading = definition.group === "contact" ? "Send your project details" : "Ready to discuss your project?";
  const description =
    definition.group === "contact"
      ? "The main button opens a prefilled email for this route. Use it if the project already fits, or keep reviewing the linked product and reference pages first."
      : "Use the contact route when you are ready for pricing, samples, or compatibility help, or continue into the linked product and comparison pages below.";

  const mailtoSubject = encodeURIComponent(`Inquiry: ${definition.title}`);
  const mailtoBody = encodeURIComponent(`Hi Proud Tek,\n\nI'm interested in: ${definition.title}\n\nProject details:\n- Application:\n- Chip / frequency requirement:\n- Quantity:\n- Target date:\n\nPlease advise on next steps.\n\nThanks`);
  const mailtoHref = `mailto:info@proudtek.com?subject=${mailtoSubject}&body=${mailtoBody}`;

  return `<section class="codex-editorial-action-bar" id="${escapeAttribute(id)}">
    <div>
      <p class="codex-editorial-kicker">Next step</p>
      <h2>${escapeHtml(heading)}</h2>
      <p>${escapeHtml(description)}</p>
    </div>
    <div class="codex-editorial-action-links">
      <a class="codex-editorial-primary" data-cta-tier="action" href="${escapeAttribute(buildIntentHref(definition.primaryAction.href, "quote", definition.route))}">${escapeHtml(definition.primaryAction.label)}</a>
      <a class="codex-editorial-secondary" href="${escapeAttribute(mailtoHref)}">✉ Email inquiry directly</a>
      ${definition.secondaryActions
        .map((link) => `<a class="codex-editorial-secondary" href="${escapeAttribute(link.href)}">${escapeHtml(link.label)}</a>`)
        .join("")}
    </div>
  </section>`;
}

async function resolveIllustration(
  definition: EditorialDefinition,
): Promise<{ src: string; alt: string } | null> {
  if (definition.heroImage) {
    return { src: definition.heroImage, alt: definition.imageAlt };
  }

  for (const route of definition.imageSourceRoutes) {
    let page: SnapshotPage;
    try {
      page = await loadPageFromDisk(route);
    } catch {
      continue;
    }

    const src = findMeaningfulImage(page.bodyHtml);
    if (src) {
      return {
        src,
        alt: definition.imageAlt,
      };
    }
  }

  return null;
}

function findMeaningfulImage(bodyHtml: string): string | null {
  const $ = load(`<body>${bodyHtml}</body>`);
  const candidates = $(
    ".woocommerce-product-gallery__image img, .entry-content img, .post-thumbnail img, main img, img",
  ).toArray();

  for (const element of candidates) {
    const src = cleanText(
      $(element).attr("data-large_image") ??
        $(element).attr("data-src") ??
        $(element).attr("src") ??
        "",
    );

    if (!src || /logo|icon|emoji|flag|avatar/i.test(src)) {
      continue;
    }

    return src;
  }

  return null;
}

function isSectionRoot(route: string): boolean {
  return (
    route === "/solutions/" ||
    route === "/compare/" ||
    route === "/compatibility/" ||
    route === "/guides/" ||
    route === "/contact/" ||
    EDITORIAL_OVERRIDE_ROUTES.has(route)
  );
}

function resolvePageType(group: EditorialGroup): string {
  switch (group) {
    case "solutions": return "solution";
    case "compare": return "compare";
    case "guides": return "guide";
    case "compatibility": return "compatibility";
    case "contact": return "contact";
    case "products": return "product";
    case "resources": return "resources";
    default: return "";
  }
}

function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/**
 * Tag a CTA href with `?intent=samples|quote|engineering` so the contact-form
 * landing page can pre-select the right form variant and analytics can attribute
 * conversions to a tier (DS-10 #1 — three-tier CTA differentiation).
 *
 * Preserves an existing query string and any hash. Skips off-site / mailto / tel
 * hrefs since intent tagging only makes sense for our own contact route.
 */
function buildIntentHref(href: string, intent: "samples" | "quote" | "engineering", route?: string): string {
  if (!href) return href;
  if (/^(mailto:|tel:|https?:|\/\/)/i.test(href) && !href.startsWith("/")) return href;
  const [pathAndQuery, hash = ""] = href.split("#", 2);
  const [path, existingQuery = ""] = pathAndQuery.split("?", 2);
  const params = new URLSearchParams(existingQuery);
  if (!params.has("intent")) params.set("intent", intent);
  if (route && !params.has("route")) params.set("route", route);
  const query = params.toString();
  return `${path}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value: string): string {
  return escapeHtml(value);
}

import { load } from "cheerio";
import { getCollection } from "astro:content";

import type { SiteData, SnapshotPage } from "./site-data";
import { loadPageFromDisk } from "./site-data";
import { INDUSTRY_CATEGORIES } from "./catalog-pages";

// editorial-pages.ts is now data-and-helpers only (Stage 3 cutover complete,
// 2026-05-12). All `render*` template-literal functions were deleted in the
// post-cutover cleanup pass — Astro shadow components are the sole render
// path. This module keeps the data layer: mergeEditorialPages, hub data,
// scaffold builder, decision-snapshot builder, intent-href helper, etc.
// See docs/architecture/editorial-stage-3-cutover-memo.md for the full
// rationale and migration story.
import {
  // text + summary helpers (still used by decision-snapshot builders)
  truncateEditorialText,
  summarizeBriefField,
  summarizeSection,
  // types
  type EditorialGroup,
  type EditorialLink,
  type EditorialDefinition,
} from "./editorial-types";
import { resolveChipPlaceholdersDeep } from "./chip-placeholders";

export type { EditorialGroup, EditorialDefinition };

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

/**
 * Route → definition index, populated when loadEditorialDefinitions() first
 * resolves — i.e. during getSiteData(), before any page render. Gives
 * synchronous consumers (seo/jsonld.ts via editorial-authority-ld.ts's
 * hasAuthorityArticle()) route-level access to editorial definitions.
 * Same populate-once pattern as EDITORIAL_KEYWORDS_MAP below.
 */
export const EDITORIAL_ROUTE_INDEX: Map<string, EditorialDefinition> = new Map();

export async function loadEditorialDefinitions(): Promise<EditorialDefinition[]> {
  if (_editorialDefsCache) return _editorialDefsCache;
  const entries = await getCollection("editorial");
  const active = entries
    .filter((e) => !e.id.startsWith("_unused/"))
    .map((e) => e.data as unknown as EditorialDefinition);
  _editorialDefsCache = active.map((d) => normalizeEditorialDefinition(d));
  EDITORIAL_ROUTE_INDEX.clear();
  for (const def of _editorialDefsCache) {
    EDITORIAL_ROUTE_INDEX.set(def.route, def);
  }
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
  "/products/rfid-labels/",
  "/products/rfid-tags/",
  "/products/rfid-cards/",
  "/products/rfid-wristbands/",
  "/products/rfid-keyfobs/",
  "/products/rfid-readers/",
  "/industries/",
  "/resources/",
  // /about/ hub: WP snapshot replaced by src/content/editorial/about.json
  // (B2B procurement-focused rewrite, 2026-05-12).
  "/about/",
]);

/**
 * Route-pattern overrides — same intent as EDITORIAL_OVERRIDE_ROUTES but
 * matches a family of routes by regex instead of exact URL. Used for the
 * 15+ /industries/<slug>/ pages whose WP snapshots predate the editorial
 * pillar rewrite (and therefore lack the left rail). Any pattern listed
 * here forces the editorial JSON to replace the on-disk snapshot.
 */
const EDITORIAL_OVERRIDE_PATTERNS: RegExp[] = [
  /^\/industries\/[^/]+\/$/,
  /^\/solutions\/[^/]+\/$/,
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
export const PILLAR_CLUSTER_LABELS: Record<string, string> = {
  "rfid-cards": "RFID Cards",
  "rfid-keyfobs": "RFID Keyfobs",
  "rfid-labels": "RFID Labels",
  "rfid-readers": "RFID Readers",
  "rfid-tags": "RFID Tags",
  "rfid-wristbands": "RFID Wristbands",
};

export function getPillarClusterId(route: string): string | null {
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

/**
 * Hub & landing heroes stack the illustration UNDER the title instead of
 * inheriting the product hero's image-left / copy-right split. That split is
 * intended for individual product SKU pages only (user-requested 2026-06-11);
 * the pillar-style hub and landing pages read better as a single column with
 * the banner directly under the H1 — matching the /industries/ hub, which was
 * switched to `heroLayout: "stacked"` on 2026-07-06.
 *
 * Keyed on group + route prefix so every current AND future page in these
 * sections inherits the stacked layout automatically (no per-file JSON edits).
 * Scoped to `group === "products"` because that's the only page type the split
 * CSS targets (`[data-page-type="product"]`); other groups never split, so
 * defaulting them would be a no-op. An explicit `heroLayout` in the editorial
 * JSON always wins. Scope confirmed with the site owner 2026-07-07: industries
 * + markets + landing pages stack; /products/ SKU and category pages keep the
 * split.
 */
const STACKED_HERO_ROUTE_PREFIXES = ["/industries/", "/markets/", "/lp/"] as const;

function defaultHeroLayout(
  definition: EditorialDefinition,
): EditorialDefinition["heroLayout"] {
  if (definition.group !== "products") return undefined;
  return STACKED_HERO_ROUTE_PREFIXES.some((prefix) => definition.route.startsWith(prefix))
    ? "stacked"
    : undefined;
}

export function normalizeEditorialDefinition(definition: EditorialDefinition): EditorialDefinition {
  // Resolve {chip:slug:field} placeholders against src/data/chip-specs.json BEFORE
  // any other normalization. This guarantees every downstream component sees
  // verified chip-spec text. Pages can use placeholders in any string field
  // (brief.text, brief.items, section.text, dataHighlight.text, etc.) and the
  // schema is the single source of truth.
  const resolved = resolveChipPlaceholdersDeep(definition);
  const primaryAction = rewriteEditorialLink(resolved.primaryAction);
  const secondaryActions = rewriteEditorialSecondaryActions(resolved, primaryAction);

  return {
    ...resolved,
    // Hub/landing pages (industries, markets, lp) stack their hero; product
    // SKU/category pages keep the image-left split. Explicit JSON wins.
    heroLayout: resolved.heroLayout ?? defaultHeroLayout(resolved),
    brief: resolved.brief?.map((field) =>
      field.links && field.links.length > 0
        ? {
            ...field,
            links: rewriteEditorialLinks(field.links),
          }
        : field,
    ),
    resourceCards: resolved.resourceCards.map((card) => ({
      ...card,
      links: rewriteEditorialLinks(card.links),
    })),
    primaryAction: {
      ...primaryAction,
      label: EDITORIAL_PRIMARY_ACTION_LABELS[resolved.route] ?? primaryAction.label,
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

  /* Populate per-cluster product SKU grids. Each PILLAR_CLUSTER_LABELS
     cluster gets an ordered HubEntry[] of every editorial product
     definition whose route matches /products/<cluster>/<slug>/. The
     pillar page hub-grid section then surfaces every SKU in the
     cluster — so visiting /products/rfid-cards/ shows all 27 cards. */
  for (const clusterId of Object.keys(_productsHubDataByCluster)) {
    _productsHubDataByCluster[clusterId].length = 0;
  }
  const PRODUCT_SKU_ROUTE_RE = /^\/products\/([^/]+)\/([^/]+)\/$/;
  for (const def of EDITORIAL_DEFINITIONS) {
    const m = PRODUCT_SKU_ROUTE_RE.exec(def.route);
    if (!m) continue;
    const clusterId = m[1];
    const slug = m[2];
    if (!(clusterId in _productsHubDataByCluster)) continue;

    // Compact card title: prefer the part before " — " / " – " / " | " /
    // " : " for readability, same convention as resources rail.
    const shortTitle = def.title.split(/—|–|\||:/, 1)[0]?.trim() || def.title;
    const label = shortTitle.length > 70 ? shortTitle.slice(0, 67).trimEnd() + "…" : shortTitle;

    _productsHubDataByCluster[clusterId].push({
      slug,
      route: def.route,
      label,
      emoji: "",
      iconSlug: PRODUCT_CLUSTER_ICONS[clusterId] ?? "tag",
      summary: def.summary,
      heroImage: def.heroImage ?? "",
    });
  }
  // Stable alphabetical-by-label order so card grid is predictable.
  for (const clusterId of Object.keys(_productsHubDataByCluster)) {
    _productsHubDataByCluster[clusterId].sort((a, b) => a.label.localeCompare(b.label));
  }

  /* Build the 6-row Products rail. One entry per PILLAR_CLUSTER_LABELS
     cluster, in PRODUCT_RAIL_ORDER. Summary + heroImage are pulled from
     the cluster's _pillar.json definition so the rail tooltip / mobile
     drawer matches what the pillar page shows. */
  _productsRailData.length = 0;
  for (const clusterId of PRODUCT_RAIL_ORDER) {
    const route = `/products/${clusterId}/`;
    const def = EDITORIAL_DEFINITIONS.find((d) => d.route === route);
    const label = PILLAR_CLUSTER_LABELS[clusterId] ?? clusterId;
    _productsRailData.push({
      slug: clusterId,
      route,
      label: `${label} (${(_productsHubDataByCluster[clusterId] ?? []).length})`,
      emoji: "",
      iconSlug: PRODUCT_CLUSTER_ICONS[clusterId] ?? "tag",
      summary: def?.summary ?? "",
      heroImage: def?.heroImage ?? "",
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
    const illustration = await resolveIllustration(definition);
    pages.push({
      route: definition.route,
      sourceUrl: `${siteData.siteOrigin}${definition.route}`,
      title: definition.title,
      htmlAttrs: { ...template.htmlAttrs },
      bodyAttrs: buildBodyAttrs(template.bodyAttrs, definition),
      headHtml,
      bodyHtml: buildBodyHtml(template.bodyHtml, definition, illustration),
      // Stage 3 cutover plumbing — exposed for future env-flag dispatch
      // in route layouts. Default render path still uses bodyHtml above.
      editorialDefinition: definition,
      editorialIllustration: illustration,
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

/**
 * Stage 3 cutover (2026-05-12): empty the WP template's `<main>` so
 * `EditorialPageLayout.astro` can fill it via `<EditorialArticle>`. Returns
 * `templateBodyHtml` unchanged if no `<main>` was found (defensive — WP
 * templates always carry one). The `definition` / `illustration` params are
 * retained for the function signature stability but no longer used here —
 * editorial content rendering moved entirely to the shadow component tree.
 */
function buildBodyHtml(templateBodyHtml: string, _definition: EditorialDefinition, _illustration: { src: string; alt: string } | null): string {
  const $ = load(`<body>${templateBodyHtml}</body>`);
  const main = $("main#main, main.site-main").first();

  if (!main.length) {
    return templateBodyHtml;
  }

  main.empty();
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
export type HubEntry = { slug: string; route: string; label: string; emoji: string; iconSlug: string; summary: string; heroImage: string };
type IndustryHubEntry = HubEntry;
const _industriesHubData: HubEntry[] = [];

/**
 * Per-cluster SKU grids for the 6 product pillar pages.
 * Each value is the ordered list of `/products/<cluster>/<slug>/` SKUs that
 * belong to the cluster, surfaced as a HubGrid on the pillar so the pillar
 * shows ALL its products (catalog discovery from the guide page).
 *
 * Populated in `buildEditorialPages` from EDITORIAL_DEFINITIONS by route
 * prefix. Cluster ids mirror PILLAR_CLUSTER_LABELS.
 */
const _productsHubDataByCluster: Record<string, HubEntry[]> = {
  "rfid-cards": [],
  "rfid-keyfobs": [],
  "rfid-wristbands": [],
  "rfid-labels": [],
  "rfid-readers": [],
  "rfid-tags": [],
};

/** Fallback icon per cluster — used only when a product lacks heroImage. */
const PRODUCT_CLUSTER_ICONS: Record<string, string> = {
  "rfid-cards": "credit-card",
  "rfid-keyfobs": "key",
  "rfid-wristbands": "ticket",
  "rfid-labels": "tag",
  "rfid-readers": "radio",
  "rfid-tags": "tag",
};

/** Display order for the 6-row sticky Products rail used by every
 *  /products/<cluster>/ pillar page and every /products/<cluster>/<slug>/
 *  SKU page. Order is curated rather than alphabetical so the most
 *  prominent product families (Cards → Tags → Labels) sit at the top. */
const PRODUCT_RAIL_ORDER: string[] = [
  "rfid-cards",
  "rfid-tags",
  "rfid-labels",
  "rfid-wristbands",
  "rfid-keyfobs",
  "rfid-readers",
];

/** Populated once per build from PILLAR_CLUSTER_LABELS + each pillar JSON.
 *  Consumed by `buildEditorialScaffold` for pillar + SKU routes. */
const _productsRailData: HubEntry[] = [];

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
export type GroupedHubData = Array<{
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

export function buildDecisionSnapshotCards(definition: EditorialDefinition): Array<{ label: string; text: string; link?: EditorialLink }> {
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






/**
 * Resolve the hero illustration for an editorial page. Pure-data helper —
 * mergeEditorialPages calls this to attach `editorialIllustration` to each
 * SnapshotPage before the layout renders. If the definition declares a
 * `heroImage` directly we use that; otherwise we walk
 * `definition.imageSourceRoutes` and lift the first "meaningful" image
 * (not a logo / icon / avatar) from the matching WP snapshot bodyHtml.
 */
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

/**
 * Breadcrumb-skip predicate. Returns true for routes whose breadcrumb is
 * just "Home / Section" — no third "current page" crumb appended. NOT a
 * duplicate of the canonical `isSectionRoot` in editorial-types.ts; that
 * one classifies hub roots (15 hardcoded routes). This one is breadcrumb-
 * specific and extensible via EDITORIAL_OVERRIDE_ROUTES (product cluster
 * pillars). Renamed and exported during Stage 2 wrap so Trail.astro can
 * share the implementation without name collision.
 */
export function isBreadcrumbSectionRoot(route: string): boolean {
  return (
    route === "/solutions/" ||
    route === "/compare/" ||
    route === "/compatibility/" ||
    route === "/guides/" ||
    route === "/contact/" ||
    EDITORIAL_OVERRIDE_ROUTES.has(route)
  );
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
export function buildIntentHref(href: string, intent: "samples" | "quote" | "engineering", route?: string): string {
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



// ---------------------------------------------------------------------------
// Stage 2 scaffold export — single entry point for EditorialArticle.astro
//
// The shadow `.astro` page composer needs HTML for several blocks that aren't
// worth shadow-componentizing individually (collection-dependent hub/rail
// data; rare-activation product grids; long inline RFQ form; contact-only
// channel grid). Rather than promote each of those private functions plus
// their backing module-private hub data arrays to top-level exports,
// `buildEditorialScaffold(definition)` encapsulates the entire branching
// logic and returns a flat object the .astro component can blit via
// `set:html`. Keeps editorial-pages.ts public API surface minimal while
// still letting the .astro composer reproduce renderEditorialMain output
// byte-for-byte.
// ---------------------------------------------------------------------------

export interface EditorialRelatedIndustryCard {
  href: string;
  title: string;
  description: string;
  heroImage: string;
  emoji: string;
}

export interface EditorialProductGridCard {
  route: string;
  shortName: string;
  img: string;
}

/** Discriminated descriptor for the hub rail block. Null when no rail applies to this route. */
export type EditorialRailDescriptor =
  | { kind: "flat"; items: HubEntry[]; currentRoute: string; sectionLabel: string }
  | { kind: "grouped"; groups: GroupedHubData; currentRoute: string; sectionLabel: string };

/** Discriminated descriptor for the hub-grid block below the hero. Null when not on a hub page. */
export type EditorialHubGridDescriptor =
  | { kind: "flat"; items: HubEntry[]; sectionLabel: string; titleOverride?: string; introOverride?: string }
  | { kind: "resourcesCategory"; groups: GroupedHubData; sectionLabel: string };

export interface EditorialScaffold {
  /** Hub rail descriptor — null when no rail applies. */
  rail: EditorialRailDescriptor | null;
  /** Hub-grid descriptor — null for leaf pages. */
  hubGrid: EditorialHubGridDescriptor | null;
  /** Structured data for the cross-link related-industries grid. Null when not applicable. */
  relatedIndustries: { cards: EditorialRelatedIndustryCard[] } | null;
  /** Structured data for the industries-page product grid. Null when not applicable. */
  industryProductGrid: { categoryTitle: string; cards: EditorialProductGridCard[] } | null;
  /** Structured data for the solutions sub-page product grid. Null when not applicable. */
  solutionProductGrid: { sectionLabel: string; cards: EditorialProductGridCard[] } | null;
  /** True when rail is non-null — used to switch `contentWrapClass` between with-rail and default. */
  hasRail: boolean;
}

function buildRelatedIndustriesData(definition: EditorialDefinition): { cards: EditorialRelatedIndustryCard[] } | null {
  const slugs = definition.relatedIndustries ?? [];
  if (slugs.length === 0) return null;
  if (!/^\/products\/rfid-[a-z]+\/[a-z0-9-]+\/$/.test(definition.route)) return null;

  const entries: EditorialRelatedIndustryCard[] = slugs
    .map((slug): EditorialRelatedIndustryCard | null => {
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
    .filter((c): c is EditorialRelatedIndustryCard => Boolean(c));

  return entries.length === 0 ? null : { cards: entries };
}

function buildProductCard(route: string): EditorialProductGridCard {
  const editorial = _editorialImageMap.get(route);
  const wpProduct = _wpProductImageMap.get(route);
  const name = editorial?.title
    ?? wpProduct?.title
    ?? route.split("/").filter(Boolean).pop()?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    ?? route;
  const shortName = name.length > 50 ? name.slice(0, 47).trimEnd() + "..." : name;
  const img = editorial?.heroImage ?? wpProduct?.image ?? "";
  return { route, shortName, img };
}

function buildIndustryProductGridData(definition: EditorialDefinition): { categoryTitle: string; cards: EditorialProductGridCard[] } | null {
  if (!definition.route.startsWith("/industries/")) return null;
  const category = INDUSTRY_CATEGORIES.find((cat) => cat.href === definition.route);
  if (!category || category.productRoutes.length === 0) return null;
  return {
    categoryTitle: category.title,
    cards: category.productRoutes.map((r) => buildProductCard(r)),
  };
}

function buildSolutionProductGridData(definition: EditorialDefinition): { sectionLabel: string; cards: EditorialProductGridCard[] } | null {
  if (!/^\/solutions\/[^/]+\/$/.test(definition.route)) return null;
  const routes = definition.imageSourceRoutes ?? [];
  if (routes.length === 0) return null;

  const hubEntry = _solutionsHubData.find((e) => e.route === definition.route);
  const sectionLabel = hubEntry?.label
    ?? definition.route
        .replace(/^\/solutions\//, "")
        .replace(/\/$/, "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    sectionLabel,
    cards: routes.map((r) => buildProductCard(r)),
  };
}

export function buildEditorialScaffold(definition: EditorialDefinition): EditorialScaffold {
  const isIndustriesHub = definition.route === "/industries/";
  const isIndustriesPage = isIndustriesHub || /^\/industries\/[^/]+\/$/.test(definition.route);
  const isSolutionsHub = definition.route === "/solutions/";
  const isSolutionsPage = isSolutionsHub || /^\/solutions\/[^/]+\/$/.test(definition.route);
  const isResourcesHub = definition.route === "/resources/";
  const isResourcesPage = isResourcesHub || /^\/(?:blog|guides|compare|compatibility)\/(?:[^/]+\/)?$/.test(definition.route);

  // Product pillar pages: surface every SKU in the cluster as a hub-grid
  // below the hero. Detection mirrors getPillarClusterId() but is inlined
  // here to keep the scaffold function self-contained.
  const productPillarClusterId = getPillarClusterId(definition.route);

  // Product SKU detail pages (/products/<cluster>/<slug>/) get the same
  // sticky rail as the pillar — but the rail's currentRoute highlights
  // the parent pillar so visitors keep their bearings inside a cluster.
  // Matches every leaf product route whose cluster has an authored pillar
  // (PILLAR_CLUSTER_LABELS). Routes outside that whitelist (legacy SKUs
  // we haven't promoted to a cluster, or unrecognised second-level dirs)
  // don't get the rail — they're rare enough that omitting them is safer
  // than producing a rail with an invalid current-route highlight.
  const productSkuMatch = /^\/products\/([^/]+)\/([^/]+)\/$/.exec(definition.route);
  const productSkuClusterId = productSkuMatch && productSkuMatch[1] in PILLAR_CLUSTER_LABELS
    ? productSkuMatch[1]
    : null;

  let rail: EditorialRailDescriptor | null = null;
  let hubGrid: EditorialHubGridDescriptor | null = null;

  if (productPillarClusterId) {
    const items = _productsHubDataByCluster[productPillarClusterId] ?? [];
    const label = PILLAR_CLUSTER_LABELS[productPillarClusterId] ?? productPillarClusterId;
    rail = {
      kind: "flat",
      items: _productsRailData,
      currentRoute: definition.route,
      sectionLabel: "Products",
    };
    hubGrid = {
      kind: "flat",
      items,
      sectionLabel: label.toLowerCase(),
      titleOverride: `Browse all ${items.length} ${label}`,
      introOverride: `Every ${label.replace(/^RFID /, "RFID ").replace(/s$/, "")} SKU we manufacture — click any card for spec sheets, chip options, MOQ and lead times, or send the inquiry form on the right to request a quote across multiple SKUs at once.`,
    };
  } else if (productSkuClusterId) {
    rail = {
      kind: "flat",
      items: _productsRailData,
      currentRoute: `/products/${productSkuClusterId}/`,
      sectionLabel: "Products",
    };
  } else if (isIndustriesPage) {
    rail = { kind: "flat", items: _industriesHubData, currentRoute: definition.route, sectionLabel: "Industries" };
    if (isIndustriesHub) hubGrid = { kind: "flat", items: _industriesHubData, sectionLabel: "industries" };
  } else if (isSolutionsPage) {
    rail = { kind: "grouped", groups: _solutionsGroupedHubData, currentRoute: definition.route, sectionLabel: "Solutions" };
    if (isSolutionsHub) hubGrid = { kind: "flat", items: _solutionsHubData, sectionLabel: "solutions" };
  } else if (isResourcesPage) {
    if (isResourcesHub) {
      rail = { kind: "flat", items: _resourcesRailData, currentRoute: definition.route, sectionLabel: "Resources" };
      hubGrid = { kind: "resourcesCategory", groups: _resourcesHubData, sectionLabel: "resources" };
    } else if (definition.route.startsWith("/guides/")) {
      rail = { kind: "grouped", groups: _guidesGroupedRailData, currentRoute: definition.route, sectionLabel: "Buying Guides" };
    } else if (definition.route.startsWith("/compare/")) {
      rail = { kind: "grouped", groups: _compareGroupedRailData, currentRoute: definition.route, sectionLabel: "Comparisons" };
    } else if (definition.route.startsWith("/compatibility/")) {
      rail = { kind: "flat", items: _compatibilityRailData, currentRoute: definition.route, sectionLabel: "Lock Compatibility" };
    } else {
      // /blog/* and any other resources leaf gets the cross-family Resources rail
      rail = { kind: "flat", items: _resourcesRailData, currentRoute: definition.route, sectionLabel: "Resources" };
    }
  }

  return {
    rail,
    hubGrid,
    relatedIndustries: buildRelatedIndustriesData(definition),
    industryProductGrid: buildIndustryProductGridData(definition),
    solutionProductGrid: buildSolutionProductGridData(definition),
    hasRail: rail !== null,
  };
}

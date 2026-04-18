import { load } from "cheerio";
import { getCollection } from "astro:content";

import type { SiteData, SnapshotPage } from "./site-data";
import { loadPageFromDisk } from "./site-data";
import { INDUSTRY_CATEGORIES } from "./catalog-pages";

export type EditorialGroup = "solutions" | "compare" | "contact" | "compatibility" | "guides" | "blog" | "products";

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

async function loadEditorialDefinitions(): Promise<EditorialDefinition[]> {
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
  "/products/rfid-labels/",
  "/products/rfid-tags/",
  "/products/rfid-cards/",
  "/products/rfid-wristbands/",
  "/products/rfid-keyfobs/",
  "/industries/",
]);

export async function mergeEditorialPages(siteData: SiteData): Promise<SiteData> {
  const extraPages = await buildEditorialPages(siteData);
  const existingIndex = new Map<string, number>();
  siteData.pages.forEach((page, index) => existingIndex.set(page.route, index));
  const pages = [...siteData.pages];

  extraPages.forEach((page) => {
    const existingAt = existingIndex.get(page.route);
    if (existingAt === undefined) {
      pages.push(page);
    } else if (EDITORIAL_OVERRIDE_ROUTES.has(page.route)) {
      // Pillar editorial page replaces the WP snapshot at the cluster root.
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
        <a href="${escapeAttribute(cat.href)}" class="codex-related-industry-card">
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
      <a href="${escapeAttribute(route)}" class="ind-cat-card">
        ${img ? `<img src="${escapeAttribute(img)}" alt="${escapeAttribute(shortName)}" loading="lazy">` : `<div class="ind-cat-card__placeholder"></div>`}
        <div class="ind-cat-card__body">
          <h3>${escapeHtml(shortName)}</h3>
          <span class="ind-cat-card__arrow">&rarr;</span>
        </div>
      </a>`;
  }).join("");

  return `
    <section class="ind-cat-products" aria-label="Products for ${escapeAttribute(category.title)}">
      <h2 class="ind-cat-products__title">Featured ${escapeHtml(category.title)} Products</h2>
      <p class="ind-cat-products__sub">Explore our complete range of RFID solutions for ${escapeHtml(category.title.toLowerCase())}.</p>
      <div class="ind-cat-products__grid">${cards}</div>
    </section>`;
}

function renderEditorialMain(definition: EditorialDefinition, illustration: { src: string; alt: string } | null): string {
  const outline = buildEditorialOutline(definition);

  // Freshness signal — resolveArticleMeta in seo.ts scrapes these <time> tags
  // to populate JSON-LD datePublished / dateModified. Fallback to build-time if missing.
  const published = definition.publishedAt || new Date().toISOString();
  const modified = definition.modifiedAt || published;
  const publishedLabel = new Date(published).toISOString().slice(0, 10);
  const modifiedLabel = new Date(modified).toISOString().slice(0, 10);

  return `
    <div class="woocommerce kadence-woo-messages-none-woo-pages woocommerce-notices-wrapper"></div>
    <div class="content-wrap">
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
                  <a class="codex-hero-cta-btn" href="${escapeAttribute(definition.primaryAction.href)}">${escapeHtml(definition.primaryAction.label)}</a>
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
                  ? `<figure class="codex-editorial-figure">
                      <img src="${escapeAttribute(illustration.src)}" alt="${escapeAttribute(illustration.alt)}" loading="eager" fetchpriority="high" decoding="async">
                    </figure>`
                  : ""
              }
            </section>
            ${renderIndustryProductGrid(definition)}
            ${renderRelatedIndustriesGrid(definition)}
            ${renderDecisionSnapshot(definition, outline.snapshotId)}
            ${renderJumpNav(outline.jumpLinks)}
            ${outline.filteredSections.map((section, index) => renderSection(section, outline.sectionLinks[index]?.id ?? "section")).join("")}
            ${renderResourceGrid(definition.resourceCards, outline.resourcesId)}
            ${definition.faq.length > 0 && outline.faqId ? renderFaq(definition.faq, outline.faqId) : ""}
            ${definition.group !== "contact" ? renderTrustSignals() : ""}
            ${definition.group !== "contact" ? renderInlineRfqForm(definition) : ""}
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
    links.push({ href: "/compare/", label: "Compare" });
  } else if (definition.group === "compatibility") {
    links.push({ href: "/compatibility/", label: "Compatibility" });
  } else if (definition.group === "guides") {
    links.push({ href: "/guides/", label: "Guides" });
  } else if (definition.group === "blog") {
    links.push({ href: "/blog/", label: "Blog" });
  } else {
    links.push({ href: "/contact/", label: "Contact" });
  }

  if (!isSectionRoot(definition.route)) {
    links.push({ href: definition.route, label: definition.title });
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
  const nextStepId = createId("Next step");
  const jumpLinks = [
    { id: snapshotId, label: "At a glance" },
    ...sectionLinks,
    { id: resourcesId, label: "Useful next pages" },
    ...(faqId ? [{ id: faqId, label: "FAQ" }] : []),
    { id: nextStepId, label: "Next step" },
  ];

  return {
    snapshotId,
    briefId,
    sectionLinks,
    filteredSections,
    resourcesId,
    faqId,
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
          (card) => `<article class="codex-editorial-snapshot-card">
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

function renderInlineLinks(text: string): string {
  // Convert markdown-style [label](url) to HTML links, escape everything else
  return escapeHtml(text).replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_match, label, url) => `<a href="${escapeAttribute(url)}">${label}</a>`,
  );
}

function detectSectionType(title: string): string {
  const lower = title.toLowerCase();
  // Check solution FIRST — "How Proud Tek solves ... challenges" should be green, not red
  if (/solution|how .* solve|how .* help|our approach|how proud tek|what we offer/.test(lower)) return "solution";
  if (/result|case|success|outcome|client|customer .* story|impact|roi/.test(lower)) return "results";
  if (/pain|problem|challenge|issue|common .* face|why .* fail|risk|obstacle/.test(lower)) return "pain";
  return "";
}

function renderSection(section: EditorialSection, id: string): string {
  const introHtml = section.intro ? `<p class="codex-editorial-section-intro">${renderInlineLinks(section.intro)}</p>` : "";
  const paragraphsHtml = (section.paragraphs ?? []).map((paragraph) => `<p>${renderInlineLinks(paragraph)}</p>`).join("");
  const bulletsHtml = renderSectionList(section);
  const tableHtml = section.table ? renderTable(section.table) : "";
  const imageHtml = section.image
    ? `<figure class="codex-editorial-figure"><img src="${escapeAttribute(section.image.src)}" alt="${escapeAttribute(section.image.alt)}" loading="lazy" decoding="async"></figure>`
    : "";
  const calloutHtml = section.callout
    ? `<aside class="codex-editorial-callout">
        <strong>${escapeHtml(section.callout.label)}</strong>
        <p>${renderInlineLinks(section.callout.text)}</p>
        ${section.callout.href ? `<a href="${escapeAttribute(section.callout.href)}" class="codex-editorial-callout__link">Learn more →</a>` : ""}
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

function renderSectionList(section: EditorialSection): string {
  if (!section.bullets || section.bullets.length === 0) {
    return "";
  }

  if (isWorkflowSection(section.title)) {
    return `<ol class="codex-editorial-step-list">
      ${section.bullets
        .map(
          (item, index) => `<li class="codex-editorial-step">
            <span class="codex-editorial-step-index">Step ${index + 1}</span>
            <div class="codex-editorial-step-copy">${renderInlineLinks(item)}</div>
          </li>`,
        )
        .join("")}
    </ol>`;
  }

  return `<ul class="codex-editorial-list">${section.bullets.map((item) => `<li>${renderInlineLinks(item)}</li>`).join("")}</ul>`;
}

function isWorkflowSection(title: string): boolean {
  return /workflow|steps|playbook/i.test(title);
}

function renderBrief(fields: EditorialBriefField[], id: string): string {
  return `<section class="codex-editorial-section codex-editorial-brief" id="${escapeAttribute(id)}">
    <h2>Project checklist</h2>
    <p class="codex-editorial-section-intro">Use this checklist to write a clear first inquiry and shorten the back-and-forth on samples, pricing, or compatibility.</p>
    <dl class="codex-editorial-brief-grid">
      ${fields.map((field) => renderBriefField(field)).join("")}
    </dl>
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

  return `<div class="codex-editorial-brief-card">
    <dt>${escapeHtml(field.label)}</dt>
    <dd>
      ${textHtml}
      ${itemsHtml}
      ${linksHtml}
    </dd>
  </div>`;
}

function renderTable(table: EditorialTable): string {
  const headerHtml = table.columns.map((column) => `<th scope="col">${escapeHtml(column)}</th>`).join("");
  const rowsHtml = table.rows
    .map((row) => {
      const [first, ...rest] = row;
      return `<tr><th scope="row">${escapeHtml(first)}</th>${rest.map((value) => `<td>${escapeHtml(value)}</td>`).join("")}</tr>`;
    })
    .join("");

  return `<div class="codex-editorial-table-wrap">
    <table class="codex-editorial-table">
      <thead><tr>${headerHtml}</tr></thead>
      <tbody>${rowsHtml}</tbody>
    </table>
  </div>`;
}

function renderResourceCard(card: EditorialResourceCard): string {
  return `<section class="codex-editorial-card">
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

function renderInlineRfqForm(definition: EditorialDefinition): string {
  const productName = escapeAttribute(definition.title);
  return `<section class="codex-inline-rfq">
    <h2>Get a Quick Quote</h2>
    <p>Tell us about your project and we'll respond within one business day.</p>
    <form action="https://formspree.io/f/xlgorlog" method="POST" class="codex-inline-rfq-form">
      <input type="hidden" name="_subject" value="Inquiry: ${productName}" />
      <input type="hidden" name="product" value="${productName}" />
      <div class="codex-inline-rfq-row">
        <input type="email" name="email" placeholder="Your email *" required />
        <input type="text" name="company" placeholder="Company name" />
      </div>
      <div class="codex-inline-rfq-row">
        <input type="text" name="quantity" placeholder="Quantity (e.g. 5,000 pcs)" />
        <input type="text" name="application" placeholder="Application (e.g. hotel, event)" />
      </div>
      <textarea name="message" rows="3" placeholder="Additional details (chip preference, timeline, special requirements...)"></textarea>
      <button type="submit">Send Inquiry</button>
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
      <a class="codex-editorial-primary" href="${escapeAttribute(definition.primaryAction.href)}">${escapeHtml(definition.primaryAction.label)}</a>
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
    default: return "";
  }
}

function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
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

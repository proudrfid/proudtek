/**
 * Schema.org JSON-LD generators.
 *
 * Builds the `<script type="application/ld+json">` payloads emitted in
 * the page <head>: Organization, WebSite, WebPage, BreadcrumbList,
 * Product, Article, FAQPage, ItemList, HowTo. Drives Google rich
 * results.
 *
 * Extracted from seo.ts during the P2 split (2026-05-08).
 */
import { load } from "cheerio";

import type { SnapshotPage } from "../site-data";
import type { BreadcrumbItem } from "../seo";
import type { PageContext } from "./types";

import {
  SITE_ORIGIN,
  SITE_NAME,
  ORGANIZATION_NAME,
  DEFAULT_DESCRIPTION,
  DEFAULT_IMAGE,
  ORGANIZATION_CONTACT,
  ORGANIZATION_KNOWS_ABOUT,
  ORGANIZATION_SOCIAL,
  ORGANIZATION_ALTERNATE_NAMES,
  ORGANIZATION_OPERATIONS,
  ORGANIZATION_CREDENTIALS,
  COMMERCIAL_TERMS,
} from "../seo-content";

import { EDITORIAL_KEYWORDS_MAP, EDITORIAL_ROUTE_INDEX } from "../editorial-pages";
import { hasAuthorityArticle, isArticleRoute } from "../editorial-authority-ld";
import { PRODUCT_OFFERS_ENABLED, parseTypicalPriceRange, buildProductOffers } from "./product-offer";
import type { EditorialDefinition } from "../editorial-types";
import { isWorkflowSection } from "../editorial-types";

import {
  absoluteUrl,
  cleanText,
  normalizeRoute,
  isCoreSupportKind,
  findProductSpecValue,
  resolveContextSourceLinks,
} from "./utils";

import { buildImageKeywordSet } from "./image-utils";

/* ── Schema keywords ───────────────────────────────────────────── */

export function buildSchemaKeywords(contentTitle: string, route: string): string {
  // Prefer editorial-authored keyword phrases (set in editorial JSON's `keywords` field)
  // over naive title tokenization; avoids garbage like "how, far, can, be" in JSON-LD keywords.
  const authored = EDITORIAL_KEYWORDS_MAP.get(route);
  if (authored && authored.length > 0) {
    return authored.join(", ");
  }
  return Array.from(buildImageKeywordSet(contentTitle, route)).slice(0, 8).join(", ");
}

/* ── Editorial section helpers ─────────────────────────────────── */

export function resolveEditorialSectionLinks(page: SnapshotPage, canonicalUrl: string): BreadcrumbItem[] {
  const $body = load(`<body>${page.bodyHtml}</body>`);

  if ($body(".codex-editorial-jump-nav").length === 0) {
    return [];
  }

  const seen = new Set<string>();
  const entries: BreadcrumbItem[] = [];

  $body(".codex-editorial-jump-link").each((_, element) => {
    const href = cleanText($body(element).attr("href") ?? "");
    const name = cleanText($body(element).text());

    if (!href.startsWith("#") || !name) {
      return;
    }

    const url = new URL(href, canonicalUrl).toString();
    if (seen.has(url)) {
      return;
    }

    seen.add(url);
    entries.push({ name, url });
  });

  return entries;
}

/**
 * Walk the rendered body for the /industries/ pillar and harvest every unique
 * /industries/{slug}/ link with its anchor text. Used to emit a CollectionPage
 * ItemList that names every served vertical as a single structured entity.
 *
 * Added 2026-05-11 — pillar previously emitted no ItemList because the kind
 * check in buildJsonLd excluded "article"/"product" from the home/collection
 * gate. Industries pillar is now "article" kind (page-data.ts) so this
 * function is the dedicated emitter for its child manifest.
 */
export function resolveIndustriesPillarChildren(page: SnapshotPage, canonicalUrl: string): BreadcrumbItem[] {
  const $body = load(`<body>${page.bodyHtml}</body>`);
  const seen = new Set<string>();
  const entries: BreadcrumbItem[] = [];

  $body("a").each((_, element) => {
    const href = cleanText($body(element).attr("href") ?? "");
    const text = cleanText($body(element).text());

    if (!href.startsWith("/industries/") || href === "/industries/" || !text) {
      return;
    }
    // Match only canonical /industries/{slug}/ child routes — skip anchors,
    // query strings, sub-paths.
    if (!/^\/industries\/[a-z0-9-]+\/$/i.test(href)) {
      return;
    }

    const url = new URL(href, canonicalUrl).toString();
    if (seen.has(url)) {
      return;
    }
    seen.add(url);

    // Strip trailing parenthetical descriptors so the schema name is the
    // bare industry label (e.g. "Retail & apparel" not "retail & apparel.
    // Walmart / Target mandate compliance, UHF hang tags, ...").
    const name = text.split(/[.:—–]/, 1)[0]?.trim() || text;
    entries.push({ name, url });
  });

  return entries;
}

export function resolveProductCategory(page: SnapshotPage): string {
  const $body = load(`<body>${page.bodyHtml}</body>`);
  const categories = $body(".posted_in a")
    .toArray()
    .map((element) => cleanText($body(element).text()))
    .filter(Boolean);

  return categories.at(-1) ?? "RFID & NFC Products";
}

/* ── WebPage JSON-LD ───────────────────────────────────────────── */

export function buildWebPageJsonLd(
  context: PageContext,
  pageId: string,
  websiteId: string,
  canonicalPath: string,
  editorialSectionLinks: BreadcrumbItem[],
): Record<string, unknown> {
  const sourceLinks = resolveContextSourceLinks(context);
  const isIndustriesPillar = canonicalPath === "/industries/";
  // Audit 2026-09-02 (Phase 10 SD-16): every company/evidence page under
  // /about/ is an AboutPage (previously only the kind-inferred root was);
  // legal texts stay plain WebPage.
  const isAboutRoute =
    canonicalPath.startsWith("/about/") && !/\/about\/(privacy-policy|terms-of-use)\/$/.test(canonicalPath);
  const type =
    context.kind === "contact"
      ? "ContactPage"
      : context.kind === "about" || isAboutRoute
        ? "AboutPage"
        : context.kind === "collection" || context.kind === "blog" || isIndustriesPillar
          ? "CollectionPage"
          : "WebPage";

  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": pageId,
    url: context.canonicalUrl,
    name: context.contentTitle,
    description: context.description,
    isPartOf: { "@id": websiteId },
    keywords: buildSchemaKeywords(context.contentTitle, canonicalPath),
    image: context.imageGallery.map((entry) => entry.url),
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: context.imageUrl,
      caption: context.imageAlt,
    },
    inLanguage: "en-US",
    ...(editorialSectionLinks.length > 0
      ? {
          about: editorialSectionLinks.slice(0, 8).map((entry) => ({
            "@type": "Thing",
            name: entry.name,
          })),
          hasPart: editorialSectionLinks.map((entry) => ({
            "@type": "WebPageElement",
            "@id": entry.url,
            url: entry.url,
            name: entry.name,
          })),
        }
      : {}),
    ...(sourceLinks.length > 0
      ? {
          citation: sourceLinks.map((entry) => ({
            "@type": "CreativeWork",
            name: entry.name,
            url: entry.url,
          })),
        }
      : {}),
    speakable: {
      "@type": "SpeakableSpecification",
      // Selectors target editorial summary/answer blocks rendered by the
      // Astro component tree. WP-residual selectors (e.g.
      // `.woocommerce-product-details__short-description`) and meta[name]
      // were removed in PR `audit/p0-seo-indexability` — they no longer
      // match anything in the Astro-rendered DOM, and Google Assistant
      // does not narrate <meta> content.
      cssSelector: [
        ".codex-editorial-summary",
        ".codex-editorial-answer",
        ".codex-decision-snapshot",
        ".codex-editorial-faq summary",
      ],
    },
  };
}

/* ── Main JSON-LD builder ──────────────────────────────────────── */

export function buildJsonLd(context: PageContext, page: SnapshotPage): Array<Record<string, unknown>> {
  const organizationId = `${SITE_ORIGIN}/#organization`;
  const websiteId = `${SITE_ORIGIN}/#website`;
  const pageId = `${context.canonicalUrl}#webpage`;
  const canonicalPath = normalizeRoute(new URL(context.canonicalUrl).pathname);
  const editorialSectionLinks = resolveEditorialSectionLinks(page, context.canonicalUrl);
  const entries: Array<Record<string, unknown>> = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": organizationId,
      name: SITE_NAME,
      legalName: ORGANIZATION_NAME,
      url: `${SITE_ORIGIN}/`,
      description: DEFAULT_DESCRIPTION,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(DEFAULT_IMAGE),
      },
      image: absoluteUrl(DEFAULT_IMAGE),
      email: ORGANIZATION_CONTACT.email,
      telephone: ORGANIZATION_CONTACT.telephone,
      knowsAbout: ORGANIZATION_KNOWS_ABOUT,
      areaServed: {
        "@type": "Place",
        name: "Global",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: ORGANIZATION_CONTACT.streetAddress,
        addressLocality: ORGANIZATION_CONTACT.addressLocality,
        addressRegion: ORGANIZATION_CONTACT.addressRegion,
        postalCode: ORGANIZATION_CONTACT.postalCode,
        addressCountry: ORGANIZATION_CONTACT.addressCountry,
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "sales",
          url: absoluteUrl("/contact/"),
          email: ORGANIZATION_CONTACT.email,
          telephone: ORGANIZATION_CONTACT.telephone,
          areaServed: "Worldwide",
          availableLanguage: ["English"],
        },
      ],
      potentialAction: [
        {
          "@type": "CommunicateAction",
          target: absoluteUrl("/contact/"),
          name: "Request RFID product quote",
        },
        {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_ORIGIN}/products/all/?s={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      ],
      // P0-G2: alternate brand spellings + founding/employee facts +
      // expanded sameAs[] for Knowledge Graph entity disambiguation.
      // sameAs filters empty strings so unset social profiles in
      // ORGANIZATION_SOCIAL (LinkedIn, YouTube, …) don't pollute output.
      alternateName: ORGANIZATION_ALTERNATE_NAMES,
      foundingDate: ORGANIZATION_OPERATIONS.foundingDate,
      foundingLocation: {
        "@type": "Place",
        name: ORGANIZATION_OPERATIONS.foundingLocation,
      },
      // numberOfEmployees removed 2026-09-02: the "100+" figure has no
      // documentary basis (Phase 4 K-14 / G-02). Re-add from payroll evidence.
      // sameAs carries identity profiles only — the WhatsApp deep link is a
      // contact channel and lives in contactPoint (Phase 3 §3.6).
      sameAs: Object.entries(ORGANIZATION_SOCIAL)
        .filter(([key, url]) => key !== "whatsapp" && url && url.length > 0)
        .map(([, url]) => url),
      ...(canonicalPath === "/about/certifications/"
        ? {
            // The three management-system certificates on file (PDF in repo,
            // verifiable at cnca.gov.cn). Values are transcribed from the
            // certificate text — scope is "sales service", not manufacturing.
            hasCredential: ORGANIZATION_CREDENTIALS.certifications.map((cert) => ({
              "@type": "EducationalOccupationalCredential",
              credentialCategory: "certification",
              name: cert.name,
              identifier: cert.certificateNumber,
              description: cert.scope,
              validIn: { "@type": "Country", name: "China" },
              validFrom: cert.validFrom,
              validThrough: cert.validThrough,
              recognizedBy: { "@type": "Organization", name: cert.issuer, url: cert.issuerUrl },
            })),
          }
        : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": websiteId,
      url: `${SITE_ORIGIN}/`,
      name: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      inLanguage: "en-US",
      keywords: ORGANIZATION_KNOWS_ABOUT.join(", "),
      publisher: { "@id": organizationId },
    },
  ];

  entries.push(buildWebPageJsonLd(context, pageId, websiteId, canonicalPath, editorialSectionLinks));

  if (context.breadcrumbItems.length > 1) {
    entries.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: context.breadcrumbItems.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    });
  }

  if (context.kind === "product") {
    const material = findProductSpecValue(context.productSpecs, ["Material"]);
    const size = findProductSpecValue(context.productSpecs, ["Size", "Dimensions"]);
    const color = findProductSpecValue(context.productSpecs, ["Color", "Finish"]);
    // Audit 2026-09-02 (Phase 10 SD-2/SD-5/SD-6/SD-7, rules 10-11):
    //  - No `sku` / `productID` / `mpn`: the previous values were derived from
    //    the URL slug ("PT-<SLUG>") or a chip-family label — invented
    //    identifiers, not real part numbers. Re-add only from an owner-
    //    maintained part-number field.
    //  - `name` mirrors the visible <h1>, which EditorialHero.astro renders
    //    from the part of the title before the first ": " / "—" / "–" / "|"
    //    separator (the remainder is the visible deck line).
    //  - No `inLanguage` (not a Product property) and no synthetic `audience`.
    //  - No `offers`: the visible "Typical pricing" ranges are indicative and
    //    not yet evidence-backed (Phase 4 S-05; owner decision 2026-09-02),
    //    so they stay as page text and are not emitted as Offer/AggregateOffer.
    //    `PRODUCT_OFFERS_ENABLED` in ./product-offer.ts is the gate.
    const editorialTitle = EDITORIAL_ROUTE_INDEX.get(canonicalPath)?.title ?? context.contentTitle;
    const visibleH1 = editorialTitle.split(/\s*(?::\s|—|–|\|)\s*/)[0].trim() || context.contentTitle;
    const priceRange = PRODUCT_OFFERS_ENABLED
      ? parseTypicalPriceRange(EDITORIAL_ROUTE_INDEX.get(canonicalPath)?.brief)
      : null;
    const productOffers = buildProductOffers(priceRange, context.canonicalUrl, organizationId);

    entries.push({
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${context.canonicalUrl}#product`,
      name: visibleH1,
      description: context.description,
      image: context.imageGallery.map((entry) => entry.url),
      brand: {
        "@type": "Brand",
        name: SITE_NAME,
      },
      manufacturer: { "@id": organizationId },
      category: resolveProductCategory(page),
      mainEntityOfPage: context.canonicalUrl,
      keywords: buildSchemaKeywords(context.contentTitle, canonicalPath),
      countryOfOrigin: "CN",
      ...(material ? { material } : {}),
      ...(size ? { size } : {}),
      ...(color ? { color } : {}),
      // C-10: standard commercial terms (MOQ / lead time / Incoterms /
      // payment) ride along as PropertyValue entries so machine readers
      // see them without parsing the FAQ. Same constant as the visible
      // CommercialTerms.astro strip — single source of truth.
      additionalProperty: [
        ...context.productSpecs.map((entry) => ({
          "@type": "PropertyValue",
          name: entry.name,
          value: entry.value,
        })),
        ...COMMERCIAL_TERMS.items.map((term) => ({
          "@type": "PropertyValue",
          name: term.label,
          value: term.value,
        })),
      ],
      url: context.canonicalUrl,
      ...(productOffers ? { offers: productOffers } : {}),
    });
  }

  // Skip this Article when the route's editorial definition carries
  // authority signals — the layouts (EditorialPageLayout / SnapshotLayout)
  // append the richer authority Article from editorial-authority-ld.ts for
  // exactly those routes, and emitting both produced two Article entities
  // with the same @id on every editorial page.
  // Audit 2026-09-02 (Phase 10 SD-3): Article only on article-like routes —
  // never on products, landing pages, country pages or the homepage.
  if (context.kind === "article" && context.articleMeta && isArticleRoute(canonicalPath) && !hasAuthorityArticle(canonicalPath)) {
    const authorSchema: Record<string, unknown> = {
      "@type": "Person",
      name: context.articleMeta.authorName,
      url: context.articleMeta.authorUrl,
      ...(context.articleMeta.authorTitle ? { jobTitle: context.articleMeta.authorTitle } : {}),
      ...(context.articleMeta.authorExpertise && context.articleMeta.authorExpertise.length > 0
        ? { knowsAbout: context.articleMeta.authorExpertise }
        : {}),
      worksFor: { "@id": organizationId },
    };

    entries.push({
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${canonicalPath}#article`,
      headline: context.contentTitle,
      description: context.description,
      image: context.imageGallery.map((entry) => entry.url),
      datePublished: context.articleMeta.publishedAt,
      dateModified: context.articleMeta.modifiedAt,
      mainEntityOfPage: context.canonicalUrl,
      author: authorSchema,
      ...(context.articleMeta.reviewedBy
        ? {
            reviewedBy: {
              "@type": "Organization",
              name: context.articleMeta.reviewedBy,
              url: absoluteUrl("/about/"),
            },
          }
        : {}),
      ...(context.articleMeta.lastReviewedDate
        ? { lastReviewed: context.articleMeta.lastReviewedDate }
        : {}),
      articleSection: "RFID & NFC Guides",
      keywords: buildSchemaKeywords(context.contentTitle, canonicalPath),
      publisher: { "@id": organizationId },
      inLanguage: "en-US",
      ...(context.articleSourceLinks.length > 0
        ? {
            citation: context.articleSourceLinks.map((entry) => ({
              "@type": "CreativeWork",
              name: entry.name,
              url: entry.url,
            })),
          }
        : {}),
    });
  }

  if ((isCoreSupportKind(context.kind) || context.kind === "product" || context.kind === "article" || context.kind === "collection" || context.kind === "page") && context.faqEntries.length > 0) {
    entries.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: context.faqEntries.map((entry) => ({
        "@type": "Question",
        name: entry.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: entry.answer,
        },
      })),
    });
  }

  if ((context.kind === "home" || context.kind === "collection" || context.kind === "blog") && context.itemList.length > 0) {
    entries.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: context.itemList.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: item.url,
        name: item.name,
      })),
    });
  }

  // PR-S1-C: VideoObject schema for the homepage hero video. Google
  // Video search uses this for video carousel eligibility. The video
  // src is the WP-snapshot Kadence cover background (preserved by
  // replaceHomepageHero in render-snapshot.ts).
  if (context.kind === "home") {
    // 2026-06-11: points at the 24 s re-encode served by the hero (see
    // render-snapshot.ts videoSrc mapping); duration declared below.
    const HERO_VIDEO_PATH = "/site-assets/wp-content/uploads/2024/08/RFID_production_proudtek-24s.mp4";
    entries.push({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "@id": `${context.canonicalUrl}#hero-video`,
      name: "Proud Tek RFID & NFC Manufacturing — Production Floor",
      description:
        "On-site footage from Proud Tek's Shenzhen facility showing automated RFID & NFC card / tag / label production lines. Two ISO 9001 audited factories, 10 production lines, 305+ pieces of equipment serving 50+ countries.",
      thumbnailUrl: [
        absoluteUrl("/site-assets/wp-content/uploads/2024/08/rfid_factories.jpg"),
      ],
      uploadDate: "2024-08-15",
      duration: "PT24S",
      contentUrl: absoluteUrl(HERO_VIDEO_PATH),
      // No embedUrl — the video plays as a CSS background, not embed.
      publisher: { "@id": organizationId },
      isFamilyFriendly: true,
      inLanguage: "en-US",
    });
  }

  if (editorialSectionLinks.length > 0) {
    entries.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${context.contentTitle} page outline`,
      itemListElement: editorialSectionLinks.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: item.url,
        name: item.name,
      })),
    });
  }

  // Industries pillar ItemList: enumerate every /industries/{slug}/ link in the
  // body so AI search engines (Perplexity, Bing Copilot, ChatGPT Search) can
  // pick up the canonical list of verticals Proud Tek serves as a single
  // structured entity. Without this, the pillar reads as a generic CollectionPage
  // with no child manifest. (Added 2026-05-11.)
  if (canonicalPath === "/industries/") {
    const industryLinks = resolveIndustriesPillarChildren(page, context.canonicalUrl);
    if (industryLinks.length > 0) {
      entries.push({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": `${context.canonicalUrl}#industries`,
        name: "Industries served by Proud Tek RFID & NFC",
        description: "Vertical-specific RFID and NFC landing pages with chip family, compliance regime, MOQ envelope and SKU recommendations.",
        numberOfItems: industryLinks.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: industryLinks.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: item.url,
          name: item.name,
        })),
      });
    }
  }

  // HowTo schema for pages with step-by-step content. Data-driven: walks
  // page.editorialDefinition.sections directly instead of inspecting the
  // rendered DOM (which is now empty in page.bodyHtml since Stage 3 cutover —
  // EditorialPageLayout fills <main> at render time, after this function runs).
  //
  // Step extraction rules (data-source ordered by Google preference):
  //   1. section.timeline.items  → use .text from each item
  //   2. section.bullets + isWorkflowSection(section.title)
  //                              → treat each bullet as a step
  //   3. multiple workflow-titled sections concatenate; Google reads the
  //      whole HowTo as one procedure
  if (context.kind === "article" || context.kind === "collection" || context.kind === "home") {
    const definition = page.editorialDefinition as EditorialDefinition | undefined;
    if (definition && Array.isArray(definition.sections)) {
      const steps: string[] = [];

      for (const section of definition.sections) {
        // timeline variant — every item is a step
        if (section.timeline?.items && Array.isArray(section.timeline.items)) {
          for (const item of section.timeline.items) {
            const text = cleanText(item.text ?? "");
            if (text.length > 10) steps.push(text);
          }
          continue;
        }

        // bullets + workflow title — each bullet is a step
        if (section.bullets && Array.isArray(section.bullets) && isWorkflowSection(section.title)) {
          for (const bullet of section.bullets) {
            const text = cleanText(bullet);
            if (text.length > 10) steps.push(text);
          }
        }
      }

      if (steps.length >= 2) {
        entries.push({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: context.contentTitle,
          description: context.description,
          step: steps.map((text, index) => ({
            "@type": "HowToStep",
            position: index + 1,
            text,
          })),
        });
      }
    }
  }

  return entries;
}

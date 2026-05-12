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
} from "../seo-content";

import { EDITORIAL_KEYWORDS_MAP } from "../editorial-pages";
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
  const type =
    context.kind === "contact"
      ? "ContactPage"
      : context.kind === "about"
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
      cssSelector: [
        ".codex-editorial-summary",
        ".codex-editorial-answer",
        ".woocommerce-product-details__short-description",
        "meta[name='description']",
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
      sameAs: [
        `https://wa.me/${ORGANIZATION_CONTACT.whatsapp.replace(/[^0-9]/g, "")}`,
      ],
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

    entries.push({
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${context.canonicalUrl}#product`,
      name: context.contentTitle,
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
      audience: {
        "@type": "Audience",
        geographicArea: {
          "@type": "Country",
          name: "Global",
        },
      },
      inLanguage: "en-US",
      ...(material ? { material } : {}),
      ...(size ? { size } : {}),
      ...(color ? { color } : {}),
      ...(context.productSpecs.length > 0
        ? {
            additionalProperty: context.productSpecs.map((entry) => ({
              "@type": "PropertyValue",
              name: entry.name,
              value: entry.value,
            })),
          }
        : {}),
      url: context.canonicalUrl,
      offers: {
        "@type": "Offer",
        url: absoluteUrl("/contact/"),
        availability: "https://schema.org/InStock",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "USD",
          description: "Contact for quote — pricing varies by chip, material, quantity and customization",
        },
        seller: { "@id": organizationId },
      },
    });
  }

  if (context.kind === "article" && context.articleMeta) {
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
      // Shared @id with editorial-authority-ld so the two emitter paths
      // describe a single Article entity rather than two duplicates.
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

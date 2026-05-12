/**
 * Page-context builder + per-kind data builders.
 *
 * Owns the data-side of buildPageSeo:
 *   - buildPageContext: the master function that takes a SnapshotPage
 *     + parsed cheerio handles and returns the fully-resolved
 *     PageContext used by buildPageSeo / buildJsonLd downstream.
 *   - Page-kind / title / description / image / FAQ resolvers.
 *   - Per-kind (article / collection / core) summary, guidance,
 *     related-pages, source-links and FAQ builders.
 *   - Small body-extraction utilities (extractContactDetails,
 *     getPreferredHeading, extractMeaningfulParagraphs).
 *   - Date / 404 / collection-description helpers.
 *
 * No cheerio mutation here — these functions only READ from cheerio.
 *
 * Extracted from seo.ts during the P4d-2c split (2026-05-08).
 */
import type { CheerioAPI } from "cheerio";
import { load } from "cheerio";

import type { SiteData, SnapshotPage } from "../site-data";
import { loadPageFromDisk } from "../site-data";

import type {
  BreadcrumbItem,
  FaqEntry,
  ProcurementField,
  PageSeoData,
} from "../seo";
import type { ArticleMeta, ImageSelection, PageContext } from "./types";

import {
  ARTICLE_AUTHOR_MAP,
  ARTICLE_SUPPORT_PROFILES,
  COLLECTION_SUPPORT_PROFILES,
  CORE_SUPPORT_PROFILES,
  DEFAULT_DESCRIPTION,
  DEFAULT_IMAGE,
  EDITORIAL_TEAM_NAME,
  EXPERT_AUTHORS,
  PAGE_DESCRIPTION_OVERRIDES,
  SITE_NAME,
} from "../seo-content";

import {
  type PageKind,
  absoluteUrl,
  cleanText,
  cleanSnapshotTitle,
  escapeRegExp,
  firstSentence,
  formatDisplayDate,
  hostnameToLabel,
  isBoilerplateText,
  isCoreSupportKind,
  normalizeDateTime,
  normalizeRoute,
  resolveCanonicalRoute,
  slugToTitle,
  truncateText,
  uniqueTextEntries,
} from "./utils";

import {
  buildImageKeywordSet,
  buildSpecificImageKeywordSet,
  fallbackImageAlt,
  filenameToTitle,
  getLowValueImagePenalty,
  guessImageAlt,
  isDecorativeImageUrl,
  isPlaceholderImageUrl,
  isTinyImageVariant,
  isWeakImageAlt,
  resolveImageGallery,
  resolveImageOverride,
  resolveImageSelection,
  scoreKeywordMatches,
  selectImageUrl,
} from "./image-utils";

import { buildBreadcrumbs } from "./breadcrumbs";

import {
  buildProductFaqEntries,
  buildProductMetaDescription,
  buildProductProcurementFields,
  buildProductRelatedPages,
  buildProductSourceLinks,
  buildProductTitleQualifier,
  deriveProductBestFit,
  optimizeProductHeading,
  buildProductQuoteChecklist,
  extractProductSpecs,
} from "./product";

import { renderArticleSupportBlock } from "./render-blocks";

import { resolveArticleInquiryAction } from "./normalize-body";

/* ── Source-link resolver + page-context builder ──────────────── */
export function resolveSeoSourceLinks(seo: PageSeoData): BreadcrumbItem[] {
  return seo.kind === "article"
    ? seo.articleSourceLinks
    : seo.kind === "collection"
      ? seo.collectionSourceLinks
      : isCoreSupportKind(seo.kind)
        ? seo.coreSourceLinks
      : seo.productSourceLinks;
}

export function buildPageContext(page: SnapshotPage, $head: CheerioAPI, $body: CheerioAPI, kind: PageKind): PageContext {
  const contentTitle = resolveContentTitle(page, $body, kind);
  const description = resolveDescription(page, $head, $body, kind, contentTitle);
  const image = resolveImageSelection($head, $body, kind, contentTitle, page.route);
  const itemList = resolveItemList($body, page.route);
  const productSpecs = kind === "product" ? extractProductSpecs($body, contentTitle, page.route) : [];
  const collectionSummary = kind === "collection" ? buildCollectionSummary(page.route, description, $body) : [];
  const coreSummary = isCoreSupportKind(kind) ? buildCoreSummary(page.route, description, $body) : [];
  const articleSummary = kind === "article" ? buildArticleSummary(contentTitle, description, $body, page.route) : [];
  const resolvedFaqEntries = kind === "faq" || kind === "contact" || kind === "page" ? resolveFaqEntries($body) : [];
  const coreFaqEntries = isCoreSupportKind(kind) ? buildCoreFaqEntries(page.route, contentTitle, description, $body) : [];
  const faqEntries =
    kind === "product"
      ? buildProductFaqEntries(contentTitle, description, productSpecs, page.route)
      : kind === "collection"
        ? buildCollectionFaqEntries(page.route, contentTitle, description, $body)
      : kind === "article"
        ? buildArticleFaqEntries(contentTitle, description, $body, page.route)
      : kind === "faq" || kind === "contact" || kind === "page"
        ? dedupeFaqEntries([...resolvedFaqEntries, ...coreFaqEntries], 10)
      : isCoreSupportKind(kind)
        ? coreFaqEntries
        : [];
  const procurementFields =
    kind === "product" ? buildProductProcurementFields(contentTitle, description, productSpecs, page.route) : [];
  const collectionGuidanceFields = kind === "collection" ? buildCollectionGuidanceFields(page.route, contentTitle, $body) : [];
  const collectionRelatedPages = kind === "collection" ? buildCollectionRelatedPages(page.route, itemList) : [];
  const collectionSourceLinks = kind === "collection" ? buildCollectionSourceLinks(page.route) : [];
  const coreGuidanceFields = isCoreSupportKind(kind) ? buildCoreGuidanceFields(page.route, contentTitle, $body) : [];
  const coreRelatedPages = isCoreSupportKind(kind) ? buildCoreRelatedPages(page.route, itemList) : [];
  const coreSourceLinks = isCoreSupportKind(kind) ? buildCoreSourceLinks(page.route) : [];
  const articleGuidanceFields = kind === "article" ? buildArticleGuidanceFields(contentTitle, page.route, $body) : [];
  const articleRelatedPages = kind === "article" ? buildArticleRelatedPages(page.route, contentTitle, $body) : [];
  const articleSourceLinks = kind === "article" ? buildArticleSourceLinks(page.route, $body) : [];
  const productRelatedPages = kind === "product" ? buildProductRelatedPages(page.route) : [];
  const productSourceLinks = kind === "product" ? buildProductSourceLinks(page.route) : [];
  const articleMeta = kind === "article" ? resolveArticleMeta($body, page.route) : null;

  return {
    canonicalUrl: absoluteUrl(resolveCanonicalRoute(page.route)),
    contentTitle,
    description,
    imageUrl: image.url,
    imageAlt: image.alt,
    imageGallery: resolveImageGallery($body, kind, contentTitle, page.route, image),
    kind,
    breadcrumbItems: buildBreadcrumbs(page.route, contentTitle),
    itemList,
    faqEntries,
    procurementFields,
    collectionSummary,
    collectionGuidanceFields,
    collectionRelatedPages,
    collectionSourceLinks,
    coreSummary,
    coreGuidanceFields,
    coreRelatedPages,
    coreSourceLinks,
    articleSummary,
    articleGuidanceFields,
    articleRelatedPages,
    articleSourceLinks,
    productRelatedPages,
    productSourceLinks,
    articleMeta,
    productSpecs,
  };
}

export function dedupeFaqEntries(entries: FaqEntry[], limit = 10): FaqEntry[] {
  const seen = new Set<string>();
  const items: FaqEntry[] = [];

  entries.forEach((entry) => {
    const question = cleanText(entry.question);
    const answer = truncateText(cleanText(entry.answer), 400);

    if (!question || !answer || seen.has(question)) {
      return;
    }

    seen.add(question);
    items.push({ question, answer });
  });

  return items.slice(0, limit);
}


/* ── Page-kind / content / description resolvers ──────────────── */
export function inferPageKind(route: string): PageKind {
  if (route === "/") {
    return "home";
  }

  if (route === "/about/") {
    return "about";
  }

  if (route === "/contact/" || (route.startsWith("/contact/") && route !== "/contact/")) {
    return "contact";
  }

  if (route === "/faq/") {
    return "faq";
  }

  if (route === "/blog/") {
    return "blog";
  }

  if (route.startsWith("/product/")) {
    return "product";
  }

  if (/^\/20\d{2}\//.test(route)) {
    return "article";
  }

  // Editorial content routes (blog articles, solutions, comparisons, guides, compatibility)
  if (
    (route.startsWith("/blog/") && route !== "/blog/") ||
    (route.startsWith("/solutions/") && route !== "/solutions/") ||
    (route.startsWith("/compare/") && route !== "/compare/") ||
    (route.startsWith("/guides/") && route !== "/guides/") ||
    (route.startsWith("/compatibility/") && route !== "/compatibility/")
  ) {
    return "article";
  }

  if (route.startsWith("/industries/")) {
    // 2026-05-11: was "product" — wrong primary entity for a vertical-buyer
    // landing page that carries author / reviewedBy / sources signals.
    // Treating /industries/* as article unlocks:
    //   - Schema.org Article with author + reviewedBy + datePublished/dateModified
    //   - og:type=article + article:* meta tags in SeoHead.astro
    //   - article-meta gating in buildJsonLd (no spurious Product schema)
    // The pillar /industries/ itself also benefits — it has authorSlug and
    // sources on _pillar.json. CollectionPage @type for the pillar is layered
    // on inside buildWebPageJsonLd via a route check (see jsonld.ts).
    return "article";
  }

  if (route.startsWith("/products/")) {
    // Landing pages have 3+ path segments: /products/{subcategory}/{product-name}/
    // Collection pages have 2: /products/{subcategory}/ or /products/all/
    const segments = route.replace(/^\/|\/$/g, "").split("/");
    return segments.length >= 3 ? "product" : "collection";
  }

  if (
    route.startsWith("/cart/") ||
    route.startsWith("/checkout/") ||
    route.startsWith("/my-account/") ||
    route.startsWith("/product-tag/") ||
    route.startsWith("/tag/") ||
    route.startsWith("/category/") ||
    route.startsWith("/author/") ||
    route.startsWith("/product-category/")
  ) {
    return route.startsWith("/product-tag/") || route.startsWith("/tag/") || route.startsWith("/category/") || route.startsWith("/author/")
      ? "archive"
      : "utility";
  }

  return "page";
}

export function resolveContentTitle(page: SnapshotPage, $body: CheerioAPI, kind: PageKind): string {
  if (kind === "home") {
    return SITE_NAME;
  }

  if (kind === "about") {
    return "About Proud Tek";
  }

  if (kind === "contact" && page.route === "/contact/") {
    return "Contact Proud Tek";
  }

  if (kind === "faq") {
    return "RFID FAQ";
  }

  if (kind === "blog") {
    return "Proud Tek Blog";
  }

  const headingSelectors =
    kind === "product"
      ? [".product_title", "h1.product_title", "main h1", "h1"]
      : kind === "article"
        ? ["article h1", "main h1", "h1"]
        : kind === "contact"
          ? [".codex-editorial-hero h1", "main h1", "h1"]
        : kind === "collection" || kind === "archive"
          ? [".woocommerce-products-header h1", "main h1", "h1"]
          : ["main h1", "main h2", ".entry-content h1", ".entry-content h2", "h1", "h2"];

  const heading = getPreferredHeading($body, headingSelectors);

  if (heading) {
    return kind === "product" ? optimizeProductHeading(heading, page.route) : heading;
  }

  const fallback = cleanSnapshotTitle(page.title) || SITE_NAME;
  return kind === "product" ? optimizeProductHeading(fallback, page.route) : fallback;
}

export function resolveDescription(
  page: SnapshotPage,
  $head: CheerioAPI,
  $body: CheerioAPI,
  kind: PageKind,
  contentTitle: string,
): string {
  const overrideDescription = PAGE_DESCRIPTION_OVERRIDES[page.route];
  if (overrideDescription) {
    return truncateText(overrideDescription, 155);
  }

  const headDescription = cleanText($head('meta[name="description"]').attr("content") ?? "");

  if (headDescription) {
    return truncateText(headDescription, 155);
  }

  if (kind === "home") {
    return DEFAULT_DESCRIPTION;
  }

  if (kind === "about") {
    return "Learn about Proud Tek, a Shenzhen-based manufacturer of custom RFID cards, NFC tags, labels, readers, wristbands and keyfobs for OEM and industrial applications.";
  }

  if (kind === "contact") {
    if (page.route !== "/contact/") {
      const scenarioSummary = cleanText($body(".codex-editorial-summary").first().text());
      const scenarioParagraph =
        scenarioSummary ||
        extractMeaningfulParagraphs($body, [".codex-editorial-section-intro", ".entry-content p", "main p"], 2).find((paragraph) => paragraph.length >= 80) ||
        "";

      if (scenarioParagraph) {
        return truncateText(scenarioParagraph, 155);
      }
    }

    const contacts = extractContactDetails($body);

    return truncateText(
      `Contact Proud Tek in Shenzhen for RFID card, tag, label, wristband and reader inquiries.${contacts ? ` ${contacts}` : ""}`,
      155,
    );
  }

  if (kind === "faq") {
    return "RFID FAQ from Proud Tek covering samples, MOQ, OEM and ODM, lead times, shipping, warranty and after-sales support.";
  }

  if (kind === "blog") {
    return "Read RFID and NFC guides, application ideas and manufacturing insights from Proud Tek.";
  }

  if (kind === "collection") {
    const collectionDescription = getCollectionDescription(page.route);

    if (collectionDescription) {
      return truncateText(collectionDescription, 155);
    }
  }

  const selectorGroups =
    kind === "product"
      ? [".woocommerce-product-details__short-description p", ".entry-summary p", ".product .summary p"]
      : kind === "article"
        ? ["article .entry-content p", ".entry-content p", "main p"]
        : kind === "collection"
          ? [".term-description p", ".archive-description p", ".woocommerce-products-header p", "main p"]
          : [".entry-content p", ".content-area p", "main p"];

  const paragraphs = extractMeaningfulParagraphs($body, selectorGroups, kind === "article" ? 4 : 1);
  const extracted =
    kind === "article"
      ? paragraphs.find((paragraph) => paragraph.length >= 80) ?? paragraphs.sort((left, right) => right.length - left.length)[0] ?? ""
      : paragraphs[0] ?? "";

  if (extracted) {
    if (kind === "product") {
      return buildProductMetaDescription(contentTitle, extracted, page.route, $body);
    }

    return truncateText(extracted, 155);
  }

  if (kind === "product") {
    return buildProductMetaDescription(
      contentTitle,
      `Explore ${contentTitle} from Proud Tek for RFID and NFC manufacturing projects.`,
      page.route,
      $body,
    );
  }

  if (kind === "archive") {
    return truncateText(`Browse related ${contentTitle} pages from Proud Tek's English RFID and NFC site export.`, 155);
  }

  return truncateText(DEFAULT_DESCRIPTION, 155);
}

export function resolveArticleMeta($body: CheerioAPI, route: string): ArticleMeta {
  const fallback = getArticleDate(route);
  const publishedAt = normalizeDateTime(cleanText($body("time.entry-date.published, time.published").first().attr("datetime") ?? ""), fallback);
  const modifiedAt = normalizeDateTime(cleanText($body("time.updated").first().attr("datetime") ?? ""), publishedAt);

  const authorKey = ARTICLE_AUTHOR_MAP[route] ?? "default";
  const author = EXPERT_AUTHORS[authorKey] ?? EXPERT_AUTHORS["default"];

  return {
    authorName: author.name,
    authorUrl: absoluteUrl(author.url),
    authorTitle: author.title,
    authorExpertise: author.expertise,
    reviewedBy: authorKey !== "default" ? EDITORIAL_TEAM_NAME : undefined,
    reviewedByTitle: authorKey !== "default" ? "RFID & NFC Technical Content Team" : undefined,
    lastReviewedDate: modifiedAt,
    publishedAt,
    modifiedAt,
    publishedLabel: formatDisplayDate(publishedAt),
    modifiedLabel: formatDisplayDate(modifiedAt),
  };
}

export function resolveItemList($body: CheerioAPI, route: string): BreadcrumbItem[] {
  const hrefPrefix = route === "/blog/" ? /^\/20\d{2}\// : /^\/product\//;
  const items: BreadcrumbItem[] = [];
  const seen = new Set<string>();

  $body('a[href]').each((_, element) => {
    const rawHref = cleanText($body(element).attr("href") ?? "");

    if (!rawHref || rawHref.startsWith("#") || /^[a-z]+:/i.test(rawHref) && !/^https?:/i.test(rawHref)) {
      return;
    }

    const href = resolveCanonicalRoute(rawHref);

    if (!href || !hrefPrefix.test(href) || seen.has(href)) {
      return;
    }

    const name = cleanText($body(element).text()) || slugToTitle(href.split("/").filter(Boolean).pop() ?? "");

    seen.add(href);
    items.push({
      name,
      url: absoluteUrl(href),
    });
  });

  return items.slice(0, 12);
}

export function resolveFaqEntries($body: CheerioAPI): FaqEntry[] {
  const entries: FaqEntry[] = [];
  const seen = new Set<string>();

  const pushEntry = (question: string, answer: string): void => {
    const normalizedQuestion = cleanText(question);
    const normalizedAnswer = truncateText(cleanText(answer), 400);

    if (!normalizedQuestion || !normalizedAnswer || seen.has(normalizedQuestion)) {
      return;
    }

    seen.add(normalizedQuestion);
    entries.push({
      question: normalizedQuestion,
      answer: normalizedAnswer,
    });
  };

  // Legacy fallback — pre-Phase 9 Kadence accordion markup. Most pages
  // are migrated to <details> via enhanceFaqPage; this stays in case any
  // un-migrated page still emits the original accordion classes.
  const headers = $body(".kt-blocks-accordion-header").toArray();
  const panels = $body(".kt-accordion-panel").toArray();

  headers.forEach((header, index) => {
    pushEntry($body(header).text(), $body(panels[index] ?? "").text());
  });

  // Native <details>-based FAQ (DS-12 #4A `.codex-disclosure` pattern).
  // Phase 9 added `.codex-faq` as the FAQ-page wrapper class — extending
  // the selector here keeps FAQPage JSON-LD working after migration.
  $body(".codex-editorial-faq details, .codex-article-faq details, .codex-faq details").each((_, element) => {
    const question = $body(element).find("summary").first().text();
    const answer = $body(element).find("p").toArray().map((paragraph) => $body(paragraph).text()).join(" ");
    pushEntry(question, answer);
  });

  return entries;
}

export function buildDocumentTitle(route: string, contentTitle: string, kind: PageKind): string {
  if (route === "/") {
    return "Custom RFID & NFC Manufacturer | Proud Tek";
  }

  if (kind === "product") {
    return `${contentTitle} | ${buildProductTitleQualifier(route, contentTitle)} | Proud Tek`;
  }

  if (/\bProud Tek\b/i.test(contentTitle)) {
    return kind === "article" ? `${contentTitle} Blog` : contentTitle;
  }

  if (kind === "article") {
    return `${contentTitle} | Proud Tek Blog`;
  }

  return `${contentTitle} | Proud Tek`;
}


/* ── Per-kind summary / guidance / related / source / faq builders ── */
export function buildCollectionSummary(route: string, description: string, $body: CheerioAPI): string[] {
  const profile = COLLECTION_SUPPORT_PROFILES[route];
  if (profile?.takeaways.length) {
    return profile.takeaways.slice(0, 4);
  }

  const paragraphs = extractMeaningfulParagraphs($body, [".woocommerce-products-header p", ".entry-content p", "main p"], 5);
  return uniqueTextEntries([firstSentence(description), ...paragraphs].filter(Boolean)).slice(0, 4);
}

export function buildCollectionGuidanceFields(route: string, contentTitle: string, $body: CheerioAPI): ProcurementField[] {
  const profile = COLLECTION_SUPPORT_PROFILES[route];
  if (profile?.guidanceFields.length) {
    return profile.guidanceFields.slice(0, 4);
  }

  const fields: ProcurementField[] = [];
  const pushField = (label: string, value: string): void => {
    const normalized = truncateText(cleanText(value), 240);
    if (!normalized || fields.some((entry) => entry.label === label)) {
      return;
    }

    fields.push({ label, value: normalized });
  };

  const paragraphs = extractMeaningfulParagraphs($body, [".woocommerce-products-header p", ".entry-content p", "main p"], 4);
  pushField("Best for", paragraphs[0] ?? `${contentTitle} helps buyers compare related RFID and NFC options quickly.`);
  pushField("Compare first", paragraphs[1] ?? `Compare ${contentTitle} by protocol, material, environment fit and deployment workflow.`);
  pushField("What to send", `Share the target use case, preferred chip or protocol, quantity, customization need and sample expectations for ${contentTitle}.`);
  return fields.slice(0, 3);
}

export function buildCollectionRelatedPages(route: string, itemList: BreadcrumbItem[]): BreadcrumbItem[] {
  const profile = COLLECTION_SUPPORT_PROFILES[route];
  if (profile?.relatedPages.length) {
    return profile.relatedPages.slice(0, 8);
  }

  return itemList.slice(0, 8);
}

export function buildCollectionSourceLinks(route: string): BreadcrumbItem[] {
  return COLLECTION_SUPPORT_PROFILES[route]?.sourceLinks.slice(0, 6) ?? [];
}

export function buildCollectionFaqEntries(route: string, contentTitle: string, description: string, $body: CheerioAPI): FaqEntry[] {
  const profile = COLLECTION_SUPPORT_PROFILES[route];
  if (profile?.faqEntries.length) {
    return profile.faqEntries.slice(0, 6);
  }

  const subject = cleanText(contentTitle.split(/\s*[:|-]\s*/)[0]) || contentTitle;
  const summary = buildCollectionSummary(route, description, $body);
  const guidance = buildCollectionGuidanceFields(route, contentTitle, $body);
  const entries: FaqEntry[] = [];
  const pushEntry = (question: string, answer: string): void => {
    const normalizedQuestion = cleanText(question);
    const normalizedAnswer = truncateText(cleanText(answer), 400);

    if (!normalizedQuestion || !normalizedAnswer || entries.some((entry) => entry.question === normalizedQuestion)) {
      return;
    }

    entries.push({ question: normalizedQuestion, answer: normalizedAnswer });
  };

  if (summary[0]) {
    pushEntry(`What does ${subject} cover?`, summary[0]);
  }

  guidance.forEach((entry) => {
    pushEntry(`How should buyers use this ${subject.toLowerCase()} collection for ${entry.label.toLowerCase()}?`, `${entry.label}: ${entry.value}`);
  });

  return entries.slice(0, 4);
}

export function buildCoreSummary(route: string, description: string, $body: CheerioAPI): string[] {
  const profile = CORE_SUPPORT_PROFILES[route];
  if (profile?.takeaways.length) {
    return profile.takeaways.slice(0, 4);
  }

  const paragraphs = extractMeaningfulParagraphs($body, [".entry-content p", ".content-area p", "main p"], 5);
  return uniqueTextEntries([firstSentence(description), ...paragraphs].filter(Boolean)).slice(0, 4);
}

export function buildCoreGuidanceFields(route: string, contentTitle: string, $body: CheerioAPI): ProcurementField[] {
  const profile = CORE_SUPPORT_PROFILES[route];
  if (profile?.guidanceFields.length) {
    return profile.guidanceFields.slice(0, 4);
  }

  const fields: ProcurementField[] = [];
  const pushField = (label: string, value: string): void => {
    const normalized = truncateText(cleanText(value), 240);
    if (!normalized || fields.some((entry) => entry.label === label)) {
      return;
    }

    fields.push({ label, value: normalized });
  };

  const paragraphs = extractMeaningfulParagraphs($body, [".entry-content p", ".content-area p", "main p"], 4);
  pushField("Best for", paragraphs[0] ?? `${contentTitle} helps buyers qualify the next step in the Proud Tek catalog.`);
  pushField("What to confirm", paragraphs[1] ?? `Confirm scope, product family fit and next action for ${contentTitle}.`);
  pushField("Next step", `Move from ${contentTitle} into the relevant collection, FAQ path or contact page once the project brief is clear.`);
  return fields.slice(0, 3);
}

export function buildCoreRelatedPages(route: string, itemList: BreadcrumbItem[]): BreadcrumbItem[] {
  const profile = CORE_SUPPORT_PROFILES[route];
  if (profile?.relatedPages.length) {
    return profile.relatedPages.slice(0, 8);
  }

  return itemList.slice(0, 8);
}

export function buildCoreSourceLinks(route: string): BreadcrumbItem[] {
  return CORE_SUPPORT_PROFILES[route]?.sourceLinks.slice(0, 6) ?? [];
}

export function buildCoreFaqEntries(route: string, contentTitle: string, description: string, $body: CheerioAPI): FaqEntry[] {
  const profile = CORE_SUPPORT_PROFILES[route];
  if (profile?.faqEntries?.length) {
    return profile.faqEntries.slice(0, 6);
  }

  const summary = buildCoreSummary(route, description, $body);
  const guidance = buildCoreGuidanceFields(route, contentTitle, $body);
  const subject = cleanText(contentTitle.split(/\s*[:|-]\s*/)[0]) || contentTitle;
  const entries: FaqEntry[] = [];
  const pushEntry = (question: string, answer: string): void => {
    const normalizedQuestion = cleanText(question);
    const normalizedAnswer = truncateText(cleanText(answer), 400);
    if (!normalizedQuestion || !normalizedAnswer || entries.some((entry) => entry.question === normalizedQuestion)) {
      return;
    }

    entries.push({ question: normalizedQuestion, answer: normalizedAnswer });
  };

  if (summary[0]) {
    pushEntry(`What does ${subject} help buyers do?`, summary[0]);
  }

  guidance.forEach((entry) => {
    pushEntry(`How should buyers use ${subject} for ${entry.label.toLowerCase()}?`, `${entry.label}: ${entry.value}`);
  });

  return entries.slice(0, 4);
}

export function buildArticleSummary(contentTitle: string, description: string, $body: CheerioAPI, route: string): string[] {
  const profile = ARTICLE_SUPPORT_PROFILES[route];
  if (profile?.takeaways.length) {
    return profile.takeaways.slice(0, 4);
  }

  const paragraphs = extractMeaningfulParagraphs($body, ["article .entry-content p", ".entry-content p", "main p"], 6);
  return uniqueTextEntries([firstSentence(description), ...paragraphs].filter(Boolean)).slice(0, 4);
}

export function buildArticleGuidanceFields(contentTitle: string, route: string, $body: CheerioAPI): ProcurementField[] {
  const profile = ARTICLE_SUPPORT_PROFILES[route];
  if (profile?.guidanceFields.length) {
    return profile.guidanceFields.slice(0, 4);
  }

  const fields: ProcurementField[] = [];
  const pushField = (label: string, value: string): void => {
    const normalized = truncateText(cleanText(value), 240);

    if (!normalized || fields.some((entry) => entry.label === label)) {
      return;
    }

    fields.push({ label, value: normalized });
  };

  const paragraphs = extractMeaningfulParagraphs($body, ["article .entry-content p", ".entry-content p", "main p"], 6);
  pushField("Best for", paragraphs[0] ?? `${contentTitle} supports RFID and NFC evaluation, comparison, and sourcing decisions.`);
  pushField("Compare first", paragraphs[1] ?? `Compare ${contentTitle} against reader compatibility, chip family, material, and deployment environment.`);
  pushField(
    "What to confirm",
    `Confirm target application, compatibility requirements, customization needs, quantity, and sample expectations before quoting ${contentTitle}.`,
  );

  return fields.slice(0, 3);
}

export function buildArticleRelatedPages(route: string, contentTitle: string, $body: CheerioAPI): BreadcrumbItem[] {
  const profile = ARTICLE_SUPPORT_PROFILES[route];
  if (profile?.relatedPages.length) {
    return rewriteArticleRelatedPages(route, contentTitle, profile.relatedPages).slice(0, 6);
  }

  const items: BreadcrumbItem[] = [];
  const seen = new Set<string>();
  const articleInquiry = resolveArticleInquiryAction(route, contentTitle);

  $body("article .entry-content a[href], .entry-content a[href]").each((_, element) => {
    const rawHref = normalizeRoute(cleanText($body(element).attr("href") ?? ""));
    const href = rawHref === "/contact/" ? articleInquiry.href : rawHref;

    if (!href || seen.has(href) || !/^\/(product|products|contact)\//.test(href)) {
      return;
    }

    const name =
      rawHref === "/contact/"
        ? articleInquiry.label
        : cleanText($body(element).text()) || slugToTitle(href.split("/").filter(Boolean).pop() ?? "");
    if (!name || /^products?expand$/i.test(name)) {
      return;
    }

    seen.add(href);
    items.push({
      name,
      url: absoluteUrl(href),
    });
  });

  return items.slice(0, 6);
}

export function rewriteArticleRelatedPages(route: string, contentTitle: string, entries: BreadcrumbItem[]): BreadcrumbItem[] {
  const seen = new Set<string>();
  const articleInquiry = resolveArticleInquiryAction(route, contentTitle);

  return entries
    .map((entry) =>
      entry.url === absoluteUrl("/contact/")
        ? { name: articleInquiry.label, url: absoluteUrl(articleInquiry.href) }
        : entry,
    )
    .filter((entry) => {
      if (seen.has(entry.url)) {
        return false;
      }

      seen.add(entry.url);
      return true;
    });
}

export function buildArticleSourceLinks(route: string, $body: CheerioAPI): BreadcrumbItem[] {
  const profile = ARTICLE_SUPPORT_PROFILES[route];
  if (profile?.sourceLinks?.length) {
    return profile.sourceLinks.slice(0, 6);
  }

  const items: BreadcrumbItem[] = [];
  const seen = new Set<string>();

  $body("article .entry-content a[href], .entry-content a[href]").each((_, element) => {
    const href = cleanText($body(element).attr("href") ?? "");

    if (!/^https?:\/\//i.test(href) || seen.has(href)) {
      return;
    }

    if (/(facebook|instagram|linkedin|youtube|x\.com|twitter)\.com/i.test(href)) {
      return;
    }

    const name = cleanText($body(element).text()) || hostnameToLabel(href);
    if (!name) {
      return;
    }

    seen.add(href);
    items.push({
      name,
      url: href,
    });
  });

  return items.slice(0, 6);
}

export function buildArticleFaqEntries(contentTitle: string, description: string, $body: CheerioAPI, route: string): FaqEntry[] {
  const entries: FaqEntry[] = [];
  const seen = new Set<string>();
  const faqSubject = buildArticleFaqSubject(contentTitle);
  const headings = $body("article .entry-content h2, article .entry-content h3, article .entry-content h4, .entry-content h2, .entry-content h3, .entry-content h4")
    .toArray()
    .filter((element) => {
      const question = cleanText($body(element).text());
      return question.endsWith("?") && !/^Ready to\b/i.test(question);
    });

  const pushEntry = (question: string, answer: string): void => {
    const normalizedQuestion = cleanText(question);
    const normalizedAnswer = truncateText(cleanText(answer), 400);

    if (!normalizedQuestion || !normalizedAnswer || seen.has(normalizedQuestion)) {
      return;
    }

    seen.add(normalizedQuestion);
    entries.push({
      question: normalizedQuestion,
      answer: normalizedAnswer,
    });
  };

  headings.forEach((heading) => {
    const answerParts: string[] = [];
    let sibling = $body(heading).next();

    while (sibling.length) {
      if (sibling.is("h2, h3, h4")) {
        break;
      }

      if (sibling.is("p, ul, ol")) {
        const text = cleanText(sibling.text());
        if (text) {
          answerParts.push(text);
        }
      }

      if (answerParts.join(" ").length >= 320) {
        break;
      }

      sibling = sibling.next();
    }

    pushEntry($body(heading).text(), answerParts.join(" "));
  });

  if (entries.length < 3) {
    const summary = buildArticleSummary(contentTitle, description, $body, route);
    const guidance = buildArticleGuidanceFields(contentTitle, route, $body);

    if (summary[0]) {
      pushEntry(`What does ${faqSubject} help buyers understand?`, summary[0]);
    }

    guidance.forEach((entry) => {
      pushEntry(buildArticleGuidanceQuestion(faqSubject, entry.label), `${entry.label}: ${entry.value}`);
    });
  }

  return entries.slice(0, 6);
}

export function buildArticleFaqSubject(contentTitle: string): string {
  return cleanText(contentTitle.split(/\s*[:|-]\s*/)[0]) || contentTitle;
}

export function buildArticleGuidanceQuestion(subject: string, label: string): string {
  switch (label.toLowerCase()) {
    case "best for":
      return `Who is ${subject} most relevant for?`;
    case "compare first":
      return `What should buyers compare before choosing ${subject}?`;
    case "what to confirm":
      return `What should buyers confirm before sourcing ${subject}?`;
    case "next step":
      return `What is the next buying step after reviewing ${subject}?`;
    default:
      return `How should buyers use this guide for ${subject}?`;
  }
}


/* ── Body extraction utility helpers ─────────────────────────── */
export function extractContactDetails($body: CheerioAPI): string {
  const values = $body(".entry-content p")
    .toArray()
    .map((element) => cleanText($body(element).text()))
    .filter((text) => /@|\+\d|Shenzhen|China/i.test(text));

  return values.join(" ");
}

export function getPreferredHeading($body: CheerioAPI, selectors: string[]): string {
  for (const selector of selectors) {
    const candidates: string[] = [];

    $body(selector).each((_, element) => {
      const text = cleanText($body(element).text());

      if (!text || isBoilerplateText(text)) {
        return;
      }

      candidates.push(text);
    });

    if (candidates.length > 0) {
      return candidates.sort((left, right) => right.length - left.length)[0] ?? "";
    }
  }

  return "";
}

export function extractMeaningfulParagraphs($body: CheerioAPI, selectors: string[], limit: number): string[] {
  const results: string[] = [];

  for (const selector of selectors) {
    const elements = $body(selector).toArray();

    for (const element of elements) {
      if ($body(element).closest("header, footer, nav, form, aside, .site-header, .site-footer, .related").length > 0) {
        continue;
      }

      const text = cleanText($body(element).text());

      if (!text || text.length < 40 || isBoilerplateText(text)) {
        continue;
      }

      results.push(text);

      if (results.length >= limit) {
        return results;
      }
    }
  }

  return results;
}


/* ── 404 detection ─────────────────────────────────────────────── */
export function isSoft404Page(page: SnapshotPage, contentTitle?: string): boolean {
  const normalizedTitle = cleanText(contentTitle ?? cleanSnapshotTitle(page.title));

  if (/^404 Not Found$/i.test(normalizedTitle)) {
    return true;
  }

  return /^404 Not Found\b/i.test(cleanText(page.bodyHtml));
}


/* ── Date / collection description helpers ───────────────────── */
export function getCollectionDescription(route: string): string {
  const descriptions: Record<string, string> = {
    "/products/all/":
      "Browse Proud Tek's full catalog of custom RFID and NFC products, including tags, labels, cards, readers, keyfobs and wristbands.",
    "/products/rfid-tags/":
      "Explore custom RFID tags from Proud Tek for laundry, asset tracking, windshield, industrial and OEM applications.",
    "/products/rfid-labels/":
      "Explore RFID and NFC labels from Proud Tek for packaging, logistics, authentication and smart labeling workflows.",
    "/products/rfid-readers/":
      "Explore RFID readers from Proud Tek for desktop, handheld and embedded identification workflows.",
    "/products/rfid-cards/":
      "Explore custom RFID cards and NFC cards from Proud Tek for access control, hospitality, events and digital business use.",
    "/products/rfid-keyfobs/":
      "Explore RFID keyfobs from Proud Tek for access control, loyalty, membership and OEM tagging projects.",
    "/products/rfid-wristbands/":
      "Explore RFID wristbands from Proud Tek for events, resorts, healthcare and access-control applications.",
  };

  return descriptions[route] ?? "";
}

export function getArticleDate(route: string): string {
  const match = route.match(/^\/(\d{4})\/(\d{2})\/(\d{2})\//);

  if (!match) {
    return new Date().toISOString();
  }

  return `${match[1]}-${match[2]}-${match[3]}T00:00:00+08:00`;
}

export function getLastModified(page: SnapshotPage, generatedAt: string): string {
  if (/^\/20\d{2}\//.test(page.route)) {
    const $body = load(`<body>${page.bodyHtml}</body>`);
    const updated =
      cleanText($body("time.updated").first().attr("datetime") ?? "") ||
      cleanText($body("time.entry-date.published, time.published").first().attr("datetime") ?? "") ||
      getArticleDate(page.route);

    return updated.slice(0, 10);
  }

  return generatedAt.slice(0, 10);
}


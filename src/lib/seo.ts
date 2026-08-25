import { load, type CheerioAPI } from "cheerio";

import type { SiteData, SnapshotPage } from "./site-data";
import { getCollection } from "astro:content";

import { ROUTE_CANONICAL_OVERRIDES } from "./route-overrides";
import { injectConversionBlocks } from "./conversion";
import { PRODUCT_SPEC_SHEETS } from "./product-specs";

import {
  SITE_ORIGIN,
  SITE_NAME,
  ORGANIZATION_NAME,
  EDITORIAL_TEAM_NAME,
  DEFAULT_IMAGE,
  DEFAULT_DESCRIPTION,
  ORGANIZATION_KNOWS_ABOUT,
  ORGANIZATION_CONTACT,
  HOME_GROWTH_GROUPS,
  HOME_COMPARE_LINKS,
  BLOG_GROWTH_GROUPS,
  HOME_GROWTH_BRIEF,
  GROWTH_ACTIONS,
  PAGE_IMAGE_OVERRIDES,
  PAGE_DESCRIPTION_OVERRIDES,
  PRODUCT_BEST_FIT_OVERRIDES,
  PRODUCT_LEAD_PARAGRAPH_OVERRIDES,
  PRODUCT_HEADING_OVERRIDES,
  PRODUCT_SOURCE_LINKS,
  ARTICLE_SUPPORT_PROFILES,
  COLLECTION_SUPPORT_PROFILES,
  CORE_SUPPORT_PROFILES,
  EXPERT_AUTHORS,
  ARTICLE_AUTHOR_MAP,
  ORGANIZATION_CREDENTIALS,
} from "./seo-content";

import { EDITORIAL_KEYWORDS_MAP } from "./editorial-pages";

import {
  type PageKind,
  cleanText,
  escapeRegExp,
  truncateText,
  uniqueTextEntries,
  firstSentence,
  cleanSnapshotTitle,
  isBoilerplateText,
  stripNoiseHtmlComments,
  escapeXml,
  slugToTitle,
  hostnameToLabel,
  normalizeRoute,
  resolveCanonicalRoute,
  resolveLegacyRedirectPath,
  absoluteUrl,
  normalizeDateTime,
  formatDisplayDate,
  parseDimension,
  buildRobotsValue,
  sanitizeHtmlAttrs,
  sanitizeBodyAttrs,
  isCoreSupportKind,
  findProductSpecValue,
  resolveContextSourceLinks,
  isIndexableRoute,
  buildMachineRoute,
} from "./seo/utils";

// Re-export public API moved into utils.ts
export { isIndexableRoute, buildMachineRoute };

import {
  selectImageUrl,
  isDecorativeImageUrl,
  isPlaceholderImageUrl,
  isTinyImageVariant,
  getLowValueImagePenalty,
  isWeakImageAlt,
  guessImageAlt,
  fallbackImageAlt,
  filenameToTitle,
  scoreKeywordMatches,
  buildImageKeywordSet,
  buildSpecificImageKeywordSet,
  resolveImageOverride,
  refreshNormalizedImageContext,
  resolveImageSelection,
  resolveImageGallery,
  applyImageAccessibility,
} from "./seo/image-utils";

import type {
  ArticleMeta,
  ImageSelection,
  ImageCandidate,
  PageContext,
} from "./seo/types";

import {
  buildJsonLd,
  buildWebPageJsonLd,
  buildSchemaKeywords,
  resolveEditorialSectionLinks,
  resolveProductCategory,
} from "./seo/jsonld";

import { buildBreadcrumbs } from "./seo/breadcrumbs";

import {
  buildLegacyRedirectSeo,
  buildLegacyRedirectBody,
  resolveLegacyRedirectProfile,
} from "./seo/legacy-redirect";

import {
  renderTrustBar,
  renderGrowthHub,
  renderGrowthBrief,
  renderHomeIndustrySelector,
  renderHomeQuoteBrief,
  renderHomeGrowthHub,
  renderBlogGrowthHub,
  renderArticleSupportBlock,
} from "./seo/render-blocks";

import {
  normalizeGlobalInquiryEntry,
  ensureMobileInquiryEntry,
  rewriteGlobalInquiryLinks,
  rewriteFooterInquirySection,
  normalizeHomeHeroInquiryButtons,
} from "./seo/inquiry-rewrite";

import {
  renderProductCta,
  resolveProductCtaProfile,
  resolveCollectionCtaProfile,
} from "./seo/cta-profiles";

import { sanitizeHead, sanitizeBody } from "./seo/sanitize-html";

import {
  initBlogDefinitions,
  getBlogThumbnails,
  classifyBlogKicker,
  injectBlogArticleGrid,
  normalizeBlogArchiveCards,
  buildArchiveCardTitle,
  formatArchiveTitle,
} from "./seo/blog-body";

import {
  clarifyBuyerFacingCopy,
  rewriteLegacyInternalLinks,
  rewriteLegacyInternalHref,
  injectContextualLinks,
  resolveGuidanceTitle,
  renderCollectionSupportBlock,
  resolveArticleInquiryAction,
  normalizeProductBody,
  normalizeCollectionBody,
  normalizeArticleBody,
} from "./seo/normalize-body";

import {
  normalizePageBody,
  normalizeCoreBody,
  enhanceHomeHero,
  enhanceAboutPage,
  enhanceKadenceA11y,
  enhanceFaqPage,
  enhancePrimaryContactPage,
} from "./seo/enhance-page";

import {
  resolveSeoSourceLinks,
  buildPageContext,
  dedupeFaqEntries,
  inferPageKind,
  resolveContentTitle,
  resolveDescription,
  resolveArticleMeta,
  resolveItemList,
  resolveFaqEntries,
  buildDocumentTitle,
  buildCollectionSummary,
  buildCollectionGuidanceFields,
  buildCollectionRelatedPages,
  buildCollectionSourceLinks,
  buildCollectionFaqEntries,
  buildCoreSummary,
  buildCoreGuidanceFields,
  buildCoreRelatedPages,
  buildCoreSourceLinks,
  buildCoreFaqEntries,
  buildArticleSummary,
  buildArticleGuidanceFields,
  buildArticleRelatedPages,
  rewriteArticleRelatedPages,
  buildArticleSourceLinks,
  buildArticleFaqEntries,
  buildArticleFaqSubject,
  buildArticleGuidanceQuestion,
  extractContactDetails,
  getPreferredHeading,
  extractMeaningfulParagraphs,
  isSoft404Page,
  getCollectionDescription,
  getArticleDate,
  getLastModified,
} from "./seo/page-data";

// Re-export initBlogDefinitions for backward compat — site-data.ts imports it from "./seo".
export { initBlogDefinitions };

import {
  buildProductTitleQualifier,
  optimizeProductHeading,
  buildProductMetaDescription,
  buildProductProcurementFields,
  buildProductFaqEntries,
  buildProductUsageQuestion,
  deriveProductBestFit,
  buildProductQuoteChecklist,
  summarizeQuoteNeed,
  summarizeSpecLine,
  renderProductSpecSheet,
  renderProductSupportBlock,
  extractProductSpecs,
  normalizeProductSpecName,
  normalizeProductSpecValue,
  extractColonPatternSpec,
  inferProductSpecsFromCopy,
  inferFormFactorFromTitle,
  buildProductSourceLinks,
  buildProductRelatedPages,
} from "./seo/product";

export {
  SITE_ORIGIN,
  SITE_NAME,
  ORGANIZATION_NAME,
  EDITORIAL_TEAM_NAME,
  DEFAULT_IMAGE,
  DEFAULT_DESCRIPTION,
  ORGANIZATION_KNOWS_ABOUT,
  ORGANIZATION_CONTACT,
  HOME_GROWTH_GROUPS,
  HOME_COMPARE_LINKS,
  BLOG_GROWTH_GROUPS,
  HOME_GROWTH_BRIEF,
  GROWTH_ACTIONS,
  PAGE_IMAGE_OVERRIDES,
  PAGE_DESCRIPTION_OVERRIDES,
  PRODUCT_BEST_FIT_OVERRIDES,
  PRODUCT_LEAD_PARAGRAPH_OVERRIDES,
  PRODUCT_HEADING_OVERRIDES,
  PRODUCT_SOURCE_LINKS,
  ARTICLE_SUPPORT_PROFILES,
  COLLECTION_SUPPORT_PROFILES,
  CORE_SUPPORT_PROFILES,
};

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface ProcurementField {
  label: string;
  value: string;
}

export interface GrowthCard {
  eyebrow: string;
  title: string;
  href: string;
  description: string;
}

export interface GrowthGroup {
  title: string;
  description: string;
  cards: GrowthCard[];
}

export interface ArticleSupportProfile {
  takeaways: string[];
  guidanceFields: ProcurementField[];
  relatedPages: BreadcrumbItem[];
  sourceLinks?: BreadcrumbItem[];
}

export interface CollectionSupportProfile {
  takeaways: string[];
  guidanceFields: ProcurementField[];
  relatedPages: BreadcrumbItem[];
  sourceLinks: BreadcrumbItem[];
  faqEntries: FaqEntry[];
}

export interface InquiryCtaProfile {
  href: string;
  label: string;
  description: string;
  briefItems: string[];
  secondaryLinks?: BreadcrumbItem[];
}

export interface CoreSupportProfile {
  takeaways: string[];
  guidanceFields: ProcurementField[];
  relatedPages: BreadcrumbItem[];
  sourceLinks: BreadcrumbItem[];
  faqEntries?: FaqEntry[];
}

export type ProductSourceProfile = Record<string, BreadcrumbItem[]>;

export interface ProductSpec {
  name: string;
  value: string;
}

export interface PageSeoData {
  htmlAttrs: Record<string, string>;
  bodyAttrs: Record<string, string>;
  headHtml: string;
  bodyHtml: string;
  kind: PageKind;
  contentTitle: string;
  title: string;
  description: string;
  canonicalUrl: string;
  robots: string;
  indexable: boolean;
  jsonLd: string[];
  imageUrl: string;
  imageAlt: string;
  imageGallery: ImageSelection[];
  faqEntries: FaqEntry[];
  procurementFields: ProcurementField[];
  collectionSummary: string[];
  collectionGuidanceFields: ProcurementField[];
  collectionRelatedPages: BreadcrumbItem[];
  collectionSourceLinks: BreadcrumbItem[];
  coreSummary: string[];
  coreGuidanceFields: ProcurementField[];
  coreRelatedPages: BreadcrumbItem[];
  coreSourceLinks: BreadcrumbItem[];
  articleSummary: string[];
  articleGuidanceFields: ProcurementField[];
  articleRelatedPages: BreadcrumbItem[];
  articleSourceLinks: BreadcrumbItem[];
  productRelatedPages: BreadcrumbItem[];
  productSourceLinks: BreadcrumbItem[];
  ogType: "website" | "article";
  articleMeta: ArticleMeta | null;
}

export interface MachinePageData {
  url: string;
  sourceUrl: string;
  title: string;
  description: string;
  kind: PageKind;
  imageUrl: string;
  imageAlt: string;
  imageGallery: ImageSelection[];
  breadcrumbs: BreadcrumbItem[];
  summary: string[];
  faq: FaqEntry[];
  procurementFields: ProcurementField[];
  collectionGuidanceFields: ProcurementField[];
  coreGuidanceFields: ProcurementField[];
  articleGuidanceFields: ProcurementField[];
  sourceLinks: BreadcrumbItem[];
  related: BreadcrumbItem[];
  productSpecs: ProductSpec[];
  machineJsonUrl: string;
  machineTextUrl: string;
  /** Citation-friendly metadata */
  author?: { name: string; title?: string; expertise?: string[] };
  publisher: string;
  datePublished?: string;
  dateModified?: string;
  reviewedBy?: string;
  lastReviewedDate?: string;
  credentials?: string[];
  /** Site-build timestamp from siteData.generatedAt — useful for
   *  bot crawlers / LLM scrapers to gauge content freshness. */
  generatedAt?: string;
}



/**
 * Append the verified factory-direct signal to commercial meta descriptions
 * when absent. Never fabricates numbers: both facts condense existing site
 * copy verbatim ("a 500-piece minimum per chip type"; "MOQ, price and lead
 * time are quoted in writing before tooling, then held").
 */
const COMMERCE_SIGNAL_PATTERN = /factory|MOQ|minimum order|lead time|written quote/i;
const COMMERCE_SIGNAL_SUFFIX =
  " Factory-direct from Proud Tek: 500-piece MOQ per chip type with written quotes and lead times held before tooling.";
const COMMERCE_SIGNAL_KINDS = new Set<PageKind>(["product"]);

export function withCommerceSignal(description: string, kind: PageKind): string {
  if (!COMMERCE_SIGNAL_KINDS.has(kind)) return description;
  if (COMMERCE_SIGNAL_PATTERN.test(description)) return description;
  if (!description.trim()) return description;
  const candidate = `${description.trimEnd()}${COMMERCE_SIGNAL_SUFFIX}`;
  return candidate.length <= 320 ? candidate : description;
}

export function buildPageSeo(page: SnapshotPage): PageSeoData {
  const kind = inferPageKind(page.route);
  const $head = load(`<head>${page.headHtml}</head>`);
  const $body = load(`<body>${page.bodyHtml}</body>`);

  sanitizeHead($head);
  sanitizeBody($body);

  const legacyRedirectPath = resolveLegacyRedirectPath(page.route);

  if (legacyRedirectPath) {
    return buildLegacyRedirectSeo(page, $head, legacyRedirectPath);
  }

  const context = buildPageContext(page, $head, $body, kind);
  normalizePageBody($body, page, context);
  // GEO enrichment (2026-08-25): commercial pages carry the factory-direct
  // signal buyers ask AI engines for. Claims mirror verified site copy
  // (about/lp): 500-piece MOQ per chip type, written quotes held before
  // tooling. Meta description and Article schema share this string.
  context.description = withCommerceSignal(context.description, kind);
  const title = buildDocumentTitle(page.route, context.contentTitle, kind);
  const indexable = isIndexableRoute(page.route) && !isSoft404Page(page, context.contentTitle);

  return {
    htmlAttrs: sanitizeHtmlAttrs(page.htmlAttrs),
    bodyAttrs: sanitizeBodyAttrs(page.bodyAttrs),
    headHtml: stripNoiseHtmlComments($head("head").html() ?? ""),
    bodyHtml: stripNoiseHtmlComments($body("body").html() ?? ""),
    kind,
    contentTitle: context.contentTitle,
    title,
    description: context.description,
    canonicalUrl: context.canonicalUrl,
    robots: buildRobotsValue(indexable),
    indexable,
    jsonLd: buildJsonLd(context, page).map((entry) => JSON.stringify(entry)),
    imageUrl: context.imageUrl,
    imageAlt: context.imageAlt,
    imageGallery: context.imageGallery,
    faqEntries: context.faqEntries,
    procurementFields: context.procurementFields,
    collectionSummary: context.collectionSummary,
    collectionGuidanceFields: context.collectionGuidanceFields,
    collectionRelatedPages: context.collectionRelatedPages,
    collectionSourceLinks: context.collectionSourceLinks,
    coreSummary: context.coreSummary,
    coreGuidanceFields: context.coreGuidanceFields,
    coreRelatedPages: context.coreRelatedPages,
    coreSourceLinks: context.coreSourceLinks,
    articleSummary: context.articleSummary,
    articleGuidanceFields: context.articleGuidanceFields,
    articleRelatedPages: context.articleRelatedPages,
    articleSourceLinks: context.articleSourceLinks,
    productRelatedPages: context.productRelatedPages,
    productSourceLinks: context.productSourceLinks,
    ogType: kind === "article" ? "article" : "website",
    articleMeta: context.articleMeta,
  };
}

export function getIndexablePages(siteData: SiteData): SnapshotPage[] {
  return siteData.pages.filter((page) => isIndexableRoute(page.route) && !isSoft404Page(page));
}

export function buildPageSummary(page: SnapshotPage): { title: string; description: string; kind: PageKind; url: string } {
  const seo = buildPageSeo(page);

  return {
    title: seo.title.replace(/\s+\|\s+Proud Tek(?:\s+Blog)?$/i, "").trim(),
    description: seo.description,
    kind: inferPageKind(page.route),
    url: seo.canonicalUrl,
  };
}

export function buildMachinePageData(page: SnapshotPage, generatedAt?: string): MachinePageData {
  const seo = buildPageSeo(page);
  const $body = load(`<body>${seo.bodyHtml}</body>`);
  const route = normalizeRoute(page.route);
  const machineJsonUrl = absoluteUrl(buildMachineRoute(route, "json"));
  const machineTextUrl = absoluteUrl(buildMachineRoute(route, "txt"));

  const summarySelectors =
    seo.kind === "product"
      ? [".woocommerce-product-details__short-description p", ".entry-summary p", ".entry-content p"]
      : seo.kind === "article"
        ? ["article .entry-content p", ".entry-content p", "main p"]
        : seo.kind === "collection"
          ? [".term-description p", ".archive-description p", ".woocommerce-products-header p", "main p"]
          : [".entry-content p", ".content-area p", "main p"];

  const summary = uniqueTextEntries(extractMeaningfulParagraphs($body, summarySelectors, seo.kind === "article" ? 6 : 4)).slice(
    0,
    seo.kind === "article" ? 4 : 3,
  );
  const faq = (seo.faqEntries.length > 0 ? seo.faqEntries : resolveFaqEntries($body)).slice(0, 10);
  const related =
    seo.kind === "product" && seo.productRelatedPages.length > 0
      ? seo.productRelatedPages.slice(0, 10)
    : seo.kind === "article" && seo.articleRelatedPages.length > 0
      ? seo.articleRelatedPages.slice(0, 10)
    : seo.kind === "collection" && seo.collectionRelatedPages.length > 0
      ? seo.collectionRelatedPages.slice(0, 10)
    : isCoreSupportKind(seo.kind) && seo.coreRelatedPages.length > 0
      ? seo.coreRelatedPages.slice(0, 10)
    : seo.kind === "product" || seo.kind === "blog" || seo.kind === "collection"
      ? resolveItemList($body, route).slice(0, 10)
      : [];
  const productSpecs = seo.kind === "product" ? extractProductSpecs($body, seo.contentTitle, route) : [];

  return {
    url: seo.canonicalUrl,
    sourceUrl: page.sourceUrl,
    title: seo.contentTitle,
    description: seo.description,
    kind: seo.kind,
    imageUrl: seo.imageUrl,
    imageAlt: seo.imageAlt,
    imageGallery: seo.imageGallery,
    breadcrumbs: buildBreadcrumbs(route, seo.contentTitle),
    summary:
      seo.kind === "article" && seo.articleSummary.length > 0
        ? seo.articleSummary
      : seo.kind === "collection" && seo.collectionSummary.length > 0
          ? seo.collectionSummary
        : isCoreSupportKind(seo.kind) && seo.coreSummary.length > 0
          ? seo.coreSummary
          : summary,
    faq,
    procurementFields: seo.procurementFields,
    collectionGuidanceFields: seo.collectionGuidanceFields,
    coreGuidanceFields: seo.coreGuidanceFields,
    articleGuidanceFields: seo.articleGuidanceFields,
    sourceLinks: resolveSeoSourceLinks(seo),
    related,
    productSpecs,
    machineJsonUrl,
    machineTextUrl,
    author: seo.articleMeta
      ? {
          name: seo.articleMeta.authorName,
          title: seo.articleMeta.authorTitle,
          expertise: seo.articleMeta.authorExpertise,
        }
      : { name: ORGANIZATION_NAME },
    publisher: ORGANIZATION_NAME,
    datePublished: seo.articleMeta?.publishedAt,
    dateModified: seo.articleMeta?.modifiedAt,
    reviewedBy: seo.articleMeta?.reviewedBy,
    lastReviewedDate: seo.articleMeta?.lastReviewedDate,
    credentials: ORGANIZATION_CREDENTIALS.certifications.map((c) => c.name),
    generatedAt,
  };
}

export function buildMachinePageText(page: SnapshotPage, generatedAt?: string): string {
  const data = buildMachinePageData(page, generatedAt);

  const sections = [
    `# ${data.title}`,
    "",
    `URL: ${data.url}`,
    `Source URL: ${data.sourceUrl}`,
    ...(data.generatedAt ? [`Generated: ${data.generatedAt}`] : []),
    `Kind: ${data.kind}`,
    `Publisher: ${data.publisher}`,
    ...(data.author ? [`Author: ${data.author.name}${data.author.title ? ` (${data.author.title})` : ""}`] : []),
    ...(data.datePublished ? [`Published: ${data.datePublished}`] : []),
    ...(data.dateModified ? [`Last Modified: ${data.dateModified}`] : []),
    ...(data.reviewedBy ? [`Reviewed By: ${data.reviewedBy}`] : []),
    ...(data.lastReviewedDate ? [`Last Reviewed: ${data.lastReviewedDate}`] : []),
    ...(data.credentials && data.credentials.length > 0 ? [`Credentials: ${data.credentials.join(", ")}`] : []),
    `Image: ${data.imageUrl}`,
    `Image Alt: ${data.imageAlt}`,
    "",
    "## Description",
    data.description,
  ];

  if (data.summary.length > 0) {
    sections.push("", "## Summary", ...data.summary.map((entry) => `- ${entry}`));
  }

  if (data.procurementFields.length > 0) {
    sections.push("", "## Procurement Snapshot", ...data.procurementFields.map((entry) => `- ${entry.label}: ${entry.value}`));
  }

  if (data.collectionGuidanceFields.length > 0) {
    sections.push("", "## Selection Guide", ...data.collectionGuidanceFields.map((entry) => `- ${entry.label}: ${entry.value}`));
  }

  if (data.coreGuidanceFields.length > 0) {
    sections.push("", "## Page Guide", ...data.coreGuidanceFields.map((entry) => `- ${entry.label}: ${entry.value}`));
  }

  if (data.articleGuidanceFields.length > 0) {
    sections.push("", "## Buyer Guidance", ...data.articleGuidanceFields.map((entry) => `- ${entry.label}: ${entry.value}`));
  }

  if (data.sourceLinks.length > 0) {
    sections.push("", "## Sources", ...data.sourceLinks.map((entry) => `- ${entry.name}: ${entry.url}`));
  }

  if (data.imageGallery.length > 1) {
    sections.push("", "## Image Gallery", ...data.imageGallery.map((entry) => `- ${entry.alt}: ${entry.url}`));
  }

  if (data.productSpecs.length > 0) {
    sections.push("", "## Key Specs", ...data.productSpecs.map((entry) => `- ${entry.name}: ${entry.value}`));
  }

  if (data.faq.length > 0) {
    sections.push("", "## FAQ");
    data.faq.forEach((entry) => {
      sections.push(`- Q: ${entry.question}`);
      sections.push(`  A: ${entry.answer}`);
    });
  }

  if (data.related.length > 0) {
    sections.push("", "## Related Pages", ...data.related.map((entry) => `- ${entry.name}: ${entry.url}`));
  }

  sections.push("", "## Machine Routes", `- JSON: ${data.machineJsonUrl}`, `- Text: ${data.machineTextUrl}`, "");
  return sections.join("\n");
}


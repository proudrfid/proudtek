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

type PageKind =
  | "home"
  | "product"
  | "article"
  | "faq"
  | "contact"
  | "about"
  | "blog"
  | "collection"
  | "archive"
  | "utility"
  | "page";

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

interface ArticleMeta {
  authorName: string;
  authorUrl: string;
  authorTitle?: string;
  authorExpertise?: string[];
  reviewedBy?: string;
  reviewedByTitle?: string;
  lastReviewedDate?: string;
  publishedAt: string;
  modifiedAt: string;
  publishedLabel: string;
  modifiedLabel: string;
}

interface ImageSelection {
  url: string;
  alt: string;
}

interface ImageCandidate extends ImageSelection {
  score: number;
}

export interface ProductSpec {
  name: string;
  value: string;
}

interface PageContext {
  canonicalUrl: string;
  contentTitle: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  imageGallery: ImageSelection[];
  kind: PageKind;
  breadcrumbItems: BreadcrumbItem[];
  itemList: BreadcrumbItem[];
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
  articleMeta: ArticleMeta | null;
  productSpecs: ProductSpec[];
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

export function buildMachinePageData(page: SnapshotPage): MachinePageData {
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
  };
}

export function buildMachinePageText(page: SnapshotPage): string {
  const data = buildMachinePageData(page);

  const sections = [
    `# ${data.title}`,
    "",
    `URL: ${data.url}`,
    `Source URL: ${data.sourceUrl}`,
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

function resolveContextSourceLinks(context: PageContext): BreadcrumbItem[] {
  return context.kind === "article"
    ? context.articleSourceLinks
    : context.kind === "collection"
      ? context.collectionSourceLinks
      : isCoreSupportKind(context.kind)
        ? context.coreSourceLinks
      : context.productSourceLinks;
}

function resolveSeoSourceLinks(seo: PageSeoData): BreadcrumbItem[] {
  return seo.kind === "article"
    ? seo.articleSourceLinks
    : seo.kind === "collection"
      ? seo.collectionSourceLinks
      : isCoreSupportKind(seo.kind)
        ? seo.coreSourceLinks
      : seo.productSourceLinks;
}

function buildPageContext(page: SnapshotPage, $head: CheerioAPI, $body: CheerioAPI, kind: PageKind): PageContext {
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

function buildLegacyRedirectSeo(page: SnapshotPage, $head: CheerioAPI, targetRoute: string): PageSeoData {
  const normalizedTarget = normalizeRoute(targetRoute);
  const canonicalUrl = absoluteUrl(normalizedTarget);
  const profile = resolveLegacyRedirectProfile(normalizedTarget);
  const imageOverride = resolveImageOverride(normalizedTarget);

  return {
    htmlAttrs: sanitizeHtmlAttrs(page.htmlAttrs),
    bodyAttrs: sanitizeBodyAttrs(page.bodyAttrs),
    headHtml: `${stripNoiseHtmlComments($head("head").html() ?? "")}
<meta http-equiv="refresh" content="0;url=${escapeXml(canonicalUrl)}">`,
    bodyHtml: buildLegacyRedirectBody(page.route, normalizedTarget, profile),
    kind: "page",
    contentTitle: profile.title,
    title: `Moved: ${profile.title} | Proud Tek`,
    description: profile.description,
    canonicalUrl,
    robots: buildRobotsValue(false),
    indexable: false,
    jsonLd: [],
    imageUrl: imageOverride?.url ? absoluteUrl(imageOverride.url) : absoluteUrl(DEFAULT_IMAGE),
    imageAlt: imageOverride?.alt ?? profile.title,
    imageGallery: imageOverride?.url ? [{ url: absoluteUrl(imageOverride.url), alt: imageOverride.alt }] : [],
    faqEntries: [],
    procurementFields: [],
    collectionSummary: [],
    collectionGuidanceFields: [],
    collectionRelatedPages: [],
    collectionSourceLinks: [],
    coreSummary: [],
    coreGuidanceFields: [],
    coreRelatedPages: [],
    coreSourceLinks: [],
    articleSummary: [],
    articleGuidanceFields: [],
    articleRelatedPages: [],
    articleSourceLinks: [],
    productRelatedPages: [],
    productSourceLinks: [],
    ogType: "website",
    articleMeta: null,
  };
}

function buildLegacyRedirectBody(route: string, targetRoute: string, profile: LegacyRedirectProfile): string {
  const escapedRoute = escapeXml(route);
  const escapedTargetRoute = escapeXml(targetRoute);
  const escapedTargetUrl = escapeXml(absoluteUrl(targetRoute));
  const escapedTargetLabel = escapeXml(profile.title);
  const escapedDescription = escapeXml(profile.description);
  const escapedInquiryHref = escapeXml(profile.inquiryHref);
  const escapedInquiryLabel = escapeXml(profile.inquiryLabel);
  const redirectScript = `window.location.replace(${JSON.stringify(targetRoute)});`;

  return `
    <main class="codex-legacy-redirect-shell">
      <section class="codex-legacy-redirect" aria-labelledby="legacy-redirect-title">
        <p class="codex-legacy-redirect__eyebrow">Legacy URL</p>
        <h1 id="legacy-redirect-title">This page has moved</h1>
        <p class="codex-legacy-redirect__lead">
          Proud Tek merged older posts and duplicate routes into one current page so buyers can use the most up-to-date guidance and inquiry path.
        </p>
        <dl class="codex-legacy-redirect__details">
          <div>
            <dt>Old URL</dt>
            <dd>${escapedRoute}</dd>
          </div>
          <div>
            <dt>Current page</dt>
            <dd><a href="${escapedTargetRoute}">${escapedTargetLabel}</a></dd>
          </div>
        </dl>
        <p>${escapedDescription}</p>
        <div class="codex-legacy-redirect__actions">
          <a class="codex-legacy-redirect__action codex-legacy-redirect__action--primary" href="${escapedTargetRoute}">Open current page</a>
          <a class="codex-legacy-redirect__action" href="${escapedInquiryHref}">${escapedInquiryLabel}</a>
        </div>
        <p class="codex-legacy-redirect__meta">
          Redirecting to <a href="${escapedTargetRoute}">${escapedTargetUrl}</a>. If it does not open automatically, use the button above.
        </p>
        <script>${redirectScript}</script>
      </section>
    </main>
  `;
}

interface LegacyRedirectProfile {
  title: string;
  description: string;
  inquiryHref: string;
  inquiryLabel: string;
}

function resolveLegacyRedirectProfile(targetRoute: string): LegacyRedirectProfile {
  const normalized = normalizeRoute(targetRoute);

  if (normalized === "/solutions/hotel-key-cards/") {
    return {
      title: "Hotel Key Card Compatibility Guide",
      description:
        "The current guide combines hotel lock compatibility, card materials, encoding options and early quote requirements in one canonical page.",
      inquiryHref: "/contact/hotel-rfid/",
      inquiryLabel: "Get hotel lock compatibility check",
    };
  }

  if (normalized === "/solutions/rfid-laundry-tags/") {
    return {
      title: "RFID Laundry Tags Buyer's Guide",
      description:
        "The current evergreen guide now holds the material, wash-cycle, frequency and sample-planning details that used to be split across older posts.",
      inquiryHref: "/contact/laundry-rfid/",
      inquiryLabel: "Request laundry tag samples",
    };
  }

  if (normalized === "/solutions/rfid-event-access-control/") {
    return {
      title: "RFID Event Access Control Guide",
      description:
        "The current evergreen guide covers event wristbands, attendee flow, access control setup and custom project planning in one place.",
      inquiryHref: "/contact/event-rfid/",
      inquiryLabel: "Request event RFID quote",
    };
  }

  if (normalized === "/compare/metal-vs-wood-vs-pvc-nfc-business-cards/") {
    return {
      title: "Metal vs Wood vs PVC NFC Business Cards",
      description:
        "The current comparison page concentrates material tradeoffs, branding considerations and shortlist decisions before you request samples or pricing.",
      inquiryHref: "/contact/nfc-branding-cards/",
      inquiryLabel: "Request custom review card",
    };
  }

  if (normalized === "/compare/mifare-plus-ev2-vs-desfire-ev3/") {
    return {
      title: "MIFARE Plus EV2 vs DESFire EV3",
      description:
        "The current comparison page is the canonical place for upgrade-path, security and deployment guidance around MIFARE Plus and DESFire card choices.",
      inquiryHref: "/contact/custom-rfid-cards/",
      inquiryLabel: "Get custom RFID card quote",
    };
  }

  if (normalized === "/compare/pps-vs-silicone-vs-textile-rfid-laundry-tags/") {
    return {
      title: "PPS vs Silicone vs Textile RFID Laundry Tags",
      description:
        "The current comparison page keeps the laundry tag material decision, durability tradeoffs and sampling questions under one evergreen URL.",
      inquiryHref: "/contact/laundry-rfid/",
      inquiryLabel: "Request laundry tag samples",
    };
  }

  if (normalized === "/product/nfc-stickers/") {
    return {
      title: "NFC Stickers",
      description:
        "The current product page is the canonical source for NFC sticker formats, chip options, phone behavior and custom quote requests.",
      inquiryHref: "/contact/rfid-labels-tags/",
      inquiryLabel: "Request NFC sticker quote",
    };
  }

  return {
    title: slugToTitle(normalized.split("/").filter(Boolean).pop() ?? "Current page"),
    description: "This legacy Proud Tek URL now points to the current canonical page for the same topic.",
    inquiryHref: "/contact/custom-rfid-cards/",
    inquiryLabel: "Get custom RFID card quote",
  };
}

function sanitizeHead($head: CheerioAPI): void {
  [
    "title",
    'meta[name="description"]',
    'meta[name="robots"]',
    'meta[name="msapplication-TileImage"]',
    'link[rel="canonical"]',
    'meta[property^="og:"]',
    'meta[name^="twitter:"]',
    'meta[property^="article:"]',
    'script[type="application/ld+json"]',
    'link[rel="alternate"][type="application/json"]',
    'link[rel="alternate"][type*="oembed"]',
    'link[rel="https://api.w.org/"]',
    'link[rel="EditURI"]',
    'link[rel="shortlink"]',
    'script[src*="accounts.google.com/gsi/client"]',
    'script[src*="google-site-kit"]',
    'script[id*="googlesitekit"]',
    'script[src*="wp-statistics"]',
    'script[id*="wp-statistics"]',
    'style[id="wp-emoji-styles-inline-css"]',
    'meta[name="generator"]',
    'meta[name^="google-adsense-platform"]',
  ].forEach((selector) => {
    $head(selector).remove();
  });

  $head("script").each((_, element) => {
    const content = cleanText($head(element).html() ?? "");

    if (
      content.includes("WP_Statistics_Tracker_Object") ||
      content.includes("_googlesitekit") ||
      content.includes("googletagmanager") ||
      content.includes("_wpemojiSettings") ||
      content.includes("wpEmojiSettingsSupports")
    ) {
      $head(element).remove();
    }
  });
}

function sanitizeBody($body: CheerioAPI): void {
  [
    "meta",
    "title",
    "base",
    'link[rel="canonical"]',
    'link[rel="alternate"]',
    'link[rel="shortlink"]',
    'link[rel="EditURI"]',
    'link[rel="https://api.w.org/"]',
    'script[type="application/ld+json"]',
    'script[src*="accounts.google.com/gsi/client"]',
    'script[src*="google-site-kit"]',
    'script[src*="wp-statistics"]',
    'script[id*="googlesitekit"]',
    'script[id*="wp-statistics"]',
    ".googlesitekit-sign-in-with-google__frontend-output-button",
  ].forEach((selector) => {
    $body(selector).remove();
  });

  $body("script").each((_, element) => {
    const content = cleanText($body(element).html() ?? "");

    if (content.includes("WP_Statistics_Tracker_Object") || content.includes("_googlesitekit")) {
      $body(element).remove();
      return;
    }

    // Defer remaining non-critical render-blocking scripts for better LCP
    // (jQuery/WooCommerce/cookie scripts are already fully stripped in render-snapshot.ts)
    const src = ($body(element).attr("src") ?? "").toLowerCase();
    if (
      src &&
      !$body(element).attr("async") &&
      !$body(element).attr("defer") &&
      (src.includes("jarallax") ||
        src.includes("parallax") ||
        src.includes("kb-advanced"))
    ) {
      $body(element).attr("defer", "");
    }
  });

  $body('footer a[href=""], footer a[href="#"], footer a[href="tel:"], footer a[href="mailto:"]').remove();
  $body("footer .footer-social-wrap, footer .header-social-wrap").each((_, element) => {
    if ($body(element).find("a[href]").length === 0) {
      $body(element).remove();
    }
  });

  // Remove empty breadcrumb entries (ghost links with no text that cause double slashes)
  $body(".kadence-breadcrumb-container span").each((_, element) => {
    const $span = $body(element);
    const link = $span.find("a");
    if (link.length > 0 && !cleanText(link.text())) {
      // Remove the empty breadcrumb span and the following delimiter
      const next = $span.next(".bc-delimiter");
      if (next.length) next.remove();
      $span.remove();
    }
  });
}

function isCoreSupportKind(kind: PageKind): boolean {
  return kind === "home" || kind === "about" || kind === "contact" || kind === "faq" || kind === "blog";
}

function dedupeFaqEntries(entries: FaqEntry[], limit = 10): FaqEntry[] {
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

function normalizePageBody($body: CheerioAPI, page: SnapshotPage, context: PageContext): void {
  rewriteLegacyInternalLinks($body);

  if (context.kind === "product") {
    normalizeProductBody($body, page, context);
  }

  if (context.kind === "collection") {
    normalizeCollectionBody($body, context);
  }

  if (context.kind === "article" && context.articleMeta) {
    normalizeArticleBody($body, page, context);
  }

  if (isCoreSupportKind(context.kind)) {
    normalizeCoreBody($body, page, context);
  }

  clarifyBuyerFacingCopy($body);
  normalizeGlobalInquiryEntry($body, page);
  injectIndustriesMenu($body, page);
  refreshNormalizedImageContext($body, page.route, context);
  applyImageAccessibility($body, context);
}

function clarifyBuyerFacingCopy($body: CheerioAPI): void {
  const replacements: Array<[string, string]> = [
    ["Decision table", "Quick comparison"],
    ["RFQ checklist", "Project checklist"],
    ["What to put in the first RFQ brief", "What to include in your first message"],
    ["What happens after you send the brief", "What happens after you contact us"],
    ["Move from product browsing into a more operational RFQ.", "Move from product browsing into a clearer quote request."],
    [
      "Expansion pages that help move from a first shortlist into a cleaner RFQ.",
      "Expansion pages that help turn a first shortlist into a clearer quote request.",
    ],
    [
      "Use this guide when the project already knows the use case, but still needs a tighter implementation or validation workflow before moving into RFQ or sample review.",
      "Use this guide when the project already knows the use case, but still needs a tighter implementation or validation workflow before requesting samples or pricing.",
    ],
    [
      "These are the details that usually remove the wrong formats, materials or chip families before the first RFQ or sample round starts.",
      "These are the details that usually remove the wrong formats, materials, or chip families before the first quote or sample round starts.",
    ],
    ["What makes a label RFQ more useful?", "What makes a label inquiry more useful?"],
    [
      "Procurement teams that need a compatibility-first sample plan before RFQ.",
      "Procurement teams that need a compatibility-first sample plan before requesting a quote.",
    ],
    [
      "When the team wants to avoid a generic RFQ and send a tighter technical brief instead.",
      "When the team wants to avoid a generic quote request and send tighter technical details instead.",
    ],
  ];

  replacements.forEach(([from, to]) => {
    $body("h1, h2, h3, p, a, li, summary").each((_, element) => {
      const node = $body(element);
      if (cleanText(node.text()) === from) {
        node.text(to);
      }
    });
  });

  // Fix grammar issues in WP snapshot content
  const grammarFixes: Array<[RegExp, string]> = [
    [/ProudTek prioritize\b/g, "Proud Tek prioritizes"],
  ];

  $body("p").each((_, element) => {
    const node = $body(element);
    const html = node.html() ?? "";
    let fixed = html;
    grammarFixes.forEach(([pattern, replacement]) => {
      fixed = fixed.replace(pattern, replacement);
    });
    if (fixed !== html) {
      node.html(fixed);
    }
  });
}

function normalizeGlobalInquiryEntry($body: CheerioAPI, page: SnapshotPage): void {
  ensureMobileInquiryEntry($body, page);
  rewriteGlobalInquiryLinks($body);
  rewriteFooterInquirySection($body);

  if (page.route === "/") {
    normalizeHomeHeroInquiryButtons($body);
  }
}

function ensureMobileInquiryEntry($body: CheerioAPI, page: SnapshotPage): void {
  const mobileMenu = $body("#mobile-menu").first();

  if (!mobileMenu.length || mobileMenu.find('a[href="/contact/"], a[href="https://proudtek.com/contact/"]').length) {
    return;
  }

  const currentClass =
    page.route === "/contact/" || page.route.startsWith("/contact/")
      ? " current-menu-item current_page_item"
      : "";

  mobileMenu.append(
    `<li class="menu-item menu-item-type-post_type menu-item-object-page codex-nav-rfq-item${currentClass}"><a href="/contact/" class="codex-nav-rfq-link" title="Request a quote from Proud Tek" aria-label="Request a quote from Proud Tek">Request Quote</a></li>`,
  );
}

function rewriteGlobalInquiryLinks($body: CheerioAPI): void {
  const navSelectors = [
    'nav#site-navigation a[href="/contact/"]',
    'nav#site-navigation a[href="https://proudtek.com/contact/"]',
    'nav#mobile-site-navigation a[href="/contact/"]',
    'nav#mobile-site-navigation a[href="https://proudtek.com/contact/"]',
    'nav#footer-navigation a[href="/contact/"]',
    'nav#footer-navigation a[href="https://proudtek.com/contact/"]',
  ].join(", ");

  $body(navSelectors).each((_, element) => {
    const link = $body(element);
    const label = cleanText(link.text());

    if (/^contact$/i.test(label)) {
      link.text("Request Quote");
    }

    link.attr("href", "/contact/");
    link.attr("title", "Request a quote from Proud Tek");
    link.attr("aria-label", "Request a quote from Proud Tek");
    link.addClass("codex-nav-rfq-link");
    link.parent("li").addClass("codex-nav-rfq-item");
  });

  $body('a[href="/contact/"], a[href="https://proudtek.com/contact/"]').each((_, element) => {
    const link = $body(element);
    const label = cleanText(link.text());

    if (/^contact proud tek$/i.test(label)) {
      link.text("Request Quote from Proud Tek");
      link.attr("title", "Request Quote from Proud Tek");
    }
  });
}

function rewriteFooterInquirySection($body: CheerioAPI): void {
  $body("footer p, footer h2, footer h3, footer h4").each((_, element) => {
    const block = $body(element);
    const rawText = block.text();
    const label = cleanText(rawText);

    if (label === "Contact Us") {
      block.text("Quote & Contact");
      return;
    }

    if (/^Emai:/i.test(label)) {
      block.text(rawText.replace(/^Emai:/i, "Email:"));
    }
  });

  const footerInfo = $body("footer .site-footer-bottom-section-3 .site-info-inner").first();
  if (!footerInfo.length || footerInfo.find(".codex-footer-rfq-entry").length) {
    return;
  }

  const headingWidget = footerInfo
    .find("section.widget")
    .filter((_, element) => /Quote & Contact|RFQ & Contact|Contact Us/i.test(cleanText($body(element).text())))
    .first();
  const rfqHtml = `<section class="widget widget_block codex-footer-rfq-entry"><p><a class="codex-footer-rfq-link" href="/contact/">Request a quote</a></p></section>`;

  if (headingWidget.length) {
    headingWidget.after(rfqHtml);
    return;
  }

  footerInfo.prepend(rfqHtml);
}

/* ── Industries mega-menu injection ──────────────────────────────────── */
const INDUSTRIES_MENU_GROUPS: Array<{ title: string; href: string; items: Array<{ href: string; label: string }> }> = [
  {
    title: "Hospitality",
    href: "/industries/hospitality/",
    items: [
      { href: "/products/rfid-cards/mifare-desfire-ev3-cards/", label: "Hotel Key Cards" },
      { href: "/product/hotel-key-cards/", label: "Hotel RFID Cards" },
      { href: "/product/rfid-wristbands-for-hotels/", label: "Hotel Wristbands" },
      { href: "/product/rfid-laundry-tags/", label: "Linen Tracking Tags" },
    ],
  },
  {
    title: "Retail & Apparel",
    href: "/industries/retail-apparel/",
    items: [
      { href: "/products/rfid-labels/rfid-garment-source-tag/", label: "Garment Source Tags" },
      { href: "/products/rfid-tags/uhf-rfid-apparel-hang-tag/", label: "Apparel Hang Tags" },
      { href: "/products/rfid-tags/uhf-rfid-woven-care-label/", label: "Woven Care Labels" },
      { href: "/products/rfid-tags/uhf-rfid-hard-tag/", label: "Anti-Theft Hard Tags" },
      { href: "/products/rfid-tags/rfid-jewelry-tag/", label: "Jewelry Tags" },
    ],
  },
  {
    title: "Brand Protection",
    href: "/industries/brand-protection/",
    items: [
      { href: "/products/rfid-labels/nfc-sneaker-authentication-tag/", label: "Sneaker Authentication" },
      { href: "/products/rfid-labels/nfc-luxury-handbag-tag/", label: "Luxury Bag Authentication" },
      { href: "/products/rfid-labels/nfc-cosmetics-authentication-label/", label: "Cosmetics Authentication" },
      { href: "/products/rfid-labels/nfc-wine-bottle-tag/", label: "Wine & Spirits Tags" },
      { href: "/products/rfid-labels/nfc-warranty-seal-tag/", label: "Warranty Seal Tags" },
    ],
  },
  {
    title: "Events & Venues",
    href: "/industries/events-venues/",
    items: [
      { href: "/product/rfid-wristbands-for-events/", label: "Event Wristbands" },
      { href: "/products/rfid-wristbands/pvc-rfid-wristband/", label: "Water Park Wristbands" },
      { href: "/products/rfid-wristbands/nfc-payment-wristband/", label: "Cashless Payment Bands" },
      { href: "/products/rfid-tags/rfid-race-timing-tag/", label: "Race Timing Tags" },
    ],
  },
  {
    title: "Healthcare",
    href: "/industries/healthcare/",
    items: [
      { href: "/products/rfid-wristbands/hospital-patient-id-wristband/", label: "Patient ID Wristbands" },
      { href: "/products/rfid-tags/rfid-surgical-instrument-tag/", label: "Surgical Instrument Tags" },
      { href: "/products/rfid-tags/rfid-blood-bag-tag/", label: "Blood Bag Tags" },
      { href: "/products/rfid-labels/rfid-medication-vial-label/", label: "Medication Vial Labels" },
      { href: "/products/rfid-labels/rfid-cryogenic-specimen-label/", label: "Cryogenic Specimen Labels" },
    ],
  },
  {
    title: "Logistics & Supply Chain",
    href: "/industries/logistics/",
    items: [
      { href: "/products/rfid-labels/uhf-rfid-paper-label/", label: "RFID Shipping Labels" },
      { href: "/products/rfid-tags/rfid-pallet-tag/", label: "Pallet Tags" },
      { href: "/products/rfid-tags/rfid-returnable-container-tag/", label: "Returnable Container Tags" },
      { href: "/products/rfid-tags/rfid-bolt-seal/", label: "Container Bolt Seals" },
    ],
  },
  {
    title: "Industrial & Manufacturing",
    href: "/industries/industrial/",
    items: [
      { href: "/products/rfid-tags/rfid-pcb-screw-mount-tag/", label: "PCB Screw-Mount Tags" },
      { href: "/products/rfid-tags/rfid-high-temperature-ceramic-tag/", label: "High-Temp Ceramic Tags" },
      { href: "/products/rfid-tags/rfid-anti-metal-tag/", label: "Anti-Metal Tags" },
      { href: "/products/rfid-tags/rfid-gas-cylinder-tag/", label: "Gas Cylinder Tags" },
      { href: "/products/rfid-tags/rfid-tool-tracking-tag/", label: "Tool Tracking Tags" },
    ],
  },
  {
    title: "EU Compliance",
    href: "/industries/eu-compliance/",
    items: [
      { href: "/products/rfid-labels/nfc-digital-product-passport-tag/", label: "Digital Product Passport" },
      { href: "/products/rfid-labels/nfc-battery-passport-tag/", label: "Battery Passport Tags" },
      { href: "/products/rfid-labels/ntag424-dna-tamper-evident-tag/", label: "NTAG424 DNA Tags" },
    ],
  },
];

function injectIndustriesMenu($body: CheerioAPI, page: SnapshotPage): void {
  // Build a clean, simple dropdown — just 8 industry links, no nested products
  const simpleItems = INDUSTRIES_MENU_GROUPS.map((group) =>
    `<li class="menu-item"><a href="${group.href}">${group.title}</a></li>`
  ).join("");

  const industriesLi = `<li class="menu-item menu-item-has-children codex-industries-menu"
    onmouseenter="this.querySelector('.codex-industries-drop').style.display='block';this.querySelector('a').setAttribute('aria-expanded','true')"
    onmouseleave="this.querySelector('.codex-industries-drop').style.display='none';this.querySelector('a').setAttribute('aria-expanded','false')">
    <a href="/industries/" aria-haspopup="true" aria-expanded="false">Industries</a>
    <ul class="sub-menu codex-industries-drop" role="menu" style="display:none;position:absolute;top:100%;left:0;z-index:9999;background:#fff;min-width:240px;box-shadow:0 8px 24px rgba(0,0,0,.12);border-radius:8px;padding:8px 0;list-style:none;">${simpleItems}</ul>
  </li>`;

  // Desktop: insert after PRODUCTS in the primary menu
  const desktopMenus = $body("#primary-menu, #header-menu");
  desktopMenus.each((_, menu) => {
    const $menu = $body(menu);
    // Skip if already injected
    if ($menu.find(".codex-industries-menu").length) return;
    // Find the PRODUCTS menu item (first item or one linking to /products/)
    const productsItem = $menu.children('li').filter((_, li) => {
      const link = $body(li).children("a").first();
      const href = link.attr("href") || "";
      const text = (link.text() || "").trim().toUpperCase();
      return text === "PRODUCTS" || href.includes("/products/");
    }).first();
    if (productsItem.length) {
      productsItem.after(industriesLi);
    }
  });

  // Mobile: insert after PRODUCTS in mobile menu
  const mobileMenu = $body("#mobile-menu");
  if (mobileMenu.length && !mobileMenu.find(".codex-industries-menu").length) {
    // Build simplified mobile version (flat list of groups)
    const mobileSubItems = INDUSTRIES_MENU_GROUPS.map((group) => {
      const links = group.items
        .map((item) => `<li class="menu-item"><a href="${item.href}">${item.label}</a></li>`)
        .join("");
      return `<li class="menu-item menu-item-has-children">
        <a href="#">${group.title}</a>
        <ul class="sub-menu">${links}</ul>
      </li>`;
    }).join("");

    const mobileLi = `<li class="menu-item menu-item-has-children codex-industries-menu">
      <a href="/industries/">Industries</a>
      <ul class="sub-menu">${mobileSubItems}</ul>
    </li>`;

    const mobileProductsItem = mobileMenu.children('li').filter((_, li) => {
      const link = $body(li).children("a").first();
      const text = (link.text() || "").trim().toUpperCase();
      return text === "PRODUCTS";
    }).first();
    if (mobileProductsItem.length) {
      mobileProductsItem.after(mobileLi);
    }
  }
}

function normalizeHomeHeroInquiryButtons($body: CheerioAPI): void {
  $body('.wp-block-kadence-advancedbtn a[href="/contact/"], .wp-block-kadence-advancedbtn a[href="https://proudtek.com/contact/"]')
    .each((_, element) => {
      const button = $body(element);
      const label = cleanText(button.text()).toLowerCase();
      const innerText = button.find(".kt-btn-inner-text").first();

      if (/get a free quote/.test(label)) {
        if (innerText.length) {
          innerText.text("Request Quote");
        } else {
          button.text("Request Quote");
        }

        button.attr("href", "/contact/");
        return;
      }

      if (/request samples/.test(label)) {
        if (innerText.length) {
          innerText.text("Request Samples");
        } else {
          button.text("Request Samples");
        }

        button.attr("href", "/contact/#contact-rfq-form");
      }
    });
}

function normalizeProductBody($body: CheerioAPI, page: SnapshotPage, context: PageContext): void {
  const product = $body("div.product").first();

  if (!product.length) {
    return;
  }

  product.find("h1.product_title, .summary.entry-summary > h1").first().text(context.contentTitle);
  const canonicalPath = normalizeRoute(new URL(context.canonicalUrl).pathname);
  const leadOverride = PRODUCT_LEAD_PARAGRAPH_OVERRIDES[canonicalPath];
  if (leadOverride) {
    const shortDescription = product.find(".summary.entry-summary .woocommerce-product-details__short-description").first();
    const leadParagraph = shortDescription.find("p").filter((_, element) => cleanText($body(element).text()).length > 0).first();

    if (leadParagraph.length) {
      leadParagraph.text(leadOverride);
    } else if (shortDescription.length) {
      shortDescription.prepend(`<p>${escapeXml(leadOverride)}</p>`);
    }
  }

  product.find("p.price").each((_, element) => {
    if (!cleanText($body(element).text())) {
      $body(element).remove();
    }
  });

  product.find(".woocommerce-product-gallery").each((_, element) => {
    const $gallery = $body(element);
    const style = $gallery.attr("style") ?? "";

    if (!style) {
      return;
    }

    const nextStyle = style
      .replace(/opacity\s*:\s*0\s*;?/gi, "")
      .replace(/transition\s*:\s*opacity\s*\.25s\s*ease-in-out\s*;?/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim()
      .replace(/^;|;$/g, "");

    if (nextStyle) {
      $gallery.attr("style", nextStyle);
      return;
    }

    $gallery.removeAttr("style");
  });

  product.find(".codex-product-support").remove();
  product.find(".codex-product-cta").remove();
  product.find(".single-product-extras").remove();

  const ctaProfile = resolveProductCtaProfile(canonicalPath, context.contentTitle);
  product.find('a[href="/contact/"], a[href="https://proudtek.com/contact/"]').each((_, element) => {
    $body(element).attr("href", ctaProfile.href);
  });

  // Legacy renderProductCta removed — now handled by injectConversionBlocks()

  const supportHtml = renderProductSupportBlock(context);
  if (supportHtml) {
    const anchor = product.find(".woocommerce-tabs").first();

    if (anchor.length) {
      anchor.after(supportHtml);
    } else {
      product.find(".summary.entry-summary").after(supportHtml);
    }
  }

  const specSheetHtml = renderProductSpecSheet(canonicalPath);
  if (specSheetHtml) {
    const specAnchor = product.find(".codex-product-support").first();
    if (specAnchor.length) {
      specAnchor.after(specSheetHtml);
    } else {
      const tabAnchor = product.find(".woocommerce-tabs").first();
      if (tabAnchor.length) {
        tabAnchor.after(specSheetHtml);
      } else {
        product.find(".summary.entry-summary").after(specSheetHtml);
      }
    }
  }

  injectConversionBlocks($body, page, "product", {
    canonicalUrl: context.canonicalUrl,
    contentTitle: context.contentTitle,
    description: context.description,
  });
}

function renderProductCta(context: PageContext): string {
  const canonicalPath = normalizeRoute(new URL(context.canonicalUrl).pathname);
  const profile = resolveProductCtaProfile(canonicalPath, context.contentTitle);

  return `<section class="codex-product-cta" aria-label="Fast product inquiry path">
    <div class="codex-product-cta__copy">
      <p class="codex-product-cta__eyebrow">Product inquiry</p>
      <h2>Get pricing, samples, or compatibility help</h2>
      <p>${escapeXml(profile.description)}</p>
    </div>
    <ul class="codex-product-cta__brief">
      ${profile.briefItems.map((item) => `<li>${escapeXml(item)}</li>`).join("")}
    </ul>
    <div class="codex-product-cta__actions">
      <a class="codex-product-cta__primary" href="${escapeXml(profile.href)}">${escapeXml(profile.label)}</a>
    </div>
  </section>`;
}

function resolveProductCtaProfile(canonicalPath: string, contentTitle: string): InquiryCtaProfile {
  const normalized = canonicalPath.toLowerCase();

  if (/rfid-wristbands-for-hotels/.test(normalized) || /(hotel|room-key|key-card)/.test(normalized)) {
    return {
      href: "/contact/hotel-rfid/",
      label: "Get hotel lock compatibility check",
      description:
        "Use the hotel RFID route when the next step is lock compatibility, sample planning, encoding support or a production quote.",
      briefItems: [
        "Lock, encoder or PMS environment",
        "Card or wristband format, material and encoding need",
        "Sample quantity, property count and target date",
      ],
    };
  }

  if (/(laundry|linen)/.test(normalized)) {
    return {
      href: "/contact/laundry-rfid/",
      label: "Request laundry tag samples",
      description:
        "Use the laundry RFID route when wash durability, attachment method and reader validation matter more than broad catalog browsing.",
      briefItems: [
        "Wash profile, textile type and attachment method",
        "Reader environment, tag form factor and size limit",
        "Sample split, validation site and rollout timing",
      ],
    };
  }

  if (/(wristband|event|coconut-shell)/.test(normalized)) {
    return {
      href: "/contact/event-rfid/",
      label: "Request event RFID quote",
      description:
        "Use the event RFID route when the brief needs to cover gate flow, wristband format, numbering logic and launch timing together.",
      briefItems: [
        "Attendance, gate flow and event format",
        "Band style, chip choice and access logic",
        "Sample deadline, event date and reorder expectations",
      ],
    };
  }

  if (/(reader|scanner|acr122u)/.test(normalized)) {
    return {
      href: "/contact/rfid-readers/",
      label: "Ask for reader recommendation",
      description:
        "Use the reader route when protocol support, SDK requirements and pilot hardware fit are the real buying decision.",
      briefItems: [
        "Chip standards, interface and read-range target",
        "SDK, middleware or software environment",
        "Pilot quantity, accessory needs and integration timing",
      ],
    };
  }

  if (/(windshield|vehicle|headlight|transponder|\bcar\b)/.test(normalized)) {
    return {
      href: "/contact/vehicle-rfid/",
      label: "Request vehicle RFID guidance",
      description:
        "Tell us where the tag mounts (windshield inside, headlight, bumper), your required read range, and whether you need tamper-evident anti-transfer — we'll match the right UHF label.",
      briefItems: [
        "Mounting position and vehicle type",
        "Required read distance and reader setup (portal, handheld)",
        "Pilot fleet size and rollout date",
      ],
    };
  }

  if (/(key-fob|keyfob|fob)/.test(normalized)) {
    return {
      href: "/contact/access-control-keyfobs/",
      label: "Request keyfob quote",
      description:
        "Use the keyfob route when reader compatibility, shell style and branding requirements need to be confirmed in the first reply.",
      briefItems: [
        "Reader compatibility and chip family",
        "Shell style, numbering and logo needs",
        "Sample target, reorder volume and timing",
      ],
    };
  }

  if (/(google-review|review)/.test(normalized)) {
    return {
      href: "/contact/nfc-branding-cards/",
      label: "Request custom review card",
      description:
        "Use the NFC branding route when the real decision is about review flow, placement, phone compatibility and branded rollout.",
      briefItems: [
        "Review flow, redirect or QR logic",
        "Card or stand format and phone behavior",
        "Pilot quantity, locations and rollout date",
      ],
    };
  }

  if (/(business-card|metal-nfc-card|wooden-rfid-card|eco_rfid_card|nfc-ring|nfc-cards?)/.test(normalized)) {
    return {
      href: "/contact/nfc-branding-cards/",
      label: "Request custom NFC card",
      description:
        "Use the NFC branding route when the shortlist depends on material, phone compatibility, encoding workflow and premium finish decisions.",
      briefItems: [
        "Target phones and tap or redirect workflow",
        "Material, finish and personalization needs",
        "Sample quantity, team rollout and timing",
      ],
    };
  }

  if (/(label|sticker|tag)/.test(normalized)) {
    return {
      href: "/contact/rfid-labels-tags/",
      label: /nfc-stickers/.test(normalized) ? "Request NFC sticker quote" : "Request label and tag quote",
      description:
        "Use the labels and tags route when surface, adhesive, read environment and converting details control the buying decision.",
      briefItems: [
        "Mounting surface, adhesive or on-metal need",
        "Chip choice, read environment and print or encoding",
        "Sample rolls, application method and launch date",
      ],
    };
  }

  return {
    href: "/contact/custom-rfid-cards/",
    label: "Get custom RFID card quote",
    description: `Use the card inquiry route when ${contentTitle} is already close to the right fit and the next step is pricing, samples or customization confirmation.`,
    briefItems: [
      "Chip family, protocol or security requirement",
      "Material, print, numbering or encoding needs",
      "Sample quantity, annual volume and target date",
    ],
  };
}

function resolveCollectionCtaProfile(canonicalPath: string): InquiryCtaProfile {
  const normalized = canonicalPath.toLowerCase();

  if (normalized === "/products/all/") {
    return {
      href: "/contact/",
      label: "Contact the right RFID specialist",
      description:
        "Not sure which product family fits your project? Tell us your application, reader environment, and timeline — we'll point you to the right collection and send matching samples.",
      briefItems: [
        "Your application (hotel, laundry, event, vehicle, etc.)",
        "Installed reader brand or chip preference",
        "Sample quantity and target delivery date",
      ],
      secondaryLinks: [
        { name: "Hotel key card guide", url: absoluteUrl("/solutions/hotel-key-cards/") },
        { name: "Laundry tags guide", url: absoluteUrl("/solutions/rfid-laundry-tags/") },
        { name: "Review card guide", url: absoluteUrl("/solutions/google-review-nfc-card/") },
      ],
    };
  }

  if (/(reader|scanner|acr122u|rfid-readers)/.test(normalized)) {
    return {
      href: "/contact/rfid-readers/",
      label: "Discuss reader requirements",
      description:
        "Tell us your chip type, host OS, and whether you need desktop USB or portable Bluetooth — we'll recommend the right reader and ship a test unit.",
      briefItems: [
        "Chip or tag type you need to read/write",
        "Host OS and SDK language preference",
        "Pilot quantity and integration timeline",
      ],
      secondaryLinks: [
        { name: "Reader and encoding guide", url: absoluteUrl("/solutions/rfid-readers-and-encoding/") },
        { name: "Reader selection guide", url: absoluteUrl("/guides/rfid-reader-writer-selection/") },
        { name: "ACR122U product page", url: absoluteUrl("/product/acr122u/") },
      ],
    };
  }

  if (/(key-fob|keyfob|fob|rfid-keyfobs)/.test(normalized)) {
    return {
      href: "/contact/access-control-keyfobs/",
      label: "Discuss keyfob requirements",
      description:
        "Share your access control reader brand and preferred fob shape — we'll confirm chip compatibility and send samples with your logo engraved.",
      briefItems: [
        "Reader brand and model (e.g. HID, MIFARE, iCLASS)",
        "Fob shape, logo artwork, and numbering range",
        "Pilot quantity and reorder expectations",
      ],
      secondaryLinks: [
        { name: "Keyfob access-control guide", url: absoluteUrl("/solutions/rfid-keyfobs-access-control/") },
        { name: "Keyfob vs card vs wristband", url: absoluteUrl("/compare/keyfob-vs-card-vs-wristband-access-control/") },
        { name: "Hotel RFID access guide", url: absoluteUrl("/solutions/hotel-rfid-access-control/") },
      ],
    };
  }

  if (/(wristband|rfid-wristbands)/.test(normalized)) {
    return {
      href: "/contact/event-rfid/",
      label: "Discuss wristband requirements",
      description:
        "Tell us your event type, expected attendance, and whether guests will be near water — we'll recommend band material, closure style, and chip, then send samples before your deadline.",
      briefItems: [
        "Event type (festival, hotel, waterpark, healthcare)",
        "Band material, closure style, and anti-transfer need",
        "Event date, sample deadline, and production quantity",
      ],
      secondaryLinks: [
        { name: "Event RFID access guide", url: absoluteUrl("/solutions/rfid-event-access-control/") },
        { name: "Hotels vs events vs resorts", url: absoluteUrl("/compare/rfid-wristbands-hotels-vs-events-vs-resorts/") },
        { name: "Silicone vs fabric vs woven", url: absoluteUrl("/compare/silicone-vs-fabric-vs-woven-rfid-wristbands/") },
      ],
    };
  }

  if (/(label|sticker|rfid-labels)/.test(normalized)) {
    return {
      href: "/contact/rfid-labels-tags/",
      label: "Discuss label requirements",
      description:
        "Tell us what surface the label sticks to, whether it needs phone-tap NFC or long-range UHF, and your print artwork — we'll recommend the right inlay and adhesive.",
      briefItems: [
        "Mounting surface (glass, metal, paper, curved)",
        "NFC phone-tap or UHF long-range use case",
        "Label size, print artwork, and roll quantity",
      ],
      secondaryLinks: [
        { name: "Asset-tracking label guide", url: absoluteUrl("/solutions/rfid-asset-tracking-labels/") },
        { name: "On-metal vs standard NFC stickers", url: absoluteUrl("/compare/on-metal-nfc-labels-vs-standard-nfc-stickers/") },
        { name: "Review card vs NFC sticker", url: absoluteUrl("/compare/google-review-nfc-card-vs-nfc-sticker/") },
      ],
    };
  }

  if (/(laundry|linen)/.test(normalized)) {
    return {
      href: "/contact/laundry-rfid/",
      label: "Discuss laundry tag requirements",
      description:
        "Share your wash cycle temperature, textile type, and daily volume — we'll recommend PPS, silicone, or textile tags and ship test samples for your laundry line.",
      briefItems: [
        "Wash temperature and cycle count (e.g. 200+ industrial washes)",
        "Textile type (uniform, linen, towel) and attachment method",
        "Pilot quantity and laundry facility location",
      ],
      secondaryLinks: [
        { name: "Laundry tags guide", url: absoluteUrl("/solutions/rfid-laundry-tags/") },
        { name: "Laundry tag material comparison", url: absoluteUrl("/compare/pps-vs-silicone-vs-textile-rfid-laundry-tags/") },
        { name: "HF vs UHF laundry tags", url: absoluteUrl("/compare/uhf-vs-hf-rfid-laundry-tags/") },
      ],
    };
  }

  if (/(windshield|vehicle|headlight|transponder|\bcar\b)/.test(normalized)) {
    return {
      href: "/contact/vehicle-rfid/",
      label: "Request vehicle RFID guidance",
      description:
        "Tell us where the tag mounts (windshield inside, headlight, bumper), your required read range, and whether you need tamper-evident anti-transfer — we'll match the right UHF label.",
      briefItems: [
        "Mounting position and vehicle type",
        "Required read distance and reader setup (portal, handheld)",
        "Pilot fleet size and rollout date",
      ],
      secondaryLinks: [
        { name: "Vehicle RFID guide", url: absoluteUrl("/solutions/vehicle-rfid-identification/") },
        { name: "Asset-tracking HF vs UHF", url: absoluteUrl("/compare/hf-vs-uhf-rfid-for-asset-tracking/") },
        { name: "RFID labels collection", url: absoluteUrl("/products/rfid-labels/") },
      ],
    };
  }

  if (/(tag|rfid-tags)/.test(normalized)) {
    return {
      href: "/contact/rfid-labels-tags/",
      label: "Discuss RFID tag requirements",
      description:
        "Share what you're tagging (garments, vehicles, assets), the operating environment, and your read distance — we'll recommend HF or UHF tags and send samples.",
      briefItems: [
        "Tagged item and mounting method (sew, stick, bolt)",
        "Operating environment (wash, outdoor UV, heat)",
        "Pilot quantity and target read distance",
      ],
      secondaryLinks: [
        { name: "Laundry tags guide", url: absoluteUrl("/solutions/rfid-laundry-tags/") },
        { name: "Vehicle RFID guide", url: absoluteUrl("/solutions/vehicle-rfid-identification/") },
        { name: "HF vs UHF for asset tracking", url: absoluteUrl("/compare/hf-vs-uhf-rfid-for-asset-tracking/") },
      ],
    };
  }

  return {
    href: "/contact/custom-rfid-cards/",
    label: "Discuss RFID card requirements",
    description:
      "Tell us your lock brand, chip preference, and quantity — we'll recommend the right card format, confirm print and encoding options, and send samples.",
    briefItems: [
      "Lock or reader brand and chip family",
      "Card material, print artwork, and encoding specs",
      "Sample quantity and production timeline",
    ],
    secondaryLinks: [
      { name: "Hotel key card guide", url: absoluteUrl("/solutions/hotel-key-cards/") },
      { name: "NFC business card guide", url: absoluteUrl("/solutions/nfc-business-card/") },
      { name: "MIFARE hotel lock comparison", url: absoluteUrl("/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/") },
    ],
  };
}

function normalizeCollectionBody($body: CheerioAPI, context: PageContext): void {
  $body(".codex-collection-support").remove();

  const canonicalPath = normalizeRoute(new URL(context.canonicalUrl).pathname);
  const ctaProfile = resolveCollectionCtaProfile(canonicalPath);
  const main = $body("main").first();
  if (main.length) {
    main.find('a[href="/contact/"], a[href="https://proudtek.com/contact/"]').each((_, element) => {
      $body(element).attr("href", ctaProfile.href);
    });
  }

  const supportHtml = renderCollectionSupportBlock(context);
  if (!supportHtml) {
    return;
  }

  const header = $body(".woocommerce-products-header").first();
  if (header.length) {
    header.after(supportHtml);
    return;
  }

  const products = $body("ul.products, .products").first();
  if (products.length) {
    products.before(supportHtml);
    return;
  }

  $body("main").first().prepend(supportHtml);
}

function normalizeCoreBody($body: CheerioAPI, page: SnapshotPage, context: PageContext): void {
  $body(".codex-core-support").remove();
  $body(".codex-growth-hub").remove();
  $body(".codex-contact-form-brief").remove();

  if (context.kind === "home") {
    enhanceHomeHero($body);
  }

  if (context.kind === "blog" && page.route === "/blog/") {
    // Remove all legacy WordPress blog content, keep only the main shell
    $body(".content-wrap").remove();
    $body(".entry-content").remove();
    $body(".archive-posts").remove();
    $body(".kadence-posts").remove();
    injectBlogArticleGrid($body, page);
  } else if (context.kind === "blog") {
    normalizeBlogArchiveCards($body);
  }

  if (page.route === "/about/") {
    enhanceAboutPage($body);
  }

  if (page.route === "/faq/") {
    enhanceFaqPage($body);
  }

  if (context.kind === "contact" && page.route === "/contact/") {
    enhancePrimaryContactPage($body);
    injectConversionBlocks($body, page, "contact", {
      canonicalUrl: context.canonicalUrl,
      contentTitle: context.contentTitle,
      description: context.description,
    });
  }

  const supportHtml = "";
  const trustBarHtml = context.kind === "home" ? renderTrustBar() : "";
  const growthHtml =
    context.kind === "home"
      ? renderHomeGrowthHub() + trustBarHtml
      : context.kind === "blog" && page.route !== "/blog/"
        ? renderBlogGrowthHub()
        : "";
  const insertedHtml = [growthHtml, supportHtml].filter(Boolean).join("");
  if (!insertedHtml) {
    return;
  }

  if (context.kind === "home") {
    const heroBlock = $body(".entry-content > .wp-block-cover, .entry-content > .wp-block-group, .entry-content > *").first();
    if (heroBlock.length) {
      heroBlock.after(insertedHtml);
    }
    // Inject quote brief near the bottom — after the "Easy Process" section or before the last section
    const quoteBriefHtml = renderHomeQuoteBrief();
    const easyProcess = $body(".kt-infobox-textcontent:contains('06.')").closest(".kb-row-layout-wrap");
    if (easyProcess.length) {
      easyProcess.closest(".entry-content > *").after(quoteBriefHtml);
    } else {
      // Fallback: append before the last content block
      const lastBlock = $body(".entry-content > *").last();
      if (lastBlock.length) {
        lastBlock.before(quoteBriefHtml);
      }
    }
    return;
  }

  if (context.kind === "blog") {
    const posts = $body("article, .wp-block-query, .kadence-posts, .archive-posts").first();
    if (posts.length) {
      posts.before(insertedHtml);
      return;
    }
  }

  if (context.kind === "contact" && page.route === "/contact/") {
    const formWrap = $body(".wp-block-kadence-form").first();
    const formBrief = formWrap.prev(".codex-contact-form-brief");

    if (formBrief.length) {
      formBrief.before(insertedHtml);
      return;
    }

    if (formWrap.length) {
      formWrap.before(insertedHtml);
      return;
    }
  }

  const entryContent = $body(".entry-content").first();
  if (entryContent.length) {
    entryContent.prepend(insertedHtml);
    return;
  }

  const main = $body(".site-main, main").first();
  if (main.length) {
    main.prepend(insertedHtml);
    return;
  }

  $body("body").prepend(insertedHtml);
}

function enhanceHomeHero($body: CheerioAPI): void {
  const heroHeading = $body(".entry-content .wp-block-cover h1").first();

  if (!heroHeading.length) {
    return;
  }

  heroHeading.text("Custom RFID and NFC manufacturing for global buyers");
  const heroLead = heroHeading
    .nextAll("p")
    .filter((_, element) => cleanText($body(element).text()).length > 0)
    .first();

  if (heroLead.length) {
    heroLead.text("Samples, compatibility checks, and production support.");
  }

  heroHeading
    .nextAll("p")
    .filter((_, element) => cleanText($body(element).text()).length === 0)
    .remove();
}

function enhanceAboutPage($body: CheerioAPI): void {
  const entryContent = $body(".entry-content").first();
  const aboutHeading = $body("h2").filter((_, element) => cleanText($body(element).text()) === "About Us").first();

  if (!$body("h1").length && entryContent.length) {
    entryContent.prepend(
      `<div class="codex-about-header">
        <h1>About Proud Tek</h1>
        <p>Proud Tek is a Shenzhen-based RFID and NFC manufacturer supporting custom cards, tags, labels, readers, keyfobs and wristbands for global B2B sourcing programs.</p>
      </div>`,
    );
  }

  if (aboutHeading.length) {
    aboutHeading.text("Company overview");
  }

  $body("h2")
    .filter((_, element) => /We look forward to creating something for you to treasure\./i.test(cleanText($body(element).text())))
    .first()
    .text("Manufacturing support for custom RFID programs");

  $body("h2")
    .filter((_, element) => /What our awesome customers think/i.test(cleanText($body(element).text())))
    .first()
    .text("Customer feedback");

  $body("h2")
    .filter((_, element) => /We cooperate with popular brands all over the world/i.test(cleanText($body(element).text())))
    .first()
    .text("Global customer base");
}

function enhanceFaqPage($body: CheerioAPI): void {
  const faqHeading = $body("h2").filter((_, element) => cleanText($body(element).text()) === "FAQ Help Center").first();

  if (faqHeading.length) {
    faqHeading.replaceWith("<h1>RFID FAQ for Buyers</h1>");
    const intro = $body("h1").filter((_, element) => cleanText($body(element).text()) === "RFID FAQ for Buyers").first().nextAll("p").first();

    if (intro.length) {
      intro.text("Use this page to answer compatibility, sample, ordering, and shipping questions before you request pricing or samples.");
    }
  } else if (!$body("h1").length) {
    const entryContent = $body(".entry-content").first();
    entryContent.prepend("<h1>RFID FAQ for Buyers</h1>");
  }

  $body("h2")
    .filter((_, element) => cleanText($body(element).text()) === "Sample & order")
    .first()
    .text("Samples and orders");

  $body("h2")
    .filter((_, element) => cleanText($body(element).text()) === "Shipping & Recent Orders")
    .first()
    .text("Shipping and order handling");
}

// Blog-specific hero images (Unsplash, free commercial use)
const BLOG_THUMBNAIL_MAP: Record<string, string> = {
  "/blog/how-hotel-rfid-key-cards-work/": "/blog-images/hotel-rfid-key-cards.jpg",
  "/blog/rfid-laundry-tags-buyers-guide/": "/blog-images/laundry-tags.jpg",
  "/blog/nfc-business-cards-guide/": "/blog-images/metal-card.jpg",
  "/blog/rfid-frequencies-lf-hf-uhf-explained/": "/blog-images/nfc-chip.jpg",
  "/blog/rfid-wristbands-festivals-events/": "/blog-images/festival-wristband.jpg",
  "/blog/mifare-classic-vs-desfire-hotel-chips/": "/blog-images/hotel-chip-compare.jpg",
  "/blog/hotel-key-card-suppliers-guide/": "/blog-images/hotel-lobby.jpg",
  "/blog/hotel-key-card-encoding-explained/": "/blog-images/hotel-reception.jpg",
  "/blog/magnetic-stripe-vs-rfid-hotel-cards/": "/blog-images/hotel-door.jpg",
  "/blog/rfid-key-fob-access-control/": "/blog-images/access-control.jpg",
  "/blog/pps-vs-silicone-vs-textile-laundry-tags/": "/blog-images/laundry-roi.jpg",
  "/blog/rfid-laundry-system-roi/": "/blog-images/laundry-tags.jpg",
  "/blog/rfid-asset-tracking-warehouses/": "/blog-images/warehouse.jpg",
  "/blog/rfid-led-tags-warehouse-location/": "/blog-images/warehouse-led.jpg",
  "/blog/rfid-windshield-tags-vehicle-id/": "/blog-images/windshield-tag.jpg",
  "/blog/google-review-nfc-cards-restaurants/": "/blog-images/restaurant-review.jpg",
  "/blog/nfc-stickers-marketing-campaigns/": "/blog-images/nfc-marketing.jpg",
  "/blog/metal-nfc-cards-business-networking/": "/blog-images/metal-card.jpg",
  "/blog/ntag213-vs-ntag215-vs-ntag216/": "/blog-images/nfc-chip.jpg",
  "/blog/how-nfc-tags-work-smartphones/": "/blog-images/smartphone-nfc.jpg",
  "/blog/nfc-product-authentication/": "/blog-images/product-auth.jpg",
  "/blog/nfc-smart-rings-guide/": "/blog-images/smart-ring.jpg",
  "/blog/how-to-program-nfc-tags/": "/blog-images/program-nfc.jpg",
  "/blog/wooden-nfc-cards-eco-branding/": "/blog-images/eco-wood.jpg",
  "/blog/silicone-vs-fabric-vs-tyvek-wristbands/": "/blog-images/festival-wristband.jpg",
  "/blog/cashless-payment-rfid-wristbands/": "/blog-images/cashless-payment.jpg",
  "/blog/rfid-event-access-control-setup/": "/blog-images/event-access.jpg",
  "/blog/uhf-rfid-wristbands-long-range/": "/blog-images/uhf-wristband-event.jpg",
  "/blog/rfid-vs-qr-codes-events/": "/blog-images/rfid-vs-qr.jpg",
  "/blog/what-is-mifare-complete-guide/": "/blog-images/mifare-guide.jpg",
  "/blog/rfid-card-materials-pvc-pet-abs-wood/": "/blog-images/card-materials.jpg",
  "/blog/how-rfid-readers-work/": "/blog-images/rfid-readers.jpg",
  "/blog/em4100-vs-t5577-125khz-comparison/": "/blog-images/chip-125khz.jpg",
  "/blog/java-cards-smart-card-os-explained/": "/blog-images/java-smartcard.jpg",
  "/blog/desfire-ev1-vs-ev2-vs-ev3/": "/blog-images/desfire-security.jpg",
  "/blog/rfid-data-encoding-memory/": "/blog-images/data-encoding.jpg",
  "/blog/rfid-healthcare-patient-tracking/": "/blog-images/healthcare-rfid.jpg",
  "/blog/rfid-retail-inventory-management/": "/blog-images/retail-inventory.jpg",
  "/blog/digital-product-passports-nfc/": "/blog-images/digital-passport.jpg",
  "/blog/rfid-logistics-supply-chain/": "/blog-images/logistics.jpg",
  "/blog/eco-friendly-rfid-sustainable-cards/": "/blog-images/eco-sustainable.jpg",
  "/blog/rfid-market-trends-forecast/": "/blog-images/market-trends.jpg",
  "/blog/rfid-wristbands-hotels-resorts/": "/blog-images/hotel-resort.jpg",
  "/blog/nfc-door-locks-rfid-cards/": "/blog-images/nfc-door-lock.jpg",
  "/blog/hotel-key-card-design-printing/": "/blog-images/card-design.jpg",
  "/blog/rfid-elevator-floor-access/": "/blog-images/elevator-building.jpg",
  "/blog/waterproof-rfid-tags-outdoor/": "/blog-images/waterproof-outdoor.jpg",
  "/blog/coconut-shell-rfid-wristbands-eco/": "/blog-images/coconut-eco.jpg",
  "/blog/anti-counterfeiting-rfid-events/": "/blog-images/anti-counterfeit.jpg",
  "/blog/uhf-vs-hf-rfid-frequency-choice/": "/blog-images/uhf-vs-hf.jpg",
};

function getBlogThumbnails(): Record<string, string> {
  return BLOG_THUMBNAIL_MAP;
}

/* ── Blog definitions from Content Collections (lazy cache) ──────────── */

interface BlogDefEntry { route: string; title: string; summary: string; kicker: string }
let _blogDefsCache: BlogDefEntry[] | null = null;

/** Pre-load blog definitions into sync cache. Must be called once before buildPageSeo. */
export async function initBlogDefinitions(): Promise<void> {
  if (_blogDefsCache) return;
  const entries = await getCollection("editorial");
  _blogDefsCache = entries
    .filter((e) => !e.id.startsWith("_unused/") && e.data.group === "blog")
    .map((e) => ({ route: e.data.route, title: e.data.title, summary: e.data.summary, kicker: e.data.kicker }));
}

function injectBlogArticleGrid($body: CheerioAPI, _page?: SnapshotPage): void {
  if (!_blogDefsCache || _blogDefsCache.length === 0) {
    return;
  }

  // Collect all posts with their cluster
  const thumbMap = getBlogThumbnails();
  const allPosts: Array<{ route: string; title: string; summary: string; kicker: string; thumb: string }> = [];
  const clusterSet = new Set<string>();
  for (const blog of _blogDefsCache) {
    const kicker = blog.kicker || "RFID Technology";
    clusterSet.add(kicker);
    allPosts.push({ route: blog.route, title: blog.title, summary: blog.summary, kicker, thumb: thumbMap[blog.route] ?? "" });
  }

  // Topic filter pills
  const topicPills = Array.from(clusterSet)
    .map((topic) => {
      const count = allPosts.filter((p) => p.kicker === topic).length;
      return `<button class="codex-blog-pill" data-topic="${escapeXml(topic)}">${escapeXml(topic)} <span>${count}</span></button>`;
    })
    .join("");

  // All cards in a flat 3-column grid
  const cardsHtml = allPosts
    .map(
      (post) =>
        `<a class="codex-blog-grid-card" href="${escapeXml(post.route)}" data-topic="${escapeXml(post.kicker)}">
          ${post.thumb ? `<img class="codex-blog-grid-card__thumb" src="${escapeXml(post.thumb)}" alt="${escapeXml(post.title)}" loading="lazy" decoding="async" />` : ""}
          <span class="codex-blog-grid-card__tag">${escapeXml(post.kicker)}</span>
          <strong>${escapeXml(post.title)}</strong>
          <p>${escapeXml(truncateText(post.summary, 120))}</p>
          <span class="codex-blog-grid-card__cta">Read guide →</span>
        </a>`,
    )
    .join("");

  const sectionHtml = `<section class="codex-blog-index" aria-label="Blog articles">
    <div class="codex-blog-index__header">
      <h1>RFID &amp; NFC Knowledge Base</h1>
      <p>${allPosts.length} technical guides for procurement teams evaluating RFID cards, tags, labels, readers, keyfobs and wristbands.</p>
    </div>
    <nav class="codex-blog-index__topics" aria-label="Filter by topic">
      <button class="codex-blog-pill codex-blog-pill--active" data-topic="all">All <span>${allPosts.length}</span></button>
      ${topicPills}
    </nav>
    <div class="codex-blog-index__grid">
      ${cardsHtml}
    </div>
    <script>
      (function() {
        var pills = document.querySelectorAll('.codex-blog-pill');
        var cards = document.querySelectorAll('.codex-blog-grid-card');
        pills.forEach(function(pill) {
          pill.addEventListener('click', function() {
            var topic = this.getAttribute('data-topic');
            pills.forEach(function(p) { p.classList.remove('codex-blog-pill--active'); });
            this.classList.add('codex-blog-pill--active');
            cards.forEach(function(card) {
              if (topic === 'all' || card.getAttribute('data-topic') === topic) {
                card.style.display = '';
              } else {
                card.style.display = 'none';
              }
            });
          });
        });
      })();
    </script>
  </section>`;

  const main = $body("main#main, main.site-main").first();
  if (main.length) {
    main.append(sectionHtml);
  }
}

function normalizeBlogArchiveCards($body: CheerioAPI): void {
  $body("article.loop-entry, .archive-posts article, .kadence-posts article").each((_, element) => {
    const card = $body(element);
    const titleLink = card.find(".entry-title a").first();
    const href = titleLink.attr("href") ?? "";
    const title = buildArchiveCardTitle(href, titleLink.text());

    if (titleLink.length && title) {
      titleLink.text(title);
      card.find(".more-link-wrap .screen-reader-text").first().text(` ${title}`);
      card.find(".post-thumbnail img").first().attr("alt", title);
    }

    const authorLink = card.find(".posted-by .author a, .posted-by a, .author.vcard a").first();
    if (authorLink.length) {
      authorLink.attr("href", "/about/").text(EDITORIAL_TEAM_NAME);
    } else {
      card.find(".posted-by .author, .author.vcard").first().text(EDITORIAL_TEAM_NAME);
    }
  });
}

function refreshNormalizedImageContext($body: CheerioAPI, route: string, context: PageContext): void {
  if (context.kind !== "blog") {
    return;
  }

  const primaryImage = resolveImageSelection(null, $body, context.kind, context.contentTitle, route);
  context.imageUrl = primaryImage.url;
  context.imageAlt = primaryImage.alt;
  context.imageGallery = resolveImageGallery($body, context.kind, context.contentTitle, route, primaryImage);
}

function buildArchiveCardTitle(href: string, fallbackTitle: string): string {
  const route = normalizeRoute(href);

  if (!route) {
    return cleanText(fallbackTitle);
  }

  if (/^\/(solutions|compare|guides|compatibility)\//.test(route)) {
    const slug = route.split("/").filter(Boolean).slice(1).join("-");
    return formatArchiveTitle(slug);
  }

  return cleanText(fallbackTitle);
}

function formatArchiveTitle(slug: string): string {
  let title = slugToTitle(slug).replace(/\bVs\b/g, "vs").replace(/\bAnd\b/g, "and");
  const replacements: Array<[RegExp, string]> = [
    [/\bRfid\b/g, "RFID"],
    [/\bNfc\b/g, "NFC"],
    [/\bHf\b/g, "HF"],
    [/\bUhf\b/g, "UHF"],
    [/\bMifare\b/g, "MIFARE"],
    [/\bDesfire\b/g, "DESFire"],
    [/\bNtag213\b/g, "NTAG213"],
    [/\bNtag215\b/g, "NTAG215"],
    [/\bNtag216\b/g, "NTAG216"],
    [/\bEv1\b/g, "EV1"],
    [/\bEv2\b/g, "EV2"],
    [/\bEv3\b/g, "EV3"],
    [/\bMiwa\b/g, "MIWA"],
    [/\bPvc\b/g, "PVC"],
    [/\bPla\b/g, "PLA"],
    [/\bQr\b/g, "QR"],
    [/\bGoogle Review\b/g, "Google Review"],
  ];

  replacements.forEach(([pattern, value]) => {
    title = title.replace(pattern, value);
  });

  return title;
}

function enhancePrimaryContactPage($body: CheerioAPI): void {
  const heroHeading = $body("h2").filter((_, element) => $body(element).text().trim() === "Contact Us").first();
  if (heroHeading.length) {
    heroHeading.replaceWith("<h1>Contact Proud Tek</h1>");
    const heroSubheading = $body("h1").filter((_, element) => cleanText($body(element).text()) === "Contact Proud Tek").first().nextAll("p").first();
    if (heroSubheading.length) {
      heroSubheading.text("Share your RFID project details for samples, pricing, compatibility checks, or custom production support.");
    }
  }

  const helperHeading = $body("h2").filter((_, element) => /Have a question\?/i.test($body(element).text())).first();
  if (helperHeading.length) {
    helperHeading.text("Choose the best contact path");
    const helperSubheading = helperHeading.nextAll("p").first();
    if (helperSubheading.length) {
      helperSubheading.text("Use a specialist path if the application is already clear. Otherwise, use the general form with product type, environment, quantity, and timing.");
    }
  }

  const formHeading = $body("h2").filter((_, element) => /Send a Message/i.test($body(element).text())).first();
  if (formHeading.length) {
    formHeading.text("Send your project details");
    const formSubheading = formHeading.nextAll("p").first();
    if (formSubheading.length) {
      formSubheading.text("Use the form for samples, pricing, customization, or compatibility checks. A short structured message usually gets the fastest reply.");
    }
  }

  $body("script").each((_, element) => {
    const content = $body(element).html() ?? "";

    if (content.includes("kb_google_map") && (content.includes("37.8201") || content.includes("-122.4781"))) {
      $body(element).remove();
    }
  });

  const form = $body(".wp-block-kadence-form .kb-form").first();
  if (!form.length) {
    return;
  }

  // Point the form to Formspree for submission
  form.attr("action", "https://formspree.io/f/xlgorlog");
  form.attr("method", "POST");

  const formWrap = form.closest(".wp-block-kadence-form");
  formWrap.attr("id", "contact-rfq-form");

  const nameInput = form.find('input[id*="_0"]').first();
  const emailInput = form.find('input[type="email"]').first();
  const phoneInput = form.find('input[id*="_2"]').first();
  const subjectInput = form.find('input[id*="_3"]').first();
  const messageInput = form.find("textarea").first();
  const submitButton = form.find("button").first();

  if (nameInput.length) {
    nameInput.attr("placeholder", "Your name / company");
    nameInput.attr("name", "name");
  }

  if (emailInput.length) {
    emailInput.attr("placeholder", "you@company.com");
    emailInput.attr("name", "email");
  }

  if (phoneInput.length) {
    phoneInput.attr("placeholder", "+1 555 123 4567");
    phoneInput.attr("name", "phone");
  }

  if (subjectInput.length) {
    subjectInput.attr("placeholder", "Example: Hotel RFID card sample request - Saflok - 5,000 pcs");
    subjectInput.attr("name", "_subject");
  }

  if (messageInput.length) {
    messageInput.attr(
      "placeholder",
      [
        "Application / use case:",
        "Product format:",
        "Chip / lock / reader / phone environment:",
        "Quantity / sample target:",
        "Artwork / encoding / numbering / redirect needs:",
        "Target date:",
        "Questions to confirm:",
      ].join("\n"),
    );
    messageInput.attr("name", "message");
  }

  if (submitButton.length) {
    submitButton.text("Send Inquiry");
  }
}

function rewriteLegacyInternalLinks($body: CheerioAPI): void {
  $body("a[href]").each((_, element) => {
    const href = $body(element).attr("href") ?? "";
    const rewrittenHref = rewriteLegacyInternalHref(href);

    if (rewrittenHref && rewrittenHref !== href) {
      $body(element).attr("href", rewrittenHref);
    }
  });
}

function rewriteLegacyInternalHref(href: string): string {
  const normalized = normalizeRoute(href);

  if (!normalized) {
    return href;
  }

  const canonicalOverride = ROUTE_CANONICAL_OVERRIDES[normalized];
  if (canonicalOverride) {
    return canonicalOverride;
  }

  const catalogPageMatch = normalized.match(/^\/product-category\/products\/page\/(\d+)\/$/);

  if (catalogPageMatch) {
    const pageNumber = Number(catalogPageMatch[1]);
    return pageNumber <= 1 ? "/products/all/" : `/products/all/page/${pageNumber}/`;
  }

  const categoryPageMatch = normalized.match(/^\/product-category\/products\/([^/]+)\/page\/(\d+)\/$/);

  if (categoryPageMatch) {
    const [, slug, pageNumber] = categoryPageMatch;
    return Number(pageNumber) <= 1 ? `/products/${slug}/` : `/products/${slug}/page/${pageNumber}/`;
  }

  const categoryMatch = normalized.match(/^\/product-category\/products\/([^/]+)\/$/);

  if (categoryMatch) {
    return `/products/${categoryMatch[1]}/`;
  }

  if (normalized === "/product-category/products/") {
    return "/products/all/";
  }

  return href;
}

function normalizeArticleBody($body: CheerioAPI, page: SnapshotPage, context: PageContext): void {
  const { articleMeta } = context;

  if (!articleMeta) {
    return;
  }

  $body('a[href^="/author/"]').each((_, element) => {
    $body(element).attr("href", articleMeta.authorUrl).text(articleMeta.authorName);
  });

  $body(".posted-by .author, .author.vcard").each((_, element) => {
    const link = $body(element).find("a").first();

    if (link.length) {
      link.attr("href", articleMeta.authorUrl).text(articleMeta.authorName);
      return;
    }

    $body(element).text(articleMeta.authorName);
  });

  $body(".article-meta p, .article-footer p").each((_, element) => {
    const text = cleanText($body(element).text());

    if (!text) {
      return;
    }

    if (/Last Updated:/i.test(text) || text.includes("[Current Date]")) {
      $body(element).text(`Last Updated: ${articleMeta.modifiedLabel}`);
      return;
    }

    if (/^Author:/i.test(text)) {
      $body(element).text(`Author: ${articleMeta.authorName}`);
    }
  });

  $body('.article-footer a.share-button[href="#"], .article-footer a.share-button[href=""]').remove();
  $body(".article-footer p").each((_, element) => {
    const text = cleanText($body(element).text());

    if (/^Share this article:/i.test(text) && $body(element).find("a").length === 0) {
      $body(element).remove();
    }
  });

  $body('img[src*="["], img[src*="%5B"]').remove();

  const bodyHtml = $body("body").html() ?? "";
  const cleanedHtml = bodyHtml.replace(
    /Would you like me to continue with the next sections\?\s*I.?ll maintain this level of detail and formatting throughout the article while incorporating all required elements and links\./gi,
    "",
  );

  if (cleanedHtml !== bodyHtml) {
    $body("body").html(cleanedHtml);
  }

  const imageOverride = PAGE_IMAGE_OVERRIDES[page.route];
  if (imageOverride) {
    $body(`img[src="${imageOverride.url}"], img[src="${absoluteUrl(imageOverride.url)}"]`).attr("alt", imageOverride.alt);
  }

  const articleInquiry = resolveArticleInquiryAction(page.route, context.contentTitle);
  const entryContent = $body("article .entry-content, .entry-content.single-content, .entry-content").first();
  entryContent
    .find('a[href="/contact/"], a[href="https://proudtek.com/contact/"]')
    .each((_, element) => {
      $body(element).attr("href", articleInquiry.href);
    });

  // Inject contextual internal links for unlinked keyword mentions (max 3 per article)
  injectContextualLinks($body, entryContent, page.route);

  $body(".codex-article-support").remove();
  const articleHtml = renderArticleSupportBlock(context);
  if (articleHtml) {
    if (entryContent.length) {
      entryContent.append(articleHtml);
    } else {
      const contentWrap = $body(".entry-content-wrap").first();
      if (contentWrap.length) {
        contentWrap.append(articleHtml);
      }
    }
  }

  injectConversionBlocks($body, page, "article", {
    canonicalUrl: context.canonicalUrl,
    contentTitle: context.contentTitle,
    description: context.description,
  });
}

function sanitizeHtmlAttrs(attrs: Record<string, string>): Record<string, string> {
  const nextAttrs = { ...attrs };
  delete nextAttrs.itemtype;
  delete nextAttrs.itemscope;
  delete nextAttrs.prefix;

  return {
    ...nextAttrs,
    lang: "en-US",
  };
}

function sanitizeBodyAttrs(attrs: Record<string, string>): Record<string, string> {
  const nextAttrs = { ...attrs };
  delete nextAttrs.itemtype;
  delete nextAttrs.itemscope;
  delete nextAttrs.prefix;

  return nextAttrs;
}

function inferPageKind(route: string): PageKind {
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
    return "product";
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

function resolveContentTitle(page: SnapshotPage, $body: CheerioAPI, kind: PageKind): string {
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

function resolveDescription(
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

function resolveImageSelection(
  $head: CheerioAPI | null,
  $body: CheerioAPI,
  kind: PageKind,
  contentTitle: string,
  route: string,
): ImageSelection {
  const imageOverride = resolveImageOverride(route);
  if (imageOverride) {
    return imageOverride;
  }

  const candidates = collectImageCandidates($head, $body, kind, contentTitle, route);

  const best = candidates.sort((left, right) => right.score - left.score)[0];

  if (best) {
    return {
      url: best.url,
      alt: best.alt,
    };
  }

  return {
    url: absoluteUrl(DEFAULT_IMAGE),
    alt: fallbackImageAlt(contentTitle, kind),
  };
}

function resolveImageGallery(
  $body: CheerioAPI,
  kind: PageKind,
  contentTitle: string,
  route: string,
  primaryImage: ImageSelection,
): ImageSelection[] {
  const gallery = [primaryImage];
  const seen = new Set([primaryImage.url]);
  const candidates = collectImageCandidates(null, $body, kind, contentTitle, route);
  const keywords = buildImageKeywordSet(contentTitle, route);
  const specificKeywords = buildSpecificImageKeywordSet(contentTitle, route);

  candidates
    .sort((left, right) => right.score - left.score)
    .forEach((candidate) => {
      if (seen.has(candidate.url)) {
        return;
      }

      const keywordHits = scoreKeywordMatches(`${candidate.alt} ${filenameToTitle(candidate.url)}`, keywords);
      const specificKeywordHits = scoreKeywordMatches(`${candidate.alt} ${filenameToTitle(candidate.url)}`, specificKeywords);
      const lowValueMarker = `${candidate.url} ${candidate.alt}`;

      if (kind === "article" && (keywordHits < 2 || specificKeywordHits < 1)) {
        return;
      }

      if ((kind === "home" || kind === "about" || kind === "contact") && /(badge|logo|legic|impinj|nxp|atmel|fm|issi|microelectronic|\bst\b|\bti\b)/i.test(lowValueMarker)) {
        return;
      }

      if (candidate.score < (kind === "product" ? 18 : 30)) {
        return;
      }

      seen.add(candidate.url);
      gallery.push({
        url: candidate.url,
        alt: candidate.alt,
      });
    });

  return gallery.slice(0, kind === "product" ? 6 : 2);
}

function resolveImageOverride(route: string): ImageSelection | null {
  const override = PAGE_IMAGE_OVERRIDES[route];
  if (!override) {
    return null;
  }

  return {
    url: absoluteUrl(override.url),
    alt: override.alt,
  };
}

function collectImageCandidates(
  $head: CheerioAPI | null,
  $body: CheerioAPI,
  kind: PageKind,
  contentTitle: string,
  route: string,
): ImageCandidate[] {
  const selectors =
    kind === "product"
      ? [".woocommerce-product-gallery__image img", ".wp-post-image", ".entry-content img", "main img"]
      : kind === "article"
        ? ["article .entry-content img", ".entry-content img", ".post-thumbnail img", "main img"]
        : ["main img", ".entry-content img", "img"];
  const keywords = buildImageKeywordSet(contentTitle, route);
  const candidates: ImageCandidate[] = [];

  selectors.forEach((selector, selectorIndex) => {
    $body(selector)
      .toArray()
      .forEach((element, elementIndex) => {
        const rawUrl = selectImageUrl($body, element);

        if (!rawUrl || isDecorativeImageUrl(rawUrl) || isPlaceholderImageUrl(rawUrl)) {
          return;
        }

        if (
          $body(element).closest("header, footer, nav, form, .site-header, .site-footer, .related, .products, .widget, .entry-author, .trp-language-switcher").length > 0
        ) {
          return;
        }

        const rawAlt = cleanText($body(element).attr("alt") ?? "");
        const alt = !isWeakImageAlt(rawAlt) ? rawAlt : guessImageAlt($body, element, contentTitle, kind);
        const filename = filenameToTitle(rawUrl);
        const width = parseDimension($body(element).attr("width"));
        const height = parseDimension($body(element).attr("height"));
        const matchScore = scoreKeywordMatches(`${alt} ${filename}`, keywords);
        const sizeScore = width >= 700 || height >= 450 ? 24 : width >= 450 || height >= 300 ? 14 : 4;
        const variantPenalty = isTinyImageVariant(rawUrl) ? 14 : 0;
        const lowValuePenalty = getLowValueImagePenalty(rawUrl, alt, kind, route);

        candidates.push({
          url: absoluteUrl(rawUrl),
          alt: alt || fallbackImageAlt(contentTitle, kind),
          score: 90 - selectorIndex * 10 - elementIndex + matchScore * 14 + sizeScore - variantPenalty - lowValuePenalty,
        });
      });
  });

  if ($head) {
    const headImage = cleanText($head('meta[property="og:image"]').attr("content") ?? "");
    if (headImage && !isDecorativeImageUrl(headImage) && !isPlaceholderImageUrl(headImage)) {
      const headAlt = cleanText($head('meta[property="og:image:alt"]').attr("content") ?? "") || fallbackImageAlt(contentTitle, kind);

      candidates.push({
        url: absoluteUrl(headImage),
        alt: headAlt,
        score: 32 + scoreKeywordMatches(`${headAlt} ${filenameToTitle(headImage)}`, keywords) * 10,
      });
    }
  }

  return candidates;
}

function resolveArticleMeta($body: CheerioAPI, route: string): ArticleMeta {
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

function resolveItemList($body: CheerioAPI, route: string): BreadcrumbItem[] {
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

function resolveFaqEntries($body: CheerioAPI): FaqEntry[] {
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

  const headers = $body(".kt-blocks-accordion-header").toArray();
  const panels = $body(".kt-accordion-panel").toArray();

  headers.forEach((header, index) => {
    pushEntry($body(header).text(), $body(panels[index] ?? "").text());
  });

  $body(".codex-editorial-faq details, .codex-article-faq details").each((_, element) => {
    const question = $body(element).find("summary").first().text();
    const answer = $body(element).find("p").toArray().map((paragraph) => $body(paragraph).text()).join(" ");
    pushEntry(question, answer);
  });

  return entries;
}

function buildDocumentTitle(route: string, contentTitle: string, kind: PageKind): string {
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

function buildProductTitleQualifier(route: string, contentTitle: string): string {
  const haystack = `${route} ${contentTitle}`.toLowerCase();

  if (/reader|scanner|acr122u/.test(haystack)) {
    return "RFID Reader Supplier";
  }

  if (/sticker|label/.test(haystack)) {
    return "RFID Label Manufacturer";
  }

  if (/wristband/.test(haystack)) {
    return "RFID Wristband Manufacturer";
  }

  if (/key ?fob|keyfob|fobs/.test(haystack)) {
    return "RFID Keyfob Manufacturer";
  }

  if (/ring/.test(haystack)) {
    return "NFC Ring Supplier";
  }

  if (/(^|[^a-z])(tag|tags)([^a-z]|$)/.test(haystack) && !/hotel-key/.test(haystack)) {
    return "RFID Tag Manufacturer";
  }

  if (/chip/.test(haystack)) {
    return "RFID Chip Supplier";
  }

  return "RFID Card Manufacturer";
}

function optimizeProductHeading(value: string, route: string): string {
  const override = PRODUCT_HEADING_OVERRIDES[route];
  if (override) {
    return override;
  }

  const normalized = cleanText(value)
    .replace(/\b125\s*khz\b/gi, "125 kHz")
    .replace(/\b13\.?56\s*mhz\b/gi, "13.56 MHz")
    .replace(/\b915\s*mhz\b/gi, "915 MHz")
    .replace(/\s+/g, " ");

  const tokenMap: Record<string, string> = {
    rfid: "RFID",
    nfc: "NFC",
    uhf: "UHF",
    hf: "HF",
    lf: "LF",
    pvc: "PVC",
    pet: "PET",
    abs: "ABS",
    pps: "PPS",
    id: "ID",
    sdks: "SDKs",
    sdk: "SDK",
    acr122u: "ACR122U",
    mifare: "MIFARE",
    desfire: "DESFire",
    ev2: "EV2",
    felica: "FeliCa",
    legic: "LEGIC",
    hitag: "Hitag",
    em4200: "EM4200",
    em4305: "EM4305",
    t5577: "T5577",
    google: "Google",
  };

  return normalized
    .split(/\s+/)
    .map((token) => {
      const mapped = tokenMap[token.toLowerCase()];
      if (mapped) {
        return mapped;
      }

      if (/^\d+(?:\.\d+)?$/.test(token) || /kHz|MHz/.test(token)) {
        return token;
      }

      return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
    })
    .join(" ");
}

function buildProductMetaDescription(contentTitle: string, extracted: string, route: string, $body: CheerioAPI): string {
  const specs = extractProductSpecs($body, contentTitle, route);
  const intro = firstSentence(extracted) || extracted;
  const optionSummary = summarizeSpecLine(specs, [
    "Chip",
    "Protocol",
    "Frequency",
    "125 kHz Chip Options",
    "13.56 MHz Chip Options",
    "915 MHz Chip Options",
    "Material",
    "Form Factor",
  ]);
  const applicationSummary =
    summarizeSpecLine(specs, ["Applications", "Read Range", "Customization", "Personalization", "Printing"]) ||
    deriveProductBestFit(contentTitle, specs, route);

  return truncateText([intro, optionSummary, applicationSummary].filter(Boolean).join(" "), 155);
}

function buildProductProcurementFields(
  contentTitle: string,
  description: string,
  specs: ProductSpec[],
  route: string,
): ProcurementField[] {
  const fields: ProcurementField[] = [];
  const pushField = (label: string, value: string): void => {
    const normalized = truncateText(cleanText(value), 240);

    if (!normalized || fields.some((entry) => entry.label === label)) {
      return;
    }

    fields.push({ label, value: normalized });
  };

  pushField("Best fit", deriveProductBestFit(contentTitle, specs, route));
  pushField(
    "Key options",
    summarizeSpecLine(specs, [
      "Chip",
      "Protocol",
      "Frequency",
      "125 kHz Chip Options",
      "13.56 MHz Chip Options",
      "915 MHz Chip Options",
      "Material",
      "Form Factor",
      "Size",
      "Dimensions",
    ]),
  );
  pushField(
    "Customization",
    summarizeSpecLine(specs, ["Customization", "Personalization", "Printing", "Printing Options", "Encoding", "Finishing Options"]) ||
      "Confirm artwork, encoding, material, chip, and finish requirements before quoting.",
  );
  pushField("Quote checklist", buildProductQuoteChecklist(contentTitle, specs, description, route));

  return fields.slice(0, 4);
}

function buildProductFaqEntries(
  contentTitle: string,
  description: string,
  specs: ProductSpec[],
  route: string,
): FaqEntry[] {
  const entries: FaqEntry[] = [];
  const pushEntry = (question: string, answer: string): void => {
    const normalizedAnswer = truncateText(cleanText(answer), 360);

    if (!normalizedAnswer || entries.some((entry) => entry.question === question)) {
      return;
    }

    entries.push({ question, answer: normalizedAnswer });
  };

  pushEntry(buildProductUsageQuestion(contentTitle), deriveProductBestFit(contentTitle, specs, route));

  const options = summarizeSpecLine(specs, [
    "Chip",
    "Protocol",
    "Frequency",
    "125 kHz Chip Options",
    "13.56 MHz Chip Options",
    "915 MHz Chip Options",
    "Read Range",
  ]);
  if (options) {
    pushEntry(`Which chip, protocol, or frequency options are available for ${contentTitle}?`, options);
  }

  const materials = summarizeSpecLine(specs, ["Material", "Form Factor", "Size", "Dimensions", "Color", "Finish"]);
  if (materials) {
    pushEntry(`What material or form-factor options are available for ${contentTitle}?`, materials);
  }

  const customization = summarizeSpecLine(specs, ["Customization", "Personalization", "Printing", "Printing Options", "Encoding", "Finishing Options"]);
  if (customization) {
    pushEntry(`How can ${contentTitle} be customized?`, customization);
  }

  pushEntry(`What details should I send to quote ${contentTitle}?`, buildProductQuoteChecklist(contentTitle, specs, description, route));
  return entries.slice(0, 4);
}

function buildProductUsageQuestion(contentTitle: string): string {
  return /s$/i.test(contentTitle) ? `What are ${contentTitle} commonly used for?` : `What is ${contentTitle} commonly used for?`;
}

function deriveProductBestFit(contentTitle: string, specs: ProductSpec[], route: string): string {
  const override = PRODUCT_BEST_FIT_OVERRIDES[route];
  if (override) {
    return override;
  }

  const applications = findProductSpecValue(specs, ["Applications"]);
  if (applications) {
    return applications;
  }

  const haystack = `${route} ${contentTitle}`.toLowerCase();

  if (/hotel|key card/.test(haystack)) {
    return "Best for hotel room access, guest credential programs, and hospitality check-in workflows.";
  }

  if (/laundry/.test(haystack)) {
    return "Best for linen, garment, and uniform identification in commercial laundry and textile tracking workflows.";
  }

  if (/event|wristband/.test(haystack)) {
    return "Best for event access control, resort cashless programs, membership, and wearable identification workflows.";
  }

  if (/reader|scanner|acr122u/.test(haystack)) {
    return "Best for desktop or embedded RFID and NFC reading, testing, and software-integration workflows.";
  }

  if (/sticker|label/.test(haystack)) {
    return "Best for asset tagging, packaging, authentication, access control, and smart-label projects.";
  }

  if (/key ?fob|keyfob|fobs/.test(haystack)) {
    return "Best for access control, parking, elevator, and membership credential projects.";
  }

  if (/ring/.test(haystack)) {
    return "Best for NFC tap interactions, wearable access, and smart identity applications.";
  }

  if (/chip/.test(haystack)) {
    return "Best for automotive, credential, or embedded-transponder integration workflows.";
  }

  return `${contentTitle} is suitable for RFID or NFC identification, access, and OEM customization projects.`;
}

function buildProductQuoteChecklist(contentTitle: string, specs: ProductSpec[], description: string, route: string): string {
  const checklist = [
    summarizeQuoteNeed(contentTitle, route),
    findProductSpecValue(specs, ["Chip", "Protocol", "Frequency", "125 kHz Chip Options", "13.56 MHz Chip Options", "915 MHz Chip Options"]),
    findProductSpecValue(specs, ["Material", "Form Factor", "Size", "Dimensions"]),
    findProductSpecValue(specs, ["Customization", "Personalization", "Printing", "Printing Options", "Encoding"]),
  ]
    .filter(Boolean)
    .slice(0, 4);

  const generic = "Share target chip or protocol, quantity, format or size, print or encoding requirements, and the intended application.";
  return truncateText([...checklist, generic].join(" "), 260);
}

function summarizeQuoteNeed(contentTitle: string, route: string): string {
  const haystack = `${route} ${contentTitle}`.toLowerCase();

  if (/reader|scanner|acr122u/.test(haystack)) {
    return "Confirm interface, software environment, and reader integration needs.";
  }

  if (/wristband/.test(haystack)) {
    return "Confirm wristband material, wearing environment, and access or event workflow.";
  }

  if (/sticker|label|tag/.test(haystack)) {
    return "Confirm mounting surface, adhesive or on-metal requirements, and expected reading distance.";
  }

  return `Reference ${contentTitle} in your inquiry so the matching product page stays attached to the quote.`;
}

function summarizeSpecLine(specs: ProductSpec[], names: string[]): string {
  const lines = names
    .map((name) => specs.find((entry) => entry.name.toLowerCase() === name.toLowerCase()))
    .filter((entry): entry is ProductSpec => Boolean(entry))
    .map((entry) => `${entry.name}: ${entry.value}`);

  return truncateText(lines.join(" "), 220);
}

function renderProductSpecSheet(route: string): string {
  const sheet = PRODUCT_SPEC_SHEETS[route];
  if (!sheet) {
    return "";
  }

  const specsRows = sheet.specs
    .map(
      (spec) =>
        `<tr><th scope="row">${escapeXml(spec.label)}</th><td>${escapeXml(spec.value)}</td></tr>`,
    )
    .join("");

  const applicationsHtml = sheet.applications
    .map((app) => `<li>${escapeXml(app)}</li>`)
    .join("");

  const buyerNotesHtml = sheet.buyerNotes
    .map(
      (note, i) =>
        `<li class="codex-spec-note"><span class="codex-spec-note__num">${i + 1}</span><span>${escapeXml(note)}</span></li>`,
    )
    .join("");

  const compatHtml = sheet.compatibility
    ? `<div class="codex-spec-compat"><strong>Compatibility:</strong> ${escapeXml(sheet.compatibility)}</div>`
    : "";

  return `<section class="codex-product-spec-sheet" aria-label="Technical specifications">
    <div class="codex-spec-table-wrap">
      <h2>Technical Specifications</h2>
      <table class="codex-spec-table">
        <tbody>${specsRows}</tbody>
      </table>
      ${compatHtml}
    </div>
    <div class="codex-spec-sidebar">
      <div class="codex-spec-applications">
        <h3>Applications</h3>
        <ul>${applicationsHtml}</ul>
      </div>
      <div class="codex-spec-buyer-notes">
        <h3>Buyer Notes</h3>
        <ol>${buyerNotesHtml}</ol>
      </div>
    </div>
  </section>`;
}

function renderProductSupportBlock(context: PageContext): string {
  if (context.procurementFields.length === 0) {
    return "";
  }

  return `<section class="codex-product-support" aria-label="Product inquiry support"><div class="codex-product-support__grid"><section class="codex-product-support__panel codex-product-procurement"><h2>Before you request a quote</h2><dl>${context.procurementFields
    .map(
      (entry) =>
        `<div class="codex-product-support__row"><dt>${escapeXml(entry.label)}</dt><dd>${escapeXml(entry.value)}</dd></div>`,
    )
    .join("")}</dl></section></div></section>`;
}

function buildCollectionSummary(route: string, description: string, $body: CheerioAPI): string[] {
  const profile = COLLECTION_SUPPORT_PROFILES[route];
  if (profile?.takeaways.length) {
    return profile.takeaways.slice(0, 4);
  }

  const paragraphs = extractMeaningfulParagraphs($body, [".woocommerce-products-header p", ".entry-content p", "main p"], 5);
  return uniqueTextEntries([firstSentence(description), ...paragraphs].filter(Boolean)).slice(0, 4);
}

function buildCollectionGuidanceFields(route: string, contentTitle: string, $body: CheerioAPI): ProcurementField[] {
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

function buildCollectionRelatedPages(route: string, itemList: BreadcrumbItem[]): BreadcrumbItem[] {
  const profile = COLLECTION_SUPPORT_PROFILES[route];
  if (profile?.relatedPages.length) {
    return profile.relatedPages.slice(0, 8);
  }

  return itemList.slice(0, 8);
}

function buildCollectionSourceLinks(route: string): BreadcrumbItem[] {
  return COLLECTION_SUPPORT_PROFILES[route]?.sourceLinks.slice(0, 6) ?? [];
}

function buildCollectionFaqEntries(route: string, contentTitle: string, description: string, $body: CheerioAPI): FaqEntry[] {
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

function renderCollectionSupportBlock(context: PageContext): string {
  const canonicalPath = normalizeRoute(new URL(context.canonicalUrl).pathname);
  const profile = resolveCollectionCtaProfile(canonicalPath);
  const briefHtml = profile.briefItems
    .map((item) => `<li><span class="codex-collection-cta__check">✓</span> ${escapeXml(item)}</li>`)
    .join("");

  const ctaHtml = `<div class="codex-collection-cta">
      <div class="codex-collection-cta__copy">
        <p class="codex-collection-cta__eyebrow">Need help choosing?</p>
        <h2>${escapeXml(profile.label)}</h2>
        <p>${escapeXml(profile.description)}</p>
      </div>
      <ul class="codex-collection-cta__brief">${briefHtml}</ul>
      <div class="codex-collection-cta__actions">
        <a class="codex-collection-cta__primary" href="${escapeXml(profile.href)}">Start a conversation →</a>
      </div>
    </div>`;

  const guidanceTitle = resolveGuidanceTitle(canonicalPath);
  const guidanceHtml =
    context.collectionGuidanceFields.length > 0
      ? `<section class="codex-collection-guidance" aria-label="${escapeXml(guidanceTitle)}">
          <h2 class="codex-collection-guidance__title">${escapeXml(guidanceTitle)}</h2>
          <ol class="codex-collection-guidance__steps">${context.collectionGuidanceFields
            .map(
              (entry, index) =>
                `<li class="codex-collection-guidance__step">
                  <span class="codex-collection-guidance__num">${index + 1}</span>
                  <div class="codex-collection-guidance__body">
                    <strong>${escapeXml(entry.label)}</strong>
                    <p>${escapeXml(entry.value)}</p>
                  </div>
                </li>`,
            )
            .join("")}</ol></section>`
      : "";

  if (!guidanceHtml) {
    return "";
  }

  return `<div class="codex-collection-buying-support">${ctaHtml}${guidanceHtml}</div>`;
}

function resolveGuidanceTitle(route: string): string {
  const normalized = normalizeRoute(route);
  const titles: Record<string, string> = {
    "/products/all/": "How to navigate this catalog",
    "/products/rfid-cards/": "How to choose the right RFID card",
    "/products/rfid-tags/": "How to choose the right RFID tag",
    "/products/rfid-readers/": "How to choose the right RFID reader",
    "/products/rfid-labels/": "How to choose the right RFID label",
    "/products/rfid-keyfobs/": "How to choose the right RFID keyfob",
    "/products/rfid-wristbands/": "How to choose the right RFID wristband",
  };

  if (titles[normalized]) {
    return titles[normalized];
  }

  // Sub-collection pages use their parent collection title
  for (const [prefix, title] of Object.entries(titles)) {
    if (normalized.startsWith(prefix) && normalized !== prefix) {
      return title;
    }
  }

  return "How to compare options";
}

function buildCoreSummary(route: string, description: string, $body: CheerioAPI): string[] {
  const profile = CORE_SUPPORT_PROFILES[route];
  if (profile?.takeaways.length) {
    return profile.takeaways.slice(0, 4);
  }

  const paragraphs = extractMeaningfulParagraphs($body, [".entry-content p", ".content-area p", "main p"], 5);
  return uniqueTextEntries([firstSentence(description), ...paragraphs].filter(Boolean)).slice(0, 4);
}

function buildCoreGuidanceFields(route: string, contentTitle: string, $body: CheerioAPI): ProcurementField[] {
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

function buildCoreRelatedPages(route: string, itemList: BreadcrumbItem[]): BreadcrumbItem[] {
  const profile = CORE_SUPPORT_PROFILES[route];
  if (profile?.relatedPages.length) {
    return profile.relatedPages.slice(0, 8);
  }

  return itemList.slice(0, 8);
}

function buildCoreSourceLinks(route: string): BreadcrumbItem[] {
  return CORE_SUPPORT_PROFILES[route]?.sourceLinks.slice(0, 6) ?? [];
}

function buildCoreFaqEntries(route: string, contentTitle: string, description: string, $body: CheerioAPI): FaqEntry[] {
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

function renderGrowthHub(group: GrowthGroup): string {
  return `<section class="codex-growth-hub__group">
    <div class="codex-growth-hub__intro">
      <p class="codex-growth-hub__eyebrow">Priority path</p>
      <h2>${escapeXml(group.title)}</h2>
      <p>${escapeXml(group.description)}</p>
    </div>
    <div class="codex-growth-hub__grid">
      ${group.cards
        .map(
          (card) => `<a class="codex-growth-hub__card" href="${escapeXml(card.href)}">
            <span class="codex-growth-hub__card-eyebrow">${escapeXml(card.eyebrow)}</span>
            <strong>${escapeXml(card.title)}</strong>
            <span>${escapeXml(card.description)}</span>
          </a>`,
        )
        .join("")}
    </div>
  </section>`;
}

function renderGrowthBrief(
  heading: string,
  description: string,
  briefEntries: string[] = HOME_GROWTH_BRIEF,
  actions: Array<{ label: string; href: string }> = GROWTH_ACTIONS,
): string {
  const checkSvgs = [
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a4 4 0 0 0-8 0v2"/><circle cx="12" cy="15" r="1"/></svg>`,
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
  ];
  return `<section class="codex-quote-brief" aria-label="Quote checklist">
    <div class="codex-quote-brief__inner">
      <div class="codex-quote-brief__copy">
        <p class="codex-quote-brief__eyebrow">Ready to start?</p>
        <h2>${escapeXml(heading)}</h2>
        <p>${escapeXml(description)}</p>
        <div class="codex-quote-brief__cta">
          ${actions.map((entry, i) =>
            `<a class="codex-quote-brief__btn${i === 0 ? " codex-quote-brief__btn--primary" : ""}" href="${escapeXml(entry.href)}">${escapeXml(entry.label)}</a>`
          ).join("")}
        </div>
      </div>
      <div class="codex-quote-brief__checklist">
        <div class="codex-quote-brief__step-label">Include in your message</div>
        ${briefEntries.map((entry, i) =>
          `<div class="codex-quote-brief__item">
            <span class="codex-quote-brief__icon">${checkSvgs[i % checkSvgs.length]}</span>
            <span>${escapeXml(entry)}</span>
          </div>`
        ).join("")}
      </div>
    </div>
  </section>`;
}

function renderTrustBar(): string {
  return `<section class="codex-trust-bar" aria-label="Manufacturing credentials">
    <div class="codex-trust-bar__item">
      <strong>10+</strong><span>Years RFID Manufacturing</span>
    </div>
    <div class="codex-trust-bar__item">
      <strong>ISO 9001</strong><span>Certified Factory</span>
    </div>
    <div class="codex-trust-bar__item">
      <strong>500+</strong><span>Enterprise Clients</span>
    </div>
    <div class="codex-trust-bar__item">
      <strong>Shenzhen</strong><span>Factory Direct</span>
    </div>
  </section>`;
}

function renderHomeIndustrySelector(): string {
  const group = HOME_GROWTH_GROUPS[0];
  if (!group) return "";

  const colors = ["#3d6b6b", "#2d6a4f", "#c39a5f", "#4a5568"];

  return `<section class="codex-industry-selector" aria-label="Choose your industry">
    <div class="codex-industry-selector__header">
      <h2>Find the right product path</h2>
      <p>Select your industry to get matched guides, samples and pricing.</p>
    </div>
    <div class="codex-industry-selector__grid">
      ${group.cards
        .map(
          (card, i) => `<a class="codex-industry-selector__card" href="${escapeXml(card.href)}" style="--accent: ${colors[i % colors.length]}">
            <span class="codex-industry-selector__eyebrow">${escapeXml(card.eyebrow)}</span>
            <strong>${escapeXml(card.title)}</strong>
            <span>${escapeXml(card.description)}</span>
            <span class="codex-industry-selector__arrow">&rarr;</span>
          </a>`,
        )
        .join("")}
    </div>
    <div class="codex-industry-selector__compare">
      <span>Need to compare options?</span>
      ${HOME_COMPARE_LINKS.map(
        (link) => `<a href="${escapeXml(link.href)}">${escapeXml(link.label)}</a>`,
      ).join(" · ")}
    </div>
  </section>`;
}

function renderHomeQuoteBrief(): string {
  return renderGrowthBrief(
    "What to send for a quote",
    "A short, specific message gets you to the right sample plan or quote faster than another round of browsing.",
  );
}

function renderHomeGrowthHub(): string {
  return renderHomeIndustrySelector();
}

function renderBlogGrowthHub(): string {
  return `<section class="codex-growth-hub codex-growth-hub--blog" aria-label="Research to inquiry paths">
    <div class="codex-growth-hub__hero">
      <p class="codex-growth-hub__eyebrow">From article to action</p>
      <h2>Use the blog to move into real buying decisions</h2>
      <p>The best article journeys lead into solution, comparison, compatibility, or contact pages that help buyers make a real decision.</p>
    </div>
    ${BLOG_GROWTH_GROUPS.map((group) => renderGrowthHub(group)).join("")}
    ${renderGrowthBrief(
      "What to send when you are ready to inquire",
      "Once the application is clear, a short project summary is enough to move from research into a real first conversation.",
    )}
  </section>`;
}

function buildArticleSummary(contentTitle: string, description: string, $body: CheerioAPI, route: string): string[] {
  const profile = ARTICLE_SUPPORT_PROFILES[route];
  if (profile?.takeaways.length) {
    return profile.takeaways.slice(0, 4);
  }

  const paragraphs = extractMeaningfulParagraphs($body, ["article .entry-content p", ".entry-content p", "main p"], 6);
  return uniqueTextEntries([firstSentence(description), ...paragraphs].filter(Boolean)).slice(0, 4);
}

function buildArticleGuidanceFields(contentTitle: string, route: string, $body: CheerioAPI): ProcurementField[] {
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

function buildArticleRelatedPages(route: string, contentTitle: string, $body: CheerioAPI): BreadcrumbItem[] {
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

function resolveArticleInquiryAction(route: string, contentTitle: string): { href: string; label: string } {
  const normalized = `${route} ${contentTitle}`.toLowerCase();

  if (/(hotel|room-key|saflok|onity|salto|vingcard)/.test(normalized)) {
    return { href: "/contact/hotel-rfid/", label: "Hotel RFID inquiry page" };
  }

  if (/(laundry|linen)/.test(normalized)) {
    return { href: "/contact/laundry-rfid/", label: "Laundry RFID inquiry page" };
  }

  if (/(wristband|event|festival)/.test(normalized)) {
    return { href: "/contact/event-rfid/", label: "Event RFID inquiry page" };
  }

  if (/(reader|acr122u|scanner|writer)/.test(normalized)) {
    return { href: "/contact/rfid-readers/", label: "RFID reader inquiry page" };
  }

  if (/(vehicle|windshield|headlight|transponder|\bcar\b)/.test(normalized)) {
    return { href: "/contact/vehicle-rfid/", label: "Vehicle RFID inquiry page" };
  }

  if (/(keyfob|key-fob|fob)/.test(normalized)) {
    return { href: "/contact/access-control-keyfobs/", label: "Keyfob inquiry page" };
  }

  if (/(review|google review|business card|wooden card|metal nfc|ntag|nfc)/.test(normalized)) {
    return { href: "/contact/nfc-branding-cards/", label: "NFC branding cards inquiry page" };
  }

  if (/(label|sticker|tag|asset tracking)/.test(normalized)) {
    return { href: "/contact/rfid-labels-tags/", label: "RFID labels inquiry page" };
  }

  return { href: "/contact/custom-rfid-cards/", label: "Custom RFID cards inquiry page" };
}

function rewriteArticleRelatedPages(route: string, contentTitle: string, entries: BreadcrumbItem[]): BreadcrumbItem[] {
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

function buildArticleSourceLinks(route: string, $body: CheerioAPI): BreadcrumbItem[] {
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

function buildProductSourceLinks(route: string): BreadcrumbItem[] {
  return PRODUCT_SOURCE_LINKS[route]?.slice(0, 6) ?? [];
}

function buildProductRelatedPages(route: string): BreadcrumbItem[] {
  const entries: BreadcrumbItem[] = [];
  const seen = new Set<string>();

  const pushRoute = (name: string, internalRoute: string): void => {
    const url = absoluteUrl(ROUTE_CANONICAL_OVERRIDES[internalRoute] ?? internalRoute);

    if (seen.has(url)) {
      return;
    }

    seen.add(url);
    entries.push({ name, url });
  };

  if (/\/product\/hotel-key-cards\//.test(route)) {
    pushRoute("Hotel key card solution guide", "/solutions/hotel-key-cards/");
    pushRoute("RFID vs magnetic hotel key cards", "/compare/rfid-vs-magnetic-hotel-key-cards/");
    pushRoute("Hotel key card material selection", "/guides/hotel-key-card-material-selection/");
    pushRoute("Hotel key card encoding guide", "/guides/hotel-key-card-encoding/");
    pushRoute("Hotel key card sample planning", "/guides/hotel-key-card-sample-planning/");
    pushRoute("Hotel key card artwork and printing", "/guides/hotel-key-card-artwork-and-printing-checklist/");
    pushRoute("Saflok-compatible hotel key cards", "/compatibility/saflok-hotel-key-cards/");
    pushRoute("MIWA-compatible hotel key cards", "/compatibility/miwa-hotel-key-cards/");
  }

  if (/\/product\/(mifare-4k-card|mifare-classic-card|mifare-plus-card|mifare-desfire-cards|mifare-desfire-ev2-cards|desfire-tag)\//.test(route)) {
    pushRoute("MIFARE Classic vs Plus vs DESFire", "/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/");
    pushRoute("MIFARE Plus EV2 vs DESFire EV3", "/compare/mifare-plus-ev2-vs-desfire-ev3/");
    pushRoute("Hotel key card solution guide", "/solutions/hotel-key-cards/");
    pushRoute("SALTO-compatible hotel key cards", "/compatibility/salto-hotel-key-cards/");
    pushRoute("VingCard-compatible hotel key cards", "/compatibility/vingcard-hotel-key-cards/");
  }

  if (/\/product\/(rfid-laundry-tags|pps-rfid-laundry-tag|rfid-silicone-laundry-tag)\//.test(route)) {
    pushRoute("RFID laundry tag buying guide", "/solutions/rfid-laundry-tags/");
    pushRoute("PPS vs silicone vs textile laundry tags", "/compare/pps-vs-silicone-vs-textile-rfid-laundry-tags/");
    pushRoute("UHF vs HF laundry tags", "/compare/uhf-vs-hf-rfid-laundry-tags/");
    pushRoute("RFID tag lifespan guide", "/guides/rfid-tag-card-wristband-lifespan/");
  }

  if (/\/product\/google-review-nfc-card\//.test(route)) {
    pushRoute("Google review NFC card guide", "/solutions/google-review-nfc-card/");
    pushRoute("Google review card placement guide", "/guides/google-review-card-placement-guide/");
    pushRoute("Google review cards for multi-location brands", "/guides/google-review-cards-for-multi-location-brands/");
    pushRoute("Google review cards for restaurant franchises", "/guides/google-review-cards-for-restaurant-franchises/");
    pushRoute("Google review cards for dental groups", "/guides/google-review-cards-for-dental-groups/");
    pushRoute("Google review cards for hotel groups", "/guides/google-review-cards-for-hotel-groups/");
    pushRoute("Google review card design and copy", "/guides/google-review-card-design-and-copy/");
    pushRoute("Google review cards for restaurants", "/solutions/google-review-cards-for-restaurants/");
    pushRoute("Google review cards for hotels", "/solutions/google-review-cards-for-hotels/");
    pushRoute("NFC review card vs QR review stand", "/compare/nfc-review-card-vs-qr-review-stand/");
    pushRoute("Google review NFC card vs NFC sticker", "/compare/google-review-nfc-card-vs-nfc-sticker/");
    pushRoute("Google review NFC card setup guide", "/guides/google-review-nfc-card-setup/");
  }

  if (/\/product\/(nfc-business-card|metal-nfc-card|nfc-cards)\//.test(route)) {
    pushRoute("NFC business card buying guide", "/solutions/nfc-business-card/");
    pushRoute("Google review NFC card guide", "/solutions/google-review-nfc-card/");
    pushRoute("Google review card design and copy", "/guides/google-review-card-design-and-copy/");
    pushRoute("NTAG213 vs NTAG215 vs NTAG216", "/compare/ntag213-vs-ntag215-vs-ntag216/");
    pushRoute("NFC review card vs QR review stand", "/compare/nfc-review-card-vs-qr-review-stand/");
    pushRoute("NFC business card iPhone and Android compatibility", "/guides/nfc-business-card-iphone-android-compatibility/");
  }

  if (/\/product\/(wooden-rfid-card|eco_rfid_card)\//.test(route)) {
    pushRoute("Hotel key card solution guide", "/solutions/hotel-key-cards/");
    pushRoute("PVC vs wood vs PLA hotel key cards", "/compare/pvc-vs-wood-vs-pla-hotel-key-cards/");
    pushRoute("Hotel key card material selection", "/guides/hotel-key-card-material-selection/");
    pushRoute("Hotel key card sample planning", "/guides/hotel-key-card-sample-planning/");
    pushRoute("Hotel key card artwork and printing", "/guides/hotel-key-card-artwork-and-printing-checklist/");
    pushRoute("NFC business card buying guide", "/solutions/nfc-business-card/");
    pushRoute("Custom RFID cards inquiry page", "/contact/custom-rfid-cards/");
  }

  if (/\/product\/(nfc-sticker|nfc-stickers)\//.test(route)) {
    pushRoute("Google review cards for restaurants", "/solutions/google-review-cards-for-restaurants/");
    pushRoute("Google review card placement guide", "/guides/google-review-card-placement-guide/");
    pushRoute("Google review cards for restaurant franchises", "/guides/google-review-cards-for-restaurant-franchises/");
    pushRoute("Google review cards for auto dealerships", "/guides/google-review-cards-for-auto-dealerships/");
    pushRoute("Google review card design and copy", "/guides/google-review-card-design-and-copy/");
    pushRoute("Google review NFC card vs NFC sticker", "/compare/google-review-nfc-card-vs-nfc-sticker/");
    pushRoute("Google review NFC card setup guide", "/guides/google-review-nfc-card-setup/");
    pushRoute("NTAG213 vs NTAG215 vs NTAG216", "/compare/ntag213-vs-ntag215-vs-ntag216/");
    pushRoute("On-metal NFC labels vs standard NFC stickers", "/compare/on-metal-nfc-labels-vs-standard-nfc-stickers/");
    pushRoute("Google review NFC card guide", "/solutions/google-review-nfc-card/");
  }

  if (/\/product\/mifare-stickers\//.test(route)) {
    pushRoute("MIFARE Classic vs Plus vs DESFire", "/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/");
    pushRoute("MIFARE Plus EV2 vs DESFire EV3", "/compare/mifare-plus-ev2-vs-desfire-ev3/");
    pushRoute("RFID labels collection", "/products/rfid-labels/");
    pushRoute("RFID labels inquiry page", "/contact/rfid-labels-tags/");
  }

  if (/\/product\/rfid-wristbands-for-hotels\//.test(route)) {
    pushRoute("Hotel key card solution guide", "/solutions/hotel-key-cards/");
    pushRoute("Hotel key cards vs hotel wristbands", "/compare/hotel-key-cards-vs-hotel-wristbands/");
    pushRoute("RFID wristbands for hotels vs events vs resorts", "/compare/rfid-wristbands-hotels-vs-events-vs-resorts/");
  }

  if (/\/product\/(rfid-event-wristband|rfid-wristbands-for-events|rfid-silicone-wristbands|uhf-wristband|coconut-shell-rfid-wristband)\//.test(route)) {
    pushRoute("RFID event access control", "/solutions/rfid-event-access-control/");
    pushRoute("RFID wristbands for hotels vs events vs resorts", "/compare/rfid-wristbands-hotels-vs-events-vs-resorts/");
    pushRoute("Silicone vs fabric vs woven RFID wristbands", "/compare/silicone-vs-fabric-vs-woven-rfid-wristbands/");
    pushRoute("RFID tag lifespan guide", "/guides/rfid-tag-card-wristband-lifespan/");
  }

  if (/\/product\/(rfid-key-fob|proximity-fobs)\//.test(route)) {
    pushRoute("Keyfob vs card vs wristband for access control", "/compare/keyfob-vs-card-vs-wristband-access-control/");
    pushRoute("RFID access-control solutions", "/solutions/hotel-rfid-access-control/");
    pushRoute("RFID keyfob access-control guide", "/solutions/rfid-keyfobs-access-control/");
    pushRoute("Keyfob inquiry page", "/contact/access-control-keyfobs/");
  }

  if (/\/product\/(em4200-card|em4305-card|hitag-2-card)\//.test(route)) {
    pushRoute("Keyfob vs card vs wristband for access control", "/compare/keyfob-vs-card-vs-wristband-access-control/");
    pushRoute("RFID access-control solutions", "/solutions/hotel-rfid-access-control/");
    pushRoute("Custom RFID cards inquiry page", "/contact/custom-rfid-cards/");
  }

  if (/\/product\/(clamshell-card|125-khz-rfid-card|t5577-card|blank-rfid-card|combi-card)\//.test(route)) {
    pushRoute("Keyfob vs card vs wristband for access control", "/compare/keyfob-vs-card-vs-wristband-access-control/");
    pushRoute("RFID access-control solutions", "/solutions/hotel-rfid-access-control/");
    pushRoute("Custom RFID cards inquiry page", "/contact/custom-rfid-cards/");
  }

  if (/\/product\/printed-rfid-cards\//.test(route)) {
    pushRoute("RFID cards collection", "/products/rfid-cards/");
    pushRoute("Hotel key card solution guide", "/solutions/hotel-key-cards/");
    pushRoute("Hotel key card material selection", "/guides/hotel-key-card-material-selection/");
    pushRoute("Hotel key card sample planning", "/guides/hotel-key-card-sample-planning/");
    pushRoute("Hotel key card artwork and printing", "/guides/hotel-key-card-artwork-and-printing-checklist/");
    pushRoute("Custom RFID cards inquiry page", "/contact/custom-rfid-cards/");
  }

  if (/\/product\/(felica-card|legic-card|java-card|dual-interface-card)\//.test(route)) {
    pushRoute("RFID cards collection", "/products/rfid-cards/");
    pushRoute("RFID solutions by application", "/solutions/");
    pushRoute("Custom RFID cards inquiry page", "/contact/custom-rfid-cards/");
  }

  if (/\/product\/nfc-ring\//.test(route)) {
    pushRoute("RFID keyfobs collection", "/products/rfid-keyfobs/");
    pushRoute("RFID solutions by application", "/solutions/");
    pushRoute("NFC branding cards inquiry page", "/contact/nfc-branding-cards/");
  }

  if (/\/product\/(inkjet-pvc-id-card|rfid-paper-card)\//.test(route)) {
    pushRoute("RFID cards collection", "/products/rfid-cards/");
    pushRoute("RFID event access control", "/solutions/rfid-event-access-control/");
    pushRoute("Custom RFID cards inquiry page", "/contact/custom-rfid-cards/");
  }

  if (/\/product\/125khz-rfid-sticker\//.test(route)) {
    pushRoute("RFID labels collection", "/products/rfid-labels/");
    pushRoute("RFID access-control solutions", "/solutions/hotel-rfid-access-control/");
    pushRoute("RFID labels inquiry page", "/contact/rfid-labels-tags/");
  }

  if (/\/product\/(rfid-windshield-tag|rfid-sticker-on-headlight)\//.test(route)) {
    pushRoute("Vehicle RFID identification solution", "/solutions/vehicle-rfid-identification/");
    pushRoute("Vehicle RFID inquiry page", "/contact/vehicle-rfid/");
  }

  if (/\/product\/rfid-tag-with-led-light\//.test(route)) {
    pushRoute("RFID asset tracking labels", "/solutions/rfid-asset-tracking-labels/");
    pushRoute("HF vs UHF RFID for asset tracking", "/compare/hf-vs-uhf-rfid-for-asset-tracking/");
    pushRoute("RFID labels inquiry page", "/contact/rfid-labels-tags/");
  }

  if (/\/product\/car-transponder-chip\//.test(route)) {
    pushRoute("Vehicle RFID identification solution", "/solutions/vehicle-rfid-identification/");
    pushRoute("Vehicle RFID inquiry page", "/contact/vehicle-rfid/");
  }

  if (/\/product\/(acr122u|nfc-reader-writer-with-free-sdks)\//.test(route)) {
    pushRoute("RFID readers and encoding guide", "/solutions/rfid-readers-and-encoding/");
    pushRoute("RFID reader and writer selection", "/guides/rfid-reader-writer-selection/");
    pushRoute("Hotel key card encoding guide", "/guides/hotel-key-card-encoding/");
    pushRoute("NTAG213 vs NTAG215 vs NTAG216", "/compare/ntag213-vs-ntag215-vs-ntag216/");
    pushRoute("RFID reader inquiry page", "/contact/rfid-readers/");
  }

  if (/\/product\/bluetooth-rfid-scanner\//.test(route)) {
    pushRoute("RFID readers and encoding guide", "/solutions/rfid-readers-and-encoding/");
    pushRoute("RFID reader and writer selection", "/guides/rfid-reader-writer-selection/");
    pushRoute("RFID reader inquiry page", "/contact/rfid-readers/");
    pushRoute("RFID solutions by application", "/solutions/");
  }

  return entries.slice(0, 6);
}

function buildArticleFaqEntries(contentTitle: string, description: string, $body: CheerioAPI, route: string): FaqEntry[] {
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

function renderArticleSupportBlock(context: PageContext): string {
  const summaryHtml =
    context.articleSummary.length > 0
      ? `<section class="codex-article-support__panel codex-article-summary"><h2>Guide summary</h2><ul>${context.articleSummary
          .map((entry) => `<li>${escapeXml(entry)}</li>`)
          .join("")}</ul></section>`
      : "";

  const guidanceHtml =
    context.articleGuidanceFields.length > 0
      ? `<section class="codex-article-support__panel codex-article-guidance"><h2>Buyer checklist</h2><dl>${context.articleGuidanceFields
          .map(
            (entry) =>
              `<div class="codex-article-support__row"><dt>${escapeXml(entry.label)}</dt><dd>${escapeXml(entry.value)}</dd></div>`,
          )
          .join("")}</dl></section>`
      : "";

  const relatedHtml =
    context.articleRelatedPages.length > 0
      ? `<section class="codex-article-support__panel codex-article-related"><h2>Best next pages</h2><ul>${context.articleRelatedPages
          .map((entry) => `<li><a href="${escapeXml(entry.url)}">${escapeXml(entry.name)}</a></li>`)
          .join("")}</ul></section>`
      : "";

  const sourcesHtml =
    context.articleSourceLinks.length > 0
      ? `<section class="codex-article-support__panel codex-article-sources"><h2>Sources</h2><ul>${context.articleSourceLinks
          .map((entry) => `<li><a href="${escapeXml(entry.url)}" rel="noopener noreferrer">${escapeXml(entry.name)}</a></li>`)
          .join("")}</ul></section>`
      : "";

  const faqHtml =
    context.faqEntries.length > 0
      ? `<section class="codex-article-support__panel codex-article-faq"><h2>Common questions</h2>${context.faqEntries
          .map(
            (entry) =>
              `<details><summary>${escapeXml(entry.question)}</summary><p>${escapeXml(entry.answer)}</p></details>`,
          )
          .join("")}</section>`
      : "";

  if (!summaryHtml && !guidanceHtml && !sourcesHtml && !relatedHtml && !faqHtml) {
    return "";
  }

  return `<section class="codex-article-support" aria-label="Article summary, buyer guidance, sources, and related pages"><div class="codex-article-support__grid">${summaryHtml}${guidanceHtml}${sourcesHtml}${relatedHtml}</div>${faqHtml}</section>`;
}

function firstSentence(value: string): string {
  const match = cleanText(value).match(/^.*?[.!?](?:\s|$)/);
  return match ? cleanText(match[0]) : cleanText(value);
}

function buildArticleFaqSubject(contentTitle: string): string {
  return cleanText(contentTitle.split(/\s*[:|-]\s*/)[0]) || contentTitle;
}

function buildArticleGuidanceQuestion(subject: string, label: string): string {
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

function buildBreadcrumbs(route: string, contentTitle: string): BreadcrumbItem[] {
  const canonicalRoute = resolveCanonicalRoute(route);
  const items: BreadcrumbItem[] = [{ name: "Home", url: absoluteUrl("/") }];

  if (canonicalRoute === "/") {
    return items;
  }

  if (canonicalRoute.startsWith("/product/")) {
    items.push({ name: "Products", url: absoluteUrl("/products/all/") });
    items.push({ name: contentTitle, url: absoluteUrl(canonicalRoute) });
    return items;
  }

  if (/^\/20\d{2}\//.test(canonicalRoute)) {
    items.push({ name: "Blog", url: absoluteUrl("/blog/") });
    items.push({ name: contentTitle, url: absoluteUrl(canonicalRoute) });
    return items;
  }

  if (canonicalRoute.startsWith("/products/")) {
    items.push({ name: "Products", url: absoluteUrl("/products/all/") });

    if (canonicalRoute !== "/products/all/") {
      items.push({ name: contentTitle, url: absoluteUrl(canonicalRoute) });
    }

    return items;
  }

  if (canonicalRoute === "/solutions/") {
    items.push({ name: "Solutions", url: absoluteUrl(canonicalRoute) });
    return items;
  }

  if (canonicalRoute.startsWith("/solutions/")) {
    items.push({ name: "Solutions", url: absoluteUrl("/solutions/") });
    items.push({ name: contentTitle, url: absoluteUrl(canonicalRoute) });
    return items;
  }

  if (canonicalRoute === "/compare/") {
    items.push({ name: "Compare", url: absoluteUrl(canonicalRoute) });
    return items;
  }

  if (canonicalRoute.startsWith("/compare/")) {
    items.push({ name: "Compare", url: absoluteUrl("/compare/") });
    items.push({ name: contentTitle, url: absoluteUrl(canonicalRoute) });
    return items;
  }

  if (canonicalRoute === "/compatibility/") {
    items.push({ name: "Compatibility", url: absoluteUrl(canonicalRoute) });
    return items;
  }

  if (canonicalRoute.startsWith("/compatibility/")) {
    items.push({ name: "Compatibility", url: absoluteUrl("/compatibility/") });
    items.push({ name: contentTitle, url: absoluteUrl(canonicalRoute) });
    return items;
  }

  if (canonicalRoute === "/guides/") {
    items.push({ name: "Guides", url: absoluteUrl(canonicalRoute) });
    return items;
  }

  if (canonicalRoute.startsWith("/guides/")) {
    items.push({ name: "Guides", url: absoluteUrl("/guides/") });
    items.push({ name: contentTitle, url: absoluteUrl(canonicalRoute) });
    return items;
  }

  if (canonicalRoute.startsWith("/contact/") && canonicalRoute !== "/contact/") {
    items.push({ name: "Contact", url: absoluteUrl("/contact/") });
    items.push({ name: contentTitle, url: absoluteUrl(canonicalRoute) });
    return items;
  }

  items.push({ name: contentTitle, url: absoluteUrl(canonicalRoute) });
  return items;
}

function buildJsonLd(context: PageContext, page: SnapshotPage): Array<Record<string, unknown>> {
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
    entries.push({
      "@context": "https://schema.org",
      "@type": "Article",
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

  // HowTo schema for pages with step-by-step workflow sections
  if (context.kind === "article" || context.kind === "collection" || context.kind === "home") {
    const $body = load(`<body>${page.bodyHtml}</body>`);
    const stepElements = $body(".codex-editorial-step-copy");

    if (stepElements.length >= 2) {
      const steps = stepElements
        .toArray()
        .map((el) => cleanText($body(el).text()))
        .filter((text) => text.length > 10);

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

function buildWebPageJsonLd(
  context: PageContext,
  pageId: string,
  websiteId: string,
  canonicalPath: string,
  editorialSectionLinks: BreadcrumbItem[],
): Record<string, unknown> {
  const sourceLinks = resolveContextSourceLinks(context);
  const type =
    context.kind === "contact"
      ? "ContactPage"
      : context.kind === "about"
        ? "AboutPage"
        : context.kind === "collection" || context.kind === "blog"
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

function resolveEditorialSectionLinks(page: SnapshotPage, canonicalUrl: string): BreadcrumbItem[] {
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

function resolveProductCategory(page: SnapshotPage): string {
  const $body = load(`<body>${page.bodyHtml}</body>`);
  const categories = $body(".posted_in a")
    .toArray()
    .map((element) => cleanText($body(element).text()))
    .filter(Boolean);

  return categories.at(-1) ?? "RFID & NFC Products";
}

function extractContactDetails($body: CheerioAPI): string {
  const values = $body(".entry-content p")
    .toArray()
    .map((element) => cleanText($body(element).text()))
    .filter((text) => /@|\+\d|Shenzhen|China/i.test(text));

  return values.join(" ");
}

function getPreferredHeading($body: CheerioAPI, selectors: string[]): string {
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

function extractMeaningfulParagraphs($body: CheerioAPI, selectors: string[], limit: number): string[] {
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

function extractProductSpecs($body: CheerioAPI, contentTitle = "", route = ""): ProductSpec[] {
  const specs: ProductSpec[] = [];
  const seen = new Set<string>();

  const pushSpec = (rawName: string, rawValue: string): void => {
    const normalizedName = normalizeProductSpecName(rawName);
    const normalizedValue = normalizeProductSpecValue(rawValue);

    if (!normalizedName || !normalizedValue) {
      return;
    }

    const key = normalizedName.toLowerCase();
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    specs.push({
      name: normalizedName,
      value: normalizedValue,
    });
  };

  $body(".entry-content table tr, .woocommerce-Tabs-panel table tr").each((_, element) => {
    const cells = $body(element).find("th, td");

    if (cells.length !== 2) {
      return;
    }

    pushSpec($body(cells[0]).text(), $body(cells[1]).text());
  });

  $body(".kt-blocks-info-box, .wp-block-kadence-infobox").each((_, element) => {
    const name = $body(element).find(".kt-blocks-info-box-title").first().text();
    const value = $body(element).find(".kt-blocks-info-box-text").first().text();
    pushSpec(name, value);
  });

  $body(".entry-content p, .woocommerce-product-details__short-description p").each((_, element) => {
    const strong = $body(element).find("strong").first();
    const paragraphText = cleanText($body(element).text());

    if (!paragraphText) {
      return;
    }

    if (strong.length) {
      const label = cleanText(strong.text()).replace(/:$/, "");
      if (!label) {
        return;
      }

      const value = paragraphText.replace(new RegExp(`^${escapeRegExp(label)}\\s*:?\\s*`, "i"), "");
      pushSpec(label, value);
      return;
    }

    const colonSpec = extractColonPatternSpec(paragraphText);
    if (!colonSpec) {
      return;
    }

    pushSpec(colonSpec.name, colonSpec.value);
  });

  inferProductSpecsFromCopy($body, contentTitle, route).forEach((entry) => {
    pushSpec(entry.name, entry.value);
  });

  return specs.slice(0, 12);
}

function normalizeProductSpecName(value: string): string {
  const cleaned = cleanText(value).replace(/:$/, "");

  if (!cleaned) {
    return "";
  }

  if (/^item$/i.test(cleaned) || /^types?$/i.test(cleaned)) {
    return "Model";
  }

  if (/^contactless$/i.test(cleaned)) {
    return "Operation";
  }

  if (/^with adhesive layer$/i.test(cleaned)) {
    return "Adhesive Backing";
  }

  if (/^thin and flexible$/i.test(cleaned) || /^ultra-thin design$/i.test(cleaned)) {
    return "Form Factor";
  }

  if (/^customizability$/i.test(cleaned)) {
    return "Customization";
  }

  if (/^wide selection$/i.test(cleaned)) {
    return "Model Range";
  }

  if (/^fine mold$/i.test(cleaned)) {
    return "Build Quality";
  }

  if (/^various material$/i.test(cleaned) || /^paper$/i.test(cleaned)) {
    return "Material";
  }

  if (/^high quality personalization$/i.test(cleaned)) {
    return "Personalization";
  }

  if (/^access control$/i.test(cleaned)) {
    return "Applications";
  }

  if (/^lift control$/i.test(cleaned)) {
    return "Applications";
  }

  if (/^product name$/i.test(cleaned) || /^brand name$/i.test(cleaned)) {
    return "";
  }

  if (/^model no\.?$/i.test(cleaned) || /^model number$/i.test(cleaned)) {
    return "Model";
  }

  if (/^protocol$/i.test(cleaned)) {
    return "Protocol";
  }

  if (/^supported standards?$/i.test(cleaned)) {
    return "Protocol";
  }

  if (/^125\s*khz$/i.test(cleaned)) {
    return "125 kHz Chip Options";
  }

  if (/^(?:13(?:\.56)?|13\.56|56)\s*mhz$/i.test(cleaned)) {
    return "13.56 MHz Chip Options";
  }

  if (/^915\s*mhz$/i.test(cleaned)) {
    return "915 MHz Chip Options";
  }

  if (/^frequency(?: range)?$/i.test(cleaned)) {
    return "Frequency";
  }

  if (/^(?:micro)?chip(?: type| available)?$/i.test(cleaned)) {
    return "Chip";
  }

  if (/^material$/i.test(cleaned)) {
    return "Material";
  }

  if (/^(standard size|size)$/i.test(cleaned)) {
    return "Size";
  }

  if (/^dimension(?:s)?$/i.test(cleaned)) {
    return "Dimensions";
  }

  if (/^printing$/i.test(cleaned)) {
    return "Printing";
  }

  if (/^(life ?time|lifespan)$/i.test(cleaned)) {
    return "Lifespan";
  }

  if (/^(usage|application|applications)$/i.test(cleaned)) {
    return "Applications";
  }

  if (/^reading distance$/i.test(cleaned) || /^long reading distance$/i.test(cleaned) || /^tested read range$/i.test(cleaned)) {
    return "Read Range";
  }

  if (/^read range$/i.test(cleaned) || /^superior reading distance$/i.test(cleaned)) {
    return "Read Range";
  }

  if (/^working temperature$/i.test(cleaned)) {
    return "Operating Temperature";
  }

  if (/^storage temperature$/i.test(cleaned)) {
    return "Storage Temperature";
  }

  if (/^write endurance$/i.test(cleaned)) {
    return "Write Cycles";
  }

  if (/^data retention time$/i.test(cleaned)) {
    return "Data Retention";
  }

  if (/^crafts?( available)?$/i.test(cleaned)) {
    return "Finishing Options";
  }

  if (/^package$/i.test(cleaned) || /^packing details$/i.test(cleaned)) {
    return "Packaging";
  }

  if (/^using times$/i.test(cleaned)) {
    return "Reuse Cycle";
  }

  if (/^working mode$/i.test(cleaned)) {
    return "Operating Mode";
  }

  if (/^humidity$/i.test(cleaned)) {
    return "Operating Humidity";
  }

  if (/^plating$/i.test(cleaned)) {
    return "Finish";
  }

  if (/^memory$/i.test(cleaned)) {
    return "Memory";
  }

  if (/^thickness$/i.test(cleaned)) {
    return "Thickness";
  }

  if (/^temperature(?: range)?$/i.test(cleaned)) {
    return "Temperature Range";
  }

  if (/^feature\s+\w+/i.test(cleaned)) {
    return "";
  }

  if (/^(?:em\d+[a-z0-9-]*|ata\d+[a-z0-9-]*|t\d+[a-z0-9-]*|uem)$/i.test(cleaned)) {
    return "";
  }

  if (/^\d+\s*,/i.test(cleaned) || /^\d+\s*[.)-]/i.test(cleaned)) {
    return "";
  }

  if (/(?:card|cards|tag|tags|wristband|reader|keyfob|key fob|ring)/i.test(cleaned) && cleaned.split(/\s+/).length >= 2) {
    return "";
  }

  return cleaned.length > 40 ? "" : cleaned;
}

function normalizeProductSpecValue(value: string): string {
  const cleaned = truncateText(cleanText(value), 220);

  if (!cleaned) {
    return "";
  }

  if (/^(continue|loading|done)$/i.test(cleaned)) {
    return "";
  }

  return cleaned;
}

function extractColonPatternSpec(text: string): ProductSpec | null {
  const match = text.match(/^(?:\d+\s*[,).-]\s*)?([^:]{2,40}):\s*(.+)$/);

  if (!match) {
    return null;
  }

  return {
    name: match[1],
    value: match[2],
  };
}

function inferProductSpecsFromCopy($body: CheerioAPI, contentTitle: string, route: string): ProductSpec[] {
  const textBlocks = $body(".entry-content p, .woocommerce-product-details__short-description p")
    .toArray()
    .map((element) => cleanText($body(element).text()))
    .filter(Boolean);
  const combined = textBlocks.join(" ");
  const specs: ProductSpec[] = [];
  const push = (name: string, value: string): void => {
    const normalizedName = normalizeProductSpecName(name);
    const normalizedValue = normalizeProductSpecValue(value);

    if (!normalizedName || !normalizedValue || specs.some((entry) => entry.name === normalizedName)) {
      return;
    }

    specs.push({
      name: normalizedName,
      value: normalizedValue,
    });
  };

  if (/contact interface/i.test(combined) && /contactless interface/i.test(combined)) {
    push("Interface", "Dual interface card with contact and contactless communication.");
  }

  if (/\bonly one chip\b|\bsingle chip\b/i.test(combined)) {
    push("Chip Architecture", "Single-chip design supporting both contact and contactless functions.");
  }

  if (/customized printing|branding options|printed design|encoding according to client requirement|customizable options/i.test(combined)) {
    const source =
      textBlocks.find((entry) => /customized printing|branding options|printed design|encoding according to client requirement|customizable options/i.test(entry)) ??
      "Custom printing, branding, and encoding are supported.";
    push("Customization", source);
  }

  if (/adhesive layer/i.test(combined)) {
    push("Adhesive Backing", "Self-adhesive layer for direct application to target surfaces.");
  }

  if (/thin and flexible/i.test(combined)) {
    push("Form Factor", "Thin and flexible label format for flat or curved surfaces.");
  }

  if (/coated with\s+paper,\s*pvc,\s*pet/i.test(combined)) {
    push("Material", "Paper, PVC, and PET coating options are available.");
  }

  if (/wave-absorbing layer|on metal surface/i.test(combined)) {
    push("On-Metal Performance", "Available with wave-absorbing layer for stable operation on metal surfaces.");
  }

  const applicationSentences = textBlocks.filter((entry) =>
    /access control|inventory management|asset identification|event management|public traffic|transport|hospitality|security/i.test(entry),
  );
  if (applicationSentences.length > 0) {
    push("Applications", applicationSentences.slice(0, 2).join(" "));
  }

  if (/wristband|card|sticker|label|key fob|keyfob|reader|tag/i.test(contentTitle)) {
    const formFactor = inferFormFactorFromTitle(contentTitle, route);
    if (formFactor) {
      push("Form Factor", formFactor);
    }
  }

  return specs;
}

function inferFormFactorFromTitle(contentTitle: string, route: string): string {
  const haystack = `${contentTitle} ${route}`.toLowerCase();

  if (haystack.includes("sticker") || haystack.includes("label")) {
    return "Adhesive label format for direct application to objects or packaging.";
  }

  if (haystack.includes("key fob") || haystack.includes("keyfob")) {
    return "Compact keyfob form factor for handheld access credentials.";
  }

  if (haystack.includes("wristband")) {
    return "Wearable wristband form factor for access control or event use.";
  }

  if (haystack.includes("reader")) {
    return "Desktop or embedded reader hardware for RFID or NFC identification workflows.";
  }

  if (haystack.includes("card")) {
    return "Card format compatible with common access-control, ID, or NFC workflows.";
  }

  return "";
}

function applyImageAccessibility($body: CheerioAPI, context: PageContext): void {
  $body("img").each((index, element) => {
    const $image = $body(element);

    // H1: Ensure all images have loading and decoding attributes
    if (!$image.attr("loading")) {
      $image.attr("loading", index < 2 ? "eager" : "lazy");
    }
    if (!$image.attr("decoding")) {
      $image.attr("decoding", "async");
    }

    const currentAlt = cleanText($image.attr("alt") ?? "");

    if (!isWeakImageAlt(currentAlt)) {
      return;
    }

    const nextAlt = guessImageAlt($body, element, context.contentTitle, context.kind);

    if (!nextAlt) {
      return;
    }

    $image.attr("alt", nextAlt);

    const wrapper = $image.closest(".woocommerce-product-gallery__image");
    if (wrapper.length && !cleanText(wrapper.attr("data-thumb-alt") ?? "")) {
      wrapper.attr("data-thumb-alt", nextAlt);
    }
  });

  if (context.kind === "article" && context.articleMeta) {
    $body("time.updated").each((_, element) => {
      $body(element).text(context.articleMeta.modifiedLabel);
    });
  }

  const canonicalImage = $body(`img[src="${context.imageUrl.replace(SITE_ORIGIN, "")}"], img[data-large_image="${context.imageUrl}"]`).first();
  if (canonicalImage.length) {
    canonicalImage.attr("alt", context.imageAlt);
  }
}

function buildSchemaKeywords(contentTitle: string, route: string): string {
  // Prefer editorial-authored keyword phrases (set in editorial JSON's `keywords` field)
  // over naive title tokenization; avoids garbage like "how, far, can, be" in JSON-LD keywords.
  const authored = EDITORIAL_KEYWORDS_MAP.get(route);
  if (authored && authored.length > 0) {
    return authored.join(", ");
  }
  return Array.from(buildImageKeywordSet(contentTitle, route)).slice(0, 8).join(", ");
}

function buildImageKeywordSet(contentTitle: string, route: string): Set<string> {
  const stopWords = new Set([
    "the",
    "and",
    "for",
    "with",
    "from",
    "into",
    "your",
    "guide",
    "complete",
    "ultimate",
    "2024",
    "2025",
    "proud",
    "tek",
  ]);

  const tokens = `${contentTitle} ${route}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !stopWords.has(token));

  return new Set(tokens);
}

function buildSpecificImageKeywordSet(contentTitle: string, route: string): Set<string> {
  const broadTerms = new Set([
    "rfid",
    "nfc",
    "card",
    "cards",
    "tag",
    "tags",
    "sticker",
    "stickers",
    "label",
    "labels",
    "reader",
    "readers",
    "wristband",
    "wristbands",
    "product",
  ]);

  return new Set(Array.from(buildImageKeywordSet(contentTitle, route)).filter((token) => !broadTerms.has(token)));
}

function scoreKeywordMatches(value: string, keywords: Set<string>): number {
  const haystack = value.toLowerCase();
  let score = 0;

  keywords.forEach((keyword) => {
    if (haystack.includes(keyword)) {
      score += 1;
    }
  });

  return score;
}

function selectImageUrl($body: CheerioAPI, element: Parameters<CheerioAPI["attr"]>[0]): string {
  return cleanText(
    $body(element).attr("data-large_image") ??
      $body(element).attr("data-src") ??
      $body(element).attr("src") ??
      "",
  );
}

function isDecorativeImageUrl(value: string): boolean {
  return /(logo|favicon|emoji|flag|avatar|icon)/i.test(value);
}

function isPlaceholderImageUrl(value: string): boolean {
  return /(?:%5b|\[).*(?:url|badge).*(?:%5d|\])/i.test(value);
}

function isTinyImageVariant(value: string): boolean {
  return /-(?:100|150|180|192|225|270|300)x(?:81|97|100|150|164|180|192|200|225|261|270|300|327)\./i.test(value);
}

function getLowValueImagePenalty(value: string, alt: string, kind: PageKind, route: string): number {
  const haystack = `${value} ${alt}`.toLowerCase();
  let penalty = 0;

  if (/(badge|certif|certificate|iso[_-]?9001|iso[_-]?14001|oeko|rohs|reach)/i.test(haystack)) {
    penalty += 40;
  }

  if (kind !== "product" && /(legic|impinj|nxp|atmel|fm|issi|microelectronic|\bst\b|\bti\b)/i.test(haystack)) {
    penalty += route === "/about/" ? 80 : 45;
  }

  if (kind === "home" && /(badge|logo)/i.test(haystack)) {
    penalty += 36;
  }

  return penalty;
}

function parseDimension(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? "", 10);

  return Number.isFinite(parsed) ? parsed : 0;
}

function isWeakImageAlt(value: string): boolean {
  return !value || /^(image|photo|picture|product)$/i.test(value);
}

function guessImageAlt(
  $body: CheerioAPI,
  element: Parameters<CheerioAPI["attr"]>[0],
  contentTitle: string,
  kind: PageKind,
): string {
  const src = selectImageUrl($body, element);

  if (!src) {
    return fallbackImageAlt(contentTitle, kind);
  }

  if ($body(element).closest(".site-branding, .custom-logo, .footer-html, footer").length > 0 || /logo/i.test(src)) {
    return "Proud Tek logo";
  }

  if (/favicon/i.test(src)) {
    return "Proud Tek favicon";
  }

  const loopTitle =
    cleanText(
      $body(element)
        .closest("li.product, .product")
        .find(".woocommerce-loop-product__title, .product_title")
        .first()
        .text(),
    ) || cleanText($body(element).closest("a").attr("aria-label") ?? "");

  if (loopTitle) {
    return `${loopTitle} product image`;
  }

  const filenameTitle = filenameToTitle(src);
  if (filenameTitle && !/^[a-f0-9-]{16,}$/i.test(filenameTitle.replace(/\s+/g, ""))) {
    return kind === "product" ? `${filenameTitle} product image` : filenameTitle;
  }

  return fallbackImageAlt(contentTitle, kind);
}

function fallbackImageAlt(contentTitle: string, kind: PageKind): string {
  if (kind === "product") {
    return `${contentTitle} product image`;
  }

  if (kind === "article") {
    return `${contentTitle} illustration`;
  }

  return contentTitle;
}

function filenameToTitle(value: string): string {
  const filename = value.split("/").pop() ?? "";

  return decodeURIComponent(filename)
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/-\d+x\d+$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeDateTime(value: string, fallback: string): string {
  const normalized = value || fallback;

  return /^\d{4}-\d{2}-\d{2}T/.test(normalized) ? normalized : fallback;
}

function formatDisplayDate(value: string): string {
  const datePart = value.slice(0, 10);
  const parsed = new Date(`${datePart}T00:00:00Z`);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

function cleanSnapshotTitle(value: string): string {
  return cleanText(value)
    .replace(/ExpandToggle Menu.*$/i, "")
    .replace(/GridList.*$/i, "")
    .replace(/ContinueLoadingDone.*$/i, "")
    .replace(/PreviousContinue.*$/i, "")
    .replace(/FacebookTwitterInstagramLinkedinYouTubePhoneWhatsAppEmail.*$/i, "")
    .replace(/\s*[|–-]\s*Custom RFID.*$/i, "")
    .replace(/\s*[|–-]\s*Proud Tek.*$/i, "")
    .trim();
}

function isBoilerplateText(value: string): boolean {
  return (
    /Toggle Menu/i.test(value) ||
    /RFID Tags RFID Labels RFID Readers RFID cards RFID Keyfobs RFID Wristbands/i.test(value) ||
    /FacebookTwitterInstagramLinkedinYouTubePhoneWhatsAppEmail/i.test(value) ||
    /^[{}[\]":,@.\s-]+$/.test(value)
  );
}

function isSoft404Page(page: SnapshotPage, contentTitle?: string): boolean {
  const normalizedTitle = cleanText(contentTitle ?? cleanSnapshotTitle(page.title));

  if (/^404 Not Found$/i.test(normalizedTitle)) {
    return true;
  }

  return /^404 Not Found\b/i.test(cleanText(page.bodyHtml));
}

function buildRobotsValue(indexable: boolean): string {
  return `${indexable ? "index" : "noindex"},follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1`;
}

export function isIndexableRoute(route: string): boolean {
  if (resolveCanonicalRoute(route) !== normalizeRoute(route)) {
    return false;
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
    return false;
  }

  return !/\/page\/\d+\/$/.test(route);
}

function getCollectionDescription(route: string): string {
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

function findProductSpecValue(specs: ProductSpec[], names: string[]): string {
  const normalizedNames = new Set(names.map((name) => name.toLowerCase()));
  return specs.find((entry) => normalizedNames.has(entry.name.toLowerCase()))?.value ?? "";
}

export function buildMachineRoute(route: string, extension: "json" | "txt"): string {
  const normalized = normalizeRoute(route);

  if (normalized === "/") {
    return `/machine/index.${extension}`;
  }

  return `/machine${normalized.slice(0, -1)}.${extension}`;
}

function getArticleDate(route: string): string {
  const match = route.match(/^\/(\d{4})\/(\d{2})\/(\d{2})\//);

  if (!match) {
    return new Date().toISOString();
  }

  return `${match[1]}-${match[2]}-${match[3]}T00:00:00+08:00`;
}

function getLastModified(page: SnapshotPage, generatedAt: string): string {
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

function absoluteUrl(value: string): string {
  if (!value) {
    return `${SITE_ORIGIN}/`;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (value.startsWith("//")) {
    return `https:${value}`;
  }

  return new URL(normalizeRoute(value), `${SITE_ORIGIN}/`).toString();
}

function resolveCanonicalRoute(route: string): string {
  const normalized = normalizeRoute(route);
  return normalized ? ROUTE_CANONICAL_OVERRIDES[normalized] ?? normalized : normalized;
}

function resolveLegacyRedirectPath(route: string): string {
  const normalized = normalizeRoute(route);

  if (!normalized) {
    return "";
  }

  const canonicalOverride = ROUTE_CANONICAL_OVERRIDES[normalized];
  return canonicalOverride && canonicalOverride !== normalized ? canonicalOverride : "";
}

function normalizeRoute(route: string): string {
  if (!route) {
    return "";
  }

  if (/^https?:\/\//i.test(route)) {
    try {
      const url = new URL(route);
      route = url.pathname;
    } catch {
      return "";
    }
  } else if (route.startsWith("//")) {
    return "";
  } else if (/^[a-z]+:/i.test(route) || route.startsWith("#")) {
    return "";
  }

  let normalized = route.startsWith("/") ? route : `/${route}`;

  if (!normalized.endsWith("/") && !/\.[a-z0-9]+$/i.test(normalized)) {
    normalized = `${normalized}/`;
  }

  return normalized;
}

function slugToTitle(value: string): string {
  return decodeURIComponent(value)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function hostnameToLabel(value: string): string {
  try {
    const hostname = new URL(value).hostname.replace(/^www\./i, "");
    return slugToTitle(hostname.split(".")[0] ?? hostname);
  } catch {
    return "";
  }
}

function cleanText(value: string): string {
  return value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function truncateText(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  const slice = value.slice(0, maxLength - 3);
  const boundary = slice.lastIndexOf(" ");

  return `${slice.slice(0, boundary > 60 ? boundary : slice.length)}...`;
}

function uniqueTextEntries(values: string[]): string[] {
  const seen = new Set<string>();
  const results: string[] = [];

  values.forEach((value) => {
    const key = value.toLowerCase();

    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    results.push(value);
  });

  return results;
}

function stripNoiseHtmlComments(value: string): string {
  return value
    .replace(/<!--\s*Google tag \(gtag\.js\) snippet added by Site Kit\s*-->/gi, "")
    .replace(/<!--\s*Google Analytics snippet added by Site Kit\s*-->/gi, "")
    .replace(/<!--\s*Google AdSense meta tags added by Site Kit\s*-->/gi, "")
    .replace(/<!--\s*End Google AdSense meta tags added by Site Kit\s*-->/gi, "")
    .replace(/<!--\s*Analytics by WP Statistics[\s\S]*?-->/gi, "")
    .replace(/\n\s*\n\s*\n+/g, "\n\n");
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const CONTEXTUAL_LINK_MAP: Array<{ pattern: RegExp; href: string; label: string }> = [
  { pattern: /\bhotel key cards?\b/i, href: "/solutions/hotel-key-cards/", label: "hotel key cards" },
  { pattern: /\blaundry (?:rfid )?tags?\b/i, href: "/solutions/rfid-laundry-tags/", label: "laundry tags" },
  { pattern: /\bgoogle review (?:nfc )?cards?\b/i, href: "/solutions/google-review-nfc-card/", label: "Google review NFC cards" },
  { pattern: /\bnfc business cards?\b/i, href: "/solutions/nfc-business-card/", label: "NFC business cards" },
  { pattern: /\bMIFARE Classic\b/i, href: "/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/", label: "MIFARE Classic" },
  { pattern: /\bMIFARE DESFire\b/i, href: "/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/", label: "MIFARE DESFire" },
  { pattern: /\bNTAG21[356]\b/i, href: "/compare/ntag213-vs-ntag215-vs-ntag216/", label: "NTAG chips" },
  { pattern: /\brfid wristbands?\b/i, href: "/products/rfid-wristbands/", label: "RFID wristbands" },
  { pattern: /\brfid readers?\b/i, href: "/products/rfid-readers/", label: "RFID readers" },
  { pattern: /\brfid labels?\b/i, href: "/products/rfid-labels/", label: "RFID labels" },
];

function injectContextualLinks($body: CheerioAPI, container: ReturnType<CheerioAPI>, currentRoute: string): void {
  if (!container.length) return;

  let injected = 0;
  const maxLinks = 3;
  const usedHrefs = new Set<string>();

  container.find("p").each((_, element) => {
    if (injected >= maxLinks) return;

    const $p = $body(element);
    // Skip paragraphs that already contain links
    if ($p.find("a").length > 0) return;

    const text = $p.text();

    for (const entry of CONTEXTUAL_LINK_MAP) {
      if (injected >= maxLinks) break;
      if (usedHrefs.has(entry.href)) continue;
      // Don't link to the current page
      if (currentRoute === entry.href) continue;

      const match = entry.pattern.exec(text);
      if (match) {
        const original = match[0];
        const html = $p.html() ?? "";
        const newHtml = html.replace(
          original,
          `<a href="${entry.href}" title="${entry.label}">${original}</a>`,
        );
        $p.html(newHtml);
        usedHrefs.add(entry.href);
        injected++;
        break; // Only one link per paragraph
      }
    }
  });
}

/**
 * editorial-authority-ld — build Article.author / reviewedBy / citation JSON-LD
 * for pages whose route matches an editorial JSON with authority signals set.
 *
 * Used by SnapshotLayout.astro (industries / products / lp / markets /
 * compatibility) so the same E-E-A-T signal that EditorialPage renders also
 * reaches Google for the ~218 pages rendered from WP snapshots.
 *
 * Design notes:
 *  - Returns a pre-stringified JSON-LD entry that the caller appends to
 *    `PageSeoData.jsonLd[]` (BaseLayout already serializes that array into
 *    <script type="application/ld+json"> tags).
 *  - Skips silently when no editorial JSON, no authorSlug/reviewedBySlug, and
 *    no sources — we don't want to override the generic JSON-LD from seo.ts
 *    for pages that have no authority data.
 *  - The standalone Article entry does NOT duplicate the existing WebPage /
 *    Product / BreadcrumbList entries; it adds a NEW record so Google can
 *    treat the page as bylined content without losing the Product schema.
 *  - Author records resolve from the static registry in src/lib/authors.ts
 *    (backed by src/content/authors/*.json — schema-validated by the
 *    `authors` collection). resolveEditorialByline() below is the shared
 *    resolver for both this LD emitter and the visible byline strip in
 *    EditorialArticle.astro, so the two can never disagree.
 */
import type { EditorialAuthor, EditorialDefinition } from "./editorial-types";
import { getAuthorRecord } from "./authors";
import { EDITORIAL_ROUTE_INDEX, loadEditorialDefinitions } from "./editorial-pages";
import { SITE_ORIGIN } from "./seo-content";
import { absoluteUrl } from "./seo/utils";

async function loadRouteIndex(): Promise<Map<string, EditorialDefinition>> {
  await loadEditorialDefinitions(); // populates EDITORIAL_ROUTE_INDEX
  return EDITORIAL_ROUTE_INDEX;
}

/**
 * Shared authority-signal predicate: a route gets a standalone authority
 * Article when its editorial definition carries at least one authority
 * field. Single source of truth for both buildAuthorityLdForRoute() (the
 * emitter) and hasAuthorityArticle() (the skip-gate in seo/jsonld.ts) so
 * the two can never drift apart.
 */
function hasAuthoritySignals(def: EditorialDefinition | undefined): boolean {
  if (!def) return false;
  if (!isArticleRoute(def.route)) return false;
  return !!def.authorSlug || !!def.reviewedBySlug || !!def.author || !!def.reviewedBy || (def.sources ?? []).length > 0;
}

/**
 * Audit 2026-09-02 (Phase 10 SD-3): an `Article` node is only appropriate on
 * pages that *are* articles — editorial long-form content. Product pages,
 * the homepage, contact forms, supplier landing pages and country pages were
 * all emitting Article (≈260 pages) because every editorial definition has
 * an author. Those pages keep WebPage / Product / ContactPage; the byline
 * stays visible in HTML and in the /machine mirrors.
 *
 * Group hubs (`/blog/`, `/guides/`, …) are excluded because they are
 * CollectionPages, not articles.
 */
const ARTICLE_ROUTE_GROUPS = new Set([
  "blog",
  "guides",
  "compare",
  "solutions",
  "industries",
  "case-studies",
  "compatibility",
  "research",
  "about",
]);

export function isArticleRoute(route: string): boolean {
  const segments = route.split("/").filter(Boolean);
  if (segments.length < 2) return false; // homepage and group hubs
  return ARTICLE_ROUTE_GROUPS.has(segments[0]);
}

/**
 * Sync lookup used by seo/jsonld.ts buildJsonLd: when true, the layouts
 * (EditorialPageLayout / SnapshotLayout) append the authority Article for
 * this route, so buildJsonLd must skip its own Article entity — otherwise
 * the page emits two Article nodes sharing the same @id.
 *
 * Backed by EDITORIAL_ROUTE_INDEX, which loadEditorialDefinitions()
 * populates during getSiteData() — always before any buildPageSeo() call
 * in a page build.
 */
export function hasAuthorityArticle(route: string): boolean {
  return hasAuthoritySignals(EDITORIAL_ROUTE_INDEX.get(route));
}

function buildPersonLd(author: EditorialAuthor): Record<string, unknown> {
  return {
    "@type": "Person",
    name: author.name,
    jobTitle: author.jobTitle,
    // Registry records store root-relative profile URLs (anchors on
    // /about/review-board/). schema.org requires absolute URLs —
    // absoluteUrl() keeps the #fragment intact (see seo/utils.ts).
    ...(author.url ? { url: absoluteUrl(author.url) } : {}),
    ...(author.sameAs && author.sameAs.length ? { sameAs: author.sameAs } : {}),
    ...(author.expertise && author.expertise.length ? { knowsAbout: author.expertise } : {}),
  };
}

/**
 * Shared byline resolution — the SAME author/reviewer the authority Article
 * JSON-LD declares, exposed for the visible byline strip that
 * EditorialArticle.astro renders under the hero H1. Both consumers read the
 * static registry (src/lib/authors.ts) with identical precedence, so the
 * reader-visible byline can never drift from Article.author:
 *
 *   author:   authorSlug → registry record (name + profile URL)
 *             else free-text `author` (name only, unlinked)
 *   reviewer: reviewedBySlug → registry record (name + profile URL)
 *             else free-text `reviewedBy` (name only, unlinked)
 *
 * URLs are root-relative (`/about/review-board/#<slug>`) — ready for href
 * use; buildPersonLd absolutizes them for JSON-LD.
 */
export interface BylinePerson {
  name: string;
  url?: string;
}

export interface ResolvedByline {
  author: BylinePerson | null;
  reviewer: BylinePerson | null;
}

export function resolveEditorialByline(
  def: Pick<EditorialDefinition, "authorSlug" | "author" | "reviewedBySlug" | "reviewedBy">,
): ResolvedByline {
  const authorRecord = getAuthorRecord(def.authorSlug);
  const reviewerRecord = getAuthorRecord(def.reviewedBySlug);
  return {
    author: authorRecord
      ? { name: authorRecord.name, ...(authorRecord.url ? { url: authorRecord.url } : {}) }
      : def.author
        ? { name: def.author }
        : null,
    reviewer: reviewerRecord
      ? { name: reviewerRecord.name, ...(reviewerRecord.url ? { url: reviewerRecord.url } : {}) }
      : def.reviewedBy
        ? { name: def.reviewedBy }
        : null,
  };
}

/**
 * Build a standalone Article JSON-LD string for the given route, or null if
 * the page has no authority signals (no authorSlug, reviewedBySlug, or sources).
 */
export async function buildAuthorityLdForRoute(route: string): Promise<string | null> {
  const idx = await loadRouteIndex();
  const def = idx.get(route);
  if (!def) return null;

  // Only emit when we have at least one authority signal. Routes without an
  // authorSlug and without sources fall through to the default seo.ts JSON-LD.
  // Must stay in lockstep with hasAuthorityArticle() — buildJsonLd skips its
  // Article exactly when this function emits one.
  if (!hasAuthoritySignals(def)) return null;

  // Author/reviewer resolution goes through the static registry
  // (src/lib/authors.ts) with the same precedence as resolveEditorialByline
  // above — the visible byline and this Article LD must name the same people.
  let authorLd: Record<string, unknown> | null = null;
  let reviewerLd: Record<string, unknown> | null = null;

  const authorRecord = getAuthorRecord(def.authorSlug);
  if (authorRecord) authorLd = buildPersonLd(authorRecord);
  if (!authorLd && def.author) {
    authorLd = { "@type": "Person", name: def.author };
  }

  const reviewerRecord = getAuthorRecord(def.reviewedBySlug);
  if (reviewerRecord) {
    reviewerLd = {
      "@type": "Person",
      name: reviewerRecord.name,
      jobTitle: reviewerRecord.jobTitle,
      ...(reviewerRecord.url ? { url: absoluteUrl(reviewerRecord.url) } : {}),
    };
  }
  if (!reviewerLd && def.reviewedBy) {
    reviewerLd = { "@type": "Person", name: def.reviewedBy };
  }

  const citationLd = (def.sources ?? []).map((src) => ({
    "@type": "CreativeWork",
    name: src.label,
    url: src.url,
    ...(src.publisher ? { publisher: { "@type": "Organization", name: src.publisher } } : {}),
    ...(src.publishedAt ? { datePublished: src.publishedAt } : {}),
    ...(src.accessedAt ? { dateAccessed: src.accessedAt } : {}),
    ...(src.note ? { description: src.note } : {}),
  }));

  // NOTE: no second "did the signals resolve?" bail here. buildJsonLd
  // (seo/jsonld.ts) skips its own Article whenever hasAuthoritySignals()
  // is true, so this function MUST emit on the same condition — bailing
  // when e.g. an authorSlug fails to resolve would leave the page with no
  // Article at all. A minimal Article (headline/description/publisher)
  // is still valid without an author node.

  // Truncate headline to 110 chars per Google Article structured-data guidance.
  const headline =
    def.title.length > 110 ? `${def.title.slice(0, 107).trimEnd()}...` : def.title;

  // This is the page's single canonical Article entity (buildJsonLd skips
  // its duplicate when authority signals exist — see hasAuthorityArticle).
  // @id / image / mainEntityOfPage must be absolute URLs per schema.org
  // guidance; def.route and def.heroImage are root-relative paths.
  const articleId = `${absoluteUrl(def.route)}#article`;

  const articleLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": articleId,
    headline,
    description: def.summary,
    ...(def.heroImage ? { image: absoluteUrl(def.heroImage) } : {}),
    ...(authorLd ? { author: authorLd } : {}),
    ...(reviewerLd ? { reviewedBy: reviewerLd, ...(def.reviewedAt ? { lastReviewed: def.reviewedAt } : {}) } : {}),
    ...(citationLd.length ? { citation: citationLd } : {}),
    ...(def.publishedAt ? { datePublished: def.publishedAt } : {}),
    ...(def.modifiedAt ? { dateModified: def.modifiedAt } : {}),
    // Same @id as the Organization node buildJsonLd emits on every page —
    // validators merge the two by id, giving the Article a full publisher.
    publisher: { "@id": `${SITE_ORIGIN}/#organization` },
    mainEntityOfPage: absoluteUrl(def.route),
  };

  return JSON.stringify(articleLd);
}

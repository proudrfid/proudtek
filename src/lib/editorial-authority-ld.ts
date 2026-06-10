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
 */
import { getCollection } from "astro:content";
import type { EditorialAuthor, EditorialDefinition } from "./editorial-types";
import { EDITORIAL_ROUTE_INDEX, loadEditorialDefinitions } from "./editorial-pages";
import { SITE_ORIGIN } from "./seo-content";
import { absoluteUrl } from "./seo/utils";

let _authorsCache: Map<string, EditorialAuthor> | null = null;
async function loadAuthors(): Promise<Map<string, EditorialAuthor>> {
  if (_authorsCache) return _authorsCache;
  const entries = await getCollection("authors");
  const map = new Map<string, EditorialAuthor>();
  for (const e of entries) {
    const data = e.data as unknown as EditorialAuthor;
    map.set(data.slug, data);
  }
  _authorsCache = map;
  return map;
}

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
  return !!def.authorSlug || !!def.reviewedBySlug || !!def.author || !!def.reviewedBy || (def.sources ?? []).length > 0;
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
    ...(author.url ? { url: author.url } : {}),
    ...(author.sameAs && author.sameAs.length ? { sameAs: author.sameAs } : {}),
    ...(author.expertise && author.expertise.length ? { knowsAbout: author.expertise } : {}),
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

  const authors = await loadAuthors();

  let authorLd: Record<string, unknown> | null = null;
  let reviewerLd: Record<string, unknown> | null = null;

  if (def.authorSlug) {
    const a = authors.get(def.authorSlug);
    if (a) authorLd = buildPersonLd(a);
  }
  if (!authorLd && def.author) {
    authorLd = { "@type": "Person", name: def.author };
  }

  if (def.reviewedBySlug) {
    const r = authors.get(def.reviewedBySlug);
    if (r) {
      reviewerLd = {
        "@type": "Person",
        name: r.name,
        jobTitle: r.jobTitle,
        ...(r.url ? { url: r.url } : {}),
      };
    }
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

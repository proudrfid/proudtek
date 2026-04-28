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
import { loadEditorialDefinitions } from "./editorial-pages";

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

let _routeIndexCache: Map<string, EditorialDefinition> | null = null;
async function loadRouteIndex(): Promise<Map<string, EditorialDefinition>> {
  if (_routeIndexCache) return _routeIndexCache;
  const defs = await loadEditorialDefinitions();
  const idx = new Map<string, EditorialDefinition>();
  for (const d of defs) idx.set(d.route, d);
  _routeIndexCache = idx;
  return idx;
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
  const hasSignal = !!def.authorSlug || !!def.reviewedBySlug || !!def.author || !!def.reviewedBy || (def.sources && def.sources.length > 0);
  if (!hasSignal) return null;

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

  const hasAuthority = !!authorLd || !!reviewerLd || citationLd.length > 0;
  if (!hasAuthority) return null;

  // Truncate headline to 110 chars per Google Article structured-data guidance.
  const headline =
    def.title.length > 110 ? `${def.title.slice(0, 107).trimEnd()}...` : def.title;

  // Stable @id ties this Article entity to the page so Schema.org validators
  // and Google can dedupe / merge with the seo.ts-emitted Article on routes
  // where inferPageKind() returns "article" (/solutions, /compare, /guides,
  // /compatibility, /blog/{slug}, /20XX/...). Both emitters now share the
  // same canonical Article identity instead of representing two separate ones.
  const articleId = `${def.route}#article`;

  const articleLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": articleId,
    headline,
    description: def.summary,
    ...(def.heroImage ? { image: def.heroImage } : {}),
    ...(authorLd ? { author: authorLd } : {}),
    ...(reviewerLd ? { reviewedBy: reviewerLd, ...(def.reviewedAt ? { lastReviewed: def.reviewedAt } : {}) } : {}),
    ...(citationLd.length ? { citation: citationLd } : {}),
    ...(def.publishedAt ? { datePublished: def.publishedAt } : {}),
    ...(def.modifiedAt ? { dateModified: def.modifiedAt } : {}),
    mainEntityOfPage: def.route,
  };

  return JSON.stringify(articleLd);
}

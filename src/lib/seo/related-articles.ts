/**
 * Related-articles selector — PR-S1-B.
 *
 * Pick the top-N most-related editorial entries for a given page so
 * EditorialPageLayout can render a "Related guides" / "Related articles"
 * section before the closing </main>.
 *
 * Relevance score (higher = more related):
 *   • same group           +10  (blog ↔ blog, case-studies ↔ case-studies, etc.)
 *   • same kicker          +5   (topic taxonomy)
 *   • shared keyword       +1   per overlap
 *   • shared industry tag  +3   per overlap (for SKU/product entries)
 *
 * Current page is always excluded. Items without a `route` are skipped
 * (defensive — collection invariant says route is required but content
 * loaders might leak partials).
 */
import type { EditorialDefinition } from "../editorial-types";

export interface RelatedArticleCandidate {
  route: string;
  title: string;
  summary: string;
  kicker: string;
  group: string;
  heroImage?: string;
  keywords?: string[];
  industriesDeployed?: string[];
}

export interface RelatedArticleResult {
  route: string;
  title: string;
  summary: string;
  kicker: string;
  heroImage: string;
}

/**
 * Convert a list of editorial collection entries into the candidate shape
 * used by selectRelatedArticles. Tolerates both `entry.data.X` and direct
 * `entry.X` shapes since callers come from getCollection() or from
 * pre-loaded SnapshotPage.editorialDefinition.
 */
export function toRelatedCandidate(
  source: Pick<
    EditorialDefinition,
    "route" | "title" | "summary" | "kicker" | "group" | "heroImage" | "keywords"
  > & { industriesDeployed?: string[] },
): RelatedArticleCandidate {
  return {
    route: source.route,
    title: source.title,
    summary: source.summary,
    kicker: source.kicker,
    group: source.group,
    heroImage: source.heroImage,
    keywords: source.keywords,
    industriesDeployed: source.industriesDeployed,
  };
}

/**
 * Pick top-N most-related candidates for the given current entry.
 *
 * If fewer than N candidates score above zero, the result is padded with
 * the next-best zero-score candidates so the count is stable — empty
 * "Related" rails look broken; filling with same-group items keeps the
 * UX consistent even on niche pages.
 */
export function selectRelatedArticles(
  current: RelatedArticleCandidate,
  allCandidates: RelatedArticleCandidate[],
  count = 4,
): RelatedArticleResult[] {
  const currentKeywords = new Set((current.keywords ?? []).map((k) => k.toLowerCase()));
  const currentIndustries = new Set(current.industriesDeployed ?? []);

  const scored: Array<{ c: RelatedArticleCandidate; score: number }> = [];
  for (const c of allCandidates) {
    if (!c.route || c.route === current.route) continue;
    let score = 0;
    if (c.group === current.group) score += 10;
    if (c.kicker && c.kicker === current.kicker) score += 5;
    if (c.keywords && currentKeywords.size > 0) {
      for (const k of c.keywords) {
        if (currentKeywords.has(k.toLowerCase())) score += 1;
      }
    }
    if (c.industriesDeployed && currentIndustries.size > 0) {
      for (const ind of c.industriesDeployed) {
        if (currentIndustries.has(ind)) score += 3;
      }
    }
    scored.push({ c, score });
  }

  // Sort: score desc, then deterministic by route asc for stable output.
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.c.route.localeCompare(b.c.route);
  });

  return scored.slice(0, count).map(({ c }) => ({
    route: c.route,
    title: c.title,
    summary: c.summary,
    kicker: c.kicker,
    heroImage: c.heroImage ?? "",
  }));
}

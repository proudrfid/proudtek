/**
 * Route → author-slug map for WordPress-snapshot articles.
 *
 * Retired 2026-09-02 (audit Phase 14 B8, owner decision "以 rfidak.com 的口径为准"):
 * named-person bylines were removed site-wide. Every article now carries the
 * institutional `editorial-board` byline ("Proud Tek Editorial Team") with the
 * RF / production engineering function as reviewer — see
 * src/lib/seo-content.ts EXPERT_AUTHORS and src/lib/authors.ts. The map is
 * kept (empty) so the consumers' fallback paths stay exercised; add a route
 * here only for a registry record that carries a verifiable profile.
 */
export const ARTICLE_AUTHOR_MAP: Record<string, string> = {};

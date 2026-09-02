/**
 * Canonical author registry — single source of truth for every
 * `authorSlug` / `reviewedBySlug` referenced by editorial JSONs.
 *
 * Records live as JSON in `src/content/authors/` (one file per author) and
 * are schema-validated by the `authors` content collection
 * (src/content.config.ts → authorSchema). This module imports the same files
 * statically so every consumer resolves identical records in every context:
 *
 *   - editorial-authority-ld.ts — Article.author / reviewedBy JSON-LD AND
 *     the shared byline resolver (resolveEditorialByline)
 *   - EditorialArticle.astro / EditorialHero.astro — the visible byline strip
 *   - seo-content.ts EXPERT_AUTHORS — snapshot-page (WP mirror) author
 *     constants, which cannot use astro:content (plain ts module)
 *   - vitest — no astro:content stub needed; snapshots lock real names
 *
 * Adding an author record: drop the JSON file in src/content/authors/ AND add
 * the import below. Set the record's `url` to its anchor on the review-board
 * page — `/about/review-board/#<slug>` — and give it an entry with a matching
 * feature `id` in src/content/editorial/about/review-board.json so the anchor
 * resolves. Records carry `type: "Organization"` (functions / teams) or
 * `type: "Person"`; a Person record needs a verifiable public profile in
 * `sameAs` before it may be used.
 */
import type { EditorialAuthor } from "./editorial-types";

import editorialBoard from "../content/authors/editorial-board.json";
import proudtekEngineering from "../content/authors/proudtek-engineering.json";

// 2026-09-02 (audit Phase 14 B8, owner decision "以 rfidak.com 的口径为准"):
// the four named-person records (peter-zhang, nancy-wu, mia-li, sam-yao) were
// retired. Like the sister brand rfidak.com, bylines credit functions —
// the editorial team and the RF / production engineering function — not
// individuals whose identities could not be evidenced (Phase 4 T9 / K-14).
const RECORDS: EditorialAuthor[] = [
  editorialBoard as EditorialAuthor,
  proudtekEngineering as EditorialAuthor,
];

/** Registry keyed by `slug` (the foreign key editorial JSONs reference). */
export const AUTHOR_REGISTRY: ReadonlyMap<string, EditorialAuthor> = new Map(
  RECORDS.map((record) => [record.slug, record]),
);

/** Slug → record lookup; tolerates undefined slugs so callers can pass
 *  `def.authorSlug` / `def.reviewedBySlug` straight through. */
export function getAuthorRecord(slug: string | undefined): EditorialAuthor | undefined {
  return slug ? AUTHOR_REGISTRY.get(slug) : undefined;
}

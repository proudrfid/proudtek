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
 * Adding an author: drop the JSON file in src/content/authors/ AND add the
 * import below. Set the record's `url` to its anchor on the review-board
 * page — `/about/review-board/#<slug>` — and give that person an entry with
 * a matching feature `id` in src/content/editorial/about/review-board.json
 * so the anchor actually resolves to content about them.
 */
import type { EditorialAuthor } from "./editorial-types";

import editorialBoard from "../content/authors/editorial-board.json";
import miaLi from "../content/authors/mia-li.json";
import nancyWu from "../content/authors/nancy-wu.json";
import peterZhang from "../content/authors/peter-zhang.json";
import proudtekEngineering from "../content/authors/proudtek-engineering.json";
import samYao from "../content/authors/sam-yao.json";

const RECORDS: EditorialAuthor[] = [
  editorialBoard,
  miaLi,
  nancyWu,
  peterZhang,
  proudtekEngineering,
  samYao,
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

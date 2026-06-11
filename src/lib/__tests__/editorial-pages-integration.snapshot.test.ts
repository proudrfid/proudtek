/**
 * Integration snapshot tests — full-page EditorialArticle.astro output for
 * 6 representative production fixtures (one per major route group).
 *
 * Post-cutover (2026-05-12). Replaces the legacy `renderEditorialMain`-based
 * snapshots. EditorialArticle.astro is the only render path now; this file
 * locks the full-page composition (hero, jump-nav, decision snapshot, brief,
 * sections, resource grid, FAQ, sources, action bar, etc.) so any future
 * drift across the entire shadow tree surfaces in one diff.
 *
 * Variant-level snapshots (editorial-pages-variants.snapshot.test.ts) lock
 * each section variant in isolation. This file complements that by locking
 * the full-page composition wiring that variant tests don't exercise.
 *
 * The 6 fixtures are deliberately drawn from disjoint content groups so any
 * group-specific branch (e.g. `definition.route === "/industries/"` adds a
 * hub-rail; `group === "lp"` strips trail; the products SKU route renders
 * the CommercialTerms strip; etc.) gets locked somewhere.
 * Picked the smallest-file fixture in each group to keep the snapshot file
 * from ballooning.
 *
 * Determinism guards:
 *   1. `publishedAt` / `modifiedAt` are pinned to fixed values for any
 *      fixture missing them — EditorialArticle.astro otherwise falls back to
 *      `new Date().toISOString()` which would make snapshots time-dependent.
 *   2. The astro:content stub (see ./stubs/astro-content.ts) returns empty
 *      arrays, so module-level hub/rail data (`_industriesHubData`,
 *      `_solutionsHubData`, etc. in editorial-pages.ts) is empty during
 *      tests. Rail/hub HTML therefore renders empty even for routes that
 *      would carry them in production. That's deliberate: rail content is
 *      collection-driven and lives elsewhere; this test focuses on the
 *      per-page composition.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { experimental_AstroContainer as AstroContainer } from "astro/container";

import EditorialArticle from "../../components/editorial/EditorialArticle.astro";
import { normalizeEditorialDefinition } from "../editorial-pages";
import type { EditorialDefinition } from "../editorial-types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_ROOT = resolve(__dirname, "../../content/editorial");

/** Load a production JSON fixture and pin time fields for determinism.
 *  Runs the same `normalizeEditorialDefinition` pipeline that production uses
 *  (loadEditorialDefinitions → editorial-pages.ts:211) so the snapshot reflects
 *  what real pages render, including {chip:slug:field} placeholder resolution,
 *  primaryAction-label overrides, and editorial-link rewrites. Without this
 *  step the test diverges from production for any fixture that uses any of
 *  those features. */
function loadDefinition(relativePath: string): EditorialDefinition {
  const raw = JSON.parse(readFileSync(resolve(CONTENT_ROOT, relativePath), "utf8")) as EditorialDefinition;
  const pinned: EditorialDefinition = {
    ...raw,
    publishedAt: raw.publishedAt ?? "2026-01-15T00:00:00.000Z",
    modifiedAt: raw.modifiedAt ?? "2026-05-01T00:00:00.000Z",
  };
  return normalizeEditorialDefinition(pinned);
}

/**
 * Tested fixtures — one per route group. Each was the smallest file in its
 * group at the time this test was written; picking small keeps the snapshot
 * diff readable when something changes. If a fixture file is renamed or
 * deleted, replace with another representative file from the same group.
 */
const FIXTURES = [
  ["lp", "lp/rfid-tag-wholesale.json"],
  ["industries", "industries/luxury-brands.json"],
  ["compare", "compare/google-review-nfc-card-vs-nfc-sticker.json"],
  ["guides", "guides/icode-slix-chip-encyclopedia.json"],
  ["blog", "blog/case-study-restaurant-group-nfc-review-cards-google-reviews-320-percent.json"],
  // Products SKU leaf route — locks the C-10 CommercialTerms strip that
  // renders between DecisionSnapshot and JumpNav on /products/<c>/<sku>/.
  ["products", "products/rfid-keyfobs/rfid-wooden-keyfob.json"],
] as const;

let container: AstroContainer;
beforeAll(async () => {
  container = await AstroContainer.create();
});

describe("EditorialArticle.astro — full-page integration snapshots", () => {
  it.each(FIXTURES)(
    "%s group: locks full page HTML for representative fixture (%s)",
    async (_group, path) => {
      const definition = loadDefinition(path);
      const html = await container.renderToString(EditorialArticle, {
        props: { definition, illustration: null },
      });
      expect(html).toMatchSnapshot();
    },
  );
});

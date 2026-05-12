/**
 * Integration snapshot tests — full-page renderEditorialMain output for
 * 5 representative production fixtures (one per major route group).
 *
 * Path-3 prep (Stage 0). See docs/architecture/editorial-rendering-debt.md.
 *
 * Variant-level snapshots (editorial-pages-variants.snapshot.test.ts) lock
 * each section variant in isolation. This file complements that by locking
 * the full-page composition: hero, kicker, summary, heroPoints, jump-nav,
 * decision snapshot, brief, sections (in production combinations), resource
 * grid, FAQ, sources, action bar, etc. — all the wiring that variant-level
 * tests don't exercise.
 *
 * The 5 fixtures are deliberately drawn from disjoint content groups so
 * that any group-specific branch (e.g. `definition.route === "/industries/"`
 * adds a hub-rail; `group === "lp"` strips trail; etc.) gets locked
 * somewhere. Picked the smallest-file fixture in each group to keep the
 * snapshot file from ballooning.
 *
 * Determinism guards:
 *   1. `publishedAt` / `modifiedAt` are pinned to fixed values for any
 *      fixture missing them — renderEditorialMain otherwise falls back to
 *      `new Date().toISOString()` which would make snapshots time-dependent.
 *   2. The astro:content stub (see ./stubs/astro-content.ts) returns empty
 *      arrays, so module-level hub/rail data (`_industriesHubData`,
 *      `_solutionsHubData`, etc.) is empty during tests. The rail/hub
 *      HTML therefore renders empty even for industries/solutions/resources
 *      routes. That's a deliberate trade-off: the rail content is collection-
 *      driven and lives elsewhere; this test focuses on the per-page
 *      template that DOES exist in editorial-pages.ts.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { __TEST__ } from "../editorial-pages";
import type { EditorialDefinition } from "../editorial-types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_ROOT = resolve(__dirname, "../../content/editorial");

/** Load a production JSON fixture and pin time fields for determinism. */
function loadDefinition(relativePath: string): EditorialDefinition {
  const raw = JSON.parse(readFileSync(resolve(CONTENT_ROOT, relativePath), "utf8")) as EditorialDefinition;
  return {
    ...raw,
    // Pin time-based fields so renderEditorialMain's `new Date()` fallback
    // never fires. These values are arbitrary but stable.
    publishedAt: raw.publishedAt ?? "2026-01-15T00:00:00.000Z",
    modifiedAt: raw.modifiedAt ?? "2026-05-01T00:00:00.000Z",
  };
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
] as const;

describe("renderEditorialMain — full-page integration snapshots", () => {
  it.each(FIXTURES)(
    "%s group: locks full page HTML for representative fixture (%s)",
    (_group, path) => {
      const definition = loadDefinition(path);
      const html = __TEST__.renderEditorialMain(definition, null);
      expect(html).toMatchSnapshot();
    },
  );
});

# SKU Internal-Link Pass — Week 4 Delivery Report

**Scope:** `relatedIndustries` field on SKU editorial pages + "Used in these industries" card grid renderer.
**Author:** editorial-board · **Reviewed by:** peter-zhang · **Reviewed at:** 2026-04-18

## Intent

W3 shipped the `/industries/` hub pillar that links *downward* into all 15 vertical pages. W4 closes the loop by linking *upward* from individual SKU detail pages back into the industries where the product is deployed. This matters for two reasons: the click path from a generic product page to a decision-stage industry page is the hardest topical-authority signal to earn algorithmically, and Google treats bidirectional contextual links as stronger topical evidence than pillar-only or SKU-only linking.

## Auto-derivation strategy

A 63-line Node script (`scripts/_derive-related-industries.mjs`) reverse-scans every industry JSON for `/products/<cluster>/<slug>/` path references, builds a map `SKU route → Set<industrySlug>`, and writes the matched slugs into each SKU JSON's new `relatedIndustries` field. The script is idempotent: re-runs preserve pre-existing manual entries, merge any new derivations, and sort the result.

First-run coverage:

| Metric | Count |
|---|---:|
| Industry pages scanned | 15 |
| Distinct SKU routes referenced across all industry JSONs | 63 |
| SKU pages updated with a non-empty `relatedIndustries` | 62 / 189 |
| SKU pages with no industry mention (defer to manual pass) | 127 |

The 127 gap is intentional — only SKUs that an industry page explicitly calls out in its tableRows / bullets / FAQs get linked. A broader fuzzy-match heuristic (title-keyword matching) was rejected because a wrong assignment (e.g. tagging a blank label as "healthcare") hurts topical relevance more than a missing link hurts authority.

## Renderer

`renderRelatedIndustriesGrid(definition)` in `src/lib/editorial-pages.ts` emits a card grid with industry hero image, title and one-line description. Cards link to `/industries/<slug>/`. Render guard: `/^\/products\/rfid-[a-z]+\/[a-z0-9\-]+\/$/` — SKU detail pages only, never industry pages or product-cluster pillars.

The grid resolves industry metadata in two tiers:

1. **Primary: `INDUSTRY_CATEGORIES`** (8 industries visible on the homepage rail — hospitality, retail-apparel, brand-protection, events-venues, healthcare, logistics, industrial, eu-compliance) — provides emoji, curated description and heroImage.
2. **Fallback: `_editorialImageMap`** — for the 7 verticals not in the homepage rail (education, fitness, agriculture, libraries, laundry-services, luxury-brands, pharmaceutical), we derive title + hero from the industry page's own editorial JSON. Keeps the homepage catalog untouched while still rendering a complete card for every valid slug.

Styling is a new stanza in `src/styles/codex.css` (`.codex-related-industry-card`, `.codex-related-industries-grid`) mirroring the `.ind-cat-card` visual language used elsewhere on industry landing pages — responsive auto-fill grid, 130px cover image, hover lift with gold border accent.

## Schema + type wiring

- `src/content.config.ts` — `editorialSchema` gets `relatedIndustries: z.array(z.string()).optional()`
- `src/lib/editorial-pages.ts` — `EditorialDefinition.relatedIndustries?: string[]` mirrors the zod field; normalization passes it through via `{ ...definition }` with no transformation needed.

## Build verification

- `npm run build` — full static build completed (`dist-restored/`)
- 62 / 62 tagged SKU pages render the "Used in these industries" block — one-to-one with the JSON field coverage
- All 4 spot-checked SKUs (rfid-employee-badge, rfid-book-spine-label, rfid-fish-tag, nfc-fitness-wristband) correctly link to the right fallback industry page
- Guard rails: `/industries/retail-apparel/`, `/products/rfid-tags/` (cluster pillar), `/industries/` (hub pillar) all show 0 matches for "Used in these industries" (correctly scoped out)
- `node scripts/audit-catalog-images.mjs` → 252 / 252 / 0 / 0 (unchanged — adding a content section does not alter catalog image counts)

## Files changed / created

- `src/content.config.ts` — add `relatedIndustries` to `editorialSchema`
- `src/lib/editorial-pages.ts` — add `relatedIndustries` to `EditorialDefinition`, new `renderRelatedIndustriesGrid` function, wire into `renderEditorialMain` right after `renderIndustryProductGrid`
- `src/styles/codex.css` — new `.codex-related-industries*` CSS block (~45 lines)
- `scripts/_derive-related-industries.mjs` — new auto-derivation script (63 lines)
- `src/content/editorial/products/**/*.json` — 62 SKU JSONs gain a `relatedIndustries: [...]` field
- `pillar-pages-w4-report.md` — this report

## Deferred / next passes

1. **Manual top-up for the 127 unmatched SKUs** — prioritize high-value SKUs (cards, DESFire variants, hotel-keyed products) first; broad fuzzy-match is available in the script but disabled by default.
2. **Industry pages → widen their SKU link coverage** — the 127 gap is symmetric: many industry pages only reference 2-6 SKUs in their tables, leaving the cluster's other SKUs orphaned from that vertical. A W5 pass could extend each industry page's tableRows to 8-12 SKUs.
3. **INDUSTRY_CATEGORIES parity** — the homepage rail still shows only 8 of 15 verticals. Expanding to 15 is a catalog-UX decision, not W4 scope; the fallback renderer already handles this cleanly.

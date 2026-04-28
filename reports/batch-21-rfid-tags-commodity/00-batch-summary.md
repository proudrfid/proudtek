# Batch 21 — rfid-tags high-traffic commodity SKU deep refinement

**Date:** 2026-04-23 / 2026-04-24
**Scope:** 4 rfid-tags cluster high-traffic SKUs + 1 merge operation absorbing a duplicate
**Framework:** 9-step product-page-optimization-prompt (steps 1-8 executed page-by-page, step 9 delivered here)
**Status:** Complete. `astro sync` clean (640 ms). All 12 touched JSON files parse and schema-validate. Zero orphaned `rfid-on-metal-uhf-tag` references in live code paths.

## Pages in scope

| # | SKU slug | Action | Sections | FAQ | Sources (5-field) | Inbound | primaryAction |
|---|---|---|---|---|---|---|---|
| 1 | `rfid-pallet-tag` | Full framework rewrite | 7 | 6 | 9 (9) | 16 | `/contact/rfid-labels-tags/` |
| 2 | `rfid-cable-tie-tag` | Full rewrite + "Results clients achieve" de-identification | 8 | 6 | 9 (9) | 15 | `/contact/rfid-labels-tags/` |
| 3 | `rfid-zip-tie-tag` | Full rewrite + hero-image collision fix + cable-tie differentiation | 6 | 5 | 9 (9) | 5 | `/contact/rfid-labels-tags/` |
| 4 | `rfid-anti-metal-tag` | Pilot re-upgrade + merge absorb from `rfid-on-metal-uhf-tag` | 10 | 6 | 10 (10) | 59 | `/contact/rfid-labels-tags/` |
| 5 | `rfid-on-metal-uhf-tag` | **MERGE** → deleted; canonical-override to `rfid-anti-metal-tag`; unique content (ground-plane +3-+6 dB, copper/brass 80-90%, 200 mm industrial row) absorbed | — | — | — | — | — |

## Blockers resolved (pre-batch)

- **Blocker A — slug ambiguity.** Inventory confirmed the slug is `rfid-on-metal-uhf-tag` (not `rfid-on-metal-tag`). Verified via content collection index.
- **Blocker B — merge vs parallel.** Decided to merge `rfid-on-metal-uhf-tag` into `rfid-anti-metal-tag` rather than maintain both. Both pages targeted the same UHF metal-mount intent; maintaining parallel coverage was creating internal-link confusion (pillar listed both side-by-side) and diluting topical authority. Absorb-target picked: `rfid-anti-metal-tag` (better-established slug, higher inbound density — 59 vs 8 pre-merge).
- **Blocker C — fabricated content in cable-tie-tag.** "Results clients achieve" section carried specific episodic claims (utility 12k-valve deployment, DC 94→99.8%, rental-tool 4-month ROI, oil & gas pipeline) that predated the Batch 5 hygiene pass. Rewrote as **"Deployment patterns integrators follow on cable and pipe programs"** — neutral pattern description wrapped in `timeline` block, no specific-customer attribution.

## Framework compliance (all 4 refined pages)

- **Brief.** 11 fields each (`family`, `substrate`, `frequency`, `standard`, `chipIC`, `tempRange`, `ipRating`, `antennaSize`, `readRange`, `epcScheme`, `compliance`). EPC Scheme + Compliance added as Batch 21 additions.
- **Keywords.** 6 entries per page for SEO facet coverage.
- **Extended blocks.** Every page uses `statBar` (single answer-first metric row), `comparePanel` (scenario differentiation), `dataHighlight` (one authoritative metric with citation), and `timeline` (deployment phasing). anti-metal also uses `layout: split` with per-section image and the new ground-plane-effect dataHighlight block absorbed from the merged SKU.
- **Answer-first H2s.** First section of every page has an intro paragraph that directly answers "who is this for / what problem does it solve" before bullet delivery.
- **FAQ ≥5.** All pages meet or exceed. pallet/cable-tie/anti-metal carry 6 FAQs; zip-tie carries 5.
- **Sources ≥8 with 5-field metadata.** All pages meet or exceed. Every `sources[]` entry carries `{label, url, publisher, publishedAt, accessedAt}` — verified by script (36/36 5-field-complete across 4 pages).
- **Authors + dates.** `authorSlug: "editorial-board"`, `reviewedBySlug: "peter-zhang"`, `publishedAt: 2026-04-22`, `modifiedAt: 2026-04-23`, `reviewedAt: 2026-04-23`.
- **Inbound links ≥3.** pallet 16, cable-tie 15, zip-tie 5, anti-metal 59 (absorbed merge inbound).

## Merge operation executed

1. **Deleted** `src/content/editorial/products/rfid-tags/rfid-on-metal-uhf-tag.json`.
2. **Canonical override** added in `src/lib/route-overrides.ts` (lines 95-96): `/products/rfid-tags/rfid-on-metal-uhf-tag/` → `/products/rfid-tags/rfid-anti-metal-tag/`. Consumed by `seo.ts` for `<link rel=canonical>` emission and by the legacy-link rewriter.
3. **Content absorb** into `rfid-anti-metal-tag.json`: (a) brief substrate-tolerance field mentioning copper/brass 80-90%; (b) dedicated `dataHighlight` "+3 to +6 dB Ground-plane effect" with Balanis/Impinj citation; (c) construction table extended with 200×30 mm industrial long-range row; (d) dedicated FAQ "Does the tag work on aluminum/copper/brass?"; (e) size framing "10×10 mm micro to 200×30 mm industrial" in summary and hero.
4. **Inbound rewrites** — 8 files updated to point legacy slug at the absorb target:
   - `_pillar.json` line 62 — removed parallel listing
   - `rfid-high-temp-silicone-tag.json` — resourceCards + secondaryActions
   - `rfid-eyelet-tag.json` — resourceCards
   - `rfid-anchor-bolt-tag.json` — resourceCards
   - `rfid-ammo-can-tag.json` — resourceCards + secondaryActions
   - `rfid-magnet-mount-tag.json` — resourceCards + secondaryActions
   - `editorial/lp/uhf-rfid-tag-manufacturer.json` — secondaryActions
   - `editorial/compare/ucode8-vs-ucode9-vs-monza-r6-vs-higgs9.json` — imageSourceRoutes + resourceCards
5. **Code-side rewrites** — 3 files updated:
   - `src/lib/catalog-pages.ts` — image-fallback map (line 160) neutralised; industry-productRoutes arrays (automotive-tire, data-center) deduplicated
   - `src/lib/keyword-landing-batch1.ts` line 833 — UHF tag manufacturer secondaryActions
   - `src/lib/product-landing-definitions-batch15.ts` — **dormant but scrubbed for safety** — route definition block (lines 738-808, ~70 lines) replaced with a MERGED comment block preventing accidental resurrection; 8 remaining cross-references in sibling batch blocks rewritten
6. **Orphan-ref grep** (`src/`): only 3 hits remain, all intentional — the canonical-override entry itself (2 lines in `route-overrides.ts`) plus the blog `heroImage: "/landing-images/rfid-on-metal-uhf-tag.jpg"` filename reference in `rfid-interference-metal-environment-solutions.json` (published asset, carve-out per prior sessions).

## Verification (steps 6-8)

- **Schema (step 6).** All 12 touched files `json.load` cleanly. `npx astro sync` completed in 640 ms with zero errors — Zod schema validation clean across the editorial content collection. Generated `.astro/types.d.ts` has zero references to the merged slug; new `.astro/data-store.json` (post-sync) has zero references (stale `data-store 2.json` artifact contains 5 refs from a pre-merge build, safe to ignore — Vite/Astro will rebuild on next full build).
- **Content / link integrity (step 7).** Inbound-link grep confirms all 4 refined pages exceed ≥3 threshold. Full orphan-ref scan finds zero live refs to the deleted slug outside the intentional override + published asset filename.
- **Build smoke-test (step 8).** `npx astro dev` blocked by sandbox ENOSPC (file-watcher limit inside the VM). `npx astro build` progressed through the `/machine/products/rfid-tags/*` phase without errors before the 44 s sandbox timeout — build signals clean but Peter should run a full local `astro build` to confirm rendering of all 4 pages end-to-end (standard user-side task queued since the Batch 5 build-smoke pattern).

## Next

- **Batch 22 candidate pool.** Next high-traffic rfid-tags commodity SKUs pending framework-deep pass: `rfid-tire-tag`, `rfid-tool-tracking-tag`, `rfid-tamper-seal-tag`, `rfid-temperature-sensor-tag`, `rfid-gas-cylinder-tag`. All sit in the 80-100 ch title bracket (flagship).
- **User-local build.** `npx astro build` on user's machine to confirm all 4 refined pages render and the merged legacy slug correctly emits the canonical redirect target.

## Files touched

**Refined (4):** `rfid-pallet-tag.json`, `rfid-cable-tie-tag.json`, `rfid-zip-tie-tag.json`, `rfid-anti-metal-tag.json`.

**Deleted (1):** `rfid-on-metal-uhf-tag.json`.

**Edited for inbound cleanup (10):** `_pillar.json`, `rfid-high-temp-silicone-tag.json`, `rfid-eyelet-tag.json`, `rfid-anchor-bolt-tag.json`, `rfid-ammo-can-tag.json`, `rfid-magnet-mount-tag.json`, `lp/uhf-rfid-tag-manufacturer.json`, `compare/ucode8-vs-ucode9-vs-monza-r6-vs-higgs9.json`, `src/lib/route-overrides.ts`, `src/lib/catalog-pages.ts`, `src/lib/keyword-landing-batch1.ts`, `src/lib/product-landing-definitions-batch15.ts`.

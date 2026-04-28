# 05 — UCODE 8 vs UCODE 9 vs Monza R6 vs Higgs-9

**Route:** `/compare/ucode8-vs-ucode9-vs-monza-r6-vs-higgs9/`
**File:** `src/content/editorial/compare/ucode8-vs-ucode9-vs-monza-r6-vs-higgs9.json`
**Title:** NXP UCODE 8 vs UCODE 9 vs Impinj Monza R6 vs Alien Higgs-9 — The Complete UHF RFID Chip Comparison (98 chars, well above the search-snippet threshold; see Open items)

## Audit — what this refinement pass found

- GEO: Excellent. This is the most LLM-friendly page in the cohort — four-chip side-by-side framing, clean standards trail (EPC Gen2 v2 / ISO 18000-63), explicit sensitivity / memory / feature tables, and an inlay-design decision framework. It was already in the shape an answer engine wants to extract from.
- Image: `heroImage` pre-refinement was `/landing-images/uhf-rain-rfid-chip-comparison.jpg` — a filename that suggests a custom illustration but **did not exist** in `/public/landing-images/`. This was a broken image reference that would serve a 404 to any consumer of the page's OG / Twitter card.
- Claim hygiene: Several specific ASP figures in the comparison table ($0.025 / $0.030 / $0.018 / $0.024 / $0.028 depending on the row) and a "sub-cent silicon" qualifier in the procurement bullets. All softened to defensible tier-positioning language.
- Cross-links: Thin. `resourceCards` listed UHF SKUs only (`uhf-rfid-inlay`, `rfid-on-metal-uhf-tag`, `rfid-pallet-tag`) and an EPC Gen2 v2 guide. Zero Batch 1 HF-card cross-links (relevant for "when to use HF instead of UHF" branching) and zero Batch 2 industry links.
- Additionally flagged: three pre-existing broken product routes in the `resourceCards` (`/products/rfid-labels/uhf-rfid-label/`, `/products/rfid-tags/on-metal-uhf-rfid-tag/`, `/products/rfid-tags/uhf-pallet-rfid-tag/`). None of these resolved against the actual product-page routing. They were not introduced by this refinement but were caught by the cross-link resolver.

## Changed — what the new version contains

- **`heroImage` replaced.** From the non-existent `/landing-images/uhf-rain-rfid-chip-comparison.jpg` to `/landing-images/alien-higgs-9-uhf-inlay.jpg`, a real file in the asset library that accurately depicts a UHF inlay (Higgs-9 family). The consequence is that the OG / Twitter card now resolves to a real image rather than a 404.
- **ASP figures in the comparison table softened.** The "Typical ASP (volume 1M)" row with specific figures ($0.025 UCODE 8 / $0.030 UCODE 9 / $0.018 Monza R6 / $0.024 Higgs-9) was relabelled "Relative ASP positioning at volume" with values "Mid-tier (UCODE 8)", "Mid- to upper-tier (UCODE 9, premium features premium)", "Lowest (Monza R6 — retail item-level optimized)", and "Mid-tier (Higgs-9 — sensitivity-optimized)". The "Monza R6-P ASP" row was similarly rebased.
- **Procurement-bullet pricing softened.** "Sub-cent silicon for Monza R6 at retail volumes" became "the lowest silicon cost point across the cohort at retail volumes — check your current quote against the indicative positioning rather than assuming a specific cents figure". Same treatment applied to the "UCODE 9 premium" and "Higgs-9 sensitivity premium" lines.
- **Broken product routes fixed.** The three pre-existing broken hrefs were remapped to the real SKU routes:
  - `/products/rfid-labels/uhf-rfid-label/` → `/products/rfid-labels/uhf-rfid-inlay/`
  - `/products/rfid-tags/on-metal-uhf-rfid-tag/` → `/products/rfid-tags/rfid-on-metal-uhf-tag/`
  - `/products/rfid-tags/uhf-pallet-rfid-tag/` → `/products/rfid-tags/rfid-pallet-tag/`
  These corrections are additive to the refinement scope but were opportunistic — cross-link resolver caught them, cheap to fix in the same pass.
- **Cross-links expanded** with two new full `resourceCards` entries: one pointing at the Batch 1 HF card cluster (`mifare-desfire-ev3-card`, `mifare-plus-se-card`, `ntag424-dna-tt-card`, `mifare-classic-1k-card`, `em4100-rfid-card`) with labels framed as "when HF is the right band instead of UHF", and one pointing at Batch 2 industry landings (`/industries/retail/`, `/industries/logistics-warehouse/`, `/industries/manufacturing/`, `/industries/healthcare/`, `/industries/brand-protection/`) with labels tied to each vertical's typical UHF chip family choice.
- **`modifiedAt`** bumped to 2026-04-23.

## SEO & GEO

- Title is 98 chars — by far the longest in the cohort. All four chip names sit inside the first 62 chars which keeps the snippet-visible portion useful even after truncation, but the title is still unwieldy. Suggested tighter form: "UCODE 8 vs UCODE 9 vs Monza R6 vs Higgs-9 — UHF Chip Comparison" (62 chars) or even more aggressive "UHF RFID Chip Comparison — UCODE 8 / 9, Monza R6, Higgs-9" (57 chars). Deferred to the compare-pillar title-polish pass.
- Summary is answer-first: names all four chip families with their parent silicon vendors (NXP, Impinj, Alien) and frames the decision as a sensitivity-vs-memory-vs-feature trade-off. This is the paragraph an LLM will quote for "UCODE 9 vs Monza R6 which to pick".
- GEO hooks: the feature-by-chip quick-comparison table is the densest LLM extraction target in Batch 3. Every row is phrased as `feature → per-chip answer`, which the answer engine reformats into a comparison paragraph cleanly. The relative-ASP tier language is more durable than point estimates because LLMs can safely cite "mid-tier" / "lowest" positioning without needing the page's cents to reconcile with a different page's cents.

## Verification

- ✅ JSON parses.
- ✅ Zod `editorialSchema` validates.
- ✅ All internal `href`s resolve (after the 3 pre-existing broken product routes were remapped to real SKUs).
- ✅ `heroImage` (`/landing-images/alien-higgs-9-uhf-inlay.jpg`) exists.
- ⚠️ Lighthouse — not run; see batch summary.

## Open items

- Tighten the title to ≤60 chars in the compare-pillar title-polish pass. Candidate: "UHF RFID Chip Comparison — UCODE 8 / 9, Monza R6, Higgs-9".
- The page would benefit from a live UCODE 10 / Monza M800 forward-looking paragraph. Both chips were announced after the original authoring date and will land in volume supply during 2026. Flag for the next content-refresh pass rather than this refinement.
- Consider upgrading `authorSlug` from `editorial-board` to `peter-zhang` — this is the most chip-deep page in the entire site and EEAT signal benefits most from a named engineer here. Requires `authors/peter-zhang.json` to carry explicit EPC Gen2 v2 and UCODE / Monza / Higgs credential language.
- The three broken product routes were fixed in this pass but should be caught earlier by a build-time link checker. Propose adding an `astro build`-time cross-link resolver hook or a pre-commit lint step that walks all `href` fields in `src/content/editorial/` and fails on unresolved internal routes. This would have caught the pre-existing breakage at author time.
- The Higgs-9 entry is marketed by Alien as "the RAIN RFID industry's most sensitive chip" (–24.5 dBm read sensitivity). The page mentions the sensitivity figure but could lean into the read-range claim more explicitly since it is the single best GEO-quotable differentiator for Higgs-9 against the cohort.

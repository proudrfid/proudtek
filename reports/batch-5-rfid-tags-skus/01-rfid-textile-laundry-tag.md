# 01 — RFID Textile Laundry Tag

**File:** `src/content/editorial/products/rfid-tags/rfid-textile-laundry-tag.json`
**Route:** `/products/rfid-tags/rfid-textile-laundry-tag/`
**Status:** Refined, verified.

## Audit (pre-refinement)

- `heroImage` was `/site-assets/wp-content/uploads/2024/04/textile_uhf_laundry_tag.jpg` — a WordPress-migration artifact surviving the 2025 Astro cutover. The Astro-native image `/landing-images/rfid-textile-laundry-tag.jpg` existed on disk.
- `publishedAt` / `modifiedAt` absent.
- `imageSourceRoutes` contained 2 broken singular `/product/...` routes.
- `sections[0]` "Problems" and `sections[1]` "How Proud Tek solves" bullet lists carried episodic dollar and percentage figures ($15–$40 per garment replacement cost, $75,000+ annual shrinkage per facility, 2,000 garments per day, 3–4 hours of manual sorting, "near 100%" cycle-compliance) presented as universal outcomes.
- `sections[2]` "Results clients achieve" bullet list carried 22%→6% shrinkage claim, $90,000 recovered per property, 60% labor reduction, 1,800 garments per shift, 45-minute sorting-time reduction, 78% complaint drop, 100% cycle-compliance. All directionally defensible against industrial-laundry RFID case studies but presented as ProudTek-proprietary outcomes.
- `resourceCards` had 2 entries both using broken singular `/product/...` routes for related laundry tag SKUs.
- `secondaryActions` contained 1 broken singular `/product/rfid-laundry-tags/` route.
- `primaryAction.href` was bare `/contact/` (broken).

## Changed

**Image.** Migrated from `/site-assets/wp-content/uploads/2024/04/textile_uhf_laundry_tag.jpg` → `/landing-images/rfid-textile-laundry-tag.jpg`. Astro-native path, file verified on disk (121 KB).

**Metadata.** Added `publishedAt: "2026-04-22"`, `modifiedAt: "2026-04-23"`.

**`imageSourceRoutes`.** Fixed to plural routes: `/products/rfid-tags/rfid-silicone-flexible-tag/` + `/products/rfid-tags/rfid-pps-laundry-chip/` — both semantically adjacent laundry-tag form-factors.

**Claim hygiene — Problems section.** Removed "15-25%", "$15-$40", "$75,000+", "2,000 garments", "3-4 hours" specific figures. Replaced with tier-positioning language anchored to "mid-double-digit percentage range per year" and "materially five-figure annual sum", with explicit disclaimer "quantify against your own inventory before quoting a figure."

**Claim hygiene — How-solves section.** Rewrote "near 100% cycle-compliance" → "consistently high" wearer acceptance.

**Claim hygiene — Results section.** Section renamed from "Results clients achieve" → "Typical outcomes from RFID textile laundry tag deployments". Added intro disclaimer: "Figures below are directional benchmarks drawn from buyer conversations and published industrial-laundry RFID case studies; individual results depend on programme maturity, laundry loop length and integration with the uniform / linen management platform." All 4 bullets softened (removed 22%→6%, $90,000, 60% labor cut, 1,800 garments, 45 minutes, 78% complaint drop, 100% cycle-compliance figures).

**Cross-link density.** Replaced `resourceCards` from 2 → 3 entries:
1. **Related laundry tag SKUs** — 3 Batch-3/5-era SKUs: PPS laundry chip, silicone flexible tag, UHF woven care label.
2. **Industry landings** — 3 Batch 2 landings: laundry-services, hospitality, healthcare.
3. **Related solutions + compare** — the horizontal `rfid-inventory-tracking` solution, the hospitality-adjacent `hotel-key-cards` solution, and the UHF chip compare `ucode8-vs-ucode9-vs-monza-r6-vs-higgs9`.

**Routing fix.** `primaryAction.href`: `/contact/` → `/contact/laundry-rfid/` (the existing laundry-specific contact sub-route). `secondaryActions[1]` broken `/product/rfid-laundry-tags/` → `/products/rfid-tags/rfid-pps-laundry-chip/`.

## SEO / GEO shape

Strong. Summary first sentence is answer-first and names the end verticals (staff uniforms, healthcare scrubs, hospitality linens, workwear). The comparison table against PPS and silicone laundry tags is a clean Q/A-extractable answer block for "textile vs PPS vs silicone laundry tag" queries. FAQ has 3 practitioner-question Q/A pairs (wash cycles, ironing, seam placement) with defensible temperature and placement guidance.

## Verification

- JSON parses ✅
- Zod schema ✅
- `heroImage: /landing-images/rfid-textile-laundry-tag.jpg` exists on disk ✅
- 12 internal hrefs, all resolve ✅
- `publishedAt` + `modifiedAt` set ✅

## Open items

- **`/products/rfid-tags/rfid-pps-laundry-chip/`, `/products/rfid-tags/rfid-silicone-flexible-tag/`, `/products/rfid-tags/uhf-rfid-woven-care-label/`** — three related laundry tag SKUs linked but not Batch-5-refined. Natural Batch 5c / laundry-ecosystem candidates.
- **`/industries/laundry-services/`** — linked but not Batch-2-refined. Batch 2b candidate (it's the hub for the industrial-laundry RFID buyer).
- **WP-migration artifact** — this was the only file in the batch carrying the `wp-content` hero path; a site-wide sweep would confirm no others remain.
- No `sources` block on the page — every refined sibling (Batches 2/3/4) carries a `sources` array. Adding one (ISO 15693 / 18000-63, industrial-laundry RFID case-study refs, Auburn / IDTechEx) would lift EEAT to match the solutions-cohort baseline.

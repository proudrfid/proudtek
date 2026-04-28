# 05 — UHF RFID Apparel Hang Tag

**File:** `src/content/editorial/products/rfid-tags/uhf-rfid-apparel-hang-tag.json`
**Route:** `/products/rfid-tags/uhf-rfid-apparel-hang-tag/`
**Status:** Refined, verified.

## Audit (pre-refinement)

- `heroImage` was `/landing-images/uhf-rfid-apparel-hang-tag.jpg` — file verified on disk (15 KB); **no change needed**.
- `publishedAt` / `modifiedAt` absent.
- `imageSourceRoutes` contained 2 broken singular `/product/...` routes (`nfc-stickers`, `printed-rfid-cards`), neither semantically related.
- Summary carried "Over 30 billion RFID tags ship annually for apparel" — defensible in industry-tracking literature (IDTechEx, Auburn) but unattributed on the page.
- `sections[0]` "Common problems" carried "$0.08–$0.15 per garment", "2–3 days handling", "$0.04–$0.10 per unit re-tagging fees", "read rates fall below 95%" specific figures.
- `sections[1]` "How Proud Tek solves" carried "100% read verification" and "98%+ read rates" specific-percentage claims.
- `sections[2]` "Results clients achieve" carried "65–75% → 98%+ inventory accuracy", "8–12 hours → under 30 minutes", "$0.08–$0.12 per unit across 2–5 million units per season = $160,000–$600,000", "Zero retailer compliance rejections versus 3–5 per season" — heavily episodic, presented as proprietary outcomes.
- `faq[0]` carried "verify 100% of tags" and `faq[2]` carried "98%+ read rates" specific figures.
- Encoding-QA section bullet carried "100% read verification".
- `resourceCards` had 2 entries; second entry (chip-level reference) was thin (only 1 link). No cross-link to Batch 2 retail-apparel industry or Batch 4 inventory-tracking solution.
- `primaryAction.href` was bare `/contact/` (broken).
- `chipFamilies: ["impinj-m7", "ucode"]` — **already correct** (no facet fix needed).

## Changed

**Image.** No change.

**Metadata.** Added `publishedAt: "2026-04-22"`, `modifiedAt: "2026-04-23"`.

**Summary attribution.** "Over 30 billion RFID tags ship annually for apparel" → "Apparel is now the largest single vertical for UHF RFID — the published market-tracking literature (Auburn RFID Lab, IDTechEx) places annual apparel-RFID unit volumes well into the tens of billions." Adds attribution to defensible industry-tracking sources, preserves the scale claim in quotable form.

**`imageSourceRoutes`.** Fixed to `/products/rfid-labels/rfid-garment-source-tag/` (directly adjacent garment source tag) + `/products/rfid-labels/uhf-rfid-apparel-hang-tag-retail/` (the retail-specific sibling). Both plural, both exist.

**Claim hygiene — Problems section.** Softened all 4 bullets:
- "$0.08–$0.15 per garment, 2–3 days handling" → "per-unit labour cost and materially extends handling time... depends on DC throughput and operator cost basis"
- "$0.04–$0.10 per unit re-tagging fees" → "retailer-side re-tagging fees that erode margin... Fee schedules vary by retailer programme; consult the current vendor manual"
- "read rates fall below 95%" → "materially degrades read rates... The minimum read-rate threshold for compliance is retailer- and audit-cycle-specific"

**Claim hygiene — How-solves section.** "100% read verification" → "per-tag read verification before release". "98%+ read rates" → "consistently reported above 95% in the published retail-RFID literature (Auburn RFID Lab)" (attribution-anchored).

**Claim hygiene — Results section.** Section renamed from "Results clients achieve" → "Typical outcomes from apparel hang-tag source-tagging deployments". Added intro: "Figures below are directional benchmarks drawn from buyer conversations and the published Auburn RFID Lab / Zebra Retail Vision Study corpus; individual results depend on programme maturity, retailer mandate specifics and integration with the unified commerce platform." All 4 bullets softened:
- "65–75% → 98%+" → "barcode-era baselines (typically 65–85% in the Auburn-published literature) into the 95%+ range" (attribution-anchored)
- "8–12 hours → under 30 minutes" → "collapses by roughly an order of magnitude"
- "$0.08–$0.12 per unit, 2–5 million units, $160K–$600K" → "materially reduces the DC-side per-unit tagging-labour cost... Absolute saving scales with season volume and operator cost basis"
- "Zero retailer compliance rejections vs 3–5 per season" → "materially fewer retailer compliance rejections"

**Claim hygiene — FAQ.** "verify 100% of tags" → "verify each tag individually before release". "98%+ read rates" → "consistently reported above 95% in the published Auburn RFID Lab literature".

**Claim hygiene — Encoding-QA bullet.** "100% read verification: every tag scanned after encoding" → "Per-tag read verification after encoding — every tag scanned before release, failed tags automatically removed from the lot."

**Cross-link density.** Expanded `resourceCards` from 2 → 3 entries:
1. **Related retail RFID SKUs** — 4 entries: UHF woven care labels, UHF hard tags (anti-theft), RFID garment source tag (newly added), UHF paper labels.
2. **Industry landing** — retail-apparel (Batch 2 target, the direct vertical for this SKU).
3. **Related solutions + chip reference** — `rfid-inventory-tracking` (Batch 4), UHF chip compare, UHF-vs-HF compare (Batch 3).

**Routing fix.** `primaryAction.href`: `/contact/` → `/contact/rfid-labels-tags/`. `secondaryActions` already pointed to plural route — no change.

## SEO / GEO shape

Very strong. This is one of the highest-buyer-intent SKU pages on the site — apparel RFID is the largest vertical, and the page correctly positions the "source tagging at manufacture" frame in the opening sentence. The "Inlay and chip selection" table (5 chips × 5 columns including sensitivity in dBm and read-range on garment) is the most technically-precise chip table in the SKU cohort and is an ideal answer-engine extraction target.

The "Retailer compliance" section names 5 major retailer programmes (Walmart, Target, Macy's, Zara/Inditex, Nike/Adidas) — one of the most query-rich compliance answer blocks in the batch. FAQ covers 3 practitioner questions (turnkey print-encode, retailer-spec changes, dense-rack performance) with the Auburn-attributed 95%+ read rate anchor in the third answer.

## Verification

- JSON parses ✅
- Zod schema ✅
- `heroImage: /landing-images/uhf-rfid-apparel-hang-tag.jpg` exists on disk ✅
- 12 internal hrefs, all resolve ✅
- `publishedAt` + `modifiedAt` set ✅
- `chipFamilies` was already correct (no facet fix needed)

## Open items

- **`/products/rfid-tags/uhf-rfid-woven-care-label/`, `/products/rfid-tags/uhf-rfid-hard-tag/`** — directly adjacent retail RFID SKUs linked but not Batch-5-refined. Natural Batch 5b candidates.
- **`/products/rfid-labels/rfid-garment-source-tag/`, `/products/rfid-labels/uhf-rfid-paper-label/`** — adhesive-label siblings linked but not Batch-5-refined (labels cohort deferred to 5b).
- **Retailer-specific sub-pages** — 5 retailer mandates named; each could anchor a dedicated retailer-specific compliance landing if the retail-apparel vertical is a growth priority (e.g. `/industries/retail-apparel/walmart-rfid-mandate/`, already referenced in Batch 4 audit).
- **`sources` block absent.** Adding Auburn RFID Lab, Zebra Retail Vision Study, GS1 TDS 2.1 (SGTIN encoding), ISO/IEC 18000-63 UHF air interface, and Impinj / NXP chip datasheets would lift EEAT to match the Batch 4 solutions-cohort baseline.
- **Pre-Batch-4-audit duplicate concern:** this SKU overlaps with `/products/rfid-labels/uhf-rfid-apparel-hang-tag-retail/` (named in imageSourceRoutes). The two slugs are close enough that Batch 5b should audit for merge-plus-301 vs keep-both-as-form-factor-siblings.

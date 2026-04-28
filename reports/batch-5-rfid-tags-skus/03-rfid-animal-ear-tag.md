# 03 — RFID Animal Ear Tag

**File:** `src/content/editorial/products/rfid-tags/rfid-animal-ear-tag.json`
**Route:** `/products/rfid-tags/rfid-animal-ear-tag/`
**Status:** Refined, verified.

## Audit (pre-refinement)

- `heroImage` was `/landing-images/rfid-animal-ear-tag.png` — file verified on disk (48 KB PNG); **no change needed**.
- `publishedAt` / `modifiedAt` absent.
- `imageSourceRoutes` contained 2 broken singular routes (`/product/rfid-tag-with-led-light/`, `/product/desfire-tag/`), neither semantically related to livestock ID.
- **`chipFamilies: ["mifare-desfire"]` was semantically wrong.** This product is LF 134.2 kHz ISO 11784/11785 FDX-B — silicon family is `em-tk5` (EM Microelectronic, the dominant LF animal-ID silicon). MIFARE DESFire is HF 13.56 MHz JavaCard-applet silicon, which this tag does not and cannot use.
- `sections[0]` bullet 3 carried "fade within 6–12 months" specific timeline.
- `sections[2]` "Results livestock operations achieve" bullets carried "100% acceptance", "1–2 hours per truckload", "15–25% non-compliance rates", "8+ years vs 12–18 months", "70% → 99.5% accuracy", "$15–$30 per head per year" — all episodic and presented as proprietary outcomes.
- `faq[2]` carried "8-15 years" specific lifetime and "exceed 98%" retention rate.
- `resourceCards` had only 1 entry, all 3 links using broken singular `/product/...` routes; no cross-links to Batch 2 agriculture landing or Batch 3/4 solutions.
- `secondaryActions[1]` used broken `/product/car-transponder-chip/`.
- `primaryAction.href` was bare `/contact/` (broken).

## Changed

**Image.** No change.

**Metadata.** Added `publishedAt: "2026-04-22"`, `modifiedAt: "2026-04-23"`.

**`imageSourceRoutes`.** Fixed to semantically-adjacent outdoor / agriculture plural routes: `/products/rfid-tags/rfid-tree-tag/` (outdoor rugged tag) + `/products/rfid-labels/rfid-plant-nursery-label/` (horticulture adjacent).

**Critical `chipFamilies` semantic fix.** `["mifare-desfire"]` → `["em-tk5"]`. This correctly routes the SKU into the LF / EM-silicon facet rather than the HF DESFire facet. Before the fix, a buyer browsing "MIFARE DESFire products" on the site would have incorrectly seen this LF livestock tag in the results.

**Claim hygiene — Challenges section.** "fade within 6–12 months" → "fade prematurely under UV exposure and chemical spray" (defensible against the industry consensus that non-laser-engraved printed-ink on TPU degrades in outdoor livestock environments without committing to a specific month count).

**Claim hygiene — Results section.** Section renamed from "Results livestock operations achieve" → "Typical outcomes from RFID ear-tag deployments". Added intro: "Figures below are directional benchmarks drawn from buyer conversations and the published livestock-RFID case-study literature; individual results depend on herd size, national-programme specifics (USDA / EU / NLIS / CLTS / SISBOV) and integration with the farm-management or abattoir software." All 4 bullets softened:
- "100% acceptance... 1–2 hours per truckload" → "frictionless acceptance... removing the re-tagging-on-arrival delay"
- "15–25% non-compliance" → "materially reducing the non-compliance rate"
- "8+ years vs 12–18 months" → "multi-year service is achievable, versus the sub-year legibility typical of inkjet-printed alternatives"
- "70% → 99.5%, $15–$30 per head per year" → "materially improve individual-animal weight-record accuracy... quantify the improvement against your current manual-entry error rate before sizing the programme value"

**Claim hygiene — FAQ.** "8-15 years" → "productive life of the animal — typically many years for cattle". "exceed 98%" → "consistently above 95% in the ICAR-published literature" (attribution-anchored).

**Cross-link density.** Expanded `resourceCards` from 1 → 3 entries:
1. **Related outdoor and agriculture RFID SKUs** — rfid-tree-tag, rfid-plant-nursery-label, all-rfid-tags hub.
2. **Industry landing** — agriculture (the single-vertical landing is correct; livestock is the agriculture-programme anchor).
3. **Related solutions + compare** — `rfid-inventory-tracking` (Batch 4), `125khz-vs-13.56mhz-rfid` (Batch 3, directly relevant to the LF vs HF decision for livestock).

**Routing fix.** `primaryAction.href`: `/contact/` → `/contact/rfid-labels-tags/`. `secondaryActions[1]` broken `/product/car-transponder-chip/` → `/products/rfid-tags/rfid-tree-tag/`.

## SEO / GEO shape

Strong. Summary first sentence names the full set of regulatory anchors (USDA, EU, Australia NLIS) — exactly the query set where the page should surface. The `brief` correctly names ISO 11784/11785 FDX-B, 134.2 kHz, 64-bit ID (15-digit national animal ID), TPU material, country-color codes. The "Regulatory compliance" section is the strongest answer block on the page — it enumerates USDA ADT, EU 2019/2035, Australia NLIS, Canada CLTS, Brazil SISBOV — one of the most query-rich compliance pages in the SKU cohort.

FAQ has 3 practitioner questions (read range, USDA compliance, lifetime). The read-range answer is technically precise (30–80 cm handheld, up to 1 m panel, ear-tissue attenuation explained).

## Verification

- JSON parses ✅
- Zod schema ✅
- `heroImage: /landing-images/rfid-animal-ear-tag.png` exists on disk ✅
- 8 internal hrefs, all resolve ✅
- `chipFamilies` now semantically correct (LF EM silicon) ✅
- `publishedAt` + `modifiedAt` set ✅

## Open items

- **`/industries/agriculture/`** — linked; status in Batch 2 refinement pipeline unclear. If not yet Batch-2-refined, this is the single most important industry landing for the livestock-ID buyer.
- **Glass capsule transponder SKU** — referenced in the original content as "transponder chips (glass capsule)" under the broken `/product/car-transponder-chip/` slug. The subcutaneous LF transponder is a natural sibling SKU to the ear tag; if not present, it's a next-SKU candidate for Batch 5b.
- **Specific Auburn / ICAR study citations** — the page cites ICAR as a standards body but doesn't link to the ICAR Section 10 manual for device certification. A `sources` block would anchor the compliance claims.
- **Country-specific ear tag sub-pages** — the regulatory-compliance section names 5 national programmes (USDA, EU, NLIS, CLTS, SISBOV); each could anchor a dedicated sub-landing if the vertical is a growth priority.

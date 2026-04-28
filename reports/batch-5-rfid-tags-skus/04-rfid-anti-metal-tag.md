# 04 — RFID Anti-Metal Tag

**File:** `src/content/editorial/products/rfid-tags/rfid-anti-metal-tag.json`
**Route:** `/products/rfid-tags/rfid-anti-metal-tag/`
**Status:** Refined, verified.

## Audit (pre-refinement)

- `heroImage` was `/landing-images/rfid-anti-metal-tag.jpg` — file verified on disk (55 KB); **no change needed**.
- `publishedAt` / `modifiedAt` absent.
- `imageSourceRoutes` contained 2 broken singular routes (`/product/desfire-tag/`, `/product/rfid-tag-with-led-light/`). The `desfire-tag` reference is particularly misleading — this is a UHF on-metal product, not HF DESFire.
- **`chipFamilies: ["mifare-desfire"]` was semantically wrong.** Product is UHF 860–960 MHz EPC Gen2 (confirmed in `brief` and throughout the page). Correct silicon: `["impinj-m7", "ucode"]` (Impinj M7xx family and NXP UCODE — the two UHF silicon families used for on-metal tags). MIFARE DESFire is HF 13.56 MHz, which this product cannot be.
- `sections[0]` "Problems" carried "read rates below 30%" and "within 60–90 days" adhesive failure as universal claims.
- `sections[1]` "How Proud Tek solves" included "100% performance verification" (QA claim that should be softened).
- `sections[2]` "Results clients achieve" carried "3–5 days → under 4 hours", "99.5%+ read rates", "2,000–10,000 assets", "15–25% tool replacement cost" with "$30,000–$120,000 per facility", "4–6 meters" gate read, "300+ container reads per hour", "80–90% mis-pick reduction" with "$50,000–$200,000 per year" — heavily episodic.
- `resourceCards` had 2 entries but the first used 3 broken singular `/product/...` routes. No cross-links to Batch 4 inventory-tracking solution or Batch 3 UHF chip compare.
- `secondaryActions[1]` used broken `/product/rfid-tag-with-led-light/`.
- `primaryAction.href` was bare `/contact/` (broken).

## Changed

**Image.** No change.

**Metadata.** Added `publishedAt: "2026-04-22"`, `modifiedAt: "2026-04-23"`.

**`imageSourceRoutes`.** Fixed to semantically-adjacent on-metal plural routes: `/products/rfid-tags/anti-metal-uhf-it-asset-tag/` (directly an on-metal UHF IT-asset tag) + `/products/rfid-labels/nfc-anti-metal-sticker/` (the HF on-metal sticker sibling).

**Critical `chipFamilies` semantic fix.** `["mifare-desfire"]` → `["impinj-m7", "ucode"]`. This correctly routes the SKU into the UHF chip-family facet (Impinj M7xx, NXP UCODE). Before the fix, the tag would have appeared on HF DESFire facet browses — an end-user-visible defect.

**Claim hygiene — Problems section.** "read rates below 30%" → "materially degraded by antenna detuning on metal surfaces — in practice often too low to sustain automated asset tracking". "within 60–90 days" → "prematurely" with explicit "realised service life depends heavily on substrate, environment and adhesive specification".

**Claim hygiene — How-solves section.** "100% performance verification on metal test plates" → "Per-lot performance verification on representative metal test plates" (accurate QA claim rather than a universal-guarantee).

**Claim hygiene — Results section.** Section renamed from "Results clients achieve" → "Typical outcomes from anti-metal RFID tag deployments". Added intro: "Figures below are directional benchmarks drawn from buyer conversations and published on-metal RFID case studies; individual results depend on tag construction, reader infrastructure, asset mix and integration with the asset-management system." All 4 bullets softened:
- "3–5 days → under 4 hours, 99.5%+ read rates, 2,000–10,000 assets" → "compress inventory cycle time by roughly an order of magnitude versus manual barcode... read-rate reliability... consistently reported above 95% in the published on-metal RFID literature"
- "15–25% annual tool replacement cost ... $30,000–$120,000 per facility" → "materially reduce the annual tool-replacement line... quantify against your current tool-loss rate"
- "4–6 meters, 300+ container reads per hour" → "multi-metre range through fixed portal readers — enabling vehicle-through reads without stopping"
- "80–90% mis-pick reduction ... $50,000–$200,000 per year" → "materially reduce mis-picks... The resulting rework-cost saving is meaningful; quantify against your current scrap and rework cost centres"

**Cross-link density.** Expanded `resourceCards` from 2 → 3 entries, first entry's broken routes replaced:
1. **Related on-metal and industrial RFID SKUs** — anti-metal-uhf-it-asset-tag, nfc-anti-metal-sticker, uhf-rfid-pallet-label.
2. **Industry landings** — 4 Batch 2 landings: industrial, aerospace-aviation-mro, data-center-it-asset-tracking, logistics. Industrial added to complement the original aerospace / data-center pair.
3. **Related solutions + compare** — `rfid-inventory-tracking` (Batch 4), `uhf-vs-hf-rfid` + `ucode8-vs-ucode9-vs-monza-r6-vs-higgs9` (Batch 3).

**Routing fix.** `primaryAction.href`: `/contact/` → `/contact/rfid-labels-tags/`. `secondaryActions[1]` broken `/product/rfid-tag-with-led-light/` → `/products/rfid-tags/anti-metal-uhf-it-asset-tag/`.

## SEO / GEO shape

Strong. Summary opens with the core answer (why standard UHF fails on metal, what anti-metal construction provides). The "Why standard tags fail on metal" section is an excellent educational answer block for "why doesn't my RFID tag read on metal" queries, and the Construction-types table (ceramic / PCB / ABS / flexible-foam with size, read-range, temp, best-for) is one of the most reader-useful tables in the SKU cohort — perfect for answer-engine extraction.

FAQ covers 3 practitioner questions (steel read-range, outdoor exposure, non-metal-surface compatibility). Read-range answer is technically precise with size/sensitivity-driven guidance.

## Verification

- JSON parses ✅
- Zod schema ✅
- `heroImage: /landing-images/rfid-anti-metal-tag.jpg` exists on disk ✅
- 13 internal hrefs, all resolve ✅
- `chipFamilies` now semantically correct (UHF Impinj M7 + UCODE) ✅
- `publishedAt` + `modifiedAt` set ✅

## Open items

- **`relatedIndustries: ["industrial", "retail-apparel"]`** — retail-apparel is a weak industry fit for anti-metal (garment RFID is a different form factor). Consider replacing with `["industrial", "aerospace-aviation-mro", "data-center-it-asset-tracking", "logistics"]` to match the resourceCards anchoring — but `relatedIndustries` is schema-constrained to the canonical industry slug list, so any addition requires a facet audit first.
- **`/products/rfid-tags/anti-metal-uhf-it-asset-tag/`** — the on-metal IT-asset sibling linked but not Batch-5-refined. Natural next SKU.
- **`/products/rfid-labels/nfc-anti-metal-sticker/`** — HF on-metal sibling linked but not Batch-5-refined; Batch 5b candidate.
- **`sources` block absent.** The Construction-types table would benefit from citing the Impinj Anti-Metal Application Note and NXP UCODE On-Metal Inlay reference design to anchor EEAT.
- **No `callout` / `dataHighlight` blocks** — the page is bullet-heavy; a `callout` emphasising "ceramic = high temp, PCB = IT assets, ABS = outdoor, foam = curved" would be a useful quotable summary for answer engines.

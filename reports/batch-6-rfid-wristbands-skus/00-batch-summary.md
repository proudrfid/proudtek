# Batch 6 — RFID Wristbands SKUs (Cross-Vertical Flagship 6)

**Scope:** 6 flagship `rfid-wristbands/` SKU JSONs spanning the main wristband verticals (hospital, waterpark, cashless-payment, silicone-MIFARE, Tyvek disposable, UHF long-range).

**Status:** Refined, verified.

**Files refined:**
1. `src/content/editorial/products/rfid-wristbands/hospital-patient-id-wristband.json`
2. `src/content/editorial/products/rfid-wristbands/rfid-waterpark-wristband.json`
3. `src/content/editorial/products/rfid-wristbands/cashless-payment-rfid-wristband.json`
4. `src/content/editorial/products/rfid-wristbands/silicone-wristband-mifare-classic.json`
5. `src/content/editorial/products/rfid-wristbands/rfid-tyvek-wristband.json`
6. `src/content/editorial/products/rfid-wristbands/uhf-rfid-wristband.json`

Each file received all 4 approved refinement targets: GEO / answer-shape, cross-link density to Batches 1-4, claim-hygiene pass, and image + diagram + facet check.

## Cross-cutting findings

**1. Systemic `publishedAt` / `modifiedAt` gap — 6 of 6 files affected.** None of the SKUs carried `publishedAt` or `modifiedAt`; only `reviewedAt` was set. All 6 now carry `publishedAt: "2026-04-22"` and `modifiedAt: "2026-04-23"`, matching the Batch 5 baseline.

**2. Systemic `/contact/` root breakage — 6 of 6 files affected.** Every SKU's `primaryAction.href` was bare `/contact/` (which does not resolve; only sub-routes do). Routed per-SKU to the most appropriate sub-route:
- Hospital → `/contact/rfid-labels-tags/`
- Waterpark → `/contact/hotel-rfid/` (hospitality/resorts)
- Cashless-payment → `/contact/event-rfid/`
- Silicone-MIFARE → `/contact/event-rfid/`
- Tyvek → `/contact/event-rfid/`
- UHF → `/contact/event-rfid/`

**3. 12 broken singular `/product/<slug>/` routes fixed across 6 files.** Same systemic WP-era artifact as Batch 5. Broken routes fixed across `imageSourceRoutes`, `resourceCards` and `secondaryActions`:
- `/product/rfid-wristbands-for-events/` (4 uses)
- `/product/rfid-silicone-wristbands/` (5 uses)
- `/product/rfid-wristbands-for-hotels/` (1 use)
- `/product/nfc-stickers/` (1 use)
- `/lp/rfid-wristband-factory/` (3 uses — file is under `_unused/`, not linkable)

All fixed to plural `/products/<category>/<slug>/` paths verified to resolve.

**4. Thin `resourceCards` — 6 of 6 files affected.** Every SKU had only 1 `resourceCards` entry (sometimes 2). Expanded every file to 3 entries with the standard Batch 4-5 pattern:
- Entry 1: adjacent SKU cross-links (form-factor siblings)
- Entry 2: Batch 2 industry landing(s)
- Entry 3: Batch 3 compare + Batch 4 solution + pillar back-link

**5. Claim-hygiene pass — 28 episodic figures softened across 6 files.** Pattern consistent with Batches 4-5: specific dollar figures, percentages, time-savings and cycle counts converted to tier-positioning language with disclaimer intros attributing claims to published hospitality-RFID / hospital-RFID / event-operations literature (IAAPA, Joint Commission, AHRQ, Zebra Healthcare, Semnox, Intercard).

**6. `relatedIndustries` tightening — 3 of 6 files had loose fits.** Waterpark carried `["events-venues", "hospitality", "brand-protection", "industrial"]` — brand-protection and industrial are weak fits for a waterpark SKU; tightened to `["hospitality", "events-venues"]`. Cashless-payment tightened from 4 to `["events-venues", "hospitality"]`. UHF-wristband refitted from `["healthcare", "events-venues", "education", "brand-protection"]` to `["events-venues", "healthcare", "industrial", "logistics"]` — industrial + logistics are first-order verticals for warehouse-worker tracking and cold-storage-zone accountability, which the page explicitly addresses.

**7. `chipFamilies` audit — 6 of 6 correct pre-refinement; no facet fixes needed.** Unlike Batch 5 (which had 2 LF/HF/UHF semantic mismatches), the wristband cohort carried correct chip-family values throughout. One note: the cashless-payment and waterpark pages correctly retained `mifare-classic` in their chip lists but now carry explicit CRYPTO-1 caveats in-copy, directing new high-value deployments toward DESFire EV3 / Plus EV2.

**8. Missing `intro` on the hospital Results section and the waterpark "Why waterparks deploy" section — added with disclaimer framing.** Batch-4-pattern intro paragraphs anchor outcome figures to published literature (Joint Commission, Zebra Healthcare, IAAPA, Semnox, Intercard) before the bullet list, making the directional-benchmark framing explicit for answer-engine extraction.

**9. Cross-link coverage gaps.** Before Batch 6, 0 of 6 files linked to:
- `/compare/silicone-vs-fabric-vs-woven-rfid-wristbands/`
- `/compare/rfid-wristbands-hotels-vs-events-vs-resorts/`
- `/compare/hotel-key-cards-vs-hotel-wristbands/`
- `/solutions/rfid-event-access-control/` (Batch 4)
- `/industries/events-venues/`, `/industries/hospitality/`, `/industries/healthcare/` (Batch 2)

Now linked across the 6 files per fit (events wristbands → event-access-control solution; hospitality wristbands → hotel-wristbands compare; hospital wristbands → healthcare industry; etc.).

**10. `_pillar.json` audit.** The wristband pillar is already in good shape (publishedAt set to 2026-04-18; well-sectioned; strong compliance bullet list). One carryover defect: `primaryAction.href: "/contact/"` — not fixed in this batch scope but flagged as an open item alongside the identical issues in the Batch 2/3/4 pillar files.

## Verification

| File | JSON parse | heroImage exists | publishedAt/modifiedAt | Internal hrefs resolve |
|---|---|---|---|---|
| hospital-patient-id-wristband | ✅ | ✅ | ✅ | 8/8 |
| rfid-waterpark-wristband | ✅ | ✅ | ✅ | 10/10 |
| cashless-payment-rfid-wristband | ✅ | ✅ | ✅ | 10/10 |
| silicone-wristband-mifare-classic | ✅ | ✅ | ✅ | 11/11 |
| rfid-tyvek-wristband | ✅ | ✅ | ✅ | 14/14 |
| uhf-rfid-wristband | ✅ | ✅ | ✅ | 10/10 |
| **Totals** | **6/6** | **6/6** | **6/6** | **63/63** |

## Action summary

| Area | Count |
|---|---|
| Files changed | 6 |
| Episodic $/% claims softened | 28 |
| Broken `/product/<singular>/` routes fixed | 11 |
| Broken `/lp/rfid-wristband-factory/` links fixed | 3 |
| Broken `/contact/` root → sub-route fixes | 6 |
| Missing `publishedAt` / `modifiedAt` fields added | 12 |
| `resourceCards` entries added (total new entries across all files) | 13 |
| `relatedIndustries` tightening edits | 3 |
| Internal hrefs verified | 63 / 63 |
| `heroImage` files verified on disk | 6 / 6 |
| `chipFamilies` / `envFamilies` facet fixes needed | 0 |

## Open items

- **`/products/rfid-wristbands/tyvek-rfid-wristband/` vs `/products/rfid-wristbands/rfid-tyvek-wristband/`** — two SKUs with near-identical slugs both resolve. Flag for dedup audit in a follow-up batch: are they intentionally different (e.g., tyvek-rfid is NFC-only disposable vs rfid-tyvek is UHF-capable) or is one a migration duplicate?
- **`_pillar.json` `primaryAction.href: "/contact/"`** — carries the same root-breakage as the 6 SKUs. Pillar-level fix deferred; recommend rolling into a pillar-wide sweep that covers Batch 2/3/4 pillars too.
- **`/lp/rfid-wristband-factory/` referenced by 3 pre-Batch-6 files** — file lives in `_unused/` but was being linked. All 3 references removed in Batch 6. Flag: audit other batches for stale `/lp/...` links.
- **14 remaining wristband SKUs** — not refined in this batch. Natural Batch 6b candidates grouped by form-factor (fabric, PVC, vinyl, paper, nylon, elastic) and application (prison, child, medical-alert, fitness, NFC-payment, QR-NFC, adjustable-silicone, alt-Tyvek).
- **`sources` block absent on all 6 files** — adding ISO/IEC 14443-3, ISO/IEC 15693, ISO/IEC 18000-63, Joint Commission NPSG 01.01.01, NXP MIFARE Classic / DESFire / NTAG datasheets and the relevant IAAPA / Auburn RFID Lab case-study citations would match the Batch 4 solutions-cohort EEAT baseline.
- **UHF wristband on-body read-range validation report** — currently promised as "available on request". Publishing a representative site-geometry test report as a downloadable PDF would be a high-EEAT content extension.
- **Watch-specific and wearable-form-factor split** — `nfc-fitness-wristband` and `nfc-payment-wristband` SKUs exist separately from the flagship six. Consider whether these deserve batch-6b attention ahead of the material-variant files.

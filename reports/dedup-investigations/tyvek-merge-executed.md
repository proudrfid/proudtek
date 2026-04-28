# Merge Executed — `tyvek-rfid-wristband` → `rfid-tyvek-wristband`

**Date:** 2026-04-23
**Status:** Complete. JSON parses, hrefs resolve, heroImage verified, redirect in place, deleted file confirmed.

## Summary

Merged the two near-duplicate Tyvek wristband pages into a single canonical URL (`rfid-tyvek-wristband`) per the investigation recommendation. The merged page combines the richer 8-section structure + `brief` block + material-comparison table + customization bullets + rush-production callout from `tyvek-rfid-wristband` with the DuPont 1073D/1082D datasheet anchor + competitive-framing intro + Monza R6-P chip specificity + literature-attributed gate-throughput FAQ from `rfid-tyvek-wristband`.

## Merged page composition

- **8 sections** (up from 3 on the base rfid-tyvek page and 8 on the tyvek-rfid source): Why-barcode-fails / Procurement-challenges / How-solves / Typical-outcomes / Why-Tyvek / Material-vs-others table / Applications / Customization.
- **`brief` block** with 7 fields (material, closure, HF chips, UHF chips, size, printing, MOQ).
- **5 FAQs** (gate throughput / cashless / waterproof boundary / transfer prevention / rush turnaround).
- **3 resourceCards** with Batch 2 industry landings (now expanded to include `/industries/education/`), Batch 3 NTAG + UHF compares, Batch 4 event-access-control solution, festival-guide blog, and wristband pillar.

## What was lifted from `tyvek-rfid-wristband`

All content applied with Batch 6 claim-hygiene:

1. **`brief` 7-field spec block** — lifted; MOQ softened from "1,000 pieces / 10-15 business days" → "Accessible MOQs with standard custom-print lead times on the order of two weeks from artwork approval".
2. **MIFARE Ultralight EV1/C chip option** — added to chip-options bullet and to `chipFamilies`. `mifare-ultralight` now present in the merged chip-families list.
3. **Material-comparison table** — lifted; **all absolute dollar figures converted to cost tiers** matching the Batch 6 pattern:
   - "$0.15-$0.35" (Tyvek) → "$ (paper-label tier)"
   - "$0.80-$1.50" (silicone) → "$$$ (premium reusable)"
   - "$0.50-$1.00" (fabric) → "$$ (premium disposable / short-reusable)"
   - "$0.60-$1.20" (PVC) → "$$ (mid-tier reusable)"
   - Added an `intro` line explaining the tier convention and pointing to formal-quote for absolute pricing.
4. **Customization 6-bullet section** — lifted verbatim (all qualitative; no claim-hygiene needed).
5. **Challenges section with literature-attribution intro** — lifted; softened "10,000-attendee" → "large single-day event".
6. **Typical-outcomes section with Eventbrite/Live Nation/AEG attribution intro** — lifted (already softened in Batch 6b).
7. **Nightclub age-verification use-case** — added to Applications bullets.
8. **Rush-production blank-stock callout** — lifted into the how-solves section's 6th bullet.
9. **Extended `brief` coverage** of flexographic vs digital printing, Pantone spot colours, holographic foil, UV ink, sequential numbering.

## What was preserved from `rfid-tyvek-wristband`

- **Summary + heroPoints** — updated hero bullet 1 to reflect the new merged chip-family coverage (NTAG213/215 + MIFARE Ultralight + UHF Monza/UCODE).
- **heroImage: `/landing-images/rfid-tyvek-wristband-alt.jpg`** — unchanged.
- **imageSourceRoutes** — updated from pointing at deleted `tyvek-rfid-wristband` → `paper-rfid-wristband` + `fabric-rfid-wristband` (two natural disposable/reusable sibling routes).
- **"Why paper tickets and barcode wristbands cannot support modern event operations"** — preserved as the opening competitive-framing section (strong answer-engine target for "why RFID over barcode" queries).
- **DuPont Tyvek 1073D/1082D material citation** — preserved.
- **NTAG213/215 + Impinj Monza R6-P / M730 + UCODE 8/9 chip specificity** — preserved and augmented with MIFARE Ultralight EV1/C from the source.
- **Pantone spot-colour spec** — preserved.
- **Ticketing-platform integration line** (Eventbrite / Universe / ShowClix / proprietary) — preserved.
- **Gate-throughput FAQ** — preserved.
- **resourceCards** — preserved structure; expanded the industry-landings card from 2 → 3 entries (added `/industries/education/` for campus-events / field-trips).
- **`modifiedAt: 2026-04-23`** preserved; `reviewedAt` updated to 2026-04-23.

## `relatedIndustries` reconciliation

`rfid-tyvek-wristband` had `["events-venues","hospitality","education","brand-protection"]`; `tyvek-rfid-wristband` had `["events-venues","hospitality"]`. Reconciled to `["events-venues","hospitality","education"]` — `brand-protection` dropped (inherited ghost value, same pattern as was dropped on paper-rfid and nfc-medical-alert).

## Inbound-reference updates (5 files)

All 5 files referencing `/products/rfid-wristbands/tyvek-rfid-wristband/` updated to the canonical `rfid-tyvek-wristband` URL:

| File | Line | Update |
|---|---|---|
| `products/rfid-tags/rfid-race-timing-tag.json` | 163 | URL swap |
| `products/rfid-wristbands/paper-rfid-wristband.json` | 16 (imageSourceRoutes), 50 (resourceCards) | URL swap × 2 |
| `products/rfid-wristbands/_pillar.json` | 62 (material-variants list — duplicate removed), 210 (secondary list) | URL swap + deduped "Tyvek RFID wristband" entry from material-variants list |
| `industries/events-venues.json` | 74 | URL swap (table-row pointer) |
| `solutions/rfid-event-wristbands.json` | 59, 229 | URL swap × 2 |

## 301 redirect

Added to `public/_redirects`:

```
/products/rfid-wristbands/tyvek-rfid-wristband/ /products/rfid-wristbands/rfid-tyvek-wristband/ 301
```

## File deletion

`src/content/editorial/products/rfid-wristbands/tyvek-rfid-wristband.json` — deleted.

## Verification

- ✅ Merged JSON parses (8 sections, 5 FAQs, 3 resourceCards, 7 brief fields)
- ✅ 17 internal hrefs all resolve
- ✅ `heroImage: /landing-images/rfid-tyvek-wristband-alt.jpg` exists on disk
- ✅ 5 inbound-reference files all JSON-parse after URL swap
- ✅ Zero orphan references to the deleted `/tyvek-rfid-wristband/` URL
- ✅ 301 redirect present in `public/_redirects`
- ✅ `_pillar.json` material-variants duplicate entry removed
- ✅ `modifiedAt` and `reviewedAt` both 2026-04-23

## Orphan asset

`/landing-images/tyvek-rfid-wristband.jpg` remains on disk unused. Decision per investigation report: leave in place for possible future blog / case-study use.

## Net result

- **1 canonical Tyvek page** on the Tyvek-wristband keyword cluster (was 2 cannibalizing pages)
- **Best-of-both structure:** 8-section depth + `brief` block + material-compare-table + customization (from tyvek-rfid) combined with competitive-framing intro + DuPont datasheet anchor + literature-attributed FAQ (from rfid-tyvek)
- **Expanded chipFamilies** from 3 → 4 (added `mifare-ultralight`)
- **Expanded relatedIndustries** to 3 first-order verticals (dropped the `brand-protection` ghost value, kept `education` for campus-events)
- **Material-comparison table reworked** from absolute dollar figures → cost tiers matching Batch 6 claim-hygiene pattern
- **Zero broken links** — 5 inbound updates all clean

## Cumulative dedup progress (today)

- **2 wristband duplicates resolved** (nfc-payment + tyvek pairs)
- **17 inbound references updated** (12 for nfc-payment + 5 for tyvek)
- **2 orphan slugs redirected** via `public/_redirects`
- **2 files deleted** from editorial content
- **2 merged pages** with Batch-6-standard claim hygiene and structural depth
- **7 open wristband SKUs remain** for Batch 6c (vinyl, prison, nylon, pvc, nfc-fitness, elastic, qr-nfc)

## Open items

- **Build smoke-test** on both merges at once — haven't run `astro build` in this session.
- **`sources` block.** The merged rfid-tyvek page does not yet carry a `sources` block (DuPont Tyvek 1073D datasheet + ISO/IEC 14443-3 + Impinj Monza R6-P datasheet + Intellitix/Glownet/Tappit case studies would match the Batch 4 EEAT baseline).
- **Orphan hero image.** `/landing-images/tyvek-rfid-wristband.jpg` could be deleted to tidy the public folder, or repurposed if a schema-supported gallery field is later added.

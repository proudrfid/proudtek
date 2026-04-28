# `elastic-rfid-wristband.json`

**Date:** 2026-04-23
**Pre-refine state:** 100 lines, 4 broken `/product/` singular hrefs, bare `/contact/` primaryAction, 2 sections only, `relatedIndustries` contained `healthcare` weak fit.
**Post-refine state:** 5 sections, 5 FAQs, 3 resourceCards, 4 sources; 10 internal hrefs, 0 broken; hero image `/landing-images/elastic-rfid-wristband.jpg` confirmed on disk.

## Principal changes

### Section expansion (2 → 5)

Added **Typical-outcomes section**, **Applications section** (6 bullets covering gym / spa / kids' camp / FEC / yoga / short-cycle events), and **Customization section**.

### Literature-attribution intros

- **Problems** → IHRSA + ABC Fitness / Mindbody / Club Automation + family-entertainment-centre operator reports.
- **Typical-outcomes** → IHRSA operational benchmarks + platform-vendor implementation reviews.

### Claim-hygiene

- "50+ wash cycles at 40 °C" → "extended machine-wash cycles"
- "100+ on/off cycles" → "hundreds of on / off cycles"
- "6-12 months replacement" → "six to twelve months of daily use" (preserved as range-framing but without the "+" claim)
- "MOQ 300 / 15-18 business days" → "accessible MOQ with standard custom-print lead times on the order of two to three weeks"
- "MOQ 50 / 5-7 business days stock" → "shorter lead time with a lower MOQ" (qualitative)

### New FAQs (3 → 5)

Added two:
1. **Reusable hygiene workflow** — alcohol wipe / UV-C / machine-wash cadence for shared-issue programmes.
2. **MIFARE DESFire EV2/EV3 vs Classic 1K** — CRYPTO-1 caveat + upgrade path.

### `sources` block (4 entries)

1. NXP NTAG + DESFire datasheets.
2. IHRSA benchmarks.
3. ABC Fitness / Mindbody / Club Automation implementation references.
4. Nohl & Plötz (2008); Courtois (2009) — CRYPTO-1 cryptanalysis.

### `relatedIndustries` reconciliation

`["healthcare", "fitness", "education"]` → `["fitness", "education", "events-venues"]`

- **`healthcare`** — was a weak fit (elastic bands could theoretically carry patient-family-visitor credentials, but not a core deployment pattern). Dropped.
- **`fitness`** + **`education`** — retained.
- **`events-venues`** — added (short-cycle corporate-wellness events and FEC deployments).

### `chipFamilies` expansion

Added `mifare-ultralight` to the prior 3-chip list.

### Broken-href fixes (4 → 0)

| Pre-refine href | Post-refine href |
|---|---|
| `/product/rfid-silicone-wristbands/` (imageSourceRoutes) | `/products/rfid-wristbands/fabric-rfid-wristband/` |
| `/product/rfid-wristbands-for-events/` (imageSourceRoutes) | `/products/rfid-wristbands/rfid-adjustable-silicone-wristband/` |
| `/product/rfid-silicone-wristbands/` (resourceCards) | (resourceCards fully rewritten) |
| `/product/rfid-silicone-wristbands/` (secondaryActions) | `/products/rfid-wristbands/rfid-adjustable-silicone-wristband/` |

### resourceCards expansion (1 → 3 cards)

- **Material & form-factor comparisons** — silicone-vs-fabric-vs-woven, wristband-vs-card, hotel-vs-event-vs-resort.
- **Industry & solution context** — fitness, education, events-venues.
- **Related wristband SKUs** — fabric, adjustable-silicone, nfc-fitness.

### primaryAction

`/contact/` → `/contact/hotel-rfid/`.

### Date fields

- `publishedAt: 2026-04-23` (new)
- `modifiedAt: 2026-04-23` (new)
- `reviewedAt: 2026-04-22` → `2026-04-23`

## Verification

- ✅ JSON parses.
- ✅ 10 internal hrefs all resolve.
- ✅ Hero image present on disk.
- ✅ Weak-fit industry dropped.
- ✅ 4-entry `sources` block.

# `nfc-fitness-wristband.json`

**Date:** 2026-04-23
**Pre-refine state:** 98 lines, 6 broken `/product/` singular hrefs, bare `/contact/` primaryAction, 2 sections only, `relatedIndustries: ["fitness"]` single-item / thin.
**Post-refine state:** 5 sections, 5 FAQs, 3 resourceCards, 4 sources; 10 internal hrefs, 0 broken; hero image `/landing-images/nfc-fitness-wristband.jpg` confirmed on disk.

## Principal changes

### Section expansion (2 → 5)

Added **Typical-outcomes section**, **Applications section** (6 bullets: traditional gyms / boutique studios / climbing / CrossFit / corporate wellness / hotel fitness centres), and **Customization section**.

### Literature-attribution intros

- **Problems** → IHRSA + ABC Fitness / Mindbody / Club Automation / ClubReady / Jonas / PerfectGym platform-vendor deployment reports.
- **Typical-outcomes** → IHRSA operational benchmarks + platform-vendor implementation summaries.

### Claim-hygiene

- "10-15% forgetting cards" → "non-trivial rate across the membership base"
- "under 1 second tap" → "ISO/IEC 14443-4 reader timing"
- "Shore A 50-60 hardness" → "Shore-A hardness in the comfort range for all-day wear"
- "IP68 module rating" → "full-immersion IP level"
- "100+ wash cycles" → "repeated machine-wash cycles"
- "12-24 months service life" → "extended daily gym use" with "annual replacement cadence"
- "MOQ 200 / 12-15 business days" → "accessible MOQ with standard custom-print lead times on the order of two to three weeks"
- "MOQ 50 / 3-5 business days stock" → "shorter lead time with a lower MOQ"

### New FAQs (3 → 5)

Added two:
1. **MIFARE DESFire EV2/EV3 vs Classic 1K** — CRYPTO-1 caveat + DESFire / Plus EV2 upgrade path.
2. **Material alternatives for silicone-sensitive members** — fabric / nylon option on a mix-material PO.

### `sources` block (4 entries)

1. NXP NTAG + DESFire datasheets.
2. IHRSA fitness-facility benchmarks.
3. ABC Fitness / Mindbody / Club Automation / ClubReady deployment summaries.
4. Nohl & Plötz (2008); Courtois (2009) — CRYPTO-1 cryptanalysis.

### `relatedIndustries` expansion

`["fitness"]` → `["fitness", "hospitality", "events-venues"]`

Added:
- **`hospitality`** — hotel fitness-centre deployments and corporate-wellness programmes; explicit application bullet covers this.
- **`events-venues`** — half-day open-gym / corporate-wellness / beta-launch programmes; explicit application bullet covers this.

### `chipFamilies` expansion

Added `mifare-ultralight` to the prior 3-chip list.

### Broken-href fixes (6 → 0)

| Pre-refine href | Post-refine href |
|---|---|
| `/product/rfid-silicone-wristbands/` (imageSourceRoutes) | `/products/rfid-wristbands/rfid-adjustable-silicone-wristband/` |
| `/product/nfc-ring/` (imageSourceRoutes) | `/products/rfid-wristbands/fabric-rfid-wristband/` |
| `/product/rfid-silicone-wristbands/` (resourceCards) | (resourceCards fully rewritten) |
| `/product/nfc-ring/` (resourceCards) | (resourceCards fully rewritten) |
| `/product/rfid-silicone-wristbands/` (secondaryActions) | `/products/rfid-wristbands/rfid-adjustable-silicone-wristband/` |
| `/product/nfc-ring/` (secondaryActions) | `/products/rfid-wristbands/fabric-rfid-wristband/` |

### resourceCards expansion (1 → 3 cards)

- **Material & form-factor comparisons** — silicone-vs-fabric-vs-woven, wristband-vs-card, NTAG chip compare.
- **Industry & solution context** — fitness, rfid-access-control, rfid-attendance-system.
- **Related wristband SKUs** — adjustable-silicone, fabric, elastic.

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
- ✅ Thin single-item `relatedIndustries` expanded to three.
- ✅ 4-entry `sources` block with IHRSA + NXP + cryptanalysis references.

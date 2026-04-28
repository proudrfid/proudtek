# `rfid-vinyl-wristband.json`

**Date:** 2026-04-23
**Pre-refine state:** 125 lines, 2 broken `/product/` singular hrefs, bare `/contact/` primaryAction, `publishedAt` / `modifiedAt` absent, 3 sections only, `relatedIndustries` contained `pharmaceutical` + `healthcare` ghosts.
**Post-refine state:** 5 sections, 5 FAQs, 3 resourceCards, 5 sources; 11 internal hrefs, 0 broken; hero image `/landing-images/rfid-vinyl-wristband.jpg` confirmed on disk.

## Principal changes

### Section expansion (3 → 5)

Added **Typical-outcomes section** with AHLA + CLIA + Oracle OPERA / Shiji / Agilysys attribution intro, and **Customization section** with jacquard-weaving + sublimation-printing + clasp-option bullets.

### Claim-hygiene

Episodic figures softened to qualitative directional language:
- "8-15% replacement per stay" → "non-trivial rates across a guest stay"
- "$2-$5 card + 5-10 min staff time" → "material production / encoding / front-desk time cost concentrated during peak check-in windows"
- "10-20% ancillary spend reduction" → "friction that reduces ancillary spending relative to single-wristband programmes per published AHLA case summaries"
- "14+ days continuous wear" → "extended continuous wear" (qualitative)

### New FAQs (3 → 5)

Added two:
1. **NFC/HF vs UHF chip choice** — when to use each for a resort deployment, with dual-frequency option explained.
2. **MIFARE DESFire EV2/EV3 vs Classic 1K** — CRYPTO-1 caveat + DESFire / Plus EV2 upgrade-path language.

### `sources` block (5 entries)

1. NXP NTAG213/215/216 + MIFARE DESFire EV2/EV3 datasheets.
2. Impinj Monza R6-P / M730 + NXP UCODE 8/9 datasheets.
3. AHLA + CLIA operations reports.
4. Oracle OPERA / Shiji / Agilysys PMS integration guides.
5. Nohl & Plötz (2008); Courtois (2009) — MIFARE Classic CRYPTO-1 cryptanalysis.

### `relatedIndustries` reconciliation

`["pharmaceutical", "healthcare", "events-venues", "hospitality"]` → `["events-venues", "hospitality"]`

- **`pharmaceutical`** — inherited ghost value, no fit for a multi-day resort / cruise product. Dropped.
- **`healthcare`** — was present because of a single "Hospital patient ID" application bullet that had been lifted from the patient-ID SKU. Dropped along with that bullet (hospital-patient-id-wristband already covers that case).
- **`events-venues`** + **`hospitality`** — retained as the strong fits.

### Broken-href fixes (2 → 0)

| Pre-refine href | Post-refine href |
|---|---|
| `/product/rfid-wristbands-for-events/` (imageSourceRoutes) | `/products/rfid-wristbands/rfid-waterpark-wristband/` |
| `/product/rfid-cards/` (imageSourceRoutes) | `/products/rfid-wristbands/cashless-payment-rfid-wristband/` |

### resourceCards expansion (2 → 3 cards)

- **Material & form-factor comparisons** — silicone-vs-fabric-vs-woven, hotel-vs-event-vs-resort, hotel-key-cards-vs-hotel-wristbands.
- **Industry & solution context** — hospitality, events-venues, hotel-key-cards solution.
- **Related wristband & chip references** — tyvek, cashless-payment, UHF chip compare.

### envFamilies

`["outdoor"]` → `["outdoor", "tamper"]` (the one-time snap-lock closure is a tamper-evident mechanism).

### primaryAction

`/contact/` → `/contact/hotel-rfid/`.

### Date fields

- `publishedAt: 2026-04-23` (new)
- `modifiedAt: 2026-04-23` (new)
- `reviewedAt: 2026-04-22` → `2026-04-23`

## Verification

- ✅ JSON parses.
- ✅ 11 internal hrefs all resolve.
- ✅ Hero image present on disk.
- ✅ Ghost industries dropped.
- ✅ CRYPTO-1 caveat in chip-options bullet + dedicated FAQ.
- ✅ 5-entry `sources` block.

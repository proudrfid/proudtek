# `rfid-prison-wristband.json`

**Date:** 2026-04-23
**Pre-refine state:** 120 lines, 2 broken `/product/` singular hrefs + 2 broken `/products/rfid-wristbands/rfid-silicone-wristband/` and `/products/rfid-wristbands/rfid-event-wristband/` (non-existent), bare `/contact/` primaryAction, `relatedIndustries` was **entirely ghost** (`pharmaceutical` / `luxury-brands` / `brand-protection` / `logistics` — none fit a corrections product).
**Post-refine state:** 5 sections, 5 FAQs, 3 resourceCards, 5 sources; 10 internal hrefs, 0 broken; hero image `/landing-images/rfid-prison-wristband.jpg` confirmed on disk.

## Principal changes

### Section expansion (3 → 5)

Added **Applications section** (6 bullets: state/federal corrections, county/municipal detention, ICE processing, juvenile-detention, inter-facility transport, psychiatric / forensic hospitals) and **Customization section** (laser-engraved ID + colour-coding + dual-frequency + frangible-antenna variant).

### Literature-attribution intros

- **Challenges** → American Correctional Association (ACA) + National Institute of Justice (NIJ) + corrections-technology vendor case studies (GUARDIAN RFID, Keefe Group, Black Creek ISC).
- **Typical-outcomes** → same three sources with NIJ operations reviews as the primary anchor.

### Claim-hygiene

- "500-5,000 inmates, 30-90 min per count, 2-6 hours daily" → "medium-to-large facilities consume significant daily operational time"
- "45 min → 2 min headcount" → "materially shorter headcount duration"
- "5-15 swap attempts per month" → "near-zero successful identity-swap incidents"
- "12-18 months service life" → "on the order of a year or more"
- "1-5 second update cycle" → "low-latency update cycle"
- "500-bed housing unit in under 60 seconds" → "housing-unit counts complete in under a minute"

### Dual-frequency architecture language

Hardened the dual-frequency (UHF + HF) section to explicitly reference the layered identification architecture that corrections-technology vendors increasingly specify — long-range UHF for zone tracking + close-range HF for positive-ID at commissary / pharmacy / court-transport checkpoints.

### New FAQs (3 → 5)

Added two:
1. **UHF RFID vs manual headcount for ACA audit purposes** — addresses accreditation-documentation angle and defence-in-depth reconciliation-count practice.
2. **Reader infrastructure requirements** — housing-unit antenna count / placement, reader manufacturers (Impinj / Zebra / Alien), RFID-site-survey phase integrator support.

### `sources` block (5 entries)

1. Impinj Monza R6 / M730 + NXP UCODE 8/9 datasheets.
2. American Correctional Association Performance-Based Standards.
3. National Institute of Justice (NIJ) Inmate Tracking Technology reports.
4. GUARDIAN RFID / Black Creek ISC / Keefe Group case references.
5. EPCglobal Class-1 Gen-2 UHF RFID Protocol (ISO/IEC 18000-63).

### `relatedIndustries` reconciliation (most significant ghost-cleanup in Batch 6c)

`["pharmaceutical", "luxury-brands", "brand-protection", "logistics"]` → `["government-defense-supply-chain", "healthcare"]`

All four pre-refine values were ghost / inherited from unrelated SKU templates:
- **`pharmaceutical`** — no fit.
- **`luxury-brands`** — no fit.
- **`brand-protection`** — no fit.
- **`logistics`** — tenuous (inter-facility transport is *chain-of-custody* logistics but not the logistics-industry slug which is about package / supply-chain tracking).

Post-refine:
- **`government-defense-supply-chain`** — the closest-fit industry slug for corrections / detention.
- **`healthcare`** — retained / added for the psychiatric / forensic-hospital application and HIPAA-adjacent inmate-medical-record compliance.

Note: there is no `corrections` or `public-safety` industry slug in the current industries corpus — `government-defense-supply-chain` is the closest available fit.

### Broken-href fixes (4 → 0)

| Pre-refine href | Post-refine href |
|---|---|
| `/product/rfid-silicone-wristbands/` (imageSourceRoutes) | `/products/rfid-wristbands/uhf-rfid-wristband/` |
| `/product/rfid-event-wristband/` (imageSourceRoutes) | `/products/rfid-wristbands/hospital-patient-id-wristband/` |
| `/products/rfid-wristbands/rfid-silicone-wristband/` (resourceCards + secondaryActions) | `/products/rfid-wristbands/uhf-rfid-wristband/` (secondaryActions) |
| `/products/rfid-wristbands/rfid-event-wristband/` (resourceCards + secondaryActions) | `/products/rfid-wristbands/hospital-patient-id-wristband/` (secondaryActions) |

The non-existent `rfid-silicone-wristband` and `rfid-event-wristband` singular paths were cross-referenced from this file — they had been carried from an earlier editorial template that assumed those SKUs existed. They do not; the actual canonical routes are `rfid-adjustable-silicone-wristband` and `rfid-event-wristbands` (solution-page plural).

### resourceCards expansion (2 → 3 cards)

- **Chip & form-factor technical references** — UHF chip compare + HF-vs-UHF-asset-tracking + UHF-vs-HF-RFID.
- **Industry & solution context** — government-defense, rfid-access-control solution, rfid-attendance-system solution.
- **Related wristband & tracking SKUs** — UHF wristband, hospital-patient-id, nfc-medical-alert.

### primaryAction

`/contact/` → `/contact/rfid-labels-tags/` (corrections = tracking / identification intent, closest match among the three available contact sub-routes).

### Date fields

- `publishedAt: 2026-04-23` (new)
- `modifiedAt: 2026-04-23` (new)
- `reviewedAt: 2026-04-22` → `2026-04-23`

## Verification

- ✅ JSON parses.
- ✅ 10 internal hrefs all resolve.
- ✅ Hero image present on disk.
- ✅ All 4 ghost `relatedIndustries` dropped.
- ✅ 5-entry `sources` block with ACA + NIJ + ISO/IEC standards.
- ✅ `envFamilies: ["embed", "tamper"]` preserved (embed + tamper are strong fits for corrections wristband).

## Open items

- **Single-industry fit is honest.** `government-defense-supply-chain` alone might be stronger than the added `healthcare`. Healthcare was added for the psychiatric-hospital application; if that application is deprioritised in future, trim to single-industry.
- **Corrections industry slug.** A dedicated `corrections` or `public-safety` industry slug would be a stronger editorial home for this SKU than `government-defense-supply-chain`. Consider proposing in a future industries-taxonomy review.

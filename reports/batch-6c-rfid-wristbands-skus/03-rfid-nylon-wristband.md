# `rfid-nylon-wristband.json`

**Date:** 2026-04-23
**Pre-refine state:** 111 lines, 2 broken `/product/` singular hrefs, bare `/contact/` primaryAction, `envFamilies` absent, `relatedIndustries` contained `pharmaceutical` + `laundry-services` ghosts.
**Post-refine state:** 5 sections, 5 FAQs, 3 resourceCards, 4 sources; 10 internal hrefs, 0 broken; hero image `/landing-images/rfid-nylon-wristband.jpg` confirmed on disk.

## Principal changes

### Section expansion (3 → 5)

Added **Typical-outcomes section** (IHRSA + AHLA + ABC Fitness / Mindbody / Club Automation attribution) and **Customization section** (jacquard weaving + sublimation + clasp options + sizing).

### Claim-hygiene

- "200+ wash cycles at 60 °C" → "extended wash-cycle endurance"
- "30-40% remove rate" → "documented driver of member drop-off" (qualitative)
- "15 kg pull-out force" → "tested against real-world gym-activity pull forces"
- "2-3 years service life" → "several years before the fabric shows significant wear"
- "12-24 month replacement cycle" → "one-to-two-year aesthetic cycle"

### New FAQs (3 → 5)

Added two:
1. **Chip-family selection** — NFC for door locks, DESFire EV2/EV3 for cashless, Classic 1K caveat + Plus EV2 upgrade-path.
2. **Wet-environment compatibility** — how the sealed RFID module handles chlorinated-water exposure; distinction between band-drying and read-path impact.

### `sources` block (4 entries)

1. NXP NTAG + DESFire datasheets.
2. IHRSA fitness-facility benchmarks.
3. AHLA operations reports.
4. Nohl & Plötz (2008); Courtois (2009) — CRYPTO-1 cryptanalysis.

### `relatedIndustries` reconciliation

`["pharmaceutical", "laundry-services", "fitness", "events-venues"]` → `["fitness", "hospitality", "events-venues"]`

- **`pharmaceutical`** — ghost value; dropped.
- **`laundry-services`** — was a plausible-but-weak fit: laundry-services is about tagging clothes for laundry tracking, not wristbands that go through laundry. Dropped as confused-vertical.
- **`fitness`** — retained.
- **`events-venues`** — retained.
- **`hospitality`** — added (extended-stay hotel use-case is explicit in the How-solves section).

### `chipFamilies` expansion

Added `mifare-ultralight` to the prior `[ntag21x, mifare-classic, mifare-desfire]` list to reflect the explicit Ultralight EV1/C budget-access option added in the How-solves bullets.

### `envFamilies` addition

Pre-refine: absent. Post-refine: `["outdoor"]` (gym / pool / outdoor-campus use).

### Broken-href fixes (2 → 0)

| Pre-refine href | Post-refine href |
|---|---|
| `/product/rfid-wristbands-for-events/` (imageSourceRoutes) | `/products/rfid-wristbands/fabric-rfid-wristband/` |
| `/product/rfid-key-fobs/` (imageSourceRoutes) | `/products/rfid-wristbands/rfid-adjustable-silicone-wristband/` |

Also: resourceCards had a `/products/rfid-keyfobs/rfid-abs-keyfob/` link which was cleaned up along with the full resourceCards rewrite.

### resourceCards expansion (1 → 3 cards)

- **Material & form-factor comparisons** — silicone-vs-fabric-vs-woven, hotel-vs-event-vs-resort, wristband-vs-card.
- **Industry & solution context** — fitness, hospitality, hotel-key-cards.
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
- ✅ Ghost industries dropped.
- ✅ `envFamilies` now populated.
- ✅ 4-entry `sources` block.

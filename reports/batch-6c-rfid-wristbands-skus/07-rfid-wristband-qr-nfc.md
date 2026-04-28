# `rfid-wristband-qr-nfc.json`

**Date:** 2026-04-23
**Pre-refine state:** 111 lines, 0 broken `/product/` hrefs but 2 broken `/lp/rfid-wristband-factory/` references (the actual LP is `/lp/rfid-wristband-manufacturer/`), bare `/contact/` primaryAction, 3 sections only, `relatedIndustries` carried `luxury-brands` + `brand-protection` + `industrial` ghosts.
**Post-refine state:** 5 sections, 5 FAQs, 3 resourceCards, 4 sources; 11 internal hrefs, 0 broken; hero image `/landing-images/rfid-wristband-qr-nfc.jpg` confirmed on disk.

## Principal changes

### Section expansion (3 → 5)

Added **Typical-outcomes section** (Eventbrite / Live Nation / AEG / Intellitix / Glownet / PlayPass / Tappit attribution) and **Customization section** (laser vs UV-cured QR printing + dynamic NFC payload + static QR + bulk UID-to-QR mapping file).

### Literature-attribution intros

- **Why-combine-NFC-and-QR** → Eventbrite / Live Nation / AEG event-operations case studies + Intellitix / Glownet / PlayPass / Tappit cashless-platform post-event reviews.
- **Typical-outcomes** → same sources, framed as reader-redundancy outcomes.

### Claim-hygiene

- "MOQ 500 silicone/fabric + MOQ 1,000 Tyvek" → "accessible MOQs; exact MOQ depends on band material, chip family, and custom-branding complexity"
- "No additional charge above these minimums" → folded into qualitative quote-language
- "Free samples available" — preserved (qualitative, no episodic figure)

### Dual-technology reader-redundancy framing

Sharpened the redundancy claim — this is the single strongest answer-engine target for "why pair NFC with QR on a wristband" queries. The new framing explicitly cites published cashless-platform reviews as the primary reliability case for dual-tech deployments, not a vendor assertion.

### New FAQs (3 → 5)

Added two:
1. **MIFARE DESFire EV2/EV3 availability on the NFC side** — CRYPTO-1 caveat + DESFire / Plus EV2 upgrade-path for cashless-payment deployments.
2. **Pre-shipment UID-to-QR mapping file delivery** — confirms the default workflow that removes the manual pre-event scan-in step; names the cashless platforms integrated by default.

### `sources` block (4 entries)

1. NXP NTAG + DESFire datasheets.
2. **ISO/IEC 18004 QR Code standard** — authoritative anchor for the QR symbology claims.
3. Intellitix / Glownet / PlayPass / Tappit cashless-platform integration references.
4. Nohl & Plötz (2008); Courtois (2009) — CRYPTO-1 cryptanalysis.

### `relatedIndustries` reconciliation

`["events-venues", "luxury-brands", "brand-protection", "industrial"]` → `["events-venues", "hospitality"]`

- **`luxury-brands`** — no fit for event wristbands. Ghost. Dropped.
- **`brand-protection`** — no fit. Ghost. Dropped.
- **`industrial`** — outright wrong for an event / hospitality product. Ghost. Dropped.
- **`events-venues`** — retained.
- **`hospitality`** — added (resort / spa / multi-day on-property deployments with cashless).

### `chipFamilies` expansion

Added `mifare-desfire` to the prior `[ntag21x, mifare-ultralight]` list — reflects the explicit DESFire EV2/EV3 cashless-payment recommendation now in the chip-options bullet + FAQ.

### Broken-href fixes

| Pre-refine href | Post-refine href |
|---|---|
| `/lp/rfid-wristband-factory/` (imageSourceRoutes) | `/products/rfid-wristbands/fabric-rfid-wristband/` |
| `/lp/rfid-wristband-factory/` (resourceCards) | (resourceCards fully rewritten) |
| `/lp/rfid-wristband-factory/` (secondaryActions) | `/lp/rfid-wristband-manufacturer/` |

The non-existent `/lp/rfid-wristband-factory/` was used across three pointers in the pre-refine file — the actual canonical LP is `/lp/rfid-wristband-manufacturer/`.

### resourceCards expansion (1 → 3 cards)

- **Material & form-factor comparisons** — silicone-vs-fabric-vs-woven, **RFID-vs-QR-code**, wristband-vs-card.
- **Industry & solution context** — events-venues, rfid-event-access-control solution, rfid-event-wristbands solution.
- **Related wristband SKUs** — fabric, adjustable-silicone, tyvek.

Note: the `/compare/rfid-vs-qr-code/` card is the strongest topical fit for this dual-technology SKU — it bridges the two reader paths and supports the answer-engine case for the page.

### primaryAction

`/contact/` → `/contact/event-rfid/`.

### Date fields

- `publishedAt: 2026-04-23` (new)
- `modifiedAt: 2026-04-23` (new)
- `reviewedAt: 2026-04-22` → `2026-04-23`

## Verification

- ✅ JSON parses.
- ✅ 11 internal hrefs all resolve.
- ✅ Hero image present on disk.
- ✅ Three ghost `relatedIndustries` dropped.
- ✅ `/lp/` broken-factory route replaced with canonical `/lp/rfid-wristband-manufacturer/`.
- ✅ 4-entry `sources` block with ISO/IEC 18004 + NXP + cashless-platform + cryptanalysis references.

# `pvc-rfid-wristband.json`

**Date:** 2026-04-23
**Pre-refine state:** 223 lines, 6 broken `/product/` singular hrefs, bare `/contact/` primaryAction, `publishedAt` / `modifiedAt` absent, material-compare table with absolute dollar figures.
**Post-refine state:** 6 sections, 5 FAQs, 3 resourceCards, 4 sources, 7-field `brief` block; 11 internal hrefs, 0 broken; hero image `/landing-images/pvc-rfid-wristband.png` confirmed on disk.

## Principal changes

### Claim-hygiene on the material-compare table

Absolute per-unit dollar figures were converted to qualitative cost tiers matching the Batch 6 pattern established by the cashless-payment merge and carried through rfid-tyvek:

| Material | Pre-refine | Post-refine |
|---|---|---|
| PVC | `$0.60-$1.20` | `$$ (mid-tier reusable)` |
| Silicone | `$0.80-$1.50` | `$$$ (premium reusable)` |
| Fabric | `$0.50-$1.00` | `$$ (premium disposable / short-reusable)` |

The section carries an explicit `intro` line explaining the tier convention and directing to formal-quote for absolute pricing.

### Literature-attribution intros

Two sections now carry attribution paragraphs:

- **Problems** → IAAPA (International Association of Amusement Parks and Attractions) + Semnox / Vantage / Accesso operator post-season reviews.
- **Typical outcomes** → IAAPA case studies + Semnox / Vantage implementation summaries + Intellitix / Glownet / Tappit post-event reviews.

### `sources` block (4 entries)

1. IEC 60529 ingress-protection standard (IP67 rating definition) — authoritative anchor for the IP67 claim.
2. NXP NTAG213/215/216 + MIFARE DESFire EV2/EV3 datasheets — memory, cryptography, write-cycle endurance.
3. Nohl & Plötz (2008); Courtois (2009) — MIFARE Classic CRYPTO-1 cryptanalysis.
4. Intellitix / Glownet / Tappit / Vantage / Semnox cashless-platform integration references.

### `brief` block expansion

Pre-refine had 6 fields with episodic "500 pieces / 12-18 business days" MOQ line. Post-refine has 7 fields: Material (with phthalate-free option), Closure (reusable + adjustable + breakaway), Chip options (5-chip list with attribution), Water resistance (with IEC 60529 anchor), Band dimensions (adult + child + infant), Printing (CMYK + Pantone + sequential), MOQ (softened to qualitative "two to three weeks from artwork approval").

### resourceCards expansion (1 → 3 cards)

- **Material & form-factor comparisons** — silicone-vs-fabric-vs-woven, hotel-vs-event-vs-resort, wristband-vs-card.
- **Industry & solution context** — events-venues, hospitality, rfid-event-access-control.
- **Related wristband SKUs** — waterpark, adjustable-silicone, cashless-payment.

### Broken-href fixes (6 → 0)

| Pre-refine href | Post-refine href |
|---|---|
| `/product/rfid-silicone-wristbands/` (imageSourceRoutes) | `/products/rfid-wristbands/rfid-waterpark-wristband/` |
| `/product/rfid-wristbands-for-events/` (imageSourceRoutes) | `/products/rfid-wristbands/rfid-adjustable-silicone-wristband/` |
| `/product/rfid-silicone-wristbands/` (resourceCards) | (resourceCards fully rewritten) |
| `/product/rfid-wristbands-for-events/` (resourceCards) | (resourceCards fully rewritten) |
| `/product/rfid-wristbands-for-hotels/` (resourceCards) | (resourceCards fully rewritten) |
| `/product/rfid-silicone-wristbands/` (secondaryActions) | `/products/rfid-wristbands/rfid-adjustable-silicone-wristband/` |

### primaryAction

`/contact/` → `/contact/event-rfid/` (water-park + cashless + event-access intent).

### Date fields

- `publishedAt: 2026-04-23` (new)
- `modifiedAt: 2026-04-23` (new)
- `reviewedAt: 2026-04-22` → `2026-04-23`

## Verification

- ✅ JSON parses.
- ✅ 11 internal hrefs all resolve against the 484-route editorial corpus.
- ✅ Hero image present on disk.
- ✅ Cost-tier table replaces dollar figures.
- ✅ CRYPTO-1 security caveat in chip-selection list and dedicated FAQ.
- ✅ 4-entry `sources` block with IEC + NXP + cryptanalysis + cashless-platform references.

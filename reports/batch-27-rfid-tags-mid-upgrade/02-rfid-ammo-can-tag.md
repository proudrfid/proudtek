# Page 2/6 — rfid-ammo-can-tag

**Route**: `/products/rfid-tags/rfid-ammo-can-tag/`
**Task**: #203
**Status**: ✅ MID → DEEP complete

## Regulatory anchor

- MIL-STD-129R Standard Practice for Military Marking for Shipment and Storage + MIL-STD-1168D DODIC / NALC / LOT / CIIC
- DOT 49 CFR §173.62 Class 1 Explosives packaging + §172.202 shipping papers + §173.52 classification
- ITAR 22 CFR Parts 120-130 USML Category III (ammunition, ordnance, explosives)
- NATO STANAG 2493 Explosive Ordnance Disposal Principles and Minimum Standards
- ATF 27 CFR Part 555 §555.109 storage + §555.127 records for commerce in explosives
- DoD 4145.26-M Contractor's Safety Manual + 5160.65-M Single Manager for Conventional Ammunition

## DEEP compliance

| Block | Status |
|-------|--------|
| keywords[] | 6 ✓ |
| brief[] fields | 12 ✓ |
| sources[] | 10 ✓ |
| sources 5-field | ✓ |
| statBar | ✓ |
| comparePanel | ✓ |
| dataHighlight | ✓ |
| timeline | ✓ |

## Form-factor SKUs

Six ammo-container form factors: (1) PA70 / M2A1 .50-cal can, (2) PA108 / M2A2
/ M19A1 small-arms can, (3) PA120 / PA125 large-caliber, (4) 40 mm wooden
crate cleat tag, (5) 155 mm pallet tag, (6) SAAMI commercial case.

## Platforms

SAAS-MOD, TAMIS-R, GCSS-Army, MHP, LIW, OIS-MC, CAS, ROLMS-I, DoD IUID
Registry via PIEE / iRAPT, ATF eForm + Explosives Tracing Center.

## Cross-reference health

- Inbound refs: 6
- Outbound unique: 10
- Orphans: 0 (imageSourceRoutes repaired from `/product/rfid-tag-with-led-light/` + `/product/car-transponder-chip/` to `/products/rfid-tags/rfid-high-temp-silicone-tag/` + `/products/rfid-tags/anti-metal-uhf-it-asset-tag/`)

## Validation

`npx astro sync` clean (852 ms). Re-sync post-orphan-fix clean (826 ms).

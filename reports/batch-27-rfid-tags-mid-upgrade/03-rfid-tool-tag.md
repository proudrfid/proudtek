# Page 3/6 — rfid-tool-tag

**Route**: `/products/rfid-tags/rfid-tool-tag/`
**Task**: #204
**Status**: ✅ MID → DEEP complete

## Regulatory anchor

- FAA AC 120-72B Maintenance Human Factors Program + 14 CFR §145.211(c)(1)(vi) Repair Station Quality Control (tool & equipment control)
- AS9100D §8.1.3 Product Safety + AS9146 FOD Prevention + NAS 412 Foreign Object Damage / Debris Prevention
- NAVAIR 13-1-6.7 Aircraft Weapons Systems Cleaning & Corrosion Control; AFI 21-101 CAnn Maintenance Management (USAF)
- Boeing D6-1276 Tool Control + Airbus AP2633 Tool Accountability
- Snap-on ATC, Stanley Vidmar, Lista, CribMaster, ToolHound, ToolWatch, ShadowBoard Pro, AutoCrib crib/shadow-board ecosystems

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

Six tool-tag form factors: (1) wrap-around handle, (2) flat disc, (3) ring /
collar, (4) flag tag for hand tools, (5) micro inlay for micro-tooling, (6)
toolbox drawer-insert module.

## Platforms

Snap-on ATC, Stanley Vidmar, Lista, CribMaster, ToolHound, ToolWatch,
ShadowBoard Pro, AutoCrib, Apex, Foxcom, Boeing Maintenance Performance
Toolbox, Trax, Ramco, AMOS, Rusada, Lockheed P3I, Raytheon ODIN, F-35 ALIS,
NAVAIR OOMA, DECKPLATE, AFILS, G081.

## Cross-reference health

- Inbound refs: 12
- Outbound unique: 9
- Orphans: 0 (imageSourceRoutes repaired from `/product/rfid-laundry-tags/` + `/product/anti-metal-rfid-tags/` to `/products/rfid-tags/rfid-textile-laundry-tag/` + `/products/rfid-tags/rfid-anti-metal-tag/`)

## Validation

`npx astro sync` clean (884 ms). Re-sync post-orphan-fix clean (826 ms).

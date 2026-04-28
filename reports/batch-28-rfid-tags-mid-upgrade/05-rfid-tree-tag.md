# Page 5/6 — rfid-tree-tag

**Route**: `/products/rfid-tags/rfid-tree-tag/`
**Task**: #215
**Status**: ✅ MID → DEEP complete

## Regulatory anchor

- USDA Forest Service Forest Inventory & Analysis (FIA) + USFS Forest Health Monitoring
- USFS National Forest System 36 CFR Part 219
- ANSI A300 Tree Care Operations Parts 1-10 + ISA Tree Risk Assessment Qualification (TRAQ)
- FSC-STD-40-004 v3.1 Chain of Custody + FSC-STD-40-007 Reclaimed Material
- PEFC ST 2002:2020 Chain of Custody + SFI 2022 Chain of Custody Standard
- Regulation (EU) 2023/1115 EUDR (effective 30 Dec 2024) + EUTR 995/2010 predecessor
- US Lacey Act 16 USC §3371-3378 + CITES Appendix II Pterocarpus / Dalbergia / Cedrela / Swietenia
- GS1 General Specifications v24 § 3.4.6 GIAI-96 + EPC Tag Data Standard v2.1 + EPCIS 2.0 ObjectEvents
- ASTM G154 QUV + ASTM D4329 + ASTM G155 + ISO 4892-2 + ASTM B117 + ISO 9227

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

Six forestry + urban-forestry form factors: (1) aluminium nail-mount 30-50 mm disc (FIA + SFI marked-timber), (2) UV-polycarbonate high-visibility flag orange / yellow / green (ISA TRAQ + ANSI A300), (3) stainless 316L Torx / pin-in-hex screw-mount plaque (urban anti-vandal), (4) self-locking nylon cable-tie (non-destructive research), (5) log-end hammer-in spike (post-harvest to mill gate), (6) low-profile urban anti-vandal Torx T20 / pin-in-hex / shear bolt.

## Chip options

Impinj Monza R6-P (cost-optimised mass FIA); Impinj M750 / M770 / M775 Autotune (vehicle / ATV / drone survey); NXP UCODE 9 / 9xe (extended 96-bit user memory for COC payload); NXP UCODE DNA / DNA City (AES-128 mutual-auth urban anti-vandal); Alien Higgs-9; FM13UF08 ECDSA digital-signature (EUDR + CITES II anti-forgery).

## Platforms

USFS i-Tree Eco + i-Tree Landscape + i-Tree Canopy + i-Tree Hydro; ESRI ArcGIS Pro + Field Maps + Survey123 + Collector + Workforce; Trimble TerraFlex + Pathfinder + Geo 7X / R8 / R12 GNSS; Davey TreeKeeper + ArborPro + PlanIT Geo TreePlotter + TreeSmartz + OpenTreeMap; Hancock Natural Resource Group + Weyerhaeuser + Rayonier + Potlatch + Sierra Pacific + West Fraser; Trace Register + Double Helix Tracking + Preferred by Nature + SGS for EUDR + CITES II.

## Cross-reference health

- Inbound refs: 4
- Orphans: 0

## Validation

`npx astro sync` clean (886 ms). Full-tree re-sync clean (876 ms) after batch inbound-top-up edits.

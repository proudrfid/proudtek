# Page 6/6 — rfid-anchor-bolt-tag

**Route**: `/products/rfid-tags/rfid-anchor-bolt-tag/`
**Task**: #207
**Status**: ✅ MID → DEEP complete

## Regulatory anchor

- ASTM F3125 / F3148 / F1554 / A354 / A193 / A320 / F436 structural fasteners
- AISC 360-22 J3 + AISC 303-22 Code of Standard Practice + RCSC Specification for Structural Joints (2020)
- ACI 318-19 Ch. 17 Anchoring to Concrete + ACI 355.2 mechanical anchors + ACI 355.4 adhesive anchors + ACI 562
- AASHTO LRFD Bridge Design Specifications + MBE + MBEI + FHWA 23 CFR §650.305 NBIS biennial inspection + NCHRP 798
- IEC 61400-6 Tower & Foundations + DNV-ST-0126 Support Structures for Wind Turbines + DNVGL-ST-0262 Wind Turbine Towers
- AREMA Ch. 15 Steel Structures (railway) + EN 1090-2 + EN 1993-1-8 + EN 14399 HV/HR system
- AWS D1.1 / D1.5 / D1.6 / D17.1 welding codes; ISO 12944 + NACE SP0492 + NORSOK M-501 coatings; 10 CFR 50 Appendix B Criterion XII

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

Six structural-fastener form factors: (1) laser-welded bolt-head tag (316L SS,
AWS D17.1), (2) drilled-anchor potted ceramic inlay, (3) under-washer disc
(ASTM F436 compatible), (4) weld-on boss (AWS D1.1 / D1.5 / D1.6), (5)
precast / cast-in-place embed, (6) seismic hold-down / ACI 355.4 adhesive-
anchor variant.

## Platforms

Bentley SYNCHRO + iTwin + AssetWise APM + InspectTech + OpenBridge, AASHTOWare
Bridge BrM, AgileAssets, ArcGIS GeoBIM, Trimble, Topcon, Maximo Linear Asset
Manager, FHWA NBI / NBIS, Siemens Gamesa, Vestas, GE Digital APM (Meridium),
DNV Nexus, DNV Veracity, UpWind, Bazefield, SAP S/4HANA Utilities, Oracle
WAM, Bentley OpenUtilities, Maximo Oil & Gas, AVEVA PI, Hexagon PAS PlantOps,
DNV Veracity / Bureau Veritas VIMS / Lloyd's Register TrustLens / ABS Class.

## Cross-reference health

- Inbound refs: 7
- Outbound unique: 9
- Orphans: 0. Repaired three: (a) imageSourceRoutes `/product/car-transponder-chip/` → `/products/rfid-tags/anti-metal-uhf-it-asset-tag/`; (b) imageSourceRoutes `/product/rfid-tag-with-led-light/` → `/products/rfid-tags/rfid-temperature-sensor-tag/`; (c) two instances of nonexistent `/products/rfid-tags/rfid-weld-mount-tag/` — one resourceCards link redirected to `/products/rfid-tags/rfid-concrete-embed-tag/` ("Concrete embed tags (ACI 318-19 Ch. 17 cast-in-place)") and one secondaryAction redirected to `/products/rfid-tags/rfid-magnet-mount-tag/` ("Magnet mount tags").

## Validation

`npx astro sync` clean (901 ms initial, 826 ms post-orphan-fix).

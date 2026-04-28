# Page 4/6 — rfid-tool-tracking-tag (calibration / metrology)

**Route**: `/products/rfid-tags/rfid-tool-tracking-tag/`
**Task**: #205
**Status**: ✅ MID → DEEP complete

## Regulatory anchor

- ISO/IEC 17025:2017 §7.8 reporting of results + ILAC-MRA accreditation
- ANSI/NCSL Z540.1 + Z540.3 + MIL-STD-45662A calibration-system requirements
- AS9100D §7.1.5.2 Measurement Traceability + IATF 16949 §7.1.5.2.1 MSA
- NAS 9300 Precision Measuring Equipment + AIAG MSA-4 + JCGM 100:2008 GUM
- GageTrak, Fluke MET/TEAM, Beamex CMX, Blue Mountain RAM, IndySoft, ProCalV5, CompuCal, ISOTRACK, Cert-In calibration-database platforms

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

Six calibration/metrology form factors: (1) micro inlay for gauge blocks,
(2) handle wrap for torque wrenches / calipers, (3) flat disc for micrometers,
(4) calibration-certificate case tag, (5) tilt-resistant rigid tag for CMM
probes, (6) GMP PEEK USP Class VI variant for pharma / medical-device labs.

## Platforms

GageTrak, Fluke MET/TEAM, Beamex CMX, Blue Mountain RAM, IndySoft, ProCalV5,
CompuCal, ISOTRACK, Cert-In, Veeva Vault QMS, MasterControl, Sparta TrackWise,
ETQ Reliance, Ideagen, Maximo, SAP S/4HANA, NAVAIR 17-35MTL-1 METCAL,
AFMETCAL, USA-PSM, NAVSEA 04XQ, INPO AP-929.

## Cross-reference health

- Inbound refs: 20
- Outbound unique: 10
- Orphans: 0 (imageSourceRoutes repaired from `/product/desfire-tag/` + `/product/rfid-tag-with-led-light/` to `/products/rfid-cards/mifare-desfire-ev3-card/` + `/products/rfid-tags/rfid-temperature-sensor-tag/`)

## Validation

`npx astro sync` clean (871 ms). Re-sync post-orphan-fix clean (826 ms).

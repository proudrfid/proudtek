# Batch 24 / Page 1 — rfid-blood-bag-tag

**Route:** `/products/rfid-tags/rfid-blood-bag-tag/`
**Upgrade:** MID → DEEP (full rewrite with Blocker C de-identification)
**Sync:** clean (Zod pass)
**Inbound:** 7 references

## What changed

- `keywords[6]`: "HF RFID blood bag tag", "ISBT 128 compliant RFID", "ICCBBA TR4-002 transfusion RFID", "AABB PPID blood management", "ISO 15693 HF transfusion tag", "EU Blood Directive 2002/98/EC RFID".
- `brief[]` 8 → 12 fields — adds Chip options (NXP ICODE SLIX2 / SLIX-S / DNA; TI Tag-it HF-I Plus; STMicro ST25DV), Frequency / air interface (13.56 MHz HF per ISO 15693-3:2019 + ISO 18000-3 Mode 1), ID scheme (ISBT 128 Data Structure 001 DIN + 003 product code + 008 expiry), Adhesive qualification ASTM D3330 Method A to blood-bag PVC, Read range (2-8 cm handheld, 10-20 cm pad reader at fridge, 30-50 cm fridge-shelf antenna), Biocompatibility ISO 10993-5 / -10 skin-contact assessment, Operating temperature -80 / +60 °C (covers FFP frozen storage -30 and cryoprecipitate -25 / RBC 2-6 / platelet 20-24), Compliance framework, Platform integration (SafeTrace Tx / HCLL / WellSky / Cerner PathNet Blood Bank / Epic Blood Bank / BloodTrack / Haemoband / Mak-System e-Delphyn).
- `statBar` on Challenges: 2-6 °C RBC storage / ISO 15693 HF band / ISBT 128 data-structure / >90% vs manual (AABB PPID evidence).
- `comparePanel` on "How Proud Tek solves": commodity HF sticker (untested blood-bag adhesion, random EPC, no ISBT 128 encoding, no SHOT / AABB alignment) vs Proud Tek transfusion-grade (ISBT 128 pre-encoded DS 001/003/008, ASTM D3330 adhesion qualification, biocompatibility ISO 10993-5/-10, SHOT / AABB documentation pack).
- Blocker C — prior "Results" section (>90% error reduction, 40-60% labor savings, 15-25% wastage reduction, zero SHOT events attributed to client) rewritten as "Deployment patterns integrators follow on transfusion-safety RFID programmes" with dataHighlight (>90% vs manual identification, citing SHOT Annual Report + AABB PPID evidence review) + 4-phase timeline (Weeks 1-3 ISBT 128 + LIS audit → 4-6 tag + adhesion qualification → 7-10 pilot hospital + HCLL / SafeTrace Tx wiring → Month 4+ multi-site SHOT / SMM closure).
- Sources: 10 at 5-field (ISBT 128, ICCBBA TR4-002, AABB Standards 33rd ed., FDA 21 CFR Part 606, EU Directive 2002/98/EC + 2005/61/EC, SHOT UK Annual Report 2024, ISO 15693-3:2019, CAP Transfusion Medicine Checklist, ISO 10993-1:2018, WHO Blood Products Policy).

## Standards cited

ISBT 128 · ICCBBA TR4-002 Implementation Guide for RFID in Blood Transfusion · AABB Standards for Blood Banks and Transfusion Services 33rd ed. · FDA 21 CFR Part 606 + §640 · EU Blood Directive 2002/98/EC · Commission Directive 2005/61/EC (traceability and serious adverse reactions) · SHOT UK Annual Report · ISO 15693-3:2019 · ISO/IEC 18000-3 Mode 1 · ISO 10993-5 / -10 · CAP Transfusion Medicine Checklist · WHO Blood Products Policy.

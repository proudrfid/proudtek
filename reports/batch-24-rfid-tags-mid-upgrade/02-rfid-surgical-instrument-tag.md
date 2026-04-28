# Batch 24 / Page 2 — rfid-surgical-instrument-tag

**Route:** `/products/rfid-tags/rfid-surgical-instrument-tag/`
**Upgrade:** MID → DEEP (full rewrite with Blocker C de-identification)
**Sync:** clean (Zod pass)
**Inbound:** 6 references

## What changed

- `keywords[6]`: "UHF RFID surgical instrument tag", "AAMI ST79 SPD RFID tracking", "EU MDR 2017/745 Art. 27-29 UDI", "ISO 17665-1 steam-sterilisable RFID", "FDA 21 CFR 830 UDI direct marking", "Joint Commission instrument count RFID".
- `brief[]` 8 → 13 fields — adds Frequency / air interface (860-960 MHz UHF EPC Gen2v2 ISO/IEC 18000-63 + 13.56 MHz HF ISO 15693 sub-option), Chip options (Impinj M775 + NXP UCODE 9xe + Murata LXMS31ACNA ceramic), Tag size (6×4 mm laser-weldable micro to 12×3 mm clip-on), Construction (zirconia / alumina ceramic + PEEK over-mould), Operating temperature -40 / +138 °C, Sterilization resistance (steam autoclave 134 °C / 18 min per ISO 17665-1:2006 + EN 285:2015+A1 at 500 cycles, STERRAD H2O2 NX / 100NX, EtO per ISO 11135, gamma 25-50 kGy), Chemical resistance (enzymatic cleaners pH 4-11, detergents, peracetic acid), Attachment (laser weld per AWS D17.1, mechanical clip, epoxy over-bond), Data standard GS1 UDI DI+PI per GS1 HUG + HIBC per ANSI/HIBC 2.6, Compliance framework, Platform integration (Censis CensiTrac / Getinge T-DOC / STERIS SPM / Steelco i-See / Haldor ORLocate / Mobile Aspects iRIScope + EHR Epic OpTime / Cerner SurgiNet / Meditech Surgery + UDI registries GUDID / EUDAMED), MOQ.
- `statBar` on Challenges: 134 °C steam autoclave per ISO 17665-1 / >500 sterilisation cycles retention / EU MDR Art. 27-29 UDI deadline / Joint Commission Sentinel Event Alert 51.
- `comparePanel` on "How Proud Tek solves": commodity RFID on instrument (no autoclave validation, no UDI encoding, unmanaged adhesion, no sterilisation-cycle retention data) vs Proud Tek SPD-grade (ISO 17665-1 + EN 285 validated ≥500 cycles, GS1 UDI DI+PI per FDA 21 CFR 830 + EU MDR Art. 27-29, AWS D17.1 laser weld or validated epoxy, Censis / T-DOC / SPM / ORLocate integration).
- Blocker C — prior "Results" section ($1.5M liability/case, $50K-$200K per tray, 22 min → 2 min, >95% reduction, 5-8% → <1% loss, $80K-$160K mid-size hospital write-offs, first-time AAMI ST79 compliance reviews without CAPA) rewritten as "Deployment patterns integrators follow on SPD / OR instrument-tracking programmes" with dataHighlight (minutes → seconds — tray-count time on reader-mat scan vs manual count, citing AAMI ST79:2022 + EU MDR 2017/745 Art. 27-29) + 4-phase timeline (Weeks 1-3 Tray master + UDI audit → 4-6 Tag spec + sterilisation qualification → 7-12 Pilot service line → Month 4+ Enterprise SPD roll-out).
- Sources: 10 at 5-field (AAMI ST79:2022, ISO 17665-1:2006, EN 285:2015+A1:2021, FDA 21 CFR Part 830 UDI, FDA 21 CFR §801.45 direct marking, EU MDR 2017/745, ISO 13485:2016, ISO 14971:2019, Joint Commission Sentinel Event + Alert 51, AORN Guidelines for Perioperative Practice 2024).

## Standards cited

AAMI ST79:2022 · ISO 17665-1:2006 · EN 285:2015+A1:2021 · FDA 21 CFR Part 830 UDI · FDA 21 CFR §801.45 direct marking · EU MDR 2017/745 Art. 27-29 UDI · ISO 13485:2016 · ISO 14971:2019 · ISO 15223-1:2021 · ISO 11135:2014 EtO · ISO/IEC 18000-63:2015 · GS1 HUG UDI · ANSI/HIBC 2.6 · AWS D17.1 · Joint Commission Sentinel Event Policy + Alert 51 · AORN Guidelines for Perioperative Practice 2024.

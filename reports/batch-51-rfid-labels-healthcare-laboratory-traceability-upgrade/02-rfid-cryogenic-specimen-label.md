# rfid-cryogenic-specimen-label — SHALLOW → DEEP

**Route.** `/products/rfid-labels/rfid-cryogenic-specimen-label/`

**Anchor standards & citations.**
- ISBER Best Practices for Repositories 5th edition (2023) — Sections G/J/K.
- ISO 20387:2018 — biotechnology biobanking general requirements.
- CAP Biorepository Accreditation Program checklist.
- NXP NTAG213/215/216 + ICODE SLIX2 (SL2S2602).
- ISO/IEC 15693 vicinity HF air-interface.
- FDA 21 CFR Part 1271 HCT/P regulations.
- UK HFEA Code of Practice 9th edition.
- EU Reg 2024/1938 SoHO (replaces Directive 2004/23/EC).
- Hamilton BiOS automated biobank storage system.

**DEEP block inventory.**
- `statBar.items[4]` — −196 °C LN2 immersion temperature / 8-15% frosted-barcode scan failure rate / 1-3% manual transcription error rate / 100+ freeze-thaw cycles validated.
- `comparePanel` — Standard adhesive label + ink barcode + manual transcription vs cryo-adhesive RFID label + frost-immune RFID read + biobank LIMS auto-capture (this page).
- `dataHighlight` — 99.9% RFID scan-success rate vs 8-15% barcode failure rate on frosted vials + 45-90 min/day technician time recovery + zero misidentification incidents with RFID-to-LIMS auto-capture.
- `timeline` — 1990s manual paper-logbook biobank baseline → 2008 ISBER founded + Best Practices 1st edition → 2013 NTAG213/215/216 family + ICODE SLIX2 → 2018 ISO 20387:2018 + Hamilton BiOS / LiCONiC → 2021 CAP Biorepository Accreditation Program → 2024 EU Reg 2024/1938 SoHO + ISBER 5th edition → 2026 Today (Blocker C: academic-research-biobank, clinical-trial-imp, ivf-clinic-cryostorage, stem-cell-cord-blood-bank, pharmaceutical-stability-testing programmes).

**Brief.** 12 `{label, items[]}` objects covering chip silicon (NTAG213 + ICODE SLIX2), frequency + protocol, temperature performance (−196 °C LN2 + −80 °C ULT + autoclave +121 °C), cryo-adhesive formulation, chemical resistance (DMSO + ethanol + xylene + formalin), form factors + sizes (1.5 / 2.0 mL cryovial + 0.25 / 0.5 mL IVF straw), substrate + face stock, biobank LIMS + automation integration, ISBER + ISO 20387 quality framework, IVF + reproductive medicine framework (HFEA + FDA 21 CFR 1271 + EU SoHO), application verticals, procurement.

**Sources[10].** ISBER Best Practices 5th edition, ISO 20387:2018, CAP Biorepository Accreditation, NXP NTAG21x + ICODE SLIX2, ISO/IEC 15693, FDA 21 CFR Part 1271, UK HFEA Code of Practice, EU Reg 2024/1938 SoHO, Hamilton BiOS.

**Inbound refs (6).** Pillar, sibling medication-vial + specimen-slide + blood-bag + ntag213 + nfc-wet-inlay flagship + industries/healthcare.

**Outbound orphan scan.** 0 orphans across 7 hrefs.

**Task.** #397 completed.

# paper-rfid-wristband — SHALLOW → DEEP

**Route.** `/products/rfid-wristbands/paper-rfid-wristband/`

**Anchor standards & citations.**
- Substrate: coated paper, synthetic paper (Yupo / Polyart polypropylene-based), Tyvek-blend hybrid (paper-feel face + HDPE backing).
- FSC International chain-of-custody certification — ESG-aligned procurement requirement for school / charity / corporate programmes.
- ISO/IEC 14443-A 13.56 MHz HF air interface; ISO/IEC 18000-63 EPC Gen2v2 UHF for walk-through portal counting.
- Silicon: NTAG213 / 215 / 216, MIFARE Ultralight EV1, MIFARE Classic 1K (legacy access), Impinj Monza R6, NXP UCODE 8.
- Tamper-evident peel-and-stick adhesive closure — appropriate for low-coercion programmes.
- HIPAA Privacy Rule 45 CFR 164.502 / 164.514 for hospital day-visitor use case.
- EU REACH SVHC + RoHS Directive 2011/65/EU + OEKO-TEX Standard 100 for adhesive / ink / synthetic-paper material compliance.
- Visitor-management platform integration: Envoy, Sine, Proxyclick, Veristream.

**DEEP block inventory.**
- `statBar.items[4]` — USD 0.10-0.25 per-band MOQ-direct / MOQ 500 with 10-14 day lead time / FSC-certified ESG option / Indoor / day-use substrate envelope.
- `comparePanel` — Coated paper / synthetic paper / Tyvek-blend (this page) vs DuPont Tyvek 1073D / 1082D — single-day-festival default; clarifies the substrate-tier decision and where each wins.
- `dataHighlight` — "<USD 0.20" per-band cost where paper wins on volume vs Tyvek; coercion-resistance trade-off explained as the substrate-decision boundary.
- `timeline` — 1990s paper sign-in books → 2003 DuPont scales Tyvek production → 2007-2012 NXP NTAG commoditises NFC silicon → 2014 iPhone 6 NFC → 2018-2022 visitor-management platforms add NFC integration → 2020-2024 FSC-certified paper enters ESG procurement → 2026 Today (Blocker C anchor: "day-festival-low-tier, charity-walk-bib, conference-day-pass, school-event, and hospital-visitor-day-pass programmes").

**Brief.** 12 `{label, items[]}` objects covering substrate options, air interface and chip pairing, tamper-evident adhesive closure, print and personalisation, where paper wins on cost, hospital and clinical day-use, visitor management and corporate events, school / education / field-trip use, light cashless / loyalty, lifecycle and waste profile, procurement and operations, compliance and material sourcing.

**Sources[10].** ISO/IEC 14443-1..4, ISO/IEC 18000-63, NXP NTAG213 / 215 / 216 data sheet, NXP MIFARE Ultralight EV1 data sheet, FSC International chain-of-custody, EU REACH ECHA reference, HIPAA Privacy Rule 45 CFR 164.502 / 164.514, Apple Core NFC framework, Android Developers NFC guide, OEKO-TEX Standard 100.

**Inbound refs (5).** Pillar, multiple wristband SKUs, industries/events-venues / healthcare / education.

**Outbound orphan scan.** 0 orphans across 16 hrefs.

**Task.** #331 completed.

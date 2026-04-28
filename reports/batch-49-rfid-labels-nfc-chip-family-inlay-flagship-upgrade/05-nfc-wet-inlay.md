# nfc-wet-inlay — SHALLOW → DEEP

**Route.** `/products/rfid-labels/nfc-wet-inlay/`

**Anchor standards & citations.**
- NFC Forum NDEF Technical Specification.
- NFC Forum Type 2 Tag + Type 4 Tag Technical Specification.
- ISO/IEC 14443-3:2018 Type A.
- ISO/IEC 7816-4 — APDU framing (NTAG 424 DNA Type 4).
- ISO/IEC 15693 — vicinity HF (ICODE SLIX2).
- NXP NTAG213/215/216 datasheet.
- NXP NTAG 424 DNA datasheet + AN12196 SUN authentication.
- NXP ICODE SLIX2 datasheet.
- Apple Core NFC documentation.
- GS1 Digital Link 1.3 — DPP forward-compatibility.

**DEEP block inventory.**
- `statBar.items[4]` — ±0.5 mm pitch tolerance converting-line compat / ±0.3 mm chip placement pharmaceutical-vial compat / 94.2% → 99.1% converting yield uplift / 3 days → 2 hours database seed time with UID-CSV.
- `comparePanel` — Generic wet-inlay supplier no pitch control / no UID log / mid-roll splices vs Proud Tek with custom pitch + UID-CSV + single-chip-batch (this page).
- `dataHighlight` — 94.2% → 99.1% converting-line yield uplift after switch to Proud Tek wet inlay; pharmaceutical mis-placed antenna failures 1.8% → 0.1% with ±0.3 mm placement tolerance.
- `timeline` — 2001 NFC Forum founded + ISO/IEC 14443 ratified → 2007-2013 NTAG21x family + ICODE SLIX evolution → 2014 Apple Pay + iPhone 6 NFC normalisation → 2017-2018 iOS Core NFC + iOS 12 background NDEF → 2018 NTAG 424 DNA + AES-128 SUN authentication → 2020-2024 smart packaging + NFC business card explosion → 2024-2025 DPP forward-compat + GS1 Digital Link 1.3 → 2026 Today (Blocker C: cosmetics-smart-label, pharmaceutical-vial-label, wine-capsule-label, ntag424-dna-brand-protection, nfc-business-card-printing programmes).

**Brief.** 12 `{label, items[]}` objects covering construction, chip silicon options (NTAG213/215/216, NTAG 424 DNA, ICODE SLIX2), substrate + adhesive (acrylic / rubber / removable / FDA-PSA), standard antenna sizes (Ø18-30 mm round + 12×19 / 45×76 mm rectangular), roll specifications (pitch + tolerance + chip placement), frequency + protocol, QC + chip integrity (single-chip-batch rolls + roll labelled batch code), pre-encoding services, UID inventory + traceability, application verticals, standards + compliance, procurement.

**Sources[10].** NFC Forum NDEF, NFC Forum Type 2 Tag, ISO/IEC 14443-3:2018, NXP NTAG213/215/216, NXP NTAG 424 DNA, NXP AN12196, NXP ICODE SLIX2, Apple Core NFC, ISO/IEC 15693, GS1 Digital Link 1.3.

**Inbound refs (16).** Pillar, sibling dry-inlay + ntag213/215/216 + NTAG 424 DNA flagship + many application-specific SKUs that reference inlay-stage components.

**Outbound orphan scan.** 0 orphans across 7 hrefs.

**Positioning.** Inlay-stage flagship for label-converter feed (with adhesive). Companion to dry inlay (without adhesive). Roll format on 3-inch core for flatbed laminator integration (Mark Andy / Nilpeter / Gallus / Bobst).

**Task.** #386 completed.

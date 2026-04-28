# rfid-prison-wristband — SHALLOW → DEEP

**Route.** `/products/rfid-wristbands/rfid-prison-wristband/`

**Anchor standards & citations.**
- Substrate: reinforced thermoplastic polyurethane (TPU); cut-resistance + chemical-resistance (bleach, quat-ammonium) + UV-tolerance specified above commodity PVC / silicone.
- Tamper-evidence: one-way locking clasp + frangible antenna trace — circuit breaks on cut / stretch / unbuckle, tamper event flagged in management system in seconds.
- ISO/IEC 18000-63 EPC Gen2v2 UHF (Impinj Monza M730 / R6-P, NXP UCODE 8 / 9) for ceiling-reader long-range automated headcount.
- ISO/IEC 14443-A HF (MIFARE DESFire EV2 / EV3 with AES-128 + per-card key diversification per NXP AN10922) for cryptographic positive-ID at medication / commissary / court-transport touchpoints.
- ACA (American Correctional Association) Performance-Based Standards governing inmate identification, headcount documentation, movement-tracking.
- NIJ (National Institute of Justice, U.S. DOJ) Inmate Tracking Technology research framework.
- PREA (Prison Rape Elimination Act) chain-of-custody requirements.
- Joint Commission Behavioural Health Care Standards for forensic-hospital adjacency.
- Inmate-management platforms: GUARDIAN RFID, Black Creek ISC, Keefe Group, ATG, Tyler Technologies, Securitas Healthcare.
- ISO 10993-5 / 10993-10 biocompatibility evaluation framework for prolonged-skin-contact TPU.

**DEEP block inventory.**
- `statBar.items[4]` — <1 minute automated headcount per housing unit / Frangible antenna trace breaks on cut / stretch / ACA Performance-Based Standards alignment / TPU 3-12 month continuous-wear service life.
- `comparePanel` — UHF-only (long-range headcount + zone tracking, low-to-medium security) vs UHF + HF dual-frequency (layered headcount + cryptographic positive-ID, medium-to-maximum security + behavioural-health locked-unit).
- `dataHighlight` — "<1 min" automated housing-unit headcount vs 15-30 minute manual count requiring movement lockdown.
- `timeline` — 1980s-90s photo-ID + barcode + paper-log → 2000s ACA Performance-Based Standards + NIJ research → 2008-2012 EPC Gen2 standardisation, GUARDIAN RFID / Black Creek ISC product launches → 2013-2017 first-gen tamper-evident TPU → 2018-2022 DESFire EV3 + dual-frequency layered architecture → 2022-2024 behavioural-health / forensic-hospital + immigration-detention adjacency → 2026 Today (Blocker C anchor: "county-jail-medium-security, behavioural-health-locked-unit, immigration-detention, federal-prison-RTLS, and juvenile-facility programmes").

**Brief.** 12 `{label, items[]}` objects covering substrate (reinforced TPU), air interface and chip pairing, tamper-evidence mechanism, ACA / NIJ / PREA compliance, headcount and zone tracking, positive-ID at high-stakes touchpoints, behavioural-health and forensic-hospital adjacency, immigration-detention and ICE processing, visual identification, corrections-platform integration, procurement and operations, regulatory and safety compliance.

**Sources[10].** ISO/IEC 18000-63, ISO/IEC 14443-1..4, Impinj Monza M730 / R6-P data sheet, NXP MIFARE DESFire EV3 data sheet, NXP AN10922, ACA Performance-Based Standards, NIJ Inmate Tracking Technology research, PREA Resource Center, GUARDIAN RFID platform reference, Joint Commission Behavioral Health Care Standards.

**Inbound refs (4).** Pillar, multiple wristband SKUs (UHF, hospital-patient-id, medical-alert), industries/government-defense-supply-chain / healthcare, solutions/rfid-patient-tracking.

**Outbound orphan scan.** 0 orphans across 15 hrefs.

**Task.** #339 completed.

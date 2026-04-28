# Batch 41 — RFID-wristbands flagship cluster SHALLOW → DEEP

**Scope.** Five flagship rfid-wristbands SKUs lifted to the current DEEP framework. The earlier rfid-wristbands work (Batches 6, 6b, 6c) predated the keywords[6] + brief[≥11 array of {label, items[]}] + statBar/comparePanel/dataHighlight/timeline + 5-field sources requirement, so each page audited as SHALLOW under today's checker. This batch covers the five most-distinctive use-case anchors of the wristband category: long-range UHF, cashless payment, silicone access (gym/pool), hospital patient-ID, and Tyvek single-day disposable.

**Pages.**
1. `uhf-rfid-wristband` — 860-960 MHz EPC Gen2v2 / ISO/IEC 18000-63; Impinj Monza R6/R6-P, NXP UCODE 8/9, Alien Higgs-9; on-body 4-7 dB loss recovery via body-tuned dipole + ferrite isolation; race-timing (ChampionChip 1989 lineage), conference attendance, healthcare RTLS, warehouse PPE-zone accountability.
2. `cashless-payment-rfid-wristband` — MIFARE DESFire EV3 AES-128 + SDM CMAC + per-card key diversification (NXP AN10922); on-chip stored value vs server-side wallet trade-off; PCI-DSS v4.0 scoping; EU PSD2 Art. 3(k) limited-network exemption; Intellitix / Glownet / PlayPass / Tappit / CrowdBlink platform compatibility.
3. `silicone-wristband-mifare-classic` — medical-grade platinum-cured silicone (FDA 21 CFR 177.2600 / EU REACH / ISO 10993-5/-10 framework); MIFARE Classic / Plus EV2 / DESFire EV3 chip-family decision; 16-sector partitioning (door / locker / wallet / loyalty); reusable per-use cost <USD 0.001 vs disposable Tyvek; Mindbody / ABC Fitness / PerfectGym integration.
4. `hospital-patient-id-wristband` — Joint Commission NPSG.01.01.01 (two patient identifiers); HIPAA Privacy Rule 45 CFR 164.502 / 164.514 PHI minimisation (non-PII serial on chip); NTAG213/216 + UHF RTLS option; Zebra HC100 direct-thermal printer baseline; Epic / Cerner / MEDITECH / Allscripts via HL7 + FHIR R4; latex-free synthetic + alcohol-wipe-survivable print.
5. `rfid-tyvek-wristband` — DuPont Tyvek 1073D / 1082D HDPE spunbond; VOID-on-removal tamper-evident closure (the operational mechanism behind one-person-one-band); per-band USD 0.20-0.40 disposable economics; chip pairing per use case (NTAG / Ultralight C / Monza R6-P / UCODE 9); Eventbrite / Universe / ShowClix / AXS / Ticketmaster ticketing-platform pre-encoding.

**Framework compliance.** Each page ships `keywords[6]`, `brief[12]` array-of-`{label,items[]}`, one of each titled DEEP block (`statBar`, `comparePanel`, `dataHighlight`, `timeline`), 10 five-field `sources[]`, and a Blocker C de-identification anchor phrase in the final timeline item. Audit script confirmed 5/5 PASS.

**Inbound references (≥4 target).**
- uhf-rfid-wristband: 7 refs
- cashless-payment-rfid-wristband: 17 refs
- silicone-wristband-mifare-classic: 10 refs
- hospital-patient-id-wristband: 9 refs
- rfid-tyvek-wristband: 12 refs

No host-page ref-boost edits required — the wristbands category already had strong cross-link density from the earlier upgrade waves.

**Orphan-ref scan.** Cross-checked against the full route set (content collections + legacy WP pages in `src/data/pages/` + `public/_redirects` sources). All 77 outbound hrefs across the five pages resolve; 0 orphans.

**Sync.** `npx astro sync` clean on every per-page pass and final pass.

**rfid-wristbands category status.** 5 of 18 wristband SKUs now at current DEEP framework standard. Remaining 13 (paper, vinyl, fabric, PVC, child, prison, waterpark, nylon, fitness, qr-nfc, adjustable-silicone, medical-alert, elastic) are candidates for Batch 42-43-44.

**Tasks.** #322 #323 #324 #325 #326 completed per-page; #327 Batch 41 verify completed; #321 parent closes on commit of these reports.

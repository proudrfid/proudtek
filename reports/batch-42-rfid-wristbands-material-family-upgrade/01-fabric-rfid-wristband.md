# fabric-rfid-wristband — SHALLOW → DEEP

**Route.** `/products/rfid-wristbands/fabric-rfid-wristband/`

**Anchor standards & citations.**
- Substrate: woven polyester / nylon-PA / Jacquard fabric, 15-16 mm typical width.
- ISO 105-X12 (rubbing) and ISO 105-E04 (perspiration) — colour-fastness benchmarks for multi-day festival wear.
- OEKO-TEX Standard 100 — textile-substrate certification framework for ESG-aligned festival programmes.
- ISO/IEC 14443-A (HF 13.56 MHz) and ISO/IEC 18000-63 (UHF 860-960 MHz EPC Gen2v2) for chip operation.
- NXP NTAG213 / 215 / 216, MIFARE DESFire EV3, Ultralight C; Impinj Monza R6 / R6-P UHF.
- One-way aluminium / plastic sliding lock — anti-share mechanism.
- Festival reference deployments: Coachella RFID-enabled fabric wristband (Intellitix case study).
- EU REACH SVHC + RoHS Directive 2011/65/EU clearance for sublimation dye stack and lock components.

**DEEP block inventory.**
- `statBar.items[4]` — 15-16 mm band width / ISO 105-X12 + E04 colour-fastness baseline / sublimation full-bleed dye-into-fibre / MOQ 500 with 15-20 day lead time, rush 10 days.
- `comparePanel` — Tyvek (single-day) / silicone (multi-year reusable) vs Fabric / woven (this page, multi-day premium festival, breathable, sublimation print).
- `dataHighlight` — "Edge-to-edge" full-bleed CMYK + Pantone spot, both faces, sealed in fibre via sublimation; explains why lead time runs 15-20 business days (registration and cure dominate, not chip complexity).
- `timeline` — 1969 Woodstock paper tickets → 1990s sublimation-print-on-polyester scales → 2000-2008 multi-day festivals standardise on fabric + slider → 2011 Coachella NFC fabric → 2014-2018 festival cashless on fabric + Ultralight C / NTAG → 2020-2024 DESFire EV3 + AES-128 → 2026 Today (Blocker C anchor: "music-festival-VIP, multi-day-camping-festival, premium-conference, brand-activation, and charity-gala programmes").

**Brief.** 12 `{label, items[]}` objects covering substrate options, air interface and chip pairing, one-way sliding lock, sublimation printing, closures and security finishes, pre-encoding to event platforms, multi-day comfort and hygiene, application contexts and positioning, sponsor / brand integration, lifecycle and post-event afterlife, procurement and rush options, compliance and material sourcing.

**Sources[10].** ISO/IEC 14443-1..4, ISO/IEC 18000-63, NXP NTAG213 / 215 / 216 data sheet, NXP MIFARE DESFire EV3 data sheet, ISO 105-X12, ISO 105-E04, OEKO-TEX Standard 100, EU REACH ECHA reference, Apple Core NFC framework, Coachella RFID-enabled fabric wristband case study.

**Inbound refs (12).** Strong cross-link density — pillar, multiple wristband SKUs, industries/events-venues / hospitality / retail-apparel, solutions/rfid-event-access-control, compare/silicone-vs-fabric-vs-woven-rfid-wristbands.

**Outbound orphan scan.** 0 orphans across 16 hrefs.

**Task.** #330 completed.

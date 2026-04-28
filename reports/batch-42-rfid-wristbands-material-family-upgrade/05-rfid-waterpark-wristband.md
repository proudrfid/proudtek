# rfid-waterpark-wristband — SHALLOW → DEEP

**Route.** `/products/rfid-wristbands/rfid-waterpark-wristband/`

**Anchor standards & citations.**
- Substrate: platinum-cured medical-grade silicone (LSR / HCR), Shore A 50-60 hardness.
- IP68 per IEC 60529 — continuous submersion at manufacturer-specified depth and duration; the realistic water-park season envelope.
- FDA 21 CFR 177.2600 — food-contact baseline for prolonged-skin-contact medical-grade silicone.
- ISO 10993-5 (cytotoxicity) and ISO 10993-10 (sensitisation) — biocompatibility evaluation framework reference.
- EU REACH SVHC + RoHS Directive 2011/65/EU compliance for silicone wristband material qualification.
- ISO/IEC 14443-A 13.56 MHz HF air interface.
- Silicon: NXP MIFARE DESFire EV2 / EV3 (AES-128 + Secure Dynamic Messaging), MIFARE Classic 1K (legacy estate), NTAG213 (entry-only); NXP AN10922 per-card key diversification.
- Cashless platforms: Semnox, Gateway Ticketing, Intercard, accesso, Vantage, Embed Card.
- Electronic locker systems: Foxtrot, Best Lockers, Ojmar, Digilock, Schulte-Schlagbaum.
- Ride-photo / PhotoPass platforms: PicSolve, DigiQuest, FotoZap.
- CRYPTO-1 academic break (Nohl/Plötz 2008) — drives DESFire upgrade for cashless deployments.

**DEEP block inventory.**
- `statBar.items[4]` — IP68 per IEC 60529 continuous submersion / DESFire EV3 AES-128 cashless default / Semnox / Gateway / Intercard / accesso platform compatibility / USD 0.80-1.60 per-band MOQ at season-pass volume.
- `comparePanel` — PVC IP67 mid-tier (single-stay reusable) / Tyvek single-day vs Water-park silicone IP68 — full submersion, season-pass tier (this page); clarifies why aquatic specifies IP68 not IP67.
- `dataHighlight` — "<USD 0.02" per-visit cost on an active season-pass member at 100+ visits / season; substrate-cost amortisation against multi-application revenue.
- `timeline` — 1990s paper / vinyl day-pass + manual entry → 2000-2008 MIFARE Classic + Semnox / Intercard / accesso scale water-park cashless → 2010-2014 silicone IP68 emerges as season-pass / member tier → 2015-2018 DESFire EV2 + on-chip stored-value default + Disney MagicBand / Universal TapuTapu consumer scale → 2018-2022 electronic locker integration + ride-photo platforms → 2020-2024 DESFire EV3 + Secure Dynamic Messaging + pre-season bulk procurement workflow → 2026 Today (Blocker C anchor: "water-park-multi-day, indoor-water-park, beach-resort, swim-club-membership, and hotel-pool-cabana programmes").

**Brief.** 12 `{label, items[]}` objects covering substrate (medical-grade silicone), air interface and chip pairing, IP68 vs IP67 distinction, closures for aquatic environments, antenna design for wet-environment performance, cashless-platform compatibility, locker integration, ride-photo / PhotoPass integration, sizing and family programmes, branding and personalisation, season-pass economics, procurement and operations.

**Sources[10].** IEC 60529 (IP Code), ISO/IEC 14443-1..4, NXP MIFARE DESFire EV3 data sheet, NXP AN10922 key diversification, FDA 21 CFR 177.2600, ISO 10993-5, ISO 10993-10, EU REACH ECHA reference, Semnox water-park cashless platform, Nohl/Plötz CRYPTO-1 cryptanalysis.

**Inbound refs (7).** Pillar, multiple wristband SKUs (silicone, adjustable-silicone, child, PVC, cashless, vinyl), industries/hospitality / events-venues, solutions/rfid-event-access-control.

**Outbound orphan scan.** 0 orphans across 16 hrefs.

**Task.** #334 completed.

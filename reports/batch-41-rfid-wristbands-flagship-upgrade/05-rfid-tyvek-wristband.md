# rfid-tyvek-wristband — SHALLOW → DEEP

**Route.** `/products/rfid-wristbands/rfid-tyvek-wristband/`

**Anchor standards & citations.**
- Substrate: DuPont Tyvek 1073D / 1082D — spunbond high-density polyethylene; tear-resistant, water-resistant (rain / sweat / splash; not submersible), lightweight (~50 gsm), printable, breathable.
- ISO/IEC 14443-A 13.56 MHz HF air interface (NTAG / Ultralight); ISO/IEC 18000-63 EPC Gen2v2 UHF for walk-through portal counting.
- Silicon: NTAG213 (144 B), NTAG215 (504 B), NTAG216 (888 B); MIFARE Ultralight EV1 (token-only), Ultralight C (3DES, NIST SP 800-67 TDEA, disposable-tier cashless); Impinj Monza R6-P / M730, NXP UCODE 8 / 9 (UHF).
- VOID-on-removal calibrated tamper-evident adhesive closure — the operational mechanism behind one-person-one-band policy.
- Reader-side regulatory: FCC 47 CFR Part 15 Subpart C (US), ETSI EN 302 208 (EU/UK), ARIB STD-T106 (Japan).
- Race-timing lineage: ChampionChip / MyLaps from 1989 Berlin Marathon onward.
- Theme-park reference: Disney MagicBand / Universal TapuTapu — body-worn NFC + UHF + cashless at consumer scale.
- Ticketing platforms: Eventbrite, Universe, ShowClix, Festicket, AXS, Ticketmaster.
- Cashless platforms: Intellitix, Glownet, PlayPass, Tappit, CrowdBlink.

**DEEP block inventory.**
- `statBar.items[4]` — USD 0.20-0.40 per-band MOQ-direct / VOID-on-removal tamper evidence / DuPont Tyvek 1073D/1082D / MOQ 1,000 with 14-day lead time, rush 7 days.
- `comparePanel` — Tyvek (this page, $ paper-label tier, single event lifecycle, VOID-on-removal closure, day festivals / concerts / conferences / nightclub age verification, water-resistant not submersible) vs Silicone / fabric / PVC (reusable / multi-day, $$-$$$ per-band, snap / watch-clasp / one-way-slider closures, gym / pool / resort / cruise programmes; breakeven sits around 3-5 reuses).
- `dataHighlight` — "Multi-x" per-lane gate throughput uplift on NFC tap vs barcode-scan baseline per published event-operations literature; sub-second tap vs 4-second visual barcode scan; UHF walk-through portal removes the deliberate-tap step entirely.
- `timeline` — 1989 ChampionChip Berlin Marathon → 1996 DuPont scales Tyvek production → 2000-2008 barcode wristbands at festivals → 2010-2014 Intellitix / Tappit / Glownet scale Tyvek + Ultralight C festival cashless → 2015 Disney MagicBand demonstrates body-worn credential at consumer scale → 2018-2022 iOS Core NFC + Android NFC universal no-app tap → 2026 Today (Blocker C anchor: "music-festival-multi-day, conference-attendee-badge, theme-park-day-pass, charity-walk-event, and single-night-club programmes").

**Brief.** 12 `{label, items[]}` objects covering substrate (DuPont Tyvek), air interface and chip pairing (NFC + UHF), VOID-on-removal closure, print and security finishes, pre-encoding to ticketing / cashless platforms, sizes and form factors (incl. backer-card variant), throughput and operations economics, cashless integration (Ultralight C + 3DES), conference / trade-show applications, disposable-band lifecycle and waste profile, procurement and rush options, compliance.

**Sources[10].** DuPont Tyvek 1073D / 1082D technical data sheet, ISO/IEC 14443-1..4, ISO/IEC 18000-63, NXP NTAG213 / 215 / 216 data sheet, NXP MIFARE Ultralight C (MF0ICU2) data sheet, NIST SP 800-67 Rev. 2 TDEA, Impinj Monza R6 / R6-P data sheet, NXP UCODE 9 product brief, FCC 47 CFR Part 15 Subpart C, Apple Core NFC framework.

**Inbound refs (12).** Pillar, multiple wristband SKUs, industries/events-venues / hospitality / education, solutions/rfid-event-access-control, blog/rfid-wristbands-festivals-events, compare/ucode8-vs-ucode9-vs-monza-r6-vs-higgs9, compare/ntag213-vs-ntag215-vs-ntag216.

**Outbound orphan scan.** 0 orphans across 17 hrefs.

**Task.** #326 completed.

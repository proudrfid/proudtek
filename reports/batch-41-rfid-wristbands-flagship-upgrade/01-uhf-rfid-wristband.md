# uhf-rfid-wristband — SHALLOW → DEEP

**Route.** `/products/rfid-wristbands/uhf-rfid-wristband/`

**Anchor standards & citations.**
- ISO/IEC 18000-63 — UHF 860-960 MHz EPC Gen2v2 air interface.
- FCC 47 CFR Part 15 Subpart C (US, 36 dBm EIRP), ETSI EN 302 208 (EU/UK, 33 dBm ERP with LBT), ARIB STD-T106 (Japan).
- Silicon: Impinj Monza R6 / R6-P (auto-tune, AutoPilot), NXP UCODE 8 / 9 (~3 dB sensitivity uplift on 9), Alien Higgs-9 (688-bit user memory).
- RAIN RFID Alliance read-range test methodology.
- Race-timing lineage: ChampionChip / MyLaps from the 1989 Berlin Marathon onward.
- HIPAA Privacy Rule 45 CFR 164.502 / 164.514 for healthcare RTLS use cases.
- Theme-park reference deployments: Disney MagicBand, Universal TapuTapu (UHF + NFC dual-frequency at consumer scale).

**DEEP block inventory.**
- `statBar.items[4]` — 1-5 m on-body read range / 700-1,000 reads/sec bulk throughput / ISO 18000-63 EPC Gen2v2 air interface / MOQ 200 silicone.
- `comparePanel` — NFC (13.56 MHz, intentional tap, 2-5 cm, smartphone-readable, payment / access use) vs UHF (860-960 MHz, hands-free 1-5 m, bulk read, requires UHF reader infra, timing / tracking / counting / RTLS use).
- `dataHighlight` — "4-7 dB" typical on-body loss vs free-space; reader-antenna gain dominates achievable range; same wristband reads at 1.5-2 m on 6 dBic patch vs 3-5 m on 9 dBic high-gain panel.
- `timeline` — 1989 ChampionChip Berlin Marathon → 2004 EPC Gen2 v1 → 2008-2012 retail volumes commoditise silicon → 2013 ISO/IEC 18000-63 → 2015-2018 Disney MagicBand / Universal TapuTapu → 2020-2024 UCODE 9 + Impinj M700-series readers → 2026 Today (Blocker C anchor: "marathon-half-marathon, theme-park-multi-day, conference-attendee-tracking, warehouse-PPE-compliance, and military-personnel-accountability programmes").

**Brief.** 12 `{label, items[]}` objects covering air interface and standards, silicon options, on-body antenna design, read range / reader-matters, bulk read and anti-collision, wristband substrate options, race timing context, conference and venue attendance, healthcare RTLS adjacency, industrial / PPE-zone use, programme economics and MOQ, compliance and end-of-life.

**Sources[10].** ISO/IEC 18000-63, Impinj Monza R6 / R6-P data sheet, NXP UCODE 9 product brief, Alien Higgs-9 brief, FCC 47 CFR Part 15 Subpart C, ETSI EN 302 208, RAIN RFID Alliance, ChampionChip / MyLaps, HIPAA Privacy Rule 45 CFR 164.502 / 164.514, Disney MagicBand / Universal TapuTapu reference.

**Inbound refs (7).** Cross-linked from `_pillar`, multiple wristband SKUs, industries/events-venues, healthcare, industrial, and the UHF-chip compare page.

**Outbound orphan scan.** 0 orphans across 15 hrefs.

**Task.** #322 completed.

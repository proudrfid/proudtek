# rfid-card-magnetic-stripe-combo — SHALLOW → DEEP

**Route.** `/products/rfid-cards/rfid-card-magnetic-stripe-combo/`

**Anchor standards & citations.**
- ISO/IEC 7811 family — the magnetic-stripe standard: Part 2 (magnetic characteristics), Part 6 (HiCo ~2750 Oe, up to 4000 Oe for airline/transit durability), Part 7 (LoCo ~300 Oe), Part 8 (financial-variant coercivity).
- ISO/IEC 7813 — Track 1 (79 char IATA), Track 2 (40 char ABA), Track 3 (107 char ISO/IEC 4909 read-write) layouts; Track 2 / Track 3 typical in hospitality and campus.
- ISO/IEC 7810 ID-1 geometry; ISO/IEC 10373-1 / 10373-2 durability including magstripe survivability.
- ISO/IEC 14443-A 13.56 MHz RFID rail (MIFARE Classic 1K / DESFire EV3 / Ultralight EV1, NTAG 213/216, HID iCLASS SE/SEOS compatible).
- PCI-DSS v4.0 — applies only when Track-2 carries payment data; facility-access-only combo cards are out of scope.
- PMS / campus-card platforms: Oracle Opera Cloud, Mews, Cloudbeds, Infor HMS, Protel (hospitality); CBORD, Transact (formerly Blackboard), Atrium, Heartland OneCard (campus) — all card-source-agnostic.
- Historical anchor: Forrest Parry / IBM 1969 magstripe prototype (IBM archive).

**DEEP block inventory.**
- `statBar.items[4]` — HiCo 2750 Oe default (up to 4000 Oe) / ISO 7811 standard family / 18-36 mo typical migration / USD 0.05-0.10 stripe premium.
- `comparePanel` — LoCo (300 Oe, ISO 7811-7, ~USD 0.02-0.04, demagnetises near handsets) vs HiCo (2750-4000 Oe, ISO 7811-6, ~USD 0.05-0.10, 5-yr hospitality lifecycle).
- `dataHighlight` — "USD 0.05-0.10" per-card stripe premium; ROI explanation showing payback inside first migration quarter vs parallel two-card issuance.
- `timeline` — 1969 Parry / IBM magstripe → 1971 ISO 7811 → 1994 NXP MIFARE Classic → 2015 EMV liability shift → 2019 DESFire EV3 → 2022-25 mobile key scales → 2026 Today (Blocker C anchor: "hospitality-legacy-PMS, university-multi-system, healthcare-legacy-badge, transit-interim, and enterprise-migration programmes").

**Brief.** 12 `{label, items[]}` objects covering why combo cards exist, magnetic-stripe standards and coercivity choice, magstripe track structure, RFID chip matrix, physical construction and durability, encoding workflow (dual-rail in one pass), PMS/campus-card compatibility, printing/personalisation, PCI awareness, lifecycle/migration economics, supply chain/MOQ, and end-of-life.

**Sources[10].** ISO/IEC 7811 series, ISO/IEC 7810, ISO/IEC 7813 (financial transaction cards), ISO/IEC 14443, ISO/IEC 10373-1, NXP MIFARE Classic 1K, NXP MIFARE DESFire EV3, PCI DSS v4.0, Oracle Opera Cloud Hospitality PMS, IBM Forrest Parry magstripe history.

**Inbound refs (5).** `_pillar`, `rfid-card-assa-abloy-compatible`, `solutions/hotel-key-cards`, `industries/hospitality`, `industries/education`.

**Outbound orphan scan.** 0 orphans across 10 hrefs.

**Task.** #315 completed.

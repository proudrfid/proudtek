# ntag216-nfc-sticker — SHALLOW → DEEP

**Route.** `/products/rfid-labels/ntag216-nfc-sticker/`

**Anchor standards & citations.**
- NXP NTAG216 (NT2H1611G0DU) — high-memory NFC Forum Type 2 Tag.
- Capability container byte: 0xE1 0x10 0x6D 0x00 (verification anchor).
- ISO/IEC 14443-3 Type A.
- NFC Forum Type 2 Tag + NDEF + URI / Smart Poster RTD.
- IETF RFC 6350 vCard 4.0.
- Wi-Fi Alliance WSC / WPS.
- Bluetooth SIG NFC Out-of-Band Pairing.
- Apple Core NFC framework (iOS 14+).
- Android NFC API.
- GS1 Digital Link 1.3 — DPP forward-compatibility.

**DEEP block inventory.**
- `statBar.items[4]` — 888 byte user memory 6x NTAG213, 1.76x NTAG215 / 350-700 byte typical full vCard 4.0 fits with 200+ byte headroom / multi-record NDEF support / MOQ 100 variable encoding.
- `comparePanel` — Generic NFC supplier no CC verification vs Proud Tek with capability-container byte cert + multi-platform compat report (this page).
- `dataHighlight` — ~872 char maximum NDEF payload within 888-byte user memory after overhead.
- `timeline` — 2001 NFC Forum founded → 2011 IETF RFC 6350 vCard 4.0 → 2013 NTAG213/215/216 family launches → 2014-2017 NFC business card explosion → 2018 iOS 12 background NFC + multi-record dispatch → 2020-2023 smart packaging + healthcare patient-info adoption → 2024-2025 DPP forward-compat + GS1 Digital Link 1.3 → 2026 Today (Blocker C: nfc-business-card-printing, smart-packaging-product-data, healthcare-patient-info, multi-record-tourism-tag, electronics-pairing programmes).

**Brief.** 12 `{label, items[]}` objects covering chip silicon, memory architecture, RF + protocol, form factors + sizes, substrate options, NDEF data record types supported (URI / Text / vCard / Wi-Fi WSC / Bluetooth handover / Smart Poster / Geo / Custom binary), vCard data model (full RFC 6350 4.0), multi-record NDEF testing (iOS 14+ / Android 8.x-10+ compat), application verticals, comparison vs NTAG family + NTAG 424 DNA, standards + compliance, procurement.

**Sources[10].** NXP NTAG213/215/216 datasheet, ISO/IEC 14443-3, NFC Forum Type 2 Tag, NFC Forum NDEF, IETF RFC 6350 vCard, Wi-Fi Alliance WSC, Apple Core NFC, Android NFC API, Bluetooth SIG NFC OOB, GS1 Digital Link 1.3.

**Inbound refs (14).** Pillar, sibling NTAG213 / 215 / NTAG 424 DNA flagship + NFC business card / smart-packaging / healthcare patient-info / DPP-adjacent SKUs + chip-family encyclopedia.

**Outbound orphan scan.** 0 orphans across 7 hrefs.

**Positioning.** High-memory chip-family-anchor — full RFC 6350 vCard 4.0 without truncation, multi-record NDEF, smart packaging. Cost positioning ~20% premium over NTAG215, ~50% premium over NTAG213.

**Task.** #384 completed.

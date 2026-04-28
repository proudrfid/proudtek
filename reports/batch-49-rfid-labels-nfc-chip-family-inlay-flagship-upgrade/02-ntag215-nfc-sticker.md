# ntag215-nfc-sticker — SHALLOW → DEEP

**Route.** `/products/rfid-labels/ntag215-nfc-sticker/`

**Anchor standards & citations.**
- NXP NTAG215 (NT2H1511G0DU) — mid-tier NFC Forum Type 2 Tag.
- ISO/IEC 14443-3 Type A.
- NFC Forum Type 2 Tag + NDEF + URI RTD.
- Wi-Fi Alliance WSC / WPS Wi-Fi NFC handover spec.
- IETF RFC 6350 vCard 4.0 format.
- Nintendo Amiibo hardware reference (NTAG215 chip specification).
- Apple Core NFC framework (iOS 14+).
- Android NFC API + NDEF tag dispatch.
- Bluetooth SIG NFC Out-of-Band Pairing.

**DEEP block inventory.**
- `statBar.items[4]` — 504 byte user memory 3.5x NTAG213 / Amiibo-spec exact chip Nintendo selected / MOQ 100 variable encoding / ~492 char maximum URL.
- `comparePanel` — Generic NFC supplier no chip verification vs Proud Tek with chip-type cert + Amiibo-format encoding + variable per-tag (this page).
- `dataHighlight` — 540-byte Nintendo Amiibo data structure exactly matches NTAG215 capacity (NTAG213 too small, NTAG216 wrong layout).
- `timeline` — 2001 NFC Forum founded → 2010-2012 Wi-Fi Alliance Simple Configuration NDEF → 2013 NTAG213/215/216 family launches → 2014 Nintendo selects NTAG215 for Amiibo → 2017 Nintendo Switch + Joy-Con NFC reader → 2018 iOS 12 background NFC → 2020-2024 tabletop game + loyalty NFC adoption → 2026 Today (Blocker C: amiibo-figure-accessory, wifi-share-router-config, vcard-trade-show-badge, tabletop-game-character-card, loyalty-punch-card programmes).

**Brief.** 12 `{label, items[]}` objects covering chip silicon, memory architecture, Amiibo compatibility specification (540 byte Amiibo data), RF + protocol, form factors + sizes, substrate options, adhesive options, NDEF data record types supported (URI / Text / vCard / Wi-Fi WSC / Bluetooth handover / Smart Poster), application verticals, comparison vs NTAG family + NTAG 424 DNA, standards + compliance, procurement.

**Sources[10].** NXP NTAG213/215/216 datasheet, ISO/IEC 14443-3, NFC Forum Type 2 Tag, NFC Forum NDEF, Wi-Fi Alliance WSC, IETF RFC 6350 vCard, Nintendo Amiibo hardware, Apple Core NFC, Android NFC API, Bluetooth SIG NFC OOB.

**Inbound refs (9).** Pillar, sibling NTAG213 / 216 / NTAG 424 DNA flagship + chip-family encyclopedia + Amiibo-adjacent gaming / tabletop SKU pages.

**Outbound orphan scan.** 0 orphans across 7 hrefs.

**Positioning.** Mid-tier chip-family-anchor — exact Nintendo Amiibo chip specification + Wi-Fi-share + full vCard. Cost positioning ~30-40% premium over NTAG213, ~20% discount vs NTAG216.

**Task.** #383 completed.

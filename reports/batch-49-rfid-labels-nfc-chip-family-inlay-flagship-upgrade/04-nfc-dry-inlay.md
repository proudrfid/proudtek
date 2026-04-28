# nfc-dry-inlay — SHALLOW → DEEP

**Route.** `/products/rfid-labels/nfc-dry-inlay/`

**Anchor standards & citations.**
- ISO/IEC 7810:2019 — CR-80 card dimensions (85.60 × 53.98 × 0.76 mm) + surface planarity.
- ISO/IEC 14443 Type A / B — 13.56 MHz HF proximity air interface.
- ISO/IEC 7816-4 — APDU framing (NTAG 424 DNA Type 4).
- ISO/IEC 15693 — vicinity HF (ICODE SLIX2).
- NXP MIFARE DESFire EV3 datasheet.
- NXP NTAG213/215/216 datasheet.
- NFC Forum Type 2 Tag Technical Specification.
- EMVCo Contactless Specifications Book D — payment card certification.
- ICAO Doc 9303 — machine-readable travel documents (high-security ID polycarbonate).
- GlobalPlatform Card Specification — DESFire application management.
- Bürkle hydraulic platen press — typical card-bureau lamination cycle reference.

**DEEP block inventory.**
- `statBar.items[4]` — 150 °C standard PVC card lamination temp / ±2 µm substrate thickness ISO 7810 planarity / 3.8% → 0.2% lamination defect rate uplift / 0 chip-substitution incidents 12-month track.
- `comparePanel` — Generic dry-inlay supplier no-QA vs Proud Tek with lamination report + chip-cert + prelam (this page).
- `dataHighlight` — 3-5 cm read distance in CR-80 PVC card body (consumer phone tap) / 5-8 cm dedicated reader; antenna detune ≤±5% from PVC dielectric loading.
- `timeline` — 1985 ISO 7810 first edition → 1996 MIFARE Classic + ISO/IEC 14443 → 2001 NFC Forum founded → 2008-2013 NTAG family + DESFire EV1/EV2 launch → 2014 Apple Pay + global contactless payment → 2017 NFC Forum Type 4 Tag + Apple Core NFC → 2020-2024 NFC business cards + healthcare credentials → 2026 Today (Blocker C: bank-card-bureau, hotel-key-card-manufacturer, corporate-access-badge, key-fob-injection-mould, silicone-wristband-converter programmes).

**Brief.** 12 `{label, items[]}` objects covering construction, chip silicon options (NTAG213/215/216, MIFARE Classic 1K/4K, DESFire EV2/EV3, Ultralight C/EV1, ICODE SLIX2, NTAG 424 DNA), substrate + thickness control, standard dimensions, lamination compatibility (PVC / polycarbonate / PET-G / Bürkle / Wickert / Agfa), read distance + RF tuning, pre-encoding services, prelam sheet service, application verticals, chip-type certification + QC, standards + compliance, procurement.

**Sources[10].** ISO/IEC 7810:2019, ISO/IEC 14443, NXP MIFARE DESFire EV3, NXP NTAG213/215/216, NFC Forum Type 2 Tag, EMVCo Book D, ICAO Doc 9303, GlobalPlatform Card Spec, ISO/IEC 15693, Bürkle hydraulic press.

**Inbound refs (8).** Pillar, sibling wet-inlay + ntag213/215/216 + UHF inlay flagship products + card-manufacturing related SKUs.

**Outbound orphan scan.** 0 orphans across 6 hrefs.

**Positioning.** Inlay-stage flagship for card-bureau lamination + injection-mould embedding (no adhesive). Companion to wet inlay (with adhesive). Survives 140-150 °C PVC + 160-180 °C polycarbonate lamination cycles.

**Task.** #385 completed.

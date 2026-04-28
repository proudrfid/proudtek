# rfid-wristband-qr-nfc — SHALLOW → DEEP

**Route.** `/products/rfid-wristbands/rfid-wristband-qr-nfc/`

**Anchor standards & citations.**
- ISO/IEC 14443-A 13.56 MHz HF NFC (NTAG213 / 215 / 216, MIFARE Ultralight EV1 / C, Classic 1K, Plus EV2, DESFire EV2 / EV3) for the NFC rail.
- ISO/IEC 18004 — international QR Code symbology standard (module structure, error-correction levels L / M / Q / H, encoding modes) for the QR rail.
- GS1 Digital Link 1.3 URI Syntax — cross-rail URL structure that lets NFC NDEF and QR Code encode the same identifier scheme.
- DENSO WAVE — QR Code history and specification (1994 invention, ISO/IEC 18004 first edition 2000).
- Substrate variants: silicone (laser-engraved QR, IP68 multi-month wear), fabric (sublimation QR, multi-day festival), Tyvek HDPE (thermal-flexo QR, single-day disposable), PVC IP67 (UV-cured QR, mid-tier reusable).
- Reader-redundancy as design principle — Eventbrite / Live Nation / AEG event-operations literature consistently identifies it as the largest reliability lever in large-audience gate operations.
- CRYPTO-1 academic break (Nohl/Plötz 2008) — drives DESFire upgrade for cashless deployments on the NFC rail.
- Industrial barcode scanners: Zebra DS3608, Honeywell Granit, Datalogic PowerScan — read the QR rail without NFC infrastructure.
- Cashless platforms: Intellitix, Glownet, PlayPass, Tappit, CrowdBlink — accept dual-credential UID + QR mapping CSV / JSON.

**DEEP block inventory.**
- `statBar.items[4]` — ISO/IEC 18004 QR Code standard / ISO/IEC 14443-A NFC HF air interface / GS1 Digital Link cross-rail URI grammar / MOQ 500-1,000 substrate-dependent.
- `comparePanel` — QR rail (camera / barcode-scanner universal, accessibility / multi-language / industrial-scanner / EMS-handheld coverage) vs NFC rail (smartphone tap, dynamic NDEF, cashless DESFire EV3, cryptographic anti-clone).
- `dataHighlight` — "Two rails" independent reader paths on one credential; gate-redundancy + older-phone fallback + industrial-scanner integration + marketing dual-rail value.
- `timeline` — 1994 DENSO WAVE invents QR Code → 2000 ISO/IEC 18004 first edition → 2000-2010 barcode wristbands + parallel NFC silicon commoditisation → 2014 Apple Pay normalises NFC tap → 2017-2019 GS1 Digital Link URI grammar publishes → 2020-2022 COVID drives QR-scanning fluency → 2022-2024 festival cashless platforms standardise on dual-credential support → 2026 Today (Blocker C anchor: "corporate-event-conference, brand-activation-marketing, multi-language-tourism, accessibility-low-tech, and sponsor-engagement programmes").

**Brief.** 12 `{label, items[]}` objects covering reader-redundancy as design principle, QR code standard and encoding, air interface and chip pairing for the NFC rail, substrate options, QR durability per substrate, closure variants, pre-encoding and platform integration, marketing parallel-rail use, accessibility and tourism use, EMS / industrial-scanner fallback, branding and personalisation, procurement and operations.

**Sources[10].** ISO/IEC 14443-1..4, ISO/IEC 18004 QR Code standard, GS1 Digital Link 1.3 URI Syntax, NXP NTAG213 / 215 / 216 data sheet, NXP MIFARE DESFire EV3 data sheet, NXP AN10922, DENSO WAVE QR Code history, Apple Core NFC framework, Nohl/Plötz CRYPTO-1 cryptanalysis, Glownet platform reference.

**Inbound refs (4).** Pillar, multiple wristband SKUs, industries/events-venues, solutions/rfid-event-access-control.

**Outbound orphan scan.** 0 orphans across 14 hrefs.

**Task.** #342 completed.

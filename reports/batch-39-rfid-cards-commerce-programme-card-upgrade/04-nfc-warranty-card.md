# nfc-warranty-card — SHALLOW → DEEP

**Route.** `/products/rfid-cards/nfc-warranty-card/`

**Anchor standards & citations.**
- NTAG213 baseline (paper/PVC carrier) + NTAG424 DNA with SUN (Secure Unique NFC) AES-128 message — the anti-counterfeit tier for luxury / high-value warranties.
- NFC Forum NDEF 1.0 + URI RTD — warranty-registration URL payload readable by default iOS/Android without app install.
- GS1 Digital Link — standardized URL grammar that binds GTIN, serial, lot, expiry into a single URI.
- U.S. Magnuson-Moss Warranty Act 15 U.S.C. § 2301 — anti-tying limits + disclosure-schedule requirements for written warranties >USD 15.
- EU Directive 2019/771 (Sale of Goods) — two-year conformity guarantee baseline for consumer contracts.
- EU ESPR (Regulation (EU) 2024/1781) — Digital Product Passport obligation, with NFC/QR identified as the accepted data-carrier class.
- Apple Core NFC "Background Tag Reading" (iOS 14+) — no-app tap UX.

**DEEP block inventory.**
- `statBar.items[4]` — <10% paper-warranty activation → 30-50% NFC activation / ~30s registration time / NTAG424 DNA available option / MOQ 1000.
- `comparePanel` — NFC warranty card vs paper + serial + QR vs app-based registration across activation rate, anti-counterfeit, legal defensibility, DPP-readiness.
- `dataHighlight` — "4-5× lift" — paper <10% → NFC 30-50% activation as reported in published warranty-registration studies.
- `timeline` — 1975 Magnuson-Moss → 2002 NTAG/ISO 14443 adoption → 2019 EU Directive 2019/771 → 2024 ESPR / DPP regulation → 2026 Today (Blocker C anchor: "consumer-electronics-launch, appliance-warranty, luxury-certificate-of-authenticity, medical-device-UDI-registration, and DPP-pilot programmes").

**Brief.** 12 `{label, items[]}` objects covering chip tier choice (213 / 216 / 424 DNA), NDEF URI RTD payload, GS1 Digital Link encoding, Magnuson-Moss compliance posture, EU Directive 2019/771 + ESPR adjacency, tap UX on iOS + Android, anti-counterfeit SUN flow, packaging insertion, personalization/serial, CRM integration, analytics, and end-of-life.

**Sources[10].** NFC Forum NDEF spec, NXP NTAG213/216 data sheet, NXP NTAG424 DNA data sheet, GS1 Digital Link 1.3, Magnuson-Moss Act, EU Directive 2019/771, EU ESPR 2024/1781, Apple Core NFC docs, Android NFC docs, warranty-registration industry study.

**Inbound refs (4).** `_pillar`, `lp/custom-rfid-card-printing`, `industries/brand-protection`, `solutions/digital-product-passport`.

**Outbound orphan scan.** 0 orphans across 6 hrefs.

**Task.** #309 completed.

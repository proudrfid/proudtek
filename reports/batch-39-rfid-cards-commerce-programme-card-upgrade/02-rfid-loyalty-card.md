# rfid-loyalty-card — SHALLOW → DEEP

**Route.** `/products/rfid-cards/rfid-loyalty-card/`

**Anchor standards & citations.**
- Bond Brand Loyalty "Loyalty Report" — consumers hold ~16 loyalty programme enrolments vs ~7 active enrolments; structural gap between acquisition and engagement.
- EU GDPR (EU) 2016/679 — Art. 6 lawful-basis choice (consent / legitimate-interest for tiered rewards), Art. 15 access, Art. 17 erasure, Art. 20 portability.
- PCI-DSS v4.0 — when loyalty stacks with tokenized payment, cardholder-data boundaries and segmentation controls.
- ISO/IEC 15416 — barcode print-quality grades (A/B acceptable for POS legacy scanners).
- NXP NTAG213/216, MIFARE Classic 1K data sheets.
- Apple Wallet Passes / Google Wallet — digital-card mirroring of physical loyalty credential.

**DEEP block inventory.**
- `statBar.items[4]` — ~16 enrolments vs ~7 active / <100ms read / MOQ 500 printed / 100 blank / GDPR Art. 6 lawful-basis.
- `comparePanel` — RFID/NFC loyalty credential vs app-only vs magstripe/barcode across read speed, phone mirroring, anti-counterfeit, integration complexity.
- `dataHighlight` — "~7 of 16" active-use gap; the structural problem physical-tap solves by reducing friction at the counter.
- `timeline` — 1981 AAdvantage → 2012 NFC consumer devices → 2016 GDPR → 2026 Today (Blocker C anchor: "retail-chain-rewards, coffee-chain-visit-frequency, pharmacy-membership, cinema-loyalty, and grocery-co-op programmes").

**Brief.** 12 `{label, items[]}` objects covering chip selection, enrolment UX, tiered-rewards architecture, GDPR lawful-basis stack, PCI adjacency, Apple/Google Wallet mirroring, artwork, barcode-panel fallback, POS integration, analytics, supply chain, and decommissioning.

**Sources[10].** Bond Loyalty Report, GDPR text, PCI-DSS v4.0, ISO/IEC 15416, NTAG data sheet, MIFARE Classic 1K data sheet, Apple PassKit docs, Google Wallet API, ASC 606 breakage note, retail-loyalty industry study.

**Inbound refs (5).** `_pillar`, `rfid-gift-card`, `lp/custom-rfid-card-printing`, `lp/bulk-rfid-cards`, `industries/retail-apparel`.

**Outbound orphan scan.** 0 orphans across 5 hrefs.

**Task.** #307 completed.

# dual-frequency-rfid-card — SHALLOW → DEEP (+ alternate-naming dedup)

**Route.** `/products/rfid-cards/dual-frequency-rfid-card/`

**Anchor standards & citations.**
- Frequency standards: ISO/IEC 18000-2 (LF 125 kHz), ISO/IEC 14443 Type A / ISO/IEC 15693 (HF 13.56 MHz), ISO/IEC 18000-63 / EPC Gen2v2 (UHF 860-960 MHz).
- LF silicon: EM4100 (read-only 64-bit), EM4200, T5577 (rewritable LF emulator), HID Prox (H10301 / Corporate 1000).
- HF silicon: NXP MIFARE Classic 1K (MF1ICS50), MIFARE DESFire EV3 (AES-128), NTAG216, HID Global iCLASS SE / SEOS.
- UHF silicon: Impinj Monza R6 / R6-P, NXP UCODE 8 / 9.
- ISO/IEC 7810 ID-1 (0.84 mm dual-layer antenna stack remains within tolerance); ISO/IEC 10373-1 durability.
- ACS integration targets: HID ProWatch, Lenel OnGuard / Mercury, Genetec Security Center, Software House C•CURE 9000, Honeywell Pro-Watch, Gallagher Command Centre.

**DEEP block inventory.**
- `statBar.items[4]` — 0.84 mm card thickness / 12-36 month typical access-migration horizon / 30-40% card-loss drop vs two-card / 60-70% help-desk ticket reduction.
- `comparePanel` — LF 125 kHz + HF 13.56 MHz (access-migration pairing, transitional 12-36 mo) vs HF + UHF 860-960 MHz (converged-credential pairing, steady-state).
- `dataHighlight` — "60-70%" typical reduction in access-related help-desk tickets vs parallel two-card issuance; USD 15-25 per ticket × 2,000 tickets/yr illustrative ROI; also 35-50% per-employee credential-cost reduction for HF+UHF converged programmes.
- `timeline` — 1980s-90s 125 kHz LF dominance → 1994 NXP MIFARE Classic → 2004-08 EPC Gen2 / UHF standardisation → 2008 Crypto-1 break → 2014-18 iCLASS SE / DESFire EV2 migration wave → 2020-24 DESFire EV3 + mobile key → 2026 Today (Blocker C anchor: "legacy-bridge, multi-site-multi-system, transit-with-access, university-legacy-migration, and hospital-dual-system programmes").

**Brief.** 12 `{label, items[]}` objects covering frequency pairings supported, chip combinations shipped, air-interface standards, antenna architecture & isolation, card body & geometry, printing/personalisation/finishing, factory pre-encoding, UID manifest for ACS import, 100% dual-frequency QC verification, programme ROI framing, migration endpoint (LF retirement), compliance & end-of-life.

**Sources[10].** ISO/IEC 18000-2 (LF), ISO/IEC 14443 family (HF), ISO/IEC 18000-63 / EPC Gen2 (UHF), ISO/IEC 7810, NXP MIFARE DESFire EV3 spec, NXP MIFARE Classic 1K spec, Impinj Monza R6/R6-P spec, NXP UCODE 8/9 spec, HID Global iCLASS SE / SEOS overview, ISO/IEC 10373-1.

**Merge & dedup.** Absorbed the multi-site / mixed-generation / retail-logistics-convergence content from `rfid-dual-frequency-card.json` (alternate-name variant) into the canonical page's brief and sections; specifically retained the HID ProxCard → iCLASS/MIFARE migration framing and the MIFARE + UHF Monza R6-P / UCODE 8 converged-credential pairing examples. Added 301 redirect `/products/rfid-cards/rfid-dual-frequency-card/` → `/products/rfid-cards/dual-frequency-rfid-card/` in `public/_redirects`. Alternate-name source file deleted.

**Inbound refs (6).** `_pillar`, `rfid-keyfobs/dual-frequency-key-fob`, `solutions/rfid-access-control`, `compare/uhf-vs-hf-rfid`, `compare/125khz-vs-13.56mhz-rfid`, `industries/education`.

**Outbound orphan scan.** 0 orphans across 13 hrefs.

**Task.** #317 completed.

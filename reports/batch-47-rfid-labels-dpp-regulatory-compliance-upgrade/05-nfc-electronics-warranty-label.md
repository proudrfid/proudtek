# nfc-electronics-warranty-label — SHALLOW → DEEP

**Route.** `/products/rfid-labels/nfc-electronics-warranty-label/`

**Anchor standards & citations.**
- US Magnuson-Moss Warranty Act 15 U.S.C. § 2301 et seq. (1975) — full vs limited warranty + anti-tying.
- FTC 2018 Warning Letters (Sony / Microsoft / Nintendo / HTC / ASUS / Hyundai) — 'warranty void if removed' violates § 2302(c).
- EU Directive 2019/771 Sale of Goods — 2-year statutory liability + burden-of-proof reversal.
- EU Directive 2024/1799 Right to Repair — transposition deadline 31 Jul 2026.
- EU Regulation 2023/1670 Smartphone / Tablet Ecodesign — 7-year spare parts, 5-year SW updates (effective Jun 2025).
- EU Regulation 2024/1781 ESPR — DPP framework (electronics phased 2028-2029).
- EU Regulation 2023/1542 Battery Regulation + Battery DPP (18 Feb 2027 hard deadline).
- NXP NTAG 424 DNA + DNA TagTamper — AES-128 SUN + bridge-antenna CTTES.
- OECD / EUIPO 2022 — counterfeit electronics trade USD 100B+ annually.
- GS1 Digital Link 1.3 — web-resolvable URI syntax.

**DEEP block inventory.**
- `statBar.items[4]` — USD 100B+ counterfeit electronics trade OECD/EUIPO 2022 / 5-15% OEM revenue loss to grey-market diversion / <10% → 60-80% warranty registration uplift NFC vs form / USD 25B+ retail loss to return + refurbishment fraud.
- `comparePanel` — Hologram + paper warranty card + 'warranty void if removed' sticker vs NTAG 424 DNA SUN + bridge-antenna tamper-loop (this page).
- `dataHighlight` — One-tap warranty registration 60-80% vs <10% online-form baseline; SUN URL opens directly in mobile browser, backend validates AES-128 CMAC, captures device-UA + IP geolocation + tap timestamp, renders instant 'Warranty activated. Authentic. Sealed.' confirmation.
- `timeline` — 1975 US Magnuson-Moss Act → 1999 EU Sale of Consumer Goods Directive 1999/44/EC → 2018 FTC 'warranty void if removed' enforcement + NTAG 424 DNA + iOS 12 background NFC → 2021 France Indice de Réparabilité + FTC Nixing the Fix → 2023-2024 EU Battery + Smartphone Ecodesign + ESPR + R2R Directive stack → 2025-2026 Smartphone Ecodesign in force + R2R transposition → 2026 Today (Blocker C: consumer-electronics-launch / smartphone-manufacturer / appliance-OEM / professional-equipment / medical-device-warranty programmes).

**Brief.** 12 `{label, items[]}` objects covering chip silicon (NTAG 424 DNA + TagTamper + NTAG213 entry-level), cryptographic authentication, tamper-evidence mechanism, form factors + sizes, substrate + adhesive, encoded data + GS1 Digital Link URL template, counterfeit + grey-market context, US warranty regulatory framework, EU warranty + repair regulatory framework, refurbishment + circular-economy lifecycle, backend + brand-portal integration, procurement + production.

**Magnuson-Moss positioning.** Tamper-evidence is INFORMATIONAL (CTTES log) NOT auto-void — preserves consumer statutory rights per FTC 2018 enforcement and Magnuson-Moss Act § 2302(c). A 'tampered' state record is evidence of opening for fraud detection / refurbishment grading / anti-diversion, but warranty denial must still satisfy the statutory unauthorised-use test.

**Sources[10].** Magnuson-Moss Warranty Act, FTC 2018 Warning Letters, EU Dir 2019/771, EU Dir 2024/1799, EU Reg 2023/1670, EU Reg 2024/1781, EU Reg 2023/1542, NXP NTAG 424 DNA, OECD/EUIPO 2022, GS1 Digital Link 1.3.

**Inbound refs (6).** Pillar, sibling DPP / battery-passport / NTAG424 flagship / pharmaceutical / brand-authentication products, industries/brand-protection / eu-compliance.

**Outbound orphan scan.** 0 orphans across 6 hrefs.

**Task.** #372 completed.

# impinj-m750-uhf-inlay — SHALLOW → DEEP

**Route.** `/products/rfid-labels/impinj-m750-uhf-inlay/`

**Anchor standards & citations.**
- Impinj M750 = rebranded Monza R6-P silicon (TID prefix unchanged).
- 96-bit EPC + 96-bit serialised TID + 32-bit user memory — brand-protection variant of M700 family.
- ISO/IEC 18000-63:2015 + Amendment 1 AUTHENTICATE command + GS1 Crypto Suite 3 AES-128.
- EPC Gen2v2 Untraceable command for retail privacy at point-of-sale (GDPR-aware EU rollouts).
- Read sensitivity -22.0 dBm; write sensitivity -18.0 dBm.
- Impinj Authenticity cloud service for turnkey AUTHENTICATE verification without HSM.
- EU Regulation 2024/1781 (Ecodesign for Sustainable Products Regulation) — Digital Product Passport UHF tier.
- DSCSA + EU FMD pharmaceutical anti-counterfeit framework.
- M750 + 32-bit user + AUTHENTICATE = minimum-feature DPP-compliant UHF chip.
- Reader compatibility: Impinj R700/R720, Zebra FX9600/FX7500 with current firmware support AUTHENTICATE.

**DEEP block inventory.**
- `statBar.items[4]` — AES-128 AUTHENTICATE per Crypto Suite 3 / Untraceable retail-privacy command / 32-bit user / EU 2024/1781 DPP UHF tier minimum.
- `comparePanel` — M730 (cost-optimised retail) / Higgs-9 (large user memory, no AUTHENTICATE) vs M750 (this page) / UCODE 9 (full feature alternative).
- `dataHighlight` — "<200 ms" cryptographic chip-authenticity verification round-trip via Impinj Authenticity cloud.
- `timeline` — 2015 ISO/IEC 18000-63:2015 Amendment 1 + GS1 Crypto Suite 3 → 2017 Monza R6-P launch → 2019 Impinj Authenticity cloud → 2022 M700-family rebrand → 2024 EU Regulation 2024/1781 ESPR DPP framework → 2024-2025 textile DPP profile finalises 2027 effective date → 2026 Today (Blocker C: luxury-anti-counterfeit, pharmaceutical-DSCSA, EU-DPP-textile-2027, retail-privacy-EU, RTI-cycle-authentication programmes).

**Brief.** 12 `{label, items[]}` objects covering chip silicon and lineage, memory architecture, cryptographic features (AUTHENTICATE + Untraceable + Crypto Suite 3), sensitivity and read range, air interface and standards, mid-market brand protection without HSM, retail privacy at point-of-sale, EU Digital Product Passport UHF tier, pharmaceutical serialisation with on-tag fragments, RTI cycle authentication, where M750 is NOT the right fit, procurement and lead times.

**Sources[10].** Impinj M700-series datasheet, Monza R6-P product brief, Impinj Authenticity cloud documentation, EPC Gen2v2 protocol 2.1, GS1 TDS 2.0, EU Regulation 2024/1781 (ESPR), ISO/IEC 18000-63:2015 + Amendment 1, GS1 Crypto Suite 3, U.S. FDA DSCSA, EU Falsified Medicines Directive 2011/62/EU.

**Inbound refs (7).** Pillar, sibling M700-family inlays, M800 inlay, industries/brand-protection / eu-compliance / luxury-brands / pharmaceutical, compare pages.

**Outbound orphan scan.** 0 orphans across 15 hrefs.

**Task.** #354 completed.

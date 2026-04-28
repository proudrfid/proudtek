# ntag424-dna-tamper-evident-tag — SHALLOW → DEEP

**Route.** `/products/rfid-labels/ntag424-dna-tamper-evident-tag/`

**Anchor standards & citations.**
- NXP NTAG 424 DNA (NT4H2421Gx) + NTAG 424 DNA TagTamper (NT4H2421Tx).
- NXP AN12196 — SDM / SUN message configuration + tamper-loop CTTES register.
- NXP AN10922 — symmetric key diversification (CMAC-AES K_diversified from K_master + UID).
- FIPS PUB 197 (AES) + NIST SP 800-38B (CMAC).
- ISO/IEC 14443-4 — Type A transmission protocol.
- NFC Forum Type 4 Tag Operation Specification.
- US FDA DSCSA — pharmaceutical serialisation.
- EU FMD 2011/62/EU + Delegated Reg 2016/161 — UI + ATD.
- EU ESPR 2024/1781 — DPP framework.
- 5-key role-based access architecture (master + 4 application keys).

**DEEP block inventory.**
- `statBar.items[4]` — AES-128 SDM cryptographic engine FIPS PUB 197 / 32-bit monotonic read counter replay defense / 5-key role-based access architecture / 0 apps native phone NFC verification.
- `comparePanel` — Hologram / NTAG213 sticker / static QR vs NTAG 424 DNA SUN + bridge-antenna tamper-loop (this page).
- `dataHighlight` — Single-use cryptographic per-tap URL parameter: PICCData (AES-128 encrypted UID + 32-bit counter) + optional file mirror + CMAC signature appended to SDM URL — counterfeiter copying any single observed URL sees an already-invalidated code.
- `timeline` — 2001 NFC Forum founded → 2007-2013 NTAG21x family static-URL → 2014 iPhone 6 + Apple Pay → 2018 iOS 12 background NFC + NTAG 424 DNA launch → 2019-2020 TagTamper variant + early luxury adopters → 2021-2023 DPP + Battery Passport regulatory tailwind → 2024 GS1 Digital Link 1.3 + CIRPASS → 2026 Today (Blocker C: high-value-pharma-bottle / premium-spirits-cap / luxury-cosmetics-seal / regulated-document-envelope / art-provenance-cert programmes).

**Brief.** 12 `{label, items[]}` objects covering chip silicon (DNA + TagTamper variants), memory architecture (5-key role-based + CTTES register), cryptographic security (AES-128 SDM + CMAC + AN10922 diversification), RF + protocol, tamper-evidence mechanism, form factors + sizes (Ø22/25/30/38mm + 30×45mm), substrate + adhesive, personalisation + encoding, application verticals, backend integration patterns, standards + compliance, procurement.

**Sources[10].** NXP NTAG 424 DNA datasheet, NXP AN12196, NXP AN10922, FIPS PUB 197 AES, NIST SP 800-38B CMAC, ISO/IEC 14443-4, NFC Forum Type 4 Tag, US FDA DSCSA, EU FMD 2011/62/EU + 2016/161, EU ESPR 2024/1781.

**Inbound refs (35).** Flagship general-purpose chip-family-anchor SKU; referenced by entire NFC product line including pillar, sibling NFC authentication products, industries/brand-protection / eu-compliance / luxury-brands / pharma-supply-chain / sustainability and chip-family encyclopedia guides.

**Outbound orphan scan.** 0 orphans across 10 hrefs.

**Positioning.** This is the FLAGSHIP general-purpose NTAG 424 DNA TamperTag SKU that the entire Batch 46 (luxury-handbag, sneaker, spirits, cosmetics, olive oil) and Batch 47 (DPP, battery passport, pharmaceutical, electronics-warranty) reference as the chip-family-anchor product. Vertical-positioned application-specific children inherit this parent's chip-level technical reference.

**Task.** #371 completed.

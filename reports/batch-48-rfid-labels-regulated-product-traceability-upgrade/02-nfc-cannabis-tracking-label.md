# nfc-cannabis-tracking-label — SHALLOW → DEEP

**Route.** `/products/rfid-labels/nfc-cannabis-tracking-label/`

**Anchor standards & citations.**
- Metrc (Franwell) — 20+ US state contracts (CA / CO / OR / NV / MI / MT / OH / MD / MO / MA / ME / AK / LA / WV / OK / MS / NJ / RI / DC).
- BioTrack (Forian) — WA / NM / ND / PR / IL Medical / KY / HI / DE.
- US 2018 Farm Bill (Pub. L. 115-334) — hemp THC ≤ 0.3% carve-out from CSA Schedule I.
- US Controlled Substances Act Title 21 — federal cannabis Schedule I.
- Cannabis Act (Canada) S.C. 2018 c.16 + Health Canada CTLS.
- Germany Cannabis Act (CanG) effective 1 Apr 2024.
- ISO/IEC 17025:2017 — testing-lab competence accreditation.
- EU Novel Food Reg 2015/2283 + EFSA CBD guidance.
- NXP NTAG 424 DNA + DNA TT — AES-128 SUN + bridge-antenna anti-diversion.
- GS1 Digital Link 1.3 — cross-jurisdiction MSO architecture.

**DEEP block inventory.**
- `statBar.items[4]` — 20+ Metrc state contracts / USD 50,000 per-violation penalty / 5-10% manual COA-mismatch rate / 68% consumer willingness to pay for verifiable lab + supply-chain data.
- `comparePanel` — Printed barcode + paper COA + 'tamper void' sticker vs NFC SUN + bridge-antenna + state-platform-integrated UID (this page).
- `dataHighlight` — 100% COA accuracy via UID-to-package-tag mapping vs 5-10% manual mismatch.
- `timeline` — 1970 CSA → 1996-2012 state legalisation → 2013 Metrc + BioTrack first contracts → 2018 Farm Bill + NTAG 424 DNA + iOS 12 → 2020-2022 ISO/IEC 17025 lab accreditation standardises COA → 2024 Germany CanG + EU CBD novel-food clarity → 2025-2026 DEA Schedule III proposal + ESPR DPP → 2026 Today (Blocker C: multi-state-operator, premium-flower-DTC, concentrate-cartridge, edible-confection, pre-roll-tube programmes).

**Brief.** 12 `{label, items[]}` objects covering chip silicon, state seed-to-sale platform integration (Metrc / BioTrack / Leaf Data / OpenTHC / CTLS), COA data model, lab integration partners, form factors, tamper-evidence mechanism, substrate + adhesive, encoded data model (GS1 Digital Link + Metrc UID + ISO/IEC 17025 lab cert), US regulatory framework, international regulatory framework, consumer-tap experience, procurement.

**Sources[10].** Metrc, BioTrack, 2018 Farm Bill, CSA Title 21, ISO/IEC 17025:2017, Cannabis Act Canada, NXP NTAG 424 DNA, GS1 Digital Link, Germany CanG, EU Reg 2015/2283 Novel Food.

**Inbound refs (4).** Pillar, sibling food-traceability / NTAG424 flagship, industries/agriculture + brand-protection + cold-chain-food-traceability (host-edits added).

**Outbound orphan scan.** 0 orphans across 5 hrefs.

**Task.** #376 completed.

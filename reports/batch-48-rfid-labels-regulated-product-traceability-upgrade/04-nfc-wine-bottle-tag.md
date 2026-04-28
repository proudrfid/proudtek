# nfc-wine-bottle-tag — SHALLOW → DEEP

**Route.** `/products/rfid-labels/nfc-wine-bottle-tag/`

**Anchor standards & citations.**
- NXP NTAG 424 DNA + DNA TagTamper — AES-128 SUN + bridge-antenna CTTES.
- NXP AN12196 — SDM / SUN URL generation.
- NXP AN10922 — symmetric-key diversification (per-vintage / per-cask CMAC-AES).
- EU Reg 2018/273 — wine authorisations + cellar register VI-1/VI-2.
- EU Reg 1169/2011 + Reg 2021/2117 — ingredient + nutrition disclosure (effective 8 Dec 2023).
- EU Reg 2019/33 — Delegated Regulation wine labelling.
- EU Reg 1151/2012 — PDO / PGI / TSG quality framework.
- EU Reg 2024/1781 ESPR — DPP framework (beverages later tranche).
- GS1 Digital Link 1.3 — DPP transport-layer forward-compat.
- NFC Forum Type 4 Tag.

**DEEP block inventory.**
- `statBar.items[4]` — 8 Dec 2023 EU 1169/2011 wine ingredient disclosure / 11% → <0.5% false-tamper rate after Proud Tek bottling-line stress-test / 22% Champagne consumer-tap rate within 90 days / 200,000+ per-vintage SUN-URL pre-computed encoding.
- `comparePanel` — Hologram + paper certificate + NTAG213 static-URL sticker vs NTAG 424 DNA SUN + bridge-antenna capsule insert (this page).
- `dataHighlight` — Champagne 22% consumer-tap rate within 90 days documented; false-tamper from 11% to <0.5% after stress-test; spirits grey-market diversion identified via NTAG 424 DNA rolling-counter analysis.
- `timeline` — 1855 Bordeaux Classification → 1992 EU PDO/PGI → 2009-2011 UK Scotch Whisky Reg + EU 1169/2011 → 2018 NTAG 424 DNA + iOS 12 + EU 2018/273 → 2019-2021 premium adopters + Aura Blockchain → 2021-2022 EU 2021/2117 + ESPR adopted → 8 Dec 2023 EU wine ingredient disclosure mandatory → 2026 Today (Blocker C: premium-Champagne-cuvée, Bordeaux-Grand-Cru, Burgundy-en-primeur, single-cask-Scotch, vintage-Cognac, ultra-premium-Tequila programmes).

**Brief.** 12 `{label, items[]}` objects covering chip silicon, form factors + placement (capsule top / under-label / neck hang / cork-integrated / external capsule wrap), tamper-evidence mechanism (refilling defense), RF + protocol, capsule material compatibility (PVC / polylaminate / paper RF-transparent vs tin / aluminium foil block RF), bottling-line compatibility (MGS / Robino-Galandrino / Pelliconi crimper survival), per-vintage AES key provisioning, consumer-tap experience, regulatory + compliance framework, premium PDO / PGI / appellation framework, substrate + adhesive, procurement.

**Sources[10].** NXP NTAG 424 DNA, NXP AN12196, NXP AN10922, EU Reg 2018/273, EU Reg 1169/2011, EU Reg 2024/1781 ESPR, GS1 Digital Link, NFC Forum Type 4, EU Reg 1151/2012, EU Reg 2019/33.

**Inbound refs (5).** Pillar, sibling NFC spirits + olive-oil + NTAG424 flagship, industries/brand-protection + luxury-brands.

**Outbound orphan scan.** 0 orphans across 5 hrefs.

**Task.** #378 completed.

# nfc-battery-passport-tag — SHALLOW → DEEP

**Route.** `/products/rfid-labels/nfc-battery-passport-tag/`

**Anchor standards & citations.**
- EU Regulation 2023/1542 — Battery Regulation, Article 77 + Annex XIII Battery Passport.
- Hard deadline 18 Feb 2027 for EV / industrial >2 kWh / LMT batteries.
- NXP NTAG 424 DNA + DNA TT — AES-128 SUN + 5-key role-based access (key 0 master / key 1 public / key 2 owner / key 3 service-provider / key 4 recycler).
- NXP AN12196 — SUN URL generation + tamper-loop CTTES register.
- Global Battery Alliance — pilot reference programme (Audi / Tesla / CATL / LG Energy Solution / BASF).
- CIRPASS Project — GS1 Digital Link + JSON-LD + W3C DIDs.
- ISO 16750 — automotive ruggedization.
- Annex XII recycled-content thresholds (cobalt 16% by 2031, lithium 6%, nickel 6%).
- Re|Source consortium — battery raw-material traceability.

**DEEP block inventory.**
- `statBar.items[4]` — EU Reg 2023/1542 Article 77 + Annex XIII / 18 Feb 2027 hard deadline / NTAG 424 DNA 5-key role architecture / Annex XII recycled-content thresholds.
- `comparePanel` — Paper battery certificate / printed QR vs NTAG 424 DNA SUN + 5-key + ISO 16750 ruggedization (this page).
- `dataHighlight` — Stakeholder file allocation: key 1 (consumer) reads State-of-Health + remaining capacity / key 2 (owner) reads warranty + ownership / key 3 (service-provider) reads cell-pack diagnostics / key 4 (recycler) reads chemical composition + raw-material origin.
- `timeline` — 2009-2014 EU 1st Generation Battery Directive 2006/66/EC → 2017 EU Battery Alliance → 2020 EU Green Deal Strategic Approach → 2022-2023 EU Reg 2023/1542 enacted → 2025-2026 GBA pilots + CATL / LG / BASF deployments → 18 Feb 2027 hard deadline → 2031 cobalt 16% recycled-content threshold → 2026 Today (Blocker C: EV-OEM / industrial-storage / e-bike-LMT / power-tool-pack / consumer-laptop programmes).

**Brief.** 12 `{label, items[]}` objects covering chip silicon, 5-key role architecture, DPP data model (GS1 Digital Link + JSON-LD + W3C DIDs), Annex XIII data fields (battery type / raw materials / recycled content / SoH / carbon footprint), Annex XII recycled-content thresholds, ISO 16750 ruggedization, mounting + adhesive, GBA pilot reference, integration with battery-management-systems, procurement, compliance posture.

**Sources[10].** EU Reg 2023/1542, GS1 Digital Link 1.3, ISO/IEC 15459, ISO 16750, NXP NTAG 424 DNA, NXP AN12196, Global Battery Alliance, CIRPASS Project, Re|Source consortium, JSON-LD W3C.

**Inbound refs (5).** Pillar, sibling DPP / electronics-warranty products, industries/eu-compliance / sustainability / battery-supply-chain.

**Outbound orphan scan.** 0 orphans across 9 hrefs.

**Task.** #370 completed.

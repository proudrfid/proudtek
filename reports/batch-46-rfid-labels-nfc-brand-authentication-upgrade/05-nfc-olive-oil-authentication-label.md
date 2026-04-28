# nfc-olive-oil-authentication-label — SHALLOW → DEEP

**Route.** `/products/rfid-labels/nfc-olive-oil-authentication-label/`

**Anchor standards & citations.**
- NXP NTAG 424 DNA + DNA TT — AES-128 + Secure Dynamic Messaging + bridge-antenna tamper-evidence.
- NXP AN12196 — SUN URL generation + bridge-antenna application patterns.
- Commission Implementing Regulation (EU) 2022/2104 — marketing standards for olive oil; eight olive-oil categories.
- Commission Implementing Regulation (EU) 2022/2105 — conformity checks + analytical methods.
- International Olive Council COI/T.15/NC No 3/Rev.19 trade standard + COI/T.20 series test methods.
- Regulation (EU) No 1151/2012 — quality schemes for agricultural products and foodstuffs (PDO/PGI/TSG).
- EU eAmbrosia geographical indications register — 140+ registered olive-oil designations.
- Commission Regulation (EEC) No 2568/91 — characteristics of olive oil + analytical annexes.
- U.S. FSMA Section 204 Food Traceability Rule (effective 2026).
- EU Deforestation Regulation 2023/1115 (EUDR).

**DEEP block inventory.**
- `statBar.items[4]` — 60-80% mislabelled / adulterated EVOO in market / AES-128 + bridge SUN + tamper-evident antenna / EU 1151/2012 PDO / PGI legal framework / IOC COI/T.20 reference analytical methods.
- `comparePanel` — Hologram / printed PDO seal / paper certificate vs NTAG 424 DNA bridge-antenna + IOC certificate published to tap page (this page).
- `dataHighlight` — "Grove → bottle" GPS polygon + cultivar + harvest date + mill ID + IOC certificate; per-bottle provenance from grove to bottling line published to consumer-tap page.
- `timeline` — 1992 EU PDO/PGI framework → 2008 Operazione Oro Verde Italian fraud case → 2011-2016 Tom Mueller Extra Virginity → 2017-2019 NTAG 424 DNA premium EVOO early adopters → 2022 EU 2022/2104 + 2022/2105 modernised standards → 2023-2024 EUDR + FSMA 204 → 2026 Today (Blocker C: PDO-Tuscan-olive-oil, PGI-Greek-olive-oil, Italian-DOC-EVOO, Californian-Cobram-Estate, Japan-import-verification programmes).

**Brief.** 12 `{label, items[]}` objects covering chip silicon and tamper variant, bridge-antenna anti-refill mechanism, olive oil fraud market context, EU olive-oil regulatory framework, International Olive Council (IOC) analytical framework, PDO / PGI Geographical Indication framework, per-bottle serialisation + provenance, adulteration science (what NFC does NOT verify), retention-sample chain of custody, FSMA 204 + EUDR food-traceability adjacency, premium positioning + restaurant-fraud defense, procurement and integration.

**Sources[10].** Commission Implementing Regulation (EU) 2022/2104, Commission Implementing Regulation (EU) 2022/2105, International Olive Council COI standards, EU Regulation 1151/2012, EU eAmbrosia register, NXP NTAG 424 DNA datasheet, NXP AN12196, Commission Regulation (EEC) 2568/91, U.S. FDA FSMA 204, EU Regulation 2023/1115 EUDR.

**Inbound refs (4).** Pillar, sibling NFC authentication products, industries/cold-chain-food-traceability / luxury-brands / brand-protection.

**Outbound orphan scan.** 0 orphans across 11 hrefs.

**Task.** #364 completed.

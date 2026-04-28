# uhf-rfid-blood-bag-label — SHALLOW → DEEP

**Route.** `/products/rfid-labels/uhf-rfid-blood-bag-label/`

**Anchor standards & citations.**
- ICCBBA ISBT 128 Standard (ST-001).
- ICCBBA TS-002 — Technical Specification for Use of RFID on ISBT 128 Labelled Medical Products.
- FDA 21 CFR Part 606 — cGMP for Blood and Blood Components.
- AABB Standards for Blood Banks and Transfusion Services 33rd edition — Standard 5.27.2 four-point bedside.
- ISO/IEC 18000-63:2015 UHF RAIN RFID.
- Impinj M700 series (M730 / M750 / M770).
- UK SHOT (Serious Hazards of Transfusion) hemovigilance scheme.
- FDA Fatalities Reported (BPDR) — 20-40 US transfusion-related fatalities annually.
- EU Reg 2024/1938 SoHO (replaces Blood Directive 2002/98/EC).
- Joint Commission NPSG.01.03.01 transfusion-safety.

**DEEP block inventory.**
- `statBar.items[4]` — 1 in 38,000 ABO-incompatible transfusion fatality rate / USD 100-300K annual hospital expiry-waste loss / 5-10% → 2-3% blood-product expiry-waste reduction with FEFO / 20-40 US transfusion fatalities annually (FDA BPDR).
- `comparePanel` — Manual visual inventory + barcode scan + paper crossmatch + bedside visual check vs UHF RFID + ISBT 128 + bedside dual-tap verification + FEFO automation (this page).
- `dataHighlight` — 1 in 38,000 ABO-incompatible transfusion fatality rate prevented by RFID bedside dual-tap (patient wristband + blood-bag label) + AABB Standard 5.27.2 four-point identity verification + hemovigilance RCA from days to minutes.
- `timeline` — 1994 ICCBBA ISBT 128 ratified → 2003 Joint Commission NPSG.01.03.01 → 2008 ICCBBA TS-002 RFID placement → 2014-2018 UHF RAIN maturity + Impinj Monza R6 → 2018 NTAG 424 DNA + cellular therapy CAR-T scale → 2020-2022 COVID-19 + plasma-therapy blood-supply pressure → 2024 EU Reg 2024/1938 SoHO → 2026 Today (Blocker C: academic-medical-centre-blood-bank, regional-blood-collection-organisation, oncology-cellular-therapy-cryostorage, blood-supply-network, trauma-centre-massive-transfusion programmes).

**Brief.** 12 `{label, items[]}` objects covering chip silicon (Impinj M730/M750/M770 + NXP UCODE 9xm + Alien Higgs-9), frequency + protocol, ISBT 128 data structure (DIN + product code + expiration), cold-chain temperature performance (2-6 °C / −30 °C / −65 °C), substrate + adhesive engineering (PVC plasticiser-resistant), blood-bag manufacturer compatibility (Fresenius Kabi / Haemonetics / Terumo BCT / MacoPharma), product shelf-life support, bedside transfusion verification (AABB 5.27.2), BBIS + LIS integration (Mediware HCLL + SoftBank + Haemonetics SafeTrace + Cerner Millennium + Epic Beaker), hemovigilance + adverse-event reporting (SHOT + BPDR), cellular therapy + tissue extension (CAR-T + HSC + AATB), procurement.

**Sources[10].** ICCBBA ISBT 128 ST-001, ICCBBA TS-002, FDA 21 CFR Part 606, AABB Standards 33rd edition, ISO/IEC 18000-63:2015, Impinj M700 series, UK SHOT, FDA BPDR, EU Reg 2024/1938 SoHO, Joint Commission NPSG.01.03.01.

**Inbound refs (5).** Pillar, sibling medication-vial + cryogenic + specimen-slide + ntag424 + rfid-blood-bag-tag flagship.

**Outbound orphan scan.** 0 orphans across 7 hrefs.

**Task.** #399 completed.

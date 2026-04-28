# pvc-rfid-wristband — SHALLOW → DEEP

**Route.** `/products/rfid-wristbands/pvc-rfid-wristband/`

**Anchor standards & citations.**
- Substrate: soft PVC compound, phthalate-free option (DEHP / DBP / BBP-free).
- IP67 per IEC 60529 — dust-tight + immersion 1 m / 30 minutes; the realistic guest-experience aquatic envelope.
- EU REACH Regulation (EC) No 1907/2006 — SVHC restrictions on phthalates (DEHP, DBP, BBP).
- RoHS Directive 2011/65/EU — heavy-metal restrictions on PVC compound.
- EU Toy Safety Directive 2009/48/EC for child-sized variants.
- FDA 21 CFR 175.105 / 175.300 — adhesive and ink baseline for prolonged-skin-contact PVC.
- ISO/IEC 14443-A 13.56 MHz HF (NTAG / Classic / DESFire / Ultralight); ISO/IEC 18000-2 LF 125 kHz (EM4100); dual-frequency LF + HF variant.
- Silicon: NXP MIFARE Classic 1K, MIFARE Plus EV2, DESFire EV2 / EV3; NTAG213 / 215 / 216; Ultralight C; EM4100 LF.
- Cashless platforms: Intellitix, Glownet, PlayPass, Tappit, CrowdBlink, Vantage, Semnox, accesso.
- Hospitality PMS: Oracle Opera Cloud, Mews, Cloudbeds, Infor HMS.
- Cruise-line guest management: Royal Caribbean WowBand, MSC for Me.
- CRYPTO-1 academic break (Nohl/Plötz 2008) — drives DESFire upgrade recommendation.

**DEEP block inventory.**
- `statBar.items[4]` — IP67 per IEC 60529 / Solvent-cured chlorinated-pool print / 100,000+ EEPROM write cycles / 3 sizes adult / child / infant.
- `comparePanel` — PVC IP67 mid-tier reusable / single-use breakaway (this page) vs Silicone IP68 premium reusable + Fabric multi-day disposable.
- `dataHighlight` — "USD 0.40-0.90" per-band MOQ-direct cost positioning between Tyvek (USD 0.20-0.40 disposable) and silicone (USD 0.55-1.40 premium reusable); decision boundary explained.
- `timeline` — 1990s paper pool-pass → 1994-2000 soft-PVC wristband manufacturing scales → 2002-2008 NXP MIFARE chip embedding → 2010-2014 cashless platforms scale on PVC → 2015-2018 Disney MagicBand / Royal Caribbean WowBand demonstrate body-worn waterproof at consumer scale → 2020-2024 DESFire EV3 + SDM ships, phthalate-free PVC default → 2026 Today (Blocker C anchor: "hotel-pool-amenity, cruise-line-cabin, holiday-resort-multi-day, all-inclusive-lounge, and theme-park-multi-day programmes").

**Brief.** 12 `{label, items[]}` objects covering substrate, air interface and chip pairing, IP rating and waterproofing, closures (reusable / adjustable / single-use), sizing for family venues, print and personalisation, pre-encoding and platform compatibility, lifecycle and reusable economics, aquatic-venue use cases, multi-day outdoor event applications, procurement and operations, compliance and safety.

**Sources[10].** IEC 60529 (IP Code), ISO/IEC 14443-1..4, NXP MIFARE DESFire EV3 data sheet, NXP NTAG213 / 215 / 216 data sheet, Nohl/Plötz CRYPTO-1 cryptanalysis, EU REACH (phthalate restrictions), RoHS Directive 2011/65/EU, EU Toy Safety Directive 2009/48/EC, Glownet / Intellitix / Vantage / Semnox cashless-platform reference, FDA 21 CFR 175.105.

**Inbound refs (6).** Pillar, multiple wristband SKUs (waterpark, vinyl, silicone, cashless), industries/events-venues / hospitality, compare/silicone-vs-fabric-vs-woven-rfid-wristbands.

**Outbound orphan scan.** 0 orphans across 15 hrefs.

**Task.** #332 completed.

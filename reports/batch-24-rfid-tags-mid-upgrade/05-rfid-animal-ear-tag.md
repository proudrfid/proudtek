# Batch 24 / Page 5 — rfid-animal-ear-tag

**Route:** `/products/rfid-tags/rfid-animal-ear-tag/`
**Upgrade:** MID → DEEP (full rewrite — prior "Typical outcomes" already partially de-identified; full DEEP framework now added)
**Sync:** clean (Zod pass)
**Inbound:** 5 references

## What changed

- `keywords[6]`: "ISO 11784/11785 FDX-B ear tag", "USDA 840 RFID cattle tag", "EU 2019/2035 electronic identification", "Australia NLIS cattle tag", "ICAR-registered livestock transponder", "tissue sample ear tag (TST)".
- `brief[]` 8 → 11 fields — adds Chip options (EM4305 / EM4569 + TI RI-TRP-RR2B HDX + Sokymat Hitag S), Frequency / air interface (134.2 kHz LF per ISO 11785:1996 FDX-B + HDX race-way option), ID code structure explicit (15-digit per ISO 11784; USDA 840 prefix per 9 CFR Part 86, EU country code per Commission Implementing Regulation 2021/520, NLIS code per MLA Business Rules), Housing material (TPU, UV-resistant per ISO 4892-2 Cycle A Qmax 1,000 h; -40 / +85 °C; REACH-compliant), Read range explicit (30-50 cm handheld stick / 60-100 cm panel / up to 150 cm HDX race-way), Retention & welfare (>95% ICAR-published literature when applicator technique correct; sized per species RSPCA / CCAC / AWIN / WOAH Terrestrial Code Ch 4.3), Compliance framework (USDA APHIS ADT 9 CFR Part 86 mandatory-RFID 2024-11-05 + EU 2019/2035 + 2021/520 + NLIS + CLTS Health of Animals Regs Part XV + SISBOV IN MAPA 51/2018 + ICAR + ISO 11784/11785/14223/24631 + WOAH), Platform integration (ADTIS / TRACES NT / NLIS / CLTS / SISBOV + Allflex SenseHub / Afimilk / DeLaval DelPro / GEA CowScout / Performance Livestock Analytics / BoviSync / Tru-Test / Gallagher + Marel Innova / Scott Technology / JBS Smart Tracking + Gallagher TSi 2 / Tru-Test ID5000 / Te Pari Patriot crush readers).
- Tag-type table extended with HDX bolus (complementary to ear tag for long-life ID).
- `statBar` on Challenges: 840 prefix USDA 9 CFR Part 86 country code / EU 2019/2035 electronic-ID regulation / 134.2 kHz ISO 11785 FDX-B / >95% retention ICAR literature baseline.
- `comparePanel` on "How Proud Tek solves": generic supplier (mixed 125 kHz / FDX-B stock → USDA rejection; unregistered serial → registry conflicts; inkjet / UV-printed visual → <1 yr fade; single-SKU welfare / retention issues; no ISO 24631 performance decl) vs Proud Tek ICAR programme (FDX-B-only, ICAR block country-prefix pre-encoded, laser-engraved UV-tested ISO 4892-2 1,000 h, species-matched button / flag / TST / HDX bolus SKU, ISO 24631:2018 sample data per production run).
- Blocker C — prior "Typical outcomes" re-worked end-to-end: "frictionless acceptance at USDA auction houses", "compliance with EU 2019/2035 on first inspection", "multi-year visual-number service life" rewritten as "Deployment patterns integrators follow on ISO 11784/11785 livestock-ID programmes" with dataHighlight (>95% retention on properly-applied FDX-B ear tags per ICAR Section 12 literature + MLA NLIS Cattle Standards) + 4-phase timeline (Weeks 1-3 programme scope + ICAR block registration → 4-6 tag spec + applicator qualification → 7-10 pilot herd + registry wiring → Month 3+ full-herd scale-out + abattoir linkage).
- Sources: 10 at 5-field (9 CFR Part 86, Commission Implementing Regulation 2021/520, NLIS Cattle Standards / Business Rules, ISO 11784:1996, ISO 11785:1996, ISO 24631-1/-2/-3:2018, ICAR Section 12, EU Regulation 2019/2035, Health of Animals Regulations Part XV, IN MAPA 51/2018 SISBOV).

## Standards cited

USDA APHIS 9 CFR Part 86 (mandatory-RFID rule effective 2024-11-05) · EU Regulation 2019/2035 + Commission Implementing Regulation 2021/520 · Australia NLIS Business Rules (MLA) · Canada Health of Animals Regulations Part XV · Brazil IN MAPA 51/2018 (SISBOV) · ISO 11784:1996 · ISO 11785:1996 · ISO 14223:2018 · ISO 24631-1/-2/-3:2018 · ISO 4892-2 Cycle A · ICAR Manufacturer Code Register · ICAR Section 12 Device Testing · WOAH Terrestrial Animal Health Code Chapter 4.3.

# Batch 24 / Page 3 — rfid-temperature-sensor-tag

**Route:** `/products/rfid-tags/rfid-temperature-sensor-tag/`
**Upgrade:** MID → DEEP (full rewrite with Blocker C de-identification)
**Sync:** clean (Zod pass)
**Inbound:** 4 references (backfilled from `products/rfid-labels/nfc-pharmaceutical-label.json`)

## What changed

- `keywords[6]`: "UHF RFID temperature sensor tag", "passive RFID cold chain logger", "EM4325 Axzon Magnus S3 sensor IC", "EU GDP 2013/C 343/01 temperature monitoring", "WHO PQS E006 vaccine cold chain", "EN 12830:2018 temperature recorder RFID".
- `brief[]` 9 → 12 fields — adds Sensor IC (EM Microelectronic EM4325 BAP + Axzon Magnus S3 self-tuning passive + Asygn AS321x cryogenic + Farsens Pyros high-temp), Frequency / air interface (860-960 MHz EPC Class 1 Gen 2 v2.1 / ISO/IEC 18000-63:2015; FCC / ETSI / ARIB regional; BAP per EPC Gen2v2 Annex G), Temperature measurement range explicit (cryo -80 / +40, standard -40 / +85, high-temp -20 / +150), Accuracy (±0.5 °C typical / ±0.3 °C 2-8 °C band / ±0.1 °C probe per EN 12830:2018 Class 1; ISO/IEC 17025 NIST / DAkkS cert), Logging capacity 500-4,000 readings with alarm-threshold flag, EPC / UDI scheme (SGTIN-96 / SSCC-96 / GDTI-96 per GS1 TDS 2.0 + EPCIS 2.0 SensorReportList uom=CEL), Biocompatibility & materials (food-contact FDA 21 CFR §175.105 / EU 10/2011; blood-bag probe ISO 10993-10; RoHS + REACH), Compliance framework, Platform integration (Veeva Vault QMS / MasterControl / TrackWise Digital / SAP QM + SAP EWM / Oracle Fusion / Manhattan / Blue Yonder + Controlant / Berlinger / Sensitech / Tive / Roambee / Emerson GO + Systech / rfxcel / SAP ATTP).
- `statBar` on Challenges: 2-8 °C GDP cold-chain band / ±0.5 °C accuracy EN 12830 Class 1 / WHO PQS E006 / 21 CFR Part 211.
- `comparePanel` on "How Proud Tek solves": commodity sensor tag (no ISO/IEC 17025 cal evidence, single variant across cold-chain bands, alarm flag not validated to EN 12830, flat CSV export only, no GDP / WHO PQS doc pack) vs Proud Tek programme (per-lot ISO/IEC 17025 NIST / DAkkS cert, band-matched IC choice EM4325 / Magnus S3 / AS321x / Pyros, EN 12830 Class 1 excursion flag, GS1 EPCIS 2.0 SensorReportList payload, FDA / GDP / WHO PQS / PDA TR 39 doc pack).
- Blocker C — prior "Results" section (4-5 min → 30 sec, 60-70% → 98%+, 30-40% reduction, 99%+ vs 75-85% record completion, 3-4 h → 45 min) rewritten as "Deployment patterns integrators follow on GDP-grade cold-chain sensor-tag programmes" with dataHighlight (minutes → seconds read-out time, citing ISPE Good Practice Guide: Cold Chain Management + PDA TR 39 + WHO IVB/05.01) + 4-phase timeline (Weeks 1-3 lane map + excursion-risk audit → 4-6 sensor spec + cal qualification → 7-12 pilot lane + QMS wiring → Month 4+ enterprise roll-out + CAPA loop).
- Sources: 10 at 5-field (FDA 21 CFR Part 211, EU GDP 2013/C 343/01, WHO PQS E006, EN 12830:2018, ISO/IEC 18000-63:2015, GS1 EPCIS 2.0 / ISO/IEC 19987:2015, FSMA 204 / 21 CFR Part 204, USP <1079>, PDA TR 39, ISPE Good Practice Guide: Cold Chain Management).

## Standards cited

FDA 21 CFR Part 211 · EU Good Distribution Practice 2013/C 343/01 · USP <1079> · WHO TRS 961 Annex 9 · WHO PQS E006 / TR06 · FSMA 204 (21 CFR Part 204) · HACCP / Codex Alimentarius CXC 1-1969 · EN 12830:2018 Class 1 · ISO/IEC 17025 · IATA Time & Temperature Sensitive Label · PDA Technical Report 39 · ISPE Good Practice Guide: Cold Chain Management · GS1 TDS 2.0 / EPCIS 2.0 (ISO/IEC 19987:2015).

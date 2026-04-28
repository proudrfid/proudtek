# Batch 25 / Page 2 — rfid-race-timing-tag

**Route:** `/products/rfid-tags/rfid-race-timing-tag/`
**Upgrade:** MID → DEEP (full rewrite with Blocker C de-identification)
**Sync:** clean (Zod pass)
**Inbound:** 4 references

## What changed

- `keywords[6]`: "RFID race timing tag", "World Athletics TR 30 chip timing", "AIMS/IAAF certified timing", "UCI Part 1 Ch. III timing", "ChronoTrack / MYLAPS / RFIDTS tag", "ISO/IEC 18000-63 Gen2v2 UHF timing".
- `brief[]` expanded to 12 fields — adds Chip options (Impinj Monza R6-P / M750; NXP UCODE 8m / 9), Frequency / air interface (860-960 MHz Gen2v2 per ISO/IEC 18000-63:2015; 902-928 MHz FCC Part 15, 865-868 MHz ETSI EN 302 208), 5-SKU formats (adhesive shoe-laced Tyvek bib tag, silicone ankle-strap, foam-core pinned-on-bib, windshield cling for bike/tri course-validation, disposable D-tag for cycling), EPC / ID scheme (GS1 SGTIN-96 per GS1 TDS 2.0 + EPCIS 2.0 ObjectEvent for gun-time / split / finish; race-specific UII under ChronoTrack / MYLAPS / RFIDTS proprietary extensions), Timing accuracy (≤0.01 s net chip time with dual-antenna redundant mats, 0.1 s with single mat), Read range on mat (decoupled 80-120 cm mat coverage under AIMS/IAAF course-certification Ed. 2022), Environmental rating IP68 for swim-leg triathlon, Construction (RF foam / silicone / Tyvek), Pre-encoding & manifest (EPCIS ObjectEvent feed staged to MYLAPS Timing and Scoring / ChronoTrack Live / RFIDTS Tagtix / J-Chip / RaceResult 12 / RunSignUp), Compliance framework (World Athletics TR 30 + AIMS/IAAF + World Triathlon §4 + UCI Part 1 Ch. III / 1.2.071 + USATF Rule 245 + USAC + UKA + World Para Athletics), Platform integration, MOQ.
- `statBar` on Challenges: World Athletics TR 30 / AIMS/IAAF Ed. 2022 / ITU & UCI 2024 / IP68 swim-leg.
- `comparePanel` 5×5 on "How Proud Tek solves": commodity UHF bib tag (random EPC, no course-certification fit, no 0.01 s split accuracy, no MYLAPS/ChronoTrack platform wiring, no PMR swim-leg rating) vs Proud Tek race-timing programme (SGTIN-96 pre-encoded for event portfolio, AIMS/IAAF course-certification-compliant mat geometry, dual-antenna 0.01 s net-time, MYLAPS / ChronoTrack / RFIDTS / J-Chip / RaceResult 12 / RunSignUp manifest wiring, IP68 triathlon swim-leg qualified).
- Blocker C — prior "Results" section (fabricated chip-time accuracy percentages and implied client event-day throughput) rewritten as "Deployment patterns integrators follow on race-timing programmes" with dataHighlight ("unofficial hand-time 90-97% → chip-time 99%+" citing World Athletics Book 2024 Rule 30 + AIMS/IAAF Course Certification Ed. 2022 + ITU Rules 2024 + UCI Part 1 Ch. III) + 4-phase timeline (Weeks 1-3 event portfolio map + governing-body review → 4-5 SKU spec freeze + pilot-lot encoding + mat geometry validation → 6-8 first-event dry run + MYLAPS / ChronoTrack / RFIDTS integration → Month 3+ multi-event season scale).
- Sources: 10 at 5-field (World Athletics Book of Rules 2024 TR 30, AIMS/IAAF Course Measurement & Certification 2022, World Triathlon Competition Rules 2024, UCI Part 1 Ch. III 1.2.071, USATF Competition Rules 2024 Rule 245, USAC Rulebook 2024, UKA Rules 2024-2025, World Para Athletics 2024-2025, ISO/IEC 18000-63:2015, GS1 TDS 2.0 + EPCIS 2.0).

## Standards cited

World Athletics Book of Rules 2024, Technical Rule 30 "Timing" · AIMS/IAAF Course Measurement & Certification Ed. 2022 · World Triathlon Competition Rules 2024, §4 Timing · UCI Part 1 Ch. III / 1.2.071 · USATF Competition Rules 2024, Rule 245 · USAC Rulebook 2024 · UKA Rules 2024-2025 · World Para Athletics Rules & Regulations 2024-2025 · ISO/IEC 18000-63:2015 · GS1 Tag Data Standard 2.0 · GS1 EPCIS 2.0 ObjectEvent · FCC Part 15 Subpart C 902-928 MHz · ETSI EN 302 208 V3.3.1 865-868 MHz.

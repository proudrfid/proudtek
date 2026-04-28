# rfid-child-wristband — SHALLOW → DEEP

**Route.** `/products/rfid-wristbands/rfid-child-wristband/`

**Anchor standards & citations.**
- ISO/IEC 14443-A 13.56 MHz HF (NTAG213/215/216, MIFARE Classic 1K, Ultralight EV1) + ISO/IEC 18000-63 EPC Gen2v2 UHF (Impinj Monza R6 / R6-P, NXP UCODE 8) for dual-frequency passive headcount.
- U.S. CPSIA Section 101 lead and phthalate restrictions for children's products.
- ASTM F963 — Standard Consumer Safety Specification for Toy Safety.
- EU Toy Safety Directive 2009/48/EC + EN 71 series; EU REACH SVHC; RoHS Directive 2011/65/EU.
- FDA 21 CFR 177.2600 + ISO 10993-5 / 10993-10 biocompatibility evaluation framework reference.
- U.S. COPPA (Children's Online Privacy Protection Act) for under-13 PII handling on platform side.
- NCMEC Code Adam protocol — procedural framework for retail / family-venue lost-child response.
- Sizing: toddler 130-150 mm, child 150-170 mm, tween 170-190 mm; tamper-resistant closure spectrum (adhesive single-use, security snap, recessed-button child-proof).
- Daycare-management platform integration: Procare, Brightwheel, HiMama, Kindo, Famly, Tadpoles.

**DEEP block inventory.**
- `statBar.items[4]` — 3 sizes (toddler/child/tween) / CPSIA + ASTM F963 baseline / EU Toy Safety Directive / pair-workflow at check-in + pick-up.
- `comparePanel` — Single-day disposable / multi-month family pass closures vs higher-coercion environments (paediatric medical / behavioural-health adolescent / foster-care).
- `dataHighlight` — "Seconds" reunification time at help desk vs minutes-of-PA-announcements; tap-to-find replaces verbal-description workflow.
- `timeline` — 1980s-90s paper sign-out + photo ID checks → 1994 NCMEC Code Adam → 2008 CPSIA → 2010-2014 NXP NTAG silicon embed → 2015-2018 Disney MagicBand consumer scale → 2020-2024 Procare / Brightwheel / HiMama platforms → 2026 Today (Blocker C anchor: "family-water-park, school-field-trip, summer-camp, theme-park-multi-day, and swimming-class programmes").

**Brief.** 12 `{label, items[]}` objects covering substrate options for child wear, air interface and chip pairing, sizing for child-specific fit, tamper-resistant closures, parent-child UID-pairing workflow, lost-child / emergency-evacuation accountability, daycare / kids' club, school / camp / field-trip use, aquatic-venue child safety, branding and parental engagement, procurement and operations, regulatory and safety compliance.

**Sources[10].** ISO/IEC 14443-1..4, ISO/IEC 18000-63, NXP NTAG213 / 215 / 216 data sheet, U.S. CPSIA Section 101, ASTM F963, EU Toy Safety Directive 2009/48/EC, FDA 21 CFR 177.2600, ISO 10993-5, U.S. COPPA, NCMEC Code Adam protocol.

**Inbound refs (7).** Pillar, multiple wristband SKUs, industries/hospitality / events-venues / education / healthcare, solutions/rfid-event-access-control / rfid-patient-tracking.

**Outbound orphan scan.** 0 orphans across 15 hrefs.

**Task.** #338 completed.

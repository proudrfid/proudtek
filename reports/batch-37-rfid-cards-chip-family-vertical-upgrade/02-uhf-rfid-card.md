# Page 2/5 — uhf-rfid-card.json (Task #290)

**Before:** SHALLOW — no keywords array, string-array brief, 0 sources, no block sections
**After:** DEEP framework complete

## Anchor stack

GS1 EPC Gen2v2.1 · ISO/IEC 18000-63 · Impinj Monza R6 / M700 / M800 · NXP UCODE 8 / UCODE 9 · Alien Higgs-9 · ETSI EN 302 208 (European UHF band) · FCC Part 15.247 (North American UHF band) · ARIB STD-T106 (Japan) · ITU-R SM.2221.

## DEEP block summary

- **keywords[6]** — UHF RFID card, EPC Gen2v2 card, ISO 18000-63 card, long-range RFID card, hands-free access card, speed-lane access card.
- **brief[12]** — labelled objects on EPC Gen2v2.1 protocol, 860-960 MHz regional band allocations, chip choice (Monza R6/M700/M800, UCODE 8/9, Higgs-9), read range (2-8 m typical), antenna & card body trade-offs, EPC memory banks, user memory & encoding, anti-collision / Q-algorithm throughput (100+ tags/s), reader ecosystem (fixed portals, handhelds), deployment archetypes (vehicle gate, speed-lane, warehouse, healthcare zone, conferences), orientation sensitivity, regulatory envelope.
- **statBar** — 2-8 m practical read range, 100+ tags/s inventory rate, 33-36 dBm ERP (regional), ISO 7810 ID-1 form factor.
- **comparePanel** — UHF card vs HF card vs LF card across frequency band, typical read range, anti-collision throughput, orientation tolerance, typical use-case.
- **dataHighlight** — **"600-1,200 transactions per hour per lane"** — hands-free speed-lane throughput at vehicle gates and staff speed-gates, versus ~300-600/hr on tap-and-go HF turnstiles. The throughput delta is what justifies the UHF infrastructure cost.
- **timeline** — EPC Gen2 v1 (2004) → ISO 18000-63 harmonisation (2013) → EPC Gen2v2 (2013, v2.1 2018) → Monza R6 launch (2014) → UCODE 8 (2017) → Higgs-9 (2018) → M700 (2019) → M800 / UCODE 9xe (2022-2023) → integrator deployment closer.
- **sources[10]** — GS1 EPC Gen2v2.1 specification, ISO/IEC 18000-63, Impinj Monza R6 datasheet, Impinj M700 datasheet, Impinj M800 datasheet, NXP UCODE 8 datasheet, NXP UCODE 9 datasheet, Alien Higgs-9 datasheet, ETSI EN 302 208, FCC Part 15.247 / ARIB STD-T106 regulatory summary.
- **Blocker C** — "Deployment patterns integrators follow on vehicle-gate-access, speed-lane-turnstile, hands-free-healthcare-zone, warehouse-personnel-safety and conference-session-tracking UHF RFID card programmes."

## Validation

`npx astro sync` — clean, 916 ms.
Inbound refs — 4 (_pillar + rfid-wristbands/uhf-rfid-wristband + lp/bulk-rfid-cards **[added]** + solutions/rfid-access-control **[added]**).

# Page 1/5 — icode-slix-card.json (Task #289)

**Before:** SHALLOW — no keywords array, string-array brief, 0 sources, no block sections
**After:** DEEP framework complete

## Anchor stack

ISO/IEC 15693 (vicinity contactless) · ISO/IEC 18000-3 Mode 1 · NXP SL2S2002 / SL2S2602 datasheet · NFC Forum Type 5 · ISO 28560-2 (library RFID data model) · Danish Data Model 2.0 · BISG (Book Industry Study Group) · ETSI EN 300 330 · FCC Part 15.225.

## DEEP block summary

- **keywords[6]** — ICODE SLIX chip, ISO 15693 card, vicinity RFID card, library self-service card, NFC Type 5 card, anti-collision bulk-read card.
- **brief[12]** — labelled objects covering chip family, standards, memory/anti-collision, read range & orientation, bulk-read throughput, library data models (ISO 28560-2 + DDM2), NFC Forum Type 5 bridging, regulatory (EN 300 330 / FCC 15.225), card-body construction, alternative form factors, deployment archetypes, reader ecosystem.
- **statBar** — 896/2,528 bits (SLIX/SLIX2), 30 cm - 1 m read range, ~300 ms 30-card inventory, ISO 28560-2 data model.
- **comparePanel** — ICODE SLIX vs ICODE SLIX2 vs MIFARE Classic 1K side-by-side on frequency/standard, memory, anti-collision, reader-side cost, typical deployment.
- **dataHighlight** — **"~300 ms vs ~30 s"** — the bulk-read economics that drive library self-service ROI (30 books inventoried via ISO 15693 anti-collision in the time it takes to scan one book at a traditional HF checkpoint).
- **timeline** — ISO/IEC 15693 standardisation (2000) → SLIX launch (2007) → ISO 28560 publication (2011) → Danish Data Model 2.0 (2016) → NFC Forum Type 5 ratification (2015) → SLIX2 launch (2014) → NFC smartphone Type 5 read support (iOS 13, 2019) → integrator deployment closer.
- **sources[10]** — ISO/IEC 15693-2/-3, NXP SL2S2002 datasheet, NXP SL2S2602 datasheet, NFC Forum Type 5 Tag Technical Specification, ISO 28560-2, BISG RFID in U.S. Libraries report, Danish Data Model 2.0, ETSI EN 300 330, FCC Part 15.225, Apple iOS 13 NFC capabilities release notes.
- **Blocker C** — "Deployment patterns integrators follow on library-self-service, file-folder-tracking, gas-bottle-fleet, industrial-laundry-staff and records-management ICODE SLIX programmes."

## Validation

`npx astro sync` — clean, 926 ms.
Inbound refs — 4 (_pillar + industries/libraries + guides chip encyclopedia + solutions).

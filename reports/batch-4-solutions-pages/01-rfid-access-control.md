# 01 — RFID Access Control

**File:** `src/content/editorial/solutions/rfid-access-control.json`
**Route:** `/solutions/rfid-access-control/`
**Status:** Refined, verified.

## Audit (pre-refinement)

- `heroImage` was `/landing-images/hospital-patient-id-wristband.jpg` — a healthcare/wristband photo on an access-control page. Semantically wrong; any OG-card preview would have mislead.
- `publishedAt` and `modifiedAt` were absent.
- Only **1** `resourceCards` entry existed. No cross-link to Batch 3 compare pages (`mifare-plus-ev2-vs-desfire-ev3`, `125khz-vs-13.56mhz-rfid`, `mifare-classic-vs-plus-vs-desfire-hotel-locks`) and no cross-link to the Batch 2 industry landings refined earlier (hospitality, education, healthcare, luxury-brands, brand-protection).
- Hero bullet 3 carried an unqualified "every major access control platform" claim — directionally true but rhetorically overreaching for a procurement audience.
- `primaryAction.href` was bare `/contact/` (broken — root doesn't render).

## Changed

**Image.** heroImage: `hospital-patient-id-wristband.jpg` → `rfid-employee-badge.jpg`. File verified in `/public/landing-images/`. `imageAlt` updated to match.

**Metadata.** Added `publishedAt: "2026-04-22"`, `modifiedAt: "2026-04-23"`.

**Claim hygiene.** Hero bullet 3 rewritten from "every major access-control platform" to "compatible with the major access-control ecosystems in the installed base. Credentials regularly programmed for HID iCLASS / SEOS, Gallagher, Salto, Keri, Honeywell, Bosch and ASSA ABLOY reader families — send us a sample credential or the reader model and we confirm the chip and encoding format before production." — turns a blanket assertion into a named-partner list plus a concrete next step.

**Cross-link density.** Expanded `resourceCards` from 1 → 3 entries:
1. **Access control credential products** — 10 Batch 1 SKUs: EM4100, MIFARE Classic 1K, MIFARE Plus SE, DESFire EV3, NTAG 424 DNA TT, dual-frequency, employee badge, student ID, ASSA ABLOY-compatible, ABS keyfob.
2. **Industry landings** — 6 Batch 2 verticals: hospitality, education, healthcare, luxury-brands, industrial, data-center-it-asset-tracking.
3. **Related comparisons and migration guidance** — 5 entries including 3 Batch 3 compare pages (`mifare-plus-ev2-vs-desfire-ev3`, `125khz-vs-13.56mhz-rfid`, `mifare-classic-vs-plus-vs-desfire-hotel-locks`), the hotel-rfid-access-control sibling solution and the RFID keyfob guide.

**Routing fix.** `primaryAction.href`: `/contact/` → `/contact/access-control-keyfobs/` (verified to resolve).

## SEO / GEO shape

Strong. Answer-first summary identifies the solution category and the chip-family range in one sentence. First hero-points line gives the three-tier security answer (EM4100 / Classic / DESFire EV3) in the shape an LLM extractor can quote verbatim. `statBar` gives four machine-extractable fact-tokens (`125 kHz`, `13.56 MHz`, `AES-128`, `All systems`). `featureGrid` provides six explicit chip→use-case mappings. FAQ has three distinct Q/A pairs with the three most likely queries (chip selection, HID / Gallagher compatibility, cloning resistance).

Sources block cites 8 authoritative references: ISO/IEC 14443, ISO/IEC 18000-63, NXP DESFire EV3, HID Global PACS, EM Microelectronic EM4100, NIST SP 800-116, UL 294, IEC 60839-11-1 — fully sufficient for EEAT at the regulatory / standards level.

## Verification

- JSON parses ✅
- Zod schema ✅
- `heroImage: /landing-images/rfid-employee-badge.jpg` exists on disk ✅
- 24 internal hrefs, all resolve ✅
- `publishedAt` + `modifiedAt` set ✅

## Open items

- **Dual-frequency SKU (`/products/rfid-cards/dual-frequency-rfid-card/`)** is linked in resourceCards but has not been Batch-1-refined. Candidate for the next SKU batch.
- **`/solutions/hotel-rfid-access-control/`** is referenced as a related solution but has not been audited in this batch. Candidate for a Batch 5 if the decision is to expand the solutions cohort beyond the flagship 6.
- **`/blog/rfid-key-fob-access-control/`** — surface area / answer-shape unknown; flag for a blog-tier Batch.
- Dual-frequency cards and biometric+RFID combo credentials are only mentioned in one bullet each. If access control is a priority vertical, these could each become dedicated sub-pages.

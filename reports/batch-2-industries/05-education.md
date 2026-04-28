# 05 — Education RFID

**Route:** `/industries/education/`
**File:** `src/content/editorial/industries/education.json`
**Title:** Education RFID — Student IDs, Attendance & Library Systems (58 chars)

## Audit — what the old page was missing

- Title 68 chars — over the search-snippet threshold.
- 2 sections total, both bullet-only. No decision table, no rollout timeline, no checklist, no comparePanel, no featureGrid.
- No chip decision matrix — page said "MIFARE Classic 1K, MIFARE DESFire or dual-frequency" without explaining when to pick which, and did not flag the 2008 CRYPTO-1 break that makes Classic 1K the wrong default for stored-value cashless.
- No ICODE SLIX / ISO 28560 / NISO RP-6-2012 framing — library RFID is the most mature campus-RFID workflow and it had no standards references on the page.
- No FERPA / GDPR / COPPA framing — education-RFID procurement officers ask about these before they ask about SKUs.
- 3 FAQ entries. Missing `keywords`, `publishedAt`, `modifiedAt`.

## Changed — what the new page contains

- **Structure (7 sections):** What is + `statBar` (ISO 14443, ISO 28560, AES-128 DESFire, FERPA / GDPR) → chip decision `table` (Classic 1K vs Plus EV2 vs DESFire EV3 vs ICODE SLIX vs dual-frequency, each with air interface, security posture, typical campus use, and note) → three-workflow `comparePanel` ("what the card does" vs "what you have to get right") → six-category `featureGrid` (student ID, staff/faculty, library book tags, dorm fobs, DESFire upgrade, event wristbands) → 5-phase rollout `timeline` (access → library → cashless → analytics → events) → context image (library book tag) → privacy/compliance `bullets` + `checklist`.
- **Chip-per-workflow is explicit:** library books sit on ISO 15693 / ICODE SLIX, student IDs on ISO 14443 / MIFARE — the page tells you these air interfaces do not cross-read, so you plan separate readers.
- **Cashless campus drives DESFire recommendation:** the decision `table` and FAQ both make the case that if the card stores value (meal plan, print credit, transit), DESFire EV3 is the right default because CRYPTO-1 has been broken since 2008.
- **HeroPoints:** 3 answer-first bullets (one card many functions, ICODE SLIX + ISO 28560 library interop, FERPA/GDPR privacy-by-design).
- **FAQ:** 7 entries (best chip for student ID, variable-data printing, Sierra/Alma/Koha/Evergreen ILS interop, FERPA/GDPR attendance legality, network-down fail-safe, dual-frequency bridge, realistic 10k–25k student timeline).
- **Cross-links:** 3 `resourceCards` (SKUs, solutions, chip-family compare). `secondaryActions` route to `/products/rfid-cards/rfid-student-id-card/`, `/solutions/rfid-attendance-system/`, `/solutions/rfid-library-management/`.
- **Facets:** `chipFamilies: ["mifare-classic","mifare-desfire","mifare-plus","icode","em-tk5"]`, `envFamilies: []` (no environmental-stress facet — student ID cards are indoor, standard-temp), `relatedIndustries: ["libraries","hospitality","events-venues","fitness"]`.

## SEO & GEO

- **Title** 58 chars. Keyword first ("Education RFID"), with three high-intent modifiers ("Student IDs", "Attendance", "Library Systems").
- **Summary** answer-first: names MIFARE DESFire EV3 / Classic 1K, ICODE SLIX to ISO 28560, FERPA and GDPR — the phrase a procurement RFI will paraphrase.
- **keywords:** "education RFID", "RFID student ID cards", "RFID attendance system", "library RFID ICODE SLIX", "MIFARE DESFire campus cards", "FERPA GDPR RFID schools".
- **GEO hooks:** the chip decision matrix is quote-friendly ("Library tags and student IDs are on different air interfaces — ICODE SLIX (ISO 15693) and MIFARE (ISO 14443) do not cross-read."). The three-workflow `comparePanel` ("what the card does" / "what you have to get right") directly answers "what do I need to think about before rolling out RFID student IDs".

## Sources cited (8)

U.S. FERPA (20 U.S.C. § 1232g) · U.S. COPPA (15 U.S.C. §§ 6501–6506) · ISO/IEC 14443 (HF proximity) · ISO/IEC 15693 (HF vicinity) · NISO RP-6-2012 (RFID in US libraries) · ISO 28560 (RFID in libraries, Parts 1–4) · NXP MIFARE DESFire EV3 product brief · EU GDPR Regulation (EU) 2016/679 (Articles 6, 8, 25).

## Verification

- ✅ JSON parses; Zod `editorialSchema` validates (after correcting section-subtype shapes to match real schema).
- ✅ All 13 internal `href`s resolve.
- ✅ `heroImage` (`/landing-images/ppc-custom-rfid-cards.jpg`) and section image (`/landing-images/rfid-library-book-tag.jpg`) exist.
- ✅ `chipFamilies` enum values match `FACET_RULES` in `src/lib/catalog-pages.ts`.
- ✅ `relatedIndustries` all resolve.
- ⚠️ Lighthouse — not run; see batch summary.

## Open items

- Consider adding a consolidated `/solutions/campus-rfid/` page that bundles attendance + access + library + cashless into one solution landing. This education page currently cross-links to three separate solutions which inflates click-depth.
- Add an `/industries/libraries/` cross-check — we currently have `libraries.json` and it should echo the ISO 28560 / NISO RP-6-2012 framing. If it does not, align it in the next batch.
- Consider splitting the page audience: K-12 vs higher education are different procurement profiles (K-12 leans COPPA + lowest per-card cost; higher education leans DESFire + cashless). If traffic analytics justify it, split to `/industries/k12-education/` and `/industries/higher-education/` and redirect `/industries/education/` to a chooser page.
- The FAQ mentions realistic 12–18 month timelines for a 10k–25k-student rollout; source that to one or two named university deployments once Marketing has a signed-off case study.
- Author detail — consider adding one education-relevant credential (CDE / EDUCAUSE membership, experience with specific SIS platforms) to `authors/peter-zhang.json` so Article.author JSON-LD carries the right signal for this industry.

# 02 — Healthcare RFID

**Route:** `/industries/healthcare/`
**File:** `src/content/editorial/industries/healthcare.json`
**Title:** Healthcare RFID — Patient ID, Instrument Tracking, DSCSA (56 chars)

## Audit — what the old page was missing

- Title 72 chars — above the search-snippet threshold.
- Bullet-only sections with unverified dollar claims ("$3.4M annually saved" etc.) and one date-sensitive regulatory claim about DSCSA that had drifted since the original write.
- No risk-surface framing — the page listed "RFID benefits" instead of the specific clinical failure modes RFID addresses.
- No sterile-supply specification (autoclave cycle count, temperature rating, tag material) — the central question for hospital-central-supply procurement.
- 3 FAQ entries. 0 `sources`, 0 `keywords`, no `publishedAt`/`modifiedAt`.

## Changed — what the new page contains

- **Structure (6 sections):** What is + `statBar` (1,000+ autoclave cycles, −196 °C cryogenic, latex-free, GS1 SGTIN) → clinical-risk `comparePanel` ("before RFID" vs "after RFID") at four risk surfaces → product `table` (wristbands, instrument tags, specimen labels, medication labels, each with air interface + chip + note) → failure-mode `featureGrid` → DSCSA 5-stage `timeline` → compliance `bullets` + `checklist`.
- **Risk-surface framing:** where RFID actually moves the clinical-error rate — wrong-patient events at medication administration, wrong-site surgery, sterile-instrument count discrepancies, specimen misidentification. The page names each surface and the tag that addresses it.
- **DSCSA timeline softened:** old page named a specific effective date that had moved; new page references "check the FDA's current DSCSA stabilisation-period position" so it stays current as the FDA clarifies.
- **HeroPoints:** 3 answer-first bullets (NFC wristbands EMR-linked, ceramic autoclave tags, DSCSA-ready SGTIN labels).
- **FAQ:** 7 entries (autoclave survival, cryogenic adhesion, DSCSA readiness, Epic/Cerner/Meditech integration, ISBT 128 blood-bag compliance, MRI interaction, patient-wristband hypoallergenic certification).
- **Cross-links:** 3 `resourceCards` (SKUs, solutions, compare) — all routes real.
- **Fixed routes:** all `/product/*/` removed; `secondaryActions` route to `/products/rfid-wristbands/hospital-patient-id-wristband/`, `/solutions/rfid-patient-tracking/`, `/compare/uhf-vs-hf-rfid/`.
- **Facets:** `chipFamilies: ["mifare-desfire","ntag21x","ntag424","ucode","impinj-m7"]`, `envFamilies: ["high-temp","sensor"]`, `relatedIndustries: ["pharmaceutical","laundry-services","cold-chain-food-traceability","luxury-brands"]`.

## SEO & GEO

- **Title** 56 chars, keyword first, with the three high-intent modifiers ("Patient ID", "Instrument Tracking", "DSCSA") that hospital IT and pharmaceutical-supply-chain buyers search.
- **Summary** answer-first: names EMR platforms (Epic, Cerner, Meditech), names the sterilisation standard (AAMI ST79), and anchors the DSCSA framing — this is the paragraph the LLM will quote.
- **keywords:** "healthcare RFID", "RFID patient wristbands", "surgical instrument tracking RFID", "DSCSA serialized labels", "autoclave RFID tags", "cryogenic specimen labels".
- **GEO hooks:** the risk-surface `comparePanel` is phrased as "without RFID / with RFID" — directly maps to how an LLM structures a "why does healthcare use RFID" answer. The DSCSA `timeline` gives an LLM a ready-made five-step explainer to quote for the regulatory question.

## Sources cited (8)

FDA DSCSA landing page · GS1 Healthcare (SGTIN + application identifiers) · AAMI ST79 (steam sterilisation reference) · HIPAA Security Rule (45 CFR §§ 164.308–164.316) · ISO 14443 (HF air interface) · NXP MIFARE DESFire EV3 brief · Impinj M7xx / UHF healthcare reference · ICCBBA ISBT 128 (blood, cellular therapy, human tissue identification standard).

## Verification

- ✅ JSON parses; Zod `editorialSchema` validates against the real schema in `src/content.config.ts`.
- ✅ All 13 internal `href`s resolve.
- ✅ `heroImage` (`/landing-images/healthcare.webp`) exists.
- ✅ `chipFamilies` and `envFamilies` enum values match `FACET_RULES` in `src/lib/catalog-pages.ts`.
- ✅ `relatedIndustries` all resolve.
- ⚠️ Lighthouse — not run; see batch summary.

## Open items

- Re-verify DSCSA language against the FDA's current stabilisation-period position before each publish cycle; we intentionally avoided naming a specific date so this page does not drift.
- Add a dedicated `/compare/uhf-dscsa-labels-vs-2d-data-matrix/` page — DSCSA permits both, buyers ask the question, and this industry page only has space to flag it.
- Confirm with fulfilment whether the 1,000+ autoclave-cycle figure on the `statBar` is vendor-datasheet (NXP / HID / Confidex) or ProudTek-tested. If the former, add a footnote citing the datasheet lot; if the latter, name the test protocol (AAMI ST79 Annex P) on the SKU page.
- Author detail `authors/peter-zhang.json` should add at least one healthcare-relevant credential in `expertise` or `credentials` — DSCSA, GS1 Healthcare or HIPAA awareness — to strengthen the Article.author JSON-LD for this specific industry page.

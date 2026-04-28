# 01 — MIFARE Plus EV2 vs DESFire EV3

**Route:** `/compare/mifare-plus-ev2-vs-desfire-ev3/`
**File:** `src/content/editorial/compare/mifare-plus-ev2-vs-desfire-ev3.json`
**Title:** MIFARE Plus EV2 vs DESFire EV3 — The Practical HF 13.56 MHz Card Comparison (80 chars, above the search-snippet threshold; see Open items)

## Audit — what this refinement pass found

- GEO: Strong. 10-row decision table, 6-part "two chips at a glance", explicit SL0–SL3 security-level ladder, file-system vs sector model framing, field-cite of EAL4+ vs EAL5+. The page is already in the shape an answer engine wants to quote from.
- Cross-links: Thin on both edges. Pre-refinement the resourceCards pointed only at Plus SE + DESFire EV3 SKUs; no link to `mifare-classic-1k-card`, `ntag424-dna-tt-card`, or `em4100-rfid-card`. Zero Batch 2 industry cross-links.
- Claim hygiene: Two specific unverified point estimates — "€0.30–0.40" Plus EV2 unit price / "€0.60–0.90 / €1.20 for 8K" DESFire EV3, and "Plus EV2 typically 40–60% slower [in bulk write] than DESFire EV3". Both softened.
- Image: `mifare-classic-plus-desfire-hotel-chip-compare.jpg` — verified present in `/public/landing-images/`. Kept.

## Changed — what the new version contains

- **Pricing language softened.** HeroPoints[2] now says "roughly half to two-thirds the silicon cost of DESFire EV3 2K, and the DESFire 8K variant is typically priced at 1.5x to 2x the DESFire 2K level (indicative; depends on converter, finish, distributor and current NXP allocation, so request a quote against your real BOM)". The "Typical unit price (1M)" row in the quick comparison table was relabelled "Typical unit price (1M, relative)" with values "Baseline (lower)" and "Roughly 1.5–2.5× Plus EV2 depending on memory". The migration-framework bullet referring to "€0.30–0.50 per-card saving" now reads "the Plus-vs-DESFire per-card silicon delta".
- **Bulk-write claim softened.** "40–60% slower" replaced with "meaningfully faster per card; quantify it against your actual personalization flow before committing — the delta depends heavily on reader firmware, HSM round-trips and key-injection model".
- **Cross-links expanded** on two fronts. `resourceCards` gained explicit links to `/products/rfid-cards/mifare-classic-1k-card/` (as the legacy-comparison baseline), `/products/rfid-cards/ntag424-dna-tt-card/` (as the right chip when the job is tap-to-verify, not access-control), and `/products/rfid-cards/em4100-rfid-card/` (as the LF baseline). A new full `resourceCards` entry, "Industry landings that use these chips", links to `/industries/hospitality/`, `/industries/education/`, `/industries/healthcare/`, `/industries/luxury-brands/`, and `/industries/brand-protection/`.
- **Ecosystem section restructured** to carry the new cross-links inline where they actually answer reader questions: the corporate access bullet points at `/solutions/rfid-access-control/`, the hotel bullet points at `/industries/hospitality/`, a new bullet on education & campus points at `/industries/education/`, a new bullet on brand protection / luxury names the right chip (NTAG 424 DNA) and links `/industries/brand-protection/`, `/industries/luxury-brands/`, and `/products/rfid-cards/ntag424-dna-tt-card/`. The "loyalty and membership" bullet gained explicit Classic-CRYPTO-1 hygiene language and a link to `/products/rfid-cards/em4100-rfid-card/` and `/products/rfid-cards/mifare-classic-1k-card/`.
- **`modifiedAt`** bumped to 2026-04-23.

## SEO & GEO

- Title is 80 chars — above the 60–70 char search-snippet threshold. The exact-match `MIFARE Plus EV2 vs DESFire EV3` is front-loaded but the "Practical HF 13.56 MHz Card Comparison" trail adds a lot of weight. Suggested tighter form: "MIFARE Plus EV2 vs DESFire EV3 — HF Chip Comparison" (53 chars) or "MIFARE Plus EV2 vs DESFire EV3 — Silicon, Security, Price" (55 chars). Deferred so we do not shift the title across a single refinement pass.
- Summary is answer-first. Names AES-128, ISO/IEC 14443-A, SL1 / SL2 / SL3, and the file-system vs sector distinction inside the first 3 sentences — this is the paragraph an LLM answer engine will quote for "Plus EV2 vs DESFire EV3 which to pick".
- GEO hooks: the 10-row quick-comparison table is phrased in question-then-answer rows (`"EAL certification" | EAL4+ (hardware) | EAL5+ (hardware)`), which maps cleanly to how an LLM reformats into a comparison answer. The migration-framework bullets are structured as `If you are X → choose Y` which is the exact form an LLM uses to assemble a decision answer.

## Verification

- ✅ JSON parses.
- ✅ Zod `editorialSchema` validates.
- ✅ All 25 internal `href`s resolve.
- ✅ `heroImage` (`/landing-images/mifare-classic-plus-desfire-hotel-chip-compare.jpg`) exists.
- ⚠️ Lighthouse — not run; see batch summary.

## Open items

- Tighten the title to ≤60 chars in a dedicated title-polish pass across the whole `/compare/` pillar so we do not shift one in isolation. Candidate: "MIFARE Plus EV2 vs DESFire EV3 — HF Chip Comparison".
- Per the duplicate-pair audit (see `99-duplicate-audit.md`), absorb the Plus SE and DESFire Light variant coverage from the family-level `/compare/mifare-plus-vs-desfire/` page into this page before we 301 the family-level route.
- If Marketing wants to publish a concrete €-per-card figure on this page, it should come from a live dated quote from a named converter (Beontag, Arizon, Avery Dennison, Smartrac) and be tagged with the quote date + volume tier so the page does not drift as NXP allocation tightens or loosens.
- Author detail — consider upgrading `authorSlug` from `editorial-board` to `peter-zhang` on this chip-deep comparison, with credentials in `authors/peter-zhang.json` that explicitly mention DESFire EV3 command-level work and MIFARE Plus SL-transition migrations. The EEAT signal is visibly weaker on `editorial-board`-authored chip-deep pages.

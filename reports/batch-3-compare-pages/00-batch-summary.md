# Batch 3 — Compare Pages (summary)

Scope: five flagship compare pages refined as a pass rather than a full rewrite, plus a duplicate-pair audit covering three sibling-compare clashes.

## Pages in scope

| # | Route | File | Status |
|---|---|---|---|
| 01 | `/compare/mifare-plus-ev2-vs-desfire-ev3/` | `compare/mifare-plus-ev2-vs-desfire-ev3.json` | Refined |
| 02 | `/compare/ntag213-vs-ntag215-vs-ntag216/` | `compare/ntag213-vs-ntag215-vs-ntag216.json` | Refined |
| 03 | `/compare/uhf-vs-hf-rfid/` | `compare/uhf-vs-hf-rfid.json` | Refined |
| 04 | `/compare/125khz-vs-13.56mhz-rfid/` | `compare/125khz-vs-13.56mhz-rfid.json` | Refined |
| 05 | `/compare/ucode8-vs-ucode9-vs-monza-r6-vs-higgs9/` | `compare/ucode8-vs-ucode9-vs-monza-r6-vs-higgs9.json` | Refined |

## What the refinement pass covered

The Batch 3 audit flagged four refinement targets for all 5 pages: GEO / answer-shape, cross-link density to Batch 1 (flagship RFID cards) and Batch 2 (flagship industry landings), claim hygiene, and image / diagram check. Each page was edited against all four.

- **GEO / answer-shape** — already strong across the cohort coming in (the audit scored 4 of 5 pages "Excellent" or "Strong"). No structural rewrites were needed here; where a paragraph paraphrased in a way that an LLM answer-engine would struggle to quote cleanly, the phrasing was tightened in place.
- **Cross-link density** — the pre-refinement state was critically thin: 0 Batch 2 industry cross-links on any of the 5 pages, and 0 to 3 Batch 1 SKU cross-links per page. Every page now carries an explicit "Industry landings" resourceCard (5 links into Batch 2: hospitality, healthcare, education, brand-protection, luxury-brands, selected per page relevance) and a Batch 1 SKU cluster (mifare-classic-1k-card, mifare-plus-se-card, mifare-desfire-ev3-card, ntag424-dna-tt-card, em4100-rfid-card — selected per page relevance).
- **Claim hygiene** — specific unverified pricing figures (€0.30–0.40 Plus, €0.60–0.90 DESFire, sub-cent Monza R6, tag-cost FOB table rows), specific percentage claims ("55–60% of NA access-control still 125 kHz per SIA 2024"), and specific episodic claims ("over a million HID Prox credentials cloned since 2013", "$10,000+ per year IV pumps", "40–60% slower bulk write") were softened to directional language with explicit "quote against your real BOM / pilot" guidance where the original page had published an unsourced point estimate.
- **Image / diagram check** — three pages carried a `heroImage` that did not resolve to a real file in `/public/landing-images/` (two used the generic `eu-compliance.jpg`, one pointed at `/landing-images/uhf-rain-rfid-chip-comparison.jpg` which does not exist; the NTAG page had no `heroImage` at all). Each was replaced with a real image file: `dual-frequency-rfid-card.webp` for the two frequency-class compares, `alien-higgs-9-uhf-inlay.jpg` for the UCODE / Monza / Higgs compare, and `ntag213-nfc-sticker.jpg` for the NTAG21x compare. The Plus EV2 vs DESFire EV3 page already had a valid `mifare-classic-plus-desfire-hotel-chip-compare.jpg`.

## Duplicate-pair audit (done; no deletions)

Three sibling-compare duplicates were surveyed per the user's "audit + recommend canonical, no deletion" preference. Recommendations are in `99-duplicate-audit.md`. Summary:

- **MIFARE Plus vs DESFire** — keep `mifare-plus-ev2-vs-desfire-ev3` as canonical; 301 from the family-level `mifare-plus-vs-desfire`; merge the Plus SE / DESFire Light variant notes into the canonical before retiring the family-level page.
- **PPS vs silicone laundry tags** — keep `pps-vs-silicone-vs-textile-rfid-laundry-tags` as canonical (three-way is the richer framework); 301 from `pps-vs-silicone-laundry-tags`; merge the deeper attachment-method cost deltas from the binary page before retiring it.
- **RFID vs magnetic hotel card** — leave both. The two pages serve different buyer personas (`rfid-vs-magnetic-hotel-key-cards` is the procurement/operator page; `rfid-hotel-card-vs-magnetic-stripe` is the executive/marketing summary). Recommendation is to wire them together with explicit cross-links rather than redirect.

## Verification status

| Check | Result |
|---|---|
| JSON parses | 5 / 5 ✅ |
| Zod `editorialSchema` parse | 5 / 5 ✅ |
| `heroImage` file exists in `/public/landing-images/` | 5 / 5 ✅ |
| Internal hrefs resolve | 118 / 118 ✅ (after fixing 3 pre-existing broken product routes on the UCODE page) |
| `modifiedAt` bumped to 2026-04-23 | 5 / 5 ✅ |
| Lighthouse | ⚠️ deferred — no public URL, binary not installed in sandbox |

The 3 pre-existing broken routes on the UCODE compare page (`/products/rfid-labels/uhf-rfid-label/`, `/products/rfid-tags/on-metal-uhf-rfid-tag/`, `/products/rfid-tags/uhf-pallet-rfid-tag/`) were corrected to the real SKU routes (`uhf-rfid-inlay`, `rfid-on-metal-uhf-tag`, `rfid-pallet-tag`). Those were not introduced by this refinement; they were caught by running the cross-link resolver after the refinement and fixed opportunistically.

## Cross-cutting open items

- Lighthouse remains deferred across all three batches. Needs a public preview URL or a `lhci` run against `astro preview` in CI, neither of which is in scope for this sandbox.
- Some per-chip ASP language is now directional ("single-digit cents", "an order of magnitude higher") rather than pointed. If Marketing wants to publish specific FOB cents-per-card on these pages, they should come from a live, dated quote from converters (Avery Dennison / Smartrac, Beontag, Arizon, Impinj authorized distribution, NXP authorized distribution) rather than be republished from anonymous figures.
- The `authors/peter-zhang.json` credential profile is cited on every compare page as `reviewedBySlug`. As with Batch 2, that author profile should grow per-vertical credentials so that the JSON-LD `Article.author.knowsAbout` carries the right signal per page — chip-level (EPC Gen2 v2, ISO 14443, ISO 15693), standards-body (GS1 EPC TDS 2.0), and operator-level (OSDP v2, DSCSA, DPP/ESPR).
- All 5 pages still publish on `authorSlug: "editorial-board"` — confirm Editorial wants the Proud Tek editorial board as primary author or whether Peter Zhang should step up to `authorSlug` on the chip-deep comparisons (Plus vs DESFire, UCODE / Monza / Higgs in particular).

## Per-page reports

Open `01-mifare-plus-ev2-vs-desfire-ev3.md` through `05-ucode8-ucode9-monza-r6-higgs9.md` for per-page audit / changed / SEO-GEO / verification / open-items detail, and `99-duplicate-audit.md` for the sibling-compare duplicate recommendations.

# 02 — NTAG213 vs NTAG215 vs NTAG216

**Route:** `/compare/ntag213-vs-ntag215-vs-ntag216/`
**File:** `src/content/editorial/compare/ntag213-vs-ntag215-vs-ntag216.json`
**Title:** NTAG213 vs NTAG215 vs NTAG216 — The Practical NFC Tag Memory and Performance Comparison (88 chars, above the search-snippet threshold; see Open items)

## Audit — what this refinement pass found

- GEO: Excellent. The page already leads with the "one-dimension" answer (144 / 504 / 888 bytes) in the first two sentences of the summary and repeats it in `heroPoints[0]`. The 12-row quick-comparison table, the "three chips at a glance" bullets, the NDEF-sizing rules of thumb, and the application-fit bullets all map to the shapes an LLM answer engine will quote from. No structural rewrite needed.
- Image: `heroImage` was missing entirely on this page pre-refinement. The rest of the cohort had a `heroImage` field (even if two of them pointed at the wrong file); this one had no field at all.
- Claim hygiene: Three pricing-adjacent claims — an "NTAG213 ~€0.06, NTAG215 ~€0.09, NTAG216 ~€0.12" row in the comparison table, a near-identical per-chip cents figure in the FAQ pricing answer, and a standalone cents-per-ferrite figure in the on-metal discussion. All softened.
- Cross-links: Thin on Batch 1 (no DESFire EV3, no Plus SE, no 424 DNA outside the SUN guide) and zero Batch 2 industry links. `resourceCards` pre-refinement pointed at NTAG-family SKUs and NTAG guides only.

## Changed — what the new version contains

- **`heroImage` added.** Set to `/landing-images/ntag213-nfc-sticker.jpg`, which is the most representative existing file in `/public/landing-images/` — a clean shot of an NTAG213 sticker with visible IC and antenna. The field was missing; this also fixes the upstream OG-image / Twitter-card fallback.
- **Pricing softened in the table.** The row "Typical unit price (100k vol.)" with values "~€0.06 / ~€0.09 / ~€0.12" was relabelled "Typical unit price (100k vol., relative)" with values "Baseline (lowest)", "Roughly 1.4–1.6× NTAG213", and "Roughly 1.8–2.2× NTAG213". The directional multiplier is defensible; the absolute cents figure was not without a live converter quote.
- **Pricing softened in the FAQ.** The FAQ answer to "What's the cost difference between NTAG213 and NTAG216?" was rephrased from a specific cents-per-chip gap to "a roughly 1.8–2.2× multiplier at 100k volume, which translates to a small per-card cents delta at scale" with the same "depends on converter, finish, current NXP allocation — request a quote against your real BOM" caveat used on page 01.
- **Ferrite-cost softening in the on-metal discussion.** The "adds ~€0.03–0.05 per tag" ferrite figure became "adds a small cents-level premium per tag that is typically dwarfed by the labour cost of attaching the tag to the metal substrate".
- **Cross-links expanded.** `resourceCards` gained explicit links to `/products/rfid-cards/ntag424-dna-tt-card/` (when SUN / tamper-evident is required), `/products/rfid-cards/mifare-desfire-ev3-card/` (when AES + file system is required), and `/products/rfid-cards/mifare-plus-se-card/` (when AES-capable access-control is the job). A new full `resourceCards` entry, "Industry landings where NTAG21x fits (and where it doesn't)", links to `/industries/brand-protection/`, `/industries/luxury-brands/`, `/industries/hospitality/`, `/industries/education/`, and `/industries/healthcare/` — each label phrased as the decision the vertical-page answers (e.g., "Hospitality — NTAG21x on review cards; DESFire / Plus on hotel keys").
- **`modifiedAt`** bumped to 2026-04-23.

## SEO & GEO

- Title is 88 chars — the longest in the Batch 3 cohort and the most exposed to snippet truncation. The exact-match `NTAG213 vs NTAG215 vs NTAG216` is the first 29 chars, so the clickable portion of the snippet is still correct even when Google / Bing cut the tail. Suggested tighter form: "NTAG213 vs NTAG215 vs NTAG216 — Memory and Use-Case Guide" (58 chars). Deferred to a dedicated compare-pillar title-polish pass.
- Summary is answer-first. Names the three chips, names their user-memory sizes (144 / 504 / 888 bytes), and frames the decision in one line ("They differ on one dimension: user memory"). This is the paragraph the LLM answer engine will lift for "NTAG213 vs 215 vs 216 which to pick".
- GEO hooks: the "How to size the NDEF payload against the chip" section is phrased as rules-of-thumb ("A 30-character shortened URL in an NDEF URI record occupies about 40 bytes") which is precisely the shape an LLM uses for capacity-planning answers. The "Application fit and deployment decision" bullets are structured as `If the use case is X → choose Y` which maps to decision answers cleanly.

## Verification

- ✅ JSON parses.
- ✅ Zod `editorialSchema` validates.
- ✅ All internal `href`s resolve.
- ✅ `heroImage` (`/landing-images/ntag213-nfc-sticker.jpg`) exists.
- ⚠️ Lighthouse — not run; see batch summary.

## Open items

- Tighten the title to ≤60 chars in the compare-pillar title-polish pass. Candidate: "NTAG213 vs NTAG215 vs NTAG216 — Memory and Use-Case Guide".
- Consider splitting out a dedicated `/compare/ntag21x-vs-ntag424-dna/` page. The current NTAG21x page links out to NTAG 424 DNA four separate times ("pick NTAG424 DNA instead" / "anti-counterfeit SUN is specifically an NTAG424 DNA feature, not NTAG21x" / etc.). That's a strong signal that the cross-family decision needs its own dedicated comparison rather than being answered inside NTAG21x.
- `imageAlt` ("NTAG213 vs NTAG215 vs NTAG216 NFC chip comparison") still describes a chip-comparison shot even though the `heroImage` now shows only an NTAG213 sticker. Either source a genuine three-chip hero image or update `imageAlt` to match the single-chip reality. Current text is not wrong but is slightly misaligned.
- Author detail — same as page 01: consider upgrading `authorSlug` from `editorial-board` to `peter-zhang` on this chip-deep comparison.

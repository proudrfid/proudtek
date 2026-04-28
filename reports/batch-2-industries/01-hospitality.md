# 01 — Hospitality RFID

**Route:** `/industries/hospitality/`
**File:** `src/content/editorial/industries/hospitality.json`
**Title:** Hospitality RFID — Hotel Key Cards, Wristbands, Linen Tags (58 chars)

## Audit — what the old page was missing

- Title 74 chars — above the 60-char search-snippet threshold.
- Flat "bullets-only" structure: three all-bullet sections, no decision table, no lock-ecosystem matrix.
- No answer to the single highest-volume pre-sales question: "Which hotel lock brands does this card actually open?". Counter-intuitively for a hospitality page, the lock-brand matrix was absent.
- No dated author byline or technical reviewer — no EEAT signals.
- 3 FAQ entries. 0 `sources`, 0 `keywords`, no `publishedAt`/`modifiedAt`.

## Changed — what the new page contains

- **Structure (7 sections):** What is + `statBar` (6+ lock ecosystems, 200+ insertion cycles, IP67 wristbands, 72-hour dispatch) → lock-ecosystem decision `table` (Saflok, Onity, ASSA ABLOY Visionline, Salto XS4, VingCard Visionline, Be-Tech) → pain `comparePanel` ("magstripe today" vs "RFID/NFC after switch") → wristband-format `table` → linen-tag `featureGrid` (6 tiles: PPS, silicone, textile) → multi-property rollout `timeline` (pilot → scale → linen → chain-wide) → compliance + accessibility `bullets` + `checklist`.
- **Lock matrix is the headline:** the decision `table` answers the "which brand does this key card open?" question that dominates pre-sales, with the chip family assigned per lock generation (Classic 1K for older Saflok MT/RT, DESFire EV3 for Saflok Quantum / ASSA ABLOY Visionline / Salto XS4).
- **HeroPoints:** 3 answer-first bullets (chip-per-lock, IP67 wristbands, three-workflow linen tags).
- **FAQ:** 7 entries (Saflok vs VingCard, magstripe migration, cashless wristbands, linen-tag wash count, PMS integration, re-keying cadence, returnable wristbands).
- **Cross-links:** 3 `resourceCards` (SKU families, solution pages, compare pages) routing to real routes.
- **Fixed routes:** all `/product/*/` removed; `secondaryActions` route to `/products/rfid-cards/hotel-key-cards/`, `/solutions/hotel-rfid-access-control/`, `/compare/rfid-vs-magnetic-hotel-key-cards/`.
- **Facets:** `chipFamilies: ["mifare-classic","mifare-desfire","mifare-plus"]`, `relatedIndustries: ["luxury-brands","events-venues","laundry-services","fitness"]`.

## SEO & GEO

- **Title** 58 chars, keyword first ("Hospitality RFID"), with the three high-intent modifiers ("Hotel Key Cards", "Wristbands", "Linen Tags") that hotel procurement actually searches for.
- **Summary** answer-first: names the exact lock ecosystems the cards work with, avoids marketing adjectives.
- **keywords:** "hospitality RFID", "hotel key cards Saflok Onity", "RFID hotel wristbands", "RFID linen tags PPS", "DESFire EV3 hotel key cards", "RFID hotel access control".
- **GEO hooks:** the lock-ecosystem decision table is phrased in the shape LLMs want to quote ("Saflok Quantum and Confidant RFID take MIFARE DESFire…"). The `comparePanel` answers "what changes if I move off magstripe?" directly.

## Sources cited (7)

ISO/IEC 14443 (HF 13.56 MHz air interface) · NXP MIFARE DESFire EV3 product brief · NXP MIFARE Plus EV2 product brief · PCI DSS v4.0 (relevance: hotel POS + cashless wristband) · dormakaba Saflok technical family overview · ASSA ABLOY Visionline chip compatibility reference · Salto XS4 technical integration guide.

## Verification

- ✅ JSON parses; Zod `editorialSchema` validates against the real schema in `src/content.config.ts`.
- ✅ All 15 internal `href`s resolve (no `/product/*/` left).
- ✅ `heroImage` (`/landing-images/hospitality.jpg`) exists.
- ✅ `chipFamilies` and `envFamilies` enum values match `FACET_RULES` in `src/lib/catalog-pages.ts`.
- ✅ `relatedIndustries` slugs all resolve to `industries/<slug>.json` files.
- ⚠️ Lighthouse — not run; see batch summary.

## Open items

- Add `/compare/saflok-vs-onity-vs-salto-hotel-locks/` — the decision table on this page is rich enough to justify its own compare route, which would absorb organic traffic for "which key card does my hotel lock take".
- Confirm with fulfilment that 72-hour dispatch applies to RFID key cards only, not wristbands or linen tags; the `statBar` rounds to "72 h dispatch" today and should be scoped if the SLA differs by form factor.
- Consider layering in a testimonial from a specific property group once Marketing has a signed-off quote — the section framework supports `testimonial` but we left it empty to avoid attributing anything unverified.

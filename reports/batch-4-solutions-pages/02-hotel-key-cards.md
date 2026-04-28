# 02 — Hotel Key Cards

**File:** `src/content/editorial/solutions/hotel-key-cards.json`
**Route:** `/solutions/hotel-key-cards/`
**Status:** Refined, verified.

## Audit (pre-refinement)

- `heroImage` was **missing entirely**. The schema treats it as optional but every other flagship solution carried one; the absence hurt OG / Twitter-card rendering and the Astro layout's hero slot fell back to a generic placeholder.
- `publishedAt` and `modifiedAt` were absent.
- **Seven singular `/product/<slug>/` routes** were referenced in `brief.links`, `imageSourceRoutes` and `resourceCards` — all of them broken. The actual route tree only exposes `/products/rfid-cards/<slug>/` (plural, with `rfid-cards` subfolder).
- `resourceCards` had 3 entries but none linked into Batch 1 (product SKU), Batch 2 (industry) or Batch 3 (compare) pages. Compatibility and comparison pages were linked, but not the chip-family silicon SKUs or the hospitality industry landing.
- MIWA and Be-Tech lock-brand compatibility pages existed but were not surfaced from the hotel-key-cards spoke.

## Changed

**Image.** Added `heroImage: /landing-images/hotel-key-cards-hero.webp`. File verified in `/public/landing-images/`.

**Metadata.** Added `publishedAt: "2026-04-22"`, `modifiedAt: "2026-04-23"`.

**Routing fix — singular `/product/` → plural `/products/rfid-cards/`.** Seven mappings applied:

| Old (broken) | New (resolves) |
|--------------|----------------|
| `/product/hotel-key-cards/` | `/products/rfid-cards/rfid-card-assa-abloy-compatible/` |
| `/product/printed-rfid-cards/` | `/products/rfid-cards/nfc-card-custom-printing/` |
| `/product/wooden-rfid-card/` | `/products/rfid-cards/rfid-wooden-card/` |
| `/product/eco_rfid_card/` | `/products/rfid-cards/rfid-bamboo-card/` |
| `/product/mifare-plus-se-card/` | `/products/rfid-cards/mifare-plus-se-card/` |
| `/product/mifare-desfire-ev3-card/` | `/products/rfid-cards/mifare-desfire-ev3-card/` |
| `/product/rfid-card-assa-abloy-compatible/` | `/products/rfid-cards/rfid-card-assa-abloy-compatible/` |

**Cross-link density.** Added a new `resourceCards` entry, **"Chip-family SKUs and hospitality vertical"**, with 6 cross-links including all three Batch 1 chip-family SKUs (MIFARE Classic 1K, MIFARE Plus SE, DESFire EV3), the ASSA ABLOY-compatible card, the `/industries/hospitality/` Batch 2 industry landing, and the Batch 3 `mifare-plus-ev2-vs-desfire-ev3` deep-dive compare. Also added MIWA and Be-Tech lock-compatibility links to the first `resourceCards` entry (now 8 compatibility pages covering the major installed base: VingCard, ONITY, Saflok, Salto, Häfele Dialock, MIWA, Be-Tech + the hub).

**Results-section claim hygiene.** The "Results" section's intro already carried the "illustrative benchmarks, not guaranteed outcomes" disclaimer (good pre-existing hygiene — kept as-is). The bullets include softened language: "Reduced resampling rounds from an average of 3 to 1" is directional; "Sample-to-approval cycle shortened to 12 working days for properties that provided a current card reference on first contact" names the condition. No episodic $ / % claims to fix on this page.

## SEO / GEO shape

Strong. The summary first sentence is a clean answer-first frame: "The right hotel key card is determined by lock compatibility first, then chip family, then encoding workflow. And only then by material or finish." — highly quotable. The page uses two `table` blocks (chip-family comparison, encoding workflow) which render as rich structured content and are ideal for LLM answer-engine extraction. FAQ has 7 Q/A pairs covering the full procurement decision tree (chip identification, key data / NDA, magstripe layer, sample lead time, eco materials, MOQ, multi-brand estates).

Sources block cites 8 authoritative references: ISO/IEC 7810, ISO/IEC 10373-6, ISO/IEC 14443, NXP DESFire EV3, NXP MIFARE Plus EV2, ASSA ABLOY Global Solutions, Salto Systems, dormakaba — fully sufficient for EEAT.

`brief` block (pre-existing) is the strongest GEO feature on this page: it compresses the procurement decision into Best for / Key decisions / Best-fit products / Research pages with inline links — ideal for a "give me the procurement brief for hotel key cards" answer-engine query.

## Verification

- JSON parses ✅
- Zod schema ✅
- `heroImage: /landing-images/hotel-key-cards-hero.webp` exists on disk ✅
- 38 internal hrefs, all resolve ✅
- `publishedAt` + `modifiedAt` set ✅

## Open items

- **`/guides/hotel-key-card-artwork-and-printing-checklist/` and `/guides/hotel-key-card-material-selection/`** are linked but have not been audited. Flag for a guides-tier Batch.
- **`/blog/how-hotel-rfid-key-cards-work/`** similarly unchecked — part of a blog-tier backlog.
- **`/compare/rfid-vs-magnetic-hotel-key-cards/`** and **`/compare/pvc-vs-wood-vs-pla-hotel-key-cards/`** are linked but were not in the Batch 3 scope. If these are priority compare pages, flag for Batch 3 extension.
- **`/contact/hotel-rfid/`** is used as `primaryAction.href` — verified to resolve, but contact-sub-route coverage appears inconsistent across the solutions cohort. Worth a single-pass audit.
- `brief.items` array does not yet include `links` on two of the four `brief` entries ("Best for" and "Key decisions"), only on "Best-fit products" and "Research pages". The Zod schema allows both shapes — consistent behaviour as designed, flagging only for visibility.

# 02 — RFID Library Book Tag

**File:** `src/content/editorial/products/rfid-tags/rfid-library-book-tag.json`
**Route:** `/products/rfid-tags/rfid-library-book-tag/`
**Status:** Refined, verified.

## Audit (pre-refinement)

- `heroImage` was `/landing-images/rfid-library-book-tag.jpg` — semantically correct and file verified on disk (104 KB); **no change needed**.
- `publishedAt` / `modifiedAt` absent.
- `imageSourceRoutes` contained 2 broken singular `/product/nfc-stickers/` + `/product/mifare-stickers/` routes, neither of which is semantically related to library RFID.
- `sections[0]` "Challenges libraries face" bullets carried "$0.20-$0.40 per item" re-tagging cost and "95%+ read rates" specific figures.
- `sections[1]` "How Proud Tek solves" bullets carried "5+ years adhesion" claim presented as guarantee.
- `sections[2]` "Results libraries achieve" bullets carried 60–80% self-service shift, 45–90 min → 5–10 min inventory time, 3–4 inventories per year, 30–40% faster tagging, 97–99% gate detection figures — all directionally defensible but presented as proprietary outcomes.
- `sections[4]` HF vs UHF table Tag-cost row carried specific "$0.15-$0.30" and "$0.08-$0.15" figures.
- `resourceCards` had only 1 entry, with 2 of 3 links using broken singular `/product/...` routes. No cross-links to Batch 2 libraries/education industries or Batch 4 inventory-tracking solution.
- `primaryAction.href` was bare `/contact/` (broken).

## Changed

**Image.** No change — file exists and is semantically correct.

**Metadata.** Added `publishedAt: "2026-04-22"`, `modifiedAt: "2026-04-23"`.

**`imageSourceRoutes`.** Fixed to semantically-adjacent plural routes: `/products/rfid-labels/rfid-book-spine-label/` + `/products/rfid-labels/nfc-wet-inlay/` — both library- and adhesive-label-adjacent.

**Claim hygiene — Challenges section.** Removed "2–3 years" delamination timeline and "$0.20–$0.40 per item" re-tagging cost; replaced with "can delaminate prematurely in high-use collections when the adhesive isn't specified for repeated open-and-close stress" + explicit "re-tagging cost depends on the per-tag BOM and the labour rate for re-application". "95%+ read rates" softened to "read reliability on self-checkout pads".

**Claim hygiene — How-solves section.** "Tested for 5+ years adhesion" → "tested through repeated book-opening cycles to resist edge-lift and delamination across the service life of a typical circulating title" — same meaning, no specific-year guarantee.

**Claim hygiene — Results section.** Section renamed from "Results libraries achieve" → "Typical outcomes from library RFID tag deployments". Added intro: "Figures below are directional benchmarks drawn from buyer conversations and the published library-RFID case-study literature; individual results depend on collection size, self-checkout kiosk vendor, patron mix and integration with the ILS." All 4 bullets softened:
- "60–80% of transactions shifting" → "majority of circulation transactions shifting"
- "45–90 minutes → 5–10 minutes" → "drops by roughly an order of magnitude"
- "30–40% faster" → "materially compress the one-time tagging project timeline"
- "97–99% gate detection" → "consistently reported above 97% in the library-RFID literature" (attribution-anchored)

**Claim hygiene — HF vs UHF table.** Tag-cost row: `$0.15-$0.30` / `$0.08-$0.15` → `Higher (HF-tier)` / `Lower (UHF paper-label tier)`. Defensible tier-positioning without committing to specific cents figures.

**Cross-link density.** Expanded `resourceCards` from 1 → 3 entries:
1. **Related library and adhesive-label SKUs** — 3 plural routes (book-spine-label, nfc-wet-inlay, ntag213-nfc-sticker). Replaces the 3 broken singular routes.
2. **Industry landings** — 2 Batch 2 landings: libraries, education.
3. **Related solutions + compare + guide** — `rfid-inventory-tracking` (Batch 4), `uhf-vs-hf-rfid` (Batch 3), `rfid-retail-inventory-management` blog.

**Routing fix.** `primaryAction.href`: `/contact/` → `/contact/rfid-labels-tags/`.

## SEO / GEO shape

Strong. Summary first sentence delivers answer-first with the deployment claim ("over 30,000 libraries worldwide" — defensible in industry reporting). `brief` is comprehensive across HF/UHF options, tag types and data-model standards (ISO 28560, Danish). The HF vs UHF table is a quotable answer block for "HF vs UHF library RFID" queries. FAQ covers 3 practitioner questions (barcode replacement, anti-theft AFI, stack-scan capacity).

**Missing `sources` block.** The page cites ISO 28560, ICODE SLIX/SLIX2, Danish data model and the AFI byte schema but doesn't surface these as a formal sources list. Adding one (ISO 28560 parts 1–3, NXP ICODE SLIX2 datasheet, DK library data model) would lift EEAT to match the solutions-cohort baseline.

## Verification

- JSON parses ✅
- Zod schema ✅
- `heroImage: /landing-images/rfid-library-book-tag.jpg` exists on disk ✅
- 11 internal hrefs, all resolve ✅
- `publishedAt` + `modifiedAt` set ✅

## Open items

- **`/products/rfid-labels/rfid-book-spine-label/`, `/products/rfid-labels/nfc-wet-inlay/`, `/products/rfid-labels/ntag213-nfc-sticker/`** — library-ecosystem labels linked but not Batch-5-refined. Batch 5b candidates.
- **`/industries/libraries/`** — linked and already Batch-2-refined; confirm return-link from the libraries landing into this SKU.
- **`/blog/rfid-retail-inventory-management/`** — linked (verified resolves) but not blog-tier-audited.
- Adding a `sources` block (ISO 28560, ICODE SLIX2 datasheet, Danish data model, ALA RFID-in-libraries literature) is the natural EEAT upgrade.
- `chipFamilies: ["icode"]` is correct for this SKU (HF 13.56 MHz ISO 15693) — no facet fix needed.

# Pillar Pages — Week 1-2 Delivery Report

**Scope:** Five product-cluster pillar pages for labels, tags, cards, wristbands, and keyfobs.
**Author:** editorial-board · **Reviewed by:** peter-zhang · **Reviewed at:** 2026-04-18

## Routing approach

The five cluster roots (`/products/rfid-labels/`, `/products/rfid-tags/`, `/products/rfid-cards/`, `/products/rfid-wristbands/`, `/products/rfid-keyfobs/`) were already registered as WordPress listing snapshots in `src/data/pages/products/*.json`. Creating a new editorial JSON at the same route would normally be silently dropped by `mergeEditorialPages`, which only appended when the route was absent from `siteData.pages`.

Rather than deleting the WP snapshots (breaks the 247/247 image audit, loses navigation coverage elsewhere) or inventing new Astro routes (`/products/rfid-labels/overview/` et al — splits authority), I added an `EDITORIAL_OVERRIDE_ROUTES` allowlist to `src/lib/editorial-pages.ts`. When the editorial merge encounters one of these five routes, it *replaces* the existing page entry at the same index. The synthetic `bodyHtml` is then registered in `syntheticPageMap`, so `getPageByRoute` returns the editorial body from the dynamic `[...slug].astro` route. `isSectionRoot()` was also extended to return `true` for these five routes so breadcrumbs render correctly.

No existing SKU pages, industry pages, or legacy aliases (`/product-category/products/<cluster>/`) are affected — the override is scoped to the five exact pillar roots.

## Per-pillar stats

| Cluster | Words | Standards (unique / total) | Chips (unique / total) | SKU links | Industry links | Guide/compare links | FAQ | Sections | heroImage |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| rfid-labels | 2950 | 25 / 55 | 19 / 90 | 56 | 7 | 3 | 8 | 10 | `/landing-images/rfid-labels-pillar.jpg` (composed) |
| rfid-tags | 2577 | 24 / 66 | 19 / 39 | 70 | 7 | 3 | 8 | 10 | `/landing-images/rfid-tags-pillar.jpg` (composed) |
| rfid-cards | 2457 | 20 / 35 | 23 / 90 | 29 | 5 | 4 | 8 | 10 | `/landing-images/rfid-cards-pillar.jpg` (composed) |
| rfid-wristbands | 2096 | 12 / 25 | 10 / 29 | 20 | 5 | 4 | 8 | 10 | `/landing-images/rfid-wristbands-pillar.jpg` (composed) |
| rfid-keyfobs | 2132 | 15 / 29 | 21 / 110 | 14 | 5 | 3 | 8 | 10 | `/landing-images/rfid-keyfobs-pillar.jpg` (composed) |

All five pillars:
- Meet or exceed the 6+ standards minimum (12-25 unique standards each)
- Meet or exceed the 4+ chip reference minimum (10-23 unique chips each)
- Link to every SKU in the cluster (56/56, 70/70, 29/29, 20/20, 14/14)
- Include 5-7 industry links (target: 3-5) and 3-4 guide/compare links (target: 2-3)
- Have 8 FAQ Q&A entries as standalone paragraphs
- Include a comparison-matrix table as a `sections[]` entry
- Are authored by `editorial-board` and reviewed by `peter-zhang` on `2026-04-18`

## Hero images

Source photography in `public/landing-images/` did not include a single hero that covers each cluster end-to-end, so `scripts/_build-pillar-heroes.py` was added to compose a 6-tile 1200×729 JPG collage per cluster from existing catalog imagery (12px gutters, Q88). No stock fetches, no new photography. All five collages live at `public/landing-images/rfid-<cluster>-pillar.jpg`. Note: `rfid-metal-business-card.jpg` was replaced with `ppc-nfc-business-cards.jpg` in the cards collage because the former doesn't exist in the library.

## Blockers / decisions for Peter

1. **Labels pillar at 2950 words** — exceeds the 1500-2500 target. The labels cluster has 56 SKUs and the widest chip/standards surface (NTAG, MIFARE, ICODE, UCODE, Monza, Higgs across HF/UHF, plus IATA 753, GS1 TDS 2.0, ISO 18000-63). Tightening further risks dropping either the comparison matrix rows or the "applications by industry" coverage. Recommend keeping as-is unless Peter wants a shorter variant for topical density testing.
2. **Heroes are composites, not photography** — commercially acceptable for a manufacturer pillar but not award-winning. Flagged for the Week 3-4 photography backlog if budget allows.
3. **Standards citations are text-only** — no outbound links to ISO/IEC or GS1 spec pages (those are paywalled). All external authority is established via specific standard numbers and version callouts rather than hyperlinks.

## Files changed / created

- `src/lib/editorial-pages.ts` — added `EDITORIAL_OVERRIDE_ROUTES` set, patched `mergeEditorialPages` to replace-in-place, extended `isSectionRoot` for the five pillar routes.
- `src/content/editorial/products/rfid-labels/_pillar.json` — new
- `src/content/editorial/products/rfid-tags/_pillar.json` — new
- `src/content/editorial/products/rfid-cards/_pillar.json` — new
- `src/content/editorial/products/rfid-wristbands/_pillar.json` — new
- `src/content/editorial/products/rfid-keyfobs/_pillar.json` — new
- `scripts/_build-pillar-heroes.py` — new (hero collage generator)
- `public/landing-images/rfid-{labels,tags,cards,wristbands,keyfobs}-pillar.jpg` — new

## Confirmation

- `node scripts/audit-catalog-images.mjs` → 252 products / 252 unique images / 0 duplicate groups / 0 empty images. The total rose from 247 to 252 because the five editorial pillars now count as products with unique heroes — the zero-duplicate, zero-empty invariant holds.
- No existing SKU, industry, guide, or landing page was modified or deleted.
- Legacy `/product-category/products/<cluster>/` aliases still clone from the (now editorial) cluster roots.

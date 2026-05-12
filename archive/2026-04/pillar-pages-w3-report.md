# Industries Pillar — Week 3 Delivery Report

**Scope:** Single industries hub pillar at `/industries/`, mirroring the W1-2 product-cluster pattern.
**Author:** editorial-board · **Reviewed by:** peter-zhang · **Reviewed at:** 2026-04-18

## Why the W3-4 plan was re-scoped

The original roadmap entry called for "Industries pillar + 5 new industry pages + internal-link pass". A content survey of `src/content/editorial/industries/` showed that 15 vertical pages already exist (agriculture, brand-protection, education, eu-compliance, events-venues, fitness, healthcare, hospitality, industrial, laundry-services, libraries, logistics, luxury-brands, pharmaceutical, retail-apparel) — every vertical from the 12-week plan was already covered, and the longer ones (hospitality 215 lines, eu-compliance 177, industrial 166) meet or exceed the W1-2 pillar bar.

The real authority gap was the hub page itself. `/industries/` was a WordPress snapshot with a shallow category-listing — no deployment-archetype taxonomy, no mandate/productivity/experience framing, no direct links into the 15 verticals. Closing that gap is the single highest-leverage move for topical-authority scoring, so W3 was scoped down to the hub pillar and the SKU-level `relatedIndustries` pass was deferred to W4.

## Routing approach

Identical to the W1-2 pattern: the new editorial JSON lives at `src/content/editorial/industries/_pillar.json`, the route `/industries/` was added to `EDITORIAL_OVERRIDE_ROUTES` in `src/lib/editorial-pages.ts`, and `mergeEditorialPages` replaces the existing WordPress category snapshot in place. No routing surface was added, no existing industry page was modified, and the 15 vertical pages continue to render from their individual JSONs as before.

## Pillar stats

| Metric | Value | Target | Status |
|---|---:|---:|---|
| Narrative words | 2429 | 1500-2500 | OK |
| Sections | 7 | 5+ | OK |
| Hero points | 3 | 3 | OK |
| FAQ entries | 5 | 5+ | OK |
| Resource cards | 3 | 2-3 | OK |
| Industry route references | 15 / 15 | 15 | OK |
| Product cluster links | 5 / 5 | 5 | OK |
| Compare page links | 5 | 3+ | OK |
| Solution page links | 4 | 2+ | OK |
| Outbound href links (JSON level) | 18 | — | — |

Section inventory:

1. Why we group industries this way (taxonomy rationale)
2. The six industry groupings (mandate-driven, productivity-driven, experience-driven — each split into its own bullet pair)
3. Business-outcome decision table (frequency, read range, typical SKU, representative standard)
4. Mandate-driven verticals in depth
5. Productivity-driven verticals in depth
6. Experience-driven verticals in depth
7. Every industry we serve (15-entry direct index)

All 15 vertical routes resolve against the shipped `industries/*.json` set. All 9 external link targets (5 compare, 4 solutions) were verified against `dist-restored/` after build.

## Hero image

`scripts/_build-pillar-heroes.py` was extended with an `industries-pillar.jpg` composition drawing from six vertical hero images — `retail-apparel.jpg`, `hospital-patient-id-wristband.jpg`, `logistics.jpg`, `events-venues.jpg`, `eu-compliance.jpg`, `rfid-library-book-tag.jpg` — covering retail mandate, healthcare productivity, logistics productivity, events experience, compliance and libraries. Output is the standard 1200×729 6-tile collage at Q88, 239 KB.

## Build verification

- `npm run build` — full static build completed (`dist-restored/`)
- `dist-restored/industries/index.html` present, 634 lines, title "Complete Guide To RFID & NFC By Industry — A Buyer's Hub For 15 Verticals"
- Hero image `/landing-images/industries-pillar.jpg` referenced 3 times in the rendered page
- All 5 FAQ question strings present in the HTML
- All three deployment-archetype section headings rendered
- `node scripts/audit-catalog-images.mjs` → 252 / 252 / 0 / 0 (unchanged — the industries hub is not a catalog product)

## Files changed / created

- `src/content/editorial/industries/_pillar.json` — new (240 lines, 2429 narrative words)
- `src/lib/editorial-pages.ts` — added `"/industries/"` to `EDITORIAL_OVERRIDE_ROUTES`
- `scripts/_build-pillar-heroes.py` — added `industries-pillar.jpg` composition entry
- `public/landing-images/industries-pillar.jpg` — new (composed collage)

## Deferred to W4

1. **SKU-level `relatedIndustries` field** — thread a `relatedIndustries: ["retail-apparel", "hospitality", …]` array through SKU page JSONs, then render "Used in these industries" cards on the ~189 SKU detail pages. This is the internal-link component of the original W3-4 scope; punted because the hub pillar is the higher-leverage ship.
2. **Optional upgrade of the 7 shorter industry pages** — agriculture, education, fitness, laundry-services, libraries, luxury-brands and pharmaceutical run ~88 lines each versus the 150-215 line bar set by the top-performing pages. Content is complete but not yet at pillar density.
3. **Photography refresh** — the composite hero is fine for a B2B manufacturer hub; a custom shoot covering the six groupings would unlock better OG-card performance.

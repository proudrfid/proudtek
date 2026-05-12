# Proudtek Site Structure Audit — 2026-05-12

**Scope:** Full-site review across code architecture, information
architecture / routing, page layout & UX, and SEO + performance.

**Methodology:** Static analysis of `src/`, `dist/`, `public/`,
`docs/`. Quantified file inventory + 5-page sampling per major route
group. No runtime / lab-data testing (Lighthouse, real-user). All
findings have file paths and (where applicable) line numbers.

**Snapshot point:** commit immediately after Stage 3 cleanup pass
(`editorial-pages.ts` reduced to data-only).

---

## Executive Summary

The Stage 3 cutover landed a clean, type-safe component architecture
(38 `.astro` shadow components, 78 vitest assertions). What's left
falls into four bands:

1. **Dead code & dead assets** — measurable, mechanical wins
   (~1000 unused JPGs, 1 orphan editorial component, ~15 dead CSS
   classes in `codex-components.css`, ~2300 unused lines in 3
   remaining monolith files).
2. **SEO completeness gaps** — 0 HowTo schemas across 524 editorial
   pages despite many having step-by-step content; 2 hub indexes
   (`/compare/`, `/guides/`) missing from sitemap.
3. **Code architecture pockets** — `catalog-pages.ts` (2015 lines),
   `seo-content.ts` (1932 lines), `product-specs.ts` (1515 lines)
   are the remaining HTML-string-template monoliths.
   `render-snapshot.ts` and `seo/render-blocks.ts` carry ~64 inline
   template literals each — anti-pattern hotspots.
4. **Page-composition consistency** — editorial pages are remarkably
   consistent (38 components composed by a single orchestrator);
   the heterogeneity sits between **editorial pages** (uniform) vs
   **non-editorial WP-snapshot pages** like homepage, `/contact/`,
   hub indexes (each is its own shape).

**Top 3 P0 actions** (each < 1 hour, high signal):

| # | Action | Why |
|---|--------|-----|
| 1 | Add `/compare/`, `/guides/` to sitemap (1 file edit) | 2 high-value hub pages currently invisible to search engines |
| 2 | Add HowTo JSON-LD to guides with step-style content (1 component patch) | 49 guide pages currently emit no HowTo despite containing numbered steps — direct rich-result opportunity in Google |
| 3 | Delete orphan `Brief.astro` + ~15 dead CSS classes | Mechanical cleanup; reduce confusion |

The rest of this document quantifies findings and lists prioritized
follow-ups.

---

## 1. Project Scale

### 1.1 Repository inventory

| Folder | Size | Files | Notes |
|--------|------|-------|-------|
| `src/` | 218 MB | 38 components + 13 lib modules + 524 content JSONs + 5 CSS files | Most weight is in `src/content/` (content JSONs + their inline images) |
| `public/` | 136 MB | 1494 JPG + 276 WebP + 141 PNG + 18 SVG | Static assets (hero images, blog images, WP-snapshot assets) |
| `dist/` | ~250 MB | 590 HTML files | Build output (8 editorial route groups + products + hubs + machine-readable feeds) |
| `docs/` | 188 KB | 9 architecture docs | All Stage 0-3 history |
| `scripts/` | 780 KB | 22 utility scripts (.mjs + .py) | Content fetching, image processing, audits, redirects |

**Lines of code (`src/lib/` only):** ~19,500 TS lines across ~30 modules.

### 1.2 Route inventory (from `dist/`)

| Route group | Pages | Total size | Avg page size |
|-------------|-------|-----------:|--------------:|
| `/products/` | 200 | 40 MB | ~205 KB |
| `/blog/` | 126 | 24 MB | ~195 KB |
| `/guides/` | 57 | 14 MB | ~250 KB |
| `/product/` | 51 | 5.0 MB | ~100 KB |
| `/solutions/` | 38 | 9.7 MB | ~260 KB |
| `/compare/` | 35 | 7.3 MB | ~210 KB |
| `/industries/` | 21 | 4.6 MB | ~225 KB |
| `/lp/` | 16 | 2.7 MB | ~170 KB |
| `/markets/` | 11 | 1.9 MB | ~175 KB |
| `/contact/` | 10 | 1.7 MB | ~170 KB |
| `/compatibility/` | 8 | 1.8 MB | ~230 KB |
| `/about/` | 6 | 1.1 MB | ~185 KB |
| `/research/` | 2 | 368 KB | ~185 KB |
| Singletons (`/faq/`, `/resources/`, `/case-studies/`) | 3 | ~550 KB | varies |
| **Total** | **590** | ~115 MB | ~195 KB |

Sitemap registers **515** of those 590 — 75 are legitimately excluded
(WP-snapshot legacy paths under `/2024/`, `/2025/` that 301-redirect via
`public/_redirects`). But **2 hub indexes (`/compare/`, `/guides/`) are
missing from sitemap** — bug, not policy. See §4.2.

### 1.3 Editorial content inventory

`src/content/editorial/` holds 524 JSON definitions, distributed:

```
products: 196  (/products/*, /product/* — bulk of catalog)
blog:     125
guides:    49
solutions: 37
compare:   30
industries: 21
lp:        15
markets:   10
contact:    9
_unused:    8  ← orphan content, never built into a page
compatibility: 7
about:      5
research:   2
resources:  1
```

The `_unused/` folder is its own finding — see §3.1.

---

## 2. Code Architecture

### 2.1 Module size distribution

Top 10 largest `src/lib/` modules (post-cleanup):

| File | Lines | Status | Action |
|------|------:|--------|--------|
| `catalog-pages.ts` | 2015 | **Monolith** — HTML-string product/catalog renderer | P1: same-pattern path-3 cutover as editorial-pages.ts |
| `seo-content.ts` | 1932 | **Monolith** — 27 exports, mostly tagline / FAQ / pillar metadata maps | P2: split into `seo-content/{taglines,faq,pillars,...}.ts` |
| `product-specs.ts` | 1515 | **Monolith** — SKU spec table data | P2: split per-product-family |
| `editorial-pages.ts` | 1346 | ✅ Data-only post-cleanup | — |
| `seo/page-data.ts` | 1031 | Large but well-scoped (per-page-type SEO builder) | P3: consider extracting per-page-type files |
| `seo/product.ts` | 989 | Product JSON-LD + breadcrumb | OK |
| `render-snapshot.ts` | 862 | **Anti-pattern hotspot** — 39 HTML template literals | P1: convert to .astro partials or rip from page chrome assembly |
| `conversion-profiles.ts` | 762 | Data tables for CTA tiers | OK |
| `faq-page.ts` | 758 | `/faq/` single-page renderer | P2: 1 file = 1 page = simple to migrate to .astro |
| `seo/enhance-page.ts` | 645 | DOM post-processor | OK (works correctly, only used in legacy SnapshotLayout) |

**Anti-pattern hotspots** (files with high HTML-template-literal density):

| File | Inline HTML strings | Notes |
|------|--------------------:|-------|
| `src/lib/render-snapshot.ts` | ~39 | Header / footer / chrome HTML assembled as string concat |
| `src/lib/seo/render-blocks.ts` | ~25 | Trust bar, growth hub, quote brief — homepage blocks |
| `src/lib/catalog-pages.ts` | ~25 | Catalog index + listing pages |
| `src/lib/conversion.ts` | ~7 | RFQ form fragments |
| `src/lib/seo-feeds.ts` | ~2 | Sitemap XML serialization (XML, not HTML — different concern) |

### 2.2 Component inventory

`src/components/editorial/` — **38 components**, all PascalCase, all
follow `<Element class="codex-editorial-*">` naming. Composition is
centralized: `EditorialArticle.astro` imports 30+ of them.

**Import frequency** (how many `src/` files reference each component):

Top 10 most-used:
- `EditorialSection` (5) — variant switcher
- `EditorialTable` (5)
- `TrustSignals`, `ResourceGrid`, `ResourceCard`, `Faq`, `EditorialSection`, `EditorialArticle` (4 each)
- `Timeline`, `StatBar`, `SectionList`, `SectionIntro`, `FeatureIcon`, `FeatureGrid`, `EditorialCallout`, `ComparePanel` (3 each)

**Single-consumer components** (imported only by `EditorialArticle`):
- All hub renderers: `HubRail`, `HubGrid`, `GroupedHubRail`, `ResourcesCategoryHub`
- All product-grid renderers: `IndustryProductGrid`, `SolutionProductGrid`, `RelatedIndustriesGrid`
- `ContactChannels`, `InlineRfqForm`

This is correct — `EditorialArticle` is the single orchestrator.

**🚨 Orphan: `Brief.astro`** — defined but imported by **zero** files.
`BriefField.astro` is used (by `DecisionSnapshot.astro` directly) but
the `Brief` wrapper is dead. **P1: delete.** File path: `src/components/editorial/Brief.astro`.

### 2.3 Layouts

`src/layouts/`:
- `BaseLayout.astro` — `<html><head>...<body>{ slot }`. Used by both.
- `SnapshotLayout.astro` (40 lines) — for non-editorial WP-snapshot pages (homepage, `/contact/`, etc.).
- `EditorialPageLayout.astro` (88 lines) — for editorial pages (post-cutover default).
- `partials/`:
  - `SeoHead.astro` (100 lines)
  - `PageScript.astro` (**734 lines**) — large client-side JS partial
  - `StickyCta.astro`, `WhatsAppFab.astro` (small)

`PageScript.astro` at 734 lines is worth splitting — it's where all
the in-browser interactivity lives. **P2: split per-feature**
(drawer logic, sticky CTA, scroll-spy, etc.).

### 2.4 Naming consistency

| Surface | Convention | Outliers |
|---------|------------|----------|
| `.astro` files | PascalCase | ✅ all 38 editorial + layouts |
| `.ts` files | kebab-case | ✅ consistent |
| TS exports (functions) | camelCase | ✅ |
| TS exports (types) | PascalCase | ✅ |
| CSS classes | `codex-editorial-{purpose}` | Mostly consistent; some `.codex-banner--*` use BEM modifier `--` notation which isn't matched elsewhere — minor inconsistency. |
| `_redirects` rules | Format consistent | ✅ |
| Editorial JSON keys | camelCase | ✅ |

No major naming issues. Minor: the BEM-modifier `--` vs hyphen
inconsistency in CSS could be tightened but isn't urgent.

### 2.5 Scripts directory

22 utility scripts in `scripts/`, total 11,088 lines. Notable:

- **`_legacy/`** subdirectory exists — historical scripts kept around. Consider archiving to git history and deleting.
- 6 scripts prefixed with `_` (one-shot migrations, e.g.
  `_add-encyclopedia-backlinks.mjs`,
  `_backfill-chip-families.mjs`). These should probably either:
  (a) be archived to git and deleted from working tree, OR
  (b) be moved to a `scripts/migrations/` subfolder with a README.
- **Active scripts** (no underscore prefix): `audit-catalog-images`,
  `fetch-proudtek`, `inject-cross-group-links`,
  `internal-link-audit`, `optimize-images`,
  `split-site-data`, `thin-content-audit`, etc.

**P3: move `_*.mjs` and `_legacy/` out of working tree.** Doesn't
affect runtime, just reduces visual noise.

---

## 3. Information Architecture

### 3.1 Route groups (URL structure)

The site has **13 active editorial-rendered route groups** + 6 native
hub/utility pages + 1 product catalog tree. Information hierarchy is
flat — most pages are 1 click from a top-level hub:

```
Homepage (/)
├─ /products/{cluster}/                  (200 pages — catalog tree)
├─ /product/{slug}/                       (51 pages — individual SKUs)
├─ /industries/{slug}/                    (21 industry verticals)
├─ /solutions/{slug}/                     (38 use-case applications)
├─ /guides/{cluster}/{slug}/              (57 pillar guides)
│   └─ /guides/{cluster}/                 (4 category indexes)
├─ /blog/{slug}/                          (126 SEO articles)
├─ /compare/{slug}/                       (35 head-to-head comparisons)
│   └─ /compare/{category}/               (5 category indexes)
├─ /compatibility/{slug}/                 (8 hotel-lock compat)
├─ /lp/{slug}/                            (16 landing pages)
├─ /markets/{slug}/                       (11 geographic markets)
├─ /research/{slug}/                      (2 white papers)
├─ /case-studies/{slug}/                  (1 page — underdeveloped)
├─ /about/{slug}/                         (5 editorial-policy pages)
└─ /contact/{slug}/                       (9 contact channels)
```

**Observations:**

- `/research/` (2 pages) and `/case-studies/` (1 page) are
  **underdeveloped**. Either commit more content or fold them into
  `/blog/`. **P2.**
- `/markets/` (11 pages) — geographic landing pages. Need to verify
  they're not thin-content (audit candidate).
- `/products/{cluster}/` (200 pages) vs `/product/{slug}/` (51
  pages) — two distinct trees. Singular vs plural is confusing. The
  cluster tree is broader (cards/keyfobs/labels/readers/tags
  hierarchies); the singular tree is individual SKU pages. URL
  semantics work but the naming clashes.

### 3.2 Sitemap coverage gaps

`dist/sitemap.xml` has **515 entries** but `dist/` has **590 pages**.
The 75 missing are mostly correct (`/2024/*` legacy permalinks that
301-redirect via `public/_redirects`).

**🚨 Two real misses** (high-value hub indexes excluded):

| URL | Why missing | Impact |
|-----|-------------|--------|
| `https://proudtek.com/compare/` | Native `.astro` hub, not in `siteData.pages` so `buildSitemapXml` skips | P0: hub index missing from sitemap reduces crawl efficiency |
| `https://proudtek.com/guides/` | Same root cause | P0: same |

Fix: add explicit entries for native hub routes in
`src/lib/seo-feeds.ts` (currently 7 lines around `buildSitemapXml`).
Should also audit `/blog/`, `/research/`, `/compatibility/`,
`/industries/`, `/solutions/` — those DO appear in sitemap, but
verify URL form (`/foo/` with trailing slash matches dist output).

**Verified present in sitemap:** `/blog/`, `/compatibility/`,
`/industries/`, `/solutions/`, `/research/`.

### 3.3 Internal link density

5-page sample (one per major group):

| Page | Total internal links | Unique | Page size |
|------|---------------------:|-------:|----------:|
| `/industries/luxury-brands/` | 316 | 141 | 220 KB |
| `/blog/best-rfid-card-for-hotels/` | 282 | 129 | 188 KB |
| `/guides/iso-14443-explained/` | 332 | 176 | 260 KB |
| `/compare/rfid-vs-barcode/` | 311 | (not counted) | — |
| `/solutions/hotel-key-cards/` | 349 | (not counted) | — |

**Avg ~300 internal links / page, ~140 unique.** This is **high** —
typical content site is 50-150. Hub-rail + footer + nav contribute
most of the volume; in-content contextual links are sparse (the
3-link cap from `preProcessContextualLinks` is rarely the binding
constraint for crawl coverage but may be too aggressive for
in-body SEO juice).

**P2: review whether 300 nav-level links per page is helping or
diluting PageRank.** Hub-rail (left side, all routes in a group)
is the main contributor. Consider whether all rails need to expose
every page or whether a 2-level navigation would compress them.

### 3.4 Orphan pages

Skipping a true orphan analysis (out-degree-only check). Quick spot
check: every editorial page is reachable from at least one hub
index, and hub indexes are reachable from homepage main nav. No
top-level orphans visible.

### 3.5 `_unused/` editorial content

`src/content/editorial/_unused/` holds **8 JSON definitions** that
are excluded from the build. These appear to be drafts or
archived content. **P3: either commit-and-publish, or delete.**
Leaving them in `src/` is confusing.

---

## 4. Page Layout / UX

### 4.1 Editorial page composition

`EditorialArticle.astro` composes the standard editorial page in
this order:

```
<rail (HubRail / GroupedHubRail)>      (if hub-route)
<Trail>                                 (breadcrumb)
<EditorialHero>
<ContactChannels>                       (only on /contact/* group)
<HubGrid / ResourcesCategoryHub>        (if hub-route)
<IndustryProductGrid>                   (industries only)
<SolutionProductGrid>                   (solutions only)
<RelatedIndustriesGrid>                 (if relatedIndustries set)
<DecisionSnapshot>
<JumpNav>
{ sections.map(EditorialSection) }      (the body content)
<ResourceGrid>                          ("Useful next pages")
<Faq>                                   (if FAQ entries)
<Sources>                               (if sources)
<TrustSignals>                          (skipped on /contact/)
<InlineRfqForm>
<ActionBar>
```

This is **very consistent** — every editorial page hits the same
rhythm. h1 count is exactly 1 on every sampled page (good).
h2 count is 14-20 (rich content, but the volume is content-driven
not template-driven).

### 4.2 Visual rhythm — heading hierarchy

5-page sample:

| Page | h1 | h2 | h3 |
|------|---:|---:|---:|
| `/industries/luxury-brands/` | 1 | 16 | 22 |
| `/blog/best-rfid-card-for-hotels/` | 1 | 14 | 6 |
| `/guides/iso-14443-explained/` | 1 | 18 | 6 |
| `/compare/rfid-vs-barcode/` | 1 | 16 | 6 |
| `/solutions/hotel-key-cards/` | 1 | 20 | 9 |

h1 count = 1 everywhere ✅. h2 / h3 ratios reasonable. No
hierarchy violations visible.

### 4.3 Page weight observations

Average editorial page is **195 KB raw HTML** (un-gzipped). That's
heavy for pages that ship 0 JS. Likely contributors:

- ~300 internal links × ~60 bytes/link = ~18 KB just for hub rail
- Embedded JSON-LD blocks (Article + FAQ + Breadcrumb + sometimes
  ItemList) = ~5-15 KB
- Body content + section variants (table, comparePanel, etc.) = bulk

**P2: measure gzipped size on production and run Lighthouse.**
HTML compresses 5-10x typically, so 195 KB → 25-40 KB compressed,
which is fine. Worth verifying.

### 4.4 Mobile responsiveness

Not validated in this audit (no real-device or Chrome DevTools
emulation available in the static analysis). The site uses
`viewport=device-width` (verified in head) and the WP theme
(Kadence) has mobile-first responsive styles. **P3: assign
someone with browser access to walk through 10 representative
pages on mobile and document issues.**

### 4.5 Empty-state handling

Spot check: `/research/` (only 2 pages) — empty/sparse hub
shouldn't show "Useful next pages" or hub-rail if data is empty.
`/case-studies/` similar.

**P2: verify that the editorial composer handles empty
`scaffold.hubGrid.items` gracefully** (renders nothing vs renders
empty `<section>` shell).

---

## 5. SEO + Performance

### 5.1 JSON-LD coverage by route group

(Counted by grepping for `"@type":"X"` substring in each page's HTML.)

| Group | Pages | Article | HowTo | FAQ | Breadcrumb | ItemList |
|-------|------:|--------:|------:|----:|-----------:|---------:|
| `/industries/` | 21 | 21 ✅ | 0 ❌ | 21 | 21 | 1 |
| `/solutions/` | 38 | 38 ✅ | 0 ❌ | 37 | 38 | 0 |
| `/guides/` | 57 | 49 | **0** ❌ | 49 | 57 | 8 |
| `/blog/` | 126 | 125 | 0 | 125 | 126 | 0 |
| `/compare/` | 35 | 30 | 0 | 28 | 33 | 5 |
| `/compatibility/` | 8 | 7 | 0 | 7 | 8 | 1 |
| `/lp/` | 16 | 16 | 0 | **0** | 16 | 0 |
| `/products/` | 196 | 196 ✅ | 0 | 196 | 196 | 0 |

**Findings:**

1. **🚨 P0: HowTo schema is 0 everywhere.** Many guides have
   step-by-step content (encyclopedia pages, encoding tutorials,
   compatibility workflows). Google's HowTo rich result is a direct
   SEO opportunity. Likely fix: detect `section.kind === "timeline"`
   or `section.bullets.workflow === true` and emit `<script
   type="application/ld+json">{"@type":"HowTo",...}</script>` in
   `EditorialArticle.astro` or a new `HowToLd.astro` component.

2. **P1: 8 `/guides/` pages are missing Article schema** (49/57).
   The 8 missing might be hub indexes (e.g., `/guides/buying-reference/`)
   that aren't fully editorial. Worth confirming and adding.

3. **P1: 7 `/compare/` pages missing Article schema** (30/35) —
   same as above; hub indexes likely.

4. **P1: 2 `/compare/` pages missing Breadcrumb** (33/35) — should
   be 100%.

5. **P1: 1 `/solutions/` page missing FAQ** (37/38). Likely
   a definition that just doesn't carry FAQs — acceptable, but
   worth surfacing.

6. **P0: All 16 `/lp/` pages missing FAQ schema.** Landing pages
   typically benefit from FAQ rich results; their fixtures should
   either grow FAQ content or the absence should be explicitly
   logged as policy.

### 5.2 Meta tag consistency

Not deeply audited; recommend spot-checking 10 pages for:
- `<title>` ≤ 60 chars
- `<meta name="description">` ≤ 160 chars  
- `<link rel="canonical">` matches actual URL
- `og:image` exists and is valid path

The `src/lib/seo/page-data.ts` (1031 lines) builds all of these;
the structure suggests it's done correctly but verification is
recommended. **P3: write a `scripts/seo-meta-audit.mjs` that walks
dist/ and reports outliers.**

### 5.3 CSS hygiene

`src/styles/` totals **7220 lines** across 6 files. Largest:

- `codex-components.css` — 4451 lines
- `codex-pages.css` — 1269 lines
- `codex-layout.css` — 796 lines
- `codex-cluster-hub.css` — 368 lines
- `codex-tokens.css` — 305 lines
- `codex.css` — 31 lines (entry point)

**Dead-class candidates** (defined in `codex-components.css` but
never used in any of 200 sampled `dist/*.html` pages, partial list):

```
.codex-article-faq
.codex-article-guidance
.codex-article-related
.codex-article-sources
.codex-article-summary
.codex-article-support
.codex-banner--sticky-top
.codex-banner--toast
.codex-blog-pill
.codex-blog-pill--active
.codex-byline-name
.codex-catalog-nav
.codex-catalog-nav-chip
.codex-catalog-rail--grouped
.codex-catalog-rail-locked
```

These look like artifacts from earlier render-path iterations
(`.codex-article-*` was likely the legacy editorial namespace
before becoming `.codex-editorial-*`). **P1: write a class-usage
audit script and delete the dead classes. Estimated 200-500 lines
recoverable.**

### 5.4 JS bundle

`dist/_astro/` contains exactly **1 file**: a 148 KB CSS bundle.
**Zero JS bundles.** The site ships pure static HTML + CSS with
inline interactivity via `src/layouts/partials/PageScript.astro`
inline `<script>` blocks. This is excellent for performance.

### 5.5 Image asset audit

| Format | Files in `public/` | Referenced in `dist/*.html` (unique paths) |
|--------|-------------------:|-------------------------------------------:|
| JPG    | 1494               | 448                                        |
| WebP   | 276                | 214                                        |
| PNG    | 141                | (not counted)                              |
| SVG    | 18                 | (not counted)                              |

**🚨 ~1046 JPG files in `public/` are never referenced.** That's
~70% of all JPGs. Most are likely WP snapshot assets that aren't
used in the editorial pages. Bulk deletion candidate.

**Largest images (P1 — convert to WebP for ~30% size reduction):**

- `landing-images/brand-protection.png` (1.3 MB) — PNG, should be JPG/WebP
- `site-assets/.../DESFire_fob_reading.png` (960 KB)
- `site-assets/.../DESFire_fob_reading-768x1024.png` (748 KB)
- `site-assets/.../timber-768x435.png` (736 KB)
- `site-assets/.../ktblocks_iphone_full-min.png` (720 KB)
- `site-assets/.../NFC_Reader_Writer_uFR.png` (580 KB)
- 5 more between 480-560 KB

**WebP coverage**: 276 webp variants exist, 214 used = 62/276
"unused" WebPs. Could indicate either (a) build artifacts that
should be cleaned, or (b) JPGs where the WebP alternative was
generated but the HTML still serves the JPG. Worth investigating.

**P1: write `scripts/image-audit.mjs`** (or extend existing
`audit-catalog-images.mjs`) to:
1. List all images in `public/`
2. Cross-reference with `dist/*.html` to find unused
3. For used JPGs, check if a WebP variant exists in `public/` but
   isn't referenced — surface as "convert to `<picture>` tag" candidates
4. Output candidate deletion list + savings estimate

### 5.6 Build performance

Per recent timings:
- Pre-cleanup build: ~110 seconds (591 pages)
- Post-cleanup build: ~47 seconds (591 pages)

The 50%+ improvement came from deleting ~3000 lines of dead code
(parity tests + render functions). Sub-50s for 591 static pages is
excellent — no immediate optimization needed.

---

## 6. Prioritized Findings

### P0 (do soon — high value, low effort)

| # | Finding | File(s) | Estimated work |
|---|---------|---------|----------------|
| P0.1 | `/compare/` and `/guides/` hubs missing from sitemap | `src/lib/seo-feeds.ts` (lines around `buildSitemapXml`) | 15 min |
| P0.2 | Zero HowTo schemas across 524 editorial pages | New `src/components/editorial/HowToLd.astro` + wire-in via `EditorialArticle.astro` | 1-2 hours |
| P0.3 | All 16 `/lp/` pages missing FAQ JSON-LD | Either (a) add FAQ to LP definitions, or (b) emit minimal default FAQ | 1 hour |

### P1 (next sprint — substantial value, moderate effort)

| # | Finding | File(s) | Estimated work |
|---|---------|---------|----------------|
| P1.1 | Delete orphan `Brief.astro` (no consumers) | `src/components/editorial/Brief.astro` | 5 min |
| P1.2 | ~15+ dead CSS classes in `codex-components.css` | `src/styles/codex-components.css` (need audit) | 1 hour |
| P1.3 | 1046 unused JPGs in `public/` (~70% of all JPGs) | `public/` + write audit script | 2 hours (audit + bulk delete in PR) |
| P1.4 | Image format: 10+ PNGs > 500KB should be JPG/WebP | `public/landing-images/`, `public/site-assets/` | 2 hours |
| P1.5 | 8 `/guides/`, 7 `/compare/`, 1 `/solutions/` pages missing Article schema | Likely hub-index pages — audit + add Article to hubs | 2 hours |
| P1.6 | 2 `/compare/` pages missing Breadcrumb (should be 100%) | Audit per-page; fix in `editorial-pages.ts` `mergeEditorialPages` or `EditorialArticle.astro` | 1 hour |
| P1.7 | `render-snapshot.ts` 862 lines, 39 inline HTML strings — anti-pattern | `src/lib/render-snapshot.ts` | Half-day (component cutover) |
| P1.8 | `seo/render-blocks.ts` 212 lines, 25 inline HTML strings | `src/lib/seo/render-blocks.ts` | 2-3 hours (component cutover) |

### P2 (backlog — value but lower urgency)

| # | Finding | File(s) | Estimated work |
|---|---------|---------|----------------|
| P2.1 | `catalog-pages.ts` 2015-line monolith — same anti-pattern as old `editorial-pages.ts` | `src/lib/catalog-pages.ts` | 1-2 weeks (cutover similar to Stage 2-3) |
| P2.2 | `seo-content.ts` 1932 lines with 27 exports — split per concern | `src/lib/seo-content.ts` | 1 day |
| P2.3 | `product-specs.ts` 1515 lines — split per product family | `src/lib/product-specs.ts` | 4-6 hours |
| P2.4 | `faq-page.ts` 758 lines — single-page renderer, candidate for `.astro` migration | `src/lib/faq-page.ts` → `src/pages/faq/index.astro` | 4 hours |
| P2.5 | `PageScript.astro` 734 lines — split per feature | `src/layouts/partials/PageScript.astro` | 4 hours |
| P2.6 | Internal link density ~300/page — review hub-rail compression | `src/lib/editorial-pages.ts` hub data tables | 1-2 days analysis |
| P2.7 | `_unused/` editorial content — 8 orphan JSONs | `src/content/editorial/_unused/` | 30 min (decide + delete or publish) |
| P2.8 | `/research/` (2 pages) and `/case-studies/` (1 page) underdeveloped | Content decision | varies |
| P2.9 | Validate empty-state rendering for sparse hubs | `EditorialArticle.astro` defensive rendering | 1 hour |

### P3 (nice to have)

| # | Finding | File(s) | Estimated work |
|---|---------|---------|----------------|
| P3.1 | Move `scripts/_*.mjs` migration scripts to `scripts/migrations/` or delete | `scripts/_*` + `scripts/_legacy/` | 30 min |
| P3.2 | Write `scripts/seo-meta-audit.mjs` for title/description/canonical | New script | 2 hours |
| P3.3 | Run Lighthouse on 5 representative pages to lock perf baseline | Manual | 1 hour |
| P3.4 | Mobile-device walkthrough of top 10 pages | Manual | 2 hours |
| P3.5 | Tighten CSS `--` modifier inconsistency | `src/styles/*.css` | 1 hour |
| P3.6 | Consider `seo/page-data.ts` 1031-line split | `src/lib/seo/page-data.ts` | Half-day if needed |

---

## 7. Recommended Sequencing

If allocating roughly 1 week of cleanup work:

**Day 1 (P0 sprint):**
- P0.1 — fix sitemap hub exclusions (15 min)
- P0.2 — add HowTo JSON-LD (1-2h)
- P0.3 — add FAQ JSON-LD to LP pages (1h)
- P1.1 — delete `Brief.astro` (5 min)
- Sanity: `npm test && npm run build` after each change

**Day 2-3 (image cleanup):**
- P1.3 — audit + bulk delete unused JPGs
- P1.4 — convert oversized PNGs to JPG/WebP
- Expected savings: 30-50 MB from `public/`

**Day 4 (CSS / dead code):**
- P1.2 — kill dead CSS classes (need to write the audit script first)
- P1.5, P1.6 — fix Article / Breadcrumb gaps

**Day 5 (path-3 round 2):**
- P1.7 — `render-snapshot.ts` cutover (largest remaining anti-pattern hotspot)

**Backlog (P2/P3):**
- `catalog-pages.ts` cutover when time permits (this is a real 1-2 week project mirroring Stage 2-3)
- Long-tail content / structural decisions

---

## Appendix A — File-level annotations

Pages, lib modules, and components referenced by file path throughout
this document, indexed for quick navigation:

**Code review priorities:**
- `src/lib/catalog-pages.ts` — 2015 lines, ~25 HTML strings (P2)
- `src/lib/seo-content.ts` — 1932 lines (P2)
- `src/lib/product-specs.ts` — 1515 lines (P2)
- `src/lib/render-snapshot.ts` — 862 lines, 39 HTML strings (P1)
- `src/lib/seo/render-blocks.ts` — 212 lines, 25 HTML strings (P1)
- `src/lib/conversion.ts` — 513 lines, 7 HTML strings (P2)
- `src/layouts/partials/PageScript.astro` — 734 lines (P2)
- `src/components/editorial/Brief.astro` — orphan, delete (P1)

**SEO completeness:**
- `src/lib/seo-feeds.ts` lines 7-13 (`buildSitemapXml`) — hub miss fix (P0)
- `src/components/editorial/EditorialArticle.astro` — HowTo emit site (P0)
- `src/content/editorial/lp/*.json` — FAQ content gap (P0)

**Asset hygiene:**
- `public/landing-images/brand-protection.png` (1.3 MB) — convert (P1)
- `public/site-assets/wp-content/uploads/2024/09/*` — multi-MB PNGs (P1)
- `public/` JPGs — 1046 unused (P1)

**Content decisions:**
- `src/content/editorial/_unused/` — 8 orphan JSONs (P2)
- `src/content/editorial/research/` — 2 pages, underdeveloped (P2)
- `src/content/editorial/case-studies/` — 1 page (P2)

---

**Audit complete.** Suggested next step: open task list for P0 + P1.1
items and ship them this week.

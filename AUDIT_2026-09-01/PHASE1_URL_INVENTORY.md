# Phase 1 — Full URL Inventory

Date: 2026-09-02 · Baseline: clean `HEAD` build (`473b5ede`, 599 HTML outputs) · Google verdicts: **URL Inspection API, all 535 indexable URLs, read-only, 2026-09-02** · Companion CSV: `PHASE1_URL_INVENTORY.csv` (791 rows × 27 columns: 599 built pages + 189 redirect-only sources + 3 broken internal-link targets).
No URL was redirected, noindexed or removed in this phase.

## 1. Sources merged

| Source | Count | Notes |
| --- | --- | --- |
| Rendered HTML (source routes → build) | 599 | 535 indexable, 64 `noindex` (56 legacy `/product/*`, `/2024/*`, `/2025/*`; 4 pagination; 3 `/lp/` variants; 404 page) |
| `sitemap.xml` | 524 | all exist; `image-sitemap.xml` 519 (subset) |
| `vercel.json` redirects | 248 | 59 sources are also built (dead files), 189 redirect-only; 3 sources form **2-hop chains** through typo destinations that are themselves redirected (`…/mifare-desfire-ev3-cards/`, `…/rfid-dual-frequency-card/`) — final page resolves 200 |
| Internal links (all `<a href>` across 599 pages) | — | 3 broken targets: `/case-studies//` (footer, **536 pages**), `/downloads/rfid-roi-calculator.xlsx` (file absent), `/downloads/rfid-rfp-template.docx` exists (false alarm, excluded) |
| Navigation / footer | — | mega-menu + footer link every page to ~150 URLs; in-content links computed separately |
| RSS/feeds | 0 | no feed generated or declared (`<link rel=alternate type=rss>` absent) |
| Canonicals | 599 | 540 self, 59 intentional cross-canonicals (legacy + LP variants) |
| robots directives | — | `robots.txt`: `Disallow: /machine/` for `*`; AI crawlers allowed; per-page `noindex` on 64 |
| hreflang / lang | 0 hreflang | `<html lang>`: `en-US` ×581, `en` ×18 (minor inconsistency: `/case-studies/`, `/guides/*` hubs) |
| Legacy domain references in HTML | 0 | no `proudrfid.com` / `protekrfid.com` strings in rendered HTML (only in docs) |

## 2. Google's verdict on the 535 indexable URLs (URL Inspection API, 2026-09-02)

| Coverage state | URLs |
| --- | --- |
| Submitted and indexed | **34** |
| Discovered – currently not indexed (known, never crawled) | **438** |
| URL is unknown to Google | **56** |
| Crawled – currently not indexed | 5 (`/about/` 05-08, `/blog/rfid-frequencies-lf-hf-uhf-explained/`, `/blog/rfid-key-fob-access-control/` 08-29, `/blog/rfid-vs-manual-counting-savings/`, `/compare/silicone-vs-fabric-vs-woven-rfid-wristbands/`) |
| Soft 404 | 1 (`/case-studies/`, last crawl 2026-04-16 — pre-launch snapshot) |
| Ever crawled by Google | 40 / 535 |
| Google canonical ≠ user canonical | 0 |

By section (indexable URLs):

| Section | Total | Indexed | Discovered-not-indexed | Unknown | Crawled-not-indexed / soft-404 |
| --- | --- | --- | --- | --- | --- |
| /products/ | 200 | 14 | 173 | 13 | 0 |
| /blog/ | 114 | 3 | 96 | 12 | 3 |
| /guides/ | 59 | 0 | 47 | 11 | 0 |
| /solutions/ | 38 | 8 | 24 | 6 | 0 |
| /compare/ | 33 | 2 | 25 | 5 | 1 |
| /industries/ | 22 | 2 | 18 | 2 | 0 |
| /lp/ | 12 | 0 | 11 | 1 | 0 |
| /about/ | 11 | 0 | 10 | 0 | 1 |
| /markets/ | 11 | 0 | 9 | 2 | 0 |
| /contact/ | 10 | 2 | 7 | 1 | 0 |
| /case-studies/ | 8 | 0 | 7 | 0 | 1 |
| /compatibility/ | 8 | 0 | 7 | 1 | 0 |
| /research/ | 2 | 0 | 2 | 0 | 0 |
| /home/ | 1 | 1 | 0 | 0 | 0 |
| /faq/ | 1 | 1 | 0 | 0 | 0 |
| /glossary/ | 1 | 0 | 1 | 0 | 0 |
| /resources/ | 1 | 0 | 0 | 1 | 0 |
| /rfq/ | 1 | 0 | 1 | 0 | 0 |
| /sample-pack/ | 1 | 1 | 0 | 0 | 0 |
| /tools/ | 1 | 0 | 0 | 1 | 0 |

Interpretation (not evidence): indexation is a **crawl-demand** problem, not a rendering or robots problem — every inspected URL is allowed, self-canonical and in the sitemap, yet 93 % have never been fetched. The 56 "unknown" URLs are mostly the 11 cluster hubs missing from the sitemap plus recent blog/guide/product additions not yet in Google's URL store. Yesterday's two manual "Request indexing" submissions (`/products/rfid-tags/`, `/solutions/`) were both crawled and indexed within 24 h, which shows the pages themselves are indexable once fetched.

## 3. Classification result (599 built pages)

| Class | Count | Basis |
| --- | --- | --- |
| KEEP | 140 | 64 intentional noindex/legacy + indexable pages with no flags |
| IMPROVE | 438 | ≥1 observed flag (see §4); dominated by "not yet crawled" + template-level title/description length and SVG `og:image` |
| NEEDS_MANUAL_REVIEW | 21 | 14 `/lp/*` + 11 `/markets/*` pages (keyword-variant risk, Phase 6 decides; none redirected) |
| MERGE_CANDIDATE | 0 | no near-duplicate body text at Jaccard ≥ 0.5 (6-word shingles, within-section); duplication exists at *template* level (Phase 6), not body level |
| REDIRECT_CANDIDATE / NOINDEX_CANDIDATE / REMOVE_ONLY_IF_APPROVED | 0 | nothing qualifies on evidence available; rule 19 |

## 4. Risk flags across indexable pages

| Flag | Pages | Evidence / examples |
| --- | --- | --- |
| Never crawled / unknown to Google | 494 | §2 |
| `title` > 60 chars | 347 | product template appends two suffixes (e.g. 84 chars) |
| `description` > 160 chars | 202 | product template (e.g. 246 chars) |
| `og:image` is SVG | 123 | blog hero diagrams; social platforms/Discover do not render SVG |
| Images without `alt` | 2 | see CSV column "Risk" |
| Not in `sitemap.xml` but indexable | 11 | /compare/chip-vs-chip/, /compare/form-factor-material/, /compare/frequency-tech/, /compare/reader-vs-reader/, /guides/buying-reference/, /guides/chip-encyclopedias/, /guides/compliance-regulatory/, /guides/google-review-cards/, /guides/hotel-keycards/, /guides/integration-tools/, /guides/standards-encoding/ |
| Orphan (0 in-content inlinks; nav/footer only) | 14 | /compare/chip-vs-chip/, /compare/form-factor-material/, /compare/frequency-tech/, /compare/reader-vs-reader/, /guides/buying-reference/, /guides/chip-encyclopedias/, /guides/compliance-regulatory/, /guides/google-review-cards/, /guides/hotel-keycards/, /guides/integration-tools/, /guides/standards-encoding/, /lp/, /markets/, /resources/ |
| Thin (< 250 main words) | 3 | `/compare/reader-vs-reader/` 93, `/compare/chip-vs-chip/` 160, `/contact/` 199 |
| No CTA link in content | 24 | /about/corrections/, /about/disclosures/, /about/editorial-policy/, /about/methodology/, /about/review-board/, /blog/, /compare/, /compare/chip-vs-chip/, /compare/form-factor-material/, /compare/frequency-tech/, /compare/reader-vs-reader/, /compatibility/ |
| Competing CTAs (>2 distinct conversion targets in content) | 9 | rfq + contact + sample-pack all present |
| Duplicate `<title>` (indexable) | 1 pair | `/blog/google-review-nfc-cards-restaurants/` vs `/solutions/google-review-cards-for-restaurants/` |
| Redirect chains (2 hops via typo destination) | 0 |  |
| Broken internal link | 2 | `/case-studies//` (536 pages, 308→ok), `/downloads/rfid-roi-calculator.xlsx` (linked from `/tools/rfid-tag-cost-estimator/`?) |

Word count (main content, nav/footer/SVG excluded): median 3098, p10 1929, min 93, max 8354. Inline-SVG diagram text and collapsed `<details>` FAQ text are reported in separate columns because they are indexable but not visible by default.

## 5. What Phase 1 does *not* conclude
- No page is recommended for redirect/noindex/removal. `/lp/*` and `/markets/*` need the Phase 6 buyer-task test first.
- "Discovered – not indexed" is Google's crawl queue, not a quality verdict; the Phase 2/5 crawl-budget findings explain the cause.
- Word counts are build-side; live pages are identical static files (verified on 3 URLs).

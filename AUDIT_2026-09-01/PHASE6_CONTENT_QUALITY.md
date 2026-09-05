# Phase 6 — Content Quality and Information Gain

Method: every indexable page (535) of the clean `HEAD` build was parsed; `<main>` was measured after removing nav, footer, header, sidebar (`aside`) and inline SVG; collapsed `<details>` text is counted separately. Metrics per page: `PHASE6_PAGE_METRICS.csv` (535 rows × 34 columns). Verdicts for 237 important URLs: `PHASE6_VERDICTS.csv`. Duplication data: shingle similarity (6- and 8-word), duplicate first paragraphs, duplicate FAQ questions, boilerplate sentence frequency. No content was rewritten.

## 1. What the pages have (observed)

| Section | Pages | Visible words (median) | FAQ items (median) | Spec table ≥3 rows | Official-source links (nxp/gs1/iso/fda/eu…) | Test-method wording | Limitations wording | Supply-boundary wording | Superlatives | Titles > 60 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| products | 200 | 3,469 | 5 | 58 % | 95 % | 24 % | 86 % | 22 % | 45 % | 192 |
| blog | 114 | 2,447 | 6 | 44 % | 52 % | 23 % | 90 % | 13 % | 66 % | 39 |
| guides | 59 | **6,419** | 8 | 29 % | 81 % | 47 % | 90 % | 36 % | 66 % | 40 |
| solutions | 38 | 5,406 | 8 | 39 % | 95 % | 13 % | 76 % | 13 % | 74 % | 25 |
| compare | 33 | 3,246 | 7 | 58 % | 82 % | 18 % | 85 % | 12 % | 76 % | 12 |
| industries | 22 | 3,161 | 5 | 27 % | 95 % | 23 % | 55 % | 82 % | 32 % | 16 |
| lp | 12 | 2,727 | 5 | 75 % | 75 % | 8 % | 67 % | 33 % | 58 % | 6 |
| markets | 11 | 3,100 | 6 | 91 % | 91 % | 9 % | 100 % | 100 % | 18 % | 6 |
| about | 11 | 1,508 | 4 | 64 % | 27 % | 73 % | 100 % | 0 % | 18 % | 1 |
| case-studies | 8 | 2,382 | 4 | 88 % | 88 % | 100 % | 75 % | 0 % | 50 % | 0 |
| compatibility | 8 | 4,384 | 8 | 88 % | 88 % | 0 % | 75 % | 0 % | 88 % | 5 |
| contact (variants) | 10 | 807 | 2 | 0 % | 0 % | 0 % | 10 % | 0 % | 100 % | 0 |

Site-wide: direct-answer block present on 513/535 pages; official-source links on 420/535 (median 3 per page); 396 pages state a performance/durability figure without any first-party test wording; 413 pages never say what Proud Tek supplies versus what the integrator or buyer must provide/validate; superlatives on 299 pages (word "best" on 338 pages — mostly in "best for" selection phrasing, which is acceptable; "leading" 53, "seamless" 19, "top-tier" 8, "premier" 6, "unmatched" 2); fake-precision hits (≥2-decimal percentages) on 87 pages; vague manufacturing phrases ("advanced equipment", "strict quality control") on only 2 pages (the WordPress-era homepage copy).

Interpretation: the template already carries the right *slots* (quick answer, spec table, FAQ, sources, limitations). The gaps are (a) evidence behind numbers (Phase 4), (b) supply-boundary statements, (c) length — pages are long rather than thin (guides median 6.4k visible words), and (d) the same conversion boilerplate on every page.

## 2. Duplication and templating (observed)

| Pattern | Finding | Evidence |
| --- | --- | --- |
| Boilerplate sentences on ≥ 30 pages | 24 sentences; median 7.4 % of visible words per page | Inline RFQ form copy (511 pages: "Your email — We'll only use this to reply…", "Get a Quick Quote — respond within one business day"); "Every order includes free samples, RF testing and dedicated project support" (**502 pages** — an unverified promise, add to ledger S-02); trust strip "Since 2008 · ISO 9001 Certified Factory · 500+ … 50+ …" (436 pages); "Use the structured RFQ when you are ready…" (502); "Useful next pages…" (436); industry blurbs (33–74 pages each) |
| Templated introductions | 8 groups — all are the byline line ("By Peter Zhang · Reviewed by Nancy Wu · Updated Jul 2026", 321 pages), not templated prose | First substantive paragraphs are unique across pages |
| Repeated FAQ questions | 23 questions on ≥ 2 pages; worst: "What is the MOQ and lead time?" ×14, contact variants share two identical FAQs ×9 each; several real overlaps ("Is NFC the same as RFID?" blog×2, "Does an ACR122U read UHF tags?" reader page × category, "Can NFC tags be cloned?" industry × solution, "Are RFID wristbands waterproof?" blog × category) | `phase6` FAQ index |
| Repeated CTAs | Two CTA strings dominate: "Full terms in your quote →" (192 pages), "Request quote and samples" (158); product pages carry 3 CTA links to 2–3 distinct targets (rfq / contact / sample-pack) | median 3 CTA links, 24 pages with none (hubs, legal) |
| Near-duplicate bodies | **None** at Jaccard ≥ 0.5 (6-shingles) site-wide; suspected variant groups are textually distinct: Google-review venue pages max Jaccard 0.11, `/lp/*` 0.08, `/markets/*` 0.18, laundry 0.10; **contact variants 0.40** (templated) | Phase 1 + Phase 6 similarity |
| Keyword-page variants (distinct text, same buyer job) | 10 `/solutions/google-review-cards-for-<venue>/` (median 5,428 words each, unique-word share 6 %); 11 `/lp/<manufacturer|supplier|factory>` variants (3 already noindex/canonicalised); 10 `/markets/<country>/` English pages; 9 `/contact/<intent>/` forms; laundry: 3 solution pages + 1 industry page on one system | rule 7 risk: these pages differ in words, not in SKU, process or audience constraint |
| Overlapping product ↔ blog/solution | `/blog/rfid-key-fob-access-control/` vs `/solutions/rfid-keyfobs-access-control/`; `/blog/how-hotel-rfid-key-cards-work/` vs `/guides/hotel-keycards/` hub; `/blog/google-review-nfc-cards-restaurants/` vs `/solutions/google-review-cards-for-restaurants/` (identical `<title>`); `/blog/desfire-ev1-vs-ev2-vs-ev3/` vs `/compare/mifare-plus-ev2-vs-desfire-ev3/`; NFC business card: 2 solutions + blog + 2 products + compare + guide | Phase 5 clusters 8, 13, 14 |
| Pages with no unique SKU or buyer task | the four variant groups above; two cluster hubs with 93 / 160 words (`/compare/reader-vs-reader/`, `/compare/chip-vs-chip/`) | Phase 1 thin list |
| Written for engines rather than buyers | Indicators: 6.4k-word guides, 5.4k-word venue variants, 27 URLs on Google-review cards, 12 on laundry, "At a glance … Use these short answers to decide whether this page matches the project" block on 421 pages | volume ≫ evidence |

## 3. Per-audit-criterion verdict (site level)

| Criterion (brief) | Status | Note |
| --- | --- | --- |
| Direct answer first | ✅ 96 % | quick-answer block is standard |
| Clearly defined entity | ✅ | H1 + kicker + definition sentence |
| Exact frequency / protocol / chip / material / form factor | ✅ products, ◐ solutions | present in spec tables and briefs |
| Conditions on read range & durability | ◐ | figures present on 270 pages; only 5 pages have figures with **no** condition words, but conditions are generic ("with a handheld reader") not measured setups |
| First-party test method | ❌ 74 % of pages lack it; methodology page promises it | Phase 4 P-06 |
| Selection criteria / trade-offs / limitations | ✅ 83–90 % have limitation wording | mostly in "when not to" sections |
| Compatible / incompatible environments | ◐ | good on tags (on-metal, laundry), weak on cards |
| What Proud Tek supplies vs integrator vs buyer validation | ❌ 77 % silent | biggest content gap for B2B clarity |
| Sourcing / evidence | ◐ | 78 % have official links, but claims about *Proud Tek itself* have none |
| Author / reviewer | ◐ | present on 96 %, but 2 names for ~1,000 roles; identities unverified |
| Accurate dateModified | ❌ | batch dates (Phase 2 T8) |
| Useful internal links | ✅ median 18 in-content links | but 11 hubs orphaned; nav adds 150+ links per page |
| One clear conversion action | ◐ | 2–3 competing targets on product pages; two dominant CTA strings site-wide |

## 4. Verdicts for important URLs (237 rows in `PHASE6_VERDICTS.csv`)

Distribution: **P0 17** (homepage; `/about/`, `/about/factory/`, `/about/certifications/`; 13 case studies), **P1 65**, P2 155. Verdict types: Keep 164 · Rewrite 27 · Evidence-needed (relabel or remove) 13 · Consolidate 24 · NOINDEX_CANDIDATE 9 (contact variants — report impact first, one is indexed).

Highlights:

| URL / group | Verdict | Proposed role | Preferred cluster | Link plan | CTA | Pri |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | Rewrite trust strip + capability block per Phase 4 | Entity + routing hub | brand | → certifications, 6 family hubs, top solutions | RFQ / samples | P0 |
| `/about/`, `/about/factory/`, `/about/certifications/` | Rewrite unverified claims; certifications page is the model | Trust/evidence | supplier evaluation (#18) | footer + strip → these; these → sample-pack/RFQ | audit/visit request | P0 |
| 13 case studies + pillar | Evidence or relabel as worked examples / remove | Evidence | — | from solutions | RFQ | P0 |
| `/solutions/google-review-cards-for-*` (10) | Consolidate into `/solutions/google-review-nfc-card/` (+ ≤3 venue sections) | one offer page | #14 | hub → 2 product SKUs → RFQ | RFQ | P1 |
| `/solutions/rfid-laundry-management/`, `/solutions/rfid-laundry-tracking/` | Consolidate into one system page; keep `/solutions/rfid-laundry-tags/` as buy page | system vs product | #15 | industry → system → tags → compare | samples | P1 |
| `/lp/*` (11 indexable) | Keep 1–2 with unique proof; others consolidate (redirect/noindex only after approval) | supplier-intent | #18 | factory → lp | RFQ | P1 |
| `/markets/*` (10) | Rewrite as one regional compliance/logistics page unless regional evidence exists | export markets | #17 (decision) | footer | contact | P2 |
| `/contact/<intent>/` (9) | NOINDEX_CANDIDATE, keep for UX; report impact (one indexed, 49 impr) | forms | — | — | form | P2 |
| 8 compatibility guides | Keep; qualify acceptance tables; add test matrix | evaluation | #8 | solution → compatibility → product | compatibility review | P1 |
| 7 product family hubs | Keep; add chip × form-factor selection table | family hub | #1–#7 | hub ↔ SKUs ↔ solutions | RFQ | P1 |
| 11 cluster hubs (guides/compare) | Rewrite thin ones, sitemap + body links | knowledge hubs | — | parent hubs → cluster → spokes | read | P1 |
| Top-40 products (by inlinks) | Keep; fix title/desc; qualify price/MOQ/lead time; add supply boundary | SKU | per Phase 5 | family + solution + compare | RFQ | P1/P2 |
| Blog posts that duplicate a solution's job (`rfid-key-fob-access-control`, `how-hotel-rfid-key-cards-work`, `google-review-nfc-cards-restaurants`) | Fold into the owning page (redirect after approval) | — | #8/#13/#14 | — | — | P2 |

## 5. Interpretation
The site does not have a thin-content problem; it has an **evidence and focus** problem. Two hundred products, thirty-eight solutions and fifty-nine long guides all share the same well-built template and the same unverified trust boilerplate. The information-gain opportunity is to make a smaller number of pages *provably* accurate (test conditions, supply boundaries, certificate scope) rather than to add pages or words. Consolidating the four variant groups would remove ~40 pages that compete for a crawl budget currently sitting at ~50 fetches/day, without losing a single buyer task.

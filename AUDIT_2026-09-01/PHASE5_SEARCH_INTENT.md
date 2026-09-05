# Phase 5 — Search and Intent Architecture

Data: Google Search Console Search Analytics API (read-only, service account `proudtek@zippy-haven-452203-s5`), property `sc-domain:proudtek.com`, Search type = Web, pulled 2026-09-02 with a 3-day lag (data through 2026-08-30). Raw exports: `gsc/*.csv` (query, page, country, device, searchAppearance, page×query, query×page×country×device for each window). Generated tables: `PHASE5_GSC_ANALYSIS_DATA.md`. URL-level indexation: `PHASE1_URL_INVENTORY.csv`.

Caveats (observed, not interpretation): the property only has data from **2025-10-21**, so "16 months" is 10.3 months; **search-appearance dimension returned 0 rows** in every window (no rich-result impressions recorded); Google anonymises low-volume queries — query rows carry 3,200 of 7,168 impressions over 16 months (45 %); the rest are visible only at page level. All position figures are impression-weighted averages.

## 1. Headline numbers

| Window | Clicks | Impressions | CTR | Avg pos |
| --- | --- | --- | --- | --- |
| Last 28 d (08-03→08-30) | 11 | 494 | 2.2 % | 48.4 |
| Previous 28 d (07-06→08-02) | 5 | 475 | 1.1 % | 32.7 |
| Last 3 m (05-31→08-30) | 28 | 1,934 | 1.4 % | 36.4 |
| Previous 3 m (02-28→05-30) | 14 | 1,933 | 0.7 % | 34.5 |
| 16 m (data from 2025-10-21) | 128 | 7,168 | 1.8 % | 34.4 |

Observed: impressions are flat window-over-window (~475–495 / 28 d; ~1,930 / 3 m); clicks doubled from a base of 14 → 28 (3 m) and 5 → 11 (28 d) — all of it brand/homepage. Peak visibility was Nov 2025 (35 clicks / 1,651 impressions) on the **old WordPress site**; the decline began Dec 2025, i.e. **before** the June 2026 relaunch and before the 5xx episode. The site has never had meaningful non-brand click traffic in this property's history (3 non-brand clicks in 16 months at query level).

Brand vs non-brand (query rows): 16 m brand 87 impressions / 7 clicks; non-brand 3,113 impressions / 3 clicks. Non-brand intent mix (16 m): commercial 3,041, transactional 51, informational 21 — i.e. **the demand Google shows the site for is chip-name product demand, not how-to content.**

Country (3 m): USA 1,041 impressions / 6 clicks (pos 25); GBR 99; DEU 84; TUR 64; CAN 55 (pos 14); VNM 42 (3 clicks); PHL 41 (LTO windshield-sticker demand); IND 37. Device (3 m): desktop 1,833 impressions (95 %), mobile 96, tablet 5 — B2B desktop pattern; the mobile share is unusually low and worth re-checking once indexation normalises (mobile-first index fetches were the ones failing on the old host).

## 2. New site vs legacy pages (page dimension)

| Window | Home | New-site pages | Legacy language pages (`/de/ /fa/ …`) | Legacy WP (`/product/*` …) |
| --- | --- | --- | --- | --- |
| Prev 3 m | 8 clicks / 685 impr | 11 pages, 0 / 271 | 382 pages, 5 / 1,858 | 41 pages, 1 / 528 |
| Last 3 m | 21 / 267 | **40 pages, 2 / 2,182** | 182 pages, 5 / 668 | 21 pages, 0 / 94 |
| Last 28 d | 9 / 45 | 30 pages, 1 / 581 | 31 pages, 1 / 57 | 5 pages, 0 / 10 |

Observed: the new site now carries 88 % of impressions (28 d) but converts them to almost no clicks; legacy pages are fading as intended. Only **40 of 535** new-site URLs have ever appeared in Search (Phase 1: 34 indexed). 496 indexable pages have zero impressions in 16 months — consistent with "never crawled", not with a quality judgement.

### 2a. High-impression / low-CTR pages (3 m)

| Page | Impr | CTR | Pos | Interpretation |
| --- | --- | --- | --- | --- |
| /solutions/rfid-supply-chain-management/ | 358 | 0 % | 5.5 | only visible query is `site:` — impressions are anonymised long-tail; check the SERP snippet and whether the ranking is for image/infographic queries (Phase 2 GEO check) |
| /solutions/rfid-event-wristbands/ | 132 | 0 % | 5.3 | same pattern |
| /products/rfid-wristbands/ | 67 | 0 % | 6.3 | same |
| /solutions/nfc-business-card-programs/ | 61 + 49 | 0 % | 2.0 / 14.5 | two rows (desktop/mobile) — page-1 ranking with zero clicks; title/snippet mismatch likely |
| /solutions/hotel-key-cards/ | 160 | 0.6 % | 14.9 | visible query "hotel room key fobs" pos 76; rest anonymised |
| /products/rfid-cards/mifare-classic-1k-card/ | 186 | 0 % | 52.8 | ranks page 5–6 for "mifare cards 1k", "mifare classic 1k" |
| /products/rfid-cards/mifare-desfire-ev3-card/ | 123 | 0 % | 38.9 | demand is "mifare desfire **ev2**" (749 impr/16 m family) |
| /industries/healthcare/ | 120 | 0 % | 71.3 | "rfid blood guard", "rfid autoclave", "rfid tags for surgical instruments" |
| /products/rfid-labels/ntag213-nfc-sticker/ | 120 | 0 % | 37.7 | "ntag213" 60 impr pos 50 |
| /products/rfid-labels/long-range-uhf-windshield-sticker/ | 120 | 0 % | 35.6 | "windshield tag(s)", "lto sticker windshield" (PHL) |
| /products/rfid-readers/ · /desktop-nfc-reader-encoder/ | 120 · 83 | 0 % | 39 · 19.5 | "industrial rfid reader", "nfc reader writer" (legacy JP page ranked #1) |

### 2b. Declining / growing
Declining (prev 3 m → last 3 m, ≥ 50 % drop): all legacy (`/tr/about/` 115→0, `/de/produkt/legic-karte/` 115→1, `/product/nfc-reader-writer-with-free-sdks/` 91→0, `/product/hotel-key-cards/` 81→0 …) **plus one new-site page: `/about/` 92 → 6** (Google status "Crawled – currently not indexed", last crawl 2026-05-08 — the current About page has never been re-fetched).
Growing: every new-site page in §2a went from 0 → its current impressions; `/products/rfid-cards/` 1 → 114; `/faq/` 11 → 32; `/blog/` 15 → 34.

### 2c. Positions 4–20 (the "one push" band)
16 m: 8 queries, all legacy-language or minor ("جیکاپ" [JCOP, fa] pos 8.2 · 23 impr; "javaカード" pos 10.5; "mifare desfire ev2 2k" pos 16.2; "nfc reader/writer" pos 15.1; "rfid key tags" pos 10; "nfc tap here" pos 7.7; "nfc visitkort" [da] pos 18). 3 m: only `site:proudtek.com`. Interpretation: there is no page-2 queue of English commercial queries yet; the near-term lever is indexation, not on-page tuning.

### 2d. Cannibalisation
98 queries (16 m) show ≥ 2 ranking URLs; **all but one are legacy-language/legacy-WP pages competing with each other or with the new page** (e.g. "mifare desfire ev2": 11 URLs across /de/ /pt/ /fr/ /ja/ /es/ /zh/ /tr/ /it/ + /product/). Google-side this resolves through the 8/30 redirect map as pages are re-crawled (fix validations started 9/1). The single new-vs-new conflict is `site:` (not a real query). **Internal (structural) cannibalisation is a Phase 6/7 problem, not yet visible in GSC because 93 % of pages are unindexed** — the largest structural clusters are Google-review cards (27 URLs), hotel key cards (solution + 8 compatibility + compare + guide + industry + blog), laundry (12 URLs incl. 4 solution pages), NFC business cards (7 URLs incl. 2 solutions).

### 2e. Redirect map vs demand (legacy pages that still rank)
| Legacy URL (impr 16 m, pos) | Current redirect | Observed problem |
| --- | --- | --- |
| `/product/felica-card/` (19, **pos 2.3**) | → `/products/rfid-cards/` | page-1 ranking asset sent to a generic category; no FeliCa page exists |
| `/product/hitag-2-card/` (29, pos 69) | → `/products/rfid-cards/` | HITAG 2 is an LF transponder (automotive), not a card family; no HITAG page exists |
| `/product/legic-card/` (10, pos 80) | → `/products/rfid-cards/` | a LEGIC page exists (`/products/rfid-cards/legic-card/`, added 8/30); `/de/produkt/legic-karte/` already points there — inconsistent |
| `/product/mifare-stickers/` (86+78, pos 35–46) | → `/products/rfid-labels/ntag213-nfc-sticker/` | **chip mismatch**: MIFARE Classic sticker demand redirected to an NTAG213 product; no MIFARE sticker product on the new site |
| `/ja/製品/nfc-reader-writer-with-free-sdks/` (8, **pos 1.0** JP) | → `/products/rfid-readers/` | specific product → category; `/product/nfc-reader-writer-with-free-sdks/` correctly → `/desktop-nfc-reader-encoder/` |
| `/product/mifare-desfire-ev2-cards/` + 4 language variants (≈400 impr) | → `…/mifare-desfire-ev3-card/` | acceptable only if EV2 is discontinued in Proud Tek's range; otherwise buyers searching EV2 land on EV3 with no EV2 statement |
| `/fa/…/جیکاپ…` (5 URLs, pos 7–9, Iran) · `/da/…armbånd` · `/he/…` | → various English pages or 404 | non-English demand is being consciously dropped; decision required (§4 U-NE) |

## 3. Mandatory intent map (one preferred URL per primary intent)

Buyer stage: R = research, E = evaluation, P = purchase/RFQ, C = existing-customer/support. "GSC" = 16 m impressions unless noted. Actions are proposals only.

| # | Query cluster (examples) | Stage | Preferred URL | Competing URLs (internal) | Current GSC | Content gap | Evidence gap | Action | Pri |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | MIFARE DESFire cards — "mifare desfire ev2", "ev2 4k / 2k", "desfire ev3 cards", "mifare aes" | E→P | /products/rfid-cards/mifare-desfire-ev3-card/ | /compare/mifare-plus-ev2-vs-desfire-ev3/, /blog/desfire-ev1-vs-ev2-vs-ev3/, /guides/mifare-desfire-ev3-commands-reference/, legacy EV2 pages (redirected) | 749 impr (family), pos 60–90; new page 123 impr pos 38.9 | Demand is EV2; page says EV3 only. Needs an explicit "EV2 availability / EV2→EV3 migration" statement; title 84 chars | Is EV2 still supplied? Price range 0.80–2.00 USD unverified | Keep one product page; add EV2 section only if owner confirms supply; make compare/blog link here as the buy page; shorten title | P1 |
| 2 | MIFARE Classic 1K / Plus — "mifare cards 1k", "mifare classic 1k (card)", "mifare card size", "mifare plus" | E→P | /products/rfid-cards/mifare-classic-1k-card/ (Classic) · /products/rfid-cards/mifare-plus-se-card/ (Plus) | /compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/, /blog/mifare-classic-vs-desfire-hotel-chips/, /guides/*chip-encyclopedia* | 421 impr; Classic page 186 impr pos 52.8 | "size/dimensions" questions answered only in spec table; Plus page not yet crawled | Crypto-1 security statements must cite NXP/primary research (Phase 4) | Keep; strengthen spec table (ISO 7810 ID-1 dims), link from compare; request indexing after evidence check | P1 |
| 3 | LEGIC — "legic", "legic chip", "legic karte" (DE) | E→P | /products/rfid-cards/legic-card/ | legacy /de/produkt/legic-karte/ (89+41 impr) redirects here; /product/legic-card/ does **not** | 407 impr (LEGIC/Java/HITAG/FeliCa family); DE demand | Page is new (8/30), unknown to Google | **LEGIC is a licensed ecosystem** — what exactly Proud Tek can supply (blank LEGIC advant/prime cards? via licensed partner?) needs owner evidence before the page is promoted | Fix `/product/legic-card/` redirect target; hold promotion until supply claim verified | P1 |
| 4 | Java Card / JCOP — "java card", "jcop4", "javaカード", "جیکاپ" | E→P | /products/rfid-cards/java-card/ (indexed 9/2) | /blog/java-cards-smart-card-os-explained/ | ~165 impr legacy /product/java-card/; new page indexed | JP/FA demand cannot be served by an English page (decision) | JCOP is NXP's Java Card OS — chip/OS claims need NXP documentation | Keep; blog → product link; verify claims | P1 |
| 5 | FeliCa / HITAG 2 / car transponder — "felica card" (pos 2.3!), "hitag2", "karty hitag", "chip transponder" | E→P | none exists → currently /products/rfid-cards/ ; vehicle → /solutions/vehicle-rfid-identification/ | — | 19 + 29 + 7 impr; FeliCa legacy page was page-1 | Products removed from catalogue? If still supplied, a specific page is missing; if not, redirect to nearest honest page (tags category for HITAG) | Owner: are FeliCa cards and HITAG 2 transponders still offered? | NEEDS_MANUAL_REVIEW — do not create pages without supply evidence | P1 |
| 6 | NFC stickers — "ntag213", "ntag213 nfc tag", "mifare sticker(s)", "nfc sticker" | E→P | /products/rfid-labels/ntag213-nfc-sticker/ (NTAG) · **MIFARE sticker: no page** | /products/rfid-labels/ (category), /compare/on-metal-nfc-labels-vs-standard-nfc-stickers/, /blog/nfc-stickers-marketing-campaigns/ | ntag213 60 impr pos 50; mifare sticker(s) 164 impr pos 35–46 | MIFARE-sticker demand is redirected to an NTAG product (chip mismatch) | Does Proud Tek make MIFARE Classic 1K labels? | Keep NTAG page as preferred for NTAG queries; MIFARE-sticker redirect → category until product confirmed | P1 |
| 7 | UHF windshield / vehicle tags — "windshield tag(s)", "uhf windshield tag", "headlight rfid", "lto sticker windshield" (PH) | E→P | /products/rfid-labels/long-range-uhf-windshield-sticker/ | /solutions/vehicle-rfid-identification/, /contact/vehicle-rfid/, /blog/*headlight* | ~49 impr family; product 120 impr pos 35.6 | PH LTO-mandate wording must be verified before targeting it | Read-range figures need test conditions (reader power, antenna, mounting) | Keep; solution page → product; add conditions | P2 |
| 8 | Hotel key cards — "hotel key cards", "hotel room key fobs", "otel kapı kartları" | E→P | /solutions/hotel-key-cards/ | /compatibility/* (8 lock brands), /compare/rfid-vs-magnetic-hotel-key-cards/, /compare/pvc-vs-wood-vs-pla-hotel-key-cards/, /guides/hotel-keycards/ (hub, unknown to Google), /industries/hospitality/, /blog/how-hotel-rfid-key-cards-work/, /case-studies/*hotel* | 163 impr family; solution 160 impr pos 14.9, 1 click | Distinct jobs exist (compatibility check vs buy vs learn) but the solution page must be the single "buy" page and the guides hub the single "learn" page; blog how-it-works overlaps the hub | Lock-compatibility claims per brand = highest-risk compatibility statements on the site (Phase 4) | Keep all roles; tighten linking; fix CTR (title/desc) | P1 |
| 9 | Supply-chain / inventory RFID (anonymised long-tail) | R→E | /solutions/rfid-supply-chain-management/ | /solutions/rfid-inventory-tracking/, /solutions/rfid-warehouse-management/, /solutions/rfid-asset-tracking-labels/, blog ROI posts | 358 impr pos 5.5, **0 clicks** | Page-1 with no clicks: snippet/title or intent mismatch; four overlapping solution pages | ROI/accuracy figures (99 % case study) unverified | Investigate SERP (Phase 2 check), then decide roles of the 4 pages (Phase 7) | P1 |
| 10 | Event wristbands — "rfid wristbands", "event wristbands", "rfid armbånd" (DK) | E→P | /solutions/rfid-event-wristbands/ (application) · /products/rfid-wristbands/ (buy) | /solutions/rfid-event-access-control/, /industries/events-venues/, /compare/silicone-vs-fabric-vs-woven-rfid-wristbands/ (crawled-not-indexed), 18 wristband SKUs | solution 132 impr pos 5.3; category 67 impr pos 6.3; 0 clicks | Two page-1 pages with zero CTR | Cashless/payment claims need qualification (Proud Tek supplies the band, not the payment platform) | CTR work; make compare page the evaluation step | P1 |
| 11 | Healthcare/sterilisation — "rfid autoclave", "rfid tags for surgical instruments", "rfid blood guard" | R→E | autoclave/instruments → /products/rfid-tags/high-temperature-rfid-tag-200c/ ; blood → /blog/rfid-blood-bank-tracking-fda-21-cfr-part-11/ (unknown to Google) | /industries/healthcare/ (120 impr pos 71), /solutions/rfid-patient-tracking/, /blog/rfid-surgical-sponge-counting-fda-aorn/, case study RSS | 91 impr family | Industry page ranks weakly for product-specific queries | **Medical/regulatory claims (FDA 21 CFR Part 11, AORN, UDI, HIPAA) require primary sources and LEGAL_REVIEW**; temperature ratings need test conditions | Route product queries to product pages; keep industry page as hub | P2 |
| 12 | Readers/encoders — "industrial rfid reader", "nfc reader writer", "reader/writer", "acr122u" | E→P | /products/rfid-readers/desktop-nfc-reader-encoder/ (desktop) · /products/rfid-readers/ (industrial/category) | /solutions/rfid-readers-and-encoding/, legacy JP page pos 1 | 201 impr family | Fix `/ja/…reader…` redirect → desktop encoder page; category thin on industrial readers (3 SKUs) | PC/SC, SDK, OS compatibility claims need documentation | Keep; redirect fix | P2 |
| 13 | Access control / key fobs — "rfid key tags" (pos 10), "prox key fob", "hotel room key fobs" | E→P | /solutions/rfid-keyfobs-access-control/ | /products/rfid-keyfobs/ (buy), /blog/rfid-key-fob-access-control/ (crawled-not-indexed, overlaps), /contact/access-control-keyfobs/ (**indexed contact variant**) | small | Blog post duplicates the solution's job; contact variant competes | — | Consolidate blog into solution (Phase 6 decision); noindex contact variants? (report impact first) | P2 |
| 14 | NFC business cards & Google-review cards | E→P | business cards: /solutions/nfc-business-card/ ; programs (bulk/corporate): /solutions/nfc-business-card-programs/ ; review cards: /solutions/google-review-nfc-card/ | 27 Google-review URLs (11 solution variants by venue type, 3 guides, blog, compare, case study), 7 business-card URLs | programs page 61 impr **pos 2.0, 0 clicks**; family otherwise ~5 impr | Venue-variant pages (restaurants/hotels/retail/salons/gyms/clinics/front desks/checkout/pickup/tabletop) have no distinct SKU or buyer task → rule 7 risk | Case-study "320 % reviews" figure unverified | Phase 6/7: define one hub + evidence-backed spokes; no new pages | P1 |
| 15 | Laundry RFID — "laundry rfid", "linen tags", "uhf laundry tag" | E→P | /solutions/rfid-laundry-tags/ (buy) | /solutions/rfid-laundry-management/, /solutions/rfid-laundry-tracking/, /industries/laundry-services/, /products/rfid-tags/rfid-pps-laundry-chip/, 2 compare, guide, blog ROI, case study | 1 impr (family) — demand unproven in this property | 4 solution-type pages on one topic | wash-cycle/temperature durability figures need test conditions; case-study numbers unverified | Phase 6/7 roles; likely consolidate management/tracking into one system page | P2 |
| 16 | Brand — "proudtek", "proud tek", "proudtek.com" | C/N | / | legacy /de/ /es/ /fr/ /ru/ homepages (redirected) | 87 impr, 7 clicks, pos 1.3 | — | Entity conflicts (Phase 3) | Nothing on-page; finish entity work | P0 (entity) |
| 17 | Non-English demand — fa (JCOP, DESFire price), ja (reader, java card), da (armbånd), he (RFID stickers), tr (otel kapı kartları), de (legic karte) | E→P | none (site is English-only) | legacy language pages, fading | ~318 impr "non-English other" + language variants of clusters 1–4 | Structural: /markets/* pages are English pages named after countries; they do not serve these queries | — | **Owner decision**: accept the loss, or plan genuinely localised pages with hreflang later. Do not create keyword-variant pages | NEEDS_MANUAL_REVIEW |
| 18 | Pricing / supplier evaluation — "rfid tag price", "قیمت کارت دسفایر", "mifare card bulk", "rfid manufacturer" | P | /rfq/ (quote) · /tools/rfid-tag-cost-estimator/ (estimate) · /blog/cost-per-rfid-tag-2026/ (research) | /lp/* (15 supplier-intent landing pages, 3 already noindex), /markets/*, /about/factory/, /blog/china-rfid-factory-audit-checklist/ | 51 impr transactional | LP set = keyword variants of "manufacturer/supplier/factory" (rule 7) | **All price figures UNVERIFIED** until owner confirms | Phase 6 decides LP fate; cost-estimator/blog figures need first-party basis | P1 |

Rules applied: one preferred URL per intent; no new page proposed where an existing page can serve the intent (clusters 5 and 6 explicitly wait for supply evidence); pages with distinct buyer jobs (compatibility check vs purchase vs learn) are kept separate even where keywords overlap.

## 4. Orphaned / zero-impression / unintended
- Orphaned page with impressions: `/resources/` (3 impr; reachable via nav only). All 11 guide/compare cluster hubs are orphan-in-content **and** absent from the sitemap **and** unknown to Google.
- Zero impressions (16 m): 496 / 535 indexable pages — products 187, blog 108, guides 59, compare 31, solutions 30, industries 19, lp 12, markets 11, about 10, case-studies 8, compatibility 8, contact 8.
- Unintended queries: only `site:` on new pages; legacy pages rank for non-English queries (expected). No new-site page ranks for an off-topic query in the visible data.
- Pages with no distinct buyer task (candidates, to be tested in Phase 6): 11 Google-review venue variants, 4 laundry solution/industry pages, 15 `/lp/*`, 11 `/markets/*`, 10 `/contact/*` variants (one already indexed and ranking).

## 5. Expected impact (interpretation, not a guarantee)
Fixing crawl demand (Phase 2) is a precondition for any query-level movement; until the 438 discovered-not-indexed URLs are fetched, on-page changes cannot show in GSC. The clusters above are where impressions already exist, so they are the first pages whose CTR and position can be measured after indexation.

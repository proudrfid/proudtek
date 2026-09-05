# Phase 7 — Information Architecture (proposal, nothing implemented)

Inputs: Phase 1 inventory (535 indexable URLs), Phase 5 intent map, Phase 6 verdicts, current navigation (mega-menu with ~150 links on every page; footer with 6 columns). Principle: one preferred page per buyer task; hubs that route, spokes that answer; procurement steps (identify → validate → quote → order) visible from every page. Redirects and noindex decisions are listed as proposals with impact notes (rule 12) and are **not** implemented.

## 1. Content types and where they live

| Type | Buyer job | URL space (existing) | Count | Change |
| --- | --- | --- | --- | --- |
| Product families (hubs) | "which family do I need" | `/products/{rfid-cards,rfid-tags,rfid-labels,rfid-wristbands,rfid-keyfobs,rfid-readers}/`, `/products/all/` | 7 | keep; add chip × form-factor selection tables |
| Products (SKU pages) | "buy this credential" | `/products/<family>/<sku>/` | 192 | keep; evidence fixes; `nfc-ring` moved under a family or `/products/all/` |
| Chip / frequency guides (engineering knowledge) | "understand the chip/standard" | `/guides/*` (59) incl. 7 cluster hubs | 59 | keep; hubs into sitemap; split the longest |
| Industry solutions (applications) | "will it work for my operation" | `/solutions/*` (38), `/industries/*` (22) | 60 | industries = who; solutions = what/how; consolidate laundry (3→1 system page + tags page) and Google-review venue variants (11→1 hub) |
| Comparisons | "A or B" | `/compare/*` (33) incl. 4 hubs | 33 | keep; decision table first; hubs fixed |
| Case studies / evidence | "prove it" | `/case-studies/*` (8) + 5 blog "customer stories" | 13 | evidence gate (Phase 4); move blog case studies under `/case-studies/` only if they survive the gate |
| Factory & quality evidence | "is this a real manufacturer" | `/about/factory/`, `/about/certifications/`, `/about/methodology/`, `/about/review-board/`, `/about/corrections/` | 5 | keep; content per Phase 4 decisions |
| Samples | "let me test it" | `/sample-pack/` | 1 | keep as the evaluation CTA target |
| RFQ | "quote me" | `/rfq/` | 1 | keep as the single structured quote path; inline forms feed it |
| Support / contact | "talk to someone / reorder" | `/contact/` (+9 intent variants) | 10 | one page; intents as URL params (already supported) → variants noindex (proposal) |
| Legal / policies | — | `/about/privacy-policy/`, `/about/terms-of-use/`, `/about/disclosures/`, `/about/editorial-policy/` | 4 | keep |
| Supplier-intent landing pages | "RFID manufacturer China" | `/lp/*` (15) | 15 | keep ≤2 with unique proof; others fold into `/about/factory/` |
| Markets | "do you ship to / comply in my country" | `/markets/*` (11) | 11 | one regional page unless country evidence exists |
| Tools / glossary / research / resources | utilities | `/tools/…`, `/glossary/`, `/research/*`, `/resources/` | 5 | keep |

## 2. Proposed top navigation (7 items, ≤ 40 links total in the mega-menu)

1. **Products** — 6 families (+ "All products", "Free sample pack")
2. **Solutions** — Access & hotel keys · Laundry & linen · Events & wristbands · Inventory & supply chain · Brand protection & NFC marketing · Healthcare & regulated (6 groups, each linking to 3–5 solution pages)
3. **Industries** — 8 top industries + "All industries"
4. **Knowledge** — Guides (chip encyclopedias, standards & encoding, buying reference) · Comparisons · Blog · Glossary · Tools
5. **Evidence** — Factory · Certifications (with certificate numbers) · Testing methodology · Case studies · Compatibility guides · Review board
6. **Contact** — Contact / support · WhatsApp
7. **Request quote** (button) → `/rfq/`; secondary "Free sample pack" → `/sample-pack/`

Change vs today: "Resources" and "About" merge into Knowledge/Evidence so the trust pages sit one click from every page; mega-menu shrinks from ~150 to ~40 links (Phase 2 T7/T13, Phase 6 §1) — the heading tags used for menu column labels become non-heading elements (Phase 1/2 note on 70 H2s per page).

## 3. Footer (5 columns)
Products (6 families) · Solutions (6 groups) · Evidence (Factory, Certifications, Methodology, Case studies, Compatibility, Corrections) · Company (About, Leadership, Review board, Editorial policy, Disclosures, Privacy, Terms) · Contact (address, landline if active, WhatsApp, email, hours, "Request quote", "Sample pack"). Remove Markets column (10 country links) unless the regional page survives; fix `/case-studies//`.

## 4. Breadcrumbs
`Home › Products › RFID Cards › MIFARE Classic 1K Cards`; `Home › Solutions › Hotel key cards`; `Home › Knowledge › Guides › Chip encyclopedias › MIFARE DESFire EV3`; `Home › Evidence › Certifications`. BreadcrumbList JSON-LD already mirrors the visible trail — keep exact match.

## 5. Link patterns

| From → To | Rule |
| --- | --- |
| Hub → spoke | every family hub lists all its SKUs with the chip/form-factor table; every cluster hub (guides/compare) links every spoke **in body content**, not only in a sidebar |
| Product → solution | each SKU links to the 1–3 solutions where it is the specified credential ("Used in: Hotel key cards, Event wristbands") |
| Solution → product | each solution names the specific SKUs it recommends (not the family page) and one compare page |
| Guide → product | chip encyclopedias link to the SKUs built on that chip; buying guides link to family hubs |
| Comparison → RFQ | each compare page ends with "Decided? Request a quote for <A> or <B>" → `/rfq/?product=<family>` (existing param) and "Not sure? Sample both" → `/sample-pack/` |
| Compatibility → product | each lock-brand guide lists the compatible SKUs and links `/contact/?intent=compatibility` with lock model fields |
| Evidence ↔ everything | trust strip on all pages links to `/about/certifications/` (with the certificate wording) instead of "ISO 9001 Certified Factory" |
| Blog → owner page | informational posts that share a job with a solution/guide link to it in the first screen and do not carry the inline RFQ form |

## 6. Orphan and discovery fixes
- Add the 11 cluster hubs to `sitemap.xml`; link them from `/guides/` and `/compare/` body content (Phase 2 T4).
- `/resources/`, `/lp/`, `/markets/`: either give them body inlinks or fold them (see §7).
- Reduce nav links per page so in-content links carry proportionally more weight.

## 7. Proposed redirects and index changes (NOT implemented — impact first)

| Proposal | Impact | Preconditions |
| --- | --- | --- |
| `/product/legic-card/` → `/products/rfid-cards/legic-card/`; `/ja/製品/nfc-reader-writer…` → `/products/rfid-readers/desktop-nfc-reader-encoder/`; collapse 3 two-hop chains to direct rules | positive only; legacy signals reach the right pages | LEGIC page claims verified (Phase 5 #3) |
| `/product/mifare-stickers/` → `/products/rfid-labels/` (category) instead of the NTAG213 SKU | removes chip mismatch; 164 impr/16 m legacy demand lands on an honest page | owner confirms no MIFARE-sticker SKU |
| `/product/felica-card/`, `/product/hitag-2-card/` | **hold** — decide product status first; if discontinued, redirect FeliCa → `/products/rfid-cards/`, HITAG → `/products/rfid-tags/` (already so for FeliCa) | owner |
| 43 `→ /` rules: keep for language homepages; retarget product/blog sources to family/topic pages | fewer soft-404 classifications | list in `vercel.json` review |
| Google-review venue variants (10) → `/solutions/google-review-nfc-card/` (301) | 10 fewer pages competing for crawl; no traffic loss (0 impressions) — but rule 19: pages hold **no** rankings/backlinks today (GSC 0 impr, 4 external links site-wide) | owner approval; keep any venue with distinct evidence |
| `/solutions/rfid-laundry-management/`, `/solutions/rfid-laundry-tracking/` → consolidated system page (one of the two URLs kept) | one laundry system page | content merge first |
| `/lp/*` (9 of 11) → `/about/factory/` or the two kept LPs | fewer supplier-intent variants | owner approval; keep `rfid-manufacturer-shenzhen`, `nfc-tag-manufacturer-china` (already canonical targets) |
| `/markets/*` (10) → `/markets/` regional page | one page | content merge |
| `/contact/<intent>/` (9) → `noindex,follow` (keep URLs for UX) | one variant currently indexed with 49 impr/3 m (`/contact/access-control-keyfobs/`) — small loss, removes 9 templated near-duplicates (Jaccard 0.4) | report accepted |
| Blog posts that duplicate a solution/guide job (3) → 301 to the owner page after merging any unique content | — | content merge |
| Legacy domains (proudrfid.com, protekrfid.com) → section-level 301 map (Phase 3 §3.7) | consolidates identity and any backlinks | ownership + backlink review |

## 8. Procurement-task check (does the architecture serve the buyer's steps?)
Identify (family hub → compare) → Validate (compatibility guide / methodology → sample pack) → Quote (RFQ wizard with attribution) → Order/Reorder (contact intent "repeat order", currently missing) → Audit (factory, certifications with numbers, records retention). Every step exists today except "reorder/support" and a compatibility-review intent with lock/reader fields; both are small additions to existing forms, not new pages.

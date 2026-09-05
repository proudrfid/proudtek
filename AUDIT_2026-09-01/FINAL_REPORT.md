# proudtek.com — SEO / GEO / Entity / Evidence / Conversion Audit — Final Report (Phases 0–13)

Prepared 2026-09-02 · Baseline commit `473b5ede` (main) · Evidence: repository, clean HEAD build, live site, GSC (UI + read-only API incl. URL Inspection of all 535 indexable URLs), RDAP, live fetches of sister domains and profiles, NXP documentation, PageSpeed Insights, Perplexity / Google AI Overview benchmark.
**Status: audit complete; implementation plan (section M) awaits human approval. Nothing was committed, deployed or submitted during Phases 1–13.** (Two GSC actions and one uncommitted code change made earlier on 2026-09-01 under a separate mandate are disclosed in `PHASE0_SAFETY_SNAPSHOT.md` §7.)

Phase files (this folder): `PHASE0_SAFETY_SNAPSHOT.md` · `PHASE1_URL_INVENTORY.md/.csv` · `PHASE2_TECHNICAL_AUDIT.md` · `PHASE3_ENTITY_CONSOLIDATION.md` · `PHASE4_CLAIMS_AND_CASE_STUDIES.md` + `PHASE4_CLAIM_LEDGER_CURATED.csv` (+ raw `PHASE4_CLAIM_LEDGER.csv`) · `PHASE5_SEARCH_INTENT.md` + `PHASE5_GSC_ANALYSIS_DATA.md` + `gsc/*.csv` · `PHASE6_CONTENT_QUALITY.md` + `PHASE6_PAGE_METRICS.csv` + `PHASE6_VERDICTS.csv` · `PHASE7_INFORMATION_ARCHITECTURE.md` · `PHASE8_PAGE_BRIEFS.md` · `PHASE10_STRUCTURED_DATA.md` · `PHASE11_GEO_BENCHMARK.md` · `PHASE12_CONVERSION_AUDIT.md`.

Throughout: **Observed** = evidence; **Interpretation** = our reading; **Recommendation** = proposed action; **Expected impact** = what should change if the interpretation is right — never a guarantee of rankings, indexing or citations.

---

## A. Executive findings

1. **Google has not fetched 93 % of the new site.** URL Inspection (2026-09-02): 34 indexed, 438 "Discovered – not indexed", 56 unknown, 5 crawled-not-indexed, 1 soft-404 out of 535 indexable URLs. Crawl stats: ~50 fetches/day, 34 % of the last 90 days' requests were 5xx (all before 2026-06-11 on the old host), 88 % of August's successful fetches were SVG/image assets. Robots, canonicals, rendering and sitemaps are clean. *Interpretation:* crawl demand collapsed after the old-host 5xx episode and the 20k-URL legacy inventory, and the asset-heavy sitemap keeps HTML fetch share at 6 %. *Recommendation:* the crawl-budget fixes in section M (P0) plus the fix-validations already running.
2. **The site's central manufacturing claims are contradicted by the owner's own documents and sister site.** The only certificates on file (ISO 9001/14001/45001, issuer CAIC, first certified 2026-06-10) cover **"sales service of smart cards and RFID tags"**, not manufacturing; rfidak.com — same legal entity — states production runs on **contracted partner lines**; Made-in-China lists "Manufacturer/Factory, Trading Company". proudtek.com says "two self-owned factories, 10 automated lines, 305+ machines, ISO 9001 Certified Factory (446 pages), SGS audited (llms.txt)". This is a factual-accuracy risk to procurement buyers, not an SEO nuance (P0, owner decision required).
3. **All 13 case studies are anonymous with precise outcomes and no evidence**, while the pillar promises "measured after go-live", "customer permission" and "reference calls". Two are in regulated domains (pharma DSCSA, patient safety). Either evidence is produced per case or the cases are relabelled as worked examples (P0).
4. **Entity identity is split across five properties and three legal-name spellings**: proudtek.com (Proud Tek Co., Limited), rfidak.com + Made-in-China + certificate (Shenzhen Proud Tek Co., Ltd / 深圳市奥科物联有限公司), proudrfid.com and protekrfid.com (both claim to be Proud Tek, use its email, differ on address/phone/figures, one carries fabricated-looking testimonials). Answer engines already pick rfidak.com over proudtek.com for supplier queries (3/3 runs).
5. **What works:** robots/canonical/rendering hygiene; a strong evidence *scaffold* (certifications page with numbers and scope, methodology page, sources arrays, corrections log, LLM-assistance disclosure); consent-mode analytics; an RFQ wizard with attribution; Perplexity already cites proudtek.com for troubleshooting, laundry and pricing queries (3/10 test queries, personalised session) — but the most-cited pricing content is the least evidenced.
6. **Search performance:** 128 clicks / 7,168 impressions in the property's 10 months of data; non-brand clicks 3. Demand visible in GSC is chip-name product demand (DESFire, Classic 1K, LEGIC, Java Card, NTAG213, windshield tags, autoclave/blood-bank RFID) at positions 35–95, plus legacy multilingual demand (Iran, Japan, Denmark, Israel) that the English-only site is dropping.
7. **Conversion:** RFQ wizard is sound; the homepage newsletter form is dead; three of four forms end on Formspree's page; sample-pack and inline forms have no honeypot and require only an email; four different response-time promises are live.

## B. Technical crawl/index findings
See `PHASE2_TECHNICAL_AUDIT.md` (28 findings). P0: T1 crawl demand; T2 Vercel Security Checkpoint (403 challenge after ~24 requests; not observed against Googlebot, likely blocks the AI crawlers robots.txt invites; Firewall config not inspectable from the available account). P1: T3 stale `sitemap-index.xml` lastmod (2026-03-16) and machine-mirror generation dates; T4 11 hub pages missing from sitemap and unknown to Google; T5 redirect retargeting (LEGIC, MIFARE-sticker chip mismatch, JP reader, FeliCa/HITAG, 3 two-hop chains, 43 → homepage); T6 SVG `og:image` on 123 pages and 125 SVGs in the image sitemap; T7 titles > 60 chars on 192/204 products (two-suffix template) and 246-char descriptions; T8 batch-identical `dateModified`; T9 authorship concentration and inconsistency across HTML/mirrors/llms.txt; T10 `/case-studies/` soft-404 and `/about/` crawled-not-indexed verdicts from pre-launch fetches; T11 llms.txt/mirrors repeat unverified claims (incl. "SGS audited"). P2: PSI mobile 93/100/100/100 with LCP 2.6 s and a 3.1 MB homepage payload; 15 lazy-loaded hero images; 9 missing alts; `lang` inconsistency; 404 page canonical to `/404/`; footer `/case-studies//` on 536 pages; broken `.xlsx` download link; contact form labels; sample-pack/inline honeypot; Clarity remnant on 14 snapshot pages; no RSS.

## C. Entity conflicts
See `PHASE3_ENTITY_CONSOLIDATION.md`. Conflicts requiring human resolution: C1 legal name (certificate now gives 深圳市奥科物联有限公司 / Shenzhen Proud Tek Co., Ltd, USCC 91440300MA5FBLMP1Y — registration extract still needed); **C2 manufacturing model**; C3 certification scope/issuer (CAIC not SGS; sales scope; OEKO-TEX/TÜV undocumented); C4 headline numbers (clients 400/500/1,000+; years 15/17/18; capacity 5 M/month vs 7 M/year); C5 NAP (A2109 vs A2110; landline vs mobile vs third mobile); C6 YouTube channel claims ("FIFA games since 2021", "bus ticketing in 7 countries"); C7 fabricated-looking testimonials on proudrfid.com; C8 ownership/control of proudrfid.com and protekrfid.com (same registrar as rfidak.com); C9 author/reviewer identities (Peter Zhang = site owner per session context, LinkedIn URL present in JSON-LD; Nancy Wu = Made-in-China contact; roles to confirm); C10 rfidak.com expires 2026-10-14; C11 employees 100+. Deliverables 1–10 (preferred names, domain, `@id`, NAP, approved sameAs, redirect map, spelling rules, logo rules) are drafted in Phase 3 §3 and depend on C1–C3.

## D. Claim and evidence ledger
`PHASE4_CLAIM_LEDGER_CURATED.csv` — 50 material claim groups with claim type, current source, evidence status, risk, treatment and required evidence; `PHASE4_CLAIM_LEDGER.csv` — 31,008 raw candidate sentences for follow-up. Status: FIRST_PARTY_VERIFIED 2 (the ISO certificates — verified *and* misrepresented on most surfaces), EXTERNAL_PRIMARY_SOURCE checked 2 (MIFARE Classic, NTAG memory), primary source available but uncited 4, CONTRADICTED 3 (factories; "launched 1997" vs NXP 1994; "SGS audited"), UNVERIFIED 39. Eight facts appear with different values across surfaces (years, clients, MOQ, response time, chip launch year, legal name, issuer, author attribution). Treatments are specified per group; nothing is to be silently retained.

## E. Case-study authenticity report
`PHASE4_CLAIMS_AND_CASE_STUDIES.md` §5: 13 cases (8 `/case-studies/` + 5 blog "customer stories"). Named customer: 0/13. Permission on file: 0. Measurement records, sample size, method: none disclosed. Numbers reproducible: no. Disclaimer required: all; legal review for CS-05 (pharma DSCSA, 380 M units/yr) and CS-11 (patient safety). Pillar sentences about permission, measurement and reference calls must be rewritten or evidenced. Acceptable fallback: worked examples with stated assumptions (DERIVED_CALCULATION), never presented as deployments.

## F. GSC opportunity map
`PHASE5_SEARCH_INTENT.md` §3 — 18 intent clusters, one preferred URL each. Highest-value: DESFire cards (749 impr/16 m family; demand is "EV2", page says EV3), MIFARE Classic/Plus (421), LEGIC (407 family; new page unknown to Google; licence question), NFC stickers (NTAG213 + "mifare stickers" chip-mismatch redirect), hotel key cards (solution pos 14.9, 160 impr, 1 click), supply-chain solution (358 impr, pos 5.5, 0 clicks), event wristbands (two page-1 pages, 0 clicks), healthcare/autoclave/blood-bank (91 impr, product pages should own it), readers (JP legacy page ranked #1), pricing (transactional, all figures unverified). Owner decisions: FeliCa/HITAG product status; non-English demand (accept loss vs localised pages later).

## G. Cannibalisation clusters
GSC-visible cannibalisation is legacy-vs-new (98 queries, resolves via redirects + recrawl). Structural clusters not yet visible in GSC: Google-review cards (27 URLs: 11 solution venue variants, 3 guides, blog, compare, case study, 2 products), hotel key cards (solution + 8 compatibility + 2 compare + guides hub + industry + blog + case), laundry (12 URLs incl. 3 solution pages + industry page), NFC business cards (2 solutions + blog + 2 products + compare + guide), access-control keyfobs (solution + blog + indexed contact variant), duplicate `<title>` blog vs solution (Google-review restaurants), `/lp/*` supplier-intent variants (15), `/markets/*` (11), `/contact/*` variants (9, Jaccard 0.4). One preferred URL per cluster is assigned in Phase 5 §3 and Phase 7 §7.

## H. Content quality clusters
`PHASE6_CONTENT_QUALITY.md`. Not thin — long (products median 3.5k visible words, guides 6.4k). Direct-answer block on 96 %; official-source links on 78 %; **first-party test wording absent on 74 %**; **supply-boundary statements absent on 77 %**; superlatives on 56 % (mostly "best for" phrasing; "leading" 53, "seamless" 19); boilerplate ≈ 7 % of words per page including an unverified "Every order includes free samples, RF testing and dedicated project support" on 502 pages and the trust strip on 436. No near-duplicate bodies; the variant groups differ in words but not in buyer task. Verdicts for 237 important URLs: 17 P0 (homepage, about/factory/certifications, 13 case studies), 65 P1, 155 P2; 164 Keep, 27 Rewrite, 13 Evidence-or-relabel, 24 Consolidate, 9 NOINDEX_CANDIDATE (contact variants, impact reported).

## I. Proposed information architecture
`PHASE7_INFORMATION_ARCHITECTURE.md`: seven-item top nav (Products · Solutions · Industries · Knowledge · Evidence · Contact · Request quote) with the mega-menu cut from ~150 to ~40 links; footer 5 columns; breadcrumb model; hub↔spoke, product↔solution, guide→product, compare→RFQ, compatibility→contact(intent) link rules; orphan fixes (11 hubs into sitemap and body links); redirect/noindex proposals with impact statements (Google-review variants, laundry merge, LP and markets consolidation, contact variants noindex, legacy-domain map) — none implemented.

## J. Priority page briefs
`PHASE8_PAGE_BRIEFS.md`: 11 briefs — homepage, certifications (model page), hotel key cards, DESFire EV3, MIFARE Classic 1K (with the 1994 correction), NTAG213 sticker, laundry tags (consolidated), Google-review hub (replacing 10 variants), RFID tags family hub; **two blocked** (factory page, case-study pillar) until evidence or a relabelling decision exists. Direct answers contain only verified facts with bracketed placeholders.

## K. Structured-data report
`PHASE10_STRUCTURED_DATA.md`. Passes: single Organization/WebSite `@id`, absolute URLs, breadcrumbs, no parse errors. Defects: Offer without price (192; GSC errors); **invented `sku`/`productID`/`mpn` derived from URL slugs (192) — rule 11**; `Article` on homepage, products, contact, lp, markets (~260); FAQPage on homepage/contact with questions not visible on the page (rule 10); `Product.name` ≠ H1 (191); `inLanguage` on Product; generic `Audience`; 20 pages with `dateModified` < `datePublished`; batch dates; `sameAs` contains wa.me; legalName mismatch. The uncommitted AggregateOffer change fixes the price error mechanically but propagates unverified prices — hold until Phase 4 S-05 is resolved. Corrected schema per page type and a build-time validation test are specified.

## L. Conversion report
`PHASE12_CONVERSION_AUDIT.md`. P0: dead homepage newsletter form (WordPress AJAX on a static host). P1: three forms end on Formspree's hosted page (no on-site thank-you; pattern to reuse exists in `rfq.astro`); sample-pack and inline RFQ lack honeypot and require only email; response-time promise inconsistent (1 business day / 24 h / 6 h / 2–4 h across owned properties); no privacy line in the RFQ form. P2: contact-form labels, wizard step validation, competing CTAs (3 per product page + sticky bar + FAB), GA4 under-reporting under consent mode (use Formspree as lead KPI), Formspree plan/limits unknown. Next-step fit: research pages carry a premature inline RFQ; evaluation stage lacks a compatibility-review form with lock/reader fields; no reorder/support intent.

## M. Exact implementation backlog (Phase 13) — STOP: awaits approval

### M1. Executive risk summary
Highest risk is factual: capability and certification wording (A2), case studies (A3) and llms/mirror files repeating them (T11) — these can mislead buyers and answer engines today and are the first things a supplier-qualification team will check. Second is structural: crawl demand (A1) — no other change is measurable until Google fetches the pages. Third is identity (A4). Everything else is hygiene with low risk.

### M2. Backlog

| ID | Pri | Item | Type | Owner decision needed? |
| --- | --- | --- | --- | --- |
| P0-1 | P0 | Trust strip and homepage capability block: replace "ISO 9001 Certified Factory" / "500+ … 50+" with certificate-accurate wording; remove or qualify factories/lines/machines/patents/R&D % pending evidence | content + component | **Yes (C2, K-05, K-07, K-08)** |
| P0-2 | P0 | llms.txt / llms-full.txt / machine mirrors: remove "SGS audited", "certified manufacturing", client counts; align author attribution; emit real generation dates | code (`src/lib/seo-feeds.ts`, `src/lib/seo.ts`) | Yes (fact registry) |
| P0-3 | P0 | Case studies: per-case evidence or relabel as worked examples; rewrite pillar sentences | content | **Yes** |
| P0-4 | P0 | Crawl demand: remove SVGs from image sitemap; add 11 hubs to sitemap; fix sitemap-index lastmod; continue GSC request-indexing for hubs (owner, ~10/day) | code (`src/lib/seo-feeds.ts`, image-sitemap generator) + GSC | No (GSC actions by owner) |
| P0-5 | P0 | Vercel Firewall: inspect Attack Challenge Mode / rate rules; allow verified bots; scoped rate limit | platform | **Yes (access + setting change)** |
| P0-6 | P0 | Dead newsletter form on homepage: remove or wire to Formspree/ESP with consent | code (`src/data/home-v2.ts` / snapshot block) | Minor |
| P1-1 | P1 | Product schema: remove invented sku/mpn/productID, `inLanguage`, `Article`; name = H1; `audience` fix; **offers only after price confirmation** | code (`src/lib/seo/jsonld.ts`; uncommitted change to be reconciled) | Yes (S-05 prices) |
| P1-2 | P1 | Homepage/contact FAQPage & Article removal; AboutPage on about pages; hasCredential ×3 on certifications | code (`jsonld.ts`) | No |
| P1-3 | P1 | Redirect retargeting (LEGIC, MIFARE-sticker → category, JP reader → encoder, 3 chains; review 43 → `/`) | config (`vercel.json`) | Yes (MIFARE-sticker/FeliCa/HITAG product status) |
| P1-4 | P1 | `og:image` raster variants for SVG heroes; drop SVG from image sitemap | code (build step with sharp; `image-utils.ts`) | No |
| P1-5 | P1 | Title/description templates: drop middle suffix on products; cap descriptions | code (`src/lib/seo/page-data.ts`, `src/lib/seo/product.ts`) | No |
| P1-6 | P1 | dateModified from content change history; fix 20 inverted dates | code + content metadata | No |
| P1-7 | P1 | Authorship: confirm identities/roles; one attribution rule across HTML, JSON-LD, mirrors, llms.txt | content + code | **Yes** |
| P1-8 | P1 | Forms: honeypot + name/company required on sample-pack and inline; on-site success state (reuse `rfq.astro` pattern); privacy line; single SLA sentence | code (`InlineRfqForm.astro`, `rfq.astro`, `PageScript.astro`, snapshot contact form) | Yes (SLA value) |
| P1-9 | P1 | Consolidations: Google-review venue variants → hub; laundry 3 → 1 system page; LP 11 → 2; markets → 1; blog duplicates → owner pages (301s in `vercel.json` after merge) | content + config | **Yes** |
| P1-10 | P1 | Entity: legalName, address fields, sameAs cleanup (remove wa.me, hold Facebook), YouTube channel-ID URL; NAP alignment on owned profiles (YouTube, Made-in-China, LinkedIn); decisions on proudrfid/protekrfid | code (`seo-content.ts`) + off-site | **Yes (C1, C8)** |
| P1-11 | P1 | Compatibility guides: qualify acceptance statements; add "validate with sample" and test-matrix section when evidence exists | content | Yes (test log) |
| P1-12 | P1 | Supply-boundary + test-conditions sections on product/solution templates (fill from evidence; otherwise state "datasheet value") | content template | Partly |
| P2-1 | P2 | Nav: mega-menu → ~40 links; heading tags → non-heading; footer `/case-studies//`; `.xlsx` link | code (`menu-structure.ts`, `DesktopNav.astro`, `MobileNav.astro`, `SiteFooter.astro`) | No |
| P2-2 | P2 | Performance: remove lazy on hero images; drop legacy Kadence JS where native shell is active; homepage payload | code | No |
| P2-3 | P2 | 404 template canonical; `lang` consistency; 9 alts; table captions; contact-form labels | code | No |
| P2-4 | P2 | Contact intent variants → noindex; reorder/support and compatibility intents with fields | code | Yes (impact accepted) |
| P2-5 | P2 | RSS feed for blog/guides; Clarity remnant removal on snapshot pages | code | No |
| P3 | P3 | Localised pages for fa/ja/da/he demand (only if the business wants those markets) | strategy | Yes |

### M3. Exact files proposed for change
`src/components/editorial/TrustSignals.astro` · `src/data/home-v2.ts` (homepage copy) · `src/lib/seo-content.ts` (ORGANIZATION_*, COMMERCIAL_TERMS, CREDENTIALS, ALTERNATE_NAMES) · `src/lib/seo-feeds.ts` (sitemap-index lastmod, image sitemap filter, llms text) · `src/pages/llms.txt.ts`, `src/pages/llms-full.txt.ts`, `src/pages/machine/*.ts`, `src/lib/seo.ts` (mirror text: Author/Credentials) · `src/lib/seo/jsonld.ts` (+ reconcile uncommitted `product-offer.ts`) · `src/lib/seo/page-data.ts`, `src/lib/seo/product.ts` (title/description) · `src/lib/seo/image-utils.ts` + a new build script for raster og images · `vercel.json` (redirects) · `src/components/editorial/InlineRfqForm.astro`, `src/pages/rfq.astro`, `src/components/PageScript.astro` (forms) · `src/lib/menu-structure.ts`, `src/components/shell/{DesktopNav,MobileNav,SiteFooter}.astro` · `src/pages/404.astro` · `src/layouts/*` (lang) · content: `src/content/editorial/about/*.json`, `case-studies/*.json`, `blog/case-study-*.json`, `products/rfid-cards/mifare-classic-1k-card.json` (1994), `solutions/google-review-*.json`, `solutions/rfid-laundry-*.json`, `lp/*.json`, `markets/*.json`, `compatibility/*.json` · `src/data/site-contract.v1.json` (regenerated after each batch) · tests under `src/lib/__tests__/` (new schema/visible-text assertions).

### M4. Files explicitly excluded
Analytics IDs and consent script logic (only additive privacy line); `robots.txt` generator (no change proposed; owner may reconsider training-bot allowances); legal pages (`privacy-policy`, `terms-of-use`) except link additions; `scripts/*` dispatchers; `src/data/pages/**` snapshot data (read-only mirror) except the homepage newsletter block; `gsc-sa.json`; deployment settings in Vercel other than the Firewall review (which is the owner's action, reported first).

### M5. Route impact
No indexable URL is removed in P0/P1 batches. Consolidations (P1-9) remove up to ~40 indexable URLs via 301 **only after owner approval and content merge**; each has 0 impressions in GSC and no external links (site-wide external links = 4, all to `/`). Contact variants (P2-4) move to noindex (one has 49 impr/3 m). Legacy 56 generated files stop being emitted (no URL change — they are already redirected).

### M6. Redirect impact
P1-3 changes 5 existing rules and collapses 3 chains (no new 404s; targets exist). P1-9 adds ≤ 40 rules. Legacy-domain redirects are out of scope until ownership/backlinks are confirmed. `dist/_redirects` regenerates; `audit:site-contract` baseline must be rewritten in the same commit.

### M7. Schema impact
Product nodes lose invented identifiers and `Article`; gain accurate `name`; `offers` appears only where prices are confirmed. Homepage/contact lose FAQPage/Article. Organization gains correct legalName/address, loses wa.me from sameAs. Certifications page gains three `hasCredential` entries backed by the PDF. GSC Product-snippet errors should go to zero; Merchant listings report empties.

### M8. Content evidence dependencies
See section N. Batches P0-1, P0-3, P1-7, P1-9, P1-11, P1-12 cannot be completed without the listed evidence; they are written to degrade gracefully (qualify or remove) if evidence is not supplied.

### M9. Component reuse plan
`TrustSignals.astro` becomes the single trust strip fed by a fact registry (new `src/data/company-facts.ts` with evidence status per fact); `rfq.astro`'s fetch/success/error pattern is extracted into a shared form module used by `InlineRfqForm.astro`, sample-pack and the contact page; the certifications table renders from one data object also used for `hasCredential`; the chip × form-factor selection table component is shared by the 7 family hubs.

### M10. Testing plan
Per batch: `npm run lint`, `npm run lint:chip-claims`, `npm run test` (extend with: FAQPage-visible-text equality, Product.name = H1, no PT- identifiers, no `inLanguage` on Product, dateModified ≥ datePublished, ≤ 5 % pages sharing one dateModified, title ≤ 60 / description ≤ 160 for products, no SVG in image sitemap, sitemap contains all indexable non-paginated routes), `npm run build`, `npm run audit:site-contract` (rewrite baseline intentionally), Phase 1 crawler script re-run (route count, broken links, orphans), JSON-LD validator run, live fetch of every changed redirect, Rich Results Test on one URL per page type, form dry-run in Formspree test mode.

### M11. Rollback plan
One concern per commit on a feature branch; `git revert <sha>` per batch; Vercel "Promote to production" of the previous deployment for instant rollback; `vercel.json` reverts restore redirects; content JSON reverts restore text and schema together (static site). Firewall changes are reversible in the Vercel UI.

### M12. Proposed commits (sequence)
1. `fix(seo): sitemap-index lastmod, add cluster hubs, drop SVG from image sitemap` (P0-4)
2. `fix(schema): remove invented sku/mpn, inLanguage, Article on non-articles, homepage/contact FAQPage; name = H1` (P1-1/P1-2)
3. `fix(content): certificate-accurate trust strip, llms.txt and mirror credentials; single fact registry` (P0-1/P0-2 — after owner decisions)
4. `fix(redirects): retarget legacy LEGIC/MIFARE-sticker/JP reader; collapse chains` (P1-3)
5. `fix(forms): honeypot + required fields + on-site success + privacy line; remove dead newsletter form` (P0-6/P1-8)
6. `fix(seo): product title/description templates; og:image raster variants` (P1-4/P1-5)
7. `fix(content): case studies → evidenced or worked examples; pillar rewrite` (P0-3 — after owner decision)
8. `refactor(nav): mega-menu reduction, heading tags, footer link` (P2-1)
9. `content: consolidations + redirects` (P1-9 — after approval)
Each commit regenerates `site-contract.v1.json`. No push/deploy without separate authorisation.

### M13. Changes requiring legal or owner approval
Any statement about factories, capacity, certifications, patents, clients, R&D spending (owner + legal); case-study relabelling or removal (owner + legal); regulatory sentences (DSCSA, ESPR/DPP, ISBT 128/FDA, Walmart, AORN/AHRQ, HIPAA) (legal); Vercel Firewall change (owner); redirects/noindex that remove URLs (owner); legal name and sameAs (owner with registration extract); price/MOQ/lead-time/SLA figures (owner sign-off with basis).

## N. Human evidence request list
1. Business registration extract (name, USCC 91440300MA5FBLMP1Y, date) → C1, K-01.
2. Production model: factory lease/title or partner-line contracts; equipment register or third-party factory audit; or a written decision to use the partner-line formulation → K-02–K-04, K-13.
3. Patent numbers (CNIPA) → K-05; or removal.
4. OEKO-TEX certificate (holder, class, validity); TÜV/SGS/Intertek report numbers; FCC IDs / CE DoCs for reader SKUs → K-11, K-12.
5. Client and country counts with basis; headcount range → K-08, G-02.
6. MOQ policy; 12-month lead-time records; dated indicative price list per family (or decision to remove prices); sample-request log; helpdesk response-time export → S-01…S-06.
7. Per case study: permission, source data, configuration, period, reference contact → CS-00…CS-12.
8. Author/reviewer identities, roles and public profiles (Peter Zhang LinkedIn URL already in JSON-LD; Nancy Wu; Mia Li) → K-14, T9.
9. FSC chain-of-custody code; LCA source for carbon figures → E-01.
10. Ownership/control of proudrfid.com, protekrfid.com; decision on rfidak.com renewal (expires 2026-10-14) and brand positioning → C8, C10.
11. Vercel `proudrfid` team access (or Firewall screenshots) and production env values → T2, U2.
12. Formspree plan, recipients, spam settings → CV-10.
13. Legal review of the regulatory sentences listed in the ledger (R-01…R-05, CS-05, CS-11).
14. Decision on non-English demand (fa/ja/da/he/tr/de) → cluster #17.
15. Product status: FeliCa cards, HITAG 2 transponders, MIFARE Classic labels, DESFire EV2 → clusters #1, #5, #6.

## O. Validation and measurement plan
- **Immediately (each batch)**: build/lint/tests green; route inventory diff (599 → expected count); status codes of all changed redirects; forms dry-run; canonical/robots/sitemap diff; JSON-LD validation; Phase 1 crawler re-run.
- **24–72 h**: Vercel deployment health; GSC Sitemaps "last read"; crawl stats (requests/day, HTML share, 4xx/5xx); URL Inspection of hubs; firewall header check (`x-vercel-mitigated` absent for normal traffic bursts).
- **1–2 weeks**: fix-validation progress on the 5 buckets; Discovered-not-indexed count (438 baseline) and indexed count (34 baseline) via URL Inspection API re-run of the 535 set; Product-snippet errors; early query movement for clusters 1–10.
- **4 weeks**: impressions/clicks/CTR/position for the 18 preferred URLs vs baseline (`gsc/last28_page.csv`); brand vs non-brand; country/device; GEO benchmark re-run from a clean profile (10 queries × 3 runs, US/EU) with the five rates defined in Phase 11.
- **8–12 weeks**: non-brand visibility (impressions on preferred URLs), qualified RFQs and sample requests (Formspree export, with attribution fields), citation consistency, unsupported-answer rate (should fall to 0 once prices are evidenced or removed), assisted conversions.
- **Success criteria (per brief)**: fewer unsupported claims (ledger UNVERIFIED count 39 → ≤ 10), one preferred page per buyer intent (18 clusters mapped), consistent organisation identity (one legal name, one NAP, approved sameAs), stronger primary-source evidence (certificate-accurate wording everywhere; sentence-level citations on regulatory pages), correct indexation (≥ 80 % of indexable URLs fetched within 8 weeks — a measurement target, not a promise), stable or improved non-brand visibility, higher qualified-inquiry rate, repeatable citation of the correct page.

**STOP. Awaiting human approval of section M before any Phase 14 implementation.**

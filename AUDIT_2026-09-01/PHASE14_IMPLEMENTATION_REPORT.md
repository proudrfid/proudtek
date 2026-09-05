# Phase 14 — Implementation report (proudtek.com static mirror), revision 2

Baseline: `473b5ede` (`docs: channel kit corrected from zero-launch to activate-existing`). Work performed 2026-09-02 in the sandbox against the approved section M of `FINAL_REPORT.md`, the three owner decisions of 2026-09-02 (D-01 capability figures removed, D-02 case studies relabelled as worked examples, D-03 pricing kept as dated indicative text with no offers in schema), and the two instructions received after revision 1:

- **偏离项按照计划修正** — every item revision 1 flagged as outside section M has been brought back to the plan (§4).
- **待决策项以 rfidak.com 的口径为准** — the open decisions (production model, MOQ, lead time, samples, response time, authorship, certificates, FeliCa/HITAG) now follow what rfidak.com — the RFID brand of the same legal entity, Shenzhen Proud Tek Co., Ltd — publishes. The reference facts, with source pages and one independent verification, are in `phase14/RFIDAK_REFERENCE_FACTS.md` (§3, §5).

**Nothing has been committed, pushed, merged, deployed or submitted.** The sandbox cannot write the git index, so the result is delivered two ways that produce the identical tree (`fff67148b3354118a1ea42dd2a68bef8de9b45c4`):

1. the repository working tree holds the end state (lint, chip lints, 23 test files, build 599 pages and `audit:site-contract` all green), and
2. `AUDIT_2026-09-01/phase14/series/0001…0020-*.patch` — a 20-commit series, verified to apply with `git am --3way` on a fresh clone of `473b5ede` and to reproduce that exact tree.

Left alone: `docs/monitoring/weekly-index-watch.md` (a pre-existing local edit, not ours) and the untracked, git-ignored `gsc-sa.json` (used read-only). `src/data/site-contract.v1.json` is regenerated in the last commit. The four retired author records under `src/content/authors/` were deleted in the working tree and `git rm`'d in the series.

---

## 1. Commit series (apply in order)

| # | Commit | Batch | Concern | Files |
|---|---|---|---|---|
| 1 | `d82a88f` seo(crawl) | B1 | `sitemap-index.xml` lastmod from build time; 11 hubs into the sitemap; SVG out of the image sitemap; machine mirrors reuse `BUILD_TIME_ISO` | 9 |
| 2 | `adfa4ce` seo(schema) | B2 | Product `name` = H1, no invented identifiers, offers gated off; `FAQPage` only for rendered FAQs; `Article` only on article routes; Organization legal name, address, `sameAs`, `hasCredential` (3 CAIC certificates) on `/about/certifications/`; `AboutPage` | 7 |
| 3 | `96e9ba9` lint(chip-drift) | tooling | drift lint no longer flags prose edits on lines with pre-existing `{chip:…}` tokens (real drift still caught — tested) | 1 |
| 4 | `203e07e` content(products) | B3 | "Indicative pricing … as of Q3 2026" on 103 pages; MIFARE Classic 1997 → 1994; 20 inverted `modifiedAt` | 118 |
| 5 | `cbac4d1` content(case-studies) | B3 | 13 case studies → "Worked example" with disclosure; hub, pillar, homepage card, menus; footer `/case-studies//` fixed | 17 |
| 6 | `9dba2a1` content(claims) | B3 | factory / line / machine / patent / R&D-% / client / country figures removed; ISO wording per certificate; OEKO-TEX logo removed pending evidence; years computed from 2008 | 27 |
| 7 | `6de2ab4` fix(redirects) | B4 | 38 rules retargeted (LEGIC, MIFARE-sticker → category, JP reader → encoder, 3 chains, `→ /` review) in `vercel.json`, `_redirects`, canonical overrides | 3 |
| 8 | `4fdd1c2` feat(forms) | B5 | inline RFQ / sample-pack form: name+email+company required, `_gotcha`, privacy line, on-site success via `fetch()`, lead events on confirmed delivery | 4 |
| 9 | `2930762` fix(forms) | B5 | dead homepage newsletter row removed (+ `/faq/` rewire, reverted in #16) | 2 |
| 10 | `65b0bf6` content(claims) | B3 | homepage meta description, `VideoObject`, 3 LP diagrams and one LP sentence still carrying the removed figures | 6 |
| 11 | `37dea80` seo(templates) | B6 | product `<title>` keeps the family qualifier only within 60 chars; MOQ suffix removed from descriptions; 155-char cap everywhere | 4 |
| 12 | `4272ae3` seo(og) | B6 | 125 committed 1200×630 JPEG twins for SVG heroes; `og-raster.ts`; `og:image:width/height`; regeneration script + guard test | 129 |
| 13 | `5207b03` a11y(nav) | B7 | footer / mega-menu / mobile-menu column labels → `<p>` with `aria-label` | 5 |
| 14 | `fb50705` fix(seo) | B7 | 404 without canonical; `lang="en-US"` on 599 pages; dead `.xlsx` link → on-site estimator | 12 |
| 15 | `4ee24f0` chore(contract) | — | site-contract baseline after B1–B7 | 1 |
| 16 | `6282433` fix(scope) | 偏离项 | **plan conformance** — 5 non-JP reader rules back to `/products/rfid-readers/`; IT/FR LEGIC-inferred rules → card family hub; `/faq/` form rewire and contact `<noscript>` removal dropped (`enhance-page.ts` = baseline); `/about/*` out of article routes; og twins now render in `prebuild` (sharp locally, `--check` on Vercel/CI) | 6 |
| 17 | `546549b` feat(authorship) | rfidak D-06 | function-based bylines: `editorial-board` → Proud Tek Editorial Team, `proudtek-engineering` → Proud Tek RF / Production Engineering (records typed `Organization`); peter-zhang / nancy-wu / mia-li / sam-yao retired; Article `author` / `reviewedBy` emit Organization nodes; route→author map emptied; leadership banner SVG | 12 |
| 18 | `5e1e944` content(rfidak) | rfidak D-04/05/09, K-11/12 | single-source constants: production model line + owned/partner split, `COMMERCIAL_TERMS`, `ORGANIZATION_OPERATIONS.moq/leadTime/response/samples/payment`, product certification (OEKO-TEX) and sample-based test reports; `llms.txt` Quick facts and header; trust strip / hero bar / about trust band / home-v2 card / homepage paragraphs, footer tagline and process step; RFQ wizard, inline form and quote-target wording; `hasCredential` + OEKO-TEX | 13 |
| 19 | `ab6f9bb` content(rfidak) | rfidak, all | 526 editorial JSON + 13 diagrams: production-model narrative (274 sentences, 75 files), commercial terms (143 changes, 115 files), bylines on 522 pages, certificate registry, `/about/factory/`, `/about/`, `/about/review-board/`, `/about/leadership/`, the "factory direct" LP rewritten; markets pages and the cost estimator's reply promise | 536 |
| 20 | `4eb9c17` chore | — | og twins re-rendered for the 3 edited heroes; HTML snapshots; site-contract baseline | 6 |

Diff summary: **732 files changed, 8,485 insertions(+), 8,058 deletions(-)** (baseline JSON and binary twins account for most of the volume). Line-level changelogs: `phase14/B3-content-changelog.csv` (B1–B7 content), `phase14/B8-content-changelog.csv` (commits 16–20, 3,619 line changes across 544 files), `phase14/B4-redirect-changes.csv` (33 rules after the scope fix).

### How to apply (owner action)

```bash
cd /Users/zhangping/Projects/Playground
git worktree add -b audit/phase14 ../proudtek-phase14 473b5ede
cd ../proudtek-phase14
git am --3way "$OLDPWD"/AUDIT_2026-09-01/phase14/series/*.patch
npm ci && npm run lint && npm run lint:chip-claims && npm run test && npm run build && npm run audit:site-contract
git push -u origin audit/phase14      # only when you decide to
```

Alternative — commit the working tree in place (identical result). Keep `docs/monitoring/weekly-index-watch.md` out of the audit commits. Rollback: every commit is independently revertable; commits 12 and 20 carry the binary twins.

---

## 2. Verification on the final tree

| Check | Result |
|---|---|
| `npm run lint` | clean |
| `npm run lint:chip-claims` | clean — 536 files, 35 rules |
| `lint:chip-placeholder-drift` (`BASE=HEAD`) | clean — 522 changed editorial files, 13 prose edits on pre-existing placeholder lines not re-checked |
| `npm run test` | 23 files passed |
| `npm run build` | 599 pages, exit 0 (prebuild runs `build-og-rasters.mjs --check`: 125 heroes, 0 twins missing) |
| `npm run audit:site-contract` | PASS — outputs 599, sitemap 535/535, machine 519/519, redirects 248/248; 1 known warning (`CANONICAL_COUNT /404/ = 0`, intentional) |
| Phase 10 script on the final build | Organization / WebSite consistent on 518 pages; Product without identifiers or offers (192); `Article.author` = Proud Tek Editorial Team (Organization), `reviewedBy` = Proud Tek RF / Production Engineering, both anchored on `/about/review-board/`; `hasCredential` = 3 ISO + OEKO-TEX on `/about/certifications/`; the earlier `author_url_not_a_page` flag is gone |
| OEKO-TEX 23.HCN.97349 | OEKO-TEX Label Check (2026-09-02): "The certificate is valid", STANDARD 100, product class II, article "UHF laundry tag with RFID chip … 100 % polyester … electroconductive yarn" — identical to the rfidak scan |

### 2.1 Before / after (clean `473b5ede` build vs. final build, tag-stripped text)

| Metric | HEAD 473b5ed | After Phase 14 |
|---|---|---|
| html files / indexable pages | 599 / 535 | 599 / 535 |
| sitemap URLs | 524 | 535 |
| sitemap-index lastmod | 2026-03-16 | build date |
| image-sitemap SVG entries | 125 | 0 |
| og:image = SVG (indexable pages) | 123 | 0 |
| title > 60 chars (indexable) | 347 | 272 (product 192 → 105; the rest are editorial titles — `phase14/B6-long-product-titles.csv`) |
| description > 160 (indexable) | 202 | 0 |
| pages with `Offer` / Product with `sku` | 192 / 192 | 0 / 0 |
| `Article` on non-article routes | 240 | 0 |
| headings outside `<main>` (all pages) | 3,194 | 2 (pre-existing WP archive headers) |
| `<html lang>` | en-US 581 / en 18 | en-US 599 |
| pages linking `/case-studies//` | 536 | 0 |
| pages with the removed capability figures | 506 | 1 (false positive: "12 factories" in a retail post) |
| pages naming Peter Zhang / Nancy Wu / Mia Li / Sam Yao | 514 | 0 |
| pages with own-factory / in-house-production / factory-gate wording | 15 | 1 (false positive: "under one roof" describing a dealership) |
| pages promising a reply or quote "within one business day" | 518 | 0 |
| pages stating the partner-line production model | 0 | 539 |
| pages with a dead WP AJAX form | 2 | 1 (`/faq/` — left as baseline per the plan; see §6) |
| inline RFQ forms / with honeypot | 514 / 0 | 514 / 514 |
| pages saying "Worked example" / "Indicative pricing" | 4 / 1 | 532 / 104 |
| 404 self-canonical | yes | no |
| redirect rules / two-hop chains / rules → `/` | 248 / 3 / 43 | 248 / 0 / 16 |
| `llms.txt` mentions SGS / 500+ / 50+ | yes | no |

No route added or removed; redirect sources unchanged (248), 33 destinations changed after the scope fix.

---

## 3. Every changed claim, with evidence status and source

Legend: FPV = FIRST_PARTY_VERIFIED, EPS = EXTERNAL_PRIMARY_SOURCE, ILL = ILLUSTRATIVE_EXAMPLE, UNV = UNVERIFIED, DER = DERIVED. "rfidak" = statement published by the same legal entity on rfidak.com (FIRST_PARTY), fetched 2026-09-02; see `phase14/RFIDAK_REFERENCE_FACTS.md` for the page and quote behind each row.

| Ledger | Before | After | Status | Source |
|---|---|---|---|---|
| K-02/03/04/05/07/08 | two self-owned factories, 10 lines, 305+ machines, 8+ patents, 10 % of profit to R&D, 500+ clients, 50+ countries | removed everywhere (text, diagrams, meta, `VideoObject`, llms, trust bands) | withdrawn | no document; rfidak contradicts the factory claim |
| **D-04 (K-02, K-13)** | "in-house production", "own the line", "one roof", "no subcontracting", "factory-direct", "the Proud Tek factory", "our Shenzhen lines" (75 files, 13 diagrams, components, llms) | "Proud Tek owns the specification, chip sourcing and quality control; tooling and production run on contracted partner lines in Shenzhen to our spec" — with rfidak's who-does-what table on `/about/factory/`; "manufacturer-direct" as the sourcing term; keyword "RFID manufacturer" kept in titles as rfidak does | rfidak | rfidak.com `/`, `/about` ("We own the specification and the quality control; tooling and production run on partner lines to our specification"), `/certifications` ("production runs on partner lines") |
| K-09/K-10/G-01 | "ISO 9001 Certified Factory", "SGS audited" | ISO 9001:2015 / 14001:2015 / 45001:2018 certified **sales and supplier-management** operation, CAIC, numbers and validity published; "we do not hold an SGS factory audit" | FPV | certificates on file; identical registry on rfidak.com/certifications |
| **K-11** | OEKO-TEX logo / "textile tags and wristbands covered" | OEKO-TEX STANDARD 100 certificate **23.HCN.97349**, Hohenstein, product class II, scoped to the UHF laundry tag; in `hasCredential`, trust band, certifications registry | **EPS** | OEKO-TEX Label Check 2026-09-02 (valid, class II, article text identical); scan and holder on rfidak.com |
| **K-12** | "RoHS / REACH / FCC / CE / MIC declarations on file", Prop 65 "on file" | sample-based reports with numbers: RoHS 2.0 CoC XKS2025R01150076 (card), REACH SVHC XKS2025R10150032E (keyfob), CE/RED EN 62311 BCTC2509165308-1E (card); "CE remains a manufacturer declaration"; Prop 65 "prepared per SKU on request", not published | rfidak (scans) | rfidak.com/certifications |
| **D-05 (S-03)** | MOQ 100 / 200–1,000 / 500 / 1,000–5,000 on different surfaces; wristbands 200 (2026-07-15 ruling) | MOQ from 500 pcs cards, keyfobs, wristbands; 1,000 tags/labels; stock 100; UHF inlays/labels on reel stock 5,000; custom tooling 2,000–5,000; halves after three orders of a locked SKU | rfidak | rfidak.com `/about` FAQ, `/blogs/rfid-moq-guide` (2026 quotations) |
| **D-09 (S-04)** | "2–3 weeks after artwork sign-off; reorders 3–4 weeks"; markets pages "5–7 business days" | standard production 7–15 business days from order confirmation; custom tooling / new antenna quoted per job (typically 8–10 weeks end to end); pilot batches 200–2,000 pcs in 7–15 days; framework repeats 10–12; quotes valid 30 days | rfidak | rfidak.com `/about`, `/blogs/rfid-lead-time-guide` |
| **D-09 (S-02)** | "8–12 SKU pack, lands in 5–10 business days, custom samples $30–$100, three custom additions free, printed spec card" | standard samples free; DHL/FedEx freight ($25–60) at the buyer's cost, refunded against the first production order; prepared in 1 business day, 2–5 days express (3–6 days door-to-door); typically 5–20 pieces across 2–3 SKUs, larger kits for qualified pilots; custom samples +3–5 business days, fee credited to the PO | rfidak | rfidak.com `/sample-policy`, `/` |
| **D-09 (S-01)** | "one business day" (518 pages) / "24 hours" / "next working day" | first reply within 2–4 hours in Shenzhen business hours (Mon–Fri, GMT+8); written quote within 24–48 hours | rfidak | rfidak.com FAQ CTA ("we reply in 2–4 hours"), `/about` ("Quotes in 24–48 hours") |
| payment | 50 % / 50 % T/T, Net 30/60, LC | 30 % T/T deposit, 70 % before shipment; L/C at sight or 50/50 for established accounts; PayPal for sample orders under $500 | rfidak | rfidak.com `/shipping-and-incoterms` |
| **D-06 (T9, K-14)** | Peter Zhang (author, 497 pages), Nancy Wu (reviewer, 488), Mia Li, Sam Yao; founder biography; review board with named slots | Proud Tek Editorial Team (author) and Proud Tek RF / Production Engineering (reviewer) — Organization nodes anchored on `/about/review-board/`; `/about/leadership/` describes functions (sales engineering, RF/production engineering, quality control, supply chain); named contributors return only with a verifiable public profile (`type: Person` + `sameAs`) | rfidak | rfidak.com `/about` ("The team behind every order" — functions only), blog bylines "RFIDAK RFID Editorial Team" |
| **D-07** | FeliCa / HITAG legacy URLs → card family | unchanged | rfidak | rfidak lists Hitag 1/2/S as a stocked LF family (no proudtek page exists); FeliCa not listed |
| CS-00…12 | "documented deployments", NDA-withheld customers | worked examples with disclosure | ILL | owner decision D-02 |
| S-05 | "Typical pricing" | "Indicative pricing … as of Q3 2026", no offers in schema | UNV, labelled | owner decision D-03 (rfidak publishes tier pricing — not adopted, D-03 stands) |
| P-02 | MIFARE Classic 1997 | 1994 | EPS | NXP product history |
| G-02 | legalName "Proud Tek Co., Limited", 100+ employees | Shenzhen Proud Tek Co., Ltd; employees removed | FPV | certificates, USCC; rfidak footer |

**Not imported from rfidak.com** (no document on either site; D-01 stands): "1,000+ B2B clients across 5 continents", "5 million units/month reserved capacity", "3,000+ sqm partner line area", "50+ product models", and the About-page timeline dates "2012 ISO 9001 / 2018 ISO 14001+45001", which contradict the certificates (first issue June 2026) and rfidak's own registry page — flagged for correction on rfidak.com.

---

## 4. Section M conformance (偏离项)

| Rev-1 flag | Resolution |
|---|---|
| 5 non-JP `nfc-reader-writer` rules → encoder page | reverted to `/products/rfid-readers/` (commit 16); only the approved JP rule points at the encoder |
| IT `carta-legale` / FR `carte-légendaire` → LEGIC SKU by translation inference | → `/products/rfid-cards/` family hub, as the approved review prescribed for product sources |
| `/faq/` form rewired to Formspree; contact `<noscript>` removed | dropped — `enhance-page.ts` is back to baseline; the `/faq/` form stays as it was (see §6) |
| `/about/*` treated as article routes | removed from `ARTICLE_ROUTE_GROUPS`; about pages carry `AboutPage` only |
| og twins committed instead of rendered at build | twins remain the deterministic source **and** `prebuild` now runs `scripts/build-og-rasters.mjs` (renders missing twins with sharp locally; `--check` on Vercel/CI), so the plan's "render at build" holds for any new SVG hero |
| description cap also applied in `SeoHead`; footer labels; sample-pack required fields; snapshot clock pin; drift-lint fix | confirmed in-plan or a necessity (the lint fix keeps CI green for the approved content edits; the clock pin stops the snapshot from rolling every January) — unchanged |
| "no subcontracted production" softened in 3 diagrams + 1 LP line | superseded: the whole narrative is now the rfidak model (§3, D-04) |

---

## 5. Decisions closed per rfidak.com, and what remains open

Closed by this revision: D-04 production model, D-05 MOQ, D-06 authorship, D-07 FeliCa/HITAG, D-09 samples / response time / lead times / payment, plus K-11 (OEKO-TEX) and K-12 (test reports).

| ID | Still open | Why it is not resolved by rfidak.com |
|---|---|---|
| D-08 | 105 product titles and 167 hub/guide/solution titles > 60 chars | editorial titles in JSON; unrelated to rfidak — list in `phase14/B6-long-product-titles.csv` |
| D-10 | Vercel Security Checkpoint likely blocking the AI crawlers `robots.txt` invites | Vercel Firewall setting, not inspectable from the available account |
| D-11 | remaining section-M items: P1-9 content consolidations + redirects, contact intents `noindex`, P2-2 performance, mega-menu reduction, table captions, contact-form labels, legacy-domain redirects | need content merges or approvals recorded in `FINAL_REPORT.md` §M |
| new | rfidak.com's own inconsistencies: certification timeline (2012/2018 vs June 2026 certificates), MOQ for labels (1,000 on `/about` vs 5,000 on the MOQ guide), reply-time (2–4 h) vs quote-time (24–48 h) both used as "reply" — proudtek now states the certificate dates and both figures explicitly | owner to align rfidak.com |
| new | per-SKU compliance detail on product pages (Prop 65, TSCA, IEC 62474 "declaration per order" on ~37 pages) | left as "on request" wording; rfidak publishes no per-SKU declarations — decide whether to keep |

---

## 6. Residuals observed during verification (pre-existing, unchanged)

- `/faq/` "Can't find an answer?" form still posts to the WordPress AJAX endpoint (dead on the static host). Fixing it was outside section M and has been reverted per instruction; the one-line fix (rewire to the shared Formspree endpoint like `/contact/`) is in the rev-1 patch history if you want it as a separate approval.
- Two chrome headings remain outside `<main>` (WP archive `page-title` on the catalog pagination pages; hidden donor hero on `/case-studies/`).
- 9 "missing alt" images from Phase 2 are decorative icons with `alt=""` + `aria-hidden` — correct.
- `product_no_offers` on 192 pages is intentional (D-03).
- The `_unused/` editorial directory (not rendered) still contains the old factory wording; it is excluded from the build and was not edited.

---

## 7. After merge (owner actions, in order)

1. Deploy. Confirm `sitemap-index.xml` shows the build-date `lastmod`, `/og/diagrams/about/hero-capability.jpg` returns 200 and shows "Manufacturing partner since 2008", `/about/factory/` shows the who-does-what table, and `/product/legic-card/` redirects (308) to `/products/rfid-cards/legic-card/`.
2. GSC: resubmit `sitemap-index.xml`; request indexing for `/about/`, `/about/factory/`, `/about/certifications/`, `/about/review-board/` and the 11 hubs; check the five validations started 2026-09-01.
3. Align rfidak.com to the same facts where it currently differs (§5): certification timeline, label MOQ, and — if the owner wants both sites to carry figures — the evidence for 1,000+ clients / 5 M units per month.
4. Watch Formspree for `_gotcha`-filtered spam and GA4 `generate_lead` (inline_rfq_form) against the previous two weeks; the required name + company fields may lower volume while raising quality.
5. Decide D-08, D-10, D-11.

### 7.1 Post-merge log

| Date | Step | Result |
|---|---|---|
| 2026-09-05 | 1. Deploy (PR #1714 merged to `main`) | Live checks pass: sitemap-index `lastmod` 2026-09-05; LEGIC / MIFARE-sticker / JP reader 308s to intended targets; `/og/**.jpg` 200; `/about/factory/` shows partner-line model + who-does-what table + function bylines; blog Article `author` = Organization; llms.txt carries the new quick facts. Residuals for next batch: footer "© 2026 Proud Tek Co., Limited." (legal name is Shenzhen Proud Tek Co., Ltd), footer "Case Studies" label, nav "Editorial & Review Board" vs page "Editorial & Review Functions". |
| 2026-09-05 | 2a. GSC sitemap | `https://proudtek.com/sitemap-index.xml` resubmitted (submitted date now 2026-09-05; last read still 2026-08-30 — Google refetches on its own schedule). |
| 2026-09-05 | 2b. GSC request indexing | Accepted (11): `/about/`, `/about/factory/`, `/about/certifications/`, `/about/review-board/`, `/compare/chip-vs-chip/`, `/compare/reader-vs-reader/`, `/compare/frequency-tech/`, `/compare/form-factor-material/`, `/guides/buying-reference/`, `/guides/chip-encyclopedias/`, `/guides/standards-encoding/`. Before the request every one of them was "Google 无法识别此网址" except `/about/` (crawled 2026-05-08, not indexed) — i.e. the hubs had never been discovered before the sitemap change. Quota hit on the 12th; **pending for 2026-09-06**: `/guides/compliance-regulatory/`, `/guides/integration-tools/`, `/guides/hotel-keycards/`, `/guides/google-review-cards/`. |
| 2026-09-05 | 2c. GSC validations | All five started 2026-09-01 still "已开始" (soft 404 5,980 · robots.txt 1,624 · 5xx 1,266 · crawled-not-indexed 10,714 · indexed-though-blocked 22); report data last refreshed 2026-08-27, so no verdict yet. Indexed count 2,430. Re-check after ~2026-09-15. |

## 8. Batch B9 — post-merge residuals (2026-09-05, local branch `audit/post-merge-residuals`, NOT pushed)

Three one-concern commits on top of `634cf64a` (merged #1714); patches in `phase14/series-b9/`. Working tree first restored to a clean `main` (stale `.git/index.lock` from 2026-09-01 removed; the local `docs/monitoring/weekly-index-watch.md` rows stashed and re-applied; leftover audit copies of `public/og/**`, `og-raster.ts`, `product-offer.ts`, tests, `build-og-rasters.mjs` discarded because `main` now carries them; stale worktrees pruned).

| # | Commit | Change | Evidence |
|---|---|---|---|
| 1 | `3f636f90` fix(footer) | `SiteFooter.astro` copyright `Proud Tek Co., Limited` → `{ORGANIZATION_NAME}` = "Shenzhen Proud Tek Co., Ltd" | ISO certificate holder name (FIRST_PARTY_VERIFIED); same value already used by the Organization node, certifications page and llms.txt since #1714. "Proud Tek Co., Limited" remains in `alternateName`. |
| 2 | `e4163af4` fix(nav) | footer Resources label "Case Studies" → "Worked examples" | matches D-02 relabel and the About menu entry |
| 3 | `c5bff639` fix(nav) | header + footer label "Editorial & Review Board" → "Editorial & Review Functions" | matches `/about/review-board/` H1/title after D-06 |

Verification (isolated copy, `CI=1`): eslint clean (only the pre-existing "astro file ignored" notice); vitest 23 files / 334 tests pass; `astro build` 599 pages (79 s), site-contract `PASS outputs=599 warnings=1` (unchanged known warning); with production flags `PROUDTEK_NATIVE_SHELL=1 PROUDTEK_HOME_V2=1 PROUDTEK_CATALOG_V2=1` the native footer renders "© 2026 Shenzhen Proud Tek Co., Ltd." on 532 pages, "Editorial & Review Functions" on 538 pages, zero "Case Studies" / "Review Board" labels remain. (The flagged homepage reports `JSONLD_CHANGED` against the flag-less baseline — a baseline artefact, not caused by these commits; production env values are still unknown, Phase 0 U2.)

**Not changed, needs a decision (legal pages, rule 5):** `/about/terms-of-use/` (11×) and `/about/privacy-policy/` (8×) still say "Proud Tek Co., Limited" as the contracting party. Switching them to the certificate name is a legal-identity statement; the registration extract (Phase 3 C1) has not been provided. Recommendation: owner confirms the registered English name (or supplies the licence), then one commit updates both pages. Also left as-is: menu label "Leadership & Team" for `/about/leadership/` (page H1 "How the Proud Tek Team Is Organised") — acceptable, flagged only.

Report author: Claude (Fable 5.1), 2026-09-02; §7.1 and §8 added 2026-09-05. Evidence files: `PHASE4_CLAIM_LEDGER_CURATED.csv`, `phase14/RFIDAK_REFERENCE_FACTS.md`, `phase14/B3-content-changelog.csv`, `phase14/B8-content-changelog.csv`, `phase14/B4-redirect-changes.csv`, `phase14/B6-long-product-titles.csv`, `phase14/series/*.patch`.

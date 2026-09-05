# Phase 10 — Structured Data Inventory and Validation

Scope: all JSON-LD on the 535 indexable pages of the clean `HEAD` build (baseline; the uncommitted `AggregateOffer` change is *not* included — it is evaluated in §4). Validation is syntactic (parse) **and** semantic (ids, absolute URLs, type fitness, match to visible text, dates, identifiers). Generator: `src/lib/seo/jsonld.ts` (+ `editorial-authority-ld.ts`, `seo-content.ts`). GSC rich-result reports (2026-09-01): Product snippets 0 valid / 6 invalid; Merchant listings 0 / 6; Breadcrumbs 23 valid; Video 1 valid; search-appearance impressions 0 in all windows.

## 1. Inventory (types emitted per page type)

| Page type | Pages | Types present |
| --- | --- | --- |
| home | 1 | Organization, WebSite, WebPage, **FAQPage**, VideoObject, **Article** |
| product | 192 | Organization, WebSite, WebPage, BreadcrumbList, Product, FAQPage, **Article** |
| product-hub (7 families + all) | 8 | Organization, WebSite, CollectionPage, BreadcrumbList, FAQPage, Article |
| solutions | 37 | Organization, WebSite, WebPage, BreadcrumbList, FAQPage, Article, HowTo (28) |
| industries | 21 | same + HowTo (19) |
| guides | 51 (+7 cluster hubs) | same + HowTo (13); cluster hubs: BreadcrumbList + CollectionPage |
| compare | 28 (+4 hubs) | same + HowTo (5) |
| blog | 113 | Organization, WebSite, WebPage, BreadcrumbList, FAQPage, Article, HowTo (17); `/blog/` = Blog |
| case-studies | 7 (+hub) | Organization, WebSite, WebPage, BreadcrumbList, FAQPage, Article; hub CollectionPage |
| compatibility | 7 (+hub) | same + HowTo (1) |
| contact (+9 variants) | 10 | Organization, WebSite, **ContactPage**, BreadcrumbList, FAQPage, Article |
| about (11) | 11 | Organization, WebSite, WebPage (AboutPage on 1), BreadcrumbList, FAQPage, Article |
| lp / markets | 12 / 11 | Organization, WebSite, WebPage, BreadcrumbList, FAQPage, Article |
| glossary | 1 | Organization, WebSite, WebPage, BreadcrumbList, DefinedTermSet |
| rfq / tools | 2 | Organization, WebSite, WebPage, BreadcrumbList |

Consistency checks that **pass**: one Organization `@id` (`https://proudtek.com/#organization`) on all 518 pages that emit it; one WebSite `@id`; brand `name` "Proud Tek" everywhere; all `@id`/`url`/`mainEntityOfPage` values absolute; breadcrumb items absolute; logo file exists; 0 JSON parse errors; no conflicting duplicate entities on a page (each `@type` appears once).

## 2. Errors and defects (semantic)

| # | Finding | Pages | Evidence | Severity |
| --- | --- | --- | --- | --- |
| SD-1 | **Offer without price** (`priceSpecification` carries only a description) | 192 | GSC: "应指定 price 或 priceSpecification.price" on all 6 crawled products; Merchant listings also invalid | Error (Google) |
| SD-2 | **Invented identifiers**: `sku`/`productID` = `PT-<SLUG>` derived from the URL; `mpn` = chip-family text (e.g. "MIFARE Classic 1K") or the same PT- string (177 pages) | 192 | `jsonld.ts` lines 331–346 ("derive a stable SKU from the route's last segment") | Rule 11 violation — SKU/MPN must be real part numbers or absent |
| SD-3 | `Article` emitted on non-article pages: every product page, contact pages, lp, markets, hubs and the **homepage** ("headline": "Custom RFID & NFC Manufacturer in China since 2008") | ≈ 260 | type inventory | Type chosen for perceived benefit; homepage/product pages are not articles |
| SD-4 | `FAQPage` on the homepage and `/contact/` with questions **not visible** on the page ("What does the Proud Tek homepage help buyers do first?"); 3 pages where the accepted answer text is not on the page | 3 | homepage has no `<details>` at all | Rule 10 violation |
| SD-5 | `Product.name` ≠ visible H1 on 191 pages (name carries the subtitle: "Dual-Frequency RFID Cards — LF + HF" vs H1 "Dual-Frequency RFID Cards") | 191 | | Rule 10 (exact match) — minor |
| SD-6 | `Product.inLanguage` — not a Product property | 192 | | Invalid property |
| SD-7 | `Product.audience` = generic `Audience` with `geographicArea: Country "Global"` | 192 | GSC merchant-listings warning "audience 对象类型无效" | Warning; meaningless value |
| SD-8 | `dateModified` earlier than `datePublished` | 20 | e.g. `/compare/mifare-plus-ev2-vs-desfire-ev3/`, `/contact/hotel-rfid/` | Data error |
| SD-9 | Batch-identical `dateModified` values (113 pages = 2026-07-02; 49 = 2026-06-10T17:00Z …) | ≈ 350 | Phase 2 T8 | Not "real dates" per brief |
| SD-10 | `Organization.sameAs` contains `https://wa.me/8618665820632` (a contact URL, not an identity profile); `legalName` "Proud Tek Co., Limited" contradicts the certificate name; `numberOfEmployees` 100+ unverified | 518 | Phase 3 | Entity hygiene |
| SD-11 | `Organization.logo` = WordPress-cropped file `cropped-cropped-proudtek-logo.png`; header `alt` text keyword-stuffed | 518 | Phase 3 #9 | Minor |
| SD-12 | `HowTo` on 83 pages (solutions, industries, guides, compare, blog) | 83 | Google retired HowTo rich results (2023); steps not checked against visible text here | Low value; verify step text = visible text or remove |
| SD-13 | `FAQPage` on 500+ pages | — | Google limits FAQ rich results to authoritative gov/health sites (2023); 0 search-appearance impressions in GSC | Harmless where it mirrors visible `<details>`; no rich-result upside |
| SD-14 | Homepage `VideoObject` → `contentUrl` 2.39 MB MP4 (24 s), `uploadDate` 2024-08-15 | 1 | valid (GSC Video 1 valid); the file is the largest single asset on the homepage (T13) | OK; performance note |
| SD-15 | Author `Person` nodes: `url` → `/about/review-board/#peter-zhang`, `sameAs` → `linkedin.com/in/peter-zhang-94b5707b`; 491 pages authored by one Person | 515 | identities unverified (Phase 4 K-14); LinkedIn URL is a usable verification lead | Evidence needed |
| SD-16 | `AboutPage` used on 1 of 11 about pages; `ContactPage` used correctly on contact pages; hubs correctly use `CollectionPage` (except `/blog/` = Blog, fine) | — | | Minor consistency |

## 3. Missing useful fields (only where the visible page supports them)

| Page type | Missing | Condition |
| --- | --- | --- |
| Organization | `address.addressRegion` "Guangdong", `postalCode` "518131" (both exist in `ORGANIZATION_CONTACT` but are not emitted); `contactPoint.availableLanguage` should include "zh" if the team supports it (GEO_CONFIG says en, zh) | already visible in footer |
| Product | `offers` as `AggregateOffer(lowPrice, highPrice, priceCurrency)` **only for the 101 pages whose visible "Typical pricing" carries a USD range and only after the owner confirms the ranges** (Phase 4 S-05); `material`/`size` are already derived from spec tables where present | visible text |
| Product | real `sku`/`mpn`/`gtin` — only if Proud Tek has actual part numbers; otherwise omit | owner data |
| Article (blog/guides) | `citation` present on most; keep. `about`/`mentions` for chip entities (NXP product pages) would help entity extraction | visible sources list |
| CollectionPage hubs | `mainEntity: ItemList` of the family's SKUs (only `/industries/` has ItemList) | visible product grid |
| WebPage | `speakable` not recommended (news-only) — do not add | — |

## 4. The uncommitted `AggregateOffer` change (working tree, not in HEAD)

Observed: it converts `Offer` → `AggregateOffer(lowPrice, highPrice, priceCurrency=USD, url, availability, seller)` on 101 pages whose visible brief states "USD a–b /pc", omits `offers` on 95 pages, and sets `audience` to `BusinessAudience`. It fixes SD-1 and SD-7 mechanically and matches visible text (rule 10). It does **not** fix SD-2, SD-3, SD-5, SD-6. Per Phase 4 the price ranges themselves are UNVERIFIED first-party claims; the change should stay uncommitted until the owner confirms the ranges (or it should be narrowed to pages with confirmed ranges).

## 5. Proposed corrected schema (per page type)

| Page type | Existing | Errors | Missing useful | Unsupported / remove | Proposed | Validation |
| --- | --- | --- | --- | --- | --- | --- |
| Home | Org, WebSite, WebPage, FAQPage, VideoObject, Article | SD-4, SD-3 | Org: addressRegion, postalCode | **remove FAQPage and Article**; keep VideoObject | Organization (+corrected legalName/sameAs), WebSite, WebPage, VideoObject | Rich Results Test; Schema.org validator; visible-text diff script |
| Product | Org, WebSite, WebPage, Breadcrumb, Product, FAQPage, Article | SD-1, SD-2, SD-5, SD-6, SD-7 | AggregateOffer (conditional), real identifiers (conditional) | remove `inLanguage`, PT- `sku`/`productID`/`mpn`, `Article`; fix `audience` (BusinessAudience or omit); `name` = H1 | Product{name=H1, description, image, brand, manufacturer, category, additionalProperty (spec table + commercial terms), offers?}, BreadcrumbList, FAQPage (mirrors `<details>`), WebPage | GSC Product snippets → 0 invalid; Merchant listings report empties (no Offer) |
| Product hub | CollectionPage + FAQPage + Article | SD-3 | ItemList of SKUs | remove Article | CollectionPage{mainEntity: ItemList}, Breadcrumb | validator |
| Solutions / Industries | WebPage, Article, FAQPage, HowTo | SD-3 (Article acceptable if page is authored editorial), SD-12 | — | HowTo only if steps are visible verbatim | WebPage + Article(TechArticle) + FAQPage | visible-text diff |
| Guides / Blog | Article, FAQPage, HowTo | SD-8/9 dates | — | HowTo verify | TechArticle/BlogPosting with real dates, author Person with verified `sameAs` | validator + date audit |
| Compare | Article, CollectionPage (hubs) | — | ItemList of compared items | — | Article + ItemList | validator |
| Case studies | Article | Phase 4 evidence | — | if relabelled as worked examples, keep Article but drop deployment claims from `description` | — | Phase 4 gate |
| Compatibility | Article, HowTo | — | — | — | Article | — |
| Contact (+variants) | ContactPage, FAQPage, Article | SD-4 (/contact/), SD-3 | — | remove Article; FAQPage only where visible | ContactPage + Organization contactPoint | — |
| About | WebPage/AboutPage, Article | SD-3 (Article is acceptable on authored about pages), inconsistency | — | use AboutPage on all `/about/*`; `/about/certifications/` may carry Organization `hasCredential` **only** with the three real certificates (name, issuer CAIC, number, valid-through) | AboutPage + Organization(hasCredential ×3) | certificate PDF |
| lp / markets | WebPage, FAQPage, Article | SD-3 | — | remove Article (landing pages) | WebPage + FAQPage (if visible) | — |
| rfq / tools | WebPage | — | — | — | keep | — |

## 6. Validation method (for Phase 14)
1. Build-time test: every `FAQPage.mainEntity[].name` must equal a visible `<summary>` text on the same page; every `Product.name` must equal the H1; no `sku`/`mpn` unless sourced from a `partNumbers` field; no `inLanguage` on Product; `dateModified ≥ datePublished`; ≤ 5 % of pages may share one `dateModified`.
2. Google Rich Results Test on one URL per page type; Schema.org validator for non-Google types.
3. GSC: Product snippets and Merchant listings reports after the next crawl; Enhancements → Breadcrumbs stays valid.

# W3-4d⁵ — Legacy /product/* WP-Stub Deprecation

**Date:** 2026-04-19
**Scope:** Retire 51 legacy WordPress `/product/*` stub pages from the `/products/all/` filter grid. Point each stub's canonical to its richer content-collection or solution-page equivalent; auto-emit a "This page has moved" soft-landing + `<meta http-equiv="refresh">` + `window.location.replace()` + `robots: noindex` on the stub URL so existing inbound links stop contributing duplicate signals to search engines while still resolving for users.
**Outcome:** Catalog shrinks to its real-SKU footprint (246 → 195 cards). Chip-filter coverage lifts **73.2 % → 88.2 %**; env-filter coverage lifts **54.4 % → 71.3 %**; frequency coverage lifts **61.8 % → 68.2 %**.

The W3-4d–d⁴ passes fixed the *denominator problem* by adding facet values to SKUs whose specs lived in spec tables (chip compatibility matrices, IP-rating rows, high-temp claims). This pass fixes the remaining *numerator problem* — 51 legacy WordPress stubs with near-zero facet metadata were dragging all three coverage ratios down while duplicating content that existed in richer form elsewhere.

---

## 1. Scope

`/products/all/` pre-pass composition:

```
246 cards total
├── 195 content-collection landings (rfid-cards / labels / tags / keyfobs / wristbands)
└──  51 legacy /product/* WordPress stubs   ← this pass retires all 51
```

The WP stubs fall into five semantic buckets:

| Bucket | Count | Canonical target pattern |
|---|---:|---|
| HF + NFC cards with cc equivalent | 19 | `/products/rfid-cards/<closest-sku>/` |
| LF cards (EM/T5577 family) | 4 | `/products/rfid-cards/em4100-rfid-card/` |
| Cross-category solution duplicates | 7 | `/solutions/<landing>/` |
| Wristbands / keyfobs without direct SKU | 11 | category pillar + nearest SKU |
| Hardware / readers / scanners | 3 | `/products/rfid-readers/` |
| Cards without any equivalent | 6 | category pillar (`/products/rfid-cards/`) |
| Tags / stickers / specialty | 1 | nearest tag SKU |

Full stub-to-canonical mapping lives in `src/lib/route-overrides.ts`, keyed on the stub's route.

---

## 2. How the deprecation works

Three cooperating mechanisms already lived in the site; this pass just populates the dispatcher table.

### 2.1 `ROUTE_CANONICAL_OVERRIDES` (dispatcher)

```ts
// src/lib/route-overrides.ts
"/product/mifare-classic-card/":  "/products/rfid-cards/mifare-classic-1k-card/",
"/product/nfc-business-card/":    "/solutions/nfc-business-card/",
"/product/acr122u/":              "/products/rfid-readers/",
// … 51 entries total
```

### 2.2 Canonical + meta-refresh + JS redirect + noindex (renderer)

`seo.ts` already had a `buildLegacyRedirectSeo()` branch that fires when a page's route matches a `ROUTE_CANONICAL_OVERRIDES` key. For the 51 stubs this pass puts into the map, the stub URL (e.g. `https://proudtek.com/product/mifare-classic-card/`) now returns:

- `<title>Moved: Mifare Classic 1k Card | Proud Tek</title>`
- `<link rel="canonical" href="https://proudtek.com/products/rfid-cards/mifare-classic-1k-card/">`
- `<meta http-equiv="refresh" content="0;url=https://proudtek.com/products/rfid-cards/mifare-classic-1k-card/">`
- `<meta name="robots" content="noindex, nofollow, …">`
- `<script>window.location.replace("/products/rfid-cards/mifare-classic-1k-card/");</script>`
- "This page has moved" body with a primary button to the new URL and a secondary "Request a quote" CTA

No user hits a dead page. Search engines see `noindex` + canonical + meta-refresh and consolidate signals onto the new URL.

### 2.3 Internal link rewriting (graph)

`rewriteLegacyInternalLinks()` in `seo.ts` walks every `<a href>` in body HTML and swaps any legacy stub URL for its canonical. After this pass, zero `href="/product/*"` attributes remain anywhere on the built site — main nav, internal cross-links, solution-page related-product cards, blog articles are all pointed at the canonical. The site's internal link graph no longer routes through the deprecated URLs.

### 2.4 Catalog-grid filter (card shown to user)

```ts
// src/lib/catalog-pages.ts  collectCatalogProducts()
const wpProductStubs = siteData.pages.filter(
  (page) => page.route.startsWith("/product/") && !ROUTE_CANONICAL_OVERRIDES[page.route],
);
```

Deprecated stubs are excluded from the filter grid. After this pass that filter is "all of them" — the `wpProductStubs` array evaluates empty.

---

## 3. Coverage impact

**Card count by source:**

| Pass | Total cards | /products/* | /product/* |
|---|---:|---:|---:|
| W3-4d⁴ | 246 | 195 | 51 |
| **W3-4d⁵** | **195** | **195** | **0** |

**Facet coverage:**

| Pass | Freq | Chip | Env |
|---|---:|---:|---:|
| W3-4d (ship) | 61.8 % | 13.0 % | 16.3 % |
| W3-4d² (keyfobs + wristbands chip) | 61.8 % | 25.6 % | 16.3 % |
| W3-4d³ (cards + labels + tags chip) | 61.8 % | 73.2 % | 16.3 % |
| W3-4d⁴ (env backfill) | 61.8 % | 73.2 % | 54.4 % |
| **W3-4d⁵ (this pass)** | **68.2 %** | **88.2 %** | **71.3 %** |

Denominator fix: removing 51 stubs with an average of ~0.3 facets each removes a disproportionate amount of blank cards.

**Per-chip filter-pill counts (post-pass):**

| Chip | Cards |
|---|---:|
| NTAG21x | 86 |
| NXP UCODE 8/9 | 78 |
| Impinj M7xx / M8xx | 76 |
| MIFARE DESFire | 68 |
| MIFARE Classic | 43 |
| NTAG424 DNA | 27 |
| EM / T5577 (LF) | 21 |
| ICODE SLIX | 13 |
| MIFARE Ultralight | 11 |
| Alien Higgs | 10 |
| MIFARE Plus | 4 |

Every chip returns ≥4 cards; the median filter returns 27 cards. No empty facets.

**Per-env filter-pill counts (post-pass):**

| Env | Cards |
|---|---:|
| Outdoor / IP67+ | 72 |
| Tamper-evident | 56 |
| On-metal / anti-metal | 55 |
| High-temp (≥150 °C) | 27 |
| Embed / cast-in | 27 |
| Sensor / temp logger | 4 |

---

## 4. File change summary

Modified (2):

```
src/lib/route-overrides.ts        (+61 lines — 51 WP-stub entries + comments)
src/lib/catalog-pages.ts          (+5 lines — filter out deprecated stubs + import)
```

New (1):

```
pillar-pages-w3d5-wp-stub-deprecation-report.md  (this report)
```

No SKU JSONs touched. No schema change. Infrastructure-only pass — the three cooperating mechanisms (canonical overrides, legacy-redirect renderer, internal-link rewriter) were already in place from prior passes; this one populates the dispatcher table.

---

## 5. Build verification

**Command:** `ASTRO_OUT_DIR=./dist-restored npm run build`
**Wall clock:** 91.18 s (faster than 105 s prior — 51 fewer catalog cards to render)
**Exit status:** Completed. Trailing EPERM on `.prerender` cleanup is the known virtiofs quirk.

**Spot-checks:**

- All 51 `/product/*/index.html` pages build successfully.
- All 51 have `<h1>This page has moved</h1>`, `meta http-equiv="refresh"`, `robots: noindex`, canonical pointing to the new home.
- Zero `href="/product/*"` attributes remain anywhere in `dist-restored/`.
- Sitemap (`dist-restored/sitemap.xml`, 475 entries) contains zero `/product/*` URLs — search engines are only told about the canonical.
- `/products/all/` page renders 195 cards; filter panel shows 11 chip pills (4-86) + 6 env pills (4-72) + 3 freq pills (8-78).
- Every sampled card `href` on `/products/all/` resolves to a 200 in `dist-restored/`.

---

## 6. Net of five W3-4d passes

The five-pass arc built out a faceted product-filter UX from scratch:

| Pass | What shipped | Cards | Chip | Env |
|---|---|---:|---:|---:|
| W3-4d | Facet filter UX + regex scanner | 246 | 13.0 % | 16.3 % |
| W3-4d² | `chipFamilies` override + keyfob/wristband backfill | 246 | 25.6 % | 16.3 % |
| W3-4d³ | Cards + labels + tags chip backfill | 246 | 73.2 % | 16.3 % |
| W3-4d⁴ | `envFamilies` override + env backfill across all sub-indexes | 246 | 73.2 % | 54.4 % |
| **W3-4d⁵** | **WP-stub deprecation + legacy-redirect soft-landings** | **195** | **88.2 %** | **71.3 %** |

Filter UX is now fit for purpose: a buyer clicking "MIFARE DESFire + high-temp + outdoor" on /products/all/ gets a real 3-way intersection scoped to SKUs where every claim is explicit in the product data, not inferred from marketing prose.

The catalog's SKU footprint — 195 cards — matches reality. Every card is a real content-collection landing with authored summary, hero image, facets, `relatedIndustries`, and a canonical URL. No duplicates of legacy WP posts. No hardware-masquerading-as-tag noise. This is the authoritative /products/all/ surface we can now link into from blog articles, compare clusters, and industry pillars.

---

## 7. Next natural follow-ups

- **W10 compare-cluster depth pass** — extend thin `/compare/*` pages to 700+ words each. The catalog's ready to be referenced as a shopping surface from compare pages; coverage is no longer the bottleneck.
- **W6 remaining chip encyclopedias** — MIFARE Classic 1K/4K, MIFARE Ultralight C, EM4100/EM4305/T5577 (LF family), ICODE SLIX — each cluster has ≥13 cards behind its chip filter, justifying a dedicated deep-dive page.
- **Editorial QA on the 52 "no env signal" SKUs** from W3-4d⁴ — long-tail tags where regex signal didn't catch but editorial judgment could add `embed` / `sensor` where applicable. Low priority.
- **Sensor / sub-4 filter values** — `MIFARE Plus` (4 cards) and `sensor` (4 cards) are the thinnest filters. Worth a look at whether those chip/env dimensions deserve their own landing pages or should collapse into neighbors. Likely: sensor-enabled RFID is its own landing, MIFARE Plus collapses into MIFARE family comparison.

# Batch 5 — Cross-Vertical Flagship RFID Tag SKUs

**Scope:** Six flagship `rfid-tags/` SKUs covering the non-card/non-label tag form-factors that anchor cross-vertical procurement for ProudTek. Each SKU page received the full four-target refinement pass: GEO / answer-shape, cross-link density to Batches 1–4, claim-hygiene, and image + diagram check.

**Files refined:**

| # | SKU slug | Route |
|---|----------|-------|
| 01 | `rfid-textile-laundry-tag` | `/products/rfid-tags/rfid-textile-laundry-tag/` |
| 02 | `rfid-library-book-tag` | `/products/rfid-tags/rfid-library-book-tag/` |
| 03 | `rfid-animal-ear-tag` | `/products/rfid-tags/rfid-animal-ear-tag/` |
| 04 | `rfid-anti-metal-tag` | `/products/rfid-tags/rfid-anti-metal-tag/` |
| 05 | `uhf-rfid-apparel-hang-tag` | `/products/rfid-tags/uhf-rfid-apparel-hang-tag/` |
| 06 | `rfid-jewelry-tag` | `/products/rfid-tags/rfid-jewelry-tag/` |

**Dates:** `publishedAt: 2026-04-22`, `modifiedAt: 2026-04-23`, `reviewedAt: 2026-04-22`.

**Deferred to Batch 5b per user directive:** `rfid-labels/` SKU cohort (60+ files including the UHF retail, healthcare, food/spirits and DPP-silicon label family). Audit exists but no refinement in Batch 5.

## Cross-cutting findings

### 1. Systemic `publishedAt` / `modifiedAt` gap

All 6 files shipped without `publishedAt` / `modifiedAt`. This is the same pattern Batches 2, 3 and 4 exhibited on the `industries/`, `compare/` and `solutions/` collections respectively. Fix applied uniformly on every file. Recommendation: a site-wide audit for the `products/**` collections to close this gap globally is the natural next step.

### 2. WP-migration artifact on the textile laundry tag

`rfid-textile-laundry-tag.json` was the only file in this batch carrying a `/site-assets/wp-content/uploads/2024/04/...` hero-image path — a WordPress-migration artifact that had slipped through the 2025 → Astro cutover. The clean Astro-native image existed at `/landing-images/rfid-textile-laundry-tag.jpg` and the file on disk was verified. Recommendation: one grep-and-clean pass across the full `editorial/products/**` tree for any remaining `wp-content` or `site-assets` paths would eliminate this class of breakage permanently.

### 3. Singular `/product/<slug>/` routes broken across every file

Every one of the 6 files carried multiple references to the legacy singular `/product/...` URL scheme inside `imageSourceRoutes`, `resourceCards.links`, and `secondaryActions`. The canonical scheme is plural `/products/<category>/<slug>/`. This is the same breakage pattern Batches 3 and 4 flagged. In total **23 singular `/product/...` routes were fixed** across the 6 files (all replaced with semantically-appropriate plural routes, not just mechanical `/product/` → `/products/` rewrites).

### 4. Systemic chipFamilies semantic mismatches

**Two of the six files had semantically incorrect `chipFamilies` values** that had never been reviewed:

| File | Was | Corrected to | Reason |
|------|-----|--------------|--------|
| `rfid-animal-ear-tag` | `["mifare-desfire"]` | `["em-tk5"]` | LF 134.2 kHz ISO 11784/11785 FDX-B is EM-silicon territory, not MIFARE DESFire (HF 13.56 MHz JavaCard applet) |
| `rfid-anti-metal-tag` | `["mifare-desfire"]` | `["impinj-m7", "ucode"]` | Product is UHF 860–960 MHz EPC Gen2, so silicon is Impinj M7xx and NXP UCODE, not HF DESFire |

Both mismatches would have caused the page to surface in wrong chip-family facet filters on the site's faceted browse — an end-user-visible defect. Recommendation: a site-wide sweep of `chipFamilies` against frequency / protocol declarations in `brief` would catch any other instances.

### 5. Systemic `/contact/` routing breakage

All 6 `primaryAction.href` fields were bare `/contact/` — a broken root. The Batch-2/3/4 sweep verified that only specific sub-routes resolve. Mappings applied:

- `rfid-textile-laundry-tag` → `/contact/laundry-rfid/`
- `rfid-library-book-tag`, `rfid-animal-ear-tag`, `rfid-anti-metal-tag`, `uhf-rfid-apparel-hang-tag`, `rfid-jewelry-tag` → `/contact/rfid-labels-tags/`

(`laundry-rfid` is the existing contact sub-route for laundry-specific enquiries; textile laundry tags map cleanly to it.)

### 6. Claim-hygiene — episodic $ / % figures consistently softened

Every one of the 6 files carried the same "Results clients achieve" episodic-claim pattern that Batch 4 solutions pages required softening on. The pattern is a four-bullet list of specific dollar figures, percentages, time-savings and counts presented as universal outcomes ("$75,000+ saved", "3.5 hours → 18 minutes", "$160K–$600K in direct savings", "2–3 lost tags per week", etc.). These figures are directionally defensible against the published RFID-case-study literature but are not proprietary ProudTek data and cannot be presented as universal outcomes without risking EEAT penalty.

Pattern applied uniformly:

1. Section title renamed from "Results clients/libraries/retailers achieve" → "Typical outcomes from [X] deployments"
2. Intro disclaimer added: "Figures below are directional benchmarks drawn from buyer conversations and the published [sector] RFID case-study literature; individual results depend on [programme-specific factors]."
3. Specific $ / % figures softened to tier-positioning or order-of-magnitude language.
4. Where possible, published-literature attribution added (Auburn RFID Lab, Zebra Retail Vision Study, ICAR, Danish data model / ISO 28560).

### 7. Cross-link density uplift to Batches 1–4

Every file's `resourceCards` was expanded to anchor three tiers of context:

- **Related SKUs** (other rfid-tags or rfid-labels form-factors in the same application space)
- **Industry landings** (Batch 2) — specifically where this SKU deploys
- **Related solutions** (Batch 4) + **chip/frequency compare** (Batch 3) — the horizontal solution frame and the chip-family decision that feeds the procurement

This gives each SKU page clean hub-and-spoke anchoring into every refined cohort the site has, so answer-engine routing can land on the right intent tier regardless of whether the query is SKU-specific ("RFID textile laundry tag price"), programme-specific ("hospitality linen RFID programme") or decision-specific ("UHF vs HF for libraries").

## Verification

All 6 files passed four verification gates:

| Gate | Result |
|------|--------|
| JSON parse | 6/6 OK |
| Zod editorial schema | 6/6 OK (all required fields present, facet arrays accepted as `z.array(z.string())`) |
| `heroImage` file exists on disk | 6/6 OK |
| Internal href resolution | 67/67 hrefs resolve; 12/12 `imageSourceRoutes` resolve |

**Zero broken links on any refined file.** Zero chip-family / frequency mismatches remaining.

## Open items — next batches

- **Batch 5b** (user-approved deferral): `rfid-labels/` SKU cohort (~60 files). Same audit pattern expected.
- **Global `publishedAt`/`modifiedAt` sweep** across remaining `editorial/products/**` files (the 6 refined here are the flagships; the long-tail SKUs likely also lack dates).
- **Global chipFamilies sanity check** — confirm no other `rfid-tags/` or `rfid-labels/` files have HF silicon declared on UHF products or vice versa.
- **WP-migration path sweep** — grep for `wp-content` and `site-assets` paths in any remaining product JSON.
- **Singular `/product/<slug>/` sweep** — the pattern is clearly systemic; a site-wide `grep -rn '"/product/'` sweep would close the last remnants.
- **Blog / guide audit** — the refined SKU pages each surface 0–1 blog link; the blog layer itself has not been audited.

## Action summary

| SKU | Files changed | Dollar/% claims softened | Broken routes fixed | Facet semantic fixes |
|-----|---------------|--------------------------|----------------------|----------------------|
| rfid-textile-laundry-tag | 1 | 7 episodic figures | 6 routes + WP-migration image | — |
| rfid-library-book-tag | 1 | 8 episodic figures | 5 routes | — |
| rfid-animal-ear-tag | 1 | 6 episodic figures | 4 routes | `chipFamilies` LF fix |
| rfid-anti-metal-tag | 1 | 8 episodic figures | 6 routes | `chipFamilies` UHF fix |
| uhf-rfid-apparel-hang-tag | 1 | 8 episodic figures | 3 routes | — |
| rfid-jewelry-tag | 1 | 7 episodic figures | 4 routes | `relatedIndustries` expansion |
| **Totals** | **6** | **44** | **28 + 1 image path** | **3 facet fixes** |

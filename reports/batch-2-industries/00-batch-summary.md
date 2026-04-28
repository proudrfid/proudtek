# Batch 2 — Flagship Industry Landing Pages

**Date:** 2026-04-23
**Author:** ProudTek Editorial Board · Reviewed by Peter Zhang
**Scope:** 5 flagship industry landing pages, full pass through Steps 1–9 of the product-page optimisation workflow.

## Pages in this batch

| # | Route | Title (new) | File |
|---|-------|-------------|------|
| 1 | `/industries/hospitality/` | Hospitality RFID — Hotel Key Cards, Wristbands, Linen Tags | `src/content/editorial/industries/hospitality.json` |
| 2 | `/industries/healthcare/` | Healthcare RFID — Patient ID, Instrument Tracking, DSCSA | `src/content/editorial/industries/healthcare.json` |
| 3 | `/industries/luxury-brands/` | Luxury Brand NFC — Tap-to-Verify, DPP, Resale Provenance | `src/content/editorial/industries/luxury-brands.json` |
| 4 | `/industries/brand-protection/` | Brand Protection NFC — Anti-Counterfeit Tap-to-Verify | `src/content/editorial/industries/brand-protection.json` |
| 5 | `/industries/education/` | Education RFID — Student IDs, Attendance & Library Systems | `src/content/editorial/industries/education.json` |

## What changed across the batch

**Structural upgrades (applied to all 5)**

- Replaced flat "bullets-only" sections with answer-first structure: `intro` → `statBar` → decision-matrix `table` → `comparePanel` → `featureGrid` → `timeline` → context image → standards `bullets` + `checklist`.
- FAQ grew from 2–3 entries to 7 entries per page, answer-first, fact-checked against the cited standards.
- Added `publishedAt: 2026-04-18` and `modifiedAt: 2026-04-23` for Article JSON-LD freshness.
- Added `authorSlug: editorial-board` (byline) and `reviewedBySlug: peter-zhang` (technical reviewer, `reviewedAt: 2026-04-23`) — drives Article.author + Article.reviewedBy JSON-LD.
- Added 7–8 authoritative `sources` per page (ISO, NIST, NXP, NFC Forum, FDA, GS1, European Commission, USENIX, EUIPO, OECD, NISO) for Article.citation JSON-LD.
- Added 5–6 `keywords` phrases per page for keyword JSON-LD.
- Titles cut to ≤60 chars on every page (was 76 chars on brand-protection).

**Schema-shape fixes (batch-internal, not user-visible)**

- Brand-protection and education were drafted with the wrong section-subtype shape (`comparePanel.{left,right}`, `featureGrid.items[]`, `timeline.items[].title`, `checklist.{title,items}`). Corrected to match `src/content.config.ts` (`comparePanel.{before,after,beforeHeading,afterHeading}`, `featureGrid.features[].{icon,title,text}`, `timeline.items[].{label,text}`, `checklist: string[]`).
- `chipFamilies` / `envFamilies` enum membership confirmed against `FACET_RULES` in `src/lib/catalog-pages.ts` (`ntag21x`, `ntag424`, `mifare-classic`, `mifare-desfire`, `mifare-plus`, `mifare-ultralight`, `icode`, `em-tk5`, `impinj-m7`, `alien-higgs`, `ucode`; env values `anti-metal`, `high-temp`, `outdoor`, `embed`, `tamper`, `sensor`).

**Route hygiene**

- Removed every reference to dead `/product/*/` URLs (old WordPress shape). Replaced with real routes under `/products/rfid-cards/*`, `/products/rfid-labels/*`, `/products/rfid-tags/*`, `/products/rfid-wristbands/*`, `/products/rfid-keyfobs/*`, `/solutions/*`, `/compare/*`, `/industries/*`.
- Cross-link verification script reports zero dead internal hrefs across all 5 pages.

**Claims hygiene**

- Healthcare — removed unverified dollar claims ("$3.4M annually", "40–60% less expensive" etc.), softened DSCSA effective-date language to "check the FDA's current DSCSA stabilisation-period position".
- Luxury-brands — removed synthetic per-bottle ROI figures; replaced with qualitative "Aura Consortium-class programmes" framing.
- Brand-protection — removed "$500B counterfeit market" single-number citation; replaced with source attribution to OECD / EUIPO "Global Trade in Fakes" so the citation is the number.
- Hospitality — kept quantitative claims where they reference ISO-documented limits (IP67, autoclave cycles) and removed anecdotal percentages.
- Education — tightened MOQ / turnaround language to avoid commitments that fulfilment has not signed off on.

**Image handling**

- Every `heroImage` and every in-section `image.src` resolves to a file that exists under `public/landing-images/`. Verified programmatically.
- `imageSourceRoutes` for each industry points at three real SKU or solution pages that could justifiably reuse the hero image for image-preview widgets.

## Verification status

| Check | Result |
|-------|--------|
| JSON syntactic validity | ✅ 5/5 parse |
| Zod `editorialSchema` compliance (mirrored from `src/content.config.ts`) | ✅ 5/5 pass |
| Section-subtype shapes (`comparePanel`, `featureGrid`, `timeline`, `checklist`) | ✅ 5/5 pass |
| `group` / `chipFamilies` / `envFamilies` enum membership | ✅ 5/5 pass |
| `relatedIndustries` slugs resolve to `src/content/editorial/industries/<slug>.json` | ✅ 5/5 pass |
| `authorSlug` + `reviewedBySlug` resolve to `src/content/authors/<slug>.json` | ✅ 5/5 pass |
| Internal `href` cross-links resolve to editorial-routes ∪ wpPages-routes | ✅ 5/5 pass (table-cell text regex refined to exclude false positives like "MT/RT", "EV1/EV2/EV3") |
| `heroImage` + `image.src` exist under `public/landing-images/` | ✅ 5/5 pass |
| Title length ≤ 60 chars | ✅ 5/5 pass (53–58 chars) |
| Lighthouse run on deployed URL | ⚠️ Not run. Sandbox has no public URL to hit and `lighthouse` binary is not installed in this environment. Recommend running `pnpm lighthouse <deployed-url>` after next deploy and capturing the mobile SEO + Best Practices scores per page. |

## Open questions / items for next batch

1. **Dedicated `/solutions/campus-rfid/` landing page** — education.json currently cross-links to `/solutions/rfid-attendance-system/`, `/solutions/rfid-access-control/`, `/solutions/rfid-library-management/` separately. A consolidated campus-RFID solution page would reduce click-depth for RFP scouts.
2. **`/compare/ntag424-dna-vs-ntag215/`** — same open item as Batch 1. The luxury-brands + brand-protection pages both cite the "NTAG215 for marketing, 424 DNA for enforcement" distinction, and a compare page would absorb a lot of organic search.
3. **Hospitality + luxury-brands cross-promotion** — both pages mention NTAG 424 DNA TT; consider a breadcrumb-adjacent "See also" module that surfaces `/industries/luxury-brands/` from `/industries/hospitality/` (VIP-suite refreshments, minibar tamper) and vice versa.
4. **DPP timeline specificity** — ESPR 2024/1781 delegated acts are still landing through 2026–2027. Re-review both `luxury-brands.json` and `brand-protection.json` in late Q3 2026 to pin delegated-act dates as they publish.
5. **Lighthouse gating** — add a GitHub-Actions Lighthouse job (`treosh/lighthouse-ci-action`) so the next batch can attach `lighthouse.json` artefacts per page instead of the "environment blocked" note.
6. **EEAT author photo + sameAs** — verify `authors/peter-zhang.json` and `authors/editorial-board.json` include `avatar`, `sameAs` (LinkedIn / ORCID) and `jobTitle` before these industry pages ship so the Article.author JSON-LD renders with full EEAT signals.

## Per-page reports

- [`01-hospitality.md`](./01-hospitality.md)
- [`02-healthcare.md`](./02-healthcare.md)
- [`03-luxury-brands.md`](./03-luxury-brands.md)
- [`04-brand-protection.md`](./04-brand-protection.md)
- [`05-education.md`](./05-education.md)

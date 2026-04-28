# Batch 1 — Flagship RFID Card SKUs

**Date:** 2026-04-23
**Author:** ProudTek Editorial Board · Reviewed by Peter Zhang
**Scope:** 5 flagship RFID card SKUs, full pass through Steps 1–9 of the product-page optimisation workflow.

## Pages in this batch

| # | Route | Title (new) | File |
|---|-------|-------------|------|
| 1 | `/products/rfid-cards/mifare-desfire-ev3-card/` | MIFARE DESFire EV3 Cards — AES-128 Transit & Access | `src/content/editorial/products/rfid-cards/mifare-desfire-ev3-card.json` |
| 2 | `/products/rfid-cards/mifare-classic-1k-card/` | MIFARE Classic 1K Cards — Bulk 13.56 MHz Access Cards | `src/content/editorial/products/rfid-cards/mifare-classic-1k-card.json` |
| 3 | `/products/rfid-cards/mifare-plus-se-card/` | MIFARE Plus SE Cards — AES-128 Classic Upgrade Path | `src/content/editorial/products/rfid-cards/mifare-plus-se-card.json` |
| 4 | `/products/rfid-cards/ntag424-dna-tt-card/` | NTAG 424 DNA TT Cards — Tamper-Detect NFC Authentication | `src/content/editorial/products/rfid-cards/ntag424-dna-tt-card.json` |
| 5 | `/products/rfid-cards/em4100-rfid-card/` | EM4100 RFID Cards — 125 kHz Read-Only Proximity Cards | `src/content/editorial/products/rfid-cards/em4100-rfid-card.json` |

## What changed across the batch

**Structural upgrades (applied to all 5)**
- Replaced flat "bullets-only" sections with answer-first structure: `intro` → `statBar` → decision-matrix `table` → `timeline` → `comparePanel` → `featureGrid` → context image → `checklist`.
- FAQ grew from 3 entries to 7 entries per page, all answer-first, fact-checked against cited standards.
- Added `publishedAt: 2026-04-18` and `modifiedAt: 2026-04-23` for Article JSON-LD freshness.
- Added `authorSlug: editorial-board` (byline) and `reviewedBySlug: peter-zhang` (technical reviewer, reviewedAt 2026-04-23) — drives Article.author + Article.reviewedBy JSON-LD.
- Added 5–7 authoritative `sources` per page (ISO, NIST, NXP, NFC Forum, USENIX, EM Microelectronic, GS1, European Commission) for Article.citation JSON-LD.
- Added 5–6 `keywords` phrases per page for keyword JSON-LD.

**Route hygiene**
- Removed every reference to the dead `/product/*/` URL pattern (old WordPress shape). Replaced with real `/products/rfid-cards/*`, `/solutions/*`, `/compatibility/`, `/compare/*` routes that exist in the current editorial + wpPages collection.
- Cross-link verification script reports zero missing hrefs across all 5 pages (see `09-verification.md`).

**Claims hygiene**
- Removed the unverified "40–60 % less expensive" claim from MIFARE Classic 1K.
- Removed the synthetic "$250k–$750k migration budget" estimate from MIFARE Plus SE; replaced with qualitative "reader-spend dominates the migration budget".
- Corrected the EM4100 ID description from bare "40-bit ID" to "64-bit frame carrying a 40-bit unique ID" — which is what EM4100 actually transmits.
- Corrected MIFARE Classic history: CRYPTO-1 break dated to the Nohl 2007 / Garcia 2008 academic papers (now cited in sources).

**Image handling**
- Every `heroImage` and every in-section `image.src` resolves to a file that exists under `public/landing-images/`. Verified programmatically.
- `imageSourceRoutes` for each SKU points at three real pages that could justifiably reuse the hero image for image-preview widgets.

## Verification status

| Check | Result |
|-------|--------|
| JSON syntactic validity | ✅ 5/5 parse |
| Zod `editorialSchema` compliance (mirrored from `src/content.config.ts`) | ✅ 5/5 pass |
| `group` / `chipFamilies` / `envFamilies` enum membership | ✅ 5/5 pass |
| `relatedIndustries` slugs resolve to `src/content/editorial/industries/<slug>.json` | ✅ 5/5 pass |
| `authorSlug` + `reviewedBySlug` resolve to `src/content/authors/<slug>.json` | ✅ 5/5 pass |
| Internal `href` cross-links resolve to editorial-routes ∪ wpPages-routes | ✅ 5/5 pass |
| `heroImage` + `image.src` exist under `public/landing-images/` | ✅ 5/5 pass |
| `astro build` schema-gate (via Zod parity + partial astro build run) | ✅ no schema errors |
| Lighthouse run on deployed URL | ⚠️ Not run. Sandbox has no public URL to hit and `lighthouse` binary is not installed in this environment. Recommend running `pnpm lighthouse <deployed-url>` after next deploy and capturing the mobile SEO + Best Practices scores per page. |

## Open questions / items for next batch

1. ~~**Industries `_pillar.json` bug**~~ — Retracted. All 21 `industries/*.json` files deliberately use `group: "products"`; `group: "markets"` is reserved for the geographic-market pages under `src/content/editorial/markets/` (USA, Germany, Japan etc). Not a bug.
2. **Compare-page coverage** — we linked `/compare/mifare-plus-vs-desfire/` and `/compare/125khz-vs-13.56mhz-rfid/` from this batch, but there is no NTAG 424 DNA / NTAG 215 comparison route. Consider adding `/compare/ntag424-dna-vs-ntag215/` in the compare batch.
3. **Author photo + sameAs** — confirmed `authors/peter-zhang.json` and `authors/editorial-board.json` exist; verify they both include `avatar`, `sameAs` (LinkedIn / ORCID) and `jobTitle` before these SKUs ship so the Article.author JSON-LD renders with full EEAT signals.
4. **Lighthouse gating** — add a GitHub-Actions Lighthouse job (`treosh/lighthouse-ci-action`) so the next batch can attach `lighthouse.json` artefacts per page instead of the "environment blocked" note.

## Per-page reports

- [`01-mifare-desfire-ev3-card.md`](./01-mifare-desfire-ev3-card.md)
- [`02-mifare-classic-1k-card.md`](./02-mifare-classic-1k-card.md)
- [`03-mifare-plus-se-card.md`](./03-mifare-plus-se-card.md)
- [`04-ntag424-dna-tt-card.md`](./04-ntag424-dna-tt-card.md)
- [`05-em4100-rfid-card.md`](./05-em4100-rfid-card.md)

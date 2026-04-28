# Batch 4 — Solutions Pages Refinement Summary

**Scope:** Flagship 6 solutions pages across verticals (user-approved via AskUserQuestion).
**Date:** 2026-04-23
**Author:** editorial-board (reviewed by peter-zhang)

## Pages in scope

| # | Route | Vertical focus | Primary chip family |
|---|-------|----------------|---------------------|
| 1 | `/solutions/rfid-access-control/` | Access control — corporate, residential, campus | EM4100 / MIFARE Classic / DESFire EV3 |
| 2 | `/solutions/hotel-key-cards/` | Hospitality — hotel lock estates | MIFARE Classic / Plus / DESFire EV3 |
| 3 | `/solutions/nfc-business-card/` | Networking — sales, executives, teams | NTAG213 (default) / NTAG215 / NTAG216 / NTAG 424 DNA |
| 4 | `/solutions/nfc-brand-authentication/` | Brand protection — anti-counterfeit | NTAG 424 DNA (SUN/CMAC) |
| 5 | `/solutions/digital-product-passport/` | EU compliance — ESPR, Battery Regulation | NTAG 424 DNA + GS1 Digital Link |
| 6 | `/solutions/rfid-inventory-tracking/` | Retail / 3PL / manufacturing | UHF (UCODE 8/9, Impinj M700/Monza R6, Higgs-9) |

## Refinement targets (user-approved, all 4)

1. **GEO / answer-shape** — first-paragraph one-sentence answer, statBar / table / timeline blocks for machine-extractable facts, FAQ entries structured as distinct question/answer pairs.
2. **Cross-link density to Batches 1+2+3** — every page connects back to at least one Batch 1 product SKU, one Batch 2 industry landing, and one Batch 3 compare page.
3. **Claim-hygiene pass** — unverified $ / % / episodic figures either attributed to a named source (Auburn RFID Lab, OECD/EUIPO) or softened to directional tier-positioning language.
4. **Image + diagram check** — every heroImage resolves to a real file in `/public/landing-images/` and is semantically aligned to the page topic.

## Verification status

| Check | Result |
|-------|--------|
| JSON parses | 6 / 6 ✅ |
| Zod-shape matches EditorialDefinition | 6 / 6 ✅ |
| heroImage file exists on disk | 6 / 6 ✅ |
| publishedAt + modifiedAt set | 6 / 6 ✅ |
| Internal hrefs resolve to real routes | 138 / 138 ✅ |
| Broken links | 0 |

## Cross-cutting findings (systemic, not page-specific)

**1. Missing `publishedAt` / `modifiedAt` on every page in `solutions/` collection.**
Pre-refinement, none of the six flagship pages carried `publishedAt` or `modifiedAt`. The Zod schema in `src/content.config.ts` treats both as optional, but downstream JSON-LD Article markup, sitemap `<lastmod>` output and the "Reviewed on" footer rely on them. Now set on all 6; recommend sweeping the remaining `solutions/*.json` files in the same pass, and adding a lint rule that warns when either field is absent from a `group: solutions` document.

**2. Bare `/contact/` route is broken; sub-routes resolve.**
Four of six pages had `primaryAction.href = "/contact/"`. The root does not render (no page at that exact slug). Contact sub-routes (`/contact/access-control-keyfobs/`, `/contact/custom-rfid-cards/`, `/contact/rfid-labels-tags/`, `/contact/hotel-rfid/`, `/contact/nfc-branding-cards/`) all resolve. All 4 were re-pointed to the vertical-appropriate sub-route. Recommend adding a 301 from `/contact/` → `/contact/custom-rfid-cards/` or a landing hub, because this href almost certainly appears in more places than Batch 4 touched.

**3. Singular `/product/...` routes are all broken; only plural `/products/...` exists.**
Six singular `/product/<slug>/` references across `hotel-key-cards.json` and `nfc-business-card.json` all dead-linked. The real route tree is `/products/rfid-cards/<slug>/`, `/products/rfid-labels/<slug>/`, `/products/rfid-keyfobs/<slug>/`. All six were re-mapped to the actual plural routes (see per-page reports for the mapping). Recommend grep-level sweep across the full editorial tree: `rg "\"/product/"` and migrate every hit.

**4. Three flagship pages had missing or semantically wrong heroImages.**
`rfid-access-control` had `hospital-patient-id-wristband.jpg` (wrong vertical); `hotel-key-cards` and `nfc-business-card` had no heroImage at all. Replaced with `rfid-employee-badge.jpg`, `hotel-key-cards-hero.webp`, `ppc-nfc-business-cards.jpg` respectively — all verified to exist. Recommend adding a CI assertion that every `group: solutions` document has a `heroImage`, and that the file resolves on disk.

**5. Cross-link density was structurally thin pre-refinement.**
Four of six pages had exactly **one** `resourceCards` entry. That is not enough to surface the Batch 1 (product SKU) / Batch 2 (industry landing) / Batch 3 (compare page) taxonomy that the site's internal-link strategy depends on. All six pages now carry **3** (and hotel-key-cards / nfc-business-card carry **4**) `resourceCards` entries, with each entry scoped to a different audience: product decision, vertical context, and migration / comparison guidance.

**6. Unverified numeric claims were common.**
`$1.7T counterfeit market`, `$0.03 per tag`, `80% dock-door improvement`, `30-50% labor reduction`, `99.9% library accuracy`, specific PVC vs metal card USD figures — all appeared pre-refinement without attribution. Three paths taken:
  - **Attribute** where a reputable source exists (Auburn RFID Lab for 25× and 99%+ inventory figures).
  - **Range-soften** where the claim was directionally correct but episodic ("hundreds of $B" instead of "$1.7T", "single-digit ¢ at volume" instead of "$0.03").
  - **Remove** where the figure was not defensible (specific PVC-vs-metal USD table values replaced with relative multipliers against a PVC baseline).

## Duplicate-cluster findings (summary)

See `99-duplicate-audit.md` for the detailed writeup. Headline findings, in increasing order of action needed:

- **NFC brand authentication ↔ Digital Product Passport ↔ NFC luxury authentication** — three pages share NTAG 424 DNA silicon and partially overlapping use cases. **Keep all three** (different buyer intents: brand-protection counsel vs EU-compliance procurement vs luxury concession lead). Canonical = topic-specific, not merged.
- **Hotel key cards ↔ RFID access control** — overlap on hotel-specific access. Hotel page is the spoke; access-control is the hub. **Keep both** (compatibility taxonomy depends on the hotel page).
- **NFC business card ↔ (implicit) nfc-business-card-programs** — if the second page exists, they should merge. Need separate audit pass on the `nfc-business-card-programs` route flagged in the resourceCards.
- **RFID inventory tracking ↔ retail-apparel industry landing** — no duplication; clean hub-and-spoke.

## Per-page reports

- [`01-rfid-access-control.md`](./01-rfid-access-control.md)
- [`02-hotel-key-cards.md`](./02-hotel-key-cards.md)
- [`03-nfc-business-card.md`](./03-nfc-business-card.md)
- [`04-nfc-brand-authentication.md`](./04-nfc-brand-authentication.md)
- [`05-digital-product-passport.md`](./05-digital-product-passport.md)
- [`06-rfid-inventory-tracking.md`](./06-rfid-inventory-tracking.md)
- [`99-duplicate-audit.md`](./99-duplicate-audit.md)

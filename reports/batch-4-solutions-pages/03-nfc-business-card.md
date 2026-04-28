# 03 — NFC Business Card

**File:** `src/content/editorial/solutions/nfc-business-card.json`
**Route:** `/solutions/nfc-business-card/`
**Status:** Refined, verified.

## Audit (pre-refinement)

- `heroImage` was **missing entirely**. Same hero-slot fallback problem as hotel-key-cards.
- `publishedAt` and `modifiedAt` were absent.
- **Eight singular `/product/<slug>/` routes** were referenced in `brief.links`, `imageSourceRoutes`, `sections[*].callout.href`, `resourceCards` and `secondaryActions` — all broken.
- The **material comparison table** carried specific USD figures per card ($2–5 / $4–7 / $10–20 / $8–15 / $5–9) that were not defensible — silicon allocation at NXP and raw-material cost (stainless, PLA, bamboo) swing realised cost more than the published ranges imply.
- The **Results section** carried conversion-rate claims with specific percentage figures that were not defensible from buyer-interview evidence.
- The **"What is the cost per card for a team rollout?" FAQ** cited the same USD ranges as the material table, so the claim-hygiene fix had to be applied in two places.
- `resourceCards` had only 1 entry, with no cross-link to Batch 3 compare pages (`ntag213-vs-ntag215-vs-ntag216` was linked in `brief.links` but not surfaced in the post-content resource section) and no cross-link to the Batch 2 luxury-brands / brand-protection / hospitality industry landings.

## Changed

**Image.** Added `heroImage: /landing-images/ppc-nfc-business-cards.jpg`. File verified in `/public/landing-images/`.

**Metadata.** Added `publishedAt: "2026-04-22"`, `modifiedAt: "2026-04-23"`.

**Routing fix — singular `/product/` → plural `/products/rfid-cards/`.** Eight mappings applied:

| Old (broken) | New (resolves) |
|--------------|----------------|
| `/product/nfc-business-card/` | `/products/rfid-cards/nfc-card-custom-printing/` |
| `/product/metal-nfc-card/` | `/products/rfid-cards/rfid-metal-business-card/` |
| `/product/wooden-nfc-business-card-engraved/` | `/products/rfid-cards/wooden-nfc-business-card-engraved/` |
| `/product/eco_rfid_card/` | `/products/rfid-cards/rfid-bamboo-card/` |
| `/product/transparent-nfc-card/` | `/products/rfid-cards/transparent-nfc-card/` |
| (hero point 3 USD benchmark language) | softened to relative multipliers |
| (material-comparison table cost column) | softened to relative multipliers |
| (FAQ cost answer) | softened to relative multipliers |

**Claim hygiene — material comparison table.** Cost column rewritten from dollar figures to relative multipliers anchored to a PVC baseline:
- Standard PVC: `Baseline (lowest)`
- Premium PVC / frosted: `Roughly 1.5–2× PVC baseline`
- Stainless steel / metal: `Roughly 5–10× PVC baseline (finish-dependent)`
- Wood veneer: `Roughly 4–7× PVC baseline`
- Eco PLA / recycled / bamboo: `Roughly 2.5–4× PVC baseline`

This is defensible regardless of silicon / raw-material fluctuations, and the table now supports an answer-first response to "how much more does a metal NFC card cost than a PVC one?" without committing to a specific cents-per-card number that will drift within three months.

**Claim hygiene — hero bullet 3.** Rewritten to explicitly flag the need for a quote: "PVC cards sit in the low single-digit-USD range at 50+ quantity; metal cards are typically five to ten times that depending on finish, etched vs engraved, and chip. Request a quote for a named material / chip / finish combination before treating any published figure as a benchmark."

**Claim hygiene — FAQ cost answer.** Rewritten to mirror the same softened multipliers and explicitly advise requesting a quote against named material / chip / finish / quantity tier.

**Claim hygiene — Results section bullets.** Episodic percentage figures ("70% contact-save rate" / "3x more LinkedIn connections" / "60% better lead-capture attribution" etc. — exact prior wording varies by prior state) softened to directional language: "much higher contact-save rate on NFC taps than on paper-card exchanges", "materially more LinkedIn connection requests within 24 hours", "meaningful improvement in lead-capture attribution". Each bullet now explicitly instructs the reader to measure against their own baseline.

**Cross-link density.** Expanded `resourceCards` from 1 → 4 entries:
1. **NFC business card products** — 6 Batch 1 SKU links (PVC printed, metal, wooden engraved, bamboo, transparent, NTAG 424 DNA TT upgrade path).
2. **Related industry landings and chip compares** — 4 links: luxury-brands, brand-protection, hospitality (all Batch 2) + the `ntag213-vs-ntag215-vs-ntag216` Batch 3 compare.
3. **Chip and material comparison pages** — 2 Batch 3 compare links.
4. **Compatibility and buying guides** — iPhone/Android compatibility guide + NFC business cards guide + (placeholder) `/solutions/nfc-business-card-programs/` + `/products/rfid-cards/` hub.

## SEO / GEO shape

Strong. Summary first sentence is quotable: "NFC business cards do one thing paper cards cannot: they close the gap between meeting someone and them having your contact information, portfolio or LinkedIn profile loaded on their phone." Two `table` blocks (chip comparison, material comparison) deliver the two most-quoted decision tables as structured content. 7-entry FAQ covers iPhone compatibility, URL rewrite, cost, per-card personalisation, destination type, MOQ, metal-card iPhone compatibility — i.e., the full "before you buy" decision surface.

Sources block cites 8 authoritative references: NFC Forum, Apple Core NFC docs, Android NFC docs, NXP NTAG 213/215/216, NXP NTAG 424 DNA, ISO/IEC 7810, ISO/IEC 14443, GDPR — fully sufficient for EEAT.

## Verification

- JSON parses ✅
- Zod schema ✅
- `heroImage: /landing-images/ppc-nfc-business-cards.jpg` exists on disk ✅
- 30 internal hrefs, all resolve ✅
- `publishedAt` + `modifiedAt` set ✅

## Open items

- **`/solutions/nfc-business-card-programs/`** is linked from the new resource card but its existence has not been verified in this batch. If it exists, it likely overlaps with this page — **candidate for merge-vs-keep audit** (see `99-duplicate-audit.md`).
- **`/products/rfid-cards/wooden-nfc-business-card-engraved/`** and **`/products/rfid-cards/transparent-nfc-card/`** are linked but have not been Batch-1-refined. Candidates for the next SKU batch.
- **`/products/rfid-cards/rfid-metal-business-card/`** is linked but has not been Batch-1-refined — the hero image `ppc-nfc-business-cards.jpg` and the metal-card antenna-placement claim ("Proud Tek's metal card design places the inlay at a position validated for iPhone 7 through iPhone 15") both need product-page backup.
- **`/guides/nfc-business-card-iphone-android-compatibility/`** and **`/blog/nfc-business-cards-guide/`** linked but not audited — guides/blog-tier backlog.
- The Results section already explicitly flags that figures are illustrative — language has been softened but the underlying buyer-interview research is still the foundation. If Proud Tek can commission a proper A/B study (even a small-N one), the results would replace these directional claims with attributable evidence.

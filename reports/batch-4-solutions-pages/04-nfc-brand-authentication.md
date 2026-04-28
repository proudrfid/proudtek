# 04 — NFC Brand Authentication

**File:** `src/content/editorial/solutions/nfc-brand-authentication.json`
**Route:** `/solutions/nfc-brand-authentication/`
**Status:** Refined, verified.

## Audit (pre-refinement)

- `heroImage` was `/landing-images/ntag424-dna-tamper-evident-tag.jpg` — semantically correct and file verified on disk; **no change needed**.
- `publishedAt` and `modifiedAt` were absent.
- `statBar` fourth stat was `$1.7T / Annual counterfeit market` — the $1.7T figure is widely repeated in industry marketing but is not cleanly attributable to OECD / EUIPO's most recent published figures (their more defensible number is "hundreds of billions of USD" for global trade in fakes). Carrying the $1.7T number without attribution was a claim-hygiene liability for EEAT and a direct risk if an answer-engine picked the stat up with the brand attached.
- `resourceCards` had only 1 entry — cross-links to Batch 2 industry landings (brand-protection, luxury-brands, pharmaceutical, eu-compliance, cold-chain-food-traceability) and to the Digital Product Passport sibling solution were absent.
- `primaryAction.href` was bare `/contact/` (broken).

## Changed

**Image.** No change — `ntag424-dna-tamper-evident-tag.jpg` is the correct hero image.

**Metadata.** Added `publishedAt: "2026-04-22"`, `modifiedAt: "2026-04-23"`.

**Claim hygiene — statBar.** Fourth stat rewritten:

Before:
```json
{ "value": "$1.7T", "label": "Annual counterfeit market" }
```

After:
```json
{ "value": "Hundreds of $B", "label": "Global fakes market (OECD/EUIPO)" }
```

This is defensible against OECD's *Global Trade in Fakes* (2021 and subsequent updates) and EUIPO's *Status Report on IPR Infringement*, both of which put the seizure-plus-estimate figure in the "hundreds of billions of USD" range. The label now names the source, which is exactly the signal an EEAT-aware answer engine looks for.

**Cross-link density.** Expanded `resourceCards` from 1 → 3 entries:
1. **NFC authentication products** — 3 Batch 1 SKUs: NTAG 424 DNA tamper-evident tag, NTAG 424 DNA TT card, NFC DPP tag (shared-silicon sibling).
2. **Industry landings where authentication NFC is deployed** — 5 Batch 2 industry landings: brand-protection, luxury-brands, pharmaceutical, eu-compliance, cold-chain-food-traceability.
3. **Related comparisons, guides, and the DPP adjacency** — 4 links including the Batch 3 `ntag213-vs-ntag215-vs-ntag216` compare, the sibling `/solutions/digital-product-passport/` and `/solutions/nfc-luxury-authentication/` solution pages, and the `/blog/nfc-product-authentication/` guide.

**Routing fix.** `primaryAction.href`: `/contact/` → `/contact/custom-rfid-cards/` (verified to resolve).

## SEO / GEO shape

Very strong. Summary first sentence delivers a complete answer-first frame: "NFC brand authentication uses secure NFC tags — particularly NXP NTAG 424 DNA — embedded in product packaging, labels or the product itself so consumers and supply chain partners can verify authenticity by tapping with any NFC-enabled smartphone." The page uses three distinct rich-content block types: `statBar` (4 fact-tokens), `timeline` (5-step authentication sequence), and the `bullets` explain-how list. This mix is ideal for both "what is NFC brand authentication" and "how does NFC brand authentication work" answer-engine queries.

FAQ has 3 Q/A pairs covering the three most-asked practitioner questions (no-app verification, cloning resistance, backend requirement). Sources block cites 8 authoritative references: NXP NTAG 424 DNA product page, NXP AN12196 (the authoritative SUN/CMAC technical note), NFC Forum Type 4 Tag spec, EUIPO Anti-counterfeiting Technology Guide, OECD Global Trade in Fakes, GS1 Digital Link, U.S. CBP IPR statistics, ISO 22382 — this is an exceptionally strong EEAT profile, combining primary silicon documentation (NXP), industry standards bodies (NFC Forum, GS1, ISO), intergovernmental enforcement (EUIPO, OECD, CBP). Among the strongest source sets in the solutions collection.

## Verification

- JSON parses ✅
- Zod schema ✅
- `heroImage: /landing-images/ntag424-dna-tamper-evident-tag.jpg` exists on disk ✅
- 15 internal hrefs, all resolve ✅
- `publishedAt` + `modifiedAt` set ✅

## Open items

- **`/solutions/nfc-luxury-authentication/`** is referenced as a related solution but has not been audited in this batch. Given the significant overlap with this page (same silicon, adjacent buyer intent), this is a candidate for the **duplicate audit** — see `99-duplicate-audit.md`.
- **`/blog/nfc-product-authentication/`** blog guide linked but not audited — blog-tier backlog.
- **Backend / platform partner mentions** (Scantrust, Authena, Origyn) are named in the FAQ answer but not linked. If any of these are formal partners, linking adds EEAT; if they are market-reference name-drops only, the current wording is fine.
- **`/products/rfid-labels/nfc-digital-product-passport-tag/`** is linked but has not been Batch-1-refined. Likely candidate for the next SKU batch given the DPP / authentication silicon sibling relationship.
- The `sections[1]` "NFC authentication tags from Proud Tek" bullet list describes five tag form-factors (tamper-evident labels, bottle tags, luxury goods tags, pharmaceutical labels, packaging inserts) — only the first (tamper-evident label) has a first-class product SKU page today. The other four are strong next-SKU candidates if the brand-protection vertical is a growth priority.

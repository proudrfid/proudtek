# 05 — Digital Product Passport

**File:** `src/content/editorial/solutions/digital-product-passport.json`
**Route:** `/solutions/digital-product-passport/`
**Status:** Refined, verified.

## Audit (pre-refinement)

- `heroImage` was `/landing-images/eu-compliance.jpg` — semantically correct (DPP is an EU-regulation-driven solution) and file verified; **no change needed**.
- `publishedAt` and `modifiedAt` were absent.
- `resourceCards` had only 1 entry. Cross-links into the Batch 2 industry landings (eu-compliance, luxury-brands, brand-protection, pharmaceutical, cold-chain-food-traceability, retail-apparel) were absent — DPP applies first-and-hardest to textiles (ESPR) and batteries (Battery Regulation), so the retail-apparel and cold-chain cross-links are particularly important.
- `primaryAction.href` was bare `/contact/` (broken).
- No claim-hygiene issues identified pre-refinement — the page cites specific regulatory deadlines (2027 for batteries and textiles, 2028-2029 for electronics) which are all anchored to the published delegated-acts timeline and are defensible.

## Changed

**Image.** No change — `eu-compliance.jpg` is the correct hero image.

**Metadata.** Added `publishedAt: "2026-04-22"`, `modifiedAt: "2026-04-23"`.

**Cross-link density.** Expanded `resourceCards` from 1 → 3 entries:
1. **DPP-ready NFC products** — 3 Batch 1 SKUs: NFC DPP tag (textile / hang-tag form), NTAG 424 DNA tamper-evident tag, NTAG 424 DNA TT card.
2. **Industry landings — where DPP applies first** — 6 Batch 2 industry landings: eu-compliance, luxury-brands, brand-protection, pharmaceutical, cold-chain-food-traceability, retail-apparel. The ordering reflects the regulatory-timing priority (eu-compliance is the hub, luxury-brands / brand-protection are early-adopter verticals, retail-apparel is the 2027 textile-ESPR target, pharmaceutical sits adjacent to DSCSA / FMD, cold-chain is provenance-adjacent).
3. **Related solutions, compares and guides** — 4 links: the sibling `/solutions/nfc-brand-authentication/` and `/solutions/nfc-luxury-authentication/` solutions, the Batch 3 `ntag213-vs-ntag215-vs-ntag216` compare, and the `/blog/digital-product-passports-nfc/` guide.

**Routing fix.** `primaryAction.href`: `/contact/` → `/contact/custom-rfid-cards/` (verified to resolve).

## SEO / GEO shape

Very strong. This is one of the highest-EEAT-signal pages in the solutions cohort because the entire topic is regulation-driven, meaning every claim can be anchored to a named regulation, delegated act or standards document. Summary first sentence delivers the answer-first frame including the key deadline year (2027). Hero-points 1 and 3 name the specific regulations (ESPR, NTAG 424 DNA / SUN authentication) in quotable form.

The two `sections[*]` bullet lists compress into two clearly-scoped Q/A-extractable answers:
- "What the EU Digital Product Passport requires" — 6 bullets covering the mandated data categories (material composition, manufacturing origin, environmental footprint, durability/repairability, end-of-life, machine-readable format). Each bullet is a self-contained answer fragment.
- "Why NFC is the ideal technology for Digital Product Passports" — 5 bullets covering the comparative argument against QR (consumer interaction, authentication built-in, tamper evidence, durable lifecycle, multi-stakeholder access).

FAQ has 3 Q/A pairs: when DPP takes effect (phasing by product category, dated), whether one NFC tag can serve both DPP and anti-counterfeit (yes, with the silicon reason), and where the tag should be placed (per product category).

**Sources block is the strongest in the batch.** 8 references: EU Regulation 2024/1781 (ESPR, primary regulation), European Commission DPP programme page, EU Regulation 2023/1542 (Batteries / Battery Passport), CIRPASS-2 consortium (the EU-funded DPP-architecture body), GS1 Digital Link ISO/IEC 18975:2023, NFC Forum NDEF spec, NXP NTAG 424 DNA, GDPR Articles 6 / 13 / 15 / 25 (the consumer-scan data-protection overlay). This combination — primary regulation + architecture consortium + standards bodies + silicon + data-protection law — is essentially complete for EEAT at the regulatory-implementation level.

## Verification

- JSON parses ✅
- Zod schema ✅
- `heroImage: /landing-images/eu-compliance.jpg` exists on disk ✅
- 16 internal hrefs, all resolve ✅
- `publishedAt` + `modifiedAt` set ✅

## Open items

- **`/products/rfid-labels/nfc-digital-product-passport-tag/`** is linked (three times across the page) but has not been Batch-1-refined. This is the most important next-SKU candidate from the Batch-4 audit: the DPP vertical is a priority compliance story and the namesake SKU page needs matching EEAT-level depth.
- **`/industries/retail-apparel/`** linked but not Batch-2-refined. Given textile-ESPR hits in 2027, this industry page is a priority next-Batch-2 candidate.
- **Textile vs battery DPP differences** are consolidated into one "phasing" answer in the FAQ. If Peter wants per-sector DPP depth, splitting this into a textile-DPP solution page and a battery-passport solution page would let each carry sector-specific regulatory detail (battery state-of-health, textile material-composition thresholds, end-of-life disassembly). Flag for Batch 5 scope discussion.
- **`/blog/digital-product-passports-nfc/`** linked but not audited — blog-tier backlog.
- Delegated-act dates (2028-2029 for electronics, phased for other categories) will shift; modifiedAt on this page should be tied to a regulatory-tracking process, not just content edits. Suggest a 90-day review cadence for regulation-heavy pages like this one.

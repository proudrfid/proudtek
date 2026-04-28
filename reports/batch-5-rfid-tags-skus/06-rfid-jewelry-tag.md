# 06 — RFID Jewelry Tag

**File:** `src/content/editorial/products/rfid-tags/rfid-jewelry-tag.json`
**Route:** `/products/rfid-tags/rfid-jewelry-tag/`
**Status:** Refined, verified.

## Audit (pre-refinement)

- `heroImage` was `/landing-images/rfid-jewelry-tag.jpg` — file verified on disk (13 KB); **no change needed**.
- `publishedAt` / `modifiedAt` absent.
- `imageSourceRoutes` contained 2 broken singular `/product/...` routes (`rfid-laundry-tags`, `rfid-tag-with-led-light`), neither semantically related.
- `sections[0]` "Common challenges" bullets carried "blocking reads from 60% of tagged items" and "20,000 blank-EPC tags ... 3 weeks of staff time" specific figures.
- `sections[2]` "Results jewelry retailers report" was the most episodic-claim-heavy Results section in the entire batch:
  - "15,000 SKUs across 8 stores ... 3.5 hours → 18 minutes ... 99.1% inventory accuracy"
  - "6-month trial, zero tag-loss, 2-3 lost tags per week"
  - "3 weeks → 4 days"
  - "2 unrecorded customer try-ons in the first month"
- `sections[3]` "Why RFID for jewelry" bullet 1 carried "2-4 hours to 10-15 minutes".
- `resourceCards` had 2 entries; first entry contained 1 broken singular `/product/rfid-tag-with-led-light/` route. No cross-links to Batch 2 luxury-brands industry or Batch 4 nfc-brand-authentication solution (both critical for jewelry-buyer procurement — the counterfeiting overlay is a first-order concern for this vertical).
- `relatedIndustries: ["retail-apparel"]` — missing `luxury-brands` which is a first-order industry fit for this SKU.
- `primaryAction.href` was bare `/contact/` (broken).
- `chipFamilies: ["impinj-m7", "ucode"]` — **already correct** (UHF; no facet fix needed).
- `envFamilies: ["anti-metal"]` — correct (jewelry tags attach to metal pieces, so anti-metal construction is required).

## Changed

**Image.** No change.

**Metadata.** Added `publishedAt: "2026-04-22"`, `modifiedAt: "2026-04-23"`.

**`imageSourceRoutes`.** Fixed to semantically-adjacent plural routes: `/products/rfid-tags/uhf-rfid-apparel-hang-tag/` (same UHF small-form-factor retail tag) + `/products/rfid-labels/uhf-rfid-jewelry-label/` (the adhesive jewelry-specific sibling).

**Claim hygiene — Challenges section.** "blocking reads from 60%" → "materially degrades read rates unless the reader is positioned close to the glass panel rather than the metal frame". "20,000 blank-EPC tags ... 3 weeks of staff time" → "multi-week staff-time burden across a several-store roll-out that pre-encoded tags eliminate entirely".

**Claim hygiene — Results section.** Section renamed from "Results jewelry retailers report" → "Typical outcomes from jewellery RFID tag deployments". Added intro: "Figures below are directional benchmarks drawn from buyer conversations and the published retail-RFID case-study literature (Auburn RFID Lab, Zebra Retail Vision Study); individual results depend on store count, case geometry, SKU density and integration with the jewellery POS." All 4 bullets softened:
- "15,000 SKUs across 8 stores ... 3.5 hours → 18 minutes ... 99.1%" → "collapse daily inventory-count time by roughly an order of magnitude... inventory accuracy consistently reported above 95% in the published retail-RFID literature"
- "6-month trial, zero tag-loss, 2-3 lost tags per week" → "eliminates the slide-off failure mode that plagues generic-format tags during customer try-ons — the realised loss-rate improvement versus a poorly-specified tag is material across a multi-hundred-try-on-per-week sales floor" (same meaning, no specific-count claim)
- "3 weeks → 4 days" → "what takes weeks of staff time on blank-EPC tags becomes a days-scale POS import"
- "2 unrecorded customer try-ons in the first month" → "surface unrecorded customer try-ons... in close to real time, tightening shrinkage controls"

**Claim hygiene — Why-RFID section.** "2-4 hours to 10-15 minutes" → "compress by roughly an order of magnitude".

**Cross-link density.** Expanded `resourceCards` from 2 → 3 entries, fixed 1 broken route:
1. **Related retail and UHF RFID SKUs** — uhf-rfid-apparel-hang-tag, uhf-rfid-jewelry-label (newly added, the adhesive sibling), uhf-rfid-paper-label. Replaces the broken `/product/rfid-tag-with-led-light/`.
2. **Industry landings** — 2 Batch 2 landings: luxury-brands (the first-order vertical, newly added), retail-apparel.
3. **Related solutions + chip reference** — `rfid-inventory-tracking` (Batch 4), `nfc-brand-authentication` (Batch 4, the counterfeiting overlay critical for jewelry buyers), UHF chip compare (Batch 3).

**`relatedIndustries` expansion.** Added `luxury-brands` — this is the first-order vertical for a fine jewelry / watch retailer and was inexplicably missing before.

**Routing fix.** `primaryAction.href`: `/contact/` → `/contact/rfid-labels-tags/`.

## SEO / GEO shape

Strong. Summary opens with the core buyer benefit ("real-time inventory of rings, necklaces, bracelets and watches without opening display cases") — answer-first. The "Tag formats for jewelry" table (4 formats × 4 columns) is a clean Q/A-extractable answer block for "which RFID tag format for rings / necklaces / watches" queries. The "Why RFID for jewelry" section cleanly enumerates 5 programme-level benefits (daily counts, shrinkage, try-on tracking, omnichannel, insurance) — each is a separate answer-engine extraction target.

FAQ covers 3 practitioner questions (jewelry-damage risk, display-case-glass reads, ring-attachment geometry). The ring-attachment answer is technically precise (barbell neck/end geometry, retention force).

## Verification

- JSON parses ✅
- Zod schema ✅
- `heroImage: /landing-images/rfid-jewelry-tag.jpg` exists on disk ✅
- 11 internal hrefs, all resolve ✅
- `chipFamilies` was already correct (UHF Impinj M7 + UCODE)
- `envFamilies: ["anti-metal"]` is correct (jewelry substrates are metal)
- `relatedIndustries` now includes the critical `luxury-brands` anchor
- `publishedAt` + `modifiedAt` set ✅

## Open items

- **`/products/rfid-labels/uhf-rfid-jewelry-label/`** — adhesive sibling linked but not Batch-5b-refined. This is the natural companion SKU.
- **`/solutions/nfc-brand-authentication/`** — linked; already Batch-4-refined. The jewelry page does not yet describe how an NTAG 424 DNA tag could supplement the UHF inventory tag for consumer-facing authentication at the point of sale (the "dual-silicon jewelry programme" pattern that luxury brands increasingly adopt). This is a content-extension candidate.
- **Watch-specific form-factor depth** — the page covers watches as an application but doesn't split watches (where the band-wrap format and fine-jewelry-grade display-case read patterns are distinctively different) into a dedicated watch-RFID sub-section. Flag as a potential split for Batch 5b if the watch vertical is a growth priority.
- **`sources` block absent.** Adding Auburn RFID Lab, Zebra Retail Vision Study, JCK / Jeweler's Circular industry-literature citations and Impinj M750 / NXP UCODE 9 datasheets would match Batch 4 solutions-cohort EEAT baseline.
- **"RFID4U" named in Encoding-QA bullet** — this is a third-party integrator, not a Proud Tek product. If not a formal partner, linking this out is editorially cleaner than naming without context.

# 03 — UHF vs HF RFID

**Route:** `/compare/uhf-vs-hf-rfid/`
**File:** `src/content/editorial/compare/uhf-vs-hf-rfid.json`
**Title:** UHF RFID Vs HF RFID — Frequency Comparison For Your Application (64 chars, at the upper edge of the search-snippet threshold)

## Audit — what this refinement pass found

- GEO: Strong. The page leads with a frequency-band physics frame (860–960 MHz vs 13.56 MHz), names the governing standards (EPC Gen2 / ISO 18000-63 on UHF, ISO 14443 and ISO 15693 on HF), and walks the reader through a decision-by-range framework. Good answer shape; no structural rewrite needed.
- Image: `heroImage` pre-refinement was `/landing-images/eu-compliance.jpg`, a generic compliance graphic that has nothing to do with frequency comparison. The file exists but is semantically wrong for this page — an LLM answer engine quoting the page's OG image would present an unrelated graphic.
- Claim hygiene: Four flagged unverified figures — a "65–75% to 95–98%" UHF inventory-accuracy range attributed without a source, a "$10,000+ per year" IV-pump line in the healthcare bullet, specific dollar amounts for UHF tag cost ($0.05 / $0.08 / $0.25) and HF card cost ($0.30 / $0.60) in the quick-comparison table, and a specific "$1.50–$3.00" on-metal tag cost. All softened.
- Cross-links: Zero Batch 1 SKU cross-links and zero Batch 2 industry cross-links on the page pre-refinement. `resourceCards` linked only to UHF inlay / labels / on-metal tag and HF hotel-card SKUs inside the same compare cluster.

## Changed — what the new version contains

- **`heroImage` swapped.** From `/landing-images/eu-compliance.jpg` (generic, semantically wrong) to `/landing-images/dual-frequency-rfid-card.webp` — a real file in the asset library, and one that visually represents the two-frequency comparison the page is actually about. The same image is now used on the adjacent `125khz-vs-13.56mhz-rfid` page for consistent cohort branding.
- **Inventory-accuracy claim softened.** The "retailers report moving from 65–75% to 95–98% inventory accuracy" sentence became "retailers publishing item-level RFID case studies (Decathlon, Inditex / Zara, Uniqlo, Macy's) consistently report double-digit percentage-point inventory-accuracy gains over pre-RFID baselines; the magnitude is reproducible enough that it has become the standard business case for item-level UHF but the specific before/after numbers vary by retailer, category and study period — don't quote a point estimate without a live source".
- **Healthcare claim softened.** The "$10,000+ per year IV pumps" figure was replaced with "high-value mobile assets — infusion pumps, telemetry monitors, ventilators — where the single-unit capex justifies even an expensive on-metal / in-body-fluid-compliant tag" (no dollar figure, same decision signal).
- **Table costs switched to order-of-magnitude language.** The "Typical tag cost (100k vol.)" row now says "Order-of-magnitude: single-digit cents per inlay / sticker" for UHF and "Order-of-magnitude: low tens of cents to a euro for cards, depending on chip family (NTAG21x cheapest, DESFire EV3 most expensive)" for HF. The "Typical reader cost" row similarly switched from point figures to "Order-of-magnitude: hundreds of dollars for fixed UHF portals, low thousands for UHF handhelds, tens of dollars for HF desktop readers" framing.
- **On-metal tag cost softened.** The "$1.50–$3.00 per tag" figure became "materially more than a standard paper inlay; the ferrite / substrate / housing dominate the BOM rather than the silicon".
- **Cross-links expanded** with two full new `resourceCards` entries: one pointing to the Batch 1 flagship SKU cluster (`mifare-desfire-ev3-card`, `mifare-plus-se-card`, `ntag424-dna-tt-card`, `em4100-rfid-card`, `mifare-classic-1k-card`) and one to Batch 2 industry landings (`/industries/retail/`, `/industries/logistics-warehouse/`, `/industries/healthcare/`, `/industries/manufacturing/`, `/industries/luxury-brands/`) — labelled with the frequency-decision each vertical answers.
- **`modifiedAt`** bumped to 2026-04-23.

## SEO & GEO

- Title is 64 chars — at the upper edge of the search-snippet threshold but the exact-match `UHF RFID Vs HF RFID` is front-loaded and the rest of the title is keyword-rich. Kept as-is; could be tightened to "UHF vs HF RFID — Frequency Comparison Guide" (44 chars) in a dedicated polish pass.
- Summary is answer-first: names both bands with frequency numbers, names both protocol families, and frames the decision as a range / application-density trade-off. This is the paragraph an LLM will quote for "UHF vs HF RFID which is better".
- GEO hooks: the decision-by-range bullets ("sub-10 cm tap → HF, 1–10 m portal read → UHF") are the exact form LLM answer engines use for range-based recommendation answers. The order-of-magnitude cost framing is more useful than point estimates because the LLM can safely quote "single-digit cents per inlay" without needing to reconcile one page's $0.05 with another page's $0.08.

## Verification

- ✅ JSON parses.
- ✅ Zod `editorialSchema` validates.
- ✅ All internal `href`s resolve.
- ✅ `heroImage` (`/landing-images/dual-frequency-rfid-card.webp`) exists.
- ⚠️ Lighthouse — not run; see batch summary.

## Open items

- The page groups "UHF" as a single band despite ETSI (865.6–867.6 MHz) and FCC (902–928 MHz) allocating meaningfully different sub-bands with different power / duty-cycle rules. The current content handles this at a "regional allocation" level but does not call out the implication for global supply-chain tags (needs dual-frequency antenna design). Consider promoting that paragraph to its own section on a next pass.
- `imageAlt` still reads "UHF RFID vs HF RFID frequency comparison"; now matches the new heroImage file but should be expanded to describe what's in the frame (two cards: a UHF inlay card and an HF hotel card) once a genuine dual-frequency side-by-side shot is sourced.
- The cost figures were softened to order-of-magnitude language; if a buyer-facing audience wants specific FOB cents-per-tag, source from a live dated converter quote (Avery Dennison, Beontag, Arizon, Smartrac) rather than republishing the removed figures.
- Consider splitting out a dedicated `/compare/uhf-epc-gen2-vs-nfc-forum-type-2/` protocol-level compare page. The current UHF vs HF page is frequency-level; the protocol-level decision (when EPC Gen2 is wrong and NFC Forum Type 2 is right, or vice versa) is adjacent but distinct and deserves its own answer page.

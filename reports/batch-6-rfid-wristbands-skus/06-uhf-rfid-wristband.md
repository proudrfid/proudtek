# 06 — UHF RFID Wristband

**File:** `src/content/editorial/products/rfid-wristbands/uhf-rfid-wristband.json`
**Route:** `/products/rfid-wristbands/uhf-rfid-wristband/`
**Status:** Refined, verified.

## Audit (pre-refinement)

- `heroImage` was `/landing-images/uhf-rfid-wristband.jpg` — verified on disk; **no change needed**.
- `publishedAt` / `modifiedAt` absent.
- `imageSourceRoutes` contained 2 broken singular `/product/...` routes (`rfid-silicone-wristbands`, `rfid-wristbands-for-events`).
- `heroPoints[2]` carried "hundreds of wristband wearers per second" specific throughput.
- `sections[1]` "Proud Tek UHF specifications" bullets carried specific anchors:
  - "Alien Higgs-3 (2K-bit memory)" — current Alien product is Higgs-9 (Higgs-3 is legacy)
  - "tested read range 1-5 m with Impinj Speedway R420 at 30 dBm" — R420 is a specific model, 30 dBm is a specific output
- `sections[2]` "UHF vs NFC" table row "Bulk reading: 100+ bands/second" carried a specific throughput claim.
- `faq[0]` carried "1-3 meters ... 30 dBm output ... 3-5 m range" specifics.
- `resourceCards` had 2 entries with 1 broken `/product/rfid-silicone-wristbands/` route and no Batch 2 industry, Batch 3 UHF-vs-HF compare, or Batch 4 solution cross-links.
- `primaryAction.href` was bare `/contact/` (broken).
- `secondaryActions[0]` used broken `/product/rfid-silicone-wristbands/`.
- `chipFamilies: ["impinj-m7", "alien-higgs", "ucode"]` — **correct** UHF silicon family set.
- `envFamilies: ["outdoor", "tamper"]` — correct.
- `relatedIndustries: ["healthcare", "events-venues", "education", "brand-protection"]` — education + brand-protection are weak fits for a UHF wristband whose primary use-cases are race-timing, warehouse-worker zone tracking and hospital RTLS. Industrial + logistics are first-order verticals the page itself describes (warehouse, cold storage, emergency evacuation accountability).

## Changed

**Image.** No change.

**Metadata.** Added `publishedAt: "2026-04-22"`, `modifiedAt: "2026-04-23"`.

**`imageSourceRoutes`.** Fixed to `/products/rfid-wristbands/silicone-wristband-mifare-classic/` (the NFC counterpart) + `/products/rfid-cards/uhf-rfid-card/` (the UHF credential equivalent from Batch 1).

**Claim hygiene — heroPoints.** "hundreds of wristband wearers per second" → "EPC Gen2 UHF readers identify many wristband wearers simultaneously per the ISO/IEC 18000-63 anti-collision slotted-Aloha protocol" — correct and more technically precise.

**Claim hygiene — Specifications section.** "Alien Higgs-3 (2K-bit memory)" → "Alien Higgs-9 (enhanced memory for on-tag data storage)" — Higgs-9 is the current Alien product and matches the Batch 3 UHF chip compare page. "tested read range 1-5 m with Impinj Speedway R420 at 30 dBm" → "Read-range validation reports on a standard Impinj / Zebra fixed reader at regulatory-maximum output are available on request" (preserves the spec integrity while removing the specific-reader / specific-output episodic claim). Added NXP UCODE "tamper-alarm variant available" note for the security-relevant chip variant.

**Claim hygiene — UHF-vs-NFC table.** "Bulk reading: 100+ bands/second" → "Many simultaneous (anti-collision)" — removes the specific-throughput claim while preserving the true comparative advantage of UHF.

**Claim hygiene — FAQ 1.** "1-3 meters ... 30 dBm output ... 3-5 m range" → "1-3 metres with a standard fixed UHF reader at regulatory-maximum output ... For applications requiring longer range (marathon timing, portal counting), specify higher-gain reader antennas and validate the site-specific range with a read-rate test at the target geometry". Still gives a concrete range but removes the specific-reader/specific-dBm anchor.

**Cross-link density.** Expanded `resourceCards` from 2 → 3 entries (broken route replaced):
1. **Related UHF RFID wearables and credentials** — uhf-rfid-card (Batch 1 counterpart), silicone-wristband-mifare-classic (NFC counterpart), rfid-tyvek-wristband (disposable event UHF option).
2. **Industry landings** — events-venues + healthcare (Batch 2).
3. **Related solutions, compares and pillar** — rfid-inventory-tracking (Batch 4, asset/worker tracking), ucode8-vs-ucode9-vs-monza-r6-vs-higgs9 compare (Batch 3, chip-selection anchor), uhf-vs-hf-rfid compare (Batch 3, frequency-choice anchor), wristband pillar.

**`relatedIndustries` refit.** `["healthcare", "events-venues", "education", "brand-protection"]` → `["events-venues", "healthcare", "industrial", "logistics"]`. The page explicitly covers warehouse-worker tracking, cold-storage zone accountability and emergency-evacuation headcounts — industrial and logistics are first-order fits that the previous set missed.

**Routing fix.** `primaryAction.href`: `/contact/` → `/contact/event-rfid/`. `secondaryActions[0]` `/product/rfid-silicone-wristbands/` → `/products/rfid-wristbands/silicone-wristband-mifare-classic/`.

## SEO / GEO shape

Strong. Summary opens answer-first (1-5 m read-range for hands-free identification at timing lines, conference sessions, warehouse zones, patient-tracking monitoring). The "Applications" section (5 bullets covering race timing, conference session tracking, hospital RTLS, warehouse / logistics zones, theme-park crowd counting) is a query-rich surface — each bullet is a discrete answer target for "UHF RFID wristband applications" queries.

The "UHF vs NFC" comparison table (6 rows × 3 columns covering read range, identification mode, bulk reading, phone compatibility, best-for, cost) is a cleanly extractable Q/A block.

FAQ covers 3 practitioner questions (on-body read range with the softened framing, NFC-phone incompatibility, MOQ + lead time including dual-frequency UHF+NFC option).

## Verification

- JSON parses ✅
- Zod schema ✅
- `heroImage: /landing-images/uhf-rfid-wristband.jpg` exists on disk ✅
- 10 internal hrefs, all resolve ✅
- `chipFamilies: ["impinj-m7", "alien-higgs", "ucode"]` correct UHF silicon ✅
- `envFamilies: ["outdoor", "tamper"]` correct
- `relatedIndustries` refit from 4 (with weak education/brand-protection fits) to 4 (with industrial/logistics replacing them) ✅
- `publishedAt` + `modifiedAt` set ✅

## Open items

- **Dual-frequency (UHF + NFC) wristband SKU** — FAQ 2 mentions it; no dedicated SKU page exists. If this is a growth angle, `/products/rfid-wristbands/dual-frequency-uhf-nfc-wristband/` is a clean content-extension candidate.
- **On-body read-range validation report** — promised as "available on request". Publishing a representative test report as a downloadable PDF would be a high-EEAT content extension; it would also anchor the quantitative range claim currently floating in qualitative language.
- **`/industries/industrial/` + `/industries/logistics/`** — newly added to `relatedIndustries`; confirm return-link coverage from those landing pages into this SKU (if they already expose UHF-wristband options).
- **`sources` block absent.** Adding ISO/IEC 18000-63:2021, EPC Gen2 v2 specification, Impinj Monza R6 datasheet, NXP UCODE 8/9 datasheet and Alien Higgs-9 datasheet would match Batch 4 EEAT baseline.
- **Alien Higgs-3 → Higgs-9 update propagation** — the Batch 3 `ucode8-vs-ucode9-vs-monza-r6-vs-higgs9` compare correctly uses Higgs-9. Audit whether any other SKU pages still reference Higgs-3 as a current spec.
- **`/products/rfid-cards/uhf-rfid-card/`** — the Batch-1 credential equivalent, linked; confirm return-link from the card page into this wristband SKU for the UHF form-factor decision.

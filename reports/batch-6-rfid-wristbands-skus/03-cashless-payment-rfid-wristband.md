# 03 — Cashless Payment RFID Wristband

**File:** `src/content/editorial/products/rfid-wristbands/cashless-payment-rfid-wristband.json`
**Route:** `/products/rfid-wristbands/cashless-payment-rfid-wristband/`
**Status:** Refined, verified.

## Audit (pre-refinement)

- `heroImage` was `/landing-images/cashless-payment-rfid-wristband.jpg` — verified on disk; **no change needed**.
- `publishedAt` / `modifiedAt` absent.
- `imageSourceRoutes` carried `/lp/rfid-wristband-factory/` — the file lives in `_unused/` and does NOT resolve on the live site.
- `faq[1]` carried "banking-grade security standards" overclaim wording without scope boundary.
- `faq[2]` carried "This process typically takes under 2 minutes" specific timing.
- `resourceCards` had 1 entry with broken `/lp/rfid-wristband-factory/` route and no Batch 2 industry links, no Batch 3 compare links, no Batch 4 solution link despite being the flagship event-cashless SKU.
- `secondaryActions[0]` used broken `/lp/rfid-wristband-factory/`.
- `primaryAction.href` was bare `/contact/` (broken).
- `relatedIndustries: ["events-venues", "hospitality", "education", "brand-protection"]` — education and brand-protection are weak fits for a cashless-payment wristband.
- `chipFamilies: ["ntag21x", "mifare-desfire", "mifare-ultralight"]` — **correct**; no facet fix needed.
- `envFamilies: ["outdoor", "tamper"]` — correct.

## Changed

**Image.** No change.

**Metadata.** Added `publishedAt: "2026-04-22"`, `modifiedAt: "2026-04-23"`.

**`imageSourceRoutes`.** `/lp/rfid-wristband-factory/` (unusable) → `/products/rfid-wristbands/fabric-rfid-wristband/` + `/products/rfid-wristbands/rfid-adjustable-silicone-wristband/` (the two material siblings most commonly used for cashless-payment deployments).

**Claim hygiene — FAQ section.** "banking-grade security standards" → more precise "AES-128 encryption, mutual authentication, and anti-cloning protection at the chip level", with the critical scope note added: "Closed-loop wallet architectures (where the card data lives in the backend, not on the wristband) typically keep the wristband itself out of PCI-DSS scope — confirm the scope assessment with your cashless-platform vendor." This is the factually correct PCI framing and matches the pillar page. FAQ 3 "under 2 minutes" timing removed; replaced with procedural description.

**Cross-link density.** Expanded `resourceCards` from 1 → 3 entries (broken route removed):
1. **Related event and festival RFID wristbands** — fabric-rfid-wristband, rfid-tyvek-wristband, rfid-adjustable-silicone-wristband.
2. **Industry landings** — events-venues + hospitality (Batch 2).
3. **Related solutions, compares, guides and pillar** — rfid-event-access-control (Batch 4, the flagship solution for this SKU), mifare-plus-ev2-vs-desfire-ev3 chip compare (Batch 3, the most security-relevant decision for cashless), festival RFID blog, wristband pillar.

**`relatedIndustries` tightening.** `["events-venues", "hospitality", "education", "brand-protection"]` → `["events-venues", "hospitality"]`. Cashless-payment wristbands are essentially a 2-vertical SKU.

**Routing fix.** `primaryAction.href`: `/contact/` → `/contact/event-rfid/`. `secondaryActions[0]` broken `/lp/rfid-wristband-factory/` → `/products/rfid-wristbands/` (pillar).

## SEO / GEO shape

Strong. Summary opens answer-first (embedded cashless-payment chip for festivals/resorts/theme parks/cruise). The "How cashless payment wristbands work at events" section is a 4-step answer block ideal for "how do cashless payment wristbands work" queries — each bullet is a discrete step in the top-up → tap → analytics → refund lifecycle.

The "Chip selection for cashless payment applications" section is the strongest answer block on the page: 4 bullets covering MIFARE DESFire EV2/EV3 (AES-128), Ultralight EV1 (token-based), NTAG 213/216 (cloud-wallet), plus the platform-compatibility list (Intellitix, Glownet, PlayPass, Tappit) — a quotable recommendation block for "what chip for festival cashless wristband" queries.

FAQ covers 3 practitioner questions (platform compatibility, fraud security with explicit PCI scope caveat, lost-wristband recovery procedure).

## Verification

- JSON parses ✅
- Zod schema ✅
- `heroImage: /landing-images/cashless-payment-rfid-wristband.jpg` exists on disk ✅
- 10 internal hrefs, all resolve ✅
- `chipFamilies: ["ntag21x", "mifare-desfire", "mifare-ultralight"]` correct ✅
- `envFamilies: ["outdoor", "tamper"]` correct
- `relatedIndustries` tightened to 2 first-order verticals ✅
- `publishedAt` + `modifiedAt` set ✅

## Open items

- **PCI-DSS v4.0 explicit reference** — the pillar page discusses PCI scope in detail; this SKU page now acknowledges it but does not deep-link to the EMVCo / PCI guidance. If open-loop EMV contactless wristbands are a product direction, a dedicated `/guides/rfid-wristband-pci-dss-scope/` page is a clean extension.
- **Named cashless-platform partnerships** — Intellitix, Glownet, PlayPass, Tappit, CrowdBlink are named. If any of these is a formal Proud Tek partnership, naming with context + a partner-integration page is editorially cleaner.
- **MIFARE Classic 1K NOT recommended for new cashless deployments** — the pillar page correctly warns against this; this SKU page omits the warning. Consider adding an explicit "do-not-specify" line for MIFARE Classic 1K in new cashless projects.
- **`/products/rfid-wristbands/fabric-rfid-wristband/`** — linked but not Batch-6-refined. Natural Batch 6b candidate alongside the sibling material SKUs.
- **`sources` block absent.** Adding NFC Forum Type 4, ISO/IEC 14443-3, NXP DESFire EV3 datasheet, Intellitix / Tappit case-study citations would match Batch 4 EEAT baseline.

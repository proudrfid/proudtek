# Batch 6c — Final 7 wristband SKUs

**Date:** 2026-04-23
**Status:** Complete. All 7 refined files JSON-parse, all internal hrefs resolve, all hero images present on disk, and all three date fields (`publishedAt`, `modifiedAt`, `reviewedAt`) are set to 2026-04-23.

## Scope

Batch 6c closes out the `products/rfid-wristbands/` corpus after Batch 6 (6 SKUs), Batch 6b (6 SKUs), and the two in-session dedup merges (nfc-payment → cashless-payment, tyvek-rfid → rfid-tyvek). The seven remaining SKUs below were all at `reviewedAt: 2026-04-22` with `publishedAt` / `modifiedAt` absent, at least some broken singular `/product/` hrefs, and `primaryAction` pointing at the broken bare `/contact/` root.

| # | SKU | Principal refinement |
|---|---|---|
| 1 | `pvc-rfid-wristband` | Cost-tier material table; IP67 source block; expanded `brief`; 3-tier resourceCards. |
| 2 | `rfid-vinyl-wristband` | Literature-attributed AHLA / CLIA Typical-outcomes; DESFire EV2/EV3 FAQ; dropped `pharmaceutical` + `healthcare` ghost industries. |
| 3 | `rfid-nylon-wristband` | IHRSA + AHLA attribution intro; dropped `pharmaceutical` + `laundry-services` ghosts; added `envFamilies`. |
| 4 | `elastic-rfid-wristband` | IHRSA attribution; added Typical-outcomes + Customization sections; dropped `healthcare` ghost. |
| 5 | `rfid-prison-wristband` | ACA / NIJ / GUARDIAN-RFID attribution; dropped full-ghost `["pharmaceutical","luxury-brands","brand-protection","logistics"]` → `["government-defense-supply-chain","healthcare"]`. |
| 6 | `nfc-fitness-wristband` | IHRSA attribution; expanded `relatedIndustries` from single-item `["fitness"]` → three-industry; added DESFire EV2/EV3 FAQ. |
| 7 | `rfid-wristband-qr-nfc` | Eventbrite / Live Nation / AEG attribution; dropped `["luxury-brands","brand-protection","industrial"]` ghosts; added cashless-platform FAQ and ISO/IEC 18004 QR source. |

## Claim-hygiene pattern applied across all 7 SKUs

1. **Episodic figures softened with literature-attribution intro.** Every `Typical outcomes` section now carries an intro paragraph citing the relevant industry body (IAAPA, AHLA, IHRSA, ACA, NIJ, CLIA, Eventbrite / Live Nation / AEG, Intellitix / Glownet / Tappit) and its published operations reports.
2. **Specific percentages / dollar / cycle-count figures replaced with qualitative language** ("materially lower", "a non-trivial rate", "an extended service life measured in quarters, not months") while preserving the underlying directional claim.
3. **Absolute dollar figures in the PVC material-compare table** converted to cost tiers (`$` / `$$` / `$$$`) matching the Batch 6 / Batch 6b pattern established on the cashless-payment and rfid-tyvek merges.
4. **MIFARE Classic CRYPTO-1 caveat + DESFire EV2/EV3 / Plus EV2 upgrade-path language** added to every SKU that carries `mifare-classic` in `chipFamilies` (pvc, vinyl, nylon, elastic, fitness, qr-nfc).
5. **Batch 4-style `sources` block** added to every SKU with 4-5 authoritative references (NXP datasheets, NIJ / ACA / IHRSA / AHLA operations reports, cryptanalysis papers, ISO/IEC standards).

## Structural pattern applied

- **5 sections minimum** (pvc has 6 because it keeps the material-compare table as a standalone section). The canonical Batch 6 section set is: Challenges / How-solves / Typical-outcomes / Applications / Customization.
- **5 FAQs minimum** on every SKU.
- **3 resourceCards**: material & form-factor comparisons / industry & solution context / related wristband SKUs.
- **`sources` block** with 4-5 entries.
- **3 date fields** all set to 2026-04-23: `publishedAt`, `modifiedAt`, `reviewedAt`.

## Ghost-industry cleanups (significant)

| SKU | Ghost dropped | Retained / added |
|---|---|---|
| `rfid-vinyl-wristband` | `pharmaceutical`, `healthcare` | `events-venues`, `hospitality` |
| `rfid-nylon-wristband` | `pharmaceutical`, `laundry-services` | `fitness`, `hospitality`, `events-venues` |
| `elastic-rfid-wristband` | `healthcare` | `fitness`, `education`, `events-venues` |
| `rfid-prison-wristband` | `pharmaceutical`, `luxury-brands`, `brand-protection`, `logistics` (all ghost) | `government-defense-supply-chain`, `healthcare` |
| `nfc-fitness-wristband` | (none, but thin) | `fitness`, `hospitality`, `events-venues` — expanded from single-item |
| `rfid-wristband-qr-nfc` | `luxury-brands`, `brand-protection`, `industrial` | `events-venues`, `hospitality` |

## Broken-singular-href cleanups

All seven SKUs had some combination of `/product/rfid-silicone-wristbands/`, `/product/rfid-wristbands-for-events/`, `/product/rfid-cards/`, `/product/rfid-key-fobs/`, `/product/nfc-ring/`, `/product/rfid-silicone-wristband/` (non-existent singular), and `/lp/rfid-wristband-factory/` (doesn't exist — the real LP is `/lp/rfid-wristband-manufacturer/`). The pre-refinement singular-href counts per audit were:

| SKU | Pre-refine broken | Post-refine broken |
|---|---|---|
| pvc-rfid-wristband | 6 | 0 |
| rfid-vinyl-wristband | 2 | 0 |
| rfid-nylon-wristband | 2 | 0 |
| elastic-rfid-wristband | 4 | 0 |
| rfid-prison-wristband | 2 | 0 |
| nfc-fitness-wristband | 6 | 0 |
| rfid-wristband-qr-nfc | 0 (no broken, but 2 lp-factory pointers) | 0 |

## Primary-action `/contact/` sub-route assignments

| SKU | primaryAction |
|---|---|
| pvc-rfid-wristband | `/contact/event-rfid/` |
| rfid-vinyl-wristband | `/contact/hotel-rfid/` |
| rfid-nylon-wristband | `/contact/hotel-rfid/` |
| elastic-rfid-wristband | `/contact/hotel-rfid/` |
| rfid-prison-wristband | `/contact/rfid-labels-tags/` |
| nfc-fitness-wristband | `/contact/hotel-rfid/` |
| rfid-wristband-qr-nfc | `/contact/event-rfid/` |

## Verification

- ✅ All 7 files JSON-parse.
- ✅ 73 internal hrefs across all 7 SKUs all resolve against the 484-route editorial corpus.
- ✅ 7 / 7 hero images present on disk at the referenced `/landing-images/` paths.
- ✅ 7 / 7 have `publishedAt` + `modifiedAt` + `reviewedAt` = 2026-04-23.
- ✅ 7 / 7 have valid `/contact/` sub-route on `primaryAction` (no more bare `/contact/`).
- ✅ 7 / 7 carry a `sources` block with 4-5 entries.

## Cumulative wristband-corpus status

- **Batch 6:** 6 SKUs refined (hospital-patient-id, rfid-waterpark, cashless-payment, silicone-wristband-mifare-classic, rfid-tyvek, uhf-rfid).
- **Batch 6b:** 6 SKUs refined (tyvek-rfid, fabric-rfid, paper-rfid, rfid-adjustable-silicone, rfid-child, nfc-medical-alert).
- **In-session dedup merges:** 2 (nfc-payment → cashless-payment; tyvek-rfid → rfid-tyvek). Two files deleted, two 301 redirects added to `public/_redirects`, 17 inbound references updated.
- **Batch 6c:** 7 SKUs refined (pvc-rfid, rfid-vinyl, rfid-nylon, elastic-rfid, rfid-prison, nfc-fitness, rfid-wristband-qr-nfc).

**Corpus total:** 19 refined SKUs + 2 merged / deleted + `_pillar.json` = the full `products/rfid-wristbands/` set is now at Batch-6-standard across the board.

## Open items

- **Build smoke-test.** `astro build` has not been run since the final refinement batch closed. Recommended as the next action before any further dedup or schema-extension work.
- **Schema-extension candidate.** The PVC `sources` block, the DuPont Tyvek datasheet citation on rfid-tyvek, and the NIJ / ACA references on rfid-prison are the three strongest EEAT signals in the corpus — a `renderSources(sources)` UI component on the product-page template would surface these to readers and search engines.
- **`_pillar.json` narrative review.** The pillar page was touched twice during the dedup merges but has not been reviewed for consistency with the Batch 6/6b/6c SKU set — a narrative pass on the pillar would close out the wristband-corpus workstream.

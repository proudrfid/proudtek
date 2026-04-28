# Batch 6b — RFID Wristband SKUs (continued)

**Scope:** 6 SKUs from the 14-file `/products/rfid-wristbands/` backlog remaining after Batch 6, picked by cross-reference density from Batch 6's resourceCards and by duplicate-cluster urgency.

**Files refined:**
1. `tyvek-rfid-wristband.json` — duplicate-cluster sibling of the Batch-6 `rfid-tyvek-wristband`
2. `fabric-rfid-wristband.json`
3. `paper-rfid-wristband.json`
4. `rfid-adjustable-silicone-wristband.json`
5. `rfid-child-wristband.json`
6. `nfc-medical-alert-wristband.json`

**Status:** All 6 refined, 89/89 internal hrefs resolve, 6/6 heroImages verified on disk, all 6 pass Zod schema shape.

## Cross-cutting findings

1. **`/contact/` root breakage remains systemic.** All 6 files had bare `/contact/`; fixed per-SKU to the appropriate sub-route (event-rfid / hotel-rfid / rfid-labels-tags) by vertical. This matches the Batch 6 pattern — root `/contact/` appears universally broken across the `rfid-wristbands` collection.

2. **Broken singular `/product/<slug>/` routes are universal.** All 6 files had at least 2 broken `/product/...` routes in `imageSourceRoutes` or `secondaryActions`. Plural `/products/<category>/<slug>/` is canonical. **Flag: this suggests a content-migration cleanup across the full site is overdue — not just in wristbands.**

3. **Non-existent wristband slugs referenced.** Four previously-assumed slugs don't exist on disk:
   - `rfid-silicone-wristband` (referenced by adjustable-silicone + medical-alert)
   - `rfid-event-wristband` (referenced by adjustable-silicone)
   - `rfid-hospital-patient-wristband` (referenced by medical-alert — should be `hospital-patient-id-wristband`)
   - `coconut-shell-rfid-wristband` (referenced by adjustable-silicone)

   All replaced with real siblings; flag as a site-wide ghost-slug audit candidate.

4. **Claim-hygiene load was highest on `tyvek-rfid-wristband` and `rfid-adjustable-silicone-wristband`.** The tyvek page was dollar-figure-dense (5 different $ ranges, 4 different throughput claims, 1 fraud-rate claim, 1 spend-lift claim) — all softened with a literature-attribution intro on the Results section. The adjustable-silicone page carried waste-volume (50K-200K units), SKU-count (3-5), temperature (-40 / +120 C), cycle-count (500+ / 100K+ / 500K+) and per-member cost ($1-3) claims — all softened.

5. **Duplicate-cluster resolution: tyvek-rfid-wristband + rfid-tyvek-wristband.** Both resolve; treating as intentional split for now with clear angle differentiation: `rfid-tyvek-wristband` (Batch 6) = festival-operations angle, `tyvek-rfid-wristband` (this batch) = procurement-cost angle. Each now explicitly cross-links the other. **Requires Peter's sign-off: keep both as angles or merge-plus-301 to a single canonical URL.**

6. **`relatedIndustries` refits / tightenings:**
   - `tyvek-rfid-wristband`: 1 → 2 (added `hospitality` for resort day-pass footprint)
   - `paper-rfid-wristband`: 4 → 2 (dropped `luxury-brands` + `brand-protection` weak fits; kept `events-venues` + `healthcare` first-order)
   - `rfid-adjustable-silicone-wristband`: 1 → 3 (added `hospitality` + `events-venues` to the existing `fitness`)
   - `rfid-child-wristband`: 4 → 3 (dropped `brand-protection` weak fit; kept `hospitality` + `events-venues` + `education`)
   - `nfc-medical-alert-wristband`: 4 → 1 (dropped `pharmaceutical` + `luxury-brands` + `brand-protection`; kept `healthcare` as the sole first-order fit)

7. **MIFARE Classic CRYPTO-1 caveat propagation.** The `rfid-adjustable-silicone-wristband` spec bullet mentioning MIFARE Classic now carries the inline CRYPTO-1 + DESFire EV3 / Plus EV2 migration note, matching the Batch 6 silicone-mifare-classic and waterpark wristband pattern.

8. **Healthcare credential cross-linking strengthened.** `nfc-medical-alert-wristband` now cross-links to `hospital-patient-id-wristband` (Batch 6, the clinical Joint-Commission-aligned SKU) — these two are the primary healthcare wristband pair and the cross-link was previously missing.

9. **Cross-link density expanded 1 → 3 cards per SKU** (industry cluster + solutions/compares cluster + pillar added to every SKU's resourceCards where absent).

10. **The `/lp/` stale-route audit remains open.** None of the Batch 6b files referenced `/lp/rfid-wristband-factory/`, but the site-wide audit flagged in Batch 6 is still pending.

## Verification summary

| SKU | hrefs | broken | hero | publishedAt | modifiedAt |
| --- | ---: | ---: | :---: | :---: | :---: |
| tyvek-rfid-wristband | 15 | 0 | ✅ | ✅ | ✅ |
| fabric-rfid-wristband | 15 | 0 | ✅ | ✅ | ✅ |
| paper-rfid-wristband | 15 | 0 | ✅ | ✅ | ✅ |
| rfid-adjustable-silicone-wristband | 16 | 0 | ✅ | ✅ | ✅ |
| rfid-child-wristband | 15 | 0 | ✅ | ✅ | ✅ |
| nfc-medical-alert-wristband | 13 | 0 | ✅ | ✅ | ✅ |
| **TOTAL** | **89** | **0** | **6/6** | **6/6** | **6/6** |

## Action summary

- **6 files changed** (all 6 Batch-6b SKUs refined)
- **~30 episodic $ / % / specific-count claims softened** with literature-attribution framing
- **12 broken singular `/product/<slug>/` routes fixed**
- **4 non-existent wristband-slug references swapped** to real siblings
- **6 `/contact/` root fixes** to the correct vertical sub-route
- **15 resourceCards entries added** (all 6 expanded from 1-2 cards to 3 cards each)
- **5 `relatedIndustries` tightenings/refits** (only `fabric-rfid-wristband` kept original `events-venues` + `retail-apparel`)
- **1 MIFARE Classic CRYPTO-1 caveat** propagated to adjustable-silicone
- **89/89 hrefs resolve** across the batch
- **6/6 heroImages verified** on disk
- **6/6 files pass Zod schema shape** (required fields + allowed keys)

## Top 3 open items

1. **Tyvek duplicate-cluster decision.** `/products/rfid-wristbands/tyvek-rfid-wristband/` + `/products/rfid-wristbands/rfid-tyvek-wristband/` both resolve. Current state: intentional angle-split (procurement-cost vs festival-operations) with mutual cross-links. Decision needed: keep both or merge-plus-301 to a single canonical URL.

2. **Ghost-slug site-wide audit.** Four wristband slugs referenced but not existing (`rfid-silicone-wristband`, `rfid-event-wristband`, `rfid-hospital-patient-wristband`, `coconut-shell-rfid-wristband`). Suggests ghost-slug rot elsewhere in the site — run a full editorial-JSON href sweep to catch all.

3. **Remaining 8 wristband SKUs for Batch 6c.** `rfid-vinyl-wristband`, `rfid-prison-wristband`, `rfid-nylon-wristband`, `pvc-rfid-wristband`, `nfc-payment-wristband` (near-duplicate of cashless-payment — requires dedup decision), `nfc-fitness-wristband`, `elastic-rfid-wristband`, `rfid-wristband-qr-nfc`. Plus the still-deferred Batch 5b (~60 `rfid-labels` SKUs).

## Open items to Peter

- Confirm the tyvek-cluster dedup decision (split vs merge-plus-301).
- Confirm the `nfc-payment-wristband` vs `cashless-payment-rfid-wristband` relationship — suspected near-duplicate; needs the same split-vs-merge decision as tyvek.
- Confirm scope for Batch 6c (remaining 8 wristband SKUs) vs Batch 5b (rfid-labels SKUs).

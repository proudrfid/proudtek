# Image Fix — execution report (2026-06-09, afternoon pass)

Follow-up to `IMAGE_AUDIT_REPORT.md` (this morning's 400-image audit). This pass: **spot-checked that audit (verdict: reliable), extended coverage to the remaining 115 pages (total 515/515), and applied fixes.**

## Summary

| | count |
|---|---|
| Pages audited (cumulative today) | 515 (400 AM + 115 PM) |
| **Fixed in this pass — applied, in working tree** | **76 pages** |
| — wrong-topic / competitor-logo swaps (in-repo reuse) | 56 |
| — broken heroes repaired (file was missing on disk) | 10 |
| — PII remediation repoints | 11 |
| + 1 code fix: `compatibility/index.astro` fallback pointed at a PII image | |
| ✅ Web applies completed 2026-06-11 (commit 3007e21): 7 Commons images → 8 pages, specimen hero cropped to 16:10, PII file pairs deleted from worktree | 8 pages |
| No-swap: too niche for free imagery, needs own product photo | 4 pages |
| Borderline, noted not changed (house guardrail) | ~15 pages |

All swaps reused **pixel-verified** images (every source viewed; license/attribution carried through `_credits/` sidecars and `imageCredit`). New per-page heroes follow the pipeline convention `/landing-images/<slug>-hero.jpg(+webp)`; originals left in place.

## A. Corrections to the AM audit (spot-check findings)

- `rfid-food-safety-traceability` (guides) — **downgraded** from mismatch to borderline (farm-produce scene is generic-but-on-theme for a farm-to-fork guide). Not swapped.
- The other 11/12 sampled clean calls and 4/4 re-verified flags confirmed. Counts internally consistent.

## B. Supplementary audit (115 pages not covered this morning)

New clear findings, all fixed:

- **11 lp pages** all shared `/landing-images/industrial.webp` (a car-factory robot-welding photo) — each got a distinct product-relevant hero.
- **Competitor logos:** `rfid-textile-laundry-tag.jpg` is a JYL-Tech® product sheet (was live on `compare/pps-vs-silicone-laundry-tags` + `contact/laundry-rfid`); `dual-frequency-rfid-card.webp` carries an RFIDCard™ wordmark (was live on 2 compare pages + 1 product page).
- `contact/rfid-labels-tags` showed a **cannabis bud photo** on the general labels-inquiry page.
- `industries/retail-apparel` showed an HF/EAS spiral coil on a UHF/RAIN mandate page.
- `compare/acr1252u-vs-omnikey-5022` showed a warehouse gun-grip terminal on a desktop-encoder comparison.
- **10 broken heroes** (7 case-studies, `compare/em4100-vs-t5577`, `lp/sample-pack`, `resources/downloads`) referenced files that never existed — repaired with verified in-repo images.

## C. PII remediation (11 pages repointed; files deleted by the script)

`ppc-custom-rfid-cards.jpg` / `ppc-hotel-key-cards.jpg` / `rfid-student-id-card.jpg` reproduce a **real Haikou Meilan Airport staff badge — actual person's photo, name (王梦瑶), badge no., validity dates**; `iso-14443-explained-hero.jpg` showed a dissected bank card with a readable cardholder name/partial PAN (file already replaced under `-v2`). Repointed: lp/custom-rfid-card-printing, industries/education, compare/nfc-vs-bluetooth, compare/metal-vs-wood-vs-pvc-nfc-business-cards, compare/rfid-vs-ble-asset-tracking, products/rfid-student-id-card, contact/hotel-rfid, compare/pvc-vs-wood-vs-pla-hotel-key-cards, compare/hotel-key-cards-vs-hotel-wristbands, guides/iso-14443-explained (+ compare/rfid-hotel-card-vs-magnetic-stripe via the script). The script `rm`s the four PII file pairs (+`_originals` backup). They remain in **git history** — consider a BFG purge if the repo is public.

## D. Pending web applies (run `bash apply-image-fixes.sh`)

| page | new image | license / author |
|---|---|---|
| rfid-race-timing-tag | ChampionChip transponder macro | CC BY-SA 3.0 · Blaubus |
| fabric-rfid-wristband | 8 woven festival bands w/ sliders | CC BY-SA 3.0 · Zavijava2 |
| rfid-card-magnetic-stripe-combo · rfid-hotel-card-vs-magnetic-stripe | hotel key card w/ visible magstripe | CC BY-SA 3.0 · Jackie |
| rfid-ski-pass-card-season | Dolomiti Superski RFID skipass (specimen) | CC BY-SA 3.0 · Llorenzi (797px — smallest pick) |
| handheld-uhf-rfid-reader | handheld terminal scanning inventory, no readable brand | Public domain · U.S. DOE |
| rfid-specimen-slide-label | box of labeled microscope slides (script crops to 16:10) | CC BY 4.0 · Wellcome Collection |
| rfid-surgical-instrument-tag | surgical instruments on drape | CC0 |

## E. No-swap — needs Proudtek's own product photography

`rfid-epoxy-tag` (flat epoxy dome), `rfid-temperature-sensor-tag`, `rfid-wedge-tag` (pipe/cable-tray clip), `transparent-nfc-card`. Commons/CC sources have nothing product-true; swapping wrong-for-wrong was rejected. Their current (still mismatched) heroes are listed in `IMAGE_AUDIT_REPORT.md` §B.

## F. Borderline — noted, not changed (guardrail: never swap on borderline)

From AM report: `rfid-item-level-tagging-cost-model-apparel`, `medical-device-udi-rfid-combined-implementation`, `rfid-food-safety-traceability` (downgraded). From PM audit: markets/`uk` + 9 other market pages share the car-factory `industrial.webp` (acceptable "manufacturer" framing, sharpest clash on uk); `compare/google-review-nfc-card-vs-nfc-sticker` (person w/ phone, no product); `compare/ntag213-vs-ntag215-vs-ntag216` (app screenshot); `compare/rfid-vs-magnetic-hotel-key-cards` (wrong-headline infographic); `compatibility/miwa-hotel-key-cards` (corridor w/ WC sign); `contact/rfid-readers` (de-branded Zebra-form handheld); `about/factory`, `about/review-board`, root `contact`, root `index` (**homepage hero is a textile/blanket factory, not RFID production** — flagging for a deliberate decision); lp/`rfid-solution-provider`, lp/`uhf-rfid-tag-manufacturer`.

## G. Known caveats on applied picks

- **Low-res sources (consider re-shoot/upscale):** uhf-rfid-apparel-hang-tag.jpg (502px → retail-apparel SKU), nfc-tap-to-pay-sticker.jpg (600px → desktop-nfc-reader-encoder + acr1252u compare), uhf-rfid-reader-api-guide-hero.jpg (500px), rfid-race-timing-hero.jpg (500px, identifiable runner faces — editorial-use OK for a blog).
- `laundry-rfid` (contact) hero is the designed "Selection Guide" banner — baked-in English headline on an inquiry page.
- `google-review-card-placement-guide` + `google-review-cards-for-multi-location-brands` share the same French-language review-stand photo ("Partagez votre expérience").
- Some images now serve 2–3 related pages (pipeline keeps per-page copies, so future swaps stay independent). Heaviest: rfid-asset-label (3), mifare-ultralight-c-cards-bulk (3), t5577-keyfob (3 incl. previous use).
- 6 corrupt 29-byte stubs in `blog-images/` (HTML-404 saved as .jpg): access-control.jpg, door-access-panel.jpg, hotel-card-reader.jpg, hotel-chip-compare.jpg, logistics.jpg, windshield-tag.jpg — none referenced by a live hero; safe to delete.
- `rfid-wristbands-pillar.jpg` contains a readable **ASSA ABLOY** wristband; pillar/aggregate pages were out of audit scope — check where it renders.
- Cache-bust renames (`-hero-v2`) were used where the new hero replaced a same-named old file: google-review-card-placement-guide, rfid-access-control, nfc-event-ticket-sticker, nfc-medical-alert-wristband, iso-14443-explained.

## How this was verified

Every reused in-repo image was opened and judged against the page title/kicker/summary (5 fan-out agents + manual review; the false-positive-averse rules in `.claude/skills/image-audit/SKILL.md`). Every Commons pick was viewed as pixels (thumbnail contact-sheets via the Commons API) and its license/author read from the API metadata. Spot verification of applied results: cropped contactless-tap hero, laundry banner, windshield stickers, tag collage. JSON integrity re-checked via `list-targets.mjs` after applies.

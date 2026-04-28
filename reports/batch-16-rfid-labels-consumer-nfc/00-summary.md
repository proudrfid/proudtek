# Batch 16 — rfid-labels consumer NFC + pathology

**Date:** 2026-04-23
**Cluster:** `rfid-labels`
**SKUs refined:** 6
**Cluster progress after batch:** 48 / 58 (~83 %)

## Scope

Batch 16 split into two sub-groups:

- **Thin SKUs with full depth extension** (sec 2 → 4): `nfc-tap-to-pay-sticker`, `rfid-specimen-slide-label`. These SKUs were short stubs that needed regulatory + integration depth — payments rail for the tap-to-pay sticker, CAP/CLIA/Joint Commission pathology compliance for the slide label.
- **Deep SKUs with hygiene + FAQ + sources only** (sec already 6-8): `nfc-shelf-label`, `nfc-smart-poster-tag`, `nfc-social-media-tag`, `nfc-gaming-collectible-tag`. These already had rich marketing narrative; they needed legacy-route fixes, primaryAction migration, dates, FAQ 3→5 and 8-entry sources arrays.

## Treatment (uniform across all 6 SKUs)

1. **Legacy `/product/...` imageSourceRoutes + resourceCards + secondaryActions** → migrated to intra-cluster `/products/rfid-labels/<slug>/` neighbors.
2. **FAQ 3 → 5** — appended one regulatory/standards Q&A + one platform/ecosystem Q&A per SKU.
3. **Sources 0 → 8** — schema-valid label/url/publisher triples per SKU.
4. **Dates** — added `publishedAt: "2026-04-22"` + `modifiedAt: "2026-04-23"` + bumped `reviewedAt` to `"2026-04-23"`.
5. **primaryAction** — migrated `/contact/` → `/contact/rfid-labels-tags/`.
6. **For the two thin SKUs** — sections 2 → 4 with regulatory + integration-layer depth.

## Regulatory / platform anchors

| SKU | Anchor |
| --- | --- |
| nfc-tap-to-pay-sticker | EMVCo / PSD2 SCA (EU 2015/2366 + 2018/389) / PCI DSS v4.0 / Apple Core NFC + W3C Payment Request API |
| rfid-specimen-slide-label | CAP AP Checklist ANP.11605/22570 + CLIA 42 CFR Part 493 + Joint Commission NPSG.01.01.01 + ISO 15189:2022 + DICOM Supplement 145 WSI + FDA 510(k) IntelliSite/Aperio |
| nfc-shelf-label | ESL coexistence (SES-imagotag Vusion, Pricer Plaza, Hanshow Nebular) + EU 98/6/EC Price Indication Directive + in-store analytics (RetailNext, ShopperTrak, Placer.ai) |
| nfc-smart-poster-tag | Apple Core NFC https:// requirement + Android App Links + Geopath/Lumen OOH measurement complementarity |
| nfc-social-media-tag | Instagram/TikTok/LinkedIn universal-link deep linking + Linktree/Beacons/Stan Store multi-link pattern |
| nfc-gaming-collectible-tag | Amiibo data format (AES-128 + HMAC-SHA256) + Nintendo trademark constraints + FDM/resin embedding geometry for Switch/3DS/Wii U |

## Verification

- `npx astro sync` — clean, 807 ms, zero schema errors.
- `grep -c '"/product/'` across all 6 — all 0.
- Counts:
  - `nfc-tap-to-pay-sticker`: sec=4, faq=5, src=8, rev=2026-04-23, pa=/contact/rfid-labels-tags/
  - `rfid-specimen-slide-label`: sec=4, faq=5, src=8, rev=2026-04-23, pa=/contact/rfid-labels-tags/
  - `nfc-shelf-label`: sec=6, faq=5, src=8, rev=2026-04-23, pa=/contact/rfid-labels-tags/
  - `nfc-smart-poster-tag`: sec=7, faq=5, src=8, rev=2026-04-23, pa=/contact/rfid-labels-tags/
  - `nfc-social-media-tag`: sec=7, faq=5, src=8, rev=2026-04-23, pa=/contact/rfid-labels-tags/
  - `nfc-gaming-collectible-tag`: sec=6, faq=5, src=8, rev=2026-04-23, pa=/contact/rfid-labels-tags/

## Thematic cohesion

Batch 16 reads as the **consumer-facing NFC + laboratory identity** layer of the rfid-labels cluster. Four of the six SKUs are thin-tag consumer-engagement form factors (payment, shelf, smart-poster, social-media, gaming) unified by the NFC Forum NDEF + Apple Core NFC + Android App Links stack, with differentiation coming from the vertical's platform ecosystem (EMVCo/PSD2 for payments, ESL platforms for shelf, Geopath/Lumen for OOH, universal-link platforms for social, Amiibo/Switch for gaming). The two non-consumer SKUs — `nfc-tap-to-pay-sticker` (straddles consumer + payments regulation) and `rfid-specimen-slide-label` (pathology lab identity) — both pivot on a dense regulatory framework (PSD2 SCA / CAP + CLIA + ISO 15189) that operationally drives the chip and encoding selection.

## Batch 17 candidates

Remaining rfid-labels SKUs for Batch 17 (10 left — 48/58 → 58/58 completion of the cluster):

- **Commodity media tail:** `uhf-rfid-paper-label`, `uhf-rfid-blank-label`, `uhf-rfid-inlay`, `nfc-wet-inlay`, `nfc-dry-inlay`
- **Remaining inlay SKUs:** `impinj-m730-uhf-inlay`, `impinj-m750-uhf-inlay`
- **NFC table stand:** `nfc-table-stand` (sec=7, hygiene-only)
- **2 yet-to-be-identified** — audit remaining slugs to confirm the final 58-SKU list and fill any gap.

Estimated Batch 17 size: 6 SKUs (mostly hygiene + FAQ + sources on already-deep files, with light depth extension where chip-datasheet focus allows it) → cluster 54 / 58 (~93 %).

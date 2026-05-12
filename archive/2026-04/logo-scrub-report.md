# Product image competitor-logo scrub — 2026-04-18

## Summary

Scrubbed competitor brand marks from the 10 product images on `/products/all/` that were carrying them. Nine images were cleaned in place (paint-over or crop), one was swapped to a clean alternative via `CATALOG_IMAGE_OVERRIDES`.

Originals are preserved at `public/landing-images/_originals/`.

The post-scrub audit reports:

```
Total products:           247
Unique images:            247
Duplicate groups:         0
Products with no image:   0
```

— the dedup pass from 2026-04-18 is still intact.

## Offenders fixed

| # | Image | Competitor mark | Fix |
| - | --- | --- | --- |
| 1 | `rfid-bolt-tag.jpg` (800×800) | "SIVAS" teal banner top + tagline banner bottom (plus teal border on all 4 sides) | Cropped to the interior region (x 16–785, y 119–688) and rescaled onto a white 800×800 canvas |
| 2 | `rfid-gas-cylinder-tag.webp` (500×500) | Great Creativity logo top-left + product title text on bottom | Painted both regions white (0,0→215,125 and 0,410→500,500) |
| 3 | `rfid-glass-capsule-tag.webp` (450×450) | Great Creativity logo top-left | Painted white (0,0→180,95) |
| 4 | `uhf-rfid-hard-tag.webp` (450×450) | Great Creativity blue ribbon logo top-left | Painted white (0,0→215,100) |
| 5 | `rfid-weapon-tracking-tag.jpg` (400×400) | "COMBAT Weapon Storage Systems" logo bottom-right | Painted black (232,328→400,400) — blends with the dark metallic backdrop |
| 6 | `rfid-cable-seal-tag.png` (600×420) | "By LeghornGroup" attribution bottom-right | Cleared alpha to fully transparent (430,378→600,420) |
| 7 | `rfid-medication-vial-label.jpg` (500×500) | 3M logo block bottom-right (beside ISO/IEC icons) | Painted white (378,365→500,485) — ISO/IEC icons and 25mm marker kept; those are industry-standard, not competitor marks |
| 8 | `rfid-tamper-evident-label.jpg` (750×966) | "3M 9080A Double Coated Tissue Tape" branding printed across the left adhesive sheet | Dropped the 3M-branded sheet entirely — cropped to the right-side tamper label (x 395–720, y 260–800) and recentered on a white 750×966 canvas |
| 9 | `rfid-zip-tie-tag.png` (1200×1200) | "HID" logo embossed on the yellow plastic tag | Dropped the HID-branded yellow tag entirely — cropped to the top green generic tag (x 120–1100, y 80–580) and recentered on a white 1200×1200 canvas |
| 10 | `rfid-textile-laundry-tag.jpg` (1000×1000) | "JYL-Tech" logo + "JYL-FL Linen UHF laundry Tag Family" title printed on blue corporate backdrop | Route-swap via `CATALOG_IMAGE_OVERRIDES`. The image file is too deeply branded for pixelwise cleanup. `/products/rfid-tags/rfid-textile-laundry-tag/` now points at `/site-assets/wp-content/uploads/2024/04/textile_uhf_laundry_tag.jpg` — our own unbranded "hands holding textile UHF tags" photo that was already on disk |

## Files touched

| Path | Change |
| --- | --- |
| `public/landing-images/rfid-bolt-tag.jpg` | overwritten (original in `_originals/`) |
| `public/landing-images/rfid-gas-cylinder-tag.webp` | overwritten |
| `public/landing-images/rfid-glass-capsule-tag.webp` | overwritten |
| `public/landing-images/uhf-rfid-hard-tag.webp` | overwritten |
| `public/landing-images/rfid-weapon-tracking-tag.jpg` | overwritten |
| `public/landing-images/rfid-cable-seal-tag.png` | overwritten |
| `public/landing-images/rfid-medication-vial-label.jpg` | overwritten |
| `public/landing-images/rfid-tamper-evident-label.jpg` | overwritten |
| `public/landing-images/rfid-zip-tie-tag.png` | overwritten |
| `public/landing-images/_originals/*.{jpg,webp,png}` | 9 pristine originals preserved |
| `src/lib/catalog-pages.ts` | +5 lines: one new `CATALOG_IMAGE_OVERRIDES` entry for `rfid-textile-laundry-tag` under a `// Logo scrub 2026-04-18` comment |
| `scripts/clean-logos.py` (in `/sessions/affectionate-brave-clarke/scripts/`) | new PIL script — safe to re-run; reads from `_originals/` on repeat runs |

## Out of scope / deferred

Two other tiers of brand marks were observed during the audit but left alone:

- **Tier B — chip-maker text (NXP / Impinj / Atmel / RFIDcard)** on card / inlay shots: `dual-frequency-rfid-card.webp`, `icode-slix-card.jpg`, `mifare-ultralight-c-card.webp`, `mifare-ultralight-c-cards-bulk.webp`, `ntag215-nfc-sticker.jpg`, `ntag216-nfc-sticker.jpg`, `ntag424-dna-tt-card.png`, `T5577_card.jpg`, `DESFire_card.jpg`, `legic_card.jpg`. These are chip-family identifiers (the customer is *buying* an NTAG/DESFire/ICODE chip, not a branded product) and are typically kept in the industry.
- **Tier C — customer sample brands** on application-shots where the product is being *applied* to a branded item: e.g. Prada/Miu Miu luxury handbag tag, vivo leather keyfob, ekster blocking card, Facebook/Google smart posters, ISSEY MIYAKE membership card. These imply provenance ("we make these for brands like X") and the customer-facing implication of endorsement may actually be intentional marketing. Flag these for Peter's call.

One image's brand reference is actively *on-topic* and was kept: `rfid-card-assa-abloy-compatible.jpg` — the product is literally about ASSA ABLOY compatibility. Same for `Google_review_NFC_card.jpg` — the product is a Google-review NFC card.

## Reproducing / reverting

```bash
# Re-run the clean (reads from _originals/)
python3 /sessions/affectionate-brave-clarke/scripts/clean-logos.py

# Revert an image
cp public/landing-images/_originals/rfid-bolt-tag.jpg public/landing-images/

# Re-run the audit
node scripts/audit-catalog-images.mjs
```

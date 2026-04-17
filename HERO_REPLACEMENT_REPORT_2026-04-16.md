# Hero Image Replacement Report

**Date:** 2026-04-16
**Scope:** All 39 AI-generated hero images in `/public/landing-images/hero/`

## Summary

| Metric | Before | After |
|---|---|---|
| Image source | Pollinations.ai (FLUX.schnell, free AI) | Pexels (real photos) |
| Quality | Mixed — some had warped anatomy, gibberish text, plastic look | Real commercial-grade photography |
| Unique images | 39 (AI-generated, all unique) | 39 (all unique Pexels IDs) |
| Format | 1024×576 JPG + WebP | 1600×900 JPG + WebP |
| License | Pollinations free terms | Pexels License — free for commercial use |
| Total disk | ~6 MB | ~16 MB (higher quality, larger dimensions) |

## What changed

- All 39 AI heroes were replaced with topically-relevant real photos sourced from Pexels via WebSearch + public CDN download.
- Format upgraded from 1024×576 to 1600×900 (better for retina/large displays).
- `manifest.json` updated to v2.0-pexels with new sources, SHA256 hashes, and Pexels IDs.
- `CREDITS.md` rewritten with full source-link table.

## Backup

Original AI files preserved in `public/landing-images/hero/_ai_backup_2026-04-16/`:
- 39 old `.jpg` files
- 39 old `.webp` files
- `manifest.json.bak` (original)
- `CREDITS.md.bak` (original)

Restoration: `cp _ai_backup_2026-04-16/*.jpg .` to roll back.

## How to verify visually

See the side-by-side comparison sheets in this folder:
- `HERO_BEFORE_AFTER_1of5.jpg`
- `HERO_BEFORE_AFTER_2of5.jpg`
- `HERO_BEFORE_AFTER_3of5.jpg`
- `HERO_BEFORE_AFTER_4of5.jpg`
- `HERO_BEFORE_AFTER_5of5.jpg`

Each shows BEFORE (AI) on left, AFTER (Pexels) on right, with slug + Pexels ID labels.

## Pages affected (39 total)

### Compatibility — hotel locks (7)
- be-tech, hafele-dialock, miwa, onity, saflok, salto, vingcard

### Solutions (28)
- Hotel & access: hotel-key-cards, hotel-rfid-access-control, rfid-access-control
- Google Review NFC cards (10): general, restaurants, hotels, retail-stores, gyms, salons-spas, front-desks, checkout-counters, pickup-counters, tabletop-prompts
- NFC business cards & auth (4): nfc-business-card, nfc-business-card-programs, nfc-brand-authentication, nfc-luxury-authentication
- RFID event (2): event-access-control, event-wristbands
- RFID asset/inventory (2): asset-tracking-labels, inventory-tracking
- RFID laundry (3): laundry-tags, laundry-tracking, laundry-management
- Other (4): library-management, attendance-system, parking-management, keyfobs-access-control
- Digital product passport (1)

### Other (4)
- editorial/guides/nfc-business-card-iphone-android-compatibility
- blog (general blog hero)
- product/nfc-sticker
- solutions/digital-product-passport (counted above; total still 39)

## Quality notes

- All images are landscape, ≥30 KB, real commercial photography.
- All Pexels IDs are unique across the 39 heroes (initial run had 2 ID-duplicates which were re-fetched).
- License is permissive: free for commercial use, no attribution required, but the credits table maintains traceability.
- For pages where the website's render-snapshot.ts injects heroes via the manifest, no further action needed — files are at the same paths.

## Files added/changed

```
public/landing-images/hero/
├── manifest.json                       (rewritten, v2.0-pexels)
├── CREDITS.md                          (rewritten)
├── *.jpg  × 39                         (replaced — Pexels)
├── *.webp × 39                         (replaced — Pexels)
└── _ai_backup_2026-04-16/              (NEW: AI originals preserved)
    ├── *.jpg + *.webp × 78
    ├── manifest.json.bak
    └── CREDITS.md.bak
```

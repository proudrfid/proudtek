# Phase 6 #6 — WebP/AVIF Hero Pipeline

**Status:** Shipped. WebP variants built, emit sites updated, npm scripts added.
**Date:** 2026-04-27
**Sibling:** `PHASE-6-IMAGE-COMPRESSION.md` covers the targeted in-place re-encode of 5 worst offenders. This doc covers the systematic pipeline.

---

## What shipped

### 1. Build script — `scripts/build-image-variants.py`

Walks `public/landing-images/` and generates a sibling `.webp` for every `.jpg` / `.jpeg` / `.png`. Pillow-based, deterministic, idempotent.

Run via:

```bash
npm run images:build-webp        # only generate missing
npm run images:rebuild-webp      # force regenerate everything
# or directly:
python3 scripts/build-image-variants.py [--force] [--quiet]
```

Settings: WebP quality 82, method=6 (slowest encode, smallest output — fine for a once-per-image step).

### 2. First run results

- Sources scanned: **209** images (.jpg/.jpeg/.png in landing-images)
- WebP siblings generated: **200** new (9 already existed from earlier work)
- Total source bytes: **24.24 MB**
- Total WebP bytes: **9.21 MB**
- **Reduction: 62%** (15 MB saved across the directory)

Per-file ratios typical 25–55% depending on content. Photographic content (textures, gradients) compresses harder; line-art / simple-graphic content compresses less.

### 3. Emit sites updated

Three sites where `<img>` becomes `<picture><source><img></picture>`:

| File | Where | What |
|---|---|---|
| `src/components/editorial/EditorialPage.astro:222` | Astro hero figure | `<picture>` wraps `<img>` when src is `/landing-images/...` |
| `src/lib/editorial-pages.ts:1682` | String-template hero (mirror) | Same as above |
| `src/lib/catalog-pages.ts:1281` | Catalog product card image | Same — applies to every catalog grid card |

Each site uses the same string transform: `src.replace(/\.(jpe?g|png)$/i, ".webp")`. If the path doesn't start with `/landing-images/`, the `<picture>` wrapper is skipped (no WebP sibling exists for paths like `/site-assets/wp-content/...`), so the bare `<img>` continues to ship.

### 4. Preload hint updated — `src/layouts/BaseLayout.astro`

When `seo.imageUrl` is in `/landing-images/`, the `<link rel="preload" as="image">` switches from a plain `href` to `imagesrcset` + `imagetype="image/webp"`. WebP-capable browsers preload the WebP variant directly. Browsers without WebP support ignore the hint and the `<picture>` fallback in the body still serves the JPG.

```astro
{/* WebP-aware preload */}
<link
  rel="preload"
  as="image"
  imagesrcset={seo.imageUrl.replace(/\.(jpe?g|png)$/i, ".webp")}
  imagetype="image/webp"
  fetchpriority="high"
/>
```

### 5. Browser support

WebP is supported by **97.4% of global users** (caniuse, 2026). The remaining ~3% (Safari < 14, very old Chromium forks) get the JPG fallback automatically via `<picture>` source negotiation. No degraded experience.

AVIF (the next-gen format) is intentionally **not** included in this pass:

- AVIF support is at ~94% globally — non-trivial gap vs WebP.
- Encoding cost is meaningfully higher per file.
- WebP already captures 62% of the size savings target; AVIF would add another ~10–20%, diminishing return for the integration cost.
- Can be added as a second `<source type="image/avif">` ahead of the WebP source if/when the gap closes.

---

## Expected baseline impact

DPP's `eu-compliance.jpg` after Phase 6 #4 was 481 KB JPG. WebP variant is **370 KB**. So when the browser picks WebP:

- Phase 6 #4 alone: 774 KB → 481 KB (Lighthouse measured ~235 ms LCP improvement)
- Phase 6 #6 stacks on: 481 KB → 370 KB (~88 ms more on 10 Mbps throttling)
- **Combined:** ~320 ms LCP gain on DPP.

For other routes the wins compound similarly:

- `/industries/hospitality/`: 62 KB JPG → 37 KB WebP (-40%)
- `/products/rfid-cards/mifare-desfire-ev3-card/`: hero + sidebar product images all benefit
- Catalog listing pages (e.g., `/products/rfid-cards/`): every featured + non-featured card image gets the WebP path → cumulative grid-load savings can hit several hundred KB on dense routes.

The home (`/`) page has 4.7 MB total weight from many WP-content uploads not in `/landing-images/`. Those are out of scope for this pipeline (they belong to the original WordPress media library). A future pass could mirror the script against `/site-assets/wp-content/uploads/` if needed — but the win would be smaller since those images aren't usually LCP-blocking.

---

## Maintenance workflow

When adding a new hero image:

1. Drop the JPG/PNG into `public/landing-images/`.
2. Run `npm run images:build-webp` — it generates the missing `.webp` sibling without touching existing variants.
3. Reference the JPG/PNG path as usual in JSON data; the emit sites auto-detect `/landing-images/` and ship `<picture>` markup.
4. Commit both files.

When tweaking quality settings:

1. Edit `WEBP_QUALITY` (currently 82) in `scripts/build-image-variants.py`.
2. Run `npm run images:rebuild-webp` to force-regenerate all variants.
3. Visual spot-check; revert if unacceptable.

When an emit site needs a new image format (e.g., adding AVIF):

1. Add AVIF generation to the Python script.
2. Add a second `<source type="image/avif">` BEFORE the existing WebP source in each of the 3 emit sites (browser picks first match).

---

## What's still oversized

The 7 remaining 300–500 KB files identified in PHASE-6-IMAGE-COMPRESSION.md — `rfid-bamboo-card.jpg` (461 KB), `waterproof-uhf-rfid-outdoor-tag.jpg` (426 KB), etc. — now have WebP siblings (saved 30–55% each). The JPG fallback is still oversized for the 3% of WebP-incapable browsers, but the modern-browser experience uses the WebP path and is well under threshold.

If we want to fix the JPG fallbacks too: re-run the in-place compression pattern from Phase 6 #4 (resize to 1600×wxh, q85). 30-minute job, optional.

---

## Files touched

- `scripts/build-image-variants.py` — new (211 lines)
- `package.json` — added 2 scripts: `images:build-webp`, `images:rebuild-webp`
- `src/components/editorial/EditorialPage.astro` — hero `<img>` → `<picture>` for landing-images
- `src/lib/editorial-pages.ts` — string-template mirror updated
- `src/lib/catalog-pages.ts` — product card `<img>` → `<picture>` for landing-images
- `src/layouts/BaseLayout.astro` — preload `<link>` switches to `imagesrcset` + `imagetype` when WebP is available
- `public/landing-images/*.webp` — 200 new variants alongside originals (committed)

No source data files (.json) modified. The transformation lives entirely at the emit layer — adding/removing landing images is unaffected.

---

## Methodology recap

This task delivered exactly the expected scope (1.5 days estimated, ~30 minutes actual on Pillow + emit-site refactor) because the scope was well-defined by the prior baseline measurement. Compare with Phase 6 #4 where targeted re-encoding of 5 files took 5 minutes and saved 7.5 MB — same methodology family, different layer of the stack:

- #4: surgical fix on the LCP-outlier route (file-targeted, in-place re-encode)
- #6: systematic upgrade across the renderer (pipeline-targeted, side-by-side variant)

Both shipped. Together they own the image-byte budget for landing-images. WP-content/uploads would be a #7 if it ever becomes the bottleneck.

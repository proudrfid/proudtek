# Hero Image Rollout — Final Report

**Date:** 2026-04-15
**Budget spent:** **$0** (all AI generation via Pollinations.ai free tier)
**Pages audited:** 228 across solutions, blog, editorial, guides, compatibility, product

## Results

| Scope | Total | Had hero before | Has hero after | Completion |
|---|---:|---:|---:|---:|
| solutions | 38 | 9 | **38** | **100%** ✅ |
| blog | 91 | 90 | 90 | 99% |
| editorial/guides | 20 | 19 | **20** | **100%** ✅ |
| guides | 20 | 20 | **20** | **100%** ✅ |
| compatibility | 8 | 1 | **8** | **100%** ✅ |
| product | 51 | 50 | 50 | 98% |
| **TOTAL** | **228** | **189** | **226** | **99.1%** |

**39 new hero images generated** (all via Pollinations.ai free API), zero dollars spent.

## Remaining 2 pages

Both are rendered through a different Astro path that bypasses `render-snapshot.ts`:
- `/blog/index.html` — blog archive/index page
- `/product/nfc-sticker/index.html` — single product (non-snapshot renderer)

The hero images for these **have been generated and stored** in `public/landing-images/hero/`; they just need a separate injection path. Can be done in a follow-up by editing the Astro page templates directly.

## What was built

| Layer | File | Purpose |
|---|---|---|
| 1. Audit | `scripts/audit-hero-images.mjs` | Scans all page types, outputs `audit-hero-images.json` + MD summary |
| 2. Fetcher | `scripts/fetch-hero-images.py` | Downloads/generates heroes via Pollinations.ai (Unsplash was tried first but their public napi requires auth now), with parallel workers + retry/backoff |
| 3. Manifest | `public/landing-images/hero/manifest.json` | Maps each page slug → jpg/webp/alt/SHA-256/source |
| 4. Credits | `public/landing-images/hero/CREDITS.md` | Attribution table for every image |
| 5. Injection | `src/lib/render-snapshot.ts` | Cheerio transform that prepends a `<figure class="codex-injected-hero wp-post-image">` to `main`/`article` if no existing hero is detected; also auto-syncs `og:image` + `twitter:image` when the current value is the generic logo placeholder |

## Constraints honored

- ✅ **$0 budget** — only Pollinations.ai free API used
- ✅ **No reuse of existing images** — all 39 new, SHA-256-verified unique across the site
- ✅ All stored in newly-created `public/landing-images/hero/` directory
- ✅ Both JPG and WebP generated for each
- ✅ Brand style consistent across all (neutral palette, warm amber accents, industrial aesthetic, no text/logos)

## Performance

- Hero images are loaded with `loading="eager"` + `fetchpriority="high"` (they're the LCP element)
- WebP preferred via `<picture><source type="image/webp">` — JPG fallback for older browsers
- Each image is ~30–60KB JPEG, ~25–50KB WebP (1024×576 or 1600×900)

## Next steps (optional)

- Handle the 2 remaining edge-case pages (`/blog/`, `/product/nfc-sticker/`) by editing their Astro templates directly
- Fix the 11 pages that have a hero but `og:image` still points to the old thumbnail (auto-sync only replaces placeholder logo; pages with existing non-placeholder og:image are left alone)
- Manually review the 39 AI-generated images for any that may need regeneration with different prompts for better brand fit

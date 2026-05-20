# ProudTek Astro Static Mirror

This project mirrors `https://proudtek.com` into a static Astro site.

## Commands

- `npm install`
- `npm run fetch`
- `npm run build`
- `npm run build:site`
- `npm run dev`

## How it works

- `scripts/fetch-proudtek.mjs` reads the WordPress sitemap, seeds from known site entry paths, and follows internal links across all available language variants.
- The crawler downloads site pages and local assets into:
  - `src/data/site-data.json`
  - `public/site-assets/`
- Astro renders the captured HTML through shared snapshot routes.
- Synthetic fallback and editorial pages are no longer part of the default build path; the local site now favors restoring original crawled pages over generated replacements.

## Output

- Static build output: `dist/`
- Captured pages: depends on the latest fetch
- Downloaded local assets: depends on the latest fetch

## Known limitations

- WooCommerce cart, checkout, and account pages are preserved as static snapshots only.
- The generated site keeps the original HTML structure instead of rebuilding WordPress templates as bespoke Astro components.
- Some external integrations and analytics scripts are intentionally sanitized for static local use.


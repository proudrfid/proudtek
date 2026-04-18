# Prompt — De-duplicate product images on /products/all/

Paste the block below into a fresh Claude session (or subagent) pointed at the ProudTek repo.

---

## Task

The `/products/all/` catalog on the ProudTek Astro site currently shows many product cards sharing the same image across different products. Audit the full grid, identify every duplicate, and replace each duplicate with a new, title-relevant image sourced from the web. Apply the fixes via the `CATALOG_IMAGE_OVERRIDES` map so the WP snapshot files stay untouched.

## Context you need to know

**Repo root:** `/sessions/affectionate-brave-clarke/mnt/Playground`

**Catalog rendering pipeline** — `src/lib/catalog-pages.ts`:
- `collectCatalogProducts()` resolves each product's image in this priority order:
  1. `WP_IMAGE_OVERRIDES[route]`
  2. `CATALOG_IMAGE_OVERRIDES[route]`  ← **add your fixes here**
  3. For editorial landing pages: `def.heroImage`
  4. For WP products: `extractFirstImage(bodyHtml)` from the on-disk snapshot
- `renderCatalogMain()` renders the grid in 6 family sections (Cards / Keyfobs / Wristbands / Labels / Readers / Tags).

**Product data sources:**
- WP product snapshots: `src/data/pages/product/*.json` (fields: `route`, `title`, `bodyHtml`)
- Editorial landing pages: `src/content/editorial/products/**/*.json` (fields: `route`, `title`, `heroImage`)

**The /industries/\* pages are NOT in this catalog** — they were removed recently. Don't include them.

## Steps

1. **Enumerate every product card image.** Write a small Node script that replays `collectCatalogProducts()` offline: load all WP product snapshots + editorial product definitions, run each through the priority chain, and produce a table of `(route, title, finalImageUrl)`. Save to `image-audit.json` in the repo root.

2. **Group by image URL.** Any group with ≥ 2 routes is a duplicate. For each group:
   - Pick **one** route to keep the image (the one whose title best matches the image subject — e.g. keep a "hotel key card" image on the `/product/hotel-key-cards/` route, replace on others).
   - Every other route in the group needs a new image.

3. **Search the web for a replacement** for each route that needs one. Use WebSearch with a query like `"<product title>" product image` or `<slug> RFID product photo`. Pick an image that is:
   - Clean product photography on a plain background (ideally white)
   - Directly relevant to the product title — not a generic RFID stock photo
   - Hosted at a stable HTTPS URL (manufacturer catalogs, Wikimedia Commons, reputable RFID vendor product pages). Avoid blog post embeds and random CDN thumbnails
   - Reasonable resolution (≥ 400px on the short edge)

4. **Verify each replacement URL is live** — `curl -IsS <url> | head -5` should return HTTP 200 and `Content-Type: image/*`.

5. **Apply fixes** — add entries to `CATALOG_IMAGE_OVERRIDES` in `src/lib/catalog-pages.ts`. Group your additions in a clearly labeled block with a comment `// Deduplication pass YYYY-MM-DD`.

6. **Write a report** at `dedupe-report.md` listing:
   - Each duplicate group (original URL + number of routes it was used on)
   - Which route kept the original and why
   - Each replacement (route → new URL, one-line rationale)
   - Any routes you couldn't find a good replacement for (flag as "needs manual pick" — don't guess)

## Guardrails

- **Don't edit WP snapshot JSON files.** All overrides go through `CATALOG_IMAGE_OVERRIDES`.
- **Don't invent URLs.** If search doesn't surface a confidently-matching image, flag it as "needs manual pick" in the report.
- **Don't change the rendering code** unless you discover a genuine bug. This task is purely data (the overrides map).
- **Don't touch products in the `/industries/*` paths** — they're out of catalog scope.

## Batching

If duplicates exceed 30 distinct groups, produce the full audit + report **first**, show me the grouped summary, and wait for confirmation before applying overrides. For anything under 30, go ahead and apply fixes in one pass.

## Done criteria

1. `image-audit.json` and `dedupe-report.md` exist at the repo root.
2. `CATALOG_IMAGE_OVERRIDES` has new entries covering every duplicate except those flagged as "needs manual pick".
3. Re-running the audit script shows zero image-URL collisions (or only the flagged manual-pick routes remain).
4. Report back: total duplicate groups found, total routes fixed, total flagged.

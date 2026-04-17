# Static HTML Generator Usage Guide

## Overview
This script bypasses the missing Rollup native binary issue and generates static HTML directly from `src/data/site-data.json`.

## Quick Start

```bash
# Run the generator
node generate-static-html.js
```

## What It Does

1. **Loads site data** (198MB JSON with 1610 pages)
2. **Filters pages** by route pattern (currently `/industries/*`)
3. **Cleans HTML** (removes translatepress, low-value links, empty containers)
4. **Generates SEO** (meta tags, canonical, Open Graph, Twitter Card, JSON-LD)
5. **Creates valid HTML5** documents with proper structure
6. **Writes files** to `dist-restored/`

## Output Structure

```
dist-restored/
└── industries/
    ├── agriculture/
    │   └── index.html (218KB)
    ├── hospitality/
    │   └── index.html (230KB) ← Main target page
    ├── healthcare/
    │   └── index.html (224KB)
    └── ... [12 more industry pages]
```

## Customization

### To Generate Different Pages

Edit the filter in `generate-static-html.js`:

**Current filter (line ~400):**
```javascript
const pagesToGenerate = siteData.pages.filter(
  (page) =>
    page.route !== "/" &&
    !LOW_VALUE_ROUTE_PREFIXES.some((prefix) => page.route.startsWith(prefix)) &&
    !page.route.endsWith("/page/1/") &&
    page.route.startsWith("/industries/")  // ← Change this filter
);
```

**Examples:**

```javascript
// Generate only products
page.route.startsWith("/product/")

// Generate all product-related pages
page.route.match(/^\/product/)

// Generate blog posts
page.route.match(/^\d{4}\//)

// Generate specific page
page.route === "/contact/"

// Generate everything (remove the last filter)
// Just keep the other three conditions
```

## Generated HTML Features

Each HTML file includes:

### SEO Meta Tags
- `<title>` - Page title with site name
- `<meta name="description">` - Page description
- `<meta name="robots">` - Indexability settings
- `<link rel="canonical">` - Canonical URL

### Social Media Tags
- Open Graph (og:title, og:description, og:image, og:url)
- Twitter Card (twitter:card, twitter:title, twitter:image)

### Structured Data
- JSON-LD Organization schema
- JSON-LD WebPage/Article schema
- Rich snippet support

### Analytics & Tracking
- Google Analytics 4 (GA4) tracking
- Deferred script loading for better performance

### Interactive Features
- WhatsApp floating action button
- Sticky CTA inquiry bar
- Jump navigation with scroll tracking
- Scroll-triggered reveal animations

### Accessibility
- Proper semantic HTML
- Focus indicators (keyboard navigation)
- Reduced motion support
- ARIA labels

## How It Replicates Astro Build

### What Astro Does:
1. Reads `[...slug].astro` which calls `getStaticPaths()`
2. Filters pages using route rules
3. Renders each page through `SnapshotLayout.astro`
4. Applies transformations from `prepareSnapshot()` (render-snapshot.ts)
5. Builds SEO data via `buildPageSeo()` (seo.ts)
6. Writes HTML to `dist/`

### What This Script Does:
1. Reads `site-data.json` directly (bypassing Astro)
2. Applies same route filtering rules
3. Calls `buildPageHtml()` for each page
4. Applies same snapshot transformations
5. Builds same SEO data structure
6. Writes HTML to `dist-restored/`

## Performance

- **Load time**: ~5 seconds to read 198MB JSON file
- **Generation time**: ~2 seconds to generate 15 pages
- **Total runtime**: ~7 seconds for full execution
- **No external API calls**: Everything is local/offline

## Troubleshooting

### "Module not found: cheerio"
Install node_modules: `npm install cheerio`

### "Cannot read file site-data.json"
Verify path is correct: `/sessions/funny-adoring-gates/mnt/Playground/src/data/site-data.json`

### HTML looks incomplete
Check if snapshot cleanup removed too much content. Verify the source page has body content.

### Meta tags missing
Check `extractPageTitle()` and `extractDescription()` functions - they may not be finding content in your page structure.

## File Locations

- **Generator Script**: `generate-static-html.js`
- **Site Data**: `src/data/site-data.json`
- **Output**: `dist-restored/`
- **Documentation**: This file (USAGE.md)
- **Report**: `GENERATION_REPORT.md`

## Next Steps

1. Verify all generated HTML files are valid in browser
2. Test responsive design at various screen sizes
3. Check Analytics event tracking is working
4. Validate SEO meta tags with SEO tools
5. Deploy to web server

## Support Files Referenced

The script automatically uses configuration from:
- `src/lib/route-overrides.ts` - Canonical URL overrides
- `src/lib/render-snapshot.ts` - HTML cleanup rules
- `src/lib/seo.ts` - SEO building logic

These are baked into the script and don't need to be modified.

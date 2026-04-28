/**
 * Lighthouse CI configuration — Phase 6 baseline harness.
 *
 * Wired by DS-15. Covers 8 routes spanning every seo.kind that ships
 * non-trivial above-the-fold layout: home, editorial, snapshot list,
 * product, compare, industry, solution, contact.
 *
 * Run via: npm run lh:baseline (after `npm install --save-dev @lhci/cli`).
 *
 * Static-dist mode: LHCI spins its own server against ./dist-restored
 * (matches astro.config.mjs `outDir`). Build must succeed first; the
 * npm script chains them.
 *
 * Asserts are intentionally permissive on first run — we want a baseline,
 * not a gate. Tighten thresholds in PHASE-6-LIGHTHOUSE-HARNESS.md once
 * we have 3+ runs to set realistic budgets.
 */
module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist-restored",
      // Trailing slashes match astro.config.mjs `trailingSlash: "always"`.
      url: [
        "http://localhost/",
        "http://localhost/about/",
        "http://localhost/blog/",
        "http://localhost/contact/",
        "http://localhost/industries/hospitality/",
        "http://localhost/products/rfid-cards/mifare-desfire-ev3-card/",
        "http://localhost/compare/uhf-vs-hf-rfid/",
        "http://localhost/solutions/digital-product-passport/",
      ],
      numberOfRuns: 3,
      settings: {
        preset: "desktop",
        // Skip audits not actionable for a static site behind a CDN —
        // those belong to the deploy layer, not the design system.
        skipAudits: [
          "uses-http2",
          "redirects-http",
          "is-on-https",
          "uses-long-cache-ttl",
        ],
      },
    },
    assert: {
      // Soft thresholds — flag, don't fail. Tighten in Phase 6 close-out.
      assertions: {
        "categories:performance":     ["warn",  { minScore: 0.85 }],
        "categories:accessibility":   ["error", { minScore: 0.95 }],
        "categories:best-practices":  ["warn",  { minScore: 0.95 }],
        "categories:seo":             ["warn",  { minScore: 0.95 }],
        // Core Web Vitals — desktop budget.
        "largest-contentful-paint":   ["warn",  { maxNumericValue: 2500 }],
        "cumulative-layout-shift":    ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time":        ["warn",  { maxNumericValue: 300 }],
        "first-contentful-paint":     ["warn",  { maxNumericValue: 1800 }],
        // Resource budgets aligned with DS-15 measured baseline (2026-04-27).
        // Stylesheet 80 KB ceiling: actual baseline is 62–74 KB; tighten
        // to 50 KB once Critters lands.
        // Script: 750 KB ceiling captures total weight (WP/Kadence + gtag).
        // Per-route baselines: most routes 310–463 KB; /contact/ is
        // 685–696 KB because it ships the Kadence form-block runtime
        // alongside gtag. NOT a blocking-JS proxy — TBT is the signal
        // for blocking, and TBT is 0 ms across all routes today.
        // See DS-15-BASELINE-MEASURED.md §1 for context.
        "resource-summary:stylesheet:size": ["warn", { maxNumericValue: 80000 }],
        "resource-summary:script:size":     ["warn", { maxNumericValue: 750000 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: "./reports/lighthouse-baseline",
      reportFilenamePattern: "%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%",
    },
  },
};

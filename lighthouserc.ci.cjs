/**
 * Lighthouse CI configuration — CI variant.
 *
 * Trimmed for fast PR feedback. Compared to lighthouserc.cjs (the full
 * 8-route baseline harness):
 *
 *   - 4 representative routes instead of 8: home (snapshot), blog index
 *     (native Astro), one product page, one compare page. Catches the
 *     four distinct rendering paths the site ships today.
 *   - 1 run per route instead of 3. CI signal is "did something regress
 *     loudly," not "what's the median to 2 decimals" — that's the local
 *     baseline harness's job.
 *   - Same soft thresholds as the full config: every perf metric is a
 *     `warn`, not `error`. We surface regressions in the workflow log
 *     and uploaded HTML reports without blocking merges. Tighten to
 *     `error` once we have 3+ green PRs to set realistic budgets.
 *
 * Asserts inherited from lighthouserc.cjs and re-stated here so the CI
 * config is self-contained (don't merge — `require` chains across cjs
 * + module.exports get hairy in LHCI). Keep these in sync with the
 * full baseline config when budgets change.
 */
module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist",
      url: [
        "http://localhost/",
        "http://localhost/blog/",
        "http://localhost/products/rfid-cards/mifare-desfire-ev3-card/",
        "http://localhost/compare/uhf-vs-hf-rfid/",
      ],
      numberOfRuns: 1,
      settings: {
        preset: "desktop",
        skipAudits: [
          "uses-http2",
          "redirects-http",
          "is-on-https",
          "uses-long-cache-ttl",
        ],
      },
    },
    assert: {
      assertions: {
        "categories:performance":     ["warn",  { minScore: 0.85 }],
        "categories:accessibility":   ["error", { minScore: 0.95 }],
        "categories:best-practices":  ["warn",  { minScore: 0.95 }],
        "categories:seo":             ["warn",  { minScore: 0.95 }],
        "largest-contentful-paint":   ["warn",  { maxNumericValue: 2500 }],
        "cumulative-layout-shift":    ["warn",  { maxNumericValue: 0.1 }],
        "total-blocking-time":        ["warn",  { maxNumericValue: 300 }],
        "first-contentful-paint":     ["warn",  { maxNumericValue: 1800 }],
        "resource-summary:stylesheet:size": ["warn", { maxNumericValue: 80000 }],
        "resource-summary:script:size":     ["warn", { maxNumericValue: 750000 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: "./reports/lighthouse-ci",
      reportFilenamePattern: "%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%",
    },
  },
};

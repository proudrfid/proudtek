# Phase 6 — Lighthouse CI Harness

**Status:** Harness wired. First run pending devDependency install.
**Scope:** 8-route sample baseline for shared performance measurement across DS-15 Phase 6 work.
**Date:** 2026-04-27

---

## What this is

Lighthouse CI configured to measure 8 representative routes covering every `seo.kind` that ships meaningful above-the-fold layout. The harness:

- Builds the static site (`astro build`).
- Spins LHCI's static-dist server against `./dist-restored` (matches `astro.config.mjs` `outDir`).
- Runs Lighthouse 3 times per route at the desktop preset.
- Asserts soft thresholds (warn-only on perf, error on a11y + CLS).
- Writes per-route HTML + JSON reports to `./reports/lighthouse-baseline/`.

The output dir is gitignored. Once we have a representative run (after Critters + JS split + WebP land), promote one HTML report into `reports/ds-12-token-consolidation/` as the official Phase 6 baseline.

---

## One-time setup

```bash
npm install --save-dev @lhci/cli@^0.13
```

That's it. The config file (`lighthouserc.cjs`) and npm scripts are already in the repo.

`@lhci/cli` is ~80 MB after install but only as a devDep — never ships to production.

---

## Running it

```bash
# Full pipeline: build + collect + assert + write reports.
npm run lh:baseline

# Just collect (assumes ./dist-restored already exists from a previous build).
npm run lh:collect

# Just assert against the most recent collect run.
npm run lh:assert
```

After `lh:baseline`, look at:

```
reports/lighthouse-baseline/<route-pathname>-<datetime>-report.html
reports/lighthouse-baseline/<route-pathname>-<datetime>-report.json
```

Open the HTML files in a browser to see the standard Lighthouse breakdown. The JSON is machine-readable for diff scripts later.

---

## The 8 routes

Picked to span every `seo.kind` that has non-trivial above-the-fold layout:

| # | Route | Kind | Why this one |
|---|---|---|---|
| 1 | `/` | home | Largest hero, most JS, all-categories rail |
| 2 | `/about/` | editorial | Long-form prose, no figures |
| 3 | `/blog/` | snapshot list | Card grid layout, pagination |
| 4 | `/contact/` | contact | Kadence form post-process — DS-11 #5 surface |
| 5 | `/industries/hospitality/` | industry | Sidebar (industries-rail), DEEP framework page |
| 6 | `/products/rfid-cards/mifare-desfire-ev3-card/` | product | Spec table, citations (DS-10 #2 surface), Brief, sidebar rail |
| 7 | `/compare/uhf-vs-hf-rfid/` | compare | Wide spec table, sortable headers (DS-10 #4) |
| 8 | `/solutions/digital-product-passport/` | solution | Long editorial, hero image, rail |

If a route changes structure (e.g., new layout shipped), update the route list in `lighthouserc.cjs` to match. Don't add routes until we have a reason — 8 × 3 runs × ~6s each = 2.5 minutes per `lh:baseline`. More routes = slower iteration.

---

## What the assertions enforce

Soft thresholds (warn-only) on first-pass measurement; tighten once we have 3+ runs:

| Audit | Severity | Threshold | Source |
|---|---|---|---|
| `categories:performance` | warn | ≥ 0.85 | DS-15 budget proposal |
| `categories:accessibility` | **error** | ≥ 0.95 | DS-13 closeout floor |
| `categories:best-practices` | warn | ≥ 0.95 | sane default |
| `categories:seo` | warn | ≥ 0.95 | sane default |
| `largest-contentful-paint` | warn | ≤ 2500 ms | DS-15 4G mobile target (desktop run is more lenient — adjust later) |
| `cumulative-layout-shift` | **error** | ≤ 0.1 | DS-13 floor — `aspect-ratio` already protects us |
| `total-blocking-time` | warn | ≤ 300 ms | DS-15 budget |
| `first-contentful-paint` | warn | ≤ 1800 ms | desktop budget |
| `resource-summary:stylesheet:size` | warn | ≤ 50 KB | DS-15 hard ceiling |
| `resource-summary:script:size` | warn | ≤ 4 KB | DS-15 hard ceiling for blocking JS |

Errors fail the build. Warnings print and exit 0. The `script:size` ceiling will probably warn on first run (current inline JS is ~9.6 KB gzip, all in `<head>`); that's the signal that JS deferral (Phase 6 task #4) hasn't shipped yet.

---

## Skipped audits

These don't apply to a static site behind a CDN — the deploy layer owns them, not the design system:

- `uses-http2` — CDN concern.
- `redirects-http` — CDN concern.
- `is-on-https` — CDN concern.
- `uses-long-cache-ttl` — CDN concern.

If we ever lose the CDN they come back.

---

## Phase 6 task ordering (recap)

| # | Task | Effort | Gate |
|---|---|---|---|
| 1 | Wire Lighthouse CI harness | 0.5 d | **DONE** (this doc) |
| 2 | Run baseline → record numbers | 0.5 d | Needs devDep install + first `lh:baseline` |
| 3 | Add `width`/`height` intrinsics on hero `<img>` | 0.5 d | Re-run LHCI to measure delta |
| 4 | Critters integration for critical-CSS inline | 1 d | Re-run LHCI |
| 5 | Inline JS split: pre-paint shim + deferred runtime | 1 d | Re-run LHCI |
| 6 | WebP/AVIF hero pipeline | 1.5 d | Re-run LHCI |
| 7 | Promote final report + write Phase 6 close-out | 0.5 d | Comparison table baseline → final |

---

## How to extend

**Add a route.** Edit the `url` array in `lighthouserc.cjs`. Make sure the trailing slash is present (project uses `trailingSlash: "always"`). Confirm the route exists by running `astro build` and checking `dist-restored/<path>/index.html`.

**Tighten a threshold.** Edit `assert.assertions` in `lighthouserc.cjs`. Promoting a `warn` to `error` will fail builds — do this only for thresholds we've verified are achievable.

**Switch to mobile preset.** Change `settings.preset` from `"desktop"` to `"mobile"`. Mobile budgets are stricter (4G throttling); use this for the close-out comparison once optimizations land.

**Add to CI.** Wire `npm run lh:baseline` into the existing CI pipeline. The static-dist mode means no separate server setup is needed. Budget ~3 minutes per run.

---

## Why we picked LHCI over alternatives

- **Vanilla Lighthouse CLI** — no built-in budgets / assertions, no run averaging, no built-in static-dist server. We'd have to build the harness around it.
- **Web Vitals Real-User-Measurement (RUM)** — requires production traffic and analytics integration. Useful eventually but Phase 6 needs synthetic numbers we can iterate against locally.
- **Pagespeed Insights API** — public-internet-only; can't run against `dist-restored` locally during dev.

LHCI is the lowest-friction synthetic harness that covers all of: build, serve, measure, assert, archive. It's also the de-facto standard for the "perf budgets in CI" use-case.

---

## Files touched

- `lighthouserc.cjs` — config (new).
- `package.json` — three new scripts: `lh:baseline`, `lh:collect`, `lh:assert`.
- `.gitignore` — `reports/lighthouse-baseline/` and `.lighthouseci/` excluded.

No source code changes. The harness is purely additive.

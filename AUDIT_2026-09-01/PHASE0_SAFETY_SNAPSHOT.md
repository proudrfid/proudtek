# Phase 0 — Safety Snapshot (read-only)

Date: 2026-09-01 · Auditor session: Cowork/Claude · Repository: `proudrfid/proudtek` (local clone at `Playground/`)
Evidence sources: repository files, `git`, clean build of `HEAD` in an isolated copy, live responses from proudtek.com captured earlier today, Google Search Console (property `sc-domain:proudtek.com`).
Nothing was modified in this phase. Two items produced earlier today under a separate, explicitly approved mandate are disclosed in §7 because they conflict with this brief's rules 12–13.

---

## 1. Project architecture

| Item | Observed evidence | Status |
| --- | --- | --- |
| Framework | `astro ^6.0.4` (installed 6.0.4), `output: "static"`, `trailingSlash: "always"` (`astro.config.mjs`) | FIRST_PARTY_VERIFIED (file) |
| Language / tooling | TypeScript 5.9, ESLint 10 + typescript-eslint, Vitest 4, Lighthouse CI, cheerio, sharp, fast-xml-parser | file |
| Package manager | npm (`package-lock.json` present; no yarn/pnpm lockfiles). Node 22 in CI; sandbox ran Node 22.23.2 / npm 10.9.8. No `engines` field. | file |
| Content system | Two layers: (a) **editorial JSON** — Astro content collection `editorial`, 522 active JSON files under `src/content/editorial/**` (+ `_unused/`); (b) **WordPress snapshot** — 1,611 page JSONs under `src/data/pages/` indexed by `src/data/site-meta.json`, rendered through `src/lib/render-snapshot.ts`. Fetch pipeline is mothballed (`STOP_FETCH` sentinel, 2026-08-12). | file |
| Routing | `src/pages/[...slug].astro` (snapshot + editorial), plus explicit pages: `index`, `rfq`, `404`, `case-studies`, `blog/`, `compare/`, `guides/`, `solutions/`, `compatibility/`, `glossary/`, `tools/`, `machine/`, and generators for `robots.txt`, `sitemap-index.xml`, `sitemap.xml`, `image-sitemap.xml`, `llms.txt`, `llms-full.txt`, `site-index.json` | file |
| Rendered output | 599 HTML files; 1,038 `/machine/**` mirror files (519 `.json` + 519 `.txt`); root files: `robots.txt`, `sitemap-index.xml`, `sitemap.xml`, `image-sitemap.xml`, `llms.txt`, `llms-full.txt`, `site-index.json`, `indexnow-key.txt`, `_redirects` (generated Netlify/Cloudflare-format copy of vercel.json), `6e03…txt` (verification token) | clean HEAD build |
| Forms | All three lead forms POST to **Formspree endpoint `xlgorlog`**: `/rfq/` (5-step wizard, `fetch()` + `mailto:` fallback, `_gotcha` honeypot), `/contact/` (snapshot-rendered Kadence form, `_gotcha`), `/sample-pack/` (no honeypot detected in HTML), `InlineRfqForm.astro` on editorial pages. No server functions (`api/` absent; no `functions` in vercel.json). No CAPTCHA/Turnstile detected. | file + built HTML |
| Analytics / consent | Not yet inventoried (Phase 2 / 12). | — |
| Env vars referenced | `SITE_ORIGIN`, `ASTRO_OUT_DIR`, `ASTRO_CACHE_DIR`, `VITE_CACHE_DIR`, `PROUDTEK_SKIP_KADENCE_BUNDLE`, `PROUDTEK_NATIVE_SHELL`, `USE_EDITORIAL_COMPONENTS`, `LOCALIZE_ASSETS`, `FORCE_FETCH`, dispatcher tunables (`*_STOP_AT_FILES`, `IMAGE_AUDIT_*`). No `.env*` files in repo. Vercel-side env values **not visible** from this account (see §6). | grep |
| Chip-fact guardrails | `npm run lint:chip-claims` (35 rules, 536 files) and `lint:chip-placeholder-drift`; `src/data/chip-specs.json` is the `{chip:slug:name}` placeholder source. | file |

## 2. Build status (clean `HEAD`, isolated copy, `CI=1`, temp cache dirs)

| Check | Result |
| --- | --- |
| `git rev-parse HEAD` | `473b5edeadcfd8ffecfcf44aefaf124ec333821d` — `main` — "docs: channel kit corrected from zero-launch to activate-existing" (2026-09-01 03:29 -0400). Local `main` == `origin/main` (last fetched). |
| `npm run build` | **PASS** — 599 pages in 80.4 s; prebuild `build-kadence-css-bundle` OK (51 CSS URLs purged); WebP generation skipped under `CI` (227 pre-committed) |
| `npm run test` | **PASS** — 21 files / 322 tests |
| `npm run lint` | **PASS** (0 problems) |
| `npm run lint:chip-claims` | **PASS** — 536 files, 35 rules, clean |
| `npm run lint:chip-placeholder-drift` | Not evaluable in sandbox (needs `origin/main` ref); CI runs it |
| `npm run audit:site-contract` | **PASS** — outputs=599, warnings=0 |
| `astro check` / `tsc` | `astro check` could not run in the sandbox (vite cache EPERM on the mounted `node_modules`); plain `tsc --noEmit` reports only pre-existing `.astro` module-resolution errors in test files (expected outside Astro's checker). Not a regression signal. |

## 3. Current warnings

| Source | Warning | Assessment |
| --- | --- | --- |
| Vite (build) | `"matchHostname", "matchPathname", "matchPort" and "matchProtocol" are imported from external module "@astrojs/internal-helpers/remote" but never used` | Astro-internal, harmless |
| Route inventory | 56 legacy routes are still **generated as HTML** (`/product/*` ×51, `/2024/*` ×4, `/2025/*` ×1). All 56 are `noindex`, canonical → new URL, **and** redirected at the edge by `vercel.json`, so the files are unreachable dead weight, not a leak. | note for Phase 1 |
| Route inventory | 3 `vercel.json` destinations do not exist in the build: `/products/rfid-cards/mifare-desfire-ev3-cards/` (typo; real route `…-ev3-card/`), `/products/rfid-cards/rfid-dual-frequency-card/` ×2 (real route `dual-frequency-rfid-card/`). These redirects resolve to **404**. | **P1 candidate** (Phase 2) |
| Route inventory | 11 indexable cluster pages are **not in sitemap.xml**: `/compare/{chip-vs-chip,form-factor-material,frequency-tech,reader-vs-reader}/`, `/guides/{buying-reference,chip-encyclopedias,compliance-regulatory,google-review-cards,hotel-keycards,integration-tools,standards-encoding}/` | Phase 1/2 |
| Route inventory | 3 `/lp/` pages are `noindex` with canonical pointing to a sibling LP (`/lp/rfid-factory-direct-china/` → `/lp/rfid-manufacturer-shenzhen/` etc.) — intentional consolidation; `/lp/` itself is 167 visible words. | Phase 6 |
| Live site (today) | Vercel **Security Checkpoint** (`x-vercel-mitigated: challenge`, HTTP 403) triggered after ~24 rapid same-client requests; a real Chrome visit was interrupted by the challenge page. GSC crawl samples show no 403 on Googlebot HTML fetches. | **P0/P1 candidate** — firewall config not inspectable (§6) |
| GSC (2026-08-27 snapshot) | 2,430 indexed / 20,800 not indexed site-wide; new-site sitemap: **33 indexed, 483 "Discovered – currently not indexed"**; crawl stats 90 d: 4,600 requests, 34 % 5xx (all ≤ 2026-06-11, old host), HTML only 6 % of fetches, 88 % of August 200s were SVG/images | carried into Phase 2/5 (full detail: `GSC_SITE_AUDIT_2026-09-01.md`) |
| GSC structured data | Product snippets 0 valid / 6 invalid (offers without price); Merchant listings 0/6 (same + `audience` type + shipping/return warnings) | Phase 10 |

## 4. Deployment dependencies

| Dependency | Evidence | Note |
| --- | --- | --- |
| Hosting | Vercel, project `proudtek` under team scope **`proudrfid`** (`DEPLOYMENT.md`: `vercel --scope proudrfid`); `vercel.json`: `buildCommand: npm run build`, `outputDirectory: dist`, `trailingSlash: true`, `cleanUrls: false`, 248 redirects (9 wildcard), 4 header rules (immutable `_astro`, 30-day `site-assets`/`landing-images`, `max-age=0` HTML) | file |
| Git → deploy | GitHub `proudrfid/proudtek`, branch `main`; `DEPLOYMENT.md` describes Vercel auto-deploy on push (preview → production). CI (`.github/workflows/test.yml`) runs lint, chip lints, tests, build, site-contract audit on push/PR to `main`; `perf.yml` runs Lighthouse CI. | file |
| Redirect parity | `dist/_redirects` is generated from `vercel.json`; `site-contract-audit` checks parity. Any redirect change must go through `vercel.json`. | file |
| Third-party runtime | Formspree (`xlgorlog`) for all lead capture; WhatsApp `wa.me/8618665820632`; `mailto:info@proudtek.com`; 网易外贸通 chat widget (observed on live pages); AI-crawler allow-list in `robots.txt` (`/machine/` disallowed for generic crawlers) | file + live |
| Search | GSC domain property `sc-domain:proudtek.com` (verified; sitemaps submitted 2026-08-30). Google service account key file `gsc-sa.json` exists at repo root — **secret in working tree; confirm it is git-ignored** (Phase 2 security check). | file + GSC |
| Legacy domains | `proudrfid.com` — full 200 mirror of the old site still online (per `docs/monitoring/weekly-index-watch.md`, 2026-09-01 row); `protekrfid.com` — "大量占位" per same log. Ownership/DNS not verifiable from repo. | doc; UNVERIFIED |

## 5. Rollback method

1. **Code**: reference commit `473b5ede`. Any audit-phase change lives only in the working tree; `git checkout -- <file>` / `git clean` restores HEAD. Implementation commits (Phase 14) go on a feature branch, one concern per commit, so `git revert <sha>` is per-batch.
2. **Deployment**: Vercel → Deployments → *Promote to Production* on the last known-good deployment (instant, no rebuild). Requires `proudrfid` team access.
3. **Redirects**: all in `vercel.json`; revert the file and redeploy. `_redirects` regenerates at build.
4. **Structured data / content**: static output — reverting the source and redeploying fully restores; GSC reflects on next crawl.
5. **GSC**: fix-validation runs started today cannot be cancelled but are harmless; URL-inspection submissions cannot be withdrawn (no effect beyond a crawl request).
6. **Sandbox limitation**: the mounted repo blocks `git` index writes, so branch creation/commits must be done by a human or from a normal shell.

## 6. Unknowns requiring human input

| # | Unknown | Why it blocks | Ask |
| --- | --- | --- | --- |
| U1 | **Vercel Firewall configuration** (Attack Challenge Mode? rate-limit rules? verified-bot allow-list?) | Cannot inspect: the Chrome-logged-in Vercel account (`znpjlu@gmail.com`, Hobby, no teams) gets 404 on `vercel.com/proudrfid/proudtek`. Live behaviour shows a challenge after a request burst. | Log Chrome into an account with `proudrfid` team access, or export Firewall → Rules/Overview screenshots |
| U2 | **Vercel env values** for Production (`PROUDTEK_NATIVE_SHELL`, `USE_EDITORIAL_COMPONENTS`, `LOCALIZE_ASSETS`, `SITE_ORIGIN`) | Determines which render path production actually uses; sandbox build used defaults | Same access as U1, or paste values |
| U3 | **Legal entity & domain ownership**: proudtek.com / proudrfid.com / protekrfid.com; registered company name; address; who controls DNS of proudrfid.com | Phase 3 cannot assert equivalence without documents | Business licence / registration extract, domain registrar screenshots |
| U4 | **First-party evidence** for the high-risk claims list (2008 founding, 2 factories, 10 lines, 305+ machines, 8+ patents, 12 inspections, 10 % R&D, OEKO/REACH/RoHS/TÜV, sample-pack contents & shipping, one-business-day reply, all case-study metrics, all "Typical pricing" ranges) | Phase 4 ledger cannot mark anything FIRST_PARTY_VERIFIED from the repo alone; `9001 certificate/` folder exists and will be inspected, others have no documents in repo | Owner document pack (see Phase 4 request list) |
| U5 | **Formspree account**: delivery target, spam filtering, submission logs, whether `sample-pack` form lacks honeypot by design | Phase 12 cannot verify delivery without account access; test submissions need permission | Read-only Formspree access or a screenshot of the form's settings/recent submissions |
| U6 | **Analytics/consent stack** in production (GA4/GTM? cookie consent?) | Not yet inventoried; snapshot HTML may carry WP-era tags | Will inventory in Phase 2; confirm intended stack |
| U7 | **GEO benchmark engines** available for Phase 11 | Non-personalised runs need a clean profile; only the built-in browser is un-personalised here | Confirm which engines (Google AI Overviews, Perplexity logged-out, Bing Copilot, ChatGPT search if account provided) |
| U8 | **`gsc-sa.json`** at repo root — service-account key. Verified: untracked, git-ignored, never in history (`git log --all`). Still valid? Used by which script? | Secret hygiene (resolved for exposure; validity unknown) | Confirm whether it should be used for a read-only GSC API pull in Phase 5 |

## 7. Disclosures — actions taken earlier today under a separate approved mandate

These pre-date this brief and conflict with its rules 12–13; recorded here so the audit baseline is honest.

| Action | State | Interaction with this brief |
| --- | --- | --- |
| **Uncommitted working-tree changes** (approved 2026-09-01, not committed — sandbox cannot write git index): `src/lib/seo/jsonld.ts` (Product `Offer`→`AggregateOffer` from "Typical pricing" brief text; `audience`→`BusinessAudience`), new `src/lib/seo/product-offer.ts` + test, regenerated `src/data/site-contract.v1.json` (196 product-page JSON-LD hashes). Build 599 OK, 331 tests pass with these changes. | In tree, uncommitted | Rule 10 satisfied (schema mirrors visible text). **But** the underlying price ranges are first-party claims with **UNVERIFIED** evidence status until the owner confirms them (Phase 4). Emitting them as `lowPrice/highPrice` propagates unverified numbers into machine-readable data. Recommendation: **hold uncommitted** until the pricing ranges are confirmed; Phase 4 will list them for owner sign-off. |
| Pre-existing modification `docs/monitoring/weekly-index-watch.md` (+1 row dated 2026-09-01) | In tree, uncommitted, not made by this session | Untouched |
| GSC "Validate fix" started on 5 buckets (5xx 1,266; robots 1,624; soft-404 5,980; crawled-not-indexed 10,714; indexed-though-blocked 22) | Done, irreversible, benign | Rule 13 says no submissions during audit; these were done before the brief. No further GSC actions will be taken in Phases 0–13. |
| GSC "Request indexing" submitted for `/products/rfid-tags/` and `/solutions/` (daily quota then exhausted) | Done | Same |

## 8. Route inventory summary (clean HEAD build)

| Bucket | Count |
| --- | --- |
| HTML outputs | 599 (products 204, blog 114, guides 59, legacy `/product/` 51, solutions 38, compare 33, industries 22, lp 15, markets 11, about 11, contact 10, case-studies 8, compatibility 8, legacy dated 5, research 2, singles 9, 404 1) |
| `noindex` | 64 = 56 legacy + 4 pagination (`/products/all/page/2-4/`, `/products/rfid-cards/page/2/`) + 3 LP variants + `404.html` |
| Indexable | 535 |
| `sitemap.xml` | 524 (all exist in build); `image-sitemap.xml` 519 page URLs (subset of sitemap) |
| Indexable but not in sitemap | 11 cluster hubs (listed in §3) |
| Canonical ≠ self | 59 (all intentional: 56 legacy + 3 LP variants) |
| Missing canonical / H1 anomalies | 0 / 0 (no page with 0 or >1 `<h1>`) |
| `/machine/` mirrors | 1,038 files, `Disallow: /machine/` for generic crawlers, allowed for named AI crawlers |
| `vercel.json` redirects | 248 (9 wildcard); 59 sources also built as HTML; 3 destinations 404 |

Full per-URL inventory (16 columns) is Phase 1.

# Layer A Removal Plan

**Branch:** `feat/layer-a-removal` (forked from `main` @ `c2c0557`)
**Goal:** Eliminate the WordPress-snapshot rendering layer in favor of idiomatic Astro Content Collections. Delete `src/data/pages/` (202 MB / 1611 JSON), delete `src/lib/render-snapshot.ts` (~852 lines, plus the in-flight +201 from the WIP commit), and ensure the site is served entirely from `src/content/editorial/**/*.json` through `EditorialLayout.astro`.

**Estimated effort:** 5–7 working days for a human; we will pace it phase-by-phase with commits and gating.

**Baseline:** as of `c2c0557` on `main`. Backup at `~/Projects/proudtek-b` (1.4 GB, byte-identical for src/dist).

---

## What "Layer A" actually is today

| Layer | Where | Size | Status |
|---|---|---|---|
| **A — WP snapshots** | `src/data/pages/*.json` (1611) + `src/data/site-meta.json` + `render-snapshot.ts` (852+201 LOC) | 202 MB | Target for removal |
| **B — Editorial** | `src/content/editorial/**/*.json` (482) + 18 components + `EditorialLayout.astro` | 12 MB | Keep / extend |
| **C — Programmatic landings** | `src/lib/{keyword-landing,product-landing-definitions}-batch*.ts` (16 files) | 2.5 MB TS | Keep (out of scope) |

`render-snapshot.ts` is **load-bearing for both** layers today: `SnapshotLayout.astro:11` and `EditorialLayout.astro:15` both call `prepareSnapshot()`. Editorial pages pass through it for legal-rewrite / JSON-LD / link-rewriting. Removing snapshot rendering requires extracting the editorial-relevant subset of `prepareSnapshot()` first.

---

## Phase plan

Each phase ends in **one or more commits** on `feat/layer-a-removal` and a **verification step** before progressing. High-risk phases (P2, P5) gate on user sign-off.

### **P0 — Setup** ✅ done
- [x] Branch `feat/layer-a-removal` created from `c2c0557`.
- [x] This plan committed.
- [x] Baseline backup verified at `~/Projects/proudtek-b`.

### **P1 — Author 11 missing hub editorial entries**

The menu audit's "core" set has ~427 routes. ~395 already have editorial twins. The 11 that don't:

| Route | Existing source | Pattern reference |
|---|---|---|
| `/` | snapshot only | follow `compare.json` hub pattern |
| `/about/` | snapshot only | follow `industries.json` hub pattern |
| `/contact/` | snapshot only | dedicated form-heavy template |
| `/blog/` | snapshot only | follow `guides.json` hub pattern |
| `/faq/` | snapshot only | dedicated FAQ template (links from 20 editorial pages) |
| `/products/all/` | snapshot only | follow catalog pattern |
| `/industries/` | already has industries.json hub partial | extend with kicker/sections |
| `/markets/` | snapshot only | new hub for 10 market children |
| `/lp/` | snapshot only | new hub for 15 landing children |
| `/products/rfid-cards/standard-rfid-wood-card/` | snapshot only | SKU template |
| `/products/rfid-keyfobs/rfid-wooden-keyfob/` | snapshot only | SKU template |

**Workflow per hub:**
1. Read existing snapshot at `src/data/pages/<route>.json` for content seed.
2. Author `src/content/editorial/<group>/<slug>.json` matching `editorialSchema` in `src/content.config.ts`.
3. Verify it merges into `siteData.pages` via `mergeEditorialPages` and renders.
4. Run `npm run build` on a tiny subset to confirm no schema errors.

**Gate:** Pause after first hub (`/contact/`) for user to confirm pattern.

**Commit cadence:** one commit per hub, conventional-commit messages.

### **P2 — Decouple `EditorialLayout` from `prepareSnapshot`** 🚦 high-risk gate

`EditorialLayout.astro:15` currently calls `prepareSnapshot()`. We need editorial pages to render **without** any snapshot dependency.

**Steps:**
1. Audit what `prepareSnapshot()` does that editorial pages actually need:
   - JSON-LD generation
   - Image optimization rewrites
   - Internal-link rewriting (legacy `/product/*` → canonical)
   - FAQ schema injection
2. Extract those into `src/lib/prepare-editorial.ts` (new, target ~150 LOC).
3. Update `EditorialLayout.astro` to call `prepareEditorial()`.
4. Wire `EditorialLayout` into `src/pages/[...slug].astro` so editorial routes render through it (not `SnapshotLayout`).
5. Verify a representative editorial page (e.g. `/industries/healthcare/`) builds and renders identically pre/post (diff the HTML output).

**Gate:** ⚠️ STOP and show user the diff before merging.

**Risk:** SEO regression if JSON-LD or canonical URLs drift. Mitigation: regression test 5 representative pages before commit.

### **P3 — Localize 484 `imageSourceRoutes` references**

Editorial entries pull hero/section images via `imageSourceRoutes: ["/product/<slug>/"]`, which the merge pipeline resolves by reading the snapshot's bodyHtml. Once snapshots are deleted, those resolutions break.

**Steps:**
1. Walk all 482 editorial JSONs; for each `imageSourceRoutes` entry, resolve to the actual image URL.
2. Copy the image (if not already in `public/site-assets/`) to `public/landing-images/<slug>.{jpg,webp}`.
3. Replace `imageSourceRoutes: [...]` with explicit `heroImage: "/landing-images/<slug>.webp"`.
4. Update `mergeEditorialPages` to no longer fall back to snapshot bodies for image lookup.
5. Verify 10 sampled editorial pages render hero images correctly.

**Risk:** Image attribution / sizing differences. Mitigation: keep the snapshot resolution code path active behind a feature flag until P5.

### **P4 — Complete `_redirects` and `410` rules**

| Source | Today | Target |
|---|---|---|
| `_redirects` 301s | 18 | 60 (full `ROUTE_CANONICAL_OVERRIDES` set) |
| `_redirects` 410s | 0 | ~1520 (product-tag, cart, checkout, my-account, category, tag, author) |
| `/case-studies/` | 404 from broken snapshot | decide: author editorial OR 410 |

**Steps:**
1. Generate `_redirects` patch from `ROUTE_CANONICAL_OVERRIDES` (script).
2. Add `/product-tag/* 410!` (Cloudflare/Netlify wildcard).
3. Add `/cart/*`, `/checkout/*`, `/my-account/* 410!`.
4. Resolve `/case-studies/` (decision pending).
5. Validate with `_redirects` linter; deploy to staging if available.

### **P5 — Delete `src/data/pages/` + `render-snapshot.ts`** 🚦 high-risk gate

This is the destructive step. Only attempt after P1–P4 are merged.

**Steps:**
1. Regenerate `src/data/site-meta.json` to drop the 1611 routes (or replace with a stub).
2. Update `src/content.config.ts` `wpPagesLoader` to either go away or read from `_redirects` for surviving short-circuits.
3. Delete `src/lib/render-snapshot.ts`.
4. Delete `src/layouts/SnapshotLayout.astro`.
5. Delete `src/data/pages/` entirely (202 MB).
6. Update `src/pages/[...slug].astro` to enumerate from editorial only.
7. Update `src/lib/site-data.ts` to drop `loadPageFromDisk`, `mergeEditorialPages`'s snapshot fallback, etc.
8. Run full `npm run build` and resolve any "missing snapshot for route" errors by either:
   - Authoring new editorial,
   - Adding a redirect, or
   - Adding to LOW_VALUE_ROUTE_PREFIXES.

**Gate:** ⚠️ Show user the build log + dist file count + dist size delta. Confirm before pushing.

### **P6 — Verification sweep**

- [ ] Full `npm run build` clean (no warnings).
- [ ] Lighthouse run on 8+ routes (must stay ≥0.95 perf, 1.00 SEO).
- [ ] Internal-link audit (no broken `/product/*` references in shipped HTML).
- [ ] Sitemap consistency (sitemap routes ⊆ built routes).
- [ ] JSON-LD validation on home, 1 industry, 1 product, 1 blog post.
- [ ] Manual QA on 5 representative routes including `/contact/` (form submission).
- [ ] Diff dist-restored vs new dist for SEO-critical fields (title, canonical, JSON-LD count, meta description).

**Final commit:** "feat: complete Layer A removal" — squash-merge or PR-merge to `main`.

---

## Rollback policy

At any point, `git checkout main && git branch -D feat/layer-a-removal` reverts everything. The backup at `~/Projects/proudtek-b` provides a second line of defense.

If a single phase regresses SEO/build but later ones are fine, individual phase commits can be reverted with `git revert <sha>` rather than aborting the whole effort.

---

## Open decisions to confirm during P1

1. **`/case-studies/`** — author editorial, redirect to `/blog/?tag=case-study`, or 410?
2. **`/cart/`, `/checkout/`, `/my-account/`** — 410 hard, or stub editorial that points users to `/contact/?intent=quote`?
3. **`/products/all/page/N/`** pagination — keep 4 paginated pages or collapse to single hub?
4. **GA4 event tracking** during the migration — pause `G-30013548` events or preserve to measure traffic delta?

---

*Last updated: 2026-04-28 — generated as part of P0.*

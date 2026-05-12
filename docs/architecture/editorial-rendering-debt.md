# Editorial Rendering Debt — Status & Path-3 Trigger Conditions

**Status:** ~~path-4 guardrail in place; Stages 0 / 1 / 1.5 / 2 all complete~~ → **Path 3 cutover SHIPPED + final dead-code removal complete (2026-05-12)**. All editorial pages render via the shadow `.astro` component tree (`EditorialArticle.astro` + sub-components); `editorial-pages.ts` is now data-and-helpers only.

**Stage status (after final cleanup):**
- ~~Stage 0:~~ snapshot-test guardrail ✅ shipped, then retired with parity tests in cleanup
- ~~Stage 1:~~ ✅ shipped
- ~~Stage 1.5:~~ ✅ shipped (BUG-1/BUG-2 fixed, interfaces merged)
- ~~Stage 2:~~ ✅ shipped (38 .astro components + parity test suite)
- ~~Stage 3:~~ ✅ **CUTOVER SHIPPED** — 303 pages verified, env-flag dispatch removed, shadow tree is sole render path
- ~~Stage 3.x cleanup:~~ ✅ **COMPLETE** — `editorial-pages.ts` 2780 → 1346 lines (~52% reduction). Deleted: `renderEditorialMain` + 23 sub-renderers + `__TEST__` export + 13 orphan imports. Kept: data layer (`mergeEditorialPages`, hub data, scaffold builders, decision-snapshot builders, intent-href helper, etc.).

**Last reviewed:** 2026-05-12 (post-final-cleanup).
**Owners:** historical reference; the debt this document tracked is paid in full.

---

## What the debt is

The HTML-string-concat anti-pattern lives in **9 files**. The biggest
offender is `editorial-pages.ts`. Full scope of path-3 rewrite:

| File | Approx lines | Role |
|------|-------------:|------|
| `src/lib/editorial-pages.ts` | 2687 | Editorial page renderer (25+ `render*` functions) |
| `src/lib/catalog-pages.ts` | ~1320 | Product catalog / pagination renderer |
| `src/lib/utility-pages.ts` | 178 | Utility page renderer (cart / checkout / my-account / 404 etc.) |
| `src/lib/conversion.ts` | varies | Inquiry / RFQ form HTML |
| `src/lib/faq-page.ts` | varies | `/faq/` page renderer |
| `src/lib/icons.ts` | varies | Inline SVG icon set (string templates) |
| `src/lib/seo-feeds.ts` | varies | RSS / Atom feed XML strings |
| `src/lib/seo/*.ts` | mixed | JSON-LD + HTML head/body fragments |
| `src/lib/render-snapshot.ts` | mixed | WordPress snapshot HTML cleanup |

The biggest one — `editorial-pages.ts` — is **2687 lines, ~25 `render*`
functions, all emitting HTML through TypeScript template-literal string
concatenation** — e.g.

```ts
function renderResourceCard(card: EditorialResourceCard): string {
  return `<section class="codex-card codex-editorial-card">
    <h2>${escapeHtml(card.title)}</h2>
    ...
  </section>`;
}
```

The string is then injected into `SnapshotLayout.astro` via
`<Fragment set:html={seo.bodyHtml}>`. The entire editorial render pipeline
runs **without a single `.astro` component** — Astro acts purely as a
delivery shell.

### Why this is a debt

1. No Astro compile-time type-check on HTML attribute / class names — every
   token is a magic string.
2. No scoped CSS — everything depends on global `codex.css` class matching.
3. No `<Image>` / `astro:assets` optimization for hero / inline images.
4. Larger XSS surface — relies on disciplined `escapeHtml` / `escapeAttribute`
   wrapping; easy to miss one.
5. Worse IDE experience — HTML inside backticks has no syntax highlight,
   formatting, or refactor support.
6. Tests can only string-`contains` assert — no DOM-level testing-library
   semantics, no scoped query.

### Why it was built this way

- `editorial-pages.ts` outputs HTML strings that are merged with WordPress
  snapshot HTML by `SnapshotLayout`. Output had to be a string, not an
  Astro component tree.
- Faster bootstrap path when the editorial content layer was first added.
- Has worked in production with no SEO / rendering incidents.

---

## Why we chose path 4 (guardrail) over path 3 (full rewrite)

We considered **four paths**:

| Path | Approach | Status |
|------|----------|--------|
| 1. Container API | Use `experimental_AstroContainer` to render `.astro` components from inside `editorial-pages.ts` | ❌ Blocked — Container API is `experimental` in Astro 4.9 → 6.x; subject to breaking changes in minor/patch releases. Not safe for production. |
| 2. Structured-HTML builder | Replace backticks with `hastscript` / `vhtml` for type-safe AST-based output | ⏸️ Possible interim, but doesn't get Astro features (scoped CSS, `<Image>`); doesn't repay the principal. |
| 3. Full rewrite | Refactor `SnapshotLayout` to branch by route: editorial routes render an `<EditorialPage>` `.astro` component tree; WP snapshot routes keep `<Fragment set:html>` | ✅ Real fix, but deferred. See trigger conditions below. |
| **4. Guardrail** | **ESLint rule** to block new template-literal HTML in fresh files + **Vitest snapshot tests** locking current 25 renderer outputs + path-3 trigger doc | ✅ **Done in this commit.** |

### Reasons path 3 isn't being done now (May 2026)

1. **Timing** — finished a 125-blog content overhaul; `dist/` is at peak
   production value. Lighthouse SEO is 8/8 = 100. Not a moment to inject
   render-pipeline risk.
2. **Workload** — realistic estimate is **3–4 weeks** (not 2–3): 25 nested
   renderers, citation context propagation, polymorphic conditionals on
   `definition.group`, css class-name parity, `editorial-types.ts` ↔
   `editorial-pages.ts` type duplication cleanup.
3. **No test net** — before this commit there were zero unit tests, zero
   snapshots, zero CI. Refactoring without a baseline is reckless. Path 4
   creates that baseline; it's a **prerequisite** for path 3, not a
   competitor.
4. **Not blocking any feature** — the debt only hurts when adding new
   section types, layout changes, or new schema fields. We don't have any
   of those queued.
5. **Opportunity cost** — 3–4 weeks elsewhere can fund hero-image WebP
   compression, blog cluster internal-linking audit, 50 new long-tail
   blog posts, or `Schema.org` rich-result enhancement — all of which have
   higher direct business value than internal architecture cleanup.

---

## Path-3 trigger conditions

**Start path 3 when any one of these triggers fires:**

### Trigger A — Container API reaches GA

Watch for the `experimental_` prefix to be removed in an Astro stable
release. Source: [Astro Container API docs](https://docs.astro.build/en/reference/container-reference/).

When this happens, evaluate whether path 1 (Container-API-based progressive
migration) becomes preferable to path 3 (full rewrite). Container API
unlocks "render `.astro` from inside TS" which makes incremental migration
viable — much lower risk than a big-bang `SnapshotLayout` branching
refactor.

### Trigger B — Layout overhaul is on the roadmap

If anyone proposes work that touches:

- The editorial page structure (header, hero, jump-nav, FAQ, sources, etc.)
- A new theme (dark mode, brand refresh)
- A new component type (e.g. embedded YouTube cards, interactive ROI
  calculators)
- Replacing `codex.css` with a different design system

…**piggyback the path-3 refactor onto that work**. The render-pipeline
change naturally falls out of layout work; doing it standalone is wasteful.

### Trigger C — A production SEO regression

If we ever ship a change that breaks a renderer in a way the snapshot
tests caught (or worse, didn't catch), the resulting investigation will
make path 3 cheaper than continuing to defend the debt with snapshots
alone.

### Trigger D — Team grows past 1 maintainer

A second engineer / contractor will hit the readability cliff in
`editorial-pages.ts` immediately. If we onboard anyone new, plan a path-3
sprint within their first quarter.

### Trigger E — Astro 7 / Astro 8 forces it

If a future Astro major release deprecates `<Fragment set:html>` semantics,
template-literal-style attribute serialization, or the rendering hooks we
depend on — path 3 stops being optional.

---

## What path 4 actually shipped

| File | Purpose |
|------|---------|
| `eslint.config.js` | ESLint flat config, ESLint 10. Wires up the custom rule. |
| `eslint-rules/no-html-template-literal.js` | Custom ESLint rule. Forbids `<word ...>` patterns inside template literals in `src/**/*.ts`. Existing `editorial-pages.ts` and `seo/*` are exempted via path-scoped overrides. |
| `vitest.config.ts` | Vitest config; `astro:content` virtual module is stubbed for unit tests. |
| `src/lib/__tests__/stubs/astro-content.ts` | Stub for `astro:content` so editorial-pages.ts can be imported in tests. |
| `src/lib/__tests__/fixtures/editorial.ts` | Shared deterministic fixtures. |
| `src/lib/__tests__/editorial-pages-leaf.snapshot.test.ts` | Snapshot tests for leaf renderers (resource card / FAQ / table / trust signals). |
| `src/lib/__tests__/editorial-types.test.ts` | Unit tests for pure helpers in `editorial-types.ts` (escape, inline links, outline builder, etc.). |
| `src/lib/editorial-pages.ts` (`__TEST__` export) | Internal hook exporting renderers for snapshot tests. Not for production import. |
| `.github/workflows/test.yml` | CI runs ESLint + Vitest + Astro build on every push to main and every PR. |

---

## Stage 0 + Stage 1 (2026-05)

Path-4 guardrail was extended in two stages as part of preparing the ground for an eventual path-3 rewrite. Both stages are purely additive to the safety net and zero production pages changed externally — only the locked-buggy snapshots in BUG-1 / BUG-2 were intentionally updated.

### Stage 0 — expanded snapshot coverage

| Item | Before | After |
|------|------:|------:|
| Snapshot test files | 1 (leaf only) | 3 (leaf + variants + integration) |
| Snapshot entries | 5 | 35 |
| Unit + snapshot tests total | 45 | 77 |

Files added:

- `src/lib/__tests__/editorial-pages-variants.snapshot.test.ts` — 25 snapshots covering each of the 11 section variants (`statBar`, `comparePanel`, `featureGrid` × 4 icon branches, `dataHighlight`, `timeline`, `testimonial`, `checklist`, `image`, `callout`, body slots, layout attribute, table). Tests go through the public `renderSection()` (already in `__TEST__`) so no production code was opened up just for testing.
- `src/lib/__tests__/editorial-pages-integration.snapshot.test.ts` — 5 full-page `renderEditorialMain()` snapshots: one per major route group (`lp / industries / compare / guides / blog`). Time-based fields are pinned to fixed values so the snapshots are deterministic regardless of build time.
- `src/lib/__tests__/fixtures/editorial.ts` — variant fixtures (+119 lines).

ESLint exemption list unchanged. No production code touched in Stage 0.

### Stage 1 — duplicate consolidation + locked-bug fixes

`editorial-pages.ts` historically grew its own copy of every helper that was later extracted into `editorial-types.ts`. The extraction was never completed — the original locals stayed in place. Stage 1 took down the **four** the user prioritized:

| Change | Files | Snapshot diff |
|--------|-------|--------------|
| Single canonical `renderInlineLinks` + `CitationCtx` (moved local copy to `editorial-types.ts`) | `editorial-types.ts`, `editorial-pages.ts` | Zero |
| BUG-1 fix (escape URL and label per-segment instead of full-text-then-re-escape) | `editorial-types.ts`, `editorial-types.test.ts` (+2 corner tests) | Zero (no production content has `&` in markdown link URLs) |
| BUG-2 fix (delete `editorial-pages.ts` local `resolvePageType`, import canonical version) | `editorial-pages.ts` | 2 of 5 integration snapshots: `data-page-type=""` → `="lp"` / `="blog"` (explicit `-u` approval) |
| Merged duplicate `interface EditorialSection` ↔ `EditorialSectionData` | `editorial-pages.ts` (rename + delete + import) | Zero |

Net effect: 1 fewer test failure (the locked-buggy `renderInlineLinks` case), 2 new corner-case `renderInlineLinks` tests, 2 snapshot updates that correct a hidden bug in `<section class="codex-editorial-hero" data-page-type>`.

### Stage 1.5 — full duplicate consolidation

Stage 1 stopped at 4 items the maintainer prioritized. Stage 1.5 finished the job: every helper and interface that existed in both `editorial-pages.ts` and `editorial-types.ts` was audited and merged.

**Audit method:** read each pair byte-by-byte, classify as one of {byte-identical, formatting-only diff with identical algorithm, semantic divergence}. Anything in the third category was treated as a new BUG-N and handled with the locked-snapshot-diff-review pattern.

**Result:**

| Helper / type | Result | Notes |
|---------------|--------|-------|
| `escapeHtml`, `escapeAttribute`, `isWorkflowSection` | byte-identical → mechanical merge | — |
| `truncateEditorialText`, `summarizeBriefField`, `summarizeSection`, `detectSectionType` | algorithm identical, only if-block formatting / inline comments differed | mechanical merge |
| `buildEditorialOutline` | algorithm identical; local used inline return type, canonical uses named `EditorialOutline` interface | mechanical merge; named type wins |
| `EditorialLink`, `EditorialTable`, `EditorialBriefField`, `EditorialResourceCard`, `EditorialFaq` | byte-identical structural types | mechanical merge |
| `EditorialGroup` (type) | **divergent** — local 8 cases, canonical 14. Same drift category as BUG-2. Canonical is a superset → runtime-safe to widen. | canonical replaces local; no snapshot diff (nothing in production relied on the narrower constraint) |
| `EditorialDefinition` (interface) | **divergent** — local had one extra field `relatedIndustries?: string[]` used by `renderRelatedIndustriesGrid` and present in 18 product JSON files. | added the missing field to canonical first, then merged. Zero snapshot diff |
| `isSectionRoot` | **same name, different semantics — not a duplicate.** Local: breadcrumb-skip predicate (5 fixed routes + `EDITORIAL_OVERRIDE_ROUTES` extensible set). Canonical: hub-route classification (15 hardcoded routes). Canonical is currently unused in production code. | **left untouched.** Either rename canonical to `isHubRoute` during path 3 or delete the canonical+test if it stays unused. |

**Net diff:** editorial-pages.ts shrunk from 2687 → 2581 lines (−106 net). editorial-types.ts grew slightly (gained `relatedIndustries` on `EditorialDefinition`). 77/77 tests still pass after consolidation; zero snapshot diff.

After Stage 1.5, **editorial-pages.ts has no remaining type or helper duplication with editorial-types.ts.** The only "duplicate" left is the `isSectionRoot` name — and that's a semantic collision, not duplication.

---

## Path-4 doesn't repay the principal — it stops it growing

Snapshot tests **don't** make the debt smaller. They:

1. **Lock current behavior** so refactors can't silently drift.
2. **Document the contract** of every renderer — when path 3 happens, the
   snapshots are the success criterion ("new component output must match
   old TS output byte-for-byte, or the diff is reviewed and approved").
3. **Block the disease from spreading** — the ESLint rule prevents new
   files from adopting the same anti-pattern.

The principal still sits in `editorial-pages.ts`. Triggers A–E above are
the agreed-upon conditions for repaying it.

---

## Known latent bugs (locked by tests, fixed by path 3)

These bugs were discovered while writing path-4 snapshot tests. They are
**not fixed in path 4** — the tests lock the buggy current behavior so that
nothing accidentally papers over them later. Path 3 fixes each as a
deliberate, reviewed change.

| ID | File / function | Behavior | Test that locks it |
|----|-----------------|----------|--------------------|
| ~~BUG-1~~ | ~~`editorial-types.ts` `renderInlineLinks`~~ | ~~Double-escape `&` in markdown link URLs.~~ **Fixed Stage 1 (2026-05).** Walks text linearly now, escaping link segments separately. Zero production pages were affected (no markdown link URL contained `&`). | `editorial-types.test.ts` → "escapes & inside the URL exactly once (BUG-1 fixed, Stage 1 2026-05)" |
| ~~BUG-2~~ | ~~`editorial-pages.ts:2687` local `resolvePageType`~~ | ~~Returned empty `data-page-type` for `lp / blog / markets / research / about / faq / home` because the local duplicate was missing 7 cases vs the canonical `editorial-types.ts:resolvePageType`.~~ **Fixed Stage 1 (2026-05).** Local copy deleted; `editorial-pages.ts` imports the canonical version. `/lp/*` and `/blog/*` integration snapshots updated (`data-page-type=""` → `="lp"` / `="blog"`). | Discovered via `editorial-pages-integration.snapshot.test.ts`; now locked correctly by the same snapshots after `-u` review. |

When path 3 starts, scan this section first. Each fix should:

1. Update the bug behavior (and add a regression test for the *correct*
   behavior).
2. Re-run snapshot tests; explicitly approve the snapshot diff if it
   propagates.
3. Cross-check `dist/` HTML for any production page actually affected.
4. Strike through the row (don't delete — preserves audit history).

---

## How to add a new snapshot

When you add or change a renderer:

```ts
// src/lib/__tests__/editorial-pages-leaf.snapshot.test.ts
it("my new case", () => {
  expect(__TEST__.renderXxx(myFixture)).toMatchSnapshot();
});
```

First run creates the snapshot. Subsequent runs compare. To intentionally
update a snapshot after a deliberate change:

```sh
npm run test -- -u
```

Review the diff carefully — if it changes class names or attribute order,
make sure CSS / Lighthouse / SEO are unaffected before committing.

---

## How to bypass the ESLint rule (if you really must)

```ts
// eslint-disable-next-line editorial-debt/no-html-template-literal
const svgIcon = `<svg viewBox="0 0 24 24"><path d="..."/></svg>`;
```

Use sparingly. Each disable comment is a place future-you (or path-3) has
to revisit.

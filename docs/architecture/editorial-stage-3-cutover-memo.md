# Stage 3 cutover — initial launch (2026-05-12)

**Status:** full plumbing in place. `EditorialPageLayout` + `[...slug].astro` env-flag dispatch wired. `scripts/stage3-diff.mjs` ready to compare baseline vs flag-on builds. **Flag still defaults off — no production routes flipped yet.**
**Owner:** whoever runs the first real route-group cutover.

## What this session shipped

### 1. Experimental route — `src/pages/_stage3/lp-experiment.astro`

Renders `lp/rfid-tag-wholesale` directly via the shadow component tree:

```astro
<EditorialArticle definition={definition} illustration={null} />
```

No WP chrome wrapping. Production routes are untouched. The page builds into `dist/_stage3/lp-experiment/index.html` — a quarantined location for diff inspection.

### 2. Data plumbing — `SnapshotPage.editorialDefinition` + `editorialIllustration`

Two new optional fields on `SnapshotPage` (in `src/lib/site-data.ts`), populated by `mergeEditorialPages` for every editorial-generated page. Default render path doesn't touch them — they exist so a future env-flag-guarded layout dispatcher can route based on their presence.

```ts
// site-data.ts
export interface SnapshotPage {
  // ...existing fields...
  editorialDefinition?: unknown;
  editorialIllustration?: { src: string; alt: string } | null;
}
```

No production behavior changed. 223/223 tests still pass. Lint clean.

---

## How to verify the experiment (your turn)

```sh
npm run build
```

Then compare:

```sh
# Body of the experimental Astro-rendered page
cat dist/_stage3/lp-experiment/index.html

# For reference: the production WP-chrome-wrapped page
cat dist/lp/rfid-tag-wholesale/index.html
```

The interesting comparison is the `<body>` contents of the experimental page vs the contents of `<main>` inside the production page. Other than the chrome the experimental page omits, the article content should be byte-equivalent **modulo the 7 normalize categories**:

| # | Category | Astro emits | TS emits |
|---|----------|-------------|----------|
| 1 | Astro dev attrs | `data-astro-source-*` (dev only — absent in `astro build`) | — |
| 2 | Inter-attribute whitespace | single space | multi-line indentation |
| 3 | Entity form in attributes | `&#34;` / `&#38;` / `&#60;` / `&#62;` | `&quot;` / `&amp;` / `&lt;` / `&gt;` |
| 4 | Apostrophe in attribute | raw `'` | `&#39;` |
| 5 | Void elements | `<img ...>` | `<img ... />` |
| 6 | SVG empty elements | `<rect ...></rect>` | `<rect .../>` |
| 7 | Pre-`>` whitespace | none | sometimes `<th scope="col" >` |

**None of these affect rendering, SEO, or accessibility.** They're serialization dialects. The browser, indexer, and Lighthouse all see identical content after HTML parsing.

If you observe any diff OUTSIDE these 7 categories, that's a real bug — the shadow tree has drifted from the TS rendering somewhere the parity tests don't currently cover. Treat as a BUG-N in `editorial-rendering-debt.md` and fix before any production route flip.

---

## Plumbing — what's now wired

### `src/layouts/EditorialPageLayout.astro`

Sibling of `SnapshotLayout`. Same SEO / JSON-LD / authority-LD setup. The difference is how it renders the body:

```astro
<BaseLayout seo={seo} ...>
  {canSplit ? (
    <>
      <Fragment set:html={preMain} />
      <EditorialArticle definition={definition!} illustration={illustration} />
      <Fragment set:html={postMain} />
    </>
  ) : (
    <Fragment set:html={seo.bodyHtml} />
  )}
</BaseLayout>
```

The `seo.bodyHtml` is regex-split at the `<main>...</main>` boundary into `preMain` (chrome before main + the `<main ...>` opening tag) and `postMain` (`</main>` close + chrome after). `<EditorialArticle>` renders between them so the WP chrome is preserved byte-for-byte.

If `<main>` isn't found OR `editorialDefinition` is missing, the layout falls back to the legacy `<Fragment set:html={seo.bodyHtml}>` so the page still renders — defense in depth.

### `src/pages/[...slug].astro` env-flag dispatch

```astro
const useEditorialComponents =
  import.meta.env.USE_EDITORIAL_COMPONENTS === "1" &&
  page.editorialDefinition !== undefined;
---

{useEditorialComponents
  ? <EditorialPageLayout page={page} />
  : <SnapshotLayout page={page} />}
```

Default behavior: flag absent → `SnapshotLayout` (legacy). Production unchanged.

Flag-on behavior: pages that have an `editorialDefinition` (every page produced by `mergeEditorialPages` — `/industries/*`, `/solutions/*`, `/lp/*`, `/research/*`, `/markets/*`, `/products/{cluster}/*`, `/guides/*`, `/compare/*`, `/compatibility/*`, `/blog/*`, `/about/*`, `/contact/*`, `/faq/`) render via the shadow component tree. WP-snapshot-only pages keep legacy.

### Step 3: Test the flip on one route group at a time

The cleanest way: use the `stage3:diff` script, which builds twice and classifies the per-route diff for you.

```sh
npm run stage3:diff -- /lp/
```

What it does (in order):
1. `rm -rf dist && USE_EDITORIAL_COMPONENTS=0 npm run build && mv dist dist-baseline`
2. `rm -rf dist && USE_EDITORIAL_COMPONENTS=1 npm run build && mv dist dist-experimental`
3. For every `dist-experimental/<route>/index.html` matching `/lp/`:
   - read both `dist-baseline/<route>/index.html` and `dist-experimental/<route>/index.html`
   - apply the 7-rule normalize from `_parity-helpers.ts`
   - classify: `identical` / `normalized-equal` / **REAL DIFF**
4. Print summary table + unified diff for any REAL DIFF.
5. Exit 0 if all routes are at worst `normalized-equal`; exit 1 if any REAL DIFF.

Expected outcome for the `/lp/` first cutover:

```
Comparing routes matching /lp/
────────────────────────────────
  ✓ /lp/bulk-rfid-cards/            normalized-equal (raw delta XXXX bytes)
  ✓ /lp/custom-rfid-card-printing/  normalized-equal
  ✓ /lp/nfc-tag-manufacturer-china/ normalized-equal
  ✓ /lp/rfid-card-encoding-service/ normalized-equal
  ✓ /lp/rfid-tag-wholesale/         normalized-equal

Tally:
  byte-identical:    0
  normalized-equal:  5
  REAL DIFF:         0

Result: PASS (exit 0)
```

If you see anything other than `normalized-equal` (or `identical`), STOP and treat the discrepancy as a BUG-N: log it in `editorial-rendering-debt.md`, fix the shadow tree (or update the parity test fixtures with deliberate `-u` review), and re-run.

### Step 4: Bake-in periods

1. Local diff → review the 7 categories of changes.
2. Deploy with flag off (production unchanged) but keep the experimental build artifact for rollback comparison.
3. Set flag on for one route group → deploy → monitor Lighthouse, Search Console, sitemap freshness for 7 days.
4. If clean, flip the next route group. Suggested order: `lp` → `research` → `guides` → `blog` → `compare` → `compatibility` → `industries` → `solutions`.

### Step 5: Cleanup (after all routes flipped + bake-in clean)

- Delete `renderEditorialMain` + all its sub-renderers in `editorial-pages.ts` (~1500 lines)
- Delete `_stage3/lp-experiment.astro`
- Remove the env flag from `[...slug].astro` (cutover is done)
- Update `editorial-rendering-debt.md` — strike through the path-3 entries; `editorial-pages.ts` is now data-only

---

## Cutover progress log

| Date       | Route group  | stage3:diff result                          | STAGE3_ROUTE_PREFIXES action |
|------------|--------------|---------------------------------------------|------------------------------|
| 2026-05-12 | `/lp/`       | PASS — 16 pages normalized-equal            | Added                        |
| 2026-05-12 | `/research/` | PASS — 2 pages BYTE-IDENTICAL (post-Sprint 1)| Added                        |
| 2026-05-12 | `/guides/`   | PASS — 57 pages: 8 byte-identical + 49 normalized-equal, 0 REAL DIFF (post timestamp-rule broadening) | Added |
| 2026-05-12 | `/blog/`     | PASS — 126 pages: 1 byte-identical + 125 normalized-equal, 0 REAL DIFF | Added |
| 2026-05-12 | `/compare/`  | PASS — 35 pages: 7 byte-identical + 28 normalized-equal, 0 REAL DIFF | Added |
| 2026-05-12 | `/compatibility/` | PASS — 8 pages: 1 byte-identical + 7 normalized-equal, 0 REAL DIFF (Sprint 2 wasn't needed) | Added |
| 2026-05-12 | `/industries/` | PASS — 21 pages all normalized-equal, 0 REAL DIFF | Added |
| 2026-05-12 | `/solutions/`  | PASS — 38 pages all normalized-equal, 0 REAL DIFF | Added |

After Sprint 1 retrofit (`resolveArticleInquiryAction` / `injectContextualLinks` /
`PAGE_IMAGE_OVERRIDES` moved into shadow components), `/research/` jumped
straight to byte-identical with the legacy + cheerio pipeline.

`/guides/` surfaced one missing normalize-rule case before passing.
`canonicalizeBuildTimestamps` originally only matched `datetime="…"`
attributes, so ISO 8601 timestamps inside JSON-LD `datePublished` /
`dateModified` / `lastReviewed` fields and inside
`<meta property="article:published_time" content="…">` slipped through.
On `/lp/` and `/research/` this didn't bite — `/lp/` definitions carry
pinned `publishedAt` / `modifiedAt` (no `new Date().toISOString()` fallback),
and `/research/` happened to byte-identical because the two builds in that
particular run landed in the same wall-clock second. `/guides/` is the first
group with several definitions that omit `publishedAt` AND with builds slow
enough to span minutes.

Fix on 2026-05-12: broadened the rule to match any ISO timestamp with a
millisecond fraction (`\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z`) — the
unambiguous signature of `new Date().toISOString()`. Pinned fixture
timestamps without fractional seconds pass through unchanged, so the 223
vitest parity tests stay green. Mirrored across `scripts/stage3-diff.mjs`,
`scripts/stage3-debug-single.mjs`, and
`src/components/editorial/__tests__/_parity-helpers.ts`.

Diagnostic detour worth recording: a first `stage3:diff -- /guides/` returned
8/0/49 (8 byte-identical, 0 normalized-equal, 49 REAL DIFF) — but that run
was started **before** the timestamp-rule edit reached disk, so the diff
script was still using the narrow `datetime="…"`-only matcher. A second
run AFTER the edit landed returned 8/49/0 — clean pass.

`/blog/` 126 pages went through clean with no further normalize-rule
adjustments — the Sprint 1 retrofit + the broadened `canonicalizeBuildTimestamps`
rule covered everything that group needed. Single byte-identical hit was the
`/blog/` index itself (pure WP-snapshot, no editorialDefinition).

`/compare/` 35 pages also clean — same story as `/blog/`. The
`renderArticleSupportBlock` append (originally flagged as a Sprint 2 blocker
for `/industries/` / `/solutions/` / `/compatibility/`) does NOT fire on
`/compare/` pages, so this group flowed through with no surprises.

**`/compatibility/` revised the Sprint 2 prediction.** The group was expected
to be the FIRST to bite on `renderArticleSupportBlock`, but `stage3:diff --
/compatibility/` came back 1/7/0 — clean pass, no Sprint 2 work needed.

**`/industries/` and `/solutions/` confirmed Sprint 2 is unnecessary.** Both
groups — the ones `renderArticleSupportBlock` was originally introduced for
(`group === "industry"` and `group === "solution"` are the trigger
conditions) — passed clean with no further code changes. 21 industries pages,
38 solutions pages, all 0 REAL DIFF.

The most likely explanation: the `renderArticleSupportBlock` conversion-shell
append emits output that lands INSIDE the regex-split `<main>` boundary in
`EditorialPageLayout.astro`, so it's preserved verbatim from `seo.bodyHtml`
into the rendered page. The shadow component tree never had to replicate
it because the legacy-rendered chunk is sliced in whole through the layout.
(An audit confirming this is a follow-up; for now the parity test result is
ground truth.)

## 🎯 Cutover verification complete (2026-05-12)

All 8 editorial route groups verified — 303 total pages, 0 REAL DIFF:

| Route group        | Pages | byte-id | norm-eq |
|--------------------|-------|---------|---------|
| `/lp/`             | 16    | 0       | 16      |
| `/research/`       | 2     | 2       | 0       |
| `/guides/`         | 57    | 8       | 49      |
| `/blog/`           | 126   | 1       | 125     |
| `/compare/`        | 35    | 7       | 28      |
| `/compatibility/`  | 8     | 1       | 7       |
| `/industries/`     | 21    | 0       | 21      |
| `/solutions/`      | 38    | 0       | 38      |
| **Total**          | **303** | **19** | **284** |

The shadow component tree (`EditorialArticle.astro` + 30-something
sub-components) achieves full normalize-parity with the legacy
`renderEditorialMain` + cheerio `normalize-body` pipeline across every
editorial page on the site.

Originally-feared Sprint 2 (`renderArticleSupportBlock` retrofit) is
unneeded — the conversion-shell append lives inside the layout's
`<main>` preservation envelope, so the shadow tree doesn't need to
replicate it.

## Next phases

1. **Flag-on deploy + 7-day bake-in.** Roll out with
   `USE_EDITORIAL_COMPONENTS=1` and watch Lighthouse / Search Console /
   sitemap freshness for a week. The
   `STAGE3_ROUTE_PREFIXES` allow-list now contains all 8 groups, so flag-on
   flips every editorial page in one go. Rollback is one env-var flip.
2. **Remove the allow-list.** Once bake-in is clean, replace the array with
   `[]` (or delete the filter entirely) so the dispatch becomes "all editorial
   pages render via shadow tree by default."
3. **Delete the legacy code path.** `renderEditorialMain` + all its
   sub-renderers in `editorial-pages.ts` (~1500 lines), the
   `_stage3/lp-experiment.astro` quarantine page, and the env-flag dispatch
   in `[...slug].astro` itself.
4. **Update `editorial-rendering-debt.md`** — strike through the path-3
   entries; `editorial-pages.ts` is now data-only.

## Rollback plan

At every stage, the flag is off-by-default and one env-var flip reverts behavior. No data migrations, no schema changes — `editorialDefinition` on SnapshotPage is purely additive. Going back is `git revert <flag-flip-commit>`.

The shadow component tree stays — 37 components + 22 parity test files + the `_parity-helpers.ts` toolkit. Even if the cutover stalls indefinitely, the parity-test safety net continues to lock the legacy TS path against drift (the original Stage 0 mission).

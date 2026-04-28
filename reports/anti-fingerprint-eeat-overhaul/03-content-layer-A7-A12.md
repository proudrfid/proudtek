# Phase 1B — Content-layer structural diversity (A7–A12)

The second batch of content-layer fixes targets chart-component coverage uniformity, author-byline monotony, summary opening syntax homogeneity, summary-tail clusters, and dataHighlight title repetition.

## A7 — Stagger 4-chart-component coverage

**Concern.** 218 pages carried the full chart set — `statBar` + `comparePanel` + `dataHighlight` + `timeline` — every page identical. Real editorial teams ship some pages with fewer charts based on whether the data warrants it.

**Action.** For 30 % of 4-set pages (68 pages), drop 1–2 components. Drop priority: `dataHighlight` > `comparePanel` > `statBar`. `timeline` always retained since it carries the de-fingerprinted Blocker C content. Rotation by hash so the dropped component varies by page.

**Result:**

| Coverage tier | Pre | Post |
|---|---|---|
| 4 components | 218 | 150 |
| 3 components | 6 | 51 |
| 2 components | 14 | 37 |
| 0–1 components | 241 | 241 (untouched, simple pages) |

91 individual chart components removed across 68 pages.

## A8 — Distribute authorSlug across named authors

**Concern.** 447 / 479 pages = 93 % attributed to `authorSlug: editorial-board` — a single collective byline. E-E-A-T scoring penalises content with no individual author accountability.

**Action.** Distribute pages across the existing real authors using their published bio expertise:
- **Peter Zhang** (founder, factory-experience byline, 4 declared focus areas): NFC business cards, hotel-lock RFID, RFID laundry-tag, UHF RAIN deployments → 77 pages
- **Nancy Wu** (industrial-laundry program manager, ISO 6330 reviewer): industrial-laundry / textile-care content → 5 pages
- **editorial-board** (collective byline): everything else (multi-source / standards-heavy content) → 397 pages

**Decision: do NOT fabricate authors.** The temptation to spin up 3–5 fake personas with stock-photo avatars to balance the byline split was rejected because invented authors are themselves an E-E-A-T anti-pattern that Google's spam systems explicitly check. Only real bio-backed personas were used.

**Result:** Named-author share rose from 0 % to 17 %. Editorial collective shrank from 93 % to 83 %. Acceptable for a small B2B technical site where a collective reviewing team is a credible publishing model.

## A9 — Vary summary opening syntax

**Concern.** 172 pages opened summary with `Subject + verb` pattern (`X are/is/use/uses/help/provide/embed/integrate/...`). 60 % concentration on this single sentence form.

**Action.** For 40 % of pages with this pattern (70 pages), prepend a per-group context clause and lowercase the now-mid-sentence subject:
- industries: `Across this vertical,` / `In day-to-day operations,` / `On regulated sites,`
- solutions: `For procurement teams evaluating this stack,` / `In typical buyer programmes,`
- products: `In specification terms,` / `On the bench,` / `In real-world deployments,` / `At BOM level,`
- compare: `For the buyer side-by-side,` / `In specification terms,`

**Result.** Subject + verb opener pattern reduced from 172 → 102 pages (41 % reduction).

## A10 — Defuse summary tail clusters

**Concern.** 35 pages ended their summary with `This page is the [topic] reference for [audience].` — identical 4-word opener, only `[topic]` and `[audience]` swapping per page.

**Action.** 8 alternative templates, hash-seeded:
- `Use it as the {topic} reference when working with {audience}.`
- `Treat this as the {topic} reference for {audience}.`
- `It serves as the {topic} reference for {audience}.`
- `For {audience}, this is the {topic} reference.`
- `{audience} treat this as the {topic} reference.`
- ... etc.

3 additional cases used the variant `[topic] matrix / framework / reference for [audience]` and were patched with an extended regex. 2 remaining cases (`corrections.json`, `mifare-plus-vs-desfire.json`) are bespoke uses of the phrase intentional to the page meaning — left untouched.

**Result.** 35 pages → 31 pages rewritten via primary regex + 3 via extended regex + 2 left as legitimate bespoke uses.

## A11 — Vary timeline + dataHighlight title syntax

**Concern.** Audit showed `dataHighlight.heading` field had a 10-occurrence cluster of `Where the programme moves the [X] posture` template. Timeline title cluster much smaller (most timelines had no title).

**Action.** 10 alternative templates for the dataHighlight cluster:
- `How the programme shifts the {what}`
- `Posture changes after rollout — {what}`
- `What the programme changes about {what}`
- `Programme impact on {what}`
- `Operating posture: {what}`
- `Effect on {what} once the programme runs`
- ... etc.

**Result.** 10 dataHighlight headings rewritten. Top frequency post-rewrite: `What the programme` 2× / `Where teams land` 2× — no cluster remaining.

## A12 — Schema.org JSON-LD audit (template-layer scoping)

A12 was scoped as audit-only; remediation actions live in B1–B4.

**Findings:**

1. **Two Article emitter paths exist.** `src/lib/seo.ts` line 4402–4449 emits Article schema for `kind === "article"` pages. `src/lib/editorial-authority-ld.ts` emits a second Article record via SnapshotLayout.astro for any editorial-collection page with authority data.
2. **Path overlap on `/solutions/`, `/compare/`, `/guides/`, `/compatibility/`, `/blog/{slug}/`, `/20XX/...`** — these all return `"article"` from `inferPageKind()` AND have editorial-collection records, so both paths fire and emit duplicate Article entities.
3. **`reviewedBy` type mismatch is benign.** seo.ts uses `Organization` (because it receives a team-name string), editorial-authority-ld uses `Person` (because it resolves a slug). Different data shapes, both correct for their data.
4. **citation array drops `accessedAt` + `note`** — fixed in B2.
5. **`headline` not truncated** to Google's 110-char guideline — fixed in B3.
6. **`image` field missing** from Article schema — fixed in B4.
7. **No `@id` for dedupe** — fixed in B1.

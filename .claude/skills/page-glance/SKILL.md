---
name: page-glance
description: >
  Rework a Proudtek product/editorial page's "At a glance" block when the page
  is already complete but that block reads as a dense, uniform, all-text facet
  grid (the brief[] cards rendered by DecisionSnapshot). Keeps the top two
  quick-answer cards, then moves the remaining facets into sections[] as
  illustrated, varied editorial segments — split / split-reverse figure
  sections with SVG diagrams + a featureGrid reference block + tailored
  per-facet voice — with every chip name, standard, dimension and threshold
  frozen verbatim. Mockup-first: present a brand-accurate HTML mockup and get
  the direction confirmed before restructuring. Use when the user points at a
  specific product/editorial page and says its At-a-glance / facet grid is
  密密麻麻/枯燥/千篇一律/dense/monotonous/dry/all-text, wants
  图文结合/配图/错落有致/illustrations + varied layout on the summary block, or
  asks to make that block less of a wall of text. NOT for thin pages needing
  completeness (use page-geo), NOT blog posts (blog-transform / blog-voice),
  NOT solutions/guides voice passes (page-voice), and NOT a shared-component
  redesign (that is a design-system change — flag it for review, do not do it
  silently).
---

# page-glance — illustrate a page's "At a glance"

Turns the dense facet wall at the top of an editorial page into an
illustrated, varied, skimmable block — same facts, better reading.

## What you're changing (and why the wall exists)

The "At a glance" block is rendered by `DecisionSnapshot.astro` from the page's
`brief[]` array: the **first two** brief items become quick-answer cards (plus
a "next step" card), and **`brief[2:]`** render as a uniform `<dl>` grid of
label + bullet cards. That grid has **no image support and no layout
variation** by design — so it stacks 8-10 identical text cards. That is the
"密密麻麻 / dry / 千篇一律" the user is reacting to.

You cannot add figures or vary the layout inside `brief[]`. The fix is to move
the facet content into `sections[]`, which *does* support figures, split
layouts and feature grids. Do this for the **one page** the user named. Do not
touch the shared `DecisionSnapshot` component — that upgrades every product
page at once and is a design-system change (flag it, get review).

## Before you touch anything

Read `DESIGN.md`. The brand is **warm editorial / luxury-procurement**,
"serious-but-not-boring" — so light wit is on-brand, but chip specs and
certifications are **load-bearing** (procurement cross-references datasheets).
Never fabricate or drift a fact. See `memory/feedback-verify-chip-claims.md`.

## Workflow

### 1. Read the page + pull the exact facts
Read the target JSON in `src/content/editorial/**/*.json`. Dump `brief[]` and
the existing `sections[]` so you have every fact verbatim (chips, standards,
dimensions, thresholds) and can see what the detail sections already cover
(avoid duplicating them).

### 2. Mockup-first — get the direction confirmed
Build a **brand-accurate standalone HTML mockup** of the redesigned block using
the codex color tokens (cream `#f8f6f1`, gold `#c39a5f`/`#6d5a3a`, ink
`#291c0e`, teal `#3d6b6b`/`#2c5454`, serif headings) with tailored copy + 2-3
inline SVG figures + a varied layout. Present it with `present_files` and let
the user react before you restructure.
Do **not** use the visualize/show_widget tool for this — it renders in the
claude.ai neutral skin, not the warm brand, so it misrepresents the look. A
plain HTML file is faithful.

### 3. Restructure (round-trip Python; only `brief[]` + `sections[]`)
- `brief[]` → **keep only the first two quick-answer cards**, byte-identical.
  Remove the rest.
- `sections[]` → lead with an illustrated, varied sequence:
  - a `layout:"split"` concept section (intro + anatomy/hero figure),
  - keep the existing statBar strip if there is one,
  - `layout:"split-reverse"` for the most visual technical facet (e.g. an
    isolation / construction diagram) — **merge it into the existing detail
    section** on that topic rather than duplicating,
  - one or two more `layout:"split"` figure sections for the other visual
    facets,
  - keep the existing comparePanel / dataHighlight / timeline sections,
  - a **`featureGrid`** "reference facts" block (emoji icons) that absorbs the
    remaining reference facets (standards / housing / presets / QA / logistics
    …) as scannable tiles.
- **Voice:** one light wit-beat per heading or intro (e.g. "Why the two chips
  don't fight"); security / safety / compliance facets stay sober — no jokes
  near AES, audit thresholds, patient safety.
- Everything else in the file (route/title/summary/heroPoints/faq/sources/
  actions/…) stays **byte-identical**. Bump `modifiedAt`.

### 4. Freeze the facts (this is the whole game)
- **Round-trip** with `json.dumps(d, indent=2, ensure_ascii=False)+"\n"`.
- **`{chip:}` discipline** (the drift-lint is *positional*, not multiset): a
  `{chip:...}` line may only survive if it stays byte-**and**-position
  identical to origin/main (i.e. inside `brief[0]`/`brief[1]` or a section you
  don't move). Any `{chip:}` whose content **moves** into a new/rewritten
  section must be **inlined to its plain resolved value** (e.g.
  `{chip:atmel-t5577:name}` → `T5577`) — never carry a placeholder into moved
  content. Confirm **0 added `{chip:}` lines** vs origin/main.
- **factscan DROPPED must be empty** — every fact token removed from `brief[]`
  has to reappear in the new sections. Preserve wording to minimise churn.
  Inlined resolved chip values are the only expected NEW token(s).

### 5. Figures — SVG conventions
2-3 SVGs to `public/diagrams/products/<slug>-<topic>.svg`. Follow
`.claude/skills/blog-transform/references/svg-style.md`: viewBox exactly
`0 0 1200 675`; `<title id="t">` + `<desc id="d">` + `role="img"
aria-labelledby="t d"`; **one `<text>` per line, no `<tspan>`**; escape `&` as
`&amp;`; palette-only (cream bg, teal/steel/gold; RED `#8b2d2d` only for a
genuine reject/risk state); font ≥ 12; **every number in the SVG must appear
in the page JSON text**.

### 6. Verify (reuse the repo gates — don't invent new ones)
- `python3 .claude/skills/page-geo/scripts/selfcheck.py --repo . --old
  origin/main:<path> --new <out> --allow-new-tokens` → `PASS`, `zod strict
  OK`, `chip-added-lines: 0`, `DROPPED: []`. Justify every NEW token (should
  just be inlined chip values).
- `node .claude/skills/blog-transform/scripts/check-svg.mjs <svgs>` → all ✓;
  render each to PNG (cairosvg width 1000) and **look at it**; fix overflow.
- `python3 .claude/skills/page-geo/scripts/build_preview.py …` → a rendered
  preview to present.
- **Snapshot:** the page is in `editorial-pages-integration.snapshot.test.ts`,
  but that snapshot captures per-page **SEO/metadata**, not the section body —
  so a brief/sections restructure normally leaves it **unaffected**. Confirm
  in a throwaway `/tmp` worktree: copy the new JSON in, `npx vitest run
  <snapshot test>` **without** `-u`; if it passes green, no regen is needed. Only
  if it fails, regenerate with `-u` and commit the updated `.snap` on the branch.

### 7. Deliver
Build an unpushed branch `page-polish/<slug>` off `origin/main` via plumbing
(read-tree → hash-object → commit-tree; see
`memory/feedback-deploy-branch-off-main-not-checkout.md`), containing the JSON
+ SVGs (+ `.snap` only if it actually changed). Present the preview + a short
NOTES with the push command. Say it's a **sample page** and offer the two ways
to extend: page-by-page, or a shared-`DecisionSnapshot` upgrade (design-system
change → review).

## Section schema cheat-sheet (`src/content.config.ts` `sectionSchema`)

Per section, any of: `title`, `intro`, `paragraphs[]`, `bullets[]`,
`table{columns,rows}`, `image{src,alt}`, `callout{label,text,href?}`,
`statBar{items:[{value,label}]}`, `comparePanel{beforeHeading,afterHeading,
before[],after[]}`, `featureGrid{features:[{icon,title,text}]}` (icon is an
**emoji** string), `dataHighlight{value,heading,text,source?}`,
`timeline{items:[{label,text}]}`, `checklist[]`, and
`layout: "default" | "split" | "split-reverse"` (split pairs the `image` beside
the text).

## Gotchas

- **Some editorial JSON isn't `json.dumps`-round-trippable** — if a full
  re-serialise explodes the diff, edit by targeted line replacement instead
  (see `memory/` lp-batch notes).
- **Don't duplicate** the existing detail sections — merge the figure into the
  section that already covers that topic.
- **Round every SVG number back to a page fact.** If it's not on the page,
  it doesn't go in the diagram.
- This is a **one-page** skill. Extending to every product page means changing
  `DecisionSnapshot` — a design-system change; flag for review, don't do it
  under this skill.

## Worked example

`page-polish/dual-freq-at-a-glance` — `products/rfid-keyfobs/
dual-frequency-key-fob`: `brief[]` 11→2, three split/split-reverse figure
sections (fob anatomy, cross-frequency isolation, Wiegand→OSDP) + a featureGrid
reference block; selfcheck PASS, `chip-added-lines 0`, snapshot unaffected.

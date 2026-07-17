---
name: product-transform
description: >-
  Full-page makeover for Proudtek PRODUCT pages
  (src/content/editorial/products/**/*.json): one pass that (1) rewrites dry
  spec-sheet prose with the house dry wit, (2) breaks up every wall of text —
  the dense At-a-glance facet grid, bullet walls, long uniform sections — into
  varied, illustrated layout, (3) draws brand-tokenized SVG diagrams for the
  text-dense spots, and (4) protects and sharpens the page's SEO/GEO traffic
  layer while doing it. Use whenever the user wants a product page (or the
  product line) 有品牌范儿 / 图文结合 / 排版优美 / 幽默有趣 / 不那么密密麻麻 /
  更好看 / 带来流量, or says "transform / revamp / redesign this product page",
  "make it fun AND illustrated", "太枯燥/太密/长篇大论", even without naming a
  file or the word "skill". Blog posts → blog-transform. Solutions/Guides
  voice → page-voice. Thin/incomplete pages → page-geo first, then this.
  Other non-blog groups (compare/markets/lp/case-studies) only when the user
  explicitly points this skill at them.
user-invocable: true
args:
  - name: target
    description: >-
      Product slug or path (e.g. "rfid-silicone-flexible-tag" or
      "src/content/editorial/products/rfid-tags/<slug>.json"). Optional —
      ask if missing.
    required: false
  - name: mode
    description: >-
      "preview" (default — new JSON + SVGs + rendered preview, zero git
      writes), "branch" (plumbing branch off origin/main + push handoff), or
      "commit" (commit on current branch — only when you own the worktree).
    required: false
---

# product-transform — 品牌范儿 + 图文 + 流量, one pass

Turns a correct-but-dense product page into one a buyer enjoys reading, an AI
engine keeps citing, and the brand is proud of — **without changing a single
factual claim**. Product pages are money pages read by procurement teams who
cross-reference vendor datasheets: wit must never cost credibility, and the
GEO layer (AI assistants are the site's #1 new-customer channel) must come
out stronger, never weaker.

Three layers, one rewrite pass (sequential passes undo each other):

1. **Layout** — kill the walls of text; illustrated, varied, skimmable.
2. **Voice** — dry professional wit, Tier-calibrated.
3. **Traffic** — answer-first, extractable, fresh; every GEO field preserved
   or sharpened.

**Prerequisite**: the page is already at the completeness line (products/
went through page-geo in 2026-07). If the page is thin — few sections, no
spec table, FAQ < 4 — run `/page-geo` first; this skill redistributes and
polishes substance, it does not create it.

## Step 0 — Scope, tier, claim

- **Read the page from origin/main, never the working tree** (`git fetch
  origin main` then `git cat-file -p origin/main:<path>`). The main worktree
  is routinely parked on someone else's WIP — treat it as read-only
  throughout; deliver via plumbing (Step 8).
- **Check for prior work before starting**: `git ls-remote origin '*<slug>*'`,
  local `git branch --list '*<slug>*'`, and memory/PR notes. Redoing merged
  or in-flight work has real precedent. `STOP_*` sentinels halt bulk
  rollouts, not a user-named single page.
- **Tier the topic**:
  `node .claude/skills/blog-voice/scripts/classify-tier.mjs <path>` (accepts
  any JSON path). Tier A = full treatment (humor 6–7/10). **Tier B — medical
  / patient-safety / pharma adjacent (surgical instrument tags, pharma
  labels…) = humor ≤2/10, sober illustrations, never wit near a harm
  outcome.** Unsure → Tier B.
- **Mode**: if the user didn't say, ask — preview (default) / branch / commit.

## Step 1 — Read before writing

Read the whole target JSON; inventory every fact verbatim (chips, standards,
dimensions, thresholds, prices, MOQs) — this list is your freeze manifest.
Then run selfcheck **old-vs-old** (`--old origin/main:<path> --new <copy of
the same file>`) to surface pre-existing failures before they masquerade as
yours: legacy schema-orphan fields (e.g. `summaryMeta` — zero consumers;
drop it and note the drop) and missing trailing newlines are known. Fix
pre-existing issues deliberately and list them in NOTES, or they'll fail
your gates later.
Read 2–3 sibling product pages and any solutions/guide page on the same
topic: real internal-link targets, no duplicated sections, no contradicted
canonical facts. Read `DESIGN.md` — the brand is **warm editorial /
luxury-procurement**, a premium trade publication that enjoys its subject.
"品牌范儿" means that system, not generic polish: Lora serif display, Inter
body, cream/gold/teal tokens, generous whitespace.

## Step 2 — Mockup first when the direction is new

If this page family hasn't been transformed before (or the user hasn't seen
the pattern), build a **brand-accurate standalone HTML mockup** of the
reworked top-of-page (At-a-glance + one representative figure section) using
the codex tokens — cream `#f8f6f1`, gold `#c39a5f`/`#6d5a3a`, ink `#291c0e`,
teal `#3d6b6b`, serif headings — present it, and get the direction confirmed
before restructuring. Do **not** use show_widget/visualize for this (it
renders in the claude.ai skin, misrepresenting the brand); a plain HTML file
is faithful. When the pattern is already ratified (sample page approved,
batch continuation), skip the mockup and go straight to preview.

## Step 3 — The rewrite (one pass, three layers)

### 3a · De-dense the At-a-glance

`DecisionSnapshot.astro` renders `brief[0..1]` as quick-answer cards and
`brief[2:]` as a uniform text grid with **no image support** — that grid IS
the 密密麻麻 the user is reacting to. You cannot illustrate inside `brief[]`;
move the content out:

- `brief[]` → keep **only the first two** quick-answer cards, byte-identical.
- The evicted facets land in `sections[]` as a varied, illustrated sequence:
  a `layout:"split"` anatomy/concept section up top; `"split-reverse"` for
  the most visual technical facet — **merged into the existing detail section
  on that topic, never duplicated**; one or two more split figure sections;
  and a `featureGrid` "reference facts" block (emoji icons) absorbing the
  remaining reference facets (standards, housing, QA, logistics) as tiles.
- Keep existing statBar / comparePanel / timeline / dataHighlight sections —
  they already beat prose.

### 3b · Layout gate everywhere else

No wall survives: any run of 5+ parallel-fact bullets, or bullets >250
chars, becomes a table / comparePanel / statBar / checklist / timeline
(pick by content shape — the table in
`.claude/skills/page-geo/references/voice-and-visuals.md`). A title-only or
otherwise empty section renders as a bare H2 wart — fill it (a statBar
usually fits) or delete it, never leave it. 避免长篇大论 is a subtraction
rule: keep **`brief[]` + `sections[]` combined chars roughly flat** — the
At-a-glance eviction legitimately shifts thousands of chars from brief into
sections (sections alone will grow; the combined total must not). Every wit
line must pay for itself; cut filler to fund it. Key
conclusions live in standalone 2–4 sentence paragraphs an engine can lift
whole. Vary section rhythm: split / split-reverse on figure sections,
default elsewhere; whitespace beats filler.

### 3c · Voice

Follow the calibration in `voice-and-visuals.md` (read it): humor from
precision, buyer's-world metaphors (loading docks, audits, chargebacks),
one wit-beat per intro — not three. Tier A 6–7/10, Tier B ≤2/10.
**Never funny, anywhere**: spec tables, FAQ answers, `summary`, compliance/
legal claims, prices, `sources[]`, `brief[]` — those blocks get quoted
verbatim by AI engines and must survive out of context with a straight face.
The reconciling sentence: **the joke lands after the answer, never instead
of it** — every intro's first sentence is the takeaway.

### 3d · Traffic layer (the 高流量 part)

Read `.claude/skills/blog-transform/references/seo-geo.md` for field
mechanics — they transfer to product pages. Non-negotiables while rewriting:

- `summary`: sentence 1 answers the title query with a hard number, survives
  the 155-char meta cut. Sharpen it; never bury it under a joke.
- Section `title`s phrased as real buyer questions where natural (H2s match
  conversational queries).
- `faq[]` ≥5, answer-first, self-contained (feeds FAQPage JSON-LD; quoted
  verbatim by AI engines). The reliable buyer six: MOQ, lead time, sampling,
  artwork, encoding, compliance-or-durability.
- `keywords[]` 4–7 mixing head + long-tail. `sources[]`: existing entries
  survive untouched; any **new** entry only for a URL opened and verified
  this session. ≥3 contextual internal links to routes you've confirmed
  exist; every existing `href` survives.
- `title`: wording may sharpen (≤60 chars ideal for CTR), keyword structure
  never shuffles out. Brand in prose is **"Proud Tek"** (with space).
- `modifiedAt` → today (real update; stale pages hit the ~3-month AI
  citation cliff). **Never touch `reviewedAt`/`reviewedBySlug`.**

## Step 4 — Freeze the facts (this is the whole game)

- **Facts are frozen.** Chip names, certifications, memory/frequency specs,
  standards numbers, quantities, prices, MOQs — edit the human layer, never
  the spec layer.
- **`{chip:}` discipline — the drift lint is positional, not multiset**: a
  placeholder line survives only byte-**and**-position identical to
  origin/main. Any `{chip:}` whose content **moves** (e.g. out of `brief[]`)
  is **inlined to its plain resolved value**. Resolution rule
  (chip-specs.json): `:name` → `displayName`, `:short_name` → `shortName ??
  displayName` — so `{chip:nxp-ntag-213:name}` → `NXP NTAG 213` (vendor
  prefix included; verify each value, don't guess). New content uses plain
  short-form chip names, never new placeholders. Provable-safe construction:
  **0 diff-added lines containing `{chip:`**; a surviving frozen line must
  also not become the last element of its array (trailing-comma diff).
  Appending entries *after* a frozen line's array (e.g. new FAQ items) is
  safe only when the frozen line isn't the closing element; reordering or
  deleting around it is not.
- **factscan DROPPED must be empty** — every fact token leaving `brief[]`
  reappears in the new sections. Know the semantics: factscan is
  **set-based on exact token strings** (chip families, ISO/IEC/CFR,
  `$`-amounts, number+unit) matched anywhere in the file — surrounding
  prose is free to change, which is precisely what makes de-walling safe.
  Preserving wording is a churn-minimising courtesy, not the gate.
  Expected NEW tokens: inlined chip values (often zero — the resolved
  string usually already exists on the page); anything else needs a
  source. Quirk: `$`-tokens swallow a sentence-final period.
- **Round-trip**: `json.dumps(d, indent=2, ensure_ascii=False) + "\n"`. If a
  file isn't round-trippable, fall back to targeted raw line edits.
- **Products top-level fields** (`chipFamilies`, `envFamilies`,
  `relatedIndustries`, `resourceCards`) are preserved; facet values only
  from the FACET_RULES vocabulary (`src/lib/catalog-pages.ts` ~L308).
- **Company facts** (MOQ, lead time, wash cycles, capacity):
  `references/canonical-facts.md` (page-geo) outranks everything; unruled +
  contradictory → `[OWNER-CONFIRM]`, never majority vote. Factual errors
  found en route: follow the correction protocol in `voice-and-visuals.md`
  (primary source in hand, `## Corrections` in NOTES, auditable selfcheck
  flags) — fix with proof or flag, never silently preserve or improvise.

## Step 5 — Illustrations (the 图文 part)

Read `.claude/skills/blog-transform/references/svg-style.md`, open 1–2
recent SVGs in `public/diagrams/products/` as live anchors, then draw.

- A diagram must **add information** — anatomy cross-section, process flow,
  band map, isolation/physics, decision ladder — never decoration. The two
  universal product subjects: construction cross-section + process flow;
  material-specific physics beats generic beauty shots. Floor: the reworked
  page carries **≥3 section figures/diagrams** (an At-a-glance rework
  typically lands 2–3 new split figures); a section whose payload is already
  a table may skip its image.
- Files: `public/diagrams/products/<slug>-<topic>.svg` — this
  slug-prefixed naming **overrides** svg-style.md's topic-only blog naming
  (product diagrams are page-specific; shared blog diagrams are not).
  viewBox exactly
  `0 0 1200 675`, house palette only, red only for genuine risk states, one
  `<text>` per line, `&` → `&amp;`, `<title>`+`<desc>`.
- **Physics accuracy**: NFC/HF = planar **loop** coil at 13.56 MHz; UHF =
  **dipole** at 860–960 MHz. Getting the antenna wrong in a diagram is a
  real, owner-corrected failure mode.
- **Every number in an SVG must already exist in the page JSON text** —
  factscan can't read images; a number living only in a figure is invisible
  and unauditable.
- **Figure + prose + alt + desc must agree.** A figure-facts change touches
  all of them together (the coil-orientation lesson: the diagram said one
  thing, the body text the opposite). Alt text is a full descriptive
  sentence, not keywords.

## Step 6 — Verify (reuse the repo gates — don't invent new ones)

```bash
python3 .claude/skills/page-geo/scripts/selfcheck.py --repo . \
  --old origin/main:src/content/editorial/products/<sub>/<slug>.json \
  --new /tmp/<slug>_new.json          # PASS · zod strict OK
                                      # chip-added-lines: 0 · DROPPED: [] · NEW: []
# Run with NO allow-flags first. Add --allow-new-tokens / --allow-dropped
# only for exceptions you can document (sourced NEW fact, ratified
# correction) — a pre-emptive flag mutes the gate you're relying on.
node .claude/skills/blog-transform/scripts/check-svg.mjs <each new svg>
# render each SVG to PNG (cairosvg/rsvg-convert, width ~1000) and LOOK at it
python3 .claude/skills/page-geo/scripts/build_preview.py --repo . \
  --json /tmp/<slug>_new.json --out preview_<slug>.html --svg <svg-dir>
```

Justify every NEW token in your notes. **Snapshot fixtures**: 6 pages are
byte-locked by `editorial-pages-integration.snapshot.test.ts` (list in
`.claude/skills/page-geo/scripts/next.py` SNAPSHOT_FIXTURES — notably
`rfid-wooden-keyfob`). Touching one requires regenerating the `.snap` in a
clean `/tmp` origin/main worktree (`TMPDIR=/tmp npx vitest run -u`) and
shipping it with the branch; for every other page, confirm `vitest run`
(no `-u`) stays green. Full-fidelity repo linters when needed: swap-restore
pattern in `.claude/skills/page-geo/references/gates.md`.

## Step 7 — Acceptance bar

| Gate | Bar |
|---|---|
| enjoyable (blog-voice rubric) | ≥ 8/10 |
| humor | Tier A 6–7/10 · Tier B ≤2/10 (non-negotiable) |
| layout | `brief[]` = 2 cards · no 5+ parallel-bullet run or >250-char bullet survives · no empty/title-only section · ≥2 split/split-reverse figure sections + 1 featureGrid |
| length | `brief[]`+`sections[]` combined chars ≈ flat vs origin/main (makeover, not inflation) |
| facts | selfcheck PASS · chip-added 0 · DROPPED [] · NEW justified · facts-diff: number/chip/standard/price tokens only on context lines |
| traffic | summary answer-first ≤155 w/ number · FAQ ≥5 · keywords 4–7 · sources verified · ≥3 internal links · every href alive |
| images | ≥3 informative figures · check-svg green · every PNG eyeballed · figure/prose/alt agree |
| dates | `modifiedAt` = today · `reviewedAt` untouched |

## Step 8 — Deliver by mode

- **preview** (default): new JSON + SVGs + `preview_<slug>.html` + NOTES
  (every `[OWNER-CONFIRM]`, every new source, `## Corrections`). Zero git
  writes.
- **branch**: plumbing off origin/main — unique index
  (`GIT_INDEX_FILE=/tmp/shipidx_$$_$RANDOM`), `read-tree origin/main` →
  `hash-object`/`update-index` → `commit-tree -p origin/main` →
  `git branch -f product-transform/<slug>` — then verify `diff --stat`
  lists exactly your files. Exact recipe + traps: gates.md §4. No GitHub
  credentials in the sandbox: hand the user the push command + compare URL;
  never claim you pushed.
- **commit**: only when the current worktree/branch is yours.
- After merge: verify prod with a cache-buster (`?v=<sha>`) — plain URLs
  serve stale CDN HTML for minutes.

Close by offering the two ways to extend: page-by-page (this skill, family
batches like the inlay six), or a shared `DecisionSnapshot` upgrade — a
design-system change that needs review, never done silently under this
skill.

## Reference files (read on demand, don't duplicate)

- `.claude/skills/page-geo/references/voice-and-visuals.md` — voice
  calibration, content-shape→component table, fact-correction protocol.
- `.claude/skills/blog-transform/references/svg-style.md` — SVG palette,
  canvas, text rules. `references/image-prompts.md` — only if the user
  wants raster/AI art.
- `.claude/skills/blog-transform/references/seo-geo.md` — field-by-field
  SEO/GEO mechanics.
- `.claude/skills/page-geo/references/gates.md` — selfcheck detail, linter
  swap-restore, plumbing + handoff. `references/products.md` — target
  shape. `references/canonical-facts.md` — owner-ratified company facts.
- Section schema (`src/content.config.ts` sectionSchema): `title`, `intro`,
  `paragraphs[]`, `bullets[]`, `table{columns,rows}` (never `headers`),
  `image{src,alt}`, `callout`, `statBar`, `comparePanel`, `featureGrid`
  (emoji icons), `dataHighlight`, `timeline`, `checklist[]`,
  `layout: default|split|split-reverse`.

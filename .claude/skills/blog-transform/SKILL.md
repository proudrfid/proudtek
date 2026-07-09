---
name: blog-transform
description: >-
  Full-page makeover for Proudtek editorial blog posts
  (src/content/editorial/blog/*.json): one workflow that (1) rewrites dull
  prose with dry professional wit, (2) designs tokenized SVG illustrations
  for the hero and each major section (optional AI image-gen prompts), and
  (3) shapes the post for SEO + GEO — answer-first summary, FAQ, quotable
  stats, verified citations, internal links, freshness. Use whenever the
  user wants a blog post improved on more than one of those axes at once —
  phrasings like "改造这篇博客", "图文改造", "transform / revamp / redesign
  this post", "make it funnier AND add images", "add illustrations",
  "improve SEO / GEO / AI-search visibility", "让页面排版优美、提升可读性".
  Voice-only tweaks → blog-voice. Solutions/Guides pages → page-voice.
  Anything touching a blog post's images or search performance plus tone →
  THIS skill, even if the user never says "skill" or gives a file path.
user-invocable: true
args:
  - name: target
    description: >-
      Blog slug or path (e.g. "hotel-key-card-suppliers-guide" or
      "src/content/editorial/blog/<slug>.json"). Optional — ask if missing.
    required: false
  - name: mode
    description: >-
      "preview" (default — edit files + verify, no commit), "pr" (branch +
      pull request), or "commit" (commit on current branch).
    required: false
---

# Blog Transform — voice + illustrations + SEO/GEO in one pass

Turns a dry spec-sheet blog post into a page a human wants to read, an LLM
wants to cite, and a search engine wants to rank — **without changing a single
factual claim**. The readers are B2B procurement teams who cross-reference
vendor datasheets, so wit must never cost credibility and specs are sacred.
Three layers, one workflow:

1. **Voice** — dry professional wit (the blog-voice recipe).
2. **SEO/GEO shaping** — answer-first summary, question H2s, FAQ, quotable
   stats, citations, internal links, freshness.
3. **Illustrations** — tokenized 1200×675 SVGs for the hero and each section
   that earns one (optional AI image-gen prompts instead/as well).

Do 1+2 as **one rewrite pass** (they edit the same fields; sequential passes
undo each other), then illustrate the final content, then verify, then deliver.

## Step 0 — Scope, tier, claim

- **Target**: a single named post is fine even while `STOP_BLOG_VOICE` exists
  at repo root — that sentinel halts the *bulk rollout*, not user-directed
  single posts. For "next"/batch requests, run `npm run blog-voice:next` and
  respect its stop signals (halt and ask the user).
- **Tier the topic first** — a joke next to "retained surgical sponge" is
  brand damage:
  ```bash
  node .claude/skills/blog-voice/scripts/classify-tier.mjs <slug>
  ```
  Tier A = full treatment. **Tier B (medical / patient-safety / pharma) =
  humor ≤2/10, never on a harm outcome**; illustrations stay sober (no
  whimsy), red only for genuine risk states.
- **Mode**: if the user didn't say, ask — `preview` (default), `pr`, or
  `commit`. Single post → work on the current checkout and branch in place
  when needed. Parallel batch → use the worktree recipe printed by
  `blog-voice:next` (it is the race gate against other agents).
- **Read before writing**: the whole post JSON, plus 1–2 sibling posts on
  adjacent topics — to avoid duplicating their sections and to find real
  internal-link targets.

## Step 1 — The rewrite (voice × SEO/GEO, one pass)

Read **both** rule sets first, then rewrite once:

- `.claude/skills/blog-voice/SKILL.md` — moves A–E (cold open, 1–2 dry-wit
  beats, closer, de-dense, meta voice) and the freeze list.
- `references/seo-geo.md` (this skill) — field-by-field mechanics: which JSON
  field surfaces where (meta description, Quick-answer block, FAQPage JSON-LD,
  Article citations) and the extractability moves that measurably lift AI
  citations.

The one sentence that reconciles them: **the joke lands after the answer,
never instead of it.** Every section intro's first sentence is the takeaway;
wit follows.

Hard guardrails (repeated here because breaking them fails CI or the brand):

1. **Facts are frozen.** Chip names, certifications, memory/frequency specs,
   standards numbers, quantities, prices — never altered, never invented,
   never "rounded". You edit the human layer, not the spec layer.
2. **`{chip:...}` placeholder lines are untouchable** — byte-identical to
   `origin/main`, including whitespace. Rewording one trips
   `lint:chip-placeholder-drift` and fails CI. Skip those lines entirely
   (no link insertion, no entity fixes, nothing).
3. **Schema is law** (`src/content.config.ts`): edit existing fields, you may
   add optional ones (`section.intro`, `section.image`, `heroImage`,
   `sources`, `keywords`, `authorSlug`); never invent fields.
4. **Bump `modifiedAt` to today; never touch `reviewedAt`/`reviewedBySlug`**
   — those mean a human reviewer signed off; you are not them.
5. Preserve `route`, every existing `href`/markdown link, `title` keyword
   structure, and kicker uniqueness across the corpus.

## Step 2 — Illustrations

Read `references/svg-style.md`, then open 1–2 recent SVGs in
`public/diagrams/blog/` as live style anchors before drawing anything.

- **Plan**: 1 hero (`public/diagrams/blog/<slug>-hero.svg`) + one diagram per
  section that earns it (typically 3–6). A diagram must *add information* —
  a flow, stack, comparison, anatomy, decision map — never decoration. If a
  section has nothing to diagram, give it no image; whitespace beats filler.
- **Wire into JSON**: top-level `heroImage` + `imageAlt`; per section
  `image: { src, alt }` — alt is a full descriptive sentence of what the
  diagram shows, not keywords. `layout: "split"` / `"split-reverse"` on a
  couple of sections for rhythm; default elsewhere.
- **Rendering facts** (so you don't fight the components): a `/diagrams/`
  heroImage takes EditorialHero's plain `<img>` branch — no WebP pipeline, do
  not add `imageSourceRoutes`. EditorialSection renders in fixed order: title
  → intro → statBar → **image** → paragraphs → bullets — so write intros that
  hand off to the figure ("the five layers below…").
- **Raster/AI images**: only when the user asks for photographic or rich art
  — read `references/image-prompts.md` and emit one generation prompt per
  slot (the JSON wiring stays identical).

## Step 3 — Verify (all gates, from repo root)

```bash
node .claude/skills/blog-transform/scripts/check-svg.mjs public/diagrams/blog/<each-new>.svg
rsvg-convert -w 900 <file>.svg -o /tmp/check.png   # or: magick <file>.svg /tmp/check.png
```
**Look at every rendered PNG.** Overlapping text is the #1 SVG bug and no
linter catches it. No renderer available → open the SVG in a browser.

```bash
node -e "JSON.parse(require('fs').readFileSync('src/content/editorial/blog/<slug>.json','utf8'))"
git --no-pager diff --unified=1 -- src/content/editorial/blog/<slug>.json
npm run lint:chip-claims src/content/editorial/blog/<slug>.json
BASE=main npm run lint:chip-placeholder-drift
npm run check
npx vitest run
```

**Facts-diff rule**: in the diff, any token carrying a number, chip name,
standard, or price may appear only on *context* lines — never on a paired
`-`/`+` change. If one does, you edited the spec layer; revert it.

Then re-score against `.claude/skills/blog-voice/references/rubric.md`.

## Step 4 — Acceptance bar

| Gate | Bar |
|---|---|
| enjoyable (rubric, absolute) | ≥ 8/10 |
| humor | Tier A: 5–6/10 · Tier B: ≤ 2/10 |
| facts diff | = 0 |
| `summary` | answers the title query in sentence 1, with a hard number, survives the 155-char meta cut |
| `faq[]` | 3–6 answer-first entries (auto-feeds FAQPage JSON-LD) |
| images | hero + every earning section; `check-svg.mjs` green; every PNG eyeballed |
| lint ×2 · `check` · `vitest` | all green |
| dates | `modifiedAt` = today · `reviewedAt` untouched |

## Step 5 — Deliver by mode

- **preview** (default): leave the edits in the working tree, list changed
  files, and tell the user to eyeball the page at
  `npm run dev` → `http://localhost:4321/blog/<slug>/`. No commit.
- **pr**: `git checkout -b blog-transform/<slug>` → commit (message:
  `blog-transform: <slug> — voice + N SVGs + seo/geo`) → push → `gh pr create`.
  CI runs lint-and-test (~29 s) before build; the classic failure is
  placeholder drift from a reworded `{chip:...}` line.
- **commit**: commit on the current branch after all gates are green.
- After a merge deploys (~70 s on Vercel): plain URLs serve stale CDN HTML for
  minutes — verify prod with a cache-buster (`?v=<short-sha>`) or by fetching
  one of the brand-new SVG asset URLs.

## Reference files

- `references/svg-style.md` — palette, canvas skeleton, text rules,
  composition patterns. Read before drawing.
- `references/seo-geo.md` — field-by-field SEO/GEO mechanics + prose shaping.
  Read before the rewrite.
- `references/image-prompts.md` — AI image-generation prompt recipe. Read only
  when the user wants raster art.

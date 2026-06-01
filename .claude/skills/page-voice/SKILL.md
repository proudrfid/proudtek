---
name: page-voice
description: >-
  Rewrite Proudtek non-blog editorial pages — Solutions
  (src/content/editorial/solutions/**) and Guides
  (src/content/editorial/guides/**) — to be genuinely enjoyable and written with
  dry, professional wit, WITHOUT altering a single factual or spec claim. The
  sibling of /blog-voice, built for spec-dense product/solution/guide pages: it
  tiers each page on TWO axes — a prose budget (is there enough editable "human
  layer" to be worth a cold-open?) and the same medical/patient-safety
  sensitivity check blog-voice uses. Use whenever the user wants to make a
  solution or guide page (or a batch) more enjoyable, funnier, livelier, warmer,
  less dry, more human — "add voice/humor", "enliven", "punch up the tone",
  "make it less corporate", "enliven the product/solution/guide pages". Invoke
  even if the user does not say "skill" or name a file. For BLOG posts use
  /blog-voice instead.
user-invocable: true
args:
  - name: target
    description: >-
      A solutions/guides slug or path (e.g. "rfid-access-control" or
      "src/content/editorial/solutions/<slug>.json"), or "next" to pick the next
      un-done page via the dispatcher. Optional — if omitted, ask which page(s).
    required: false
---

# Page Voice — enliven Solutions & Guides without touching the facts

The sibling of `/blog-voice`. Same north star — each page should read like **a
15-year veteran engineer with a dry sense of humor**, not a spec sheet — and the
**same sacred freeze list** (chip names, standards, prices, part numbers,
`{chip:...}` placeholders). The difference is the canvas: solution and guide
pages are far more spec-dense than blog posts, so this skill leads with a
**prose-budget check** to avoid forcing wit onto a page that is 90% frozen specs,
and it knows the **new frozen structures** these pages carry (`brief`, `table`,
`comparePanel`, `timeline`, `statBar`, `testimonial`, `featureGrid`).

Scope: **Solutions (37) + Guides (49) = 86 pages.** Products and Industries are
deliberately out of scope for now (too spec-dense / vendor-name-heavy — revisit
separately). For blog posts, use `/blog-voice`.

## Step 0 — Classify the page FIRST (two axes, one command)

```bash
node .claude/skills/page-voice/scripts/classify-page.mjs <slug-or-path>
# no args → classifies every solutions + guides page
# --group solutions | --group guides → one group
# --json → machine-readable
```

It prints two axes per page:

**Axis 1 — Sensitivity** (identical detector to blog-voice's Tier A/B):
- **STANDARD** — full dry-wit treatment allowed.
- **SENSITIVE** (⚠, medical / patient-safety / pharma) — **readability only,
  humor ≤ 2/10**, never wit on a harm outcome. SENSITIVE is the safe default; a
  human may downgrade an obvious false positive (e.g. a *marketing* page that
  merely contains the word "clinic") but never silently upgrade a real
  patient-safety page.

**Axis 2 — Prose budget** (chars of editable, chip-free prose):
- **RICH** — plenty of editable prose; full cold-open + 1–2 wit beats is worth it.
- **LEAN** — thin prose; do a light `summary` / `heroPoints` lift ONLY, skip a
  forced section cold-open.
- **SKIP** — aggregate/fixture page (`_pillar.json`, `all.json`) or near-zero
  editable prose; do **not** auto-rewrite. Report and move on.

Trust the classifier over a hand count — it excludes every `{chip:...}` string
and every frozen structure from the budget, and matches medical signals on whole
tokens (so "factory-**audi**t" never trips "udi").

## Step 1 — Voice spec (same as blog-voice)

**Do:** open with a concrete scene/anecdote; land 1–2 dry-wit beats per page on a
*harmless* target; end on one memorable line; lead bullets with the conclusion;
keep every vivid number and specific — they are the corpus's strength.

**Don't:** puns, memes, emoji, exclamation spray; self-deprecation about the
product; jokes at the buyer's expense; **any joke inside a sentence carrying a
number, chip name, standard, vendor/platform name, or price**; humor on a harm
outcome.

One-line standard: *would a sharp engineer with a dry sense of humor say this to
a serious procurement customer and still be taken seriously?* If no, dial it back.

## Step 2 — The rewrite recipe (per page)

These pages usually have **no `sections[0].intro`** (unlike blog) — sections jump
straight to `bullets`/`featureGrid`. The cold open is therefore almost always an
*added* `sections[0].intro` (the schema allows it) or a lift of the existing
`summary`. (Scoring rubric → `references/rubric.md`.)

| Move | What to do | Schema field | When |
|------|------------|--------------|------|
| A · Cold open | 2–3 sentence scene + hook | **add** `sections[0].intro`, or lift `summary` | RICH always; LEAN via summary only |
| B · Dry wit ×1–2 | Wit on a *harmless* target | `sections[].intro` / a prose `bullets[]` | RICH; SENSITIVE→skip |
| C · Closer | One memorable last line — skip if it already lands | last section `.intro` / final prose bullet | RICH, optional |
| D · De-dense | Split paragraph-bullets; conclusion first | prose `bullets[]` only | any, optional |
| E · Meta voice | A beat of voice, keep every keyword | `summary` / `heroPoints[]` | always (the LEAN-page workhorse) |

Good editing includes knowing when *not* to add — forcing a cold open onto a
LEAN page, or a wit beat onto a SENSITIVE one, is how voice turns into noise.

## Step 3 — Guardrails (the freeze list — EXPANDED vs blog)

1. **Facts are frozen.** Chip names, certifications, memory/frequency specs,
   standards numbers (ISO/IEC, UL, NIST, AAMI…), quantities, prices, MOQs, brand
   model numbers — change none of them. Edit the "human layer," never the "spec
   layer."
2. **`{chip:...}` placeholders are everywhere here.** Do not edit any string
   containing `{chip:`. The classifier already treats those strings as zero-prose;
   you should treat them as untouchable. Never mix old+new placeholders on one
   line (drift-lint blind spot — `memory/feedback-drift-lint-mixed-placeholder-line.md`).
   If a brand name you must remove shares a line with a `{chip:}` placeholder,
   resolve that ONE placeholder to its exact rendered value (verify with
   `resolveChipPlaceholders`) so the line no longer carries a placeholder, rather
   than editing around it.
3. **NEW frozen structures — never edit these field bodies** (they are spec, not
   voice): `brief[]` (label + items), `sections[].table`, `sections[].comparePanel`,
   `sections[].statBar` / `dataHighlight`, `sections[].timeline`,
   `sections[].testimonial`, `sections[].featureGrid`. You may add a sibling
   `sections[].intro` to a section that has these, but do not touch the structure itself.
4. **Vendor & platform proper nouns are frozen.** PACS/software/lock platforms
   (Genetec, Lenel, Honeywell, HID, Salto, Shopify, SAP, Oracle NetSuite, MindBody…)
   are facts buyers verify — do not rewrite, drop, or "generalize" them unless a
   separate task explicitly asks for competitor-name removal.
5. **SEO.** Preserve `title` structure + keywords, `summary` keywords (it is the
   meta description), `route`, every `href`, and `keywords[]`. Don't break links.
6. **Stay inside the schema.** Edit existing fields; you may *add* an optional
   `sections[].intro`; never invent new fields (`src/content.config.ts` is the law,
   and `chipFamilies`/`envFamilies` are products-only — never add them here).
7. **Review integrity.** Bump `modifiedAt` (add it if absent). Do **not** touch
   `reviewedAt` — that date means a human signed off; you are not them.
8. **Isolation.** Work on a dedicated `/tmp` worktree at a UUID-unique path so
   parallel agents don't yank HEAD mid-edit (see
   `memory/feedback-multi-agent-shared-git.md`).

## Step 4 — Verify before you call it done

```bash
F=src/content/editorial/<group>/<slug>.json
node -e "JSON.parse(require('fs').readFileSync('$F','utf8'))"        # 1 valid JSON
git --no-pager diff --unified=1 "$F"                                  # 2 eyeball: facts diff = 0
npm run lint:chip-claims "$F"                                         # 3 fact regression
BASE=origin/main npm run lint:chip-placeholder-drift                  # 4 placeholder drift
npm run check                                                         # 5 schema + types
npx vitest run src/lib/__tests__/editorial-pages-*.snapshot.test.ts   # 6 render snapshots
```

**Facts-diff rule:** in `git diff`, any token bearing a number, chip name,
standard, vendor name, or price may appear only on *context* lines — never on a
paired `-`/`+` change. If one does, you edited the spec layer. Revert it.

**Placeholder-on-an-added-line rule:** if your new `sections[].intro` sits
adjacent to a `{chip:}` line, confirm the drift lint stays green — editing a
placeholder-bearing line trips a false drift even when the placeholder is
byte-identical. Keep your added prose on its own line/field.

Then **re-score** with `references/rubric.md` and meet the bar.

## Step 5 — Acceptance bar

| | STANDARD | SENSITIVE |
|---|---|---|
| enjoyable | ≥ 8/10 | ≥ 8/10 |
| humor | 5–6/10 (RICH) · 3–4/10 (LEAN) | ≤ 2/10 |
| facts diff | = 0 | = 0 |
| lint / check / snapshots | all green | all green |

## Step 6 — Batch rollout

Pilot 1 (a RICH · STANDARD Solutions page) → calibrate on 5–8 → then fan out.
Run SENSITIVE pages as their own batch with heavier human review. **Claim the
next page with the dispatcher:**

```bash
npm run page-voice:next             # top unclaimed RICH·STANDARD, tail-first
npm run page-voice:next -- --group solutions
npm run page-voice:next -- --json
```

It excludes already-enlivened pages (merged), open-PR files (by path), in-flight
`page-voice/*` branches, and local WIP; defaults to RICH·STANDARD; orders
tail-first to dodge the alphabet herd; and prints the `git worktree add -b`
recipe (its branch creation is the race gate). If a stop signal trips
(`NO_TARGETS_REMAIN`, `FEW_FILES_REMAIN`) or a `STOP_PAGE_VOICE` file exists at
repo root, halt and report to the user. Manual `origin/main` + `gh pr list`
scanning is the fallback if the script is absent. Ship **≥5 pages per PR or
one-per-PR — never 86 in one PR.**

## Per-page checklist

- [ ] Classified (ran classify-page) · noted RICH/LEAN/SKIP + STANDARD/SENSITIVE
- [ ] SKIP pages skipped · LEAN pages got summary/hero lift only
- [ ] Cold open (RICH) · 1–2 wit beats (SENSITIVE: skip) · de-densed where useful
- [ ] Facts/specs/prices/vendor-names unchanged (diff self-check)
- [ ] `{chip:}` lines untouched · frozen structures (brief/table/comparePanel/
      timeline/statBar/testimonial/featureGrid) untouched
- [ ] SEO (title/keywords/summary keywords/route/href) preserved
- [ ] JSON valid · check · lint×2 · snapshots all green · `modifiedAt` bumped, `reviewedAt` untouched
- [ ] Re-scored to bar

## Reference

- `references/rubric.md` — humor + enjoyable scoring rubric and a calibrated
  before/after anchor for these page types. Read it when scoring (Step 4).
- Sibling skill `/blog-voice` — same philosophy for `src/content/editorial/blog/**`.

---
name: blog-voice
description: >-
  Rewrite Proudtek editorial blog posts (src/content/editorial/blog/**/*.json)
  to be genuinely enjoyable and written with dry, professional wit — without
  altering a single factual or spec claim. Centerpiece is a Tier A / Tier B
  topic-tiering system: standard posts get a cold-open + dry wit; sensitive
  medical / patient-safety / pharma-compliance posts get readability only with
  humor capped. Use this whenever the user wants to make a blog post or batch of
  posts more enjoyable, funnier, livelier, warmer, less dry, or more human —
  including phrasings like "add voice/humor", "enliven", "punch up the tone",
  "make it less corporate", "spice up the blog", or "continue the blog-voice
  rewrite". Invoke even if the user does not say the word "skill" or name a file.
user-invocable: true
args:
  - name: target
    description: >-
      A blog slug or path to rewrite (e.g. "rfid-card-how-it-works" or
      "src/content/editorial/blog/<slug>.json"), or "next" to pick the next
      un-done Tier A post. Optional — if omitted, ask which post(s) to do.
    required: false
---

# Blog Voice — make it enjoyable + dry-witted, without touching the facts

This rewrites the RFID/NFC blog corpus so each post reads like **a 15-year
veteran engineer who has seen every absurd support ticket and lets a little dry
humor slip** — instead of a neutral spec sheet. The buyers are B2B procurement
teams, so wit must never cost credibility: the facts, numbers, chip names,
standards, and prices are sacred (see Guardrails). The corpus is ~125 posts;
**62 of them contain `{chip:...}` placeholders** and ~12 are sensitive medical
topics, which is why the steps below are not optional ceremony.

## Step 0 — Tier the topic FIRST (the one rule you cannot skip)

A joke next to "retained surgical sponge" or "blood-bank cross-match" is
tone-deaf and brand-damaging. So before writing anything, classify the post:

```bash
node .claude/skills/blog-voice/scripts/classify-tier.mjs <slug-or-path>
# no args → prints the tier for every blog post + an A/B count
```

- **Tier A** (standard, ~113 posts): full treatment — cold-open + dry wit.
- **Tier B** (~12: medical / patient-safety / pharma-compliance): **readability
  only.** Improve clarity and add a scene, but **cap humor at ≤2/10** and never
  put wit on the failure consequence (a patient, a recall, a safety lapse). Wit,
  if any, lands only on harmless targets (tedious paperwork, an auditor's stare).

Trust the classifier over a hand count — it avoids substring traps (e.g.
"factory-**audi**t" is NOT medical) that a quick grep gets wrong.

## Step 1 — Voice spec (dry professional wit)

**Do:** open with a concrete scene/anecdote; land 1–2 dry-wit beats per post;
end on one line worth remembering; break paragraph-length bullets into skimmable
ones (lead with the conclusion); keep the existing vivid numbers and specifics —
they are already the corpus's strength.

**Don't:** puns, internet memes, emoji, exclamation-mark spray; self-deprecation
about the product; jokes at the buyer's expense; **any joke inside a sentence
that carries a number, chip name, standard, or price**; humor on a harm outcome.

One-line standard: *would a sharp engineer with a dry sense of humor say this to
a serious customer and still be taken seriously?* If no, dial it back.

## Step 2 — The rewrite recipe (per post)

Each move maps to the schema field you touch and the score it lifts. Apply A, B,
E always; C and D when the post needs them. (Scoring rubric →
`references/rubric.md`.)

| Move | What to do | Schema field | Lifts |
|------|------------|--------------|-------|
| A · Cold open | 2–3 sentence scene + hook that teases the payoff | `sections[0].intro` (optional — add it) | enjoyable · narrative/voice |
| B · Dry wit ×1–2 | Plant wit on a *harmless* target inside existing prose | `sections[].bullets[]` / `.intro` | humor |
| C · Closer | One memorable last line — **skip if the post already ends strong** | last section `.intro` or final bullet | enjoyable · payoff |
| D · De-dense | Split paragraph-bullets; first clause = the takeaway | `sections[].bullets[]` | enjoyable · skimmability |
| E · Meta voice | Add a beat of voice but **keep every keyword** | `summary` / `heroPoints[]` | enjoyable + SEO-safe |

Good editing includes knowing when *not* to add — forcing move C onto a post
that already lands is how wit turns into noise.

## Step 3 — Guardrails (the freeze list)

1. **Facts are frozen.** Chip names, certifications, memory/frequency specs,
   standards numbers, quantities, prices, brand model numbers — change none of
   them. You edit the "human layer," never the "spec layer."
2. **Placeholders (62/125 posts).** Do not touch a line containing `{chip:...}`.
   If you must, the resolved text must byte-match the prose it replaces, and
   never mix old+new placeholders on one line (drift-lint blind spot).
3. **SEO.** Preserve `title` structure + keywords, `summary` keywords (it is the
   meta description), `route`, and every `href`. Don't break internal links.
4. **Stay inside the schema.** Edit existing fields; you may *add* an optional
   `section.intro`; never invent new fields (`src/content.config.ts` is the law).
5. **Review integrity.** Bump `modifiedAt`. Do **not** touch `reviewedAt` — that
   date means a human reviewer signed off; you are not them.
6. **Isolation.** Work on a branch / dedicated worktree so parallel agents don't
   yank HEAD mid-edit.

## Step 4 — Verify before you call it done

```bash
node -e "JSON.parse(require('fs').readFileSync(F,'utf8'))"        # 1 valid JSON
git --no-pager diff --unified=1 F                                  # 2 eyeball: facts diff = 0
npm run lint:chip-claims F                                         # 3 fact regression
BASE=main npm run lint:chip-placeholder-drift                      # 4 placeholder drift
npm run check                                                      # 5 schema + types
npx vitest run src/lib/__tests__/editorial-pages-*.snapshot.test.ts  # 6 render snapshots
```

**Facts-diff rule:** in `git diff`, any token bearing a number, chip name,
standard, or price may appear only on *context* lines — never on a paired
`-`/`+` change. If one does, you edited the spec layer. Revert it.

Then **re-score** with `references/rubric.md` and meet the acceptance bar.

## Step 5 — Acceptance bar

| | Tier A | Tier B |
|---|---|---|
| enjoyable | ≥ 8/10 | ≥ 8/10 |
| humor | 5–6/10 | ≤ 2/10 |
| facts diff | = 0 | = 0 |
| lint / check / snapshots | all green | all green |

## Step 6 — Batch rollout (when doing many)

Pilot 1 → calibrate on a small batch (5–8 Tier A) → then fan out. Run Tier B as
its own batch with heavier human review. Claim files by scanning `origin/main`
and filtering open PRs (mirror `chip-specs:next`) so two agents never pick the
same file. Ship **≥5 posts per PR or one-per-PR — never 125 in one PR**.

## Per-post checklist

- [ ] Tiered (ran the classifier) · [ ] Cold open · [ ] 1–2 dry-wit beats (Tier B: skip) · [ ] Closer if needed · [ ] De-densed
- [ ] Facts/specs/prices unchanged (diff self-check) · [ ] Placeholders intact · [ ] SEO (title/keywords/summary/links) preserved
- [ ] JSON valid · check · lint×2 · snapshots all green · [ ] `modifiedAt` bumped
- [ ] Re-scored to bar (A: enjoyable≥8 & humor 5–6 · B: enjoyable≥8 & humor≤2)

## Reference

- `references/rubric.md` — the humor + enjoyable scoring rubric and a calibrated
  before/after anchor. Read it when scoring a post (Step 4) or when you need to
  justify a score to the user.

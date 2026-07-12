---
name: page-geo
description: >
  GEO + SEO optimization pass for Proudtek editorial pages in the products/,
  compare/, markets/, lp/, and case-studies/ groups. Rebuilds thin pages and
  augments mid-quality pages to the completeness line: answer-first summary,
  spec/decision tables, FAQ, primary sources, internal links, machine-brief,
  and (budget permitting) SVG diagrams — then runs the repo's verification
  gates. Use this whenever the user asks to 完善/optimize/improve/rebuild a
  products, compare, markets, lp, or case-studies page, mentions GEO or SEO
  for a specific non-blog page, complains a page is "太空/太薄/不够完善", or
  says "next page-geo target" or "继续下一批 / 改造剩余弱页" (batch mode —
  run scripts/next.py first), or complains the pages are 枯燥/dry/boring,
  wants 配图/illustrations/diagrams added, wants the language 幽默有趣/more
  readable, or asks for factual errors to be found and corrected during the
  pass. Not for blog posts (/blog-transform or /blog-voice) and not for
  solutions/guides voice passes (/page-voice).
---

# page-geo — GEO/SEO page optimization

One skill, five playbooks. The goal of every pass: a buyer (or an AI answering
a buyer) lands on the page and gets the answer, the evidence, and the next
step without scrolling back up.

## Why this exists

proudtek.com plays the **informational + GEO hub** role in a two-site
strategy (rfidak.com is the conversion-first sister site). AI search engines
cite pages that answer in the first breath and cite their own sources; Google
rewards pages that satisfy the query's commercial intent. The completeness
scan (2026-07-11) found ~180 transactional-intent pages below the line:
products (104 mid), compare (28), lp (16), markets (10, all thin),
case-studies (8). Those are the targets.

## Routing

| Group | Playbook | Mode you'll usually run |
| --- | --- | --- |
| products/ | references/products.md | augment (page has bones, add flesh) |
| compare/ | references/compare.md | augment |
| markets/ | references/markets.md | rebuild (mostly shells today) |
| lp/ | references/lp.md | rebuild |
| case-studies/ | references/case-studies.md | rebuild, with [OWNER-CONFIRM] flags |

Read `references/geo-seo-checklist.md` (shared principles) and
`references/voice-and-visuals.md` (voice calibration, diagram placement,
fact-correction protocol) plus the one playbook that matches. Read
`references/gates.md` before shipping.

## Batch mode — dispatcher first

For any "下一批 / 继续 / next batch / 改造剩余弱页" request, the first step
is **always** the dispatcher (run `git fetch origin main` first):

```bash
python3 .claude/skills/page-geo/scripts/next.py                 # products, top 10
python3 .claude/skills/page-geo/scripts/next.py --group compare --top 6
python3 .claude/skills/page-geo/scripts/next.py --all-groups --json
```

It rescores every page on live origin/main (so merged work drops off by
itself — no stale punch list), excludes pages claimed by in-flight
`page-geo/*`, `fix/*` and `page-polish/*` branches (merge-base diffs, so
stale old-base branches can't mass-claim), and skips snapshot-fixture
pages unless `--include-fixtures`. Each target comes with a **gap
profile** — that profile IS the work order:

| Gap | What the pass must add |
| --- | --- |
| 图N (visuals below 3) | SVG diagrams to the floor (hero + 2; content-shape heuristics in voice-and-visuals.md) |
| FAQn (below 4) | extend FAQ to ≥6 answer-first buyer questions per the group playbook |
| 来源n (below 2) | primary sources for every external fact; company facts via canonical-facts.md |
| NK字符 (below 8K) | thin sections — add the spec/decision tables the playbook prescribes, or rebuild |
| 无brief / keywords不足 | add the machine-brief block and 4-7 keywords per geo-seo-checklist.md |

Batch conventions: 6 pages per batch, parallel subagents, one branch
`page-geo/<group>-batch-N` (single page → `page-geo/<slug>`), preview-only
first, then the consolidated branch after independent re-verification.
A human-readable snapshot of the backlog lives at repo root
(`PRODUCTS_PAGE_BACKLOG_*.md`) — it is for the owner's eyes; agents pick
targets from the dispatcher, never from the snapshot. If the dispatcher
prints `NO_TARGETS_REMAIN` or `FEW_TARGETS_REMAIN`, report to the user
instead of forcing targets.

## Workflow

1. **Read the page from origin/main, not the working tree.** The main
   worktree is routinely parked on someone else's branch with WIP. Always:
   `git -C <repo> cat-file -p origin/main:src/content/editorial/<group>/<slug>.json`
   Treat the working tree as read-only throughout; never checkout, branch,
   or touch its index. Branches are built with plumbing (gates.md).

2. **Check siblings before writing.** Read the 2-3 nearest sibling pages and
   any solution/guide covering the same topic. One topic lives on one page;
   if your planned section already exists elsewhere, link to it instead of
   duplicating it (this has bitten before — duplicated laundry content had
   to be 301'd later).

3. **Decide rebuild vs augment, field by field.** The freeze discipline is
   conditional, not absolute:
   - Any string containing `{chip:...}` placeholders: byte-frozen and
     unmoved (details in gates.md — this is a CI tripwire, not a style rule).
   - A summary that is already answer-first with numbers, or a curated
     sources[]/faq[]: preserve and extend, don't rewrite.
   - Bare bullets on a shell page: rebuild freely.

4. **Source every fact.**
   - **Company facts** (MOQ, capacity, lead time, certifications, sample
     policy): never invent. Check `references/canonical-facts.md` FIRST —
     it is the owner-ratified table and outranks anything a page says
     (majority vote across pages has produced wrong "corrections" before).
     If it's silent, grep existing pages for the canonical value
     (`git grep -h "MOQ" origin/main -- src/content/editorial | sort -u`)
     and reuse it verbatim. If no canonical value exists, write
     `[OWNER-CONFIRM: …]` and list it in your handoff notes.
   - **External facts** (frequencies, standards, chip specs, regulations):
     primary sources only — vendor datasheets, ETSI/FCC/ISO documents — and
     add each to sources[]. Chip claims get verified against the vendor's
     product page (see memory/feedback-verify-chip-claims.md); chip names
     use `{chip:slug:field}` placeholders, never plain text, when the chip
     exists in src/data/chip-specs.json.
   - factscan (gates.md) will flag every number you add or drop; a NEW
     token is acceptable only if it has a source; a DROPPED token is
     acceptable only in a deliberate dedupe where the fact survives
     elsewhere on the page.

5. **Build to the completeness line** (definition of done):
   - ≥5 sections; ≥8,000 chars of section content for rebuilds
   - answer-first summary ≤ ~160 visible chars of direct answer, numbers up
     front, then supporting detail
   - ≥1 table (specs, decision, or cost — LLMs extract tables; buyers scan
     them); statBar/comparePanel/featureGrid/checklist where they fit;
     schema shapes in gates.md (`table` uses `columns`, never `headers`)
   - FAQ ≥4 real buyer questions, answers self-contained (they are quoted
     verbatim by AI engines)
   - sources[] ≥2 primary links; keywords[] 4-7 mixing head + long-tail;
     brief[] machine-brief for rebuilt pages
   - ≥3 internal links in intros (money page + related guide + related
     compare/solution), markdown syntax
   - visuals: standard deliverable, not a nice-to-have — floor: hero + 2
     section SVG diagrams on any standard page (rebuilds usually land hero
     + 2-4) wherever the content's shape is geometric (construction, flow,
     band map, ladder, placement); tables for tabular data, and a section
     whose payload is already a table may skip its image. Placement
     heuristics + SVG conventions: references/voice-and-visuals.md.
   - layout gate: no bullet-wall survives — any run of 5+ parallel-fact
     bullets, or bullets >250 chars, becomes a table / comparePanel /
     statBar / checklist / timeline.
   - voice: readable and genuinely fun, calibrated Tier A 6-7/10 / Tier B
     ≤2/10 (non-negotiable), wit only in intros/callouts/labels — never in
     tables, FAQ answers, summary, or compliance claims.
     references/voice-and-visuals.md.
   - fact errors found en route get corrected, not preserved — but only
     with a primary source in hand; protocol (external vs company facts,
     frozen-line collisions, selfcheck exception flags) in
     references/voice-and-visuals.md.
   - modifiedAt → today; authorSlug/reviewedBySlug preserved

6. **Self-check before gates:**
   `python3 scripts/selfcheck.py --repo <repo> --old origin/main:<path> --new <newfile>`
   It checks JSON round-trip formatting, chip-line integrity, factscan
   DROPPED/NEW, and strict zod (mirrored live from content.config.ts — do
   not use `_redesigns/_port/zodcheck-full.mjs`, its table schema is stale).

7. **Preview:**
   `python3 scripts/build_preview.py --repo <repo> --json <newfile> --out preview_<slug>.html [--svg <local-svg-dir>]`
   Chip placeholders display-resolved, SVGs inlined. Open-and-look is part
   of the job: check the tables read well and nothing overflows.

8. **Ship.** Two modes:
   - `preview-only` (default when the user wants to see it first): deliver
     the JSON + preview + notes; no git writes at all.
   - full: plumbing branch `page-geo/<slug>` off origin/main + handoff push
     commands — exact recipe and traps in references/gates.md.

## Traps that have actually fired (respect them)

- `{chip:}` line rules — byte-identical, unmoved, and never allowed to
  become the last element of its array (trailing-comma change puts the line
  in the diff → drift lint fails CI). Zero added lines containing `{chip:`
  is the provable-safe construction.
- factscan's `$`-token regex swallows a sentence-final period
  (`"…$2,500."` → token `$2,500.`). If you delete such a sentence, carry
  the token in a natural sentence elsewhere (a table Notes cell works).
- Table schema is `columns`/`rows`. The old port-pipeline checker wants
  `headers`; it is wrong for this repo.
- products/ pages carry extra top-level fields (chipFamilies, envFamilies,
  relatedIndustries) — preserve them; strict zod will catch typos.
- markets/ pages keep `imageSourceRoutes` when the hero is a photo; drop it
  only when replacing the hero with an SVG banner on blog-family pages.
- JSON serialization: `json.dumps(d, indent=2, ensure_ascii=False) + "\n"`
  round-trips this repo byte-identically; edit the dict, never hand-edit
  whitespace.

## Success looks like

Self-check clean (factscan justified-NEW only, zod strict, chip lines
intact) · completeness rubric ≥8/10 (scorer in gates.md) · preview reads
like a page a procurement manager would trust — and enjoy reading ·
handoff notes list every [OWNER-CONFIRM], every new source, and a
`## Corrections` block for every factual fix (wrong → right, per source).

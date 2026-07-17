# CLAUDE.md — Proudtek static mirror

## Design System

Always read [DESIGN.md](DESIGN.md) before making any visual or UI decisions.
All font choices, colors, spacing, and aesthetic direction are defined there.
Do not deviate without explicit user approval.

The source of truth for tokens is `src/styles/codex-tokens.css`. If DESIGN.md
diverges from that file, the CSS wins — update the doc to match.

In QA mode, flag any code that doesn't match DESIGN.md (off-grid spacing,
hex literals where tokens exist, new z-index integers outside the canonical 5,
ad-hoc box-shadow values outside the elevation scale).

## Content factual accuracy

When editing `src/content/editorial/**/*.json`, treat chip names, certifications,
memory specs, and standards references as buyer-verifiable. Procurement teams
cross-reference vendor datasheets. Before calling a chip claim "fabricated" or
proposing a "correction," verify against the vendor's product page +
datasheet. See `memory/feedback-verify-chip-claims.md` and
`memory/rfid-chip-facts-verified.md` for the verified-truth table that informed
the May 2026 corrective work in [proudtek#7](https://github.com/proudrfid/proudtek/pull/7).

## Chip-specs migration — dispatcher first

When asked to migrate a vendor-prefixed chip name in
`src/content/editorial/**/*.json` to a `{chip:slug:name}` placeholder
(any "next chip-specs PR" / "continue chip migration" request), the
first step is **always** the dispatcher:

```bash
npm run chip-specs:next             # top 10 unclaimed targets
npm run chip-specs:next -- --heavy  # heavy files first
npm run chip-specs:next -- --json   # machine-readable
```

The dispatcher scans current `origin/main` for remaining mentions and
filters out anything touched by an open PR via `gh pr list`, so two
concurrent agents don't pick the same file. Do not pick from
`MIGRATION_PUNCH_LIST.md` directly — it's a static snapshot and is
already stale on most singletons.

Off-limits rules still apply (see `MIGRATION_PUNCH_LIST.md`):
- Skip lines that already contain ANY `{chip:...}` placeholder (drift
  lint blind spot — `memory/feedback-drift-lint-mixed-placeholder-line.md`).
- Short-form names like `NTAG 213` or `Monza R6` are out of migration scope.
- The two schema-blocked forms (`NXP NTAG 224 DNA`, `NXP MIFARE DESFire
  EV2`) need schema entries first; the dispatcher filters them out
  automatically.

## Chip-specs migration — when to STOP

The migration has produced 1000+ PRs at 1-line-per-PR granularity. Two
stop mechanisms exist; both are checked by `npm run chip-specs:next`:

**Hard stop (sentinel file).** If `STOP_CHIP_MIGRATION` exists at repo
root, the dispatcher refuses to hand out targets. Drop that file to
halt all parallel agents at once; delete it (or pass `--force`) to
resume. The file's contents become the printed halt reason — use it
to leave a note for future you ("declared done 2026-05-27", "pausing
to batch the tail", etc.).

**Soft stop (trip signals).** The dispatcher prints stop signals when
the remaining work hits the low-ROI tail:

- `ALL_SINGLETONS_REMAIN` — every remaining file has exactly 1 mention.
  The long tail. At this point, 1-line-per-PR review cost > the value
  of a centralized placeholder.
- `FEW_FILES_REMAIN` — fewer than 60 unclaimed files (tunable via
  `CHIP_SPECS_STOP_AT_FILES`). Even with multi-mention files, the
  tail is short enough that a single batched PR beats N tiny ones.

**When you see any stop signal in the dispatcher output, do NOT pick
the top target.** Halt, summarize the remaining work to the user, and
ask which path they want: batch the rest into ≥5-file PRs, declare the
migration done (drop `STOP_CHIP_MIGRATION` with a reason), or continue
the 1-line cadence anyway. The decision is the user's, not yours.

## blog-voice rollout — dispatcher first

When asked for the "next" `/blog-voice` post (any "continue blog-voice" /
"next blog post to enliven" request), the first step is **always** the
dispatcher:

```bash
npm run blog-voice:next             # top 10 unclaimed Tier A, tail-first
npm run blog-voice:next -- --json   # machine-readable
```

It cross-references every claim signal so two agents never pick the same post:
already-enlivened (touched by a merged blog-voice commit), open-PR files (by
path, so multi-file batch PRs count), in-flight `blog-voice/*` branches
(token-matched to the slug), and local WIP. **Tier B (medical / patient-safety
/ pharma) is excluded by default** — those need a human, not autopilot
(`--include-tier-b` to surface). Claim via the printed `git worktree add -b`
recipe (the race gate) and work in that `/tmp` worktree — never edit in the main
worktree. If a stop signal trips (`NO_TIER_A_REMAIN`, `FEW_FILES_REMAIN`) or a
`STOP_BLOG_VOICE` file exists at repo root, halt and report to the user. See
`memory/feedback-blog-voice-next-claim-filtering.md`.

## page-voice rollout — dispatcher first

When asked for the "next" `/page-voice` page (any "continue page-voice" / "next
solution/guide page to enliven" request), the first step is **always** the
dispatcher:

```bash
npm run page-voice:next               # top 10 unclaimed RICH·STANDARD, tail-first
npm run page-voice:next -- --group solutions
npm run page-voice:next -- --json     # machine-readable
```

Sibling of blog-voice for **Solutions (37) + Guides (49)** pages. It classifies
every page on two axes — a **prose budget** (RICH / LEAN / SKIP — is there enough
editable, chip-free prose to be worth a cold-open?) and the same medical
**sensitivity** check — and serves only RICH·STANDARD by default. It excludes
already-enlivened pages, open-PR files (by path), in-flight `page-voice/*`
branches, and local WIP. **SENSITIVE (medical/patient-safety) pages and LEAN
(spec-dense) pages are excluded by default** (`--include-sensitive` /
`--include-lean` to surface). Claim via the printed `git worktree add -b
page-voice/<slug>` recipe (the race gate) and work in that `/tmp` worktree. If a
stop signal trips (`NO_TARGETS_REMAIN`, `FEW_FILES_REMAIN`) or a `STOP_PAGE_VOICE`
file exists at repo root, halt and report to the user. Products and Industries
are out of scope for this skill. For blog posts use `/blog-voice`.

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Blog rewrite for enjoyability/humor (Tier A/B voice) → invoke /blog-voice
- Blog full makeover: voice + SVG illustrations + SEO/GEO in one pass → invoke /blog-transform
- Same makeover but running inside a Cowork/Fable sandbox session → invoke /blog-fable
- Solutions/Guides page rewrite for enjoyability/humor → invoke /page-voice
- Product page full makeover: brand + 图文 + humor + de-densify + SEO/GEO (品牌范儿/图文结合/排版优美) → invoke /product-transform
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore

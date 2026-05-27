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
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore

# Codex design system docs

Three files. Read them in this order:

1. **[conventions.md](./conventions.md)** — naming, file mapping, a11y checklist, migration playbook. **Read this first** — it's how to operate inside the system.
2. **[tokens.md](./tokens.md)** — every `--codex-*` token: value, when to use, when NOT to use. **Reference when authoring.**
3. **[components.md](./components.md)** — the top 20 components: HTML skeleton, variants, states, a11y notes. **Reference when extending.**

## Contributing

- Adding a token? See [tokens.md → How to add a new token](./tokens.md#how-to-add-a-new-token).
- Adding a component? See [components.md → How to add a new component](./components.md#how-to-add-a-new-component).
- Migrating an old pattern? See [conventions.md → Migration playbook](./conventions.md#migration-playbook).

## Audit history

The system has been audited four times:

| Date | Round | What changed | Report |
|---|---|---|---|
| 2026-04-22 | DS-1 to DS-9 | Initial styling, focus rings, sticky CTA, route-aware nav, hero contrast, breadcrumb truncation | (per-DS reports in `reports/`) |
| 2026-04-26 | DS-10 | Three-tier CTA, inline citations, Brief details, Compare table sort | [reports/ds-10-11-conversion-and-a11y/](../reports/ds-10-11-conversion-and-a11y/) |
| 2026-04-26 | DS-11 | RFQ form a11y rebuild | (folded into DS-10/11 report) |
| 2026-04-27 | DS-12 | Token consolidation: +22 tokens, 17 fallback fixes, 36 transition migrations, 13 `#1a1a1a` reclassifications | (this docs/ folder) |

Score progression: ~45/100 (pre-DS-9) → 55/100 (DS-12 audit baseline) → ~68/100 (post DS-12 Phase 1+2 — this state).

## What's next

DS-12 Phase 3 (deferred):
- Extract `.codex-card` base mixin (12 card variants → 1 base + variants)
- Rename `industries-sidebar` / `spec-sidebar` → `*-rail`
- Z-index 10 → 5 consolidation
- Decommission deprecation-candidate tokens (`--codex-shadow-*`, `--codex-teal-*`, `--codex-forest-*`, `--codex-steel-*`)

DS-12 Phase 4 (ongoing):
- `.codex-card` / `.codex-banner` / `.codex-scroll-region` / `.codex-disclosure` mixins
- `data-codex-event` instrumentation surface
- (Optional) Storybook / VitePress component preview

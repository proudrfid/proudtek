# Anti-fingerprint + E-E-A-T overhaul — overview

**Date executed:** 2026-04-26
**Scope:** Site-wide content + template engineering pass to defuse scaled-content fingerprints, raise E-E-A-T trust signals, and tighten Schema.org JSON-LD before public launch.
**Pages touched:** ~470 editorial JSON files across `/industries/`, `/products/`, `/solutions/`, `/compare/`, `/blog/`, plus 2 site-template TypeScript files (`src/lib/seo.ts`, `src/lib/editorial-authority-ld.ts`).
**Verification:** `npx astro sync` passes throughout. Schema collection types regenerate cleanly.

## Why this work happened

Sixty-three batches of DEEP-framework content upgrades had produced a corpus that was technically high-quality but structurally homogeneous. Cross-page repetition of templates, identifiers, and review metadata created cluster-grade fingerprints that 2024–2026 Google SpamBrain / Helpful Content Update systems flag as "scaled content abuse" — even when the underlying technical material is accurate. Three concrete symptoms surfaced during a pre-launch review:

1. A single 12-word anchor phrase (`"Deployment patterns integrators follow on …"`) appearing identically across 389 pages — a programmatic fingerprint.
2. Generic brief labels (`Best for / Key decisions / Best-fit products / Research pages`) repeating verbatim across the site, plus universal 4-piece chart-component coverage.
3. Single-author byline (`editorial-board`), single-reviewer (`peter-zhang`), and 90 % of `reviewedAt` dates clustered in a 5-day window (2026-04-22 → 2026-04-26).

This report documents the 17-step remediation that closed the gap. The work is grouped into three phases.

## Phase index

| Phase | Steps | Concern |
|---|---|---|
| **Phase 0** | Blocker C anchor cleanup | Programmatic exact-string fingerprint |
| **Phase 1** | A1–A12 | Content-layer structural diversity |
| **Phase 2** | B1–B4 | Schema.org JSON-LD + template-layer dedupe |

## Document map

- `00-overview.md` — this file.
- `01-blocker-c.md` — Blocker C anchor sweep (389 pages → 0).
- `02-content-layer-A1-A6.md` — brief labels, summary openings, source schema, reviewedAt distribution.
- `03-content-layer-A7-A12.md` — chart-component stagger, author distribution, summary tail clusters, dataHighlight headings.
- `04-template-layer-B1-B4.md` — Schema.org JSON-LD audit + dedupe + field completion.
- `05-residual-and-next-steps.md` — what was deliberately left and where to go next.

# TODOs

## DONE — Native-safe head policy integration (was P1)

Phases 0–3 shipped and enabled in production between 2026-08-21 and 2026-08-22
(`0f470a6f`…`6538a3b9`): Phase 0 classifier/inventory/dual-build audit, Phase 1
`/blog/`, Phase 2 `/guides/` + `/solutions/`, Phase 3 compare index + 4 category
hubs. `PROUDTEK_NATIVE_SHELL=1` is ON in Vercel Production; live re-verified
2026-08-22 (see `.vercel/deployment-checklist.md` backfill). Rollback remains
one line: set the flag to `0` and redeploy.

## P1 — Extend native-safe head + SiteShell to leaf routes

**What:** Next batch after the 10 migrated hub routes: the 7 `/guides/{cluster}/`
pages first (same section as the validated `/guides/` hub), then case-studies,
compatibility, and eventually blog/guide/solution leaf bodies via `[...slug].astro`.

**Why:** Hubs render the native shell but their sibling leaf pages still carry
donor shell CSS, so drawer/style fixes must be duplicated per deployment.

**Context:** Same pattern as phases 1–3: exact-route canary additions in
`src/lib/rollout.ts`, `extractChromeFromSnapshot(donor, route, useNativeShell)`,
`ShellSwitchLayout` with `{!useNativeShell && …}` chrome guards, extended
`scripts/native-shell-canary-audit.mjs` coverage. All hard gates apply:
595-page default+flagged builds byte-equal outside canary routes, site contract
audit, native marker placement audit.

**Effort:** S–M with Claude Code.

**Priority:** P1.

## P2 — Homepage v2 body migration

Blocked pending visual direction sign-off (per `PINNACLE_HANDOFF_2026-08-12.md`
note). `PROUDTEK_HOME_V2` switch and `HomePageLayout` branch already exist;
only homepage main-content hash changes are allowlisted when it ships.
Design direction lives in `docs/rebuild-blueprint-2026-08-15.md`.

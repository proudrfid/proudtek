# TODOs

## DONE — Native-safe head policy integration (was P1)

Phases 0–3 shipped and enabled in production between 2026-08-21 and 2026-08-22
(`0f470a6f`…`6538a3b9`): Phase 0 classifier/inventory/dual-build audit, Phase 1
`/blog/`, Phase 2 `/guides/` + `/solutions/`, Phase 3 compare index + 4 category
hubs. `PROUDTEK_NATIVE_SHELL=1` is ON in Vercel Production; live re-verified
2026-08-22 (see `.vercel/deployment-checklist.md` backfill). Rollback remains
one line: set the flag to `0` and redeploy.

## P1 — Extend native-safe head + SiteShell to leaf routes

**Progress (2026-08-24):** 114 exact routes now native: 10 original hubs,
compare index + 4 categories, 7 `/guides/{cluster}/` pages, `/case-studies/`,
`/compatibility/`, 7 compatibility vendor leaves (phase 6a via the new
`EditorialPageLayout` native branch), and all 51 guides + 37 solutions
editorial leaves (phase 6b).

**Remaining batches:**
- blog posts (~114) + compare leaves (~27) — same EditorialPageLayout seam,
  routes only
- products / industries / about / contact render through `SnapshotLayout`
  (donor body needs Kadence CSS) — need per-route body migration, not just
  head filtering

**Follow-up (content):** 7 pages still lack top-level `publishedAt` (6
`contact/*` + `lp/uhf-rfid-tag-manufacturer`). Backfilling them with the
2026-06-11 launch date would also make their hidden freshness dates
deterministic, but all 7 have `authorSlug`, so the visible byline would gain
an "Updated Jun 2026" segment — needs an explicit content decision first.

**Gates:** unchanged — 595-page default+flagged builds byte-equal outside
canary routes (dist-baseline refreshed 2026-08-24 for the reviewed
publishedAt backfill; contract baseline `src/data/site-contract.v1.json`
re-frozen in the same commit).

**Effort:** S–M with Claude Code.

**Priority:** P1.

## P2 — Homepage v2 body migration

Blocked pending visual direction sign-off (per `PINNACLE_HANDOFF_2026-08-12.md`
note). `PROUDTEK_HOME_V2` switch and `HomePageLayout` branch already exist;
only homepage main-content hash changes are allowlisted when it ships.
Design direction lives in `docs/rebuild-blueprint-2026-08-15.md`.

# TODOs

## DONE — Native-safe head policy integration (was P1)

Phases 0–3 shipped and enabled in production between 2026-08-21 and 2026-08-22
(`0f470a6f`…`6538a3b9`): Phase 0 classifier/inventory/dual-build audit, Phase 1
`/blog/`, Phase 2 `/guides/` + `/solutions/`, Phase 3 compare index + 4 category
hubs. `PROUDTEK_NATIVE_SHELL=1` is ON in Vercel Production; live re-verified
2026-08-22 (see `.vercel/deployment-checklist.md` backfill). Rollback remains
one line: set the flag to `0` and redeploy.

## P1 — Extend native-safe head + SiteShell to leaf routes

**Progress (2026-08-24):** 303 of 595 outputs now native across phases
0–6d: all hub/index surfaces, every editorial content leaf (guides,
solutions, blog, compare, compatibility, case-studies), markets,
industries, research, sample-pack, resources. Leaf routes live in the
single registry `scripts/native-canary-leaf-routes.json`.

**Deliberately still on SnapshotLayout** (donor body needs Kadence CSS;
head filtering alone would strip their layout):
- `/products/*` catalog + pagination and `/product/*` detail pages (~251)
- `/faq/`, `/rfq/`, legacy dated permalinks (`/2024/*`, `/2025/*`)
These need per-route body migration, not registry edits.

**Awaiting content decision:** contact / lp / about groups render through
the editorial pipeline too, but 7 of their pages lack top-level
`publishedAt` (6 `contact/*` + `lp/uhf-rfid-tag-manufacturer`); backfilling
with the 2026-06-11 launch date would newly render a visible "Updated Jun
2026" byline segment (all have authorSlug). Decide, backfill, then register
those ~36 routes in one batch.

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

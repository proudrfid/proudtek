# Verification gates and git discipline

Run everything from the repo root. The main worktree is frequently parked on
someone else's branch with WIP — treat it as read-only; every check below
works without touching it.

## 1. selfcheck (always)

```
python3 .claude/skills/page-geo/scripts/selfcheck.py \
  --repo . \
  --old origin/main:src/content/editorial/<group>/<slug>.json \
  --new /tmp/<slug>_new.json
```

Checks, in order:
- **Round-trip formatting** — the file must equal
  `json.dumps(json.loads(f), indent=2, ensure_ascii=False) + "\n"`; frozen
  lines keep their bytes only if you never hand-format.
- **Chip-line integrity** — zero diff-added lines containing `{chip:`.
  That construction provably passes the repo's drift lint
  (scripts/lint-chip-placeholder-drift.mjs checks only added lines; an
  added chip line must resolve-match a removed line byte-for-byte, which
  rewording never does). Also: a frozen chip line must not become the last
  element of its array — the trailing-comma change alone puts it in the
  diff.
- **factscan mirror** — token regex from `_redesigns/_port/factscan.sh`
  (chip families, ISO/IEC, `$`-amounts, number+unit). DROPPED must be
  empty; NEW must be empty *or* every NEW token justified by a sources[]
  entry in your notes. Known quirk: `$`-tokens swallow a sentence-final
  period (`$2,500.`) — if you delete the sentence, re-house that exact
  token in natural prose (a table Notes cell ending in the amount works).
- **zod strict** — schema mirror generated live by slicing
  content.config.ts (linkSchema → editorialSchema), so it can't go stale.
  Never use `_redesigns/_port/zodcheck-full.mjs` for table-bearing pages:
  its tableSchema wants `headers`; the real schema wants `columns`.

## 2. Repo linters (when the worktree allows)

`node scripts/lint-chip-claims.mjs` scans all editorial files — run as-is.
Drift lint and vitest read the working tree; if a full-fidelity run is
needed, use the swap-restore pattern: back up the worktree file (`cp` +
`md5sum`), copy your candidate in, run
`BASE=origin/main node scripts/lint-chip-placeholder-drift.mjs` (ignore
findings from files that belong to the parked branch's own diff) and
`TMPDIR=/tmp npx vitest run`, then restore the backup and `cmp` it.
Deleting anything inside the mount may need explicit delete permission —
ask, don't work around.

## 3. Preview

```
python3 .claude/skills/page-geo/scripts/build_preview.py \
  --repo . --json /tmp/<slug>_new.json \
  --out preview_<slug>.html [--svg <dir-with-new-svgs>]
```

Inlines SVGs (local dir first, then origin/main blobs) and display-resolves
`{chip:}` (name→displayName, short_name→shortName??displayName, dotted
paths into chip-specs.json). Look at it before shipping — table overflow
and 12px-text overflow in SVGs are the two recurring visual bugs.

## 4. Branch + handoff (full mode only)

Plumbing, never checkout (the worktree isn't yours):

```
IDX=/tmp/shipidx_$$_$RANDOM
export GIT_INDEX_FILE=$IDX
git read-tree origin/main
B=$(git hash-object -w /tmp/<slug>_new.json)
git update-index --add --cacheinfo 100644,$B,src/content/editorial/<group>/<slug>.json
# repeat hash-object/update-index for any new SVGs
T=$(git write-tree)
C=$(git commit-tree $T -p origin/main -m "geo(<group>): <slug> — <one line>")
git branch -f page-geo/<slug> $C
unset GIT_INDEX_FILE; rm -f $IDX
git --no-optional-locks diff --stat origin/main page-geo/<slug>
```

Hard rules learned the expensive way:
- **Unique index path every time** (`/tmp/shipidx_$$_$RANDOM`) — a stale
  shared index once silently committed another session's files onto a new
  branch name.
- **Verify `diff --stat` lists exactly your files** and `cat-file -p | cmp`
  each blob against its source before handing off.
- The sandbox has no GitHub credentials: hand the user
  `git push origin page-geo/<slug>` plus the compare URL; never claim you
  pushed.
- Before starting at all: `git ls-remote origin '*<slug>*'` and grep memory
  for existing branches/PRs touching the page — redoing merged work and
  pushing stale branches both have real precedents.

## Completeness rubric (target ≥8/10; lp/ pages ≥7 with length bar waived)

+2 sections ≥5 (else +1 if ≥3) · +2 section content ≥8K chars (else +1 if
≥3K) · +2 visuals ≥3 incl. hero (else +1 if ≥1) · +1 FAQ ≥4 · +1 sources
≥2 · +1 brief[] present · +1 keywords ≥4.

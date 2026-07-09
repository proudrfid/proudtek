---
name: blog-fable
description: >-
  Run the blog-transform makeover pipeline (voice + tokenized SVG diagrams +
  SEO/GEO) from INSIDE a Cowork desktop session (Claude Fable 5), where the
  repo is a mounted folder, bash runs in a Linux sandbox with different paths,
  git has no push credentials, and astro build/check may not finish. Use this
  whenever a blog/compare page rewrite, illustration or SEO/GEO task is
  requested in Cowork — phrasings like "改造这篇博客", "transform this post",
  "add diagrams + SEO", "把这些页面上线" — instead of assuming Claude Code
  conditions. Also use it when porting session-generated HTML redesigns back
  into the JSON pipeline. For plain Claude Code on the user's machine, use
  blog-transform directly.
user-invocable: true
args:
  - name: target
    description: Blog slug/path, or "port <html>" for a redesign-HTML port. Optional — ask if missing.
    required: false
---

# Blog Fable — blog-transform, adapted to the Cowork sandbox

Same content pipeline as blog-transform; this skill adds the runtime layer for
Cowork (Fable) sessions. **Read these first and follow them for everything
editorial**: `.claude/skills/blog-transform/SKILL.md` + its `references/`
(svg-style, seo-geo, image-prompts) and `.claude/skills/blog-voice/SKILL.md`
(voice recipe, Tier A/B, rubric). This file covers only what changes when you
are not on the user's Mac. Every rule below was earned by a real failure.

## 1 · Two path namespaces — never mix them

- File tools (Read/Write/Edit/Glob/Grep) use HOST paths:
  `/Users/<user>/Projects/<repo>/...`
- bash uses the sandbox mount: `/sessions/<session>/mnt/<repo>/...`
  (the exact mapping is in the session's Shell-access notes).
- `/tmp` exists only inside the sandbox. To view a rendered PNG with the Read
  tool, copy it into the mounted repo (scratch dir) or the outputs folder first.
- Subagents don't inherit this knowledge — every fan-out prompt must restate
  the mapping and the no-git-writes rule.

## 2 · Pre-flight (before editing anything)

- **Route trap**: check `public/_redirects` AND `vercel.json` for the target
  route. If `/blog/<slug>/` 301s elsewhere (e.g. to `/compare/<slug>/`), edit
  the page that is actually served — the other JSON is an orphan.
- **Shipped-ness is content, not refs**: this repo squash-merges, so local
  branches show "ahead" forever. Decide what's live by
  `git show origin/main:<file> | cmp -s - <file>` — never by branch state.
  (origin/main may itself be stale: the sandbox cannot fetch.)
- **git hygiene**: always `git --no-optional-locks ...`. A stale
  `.git/index.lock` blocks everything — call `allow_cowork_file_delete` on it,
  then `rm` (plain deletes in the mount fail with EPERM until allowed).
- Work in place on the user's worktree only for file EDITS; never
  checkout/switch/reset their HEAD.

## 3 · Verification — sandbox substitutes

The intent of blog-transform's gates is unchanged; the tooling differs:

| Gate | Cowork substitute |
|---|---|
| schema (`npm run check`) | astro check/build rarely finishes here. Use a faithful argv zod mirror: `_redesigns/_port/zodcheck-full.mjs` if present, else write one by copying `src/content.config.ts` schemas. **Verify the validator actually reads the file you pass** — a hardcoded temp script once green-lit 4 files by validating the same one 4 times. |
| chip lints | `npm run -s lint:chip-claims <json>` and `BASE=main npm run -s lint:chip-placeholder-drift` work as-is. Drift compares whole source lines byte-for-byte **including the trailing comma** — a frozen `{chip:}` line must not become the last element of its array. |
| facts | token-set scan (`_redesigns/_port/factscan.sh <slug>` or its inline recipe): DROPPED must be empty; every NEW token needs a one-line justification (standard sizes, process temps, restatements only). |
| tests | `TMPDIR=/tmp npx vitest run` (without TMPDIR it silently runs 1 file and "passes"). |
| SVG structure | `node .claude/skills/blog-transform/scripts/check-svg.mjs <files>` |
| SVG eyeball | `python3 -m cairosvg in.svg -o out.png --output-width 880` (pip install cairosvg --break-system-packages if missing). **Do not trust ImageMagick `convert`** — it misdraws `transform="rotate(...)"` and element-level opacity; avoid both in new SVGs (precomputed geometry + explicit tint hexes), then copy PNGs into the repo and view every one with Read. |
| dev-server preview | not available (astro dev won't run to completion in-sandbox). Rely on the gates + rendered PNGs; full visual acceptance happens on the Vercel PR preview. |

## 4 · Shipping without credentials

The sandbox has no GitHub auth (no token, no SSH, no gh). Never try to push;
never tell the user it's impossible either — package it:

1. Build the commit with plumbing, off `origin/main`, without touching the
   user's index or worktree state:
   ```bash
   export GIT_INDEX_FILE=/tmp/shipidx
   git read-tree origin/main
   SHA=$(git hash-object -w "<file>") && git update-index --add --cacheinfo 100644 $SHA "<file>"   # per file
   T=$(git write-tree) && C=$(git commit-tree $T -p origin/main -m "<msg>") && git branch -f <branch> $C
   ```
   (To drop a file: `git update-index --force-remove <path>`. To stack a fix:
   `read-tree <branch>` and parent `-p <branch>`.)
2. Hand the user paste-ready commands — **no inline # comments, one command
   per line** (zsh eats comment lines pasted interactively):
   ```
   cd /Users/<user>/Projects/<repo>
   git push -u origin <branch>
   gh pr create --fill --head <branch>
   ```
3. Squash-merge aftermath: if you push a fix AFTER the PR merged, the closed
   PR ignores it — open a NEW PR from the same branch (its content-diff vs
   main is exactly the fix).
4. Post-merge verification: plain URLs sit on stale CDN edge for minutes.
   Fetch with `?v=<sha>` or fetch one brand-new SVG asset URL. `summary`
   surfaces as meta description; `modifiedAt` as article:modified_time —
   both are quick tells of which version is live.
5. Never run `git add -A` / commit / push in the user's worktree, and warn the
   user off any legacy DEPLOY.md that says to copy HTML into `src/pages/`.

## 5 · Porting session-HTML redesigns (the salvage path)

When the input is a standalone HTML from an earlier session (not the live
JSON): follow `_redesigns/_port/PORTING.md`. Core law: the HTML's inline SVGs
lost their page CSS — they are composition specs; **redraw in house style**.
Extraction helpers live in `_redesigns/_port/` (extract.mjs, factscan.sh).

## 6 · Fan-out (many pages)

One page per subagent, 3-6 concurrent. Each prompt must include: path
mapping, the target JSON + source, tier (B = humor ≤2/10, sober diagrams),
"follow PORTING.md / blog-transform refs", the validator + cairosvg
amendments, and hard constraints (no git writes; touch only your JSON, your
SVGs, your scratch dir). Re-run drift + vitest + zod centrally afterwards —
agents can pass locally and still collide globally (e.g. the trailing-comma
drift case).

## Acceptance

Identical to blog-transform Step 4/5 (rubric scores, facts diff = 0, lints
green, every diagram eyeballed) — plus: handoff block delivered, and a
post-merge cache-busted URL check promised in the report.

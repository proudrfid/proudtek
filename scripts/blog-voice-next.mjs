#!/usr/bin/env node
// blog-voice rewrite dispatcher.
//
// Returns the next available Tier A blog post to enliven so the parallel
// fleet of /blog-voice agents doesn't race on the same file. This is the
// blog-voice analogue of scripts/chip-specs-next.mjs.
//
// WHY this exists: chip-specs:next claims a file only when an *open PR*
// touches it. blog-voice agents work in dedicated /tmp worktrees and edit a
// post for several minutes BEFORE any commit or PR exists — so PR-only
// detection lets two agents pick the same post (this actually happened:
// `reader-not-detecting` vs `reader-not-detecting-tags`, May 2026). So this
// dispatcher unions FOUR claim signals, widest-net first:
//
//   1. DONE      — files touched by a merged "enliven" commit on origin/main.
//   2. open PRs  — `gh pr list` files (PR opened, maybe worktree gone).
//   3. branches  — committed blog files on any remote `blog-voice/*` branch
//                  (pushed, worktree removed, PR not yet opened).
//   4. worktrees — committed AND **uncommitted** blog files in any local
//                  worktree on a `blog-voice/*` branch (agent mid-edit, the
//                  case PR-only detection misses entirely).
//
// A post is "available" iff it is Tier A (see classify-tier.mjs), not DONE,
// and not claimed by 2/3/4. Tier B posts are excluded from the default pool —
// the skill ships them as their own heavier-reviewed batch (`--tier-b` lists
// them). Read-only: this script never writes. The "claim" an agent makes is
// the worktree+branch it creates immediately after picking a target, which
// signals 3/4 then surface to the next dispatcher run.
//
// Usage:
//   node scripts/blog-voice-next.mjs               # top 10 available Tier A, lightest-first
//   node scripts/blog-voice-next.mjs --count=5     # top 5
//   node scripts/blog-voice-next.mjs --heavy       # heaviest posts first
//   node scripts/blog-voice-next.mjs --tier-b      # list Tier B pool instead (own batch)
//   node scripts/blog-voice-next.mjs --json        # machine-readable
//   node scripts/blog-voice-next.mjs --no-fetch    # skip git fetch
//   node scripts/blog-voice-next.mjs --no-prs      # skip gh pr list (offline)
//   node scripts/blog-voice-next.mjs --force       # bypass STOP_BLOG_VOICE sentinel

import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { classify } from '../.claude/skills/blog-voice/scripts/classify-tier.mjs';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const BLOG_DIR = join(ROOT, 'src/content/editorial/blog');
const BLOG_PREFIX = 'src/content/editorial/blog/';

const args = process.argv.slice(2);
const wantJson = args.includes('--json');
const wantTierB = args.includes('--tier-b');
const wantHeavy = args.includes('--heavy');
const noFetch = args.includes('--no-fetch');
const noPrs = args.includes('--no-prs');
const force = args.includes('--force');
const countArg = args.find((a) => a.startsWith('--count='));
const count = countArg ? Math.max(1, parseInt(countArg.split('=')[1], 10) || 10) : 10;

// Advisory trip threshold: when this few Tier A posts remain unclaimed, the
// one-per-PR cadence is low-ROI — agents should halt and ask whether to batch
// the tail or declare the pass done. Tunable via env.
const FEW_POSTS_THRESHOLD = parseInt(process.env.BLOG_VOICE_STOP_AT_FILES || '15', 10);

// ── shell helpers (cwd-pinned; resilient to the caller's cwd drifting) ──────
// Every external call is time-boxed. This dispatcher exists to keep a busy
// parallel fleet from colliding, which means it runs under exactly the
// conditions where a `git fetch` or `gh` call stalls on a saturated repo or a
// flaky network. An unbounded execSync would hang the whole dispatcher there —
// the one failure mode it cannot have. On timeout (or any error) we return ''
// and the caller degrades gracefully: a stalled fetch just means we plan
// against the refs we already have, which is safe (worst case: a slightly
// stale claim set, never a hang). Tunable via BLOG_VOICE_CMD_TIMEOUT_MS.
const CMD_TIMEOUT_MS = parseInt(process.env.BLOG_VOICE_CMD_TIMEOUT_MS || '20000', 10);
function sh(cmd, cwd = ROOT) {
  try {
    return execSync(cmd, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: CMD_TIMEOUT_MS,
      killSignal: 'SIGKILL',
    });
  } catch {
    // Timed out, non-zero exit, or spawn failure — all non-fatal here.
    return '';
  }
}
const lines = (s) => s.split('\n').map((x) => x.trim()).filter(Boolean);

/** repo-relative path -> blog slug, or null if it isn't a flat blog post JSON. */
function blogSlug(path) {
  if (!path || !path.startsWith(BLOG_PREFIX) || !path.endsWith('.json')) return null;
  const rest = path.slice(BLOG_PREFIX.length);
  if (rest.includes('/')) return null; // posts are flat files directly in blog/
  return rest.replace(/\.json$/, '');
}

// ── 0. hard kill switch ─────────────────────────────────────────────────────
const STOP_FILE = join(ROOT, 'STOP_BLOG_VOICE');
let stopReason = null;
try {
  stopReason = readFileSync(STOP_FILE, 'utf8').trim() || 'STOP_BLOG_VOICE sentinel present';
} catch {
  // No sentinel. Continue.
}
if (stopReason && !force) {
  if (wantJson) {
    console.log(JSON.stringify({
      halted: true, haltReason: stopReason,
      tierACount: 0, doneCount: 0, claimedCount: 0, availableCount: 0, targets: [],
    }, null, 2));
  } else {
    console.log('');
    console.log('🛑 blog-voice rewrite HALTED');
    console.log('────────────────────────────────────────────────────────────');
    console.log(`reason: ${stopReason}`);
    console.log('');
    console.log('Do NOT pick another post. Report back to the user.');
    console.log('To resume: delete STOP_BLOG_VOICE at repo root (or pass --force).');
    console.log('');
  }
  process.exit(0);
}

// ── 1. refresh main + blog-voice branch refs (best-effort, time-boxed) ──────
// Both fetches are bounded by sh()'s timeout. If the network is down or the
// remote is slow, they no-op and we proceed against local refs — stale-but-safe
// beats hung. Pass --no-fetch to skip the network entirely when offline.
if (!noFetch) {
  sh('git fetch origin main --quiet');
  sh("git fetch origin '+refs/heads/blog-voice/*:refs/remotes/origin/blog-voice/*' --prune --quiet");
}

// ── 2. enumerate posts + tiers ──────────────────────────────────────────────
const allSlugs = readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace(/\.json$/, ''))
  .sort();
const tierA = new Set();
const tierB = new Set();
for (const s of allSlugs) (classify(s).tier === 'B' ? tierB : tierA).add(s);

// ── 3a. DONE — merged "enliven" commits on origin/main ──────────────────────
// Convention: every shipped rewrite commit subject contains "enliven"
// (see git log). We read the files those commits touched under blog/.
const done = new Set();
for (const f of lines(sh(
  `git log origin/main --no-merges --name-only --pretty=format: --grep=enliven -i -- ${BLOG_PREFIX}`,
))) {
  const s = blogSlug(f);
  if (s) done.add(s);
}

// ── claim accumulator (in-flight only; DONE tracked separately) ─────────────
const claims = new Map(); // slug -> Set<reason>
function claim(slug, reason) {
  if (!slug || done.has(slug)) return;
  if (!claims.has(slug)) claims.set(slug, new Set());
  claims.get(slug).add(reason);
}

// ── 3b. open PRs ────────────────────────────────────────────────────────────
let prError = null;
if (!noPrs) {
  const out = sh('gh pr list --state open --limit 200 --json number,title,files');
  if (out) {
    try {
      for (const pr of JSON.parse(out)) {
        for (const f of pr.files || []) claim(blogSlug(f.path), `pr#${pr.number}`);
      }
    } catch (e) {
      prError = e.message;
    }
  } else {
    prError = 'gh pr list returned nothing (not installed / not authed / no remote)';
  }
}

// ── 3c. remote blog-voice/* branches — committed blog files ─────────────────
const remoteRefs = lines(sh("git for-each-ref --format=%(refname:short) refs/remotes/origin/blog-voice"));
const reservationRefs = []; // branches with no committed blog diff yet
for (const ref of remoteRefs) {
  const files = lines(sh(`git diff --name-only origin/main...${ref} -- ${BLOG_PREFIX}`))
    .map(blogSlug).filter(Boolean);
  if (files.length) for (const s of files) claim(s, ref.replace(/^origin\//, 'branch:'));
  else reservationRefs.push(ref);
}

// ── 3d. local worktrees on blog-voice/* — committed AND uncommitted ─────────
function parseWorktrees(porcelain) {
  const out = [];
  let cur = null;
  for (const raw of porcelain.split('\n')) {
    if (raw.startsWith('worktree ')) {
      if (cur) out.push(cur);
      cur = { path: raw.slice('worktree '.length).trim(), branch: null };
    } else if (raw.startsWith('branch ') && cur) {
      cur.branch = raw.slice('branch '.length).trim().replace(/^refs\/heads\//, '');
    }
  }
  if (cur) out.push(cur);
  return out;
}
for (const wt of parseWorktrees(sh('git worktree list --porcelain'))) {
  if (!wt.branch || !wt.branch.startsWith('blog-voice/')) continue;
  const committed = lines(sh(`git diff --name-only origin/main...HEAD -- ${BLOG_PREFIX}`, wt.path));
  // porcelain status lines look like "XY path"; slice(3) drops the 2 code cols + space.
  const dirty = lines(sh(`git status --porcelain -- ${BLOG_PREFIX}`, wt.path)).map((l) => l.slice(3));
  for (const f of [...committed, ...dirty]) claim(blogSlug(f), `worktree:${wt.branch}`);
}

// ── 3e. reservation branches (no committed diff) — conservative name match ──
// An empty blog-voice/* branch is a soft reservation. Excluding a post on a
// fuzzy name match risks skipping a free post, but the cost of that is far
// lower than two agents colliding — and every soft claim is printed so a human
// can override. Only fires for branches with zero committed blog files.
const tok = (s) => new Set(s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean));
function softMatch(a, b) {
  const A = tok(a), B = tok(b);
  if (!A.size || !B.size) return false;
  if ([...A].every((t) => B.has(t)) || [...B].every((t) => A.has(t))) return true;
  const inter = [...A].filter((t) => B.has(t)).length;
  return inter / new Set([...A, ...B]).size >= 0.6;
}
for (const ref of reservationRefs) {
  const suffix = ref.replace(/^origin\/blog-voice\//, '');
  for (const slug of tierA) {
    if (!done.has(slug) && softMatch(suffix, slug)) claim(slug, `reserved:${ref.replace(/^origin\//, '')}`);
  }
}

// ── 4. compute available pool + ordering ────────────────────────────────────
const pool = wantTierB ? tierB : tierA;
const bytes = (slug) => { try { return statSync(join(BLOG_DIR, `${slug}.json`)).size; } catch { return 0; } };
const available = [...pool]
  .filter((s) => !done.has(s) && !claims.has(s))
  .sort((a, b) => (wantHeavy ? bytes(b) - bytes(a) : bytes(a) - bytes(b)) || a.localeCompare(b));

const claimedInPool = [...pool].filter((s) => claims.has(s)).length;
const doneInPool = [...pool].filter((s) => done.has(s)).length;

// ── 4b. advisory stop signals (do NOT halt; CLAUDE.md says report to user) ──
const stopSignals = [];
if (pool.size > 0 && available.length === 0) {
  stopSignals.push({ code: 'ALL_DONE_OR_CLAIMED', detail: `every ${wantTierB ? 'Tier B' : 'Tier A'} post is done or in-flight` });
} else if (available.length > 0 && available.length <= FEW_POSTS_THRESHOLD) {
  stopSignals.push({ code: 'FEW_POSTS_REMAIN', detail: `${available.length} available <= threshold ${FEW_POSTS_THRESHOLD}` });
}

const date = new Date().toISOString().slice(0, 10);
const targets = available.slice(0, count).map((slug) => ({
  slug,
  file: `${BLOG_PREFIX}${slug}.json`,
  bytes: bytes(slug),
  tier: wantTierB ? 'B' : 'A',
  branchSuggestion: `blog-voice/${slug}`,
  worktreeSuggestion: `/tmp/bv-${slug.slice(0, 28)}`,
}));

// ── 5. output ───────────────────────────────────────────────────────────────
if (wantJson) {
  console.log(JSON.stringify({
    halted: false, haltReason: null, stopSignals,
    pool: wantTierB ? 'tier-b' : 'tier-a',
    tierACount: tierA.size, tierBCount: tierB.size,
    doneCount: doneInPool, claimedCount: claimedInPool, availableCount: available.length,
    prError, date,
    claims: Object.fromEntries([...claims].map(([s, r]) => [s, [...r]])),
    targets,
  }, null, 2));
  process.exit(0);
}

console.log('');
console.log('────────────────────────────────────────────────────────────');
console.log(`blog-voice dispatcher${wantTierB ? '  (Tier B pool)' : ''}`);
console.log('────────────────────────────────────────────────────────────');
if (prError) {
  console.log(`⚠  open-PR check failed (${prError.split('\n')[0]})`);
  console.log('   branch + worktree detection still active, but collision risk is higher.');
}
console.log(`scanned ${allSlugs.length} blog posts  (${tierA.size} Tier A, ${tierB.size} Tier B)`);
console.log(`  ${wantTierB ? 'Tier B' : 'Tier A'} done (merged enliven):    ${doneInPool}`);
console.log(`  ${wantTierB ? 'Tier B' : 'Tier A'} claimed (in-flight):      ${claimedInPool}`);
console.log(`  ${wantTierB ? 'Tier B' : 'Tier A'} available:                ${available.length}`);
console.log('');

if (claims.size > 0) {
  console.log('In-flight claims (slug → why it is excluded):');
  for (const [slug, reasons] of [...claims].sort()) {
    console.log(`  • ${slug}  ←  ${[...reasons].join(', ')}`);
  }
  console.log('');
}

if (stopSignals.length > 0) {
  console.log('🟡 STOP SIGNALS TRIPPED');
  for (const s of stopSignals) console.log(`   • ${s.code}: ${s.detail}`);
  console.log('   → do NOT pick the next target on autopilot; halt and ask the user');
  console.log('     whether to batch the tail, run the Tier B batch, or declare done.');
  console.log('');
}

if (targets.length === 0) {
  console.log('✓ no available targets — every post in this pool is done or claimed.');
  console.log('  Try --tier-b for the medical batch, or --no-prs to ignore PR claims.');
  process.exit(0);
}

console.log(`Top ${targets.length} available ${wantTierB ? 'Tier B' : 'Tier A'} target${targets.length === 1 ? '' : 's'} (${wantHeavy ? 'heaviest' : 'lightest'} first):`);
console.log('');
for (let i = 0; i < targets.length; i++) {
  const t = targets[i];
  console.log(`${i + 1}. ${t.slug}  (${(t.bytes / 1024).toFixed(1)} KB)`);
  console.log(`   ${t.file}`);
  console.log('');
}

const t = targets[0];
console.log('────────────────────────────────────────────────────────────');
console.log(`Recipe (for target #1 — ${wantTierB ? 'Tier B: readability only, humor ≤ 2' : 'Tier A: cold open + dry wit'}):`);
console.log('────────────────────────────────────────────────────────────');
console.log(`  git worktree add ${t.worktreeSuggestion} -b ${t.branchSuggestion} origin/main`);
console.log(`  cd ${t.worktreeSuggestion}`);
console.log(`  node .claude/skills/blog-voice/scripts/classify-tier.mjs ${t.slug}   # confirm tier`);
console.log(`  # edit ${t.file} — add cold-open section[0].intro, 1-2 dry-wit beats, bump modifiedAt`);
console.log('  npm run lint:chip-claims <file> && BASE=main npm run lint:chip-placeholder-drift');
console.log('  npm run check && npx vitest run -u src/lib/__tests__/editorial-pages-*.snapshot.test.ts');
console.log('  git commit -am "content: enliven ' + t.slug + ' with cold open + dry wit (blog-voice)"');
console.log('  git push -u origin HEAD && gh pr create --base main --fill');
console.log('');

#!/usr/bin/env node
// blog-voice dispatcher — the next un-enlivened Tier A blog post to rewrite.
//
// /blog-voice has no atomic claim like chip-specs:next, so during a parallel
// rollout agents collide: multiple rival branches per post, and the front of
// the alphabet becomes a thundering herd because everyone runs the same
// first-available heuristic (memory/feedback-blog-voice-next-claim-filtering.md).
// This returns the next AVAILABLE Tier A post by cross-referencing every claim
// signal, so two agents don't pick the same file:
//
//   1. Already enlivened — the post was touched by a MERGED blog-voice commit
//      on origin/main (git log --grep). Done; never re-served.
//   2. Open PRs — any editorial/blog file on an open PR, matched by PATH (so a
//      multi-file "batch" PR is covered, not just its title's one post).
//   3. In-flight branches — local/remote `blog-voice/*` (git branch -a),
//      token-matched to the post slug. Claims are held by a branch (and its
//      /tmp worktree) BEFORE a PR exists, so PR-only filtering collides.
//   4. Uncommitted WIP in the current worktree (git status), best-effort —
//      catches an agent editing directly in the tree before committing.
//
// Tier B (medical / patient-safety / pharma-compliance) is EXCLUDED by default:
// those need a human in the loop, not an autopilot dispatcher. Pass
// --include-tier-b to surface them (they still classify as Tier B downstream).
//
// Default order is reverse-alphabetical (the TAIL first) to dodge the
// first-alphabetical herd. The real race gate is the `git worktree add -b
// blog-voice/<slug>` in the printed recipe: it ERRORS if a rival claimed the
// slug first, giving you the collision signal at claim time.
//
// Read-only. There is still a small race window between "dispatcher returned a
// target" and "agent pushed the branch" — claim immediately via the worktree,
// then re-run to confirm. Coordinate runs ~minutes apart, not seconds.
//
// Usage:
//   node scripts/blog-voice-next.mjs                 # top 10 available, tail-first
//   node scripts/blog-voice-next.mjs --count=5       # top 5
//   node scripts/blog-voice-next.mjs --alpha         # front-of-alphabet first
//   node scripts/blog-voice-next.mjs --include-tier-b
//   node scripts/blog-voice-next.mjs --json          # machine-readable
//   node scripts/blog-voice-next.mjs --no-fetch      # skip git fetch
//   node scripts/blog-voice-next.mjs --no-prs        # skip gh pr list (offline)
//   node scripts/blog-voice-next.mjs --force         # bypass STOP_BLOG_VOICE sentinel

import { execSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const BLOG_REL = 'src/content/editorial/blog';
const BLOG_DIR = join(ROOT, BLOG_REL);

const args = process.argv.slice(2);
const wantJson = args.includes('--json');
const wantAlpha = args.includes('--alpha');
const noFetch = args.includes('--no-fetch');
const noPrs = args.includes('--no-prs');
const force = args.includes('--force');
const includeTierB = args.includes('--include-tier-b');
const countArg = args.find((a) => a.startsWith('--count='));
const count = countArg ? Math.max(1, parseInt(countArg.split('=')[1], 10) || 10) : 10;

// Advisory trip threshold: when this few unclaimed Tier A posts remain, the
// rollout is near done — agents should halt and let the user decide (batch the
// tail, run Tier B with human review, or declare done). Tunable via env.
const FEW_FILES_THRESHOLD = parseInt(process.env.BLOG_VOICE_STOP_AT_FILES || '8', 10);

// ── Tier classifier ─────────────────────────────────────────────────────────
// MIRRORS .claude/skills/blog-voice/scripts/classify-tier.mjs (the canonical
// source — keep these two token lists in sync). Tier B = sensitive medical /
// patient-safety / pharma-compliance. Whole-token match, never substrings, so
// "factory-audit" (contains "udi") stays Tier A.
const TIER_B_TOKENS = new Set([
  'hipaa', 'patient', 'surgical', 'surgery', 'blood', 'hospital', 'healthcare',
  'clinical', 'medical', 'pharmaceutical', 'pharma', 'dscsa', 'fmd', 'sterile',
  'sterilization', 'autoclave', 'fda', 'aorn', 'udi', 'drug', 'vaccine', 'phi',
]);
const TIER_B_PHRASES = ['cold-chain', 'joint-commission', '21-cfr'];
function classifyTier(slug) {
  const s = slug.toLowerCase();
  const tok = s.split(/[^a-z0-9]+/).filter(Boolean);
  if (tok.some((t) => TIER_B_TOKENS.has(t))) return 'B';
  if (TIER_B_PHRASES.some((p) => s.includes(p))) return 'B';
  return 'A';
}

// Token set for fuzzy branch↔slug matching. Drop generic words shared by most
// slugs so the overlap test keys on the distinctive tokens.
const STOP_TOKENS = new Set(['rfid', 'nfc', 'the', 'for', 'and', 'with', 'vs', 'to', 'of', 'how', 'a', 'an']);
const toks = (s) => new Set(
  s.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 1 && !STOP_TOKENS.has(t)),
);

// ── 0. Hard kill switch ─────────────────────────────────────────────────────
// Drop a STOP_BLOG_VOICE file at repo root to halt all dispatchers at once.
// Its contents become the printed reason (leave a note for future you).
const STOP_FILE = join(ROOT, 'STOP_BLOG_VOICE');
let stopReason = null;
try {
  stopReason = readFileSync(STOP_FILE, 'utf8').trim() || 'STOP_BLOG_VOICE sentinel present';
} catch {
  // no sentinel — continue
}
if (stopReason && !force) {
  if (wantJson) {
    console.log(JSON.stringify({ halted: true, haltReason: stopReason, targets: [] }, null, 2));
  } else {
    console.log('');
    console.log('🛑 blog-voice rollout HALTED');
    console.log('────────────────────────────────────────────────────────────');
    console.log(`reason: ${stopReason}`);
    console.log('');
    console.log('Do NOT open another blog-voice PR. Report back to the user.');
    console.log('To resume: delete STOP_BLOG_VOICE at repo root (or pass --force).');
    console.log('');
  }
  process.exit(0);
}

// ── 1. Refresh main (best-effort) ───────────────────────────────────────────
if (!noFetch) {
  try {
    execSync('git fetch origin main --quiet', { cwd: ROOT, stdio: 'ignore' });
  } catch {
    // offline / no remote — fall back to current refs
  }
}

// ── 2. Enlivened set: blog posts touched by a MERGED blog-voice commit ───────
const enlivened = new Set();
try {
  const out = execSync(
    'git log origin/main --grep=enliven --grep=blog-voice --name-only --pretty=format:',
    { encoding: 'utf8', cwd: ROOT, maxBuffer: 64 * 1024 * 1024 },
  );
  for (const raw of out.split('\n')) {
    const p = raw.trim();
    if (p.startsWith(`${BLOG_REL}/`) && p.endsWith('.json')) {
      enlivened.add(basename(p).replace(/\.json$/, ''));
    }
  }
} catch {
  // no history (shallow clone) — enlivened stays empty; PR/branch filters still apply
}

// ── 3. All blog posts ───────────────────────────────────────────────────────
const allSlugs = readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace(/\.json$/, ''))
  .sort();

function placeholderCount(slug) {
  try {
    return (readFileSync(join(BLOG_DIR, `${slug}.json`), 'utf8').match(/\{chip:/g) || []).length;
  } catch {
    return 0;
  }
}

// ── 4. Claim signals ────────────────────────────────────────────────────────
// 4a. open-PR files → slug (by PATH, so batch PRs are covered)
const claimedByPr = new Map(); // slug -> [{ number, title }]
let prFetchError = null;
if (!noPrs) {
  try {
    const prs = JSON.parse(execSync(
      'gh pr list --state open --limit 300 --json number,title,files',
      { encoding: 'utf8', cwd: ROOT, maxBuffer: 64 * 1024 * 1024 },
    ));
    for (const pr of prs) {
      for (const f of pr.files || []) {
        if (f.path && f.path.startsWith(`${BLOG_REL}/`) && f.path.endsWith('.json')) {
          const slug = basename(f.path).replace(/\.json$/, '');
          if (!claimedByPr.has(slug)) claimedByPr.set(slug, []);
          claimedByPr.get(slug).push({ number: pr.number, title: pr.title });
        }
      }
    }
  } catch (e) {
    prFetchError = String(e.message || e).split('\n')[0];
  }
}

// 4b. in-flight blog-voice/* branches (local + remote + worktrees) → token match
const branchTokenSets = [];
try {
  const out = execSync("git branch -a --format='%(refname:short)'", { encoding: 'utf8', cwd: ROOT });
  const seen = new Set();
  for (const raw of out.split('\n')) {
    const name = raw.trim().replace(/^origin\//, '');
    if (name.startsWith('blog-voice/') && !seen.has(name)) {
      seen.add(name);
      branchTokenSets.push({ name, t: toks(name.slice('blog-voice/'.length)) });
    }
  }
} catch {
  // ignore
}
function branchClaim(slug) {
  const S = toks(slug);
  for (const { name, t } of branchTokenSets) {
    if (!t.size) continue;
    let inter = 0;
    for (const x of t) if (S.has(x)) inter++;
    // most of the branch's distinctive tokens appear in the slug
    if (inter >= 2 && inter / t.size >= 0.6) return name;
  }
  return null;
}

// 4c. uncommitted WIP in the CURRENT worktree (best-effort; per-worktree)
const wipSlugs = new Set();
try {
  const out = execSync(`git status --porcelain -- ${BLOG_REL}`, { encoding: 'utf8', cwd: ROOT });
  for (const raw of out.split('\n')) {
    const p = raw.trim().split(/\s+/).pop();
    if (p && p.startsWith(`${BLOG_REL}/`) && p.endsWith('.json')) {
      wipSlugs.add(basename(p).replace(/\.json$/, ''));
    }
  }
} catch {
  // ignore
}

// ── 5. Build candidate list ─────────────────────────────────────────────────
const rows = [];
for (const slug of allSlugs) {
  if (enlivened.has(slug)) continue; // already done
  const tier = classifyTier(slug);
  if (!includeTierB && tier === 'B') continue; // humans handle Tier B
  const pr = claimedByPr.get(slug) || null;
  const branch = branchClaim(slug);
  const wip = wipSlugs.has(slug);
  const claimReason = pr ? `PR #${pr[0].number}` : branch ? `branch ${branch}` : wip ? 'local WIP' : null;
  rows.push({ slug, tier, placeholders: placeholderCount(slug), claimed: !!claimReason, claimReason });
}

const available = rows.filter((r) => !r.claimed);
available.sort((a, b) => (wantAlpha ? a.slug.localeCompare(b.slug) : b.slug.localeCompare(a.slug)));

const claimedCount = rows.filter((r) => r.claimed).length;
const availableTierA = available.filter((r) => r.tier === 'A').length;

// ── 5b. Advisory stop signals (do NOT halt — tell the human to decide) ───────
const stopSignals = [];
if (!includeTierB && availableTierA === 0) {
  stopSignals.push({
    code: 'NO_TIER_A_REMAIN',
    detail: 'every Tier A post is enlivened or claimed — only Tier B (human-review) remains',
  });
}
if (availableTierA > 0 && available.length <= FEW_FILES_THRESHOLD) {
  stopSignals.push({
    code: 'FEW_FILES_REMAIN',
    detail: `${available.length} unclaimed posts <= threshold ${FEW_FILES_THRESHOLD} — the rollout is nearly done`,
  });
}

const top = available.slice(0, count);

// ── 6. Output ───────────────────────────────────────────────────────────────
if (wantJson) {
  console.log(JSON.stringify({
    halted: false,
    haltReason: null,
    stopSignals,
    totalPosts: allSlugs.length,
    enlivenedCount: enlivened.size,
    claimedCount,
    availableCount: available.length,
    availableTierA,
    prFetchError,
    targets: top.map((t) => ({ slug: t.slug, tier: t.tier, placeholders: t.placeholders, file: `${BLOG_REL}/${t.slug}.json` })),
  }, null, 2));
  process.exit(0);
}

console.log('');
console.log('────────────────────────────────────────────────────────────');
console.log('blog-voice dispatcher');
console.log('────────────────────────────────────────────────────────────');
if (prFetchError) {
  console.log(`⚠  could not fetch open PRs (${prFetchError}) — collision risk HIGH; re-run with network`);
} else {
  console.log(`scanned ${allSlugs.length} blog posts`);
  console.log(`  already enlivened (merged):          ${enlivened.size}`);
  console.log(`  claimed (open PR / branch / WIP):    ${claimedCount}`);
  console.log(`  unclaimed & available:               ${available.length}`);
  console.log(`    of which Tier A:                   ${availableTierA}`);
  if (includeTierB) console.log(`    of which Tier B (human review):    ${available.length - availableTierA}`);
}
console.log('');

if (stopSignals.length > 0) {
  console.log('🟡 STOP SIGNALS TRIPPED');
  for (const s of stopSignals) console.log(`   • ${s.code}: ${s.detail}`);
  console.log('   → do NOT pick the next target on autopilot; halt and report to the user');
  console.log('     so they can choose: batch the tail, run Tier B with review, or declare done.');
  console.log('');
}

if (top.length === 0) {
  console.log('✓ no unclaimed Tier A targets — the rollout is done, or everything');
  console.log('  remaining is in flight. Try --include-tier-b or --no-prs to see more.');
  process.exit(0);
}

console.log(`Top ${top.length} available target${top.length === 1 ? '' : 's'} (${wantAlpha ? 'front-of-alphabet' : 'tail'} first):`);
console.log('');
for (let i = 0; i < top.length; i++) {
  const t = top[i];
  const ph = t.placeholders === 0 ? 'no {chip:} placeholders' : `${t.placeholders} {chip:} placeholder line(s) — do not touch them`;
  console.log(`${i + 1}. ${t.slug}   [Tier ${t.tier}]`);
  console.log(`   file:  ${BLOG_REL}/${t.slug}.json`);
  console.log(`   note:  ${ph}`);
  console.log('');
}

const t = top[0];
const wt = `/tmp/bv-${t.slug.slice(0, 32)}`;
console.log('────────────────────────────────────────────────────────────');
console.log('Recipe (for target #1) — run /blog-voice for the full guardrails:');
console.log('────────────────────────────────────────────────────────────');
console.log(`  node .claude/skills/blog-voice/scripts/classify-tier.mjs ${t.slug}   # confirm Tier ${t.tier}`);
console.log(`  git worktree add -b blog-voice/${t.slug} ${wt} origin/main   # RACE GATE: errors if already claimed`);
console.log(`  ln -s ${ROOT}/node_modules ${wt}/node_modules`);
console.log(`  # rewrite ${BLOG_REL}/${t.slug}.json: cold open + 1-2 dry-wit beats; FREEZE every`);
console.log('  #   number / chip / vendor / price; bump modifiedAt; do NOT touch reviewedAt.');
console.log(`  cd ${wt} && npm run lint:chip-claims -- ${BLOG_REL}/${t.slug}.json \\`);
console.log('     && BASE=origin/main npm run lint:chip-placeholder-drift \\');
console.log('     && npm run check \\');
console.log('     && npx vitest run src/lib/__tests__/editorial-pages-*.snapshot.test.ts');
console.log(`  git -C ${wt} commit -am 'content: enliven ${t.slug} with cold open + dry wit (blog-voice)'`);
console.log(`  git -C ${wt} push -u origin blog-voice/${t.slug}`);
console.log(`  (cd ${wt} && gh pr create --base main --fill) && git worktree remove ${wt} --force`);
console.log('');

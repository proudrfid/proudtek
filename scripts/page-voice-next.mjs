#!/usr/bin/env node
// page-voice dispatcher — the next un-enlivened, high-ROI Solutions/Guides page.
//
// Sibling of scripts/blog-voice-next.mjs. Same anti-collision design (a parallel
// rollout makes agents pick the same file), adapted for non-blog pages:
//   - scans BOTH src/content/editorial/solutions and .../guides
//   - serves only RICH · STANDARD pages by default (enough editable prose, not
//     medical/patient-safety) — LEAN/SENSITIVE/SKIP are surfaced only with flags
//   - branch prefix is page-voice/<slug>; kill switch is STOP_PAGE_VOICE
//
// Claim signals cross-referenced so two agents don't pick the same file:
//   1. Already enlivened — touched by a MERGED page-voice commit on origin/main.
//   2. Open PRs — any solutions/guides file on an open PR, matched by PATH (so a
//      multi-file batch PR is covered, not just its title's one page).
//   3. In-flight page-voice/* branches (local+remote), token-matched to the slug.
//   4. Uncommitted WIP in the current worktree (best-effort).
//
// Default order is reverse-alphabetical (TAIL first) to dodge the alphabet herd.
// The real race gate is `git worktree add -b page-voice/<slug>` in the printed
// recipe: it ERRORS if a rival claimed the slug first.
//
// Read-only. Usage:
//   node scripts/page-voice-next.mjs                 # top 10 RICH·STANDARD, tail-first
//   node scripts/page-voice-next.mjs --group solutions   # one group
//   node scripts/page-voice-next.mjs --count=5
//   node scripts/page-voice-next.mjs --alpha         # front-of-alphabet first
//   node scripts/page-voice-next.mjs --include-lean  # also surface LEAN pages
//   node scripts/page-voice-next.mjs --include-sensitive  # also surface SENSITIVE (human-review)
//   node scripts/page-voice-next.mjs --json
//   node scripts/page-voice-next.mjs --no-fetch / --no-prs / --force

import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
// Reuse the canonical classifier — no duplicated token lists / thresholds.
import { classifyFileExport } from '../.claude/skills/page-voice/scripts/classify-page.mjs';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const GROUPS = ['solutions', 'guides'];
const REL = (g) => `src/content/editorial/${g}`;

const args = process.argv.slice(2);
const wantJson = args.includes('--json');
const wantAlpha = args.includes('--alpha');
const noFetch = args.includes('--no-fetch');
const noPrs = args.includes('--no-prs');
const force = args.includes('--force');
const includeLean = args.includes('--include-lean');
const includeSensitive = args.includes('--include-sensitive');
const groupArg = args.indexOf('--group');
const onlyGroup = groupArg !== -1 ? args[groupArg + 1] : null;
const countArg = args.find((a) => a.startsWith('--count='));
const count = countArg ? Math.max(1, parseInt(countArg.split('=')[1], 10) || 10) : 10;

const groups = onlyGroup ? [onlyGroup] : GROUPS;

// Advisory trip threshold — when this few unclaimed targets remain the rollout
// is near done; agents should halt and let the user decide.
const FEW_FILES_THRESHOLD = parseInt(process.env.PAGE_VOICE_STOP_AT_FILES || '6', 10);

// Token set for fuzzy branch↔slug matching (mirrors blog-voice-next).
const STOP_TOKENS = new Set(['rfid', 'nfc', 'the', 'for', 'and', 'with', 'vs', 'to', 'of', 'how', 'a', 'an']);
const toks = (s) => new Set(
  s.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 1 && !STOP_TOKENS.has(t)),
);

// ── 0. Hard kill switch ─────────────────────────────────────────────────────
const STOP_FILE = join(ROOT, 'STOP_PAGE_VOICE');
let stopReason = null;
try {
  stopReason = readFileSync(STOP_FILE, 'utf8').trim() || 'STOP_PAGE_VOICE sentinel present';
} catch {
  /* no sentinel */
}
if (stopReason && !force) {
  if (wantJson) {
    console.log(JSON.stringify({ halted: true, haltReason: stopReason, targets: [] }, null, 2));
  } else {
    console.log('\n🛑 page-voice rollout HALTED');
    console.log('────────────────────────────────────────────────────────────');
    console.log(`reason: ${stopReason}\n`);
    console.log('Do NOT open another page-voice PR. Report back to the user.');
    console.log('To resume: delete STOP_PAGE_VOICE at repo root (or pass --force).\n');
  }
  process.exit(0);
}

// ── 1. Refresh main ─────────────────────────────────────────────────────────
if (!noFetch) {
  try {
    execSync('git fetch origin main --quiet', { cwd: ROOT, stdio: 'ignore' });
  } catch { /* offline */ }
}

// ── 2. Enlivened set: pages touched by a MERGED page-voice commit ────────────
const enlivened = new Set();
try {
  const out = execSync(
    'git log origin/main --grep=enliven --grep=page-voice --name-only --pretty=format:',
    { encoding: 'utf8', cwd: ROOT, maxBuffer: 64 * 1024 * 1024 },
  );
  for (const raw of out.split('\n')) {
    const p = raw.trim();
    for (const g of GROUPS) {
      if (p.startsWith(`${REL(g)}/`) && p.endsWith('.json')) {
        enlivened.add(basename(p).replace(/\.json$/, ''));
      }
    }
  }
} catch { /* shallow clone — PR/branch filters still apply */ }

// ── 3. All candidate pages (classified) ──────────────────────────────────────
const rows = [];
for (const g of groups) {
  const dir = join(ROOT, REL(g));
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) {
    const slug = f.replace(/\.json$/, '');
    const c = classifyFileExport(join(dir, f));
    rows.push({ slug, group: g, budget: c.budget, sensitivity: c.sensitivity, chars: c.chars, rel: `${REL(g)}/${f}` });
  }
}

function placeholderCount(rel) {
  try {
    return (readFileSync(join(ROOT, rel), 'utf8').match(/\{chip:/g) || []).length;
  } catch {
    return 0;
  }
}

// ── 4. Claim signals ──────────────────────────────────────────────────────────
// 4a. open-PR files → slug (by PATH)
const claimedByPr = new Map();
let prFetchError = null;
if (!noPrs) {
  try {
    const prs = JSON.parse(execSync(
      'gh pr list --state open --limit 300 --json number,title,files',
      { encoding: 'utf8', cwd: ROOT, maxBuffer: 64 * 1024 * 1024 },
    ));
    for (const pr of prs) {
      for (const file of pr.files || []) {
        for (const g of GROUPS) {
          if (file.path && file.path.startsWith(`${REL(g)}/`) && file.path.endsWith('.json')) {
            const slug = basename(file.path).replace(/\.json$/, '');
            if (!claimedByPr.has(slug)) claimedByPr.set(slug, []);
            claimedByPr.get(slug).push({ number: pr.number, title: pr.title });
          }
        }
      }
    }
  } catch (e) {
    prFetchError = String(e.message || e).split('\n')[0];
  }
}

// 4b. in-flight page-voice/* branches → token match
const branchTokenSets = [];
try {
  const out = execSync("git branch -a --format='%(refname:short)'", { encoding: 'utf8', cwd: ROOT });
  const seen = new Set();
  for (const raw of out.split('\n')) {
    const name = raw.trim().replace(/^origin\//, '');
    if (name.startsWith('page-voice/') && !seen.has(name)) {
      seen.add(name);
      branchTokenSets.push({ name, t: toks(name.slice('page-voice/'.length)) });
    }
  }
} catch { /* ignore */ }
function branchClaim(slug) {
  const S = toks(slug);
  for (const { name, t } of branchTokenSets) {
    if (!t.size) continue;
    let inter = 0;
    for (const x of t) if (S.has(x)) inter++;
    if (inter >= 2 && inter / t.size >= 0.6) return name;
  }
  return null;
}

// 4c. uncommitted WIP in the CURRENT worktree
const wipSlugs = new Set();
for (const g of groups) {
  try {
    const out = execSync(`git status --porcelain -- ${REL(g)}`, { encoding: 'utf8', cwd: ROOT });
    for (const raw of out.split('\n')) {
      const p = raw.trim().split(/\s+/).pop();
      if (p && p.startsWith(`${REL(g)}/`) && p.endsWith('.json')) {
        wipSlugs.add(basename(p).replace(/\.json$/, ''));
      }
    }
  } catch { /* ignore */ }
}

// ── 5. Build candidate list ───────────────────────────────────────────────────
for (const r of rows) {
  const pr = claimedByPr.get(r.slug) || null;
  const branch = branchClaim(r.slug);
  const wip = wipSlugs.has(r.slug);
  r.claimReason = pr ? `PR #${pr[0].number}` : branch ? `branch ${branch}` : wip ? 'local WIP' : null;
  r.claimed = !!r.claimReason;
  r.placeholders = placeholderCount(r.rel);
}

// Eligibility: RICH (or LEAN with flag), STANDARD (or SENSITIVE with flag),
// not enlivened, not claimed.
function eligible(r) {
  if (enlivened.has(r.slug)) return false;
  if (r.claimed) return false;
  if (r.budget === 'SKIP') return false;
  if (r.budget === 'LEAN' && !includeLean) return false;
  if (r.sensitivity === 'SENSITIVE' && !includeSensitive) return false;
  return true;
}

const available = rows.filter(eligible);
available.sort((a, b) => (wantAlpha ? a.slug.localeCompare(b.slug) : b.slug.localeCompare(a.slug)));

const claimedCount = rows.filter((r) => r.claimed).length;
const skipCount = rows.filter((r) => r.budget === 'SKIP').length;
const sensitiveAvail = rows.filter((r) => !enlivened.has(r.slug) && !r.claimed && r.sensitivity === 'SENSITIVE' && r.budget !== 'SKIP').length;

// ── 5b. Advisory stop signals ─────────────────────────────────────────────────
const stopSignals = [];
if (available.length === 0) {
  stopSignals.push({ code: 'NO_TARGETS_REMAIN', detail: 'every eligible RICH·STANDARD page is enlivened or claimed' });
} else if (available.length <= FEW_FILES_THRESHOLD) {
  stopSignals.push({ code: 'FEW_FILES_REMAIN', detail: `${available.length} unclaimed pages <= threshold ${FEW_FILES_THRESHOLD} — the rollout is nearly done` });
}

const top = available.slice(0, count);

// ── 6. Output ─────────────────────────────────────────────────────────────────
if (wantJson) {
  console.log(JSON.stringify({
    halted: false, haltReason: null, stopSignals,
    totalPages: rows.length, enlivenedCount: enlivened.size, claimedCount, skipCount,
    availableCount: available.length, sensitiveAvail, prFetchError,
    targets: top.map((t) => ({ slug: t.slug, group: t.group, budget: t.budget, sensitivity: t.sensitivity, placeholders: t.placeholders, chars: t.chars, file: t.rel })),
  }, null, 2));
  process.exit(0);
}

console.log('\n────────────────────────────────────────────────────────────');
console.log(`page-voice dispatcher${onlyGroup ? ` (${onlyGroup} only)` : ''}`);
console.log('────────────────────────────────────────────────────────────');
if (prFetchError) {
  console.log(`⚠  could not fetch open PRs (${prFetchError}) — collision risk HIGH; re-run with network`);
} else {
  console.log(`scanned ${rows.length} pages (${groups.join(' + ')})`);
  console.log(`  already enlivened (merged):          ${enlivened.size}`);
  console.log(`  claimed (open PR / branch / WIP):    ${claimedCount}`);
  console.log(`  SKIP (aggregate / too little prose): ${skipCount}`);
  console.log(`  unclaimed & eligible (RICH·STANDARD):${available.length}`);
  if (sensitiveAvail) console.log(`  + SENSITIVE awaiting human review:   ${sensitiveAvail} (use --include-sensitive)`);
}
console.log('');

if (stopSignals.length > 0) {
  console.log('🟡 STOP SIGNALS TRIPPED');
  for (const s of stopSignals) console.log(`   • ${s.code}: ${s.detail}`);
  console.log('   → do NOT pick the next target on autopilot; halt and report to the user.');
  console.log('');
}

if (top.length === 0) {
  console.log('✓ no unclaimed RICH·STANDARD targets — rollout done or all in flight.');
  console.log('  Try --include-lean, --include-sensitive, or --no-prs to see more.');
  process.exit(0);
}

console.log(`Top ${top.length} eligible target${top.length === 1 ? '' : 's'} (${wantAlpha ? 'front-of-alphabet' : 'tail'} first):\n`);
for (let i = 0; i < top.length; i++) {
  const t = top[i];
  const ph = t.placeholders === 0 ? 'no {chip:} placeholders' : `${t.placeholders} {chip:} placeholder(s) — do not touch them`;
  console.log(`${i + 1}. ${t.slug}   [${t.group} · ${t.budget} · ${t.sensitivity}]`);
  console.log(`   file:  ${t.rel}`);
  console.log(`   prose: ${t.chars} editable chars · ${ph}`);
  console.log('');
}

const t = top[0];
const wt = `/tmp/pv-${t.slug.slice(0, 32)}`;
console.log('────────────────────────────────────────────────────────────');
console.log('Recipe (for target #1) — run /page-voice for the full guardrails:');
console.log('────────────────────────────────────────────────────────────');
console.log(`  node .claude/skills/page-voice/scripts/classify-page.mjs ${t.slug}   # confirm ${t.budget}·${t.sensitivity}`);
console.log(`  git worktree add -b page-voice/${t.slug} ${wt} origin/main   # RACE GATE: errors if already claimed`);
console.log(`  ln -s ${ROOT}/node_modules ${wt}/node_modules`);
console.log(`  # rewrite ${t.rel}: add sections[0].intro cold open + 1-2 dry-wit beats; FREEZE every`);
console.log('  #   number / chip / standard / vendor / price; bump modifiedAt; do NOT touch reviewedAt.');
console.log(`  cd ${wt} && npm run lint:chip-claims -- ${t.rel} \\`);
console.log('     && BASE=origin/main npm run lint:chip-placeholder-drift \\');
console.log('     && npm run check \\');
console.log('     && npx vitest run src/lib/__tests__/editorial-pages-*.snapshot.test.ts');
console.log(`  git -C ${wt} commit -am 'content: enliven ${t.slug} with cold open + dry wit (page-voice)'`);
console.log(`  git -C ${wt} push -u origin page-voice/${t.slug}`);
console.log(`  (cd ${wt} && gh pr create --base main --fill) && git worktree remove ${wt} --force`);
console.log('');

#!/usr/bin/env node
// chip-specs migration dispatcher.
//
// Returns the next available migration target so concurrent agents don't
// race on the same file. Cross-references:
//   1. Current `origin/main` editorial JSON for vendor-prefixed chip names
//      whose displayName byte-matches the prose form (i.e. won't drift).
//   2. `gh pr list --state open` for files currently in-flight on a PR
//      branch. Any file touched by an open PR is excluded.
//
// Read-only. The "claim" is the open PR — once an agent pushes a branch
// and opens the PR, the file falls out of the candidate set on the next
// dispatcher run. There is still a small race window between "dispatcher
// returned target" and "agent pushed branch"; coordinate runs ~minutes
// apart rather than seconds.
//
// Lines that already contain ANY `{chip:...}` placeholder are skipped —
// they hit the drift-lint blind spot (memory/feedback-drift-lint-mixed-
// placeholder-line.md).
//
// Schema-blocked chips (vendor-prefixed prose with no matching
// chip-specs.json entry, e.g. "NXP NTAG 224 DNA" vs schema's "NXP NTAG
// 224 DNA StatusDetect") are silently skipped — see MIGRATION_PUNCH_LIST.md
// for the schema-blocked list.
//
// Usage:
//   node scripts/chip-specs-next.mjs               # top 10 unclaimed, fewest-first
//   node scripts/chip-specs-next.mjs --count=5     # top 5
//   node scripts/chip-specs-next.mjs --heavy       # heaviest files first
//   node scripts/chip-specs-next.mjs --json        # JSON output for tooling
//   node scripts/chip-specs-next.mjs --no-fetch    # skip git fetch
//   node scripts/chip-specs-next.mjs --no-prs      # skip gh pr list (offline)

import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const EDITORIAL_DIR = join(ROOT, 'src/content/editorial');
const SCHEMA_PATH = join(ROOT, 'src/data/chip-specs.json');

const args = process.argv.slice(2);
const wantJson = args.includes('--json');
const wantHeavy = args.includes('--heavy');
const noFetch = args.includes('--no-fetch');
const noPrs = args.includes('--no-prs');
const countArg = args.find((a) => a.startsWith('--count='));
const count = countArg ? Math.max(1, parseInt(countArg.split('=')[1], 10) || 10) : 10;

// ── 1. Refresh main (best-effort) ───────────────────────────────────────────
if (!noFetch) {
  try {
    execSync('git fetch origin main --quiet', { cwd: ROOT, stdio: 'ignore' });
  } catch {
    // Fetch failed (offline, no remote). Continue with working-tree state.
  }
}

// ── 2. Load schema and build vendor-prefixed displayName index ──────────────
const schema = JSON.parse(readFileSync(SCHEMA_PATH, 'utf8'));
const VENDOR_PREFIXES = [
  'NXP ', 'Impinj ', 'Alien ', 'EM Microelectronic ',
  'Fujitsu ', 'Axzon ', 'Infineon ',
];

const displayNameToSlug = new Map();
for (const [slug, chip] of Object.entries(schema.chips)) {
  const name = chip.displayName;
  if (typeof name !== 'string') continue;
  if (!VENDOR_PREFIXES.some((p) => name.startsWith(p))) continue;
  displayNameToSlug.set(name, slug);
}

// Longest first so "NXP NTAG 213 DNA" wins over "NXP NTAG 213" on the
// same line. (Currently no such case exists, but cheap insurance.)
const sortedNames = [...displayNameToSlug.keys()].sort((a, b) => b.length - a.length);

// ── 3. Walk editorial JSON files vs origin/main (working tree as proxy) ─────
// Directories whose JSON files don't render and aren't migration targets.
// Mirrors what MIGRATION_PUNCH_LIST.md excluded when it was generated.
const EXCLUDE_DIRS = new Set(['_unused', '_drafts']);

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (EXCLUDE_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (entry.endsWith('.json')) out.push(full);
  }
  return out;
}

const files = walk(EDITORIAL_DIR);

/** @type {Map<string, Array<{ line: number, name: string, slug: string, preview: string }>>} */
const candidatesByFile = new Map();

for (const abs of files) {
  const rel = relative(ROOT, abs);
  const text = readFileSync(abs, 'utf8');
  const lines = text.split('\n');
  const hits = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Drift-lint blind spot: skip any line that already contains a placeholder.
    if (line.includes('{chip:')) continue;
    for (const name of sortedNames) {
      if (line.includes(name)) {
        hits.push({
          line: i + 1,
          name,
          slug: displayNameToSlug.get(name),
          preview: line.trim().slice(0, 140),
        });
        break; // one chip per line (first/longest match)
      }
    }
  }
  if (hits.length > 0) candidatesByFile.set(rel, hits);
}

// ── 4. Filter against open PRs ──────────────────────────────────────────────
const claimedFiles = new Set();
const claimedByPr = new Map(); // file -> [{ number, title }]
let prFetchError = null;
if (!noPrs) {
  try {
    const out = execSync(
      'gh pr list --state open --limit 200 --json number,title,files',
      { encoding: 'utf8', cwd: ROOT },
    );
    const prs = JSON.parse(out);
    for (const pr of prs) {
      for (const f of pr.files || []) {
        claimedFiles.add(f.path);
        if (!claimedByPr.has(f.path)) claimedByPr.set(f.path, []);
        claimedByPr.get(f.path).push({ number: pr.number, title: pr.title });
      }
    }
  } catch (e) {
    prFetchError = e.message;
  }
}

const unclaimedFiles = [...candidatesByFile.entries()].filter(
  ([file]) => !claimedFiles.has(file),
);

unclaimedFiles.sort(([fa, a], [fb, b]) => {
  if (wantHeavy) return b.length - a.length || fa.localeCompare(fb);
  return a.length - b.length || fa.localeCompare(fb);
});

const top = unclaimedFiles.slice(0, count).map(([file, hits]) => ({
  file,
  mentions: hits.length,
  firstLine: hits[0].line,
  firstName: hits[0].name,
  firstSlug: hits[0].slug,
  preview: hits[0].preview,
  branchSuggestion: suggestBranch(file, hits[0].slug),
  allHits: hits,
}));

// ── 5. Output ───────────────────────────────────────────────────────────────
function suggestBranch(file, slug) {
  const base = file
    .replace(/^src\/content\/editorial\//, '')
    .replace(/\.json$/, '')
    .split('/').pop()
    .slice(0, 30);
  const date = new Date().toISOString().slice(0, 10);
  const shortSlug = slug.replace(/^(nxp|impinj|alien|em-microelectronic|fujitsu|axzon|infineon)-/, '').slice(0, 20);
  return `chip-specs/zp-${date}-${base}-${shortSlug}`;
}

if (wantJson) {
  console.log(JSON.stringify({
    claimedFileCount: claimedFiles.size,
    unclaimedFileCount: unclaimedFiles.length,
    totalUnclaimedMentions: unclaimedFiles.reduce((n, [, h]) => n + h.length, 0),
    prFetchError,
    targets: top,
  }, null, 2));
  process.exit(0);
}

console.log('');
console.log('────────────────────────────────────────────────────────────');
console.log('chip-specs dispatcher');
console.log('────────────────────────────────────────────────────────────');
if (prFetchError) {
  console.log(`⚠  could not fetch open PRs (${prFetchError.split('\n')[0]}) — collision risk HIGH`);
} else {
  console.log(`scanned ${files.length} editorial files`);
  console.log(`  files with vendor-prefixed mentions: ${candidatesByFile.size}`);
  console.log(`  files claimed by open PRs:           ${claimedFiles.size}`);
  console.log(`  files unclaimed and available:       ${unclaimedFiles.length}`);
}
console.log('');

if (top.length === 0) {
  console.log('✓ no unclaimed targets — either migration is done, or every remaining');
  console.log('  file is already in an open PR. Try `--no-prs` to see all candidates.');
  process.exit(0);
}

console.log(`Top ${top.length} unclaimed target${top.length === 1 ? '' : 's'} (${wantHeavy ? 'heaviest' : 'lightest'} first):`);
console.log('');

for (let i = 0; i < top.length; i++) {
  const t = top[i];
  console.log(`${i + 1}. ${t.file}:${t.firstLine}`);
  console.log(`   chip:     ${t.firstName} → {chip:${t.firstSlug}:name}`);
  console.log(`   mentions: ${t.mentions} in this file`);
  console.log(`   preview:  ${t.preview}`);
  console.log('');
}

console.log('────────────────────────────────────────────────────────────');
console.log('Recipe (for target #1):');
console.log('────────────────────────────────────────────────────────────');
const t = top[0];
console.log(`  git worktree add -b ${t.branchSuggestion} /tmp/cs-${t.firstSlug} origin/main`);
console.log(`  cd /tmp/cs-${t.firstSlug}`);
console.log(`  # edit ${t.file} line ${t.firstLine}: "${t.firstName}" → "{chip:${t.firstSlug}:name}"`);
console.log(`  npm run lint:chip-placeholder-drift   # must be ✓ no drift`);
console.log(`  npm run lint:chip-claims              # must be ✓ clean`);
console.log(`  git commit -am 'data: Phase N — ${t.file.replace(/^src\/content\/editorial\//, '').replace(/\.json$/, '')} ${t.firstName} to placeholder'`);
console.log(`  git push -u origin HEAD`);
console.log(`  gh pr create --base main --fill`);
console.log('');

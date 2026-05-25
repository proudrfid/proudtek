#!/usr/bin/env node
// Lint chip-placeholder drift: verify {chip:slug:field} placeholders ADDED in
// this change resolve to text that byte-matches the prose they replaced.
//
// Catches the failure mode that caused PR batch 2 + batch 5 reverts (commits
// 9e4aa41 / 24efedc reverted on 2026-05-23):
//   - Original prose: "MIFARE Plus EV2"
//   - PR adds:        "{chip:nxp-mifare-plus-ev2:name}"
//   - Schema resolve: "NXP MIFARE Plus EV2" (displayName carries NXP prefix)
//   - Rendered HTML drifts vs. previous production output.
//
// The placeholder-render rule is documented in:
//   memory/feedback-chip-placeholder-no-drift.md
//
// How it works:
//   1. `git diff --unified=0 <base>` lists the changed editorial JSON files
//      and the added/removed lines in each hunk.
//   2. For each ADDED line containing `{chip:...}`, resolve every placeholder
//      against src/data/chip-specs.json.
//   3. Check whether the resolved string appears in the file's REMOVED lines
//      (the prose this PR is replacing). If yes → safe migration. If no →
//      drift, fail.
//
// IMPORTANT: only ADDED lines are checked — never the full file. This means
// pre-existing placeholders on unchanged lines are not re-evaluated against a
// version of `main` that may itself contain placeholders (see the 2026-05-24
// false-positive bug that this script replaces).
//
// Usage:
//   node scripts/lint-chip-placeholder-drift.mjs               # vs origin/main
//   BASE=HEAD~1 node scripts/lint-chip-placeholder-drift.mjs   # vs HEAD~1
//   BASE=main node scripts/lint-chip-placeholder-drift.mjs     # vs local main
//
// Exit code: 0 = clean, 1 = drift / unknown slug / unknown field found.
//
// Resolver scope: mirrors the simple-field cases of src/lib/chip-placeholders.ts
// (name, partNumber, frequency, epc_bits, user_bits, user_bytes, tid_bits,
// read_sensitivity_dbm, plus dotted paths like memory.tid_unique_bits).
// Compound formatters (`:memory`, `:rf`, `:crypto`, `:status`) produce
// multi-token strings whose output depends on the compound formatter logic;
// those lines are surfaced for human review but skip the byte-diff check.

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));

const SCHEMA = JSON.parse(readFileSync(join(ROOT, 'src/data/chip-specs.json'), 'utf8'));

const PLACEHOLDER_RE = /\{chip:([a-z0-9-]+):([a-z0-9_.]+)\}/gi;
const COMPOUND_FIELDS = new Set([
  'memory', 'memory_summary',
  'rf', 'rf_summary',
  'crypto', 'crypto_summary',
  'status',
]);

function resolveField(chip, field) {
  switch (field) {
    case 'name':
    case 'displayName':
      return chip.displayName;
    case 'short_name':
    case 'shortName':
      // Manufacturer-stripped short form (e.g. "NTAG 213"). Falls back to
      // displayName if the chip didn't declare one. Mirrors the resolver in
      // src/lib/chip-placeholders.ts so this lint stays in lockstep with
      // what production renders.
      return chip.shortName ?? chip.displayName;
    case 'partNumber':
    case 'part_number':
      return chip.partNumber;
    case 'frequency':
      return chip.frequency;
    case 'epc_bits':
      return chip.memory?.epc_bits != null ? String(chip.memory.epc_bits) : undefined;
    case 'user_bits':
      return chip.memory?.user_bits != null ? String(chip.memory.user_bits) : undefined;
    case 'user_bytes':
      return chip.memory?.user_bytes != null ? String(chip.memory.user_bytes) : undefined;
    case 'tid_bits':
      return chip.memory?.tid_bits != null ? String(chip.memory.tid_bits) : undefined;
    case 'read_sensitivity_dbm':
      return chip.rf?.read_sensitivity_dbm != null ? String(chip.rf.read_sensitivity_dbm) : undefined;
    default:
      if (field.includes('.')) {
        const parts = field.split('.');
        let cur = chip;
        for (const p of parts) {
          if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
          else return undefined;
        }
        return cur == null ? undefined : String(cur);
      }
      return undefined;
  }
}

/** Resolve every {chip:slug:field} in `line`. Returns { resolved, hadCompound, unknowns }. */
function resolveLine(line) {
  let hadCompound = false;
  const unknowns = [];
  const resolved = line.replace(PLACEHOLDER_RE, (full, slug, field) => {
    if (COMPOUND_FIELDS.has(field)) {
      hadCompound = true;
      return full;
    }
    const chip = SCHEMA.chips[slug];
    if (!chip) {
      unknowns.push(`unknown chip slug: ${slug}`);
      return full;
    }
    const v = resolveField(chip, field);
    if (v === undefined) {
      unknowns.push(`unknown field on ${slug}: ${field}`);
      return full;
    }
    return v;
  });
  return { resolved, hadCompound, unknowns };
}

function isEditorialJsonPath(p) {
  return p.startsWith('src/content/editorial/') && p.endsWith('.json');
}

/**
 * Parse `git diff --unified=0 <base>` output into a per-file structure:
 *   { [path]: { added: [{ lineNo, text }], removed: Set<string> } }
 *
 * Hunk headers (`@@ -L,N +A,B @@`) give the starting line numbers we use
 * for reporting. `--unified=0` strips context lines so every + / - line is a
 * real change.
 */
function parseDiff(base) {
  let diffOut;
  try {
    diffOut = execSync(`git diff --unified=0 ${base} -- src/content/editorial`, {
      encoding: 'utf8',
      cwd: ROOT,
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch {
    return {};
  }

  const files = {};
  let curPath = null;
  let newLineCursor = 0;
  for (const line of diffOut.split('\n')) {
    const fileMatch = line.match(/^\+\+\+ b\/(.+)$/);
    if (fileMatch) {
      curPath = fileMatch[1];
      if (isEditorialJsonPath(curPath) && !files[curPath]) {
        files[curPath] = { added: [], removed: new Set() };
      }
      continue;
    }
    if (line.startsWith('---') || line.startsWith('+++')) continue;
    const hunkMatch = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hunkMatch) {
      newLineCursor = Number(hunkMatch[1]);
      continue;
    }
    if (!curPath || !isEditorialJsonPath(curPath)) continue;
    if (line.startsWith('+')) {
      const text = line.slice(1);
      files[curPath].added.push({ lineNo: newLineCursor, text });
      newLineCursor++;
    } else if (line.startsWith('-')) {
      const text = line.slice(1);
      files[curPath].removed.add(text);
      // `-` lines don't advance the new-file cursor
    }
    // Note: with --unified=0 there are no context lines, so we don't need to
    // increment newLineCursor for them. If the diff is rerun with context,
    // context lines (starting with a space) would also need to advance the
    // cursor. Keep --unified=0 to avoid that complication.
  }
  return files;
}

function main() {
  const base = process.env.BASE || 'origin/main';
  const files = parseDiff(base);
  const fileCount = Object.keys(files).length;
  if (fileCount === 0) {
    console.log(`No editorial JSON changes vs ${base} — nothing to lint.`);
    return 0;
  }

  let drifts = 0;
  let compoundSkipped = 0;
  let unknownIssues = 0;

  for (const [path, { added, removed }] of Object.entries(files)) {
    for (const { lineNo, text } of added) {
      if (!text.includes('{chip:')) continue;

      const { resolved, hadCompound, unknowns } = resolveLine(text);

      if (unknowns.length) {
        for (const u of unknowns) {
          console.log(`${path}:${lineNo}: ${u}`);
          console.log(`  line: ${text.trim()}`);
        }
        unknownIssues += unknowns.length;
        continue;
      }

      if (hadCompound) {
        console.log(`${path}:${lineNo}: compound placeholder (skipping byte-diff check)`);
        console.log(`  line: ${text.trim()}`);
        compoundSkipped++;
        continue;
      }

      if (removed.has(resolved)) continue; // matched a removed line — safe migration

      console.log(`${path}:${lineNo}: drift`);
      console.log(`  placeholder:  ${text.trim()}`);
      console.log(`  resolved:     ${resolved.trim()}`);
      console.log(`  (resolved string does not match any removed line for this file in ${base})`);
      drifts++;
    }
  }

  console.log();
  console.log('─'.repeat(60));
  console.log(`scanned ${fileCount} changed editorial JSON file(s) vs ${base}`);

  if (drifts === 0 && unknownIssues === 0) {
    if (compoundSkipped) {
      console.log(`✓ no chip-placeholder drift (${compoundSkipped} compound placeholder line(s) noted, drift-check skipped)`);
    } else {
      console.log('✓ no chip-placeholder drift');
    }
    return 0;
  }

  if (unknownIssues) {
    console.log(`✗ ${unknownIssues} unknown-slug-or-field issue(s)`);
  }
  if (drifts) {
    console.log(`✗ ${drifts} drift(s) — placeholder render would diverge from prior prose`);
    console.log('  Fix: change the slug, fix the prose to match the schema displayName,');
    console.log('       or leave the line inline if no slug byte-matches.');
  }
  return 1;
}

process.exit(main());

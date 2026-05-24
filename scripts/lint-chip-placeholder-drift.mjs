#!/usr/bin/env node
// Lint chip-placeholder drift: verify {chip:slug:field} placeholders in editorial
// JSON resolve to text that byte-matches the prose they replaced.
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
//   1. Diff the working tree (or pushed branch) against a base ref (default
//      origin/main) for changed editorial JSON files.
//   2. For each new line that contains `{chip:...}`, resolve every placeholder
//      against src/data/chip-specs.json.
//   3. Check whether the resolved line appears byte-identically in the base
//      version of the file. If yes → safe migration. If no → drift, fail.
//
// Usage:
//   node scripts/lint-chip-placeholder-drift.mjs                   # vs origin/main
//   BASE=HEAD~1 node scripts/lint-chip-placeholder-drift.mjs       # vs HEAD~1
//   BASE=main node scripts/lint-chip-placeholder-drift.mjs         # vs local main
//
// Exit code: 0 = clean, 1 = drift found.
//
// Resolver scope: mirrors the simple-field cases of src/lib/chip-placeholders.ts
// (name, partNumber, frequency, epc_bits, user_bits, user_bytes, tid_bits,
// read_sensitivity_dbm, plus dotted paths like memory.tid_unique_bits). Compound
// formatters (:memory summary, :rf summary, :crypto summary) are not yet
// handled — those are rare and produce multi-token strings; flag in console
// when seen and skip the drift check for that line.

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));

const SCHEMA = JSON.parse(readFileSync(join(ROOT, 'src/data/chip-specs.json'), 'utf8'));

const PLACEHOLDER_RE = /\{chip:([a-z0-9-]+):([a-z0-9_.]+)\}/gi;
const COMPOUND_FIELDS = new Set(['memory', 'memory_summary', 'rf', 'rf_summary', 'crypto', 'crypto_summary', 'status']);

function resolveField(chip, field) {
  switch (field) {
    case 'name':
    case 'displayName':
      return chip.displayName;
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

/** Resolve every {chip:slug:field} in `line`. Returns { resolved, hadCompound, hadUnknown }. */
function resolveLine(line) {
  let hadCompound = false;
  const unknowns = [];
  const resolved = line.replace(PLACEHOLDER_RE, (full, slug, field) => {
    if (COMPOUND_FIELDS.has(field)) {
      hadCompound = true;
      return full; // can't byte-compare compound output; caller will note + skip
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

function gitShow(rev, path) {
  try {
    return execSync(`git show ${rev}:${path}`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      cwd: ROOT,
    });
  } catch {
    return null;
  }
}

function changedFiles(base) {
  // `git diff --name-only <base>` (no `..` or `...`) reports working-tree
  // diffs vs <base>, picking up both committed AND unstaged changes — exactly
  // what we want for a "lint before push" guard. The three-dot form would
  // miss uncommitted edits.
  let out;
  try {
    out = execSync(`git diff --name-only ${base}`, { encoding: 'utf8', cwd: ROOT });
  } catch {
    return [];
  }
  return out.split('\n').filter(Boolean).filter(isEditorialJsonPath);
}

function main() {
  const base = process.env.BASE || 'origin/main';
  const files = changedFiles(base);
  if (files.length === 0) {
    console.log(`No editorial JSON changes vs ${base} — nothing to lint.`);
    return 0;
  }

  let drifts = 0;
  let compoundSkipped = 0;
  let unknownIssues = 0;

  for (const path of files) {
    let newContent;
    try {
      newContent = readFileSync(join(ROOT, path), 'utf8');
    } catch {
      continue; // deleted file
    }
    const oldContent = gitShow(base, path);
    const oldLines = oldContent ? new Set(oldContent.split('\n')) : null;
    const newLines = newContent.split('\n');

    for (let i = 0; i < newLines.length; i++) {
      const line = newLines[i];
      if (!line.includes('{chip:')) continue;

      const { resolved, hadCompound, unknowns } = resolveLine(line);

      if (unknowns.length) {
        for (const u of unknowns) {
          console.log(`${path}:${i + 1}: ${u}`);
          console.log(`  line: ${line.trim()}`);
        }
        unknownIssues += unknowns.length;
        continue;
      }

      if (hadCompound) {
        // Compound formatters render multi-token strings that depend on the
        // chip-placeholders.ts surface; skip drift check, but still warn.
        console.log(`${path}:${i + 1}: compound placeholder (skipping byte-diff check)`);
        console.log(`  line: ${line.trim()}`);
        compoundSkipped++;
        continue;
      }

      if (!oldLines) {
        console.log(`${path}:${i + 1}: drift (new file, no baseline)`);
        console.log(`  placeholder:  ${line.trim()}`);
        console.log(`  resolved:     ${resolved.trim()}`);
        drifts++;
        continue;
      }

      if (oldLines.has(resolved)) continue; // byte-identical to prior prose

      console.log(`${path}:${i + 1}: drift`);
      console.log(`  placeholder:  ${line.trim()}`);
      console.log(`  resolved:     ${resolved.trim()}`);
      console.log(`  (resolved string does not match any line in ${base})`);
      drifts++;
    }
  }

  console.log();
  console.log('─'.repeat(60));
  console.log(`scanned ${files.length} changed editorial JSON file(s) vs ${base}`);

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

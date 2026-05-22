#!/usr/bin/env node
// Lint chip-spec claims in editorial JSON against known-wrong patterns from
// memory/feedback-verify-chip-claims.md. Reads rules from chip-claims-rules.mjs.
//
// Usage:
//   node scripts/lint-chip-claims.mjs            # default: src/content/editorial
//   node scripts/lint-chip-claims.mjs path/...   # one or more paths/globs (literal paths only)
//
// Exit code: 0 = clean, 1 = hits found. Wire as a pre-merge regression guard so
// the same fabrications can't re-merge after an AI rewrite.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rules } from './chip-claims-rules.mjs';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const DEFAULT_ROOT = join(ROOT, 'src/content/editorial');

function walkJson(root) {
  const out = [];
  let stack = [root];
  while (stack.length) {
    const p = stack.pop();
    let s;
    try { s = statSync(p); } catch { continue; }
    if (s.isDirectory()) {
      for (const child of readdirSync(p)) stack.push(join(p, child));
    } else if (s.isFile() && p.endsWith('.json')) {
      out.push(p);
    }
  }
  return out;
}

function checkFile(path) {
  const text = readFileSync(path, 'utf8');
  const hits = [];
  for (const rule of rules) {
    let match;
    const re = rule.pattern.global
      ? rule.pattern
      : new RegExp(rule.pattern.source, rule.pattern.flags + 'g');
    while ((match = re.exec(text)) !== null) {
      // Extract the surrounding line for the allowIf check + reporting.
      const lineStart = text.lastIndexOf('\n', match.index) + 1;
      const lineEnd = text.indexOf('\n', match.index);
      const line = text.slice(lineStart, lineEnd === -1 ? text.length : lineEnd);
      const lineNum = text.slice(0, match.index).split('\n').length;
      if (rule.allowIf && rule.allowIf.test(line)) continue;
      hits.push({
        ruleId: rule.id,
        sweep: rule.sweep,
        reason: rule.reason,
        match: match[0],
        line,
        lineNum,
      });
    }
  }
  return hits;
}

function main() {
  const argRoots = process.argv.slice(2);
  const roots = argRoots.length ? argRoots.map(r => resolve(r)) : [DEFAULT_ROOT];
  const files = roots.flatMap(r => {
    try { return statSync(r).isDirectory() ? walkJson(r) : [r]; } catch { return []; }
  });

  let totalHits = 0;
  let filesWithHits = 0;
  const hitsByRule = new Map();

  for (const file of files) {
    const hits = checkFile(file);
    if (hits.length === 0) continue;
    filesWithHits++;
    totalHits += hits.length;
    console.log(`\n${relative(ROOT, file)}`);
    for (const h of hits) {
      hitsByRule.set(h.ruleId, (hitsByRule.get(h.ruleId) || 0) + 1);
      console.log(`  L${h.lineNum} [${h.ruleId}, sweep-${h.sweep}]`);
      console.log(`    matched: ${JSON.stringify(h.match)}`);
      console.log(`    reason:  ${h.reason}`);
    }
  }

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`scanned ${files.length} files, ${rules.length} rules`);
  if (totalHits === 0) {
    console.log('✓ clean');
    return 0;
  }
  console.log(`✗ ${totalHits} hit(s) across ${filesWithHits} file(s)`);
  console.log('\nhits by rule:');
  for (const [id, n] of [...hitsByRule.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${id}: ${n}`);
  }
  return 1;
}

process.exit(main());

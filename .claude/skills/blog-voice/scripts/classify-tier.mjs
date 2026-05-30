#!/usr/bin/env node
// Classify a Proudtek blog post into Tier A (full dry wit) or Tier B
// (sensitive: medical / patient-safety / pharma-compliance — readability only,
// humor capped). The tier decides how far a blog-voice rewrite may push humor.
//
// WHY a script instead of eyeballing: mis-tagging a patient-safety post as
// Tier A is the worst failure mode of this workflow — a joke beside "retained
// surgical sponge" or "blood-bank cross-match" is tone-deaf and brand-damaging.
// A deterministic classifier removes that judgement call. It also avoids the
// substring trap a naive grep falls into: "factory-AUDIt" contains "udi", so we
// match on whole tokens (split on non-alphanumerics), never substrings.
//
// Usage (run from repo root):
//   node .claude/skills/blog-voice/scripts/classify-tier.mjs                 # scan all posts
//   node .claude/skills/blog-voice/scripts/classify-tier.mjs <slug>          # one slug
//   node .claude/skills/blog-voice/scripts/classify-tier.mjs path/to/x.json  # one path
//
// Exit code is always 0 — this is advisory. Tier B is the safe default when in
// doubt; a human may override a borderline call, but never silently downgrade a
// medical/safety post to Tier A.
//
// IMPORTABLE: `classify(nameOrPath)` is a pure function and is re-used by
// scripts/blog-voice-next.mjs (the claim dispatcher). The CLI block at the
// bottom only runs when this file is executed directly, so importing it has no
// side effects (no argv parsing, no stdout).

import { readdirSync } from "node:fs";
import { basename } from "node:path";
import { pathToFileURL } from "node:url";

const BLOG_DIR = "src/content/editorial/blog";

// Whole-token signals. Keep tight: broad words like "compliance" or "audit"
// belong to plenty of harmless supplier posts (Walmart/Target mandates, factory
// audits) and must stay Tier A.
const TIER_B_TOKENS = new Set([
  "hipaa", "patient", "surgical", "surgery", "blood", "hospital", "healthcare",
  "clinical", "medical", "pharmaceutical", "pharma", "dscsa", "fmd", "sterile",
  "sterilization", "autoclave", "fda", "aorn", "udi", "drug", "vaccine", "phi",
]);

// Multi-word signals checked as substrings of the hyphenated slug.
const TIER_B_PHRASES = ["cold-chain", "joint-commission", "21-cfr"];

function tokenize(slug) {
  return slug.toLowerCase().split(/[^a-z0-9]+/i).filter(Boolean);
}

export function classify(nameOrPath) {
  const slug = basename(String(nameOrPath)).replace(/\.json$/i, "").toLowerCase();
  const tok = tokenize(slug).find((t) => TIER_B_TOKENS.has(t));
  if (tok) return { tier: "B", reason: `token:${tok}` };
  const phrase = TIER_B_PHRASES.find((p) => slug.includes(p));
  if (phrase) return { tier: "B", reason: `phrase:${phrase}` };
  return { tier: "A", reason: "" };
}

function listBlogSlugs() {
  return readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();
}

// ── CLI (only when run directly, not when imported) ──────────────────────────
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const args = process.argv.slice(2);

  if (args.length > 0) {
    for (const a of args) {
      const { tier, reason } = classify(a);
      const slug = basename(a).replace(/\.json$/i, "");
      console.log(`TIER_${tier}\t${slug}${reason ? `\t(${reason})` : ""}`);
    }
  } else {
    let a = 0;
    let b = 0;
    let files;
    try {
      files = listBlogSlugs();
    } catch {
      console.error(`Could not read ${BLOG_DIR} — run from the repo root.`);
      process.exit(0);
    }
    for (const f of files) {
      const { tier, reason } = classify(f);
      if (tier === "B") b += 1;
      else a += 1;
      console.log(`TIER_${tier}\t${f.replace(/\.json$/, "")}${reason ? `\t(${reason})` : ""}`);
    }
    console.log(`\n${files.length} posts: ${a} Tier A, ${b} Tier B`);
  }
}

#!/usr/bin/env node
// Classify a Proudtek non-blog editorial page (solutions/ or guides/) on TWO axes
// so a page-voice rewrite knows (a) how far humor may push and (b) whether there
// is even enough editable prose to bother.
//
// WHY a script instead of eyeballing — two distinct failure modes to remove:
//   1. Tone: a joke beside "retained surgical sponge" / "blood-bank cross-match"
//      is brand-damaging. Same medical/safety detector as blog-voice (whole-token
//      match, never substring — "factory-AUDIt" must not trip on "udi").
//   2. Wasted effort: product/solution pages can be 85-90% frozen specs ({chip:}
//      placeholders, brief[] / table / timeline / comparePanel blocks). Running a
//      "cold open + dry wit" pass on a page with ~no editable prose produces a
//      forced, low-value edit. The prose-budget axis flags those as LEAN or SKIP.
//
// Axis 1 — SENSITIVITY (inherited from blog-voice):
//   SENSITIVE  → medical / patient-safety / pharma-compliance. humor ≤ 2/10,
//                never on a harm outcome. (blog-voice "Tier B".)
//   STANDARD   → everything else. Full dry-wit treatment allowed.
//
// Axis 2 — PROSE BUDGET (new — measures editable "human layer" only):
//   We sum the character length of fields a rewrite is ALLOWED to touch
//   (summary, heroPoints[], sections[].intro/paragraphs/bullets, sections[].callout.text,
//   faq[].answer) and EXCLUDE any string containing "{chip:" (frozen, do-not-touch)
//   and all frozen structures (brief, table, comparePanel, statBar/dataHighlight,
//   timeline, testimonial, featureGrid). Then:
//   RICH  → plenty of editable prose; full cold-open + wit is worth it.
//   LEAN  → thin prose; do a light-touch summary/heroPoints lift only, skip forced
//           section cold-opens.
//   SKIP  → aggregate/fixture page (_pillar.json, all.json) or near-zero editable
//           prose; do not auto-rewrite.
//
// Usage (from repo root):
//   node .claude/skills/page-voice/scripts/classify-page.mjs                       # scan solutions + guides
//   node .claude/skills/page-voice/scripts/classify-page.mjs <slug-or-path>        # one page
//   node .claude/skills/page-voice/scripts/classify-page.mjs --group solutions     # one group
//   node .claude/skills/page-voice/scripts/classify-page.mjs --json               # machine-readable
//
// Exit code is always 0 — advisory. SENSITIVE is the safe default when a medical
// signal is present; a human may override a borderline call but never silently
// downgrade a patient-safety page.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const GROUPS = ["solutions", "guides"];
const DIR = (g) => `src/content/editorial/${g}`;

// ── Axis 1: medical/safety tokens (kept identical to blog-voice classify-tier) ──
const SENSITIVE_TOKENS = new Set([
  "hipaa", "patient", "surgical", "surgery", "blood", "hospital", "healthcare",
  "clinical", "medical", "pharmaceutical", "pharma", "dscsa", "fmd", "sterile",
  "sterilization", "autoclave", "fda", "aorn", "udi", "drug", "vaccine", "phi",
]);
const SENSITIVE_PHRASES = ["cold-chain", "joint-commission", "21-cfr"];

// ── Axis 2: prose-budget thresholds (chars of editable, chip-free prose) ──
const RICH_MIN = 1200; // ≥ this → RICH (cold-open + wit worthwhile)
const LEAN_MIN = 250;  // ≥ this but < RICH_MIN → LEAN (light summary/hero lift)
//                        < LEAN_MIN → SKIP

// Pages we never auto-rewrite regardless of prose budget.
const SKIP_BASENAMES = new Set(["_pillar", "all", "index"]);

function tokenize(slug) {
  return slug.toLowerCase().split(/[^a-z0-9]+/i).filter(Boolean);
}

function sensitivity(slugOrTitle) {
  const slug = String(slugOrTitle).toLowerCase();
  const tok = tokenize(slug).find((t) => SENSITIVE_TOKENS.has(t));
  if (tok) return { level: "SENSITIVE", reason: `token:${tok}` };
  const phrase = SENSITIVE_PHRASES.find((p) => slug.includes(p));
  if (phrase) return { level: "SENSITIVE", reason: `phrase:${phrase}` };
  return { level: "STANDARD", reason: "" };
}

// Count characters of editable prose only. Strings containing a {chip:} placeholder
// are frozen (do-not-touch) and contribute 0 to the budget — they are spec lines.
function editableChars(str) {
  if (typeof str !== "string") return 0;
  if (str.includes("{chip:")) return 0;
  return str.length;
}

function proseBudget(doc) {
  let n = 0;
  n += editableChars(doc.summary);
  for (const hp of doc.heroPoints || []) n += editableChars(hp);
  for (const s of doc.sections || []) {
    // Only the prose sub-fields of a section. Frozen structures (table,
    // comparePanel, statBar, dataHighlight, timeline, testimonial, featureGrid,
    // brief) are intentionally NOT counted and must not be edited.
    n += editableChars(s.intro);
    for (const p of s.paragraphs || []) n += editableChars(p);
    for (const b of s.bullets || []) n += editableChars(b);
    if (s.callout && typeof s.callout.text === "string") n += editableChars(s.callout.text);
  }
  for (const f of doc.faq || []) n += editableChars(f && f.answer);
  return n;
}

// A page can clear the RICH char threshold on a thin band of prose while being
// otherwise wall-to-wall {chip:} spec lines (the chip-encyclopedia guides:
// ~4k editable chars but 180-230 placeholders). Forcing a cold-open + wit onto
// those produces a token edit surrounded by frozen spec. So if placeholders
// heavily outnumber the editable prose, cap at LEAN (summary/hero lift only).
const DENSE_PLACEHOLDER_MIN = 40;          // only kicks in on genuinely dense pages
const CHARS_PER_PLACEHOLDER_RICH = 250;    // need this many editable chars PER placeholder to stay RICH

function budgetTier(slug, chars, placeholders) {
  if (SKIP_BASENAMES.has(slug)) return { tier: "SKIP", reason: "aggregate/fixture page" };
  const dense = placeholders >= DENSE_PLACEHOLDER_MIN && chars < placeholders * CHARS_PER_PLACEHOLDER_RICH;
  if (chars >= RICH_MIN && dense) {
    return { tier: "LEAN", reason: `${chars} chars but ${placeholders} {chip:} placeholders — spec-dense, light lift only` };
  }
  if (chars >= RICH_MIN) return { tier: "RICH", reason: `${chars} editable chars` };
  if (chars >= LEAN_MIN) return { tier: "LEAN", reason: `${chars} editable chars` };
  return { tier: "SKIP", reason: `only ${chars} editable chars` };
}

export function classifyFile(path) {
  const slug = basename(path).replace(/\.json$/i, "");
  let raw = null;
  let doc = null;
  try {
    raw = readFileSync(path, "utf8");
    doc = JSON.parse(raw);
  } catch {
    return { slug, sensitivity: "?", budget: "SKIP", chars: 0, placeholders: 0, reason: "unparseable JSON", group: "?" };
  }
  const sens = sensitivity(`${slug} ${doc.title || ""}`);
  const chars = proseBudget(doc);
  const placeholders = (raw.match(/\{chip:/g) || []).length;
  const bud = budgetTier(slug, chars, placeholders);
  return {
    slug,
    group: doc.group || "?",
    sensitivity: sens.level,
    sensReason: sens.reason,
    budget: bud.tier,
    chars,
    placeholders,
    budgetReason: bud.reason,
  };
}

function resolveTargets(args) {
  const groupFlag = args.indexOf("--group");
  if (groupFlag !== -1 && args[groupFlag + 1]) {
    const g = args[groupFlag + 1];
    return listGroup(g);
  }
  const positional = args.filter((a) => !a.startsWith("--") && a !== args[groupFlag + 1]);
  if (positional.length > 0) {
    return positional.map((a) => {
      if (a.includes("/") || a.endsWith(".json")) return a;
      // bare slug — search both groups
      for (const g of GROUPS) {
        const p = join(DIR(g), `${a}.json`);
        if (existsSync(p)) return p;
      }
      return join(DIR("solutions"), `${a}.json`); // best-effort
    });
  }
  return GROUPS.flatMap(listGroup);
}

function listGroup(g) {
  const dir = DIR(g);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => join(dir, f));
}

// Alias the dispatcher imports by name (scripts/page-voice-next.mjs).
export { classifyFile as classifyFileExport };

// CLI block — only run when executed directly, NOT when imported. (ESM evaluates
// a module's top level on import; without this guard, importing classifyFile
// would also print the full scan to stdout.)
const invokedDirectly = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  const args = process.argv.slice(2);
  const asJson = args.includes("--json");
  const targets = resolveTargets(args);
  const rows = targets.map(classifyFile);

  if (asJson) {
    console.log(JSON.stringify(rows, null, 2));
  } else {
    for (const r of rows) {
      const tags = [
        `${r.sensitivity}${r.sensReason ? `(${r.sensReason})` : ""}`,
        `${r.budget}`,
      ].join(" · ");
      console.log(`${r.budget.padEnd(4)} ${r.sensitivity === "SENSITIVE" ? "⚠ " : "  "}${r.slug.padEnd(52)} ${tags}  [${r.chars}c]`);
    }
    const c = (pred) => rows.filter(pred).length;
    console.log(
      `\n${rows.length} pages — budget: ${c((r) => r.budget === "RICH")} RICH, ${c((r) => r.budget === "LEAN")} LEAN, ${c((r) => r.budget === "SKIP")} SKIP` +
        `  |  sensitivity: ${c((r) => r.sensitivity === "STANDARD")} STANDARD, ${c((r) => r.sensitivity === "SENSITIVE")} SENSITIVE`
    );
  }
}

#!/usr/bin/env node
/**
 * content-quality-audit.mjs — per-page GEO / SEO / readability scorer
 * for editorial JSON pages (src/content/editorial).
 *
 * Measures, per page:
 *   SEO   — meta-description shape (summary first 155 chars), keyword
 *           presence, source count, freshness (modifiedAt age), image alts.
 *   GEO   — answer-first quality (first sentence of summary: direct +
 *           carries a hard number), numeric density of extractable
 *           sentences, decision-snapshot (brief) presence, FAQ depth,
 *           question-form H2 ratio (per GEO_IMPROVEMENT_PLAN P1-2..P1-5).
 *   READ  — words/paragraph, wall-of-text sections (3+ consecutive long
 *           paragraphs with no structured block), sentence length,
 *           structure density, hero summary length.
 *
 * Usage:
 *   node scripts/content-quality-audit.mjs                # commercial groups
 *   node scripts/content-quality-audit.mjs --groups blog  # any group list
 *   node scripts/content-quality-audit.mjs --json         # machine-readable
 *   node scripts/content-quality-audit.mjs --worst 20     # top offenders
 *
 * Exit code is always 0 — this is a report, not a gate.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const EDITORIAL = join(ROOT, "src/content/editorial");

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const opt = (name, dflt) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : dflt;
};

const GROUPS = opt("--groups", "products,solutions,guides,compare").split(",");
const WORST = Number(opt("--worst", "25"));
const TODAY = new Date(opt("--today", new Date().toISOString().slice(0, 10)));

/* ── helpers ──────────────────────────────────────────────────── */

// {chip:slug:field} placeholders resolve to short names at render time —
// count each as one word so metrics match rendered output.
const normalize = (s) => (s || "").replace(/\{chip:[^}]+\}/g, "CHIP").trim();

const words = (s) => normalize(s).split(/\s+/).filter(Boolean).length;

// Sentence split that survives "ISO/IEC 14443-3", "e.g.", decimals, "No. 5".
const sentences = (s) =>
  normalize(s)
    .replace(/\b(e\.g|i\.e|vs|etc|approx|No|Inc|Ltd|Co)\./gi, "$1<DOT>")
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'(])/)
    .map((x) => x.replace(/<DOT>/g, "."))
    .filter((x) => x.trim().length > 0);

const hasDigit = (s) => /\d/.test(normalize(s).replace(/CHIP/g, ""));

// A paragraph long enough to read as a "wall" in a 70ch measure.
const LONG_PARA = 85; // words ≈ 8-9 rendered lines

const isQuestion = (t) =>
  /\?\s*$/.test(t) || /^(what|when|which|why|how|who|do|does|can|should|is|are)\b/i.test(t);

/* ── per-page scoring ─────────────────────────────────────────── */

function auditPage(file, d) {
  const issues = [];
  const warn = (code, msg, sev = 1) => issues.push({ code, msg, sev });

  /* SEO — meta description = truncateText(summary, 155) (page-data.ts) */
  const summary = normalize(d.summary || "");
  const first155 = summary.slice(0, 155);
  if (!summary) warn("SEO_NO_SUMMARY", "summary missing (meta description falls back to boilerplate)", 3);
  const sumSentences = sentences(summary);
  const firstSentence = sumSentences[0] || "";

  // Mirrors truncateText (seo/utils.ts): sentence boundary ≥55% of budget,
  // else clause boundary ≥60%. Pages failing BOTH still render a mid-word
  // meta description and need a summary rewrite.
  if (summary.length > 155) {
    const budget = 152;
    const slice = summary.slice(0, budget);
    const sentenceEnd = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf("! "), slice.lastIndexOf("? "));
    const clauseEnd = Math.max(slice.lastIndexOf("; "), slice.lastIndexOf(" — "), slice.lastIndexOf(": "), slice.lastIndexOf(", "));
    if (sentenceEnd <= budget * 0.55 && clauseEnd <= budget * 0.6)
      warn("SEO_DESC_NO_BREAKPOINT", `no sentence/clause boundary in the 155-char meta-description window — SERP snippet cuts mid-word: "${first155.slice(100)}…"`, 2);
    else if (sentenceEnd <= budget * 0.55)
      warn("SEO_DESC_CLAUSE_CUT", "meta description ends on a clause (ellipsis), not a complete sentence — front-load a short first sentence", 1);
  }

  if (!d.keywords?.length) warn("SEO_NO_KEYWORDS", "keywords[] empty", 1);
  if (!(d.sources?.length >= 3)) warn("SEO_FEW_SOURCES", `only ${d.sources?.length ?? 0} sources (citation discipline target ≥3)`, 2);

  // Freshness — the "3-month citation cliff" (GEO plan §5).
  const mod = d.modifiedAt || d.publishedAt;
  let staleDays = null;
  if (mod) {
    staleDays = Math.round((TODAY - new Date(mod)) / 86400000);
    if (staleDays > 90) warn("SEO_STALE", `modifiedAt ${mod} is ${staleDays}d old (>90d citation cliff)`, staleDays > 180 ? 3 : 2);
  } else warn("SEO_NO_DATES", "no publishedAt/modifiedAt", 2);

  if (!d.imageAlt) warn("SEO_NO_HERO_ALT", "imageAlt missing", 2);
  const sectionsArr = d.sections || [];
  for (const s of sectionsArr)
    if (s.image && !s.image.alt) warn("SEO_IMG_NO_ALT", `section "${s.title}" image missing alt`, 2);

  /* GEO — answer-first (P1-2): first sentence should answer directly and
     carry a hard number. */
  const fsWords = words(firstSentence);
  if (fsWords > 40)
    warn("GEO_ANSWER_LONG_OPEN", `Quick-answer first sentence is ${fsWords} words — not liftable as a direct answer`, 2);
  if (!hasDigit(firstSentence) && !hasDigit(sumSentences[1] || ""))
    warn("GEO_ANSWER_NO_NUMBER", "no hard number in first two sentences of Quick answer (P1-2)", 2);

  // Numeric density (P1-3): share of extractable units carrying a digit.
  const paras = sectionsArr.flatMap((s) => s.paragraphs || []);
  const bullets = sectionsArr.flatMap((s) => s.bullets || []);
  const units = [...paras, ...bullets];
  const numericShare = units.length ? units.filter(hasDigit).length / units.length : 0;
  if (units.length >= 4 && numericShare < 0.35)
    warn("GEO_LOW_STAT_DENSITY", `${Math.round(numericShare * 100)}% of paragraphs/bullets carry a number (P1-3 target ≥50%)`, 2);

  // Key-takeaways block (P1-5): brief fields feed the At-a-glance snapshot.
  const briefN = d.brief?.length ?? 0;
  if (d.group !== "compare" && briefN < 2)
    warn("GEO_NO_SNAPSHOT", `brief has ${briefN} fields — At-a-glance snapshot renders thin/empty (P1-5)`, 3);

  const faqN = d.faq?.length ?? 0;
  if (faqN < 3) warn("GEO_FEW_FAQ", `only ${faqN} FAQ entries (FAQPage schema weak)`, 2);
  // FAQ answers should open with the answer, not throat-clearing.
  for (const f of d.faq || []) {
    const a = sentences(f.answer || "");
    if (a.length && words(a[0]) > 45)
      warn("GEO_FAQ_SLOW_OPEN", `FAQ "${(f.question || "").slice(0, 60)}" opens with a ${words(a[0])}-word sentence`, 1);
  }

  const qShare = sectionsArr.length
    ? sectionsArr.filter((s) => isQuestion(s.title || "")).length / sectionsArr.length
    : 0;

  /* READ — walls of text, sentence length, structure density */
  let walls = 0;
  const wallSections = [];
  for (const s of sectionsArr) {
    const p = s.paragraphs || [];
    const hasStructure = !!(s.bullets?.length || s.table || s.checklist?.length ||
      s.featureGrid || s.comparePanel || s.timeline || s.statBar || s.dataHighlight || s.image);
    const longRun = p.filter((x) => words(x) > LONG_PARA).length;
    if (p.length >= 3 && longRun >= 2 && !hasStructure) {
      walls += 1;
      wallSections.push(s.title);
    }
  }
  if (walls) warn("READ_WALL_OF_TEXT", `${walls} section(s) are 3+ paragraphs of long prose with no list/table/figure: ${wallSections.map((t) => `"${t}"`).join(", ")}`, walls > 1 ? 3 : 2);

  const paraLens = paras.map(words);
  const avgPara = paraLens.length ? Math.round(paraLens.reduce((a, b) => a + b, 0) / paraLens.length) : 0;
  const megaParas = paraLens.filter((x) => x > 120).length;
  if (megaParas) warn("READ_MEGA_PARA", `${megaParas} paragraph(s) >120 words`, megaParas > 2 ? 3 : 2);

  const allSent = units.flatMap(sentences);
  const sentLens = allSent.map(words);
  const avgSent = sentLens.length ? Math.round(sentLens.reduce((a, b) => a + b, 0) / sentLens.length) : 0;
  if (avgSent > 28) warn("READ_LONG_SENTENCES", `average sentence length ${avgSent} words (>28)`, 2);

  const sumWords = words(summary);
  if (sumWords > 90) warn("READ_SUMMARY_BLOB", `hero Quick answer is ${sumWords} words — renders as a dense blob`, 2);

  const heroPts = d.heroPoints?.length ?? 0;
  if (heroPts === 0) warn("READ_NO_HERO_POINTS", "heroPoints empty", 1);

  // Structured-block share across sections (tables/lists aid scanning).
  const structured = sectionsArr.filter((s) =>
    s.bullets?.length || s.table || s.checklist?.length || s.featureGrid ||
    s.comparePanel || s.timeline || s.statBar || s.dataHighlight).length;
  const structShare = sectionsArr.length ? structured / sectionsArr.length : 0;
  if (sectionsArr.length >= 5 && structShare < 0.4)
    warn("READ_LOW_STRUCTURE", `${Math.round(structShare * 100)}% of sections have any structured block (target ≥50%)`, 2);

  const sev = issues.reduce((a, b) => a + b.sev, 0);
  return {
    file: relative(ROOT, file),
    route: d.route,
    group: d.group,
    title: d.title,
    metrics: {
      words: units.reduce((a, u) => a + words(u), 0) + sumWords,
      sections: sectionsArr.length,
      paragraphs: paras.length,
      avgParaWords: avgPara,
      avgSentenceWords: avgSent,
      numericShare: Math.round(numericShare * 100),
      structuredSectionShare: Math.round(structShare * 100),
      questionH2Share: Math.round(qShare * 100),
      faq: faqN,
      brief: briefN,
      sources: d.sources?.length ?? 0,
      summaryWords: sumWords,
      staleDays,
    },
    issues,
    severity: sev,
    grade: sev === 0 ? "A" : sev <= 2 ? "B" : sev <= 5 ? "C" : sev <= 9 ? "D" : "F",
  };
}

/* ── walk + report ────────────────────────────────────────────── */

const pages = [];
for (const group of GROUPS) {
  const dir = join(EDITORIAL, group.trim());
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    let entries;
    try { entries = readdirSync(cur); } catch { continue; }
    for (const e of entries) {
      const p = join(cur, e);
      if (statSync(p).isDirectory()) { stack.push(p); continue; }
      if (!e.endsWith(".json")) continue;
      try {
        const d = JSON.parse(readFileSync(p, "utf8"));
        if (!d.route || !d.title) continue;
        pages.push(auditPage(p, d));
      } catch (err) {
        console.error(`PARSE FAIL ${p}: ${err.message}`);
      }
    }
  }
}

pages.sort((a, b) => b.severity - a.severity);

if (flag("--json")) {
  console.log(JSON.stringify({ generatedAt: new Date().toISOString(), groups: GROUPS, pages }, null, 2));
  process.exit(0);
}

const byGrade = {};
for (const p of pages) byGrade[p.grade] = (byGrade[p.grade] || 0) + 1;
const issueCounts = {};
for (const p of pages) for (const i of p.issues) issueCounts[i.code] = (issueCounts[i.code] || 0) + 1;

console.log(`content-quality-audit — ${pages.length} pages in [${GROUPS.join(", ")}]\n`);
console.log("Grades:", ["A", "B", "C", "D", "F"].map((g) => `${g}:${byGrade[g] || 0}`).join("  "));
console.log("\nIssue frequency (pages affected):");
for (const [code, n] of Object.entries(issueCounts).sort((a, b) => b[1] - a[1]))
  console.log(`  ${String(n).padStart(4)}  ${code}`);

console.log(`\nWorst ${Math.min(WORST, pages.length)} pages:`);
for (const p of pages.slice(0, WORST)) {
  console.log(`\n[${p.grade}/${p.severity}] ${p.route}  (${p.group})`);
  for (const i of p.issues) console.log(`    - ${i.code}: ${i.msg}`);
}

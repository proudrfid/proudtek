#!/usr/bin/env node
/**
 * GEO extractability audit — measures how quotable the site is by generative
 * answer engines. Report-only (never fails CI): the point is a punch list.
 *
 * Dimensions (from the 2026-08-25 competitor analysis of NFCFYI / GAORFID /
 * SmartCard Focus citation patterns):
 *   1. faqSchema      — pages emitting FAQPage JSON-LD
 *   2. descAnswer     — meta description opens with an answer-shaped sentence
 *   3. commerceSignal — meta description carries factory/MOQ/lead-time signal
 *   4. verdictSection — compare pages with a Verdict/Recommendation section
 *   5. definitionFirst— editorial summary first sentence ≤ 40 words, no filler
 *
 * Usage: node scripts/geo-extractability-audit.mjs [--dist dist] [--json]
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EDITORIAL_DIR = path.join(ROOT, "src", "content", "editorial");

const args = process.argv.slice(2);
function argValue(flag, fallback) {
  const i = args.indexOf(flag);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
}
const DIST = path.resolve(ROOT, argValue("--dist", "dist"));
const AS_JSON = args.includes("--json");

const ANSWER_VERB =
  /^(choose|pick|use|go with|avoid|skip|test|specify|order|select|compare|match|pair|plan|budget|expect|treat|mount|print|encode|for [a-z])/i;
const FILLER_OPEN = /^(in this|this article|this page|this guide|introduction|welcome|as a leading)/i;

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true }).catch(() => [])) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

async function auditDist() {
  const files = (await walk(DIST)).filter((f) => f.endsWith("index.html"));
  let total = 0;
  const missingFaq = [];
  const weakDesc = [];
  let commerce = 0;
  for (const f of files) {
    const html = await fs.readFile(f, "utf8").catch(() => "");
    if (!html || html.includes('http-equiv="refresh"')) continue;
    const rel = "/" + path.relative(DIST, f).replace(/index\.html$/, "").replace(/\\/g, "/");
    total += 1;
    if (!html.includes('"FAQPage"')) missingFaq.push(rel);
    const desc = html.match(/name="description" content="([^"]*)"/)?.[1] ?? "";
    const firstSentence = desc.split(/(?<=[.!?])\s/)[0] ?? "";
    const answerShaped = ANSWER_VERB.test(desc.trim()) || /\d/.test(firstSentence);
    if (!desc || !answerShaped) weakDesc.push({ route: rel, reason: desc ? "not-answer-shaped" : "missing", sample: desc.slice(0, 90) });
    if (/factory|MOQ|minimum order|lead time/i.test(desc)) commerce += 1;
  }
  return { total, missingFaq, weakDesc, commerce };
}

function firstSentenceOf(text) {
  return (text.split(/(?<=[.!?])\s/)[0] ?? "").trim();
}

async function auditEditorialSources() {
  const verdictMissing = [];
  const definitionWeak = [];
  let compareTotal = 0;
  let summaryTotal = 0;
  const groups = await fs.readdir(EDITORIAL_DIR, { withFileTypes: true });
  for (const g of groups) {
    if (!g.isDirectory() || g.name.startsWith("_")) continue;
    const dir = path.join(EDITORIAL_DIR, g.name);
    for (const f of await walk(dir)) {
      if (!f.endsWith(".json") || path.basename(f).startsWith("_")) continue;
      let j;
      try {
        j = JSON.parse(await fs.readFile(f, "utf8"));
      } catch {
        continue;
      }
      const rel = path.relative(EDITORIAL_DIR, f);
      if (g.name === "compare") {
        compareTotal += 1;
        const blob = JSON.stringify(j).toLowerCase();
        if (!blob.includes("verdict") && !blob.includes("recommendation") && !blob.includes("which should")) {
          verdictMissing.push(rel);
        }
      }
      const summary = typeof j.summary === "string" ? j.summary : "";
      if (!summary) continue;
      summaryTotal += 1;
      const s1 = firstSentenceOf(summary);
      const words = s1.split(/\s+/).length;
      if (FILLER_OPEN.test(s1) || words > 40) definitionWeak.push({ file: rel, words, sample: s1.slice(0, 90) });
    }
  }
  return { compareTotal, verdictMissing, definitionWeak, summaryTotal };
}

const dist = await auditDist();
const src = await auditEditorialSources();

const report = {
  generatedAt: new Date().toISOString(),
  dist: {
    totalPages: dist.total,
    faqPageCoverage: `${dist.total - dist.missingFaq.length}/${dist.total}`,
    metaDescriptionAnswerShaped: `${dist.total - dist.weakDesc.length}/${dist.total}`,
    metaDescriptionCommerceSignal: `${dist.commerce}/${dist.total}`,
  },
  source: {
    compareVerdictCoverage: `${src.compareTotal - src.verdictMissing.length}/${src.compareTotal}`,
    definitionFirstSummaries: `${src.summaryTotal - src.definitionWeak.length}/${src.summaryTotal}`,
  },
  punchLists: {
    missingFaqPages: dist.missingFaq,
    weakMetaDescriptions: dist.weakDesc,
    comparePagesWithoutVerdict: src.verdictMissing,
    summariesNotDefinitionFirst: src.definitionWeak,
  },
};

if (AS_JSON) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log("[geo-extractability]");
  for (const [k, v] of Object.entries(report.dist)) console.log(`  ${k}: ${v}`);
  for (const [k, v] of Object.entries(report.source)) console.log(`  ${k}: ${v}`);
  console.log(`  punch lists: ${Object.entries(report.punchLists).map(([k, v]) => `${k}=${v.length}`).join(", ")}`);
}

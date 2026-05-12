#!/usr/bin/env node
/**
 * Stage 3 debug — apply the diff tool's normalize rules to a single route
 * pair and print the unified diff of the NORMALIZED outputs (not raw).
 *
 * Use this when `npm run stage3:diff` reports REAL DIFF for a route and you
 * need to see exactly what survived normalization. The output tells you
 * either:
 *   - a serialization dialect the existing normalize rules don't cover
 *     (add a rule)
 *   - a real semantic difference between the legacy TS path and the shadow
 *     .astro path (treat as a BUG-N — log in editorial-rendering-debt.md,
 *     fix the component, re-run)
 *
 * Usage:
 *   node scripts/stage3-debug-single.mjs <route>
 *
 *   node scripts/stage3-debug-single.mjs /lp/uhf-rfid-tag-manufacturer/
 *
 * Prerequisites: run `npm run stage3:diff -- <prefix>` first so that
 * dist-baseline/ and dist-experimental/ exist. This script just compares
 * them without re-building.
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// --- duplicated from stage3-diff.mjs (keep in lockstep) -------------------

function stripAstroDebugAttrs(html) {
  return html
    .replace(/\s+data-astro-source-file="[^"]*"/g, "")
    .replace(/\s+data-astro-source-loc="[^"]*"/g, "")
    .replace(/\s+data-astro-cid-[a-z0-9]+(?:="[^"]*")?/g, "");
}
function collapseWhitespace(html) {
  return html
    .replace(/>\s+</g, "><")
    .replace(/^\s+|\s+$/g, "")
    .replace(/[\n\r\t]+/g, " ")
    .replace(/[ \t]{2,}/g, " ");
}
function canonicalizeEntities(html) {
  return html
    .replace(/&#34;/g, "&quot;")
    .replace(/&#38;/g, "&amp;")
    .replace(/&#60;/g, "&lt;")
    .replace(/&#62;/g, "&gt;")
    .replace(/&#39;/g, "'");
}
function escapeAttributeAngleBrackets(html) {
  return html.replace(/="([^"]*)"/g, (match, value) => {
    if (value.indexOf("<") === -1 && value.indexOf(">") === -1) return match;
    return `="${value.replace(/</g, "&lt;").replace(/>/g, "&gt;")}"`;
  });
}
function stripPreCloseTagWhitespace(html) {
  return html.replace(/[ \t]+>/g, ">");
}
function stripVoidSelfClose(html) {
  return html.replace(/(<(?:img|br|hr|input|meta|link|source|area|col|base|embed|wbr|track)\b[^>]*?)\s*\/>/gi, "$1>");
}
function canonicalizeSvgEmptyElements(html) {
  return html.replace(/<(path|rect|circle|line|polyline|polygon|ellipse|use|stop)([^<>]*)><\/\1>/gi, "<$1$2/>");
}
function canonicalizeBuildTimestamps(html) {
  // Match any ISO 8601 timestamp with millisecond precision — that's the
  // build-time signature of `new Date().toISOString()`. Catches `<time
  // datetime="...">`, `article:published_time` / `article:modified_time`
  // meta tags, and JSON-LD `datePublished` / `dateModified` /
  // `lastReviewed` fields. Pinned fixture timestamps without fractional
  // seconds pass through unchanged.
  return html.replace(
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z/g,
    "<BUILD_TIMESTAMP>",
  );
}
function canonicalizeBooleanAttributes(html) {
  // HTML5 boolean / bare-attr serialization: `attr` (Astro shorthand) ↔
  // `attr=""` (cheerio's explicit-empty form used by the TS render path).
  // Both parse to the same DOM. Strip `=""` to canonicalize on shorthand.
  return html.replace(/ ([a-zA-Z][a-zA-Z0-9-]*)=""/g, " $1");
}
function normalizeHtml(html) {
  return canonicalizeBooleanAttributes(
    canonicalizeBuildTimestamps(
      escapeAttributeAngleBrackets(
        stripPreCloseTagWhitespace(
          canonicalizeSvgEmptyElements(
            stripVoidSelfClose(
              canonicalizeEntities(
                collapseWhitespace(
                  stripAstroDebugAttrs(html),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  );
}

// --- main ------------------------------------------------------------------

const NORMALIZE_RULES = [
  "stripAstroDebugAttrs",
  "collapseWhitespace",
  "canonicalizeEntities",
  "stripVoidSelfClose",
  "canonicalizeSvgEmptyElements",
  "stripPreCloseTagWhitespace",
  "escapeAttributeAngleBrackets",
  "canonicalizeBuildTimestamps",
  "canonicalizeBooleanAttributes",  // added 2026-05-12 — strip ` attr=""` to ` attr`
];

const route = process.argv[2];
if (!route || !route.startsWith("/")) {
  console.error("usage: node scripts/stage3-debug-single.mjs <route>");
  console.error("       e.g. /lp/uhf-rfid-tag-manufacturer/");
  process.exit(2);
}

console.log(`[debug] normalize rules in this build: ${NORMALIZE_RULES.length}`);
console.log(`[debug]   ${NORMALIZE_RULES.join(", ")}`);
console.log("");

const baselineFile = `dist-baseline${route}index.html`;
const experimentalFile = `dist-experimental${route}index.html`;

let baselineRaw, experimentalRaw;
try {
  baselineRaw = readFileSync(baselineFile, "utf8");
} catch (e) {
  console.error(`Cannot read ${baselineFile}: ${e.message}`);
  process.exit(2);
}
try {
  experimentalRaw = readFileSync(experimentalFile, "utf8");
} catch (e) {
  console.error(`Cannot read ${experimentalFile}: ${e.message}`);
  process.exit(2);
}

const baselineNorm = normalizeHtml(baselineRaw);
const experimentalNorm = normalizeHtml(experimentalRaw);

console.log(`Raw bytes:        baseline=${baselineRaw.length}  experimental=${experimentalRaw.length}  delta=${Math.abs(baselineRaw.length - experimentalRaw.length)}`);
console.log(`Normalized bytes: baseline=${baselineNorm.length}  experimental=${experimentalNorm.length}  delta=${Math.abs(baselineNorm.length - experimentalNorm.length)}`);
console.log("");

if (baselineNorm === experimentalNorm) {
  console.log("✓ normalized-equal — the 7 rules absorbed all differences");
  process.exit(0);
}

// Write normalized versions to temp files so we can `diff -u` them.
// Insert a newline before every `<` so the diff is line-oriented instead
// of one massive single-line diff that's unreadable.
const tmpDir = mkdtempSync(join(tmpdir(), "stage3-debug-"));
const baselineTmp = join(tmpDir, "baseline.html");
const experimentalTmp = join(tmpDir, "experimental.html");
writeFileSync(baselineTmp, baselineNorm.replace(/></g, ">\n<"));
writeFileSync(experimentalTmp, experimentalNorm.replace(/></g, ">\n<"));

console.log(`✗ REAL DIFF — normalized outputs differ. Unified diff (60 lines):`);
console.log("─".repeat(64));
try {
  execSync(`diff -u "${baselineTmp}" "${experimentalTmp}" | head -60`, { stdio: "inherit" });
} catch (e) {
  // diff returns exit 1 on differences; that's expected.
}
console.log(`─`.repeat(64));
console.log(`Full normalized files saved at:`);
console.log(`  ${baselineTmp}`);
console.log(`  ${experimentalTmp}`);
console.log(`Run \`diff -u\` directly on those for the full picture.`);

process.exit(1);

#!/usr/bin/env node
/**
 * Stage 3 cutover diff tool.
 *
 * Runs `astro build` TWICE — once with the editorial-component env flag off
 * (baseline = production rendering via the legacy `renderEditorialMain` →
 * `<Fragment set:html>` path) and once with the flag on (experimental =
 * the shadow `.astro` component tree). For every editorial route in scope,
 * compares the two dist HTML files and classifies the diff:
 *
 *   ✓ identical              — byte-perfect match (rare; means the new path
 *                              didn't produce any of the expected normalize
 *                              dialects either)
 *   ✓ normalized-equal       — byte-different but functionally equivalent
 *                              after the 7-rule normalize from
 *                              src/components/editorial/__tests__/_parity-helpers.ts
 *   ✗ REAL DIFF              — normalize-equivalent FAILED; the shadow tree
 *                              drifted from the TS rendering in a way the
 *                              parity tests didn't catch
 *
 * Exit code: 0 if all pages in scope are at worst normalized-equal;
 *            1 if any REAL DIFF found.
 *
 * Usage:
 *   node scripts/stage3-diff.mjs <route-prefix>
 *
 *   node scripts/stage3-diff.mjs /lp/            # just /lp/* pages
 *   node scripts/stage3-diff.mjs /research/      # just /research/* pages
 *   node scripts/stage3-diff.mjs all             # every editorial-flavored route
 *
 * Prerequisites:
 *   - Page route(s) consume `page.editorialDefinition` + an env-flag
 *     dispatch (see docs/architecture/editorial-stage-3-cutover-memo.md
 *     Step 1-2 for the boilerplate). Without that dispatch the flag is a
 *     no-op and the two builds will be byte-identical — the script still
 *     runs cleanly but the diff isn't telling you anything.
 *   - The env var the script sets is `USE_EDITORIAL_COMPONENTS=1`. Update
 *     this script and the layout dispatcher together if you rename it.
 *
 * Output:
 *   - Summary table per route (status icon + raw byte delta + normalized
 *     byte delta).
 *   - For every REAL DIFF, a unified diff snippet (first 40 lines of `diff`
 *     output) so reviewers can see the structural mismatch immediately.
 *   - Final tally + exit code.
 *
 * The script does NOT write any artifacts to git-tracked locations beyond
 * `dist-baseline/` and `dist-experimental/` (both .gitignore'd; see
 * .gitignore tail addition included alongside this script).
 */

import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const DIST = join(REPO_ROOT, "dist");
const DIST_BASELINE = join(REPO_ROOT, "dist-baseline");
const DIST_EXPERIMENTAL = join(REPO_ROOT, "dist-experimental");

// --- arg parsing -----------------------------------------------------------

const arg = process.argv[2];
if (!arg || arg === "-h" || arg === "--help") {
  console.error("Stage 3 cutover diff tool — build twice + classify per-route diff");
  console.error("");
  console.error("usage:   node scripts/stage3-diff.mjs <route-prefix>|all");
  console.error("");
  console.error("examples:");
  console.error("  node scripts/stage3-diff.mjs /lp/         compare only /lp/* pages");
  console.error("  node scripts/stage3-diff.mjs /research/   compare only /research/* pages");
  console.error("  node scripts/stage3-diff.mjs all          compare every editorial route");
  console.error("");
  console.error("exit codes:");
  console.error("  0   all routes are at worst normalized-equal (PASS)");
  console.error("  1   at least one route is a REAL DIFF (FAIL)");
  console.error("  2   bad arguments (this message)");
  console.error("");
  console.error("see docs/architecture/editorial-stage-3-cutover-memo.md for the");
  console.error("env-flag dispatch the script depends on.");
  process.exit(2);
}
const routeFilter = arg === "all" ? null : arg;
if (routeFilter && !routeFilter.startsWith("/")) {
  console.error(`route prefix must start with "/", got: ${routeFilter}`);
  process.exit(2);
}

// --- normalize rules (mirror of src/components/editorial/__tests__/_parity-helpers.ts) ----------
//
// Reimplemented in plain JS so this script has no build-time dependency on
// the .ts file. Any change here MUST be mirrored in _parity-helpers.ts (and
// vice versa) — keep the two files in lockstep. The parity tests will catch
// a drift in the components but won't catch a drift here, so this script's
// rules are the production-side source of truth.

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

/**
 * Canonicalize HTML5 boolean-attribute serialization.
 *
 * HTML5 allows boolean (and bare) attributes to be written as either
 * `attr` (shorthand) or `attr=""` (empty-value form). Both parse to the
 * same DOM attribute with empty string value. The two render paths
 * disagree on which they emit:
 *
 *   - TS template-literal path: cheerio-based `normalize-body` re-serializes
 *     bodyHtml and outputs the explicit `attr=""` form.
 *   - Astro renderer: when an attribute prop is `true` (boolean) or a bare
 *     attribute appears in the template, it emits the shorthand `attr`.
 *
 * Examples surfaced by stage3-diff for /lp/*: `hidden=""` ↔ `hidden`,
 * `data-codex-rfq=""` ↔ `data-codex-rfq`, `novalidate=""` ↔ `novalidate`,
 * `required=""` ↔ `required`.
 *
 * Strip `=""` so both forms canonicalize to the shorthand (Astro's form).
 * Note: this also strips legitimately-empty string-valued attributes like
 * `<input value="" />`, but those parse to the same DOM regardless, so
 * the byte comparison is still meaningful for parity checking.
 */
function canonicalizeBooleanAttributes(html) {
  return html.replace(/ ([a-zA-Z][a-zA-Z0-9-]*)=""/g, " $1");
}

/**
 * Canonicalize ISO-8601 timestamps with millisecond precision wherever
 * they appear in the document.
 *
 * Editorial pages whose source JSON lacks `publishedAt` / `modifiedAt`
 * fall back to `new Date().toISOString()` inside `renderEditorialMain`
 * (and the EditorialArticle.astro shadow component), producing a wall-
 * clock timestamp at build time. Two builds run a few minutes apart will
 * therefore show DIFFERENT timestamps — a real byte difference but not a
 * semantic one (the visible date label `2026-05-12` is unchanged; only
 * the time-of-day portion of the ISO string moves).
 *
 * The match is intentionally context-free — the build-time signature is
 * `\.\d+Z` (millisecond fraction), which `new Date().toISOString()`
 * always emits. Deliberately-pinned fixture timestamps don't include
 * fractional seconds, so they pass through untouched. This catches:
 *   - `<time datetime="...">` attributes
 *   - `<meta property="article:published_time" content="...">` and
 *     `article:modified_time`
 *   - JSON-LD `"datePublished"`, `"dateModified"`, `"lastReviewed"`
 *     fields inside `<script type="application/ld+json">` blocks
 *   - any other build-time ISO timestamp the rendering tree may emit
 *
 * This rule is unique to the production diff script — parity tests under
 * vitest pin these fields explicitly via `pinDates` so they don't hit
 * this case.
 */
function canonicalizeBuildTimestamps(html) {
  return html.replace(
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z/g,
    "<BUILD_TIMESTAMP>",
  );
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

// --- build orchestration ---------------------------------------------------

function runBuild(label, envVal) {
  const start = Date.now();
  console.log(`\n— Running ${label} build (USE_EDITORIAL_COMPONENTS=${envVal})...`);
  rmSync(DIST, { recursive: true, force: true });
  execSync("npm run build", {
    cwd: REPO_ROOT,
    stdio: "inherit",
    env: { ...process.env, USE_EDITORIAL_COMPONENTS: envVal, ASTRO_TELEMETRY_DISABLED: "1" },
  });
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`  ✓ ${label} build done in ${elapsed}s`);
}

function moveDist(targetDir) {
  rmSync(targetDir, { recursive: true, force: true });
  renameSync(DIST, targetDir);
}

// --- diff walking ----------------------------------------------------------

function* walkHtml(rootDir) {
  for (const entry of readdirSync(rootDir)) {
    const full = join(rootDir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      yield* walkHtml(full);
    } else if (entry === "index.html") {
      yield full;
    }
  }
}

function routeFromDistPath(distRoot, htmlPath) {
  const rel = relative(distRoot, htmlPath).replace(/\\/g, "/");
  return "/" + rel.replace(/index\.html$/, "");
}

// --- per-route classify ----------------------------------------------------

function classifyRoute(baselinePath, experimentalPath) {
  if (!existsSync(baselinePath)) return { kind: "missing-baseline" };
  if (!existsSync(experimentalPath)) return { kind: "missing-experimental" };

  const baselineRaw = readFileSync(baselinePath, "utf8");
  const experimentalRaw = readFileSync(experimentalPath, "utf8");

  if (baselineRaw === experimentalRaw) {
    return { kind: "identical", baselineBytes: baselineRaw.length };
  }

  const baselineNorm = normalizeHtml(baselineRaw);
  const experimentalNorm = normalizeHtml(experimentalRaw);
  const rawDelta = Math.abs(baselineRaw.length - experimentalRaw.length);

  if (baselineNorm === experimentalNorm) {
    return { kind: "normalized-equal", rawDelta };
  }

  // REAL DIFF — produce a unified diff snippet for review.
  let diffSnippet = "";
  try {
    diffSnippet = execSync(`diff -u "${baselinePath}" "${experimentalPath}" | head -40`, {
      encoding: "utf8",
    });
  } catch (e) {
    // `diff` returns exit 1 when files differ, which throws. Use stdout from the error.
    diffSnippet = e.stdout ? e.stdout.toString().split("\n").slice(0, 40).join("\n") : "(diff failed)";
  }
  return {
    kind: "real-diff",
    rawDelta,
    normDelta: Math.abs(baselineNorm.length - experimentalNorm.length),
    diffSnippet,
  };
}

// --- main ------------------------------------------------------------------

function main() {
  console.log("Stage 3 cutover diff tool");
  console.log("─".repeat(56));

  // Build twice
  runBuild("baseline (flag off)", "0");
  moveDist(DIST_BASELINE);
  runBuild("experimental (flag on)", "1");
  moveDist(DIST_EXPERIMENTAL);

  // Walk experimental output for pages to compare (baseline is the
  // reference; any path that exists in baseline but not experimental will
  // surface as missing-experimental below).
  console.log("");
  console.log(`Comparing routes${routeFilter ? ` matching ${routeFilter}` : " (all editorial)"}`);
  console.log("─".repeat(56));

  const results = [];
  for (const expPath of walkHtml(DIST_EXPERIMENTAL)) {
    const route = routeFromDistPath(DIST_EXPERIMENTAL, expPath);
    if (routeFilter && !route.startsWith(routeFilter)) continue;
    // Skip the experimental-only quarantine subtree
    if (route.startsWith("/_stage3/")) continue;

    const basePath = join(DIST_BASELINE, route, "index.html");
    const result = classifyRoute(basePath, expPath);
    results.push({ route, ...result });
  }

  // Sort: real diffs first, then missing, then normalized-equal, then identical
  const order = { "real-diff": 0, "missing-baseline": 1, "missing-experimental": 1, "normalized-equal": 2, identical: 3 };
  results.sort((a, b) => (order[a.kind] - order[b.kind]) || a.route.localeCompare(b.route));

  // Print summary table
  for (const r of results) {
    const icon = {
      "identical": "✓",
      "normalized-equal": "✓",
      "real-diff": "✗",
      "missing-baseline": "?",
      "missing-experimental": "?",
    }[r.kind];
    const note = {
      "identical": `byte-identical (${r.baselineBytes} bytes)`,
      "normalized-equal": `normalized-equal (raw delta ${r.rawDelta} bytes)`,
      "real-diff": `REAL DIFF (raw ${r.rawDelta}b / norm ${r.normDelta}b)`,
      "missing-baseline": "missing from dist-baseline",
      "missing-experimental": "missing from dist-experimental",
    }[r.kind];
    console.log(`  ${icon} ${r.route.padEnd(56)} ${note}`);
  }

  // Print real diffs in detail
  const realDiffs = results.filter((r) => r.kind === "real-diff");
  if (realDiffs.length > 0) {
    console.log("");
    console.log("REAL DIFFs — first 40 lines of unified diff per route:");
    console.log("─".repeat(56));
    for (const r of realDiffs) {
      console.log(`\n${r.route}:`);
      console.log(r.diffSnippet);
    }
  }

  // Final tally
  const tally = results.reduce((acc, r) => {
    acc[r.kind] = (acc[r.kind] || 0) + 1;
    return acc;
  }, {});
  console.log("");
  console.log("Tally:");
  console.log(`  byte-identical:    ${tally["identical"] || 0}`);
  console.log(`  normalized-equal:  ${tally["normalized-equal"] || 0}`);
  console.log(`  REAL DIFF:         ${tally["real-diff"] || 0}`);
  if (tally["missing-baseline"]) console.log(`  missing-baseline:  ${tally["missing-baseline"]}`);
  if (tally["missing-experimental"]) console.log(`  missing-exp:       ${tally["missing-experimental"]}`);

  const exitCode = realDiffs.length > 0 ? 1 : 0;
  console.log(`\nResult: ${exitCode === 0 ? "PASS" : "FAIL"} (exit ${exitCode})`);
  process.exit(exitCode);
}

main();

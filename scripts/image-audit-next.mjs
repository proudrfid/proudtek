#!/usr/bin/env node
// image-audit dispatcher — claim + serve ONE page per invocation, parallel-safe.
//
// Unlike chip-specs / blog-voice / page-voice (which claim a target via a git
// BRANCH/PR because they EDIT files), image-audit is REPORT-ONLY: there is no
// branch to race on. So the shared claim/done ledger is a set of marker files
// under the git COMMON dir — shared across every worktree AND every session of
// the same repo — and the atomic claim is `mkdir(claimDir)` (fails if it
// already exists). N concurrent sessions can each call this and get a DIFFERENT
// page, with zero file edits and zero collisions.
//
// Ledger (auto-created, never committed — lives inside .git):
//   <git-common-dir>/image-audit/claims/<key>/meta.json   atomic mkdir == the claim
//   <git-common-dir>/image-audit/results/<key>.json        presence == page done
//   key = page file path with slashes→"__" and ".json" stripped (globally unique)
//
// Modes:
//   node scripts/image-audit-next.mjs                 # claim + print ONE page to audit (default)
//   node scripts/image-audit-next.mjs --json
//   node scripts/image-audit-next.mjs --group guides  # restrict to one group
//   node scripts/image-audit-next.mjs --status        # progress dashboard, NO claim
//   node scripts/image-audit-next.mjs --report        # aggregate results → markdown (NO claim)
//   node scripts/image-audit-next.mjs --release <key> # drop a claim (you aborted a page)
//   node scripts/image-audit-next.mjs --reset-stale   # clear claims older than TTL with no result
//   node scripts/image-audit-next.mjs --force         # ignore the STOP_IMAGE_AUDIT sentinel
//
// Env: IMAGE_AUDIT_CLAIM_TTL_MIN (default 30) · IMAGE_AUDIT_FEW_REMAIN (default 8)
//
// Read-only w.r.t. the working tree (only writes inside .git/image-audit/).

import { execSync } from "node:child_process";
import {
  mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync, statSync, rmSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listTargets, DEFAULT_GROUPS, REPO_ROOT } from "../.claude/skills/image-audit/scripts/list-targets.mjs";

const ROOT = REPO_ROOT;

// ── args ────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const valOf = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };
const wantJson = has("--json");
const onlyGroup = valOf("--group");
const groups = onlyGroup ? [onlyGroup] : DEFAULT_GROUPS;
const mode = has("--status") ? "status"
  : has("--report") ? "report"
  : has("--release") ? "release"
  : has("--reset-stale") ? "reset-stale"
  : "next";
const force = has("--force");

const TTL_MIN = parseInt(process.env.IMAGE_AUDIT_CLAIM_TTL_MIN || "30", 10);
const FEW = parseInt(process.env.IMAGE_AUDIT_FEW_REMAIN || "8", 10);

// ── ledger location: the git COMMON dir (shared across worktrees + sessions) ──
function ledgerRoot() {
  try {
    const d = execSync("git rev-parse --git-common-dir", { cwd: ROOT, encoding: "utf8" }).trim();
    return path.join(path.isAbsolute(d) ? d : path.resolve(ROOT, d), "image-audit");
  } catch {
    return path.join(ROOT, ".image-audit-ledger"); // not a git repo — local fallback
  }
}
const LEDGER = ledgerRoot();
const CLAIMS = path.join(LEDGER, "claims");
const RESULTS = path.join(LEDGER, "results");
mkdirSync(CLAIMS, { recursive: true });
mkdirSync(RESULTS, { recursive: true });

const keyOf = (t) => t.file.replace(/\.json$/, "").replace(/[\\/]/g, "__");
const resultPath = (key) => path.join(RESULTS, `${key}.json`);
const claimDir = (key) => path.join(CLAIMS, key);

const isDone = (key) => existsSync(resultPath(key));
function claimAgeMin(key) {
  const cp = claimDir(key);
  if (!existsSync(cp)) return null;
  try { return (Date.now() - statSync(cp).mtimeMs) / 60000; } catch { return Infinity; }
}
function claimMeta(key) {
  try { return JSON.parse(readFileSync(path.join(claimDir(key), "meta.json"), "utf8")); } catch { return {}; }
}
// status of a target: "done" | "active" (claimed, fresh) | "stale" | "free"
function statusOf(key) {
  if (isDone(key)) return "done";
  const age = claimAgeMin(key);
  if (age === null) return "free";
  return age > TTL_MIN ? "stale" : "active";
}
// Atomic claim: mkdir is atomic; EEXIST means a rival owns it. A stale claim
// (older than TTL, no result) is reclaimed.
function tryClaim(key, who) {
  const cp = claimDir(key);
  let created = false;
  try { mkdirSync(cp); created = true; }
  catch (e) {
    if (e.code !== "EEXIST") return false;
    if (statusOf(key) === "stale") {
      try { rmSync(cp, { recursive: true, force: true }); mkdirSync(cp); created = true; }
      catch { return false; }
    } else return false;
  }
  if (created) {
    try { writeFileSync(path.join(cp, "meta.json"), JSON.stringify({ key, who, at: new Date().toISOString() }, null, 2)); } catch { /* best effort */ }
  }
  return created;
}
const WHO = `${process.env.USER || "session"}@${process.env.HOSTNAME || "host"}:${process.pid}`;

// ── data ──────────────────────────────────────────────────────────────────────
const targets = listTargets({ groups });
const inspectable = targets.filter((t) => t.inspectable);
const brokenPages = targets.filter((t) => t.heroImage && !t.heroExists);
const noHeroPages = targets.filter((t) => !t.heroImage);

// ── STOP sentinel ──────────────────────────────────────────────────────────────
const STOP_FILE = path.join(ROOT, "STOP_IMAGE_AUDIT");
let stopReason = null;
try { stopReason = readFileSync(STOP_FILE, "utf8").trim() || "STOP_IMAGE_AUDIT sentinel present"; } catch { /* none */ }

// ── helper: result file → object ────────────────────────────────────────────
function readResult(key) {
  try { return JSON.parse(readFileSync(resultPath(key), "utf8")); } catch { return null; }
}

// ── RELEASE / RESET-STALE ─────────────────────────────────────────────────────
if (mode === "release") {
  const key = valOf("--release");
  if (!key) { console.error("usage: --release <key>"); process.exit(2); }
  const cp = claimDir(key);
  if (existsSync(cp)) { rmSync(cp, { recursive: true, force: true }); console.log(`released claim: ${key}`); }
  else console.log(`no claim to release: ${key}`);
  process.exit(0);
}
if (mode === "reset-stale") {
  let n = 0;
  for (const name of (existsSync(CLAIMS) ? readdirSync(CLAIMS) : [])) {
    if (statusOf(name) === "stale") { rmSync(claimDir(name), { recursive: true, force: true }); n++; }
  }
  console.log(`cleared ${n} stale claim(s) (older than ${TTL_MIN}m with no result).`);
  process.exit(0);
}

// ── tallies ────────────────────────────────────────────────────────────────────
const counts = { done: 0, active: 0, stale: 0, free: 0 };
for (const t of inspectable) counts[statusOf(keyOf(t))]++;
const remainingCount = counts.free + counts.stale; // claimable right now
const stopSignals = [];
if (remainingCount === 0 && counts.active === 0) stopSignals.push({ code: "ALL_DONE", detail: "every inspectable hero has a result" });
else if (remainingCount === 0 && counts.active > 0) stopSignals.push({ code: "ALL_IN_FLIGHT", detail: `${counts.active} page(s) claimed by other sessions; none free right now` });
else if (remainingCount <= FEW) stopSignals.push({ code: "FEW_REMAIN", detail: `${remainingCount} unclaimed page(s) <= threshold ${FEW}` });

// ── STATUS ─────────────────────────────────────────────────────────────────────
if (mode === "status") {
  if (wantJson) {
    console.log(JSON.stringify({
      ledger: LEDGER, groups, ttlMin: TTL_MIN,
      inspectable: inspectable.length, ...counts, remaining: remainingCount,
      broken: brokenPages.length, noHero: noHeroPages.length,
      stopSignals,
    }, null, 2));
    process.exit(0);
  }
  console.log("─".repeat(60));
  console.log(`image-audit progress${onlyGroup ? ` (${onlyGroup})` : ""}`);
  console.log("─".repeat(60));
  console.log(`ledger: ${LEDGER}`);
  console.log(`inspectable heroes: ${inspectable.length}`);
  console.log(`  done:        ${counts.done}`);
  console.log(`  in-progress: ${counts.active}  (claimed, < ${TTL_MIN}m old)`);
  console.log(`  stale:       ${counts.stale}  (reclaimable)`);
  console.log(`  free:        ${counts.free}`);
  console.log(`  → claimable now: ${remainingCount}`);
  console.log(`broken hero (auto-finding): ${brokenPages.length}   ·   no explicit hero: ${noHeroPages.length}`);
  if (stopSignals.length) { console.log(""); for (const s of stopSignals) console.log(`🟡 ${s.code}: ${s.detail}`); }
  if (stopReason) console.log(`\n🛑 STOP_IMAGE_AUDIT present: ${stopReason}`);
  process.exit(0);
}

// ── REPORT ───────────────────────────────────────────────────────────────────
if (mode === "report") {
  const results = inspectable.map((t) => ({ t, r: readResult(keyOf(t)) })).filter((x) => x.r);
  const mism = results.filter((x) => x.r.checkA && x.r.checkA.match === false);
  const logos = results.filter((x) => x.r.checkB && x.r.checkB.competitorLogo === true);
  const clean = results.length - new Set([...mism, ...logos].map((x) => x.t.slug)).size;
  const out = [];
  out.push(`# Image Audit — aggregated results`);
  out.push("");
  out.push(`## Summary`);
  out.push(`- Results recorded: ${results.length} / ${inspectable.length} inspectable heroes`);
  out.push(`- Topic mismatches: ${mism.length} · competitor logos: ${logos.length} · clean: ${clean}`);
  out.push(`- Broken hero (file missing): ${brokenPages.length} · no explicit hero: ${noHeroPages.length}`);
  out.push("");
  if (mism.length) {
    out.push(`## Topic mismatches (Check A)`);
    for (const { t, r } of mism) {
      out.push(`### ${t.slug} (${t.group})`);
      out.push(`- file: ${t.file} · hero: ${t.heroImage}`);
      out.push(`- shows: ${r.checkA.imageShows || "?"}`);
      out.push(`- why: ${r.checkA.reason || "?"}`);
      const rep = r.replacement;
      if (rep && (rep.applied === true || rep.applied === "true")) {
        out.push(`- ✅ replaced → ${rep.newHero || "?"}  (${rep.license || "?"} · ${rep.creator || "?"} · ${rep.source || "?"})`);
      } else if (rep && rep.source) {
        out.push(`- candidate (not applied): ${rep.source} ${rep.license || ""}`);
      }
      if (r.replacements && r.replacements.length) { // back-compat with older results
        out.push(`- replacement candidates (verify license):`);
        for (const c of r.replacements) out.push(`  - ${c.url || ""} — ${c.source || ""} — ${c.why || ""}`);
      }
      if (r.queries && r.queries.length) out.push(`- queries: ${r.queries.map((q) => `"${q}"`).join(", ")}`);
      out.push("");
    }
  }
  if (logos.length) {
    out.push(`## Competitor logos (Check B)`);
    for (const { t, r } of logos) out.push(`- ${t.slug} (${t.group}) — ${r.checkB.brand || "?"} [${r.checkB.confidence || "?"}] · ${t.heroImage}`);
    out.push("");
  }
  if (brokenPages.length) {
    out.push(`## Broken hero (file missing)`);
    for (const t of brokenPages) out.push(`- ${t.slug} (${t.group}) — ${t.heroImage} (not on disk)`);
    out.push("");
  }
  console.log(out.join("\n"));
  process.exit(0);
}

// ── NEXT (default): atomically claim + serve ONE page ──────────────────────────
if (stopReason && !force) {
  const payload = { halted: true, haltReason: stopReason, page: null };
  if (wantJson) console.log(JSON.stringify(payload, null, 2));
  else {
    console.log("\n🛑 image-audit HALTED");
    console.log(`reason: ${stopReason}`);
    console.log("Do NOT audit more pages. To resume: delete STOP_IMAGE_AUDIT (or pass --force).\n");
  }
  process.exit(0);
}

// Iterate claimable pages in stable order; first atomic claim wins.
const claimable = inspectable.filter((t) => { const s = statusOf(keyOf(t)); return s === "free" || s === "stale"; });
let served = null;
for (const t of claimable) {
  if (tryClaim(keyOf(t), WHO)) { served = t; break; }
}

if (!served) {
  const signal = counts.active > 0 ? "ALL_IN_FLIGHT" : "ALL_DONE";
  const payload = { halted: false, page: null, stopSignals, signal };
  if (wantJson) console.log(JSON.stringify(payload, null, 2));
  else {
    console.log("\n✓ no page to claim right now.");
    console.log(signal === "ALL_IN_FLIGHT"
      ? `  ${counts.active} page(s) are claimed by other sessions; nothing free. Try again shortly or run --reset-stale.`
      : `  Every inspectable hero has a result. Run \`npm run image-audit:report\` to aggregate.`);
    console.log("");
  }
  process.exit(0);
}

const key = keyOf(served);
const page = {
  key, slug: served.slug, group: served.group, file: served.file,
  title: served.title, kicker: served.kicker, summary: served.summary,
  heroImage: served.heroImage, heroPath: served.heroPath,
  imageAlt: served.imageAlt,
  sectionImages: served.sectionImages,
  resultPath: path.relative(ROOT, resultPath(key)),
};
const resultSchema = {
  slug: served.slug, group: served.group, file: served.file, heroImage: served.heroImage,
  auditedAt: "<ISO timestamp>",
  checkA: { match: "true|false", imageShows: "<one objective sentence>", reason: "<if false: image shows X; page is about Y>" },
  checkB: { competitorLogo: "false|true", brand: "<if true>", confidence: "clear|possible" },
  replacement: { applied: "false|true", newHero: "<if applied>", source: "", license: "", creator: "" },
  queries: ["", ""],
};

if (wantJson) {
  console.log(JSON.stringify({ halted: false, claimed: true, stopSignals, page, resultSchema }, null, 2));
  process.exit(0);
}

console.log("\n" + "─".repeat(60));
console.log(`image-audit — CLAIMED 1 page  (${remainingCount - 1} more claimable)`);
console.log("─".repeat(60));
if (stopSignals.length) for (const s of stopSignals) console.log(`🟡 ${s.code}: ${s.detail}  → consider halting + reporting to the user`);
console.log("");
console.log(`page:   ${served.slug}   [${served.group}${served.category ? " / " + served.category : ""}]`);
console.log(`file:   ${served.file}`);
console.log(`title:  ${served.title ?? "(none)"}`);
console.log(`kicker: ${served.kicker ?? "(none)"}`);
console.log(`summary:${served.summary ? " " + served.summary.slice(0, 220) : " (none)"}`);
console.log(`hero:   ${served.heroImage}  →  ${served.heroPath}`);
if (served.sectionImages?.length) console.log(`        +${served.sectionImages.length} section image(s)`);
console.log("");
console.log("DO (one page):");
console.log(`  1. Read ${served.heroPath} — describe what it literally shows (subject, setting, logos).`);
console.log("  2. Check A: does it match the title/topic above? (per SKILL.md — flag only a CLEAR mismatch).");
console.log("  3. Check B (cheap, same read): any competitor logo? (per references/competitors.md).");
console.log("  4. If Check A is a CLEAR mismatch → source + replace (license-aware, per SKILL.md Step 2):");
console.log(`       python3 scripts/image-audit-replace.py search --query "<topic from title+kicker>" --count 5`);
console.log("       # Read a candidate thumbnail to confirm the pixels match, then apply:");
console.log(`       python3 scripts/image-audit-replace.py apply --slug ${served.slug} --group ${served.group} \\`);
console.log("         --src '<imageURL>' --source-url '<landingURL>' --license '<CC ...>' --license-url '<url>' --creator '<author>'");
console.log(`       # then Read public/landing-images/${served.slug}-hero.jpg to confirm it renders + fits.`);
console.log(`  5. Write your verdict JSON to:  ${page.resultPath}`);
console.log("     (writing that file marks the page DONE and releases the claim.)");
console.log("");
console.log("result schema:");
console.log(JSON.stringify(resultSchema, null, 2).split("\n").map((l) => "  " + l).join("\n"));
console.log("");
console.log("then run `npm run image-audit:next` again for the next page (or stop on a stop signal).");
console.log("");

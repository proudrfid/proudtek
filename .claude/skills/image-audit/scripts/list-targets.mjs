#!/usr/bin/env node
/**
 * image-audit target lister.
 *
 * Enumerates editorial/product pages and resolves each one's hero (and inline
 * section) image to a concrete file under public/, so the audit doesn't have to
 * re-derive the page→image mapping every run.
 *
 * Usage (run from repo root, or anywhere — root is derived from this file):
 *   node .claude/skills/image-audit/scripts/list-targets.mjs            # human summary, default groups
 *   node .claude/skills/image-audit/scripts/list-targets.mjs --json     # machine-readable JSON array
 *   node .claude/skills/image-audit/scripts/list-targets.mjs --group blog
 *   node .claude/skills/image-audit/scripts/list-targets.mjs --slug rfid-warehouse-management
 *
 * Default groups: blog, solutions, guides, products.
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, "..", "..", "..", ".."); // repo root
const EDITORIAL = path.join(ROOT, "src", "content", "editorial");
const PUBLIC = path.join(ROOT, "public");

const DEFAULT_GROUPS = ["blog", "solutions", "guides", "products"];
// Aggregate / fixture files that aren't real pages.
const SKIP_FILES = new Set(["all.json"]);
const isSkippable = (name) => SKIP_FILES.has(name) || name.startsWith("_");

// ── args ──────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const asJson = args.includes("--json");
const groupArg = ((i) => (i >= 0 ? args[i + 1] : null))(args.indexOf("--group"));
const slugArg = ((i) => (i >= 0 ? args[i + 1] : null))(args.indexOf("--slug"));
const groups = groupArg ? [groupArg] : DEFAULT_GROUPS;

// ── helpers ───────────────────────────────────────────────────────────
function resolvePublic(p) {
  if (!p || typeof p !== "string" || !p.startsWith("/")) return null;
  return path.join(PUBLIC, p);
}
function publicInfo(p) {
  const abs = resolvePublic(p);
  return {
    src: p ?? null,
    publicPath: abs ? path.relative(ROOT, abs) : null,
    exists: abs ? existsSync(abs) : false,
  };
}
// Recursively collect page JSON under a group dir. Product SKUs are nested
// (products/rfid-tags/*.json, products/rfid-labels/*.json, …), so a flat
// readdir misses them entirely. Skip aggregates/pillars (_*, all.json) and the
// _unused parking lot.
function walkJson(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out; // group dir missing — skip silently
  }
  for (const e of entries) {
    if (e.name === "_unused" || e.name === "node_modules") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkJson(full));
    else if (e.name.endsWith(".json") && !isSkippable(e.name)) out.push(full);
  }
  return out;
}

// ── scan ──────────────────────────────────────────────────────────────
const targets = [];
for (const group of groups) {
  const groupDir = path.join(EDITORIAL, group);
  for (const absFile of walkJson(groupDir)) {
    const file = path.relative(ROOT, absFile);
    const slug = path.basename(absFile).replace(/\.json$/, "");
    if (slugArg && slug !== slugArg) continue;
    // For nested groups (products/<category>/<slug>.json) capture the category.
    const relInGroup = path.relative(groupDir, absFile);
    const category = relInGroup.includes(path.sep) ? relInGroup.split(path.sep)[0] : null;
    let data;
    try {
      data = JSON.parse(readFileSync(absFile, "utf8"));
    } catch (err) {
      targets.push({ slug, group, category, file, parseError: String(err) });
      continue;
    }
    const hero = publicInfo(data.heroImage);
    const sectionImages = Array.isArray(data.sections)
      ? data.sections
          .map((s, i) => (s && s.image && s.image.src ? { index: i, alt: s.image.alt ?? null, ...publicInfo(s.image.src) } : null))
          .filter(Boolean)
      : [];

    let note = null;
    if (!data.heroImage) {
      note = (data.imageSourceRoutes && data.imageSourceRoutes.length)
        ? "no explicit heroImage — hero harvested from imageSourceRoutes (not inspectable from a file)"
        : "no explicit heroImage and no imageSourceRoutes";
    } else if (!hero.exists) {
      note = "heroImage file MISSING on disk (broken image)";
    }

    targets.push({
      slug,
      group,
      category,
      file,
      title: data.title ?? null,
      kicker: data.kicker ?? null,
      summary: data.summary ?? null,
      heroImage: data.heroImage ?? null,
      heroPath: hero.publicPath,
      heroExists: hero.exists,
      imageAlt: data.imageAlt ?? null,
      imageSourceRoutes: data.imageSourceRoutes ?? [],
      sectionImages,
      inspectable: Boolean(data.heroImage) && hero.exists,
      note,
    });
  }
}

targets.sort((a, b) => (a.group + a.slug).localeCompare(b.group + b.slug));

// ── output ────────────────────────────────────────────────────────────
if (asJson) {
  // Note: no process.exit() here — exiting before stdout flushes truncates
  // large JSON to a pipe. Let Node drain and exit naturally.
  process.stdout.write(JSON.stringify(targets, null, 2) + "\n");
} else {
  const byGroup = {};
  let inspectable = 0, missing = 0, noHero = 0;
  for (const t of targets) {
    byGroup[t.group] = (byGroup[t.group] || 0) + 1;
    if (t.inspectable) inspectable++;
    else if (t.heroImage && !t.heroExists) missing++;
    else if (!t.heroImage) noHero++;
  }

  console.log("─".repeat(64));
  console.log("image-audit targets");
  console.log("─".repeat(64));
  console.log(`groups: ${groups.join(", ")}${slugArg ? `  (slug filter: ${slugArg})` : ""}`);
  console.log(`pages: ${targets.length}  ·  inspectable hero: ${inspectable}  ·  missing-file: ${missing}  ·  no-explicit-hero: ${noHero}`);
  console.log("by group: " + Object.entries(byGroup).map(([g, n]) => `${g} ${n}`).join(" · "));
  console.log("");
  for (const t of targets) {
    const flag = t.inspectable ? "  " : (t.heroImage ? "✗ " : "~ ");
    console.log(`${flag}${t.slug}  [${t.group}]`);
    console.log(`    title: ${t.title ?? "(none)"}`);
    console.log(`    hero:  ${t.heroImage ?? "(none)"}${t.heroPath ? `  →  ${t.heroPath}${t.heroExists ? "" : "  (MISSING)"}` : ""}`);
    if (t.sectionImages.length) console.log(`    +${t.sectionImages.length} section image(s)`);
    if (t.note) console.log(`    note:  ${t.note}`);
  }
  console.log("");
  console.log("legend:  (blank)=inspectable hero · ✗=hero file missing · ~=no explicit heroImage");
  console.log("next: read each heroPath, run Check A (title match) + Check B (competitor logo) per SKILL.md");
}

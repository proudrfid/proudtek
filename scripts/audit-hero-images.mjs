#!/usr/bin/env node
/**
 * Hero image audit — scans every page in scope and flags the ones missing a hero.
 *
 * Definition of "has hero":
 *   1. There's a main-content <img> or <figure> with class/ancestor signalling
 *      it's a hero (wp-post-image, post-thumbnail, codex-editorial-hero-media,
 *      codex-hero-image, codex-injected-hero, or under .hero / .featured-image
 *      / .entry-header / .entry-image).
 *   2. <meta property="og:image"> is set to something other than the generic
 *      proudtek-logo placeholder.
 *   3. The referenced image file exists inside dist-restored/.
 *
 * Output: audit-hero-images.json + HERO_IMAGE_AUDIT.md summary.
 */
import fs from "node:fs";
import path from "node:path";
import { load } from "cheerio";

const ROOT = path.resolve("/sessions/happy-practical-bohr/mnt/Playground/dist-restored");
const OUT_DIR = path.resolve("/sessions/happy-practical-bohr/mnt/Playground");

const SCOPES = [
  { label: "solutions", dir: "solutions", priority: "high" },
  { label: "blog", dir: "blog", priority: "high" },
  { label: "editorial/guides", dir: "editorial/guides", priority: "medium" },
  { label: "guides", dir: "guides", priority: "medium" },
  { label: "compatibility", dir: "compatibility", priority: "medium" },
  { label: "product", dir: "product", priority: "low" },
];

const HERO_CLASS_PATTERNS = [
  "wp-post-image",
  "attachment-post-thumbnail",
  "codex-editorial-hero-media",
  "codex-hero-image",
  "codex-injected-hero",
];
const HERO_ANCESTOR_PATTERNS = [
  ".hero",
  ".featured-image",
  ".post-thumbnail",
  ".entry-header",
  ".entry-image",
  ".codex-editorial-hero",
];
const LOGO_PLACEHOLDER_PATTERN = /proudtek-logo/i;

function collectIndexFiles(dir) {
  const results = [];
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return results;
  function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === "index.html") results.push(p);
    }
  }
  walk(full);
  return results;
}

function fileExistsInDist(src) {
  if (!src) return false;
  // Strip query, hash, origin
  const clean = src.replace(/^https?:\/\/[^/]+/, "").replace(/[?#].*$/, "");
  const candidate = path.join(ROOT, clean.replace(/^\/+/, ""));
  return fs.existsSync(candidate);
}

function analyzePage(filePath) {
  const html = fs.readFileSync(filePath, "utf8");
  const $ = load(html);
  const relPath = filePath.replace(ROOT, "") || "/";

  const title = $("title").first().text().trim();
  const h1 = $("h1").first().text().replace(/\s+/g, " ").trim();
  const metaDesc = $('meta[name="description"]').attr("content")?.trim() ?? "";
  const ogImage = $('meta[property="og:image"]').attr("content") ?? "";

  // Find candidate hero images
  let heroImg = null;
  let heroReason = "";

  // Check class-based patterns
  for (const cls of HERO_CLASS_PATTERNS) {
    const img = $(`img.${cls}`).first();
    if (img.length) {
      heroImg = img.attr("src") || "";
      heroReason = `class:${cls}`;
      break;
    }
  }
  // Check ancestor patterns
  if (!heroImg) {
    for (const sel of HERO_ANCESTOR_PATTERNS) {
      const img = $(`${sel} img`).first();
      if (img.length) {
        heroImg = img.attr("src") || "";
        heroReason = `ancestor:${sel}`;
        break;
      }
    }
  }
  // Width-based heuristic: first large img in main content before first H1's sibling
  if (!heroImg) {
    const mainImgs = $("main img, article img, .entry-content img").toArray();
    for (const el of mainImgs) {
      const w = parseInt($(el).attr("width") ?? "0", 10);
      if (w >= 600) {
        heroImg = $(el).attr("src") || "";
        heroReason = `width>=${w}`;
        break;
      }
    }
  }

  const heroFileExists = heroImg ? fileExistsInDist(heroImg) : false;
  const ogImageValid = ogImage && !LOGO_PLACEHOLDER_PATTERN.test(ogImage) && fileExistsInDist(ogImage);

  const hasHero = !!heroImg && heroFileExists;
  // Strict definition for the audit: need BOTH hero img AND a non-logo og:image
  const hasHeroStrict = hasHero && ogImageValid;

  // Build suggested keywords from title/h1/meta
  const keyword = [h1, title, metaDesc.slice(0, 60)].filter(Boolean).join(" | ").slice(0, 220);

  return {
    page_path: relPath,
    title,
    h1,
    og_image: ogImage,
    og_image_is_placeholder: LOGO_PLACEHOLDER_PATTERN.test(ogImage),
    hero_img_src: heroImg,
    hero_detection: heroReason,
    hero_file_exists: heroFileExists,
    has_hero: hasHero,
    has_hero_strict: hasHeroStrict,
    suggested_keywords: keyword,
  };
}

function main() {
  const allResults = [];
  const byScope = {};
  for (const scope of SCOPES) {
    const files = collectIndexFiles(scope.dir);
    const rows = files.map((f) => ({ ...analyzePage(f), scope: scope.label, priority: scope.priority }));
    byScope[scope.label] = rows;
    allResults.push(...rows);
  }

  const json = {
    generated_at: new Date().toISOString(),
    total: allResults.length,
    missing_hero: allResults.filter((r) => !r.has_hero).length,
    missing_hero_strict: allResults.filter((r) => !r.has_hero_strict).length,
    by_scope: Object.fromEntries(
      Object.entries(byScope).map(([k, v]) => [
        k,
        {
          total: v.length,
          missing_hero: v.filter((r) => !r.has_hero).length,
          missing_hero_strict: v.filter((r) => !r.has_hero_strict).length,
          completion_pct: v.length ? Math.round(((v.length - v.filter((r) => !r.has_hero).length) / v.length) * 100) : 0,
        },
      ]),
    ),
    pages: allResults,
  };

  fs.writeFileSync(path.join(OUT_DIR, "audit-hero-images.json"), JSON.stringify(json, null, 2));

  // Markdown summary
  const lines = [];
  lines.push(`# Hero Image Audit — ${new Date().toISOString().slice(0, 10)}`);
  lines.push("");
  lines.push(`**Total pages scanned:** ${json.total}`);
  lines.push(`**Missing any hero image:** ${json.missing_hero}`);
  lines.push(`**Missing strict (hero + non-placeholder og:image):** ${json.missing_hero_strict}`);
  lines.push("");
  lines.push("## By scope");
  lines.push("");
  lines.push("| Scope | Total | Missing Hero | Missing Strict | Completion % |");
  lines.push("|---|---:|---:|---:|---:|");
  for (const [k, v] of Object.entries(json.by_scope)) {
    lines.push(`| \`${k}/*\` | ${v.total} | ${v.missing_hero} | ${v.missing_hero_strict} | ${v.completion_pct}% |`);
  }
  lines.push("");
  lines.push("## Sample missing pages (first 10 of each scope)");
  for (const [scope, rows] of Object.entries(byScope)) {
    const missing = rows.filter((r) => !r.has_hero).slice(0, 10);
    if (!missing.length) continue;
    lines.push(`\n### ${scope}\n`);
    for (const m of missing) {
      lines.push(`- \`${m.page_path}\` — H1: "${m.h1 || "(none)"}"`);
    }
  }

  fs.writeFileSync(path.join(OUT_DIR, "HERO_IMAGE_AUDIT.md"), lines.join("\n"));

  console.log(JSON.stringify(
    {
      total: json.total,
      missing_hero: json.missing_hero,
      missing_hero_strict: json.missing_hero_strict,
      by_scope: json.by_scope,
    },
    null,
    2,
  ));
}

main();

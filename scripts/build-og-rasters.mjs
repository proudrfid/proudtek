#!/usr/bin/env node
// Render 1200×630 JPEG twins for every SVG used as an editorial heroImage.
//
// Why: og:image / twitter:image / JSON-LD image cannot be SVG (Facebook,
// LinkedIn, X and Google Discover render no preview) — audit 2026-09-01,
// Phase 2 T6. The twins are COMMITTED under public/og/<same path>.jpg so the
// production build has no font/rasteriser dependency; `src/lib/seo/og-raster.ts`
// swaps an SVG reference for its twin only when the file exists, and
// `src/lib/__tests__/og-rasters.test.ts` fails when a twin is missing.
//
// Output contract (keep in sync with the test + og-raster.ts):
//   - render the SVG at 1200 px wide on a white background
//   - centre-crop (or letterbox) to 1200×630
//   - JPEG, quality 82, progressive
//
// Usage:
//   node scripts/build-og-rasters.mjs            # render missing / stale twins
//   node scripts/build-og-rasters.mjs --force    # re-render everything
//   node scripts/build-og-rasters.mjs --check    # exit 1 if any twin is missing
//
// Needs `sharp` (already a dependency). Run on a machine where sharp's native
// binary loads (macOS / CI); the 2026-09-02 batch was rendered with resvg to
// the same contract because sharp could not load in the audit sandbox.
import { readFileSync, readdirSync, statSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const EDITORIAL_DIR = join(ROOT, "src", "content", "editorial");
const PUBLIC_DIR = join(ROOT, "public");
const OG_DIR = join(PUBLIC_DIR, "og");
const WIDTH = 1200;
const HEIGHT = 630;
const QUALITY = 82;

const args = new Set(process.argv.slice(2));
const force = args.has("--force");
const checkOnly = args.has("--check");

function walkJson(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkJson(full, out);
    else if (entry.endsWith(".json")) out.push(full);
  }
  return out;
}

const svgHeroes = new Set();
for (const file of walkJson(EDITORIAL_DIR)) {
  let def;
  try {
    def = JSON.parse(readFileSync(file, "utf8"));
  } catch {
    continue;
  }
  const hero = def && typeof def.heroImage === "string" ? def.heroImage : "";
  if (/\.svg$/i.test(hero)) svgHeroes.add(hero);
}

const jobs = [];
const missing = [];
for (const hero of [...svgHeroes].sort()) {
  const src = join(PUBLIC_DIR, hero.replace(/^\//, ""));
  const out = join(OG_DIR, hero.replace(/^\//, "").replace(/\.svg$/i, ".jpg"));
  if (!existsSync(src)) {
    console.warn(`source missing: ${hero}`);
    continue;
  }
  const stale = !existsSync(out) || statSync(out).mtimeMs < statSync(src).mtimeMs;
  if (!existsSync(out)) missing.push(hero);
  if (force || stale) jobs.push({ hero, src, out });
}

console.log(`svg heroes: ${svgHeroes.size}; twins missing: ${missing.length}; to render: ${checkOnly ? 0 : jobs.length}`);
if (checkOnly) {
  for (const hero of missing) console.log(`  missing twin for ${hero}`);
  process.exit(missing.length ? 1 : 0);
}
if (!jobs.length) process.exit(0);

const { default: sharp } = await import("sharp");
let bytes = 0;
for (const job of jobs) {
  mkdirSync(dirname(job.out), { recursive: true });
  const svg = readFileSync(job.src);
  // Render at 1200 px wide first so the crop is taken from a full-width frame.
  const rendered = await sharp(svg, { density: 96 }).resize({ width: WIDTH }).flatten({ background: "#ffffff" }).toBuffer();
  const meta = await sharp(rendered).metadata();
  const pipeline =
    (meta.height ?? 0) >= HEIGHT
      ? sharp(rendered).resize(WIDTH, HEIGHT, { fit: "cover", position: "centre" })
      : sharp(rendered).resize(WIDTH, HEIGHT, { fit: "contain", background: "#ffffff" });
  const info = await pipeline.jpeg({ quality: QUALITY, progressive: true, mozjpeg: true }).toFile(job.out);
  bytes += info.size;
  console.log(`  ${job.hero} -> ${job.out.slice(ROOT.length + 1)} (${info.size} B)`);
}
console.log(`rendered ${jobs.length} twin(s), ${bytes} bytes`);

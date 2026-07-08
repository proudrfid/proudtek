#!/usr/bin/env node
/**
 * Static checks for Proudtek blog SVGs (blog-transform skill).
 * Usage: node .claude/skills/blog-transform/scripts/check-svg.mjs <file.svg> [...]
 *
 * Hard fails (exit 1): wrong viewBox, any <tspan>, missing <title>/<desc>/role.
 * Warnings: foreign-hue or neon colors, font-size < 12.
 * A green run does NOT replace rendering the SVG to PNG and looking at it —
 * text overlap is invisible to static checks.
 */
import { readFileSync } from "node:fs";

// Core token hues (from src/styles/codex-tokens.css): gold ~35-41°, forest/
// success ~140-155°, teal ~180°, cyan ~192-200°, steel ~218°, red ~0°.
// Light tints and dark inks of these hues are fine (the corpus uses many);
// foreign hues (purple, magenta, blue-violet) are not.
const PALETTE_HUES = [0, 35, 41, 140, 155, 180, 193, 200, 218];
const HUE_TOLERANCE = 28;

function hexToHsl(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
  else if (max === g) h = ((b - r) / d + 2) * 60;
  else h = ((r - g) / d + 4) * 60;
  return { h, s, l };
}

const hueDist = (a, b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("usage: check-svg.mjs <file.svg> [...]");
  process.exit(1);
}

let failed = false;

for (const file of files) {
  let svg;
  try {
    svg = readFileSync(file, "utf8");
  } catch (err) {
    console.error(`✗ ${file}: ${err.message}`);
    failed = true;
    continue;
  }

  const problems = [];
  const warns = [];

  if (!/viewBox="0 0 1200 675"/.test(svg)) {
    problems.push('viewBox must be exactly "0 0 1200 675" — components render <img width=1200 height=675>');
  }
  if (/<tspan/i.test(svg)) {
    problems.push("contains <tspan> — stacked tspans overlap in real renderers; use one <text> per line with its own y");
  }
  if (!/<title[\s>]/.test(svg)) problems.push("missing <title> (one-line summary; accessibility + crawlers)");
  if (!/<desc[\s>]/.test(svg)) problems.push("missing <desc> (full prose description)");
  if (!/role="img"/.test(svg)) problems.push('missing role="img" (pair with aria-labelledby="t d")');

  const colors = [...new Set((svg.match(/#[0-9a-fA-F]{6}\b/g) ?? []).map((c) => c.toLowerCase()))];
  const foreign = [];
  const neon = [];
  for (const c of colors) {
    const { h, s, l } = hexToHsl(c);
    if (s < 0.15 || l > 0.93 || l < 0.12) continue; // neutrals, washes, inks
    if (PALETTE_HUES.every((p) => hueDist(h, p) > HUE_TOLERANCE)) foreign.push(c);
    else if (s > 0.9 && l > 0.35 && l < 0.72 && c !== "#1fcefb") neon.push(c);
  }
  if (foreign.length > 0) {
    warns.push(`foreign-hue colors (palette is warm gold / teal / forest / red / cyan / steel — see references/svg-style.md): ${foreign.join(" ")}`);
  }
  if (neon.length > 0) {
    warns.push(`near-neon saturation (only --codex-cyan #1fcefb gets to do that, sparingly): ${neon.join(" ")}`);
  }

  const tiny = [...svg.matchAll(/font-size="(\d+(?:\.\d+)?)"/g)]
    .map((m) => parseFloat(m[1]))
    .filter((px) => px < 12);
  if (tiny.length > 0) {
    warns.push(`font-size ${Math.min(...tiny)} < 12 — unreadable at article width`);
  }

  if (problems.length > 0) {
    failed = true;
    console.log(`✗ ${file}`);
    for (const p of problems) console.log(`    FAIL ${p}`);
  } else {
    console.log(`✓ ${file}`);
  }
  for (const w of warns) console.log(`    warn ${w}`);
}

process.exit(failed ? 1 : 0);

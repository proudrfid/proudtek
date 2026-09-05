import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { expectedOgRasterPath, listOgRasterPaths, toOgRasterPath } from "../seo/og-raster";

const EDITORIAL_DIR = join(process.cwd(), "src", "content", "editorial");

function walkJson(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkJson(full, out);
    else if (entry.endsWith(".json")) out.push(full);
  }
  return out;
}

function svgHeroes(): string[] {
  const heroes = new Set<string>();
  for (const file of walkJson(EDITORIAL_DIR)) {
    let def: { heroImage?: unknown };
    try {
      def = JSON.parse(readFileSync(file, "utf8"));
    } catch {
      continue;
    }
    if (typeof def.heroImage === "string" && /\.svg$/i.test(def.heroImage)) heroes.add(def.heroImage);
  }
  return [...heroes].sort();
}

describe("og:image raster twins (Phase 2 T6)", () => {
  it("maps SVG urls to /og/…jpg and leaves rasters alone", () => {
    expect(expectedOgRasterPath("/diagrams/blog/x.svg")).toBe("/og/diagrams/blog/x.jpg");
    expect(expectedOgRasterPath("https://proudtek.com/diagrams/blog/x.svg")).toBe("/og/diagrams/blog/x.jpg");
    expect(expectedOgRasterPath("/site-assets/photo.jpg")).toBeNull();
    expect(toOgRasterPath("/diagrams/does-not-exist.svg")).toBeNull();
  });

  it("has a committed 1200×630 JPEG twin for every SVG hero image", () => {
    const heroes = svgHeroes();
    expect(heroes.length).toBeGreaterThan(0);
    const missing = heroes.filter((hero) => toOgRasterPath(hero) === null);
    expect(missing, `run: node scripts/build-og-rasters.mjs — missing twins:\n${missing.join("\n")}`).toEqual([]);
  });

  it("keeps no orphan twins", () => {
    const expected = new Set(svgHeroes().map((hero) => expectedOgRasterPath(hero)));
    const orphans = [...listOgRasterPaths()].filter((path) => !expected.has(path));
    expect(orphans).toEqual([]);
  });
});

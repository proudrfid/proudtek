#!/usr/bin/env node
/**
 * Sitemap dead-URL audit (PR-S1-D Sprint 1).
 *
 * Reads every <loc> URL in dist/sitemap.xml and asserts each maps to
 * an actual dist file. Catches situations where:
 *   - A page was renamed but sitemap-gen kept the old URL
 *   - A page was removed but sitemap-gen still includes it
 *   - The sitemap-gen logic emits URLs that the route matcher doesn't
 *     actually produce (e.g., off-by-one in pagination)
 *
 * URL → file mapping:
 *   https://proudtek.com/                  → dist/index.html
 *   https://proudtek.com/about/            → dist/about/index.html
 *   https://proudtek.com/blog/foo-guide/   → dist/blog/foo-guide/index.html
 *
 * Exit codes:
 *   0  all URLs have files (or only ignored ones missing)
 *   1  one or more dead URLs found
 *   2  setup error (sitemap missing, malformed, etc.)
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(__filename), "..");
const DIST = path.join(REPO_ROOT, "dist");
const SITEMAP = path.join(DIST, "sitemap.xml");

const SITE_ORIGIN = "https://proudtek.com";

async function main() {
  let xml;
  try {
    xml = await fs.readFile(SITEMAP, "utf8");
  } catch (err) {
    console.error(`[audit-sitemap] cannot read ${SITEMAP}: ${err.message}`);
    process.exit(2);
  }

  const locMatches = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)];
  if (locMatches.length === 0) {
    console.error("[audit-sitemap] sitemap has zero <loc> entries");
    process.exit(2);
  }

  const total = locMatches.length;
  const dead = [];
  for (const m of locMatches) {
    const url = m[1];
    if (!url.startsWith(SITE_ORIGIN)) {
      // External URL — shouldn't happen but ignore if it does.
      continue;
    }
    const route = url.slice(SITE_ORIGIN.length) || "/";
    // Map / → /index.html, /foo/ → /foo/index.html
    const filePath = path.join(
      DIST,
      route.endsWith("/") ? route + "index.html" : route,
    );
    try {
      const stat = await fs.stat(filePath);
      if (!stat.isFile()) {
        dead.push({ url, filePath, reason: "not a file" });
      }
    } catch {
      dead.push({ url, filePath, reason: "ENOENT" });
    }
  }

  const alive = total - dead.length;
  console.log(`[audit-sitemap] checked ${total} URLs`);
  console.log(`  alive: ${alive}`);
  console.log(`  dead:  ${dead.length}`);

  if (dead.length > 0) {
    console.log("");
    console.log("Dead URLs (first 20):");
    for (const d of dead.slice(0, 20)) {
      console.log(`  ${d.url}`);
      console.log(`    expected file: ${path.relative(REPO_ROOT, d.filePath)} (${d.reason})`);
    }
    if (dead.length > 20) {
      console.log(`  ... and ${dead.length - 20} more`);
    }
    process.exit(1);
  }

  console.log("");
  console.log("[OK] every sitemap URL maps to a built dist file");
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});

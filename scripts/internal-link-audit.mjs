#!/usr/bin/env node
/**
 * Internal-link topology audit for editorial pages.
 *
 * Scans all editorial JSON definitions and reports:
 *  1. Orphan pages (0 inbound links from other editorial pages)
 *  2. Broken internal links (href points to non-existent route)
 *  3. In-degree / out-degree distribution per page
 *  4. Weakly-connected clusters and isolated subgraphs
 *  5. Link concentration (pages with disproportionate link share)
 *  6. Self-links and duplicate links within a page
 */
import fs from "node:fs/promises";
import path from "node:path";
import { glob } from "node:fs";
import { promisify } from "node:util";

const globP = promisify(glob);

const EDITORIAL_DIR = path.join(process.cwd(), "src", "content", "editorial");
const PAGES_DIR = path.join(process.cwd(), "src", "data", "pages");

// ---------------------------------------------------------------------------
// Link rewrite map (mirrors editorial-pages.ts)
// ---------------------------------------------------------------------------

/**
 * Dynamically extract link rewrites from editorial-pages.ts at audit time.
 * Parses the EDITORIAL_LINK_REWRITES map using regex to stay in sync.
 */
async function loadLinkRewrites() {
  const src = await fs.readFile(
    path.join(process.cwd(), "src", "lib", "editorial-pages.ts"),
    "utf8",
  );
  const map = {};
  // Match entries like: "/old/route/": { href: "/new/route/", ... }
  const re = /"([^"]+)":\s*\{\s*href:\s*"([^"]+)"/g;
  // Only capture entries inside the EDITORIAL_LINK_REWRITES block
  const blockMatch = src.match(
    /const EDITORIAL_LINK_REWRITES[^=]*=\s*\{([\s\S]*?)\n\};/,
  );
  if (blockMatch) {
    let m;
    while ((m = re.exec(blockMatch[1])) !== null) {
      map[m[1]] = m[2];
    }
  }
  return map;
}

let LINK_REWRITES = {};

function rewriteHref(href) {
  return LINK_REWRITES[href] ?? href;
}

// ---------------------------------------------------------------------------
// Extract all outbound links from one editorial definition
// ---------------------------------------------------------------------------

/** Extract markdown-style links from text: [label](href) */
function extractInlineLinks(text) {
  if (!text) return [];
  const links = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    links.push(m[2]);
  }
  return links;
}

function collectOutboundLinks(def) {
  const hrefs = new Set();

  // primaryAction
  if (def.primaryAction?.href) hrefs.add(rewriteHref(def.primaryAction.href));

  // secondaryActions
  for (const a of def.secondaryActions ?? []) {
    if (a.href) hrefs.add(rewriteHref(a.href));
  }

  // brief fields — links
  for (const field of def.brief ?? []) {
    for (const link of field.links ?? []) {
      if (link.href) hrefs.add(rewriteHref(link.href));
    }
  }

  // sections
  for (const s of def.sections ?? []) {
    // callout
    if (s.callout?.href) hrefs.add(rewriteHref(s.callout.href));

    // inline links in text fields
    for (const href of extractInlineLinks(s.intro)) hrefs.add(rewriteHref(href));
    for (const p of s.paragraphs ?? []) {
      for (const href of extractInlineLinks(p)) hrefs.add(rewriteHref(href));
    }
    for (const b of s.bullets ?? []) {
      for (const href of extractInlineLinks(b)) hrefs.add(rewriteHref(href));
    }
  }

  // resourceCards
  for (const card of def.resourceCards ?? []) {
    for (const link of card.links ?? []) {
      if (link.href) hrefs.add(rewriteHref(link.href));
    }
  }

  // FAQ inline links
  for (const f of def.faq ?? []) {
    for (const href of extractInlineLinks(f.answer)) hrefs.add(rewriteHref(href));
    for (const href of extractInlineLinks(f.question)) hrefs.add(rewriteHref(href));
  }

  // Remove self-links — track separately
  const selfLink = hrefs.has(def.route);
  hrefs.delete(def.route);

  // Filter to internal links only (starts with /)
  const internal = new Set([...hrefs].filter(h => h.startsWith("/")));

  return { internal, selfLink, allHrefs: hrefs };
}

// ---------------------------------------------------------------------------
// Load all WP page routes from data/pages
// ---------------------------------------------------------------------------

async function loadWpRoutes() {
  const routes = new Set();
  try {
    const files = await globP(path.join(PAGES_DIR, "**/*.json"));
    for (const file of files) {
      const rel = path.relative(PAGES_DIR, file).replace(/\.json$/, "");
      const route = rel === "index" ? "/" : `/${rel}/`;
      routes.add(route);
    }
  } catch { /* no pages dir */ }
  return routes;
}

// ---------------------------------------------------------------------------
// BFS connected components
// ---------------------------------------------------------------------------

function findConnectedComponents(adjacency, nodes) {
  const visited = new Set();
  const components = [];

  for (const node of nodes) {
    if (visited.has(node)) continue;
    const component = [];
    const queue = [node];
    visited.add(node);
    while (queue.length > 0) {
      const current = queue.shift();
      component.push(current);
      for (const neighbor of adjacency.get(current) ?? []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    components.push(component);
  }

  return components.sort((a, b) => b.length - a.length);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // 0. Load link rewrites from editorial-pages.ts
  LINK_REWRITES = await loadLinkRewrites();

  // 1. Load all editorial definitions
  const files = await globP(path.join(EDITORIAL_DIR, "**/*.json"));
  const definitions = [];
  for (const file of files) {
    if (file.includes("_unused")) continue;
    const content = await fs.readFile(file, "utf8");
    definitions.push(JSON.parse(content));
  }

  // 2. Build route sets
  const editorialRoutes = new Set(definitions.map(d => d.route));
  const wpRoutes = await loadWpRoutes();
  const allKnownRoutes = new Set([...editorialRoutes, ...wpRoutes]);

  // Also add common non-page routes that are valid targets
  const specialRoutes = new Set([
    "/", "/about/", "/contact/", "/faq/", "/products/all/",
    "/products/", "/compare/", "/guides/", "/blog/", "/solutions/",
    "/compatibility/", "/industries/",
  ]);
  for (const r of specialRoutes) allKnownRoutes.add(r);

  // 3. Build link graph (editorial → editorial only for topology analysis)
  const outLinks = new Map();   // route → Set of editorial routes it links to
  const inLinks = new Map();    // route → Set of editorial routes linking to it
  const brokenLinks = [];       // { from, to }
  const selfLinks = [];         // routes with self-links
  const externalInternalLinks = []; // links to known non-editorial routes
  const unknownLinks = [];      // links to unknown routes

  for (const route of editorialRoutes) {
    outLinks.set(route, new Set());
    inLinks.set(route, new Set());
  }

  for (const def of definitions) {
    const { internal, selfLink } = collectOutboundLinks(def);

    if (selfLink) selfLinks.push(def.route);

    for (const href of internal) {
      // Normalize trailing slash
      const target = href.endsWith("/") ? href : href + "/";

      if (editorialRoutes.has(target)) {
        // Editorial → editorial link
        outLinks.get(def.route).add(target);
        inLinks.get(target).add(def.route);
      } else if (allKnownRoutes.has(target) || wpRoutes.has(target)) {
        // Link to WP page or known route — not broken, but not part of editorial graph
        externalInternalLinks.push({ from: def.route, to: target });
      } else {
        // Check without trailing slash
        const noSlash = target.replace(/\/+$/, "") + "/";
        if (allKnownRoutes.has(noSlash)) {
          externalInternalLinks.push({ from: def.route, to: noSlash });
        } else {
          unknownLinks.push({ from: def.route, to: href });
        }
      }
    }
  }

  // 4. Compute statistics
  const inDegrees = new Map();
  const outDegrees = new Map();
  for (const route of editorialRoutes) {
    inDegrees.set(route, inLinks.get(route)?.size ?? 0);
    outDegrees.set(route, outLinks.get(route)?.size ?? 0);
  }

  // Orphans: editorial pages with 0 inbound editorial links
  const orphans = [...editorialRoutes]
    .filter(r => inDegrees.get(r) === 0)
    .sort();

  // Group orphans by prefix
  const orphansByGroup = {};
  for (const r of orphans) {
    const group = r.split("/").filter(Boolean)[0] || "root";
    if (!orphansByGroup[group]) orphansByGroup[group] = [];
    orphansByGroup[group].push(r);
  }

  // ---------------------------------------------------------------------------
  // Report
  // ---------------------------------------------------------------------------

  console.log(`\n🔗 Internal Link Audit — ${definitions.length} editorial pages\n`);
  console.log(`   Known routes: ${allKnownRoutes.size} total (${editorialRoutes.size} editorial, ${wpRoutes.size} WP snapshot)\n`);

  // --- Broken links ---
  console.log(`\n❌ Unknown link targets (potentially broken): ${unknownLinks.length}`);
  if (unknownLinks.length > 0) {
    // Group by target
    const byTarget = {};
    for (const { from, to } of unknownLinks) {
      if (!byTarget[to]) byTarget[to] = [];
      byTarget[to].push(from);
    }
    const sorted = Object.entries(byTarget).sort((a, b) => b[1].length - a[1].length);
    for (const [target, sources] of sorted.slice(0, 30)) {
      console.log(`   ${target}  (linked from ${sources.length} page${sources.length > 1 ? "s" : ""})`);
      if (sources.length <= 3) {
        for (const s of sources) console.log(`     ← ${s}`);
      }
    }
    if (sorted.length > 30) console.log(`   ... and ${sorted.length - 30} more targets`);
  }

  // --- Orphan pages ---
  console.log(`\n🏝️  Orphan pages (0 inbound editorial links): ${orphans.length}`);
  for (const [group, routes] of Object.entries(orphansByGroup).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`   /${group}/ — ${routes.length} orphan${routes.length > 1 ? "s" : ""}`);
    for (const r of routes.slice(0, 5)) {
      const outDeg = outDegrees.get(r) ?? 0;
      console.log(`     ${r}  (out: ${outDeg})`);
    }
    if (routes.length > 5) console.log(`     ... and ${routes.length - 5} more`);
  }

  // --- Pages with 0 outbound editorial links ---
  const noOutbound = [...editorialRoutes].filter(r => outDegrees.get(r) === 0).sort();
  console.log(`\n🔇 Pages with 0 outbound editorial links: ${noOutbound.length}`);
  for (const r of noOutbound.slice(0, 10)) {
    console.log(`   ${r}  (in: ${inDegrees.get(r)})`);
  }
  if (noOutbound.length > 10) console.log(`   ... and ${noOutbound.length - 10} more`);

  // --- In-degree distribution ---
  console.log("\n📊 Inbound link distribution (editorial → editorial):");
  const inDegDist = {};
  for (const [, deg] of inDegrees) {
    const bucket = deg === 0 ? "0" : deg <= 2 ? "1–2" : deg <= 5 ? "3–5" : deg <= 10 ? "6–10" : "11+";
    inDegDist[bucket] = (inDegDist[bucket] ?? 0) + 1;
  }
  for (const bucket of ["0", "1–2", "3–5", "6–10", "11+"]) {
    if (inDegDist[bucket]) {
      const bar = "█".repeat(Math.ceil(inDegDist[bucket] / 5));
      console.log(`   ${bucket.padStart(4)} inbound: ${inDegDist[bucket].toString().padStart(4)} pages  ${bar}`);
    }
  }

  // --- Out-degree distribution ---
  console.log("\n📊 Outbound link distribution (editorial → editorial):");
  const outDegDist = {};
  for (const [, deg] of outDegrees) {
    const bucket = deg === 0 ? "0" : deg <= 2 ? "1–2" : deg <= 5 ? "3–5" : deg <= 10 ? "6–10" : "11+";
    outDegDist[bucket] = (outDegDist[bucket] ?? 0) + 1;
  }
  for (const bucket of ["0", "1–2", "3–5", "6–10", "11+"]) {
    if (outDegDist[bucket]) {
      const bar = "█".repeat(Math.ceil(outDegDist[bucket] / 5));
      console.log(`   ${bucket.padStart(4)} outbound: ${outDegDist[bucket].toString().padStart(4)} pages  ${bar}`);
    }
  }

  // --- Top linked-to pages (highest in-degree) ---
  const topInbound = [...inDegrees.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15);
  console.log("\n🌟 Most linked-to editorial pages (top 15):");
  for (const [route, deg] of topInbound) {
    console.log(`   ${deg.toString().padStart(3)} inbound  ${route}`);
  }

  // --- Link concentration by group ---
  console.log("\n📈 Average in-degree / out-degree by route prefix:");
  const groupStats = {};
  const prefixes = ["/products/", "/industries/", "/solutions/", "/compare/", "/guides/", "/blog/", "/compatibility/", "/contact/"];
  for (const prefix of prefixes) {
    const routes = [...editorialRoutes].filter(r => r.startsWith(prefix));
    if (routes.length === 0) continue;
    const avgIn = routes.reduce((s, r) => s + inDegrees.get(r), 0) / routes.length;
    const avgOut = routes.reduce((s, r) => s + outDegrees.get(r), 0) / routes.length;
    const zeroIn = routes.filter(r => inDegrees.get(r) === 0).length;
    console.log(`   ${prefix.padEnd(18)} ${routes.length.toString().padStart(3)} pages  avg-in ${avgIn.toFixed(1).padStart(4)}  avg-out ${avgOut.toFixed(1).padStart(4)}  orphans ${zeroIn}`);
  }

  // --- Connected components (undirected) ---
  const adjacency = new Map();
  for (const route of editorialRoutes) {
    adjacency.set(route, new Set());
  }
  for (const [from, tos] of outLinks) {
    for (const to of tos) {
      adjacency.get(from).add(to);
      adjacency.get(to).add(from);
    }
  }

  const components = findConnectedComponents(adjacency, editorialRoutes);
  console.log(`\n🔀 Connected components: ${components.length}`);
  if (components.length > 1) {
    for (let i = 0; i < Math.min(components.length, 30); i++) {
      const comp = components[i];
      console.log(`   Component ${i + 1}: ${comp.length} pages`);
      for (const r of comp.slice(0, 3)) {
        console.log(`     ${r}`);
      }
      if (comp.length > 3) console.log(`     ... and ${comp.length - 3} more`);
    }
  } else {
    console.log("   All editorial pages are in a single connected component ✓");
  }

  // --- Self-links ---
  if (selfLinks.length > 0) {
    console.log(`\n🔄 Self-links detected: ${selfLinks.length}`);
    for (const r of selfLinks.slice(0, 10)) {
      console.log(`   ${r}`);
    }
  }

  // --- Cross-group link matrix ---
  console.log("\n🗺️  Cross-group link flow (editorial → editorial):");
  const groupPrefixes = ["/products/", "/solutions/", "/compare/", "/guides/", "/blog/", "/industries/", "/compatibility/", "/contact/"];
  const matrix = {};
  for (const from of groupPrefixes) matrix[from] = {};

  for (const [fromRoute, tos] of outLinks) {
    const fromGroup = groupPrefixes.find(p => fromRoute.startsWith(p)) ?? "other";
    for (const toRoute of tos) {
      const toGroup = groupPrefixes.find(p => toRoute.startsWith(p)) ?? "other";
      if (!matrix[fromGroup]) matrix[fromGroup] = {};
      matrix[fromGroup][toGroup] = (matrix[fromGroup][toGroup] ?? 0) + 1;
    }
  }

  // Header
  const shortNames = groupPrefixes.map(p => p.replace(/\//g, "").slice(0, 6));
  console.log(`   ${"From \\ To".padEnd(16)} ${shortNames.map(n => n.padStart(7)).join("")}`);
  for (const from of groupPrefixes) {
    const fromShort = from.replace(/\//g, "").slice(0, 14);
    const cells = groupPrefixes.map(to => {
      const count = matrix[from]?.[to] ?? 0;
      return count === 0 ? "      ·" : String(count).padStart(7);
    });
    console.log(`   ${fromShort.padEnd(16)} ${cells.join("")}`);
  }

  console.log(`\n✅ Link audit complete.\n`);
}

main().catch(console.error);

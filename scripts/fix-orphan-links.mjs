#!/usr/bin/env node
/**
 * Fix orphan pages by injecting inbound links into related pages' resourceCards.
 *
 * Strategy:
 *  1. For each orphan, find the best "bridge" page in the main component
 *     based on route-keyword overlap and group affinity.
 *  2. Add a link to the orphan in the bridge page's resourceCards.
 *  3. Ensures every editorial page has ≥1 inbound editorial link.
 *
 * This script modifies JSON files in src/content/editorial/.
 * Run `node scripts/internal-link-audit.mjs` before and after to verify.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { glob } from "node:fs";
import { promisify } from "node:util";

const globP = promisify(glob);
const EDITORIAL_DIR = path.join(process.cwd(), "src", "content", "editorial");

// ---------------------------------------------------------------------------
// Load rewrite map from editorial-pages.ts
// ---------------------------------------------------------------------------

async function loadLinkRewrites() {
  const src = await fs.readFile(
    path.join(process.cwd(), "src", "lib", "editorial-pages.ts"),
    "utf8",
  );
  const map = {};
  const blockMatch = src.match(
    /const EDITORIAL_LINK_REWRITES[^=]*=\s*\{([\s\S]*?)\n\};/,
  );
  if (blockMatch) {
    const re = /"([^"]+)":\s*\{\s*href:\s*"([^"]+)"/g;
    let m;
    while ((m = re.exec(blockMatch[1])) !== null) {
      map[m[1]] = m[2];
    }
  }
  return map;
}

// ---------------------------------------------------------------------------
// Extract all outbound internal links from a definition
// ---------------------------------------------------------------------------

function extractInlineLinks(text) {
  if (!text) return [];
  const links = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let m;
  while ((m = re.exec(text)) !== null) links.push(m[2]);
  return links;
}

function collectOutboundHrefs(def, rewrites) {
  const rw = (h) => rewrites[h] ?? h;
  const hrefs = new Set();
  if (def.primaryAction?.href) hrefs.add(rw(def.primaryAction.href));
  for (const a of def.secondaryActions ?? []) if (a.href) hrefs.add(rw(a.href));
  for (const f of def.brief ?? [])
    for (const l of f.links ?? []) if (l.href) hrefs.add(rw(l.href));
  for (const s of def.sections ?? []) {
    if (s.callout?.href) hrefs.add(rw(s.callout.href));
    for (const h of extractInlineLinks(s.intro)) hrefs.add(rw(h));
    for (const p of s.paragraphs ?? []) for (const h of extractInlineLinks(p)) hrefs.add(rw(h));
    for (const b of s.bullets ?? []) for (const h of extractInlineLinks(b)) hrefs.add(rw(h));
  }
  for (const c of def.resourceCards ?? [])
    for (const l of c.links ?? []) if (l.href) hrefs.add(rw(l.href));
  for (const f of def.faq ?? []) {
    for (const h of extractInlineLinks(f.answer)) hrefs.add(rw(h));
    for (const h of extractInlineLinks(f.question)) hrefs.add(rw(h));
  }
  return new Set([...hrefs].filter((h) => h.startsWith("/")));
}

// ---------------------------------------------------------------------------
// Route keyword extraction for matching
// ---------------------------------------------------------------------------

function routeKeywords(route) {
  return route
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .flatMap((seg) => seg.split("-"))
    .filter((w) => w.length > 2);
}

function keywordOverlap(routeA, routeB) {
  const a = new Set(routeKeywords(routeA));
  const b = new Set(routeKeywords(routeB));
  const intersection = [...a].filter((w) => b.has(w)).length;
  return intersection / Math.max(a.size, b.size, 1);
}

// ---------------------------------------------------------------------------
// Group affinity: which groups should naturally link to each other
// ---------------------------------------------------------------------------

const GROUP_AFFINITY = {
  "blog": ["solutions", "guides", "compare"],
  "guides": ["solutions", "blog", "compare"],
  "compare": ["solutions", "products", "guides"],
  "solutions": ["products", "compare", "guides", "blog"],
  "products": ["solutions", "compare", "products"],
  "industries": ["solutions", "products", "blog"],
  "compatibility": ["solutions", "products", "guides"],
  "markets": ["lp", "products", "solutions"],
  "lp": ["products", "markets", "solutions"],
  "contact": ["solutions", "products"],
};

function getGroup(route) {
  return route.split("/").filter(Boolean)[0] || "root";
}

// ---------------------------------------------------------------------------
// Find best bridge page for an orphan
// ---------------------------------------------------------------------------

function findBestBridge(orphanRoute, orphanDef, mainComponentPages, defMap, orphanSet) {
  const orphanGroup = getGroup(orphanRoute);
  const affinities = GROUP_AFFINITY[orphanGroup] ?? ["solutions", "guides"];

  let bestRoute = null;
  let bestScore = -1;

  for (const candidateRoute of mainComponentPages) {
    // Never pick the orphan itself or another orphan as a bridge
    if (candidateRoute === orphanRoute) continue;
    if (orphanSet.has(candidateRoute)) continue;

    const candidateGroup = getGroup(candidateRoute);

    // Prefer affinity groups, but allow same-group
    const affinityBonus = affinities.includes(candidateGroup)
      ? 0.3
      : candidateGroup === orphanGroup
        ? 0.2
        : 0;

    // Keyword overlap
    const overlap = keywordOverlap(orphanRoute, candidateRoute);

    // Penalize pages that already have many resourceCard links (avoid overloading)
    const candidate = defMap.get(candidateRoute);
    const totalLinks = candidate?.resourceCards?.reduce((s, c) => s + (c.links?.length ?? 0), 0) ?? 0;
    const loadPenalty = totalLinks > 12 ? -0.15 : totalLinks > 8 ? -0.05 : 0;

    const score = overlap + affinityBonus + loadPenalty;

    if (score > bestScore) {
      bestScore = score;
      bestRoute = candidateRoute;
    }
  }

  return { bridgeRoute: bestRoute, score: bestScore };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const rewrites = await loadLinkRewrites();

  // Load all definitions
  const files = await globP(path.join(EDITORIAL_DIR, "**/*.json"));
  const defMap = new Map(); // route → def
  const fileMap = new Map(); // route → filePath
  for (const file of files) {
    if (file.includes("_unused")) continue;
    const content = await fs.readFile(file, "utf8");
    const def = JSON.parse(content);
    defMap.set(def.route, def);
    fileMap.set(def.route, file);
  }

  const editorialRoutes = new Set(defMap.keys());

  // Build in-links graph
  const inLinks = new Map();
  for (const route of editorialRoutes) inLinks.set(route, new Set());

  for (const [fromRoute, def] of defMap) {
    const outbound = collectOutboundHrefs(def, rewrites);
    for (const href of outbound) {
      const target = href.endsWith("/") ? href : href + "/";
      if (editorialRoutes.has(target) && target !== fromRoute) {
        inLinks.get(target)?.add(fromRoute);
      }
    }
  }

  // Find orphans (0 inbound)
  const orphans = [...editorialRoutes].filter((r) => (inLinks.get(r)?.size ?? 0) === 0);

  // BFS to find main component
  const outLinks = new Map();
  for (const route of editorialRoutes) outLinks.set(route, new Set());
  for (const [fromRoute, def] of defMap) {
    const outbound = collectOutboundHrefs(def, rewrites);
    for (const href of outbound) {
      const target = href.endsWith("/") ? href : href + "/";
      if (editorialRoutes.has(target) && target !== fromRoute) {
        outLinks.get(fromRoute).add(target);
      }
    }
  }

  // Find largest connected component
  const adjacency = new Map();
  for (const route of editorialRoutes) adjacency.set(route, new Set());
  for (const [from, tos] of outLinks) {
    for (const to of tos) {
      adjacency.get(from).add(to);
      adjacency.get(to).add(from);
    }
  }

  const visited = new Set();
  let largestComponent = [];
  for (const route of editorialRoutes) {
    if (visited.has(route)) continue;
    const component = [];
    const queue = [route];
    visited.add(route);
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
    if (component.length > largestComponent.length) {
      largestComponent = component;
    }
  }

  const mainComponent = new Set(largestComponent);

  console.log(`\n🔧 Orphan Link Fixer`);
  console.log(`   Total pages: ${editorialRoutes.size}`);
  console.log(`   Main component: ${mainComponent.size} pages`);
  console.log(`   Orphans: ${orphans.length}`);
  console.log(`   Mode: ${dryRun ? "DRY RUN" : "LIVE (writing files)"}\n`);

  // For each orphan, find the best bridge and plan the link injection
  const injections = []; // { bridgeRoute, orphanRoute, orphanTitle }
  const orphanSet = new Set(orphans);

  // Expand candidate pool: use ALL editorial pages, not just main component
  // (orphans outside the main component still need bridges from non-orphan pages)
  const nonOrphanPages = [...editorialRoutes].filter((r) => !orphanSet.has(r));

  for (const orphanRoute of orphans) {
    const orphanDef = defMap.get(orphanRoute);
    if (!orphanDef) continue;

    const { bridgeRoute, score } = findBestBridge(
      orphanRoute,
      orphanDef,
      nonOrphanPages,
      defMap,
      orphanSet,
    );

    if (bridgeRoute) {
      injections.push({
        bridgeRoute,
        orphanRoute,
        orphanTitle: orphanDef.title,
        score,
      });
    }
  }

  // Group injections by bridge page to batch edits
  // Limit each bridge to MAX_PER_BRIDGE injections; overflow gets re-assigned
  const MAX_PER_BRIDGE = 5;
  const byBridge = new Map();
  const overflow = [];

  for (const inj of injections) {
    if (!byBridge.has(inj.bridgeRoute)) byBridge.set(inj.bridgeRoute, []);
    const bucket = byBridge.get(inj.bridgeRoute);
    if (bucket.length < MAX_PER_BRIDGE) {
      bucket.push(inj);
    } else {
      overflow.push(inj);
    }
  }

  // Re-assign overflow to second-best bridges
  for (const inj of overflow) {
    // Find a different bridge that isn't full
    let placed = false;
    const orphanGroup = getGroup(inj.orphanRoute);
    const affinities = GROUP_AFFINITY[orphanGroup] ?? ["solutions", "guides"];

    // Sort non-orphan pages by keyword overlap, pick first that isn't full
    const candidates = nonOrphanPages
      .filter((r) => r !== inj.orphanRoute && r !== inj.bridgeRoute)
      .map((r) => ({ route: r, score: keywordOverlap(inj.orphanRoute, r) + (affinities.includes(getGroup(r)) ? 0.3 : 0) }))
      .sort((a, b) => b.score - a.score);

    for (const cand of candidates) {
      if (!byBridge.has(cand.route)) byBridge.set(cand.route, []);
      if (byBridge.get(cand.route).length < MAX_PER_BRIDGE) {
        byBridge.get(cand.route).push({ ...inj, bridgeRoute: cand.route });
        placed = true;
        break;
      }
    }

    if (!placed) {
      // Last resort: put it in original bridge anyway
      byBridge.get(inj.bridgeRoute)?.push(inj);
    }
  }

  console.log(`   Bridge pages to edit: ${byBridge.size}`);
  console.log(`   Links to inject: ${injections.length}\n`);

  // Apply injections
  let editCount = 0;
  for (const [bridgeRoute, links] of byBridge) {
    const filePath = fileMap.get(bridgeRoute);
    const def = defMap.get(bridgeRoute);
    if (!filePath || !def) continue;

    // Find or create "Related pages" resourceCard
    let relatedCard = def.resourceCards.find(
      (c) => c.title === "Related pages" || c.title === "See also",
    );

    if (!relatedCard) {
      relatedCard = {
        title: "Related pages",
        description: "Explore related topics and products.",
        links: [],
      };
      def.resourceCards.push(relatedCard);
    }

    // Add orphan links (avoid duplicates)
    const existingHrefs = new Set(relatedCard.links.map((l) => l.href));
    let addedCount = 0;
    for (const { orphanRoute, orphanTitle } of links) {
      if (!existingHrefs.has(orphanRoute)) {
        relatedCard.links.push({
          href: orphanRoute,
          label: orphanTitle,
        });
        existingHrefs.add(orphanRoute);
        addedCount++;
      }
    }

    if (addedCount > 0) {
      if (dryRun) {
        console.log(
          `   [dry] ${bridgeRoute} ← +${addedCount} link${addedCount > 1 ? "s" : ""}: ${links.map((l) => l.orphanRoute).join(", ")}`,
        );
      } else {
        await fs.writeFile(filePath, JSON.stringify(def, null, 2) + "\n", "utf8");
        editCount++;
      }
    }
  }

  if (dryRun) {
    console.log(`\n   Would edit ${byBridge.size} files. Run without --dry-run to apply.`);
  } else {
    console.log(`\n   ✅ Edited ${editCount} files with ${injections.length} new links.`);
  }
}

main().catch(console.error);

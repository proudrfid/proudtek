import fs from "node:fs/promises";
import path from "node:path";
import { getCollection } from "astro:content";

import { mergeCatalogPages } from "./catalog-pages";
import { mergeEditorialPages } from "./editorial-pages";
import { mergeUtilityPages } from "./utility-pages";
import { initBlogDefinitions } from "./seo";

export interface SnapshotPage {
  route: string;
  sourceUrl: string;
  title: string;
  htmlAttrs: Record<string, string>;
  bodyAttrs: Record<string, string>;
  headHtml: string;
  bodyHtml: string;
}

export interface SiteData {
  generatedAt: string;
  siteOrigin: string;
  pageCount: number;
  pages: SnapshotPage[];
}

// ---------------------------------------------------------------------------
// Caches
// ---------------------------------------------------------------------------

/**
 * Merged SiteData containing stub pages (for WP snapshots) and full-content
 * synthetic pages (produced by the merge pipeline). Only route/title/sourceUrl
 * are populated for stubs; call `getPageByRoute()` or `loadPageFromDisk()` to
 * obtain the full HTML.
 */
let siteDataCache: SiteData | null = null;

/**
 * After the merge pipeline runs, synthetic pages (generated in-memory) are
 * stored here so `getPageByRoute` can return them without a disk read.
 */
let syntheticPageMap: Map<string, SnapshotPage> | null = null;

/** Set of routes that exist as on-disk page files (WP snapshots). */
let diskRouteSet: Set<string> | null = null;

// ---------------------------------------------------------------------------
// File-path helpers
// ---------------------------------------------------------------------------

const PAGES_DIR = path.join(process.cwd(), "src", "data", "pages");

/** Convert a route to its on-disk JSON file path. */
function routeToFilePath(route: string): string {
  const slug = route.replace(/^\/+|\/+$/g, "") || "index";
  return path.join(PAGES_DIR, `${slug}.json`);
}

// ---------------------------------------------------------------------------
// Core loaders
// ---------------------------------------------------------------------------

/**
 * Load a single WP snapshot page from its on-disk JSON file.
 * This is the primary mechanism for obtaining full page HTML without loading
 * the entire dataset into memory.
 */
export async function loadPageFromDisk(route: string): Promise<SnapshotPage> {
  const filePath = routeToFilePath(route);
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content) as SnapshotPage;
}

/**
 * Return the full SiteData object (stub pages + synthetic pages).
 *
 * WP snapshot pages are represented as lightweight stubs with empty HTML
 * fields. Synthetic pages produced by the merge pipeline carry full content.
 * Use `getPageByRoute()` to load the complete HTML for any page.
 */
export async function getSiteData(): Promise<SiteData> {
  if (!siteDataCache) {
    // Load WP page metadata from Content Collections (type-safe, Zod-validated)
    const wpEntries = await getCollection("wpPages");

    // Build a set of routes that live on disk
    diskRouteSet = new Set(wpEntries.map((e) => e.data.route));

    // Extract site-level metadata from the first entry
    const siteOrigin = wpEntries[0]?.data.siteOrigin ?? "https://proudtek.com";
    const generatedAt = wpEntries[0]?.data.generatedAt ?? new Date().toISOString();

    // Create lightweight stubs for all WP pages
    const stubPages: SnapshotPage[] = wpEntries.map((e) => ({
      route: e.data.route,
      sourceUrl: e.data.sourceUrl,
      title: e.data.title,
      htmlAttrs: {},
      bodyAttrs: {},
      headHtml: "",
      bodyHtml: "",
    }));

    const stubData: SiteData = {
      generatedAt,
      siteOrigin,
      pageCount: wpEntries.length,
      pages: stubPages,
    };

    // Pre-load blog definitions cache (sync access needed during page SEO)
    await initBlogDefinitions();

    // Run the merge pipeline (now async — merge functions load pages on demand)
    const merged = await mergeEditorialPages(await mergeUtilityPages(await mergeCatalogPages(stubData)));

    // Identify which pages are synthetic (have content) vs stubs (empty bodyHtml)
    syntheticPageMap = new Map<string, SnapshotPage>();
    for (const page of merged.pages) {
      if (page.bodyHtml) {
        syntheticPageMap.set(page.route, page);
      }
    }

    siteDataCache = merged;
  }

  return siteDataCache;
}

/**
 * Load a complete page by route. For synthetic pages the in-memory version is
 * returned; for WP snapshots the on-disk JSON file is read.
 */
export async function getPageByRoute(route: string): Promise<SnapshotPage | undefined> {
  // Ensure merge pipeline has run (populates syntheticPageMap & diskRouteSet)
  await getSiteData();

  // Synthetic page (editorial / catalog / utility)?
  const synthetic = syntheticPageMap?.get(route);
  if (synthetic) {
    return synthetic;
  }

  // WP snapshot page on disk?
  if (diskRouteSet?.has(route)) {
    try {
      return await loadPageFromDisk(route);
    } catch {
      return undefined;
    }
  }

  return undefined;
}

export function routeToParam(route: string): string {
  return route.replace(/^\/+|\/+$/g, "");
}

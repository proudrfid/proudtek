import fs from "node:fs/promises";
import path from "node:path";

import { mergeCatalogPages } from "./catalog-pages";
import { mergeEditorialPages } from "./editorial-pages";
import { mergeUtilityPages } from "./utility-pages";

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

let cache: SiteData | null = null;

async function readSiteDataFile(): Promise<SiteData> {
  const siteDataPath = path.join(process.cwd(), "src", "data", "site-data.json");
  const content = await fs.readFile(siteDataPath, "utf8");
  const siteData = JSON.parse(content) as SiteData;

  // Layer local improvements on top of the fetched WordPress snapshot so
  // synthetic catalog, utility, and editorial pages participate in routing.
  return mergeEditorialPages(mergeUtilityPages(mergeCatalogPages(siteData)));
}

export async function getSiteData(): Promise<SiteData> {
  if (!cache) {
    cache = await readSiteDataFile();
  }

  return cache;
}

export async function getPageByRoute(route: string): Promise<SnapshotPage | undefined> {
  const siteData = await getSiteData();
  return siteData.pages.find((page) => page.route === route);
}

export function routeToParam(route: string): string {
  return route.replace(/^\/+|\/+$/g, "");
}

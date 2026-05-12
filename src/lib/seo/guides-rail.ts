/**
 * Guide Clusters left-rail — mirrors blog-body.ts buildBlogTopicsRailHtml.
 *
 * Renders a `<aside id="codex-catalog-rail-panel">` with one entry per
 * GUIDE_CLUSTERS plus an "All guides" link. The toggle button + backdrop
 * markup is the same shape blog-body uses, so the existing JS handler
 * (.codex-catalog-rail-toggle in PageScript.astro) drives both.
 *
 * Used by:
 *   - enhance-page.ts (cheerio inject) for /guides/ hub + /guides/{slug}/ single-pages
 *   - src/pages/guides/[cluster].astro (server-side render) for cluster hubs
 */
import {
  GUIDE_CLUSTERS,
  getClusterForGuideSlug,
  getTotalGuideCount,
} from "../../data/guide-clusters";
import { buildRailHtml } from "./rail";

/**
 * Thin wrapper around the shared `buildRailHtml`. Keeps the existing
 * function signature so call sites in src/pages/guides/* and
 * src/lib/seo/enhance-page.ts don't change.
 *
 * @param activeClusterId  Highlight this cluster as the current page.
 *                         Pass undefined for the /guides/ hub itself
 *                         (then "All guides" gets the active state).
 */
export function buildGuideClustersRailHtml(activeClusterId?: string): string {
  return buildRailHtml({
    modifier: "guides",
    groupLabel: "Clusters",
    toggleIcon: "📚",
    toggleAriaLabel: "Show guide clusters",
    asideAriaLabel: "Guide clusters",
    closeAriaLabel: "Close clusters",
    items: GUIDE_CLUSTERS.map((c) => ({
      id: c.id,
      label: c.label,
      icon: c.icon,
      count: c.slugs.length,
      href: `/guides/${c.id}/`,
    })),
    allLink: {
      label: "All guides",
      icon: "📖",
      href: "/guides/",
      count: getTotalGuideCount(),
    },
    activeId: activeClusterId,
  });
}

/**
 * Resolve the "active" cluster for any /guides/* route.
 *  - /guides/                    → undefined (highlight "All guides")
 *  - /guides/{cluster}/          → cluster id
 *  - /guides/{guide-slug}/       → cluster id of the guide (via lookup)
 *  - any other route             → undefined
 */
export function getActiveClusterForGuidesRoute(route: string): string | undefined {
  if (route === "/guides/") return undefined;
  const m = route.match(/^\/guides\/([^/]+)\/$/);
  if (!m) return undefined;
  const slug = m[1];
  // If slug is itself a cluster id, return it.
  if (GUIDE_CLUSTERS.some((c) => c.id === slug)) return slug;
  // Otherwise look up which cluster the guide belongs to.
  return getClusterForGuideSlug(slug)?.id;
}

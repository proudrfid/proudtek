/**
 * Compatibility-page left-rail.
 *
 * Thin wrapper around the shared `buildRailHtml` so the rail markup is
 * byte-identical to /blog/, /guides/ and /compare/ rails (same toggle +
 * backdrop + <aside> shape; shared filter script handles toggling and
 * in-place filtering on the hub).
 *
 * Companion to:
 *   - src/lib/seo/blog-rail   (blog)
 *   - src/lib/seo/guides-rail (guides)
 *   - src/lib/seo/compare-rail (compare)
 * Consumed by:
 *   - src/pages/compatibility/index.astro (hub, in-place filter mode)
 *   - src/lib/seo/enhance-page.ts (single /compatibility/{slug}/ pages,
 *     navigate-back mode via injectHubRail helper)
 */
import {
  COMPATIBILITY_CATEGORIES,
  COMPATIBILITY_VENDORS,
} from "../../data/compatibility-vendors";
import { buildRailHtml } from "./rail";

/**
 * @param activeCategoryId  Highlight this category as the current page.
 *                          Pass undefined for the /compatibility/ hub
 *                          itself (then "All vendors" gets the active
 *                          state).
 */
export function buildCompatibilityRailHtml(activeCategoryId?: string): string {
  // Count vendors per category for the rail badges.
  const counts: Record<string, number> = {};
  for (const v of COMPATIBILITY_VENDORS) {
    counts[v.category] = (counts[v.category] ?? 0) + 1;
  }

  return buildRailHtml({
    modifier: "compatibility",
    groupLabel: "Vendor groups",
    toggleIcon: "🔐",
    toggleAriaLabel: "Show hotel-lock vendor groups",
    asideAriaLabel: "Hotel-lock vendor groups",
    closeAriaLabel: "Close vendor groups",
    items: COMPATIBILITY_CATEGORIES.map((c) => ({
      id: c.id,
      label: c.label,
      icon: c.icon,
      count: counts[c.id] ?? 0,
      // Anchor to the hub section; the shared filter script intercepts
      // clicks on /compatibility/ itself, on sub-pages this navigates back.
      href: `/compatibility/#vendor-group-${c.id}`,
    })),
    allLink: {
      label: "All vendors",
      icon: "🔐",
      href: "/compatibility/#compatibility-all",
      count: COMPATIBILITY_VENDORS.length,
    },
    activeId: activeCategoryId,
  });
}

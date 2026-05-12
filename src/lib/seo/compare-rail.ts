/**
 * Compare-page left-rail — mirrors guides-rail.ts buildGuideClustersRailHtml.
 *
 * Renders a `<aside id="codex-catalog-rail-panel">` with one entry per
 * COMPARE_CATEGORIES plus an "All comparisons" link. The toggle button +
 * backdrop markup is the same shape blog-body / guides-rail uses, so the
 * existing JS handler (.codex-catalog-rail-toggle in PageScript / hub scripts)
 * drives both.
 *
 * Used by:
 *   - src/pages/compare/index.astro       — hub page with all 28 compare cards
 *   - src/pages/compare/[category].astro  — sub-category hubs (chip vs chip,
 *     reader vs reader, form factor & material, frequency & tech)
 *   - enhance-page.ts (cheerio inject)    — per-compare-page left rail so the
 *     per-page rail matches the hub
 */
import {
  COMPARE_CATEGORIES,
  getTotalCompareCount,
} from "../../data/compare-categories";
import { buildRailHtml } from "./rail";

/**
 * Thin wrapper around the shared `buildRailHtml`. Keeps the existing
 * function signature so call sites in src/pages/compare/* and
 * src/lib/seo/enhance-page.ts don't change.
 *
 * @param activeCategoryId  Highlight this category as the current page.
 *                          Pass undefined for the /compare/ hub itself
 *                          (then "All comparisons" gets the active state).
 */
export function buildCompareCategoriesRailHtml(activeCategoryId?: string): string {
  return buildRailHtml({
    modifier: "compare",
    groupLabel: "Categories",
    toggleIcon: "⚖️",
    toggleAriaLabel: "Show comparison categories",
    asideAriaLabel: "Comparison categories",
    closeAriaLabel: "Close categories",
    items: COMPARE_CATEGORIES.map((c) => ({
      id: c.id,
      label: c.label,
      icon: c.icon,
      count: c.slugs.length,
      href: `/compare/${c.id}/`,
    })),
    allLink: {
      label: "All comparisons",
      icon: "⚖️",
      href: "/compare/",
      count: getTotalCompareCount(),
    },
    activeId: activeCategoryId,
  });
}


import { COMPARE_CATEGORIES } from "../data/compare-categories";

export interface NativeRouteDefinition {
  route: string;
  /** Exclude a same-route snapshot from the catch-all static path generator. */
  ownsStaticPath: boolean;
  /** Append this route to sitemap.xml because the site-data feed omits it. */
  supplementSitemap: boolean;
}

/**
 * Single registry for routes rendered by dedicated native Astro pages.
 *
 * The two booleans deliberately preserve today's behavior. Some native pages
 * already exist in siteData and therefore only need catch-all exclusion;
 * others are absent from siteData and need a sitemap supplement. Keeping those
 * responsibilities explicit prevents the duplicate-route and duplicate-
 * sitemap drift that two independent route arrays caused.
 */
export const NATIVE_ROUTE_DEFINITIONS: readonly NativeRouteDefinition[] = [
  { route: "/blog/", ownsStaticPath: true, supplementSitemap: false },
  { route: "/guides/", ownsStaticPath: true, supplementSitemap: true },
  { route: "/compare/", ownsStaticPath: true, supplementSitemap: true },
  { route: "/compatibility/", ownsStaticPath: true, supplementSitemap: false },
  { route: "/solutions/", ownsStaticPath: true, supplementSitemap: false },
  // Preserve the current sitemap supplement until the known duplicate is fixed
  // in a dedicated, contract-allowlisted SEO cleanup PR.
  { route: "/case-studies/", ownsStaticPath: true, supplementSitemap: true },
  { route: "/rfq/", ownsStaticPath: false, supplementSitemap: true },
  { route: "/glossary/", ownsStaticPath: false, supplementSitemap: true },
  { route: "/tools/rfid-tag-cost-estimator/", ownsStaticPath: false, supplementSitemap: true },
  ...COMPARE_CATEGORIES.map((category) => ({
    route: `/compare/${category.id}/`,
    ownsStaticPath: true,
    supplementSitemap: false,
  })),
];

const nativeRouteSet = new Set(NATIVE_ROUTE_DEFINITIONS.map((entry) => entry.route));
const nativeStaticPathSet = new Set(
  NATIVE_ROUTE_DEFINITIONS.filter((entry) => entry.ownsStaticPath).map((entry) => entry.route),
);

export function isNativeRoute(route: string): boolean {
  return nativeRouteSet.has(route);
}

export function isNativeOwnedStaticPath(route: string): boolean {
  return nativeStaticPathSet.has(route);
}

export function getNativeRoutes(): readonly string[] {
  return NATIVE_ROUTE_DEFINITIONS.map((entry) => entry.route);
}

export function getNativeSitemapSupplementRoutes(): readonly string[] {
  return NATIVE_ROUTE_DEFINITIONS
    .filter((entry) => entry.supplementSitemap)
    .map((entry) => entry.route);
}

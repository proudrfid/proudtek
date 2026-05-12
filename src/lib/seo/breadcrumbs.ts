/**
 * Breadcrumb constructors for editorial / product / collection pages.
 *
 * Walks the canonical route and produces a `BreadcrumbItem[]` chain
 * (Home → Section → Page) for the JSON-LD `BreadcrumbList` schema and
 * the on-page breadcrumb UI.
 *
 * Extracted from seo.ts during the P2 split (2026-05-08).
 */
import type { BreadcrumbItem } from "../seo";

import { absoluteUrl, resolveCanonicalRoute } from "./utils";

export function buildBreadcrumbs(route: string, contentTitle: string): BreadcrumbItem[] {
  const canonicalRoute = resolveCanonicalRoute(route);
  const items: BreadcrumbItem[] = [{ name: "Home", url: absoluteUrl("/") }];

  if (canonicalRoute === "/") {
    return items;
  }

  if (canonicalRoute.startsWith("/product/")) {
    items.push({ name: "Products", url: absoluteUrl("/products/all/") });
    items.push({ name: contentTitle, url: absoluteUrl(canonicalRoute) });
    return items;
  }

  if (/^\/20\d{2}\//.test(canonicalRoute)) {
    items.push({ name: "Blog", url: absoluteUrl("/blog/") });
    items.push({ name: contentTitle, url: absoluteUrl(canonicalRoute) });
    return items;
  }

  if (canonicalRoute === "/blog/") {
    items.push({ name: "Blog", url: absoluteUrl(canonicalRoute) });
    return items;
  }

  if (canonicalRoute.startsWith("/blog/")) {
    items.push({ name: "Blog", url: absoluteUrl("/blog/") });
    items.push({ name: contentTitle, url: absoluteUrl(canonicalRoute) });
    return items;
  }

  if (canonicalRoute.startsWith("/products/")) {
    items.push({ name: "Products", url: absoluteUrl("/products/all/") });

    if (canonicalRoute !== "/products/all/") {
      items.push({ name: contentTitle, url: absoluteUrl(canonicalRoute) });
    }

    return items;
  }

  if (canonicalRoute === "/solutions/") {
    items.push({ name: "Solutions", url: absoluteUrl(canonicalRoute) });
    return items;
  }

  if (canonicalRoute.startsWith("/solutions/")) {
    items.push({ name: "Solutions", url: absoluteUrl("/solutions/") });
    items.push({ name: contentTitle, url: absoluteUrl(canonicalRoute) });
    return items;
  }

  if (canonicalRoute === "/compare/") {
    items.push({ name: "Compare", url: absoluteUrl(canonicalRoute) });
    return items;
  }

  if (canonicalRoute.startsWith("/compare/")) {
    items.push({ name: "Compare", url: absoluteUrl("/compare/") });
    items.push({ name: contentTitle, url: absoluteUrl(canonicalRoute) });
    return items;
  }

  if (canonicalRoute === "/compatibility/") {
    items.push({ name: "Compatibility", url: absoluteUrl(canonicalRoute) });
    return items;
  }

  if (canonicalRoute.startsWith("/compatibility/")) {
    items.push({ name: "Compatibility", url: absoluteUrl("/compatibility/") });
    items.push({ name: contentTitle, url: absoluteUrl(canonicalRoute) });
    return items;
  }

  if (canonicalRoute === "/guides/") {
    items.push({ name: "Guides", url: absoluteUrl(canonicalRoute) });
    return items;
  }

  if (canonicalRoute.startsWith("/guides/")) {
    items.push({ name: "Guides", url: absoluteUrl("/guides/") });
    items.push({ name: contentTitle, url: absoluteUrl(canonicalRoute) });
    return items;
  }

  if (canonicalRoute.startsWith("/contact/") && canonicalRoute !== "/contact/") {
    items.push({ name: "Contact", url: absoluteUrl("/contact/") });
    items.push({ name: contentTitle, url: absoluteUrl(canonicalRoute) });
    return items;
  }

  items.push({ name: contentTitle, url: absoluteUrl(canonicalRoute) });
  return items;
}

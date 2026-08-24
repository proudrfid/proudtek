/**
 * Deterministic, build-time rollout controls for the progressive rebuild.
 *
 * Production never randomizes by user, cookie or user-agent. A route either
 * builds with the native shell/body for the entire deployment or it does not,
 * which prevents crawler/user divergence and CDN cache mixing.
 */

import LEAF_ROUTE_REGISTRY from "../../scripts/native-canary-leaf-routes.json";

export type ShellRenderer = "snapshot" | "native";
export type BodyRenderer =
  | "snapshot"
  | "editorial"
  | "native-home"
  | "native-hub"
  | "native-rfq";
export type DataRenderer = "legacy" | "catalog-v2";

export interface RouteRollout {
  route: string;
  shell: ShellRenderer;
  body: BodyRenderer;
  data: DataRenderer;
}

const enabled = (value: string | undefined): boolean => value === "1" || value === "true";

const NATIVE_SHELL_ENABLED = enabled(import.meta.env.PROUDTEK_NATIVE_SHELL);
const HOME_V2_ENABLED = enabled(import.meta.env.PROUDTEK_HOME_V2);
const CATALOG_V2_ENABLED = enabled(import.meta.env.PROUDTEK_CATALOG_V2);

/**
 * Exact-route canary allowlist.
 *
 * Base routes are the hub/index surfaces migrated in phases 1-5a (blog,
 * guides, solutions, compare + categories, glossary, tools, case-studies,
 * compatibility). Leaf routes — guide clusters, compatibility vendors, and
 * every guides/solutions/blog/compare editorial leaf — live in
 * scripts/native-canary-leaf-routes.json, the single registry shared with
 * scripts/native-shell-canary-audit.mjs and its tests. Add one route there
 * per migrated leaf; order is not significant.
 */
const NATIVE_SHELL_BASE_ROUTES = [
  "/glossary/",
  "/tools/rfid-tag-cost-estimator/",
  "/guides/",
  "/solutions/",
  "/blog/",
  "/compare/",
  "/compare/chip-vs-chip/",
  "/compare/reader-vs-reader/",
  "/compare/form-factor-material/",
  "/compare/frequency-tech/",
  "/case-studies/",
  "/compatibility/",
] as const;

export const NATIVE_SHELL_CANARY_ROUTES: readonly string[] = [
  ...NATIVE_SHELL_BASE_ROUTES,
  ...(LEAF_ROUTE_REGISTRY.routes as string[]),
];

const NATIVE_SHELL_ROUTES = new Set<string>(NATIVE_SHELL_CANARY_ROUTES);

export function getRouteRollout(route: string, hasEditorialDefinition = false): RouteRollout {
  const nativeShell = NATIVE_SHELL_ENABLED && NATIVE_SHELL_ROUTES.has(route);
  return {
    route,
    shell: nativeShell ? "native" : "snapshot",
    body:
      route === "/" && HOME_V2_ENABLED
        ? "native-home"
        : hasEditorialDefinition
          ? "editorial"
          : "snapshot",
    data: CATALOG_V2_ENABLED && route.startsWith("/products/") ? "catalog-v2" : "legacy",
  };
}

export function shouldUseNativeShell(route: string): boolean {
  return getRouteRollout(route).shell === "native";
}

export const REBUILD_KILL_SWITCHES = Object.freeze({
  nativeShell: "PROUDTEK_NATIVE_SHELL",
  homeV2: "PROUDTEK_HOME_V2",
  catalogV2: "PROUDTEK_CATALOG_V2",
});

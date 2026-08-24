/**
 * Deterministic, build-time rollout controls for the progressive rebuild.
 *
 * Production never randomizes by user, cookie or user-agent. A route either
 * builds with the native shell/body for the entire deployment or it does not,
 * which prevents crawler/user divergence and CDN cache mixing.
 */

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
 * Exact-route canary allowlist. PR-03 starts with two low-risk native pages,
 * then adds the guides, solutions and blog hubs. The global kill switch remains
 * off by default, so adding a route here does not change production until
 * PROUDTEK_NATIVE_SHELL=1 is set for a deployment.
 *
 * Phase 4 adds the seven /guides/{cluster}/ pages — same section as the
 * validated /guides/ hub, identical rail + grid body classes. Phase 5 adds
 * the /case-studies/ and /compatibility/ hubs.
 */
export const NATIVE_SHELL_CANARY_ROUTES = [
  "/glossary/",
  "/tools/rfid-tag-cost-estimator/",
  "/guides/",
  "/guides/google-review-cards/",
  "/guides/hotel-keycards/",
  "/guides/chip-encyclopedias/",
  "/guides/standards-encoding/",
  "/guides/compliance-regulatory/",
  "/guides/integration-tools/",
  "/guides/buying-reference/",
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

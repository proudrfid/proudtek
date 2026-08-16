import { describe, expect, it } from "vitest";
import {
  getNativeRoutes,
  getNativeSitemapSupplementRoutes,
  isNativeOwnedStaticPath,
  isNativeRoute,
} from "../route-registry";
import { getCanonicalRedirect, getCanonicalRedirects } from "../redirect-registry";
import { ROUTE_CANONICAL_OVERRIDES } from "../route-overrides";
import { getRouteRollout, REBUILD_KILL_SWITCHES } from "../rollout";

describe("route registry", () => {
  it("contains every dedicated native hub and compare category route once", () => {
    const routes = getNativeRoutes();
    expect(new Set(routes).size).toBe(routes.length);
    expect(routes).toContain("/blog/");
    expect(routes).toContain("/guides/");
    expect(routes).toContain("/compare/");
    expect(routes).toContain("/case-studies/");
    expect(routes).toContain("/rfq/");
  });

  it("preserves current catch-all ownership and sitemap supplement behavior", () => {
    expect(isNativeRoute("/blog/")).toBe(true);
    expect(isNativeOwnedStaticPath("/blog/")).toBe(true);
    expect(isNativeOwnedStaticPath("/rfq/")).toBe(false);
    expect(getNativeSitemapSupplementRoutes()).toEqual([
      "/guides/",
      "/compare/",
      "/case-studies/",
      "/rfq/",
      "/glossary/",
      "/tools/rfid-tag-cost-estimator/",
    ]);
  });
});

describe("redirect registry", () => {
  it("is a lossless typed adapter over canonical overrides", () => {
    expect(getCanonicalRedirects()).toHaveLength(Object.keys(ROUTE_CANONICAL_OVERRIDES).length);
    for (const [source, destination] of Object.entries(ROUTE_CANONICAL_OVERRIDES)) {
      expect(getCanonicalRedirect(source)).toBe(destination);
    }
  });
});

describe("rollout defaults", () => {
  it("keeps every rebuild surface disabled unless an exact route is enabled", () => {
    expect(getRouteRollout("/", false)).toEqual({
      route: "/",
      shell: "snapshot",
      body: "snapshot",
      data: "legacy",
    });
    expect(getRouteRollout("/guides/example/", true)).toEqual({
      route: "/guides/example/",
      shell: "snapshot",
      body: "editorial",
      data: "legacy",
    });
    expect(REBUILD_KILL_SWITCHES).toEqual({
      nativeShell: "PROUDTEK_NATIVE_SHELL",
      homeV2: "PROUDTEK_HOME_V2",
      catalogV2: "PROUDTEK_CATALOG_V2",
    });
  });
});

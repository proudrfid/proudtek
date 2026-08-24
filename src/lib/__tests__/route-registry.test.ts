import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getNativeRoutes,
  getNativeSitemapSupplementRoutes,
  isNativeOwnedStaticPath,
  isNativeRoute,
} from "../route-registry";
import { getCanonicalRedirect, getCanonicalRedirects } from "../redirect-registry";
import { ROUTE_CANONICAL_OVERRIDES } from "../route-overrides";

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
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("keeps every rebuild surface disabled unless an exact route is enabled", async () => {
    vi.stubEnv("PROUDTEK_NATIVE_SHELL", "0");
    vi.stubEnv("PROUDTEK_HOME_V2", "0");
    vi.stubEnv("PROUDTEK_CATALOG_V2", "0");
    vi.resetModules();
    const { getRouteRollout, NATIVE_SHELL_CANARY_ROUTES, REBUILD_KILL_SWITCHES } =
      await import("../rollout");

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
    expect(NATIVE_SHELL_CANARY_ROUTES).toEqual([
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
    ]);

    for (const route of [
      "/guides/",
      "/solutions/",
      "/blog/",
      "/compare/",
      "/compare/chip-vs-chip/",
      "/compare/reader-vs-reader/",
      "/compare/form-factor-material/",
      "/compare/frequency-tech/",
      "/case-studies/saflok/",
      "/compatibility/saflok-hotel-key-cards/",
      "/guides/example/",
      "/guides/google-review-card-design-and-copy/",
      "/blog/example/",
      "/solutions/example/",
      "/compare",
      "/compare/chip-vs-chip",
      "/compare/unknown/",
      "/compare/ntag213-vs-ntag215-vs-ntag216/",
      "/guides",
      "/",
    ]) {
      expect(getRouteRollout(route, true).shell).toBe("snapshot");
    }

    expect(REBUILD_KILL_SWITCHES).toEqual({
      nativeShell: "PROUDTEK_NATIVE_SHELL",
      homeV2: "PROUDTEK_HOME_V2",
      catalogV2: "PROUDTEK_CATALOG_V2",
    });
  });

  it("enables the exact five-route canary when the native shell flag is on", async () => {
    vi.stubEnv("PROUDTEK_NATIVE_SHELL", "1");
    vi.stubEnv("PROUDTEK_HOME_V2", "0");
    vi.stubEnv("PROUDTEK_CATALOG_V2", "0");
    vi.resetModules();
    const { getRouteRollout: getFlaggedRouteRollout } = await import("../rollout");

    for (const route of [
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
      "/case-studies/",
      "/compatibility/",
    ]) {
      expect(getFlaggedRouteRollout(route, true).shell).toBe("native");
    }

    for (const route of [
      "/guides/example/",
      "/guides/google-review-card-design-and-copy/",
      "/blog/example/",
      "/solutions/example/",
      "/compatibility/saflok-hotel-key-cards/",
      "/case-studies",
      "/guides",
      "/",
    ]) {
      expect(getFlaggedRouteRollout(route, true).shell).toBe("snapshot");
    }
  });
});

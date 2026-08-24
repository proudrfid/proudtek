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
      "/compatibility/be-tech-hotel-key-cards/",
      "/compatibility/hafele-dialock-hotel-key-cards/",
      "/compatibility/miwa-hotel-key-cards/",
      "/compatibility/onity-hotel-key-cards/",
      "/compatibility/saflok-hotel-key-cards/",
      "/compatibility/salto-hotel-key-cards/",
      "/compatibility/vingcard-hotel-key-cards/",
      // Phase 6b guides + solutions editorial leaves.
      "/guides/california-rfid-privacy-law/",
      "/guides/em4100-em4305-t5577-lf-chip-encyclopedia/",
      "/guides/epc-gen2-uhf-rfid/",
      "/guides/eu-digital-product-passport-2027/",
      "/guides/fda-rfid-pharmaceutical-tracking/",
      "/guides/google-review-card-design-and-copy/",
      "/guides/google-review-card-placement-guide/",
      "/guides/google-review-card-staff-prompt-playbook/",
      "/guides/google-review-cards-for-auto-dealerships/",
      "/guides/google-review-cards-for-dental-groups/",
      "/guides/google-review-cards-for-fitness-franchises/",
      "/guides/google-review-cards-for-hotel-groups/",
      "/guides/google-review-cards-for-multi-location-brands/",
      "/guides/google-review-cards-for-restaurant-franchises/",
      "/guides/google-review-cards-for-salon-chains/",
      "/guides/google-review-nfc-card-setup/",
      "/guides/gs1-epc-encoding-guide/",
      "/guides/hotel-key-card-artwork-and-printing-checklist/",
      "/guides/hotel-key-card-encoding/",
      "/guides/hotel-key-card-material-selection/",
      "/guides/hotel-key-card-sample-planning/",
      "/guides/icode-slix-chip-encyclopedia/",
      "/guides/iso-14443-explained/",
      "/guides/iso-18000-6c-uhf-rfid-standard/",
      "/guides/item-level-rfid-tagging-mandate/",
      "/guides/mifare-classic-1k-4k-chip-encyclopedia/",
      "/guides/mifare-desfire-ev3-commands-reference/",
      "/guides/mifare-ultralight-c-chip-encyclopedia/",
      "/guides/monza-r6-family-chip-encyclopedia/",
      "/guides/nfc-business-card-iphone-android-compatibility/",
      "/guides/nfc-ndef-format-explained/",
      "/guides/nfc-rohs-reach-compliance/",
      "/guides/nfc-tag-programming-android-guide/",
      "/guides/nfc-tag-programming-iphone/",
      "/guides/ntag21x-family-memory-map-commands/",
      "/guides/ntag424-dna-sun-cmac-authentication/",
      "/guides/python-rfid-reader-library/",
      "/guides/rain-rfid-explained/",
      "/guides/rfid-card-cost/",
      "/guides/rfid-ce-marking-europe/",
      "/guides/rfid-food-safety-traceability/",
      "/guides/rfid-oracle-netsuite-integration/",
      "/guides/rfid-reader-writer-selection/",
      "/guides/rfid-sap-wms-integration/",
      "/guides/rfid-shopify-inventory-integration/",
      "/guides/rfid-tag-card-wristband-lifespan/",
      "/guides/rfid-wristband-cost/",
      "/guides/ucode-8-uhf-chip-encyclopedia/",
      "/guides/ucode-9-uhf-chip-encyclopedia/",
      "/guides/uhf-rfid-reader-api-guide/",
      "/guides/walmart-rfid-tagging-mandate/",
      "/solutions/digital-product-passport/",
      "/solutions/google-review-cards-for-checkout-counters/",
      "/solutions/google-review-cards-for-clinics/",
      "/solutions/google-review-cards-for-front-desks/",
      "/solutions/google-review-cards-for-gyms-and-fitness-studios/",
      "/solutions/google-review-cards-for-hotels/",
      "/solutions/google-review-cards-for-pickup-counters/",
      "/solutions/google-review-cards-for-restaurants/",
      "/solutions/google-review-cards-for-retail-stores/",
      "/solutions/google-review-cards-for-salons-and-spas/",
      "/solutions/google-review-cards-for-tabletop-prompts/",
      "/solutions/google-review-nfc-card/",
      "/solutions/hotel-key-cards/",
      "/solutions/hotel-rfid-access-control/",
      "/solutions/nfc-brand-authentication/",
      "/solutions/nfc-business-card/",
      "/solutions/nfc-business-card-programs/",
      "/solutions/nfc-luxury-authentication/",
      "/solutions/rfid-access-control/",
      "/solutions/rfid-asset-tracking-labels/",
      "/solutions/rfid-attendance-system/",
      "/solutions/rfid-event-access-control/",
      "/solutions/rfid-event-wristbands/",
      "/solutions/rfid-inventory-tracking/",
      "/solutions/rfid-keyfobs-access-control/",
      "/solutions/rfid-laundry-management/",
      "/solutions/rfid-laundry-tags/",
      "/solutions/rfid-laundry-tracking/",
      "/solutions/rfid-library-management/",
      "/solutions/rfid-parking-management/",
      "/solutions/rfid-patient-tracking/",
      "/solutions/rfid-race-timing/",
      "/solutions/rfid-readers-and-encoding/",
      "/solutions/rfid-supply-chain-management/",
      "/solutions/rfid-tool-tracking/",
      "/solutions/rfid-warehouse-management/",
      "/solutions/vehicle-rfid-identification/",
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
      "/compatibility/unknown-vendor-hotel-key-cards/",
      "/compatibility/hotel-key-cards/",
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
      "/compatibility/saflok-hotel-key-cards/",
      "/compatibility/vingcard-hotel-key-cards/",
      // Phase 6b spot checks (full list asserted via the canary equality).
      "/guides/walmart-rfid-tagging-mandate/",
      "/guides/mifare-classic-1k-4k-chip-encyclopedia/",
      "/solutions/rfid-laundry-management/",
      "/solutions/nfc-business-card/",
    ]) {
      expect(getFlaggedRouteRollout(route, true).shell).toBe("native");
    }

    for (const route of [
      "/guides/example/",
      "/guides/google-review-card-design-and-copy",
      "/blog/example/",
      "/solutions/example/",
      "/compatibility/saflok-hotel-key-cards",
      "/compatibility/unknown-vendor-hotel-key-cards/",
      "/case-studies",
      "/guides",
      "/",
    ]) {
      expect(getFlaggedRouteRollout(route, true).shell).toBe("snapshot");
    }
  });
});

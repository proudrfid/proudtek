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
 * the /case-studies/ and /compatibility/ hubs. Phase 6 starts editorial
 * leaf migration with the seven /compatibility/{vendor} pages, rendered
 * through EditorialPageLayout's native branch.
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
  "/compatibility/be-tech-hotel-key-cards/",
  "/compatibility/hafele-dialock-hotel-key-cards/",
  "/compatibility/miwa-hotel-key-cards/",
  "/compatibility/onity-hotel-key-cards/",
  "/compatibility/saflok-hotel-key-cards/",
  "/compatibility/salto-hotel-key-cards/",
  "/compatibility/vingcard-hotel-key-cards/",
  // Phase 6b: all guides + solutions editorial leaves (same
  // EditorialPageLayout native branch as phase 6a). Slugs mirror
  // src/content/editorial/{guides,solutions}/ one-to-one (verified against
  // dist outputs); regenerate when content pages are added or removed.
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

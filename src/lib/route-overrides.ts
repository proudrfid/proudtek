export const LOW_VALUE_ROUTE_PREFIXES = [
  "/product-tag/",
  "/tag/",
  "/category/",
  "/author/",
  "/cart/",
  "/checkout/",
  "/my-account/",
  "/product-category/",
];

export const ROUTE_CANONICAL_OVERRIDES: Record<string, string> = {
  /* ── Blog-post permalinks that should point at their canonical landing ── */
  "/2024/12/22/rfid-laundry-tags/": "/solutions/rfid-laundry-tags/",
  "/2024/12/24/rfid-event-wristband/": "/solutions/rfid-event-access-control/",
  "/2024/12/24/rfid-wooden-card/": "/compare/metal-vs-wood-vs-pvc-nfc-business-cards/",
  "/2024/12/25/rfid-hotel-key-card/": "/solutions/hotel-key-cards/",
  "/2025/11/04/mifare_plus_card/": "/compare/mifare-plus-ev2-vs-desfire-ev3/",

  /* ── Compare-cluster collapses ──────────────────────────────────────── */
  "/compare/mifare-plus-vs-desfire/": "/compare/mifare-plus-ev2-vs-desfire-ev3/",
  "/compare/pps-vs-silicone-laundry-tags/": "/compare/pps-vs-silicone-vs-textile-rfid-laundry-tags/",

  /* ── Legacy /product/* WP stub → content-collection landing (W3-4d⁵) ──
   * The 51 WP-era /product/* pages duplicate newer content-collection SKUs,
   * solution landings, or compare pages. Each entry points the legacy URL
   * at its richer equivalent:
   *   - canonical <link> on the stub page points here (seo.ts)
   *   - internal <a href> rewriting redirects old links here (rewriteLegacyInternalLinks)
   *   - collectCatalogProducts() drops stubs that have a canonical override
   *     from the /products/all/ filter grid (catalog-pages.ts)
   *
   * Stubs stay buildable as soft-landing pages so existing inbound links
   * don't 404, but all first-party navigation routes users to the canonical.
   */

  /* HF + NFC cards → content-collection rfid-cards SKUs */
  "/product/nfc-sticker/":                   "/products/rfid-labels/ntag213-nfc-sticker/",
  "/product/nfc-stickers/":                  "/products/rfid-labels/ntag213-nfc-sticker/",
  "/product/mifare-stickers/":               "/products/rfid-labels/ntag213-nfc-sticker/",
  "/product/mifare-classic-card/":           "/products/rfid-cards/mifare-classic-1k-card/",
  "/product/mifare-4k-card/":                "/products/rfid-cards/mifare-classic-1k-card/",
  "/product/mifare-plus-card/":              "/products/rfid-cards/mifare-plus-se-card/",
  "/product/mifare-desfire-cards/":          "/products/rfid-cards/mifare-desfire-ev3-card/",
  "/product/mifare-desfire-ev2-cards/":      "/products/rfid-cards/mifare-desfire-ev3-card/",
  "/product/desfire-tag/":                   "/products/rfid-cards/mifare-desfire-ev3-card/",
  "/product/java-card/":                     "/products/rfid-cards/mifare-desfire-ev3-card/",
  "/product/dual-interface-card/":           "/products/rfid-cards/dual-frequency-rfid-card/",
  "/product/combi-card/":                    "/products/rfid-cards/dual-frequency-rfid-card/",
  "/product/metal-nfc-card/":                "/products/rfid-cards/rfid-metal-business-card/",
  "/product/wooden-rfid-card/":              "/products/rfid-cards/rfid-wooden-card/",
  "/product/eco_rfid_card/":                 "/products/rfid-cards/rfid-bamboo-card/",
  "/product/rfid-paper-card/":               "/products/rfid-cards/rfid-bamboo-card/",
  "/product/inkjet-pvc-id-card/":            "/products/rfid-cards/nfc-card-custom-printing/",
  "/product/printed-rfid-cards/":            "/products/rfid-cards/nfc-card-custom-printing/",
  "/product/blank-rfid-card/":               "/products/rfid-cards/nfc-card-custom-printing/",

  /* LF cards → EM4100 rfid-card equivalent */
  "/product/125-khz-rfid-card/":             "/products/rfid-cards/em4100-rfid-card/",
  "/product/em4200-card/":                   "/products/rfid-cards/em4100-rfid-card/",
  "/product/em4305-card/":                   "/products/rfid-cards/em4100-rfid-card/",
  "/product/t5577-card/":                    "/products/rfid-cards/em4100-rfid-card/",

  /* Cards without a direct SKU equivalent → rfid-cards pillar */
  "/product/125khz-rfid-sticker/":           "/products/rfid-labels/",
  "/product/clamshell-card/":                "/products/rfid-cards/",
  "/product/felica-card/":                   "/products/rfid-cards/",
  "/product/hitag-2-card/":                  "/products/rfid-cards/",
  "/product/legic-card/":                    "/products/rfid-cards/",
  "/product/nfc-cards/":                     "/products/rfid-cards/",

  /* Solution pages for cross-category landings */
  "/product/nfc-business-card/":             "/solutions/nfc-business-card/",
  "/product/google-review-nfc-card/":        "/solutions/google-review-nfc-card/",
  "/product/hotel-key-cards/":               "/solutions/hotel-key-cards/",

  /* Wristbands */
  "/product/rfid-event-wristband/":          "/solutions/rfid-event-wristbands/",
  "/product/rfid-wristbands-for-events/":    "/solutions/rfid-event-wristbands/",
  "/product/rfid-wristbands-for-hotels/":    "/solutions/rfid-event-wristbands/",
  "/product/rfid-silicone-wristbands/":      "/products/rfid-wristbands/rfid-adjustable-silicone-wristband/",
  "/product/coconut-shell-rfid-wristband/":  "/products/rfid-wristbands/",
  "/product/uhf-wristband/":                 "/products/rfid-wristbands/uhf-rfid-wristband/",
  "/product/nfc-ring/":                      "/products/rfid-wristbands/",

  /* Keyfobs */
  "/product/rfid-key-fob/":                  "/products/rfid-keyfobs/",
  "/product/proximity-fobs/":                "/products/rfid-keyfobs/",

  /* Laundry + on-metal tags */
  "/product/rfid-laundry-tags/":             "/solutions/rfid-laundry-tags/",
  "/product/rfid-silicone-laundry-tag/":     "/products/rfid-tags/rfid-high-temp-silicone-tag/",
  "/product/pps-rfid-laundry-tag/":          "/products/rfid-tags/rfid-pps-laundry-chip/",

  /* Merged SKUs — rfid-on-metal-uhf-tag absorbed into rfid-anti-metal-tag (2026-04-23) */
  "/products/rfid-tags/rfid-on-metal-uhf-tag/": "/products/rfid-tags/rfid-anti-metal-tag/",

  /* Vehicle / windshield */
  "/product/car-transponder-chip/":          "/solutions/vehicle-rfid-identification/",
  "/product/rfid-sticker-on-headlight/":     "/products/rfid-labels/long-range-uhf-windshield-sticker/",
  "/product/rfid-windshield-tag/":           "/products/rfid-labels/long-range-uhf-windshield-sticker/",
  "/product/rfid-tag-with-led-light/":       "/products/rfid-tags/",

  /* Hardware (readers / scanners) → rfid-readers cluster SKUs */
  "/product/acr122u/":                       "/products/rfid-readers/desktop-nfc-reader-encoder/",
  "/product/bluetooth-rfid-scanner/":        "/products/rfid-readers/handheld-uhf-rfid-reader/",
  "/product/nfc-reader-writer-with-free-sdks/": "/products/rfid-readers/desktop-nfc-reader-encoder/",

  /* Batch 40 / wristband-card dedup collapses — mirror vercel.json + _redirects
     so rewriteLegacyInternalLinks fixes in-content links too. */
  "/products/rfid-wristbands/nfc-payment-wristband/":  "/products/rfid-wristbands/cashless-payment-rfid-wristband/",
  "/products/rfid-wristbands/tyvek-rfid-wristband/":   "/products/rfid-wristbands/rfid-tyvek-wristband/",
  "/products/rfid-cards/mifare-ultralight-c-cards/":   "/products/rfid-cards/mifare-ultralight-c-card/",
  "/products/rfid-cards/mifare-desfire-ev3-cards/":    "/products/rfid-cards/mifare-desfire-ev3-card/",
  "/products/rfid-cards/rfid-dual-frequency-card/":    "/products/rfid-cards/dual-frequency-rfid-card/",
  "/products/rfid-cards/transparent-clear-nfc-card/":  "/products/rfid-cards/transparent-nfc-card/",

  /* Cannibalization collapses — same-intent twins → strongest page
     (2026-06-10, user-approved; unique loser content folded into survivors).
     Mirrored in vercel.json + public/_redirects. */
  "/blog/ntag213-vs-ntag215-vs-ntag216/":              "/compare/ntag213-vs-ntag215-vs-ntag216/",
  "/blog/em4100-vs-t5577-125khz-comparison/":          "/compare/em4100-vs-t5577/",
  "/blog/magnetic-stripe-vs-rfid-hotel-cards/":        "/compare/rfid-vs-magnetic-hotel-key-cards/",
  "/compare/rfid-hotel-card-vs-magnetic-stripe/":      "/compare/rfid-vs-magnetic-hotel-key-cards/",
  "/blog/pps-vs-silicone-vs-textile-laundry-tags/":    "/compare/pps-vs-silicone-vs-textile-rfid-laundry-tags/",
  "/blog/silicone-vs-fabric-vs-tyvek-wristbands/":     "/compare/silicone-vs-fabric-vs-woven-rfid-wristbands/",
  "/blog/how-to-choose-rfid-wristband-material/":      "/compare/silicone-vs-fabric-vs-woven-rfid-wristbands/",
  "/blog/hotel-key-card-encoding-explained/":          "/guides/hotel-key-card-encoding/",
  "/blog/hotel-key-card-design-printing/":             "/guides/hotel-key-card-artwork-and-printing-checklist/",
  "/blog/walmart-rfid-mandate-2026-supplier-compliance/": "/guides/walmart-rfid-tagging-mandate/",
  "/blog/rfid-laundry-system-payback-period/":         "/blog/rfid-laundry-system-roi/",
  "/blog/rfid-wristbands-music-festival-2026/":        "/blog/rfid-wristbands-festivals-events/",
  "/about/case-studies/":                              "/case-studies/",

  /* lp doorway-cluster consolidation — 16 → 12 pages (2026-06-10,
     user-approved option (a): merge near-duplicates, expand survivors). */
  "/lp/rfid-factory-direct-china/":                    "/lp/rfid-manufacturer-shenzhen/",
  "/lp/rfid-solution-provider/":                       "/lp/rfid-manufacturer-shenzhen/",
  "/lp/nfc-tag-supplier/":                             "/lp/nfc-tag-manufacturer-china/",
  "/lp/uhf-rfid-tag-manufacturer/":                    "/lp/rfid-tag-factory/",
};

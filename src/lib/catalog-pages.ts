import { load } from "cheerio";
import { getCollection } from "astro:content";

import type { SiteData, SnapshotPage } from "./site-data";
import { loadPageFromDisk } from "./site-data";
import { html, raw } from "./html";
import { ROUTE_CANONICAL_OVERRIDES } from "./route-overrides";

/* ── Catalog hero-image overrides ──────────────────────────────────────
 * Many WordPress product pages share the same generic banner image.
 * This map assigns each product a unique hero image so the catalog grid
 * does not look like it has duplicate products.
 * Key = product route, Value = image path relative to site root.
 */
const CATALOG_IMAGE_OVERRIDES: Record<string, string> = {
  // ── RFID Cards ──────────────────────────────────────────────────────
  "/products/rfid-cards/em4100-rfid-card/":                      "/landing-images/em4100-rfid-card.jpg",
  "/products/rfid-cards/icode-slix-card/":                       "/landing-images/icode-slix-card.jpg",
  "/products/rfid-cards/mifare-classic-1k-card/":                "/landing-images/mifare-classic-1k-card.jpg",
  "/products/rfid-cards/mifare-desfire-ev3-card/":               "/landing-images/mifare-desfire-ev3-card.jpg",
  "/products/rfid-cards/mifare-desfire-ev3-cards/":              "/landing-images/mifare-desfire-ev3-card.jpg",
  "/products/rfid-cards/mifare-plus-se-card/":                   "/landing-images/mifare-plus-se-card.png",
  "/products/rfid-cards/nfc-card-custom-printing/":              "/landing-images/nfc-card-custom-printing.jpg",
  "/products/rfid-cards/rfid-employee-badge/":                   "/landing-images/rfid-employee-badge.jpg",
  "/products/rfid-cards/rfid-gift-card/":                        "/landing-images/rfid-gift-card.jpg",
  "/products/rfid-cards/rfid-loyalty-card/":                     "/landing-images/rfid-loyalty-card.jpg",
  "/products/rfid-cards/rfid-student-id-card/":                  "/landing-images/rfid-student-id-card.jpg",
  "/products/rfid-cards/transparent-clear-nfc-card/":            "/landing-images/transparent-clear-nfc-card.jpg",
  "/products/rfid-cards/transparent-nfc-card/":                  "/landing-images/transparent-nfc-card.jpg",
  "/products/rfid-cards/uhf-rfid-card/":                         "/landing-images/uhf-rfid-card.jpg",
  "/products/rfid-cards/rfid-card-magnetic-stripe-combo/":       "/landing-images/rfid-card-magnetic-stripe-combo.jpg",
  "/products/rfid-cards/rfid-dual-frequency-card/":              "/landing-images/rfid-dual-frequency-card.jpg",
  "/products/rfid-cards/rfid-bamboo-card/":                      "/landing-images/rfid-bamboo-card.jpg",
  "/products/rfid-cards/rfid-wooden-card/":                      "/landing-images/rfid-wooden-card.jpg",
  "/products/rfid-cards/wooden-nfc-business-card-engraved/":     "/landing-images/wooden-nfc-business-card-engraved.jpg",
  "/products/rfid-cards/rfid-card-assa-abloy-compatible/":       "/landing-images/rfid-card-assa-abloy-compatible.jpg",
  "/products/rfid-cards/ntag424-dna-tt-card/":                   "/landing-images/ntag424-dna-tt-card.png",
  // ── RFID Keyfobs ────────────────────────────────────────────────────
  "/products/rfid-keyfobs/em4305-keyfob/":                       "/landing-images/em4305-keyfob.jpg",
  "/products/rfid-keyfobs/mifare-desfire-keyfob/":               "/landing-images/mifare-desfire-keyfob.jpg",
  "/products/rfid-keyfobs/t5577-keyfob/":                        "/landing-images/t5577-keyfob.jpg",
  "/products/rfid-keyfobs/rfid-wristwatch-tag/":                 "/landing-images/rfid-wristwatch-tag.jpg",
  "/products/rfid-keyfobs/rfid-leather-keyfob/":                 "/landing-images/rfid-leather-keyfob.jpg",
  "/products/rfid-keyfobs/rfid-metal-keyfob/":                   "/landing-images/rfid-metal-keyfob.jpg",
  "/products/rfid-keyfobs/rfid-silicone-keyfob/":                "/landing-images/rfid-silicone-keyfob.jpg",
  "/products/rfid-keyfobs/rfid-epoxy-keyfob/":                   "/landing-images/rfid-epoxy-keyfob.jpg",
  "/products/rfid-keyfobs/rfid-coin-keyfob/":                    "/landing-images/rfid-coin-keyfob.jpg",
  // ── RFID Wristbands ─────────────────────────────────────────────────
  "/products/rfid-wristbands/cashless-payment-rfid-wristband/":  "/landing-images/cashless-payment-rfid-wristband.jpg",
  "/products/rfid-wristbands/elastic-rfid-wristband/":           "/landing-images/elastic-rfid-wristband.jpg",
  "/products/rfid-wristbands/fabric-rfid-wristband/":            "/landing-images/fabric-rfid-wristband.jpg",
  "/products/rfid-wristbands/nfc-fitness-wristband/":            "/landing-images/nfc-fitness-wristband.jpg",
  // Hero/title mismatch round 2 2026-04-18: original landing image was an AI-generated
  // photo showing an Ouster-branded CARD being tapped on a reader (wrong form factor
  // + competitor logo). Point at an on-disk unbranded wristband-on-wrist shot.
  "/products/rfid-wristbands/nfc-medical-alert-wristband/":      "/site-assets/wp-content/uploads/2024/09/RFID_silicone_wristband_application.jpg",
  "/products/rfid-wristbands/paper-rfid-wristband/":             "/landing-images/paper-rfid-wristband.jpg",
  "/products/rfid-wristbands/rfid-adjustable-silicone-wristband/": "/landing-images/rfid-adjustable-silicone-wristband.jpg",
  // Hero/title mismatch round 2 2026-04-18: original landing image was an adult
  // ASSA ABLOY / Proudtek-branded silicone wristband (wrong size + competitor logo).
  // Point at a child-scale pink elastic RFID wristband photo.
  "/products/rfid-wristbands/rfid-child-wristband/":             "/site-assets/wp-content/uploads/2024/11/RFID_wristband_for_hotel_swiming_pool.jpg",
  "/products/rfid-wristbands/rfid-prison-wristband/":            "/landing-images/rfid-prison-wristband.jpg",
  "/products/rfid-wristbands/rfid-waterpark-wristband/":         "/landing-images/rfid-waterpark-wristband.jpg",
  "/products/rfid-wristbands/rfid-wristband-qr-nfc/":           "/landing-images/rfid-wristband-qr-nfc.jpg",
  "/products/rfid-wristbands/silicone-wristband-mifare-classic/": "/landing-images/silicone-wristband-mifare-classic.jpg",
  "/products/rfid-wristbands/uhf-rfid-wristband/":              "/landing-images/uhf-rfid-wristband.jpg",
  "/products/rfid-wristbands/rfid-nylon-wristband/":             "/landing-images/rfid-nylon-wristband.jpg",
  // Hero/title mismatch round 2 2026-04-18: original landing image was a concert-crowd
  // placeholder. Point at an on-disk adult multi-day RFID wristband trio (pink + black
  // fabric strap w/ disc holder — suits "multi-day resort / cruise" framing).
  "/products/rfid-wristbands/rfid-vinyl-wristband/":             "/site-assets/wp-content/uploads/2024/04/DESFire_EV2_Wristband.jpg",
  "/products/rfid-wristbands/rfid-tyvek-wristband/":             "/landing-images/rfid-tyvek-wristband-alt.jpg",
  // ── RFID Labels / Stickers / Inlays ─────────────────────────────────
  "/products/rfid-labels/alien-higgs-9-uhf-inlay/":              "/landing-images/alien-higgs-9-uhf-inlay.jpg",
  "/products/rfid-labels/impinj-m700-uhf-inlay/":                "/landing-images/impinj-m700-uhf-inlay.jpg",
  // M730 is physically the same inlay as the M700 generic reference — the differences are at the silicon (96-bit EPC, no User memory, no Authenticate). Shares the M700 hero.
  "/products/rfid-labels/impinj-m730-uhf-inlay/":                "/landing-images/impinj-m700-uhf-inlay.jpg",
  "/products/rfid-labels/impinj-m750-uhf-inlay/":                "/landing-images/rfid-wet-inlay-alt.jpg",
  "/products/rfid-labels/impinj-m800-uhf-inlay/":                "/landing-images/impinj-m800-uhf-inlay.jpg",
  "/products/rfid-labels/nfc-pharmaceutical-label/":             "/landing-images/nfc-pharmaceutical-label.jpg",
  "/products/rfid-labels/rfid-asset-label/":                     "/landing-images/rfid-asset-label.jpg",
  "/products/rfid-labels/rfid-book-spine-label/":                "/landing-images/rfid-book-spine-label.jpg",
  "/products/rfid-labels/rfid-frozen-food-label/":               "/landing-images/rfid-frozen-food-label.jpg",
  "/products/rfid-labels/rfid-plant-nursery-label/":             "/landing-images/rfid-plant-nursery-label.jpg",
  "/products/rfid-labels/rfid-specimen-slide-label/":            "/landing-images/rfid-specimen-slide-label.jpg",
  "/products/rfid-labels/uhf-rfid-apparel-hang-tag-retail/":     "/landing-images/uhf-rfid-apparel-hang-tag-retail.jpg",
  "/products/rfid-labels/uhf-rfid-blood-bag-label/":             "/landing-images/uhf-rfid-blood-bag-label.jpg",
  "/products/rfid-labels/uhf-rfid-jewelry-label/":               "/landing-images/uhf-rfid-jewelry-label.jpg",
  "/products/rfid-labels/uhf-rfid-retail-price-label/":          "/landing-images/uhf-rfid-retail-price-label.jpg",
  "/products/rfid-labels/uhf-rfid-tire-label/":                  "/landing-images/uhf-rfid-tire-label.jpg",
  "/products/rfid-labels/rfid-dry-inlay/":                       "/landing-images/rfid-dry-inlay-alt.jpg",
  // Title/hero mismatch 2026-04-18: rfid-wet-inlay-alt.jpg showed bare antennas
  // with no adhesive/liner context; a first swap to printed_NFC_sticker was
  // actually a finished wet LABEL, not a wet inlay. Now points at a real wet
  // inlay (translucent PET + etched spiral antenna + chip visible, partially
  // peeled off a transit ticket to show the adhesive characteristic).
  // Source: Wikimedia Commons "IC_Inlay_of_Standard_Ticket_Transit_Card.jpg",
  // CC BY-SA 4.0 — attribution in public/landing-images/CREDITS.md.
  "/products/rfid-labels/rfid-wet-inlay/":                       "/landing-images/rfid-wet-inlay.jpg",
  "/products/rfid-labels/nfc-art-provenance-tag/":               "/landing-images/nfc-art-provenance-tag.jpg",
  "/products/rfid-labels/nfc-cannabis-tracking-label/":          "/landing-images/nfc-cannabis-tracking-label.jpg",
  "/products/rfid-labels/nfc-electronics-warranty-label/":       "/landing-images/nfc-electronics-warranty-label.jpg",
  "/products/rfid-labels/nfc-event-ticket-sticker/":             "/landing-images/nfc-event-ticket-sticker.jpg",
  "/products/rfid-labels/nfc-food-traceability-label/":          "/landing-images/nfc-food-traceability-label.jpg",
  "/products/rfid-labels/nfc-olive-oil-authentication-label/":   "/landing-images/nfc-olive-oil-authentication-label.jpg",
  "/products/rfid-labels/nfc-spirits-authentication-label/":     "/landing-images/nfc-spirits-authentication-label.jpg",
  "/products/rfid-labels/nfc-tap-to-pay-sticker/":               "/landing-images/nfc-tap-to-pay-sticker.jpg",
  "/products/rfid-labels/long-range-uhf-windshield-sticker/":    "/landing-images/long-range-uhf-windshield-sticker.jpg",
  "/products/rfid-labels/uhf-rfid-windshield-label/":            "/landing-images/uhf-rfid-windshield-label.jpg",
  "/products/rfid-labels/rfid-tamper-evident-label/":            "/landing-images/rfid-tamper-evident-label.jpg",
  "/products/rfid-labels/uhf-rfid-pallet-label/":                "/landing-images/uhf-rfid-pallet-label.jpg",
  // ── RFID Tags ───────────────────────────────────────────────────────
  "/products/rfid-tags/anti-metal-uhf-it-asset-tag/":            "/landing-images/anti-metal-uhf-it-asset-tag.jpg",
  "/products/rfid-tags/rfid-magnet-mount-tag/":                  "/landing-images/rfid-magnet-mount-tag.jpg",
  "/products/rfid-tags/rfid-utility-pole-tag/":                  "/landing-images/rfid-utility-pole-tag.jpg",
  "/products/rfid-tags/rfid-nail-tag/":                          "/landing-images/rfid-nail-tag.jpg",
  "/products/rfid-tags/rfid-pallet-runner-tag/":                 "/landing-images/rfid-pallet-runner-tag.jpg",
  "/products/rfid-tags/rfid-parking-token/":                     "/landing-images/rfid-parking-token.jpg",
  "/products/rfid-tags/rfid-wedge-tag/":                         "/landing-images/rfid-wedge-tag.jpg",
  "/products/rfid-tags/rfid-silicone-flexible-tag/":             "/landing-images/rfid-silicone-flexible-tag.jpg",
  "/products/rfid-tags/waterproof-uhf-rfid-outdoor-tag/":        "/landing-images/waterproof-uhf-rfid-outdoor-tag.jpg",
  "/products/rfid-tags/rfid-coin-tag/":                          "/landing-images/rfid-coin-tag-alt.jpg",
  // ── Deduplication pass 2026-04-18 ───────────────────────────────────
  // Each entry replaces a shared placeholder hero image with the product's
  // own dedicated photo (already on disk in /public/landing-images/).
  // rfid-cable-tie-tag.jpg group
  "/products/rfid-tags/rfid-cable-seal-tag/":                    "/landing-images/rfid-cable-seal-tag.png",
  "/products/rfid-tags/rfid-eyelet-tag/":                        "/landing-images/rfid-eyelet-tag.jpg",
  "/products/rfid-tags/rfid-hose-tag/":                          "/landing-images/rfid-hose-tag.jpg",
  "/products/rfid-tags/rfid-zip-tie-tag/":                       "/landing-images/rfid-zip-tie-tag.png",
  // rfid-high-temperature-ceramic-tag.jpg group
  "/products/rfid-tags/high-temperature-rfid-tag-200c/":         "/landing-images/high-temperature-rfid-tag-200c.jpg",
  "/products/rfid-tags/rfid-ceramic-tag/":                       "/landing-images/rfid-ceramic-tag.png",
  "/products/rfid-tags/rfid-high-temp-silicone-tag/":            "/landing-images/rfid-high-temp-silicone-tag.jpg",
  // rfid-pcb-screw-mount-tag.png group
  "/products/rfid-tags/rfid-concrete-embed-tag/":                "/landing-images/rfid-concrete-embed-tag.jpg",
  "/products/rfid-tags/rfid-pcb-tag/":                           "/landing-images/rfid-pcb-tag.jpg",
  "/products/rfid-tags/rfid-screw-tag/":                         "/landing-images/rfid-screw-tag.png",
  // rfid-bolt-seal.jpg group
  "/products/rfid-tags/rfid-anchor-bolt-tag/":                   "/landing-images/rfid-anchor-bolt-tag.png",
  "/products/rfid-tags/rfid-bolt-tag/":                          "/landing-images/rfid-bolt-tag.jpg",
  // rfid-animal-ear-tag.png group
  "/products/rfid-tags/rfid-ear-tag-livestock/":                 "/landing-images/rfid-ear-tag-livestock.jpg",
  "/products/rfid-tags/rfid-livestock-leg-band/":                "/landing-images/rfid-livestock-leg-band.jpg",
  // rfid-anti-metal-tag.jpg group
  "/products/rfid-tags/rfid-flag-tag/":                          "/landing-images/rfid-flag-tag.webp",
  "/products/rfid-tags/rfid-mining-asset-tag/":                  "/landing-images/rfid-mining-asset-tag.jpg",
  // rfid-gas-cylinder-tag.webp group
  "/products/rfid-tags/rfid-oil-gas-pipe-tag/":                  "/landing-images/rfid-oil-gas-pipe-tag.jpg",
  "/products/rfid-tags/rfid-valve-tag/":                         "/landing-images/rfid-valve-tag.png",
  // rfid-tool-tracking-tag.webp group
  "/products/rfid-tags/rfid-tool-tag/":                          "/landing-images/rfid-tool-tag.jpg",
  "/products/rfid-tags/rfid-weapon-tracking-tag/":               "/landing-images/rfid-weapon-tracking-tag.jpg",
  // nfc-epoxy-key-tag.jpg group
  "/products/rfid-tags/rfid-epoxy-tag/":                         "/landing-images/rfid-epoxy-tag.jpg",
  // rfid-coin-tag.jpg group
  "/products/rfid-tags/rfid-manhole-cover-tag/":                 "/landing-images/rfid-manhole-cover-tag.jpg",
  // nfc-anti-metal-sticker.png group
  "/products/rfid-tags/rfid-on-metal-uhf-tag/":                  "/landing-images/rfid-on-metal-uhf-tag.jpg",
  // rfid-ibc-chemical-drum-tag.jpg group
  "/products/rfid-tags/rfid-drum-tag/":                          "/landing-images/rfid-drum-tag.jpg",
  // rfid-guard-tour-tag.jpg group
  "/products/rfid-tags/rfid-fire-extinguisher-tag/":             "/landing-images/rfid-fire-extinguisher-tag.jpg",
  // rfid-glass-capsule-tag.webp group
  "/products/rfid-tags/rfid-fish-tag/":                          "/landing-images/rfid-fish-tag.jpg",
  // uhf-rfid-apparel-hang-tag.jpg group
  "/products/rfid-tags/rfid-hang-tag/":                          "/landing-images/rfid-hang-tag.jpg",
  // rfid-nail-tag.jpg group
  "/products/rfid-tags/rfid-tree-tag/":                          "/landing-images/rfid-tree-tag.jpg",
  // rfid-textile-laundry-tag.jpg group
  "/products/rfid-tags/rfid-pps-laundry-chip/":                  "/landing-images/rfid-pps-laundry-chip.png",
  // ppc-nfc-business-cards.jpg group — point metal business card at a
  // different NFC business card shot (reading scene) so it no longer
  // collides with the PPC landing page hero.
  "/products/rfid-cards/rfid-metal-business-card/":              "/site-assets/wp-content/uploads/2024/09/NFC_business_card_reading.jpg",
  // ── Logo scrub 2026-04-18 ────────────────────────────────────────────
  // Original /landing-images/rfid-textile-laundry-tag.jpg was a third-party
  // supplier catalog sheet ("JYL-Tech" watermark). Swap to our own textile
  // UHF laundry tag photo (unbranded hands-holding-tags shot).
  "/products/rfid-tags/rfid-textile-laundry-tag/":               "/site-assets/wp-content/uploads/2024/04/textile_uhf_laundry_tag.jpg",
};

/* ── WordPress product image overrides ──────────────────────────────────
 * Many WP products share the same generic banner (ppc-custom-rfid-cards, ppc-rfid-wristbands).
 * These overrides assign unique images so the catalog grid has visual variety.
 */
const WP_IMAGE_OVERRIDES: Record<string, string> = {
  // RFID Cards (WP /product/ routes)
  // Dedup 2026-04-18: was em4100-rfid-card.jpg (collided with editorial
  // /products/rfid-cards/em4100-rfid-card/). Pointed at a dedicated on-disk
  // 125kHz product photo instead.
  "/product/125-khz-rfid-card/":           "/site-assets/wp-content/uploads/2024/10/125khz_RFID_card_for_access_control.jpg",
  "/product/blank-rfid-card/":             "/site-assets/wp-content/uploads/2023/12/RFID_blank_card.jpg",
  "/product/clamshell-card/":              "/site-assets/wp-content/uploads/2023/12/clamshell_card.jpg",
  "/product/combi-card/":                  "/site-assets/wp-content/uploads/2023/12/combi_card.jpg",
  "/product/dual-interface-card/":         "/site-assets/wp-content/uploads/2023/12/dual_interface_card.jpg",
  "/product/eco_rfid_card/":               "/site-assets/wp-content/uploads/2024/10/Eco_RFID_card.jpg",
  "/product/em4200-card/":                 "/site-assets/wp-content/uploads/2023/12/EM4200_card.jpg",
  "/product/em4305-card/":                 "/site-assets/wp-content/uploads/2023/12/EM4305_card.jpg",
  "/product/felica-card/":                 "/site-assets/wp-content/uploads/2024/09/Felica_card_blank.jpg",
  "/product/google-review-nfc-card/":      "/site-assets/wp-content/uploads/2024/09/Google_review_NFC_card.jpg",
  "/product/hitag-2-card/":                "/site-assets/wp-content/uploads/2023/12/HITAG_2_Card.jpg",
  "/product/hotel-key-cards/":             "/site-assets/wp-content/uploads/2023/12/rfid_hotel_key_card.jpg",
  "/product/inkjet-pvc-id-card/":          "/site-assets/wp-content/uploads/2023/12/Inkjet_PVC_ID_card.jpg",
  "/product/java-card/":                   "/site-assets/wp-content/uploads/2023/12/Java_card.jpg",
  "/product/legic-card/":                  "/site-assets/wp-content/uploads/2023/12/legic_card.jpg",
  "/product/metal-nfc-card/":              "/site-assets/wp-content/uploads/2024/09/Metal_NFC_card.jpg",
  "/product/mifare-4k-card/":              "/site-assets/wp-content/uploads/2023/12/S70_card.jpg",
  "/product/mifare-classic-card/":         "/site-assets/wp-content/uploads/2023/12/MIFARE_classic_card.jpg",
  "/product/mifare-desfire-cards/":        "/site-assets/wp-content/uploads/2024/01/DESFire_card.jpg",
  "/product/mifare-desfire-ev2-cards/":    "/site-assets/wp-content/uploads/2024/04/DESFire_EV2_Card.jpg",
  "/product/mifare-plus-card/":           "/site-assets/wp-content/uploads/2024/04/MIFARE-Plus-EV2_card.png",
  "/product/nfc-business-card/":           "/site-assets/wp-content/uploads/2024/09/NFC_business_card.jpg",
  "/product/nfc-cards/":                   "/site-assets/wp-content/uploads/2024/09/NFC_card-1.jpg",
  "/product/printed-rfid-cards/":          "/site-assets/wp-content/uploads/2023/12/printed_rfid_cards.jpg",
  "/product/rfid-paper-card/":             "/site-assets/wp-content/uploads/2023/12/RFID_paper_card.jpg",
  "/product/t5577-card/":                  "/site-assets/wp-content/uploads/2024/03/T5577_card.jpg",
  "/product/wooden-rfid-card/":            "/site-assets/wp-content/uploads/2024/10/wood_RFID_card.jpg",
  // RFID Keyfobs
  "/product/desfire-tag/":                 "/site-assets/wp-content/uploads/2024/09/DESFire_tag.jpg",
  "/product/nfc-ring/":                    "/site-assets/wp-content/uploads/2024/09/NFC_ring.jpg",
  "/product/proximity-fobs/":             "/site-assets/wp-content/uploads/2024/07/rfid_key_fobs.jpg",
  "/product/rfid-key-fob/":               "/site-assets/wp-content/uploads/2023/12/RFID_key_fob_collection.jpg",
  // RFID Wristbands
  "/product/coconut-shell-rfid-wristband/": "/site-assets/wp-content/uploads/2023/11/coconut-rfid-wristband.jpg",
  "/product/rfid-event-wristband/":        "/site-assets/wp-content/uploads/2024/10/RFID_Event_wristband_with_RFID_reader.jpg",
  "/product/rfid-silicone-wristbands/":    "/site-assets/wp-content/uploads/2024/09/rfid_silicone_wristband_group.jpg",
  "/product/rfid-wristbands-for-events/":  "/site-assets/wp-content/uploads/2023/12/rfid_wristband_for_event.jpg",
  "/product/rfid-wristbands-for-hotels/":  "/site-assets/wp-content/uploads/2024/11/RFID_wristbands_for_hotels.jpg",
  "/product/uhf-wristband/":               "/site-assets/wp-content/uploads/2024/10/UHF_Wristband.jpg",
  // RFID Labels/Stickers
  "/product/125khz-rfid-sticker/":         "/site-assets/wp-content/uploads/2023/12/125khz_rfid_sticker.jpg",
  "/product/mifare-stickers/":             "/site-assets/wp-content/uploads/2024/03/MIFARE_sticker.jpg",
  "/product/nfc-sticker/":                 "/site-assets/wp-content/uploads/2024/09/NFC_sticker.jpg",
  "/product/nfc-stickers/":                "/site-assets/wp-content/uploads/2024/03/NFC_stickers.jpg",
  "/product/rfid-sticker-on-headlight/":   "/site-assets/wp-content/uploads/2024/09/headlight_rfid_sticker.jpg",
  "/product/rfid-windshield-tag/":         "/site-assets/wp-content/uploads/2023/12/rfid_windshield_tag.jpg",
  // RFID Tags
  "/product/car-transponder-chip/":        "/site-assets/wp-content/uploads/2024/10/car_transponder_chip.jpg",
  "/product/pps-rfid-laundry-tag/":        "/site-assets/wp-content/uploads/2024/09/PPS_laundry_tag.jpg",
  "/product/rfid-laundry-tags/":           "/site-assets/wp-content/uploads/2023/12/rfid_laundry_tags.jpg",
  "/product/rfid-silicone-laundry-tag/":   "/site-assets/wp-content/uploads/2024/09/RFID_silicone_laundry_tag.jpg",
  "/product/rfid-tag-with-led-light/":     "/site-assets/wp-content/uploads/2023/12/rfid_tag_with_led.jpg",
  // RFID Readers
  "/product/nfc-reader-writer-with-free-sdks/": "/site-assets/wp-content/uploads/2024/06/nfc_reader_writer_uFR.jpg",
};

/* ── Load landing definitions from Content Collections ────────────────── */

interface LandingDef {
  route: string;
  title: string;
  summary: string;
  heroImage?: string;
  imageSourceRoutes: string[];
  group: string;
  /** Explicit chip-family facet values — takes precedence over regex scan for the chip group. See FACET_RULES.chip below for the vocabulary. */
  chipFamilies?: string[];
  /** Explicit environment-tag facet values — takes precedence over regex scan for the env group. See FACET_RULES.env below for the vocabulary. */
  envFamilies?: string[];
}

let _landingDefsCache: LandingDef[] | null = null;

async function loadLandingDefinitions(): Promise<LandingDef[]> {
  if (_landingDefsCache) return _landingDefsCache;
  const entries = await getCollection("editorial");
  _landingDefsCache = entries
    .filter((e) => !e.id.startsWith("_unused/"))
    .filter((e) => e.data.group === "products")
    .map((e) => e.data as unknown as LandingDef);
  return _landingDefsCache;
}

/* Show ALL products on a single page — no pagination */
const CATALOG_PAGE_SIZE = 999;

/* ── Faceted-filter spec (W3-4d) ────────────────────────────────────────── */
/* Three facet groups — frequency / chip family / environment — derived from
   each product's title + summary at build time. Emitted as data-* attributes
   on every <li.product> card so client-side JS can hide/show without a round
   trip. Multi-select within a group is OR; AND across groups. */
type FacetGroup = "freq" | "chip" | "env";
type Facets = Record<FacetGroup, string[]>;

interface FacetSpec { value: string; label: string; rx: RegExp; }
const FACET_RULES: Record<FacetGroup, FacetSpec[]> = {
  freq: [
    { value: "lf",  label: "LF (125 kHz)",
      rx: /\b(125\s?kHz|\bLF\s?RFID|low[\s-]?frequency|EM41[02]0|EM4305|T5577|TK4100|HID\s?Prox)\b/i },
    { value: "hf",  label: "HF / NFC (13.56 MHz)",
      rx: /\b(13\.56\s?MHz|\bHF\s?RFID|\bNFC\b|MIFARE|NTAG|DESFire|Ultralight|ICODE|ISO[\s-]?14443|ISO[\s-]?15693)\b/i },
    { value: "uhf", label: "UHF / RAIN (860–960 MHz)",
      rx: /\b(\bUHF\b|RAIN[\s-]?RFID|860[\s\-–]?960|EPC[\s-]?Gen\s?2?|Higgs|Monza|UCODE|Impinj\s?M(?:700|730|750|800)|M(?:700|730|750|800)\s?(?:UHF|inlay|chip))\b/i },
  ],
  chip: [
    { value: "ntag21x",          label: "NTAG21x",            rx: /\bNTAG\s?21[3567]\b/i },
    { value: "ntag424",          label: "NTAG424 DNA",        rx: /\bNTAG\s?424\b/i },
    { value: "mifare-classic",   label: "MIFARE Classic",     rx: /\bMIFARE\s?Classic\b/i },
    { value: "mifare-desfire",   label: "MIFARE DESFire",     rx: /\bDESFire\b/i },
    { value: "mifare-ultralight",label: "MIFARE Ultralight",  rx: /\b(MIFARE\s?)?Ultralight\b/i },
    { value: "mifare-plus",      label: "MIFARE Plus",        rx: /\bMIFARE\s?Plus\b/i },
    { value: "icode",            label: "ICODE SLIX",         rx: /\bICODE\b/i },
    { value: "em-tk5",           label: "EM / T5577 (LF)",    rx: /\b(EM41[02]0|EM4305|T5577|TK4100|HID\s?Prox)\b/i },
    { value: "impinj-m7",        label: "Impinj M7xx / M8xx", rx: /\b(Impinj\s?M(?:700|730|750|800)|Monza\s?R6(?:-?P)?|Monza\s?X)\b/i },
    { value: "alien-higgs",      label: "Alien Higgs",        rx: /\bAlien\s?Higgs(?:[\s-]?\d)?\b/i },
    { value: "ucode",            label: "NXP UCODE 8/9",      rx: /\bUCODE(?:\s?[89])?\b/i },
  ],
  env: [
    { value: "anti-metal", label: "On-metal / anti-metal",
      rx: /\b(anti[\s-]?metal|on[\s-]?metal|metal[\s-]?surface|metal[\s-]?asset|on[\s-]?metal\s?UHF)\b/i },
    { value: "high-temp",  label: "High-temp (≥150 °C)",
      rx: /\b(high[\s-]?temp(?:erature)?|200\s?°?\s?C|180\s?°?\s?C|150\s?°?\s?C|cure[\s-]?press|autoclave|pasteuriz|thermal[\s-]?cycling|heat[\s-]?resistant)\b/i },
    { value: "outdoor",    label: "Outdoor / IP67+",
      rx: /\b(IP6[7-9]|IP7\d|outdoor|UV[\s-]?(?:resistant|stable|stabili[sz]ed)|weather[\s-]?proof|waterproof|submersible)\b/i },
    { value: "embed",      label: "Embed / cast-in",
      rx: /\b(concrete[\s-]?embed|cast[\s-]?in|epoxy[\s-]?embed|insert[\s-]?mold|in[\s-]?mould|embedded\s?in)\b/i },
    { value: "tamper",     label: "Tamper-evident",
      rx: /\b(tamper[\s-]?(?:evident|proof|detection)|frangible|destructible|breakaway|tear[\s-]?off|TT\s?card)\b/i },
    { value: "sensor",     label: "Sensor / temp logger",
      rx: /\b(sensor[\s-]?(?:tag|enabled)|temp(?:erature)?[\s-]?logger|moisture\s?sensor|pressure\s?sensor|EM4325)\b/i },
  ],
};

function deriveFacets(...textParts: (string | undefined)[]): Facets {
  const text = textParts.filter(Boolean).join(" \n ");
  const out: Facets = { freq: [], chip: [], env: [] };
  for (const group of Object.keys(FACET_RULES) as FacetGroup[]) {
    for (const spec of FACET_RULES[group]) {
      if (spec.rx.test(text)) out[group].push(spec.value);
    }
  }
  return out;
}

/**
 * Variant of deriveFacets that lets a SKU explicitly declare chip-family
 * and/or environment-tag facet values (for SKUs whose chip compatibility
 * matrix or environmental specs live deep in section tables rather than
 * in title/summary — e.g. keyfobs that ship with 10+ chip options, or
 * tags whose IP68 / 200 °C claims live in a spec-sheet row).
 *
 * Values are validated against the relevant FACET_RULES group and unknown
 * values are dropped silently. Unions the explicit list with whatever the
 * regex scan already found (so an editor's explicit list plus a regex hit
 * in the summary both land in the final set). If an override array is
 * omitted or empty, the corresponding group falls back to regex-scan.
 */
function deriveFacetsWithOverrides(
  overrides: { chip?: string[]; env?: string[] },
  ...textParts: (string | undefined)[]
): Facets {
  const facets = deriveFacets(...textParts);
  const applyOverride = (group: "chip" | "env", explicit: string[] | undefined) => {
    if (!explicit || explicit.length === 0) return;
    const validValues = new Set(FACET_RULES[group].map((spec) => spec.value));
    const filtered = explicit.filter((v) => validValues.has(v));
    const merged = Array.from(new Set([...facets[group], ...filtered]));
    facets[group] = FACET_RULES[group]
      .map((spec) => spec.value)
      .filter((v) => merged.includes(v));
  };
  applyOverride("chip", overrides.chip);
  applyOverride("env", overrides.env);
  return facets;
}

interface CatalogProduct {
  route: string;
  title: string;
  image: string;
  summary: string;
  facets: Facets;
}

export async function mergeCatalogPages(siteData: SiteData): Promise<SiteData> {
  const template = await pickCatalogTemplate(siteData);

  if (!template) {
    return siteData;
  }

  const products = await collectCatalogProducts(siteData);
  await getProductCategories(); // populate _productCategoriesCache before sync usage

  if (products.length === 0) {
    return siteData;
  }

  const paginatedProducts = paginate(products, CATALOG_PAGE_SIZE);
  const overrides = [
    buildCatalogArchivePage(siteData, template, {
      route: "/products/all/",
      pageNumber: 1,
      totalPages: paginatedProducts.length,
      totalProducts: products.length,
      products: paginatedProducts[0] ?? [],
    }),
    buildCatalogRedirectPage(siteData, template, "/products/all/page/1/", "/products/all/", "Products"),
    buildCatalogRedirectPage(siteData, template, "/product-category/products/", "/products/all/", "Products"),
    buildCatalogRedirectPage(siteData, template, "/product-category/products/page/1/", "/products/all/", "Products"),
    ...(await buildLegacyCollectionAliasPages(siteData)),
    buildIndustriesPage(siteData, template, products),
  ];

  for (let index = 1; index < paginatedProducts.length; index += 1) {
    const pageNumber = index + 1;

    overrides.push(
      buildCatalogArchivePage(siteData, template, {
        route: `/products/all/page/${pageNumber}/`,
        pageNumber,
        totalPages: paginatedProducts.length,
        totalProducts: products.length,
        products: paginatedProducts[index] ?? [],
      }),
    );

    overrides.push(
      buildCatalogRedirectPage(
        siteData,
        template,
        `/product-category/products/page/${pageNumber}/`,
        `/products/all/page/${pageNumber}/`,
        "Products",
      ),
    );
  }

  const mergedPages = new Map(siteData.pages.map((page) => [page.route, page]));

  overrides.forEach((page) => {
    mergedPages.set(page.route, page);
  });

  const pages = [...mergedPages.values()].sort((left, right) => left.route.localeCompare(right.route));

  return {
    ...siteData,
    pageCount: pages.length,
    pages,
  };
}

async function pickCatalogTemplate(siteData: SiteData): Promise<SnapshotPage | undefined> {
  const candidates = ["/products/all/", "/products/rfid-cards/"];
  for (const route of candidates) {
    if (siteData.pages.some((p) => p.route === route)) {
      try { return await loadPageFromDisk(route); } catch { /* skip */ }
    }
  }
  const fallback = siteData.pages.find((p) => p.route.startsWith("/products/"));
  if (fallback) {
    try { return await loadPageFromDisk(fallback.route); } catch { /* skip */ }
  }
  return undefined;
}

async function collectCatalogProducts(siteData: SiteData): Promise<CatalogProduct[]> {
  // Load WP product pages from disk for image/summary extraction.
  // WP stubs that have a canonical override (see ROUTE_CANONICAL_OVERRIDES in
  // route-overrides.ts) are dropped from the filter grid on W3-4d⁵ — the
  // richer content-collection landing takes their slot. The stub page itself
  // stays reachable as a soft-landing so existing inbound links don't 404.
  const wpProductStubs = siteData.pages.filter(
    (page) => page.route.startsWith("/product/") && !ROUTE_CANONICAL_OVERRIDES[page.route],
  );
  const wpProducts: CatalogProduct[] = [];
  for (const stub of wpProductStubs) {
    try {
      const page = await loadPageFromDisk(stub.route);
      const title = stripSiteSuffix(page.title) || slugToTitle(page.route.split("/").filter(Boolean).pop() ?? "Product");
      const summary = extractProductSummary(page.bodyHtml);
      wpProducts.push({
        route: page.route,
        title,
        image: WP_IMAGE_OVERRIDES[page.route] ?? CATALOG_IMAGE_OVERRIDES[page.route] ?? extractFirstImage(page.bodyHtml),
        summary,
        facets: deriveFacets(title, summary, page.route),
      });
    } catch {
      const title = stripSiteSuffix(stub.title) || slugToTitle(stub.route.split("/").filter(Boolean).pop() ?? "Product");
      wpProducts.push({
        route: stub.route,
        title,
        image: WP_IMAGE_OVERRIDES[stub.route] ?? CATALOG_IMAGE_OVERRIDES[stub.route] ?? "",
        summary: "",
        facets: deriveFacets(title, stub.route),
      });
    }
  }

  // Load landing definitions from Content Collections. Industry Solutions
  // landing pages (/industries/*) live in the main-nav "Industries" mega-menu
  // instead of the product catalog — skip them here so they don't show up as
  // products and so the catalog rail has no "Industry Solutions" entry.
  const allLandingDefs = (await loadLandingDefinitions()).filter(
    (d) => !d.route.startsWith("/industries/"),
  );
  const landingProducts: CatalogProduct[] = [];
  for (const def of allLandingDefs) {
    // 1) Check override map first (ensures unique images in catalog grid)
    let image = CATALOG_IMAGE_OVERRIDES[def.route] ?? "";
    // 2) Then heroImage from the definition
    if (!image) image = def.heroImage ?? "";
    // 3) Fall back to extracting from source routes
    if (!image) {
      for (const sourceRoute of def.imageSourceRoutes) {
        try {
          const sourcePage = await loadPageFromDisk(sourceRoute);
          image = extractFirstImage(sourcePage.bodyHtml);
          if (image) break;
        } catch { /* source page not on disk — skip */ }
      }
    }

    const title = stripSiteSuffix(def.title) || slugToTitle(def.route.split("/").filter(Boolean).pop() ?? "Product");
    const summary = truncateText(def.summary, 160);
    landingProducts.push({
      route: def.route,
      title,
      image,
      summary,
      // Include the route slug so mount-type words like "anti-metal" or
      // "on-metal" embedded in URLs (e.g. /products/rfid-tags/anti-metal-…)
      // are picked up even when the marketing summary is short.
      // Explicit chipFamilies / envFamilies take precedence for SKUs whose
      // chip matrix or env specs live in section tables rather than
      // title/summary (keyfobs with 10-chip matrices, on-metal UHF tags
      // with IP68 spec rows, etc.).
      facets: deriveFacetsWithOverrides(
        { chip: def.chipFamilies, env: def.envFamilies },
        title,
        summary,
        def.route,
      ),
    });
  }

  return [...wpProducts, ...landingProducts].sort((left, right) => left.route.localeCompare(right.route));
}

async function buildLegacyCollectionAliasPages(siteData: SiteData): Promise<SnapshotPage[]> {
  const stubs = siteData.pages
    .filter((page) => /^\/products\/[^/]+\/(?:page\/\d+\/)?$/.test(page.route))
    .filter((page) => !page.route.startsWith("/products/all/"));

  const results: SnapshotPage[] = [];
  for (const stub of stubs) {
    try {
      const fullPage = await loadPageFromDisk(stub.route);
      results.push(cloneSnapshotPage(siteData, fullPage, stub.route.replace(/^\/products\//, "/product-category/products/")));
    } catch {
      // Page doesn't exist on disk (synthetic) — clone stub as-is
      results.push(cloneSnapshotPage(siteData, stub, stub.route.replace(/^\/products\//, "/product-category/products/")));
    }
  }
  return results;
}

function buildCatalogArchivePage(
  siteData: SiteData,
  template: SnapshotPage,
  {
    route,
    pageNumber,
    totalPages,
    totalProducts,
    products,
  }: {
    route: string;
    pageNumber: number;
    totalPages: number;
    totalProducts: number;
    products: CatalogProduct[];
  },
): SnapshotPage {
  const title = pageNumber === 1 ? "Products" : `Products Page ${pageNumber}`;
  const bodyHtml = buildArchiveBodyHtml(template.bodyHtml, {
    route,
    title,
    description:
      pageNumber === 1
        ? "Browse the full exported English Proud Tek product catalog, covering RFID cards, tags, labels, readers, keyfobs and wristbands."
        : `Continue browsing the exported English Proud Tek product catalog on page ${pageNumber} of ${totalPages}.`,
    pageNumber,
    totalPages,
    totalProducts,
    products,
  });

  return {
    route,
    sourceUrl: `${siteData.siteOrigin}${route}`,
    title: pageNumber === 1 ? "Products – Proud Tek" : `Products – Page ${pageNumber} – Proud Tek`,
    htmlAttrs: { ...template.htmlAttrs },
    bodyAttrs: { ...template.bodyAttrs },
    headHtml: template.headHtml,
    bodyHtml,
  };
}

function cloneSnapshotPage(siteData: SiteData, sourcePage: SnapshotPage, route: string): SnapshotPage {
  return {
    route,
    sourceUrl: `${siteData.siteOrigin}${route}`,
    title: sourcePage.title,
    htmlAttrs: { ...sourcePage.htmlAttrs },
    bodyAttrs: { ...sourcePage.bodyAttrs },
    headHtml: sourcePage.headHtml,
    bodyHtml: sourcePage.bodyHtml,
  };
}

function buildCatalogRedirectPage(
  siteData: SiteData,
  template: SnapshotPage,
  route: string,
  target: string,
  label: string,
): SnapshotPage {
  return {
    route,
    sourceUrl: `${siteData.siteOrigin}${route}`,
    title: `Redirecting – ${label} – Proud Tek`,
    htmlAttrs: { ...template.htmlAttrs },
    bodyAttrs: { ...template.bodyAttrs },
    headHtml: `${template.headHtml}\n<meta http-equiv="refresh" content="0; url=${target}">`,
    bodyHtml: buildRedirectBodyHtml(template.bodyHtml, label, target),
  };
}

function buildArchiveBodyHtml(
  templateBodyHtml: string,
  {
    route,
    title,
    description,
    pageNumber,
    totalPages,
    totalProducts,
    products,
  }: {
    route: string;
    title: string;
    description: string;
    pageNumber: number;
    totalPages: number;
    totalProducts: number;
    products: CatalogProduct[];
  },
): string {
  const $ = load(`<body>${templateBodyHtml}</body>`, { decodeEntities: false });
  const main = $("main#main, main.site-main").first();

  if (!main.length) {
    return templateBodyHtml;
  }

  main.html(renderCatalogMain({ route, title, description, pageNumber, totalPages, totalProducts, products }));

  // The /products/all/ catalog has its own in-page sticky navigator
  // (`.codex-catalog-sidebar`) so the legacy WooCommerce sidebar widgets
  // (RFID Labels / RFID Readers / Tag Cloud ...) are removed and the content
  // column stretches full-width, matching the /industries/ page layout.
  const wpSidebar = $("aside.primary-sidebar, .widget-area").first();
  if (wpSidebar.length) wpSidebar.remove();
  const contentCol = $(".content-area, .site-content > .ast-container > div").first();
  if (contentCol.length) {
    contentCol.css("width", "100%").css("max-width", "100%").css("float", "none");
  }

  return $("body").html() ?? templateBodyHtml;
}

function buildRedirectBodyHtml(templateBodyHtml: string, label: string, target: string): string {
  const $ = load(`<body>${templateBodyHtml}</body>`, { decodeEntities: false });
  const main = $("main#main, main.site-main").first();

  if (!main.length) {
    return templateBodyHtml;
  }

  main.html(html`
    <div class="woocommerce-notices-wrapper"></div>
    <header class="woocommerce-products-header">
      <h1 class="page-title archive-title">Redirecting</h1>
      <div class="term-description">
        <p>This legacy Proud Tek catalog route now points to the current English ${label} archive.</p>
        <p><a href="${target}">Continue to ${label}</a></p>
      </div>
    </header>
  `);

  return $("body").html() ?? templateBodyHtml;
}

/* ────────────────────────────────────────────────────────────────────────────
 * Product category definitions for the single-page catalog
 * ──────────────────────────────────────────────────────────────────────────── */
interface ProductCategory {
  id: string;
  label: string;
  icon: string;
  description: string;
  routes: string[];
}

/* Landing page routes grouped by category prefix — computed lazily */
let _productCategoriesCache: ProductCategory[] | null = null;

async function getProductCategories(): Promise<ProductCategory[]> {
  if (_productCategoriesCache) return _productCategoriesCache;

  const allLanding = await loadLandingDefinitions();
  const landingRoutesByPrefix = (prefix: string) =>
    allLanding.filter((d) => d.route.startsWith(prefix)).map((d) => d.route);

  const LANDING_CARD_ROUTES = landingRoutesByPrefix("/products/rfid-cards/");
  const LANDING_KEYFOB_ROUTES = landingRoutesByPrefix("/products/rfid-keyfobs/");
  const LANDING_WRISTBAND_ROUTES = landingRoutesByPrefix("/products/rfid-wristbands/");
  const LANDING_LABEL_ROUTES = landingRoutesByPrefix("/products/rfid-labels/");
  const LANDING_TAG_ROUTES = landingRoutesByPrefix("/products/rfid-tags/");
  // Industry Solutions (/industries/*) are NOT listed in the product catalog.
  // They live in the main-nav Industries mega-menu exclusively.

  /* Categories match the WordPress WooCommerce sidebar exactly. */
  _productCategoriesCache = [
  {
    id: "rfid-cards",
    label: "RFID Cards",
    icon: "💳",
    description: "Contactless smart cards for access control, transit, hospitality, corporate ID and NFC applications.",
    routes: [
      /* WordPress /products/rfid-cards/ page-1 (16 items) */
      "/product/125-khz-rfid-card/",
      "/product/blank-rfid-card/",
      "/product/clamshell-card/",
      "/product/combi-card/",
      "/product/dual-interface-card/",
      "/product/eco_rfid_card/",
      "/product/em4200-card/",
      "/product/em4305-card/",
      "/product/felica-card/",
      "/product/google-review-nfc-card/",
      "/product/hitag-2-card/",
      "/product/hotel-key-cards/",
      "/product/inkjet-pvc-id-card/",
      "/product/java-card/",
      "/product/legic-card/",
      "/product/metal-nfc-card/",
      /* Previously uncategorized cards (WP pagination cut-off) */
      "/product/mifare-4k-card/",
      "/product/mifare-classic-card/",
      "/product/mifare-desfire-cards/",
      "/product/mifare-desfire-ev2-cards/",
      "/product/mifare-plus-card/",
      "/product/nfc-business-card/",
      "/product/nfc-cards/",
      "/product/printed-rfid-cards/",
      "/product/rfid-paper-card/",
      "/product/t5577-card/",
      "/product/wooden-rfid-card/",
      ...LANDING_CARD_ROUTES,
    ],
  },
  {
    id: "rfid-keyfobs",
    label: "RFID Keyfobs",
    icon: "🔑",
    description: "Durable RFID key fobs for door access, gate control and employee identification systems.",
    routes: [
      "/product/desfire-tag/",
      "/product/nfc-ring/",
      "/product/proximity-fobs/",
      "/product/rfid-key-fob/",
      ...LANDING_KEYFOB_ROUTES,
    ],
  },
  {
    id: "rfid-wristbands",
    label: "RFID Wristbands",
    icon: "⌚",
    description: "Silicone, fabric and disposable RFID wristbands for events, hotels, resorts and water parks.",
    routes: [
      "/product/coconut-shell-rfid-wristband/",
      "/product/rfid-event-wristband/",
      "/product/rfid-silicone-wristbands/",
      "/product/rfid-wristbands-for-events/",
      "/product/rfid-wristbands-for-hotels/",
      "/product/uhf-wristband/",
      ...LANDING_WRISTBAND_ROUTES,
    ],
  },
  {
    id: "rfid-labels",
    label: "RFID Labels",
    icon: "🏷️",
    description: "NFC stickers, RFID labels and windshield tags for product authentication, tracking and smart packaging.",
    routes: [
      "/product/125khz-rfid-sticker/",
      "/product/mifare-stickers/",
      "/product/nfc-sticker/",
      "/product/nfc-stickers/",
      "/product/rfid-sticker-on-headlight/",
      "/product/rfid-windshield-tag/",
      ...LANDING_LABEL_ROUTES,
    ],
  },
  {
    id: "rfid-readers",
    label: "RFID Readers",
    icon: "📡",
    description: "Desktop NFC reader/writer devices and Bluetooth RFID scanners for encoding, development and field use.",
    routes: [
      "/product/acr122u/",
      "/product/bluetooth-rfid-scanner/",
      "/product/nfc-reader-writer-with-free-sdks/",
    ],
  },
  {
    id: "rfid-tags",
    label: "RFID Tags",
    icon: "📌",
    description: "Industrial RFID laundry tags, asset tracking tags and specialty tags for harsh environments.",
    routes: [
      "/product/car-transponder-chip/",
      "/product/pps-rfid-laundry-tag/",
      "/product/rfid-laundry-tags/",
      "/product/rfid-silicone-laundry-tag/",
      "/product/rfid-tag-with-led-light/",
      ...LANDING_TAG_ROUTES,
    ],
  },
  /* NOTE: Industry Solutions deliberately NOT included as a catalog category.
     The 15 /industries/* landing pages are accessed via the main-nav
     "Industries" mega-menu only — they're verticals/use-cases, not products. */
  ];

  return _productCategoriesCache;
}

/** Sync version — requires getProductCategories() to have been called first. */
function categorizeProductsSync(products: CatalogProduct[]): { category: ProductCategory; items: CatalogProduct[] }[] {
  const categories = _productCategoriesCache ?? [];
  const assignedRoutes = new Set<string>();
  const result: { category: ProductCategory; items: CatalogProduct[] }[] = [];

  for (const category of categories) {
    const routeSet = new Set(category.routes);
    const items = products.filter((product) => routeSet.has(product.route));
    items.forEach((item) => assignedRoutes.add(item.route));
    if (items.length > 0) {
      result.push({ category, items });
    }
  }

  // Catch any uncategorized products
  const uncategorized = products.filter((product) => !assignedRoutes.has(product.route));
  if (uncategorized.length > 0) {
    result.push({
      category: { id: "other", label: "Other Products", icon: "📦", description: "Additional RFID and NFC products.", routes: [] },
      items: uncategorized,
    });
  }

  return result;
}

function renderCatalogMain({
  route,
  title,
  description,
  totalProducts,
  products,
}: {
  route: string;
  title: string;
  description: string;
  pageNumber: number;
  totalPages: number;
  totalProducts: number;
  products: CatalogProduct[];
}): string {
  const categorized = categorizeProductsSync(products);

  // Sticky left-side navigator — borrowed styling from the /industries/ page
  // (`.ind-sidebar` class family). One row per category with icon + label +
  // product-count pill. Clicking a row smooth-scrolls the matching section.
  const sidebarLinksHtml = categorized
    .map(
      ({ category, items }) => `<a href="#${category.id}" class="ind-sidebar__link" data-target="${category.id}">
        <span class="ind-sidebar__emoji">${category.icon}</span>
        <span class="ind-sidebar__label">${category.label}</span>
        <span class="ind-sidebar__count" data-cat-count="${category.id}">${items.length}</span>
      </a>`,
    )
    .join("");

  // Tally how many products carry each facet value so the filter panel can
  // display "(N)" next to each checkbox. Skips facet values with zero hits
  // (e.g. when no SKU mentions Alien Higgs at all there's no checkbox for it).
  const facetCounts: Record<FacetGroup, Record<string, number>> = {
    freq: {}, chip: {}, env: {},
  };
  for (const p of products) {
    for (const group of Object.keys(FACET_RULES) as FacetGroup[]) {
      for (const v of p.facets[group]) {
        facetCounts[group][v] = (facetCounts[group][v] ?? 0) + 1;
      }
    }
  }

  const FACET_GROUP_LABELS: Record<FacetGroup, { label: string; icon: string }> = {
    freq: { label: "Frequency",       icon: "📡" },
    chip: { label: "Chip family",     icon: "🔌" },
    env:  { label: "Environment",     icon: "🛡️" },
  };

  const filterPanelHtml = (Object.keys(FACET_RULES) as FacetGroup[])
    .map((group) => {
      const rows = FACET_RULES[group]
        .filter((spec) => (facetCounts[group][spec.value] ?? 0) > 0)
        .map(
          (spec) => `<label class="codex-facet-option">
            <input type="checkbox" data-facet-group="${group}" value="${spec.value}">
            <span class="codex-facet-option__label">${spec.label}</span>
            <span class="codex-facet-option__count">${facetCounts[group][spec.value]}</span>
          </label>`,
        )
        .join("");
      if (!rows) return "";
      return `<div class="codex-facet-group" data-facet-group-wrap="${group}">
        <div class="codex-facet-group__title">
          <span class="codex-facet-group__icon" aria-hidden="true">${FACET_GROUP_LABELS[group].icon}</span>
          ${FACET_GROUP_LABELS[group].label}
        </div>
        ${rows}
      </div>`;
    })
    .join("");
  const hasFilters = filterPanelHtml.length > 0;

  const categorySectionsHtml = categorized
    .map(
      ({ category, items }) => `
        <section class="codex-catalog-category" id="${category.id}">
          <div class="codex-catalog-category-header">
            <h2>${category.icon} ${category.label}</h2>
            <p>${category.description}</p>
            <span class="codex-catalog-count">${items.length} products</span>
          </div>
          <ul class="products columns-4">
            ${items.map((product, i) => renderProductCard(product, i === 0 && items.length >= 4)).join("")}
          </ul>
        </section>`,
    )
    .join("");

  return html`
    <div class="woocommerce-notices-wrapper"></div>
    <button type="button"
            class="codex-catalog-rail-toggle"
            aria-expanded="false"
            aria-controls="codex-catalog-rail-panel"
            aria-label="Show product categories">
      <span class="codex-catalog-rail-toggle__icon" aria-hidden="true">🗂️</span>
      <span class="codex-catalog-rail-toggle__label">Categories</span>
    </button>
    <div class="codex-catalog-rail-backdrop" hidden></div>
    <aside id="codex-catalog-rail-panel" class="codex-catalog-rail" aria-label="Product categories">
      <button type="button" class="codex-catalog-rail__close" aria-label="Close categories">✕</button>
      <nav class="ind-sidebar__nav">
        <div class="ind-sidebar__title">Product Families</div>
        ${raw(sidebarLinksHtml)}
      </nav>
      ${raw(hasFilters ? `<div class="codex-catalog-filter" data-total-products="${totalProducts}">
        <div class="codex-catalog-filter__header">
          <div class="ind-sidebar__title">Filter by spec</div>
          <button type="button" class="codex-catalog-filter__clear" hidden>Clear</button>
        </div>
        ${filterPanelHtml}
      </div>` : "")}
    </aside>
    <header class="woocommerce-products-header">
      ${raw(renderBreadcrumbs(route, title))}
      <h2 class="page-title archive-title">${title}</h2>
      <div class="term-description">
        <p>${description}</p>
      </div>
    </header>
    <p class="woocommerce-result-count" data-default-count="${totalProducts}">${raw(`Showing all ${totalProducts} products`)}</p>
    <div class="codex-catalog-content">
      ${raw(categorySectionsHtml)}
    </div>
    <div class="codex-catalog-empty" hidden>
      <div class="codex-catalog-empty__icon" aria-hidden="true">🔍</div>
      <h3 class="codex-catalog-empty__title">No products match these filters</h3>
      <p class="codex-catalog-empty__desc">Try unselecting one or two criteria, or clear all filters to see the full catalog.</p>
      <button type="button" class="codex-catalog-empty__clear">Clear filters</button>
    </div>
    <script>
    (function(){
      var rail = document.getElementById('codex-catalog-rail-panel');
      var toggle = document.querySelector('.codex-catalog-rail-toggle');
      var backdrop = document.querySelector('.codex-catalog-rail-backdrop');
      var closeBtn = rail ? rail.querySelector('.codex-catalog-rail__close') : null;
      var links = document.querySelectorAll('.codex-catalog-rail .ind-sidebar__link');
      var sections = document.querySelectorAll('.codex-catalog-content .codex-catalog-category');
      if (!links.length || !sections.length) return;

      // Scroll-spy: highlight the rail entry for the section currently in view.
      function update(){
        var scrollY = window.scrollY + 120;
        var active = null;
        sections.forEach(function(s){ if (s.offsetTop <= scrollY) active = s.id; });
        links.forEach(function(l){
          if (l.getAttribute('data-target') === active) l.classList.add('active');
          else l.classList.remove('active');
        });
      }
      var ticking = false;
      window.addEventListener('scroll', function(){
        if (!ticking) { ticking = true; requestAnimationFrame(function(){ update(); ticking = false; }); }
      }, {passive:true});
      update();

      // Collapse / expand behaviour (only active at narrow viewports via CSS).
      function openRail(){
        if (!rail) return;
        rail.classList.add('is-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'true');
        if (backdrop) backdrop.hidden = false;
        document.body.classList.add('codex-catalog-rail-locked');
      }
      function closeRail(){
        if (!rail) return;
        rail.classList.remove('is-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
        if (backdrop) backdrop.hidden = true;
        document.body.classList.remove('codex-catalog-rail-locked');
      }
      if (toggle) toggle.addEventListener('click', function(){
        if (rail && rail.classList.contains('is-open')) closeRail(); else openRail();
      });
      if (closeBtn) closeBtn.addEventListener('click', closeRail);
      if (backdrop) backdrop.addEventListener('click', closeRail);
      document.addEventListener('keydown', function(e){
        if (e.key === 'Escape' && rail && rail.classList.contains('is-open')) closeRail();
      });

      // Smooth-scroll on link click, and auto-close the overlay on narrow viewports.
      links.forEach(function(l){
        l.addEventListener('click', function(e){
          e.preventDefault();
          var target = document.getElementById(l.getAttribute('data-target'));
          if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
          if (window.matchMedia('(max-width: 1279px)').matches) closeRail();
        });
      });

      // ---------------------------------------------------------------
      // Faceted filter: AND across groups (freq AND chip AND env),
      //                 OR  within  a group (freq == lf OR hf).
      // Products carry space-separated data-facet-<group>=".." tokens;
      // an empty token string means "card doesn't match any value in
      // that group", so it's hidden when the group has any checkbox
      // ticked.
      // ---------------------------------------------------------------
      var filterPanel = document.querySelector('.codex-catalog-filter');
      var cards = document.querySelectorAll('.codex-catalog-content li.product');
      var categoryBlocks = document.querySelectorAll('.codex-catalog-content .codex-catalog-category');
      var countPills = document.querySelectorAll('.ind-sidebar__count[data-cat-count]');
      var resultCount = document.querySelector('.woocommerce-result-count');
      var emptyState = document.querySelector('.codex-catalog-empty');
      var clearBtn = filterPanel ? filterPanel.querySelector('.codex-catalog-filter__clear') : null;
      var clearBtnEmpty = emptyState ? emptyState.querySelector('.codex-catalog-empty__clear') : null;

      if (!filterPanel || !cards.length) return;

      var totalProducts = parseInt(filterPanel.getAttribute('data-total-products') || '0', 10) || cards.length;

      function readSelectedFacets(){
        var out = { freq: [], chip: [], env: [] };
        var boxes = filterPanel.querySelectorAll('input[type="checkbox"][data-facet-group]:checked');
        boxes.forEach(function(b){
          var g = b.getAttribute('data-facet-group');
          var v = b.value;
          if (out[g]) out[g].push(v);
        });
        return out;
      }

      function cardMatches(card, sel){
        var groups = ['freq', 'chip', 'env'];
        for (var i = 0; i < groups.length; i++){
          var g = groups[i];
          if (!sel[g].length) continue;
          var attr = card.getAttribute('data-facet-' + g) || '';
          var tokens = attr.split(/\s+/).filter(Boolean);
          var ok = false;
          for (var j = 0; j < sel[g].length; j++){
            if (tokens.indexOf(sel[g][j]) !== -1) { ok = true; break; }
          }
          if (!ok) return false;
        }
        return true;
      }

      function applyFilters(){
        var sel = readSelectedFacets();
        var anyActive = sel.freq.length + sel.chip.length + sel.env.length > 0;
        var visible = 0;
        var perCategory = {};

        cards.forEach(function(card){
          var match = !anyActive || cardMatches(card, sel);
          card.hidden = !match;
          if (match){
            visible += 1;
            var section = card.closest('.codex-catalog-category');
            if (section) {
              var id = section.id;
              perCategory[id] = (perCategory[id] || 0) + 1;
            }
          }
        });

        // Hide empty category sections while filters are active.
        categoryBlocks.forEach(function(section){
          var n = perCategory[section.id] || 0;
          section.hidden = anyActive && n === 0;
          var hdrCount = section.querySelector('.codex-catalog-count');
          if (hdrCount) {
            if (anyActive) hdrCount.textContent = n + ' product' + (n === 1 ? '' : 's');
            else hdrCount.textContent = section.querySelectorAll('li.product').length + ' products';
          }
        });

        // Rail count pills stay in sync with what's actually visible.
        countPills.forEach(function(pill){
          var id = pill.getAttribute('data-cat-count');
          var n = anyActive ? (perCategory[id] || 0) : null;
          if (n === null) {
            // Restore original full count.
            var section = document.getElementById(id);
            if (section) pill.textContent = String(section.querySelectorAll('li.product').length);
          } else {
            pill.textContent = String(n);
          }
          if (anyActive && n === 0) pill.classList.add('is-empty');
          else pill.classList.remove('is-empty');
        });

        // "Showing N of M" / "Showing all M" line up top.
        if (resultCount) {
          if (anyActive) resultCount.textContent = 'Showing ' + visible + ' of ' + totalProducts + ' products';
          else resultCount.textContent = 'Showing all ' + totalProducts + ' products';
        }

        // Empty state + clear-button visibility.
        if (emptyState) emptyState.hidden = !(anyActive && visible === 0);
        if (clearBtn) clearBtn.hidden = !anyActive;
        filterPanel.classList.toggle('has-active-filters', anyActive);
      }

      function clearAll(){
        var boxes = filterPanel.querySelectorAll('input[type="checkbox"][data-facet-group]:checked');
        boxes.forEach(function(b){ b.checked = false; });
        applyFilters();
      }

      filterPanel.addEventListener('change', function(e){
        if (e.target && e.target.matches('input[type="checkbox"][data-facet-group]')) applyFilters();
      });
      if (clearBtn) clearBtn.addEventListener('click', clearAll);
      if (clearBtnEmpty) clearBtnEmpty.addEventListener('click', clearAll);
    })();
    </script>
  `;
}

function renderBreadcrumbs(route: string, title: string): string {
  const links = [
    { href: "/", label: "Home" },
    { href: "/products/all/", label: "Products" },
  ];

  if (route !== "/products/all/") {
    links.push({ href: route, label: title });
  }

  const breadcrumbItems = links
    .map((link, index) =>
      index === links.length - 1
        ? html`<span class="kadence-bread-current">${link.label}</span>`
        : html`<span><a href="${link.href}" itemprop="url"><span>${link.label}</span></a></span>`,
    )
    .join(' <span class="bc-delimiter">/</span> ');

  return html`<nav id="kadence-breadcrumbs" aria-label="Breadcrumbs" class="kadence-breadcrumbs">
    <div class="kadence-breadcrumb-container">${raw(breadcrumbItems)}</div>
  </nav>`;
}

function buildSrcset(_src: string): string {
  // WordPress resized variants use inconsistent sizes (600x599, 600x601, etc.)
  // that cause 404s. Disabled until a build-time check can verify variant existence.
  return "";
}

function renderProductCard(product: CatalogProduct, featured = false): string {
  const srcset = product.image ? buildSrcset(product.image) : "";
  const loading = featured ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
  const sizes = featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw";
  const imageHtml = product.image
    ? srcset
      ? html`<img src="${product.image}" srcset="${srcset}" sizes="${raw(sizes)}" alt="${product.title}" ${raw(loading)} decoding="async">`
      : html`<img src="${product.image}" alt="${product.title}" ${raw(loading)} decoding="async">`
    : "";
  const summaryHtml = product.summary
    ? html`<p class="codex-catalog-summary">${product.summary}</p>`
    : "";
  const featuredClass = featured ? " codex-catalog-featured" : "";

  // Emit derived facets as space-separated data-* attributes so the
  // client-side filter can hide/show without reading any DOM beyond the
  // <li>. Empty groups fall back to "" — the JS treats that as "matches no
  // selected filter for that group" (i.e. the card is hidden if the user
  // has any filter ticked in that group).
  const facetAttrs = raw(
    `data-facet-freq="${product.facets.freq.join(" ")}" ` +
    `data-facet-chip="${product.facets.chip.join(" ")}" ` +
    `data-facet-env="${product.facets.env.join(" ")}"`,
  );

  return html`<li class="product type-product status-publish product-type-simple instock${raw(featuredClass)}" ${facetAttrs}>
    <a href="${product.route}" class="woocommerce-LoopProduct-link woocommerce-loop-product__link">
      ${raw(imageHtml)}
      <h2 class="woocommerce-loop-product__title">${product.title}</h2>
    </a>
    ${raw(summaryHtml)}
    <a href="${product.route}" class="button product_type_simple">${raw(featured ? "View Details →" : "Read more")}</a>
  </li>`;
}

function renderPagination(pageNumber: number, totalPages: number): string {
  if (totalPages <= 1) {
    return "";
  }

  const items: string[] = [];

  if (pageNumber > 1) {
    const prevHref = pageNumber === 2 ? "/products/all/" : `/products/all/page/${pageNumber - 1}/`;
    items.push(html`<li><a class="prev page-numbers" href="${prevHref}">Previous</a></li>`);
  }

  for (let current = 1; current <= totalPages; current += 1) {
    if (current === pageNumber) {
      items.push(`<li><span aria-current="page" class="page-numbers current">${current}</span></li>`);
      continue;
    }

    const href = current === 1 ? "/products/all/" : `/products/all/page/${current}/`;
    items.push(html`<li><a class="page-numbers" href="${href}">${raw(String(current))}</a></li>`);
  }

  if (pageNumber < totalPages) {
    items.push(html`<li><a class="next page-numbers" href="${`/products/all/page/${pageNumber + 1}/`}">Next</a></li>`);
  }

  return `<nav class="woocommerce-pagination" aria-label="Products pagination"><ul class="page-numbers">${items.join("")}</ul></nav>`;
}

/* Update the WordPress sidebar product-category counts to reflect actual totals */
function updateSidebarCounts($: ReturnType<typeof load>, products: CatalogProduct[]): void {
  // Build a map of sidebar label → actual count based on our category definitions
  // Map sidebar labels to category IDs — "Products" is the total, others match by label
  const SIDEBAR_LABEL_TO_CATEGORY: Record<string, string | null> = {
    Products: null, // total
    "RFID cards": "rfid-cards",
    "RFID Keyfobs": "rfid-keyfobs",
    "RFID Wristbands": "rfid-wristbands",
    "RFID Labels": "rfid-labels",
    "RFID Readers": "rfid-readers",
    "RFID Tags": "rfid-tags",
  };

  const sidebar = $("aside.primary-sidebar, .widget-area").first();
  if (!sidebar.length) return;

  // Find all count elements in the sidebar and update them
  sidebar.find("a").each((_, el) => {
    const anchor = $(el);
    const text = anchor.text().trim();

    for (const [label, catId] of Object.entries(SIDEBAR_LABEL_TO_CATEGORY)) {
      if (text === label) {
        const parent = anchor.parent();
        const countEl = parent.find(".count, span");
        const actualCount = catId === null
          ? products.length
          : (_productCategoriesCache?.find((c) => c.id === catId)?.routes ?? []).filter((r) => products.some((p) => p.route === r)).length;

        countEl.each((_, ce) => {
          const countText = $(ce).text();
          if (/\d+/.test(countText)) {
            $(ce).text(String(actualCount));
          }
        });
        break;
      }
    }
  });
}

function extractFirstImage(bodyHtml: string): string {
  const $ = load(bodyHtml, { decodeEntities: false });
  const selectors = [".woocommerce-product-gallery__image img", ".entry-content img", ".product img", "img"];

  for (const selector of selectors) {
    const element = $(selector).get(0);

    if (!element) {
      continue;
    }

    const src = ($(element).attr("data-large_image") ?? $(element).attr("src") ?? "").trim();

    if (src.startsWith("/site-assets/")) {
      return src;
    }
  }

  return "";
}

function extractProductSummary(bodyHtml: string): string {
  const $ = load(bodyHtml, { decodeEntities: false });
  const selectors = [
    ".woocommerce-product-details__short-description p",
    ".entry-summary p",
    ".entry-content p",
  ];

  for (const selector of selectors) {
    const paragraph = $(selector)
      .toArray()
      .map((element) => cleanText($(element).text()))
      .find((text) => text.length >= 70);

    if (paragraph) {
      return truncateText(paragraph, 160);
    }
  }

  return "";
}

function paginate<T>(items: T[], size: number): T[][] {
  const pages: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    pages.push(items.slice(index, index + size));
  }

  return pages;
}

function stripSiteSuffix(title: string): string {
  return title
    .replace(/\s*[–-]\s*Custom RFID.*$/i, "")
    .replace(/\s*[–-]\s*Proud Tek.*$/i, "")
    .trim();
}

function slugToTitle(value: string): string {
  return decodeURIComponent(value)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function truncateText(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/* ── Industries summary page ────────────────────────────────────────────── */
export const INDUSTRY_CATEGORIES: Array<{
  id: string;
  title: string;
  href: string;
  description: string;
  emoji: string;
  heroImage: string;
  productRoutes: string[];
}> = [
  {
    id: "hospitality",
    title: "Hospitality",
    href: "/industries/hospitality/",
    description: "RFID key cards, guest wristbands and linen tracking tags for hotels, resorts and serviced apartments.",
    emoji: "🏨",
    heroImage: "/landing-images/hospitality.jpg",
    productRoutes: [
      "/products/rfid-cards/mifare-desfire-ev3-cards/",
      "/product/hotel-key-cards/",
      "/product/rfid-wristbands-for-hotels/",
      "/product/rfid-laundry-tags/",
      "/product/rfid-silicone-laundry-tag/",
      "/product/pps-rfid-laundry-tag/",
      "/product/mifare-classic-card/",
      "/product/mifare-desfire-cards/",
      "/product/mifare-desfire-ev2-cards/",
    ],
  },
  {
    id: "retail-apparel",
    title: "Retail & Apparel",
    href: "/industries/retail-apparel/",
    description: "UHF RFID tags for item-level inventory, source tagging, anti-theft and omnichannel retail.",
    emoji: "🛍️",
    heroImage: "/landing-images/retail-apparel.jpg",
    productRoutes: [
      "/products/rfid-labels/rfid-garment-source-tag/",
      "/products/rfid-tags/uhf-rfid-apparel-hang-tag/",
      "/products/rfid-tags/uhf-rfid-woven-care-label/",
      "/products/rfid-tags/uhf-rfid-hard-tag/",
      "/products/rfid-tags/rfid-jewelry-tag/",
      "/products/rfid-labels/uhf-rfid-paper-label/",
      "/products/rfid-labels/uhf-rfid-blank-label/",
    ],
  },
  {
    id: "brand-protection",
    title: "Brand Protection",
    href: "/industries/brand-protection/",
    description: "NFC authentication tags for product verification, anti-counterfeit and consumer engagement.",
    emoji: "🛡️",
    heroImage: "/landing-images/brand-protection.png",
    productRoutes: [
      "/products/rfid-labels/nfc-sneaker-authentication-tag/",
      "/products/rfid-labels/nfc-luxury-handbag-tag/",
      "/products/rfid-labels/nfc-cosmetics-authentication-label/",
      "/products/rfid-labels/nfc-wine-bottle-tag/",
      "/products/rfid-labels/nfc-warranty-seal-tag/",
      "/products/rfid-labels/ntag424-dna-tamper-evident-tag/",
    ],
  },
  {
    id: "events-venues",
    title: "Events & Venues",
    href: "/industries/events-venues/",
    description: "RFID wristbands for ticketing, access control, cashless payment and guest experience at events and venues.",
    emoji: "🎪",
    heroImage: "/landing-images/events-venues.jpg",
    productRoutes: [
      "/product/rfid-wristbands-for-events/",
      "/product/rfid-event-wristband/",
      "/product/rfid-silicone-wristbands/",
      "/products/rfid-wristbands/pvc-rfid-wristband/",
      "/products/rfid-wristbands/nfc-payment-wristband/",
      "/products/rfid-tags/rfid-race-timing-tag/",
      "/product/coconut-shell-rfid-wristband/",
      "/product/uhf-wristband/",
    ],
  },
  {
    id: "healthcare",
    title: "Healthcare",
    href: "/industries/healthcare/",
    description: "RFID solutions for patient identification, surgical instrument tracking, medication management and specimen labeling.",
    emoji: "🏥",
    heroImage: "/landing-images/healthcare.webp",
    productRoutes: [
      "/products/rfid-wristbands/hospital-patient-id-wristband/",
      "/products/rfid-tags/rfid-surgical-instrument-tag/",
      "/products/rfid-tags/rfid-blood-bag-tag/",
      "/products/rfid-labels/rfid-medication-vial-label/",
      "/products/rfid-labels/rfid-cryogenic-specimen-label/",
    ],
  },
  {
    id: "logistics",
    title: "Logistics & Supply Chain",
    href: "/industries/logistics/",
    description: "UHF RFID labels, pallet tags, container seals and shipping labels for supply chain visibility.",
    emoji: "📦",
    heroImage: "/landing-images/logistics.jpg",
    productRoutes: [
      "/products/rfid-labels/uhf-rfid-paper-label/",
      "/products/rfid-labels/rfid-shipping-label/",
      "/products/rfid-tags/rfid-pallet-tag/",
      "/products/rfid-tags/rfid-returnable-container-tag/",
      "/products/rfid-tags/rfid-bolt-seal/",
      "/products/rfid-labels/uhf-rfid-blank-label/",
      "/product/rfid-windshield-tag/",
    ],
  },
  {
    id: "industrial",
    title: "Industrial & Manufacturing",
    href: "/industries/industrial/",
    description: "Ruggedized RFID tags for harsh environments — high temperature, on-metal, chemical-resistant and embedded applications.",
    emoji: "🏭",
    heroImage: "/landing-images/industrial.webp",
    productRoutes: [
      "/products/rfid-tags/rfid-pcb-screw-mount-tag/",
      "/products/rfid-tags/rfid-high-temperature-ceramic-tag/",
      "/products/rfid-tags/rfid-anti-metal-tag/",
      "/products/rfid-tags/rfid-gas-cylinder-tag/",
      "/products/rfid-tags/rfid-tool-tracking-tag/",
      "/products/rfid-tags/rfid-cable-tie-tag/",
      "/products/rfid-tags/rfid-tire-tag/",
      "/products/rfid-tags/rfid-keg-beverage-tag/",
    ],
  },
  {
    id: "eu-compliance",
    title: "EU Compliance",
    href: "/industries/eu-compliance/",
    description: "NFC data carriers for EU Digital Product Passport, Battery Passport and product authentication mandates.",
    emoji: "🇪🇺",
    heroImage: "/landing-images/eu-compliance.jpg",
    productRoutes: [
      "/products/rfid-labels/nfc-digital-product-passport-tag/",
      "/products/rfid-labels/nfc-battery-passport-tag/",
      "/products/rfid-labels/ntag424-dna-tamper-evident-tag/",
    ],
  },
];

function buildIndustriesPage(
  siteData: SiteData,
  template: SnapshotPage,
  allProducts: CatalogProduct[],
): SnapshotPage {
  const $ = load(`<body>${template.bodyHtml}</body>`, { decodeEntities: false });
  const main = $("main#main, main.site-main").first();
  if (!main.length) {
    return {
      route: "/industries/",
      sourceUrl: `${siteData.siteOrigin}/industries/`,
      title: "Industries – Proud Tek",
      htmlAttrs: { ...template.htmlAttrs },
      bodyAttrs: { ...template.bodyAttrs },
      headHtml: template.headHtml,
      bodyHtml: template.bodyHtml,
    };
  }

  // Remove WordPress sidebar — full-width layout
  const sidebar = $("aside.primary-sidebar, .widget-area").first();
  if (sidebar.length) sidebar.remove();
  // Make content full-width
  const contentCol = $(".content-area, .site-content > .ast-container > div").first();
  if (contentCol.length) {
    contentCol.css("width", "100%").css("max-width", "100%").css("float", "none");
  }

  // Quick-nav pills
  const navPills = INDUSTRY_CATEGORIES.map((cat) =>
    `<a href="#${cat.id}" class="ind-pill">${cat.emoji} ${cat.title}</a>`
  ).join("");

  // Hero cards grid — each industry as a visual card
  const heroCards = INDUSTRY_CATEGORIES.map((cat) => {
    const count = cat.productRoutes.length;
    return `
      <a href="#${cat.id}" class="ind-hero-card">
        <div class="ind-hero-card__img" style="background-image:url('${cat.heroImage}')"></div>
        <div class="ind-hero-card__body">
          <span class="ind-hero-card__emoji">${cat.emoji}</span>
          <h3 class="ind-hero-card__title">${cat.title}</h3>
          <p class="ind-hero-card__desc">${cat.description}</p>
          <span class="ind-hero-card__count">${count} products &rarr;</span>
        </div>
      </a>`;
  }).join("");

  // Detail sections — each industry with product list
  const sections = INDUSTRY_CATEGORIES.map((cat) => {
    const productItems = cat.productRoutes.map((route) => {
      const wpProduct = allProducts.find((p) => p.route === route);
      const title = wpProduct?.title
        ?? route.split("/").filter(Boolean).pop()?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        ?? route;
      const img = wpProduct?.image;
      const summary = wpProduct?.summary ?? "";
      return `
        <a href="${route}" class="ind-product-card">
          ${img ? `<img src="${img}" alt="${escapeAttr(title)}" loading="lazy" width="280" height="200">` : `<div class="ind-product-card__placeholder"></div>`}
          <div class="ind-product-card__body">
            <h4>${title}</h4>
            ${summary ? `<p>${truncateText(cleanText(summary), 100)}</p>` : ""}
          </div>
        </a>`;
    }).join("");

    return `
      <section class="ind-section" id="${cat.id}">
        <div class="ind-section__header">
          <div class="ind-section__header-text">
            <span class="ind-section__emoji">${cat.emoji}</span>
            <h2><a href="${cat.href}">${cat.title}</a></h2>
            <p>${cat.description}</p>
          </div>
          <a href="${cat.href}" class="ind-section__cta">View ${cat.title} solutions &rarr;</a>
        </div>
        <div class="ind-product-grid">${productItems}</div>
      </section>`;
  }).join("");

  // Sidebar navigation
  const sidebarLinks = INDUSTRY_CATEGORIES.map((cat) =>
    `<a href="#${cat.id}" class="ind-sidebar__link" data-target="${cat.id}">
      <span class="ind-sidebar__emoji">${cat.emoji}</span>
      <span class="ind-sidebar__label">${cat.title}</span>
      <span class="ind-sidebar__count">${cat.productRoutes.length}</span>
    </a>`
  ).join("");

  main.html(`
    <div class="ind-page">
      <header class="ind-header">
        <nav class="woocommerce-breadcrumb"><a href="/">Home</a> / Industries</nav>
        <h1>RFID Solutions by Industry</h1>
        <p class="ind-header__sub">Select your industry to find the right RFID and NFC products. Each solution is tailored to meet sector-specific requirements for tracking, authentication and access control.</p>
      </header>
      <div class="ind-layout">
        <aside class="ind-sidebar">
          <nav class="ind-sidebar__nav">
            <div class="ind-sidebar__title">Industries</div>
            ${sidebarLinks}
          </nav>
        </aside>
        <div class="ind-content">
          <div class="ind-hero-grid">${heroCards}</div>
          ${sections}
        </div>
      </div>
    </div>
    <script>
    (function(){
      var links = document.querySelectorAll('.ind-sidebar__link');
      var sections = document.querySelectorAll('.ind-section');
      if (!links.length || !sections.length) return;
      function update(){
        var scrollY = window.scrollY + 120;
        var active = null;
        sections.forEach(function(s){
          if (s.offsetTop <= scrollY) active = s.id;
        });
        links.forEach(function(l){
          if (l.getAttribute('data-target') === active) l.classList.add('active');
          else l.classList.remove('active');
        });
      }
      var ticking = false;
      window.addEventListener('scroll', function(){ if (!ticking) { ticking = true; requestAnimationFrame(function(){ update(); ticking = false; }); } }, {passive:true});
      update();
      links.forEach(function(l){
        l.addEventListener('click', function(e){
          e.preventDefault();
          var target = document.getElementById(l.getAttribute('data-target'));
          if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
        });
      });
    })();
    </script>
  `);

  return {
    route: "/industries/",
    sourceUrl: `${siteData.siteOrigin}/industries/`,
    title: "Industries – RFID Solutions by Sector | Proud Tek",
    htmlAttrs: { ...template.htmlAttrs },
    bodyAttrs: { ...template.bodyAttrs },
    headHtml: template.headHtml,
    bodyHtml: $("body").html() ?? template.bodyHtml,
  };
}

function escapeAttr(s: string | undefined | null): string {
  if (!s) return "";
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

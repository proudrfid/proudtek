import { load } from "cheerio";

import type { SiteData, SnapshotPage } from "./site-data";
import { BLOG_DEFINITIONS } from "./blog-definitions";
import { PRODUCT_LANDING_DEFINITIONS } from "./product-landing-definitions";
import { PRODUCT_LANDING_DEFINITIONS_BATCH2 } from "./product-landing-definitions-batch2";
import { PRODUCT_LANDING_DEFINITIONS_BATCH3 } from "./product-landing-definitions-batch3";
import { PRODUCT_LANDING_DEFINITIONS_BATCH4 } from "./product-landing-definitions-batch4";
import { PRODUCT_LANDING_DEFINITIONS_BATCH5 } from "./product-landing-definitions-batch5";
import { PRODUCT_LANDING_DEFINITIONS_BATCH6 } from "./product-landing-definitions-batch6";
import { PRODUCT_LANDING_DEFINITIONS_BATCH7 } from "./product-landing-definitions-batch7";
import { PRODUCT_LANDING_DEFINITIONS_BATCH8 } from "./product-landing-definitions-batch8";
import { INDUSTRY_LANDING_DEFINITIONS } from "./industry-landing-definitions";
import { INDUSTRY_CATEGORIES } from "./catalog-pages";

export type EditorialGroup = "solutions" | "compare" | "contact" | "compatibility" | "guides" | "blog" | "products";

interface EditorialLink {
  href: string;
  label: string;
  description?: string;
}

interface EditorialTable {
  columns: string[];
  rows: string[][];
}

interface EditorialSection {
  title: string;
  intro?: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: EditorialTable;
  image?: { src: string; alt: string };
  callout?: { label: string; text: string; href?: string };
}

interface EditorialBriefField {
  label: string;
  text?: string;
  items?: string[];
  links?: EditorialLink[];
}

interface EditorialResourceCard {
  title: string;
  description: string;
  links: EditorialLink[];
}

interface EditorialFaq {
  question: string;
  answer: string;
}

export interface EditorialDefinition {
  route: string;
  group: EditorialGroup;
  title: string;
  kicker: string;
  summary: string;
  heroPoints: string[];
  imageAlt: string;
  imageSourceRoutes: string[];
  heroImage?: string;
  brief?: EditorialBriefField[];
  sections: EditorialSection[];
  resourceCards: EditorialResourceCard[];
  faq: EditorialFaq[];
  primaryAction: EditorialLink;
  secondaryActions: EditorialLink[];
}

interface ContactScenario {
  route: string;
  title: string;
  kicker: string;
  summary: string;
  heroPoints: string[];
  imageAlt: string;
  imageSourceRoutes: string[];
  bestFit: string[];
  checklist: string[];
  samplePlan: string[];
  leadTimeFocus: string[];
  productLinks: EditorialLink[];
  resourceLinks: EditorialLink[];
  mailSubject: string;
  primaryLabel: string;
}

const EDITORIAL_LINK_REWRITES: Record<string, EditorialLink> = {
  "/2024/12/25/rfid-hotel-key-card/": {
    href: "/solutions/hotel-key-cards/",
    label: "Hotel key card compatibility guide",
  },
  "/2024/12/22/rfid-laundry-tags/": {
    href: "/solutions/rfid-laundry-tags/",
    label: "RFID laundry tag buyer's guide",
  },
  "/2024/12/24/rfid-event-wristband/": {
    href: "/solutions/rfid-event-access-control/",
    label: "RFID event access control guide",
  },
  "/2024/12/24/rfid-wooden-card/": {
    href: "/compare/metal-vs-wood-vs-pvc-nfc-business-cards/",
    label: "Metal vs wood vs PVC NFC business cards",
  },
  "/2025/11/04/mifare_plus_card/": {
    href: "/compare/mifare-plus-ev2-vs-desfire-ev3/",
    label: "MIFARE Plus EV2 vs DESFire EV3",
  },
  "/compare/pps-vs-silicone-laundry-tags/": {
    href: "/compare/pps-vs-silicone-vs-textile-rfid-laundry-tags/",
    label: "PPS vs silicone vs textile RFID laundry tags",
  },
  "/compare/mifare-plus-vs-desfire/": {
    href: "/compare/mifare-plus-ev2-vs-desfire-ev3/",
    label: "MIFARE Plus EV2 vs DESFire EV3",
  },
};

const EDITORIAL_PRIMARY_ACTION_LABELS: Record<string, string> = {
  "/solutions/hotel-key-cards/": "Get hotel lock compatibility check",
  "/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/": "Request chip recommendation",
  "/compare/rfid-vs-magnetic-hotel-key-cards/": "Ask for upgrade quote",
  "/solutions/rfid-laundry-tags/": "Request laundry tag samples",
  "/compare/pps-vs-silicone-vs-textile-rfid-laundry-tags/": "Get tag selection help",
  "/solutions/google-review-nfc-card/": "Request custom review card",
  "/compare/ntag213-vs-ntag215-vs-ntag216/": "Ask which NTAG fits your project",
  "/solutions/nfc-business-card/": "Get custom NFC card quote",
  "/compatibility/saflok-hotel-key-cards/": "Send your lock model for matching",
  "/compatibility/onity-hotel-key-cards/": "Check Onity card compatibility",
  "/compatibility/salto-hotel-key-cards/": "Check SALTO chip options",
  "/compare/rfid-wristbands-hotels-vs-events-vs-resorts/": "Get wristband recommendation",
  "/compare/silicone-vs-fabric-vs-woven-rfid-wristbands/": "Request wristband samples",
  "/compare/uhf-vs-hf-rfid-laundry-tags/": "Match tag with your reader setup",
  "/guides/hotel-key-card-encoding/": "Ask about pre-encoding service",
  "/compare/pvc-vs-wood-vs-pla-hotel-key-cards/": "Request eco card samples",
  "/compare/nfc-review-card-vs-qr-review-stand/": "Choose the right review format",
  "/compare/mifare-plus-ev2-vs-desfire-ev3/": "Get security-level recommendation",
  "/compare/keyfob-vs-card-vs-wristband-access-control/": "Tell us your access scenario",
  "/guides/rfid-tag-card-wristband-lifespan/": "Ask for durability test data",
  "/solutions/rfid-keyfobs-access-control/": "Discuss keyfob options",
  "/solutions/rfid-readers-and-encoding/": "Ask for reader recommendation",
  "/solutions/google-review-cards-for-restaurants/": "Request restaurant review card sample",
  "/solutions/google-review-cards-for-hotels/": "Request hotel review card sample",
  "/solutions/google-review-cards-for-clinics/": "Request clinic review card sample",
  "/solutions/google-review-cards-for-salons-and-spas/": "Request salon review card sample",
  "/solutions/google-review-cards-for-retail-stores/": "Request retail review card sample",
  "/solutions/google-review-cards-for-gyms-and-fitness-studios/": "Request gym review card sample",
  "/solutions/google-review-cards-for-front-desks/": "Request front-desk review card sample",
  "/solutions/google-review-cards-for-checkout-counters/": "Request checkout review card sample",
  "/solutions/google-review-cards-for-tabletop-prompts/": "Request tabletop review card sample",
  "/solutions/google-review-cards-for-pickup-counters/": "Request pickup review card sample",
  "/compare/hf-vs-uhf-rfid-for-asset-tracking/": "Match frequency to your workflow",
  "/compare/google-review-nfc-card-vs-nfc-sticker/": "Choose card or sticker",
  "/compatibility/vingcard-hotel-key-cards/": "Check VingCard compatibility",
  "/compatibility/miwa-hotel-key-cards/": "Check MIWA card compatibility",
  "/compatibility/hafele-dialock-hotel-key-cards/": "Check Dialock card compatibility",
  "/compatibility/be-tech-hotel-key-cards/": "Check Be-Tech card compatibility",
  "/guides/rfid-reader-writer-selection/": "Ask which reader fits your workflow",
  "/guides/nfc-business-card-iphone-android-compatibility/": "Check phone compatibility",
  "/guides/google-review-nfc-card-setup/": "Ask for review card setup help",
  "/guides/hotel-key-card-material-selection/": "Ask which hotel card material fits",
  "/guides/google-review-card-placement-guide/": "Ask about review card placement",
  "/guides/google-review-card-staff-prompt-playbook/": "Ask for staff-prompt guidance",
  "/guides/google-review-cards-for-multi-location-brands/": "Ask about multi-location routing",
  "/guides/google-review-card-design-and-copy/": "Ask about review card design",
  "/guides/hotel-key-card-sample-planning/": "Ask for hotel sample planning",
  "/guides/hotel-key-card-artwork-and-printing-checklist/": "Ask about hotel card artwork",
  "/guides/google-review-cards-for-restaurant-franchises/": "Ask about franchise review rollout",
  "/guides/google-review-cards-for-dental-groups/": "Ask about dental-group rollout",
  "/guides/google-review-cards-for-salon-chains/": "Ask about salon-chain rollout",
  "/guides/google-review-cards-for-auto-dealerships/": "Ask about dealership review rollout",
  "/guides/google-review-cards-for-hotel-groups/": "Ask about hotel-group rollout",
  "/guides/google-review-cards-for-fitness-franchises/": "Ask about fitness-franchise rollout",
  "/products/rfid-cards/mifare-desfire-ev3-cards/": "Request DESFire EV3 quote",
  "/products/rfid-cards/mifare-ultralight-c-cards/": "Request Ultralight C quote",
  "/products/rfid-cards/rfid-blocking-card/": "Request blocking card quote",
  "/products/rfid-cards/rfid-membership-card/": "Request membership card quote",
  "/products/rfid-labels/ntag213-nfc-sticker/": "Request NTAG213 sticker quote",
  "/products/rfid-labels/ntag215-nfc-sticker/": "Request NTAG215 sticker quote",
  "/products/rfid-labels/ntag216-nfc-sticker/": "Request NTAG216 sticker quote",
  "/products/rfid-labels/nfc-anti-metal-sticker/": "Request anti-metal sticker quote",
  "/products/rfid-labels/ntag424-dna-tamper-evident-tag/": "Request NTAG424 DNA quote",
  "/products/rfid-tags/uhf-rfid-apparel-hang-tag/": "Request apparel tag quote",
  "/products/rfid-tags/uhf-rfid-woven-care-label/": "Request woven label quote",
  "/products/rfid-labels/nfc-wet-inlay/": "Request wet inlay quote",
  "/products/rfid-labels/nfc-dry-inlay/": "Request dry inlay quote",
  "/products/rfid-labels/nfc-wine-bottle-tag/": "Request wine bottle tag quote",
  "/products/rfid-tags/nfc-pet-tag/": "Request pet tag quote",
  "/products/rfid-labels/uhf-rfid-paper-label/": "Request RFID label quote",
  "/products/rfid-tags/uhf-rfid-hard-tag/": "Request hard tag quote",
  "/products/rfid-tags/rfid-jewelry-tag/": "Request jewelry tag quote",
  "/products/rfid-wristbands/pvc-rfid-wristband/": "Request PVC wristband quote",
  "/products/rfid-keyfobs/nfc-epoxy-key-tag/": "Request epoxy key tag quote",
  "/products/rfid-keyfobs/rfid-coin-tag/": "Request coin tag quote",
  "/products/rfid-wristbands/hospital-patient-id-wristband/": "Request hospital wristband quote",
  "/products/rfid-keyfobs/rfid-abs-keyfob/": "Request ABS keyfob quote",
  "/products/rfid-labels/nfc-social-media-tag/": "Request social media tag quote",
  "/products/rfid-tags/rfid-anti-metal-tag/": "Request anti-metal tag quote",
  "/products/rfid-wristbands/nfc-payment-wristband/": "Request payment wristband quote",
  "/products/rfid-cards/rfid-parking-card/": "Request parking card quote",
  "/products/rfid-cards/dual-frequency-rfid-card/": "Request dual-frequency card quote",
  "/products/rfid-tags/rfid-library-book-tag/": "Request library tag quote",
  "/products/rfid-tags/rfid-animal-ear-tag/": "Request animal ear tag quote",
  "/products/rfid-tags/rfid-temperature-sensor-tag/": "Request temperature tag quote",
  "/products/rfid-cards/mifare-ultralight-c-card/": "Request Ultralight C card quote",
  "/products/rfid-labels/uhf-rfid-inlay/": "Request UHF inlay quote",
  "/products/rfid-wristbands/tyvek-rfid-wristband/": "Request Tyvek wristband quote",
  "/products/rfid-tags/rfid-tamper-seal-tag/": "Request tamper seal quote",
  "/products/rfid-tags/rfid-guard-tour-tag/": "Request guard tour tag quote",
  "/products/rfid-labels/nfc-smart-poster-tag/": "Request smart poster tag quote",
  "/products/rfid-tags/rfid-pallet-tag/": "Request pallet tag quote",
  "/products/rfid-tags/rfid-race-timing-tag/": "Request race timing tag quote",
  "/products/rfid-tags/rfid-glass-capsule-tag/": "Request glass capsule tag quote",
  "/products/rfid-tags/rfid-waste-bin-tag/": "Request waste bin tag quote",
  "/products/rfid-labels/nfc-shelf-label/": "Request NFC shelf label quote",
  "/products/rfid-labels/rfid-shipping-label/": "Request RFID shipping label quote",
  "/products/rfid-tags/rfid-cable-tie-tag/": "Request cable tie tag quote",
  "/products/rfid-tags/rfid-tire-tag/": "Request tire tag quote",
  "/products/rfid-labels/nfc-table-stand/": "Request NFC table stand quote",
  "/products/rfid-keyfobs/dual-frequency-key-fob/": "Request dual-frequency fob quote",
  "/products/rfid-keyfobs/nfc-wood-keychain-tag/": "Request wood keychain tag quote",
  "/products/rfid-tags/rfid-textile-laundry-tag/": "Request textile laundry tag quote",
  "/products/rfid-labels/uhf-rfid-blank-label/": "Request blank RFID label quote",
  "/products/rfid-labels/nfc-sneaker-authentication-tag/": "Request sneaker authentication tag quote",
  "/products/rfid-labels/nfc-luxury-handbag-tag/": "Request luxury authentication tag quote",
  "/products/rfid-labels/nfc-cosmetics-authentication-label/": "Request cosmetics authentication label quote",
  "/products/rfid-labels/nfc-digital-product-passport-tag/": "Request DPP NFC tag quote",
  "/products/rfid-labels/nfc-battery-passport-tag/": "Request battery passport tag quote",
  "/products/rfid-cards/nfc-warranty-card/": "Request NFC warranty card quote",
  "/products/rfid-tags/rfid-bolt-seal/": "Request RFID bolt seal quote",
  "/products/rfid-tags/rfid-gas-cylinder-tag/": "Request gas cylinder tag quote",
  "/products/rfid-tags/rfid-surgical-instrument-tag/": "Request surgical instrument tag quote",
  "/products/rfid-tags/rfid-blood-bag-tag/": "Request blood bag tag quote",
  "/products/rfid-labels/rfid-medication-vial-label/": "Request medication RFID label quote",
  "/products/rfid-tags/rfid-high-temperature-ceramic-tag/": "Request ceramic RFID tag quote",
  "/products/rfid-tags/rfid-pcb-screw-mount-tag/": "Request PCB screw-mount tag quote",
  "/products/rfid-tags/rfid-keg-tag/": "Request keg tag quote",
  "/products/rfid-labels/rfid-airline-baggage-tag/": "Request airline baggage tag quote",
  "/products/rfid-tags/rfid-returnable-container-tag/": "Request RTI container tag quote",
  "/products/rfid-labels/rfid-document-tracking-label/": "Request document tracking label quote",
  "/products/rfid-labels/rfid-cryogenic-specimen-label/": "Request cryogenic label quote",
  "/products/rfid-labels/rfid-garment-source-tag/": "Request garment source tag quote",
  "/products/rfid-tags/rfid-ibc-chemical-drum-tag/": "Request IBC/drum tag quote",
  "/products/rfid-tags/rfid-aircraft-part-tag/": "Request aircraft part tag quote",
  "/products/rfid-tags/rfid-tool-tracking-tag/": "Request tool tracking tag quote",
  "/products/rfid-labels/nfc-gaming-collectible-tag/": "Request NFC gaming tag quote",
  "/products/rfid-labels/nfc-warranty-seal-tag/": "Request NFC warranty seal quote",
  "/industries/hospitality/": "Request hotel RFID samples",
  "/industries/retail-apparel/": "Request retail RFID samples",
  "/industries/brand-protection/": "Request authentication tag samples",
  "/solutions/rfid-event-wristbands/": "Request event wristband samples",
  "/industries/events-venues/": "Request event wristband samples",
  "/industries/healthcare/": "Request healthcare RFID samples",
  "/industries/logistics/": "Request logistics RFID samples",
  "/industries/industrial/": "Request industrial RFID samples",
  "/industries/eu-compliance/": "Request DPP NFC tag samples",
};

const BASE_EDITORIAL_DEFINITIONS: EditorialDefinition[] = [
  {
    route: "/solutions/",
    group: "solutions",
    title: "RFID Solutions By Application",
    kicker: "Application Paths",
    summary:
      "Use these English landing pages to move from broad product browsing into clearer product decisions. Each path groups the products, comparison pages and project questions that usually matter first.",
    heroPoints: [
      "Start from the deployment environment, not just the product form factor.",
      "Use the comparison pages to narrow the first sample set before requesting pricing.",
      "Link each solution path back to the relevant product, guide and contact route.",
    ],
    imageAlt: "RFID solution planning overview",
    imageSourceRoutes: ["/product/hotel-key-cards/", "/product/rfid-laundry-tags/", "/product/nfc-business-card/"],
    sections: [
      {
        title: "Where these pages help most",
        intro:
          "Proud Tek's product catalog is broad. The pages below are designed for buyers who already know the application and want to identify the right RFID or NFC format faster.",
        bullets: [
          "Hotel access programs comparing key cards with wristbands.",
          "Laundry rollouts validating wash durability and attachment method.",
          "Event access projects planning gate flow and attendee segmentation.",
          "Vehicle identification programs choosing windshield, headlight or hard-tag formats.",
          "Access-control keyfob programs balancing carry behavior, reader fit and replacement rate.",
          "Reader and encoding projects choosing desktop readers, SDK support and issuance workflow.",
          "Google review card programs choosing cards, stickers and staff-prompt formats by industry.",
          "NFC business card projects balancing phone compatibility, material and brand feel.",
          "Asset-label programs comparing standard labels, on-metal labels and alternative hard tags.",
        ],
      },
      {
        title: "What to prepare before asking for samples",
        intro:
          "The fastest sampling conversations usually include enough context for engineering and sourcing to cut out the wrong formats immediately.",
        bullets: [
          "Reader or lock environment, chip family and compatibility constraints.",
          "Mounting surface, wash cycle, gate throughput or other environment-specific variables.",
          "Artwork, numbering, encoding, URL or serialization requirements.",
          "Pilot quantity, target launch date and any approval workflow that controls timing.",
        ],
      },
    ],
    resourceCards: [
      {
        title: "Priority buying guides",
        description: "Start with the pages that align most closely with hotel, laundry and NFC projects already moving toward sampling or pricing.",
        links: [
          { href: "/solutions/hotel-key-cards/", label: "Hotel key card buying guide" },
          { href: "/solutions/rfid-laundry-tags/", label: "RFID laundry tag buying guide" },
          { href: "/solutions/google-review-nfc-card/", label: "Google review NFC card guide" },
          { href: "/guides/google-review-card-placement-guide/", label: "Google review card placement guide" },
          { href: "/guides/google-review-cards-for-multi-location-brands/", label: "Google review cards for multi-location brands" },
          { href: "/guides/google-review-cards-for-restaurant-franchises/", label: "Google review cards for restaurant franchises" },
          { href: "/guides/hotel-key-card-sample-planning/", label: "Hotel key card sample planning" },
          { href: "/solutions/rfid-keyfobs-access-control/", label: "RFID keyfob access control guide" },
          { href: "/solutions/rfid-readers-and-encoding/", label: "RFID reader and encoding guide" },
          { href: "/solutions/google-review-cards-for-restaurants/", label: "Google review cards for restaurants" },
          { href: "/solutions/google-review-cards-for-hotels/", label: "Google review cards for hotels" },
        ],
      },
      {
        title: "Review-card industry playbooks",
        description: "Use these industry pages to capture local-service and hospitality review-card searches with a tighter operational fit.",
        links: [
          { href: "/solutions/google-review-cards-for-restaurants/", label: "Google review cards for restaurants" },
          { href: "/solutions/google-review-cards-for-hotels/", label: "Google review cards for hotels" },
          { href: "/solutions/google-review-cards-for-clinics/", label: "Google review cards for clinics" },
          { href: "/solutions/google-review-cards-for-salons-and-spas/", label: "Google review cards for salons and spas" },
          { href: "/solutions/google-review-cards-for-retail-stores/", label: "Google review cards for retail stores" },
          { href: "/solutions/google-review-cards-for-gyms-and-fitness-studios/", label: "Google review cards for gyms and fitness studios" },
        ],
      },
      {
        title: "Review-card scenario playbooks",
        description: "Use these scenario pages to target how and where the review prompt is actually delivered in the real customer journey.",
        links: [
          { href: "/solutions/google-review-cards-for-front-desks/", label: "Google review cards for front desks" },
          { href: "/solutions/google-review-cards-for-checkout-counters/", label: "Google review cards for checkout counters" },
          { href: "/solutions/google-review-cards-for-tabletop-prompts/", label: "Google review cards for tabletop prompts" },
          { href: "/solutions/google-review-cards-for-pickup-counters/", label: "Google review cards for pickup counters" },
        ],
      },
      {
        title: "Priority comparison pages",
        description: "Use these comparison pages to turn a broad application idea into a tighter shortlist before requesting pricing.",
        links: [
          { href: "/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/", label: "Hotel lock chip-family comparison" },
          { href: "/compare/rfid-vs-magnetic-hotel-key-cards/", label: "RFID vs magnetic hotel key cards" },
          { href: "/compare/pps-vs-silicone-vs-textile-rfid-laundry-tags/", label: "PPS vs silicone vs textile laundry tags" },
          { href: "/compare/ntag213-vs-ntag215-vs-ntag216/", label: "NTAG213 vs NTAG215 vs NTAG216" },
          { href: "/compare/nfc-review-card-vs-qr-review-stand/", label: "NFC review card vs QR stand" },
          { href: "/compare/rfid-wristbands-hotels-vs-events-vs-resorts/", label: "RFID wristbands for hotels vs events vs resorts" },
          { href: "/compare/keyfob-vs-card-vs-wristband-access-control/", label: "Keyfob vs card vs wristband" },
        ],
      },
    ],
    faq: [
      {
        question: "Are these pages replacements for product pages?",
        answer:
          "No. They sit above the catalog layer and help buyers move from use-case definition to a smaller product shortlist.",
      },
      {
        question: "Do these pages only cover English content?",
        answer:
          "Yes. They are written specifically for the English static export and avoid translated route variants.",
      },
    ],
    primaryAction: { href: "/contact/", label: "Talk to an RFID engineer" },
    secondaryActions: [
      { href: "/compare/", label: "Browse comparison pages" },
      { href: "/products/all/", label: "Browse all products" },
      { href: "/faq/", label: "Review FAQ" },
    ],
  },
  {
    route: "/solutions/hotel-rfid-access-control/",
    group: "solutions",
    title: "Hotel RFID Access Control",
    kicker: "Hospitality Solution",
    summary:
      "Hotel RFID projects usually hinge on three decisions: which credential format fits the guest journey, which chip family matches the lock estate, and how much personalization should happen before cards or wristbands reach the property.",
    heroPoints: [
      "Choose cards, wristbands or a mixed program based on guest flow and property type.",
      "Confirm lock, encoder and PMS compatibility before discussing artwork or premium finishes.",
      "Package sample requests around property count, card volume and rollout timing.",
    ],
    imageAlt: "Hotel RFID key card planning",
    imageSourceRoutes: ["/product/hotel-key-cards/", "/product/rfid-wristbands-for-hotels/"],
    sections: [
      {
        title: "Where hotel RFID projects usually start",
        intro:
          "Most hospitality buyers already know whether they are replacing an existing card program or launching a new guest credential. The friction usually comes from compatibility and guest-experience tradeoffs.",
        bullets: [
          "Branded room key cards for hotels, resorts and serviced apartments.",
          "Wristband-based access for pools, spas, lockers or family-friendly properties.",
          "Mixed programs where cards handle rooms and wristbands cover amenity access.",
          "Premium variants using wood, recycled or specialty card materials for brand positioning.",
        ],
      },
      {
        title: "Cards vs wristbands in hospitality",
        intro:
          "Cards remain the default for broad room-key use. Wristbands become attractive when the property wants better amenity flow, fewer lost credentials or more guest segmentation.",
        table: {
          columns: ["Format", "Best fit", "Strengths", "Watch-outs"],
          rows: [
            ["Hotel key cards", "Standard room access", "Low friction, familiar, easy to brand", "Guests can misplace them and wet environments reduce convenience"],
            ["RFID hotel wristbands", "Resorts, spas and family properties", "Hands-free use, harder to lose, easy guest grouping", "Sizing, material choice and lock compatibility matter earlier"],
            ["Mixed program", "Properties with multiple guest journeys", "Lets rooms and amenities use separate credential logic", "Needs a cleaner issuance and inventory process"],
          ],
        },
      },
      {
        title: "Inputs that make hotel sampling faster",
        intro:
          "If you already have a current room key, a lock model photo or a chip requirement, the project can usually move from general inquiry to a realistic sample shortlist much faster.",
        bullets: [
          "Current lock platform, encoder or PMS environment.",
          "Card-only, wristband-only or mixed credential plan.",
          "Material, finish, magstripe, numbering or RFID encoding requirements.",
          "Property count, pilot quantity and launch schedule.",
        ],
      },
    ],
    resourceCards: [
      {
        title: "Best-fit products",
        description: "Start with the main hospitality credential formats already present in the catalog.",
        links: [
          { href: "/product/hotel-key-cards/", label: "Hotel key cards" },
          { href: "/product/rfid-wristbands-for-hotels/", label: "RFID wristbands for hotels" },
          { href: "/product/printed-rfid-cards/", label: "Printed RFID cards" },
        ],
      },
      {
        title: "Related pages",
        description: "Use the guide and comparison page to tighten the first decision before contacting the team.",
        links: [
          { href: "/2024/12/25/rfid-hotel-key-card/", label: "Read the hotel key card guide" },
          { href: "/compare/hotel-key-cards-vs-hotel-wristbands/", label: "Compare hotel cards vs wristbands" },
          { href: "/faq/", label: "Review samples and lead times" },
        ],
      },
    ],
    faq: [
      {
        question: "When should a hotel keep cards instead of switching to wristbands?",
        answer:
          "Card-first programs still make sense for most room-key deployments, especially where guests expect a familiar form factor and amenity access is limited.",
      },
      {
        question: "Can hotels run cards and wristbands together?",
        answer:
          "Yes. Mixed programs are common when guest rooms use cards while pools, gyms or VIP amenities use wristbands.",
      },
      {
        question: "What speeds up a hotel RFID quote?",
        answer:
          "Sharing the current lock estate, chip requirement, preferred credential format and target sample quantity removes most early back-and-forth.",
      },
    ],
    primaryAction: { href: "/contact/hotel-rfid/", label: "Request hotel RFID guidance" },
    secondaryActions: [
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/products/rfid-wristbands/", label: "Browse RFID wristbands" },
      { href: "/compare/hotel-key-cards-vs-hotel-wristbands/", label: "Compare formats" },
    ],
  },
  {
    route: "/solutions/rfid-laundry-management/",
    group: "solutions",
    title: "RFID Laundry Management",
    kicker: "Laundry Solution",
    summary:
      "Laundry RFID projects depend less on generic tag pricing and more on whether the tag survives the wash profile, fits the textile workflow and reads reliably at the points where linen or garments actually move.",
    heroPoints: [
      "Start with wash profile, attachment method and reader setup.",
      "Compare PPS, silicone and other flexible laundry tags against the real textile environment.",
      "Split samples across the most likely form factors instead of over-testing too many variants.",
    ],
    imageAlt: "RFID laundry tag solution planning",
    imageSourceRoutes: ["/product/rfid-laundry-tags/", "/product/pps-rfid-laundry-tag/", "/product/rfid-silicone-laundry-tag/"],
    sections: [
      {
        title: "What changes tag choice in laundry environments",
        intro:
          "A laundry tag that works in one textile workflow can fail quickly in another. Heat, chemicals, mechanical stress and attachment style often matter more than the nominal frequency on the data sheet.",
        bullets: [
          "Hotel linen and towel tracking where soft handling and repeat washing dominate.",
          "Industrial laundry plants with harsher throughput and larger item counts.",
          "Healthcare garments and reusable textiles that need traceability across multiple sites.",
          "Rental-uniform programs where loss reduction and item lifecycle reporting drive ROI.",
        ],
      },
      {
        title: "Common tag paths",
        intro:
          "The main laundry formats each solve a different durability and handling problem. The right first sample set usually includes only the two most realistic options.",
        table: {
          columns: ["Tag type", "Best fit", "Strengths", "Watch-outs"],
          rows: [
            ["PPS laundry tags", "High-temperature and button-style attachment", "Strong durability and compact hard-shell format", "Less flexible for soft or thin textiles"],
            ["Silicone laundry tags", "Flexible textile applications", "More bend-friendly and easier to integrate into garments", "Need the right silicone form factor for the wash process"],
            ["General textile-safe tags", "Programs still validating attachment style", "Good for early comparison across multiple item categories", "Need clearer testing criteria before scaling"],
          ],
        },
      },
      {
        title: "Information that produces better sample kits",
        intro:
          "If the team knows the textile type, wash profile and attachment method, the sample kit can reflect the real environment instead of a generic laundry assortment.",
        bullets: [
          "Textile type, tag size limits and how the tag will be attached.",
          "Expected wash cycles, temperature range and chemical exposure.",
          "Reader frequency, read point and how item IDs are managed.",
          "Pilot site count, validation timeline and sample quantities by tag type.",
        ],
      },
    ],
    resourceCards: [
      {
        title: "Best-fit products",
        description: "Use these pages to compare the main laundry tag routes already in the catalog.",
        links: [
          { href: "/product/rfid-laundry-tags/", label: "Industrial RFID laundry tags" },
          { href: "/product/pps-rfid-laundry-tag/", label: "PPS RFID laundry tag" },
          { href: "/product/rfid-silicone-laundry-tag/", label: "RFID silicone laundry tag" },
        ],
      },
      {
        title: "Related pages",
        description: "The guide and comparison page help narrow the shortlist before sample approval.",
        links: [
          { href: "/2024/12/22/rfid-laundry-tags/", label: "Read the laundry RFID guide" },
          { href: "/compare/pps-vs-silicone-laundry-tags/", label: "Compare PPS vs silicone tags" },
          { href: "/products/rfid-tags/", label: "Browse RFID tags" },
        ],
      },
    ],
    faq: [
      {
        question: "Should laundry projects start with PPS or silicone tags?",
        answer:
          "They should start with the wash profile and textile handling method. PPS often suits harsher hard-shell use, while silicone is often better where flexibility matters.",
      },
      {
        question: "What makes laundry sample testing useful?",
        answer:
          "Testing only becomes meaningful when the sample split reflects the real attachment method, textile type and wash-cycle stress.",
      },
      {
        question: "Can hotels and industrial laundries use the same tag?",
        answer:
          "Sometimes, but not by default. Similar frequencies do not guarantee the same durability or textile fit across very different laundry workflows.",
      },
    ],
    primaryAction: { href: "/contact/laundry-rfid/", label: "Request laundry RFID guidance" },
    secondaryActions: [
      { href: "/compare/pps-vs-silicone-laundry-tags/", label: "Compare tag materials" },
      { href: "/products/rfid-tags/", label: "Browse RFID tags" },
      { href: "/faq/", label: "Review sample FAQ" },
    ],
  },
  {
    route: "/solutions/rfid-event-access-control/",
    group: "solutions",
    title: "RFID Event Access Control",
    kicker: "Event Solution",
    summary:
      "Event RFID programs perform best when band style, attendee flow and on-site activation are defined together. Gate speed, reusability and branding all affect the right wristband choice.",
    heroPoints: [
      "Choose the wristband based on attendee flow before comparing cosmetic options.",
      "Map one-day, multi-day and reusable-event requirements early.",
      "Treat gate throughput and activation logic as part of the product brief, not an afterthought.",
    ],
    imageAlt: "RFID event wristband planning",
    imageSourceRoutes: ["/product/rfid-event-wristband/", "/product/rfid-wristbands-for-events/", "/product/uhf-wristband/"],
    sections: [
      {
        title: "What drives wristband selection at events",
        intro:
          "Events often over-focus on the visible band style and under-specify the access workflow. The right product depends on how attendees enter, pay or move between zones.",
        bullets: [
          "Festivals and large venues needing tap-based entry at multiple gates.",
          "Expos and conferences using attendee grouping or VIP zoning.",
          "Cashless activation or sponsor-led experiences that extend beyond admission.",
          "Premium or reusable deployments where material feel matters to the event brand.",
        ],
      },
      {
        title: "How to narrow the first band shortlist",
        intro:
          "The fastest shortlist usually matches one band to the core attendee journey and one secondary option to the next-most-likely activation model.",
        bullets: [
          "Estimate attendance, peak gate load and number of read points.",
          "Define whether the band is single-event, reusable or part of an ongoing venue program.",
          "Set the chip family, encoding logic and any numbering or color segmentation needed.",
          "Separate access-only bands from premium or sponsor-visible formats when sampling.",
        ],
      },
      {
        title: "Typical project inputs",
        intro:
          "If the event team can describe the attendee flow in plain operational terms, product selection usually becomes much easier.",
        bullets: [
          "Expected attendance, event duration and number of entry points.",
          "Need for cashless use, VIP zoning or staff segmentation.",
          "Preferred material, branding treatment and packaging format.",
          "Sample timing, on-site contingency needs and likely reorder cadence.",
        ],
      },
    ],
    resourceCards: [
      {
        title: "Best-fit products",
        description: "Start with the core event wristband routes already on the site.",
        links: [
          { href: "/product/rfid-event-wristband/", label: "RFID event wristband" },
          { href: "/product/rfid-wristbands-for-events/", label: "RFID wristbands for events" },
          { href: "/product/uhf-wristband/", label: "UHF wristband" },
        ],
      },
      {
        title: "Related pages",
        description: "Use the guide to turn a high-level event plan into a sample-ready wristband brief.",
        links: [
          { href: "/2024/12/24/rfid-event-wristband/", label: "Read the event wristband guide" },
          { href: "/products/rfid-wristbands/", label: "Browse RFID wristbands" },
          { href: "/contact/", label: "Talk to the team" },
        ],
      },
    ],
    faq: [
      {
        question: "What matters more for event wristbands: material or chip type?",
        answer:
          "Neither should be chosen in isolation. Material affects wear and brand feel, while chip choice affects compatibility and workflow; both must match the event model.",
      },
      {
        question: "Should events sample more than one band style?",
        answer:
          "Usually yes, but only one or two realistic styles. Sampling too many formats slows decision-making without improving deployment quality.",
      },
      {
        question: "Do event projects need reusable wristbands?",
        answer:
          "Only if the venue model or premium guest journey justifies it. Many event deployments still fit single-event or lower-cost constructions better.",
      },
    ],
    primaryAction: { href: "/contact/event-rfid/", label: "Request event RFID guidance" },
    secondaryActions: [
      { href: "/products/rfid-wristbands/", label: "Browse wristbands" },
      { href: "/2024/12/24/rfid-event-wristband/", label: "Read the guide" },
      { href: "/faq/", label: "Review FAQ" },
    ],
  },
  {
    route: "/solutions/vehicle-rfid-identification/",
    group: "solutions",
    title: "Vehicle RFID Identification",
    kicker: "Vehicle Solution",
    summary:
      "Vehicle identification projects are driven by mounting surface, checkpoint design and anti-transfer requirements. The correct RFID format depends on how the vehicle moves through the read zone and where the tag has to live.",
    heroPoints: [
      "Pick the format around windshield, headlight or part-level mounting first.",
      "Account for lane speed, reader position and tamper expectations early.",
      "Treat installation workflow and data association as part of the product brief.",
    ],
    imageAlt: "Vehicle RFID identification planning",
    imageSourceRoutes: ["/product/rfid-windshield-tag/", "/product/rfid-sticker-on-headlight/"],
    sections: [
      {
        title: "Where vehicle RFID is commonly deployed",
        intro:
          "Vehicle programs tend to cluster around parking access, gated entry, fleet management and aftermarket identification. The workflow defines the right tag far more than the label name does.",
        bullets: [
          "Parking access and gated community vehicle entry.",
          "Campus, industrial or logistics fleets needing checkpoint identification.",
          "Headlight or part-based ID where windshield placement is not ideal.",
          "Programs requiring anti-transfer behavior or tighter tag-to-vehicle association.",
        ],
      },
      {
        title: "Choosing the mounting path",
        intro:
          "Windshield, headlight and harder transponder-style paths each solve a different operational problem.",
        table: {
          columns: ["Format", "Best fit", "Strengths", "Watch-outs"],
          rows: [
            ["Windshield tag", "Parking and gated entry", "Simple deployment and strong fit for checkpoint reads", "Tint, placement and lane setup still matter"],
            ["Headlight tag", "Cases where windshield use is limited", "Useful alternative surface with different installation logic", "Surface and read geometry must be validated carefully"],
            ["Other vehicle tags", "Programs with non-standard mounting or security needs", "Can match specialty workflows better", "Need a clearer installation and durability brief"],
          ],
        },
      },
      {
        title: "What to send before sample review",
        intro:
          "The most useful early material is not a long spec sheet. It is a plain description of the lane, the vehicle path and the mounting constraints.",
        bullets: [
          "Checkpoint photos, lane layout and read distance target.",
          "Windshield, headlight or alternative surface details.",
          "Need for tamper evidence, numbering or linked vehicle records.",
          "Pilot fleet size, installer workflow and launch deadline.",
        ],
      },
    ],
    resourceCards: [
      {
        title: "Best-fit products",
        description: "Use these routes to compare the two clearest mounting formats already on the site.",
        links: [
          { href: "/product/rfid-windshield-tag/", label: "RFID windshield tag" },
          { href: "/product/rfid-sticker-on-headlight/", label: "RFID sticker on headlight" },
          { href: "/products/rfid-tags/", label: "Browse RFID tags" },
        ],
      },
      {
        title: "Next-step pages",
        description: "Move from product browsing into a clearer quote request.",
        links: [
          { href: "/contact/", label: "Request vehicle RFID guidance" },
          { href: "/faq/", label: "Review sample FAQ" },
          { href: "/solutions/", label: "Return to all solution pages" },
        ],
      },
    ],
    faq: [
      {
        question: "What decides between windshield and headlight tags?",
        answer:
          "The decision is mostly operational: mounting surface access, reader geometry, lane speed and the installation process all influence the correct format.",
      },
      {
        question: "Do vehicle programs always need anti-transfer features?",
        answer:
          "Not always. Anti-transfer becomes more important where the credential has compliance or revenue implications, or where vehicles are likely to change frequently.",
      },
      {
        question: "What speeds up a vehicle RFID sample review?",
        answer:
          "Checkpoint photos, mounting constraints and a simple description of how vehicles move through the lane usually help more than generic tag preferences.",
      },
    ],
    primaryAction: { href: "/contact/vehicle-rfid/", label: "Request vehicle RFID guidance" },
    secondaryActions: [
      { href: "/products/rfid-tags/", label: "Browse RFID tags" },
      { href: "/product/rfid-windshield-tag/", label: "See windshield tags" },
      { href: "/product/rfid-sticker-on-headlight/", label: "See headlight tags" },
    ],
  },
  {
    route: "/solutions/nfc-business-card-programs/",
    group: "solutions",
    title: "NFC Business Card Programs",
    kicker: "NFC Solution",
    summary:
      "NFC business card projects combine mobile compatibility, material choice and campaign design. The right card is the one that fits the target phones, the brand feel and the redirect or profile workflow you actually plan to maintain.",
    heroPoints: [
      "Confirm the mobile and redirect workflow before debating premium finishes.",
      "Choose the material around brand feel, durability and production constraints.",
      "Treat the card as part of a lead-capture or contact-sharing system, not just a printed object.",
    ],
    imageAlt: "NFC business card planning",
    imageSourceRoutes: ["/product/nfc-business-card/", "/product/metal-nfc-card/", "/product/wooden-rfid-card/"],
    sections: [
      {
        title: "What good NFC card briefs usually contain",
        intro:
          "The strongest NFC business card projects define who will use the card, what the tap should open and how much premium finish the brand actually needs.",
        bullets: [
          "Sales teams rolling out digital business cards across multiple staff members.",
          "Premium hospitality or brand programs using NFC for contact-sharing or guest engagement.",
          "Campaigns that combine NFC with QR, printed branding or review-generation flows.",
          "Projects comparing PVC, metal, wood or eco materials for different user groups.",
        ],
      },
      {
        title: "Material choice changes the program, not just the look",
        intro:
          "Premium materials can improve brand perception, but they also affect lead time, thickness, print approach and how the card fits the target user.",
        table: {
          columns: ["Material", "Best fit", "Strengths", "Watch-outs"],
          rows: [
            ["PVC or standard smart-card stock", "Broad team rollouts", "Simple, scalable and familiar", "Less differentiated for premium branding"],
            ["Metal NFC cards", "Premium executive or luxury programs", "High perceived value and strong visual impact", "Need tighter control over construction and finish"],
            ["Wood or eco cards", "Sustainability-led or boutique brand positioning", "Distinctive feel and stronger sustainability story", "Material consistency and finish choice matter more"],
          ],
        },
      },
      {
        title: "Useful inputs before requesting samples",
        intro:
          "A practical sample brief should cover both the physical card and the digital action behind the tap.",
        bullets: [
          "Target phones, preferred chip family and whether the URL should be editable.",
          "Card material, finish, thickness and visual direction.",
          "Need for QR codes, numbering, gift packaging or team-level personalization.",
          "Pilot quantity, approval timeline and who will manage redirects after launch.",
        ],
      },
    ],
    resourceCards: [
      {
        title: "Best-fit products",
        description: "Use the product routes below to compare common NFC card directions.",
        links: [
          { href: "/product/nfc-business-card/", label: "NFC business card" },
          { href: "/product/metal-nfc-card/", label: "Metal NFC card" },
          { href: "/product/wooden-rfid-card/", label: "Wooden RFID card" },
          { href: "/product/eco_rfid_card/", label: "Eco RFID card" },
        ],
      },
      {
        title: "Related pages",
        description: "The comparison and guide pages help turn a visual preference into a deployment-ready shortlist.",
        links: [
          { href: "/compare/metal-vs-wood-vs-pvc-nfc-business-cards/", label: "Compare NFC card materials" },
          { href: "/2024/12/24/rfid-wooden-card/", label: "Read the wooden card guide" },
          { href: "/product/google-review-nfc-card/", label: "See Google review NFC card" },
        ],
      },
    ],
    faq: [
      {
        question: "Should NFC business card projects choose material before chip?",
        answer:
          "No. Mobile compatibility and the digital workflow should be confirmed first, then the material can be chosen around brand and production goals.",
      },
      {
        question: "Are metal or wood cards always better than PVC?",
        answer:
          "Only when the brand benefit justifies the cost, finish and production tradeoffs. Standard PVC still fits many broad team rollouts.",
      },
      {
        question: "What information makes NFC card sampling faster?",
        answer:
          "Target phones, redirect requirements, material preference and the size of the initial rollout are usually the most useful early inputs.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Request NFC card guidance" },
    secondaryActions: [
      { href: "/compare/metal-vs-wood-vs-pvc-nfc-business-cards/", label: "Compare materials" },
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/faq/", label: "Review compatibility FAQ" },
    ],
  },
  {
    route: "/solutions/rfid-asset-tracking-labels/",
    group: "solutions",
    title: "RFID Asset-Tracking Labels",
    kicker: "Label Solution",
    summary:
      "RFID and NFC label projects move faster when the environment, surface and data model are explicit. The right label choice depends on whether you are tagging packaging, assets, metal surfaces or product touchpoints.",
    heroPoints: [
      "Define the surface, adhesive and read environment before picking a label type.",
      "Treat print content and data structure as part of the label decision.",
      "Use on-metal and standard label comparisons early to avoid the wrong sample set.",
    ],
    imageAlt: "RFID asset label planning",
    imageSourceRoutes: ["/product/nfc-stickers/", "/products/rfid-labels/"],
    sections: [
      {
        title: "What label projects usually need to answer first",
        intro:
          "Labels can look similar while solving very different problems. The right starting point depends on whether you are dealing with consumer phones, industrial readers or mixed data and print requirements.",
        bullets: [
          "Asset tags and internal identification labels for equipment or inventory.",
          "NFC stickers for packaging, smart labels and tap-based engagement.",
          "Metal-surface deployments where standard labels lose performance.",
          "Projects needing serialized print, QR, barcode or mixed RFID data fields.",
        ],
      },
      {
        title: "Standard labels vs on-metal requirements",
        intro:
          "The biggest early mistake is choosing a standard sticker before the team confirms the mounting surface and read environment.",
        table: {
          columns: ["Path", "Best fit", "Strengths", "Watch-outs"],
          rows: [
            ["Standard NFC or RFID labels", "Non-metal packaging and general asset ID", "Flexible, scalable and simpler to convert", "Performance changes quickly on metal surfaces"],
            ["On-metal label path", "Metal asset surfaces and machinery", "Built for difficult mounting environments", "Needs a clearer surface and read-range brief before sampling"],
            ["Hard tag alternative", "Cases where a label is not durable enough", "Can outperform labels in harsher environments", "Usually changes installation and packaging logic"],
          ],
        },
      },
      {
        title: "Sample-brief inputs worth sending",
        intro:
          "A strong inquiry should describe both the physical label and the data or print that has to ride on it.",
        bullets: [
          "Surface type, adhesive concerns and whether metal is present.",
          "Reader or phone environment, read distance and scan frequency.",
          "Label size, print content, serialization and encoding rules.",
          "Roll direction, application method and pilot quantity.",
        ],
      },
    ],
    resourceCards: [
      {
        title: "Best-fit pages",
        description: "Start with the core label and sticker routes already on the site.",
        links: [
          { href: "/products/rfid-labels/", label: "Browse RFID labels" },
          { href: "/product/nfc-stickers/", label: "NFC stickers" },
          { href: "/products/rfid-tags/", label: "Browse RFID tags" },
        ],
      },
      {
        title: "Related pages",
        description: "Use the comparison page to avoid testing the wrong label family first.",
        links: [
          { href: "/compare/on-metal-nfc-labels-vs-standard-nfc-stickers/", label: "Compare on-metal vs standard labels" },
          { href: "/contact/", label: "Request label guidance" },
          { href: "/faq/", label: "Review sample FAQ" },
        ],
      },
    ],
    faq: [
      {
        question: "Do asset-tracking projects always need RFID labels?",
        answer:
          "Not always. Some environments are better served by harder RFID tags, but labels remain the first option when surface, cost and application speed align.",
      },
      {
        question: "Why should on-metal questions come first?",
        answer:
          "Because a standard label that looks acceptable on paper can underperform badly once it is mounted on metal.",
      },
      {
        question: "What makes a label inquiry more useful?",
        answer:
          "Surface details, print requirements, encoding rules and how the label will actually be applied all improve the quality of the first recommendation.",
      },
    ],
    primaryAction: { href: "/contact/rfid-labels-tags/", label: "Request RFID label guidance" },
    secondaryActions: [
      { href: "/compare/on-metal-nfc-labels-vs-standard-nfc-stickers/", label: "Compare label paths" },
      { href: "/products/rfid-labels/", label: "Browse RFID labels" },
      { href: "/products/rfid-tags/", label: "Browse RFID tags" },
    ],
  },
  {
    route: "/compare/",
    group: "compare",
    title: "RFID And NFC Comparison Pages",
    kicker: "Comparison Library",
    summary:
      "These English comparison pages are written to answer the shortlisting questions buyers ask most often before sample review. Each page keeps the decision focused on deployment fit, not just feature lists.",
    heroPoints: [
      "Use comparison pages to narrow the first sample set before pricing discussions.",
      "Pair each comparison with the matching solution page when the application is already known.",
      "Treat these pages as shortlisting tools, then move to product pages for exact configuration.",
    ],
    imageAlt: "RFID comparison overview",
    imageSourceRoutes: ["/product/mifare-plus-card/", "/product/metal-nfc-card/", "/product/rfid-laundry-tags/"],
    sections: [
      {
        title: "What these comparison pages cover",
        intro:
          "The current set focuses on commercial questions that sit between top-level catalog browsing and a real sample request.",
        bullets: [
          "Hotel lock chip-family and RFID-versus-magstripe upgrade decisions.",
          "Laundry tag material and frequency comparisons that support tighter sampling plans.",
          "NTAG, review-card and NFC card-material choices for mobile-tap projects.",
          "Review card versus sticker decisions for counters, tables and checkout prompts.",
          "HF-versus-UHF label decisions for asset-tracking and inventory workflows.",
          "Wristband, secure-card and access-credential format comparisons for higher-intent briefs.",
          "Expansion pages that help turn a first shortlist into a clearer quote request.",
        ],
      },
      {
        title: "How to use them",
        intro:
          "A comparison page should remove one ambiguous decision. Once that decision is made, the next step is usually a smaller product shortlist or a contact request with better context.",
        bullets: [
          "Read the comparison page that matches the main uncertainty in the project.",
          "Jump from the comparison page to the recommended product routes.",
          "Use the linked solution page if the application needs more context first.",
        ],
      },
    ],
    resourceCards: [
      {
        title: "Highest-intent comparison pages",
        description: "These are the comparison pages most aligned with the current hotel, laundry and NFC inquiry strategy.",
        links: [
          { href: "/compare/rfid-vs-magnetic-hotel-key-cards/", label: "RFID vs magnetic hotel cards" },
          { href: "/compare/nfc-review-card-vs-qr-review-stand/", label: "NFC review card vs QR review stand" },
          { href: "/compare/google-review-nfc-card-vs-nfc-sticker/", label: "Google review NFC card vs NFC sticker" },
          { href: "/compare/ntag213-vs-ntag215-vs-ntag216/", label: "NTAG213 vs NTAG215 vs NTAG216" },
          { href: "/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/", label: "MIFARE Classic vs Plus vs DESFire" },
          { href: "/compare/mifare-plus-ev2-vs-desfire-ev3/", label: "MIFARE Plus EV2 vs DESFire EV3" },
          { href: "/compare/pps-vs-silicone-vs-textile-rfid-laundry-tags/", label: "PPS vs silicone vs textile RFID laundry tags" },
        ],
      },
      {
        title: "Next comparison paths",
        description: "Use the next layer of comparison pages to expand the shortlist after the first high-friction decision is solved.",
        links: [
          { href: "/guides/google-review-card-placement-guide/", label: "Google review card placement guide" },
          { href: "/guides/google-review-cards-for-multi-location-brands/", label: "Google review cards for multi-location brands" },
          { href: "/compare/rfid-wristbands-hotels-vs-events-vs-resorts/", label: "RFID wristbands for hotels vs events vs resorts" },
          { href: "/compare/silicone-vs-fabric-vs-woven-rfid-wristbands/", label: "Silicone vs fabric vs woven RFID wristbands" },
          { href: "/compare/uhf-vs-hf-rfid-laundry-tags/", label: "UHF vs HF RFID laundry tags" },
          { href: "/compare/hf-vs-uhf-rfid-for-asset-tracking/", label: "HF vs UHF RFID for asset tracking" },
          { href: "/compare/pvc-vs-wood-vs-pla-hotel-key-cards/", label: "PVC vs wood vs PLA hotel cards" },
          { href: "/compare/keyfob-vs-card-vs-wristband-access-control/", label: "Keyfob vs card vs wristband" },
          { href: "/solutions/", label: "Browse solution pages" },
          { href: "/compatibility/", label: "Browse compatibility pages" },
        ],
      },
    ],
    faq: [
      {
        question: "Do these pages replace the main product catalog?",
        answer:
          "No. They reduce one high-friction decision so product pages and quote requests become more precise.",
      },
      {
        question: "Are these comparisons written for English pages only?",
        answer:
          "Yes. They are part of the English static export and are not intended to mirror the translation routes.",
      },
    ],
    primaryAction: { href: "/contact/", label: "Ask which product fits best" },
    secondaryActions: [
      { href: "/solutions/", label: "Browse solution pages" },
      { href: "/products/all/", label: "Browse products" },
      { href: "/faq/", label: "Review FAQ" },
    ],
  },
  {
    route: "/compare/hotel-key-cards-vs-hotel-wristbands/",
    group: "compare",
    title: "Hotel Key Cards Vs Hotel Wristbands",
    kicker: "Hospitality Comparison",
    summary:
      "Hotels rarely choose between cards and wristbands on aesthetics alone. The better decision usually comes from guest flow, property type, amenity access and how many credentials the staff can realistically issue and recover.",
    heroPoints: [
      "Cards are still the default for room access at most properties.",
      "Wristbands gain value when guest convenience and amenity access matter more.",
      "Mixed programs work when the property accepts a more deliberate issuance workflow.",
    ],
    imageAlt: "Hotel cards versus hotel wristbands",
    imageSourceRoutes: ["/product/hotel-key-cards/", "/product/rfid-wristbands-for-hotels/"],
    sections: [
      {
        title: "Quick comparison",
        table: {
          columns: ["Option", "Best fit", "Main strengths", "Main trade-offs"],
          rows: [
            ["Hotel key cards", "Traditional room access", "Easy to issue, familiar for guests, scalable across properties", "More loss risk and less convenient in pools or wet environments"],
            ["Hotel wristbands", "Resorts, spas and amenity-heavy properties", "Hands-free use, harder to lose, strong guest segmentation potential", "Sizing, material and compatibility questions come earlier"],
            ["Mixed program", "Properties with separate room and amenity logic", "Can optimize convenience without replacing every credential path", "More complex issuance and inventory management"],
          ],
        },
      },
      {
        title: "What usually decides it",
        intro:
          "The choice usually gets clearer once the property describes how guests move, what environments dominate and how many access scenarios the staff has to support.",
        bullets: [
          "Room-only properties often stay card-first.",
          "Resorts, water environments and child-focused properties often gain more from wristbands.",
          "Properties with tiered amenities may use cards for rooms and wristbands for zones or packages.",
          "Premium material choice matters after the format decision, not before it.",
        ],
      },
    ],
    resourceCards: [
      {
        title: "Related pages",
        description: "Go from comparison back to the broader hospitality path or the matching products.",
        links: [
          { href: "/solutions/hotel-rfid-access-control/", label: "Hotel RFID access solution" },
          { href: "/product/hotel-key-cards/", label: "Hotel key cards" },
          { href: "/product/rfid-wristbands-for-hotels/", label: "Hotel RFID wristbands" },
          { href: "/2024/12/25/rfid-hotel-key-card/", label: "Hotel key card guide" },
        ],
      },
    ],
    faq: [
      {
        question: "Are wristbands replacing hotel cards everywhere?",
        answer:
          "No. Wristbands are gaining ground in resort and amenity-heavy contexts, but cards remain the default in many standard room-access programs.",
      },
      {
        question: "When is a mixed program worth it?",
        answer:
          "When the property has clearly different room and amenity workflows and can manage a more deliberate issuance process.",
      },
    ],
    primaryAction: { href: "/contact/hotel-rfid/", label: "Discuss hospitality credential options" },
    secondaryActions: [
      { href: "/solutions/hotel-rfid-access-control/", label: "View hotel solution page" },
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/products/rfid-wristbands/", label: "Browse RFID wristbands" },
    ],
  },
  {
    route: "/compare/pps-vs-silicone-laundry-tags/",
    group: "compare",
    title: "PPS Laundry Tags Vs Silicone Laundry Tags",
    kicker: "Laundry Comparison",
    summary:
      "PPS and silicone laundry tags solve different durability and textile-fit problems. The better choice comes from wash profile, attachment style and how much flexibility the garment or linen workflow demands.",
    heroPoints: [
      "PPS often fits harder, more compact wash environments.",
      "Silicone is often better when flexibility and garment integration matter.",
      "The wash profile and attachment method should decide the first sample split.",
    ],
    imageAlt: "PPS versus silicone laundry tags",
    imageSourceRoutes: ["/product/pps-rfid-laundry-tag/", "/product/rfid-silicone-laundry-tag/"],
    sections: [
      {
        title: "Quick comparison",
        table: {
          columns: ["Tag type", "Best fit", "Main strengths", "Main trade-offs"],
          rows: [
            ["PPS laundry tag", "Higher-stress and compact hard-shell uses", "Durable, compact and proven in many harsher wash conditions", "Less flexible for soft textile integration"],
            ["Silicone laundry tag", "Garments or textiles needing more bend and softness", "Better flexibility and easier fit with some textile workflows", "Needs tighter validation against wash heat and handling style"],
          ],
        },
      },
      {
        title: "What should decide first",
        intro:
          "Textile type, heat profile and attachment method usually eliminate one of the two options quickly.",
        bullets: [
          "If the tag needs to flex with the textile, silicone often becomes more attractive.",
          "If the environment is harsher and the format can stay compact, PPS often moves up the list.",
          "Reader setup and ID management still matter, but they rarely decide the material alone.",
        ],
      },
    ],
    resourceCards: [
      {
        title: "Related pages",
        description: "Use these pages to move from material comparison to project planning.",
        links: [
          { href: "/solutions/rfid-laundry-management/", label: "Laundry solution page" },
          { href: "/product/pps-rfid-laundry-tag/", label: "PPS RFID laundry tag" },
          { href: "/product/rfid-silicone-laundry-tag/", label: "RFID silicone laundry tag" },
          { href: "/2024/12/22/rfid-laundry-tags/", label: "Laundry RFID guide" },
        ],
      },
    ],
    faq: [
      {
        question: "Is PPS always more durable than silicone?",
        answer:
          "Not in every real deployment. PPS often suits harsher conditions, but durability still depends on the wash profile and how the tag is attached and handled.",
      },
      {
        question: "Should both be sampled together?",
        answer:
          "Often yes, but only when both remain realistic after the textile and wash profile are understood.",
      },
    ],
    primaryAction: { href: "/contact/laundry-rfid/", label: "Discuss laundry tag options" },
    secondaryActions: [
      { href: "/solutions/rfid-laundry-management/", label: "View laundry solution page" },
      { href: "/products/rfid-tags/", label: "Browse RFID tags" },
      { href: "/faq/", label: "Review sample FAQ" },
    ],
  },
  {
    route: "/compare/mifare-plus-vs-desfire/",
    group: "compare",
    title: "MIFARE Plus Vs DESFire",
    kicker: "Secure Card Comparison",
    summary:
      "MIFARE Plus and DESFire are often compared in projects that want stronger security than older card estates. The correct choice depends on migration path, application complexity, memory model and the reader environment already in place.",
    heroPoints: [
      "MIFARE Plus often enters the conversation in migration-minded projects.",
      "DESFire tends to fit more security-demanding or application-rich environments.",
      "Reader estate and application logic matter as much as the chip label itself.",
    ],
    imageAlt: "MIFARE Plus versus DESFire cards",
    imageSourceRoutes: ["/product/mifare-plus-card/", "/product/mifare-desfire-cards/", "/product/mifare-desfire-ev2-cards/"],
    sections: [
      {
        title: "Quick comparison",
        table: {
          columns: ["Dimension", "MIFARE Plus", "DESFire"],
          rows: [
            ["Typical fit", "Projects balancing stronger security with migration concerns", "Projects needing higher-security and richer application handling"],
            ["Selection driver", "Reader estate and transition path", "Application complexity, security level and lifecycle expectations"],
            ["Sampling focus", "Compatibility and practical migration fit", "Application structure and deployment model"],
          ],
        },
      },
      {
        title: "What usually decides it",
        intro:
          "If the team can explain the current reader estate, the application model and the migration pressure, the right card family becomes much easier to narrow.",
        bullets: [
          "Use MIFARE Plus when compatibility and migration framing dominate the decision.",
          "Use DESFire when the project clearly targets stronger security and more complex application structures.",
          "Avoid choosing either family only from the card name or a generic memory comparison.",
        ],
      },
    ],
    resourceCards: [
      {
        title: "Related pages",
        description: "Move from chip-family comparison to product and article pages.",
        links: [
          { href: "/product/mifare-plus-card/", label: "MIFARE Plus card" },
          { href: "/product/mifare-desfire-cards/", label: "MIFARE DESFire cards" },
          { href: "/product/mifare-desfire-ev2-cards/", label: "MIFARE DESFire EV2 cards" },
          { href: "/2025/11/04/mifare_plus_card/", label: "MIFARE Plus guide" },
        ],
      },
    ],
    faq: [
      {
        question: "Is DESFire always the better choice?",
        answer:
          "Not automatically. DESFire often fits higher-security projects better, but the migration path and the existing reader estate can make MIFARE Plus the more practical decision.",
      },
      {
        question: "Can a project choose based only on memory size?",
        answer:
          "No. Security level, application model and infrastructure fit usually matter more than a simple headline memory comparison.",
      },
    ],
    primaryAction: { href: "/contact/custom-rfid-cards/", label: "Request secure card guidance" },
    secondaryActions: [
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/2025/11/04/mifare_plus_card/", label: "Read the guide" },
      { href: "/faq/", label: "Review FAQ" },
    ],
  },
  {
    route: "/compare/on-metal-nfc-labels-vs-standard-nfc-stickers/",
    group: "compare",
    title: "On-Metal NFC Labels Vs Standard NFC Stickers",
    kicker: "Label Comparison",
    summary:
      "The difference between on-metal NFC labels and standard NFC stickers is not cosmetic. It is a deployment question about surface, performance and whether the label has to work in an environment that breaks a normal sticker's read behavior.",
    heroPoints: [
      "Standard stickers suit non-metal packaging and general surfaces.",
      "On-metal paths are for metal surfaces where a normal sticker will underperform.",
      "Surface details should determine the first sample set, not label price alone.",
    ],
    imageAlt: "On-metal versus standard NFC labels",
    imageSourceRoutes: ["/product/nfc-stickers/", "/products/rfid-labels/"],
    sections: [
      {
        title: "Quick comparison",
        table: {
          columns: ["Path", "Best fit", "Main strengths", "Main trade-offs"],
          rows: [
            ["Standard NFC sticker", "Packaging, smart labels and non-metal surfaces", "Simple, flexible and efficient for many campaigns", "Performance can collapse on metal"],
            ["On-metal label path", "Metal asset surfaces and machinery", "Built for difficult metal environments", "Needs a clearer surface and read-range brief before selection"],
          ],
        },
      },
      {
        title: "What should decide the label first",
        intro:
          "Most bad label shortlists happen because the team delays the surface conversation until after samples are ordered.",
        bullets: [
          "Confirm whether the label will sit on metal, near metal or away from it.",
          "Describe the phone or reader environment and the read range expected.",
          "Include print, size and application details with the surface brief.",
        ],
      },
    ],
    resourceCards: [
      {
        title: "Related pages",
        description: "Use the comparison, product and solution pages together for label shortlisting.",
        links: [
          { href: "/solutions/rfid-asset-tracking-labels/", label: "RFID asset-tracking labels solution" },
          { href: "/product/nfc-stickers/", label: "NFC stickers" },
          { href: "/products/rfid-labels/", label: "Browse RFID labels" },
          { href: "/contact/", label: "Request label guidance" },
        ],
      },
    ],
    faq: [
      {
        question: "Can a standard NFC sticker be tested on metal anyway?",
        answer:
          "It can be tested, but that often wastes time if the deployment is clearly metal-bound and already points to an on-metal path.",
      },
      {
        question: "Does on-metal always mean a harder, thicker label?",
        answer:
          "Not always, but it usually means the label construction must account for the metal environment rather than assuming a normal sticker will behave the same.",
      },
    ],
    primaryAction: { href: "/contact/rfid-labels-tags/", label: "Discuss label options" },
    secondaryActions: [
      { href: "/solutions/rfid-asset-tracking-labels/", label: "View label solution page" },
      { href: "/products/rfid-labels/", label: "Browse RFID labels" },
      { href: "/faq/", label: "Review sample FAQ" },
    ],
  },
  {
    route: "/compare/metal-vs-wood-vs-pvc-nfc-business-cards/",
    group: "compare",
    title: "Metal Vs Wood Vs PVC NFC Business Cards",
    kicker: "NFC Card Comparison",
    summary:
      "Material choice for NFC business cards changes more than the visual finish. It affects brand perception, production practicality and how the card fits the intended user group.",
    heroPoints: [
      "PVC fits scale and simplicity.",
      "Metal fits premium executive or luxury-led programs.",
      "Wood fits sustainability or boutique positioning when the finish is part of the story.",
    ],
    imageAlt: "Metal, wood and PVC NFC business cards",
    imageSourceRoutes: ["/product/metal-nfc-card/", "/product/wooden-rfid-card/", "/product/nfc-business-card/"],
    sections: [
      {
        title: "Quick comparison",
        table: {
          columns: ["Material", "Best fit", "Main strengths", "Main trade-offs"],
          rows: [
            ["PVC", "Team-wide rollouts and standard business-card programs", "Scalable, familiar and production-friendly", "Less premium differentiation"],
            ["Metal", "Luxury, executive and high-impact branding", "Strong perceived value and distinct look", "Needs tighter control over finish and construction"],
            ["Wood", "Eco-led, boutique and tactile brand programs", "Distinct feel and sustainability story", "Material consistency and finish choice matter more"],
          ],
        },
      },
      {
        title: "What should decide after material",
        intro:
          "The material is only one decision. The team still needs to agree on chip behavior, redirect workflow and whether personalization is required across multiple users.",
        bullets: [
          "Confirm phone compatibility and redirect behavior first.",
          "Then decide whether premium material meaningfully improves the brand outcome.",
          "Use packaging and personalization requirements to refine the sample set.",
        ],
      },
    ],
    resourceCards: [
      {
        title: "Related pages",
        description: "Move from material comparison into product and solution pages.",
        links: [
          { href: "/solutions/nfc-business-card-programs/", label: "NFC business card solution page" },
          { href: "/product/nfc-business-card/", label: "NFC business card" },
          { href: "/product/metal-nfc-card/", label: "Metal NFC card" },
          { href: "/product/wooden-rfid-card/", label: "Wooden RFID card" },
          { href: "/2024/12/24/rfid-wooden-card/", label: "Wooden card guide" },
        ],
      },
    ],
    faq: [
      {
        question: "Is metal the best option for all premium NFC card projects?",
        answer:
          "No. Metal fits some premium programs well, but wood or even carefully finished PVC can be better if the brand story or rollout model points elsewhere.",
      },
      {
        question: "Should teams decide on material before workflow?",
        answer:
          "No. The tap behavior, target phones and redirect logic should be confirmed first so the material decision supports the actual use case.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Discuss NFC card materials" },
    secondaryActions: [
      { href: "/solutions/nfc-business-card-programs/", label: "View NFC card solution page" },
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/faq/", label: "Review compatibility FAQ" },
    ],
  },
];

const CONTACT_SCENARIOS: ContactScenario[] = [
  {
    route: "/contact/hotel-rfid/",
    title: "Hotel RFID Project Inquiry",
    kicker: "Hospitality Contact",
    summary:
      "Use this path when the project is mainly about hotel key cards, resort wristbands, guest credentials or mixed hospitality access programs. The goal is to move your first message from generic sourcing to a compatibility-ready hotel brief.",
    heroPoints: [
      "Share the current lock or encoder environment first.",
      "Tell us whether the property needs cards, wristbands or both.",
      "Include branding, encoding and rollout timing if samples are time-sensitive.",
    ],
    imageAlt: "Hotel RFID contact path",
    imageSourceRoutes: ["/product/hotel-key-cards/", "/product/rfid-wristbands-for-hotels/"],
    bestFit: [
      "Hotels replacing existing room-key cards or magstripe stock.",
      "Resorts adding RFID wristbands for pools, spas, lockers or family access.",
      "Properties comparing standard PVC cards with premium or wearable formats.",
    ],
    checklist: [
      "Lock, encoder or PMS compatibility details.",
      "Preferred credential format: card, wristband or mixed program.",
      "Material, finish, numbering, magstripe or RFID encoding requirements.",
      "Pilot quantity, property count and target delivery window.",
    ],
    samplePlan: [
      "Validate one lock-compatible card or wristband path before expanding into premium finishes.",
      "Split samples between standard guest issue and any premium or amenity format if both are still being considered.",
      "Use a current room key or known encoder reference as the benchmark for the first sample round.",
    ],
    leadTimeFocus: [
      "Compatibility and encoding checks should be resolved before finish-heavy revisions start.",
      "Mixed card-and-wristband programs usually need more approval time than single-format rollouts.",
      "Flag property opening dates or seasonal launch windows in the first message.",
    ],
    productLinks: [
      { href: "/product/hotel-key-cards/", label: "Hotel key cards" },
      { href: "/product/rfid-wristbands-for-hotels/", label: "RFID wristbands for hotels" },
      { href: "/product/printed-rfid-cards/", label: "Printed RFID cards" },
    ],
    resourceLinks: [
      { href: "/solutions/hotel-rfid-access-control/", label: "Hotel RFID solution page" },
      { href: "/compare/hotel-key-cards-vs-hotel-wristbands/", label: "Cards vs wristbands comparison" },
      { href: "/2024/12/25/rfid-hotel-key-card/", label: "Hotel key card guide" },
      { href: "/contact/", label: "General contact details" },
    ],
    mailSubject: "Hotel RFID project inquiry",
    primaryLabel: "Email hotel project details",
  },
  {
    route: "/contact/laundry-rfid/",
    title: "Laundry RFID Project Inquiry",
    kicker: "Laundry Contact",
    summary:
      "Use this path for hotel linen, uniform, healthcare garment or industrial laundry tracking projects. A strong first message should make the wash profile, tag attachment method and validation target clear.",
    heroPoints: [
      "Describe the textile type and wash-cycle stress first.",
      "Explain how the tag is attached or what size limits the textile allows.",
      "Send the pilot quantity and validation timeline if sample testing is urgent.",
    ],
    imageAlt: "Laundry RFID contact path",
    imageSourceRoutes: ["/product/rfid-laundry-tags/", "/product/pps-rfid-laundry-tag/", "/product/rfid-silicone-laundry-tag/"],
    bestFit: [
      "Hotel linen and towel tracking programs.",
      "Industrial laundry plants or rental-uniform operators.",
      "Healthcare or reusable-textile systems that need traceability across sites.",
    ],
    checklist: [
      "Textile type, attachment method and tag size limits.",
      "Expected wash cycles, heat range and chemical exposure.",
      "Reader setup, frequency and where reads must happen in the process.",
      "Pilot sample split, validation sites and desired delivery timing.",
    ],
    samplePlan: [
      "Test at least two attachment or material paths against the real wash profile.",
      "Run the pilot through the highest-stress washing and drying steps, not only a bench check.",
      "Decide early whether the first sample round is for durability validation, read-point tuning or both.",
    ],
    leadTimeFocus: [
      "Wash validation usually takes longer than the initial sample shipment.",
      "Attachment-method changes can delay approval more than tag pricing or artwork.",
      "Share any rollout deadline that depends on wash-cycle testing finishing on time.",
    ],
    productLinks: [
      { href: "/product/rfid-laundry-tags/", label: "Industrial RFID laundry tags" },
      { href: "/product/pps-rfid-laundry-tag/", label: "PPS RFID laundry tag" },
      { href: "/product/rfid-silicone-laundry-tag/", label: "RFID silicone laundry tag" },
    ],
    resourceLinks: [
      { href: "/solutions/rfid-laundry-management/", label: "Laundry RFID solution page" },
      { href: "/compare/pps-vs-silicone-laundry-tags/", label: "PPS vs silicone comparison" },
      { href: "/2024/12/22/rfid-laundry-tags/", label: "Laundry RFID guide" },
      { href: "/contact/", label: "General contact details" },
    ],
    mailSubject: "Laundry RFID project inquiry",
    primaryLabel: "Email laundry project details",
  },
  {
    route: "/contact/event-rfid/",
    title: "Event RFID Project Inquiry",
    kicker: "Event Contact",
    summary:
      "Use this path when the project is mainly about event wristbands, attendee access, cashless activation or venue segmentation. The fastest recommendation comes from understanding the event flow rather than only the band style.",
    heroPoints: [
      "Describe attendance, gate count and peak scan flow.",
      "Say whether the band is single-event, reusable or premium branded.",
      "Include chip, numbering and color-segmentation needs if they already exist.",
    ],
    imageAlt: "Event RFID contact path",
    imageSourceRoutes: ["/product/rfid-event-wristband/", "/product/rfid-wristbands-for-events/", "/product/uhf-wristband/"],
    bestFit: [
      "Festivals, expos and conferences planning RFID attendee control.",
      "Venue teams adding cashless use, VIP zoning or sponsor activation.",
      "Buyers comparing disposable, reusable and premium wristband formats.",
    ],
    checklist: [
      "Expected attendance, event duration and access-point count.",
      "Single-use, reusable or premium wristband preference.",
      "Chip family, encoding, numbering or ticket-tier color logic.",
      "Sample quantity, deadline and likely reorder cadence.",
    ],
    samplePlan: [
      "Start with the wristband material and chip combination that matches the real gate flow.",
      "Keep one alternative band format in scope if comfort, closure style or branding is still undecided.",
      "Pilot with the same scanners and access workflow planned for the live event.",
    ],
    leadTimeFocus: [
      "Event dates compress approval cycles, so numbering logic and sample sign-off need early confirmation.",
      "Custom colors, premium closures and large serialized runs should be flagged immediately.",
      "Mention whether the project supports a one-off event or a repeat series with reorders.",
    ],
    productLinks: [
      { href: "/product/rfid-event-wristband/", label: "RFID event wristband" },
      { href: "/product/rfid-wristbands-for-events/", label: "RFID wristbands for events" },
      { href: "/product/uhf-wristband/", label: "UHF wristband" },
    ],
    resourceLinks: [
      { href: "/solutions/rfid-event-access-control/", label: "Event RFID solution page" },
      { href: "/2024/12/24/rfid-event-wristband/", label: "Event wristband guide" },
      { href: "/products/rfid-wristbands/", label: "Browse RFID wristbands" },
      { href: "/contact/", label: "General contact details" },
    ],
    mailSubject: "Event RFID project inquiry",
    primaryLabel: "Email event project details",
  },
  {
    route: "/contact/vehicle-rfid/",
    title: "Vehicle RFID Project Inquiry",
    kicker: "Vehicle Contact",
    summary:
      "Use this path for parking access, gated communities, fleet identification or vehicle-surface RFID tagging. Good first messages explain the checkpoint layout, mounting surface and how the vehicle should be associated with the tag.",
    heroPoints: [
      "Send lane or checkpoint photos if possible.",
      "Explain whether the tag belongs on the windshield, headlight or another surface.",
      "Include tamper, numbering or anti-transfer expectations early.",
    ],
    imageAlt: "Vehicle RFID contact path",
    imageSourceRoutes: ["/product/rfid-windshield-tag/", "/product/rfid-sticker-on-headlight/"],
    bestFit: [
      "Parking access and gated-community vehicle programs.",
      "Campus, industrial or logistics fleets using checkpoint reads.",
      "Projects comparing windshield and headlight-based tag formats.",
    ],
    checklist: [
      "Checkpoint layout, reader position and target read distance.",
      "Mounting surface details and any windshield tint or material limits.",
      "Need for tamper evidence, numbering or linked vehicle records.",
      "Pilot fleet size, installation workflow and delivery timing.",
    ],
    samplePlan: [
      "Validate the selected mounting surface with real reader placement and vehicle motion.",
      "Keep one backup format in play if windshield tint, curvature or transfer risk is uncertain.",
      "Test numbering and tamper logic during pilot installation instead of after production approval.",
    ],
    leadTimeFocus: [
      "Reader placement and read-distance tuning usually control the project schedule first.",
      "Tamper or anti-transfer features should be confirmed before final production planning.",
      "State installation windows for fleets, campuses or gated communities in the first brief.",
    ],
    productLinks: [
      { href: "/product/rfid-windshield-tag/", label: "RFID windshield tag" },
      { href: "/product/rfid-sticker-on-headlight/", label: "RFID sticker on headlight" },
      { href: "/products/rfid-tags/", label: "Browse RFID tags" },
    ],
    resourceLinks: [
      { href: "/solutions/vehicle-rfid-identification/", label: "Vehicle RFID solution page" },
      { href: "/faq/", label: "Review sample FAQ" },
      { href: "/contact/", label: "General contact details" },
    ],
    mailSubject: "Vehicle RFID project inquiry",
    primaryLabel: "Email vehicle project details",
  },
  {
    route: "/contact/rfid-readers/",
    title: "RFID Reader Project Inquiry",
    kicker: "Reader Contact",
    summary:
      "Use this path when the project depends on reader compatibility, SDK expectations, enrollment workflows or bundled test kits. The key inputs are protocol support, interface requirements and deployment constraints.",
    heroPoints: [
      "Describe the cards or tags the reader must support.",
      "Mention USB, Bluetooth, serial or embedded interface requirements.",
      "Explain whether the request is for testing, enrollment or field deployment.",
    ],
    imageAlt: "RFID reader contact path",
    imageSourceRoutes: ["/product/acr122u/", "/product/nfc-reader-writer-with-free-sdks/", "/product/bluetooth-rfid-scanner/"],
    bestFit: [
      "Desktop enrollment and card-issuing setups.",
      "Pilot kits that combine readers with cards, tags or wristbands.",
      "Software and OEM teams testing protocol or SDK compatibility.",
    ],
    checklist: [
      "Target chip standards, frequency and read-range expectations.",
      "USB, Bluetooth, serial or embedded interface requirements.",
      "SDK, middleware or operating-environment constraints.",
      "Pilot quantity, accessory needs and timeline.",
    ],
    samplePlan: [
      "Confirm the reader against the exact card or tag chips used in the pilot.",
      "Bundle accessory, SDK or firmware needs into the first sample request to avoid a second round.",
      "Separate lab validation needs from field deployment quantities early.",
    ],
    leadTimeFocus: [
      "Interface and SDK questions usually block the project before hardware availability does.",
      "Accessory, firmware or enclosure requirements should surface in the first message.",
      "Call out demo deadlines, integration sprints or procurement windows early.",
    ],
    productLinks: [
      { href: "/product/acr122u/", label: "ACR122U reader" },
      { href: "/product/nfc-reader-writer-with-free-sdks/", label: "NFC reader writer with SDKs" },
      { href: "/product/bluetooth-rfid-scanner/", label: "Bluetooth RFID scanner" },
    ],
    resourceLinks: [
      { href: "/products/rfid-readers/", label: "Browse RFID readers" },
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/products/rfid-tags/", label: "Browse RFID tags" },
      { href: "/contact/", label: "General contact details" },
    ],
    mailSubject: "RFID reader integration inquiry",
    primaryLabel: "Send reader requirements",
  },
  {
    route: "/contact/access-control-keyfobs/",
    title: "Keyfob And Access Control Inquiry",
    kicker: "Access Control Contact",
    summary:
      "Use this path for keyfob programs, membership credentials, office or residential access control and other compact credential formats. The best first message names the reader environment, chip family and housing expectations.",
    heroPoints: [
      "Name the reader or access-control environment first.",
      "Say whether the requirement is proximity, smart-card or OEM-specific.",
      "Include shell style, numbering and logo needs if they are known.",
    ],
    imageAlt: "Access-control keyfob contact path",
    imageSourceRoutes: ["/product/rfid-key-fob/", "/product/proximity-fobs/"],
    bestFit: [
      "Residential and office access-control programs.",
      "Gym, locker, membership or staff credential deployments.",
      "OEM keyfob sourcing with shell, color or hardware preferences.",
    ],
    checklist: [
      "Reader compatibility, chip family or frequency requirement.",
      "Housing shape, color, ring hardware and durability expectations.",
      "Need for logo, laser number, QR or barcode marking.",
      "Sample quantity, reorder plan and delivery target.",
    ],
    samplePlan: [
      "Validate chip compatibility before locking shell style, color or hardware details.",
      "Keep sample focus on the few housings that match the real deployment environment.",
      "Test numbering, marking or packaging only after the credential path is confirmed.",
    ],
    leadTimeFocus: [
      "Custom shells or hardware tweaks usually take longer than standard stock options.",
      "Numbering and branding approvals can slow reorders if they are left too late.",
      "Mention handover, move-in or site-opening dates if the credentials support a live launch.",
    ],
    productLinks: [
      { href: "/product/rfid-key-fob/", label: "RFID key fob" },
      { href: "/product/proximity-fobs/", label: "Proximity fobs" },
      { href: "/products/rfid-keyfobs/", label: "Browse RFID keyfobs" },
    ],
    resourceLinks: [
      { href: "/faq/", label: "Review access-control FAQ" },
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/contact/", label: "General contact details" },
    ],
    mailSubject: "Access control keyfob inquiry",
    primaryLabel: "Email keyfob project details",
  },
  {
    route: "/contact/custom-rfid-cards/",
    title: "Custom RFID Card Inquiry",
    kicker: "Card Contact",
    summary:
      "Use this path for access cards, secure smart cards, OEM card programs and general custom RFID card sourcing. The first message should establish chip family, security level, print detail and issuance expectations.",
    heroPoints: [
      "State the chip family or security level first if it is already known.",
      "Explain whether the card is for access, secure ID, OEM supply or mixed use.",
      "Include print, numbering, barcode or encoding requirements early.",
    ],
    imageAlt: "Custom RFID card contact path",
    imageSourceRoutes: ["/product/mifare-plus-card/", "/product/mifare-desfire-cards/", "/product/printed-rfid-cards/"],
    bestFit: [
      "Custom access cards with print or personalization needs.",
      "Secure smart-card projects comparing MIFARE Plus and DESFire paths.",
      "OEM and industrial programs that need repeatable chip, finish and packaging control.",
    ],
    checklist: [
      "Chip family, protocol, memory or security-level target.",
      "Card stock, finish, thickness and artwork requirements.",
      "Need for numbering, magstripe, barcode or sector encoding.",
      "Sample quantity, annual volume and launch timing.",
    ],
    samplePlan: [
      "Sample the target chip family and finish combination before major artwork revisions.",
      "Use one control sample that matches the current credential if migration risk matters.",
      "Separate security validation from print-finish approval when possible.",
    ],
    leadTimeFocus: [
      "Secure chip and encoding decisions should be locked before mass personalization planning.",
      "Special print, overlays or packaging steps extend approval cycles more than blank stock.",
      "Note launch, issuance or tender dates in the first brief.",
    ],
    productLinks: [
      { href: "/product/mifare-plus-card/", label: "MIFARE Plus card" },
      { href: "/product/mifare-desfire-cards/", label: "MIFARE DESFire cards" },
      { href: "/product/printed-rfid-cards/", label: "Printed RFID cards" },
    ],
    resourceLinks: [
      { href: "/compare/mifare-plus-vs-desfire/", label: "MIFARE Plus vs DESFire comparison" },
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/2025/11/04/mifare_plus_card/", label: "MIFARE Plus guide" },
      { href: "/contact/", label: "General contact details" },
    ],
    mailSubject: "Custom RFID card inquiry",
    primaryLabel: "Email RFID card project details",
  },
  {
    route: "/contact/nfc-branding-cards/",
    title: "NFC Card And Review Card Inquiry",
    kicker: "NFC Branding Contact",
    summary:
      "Use this path for NFC business cards, review cards, metal cards, wood cards and other branded contactless campaigns. The first message should cover target phones, redirect logic and the material direction you want to test.",
    heroPoints: [
      "Describe the tap destination or redirect workflow first.",
      "Mention the card material and premium feel you want to achieve.",
      "Include whether the rollout is for one person, a team or a campaign kit.",
    ],
    imageAlt: "NFC branding contact path",
    imageSourceRoutes: ["/product/nfc-business-card/", "/product/metal-nfc-card/", "/product/wooden-rfid-card/"],
    bestFit: [
      "Digital business-card rollouts for teams or executives.",
      "Premium NFC cards using metal, wood or eco materials.",
      "Review-generation and tap-to-landing campaigns that need a branded physical card.",
    ],
    checklist: [
      "Target phones, chip family and editable URL or redirect requirements.",
      "Preferred material, finish, thickness and visual direction.",
      "Need for QR, numbering, gift packaging or multi-user personalization.",
      "Pilot quantity, approval timing and rollout size.",
    ],
    samplePlan: [
      "Validate the tap flow on the main phone types before approving premium materials.",
      "Use one standard material sample as a control if metal or wood is still under review.",
      "Align redirect logic, QR content and packaging expectations in the same first round.",
    ],
    leadTimeFocus: [
      "Material experiments and premium finishing usually drive the schedule.",
      "Phone-compatibility sign-off should happen before visual refinement cycles multiply.",
      "State the campaign, event or rollout date if the cards support a live launch.",
    ],
    productLinks: [
      { href: "/product/nfc-business-card/", label: "NFC business card" },
      { href: "/product/metal-nfc-card/", label: "Metal NFC card" },
      { href: "/product/wooden-rfid-card/", label: "Wooden RFID card" },
      { href: "/product/google-review-nfc-card/", label: "Google review NFC card" },
    ],
    resourceLinks: [
      { href: "/solutions/nfc-business-card-programs/", label: "NFC business card solution page" },
      { href: "/compare/metal-vs-wood-vs-pvc-nfc-business-cards/", label: "Material comparison page" },
      { href: "/2024/12/24/rfid-wooden-card/", label: "Wooden card guide" },
      { href: "/contact/", label: "General contact details" },
    ],
    mailSubject: "NFC branding card inquiry",
    primaryLabel: "Email NFC card project details",
  },
  {
    route: "/contact/rfid-labels-tags/",
    title: "RFID Labels And Tags Inquiry",
    kicker: "Label And Tag Contact",
    summary:
      "Use this path for RFID labels, NFC stickers, asset tags and surface-specific tag projects. The best first message makes the surface, read environment and print or encoding model explicit.",
    heroPoints: [
      "Describe the mounting surface before discussing the label itself.",
      "Say whether the environment is metal, non-metal or mixed.",
      "Include print content, serialization and application method if known.",
    ],
    imageAlt: "RFID labels and tags contact path",
    imageSourceRoutes: ["/product/nfc-stickers/", "/products/rfid-labels/", "/products/rfid-tags/"],
    bestFit: [
      "RFID label and NFC sticker sourcing for packaging or smart labels.",
      "Asset-tracking labels where surface and read environment matter.",
      "Tag programs that still need to choose between labels and harder tag formats.",
    ],
    checklist: [
      "Mounting surface, adhesive needs and whether metal is present.",
      "Reader or phone environment, expected read distance and scan frequency.",
      "Label size, print content, serialization and encoding requirements.",
      "Roll format, application method and sample quantity.",
    ],
    samplePlan: [
      "Test labels on the real surface with the actual reader or phone environment.",
      "Keep one backup label or hard-tag path in scope if metal or harsh surfaces are involved.",
      "Pilot print, serialization and application method together when deployment speed matters.",
    ],
    leadTimeFocus: [
      "Surface validation and adhesive testing usually determine timing first.",
      "On-metal or custom-converting work should be flagged before quote alignment.",
      "Mention installation batch size and launch date if labels are tied to a field rollout.",
    ],
    productLinks: [
      { href: "/products/rfid-labels/", label: "Browse RFID labels" },
      { href: "/product/nfc-stickers/", label: "NFC stickers" },
      { href: "/products/rfid-tags/", label: "Browse RFID tags" },
    ],
    resourceLinks: [
      { href: "/solutions/rfid-asset-tracking-labels/", label: "RFID label solution page" },
      { href: "/compare/on-metal-nfc-labels-vs-standard-nfc-stickers/", label: "On-metal vs standard comparison" },
      { href: "/contact/", label: "General contact details" },
    ],
    mailSubject: "RFID labels and tags inquiry",
    primaryLabel: "Email label and tag project details",
  },
];

/* ────────────────────────────────────────────────────────────────────────────
 * MIFARE DESFire EV3 Blank Cards — Bulk Product Landing Page
 * ──────────────────────────────────────────────────────────────────────────── */
const DESFIRE_EV3_LANDING: EditorialDefinition = {
  route: "/products/rfid-cards/mifare-desfire-ev3-cards/",
  group: "solutions",
  title: "MIFARE DESFire EV3 Blank Cards — Bulk",
  kicker: "High-Security RFID Cards",
  summary:
    "MIFARE DESFire EV3 is NXP's highest-security contactless smart-card IC for access control, transit, hospitality and corporate ID. Proud Tek supplies blank and pre-programmed DESFire EV3 cards in 2 KB, 4 KB and 8 KB memory options with factory-direct pricing, custom printing and fast lead times.",
  heroPoints: [
    "AES-128 encryption with secure messaging — the strongest security in the MIFARE family.",
    "Three memory options (2 KB / 4 KB / 8 KB) for single-app credentials to multi-app wallets.",
    "Drop-in compatibility with existing DESFire EV1 and EV2 infrastructure.",
    "Factory-direct from Shenzhen — MOQ 500 pcs, samples ship in 3–5 days.",
  ],
  imageAlt: "Stack of blank white MIFARE DESFire EV3 PVC cards ready for custom printing",
  imageSourceRoutes: ["/product/mifare-desfire-cards/", "/product/mifare-desfire-ev2-cards/", "/product/hotel-key-cards/"],
  brief: [
    {
      label: "Chip",
      text: "NXP MIFARE DESFire EV3 (MF3D(H)x3) — genuine NXP silicon, 7-byte UID",
    },
    {
      label: "Memory options",
      items: ["2 KB — single-application access cards", "4 KB — multi-app credentials with moderate data", "8 KB — transit wallets, loyalty + access combos"],
    },
    {
      label: "Security",
      items: [
        "AES-128 encryption with secure messaging (EV3 level)",
        "Mutual three-pass authentication",
        "Proximity check (relay-attack protection)",
        "Transaction MAC for offline integrity",
        "Secure Dynamic Messaging (SDM) for NFC phone verification",
      ],
    },
    {
      label: "Standards",
      items: ["ISO/IEC 14443 Type A", "NFC Forum Type 4 Tag", "ISO 7810 CR-80 card dimensions"],
    },
    {
      label: "Card body",
      items: ["Standard PVC 0.84 mm (ISO 7810 CR-80)", "PET-G, PC or PVC composite options", "Gloss or matte lamination", "Optional magnetic stripe (LoCo/HiCo)"],
    },
    {
      label: "Pricing guidance",
      items: [
        "MOQ 500 pcs: $1.80–$2.50 per card (2 KB, blank white)",
        "1,000+ pcs: $1.40–$2.00 per card",
        "5,000+ pcs: $1.10–$1.60 per card",
        "10,000+ pcs: request volume quote",
        "Prices vary by memory size, printing and encoding",
      ],
    },
    {
      label: "Lead time",
      items: [
        "Blank samples: 3–5 business days",
        "Standard production: 10–15 business days",
        "Custom printed: 12–18 business days from artwork approval",
      ],
    },
  ],
  sections: [
    {
      title: "Why DESFire EV3 over Classic or Plus",
      intro:
        "MIFARE Classic uses the broken Crypto-1 cipher — publicly reverse-engineered since 2008 with a 48-bit key. MIFARE Plus upgrades to AES-128 but lacks the flexible file system and advanced features of DESFire. EV3 represents the current security ceiling of the MIFARE ecosystem.",
      table: {
        columns: ["Feature", "Classic 1K", "Plus EV2", "DESFire EV3"],
        rows: [
          ["Encryption", "Crypto-1 (48-bit, broken)", "AES-128", "AES-128 + secure messaging"],
          ["Memory", "1 KB fixed sectors", "2 KB / 4 KB", "2 KB / 4 KB / 8 KB flexible files"],
          ["Authentication", "Key A/B per sector", "AES mutual auth", "3-pass mutual auth + proximity check"],
          ["Relay protection", "None", "None", "Proximity check built-in"],
          ["NFC phone verify", "No", "No", "Yes — Secure Dynamic Messaging"],
          ["File system", "Fixed 16 sectors", "Fixed sectors", "Flexible application/file structure"],
          ["Transaction MAC", "No", "No", "Yes — offline integrity"],
          ["Write endurance", "100,000 cycles", "200,000 cycles", "500,000 cycles"],
          ["Backward compatible", "—", "With Classic infrastructure", "With EV1 and EV2 infrastructure"],
        ],
      },
      callout: {
        label: "Migration note",
        text: "DESFire EV3 is backward compatible with EV1 and EV2 readers. Most lock and reader manufacturers (ASSA ABLOY, Dormakaba, SALTO, Allegion) already support or recommend EV3 credentials. Upgrading from Classic or Plus usually requires a reader firmware update but not hardware replacement.",
        href: "/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/",
      },
    },
    {
      title: "Technical specifications",
      intro: "Full NXP MIFARE DESFire EV3 IC specifications based on the MF3D(H)x3 datasheet.",
      table: {
        columns: ["Parameter", "Specification"],
        rows: [
          ["IC type", "NXP MIFARE DESFire EV3 (MF3D(H)x3)"],
          ["RF interface", "ISO/IEC 14443 Type A, 13.56 MHz"],
          ["Data rate", "106 / 212 / 424 / 848 kbit/s"],
          ["UID", "7-byte unique identifier (factory-programmed)"],
          ["Memory", "2 KB, 4 KB or 8 KB EEPROM"],
          ["File system", "Up to 28 applications, up to 32 files per application"],
          ["Encryption", "AES-128, DES, 2K3DES, 3K3DES"],
          ["Authentication", "Mutual three-pass (ISO/IEC 7816-4 compatible)"],
          ["Secure messaging", "Full EV3 secure messaging (encrypted + MACed)"],
          ["Proximity check", "Built-in relay-attack countermeasure"],
          ["Transaction MAC", "Offline transaction integrity verification"],
          ["Secure Dynamic Messaging", "Cryptographic NFC URL for phone-based verification"],
          ["Write endurance", "500,000 cycles"],
          ["Data retention", "10 years"],
          ["Operating temperature", "−25 °C to +70 °C"],
          ["Card dimensions", "85.6 × 54 × 0.84 mm (ISO 7810 CR-80)"],
          ["Card material", "PVC, PET-G, PC or composite"],
          ["NFC Forum", "Type 4 Tag compliant"],
        ],
      },
    },
    {
      title: "Memory options and use cases",
      intro: "Choose the right memory size based on your application complexity. Each card uses DESFire's flexible file system — you define applications and files rather than fixed sectors.",
      table: {
        columns: ["Memory", "Typical use cases", "Application capacity", "Price tier"],
        rows: [
          ["2 KB", "Single-purpose access cards, hotel key cards, basic employee ID", "1–3 applications", "Lowest"],
          ["4 KB", "Multi-application: access + time-attendance, transit + loyalty", "5–10 applications", "Mid"],
          ["8 KB", "Complex wallets: transit fare + building access + cashless payment + loyalty", "15–28 applications", "Highest"],
        ],
      },
      callout: {
        label: "How to choose",
        text: "If your project uses only access control or hotel door locks, 2 KB is sufficient and most cost-effective. If you plan to add a second function (loyalty, time-tracking, cashless) within 2–3 years, start with 4 KB to avoid re-carding later.",
      },
    },
    {
      title: "Card body options and customization",
      intro: "Every DESFire EV3 card ships with the chip and antenna laminated inside a standard CR-80 PVC card body. You choose the finish, printing and add-ons.",
      bullets: [
        "Full-color CMYK offset printing — both sides, edge-to-edge bleed.",
        "Spot UV, foil stamping (gold, silver, holographic) and embossing.",
        "Laser engraving for serial numbers, UID or personalization.",
        "Magnetic stripe overlay (LoCo 300 Oe or HiCo 2750 Oe) for dual-technology cards.",
        "Signature panel, scratch-off panel or writable surface.",
        "Photo ID personalization (thermal transfer or retransfer printing).",
        "Numbering: sequential, UID-matched or custom encoding.",
        "Custom card thickness: standard 0.84 mm or thin-card 0.76 mm options.",
      ],
    },
    {
      title: "Pre-encoding and programming services",
      intro: "Cards can ship blank or pre-programmed to your specification. Pre-encoding at the factory reduces your on-site setup time and ensures consistent credential configuration across the entire batch.",
      bullets: [
        "Application and file structure creation per your AID and file layout.",
        "Master key diversification using your key hierarchy.",
        "Access-key loading for door-lock systems (ASSA ABLOY, Dormakaba, SALTO, Allegion).",
        "NDEF URL programming for NFC phone-tap use cases.",
        "UID reading, printing and database export (CSV or Excel).",
        "Encoding verification with 100% read-back testing before shipment.",
      ],
      callout: {
        label: "Lock compatibility",
        text: "If you are ordering DESFire EV3 cards for an existing hotel or office lock system, share your lock brand and model with us. We will verify chip compatibility and pre-configure the correct application structure before shipping.",
        href: "/solutions/hotel-key-cards/",
      },
    },
    {
      title: "Industry applications",
      intro: "DESFire EV3 is deployed across industries where security, multi-application capability and interoperability matter.",
      table: {
        columns: ["Industry", "Application", "Why DESFire EV3"],
        rows: [
          ["Hotels and resorts", "Guest room keys, amenity access, loyalty", "Works with ASSA ABLOY Visionline, Dormakaba, SALTO — AES security prevents cloning"],
          ["Corporate offices", "Employee ID, door access, print release, cafeteria", "Multi-app file system carries access + time-attendance + cashless on one card"],
          ["Public transit", "Fare collection, multi-modal passes", "High write endurance (500K cycles), proximity check prevents relay attacks"],
          ["Universities", "Student ID, library, lab access, meal plan", "8 KB memory fits 5+ applications on a single credential"],
          ["Healthcare", "Staff ID, restricted-area access, time-tracking", "AES encryption meets data-protection requirements for sensitive environments"],
          ["Government", "Secure building access, visitor management", "EAL4+ certified silicon, proximity check for high-security zones"],
        ],
      },
    },
    {
      title: "Ordering workflow — samples to production",
      intro: "The typical ordering workflow for DESFire EV3 cards follows these steps from initial inquiry to production delivery.",
      bullets: [
        "Step 1 — Share your requirements: chip memory, quantity, printing, encoding and target delivery date.",
        "Step 2 — Receive a quote within 1 business day with unit pricing, tooling fees (if any) and lead time.",
        "Step 3 — Request blank or printed samples (typically 5–10 pcs, shipped via DHL/FedEx in 3–5 days).",
        "Step 4 — Approve samples and confirm artwork for custom printing.",
        "Step 5 — Production runs 10–18 business days depending on quantity and complexity.",
        "Step 6 — 100% quality inspection, encoding verification and shipment with tracking.",
      ],
    },
    {
      title: "Quality assurance",
      intro: "Every DESFire EV3 card undergoes multi-stage quality control before shipment.",
      bullets: [
        "Incoming chip verification: genuine NXP silicon confirmed by TID and batch tracing.",
        "Antenna bonding test: resonance frequency tuning to 13.56 MHz ± 500 kHz.",
        "Lamination integrity: ISO 10373 flex-cycle testing (2,000+ cycles).",
        "100% RF read test: every card scanned post-lamination to confirm UID readability.",
        "Print quality inspection: color accuracy (Delta-E < 3), registration alignment and surface finish.",
        "Encoding verification: when pre-encoded, 100% read-back against the specification file.",
        "Packaging: anti-static ESD bags, moisture-barrier packing for international shipping.",
      ],
    },
  ],
  resourceCards: [
    {
      title: "Related products",
      description: "Other MIFARE card formats available from the same production line.",
      links: [
        { href: "/product/mifare-desfire-cards/", label: "MIFARE DESFire cards (all variants)" },
        { href: "/product/mifare-desfire-ev2-cards/", label: "MIFARE DESFire EV2 cards" },
        { href: "/product/hotel-key-cards/", label: "Hotel key cards" },
        { href: "/product/printed-rfid-cards/", label: "Custom printed RFID cards" },
      ],
    },
    {
      title: "Comparison and guides",
      description: "Use these pages to compare DESFire EV3 against other chip families or match cards to your lock system.",
      links: [
        { href: "/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/", label: "Classic vs Plus vs DESFire for hotel locks" },
        { href: "/compare/mifare-plus-ev2-vs-desfire-ev3/", label: "MIFARE Plus EV2 vs DESFire EV3" },
        { href: "/solutions/hotel-key-cards/", label: "Hotel key card compatibility guide" },
        { href: "/compare/rfid-vs-magnetic-hotel-key-cards/", label: "RFID vs magnetic stripe hotel cards" },
      ],
    },
    {
      title: "Lock compatibility checks",
      description: "Verify that DESFire EV3 cards work with your existing lock platform before ordering.",
      links: [
        { href: "/compatibility/saflok-hotel-key-cards/", label: "Saflok (Dormakaba) compatibility" },
        { href: "/compatibility/vingcard-hotel-key-cards/", label: "VingCard (ASSA ABLOY) compatibility" },
        { href: "/compatibility/salto-hotel-key-cards/", label: "SALTO compatibility" },
        { href: "/compatibility/onity-hotel-key-cards/", label: "Onity compatibility" },
      ],
    },
  ],
  faq: [
    {
      question: "What is the minimum order quantity for DESFire EV3 blank cards?",
      answer:
        "The minimum order quantity for blank white DESFire EV3 cards is 500 pieces. Sample orders of 5–10 cards are available for compatibility testing before committing to a production run.",
    },
    {
      question: "Are these genuine NXP chips or compatible alternatives?",
      answer:
        "All DESFire EV3 cards from Proud Tek use genuine NXP MIFARE DESFire EV3 silicon (MF3D(H)x3 series). Each chip carries a factory-programmed 7-byte UID traceable to NXP's production batches. We do not use clone or emulation chips.",
    },
    {
      question: "Can DESFire EV3 cards work with my existing DESFire EV1 or EV2 readers?",
      answer:
        "Yes. DESFire EV3 is fully backward compatible with EV1 and EV2 infrastructure. Your existing readers and lock systems will work with EV3 cards without hardware changes. EV3-specific features (like SDM) require a reader firmware update.",
    },
    {
      question: "What is the difference between 2 KB, 4 KB and 8 KB cards?",
      answer:
        "Memory size determines how many applications and data files the card can hold. 2 KB is sufficient for single-purpose access control. 4 KB fits 2–3 applications (e.g., door access + time attendance). 8 KB supports complex multi-application wallets. All three use the same EV3 security features.",
    },
    {
      question: "Can you pre-encode cards for my lock system?",
      answer:
        "Yes. Share your lock brand, model and key diversification requirements. We configure the application structure, load keys and verify every card before shipping. Supported lock platforms include ASSA ABLOY, Dormakaba, SALTO, Allegion and most ISO 14443A-compatible systems.",
    },
    {
      question: "How do DESFire EV3 cards compare in price to MIFARE Classic?",
      answer:
        "DESFire EV3 cards cost approximately 3–5× more than Classic 1K cards due to the NXP licensing fee and more complex silicon. However, the security upgrade eliminates cloning risk and often justifies the cost difference in hotel, transit and corporate deployments.",
    },
    {
      question: "What shipping methods are available?",
      answer:
        "Standard orders ship via DHL, FedEx or UPS with full tracking. Door-to-door delivery typically takes 3–7 business days to most destinations. Sea freight is available for orders above 50,000 cards to reduce shipping cost.",
    },
    {
      question: "Do you offer custom card designs with DESFire EV3?",
      answer:
        "Yes. We offer full-color CMYK printing, spot UV, foil stamping, embossing, laser engraving, magnetic stripe overlay and photo personalization. Send your artwork in AI, PDF or PSD format and we provide a digital proof within 1 business day.",
    },
  ],
  primaryAction: { href: "/contact/", label: "Request DESFire EV3 quote" },
  secondaryActions: [
    { href: "/product/mifare-desfire-cards/", label: "Browse DESFire card catalog" },
    { href: "/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/", label: "Compare chip families" },
    { href: "/solutions/hotel-key-cards/", label: "Hotel key card guide" },
  ],
};

const PROGRAMMATIC_EDITORIAL_DEFINITIONS: EditorialDefinition[] = [
  {
    route: "/compatibility/",
    group: "compatibility",
    title: "RFID Hotel Card Compatibility Pages",
    kicker: "Compatibility Library",
    summary:
      "Use these compatibility pages when the hotel project already knows the lock or encoder estate and needs a faster path to the right card material, chip family and sample plan.",
    heroPoints: [
      "Start with the installed lock or encoder environment, not the card finish.",
      "Use compatibility pages to remove the wrong chip families before artwork review.",
      "Send a current guest card, lock photo or encoder reference whenever possible.",
    ],
    imageAlt: "Hotel key card compatibility overview",
    imageSourceRoutes: ["/product/hotel-key-cards/", "/product/printed-rfid-cards/"],
    sections: [
      {
        title: "Where compatibility pages help most",
        bullets: [
          "Hotels replacing existing room-key stock without changing the whole lock estate.",
          "Properties testing premium materials after baseline card compatibility is understood.",
          "Teams narrowing the first sample set before asking for pricing or pre-encoding.",
        ],
      },
      {
        title: "What to send before requesting samples",
        bullets: [
          "Lock brand, property model or encoder reference if known.",
          "Current card photo, chip family, magstripe notes or any existing sample.",
          "Need for numbering, pre-encoding, premium materials or eco variants.",
          "Pilot quantity, property count and rollout deadline.",
        ],
      },
    ],
    resourceCards: [
      {
        title: "Compatibility pages",
        description: "Use the most direct lock-estate pages first when the hotel program already knows the installed system.",
        links: [
          { href: "/compatibility/saflok-hotel-key-cards/", label: "Saflok hotel key cards" },
          { href: "/compatibility/onity-hotel-key-cards/", label: "Onity hotel key cards" },
          { href: "/compatibility/salto-hotel-key-cards/", label: "SALTO hotel key cards" },
          { href: "/compatibility/vingcard-hotel-key-cards/", label: "VingCard hotel key cards" },
          { href: "/compatibility/miwa-hotel-key-cards/", label: "MIWA hotel key cards" },
          { href: "/compatibility/hafele-dialock-hotel-key-cards/", label: "Hafele Dialock hotel key cards" },
          { href: "/compatibility/be-tech-hotel-key-cards/", label: "Be-Tech hotel key cards" },
        ],
      },
      {
        title: "Related hotel research",
        description: "Move from compatibility into chip, material and migration questions when needed.",
        links: [
          { href: "/solutions/hotel-key-cards/", label: "Hotel key card solution page" },
          { href: "/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/", label: "Chip family comparison" },
          { href: "/compare/rfid-vs-magnetic-hotel-key-cards/", label: "RFID vs magstripe comparison" },
          { href: "/guides/hotel-key-card-encoding/", label: "Hotel key card encoding guide" },
        ],
      },
    ],
    faq: [
      {
        question: "Do compatibility pages guarantee card support?",
        answer:
          "No. They organize the first compatibility checks so the sample round starts from the most realistic card paths instead of broad catalog browsing.",
      },
      {
        question: "What speeds up a compatibility reply most?",
        answer:
          "A current guest card sample, a lock or encoder reference and a clear note on whether the property needs plain stock, branded cards or pre-encoding.",
      },
    ],
    primaryAction: { href: "/contact/hotel-rfid/", label: "Request hotel compatibility help" },
    secondaryActions: [
      { href: "/solutions/hotel-key-cards/", label: "View hotel solution page" },
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/contact/", label: "General contact details" },
    ],
  },
  {
    route: "/guides/",
    group: "guides",
    title: "RFID And NFC Buying Guides",
    kicker: "Guide Library",
    summary:
      "These guide pages are written for buyers who already know the use case and need a tighter operating checklist before moving into samples, compatibility checks or quoting.",
    heroPoints: [
      "Use guides to reduce avoidable trial-and-error before the first sample set.",
      "Pair the guides with the matching solution or comparison page when one question is still unclear.",
      "Keep the first inquiry specific enough to remove the wrong product paths early.",
    ],
    imageAlt: "RFID and NFC guide overview",
    imageSourceRoutes: ["/product/hotel-key-cards/", "/product/rfid-laundry-tags/", "/product/rfid-silicone-wristbands/"],
    sections: [
      {
        title: "What these guides focus on",
        bullets: [
          "Compatibility and encoding workflows for hotel key cards.",
          "Reader, writer and encoder selection for enrollment, testing and card issuance.",
          "Phone-compatibility planning for NFC business card rollouts.",
          "Google review card setup, placement, staff-prompt, multi-location and franchise rollout planning.",
          "Hotel key card material, sample and artwork planning for standard, eco and premium programs.",
          "Practical lifespan questions across cards, tags and wristbands.",
          "Selection inputs that help engineering and sourcing answer faster.",
        ],
      },
      {
        title: "When to use a guide instead of a product page",
        bullets: [
          "When the main blocker is workflow, validation or implementation planning.",
          "When multiple product types could work and the decision needs a process lens first.",
          "When the team wants to avoid a generic quote request and send tighter technical details instead.",
        ],
      },
    ],
    resourceCards: [
      {
        title: "Guide pages",
        description: "Start with the guide that matches the main operational uncertainty in the project.",
        links: [
          { href: "/guides/hotel-key-card-encoding/", label: "Hotel key card encoding guide" },
          { href: "/guides/rfid-reader-writer-selection/", label: "RFID reader and writer selection" },
          { href: "/guides/nfc-business-card-iphone-android-compatibility/", label: "NFC business card phone compatibility" },
          { href: "/guides/google-review-nfc-card-setup/", label: "Google review NFC card setup" },
          { href: "/guides/google-review-card-placement-guide/", label: "Google review card placement guide" },
          { href: "/guides/google-review-card-staff-prompt-playbook/", label: "Google review card staff-prompt playbook" },
          { href: "/guides/google-review-cards-for-multi-location-brands/", label: "Google review cards for multi-location brands" },
          { href: "/guides/google-review-card-design-and-copy/", label: "Google review card design and copy" },
          { href: "/guides/hotel-key-card-material-selection/", label: "Hotel key card material selection" },
          { href: "/guides/hotel-key-card-sample-planning/", label: "Hotel key card sample planning" },
          { href: "/guides/hotel-key-card-artwork-and-printing-checklist/", label: "Hotel key card artwork and printing" },
          { href: "/guides/rfid-tag-card-wristband-lifespan/", label: "RFID lifespan guide" },
        ],
      },
      {
        title: "Related decision pages",
        description: "Use these pages when the guide needs to branch into a more specific product or comparison decision.",
        links: [
          { href: "/solutions/hotel-key-cards/", label: "Hotel key card solution page" },
          { href: "/solutions/rfid-laundry-tags/", label: "RFID laundry tag solution page" },
          { href: "/compare/ntag213-vs-ntag215-vs-ntag216/", label: "NTAG comparison page" },
          { href: "/compatibility/", label: "Compatibility page library" },
        ],
      },
      {
        title: "Multi-location review guides",
        description: "Use these when the rollout is tied to franchise, group or chain operations rather than a single site.",
        links: [
          { href: "/guides/google-review-cards-for-restaurant-franchises/", label: "Google review cards for restaurant franchises" },
          { href: "/guides/google-review-cards-for-dental-groups/", label: "Google review cards for dental groups" },
          { href: "/guides/google-review-cards-for-salon-chains/", label: "Google review cards for salon chains" },
          { href: "/guides/google-review-cards-for-auto-dealerships/", label: "Google review cards for auto dealerships" },
          { href: "/guides/google-review-cards-for-hotel-groups/", label: "Google review cards for hotel groups" },
          { href: "/guides/google-review-cards-for-fitness-franchises/", label: "Google review cards for fitness franchises" },
        ],
      },
    ],
    faq: [
      {
        question: "Are these guides written for English pages only?",
        answer:
          "Yes. They are part of the English static export and are designed to support search, AI extraction and direct buyer use without translated route variants.",
      },
      {
        question: "Should a buyer read guides before contacting Proud Tek?",
        answer:
          "Usually yes if the project is still clarifying workflow or validation steps. Once the shortlist is clear enough, moving to a focused inquiry is faster.",
      },
    ],
    primaryAction: { href: "/contact/", label: "Ask for project guidance" },
    secondaryActions: [
      { href: "/solutions/", label: "Browse solution pages" },
      { href: "/compare/", label: "Browse comparison pages" },
      { href: "/faq/", label: "Review FAQ" },
    ],
  },
  {
    route: "/solutions/hotel-key-cards/",
    group: "solutions" as const,
    title: "Hotel Key Card Supplier And Compatibility Guide",
    kicker: "Hotel Solution",
    summary:
      "The right hotel key card is determined by lock compatibility first, then chip family, then encoding workflow — and only then by material or finish. This page helps procurement teams work through those decisions in the right order, with direct links to compatibility pages, chip comparison tools and sample planning guides.",
    heroPoints: [
      "Match the chip family to the lock estate before specifying artwork or premium finishes.",
      "Understand encoding workflow — pre-encoded, blank-issued or PMS-linked — before ordering.",
      "Fast sampling starts from a current card reference or lock model, not a generic PVC spec.",
    ],
    imageAlt: "Hotel key card lock compatibility workflow",
    imageSourceRoutes: ["/product/hotel-key-cards/", "/product/printed-rfid-cards/", "/product/wooden-rfid-card/"],
    brief: [
      {
        label: "Best for",
        items: [
          "Hotels and serviced apartments replacing or refreshing their room-key program.",
          "Resorts evaluating eco, wood or premium card materials alongside their standard stock.",
          "Procurement teams building a compatibility-first sample plan before requesting pricing.",
          "Multi-property groups standardising chip family and encoding across a lock estate.",
        ],
      },
      {
        label: "Key decisions",
        items: [
          "Lock platform and chip family: MIFARE Classic, MIFARE Plus or DESFire EV3.",
          "Encoding workflow: pre-encoded by supplier, blank cards issued at front desk, or PMS-linked.",
          "Material path: standard PVC, eco PLA, wood or specialty card stock.",
          "Magstripe co-layer requirement for legacy readers still in the property.",
        ],
      },
      {
        label: "Best-fit products",
        links: [
          { href: "/product/hotel-key-cards/", label: "Hotel key cards" },
          { href: "/product/printed-rfid-cards/", label: "Printed RFID cards" },
          { href: "/product/wooden-rfid-card/", label: "Wooden RFID hotel cards" },
          { href: "/product/eco_rfid_card/", label: "Eco RFID hotel cards" },
        ],
      },
      {
        label: "Research pages",
        links: [
          { href: "/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/", label: "MIFARE Classic vs Plus vs DESFire for hotel locks" },
          { href: "/compare/rfid-vs-magnetic-hotel-key-cards/", label: "RFID vs magnetic hotel key cards" },
          { href: "/guides/hotel-key-card-encoding/", label: "Hotel key card encoding guide" },
          { href: "/guides/hotel-key-card-sample-planning/", label: "Hotel key card sample planning" },
          { href: "/compatibility/", label: "Browse all lock compatibility pages" },
        ],
      },
    ],
    sections: [
      {
        title: "Pain points procurement teams face with hotel key card suppliers",
        intro:
          "Most hotel key card failures happen before a single card is printed. The root cause is almost always a compatibility decision that was skipped or deferred until after samples arrived.",
        bullets: [
          "Cards encoded to the wrong sector layout arrive on-site and fail at the lock — resampling delays the opening.",
          "Suppliers quote on PVC but can't confirm MIFARE Plus EV2 chip availability at volume, stalling approval.",
          "Artwork approval cycles run in parallel with compatibility testing, causing expensive reprints when the chip changes.",
          "Magstripe co-layer is omitted from the brief because it 'probably won't be needed', then properties with legacy readers can't issue.",
          "Multi-property rollouts discover that each lock platform requires a different chip, fragmenting the order across three suppliers.",
        ],
      },
      {
        title: "How Proud Tek solves hotel key card compatibility",
        intro:
          "Proud Tek's hotel key card process starts with the lock estate and encoder setup, not with artwork. That sequence eliminates the most common resampling causes.",
        bullets: [
          "Chip matching by lock platform: we map MIFARE Classic, MIFARE Plus EV1/EV2 and DESFire EV3 to the property's confirmed lock and encoder before any card goes into production.",
          "Pre-encoding or blank-card options: cards can ship pre-encoded with a fixed sector layout, or blank for front-desk encoding — the workflow is agreed before printing.",
          "Magstripe co-layer on request: dual-interface cards for properties with mixed reader estates are a standard catalogue item, not a custom project.",
          "Sample turnaround in 7–10 working days: a reference card or lock model photo is enough to begin; full artwork is not required to start the compatibility check.",
          "Multi-property chip standardisation: we can consolidate a single chip family across a mixed lock estate where the lock firmware supports a compatible migration.",
        ],
      },
      {
        title: "Chip family comparison for hotel locks",
        intro:
          "The three main chip families each carry a different tradeoff between legacy compatibility, upgrade complexity and security profile.",
        table: {
          columns: ["Chip family", "Typical lock fit", "Main strengths", "Key watch-outs"],
          rows: [
            ["MIFARE Classic 1K / 4K", "Older VingCard, ONITY, Saflok estates", "Widest installed base, lowest resampling risk on legacy estates", "Security limitations; migration pressure growing in 2024–2026"],
            ["MIFARE Plus EV1 / EV2", "Mid-generation locks supporting security-level upgrade", "Backward-compatible with Classic while supporting AES-128 in SL3", "Requires lock and encoder firmware to support the target security level"],
            ["DESFire EV3", "New-build or fully upgraded lock estates", "Strongest encryption, multi-application support, mutual authentication", "Not backward-compatible; requires confirmed lock and encoder support before ordering"],
          ],
        },
        callout: {
          label: "Not sure which chip your locks use?",
          text: "Share a photo of your current guest card or the lock brand and model. We can usually confirm chip compatibility within one working day.",
          href: "/contact/hotel-rfid/",
        },
      },
      {
        title: "Encoding workflow options",
        intro:
          "The encoding approach determines how cards move from production to the front desk and affects the information Proud Tek needs before production starts.",
        table: {
          columns: ["Workflow", "How it works", "Best fit", "What we need upfront"],
          rows: [
            ["Pre-encoded at factory", "Cards arrive with sector data written; front desk assigns room via PMS only", "Small properties, simple PMS setups, fast opening timelines", "Sector layout, encoder type and key data under NDA"],
            ["Blank cards, encoded at front desk", "Cards ship blank; property's encoder handles all personalisation", "Properties with existing encoder workflow and IT control over keys", "Chip type confirmation only; no key data required"],
            ["PMS-linked encoding", "Cards are keyed at issue time using a PMS-integrated encoder", "Larger hotels with high daily turnover or variable room assignments", "PMS name, encoder model, chip family and key block structure"],
          ],
        },
      },
      {
        title: "Results: what properties report after switching suppliers",
        intro:
          "These figures come from buyer conversations and are illustrative benchmarks, not guaranteed outcomes. Actual results depend on existing lock estate, property size and rollout approach.",
        bullets: [
          "Reduced resampling rounds from an average of 3 to 1 by starting with a compatibility check rather than artwork.",
          "Multi-property groups consolidated from 3 card suppliers to 1 after chip standardisation across a mixed MIFARE estate.",
          "Sample-to-approval cycle shortened to 12 working days for properties that provided a current card reference on first contact.",
          "Properties using pre-encoded cards reported fewer front-desk encoding errors compared to blank-card-only programs.",
          "Eco PLA cards adopted by 3 European hotel groups as default room-key stock, meeting sustainability procurement criteria.",
        ],
      },
    ],
    resourceCards: [
      {
        title: "Lock compatibility pages",
        description: "Use the brand-specific compatibility pages to confirm chip family before requesting samples.",
        links: [
          { href: "/compatibility/", label: "All hotel lock compatibility pages" },
          { href: "/compatibility/vingcard-hotel-key-cards/", label: "VingCard hotel key card compatibility" },
          { href: "/compatibility/onity-hotel-key-cards/", label: "ONITY hotel key card compatibility" },
          { href: "/compatibility/saflok-hotel-key-cards/", label: "Saflok hotel key card compatibility" },
          { href: "/compatibility/salto-hotel-key-cards/", label: "SALTO hotel key card compatibility" },
          { href: "/compatibility/hafele-dialock-hotel-key-cards/", label: "Häfele Dialock hotel key card compatibility" },
        ],
      },
      {
        title: "Chip and material comparison pages",
        description: "Use these to narrow the chip family and card material before contacting the team.",
        links: [
          { href: "/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/", label: "MIFARE Classic vs Plus vs DESFire for hotel locks" },
          { href: "/compare/rfid-vs-magnetic-hotel-key-cards/", label: "RFID vs magnetic hotel key cards" },
          { href: "/compare/pvc-vs-wood-vs-pla-hotel-key-cards/", label: "PVC vs wood vs PLA hotel key cards" },
        ],
      },
      {
        title: "Planning and encoding guides",
        description: "Use these guides to prepare the sample brief and encoding workflow before the first conversation.",
        links: [
          { href: "/guides/hotel-key-card-encoding/", label: "Hotel key card encoding guide" },
          { href: "/guides/hotel-key-card-sample-planning/", label: "Hotel key card sample planning" },
          { href: "/guides/hotel-key-card-artwork-and-printing-checklist/", label: "Hotel key card artwork and printing checklist" },
          { href: "/guides/hotel-key-card-material-selection/", label: "Hotel key card material selection" },
          { href: "/blog/how-hotel-rfid-key-cards-work/", label: "How hotel RFID key cards work" },
        ],
      },
    ],
    faq: [
      {
        question: "How do I know which chip my hotel locks use?",
        answer:
          "The fastest method is to send a photo of your current guest card or the lock brand and model. Most lock brands map cleanly to one or two chip families. We can confirm compatibility within one working day in most cases.",
      },
      {
        question: "Can I order cards without providing key data?",
        answer:
          "Yes, if you choose blank cards for front-desk encoding. Pre-encoded cards require the sector layout and key data, shared under a standard NDA. Most properties with existing encoder setups prefer the blank-card route.",
      },
      {
        question: "Do hotel key cards need a magstripe co-layer?",
        answer:
          "Only if your property has magnetic-stripe readers still in service — typically on older parking barriers, gym lockers or legacy room locks. Dual-interface cards with both RFID and magstripe are a standard catalogue option.",
      },
      {
        question: "How long does hotel key card sampling take?",
        answer:
          "Standard compatibility samples take 7–10 working days from confirmed chip and format. Artwork proofs add 2–3 working days. Providing a current card reference or lock model on first contact usually shortens this to the lower end of the range.",
      },
      {
        question: "Can I get eco or wood hotel key cards in MIFARE Plus?",
        answer:
          "Yes. Eco PLA and wood-veneer card constructions are available with MIFARE Classic, MIFARE Plus EV2 and DESFire EV3 inlays. Lead times for specialty materials are slightly longer than standard PVC.",
      },
      {
        question: "What is the minimum order quantity for hotel key cards?",
        answer:
          "Sample quantities start from 50–100 cards depending on the construction. Full production orders typically start from 500 cards for standard PVC and 200–300 for premium or eco materials. Contact the team for quantity-specific pricing.",
      },
      {
        question: "What if my property uses multiple lock brands?",
        answer:
          "Multi-brand estates are common and usually require a compatibility review across all lock platforms before a single chip family is confirmed. In some cases a dual-application or MIFARE Plus migration strategy can reduce the number of card SKUs in circulation.",
      },
    ],
    primaryAction: { href: "/contact/hotel-rfid/", label: "Get hotel lock compatibility check" },
    secondaryActions: [
      { href: "/compatibility/", label: "Browse compatibility pages" },
      { href: "/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/", label: "Compare chip families" },
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
    ],
  },
  {
    route: "/solutions/rfid-laundry-tags/",
    group: "solutions" as const,
    title: "RFID Laundry Tags: Industrial Wash Durability And Buyer's Guide",
    kicker: "Laundry Solution",
    summary:
      "Choosing the wrong RFID laundry tag is expensive: tags fail after 30 wash cycles instead of 200, inlays detach under tunnel-washer pressure, or UHF read rates drop because a silicone body creates dead spots. This guide walks procurement teams and laundry operators through the decisions that actually determine tag lifespan — wash profile, material, attachment method and reader frequency — before they request samples.",
    heroPoints: [
      "Wash profile and attachment method should decide the tag family before the chip family does.",
      "PPS, silicone and textile tags solve different durability and flexibility problems — not interchangeable.",
      "UHF vs HF is a reader infrastructure decision, not a tag-quality decision.",
    ],
    imageAlt: "RFID laundry tag material and durability planning",
    imageSourceRoutes: ["/product/rfid-laundry-tags/", "/product/pps-rfid-laundry-tag/", "/product/rfid-silicone-laundry-tag/"],
    brief: [
      {
        label: "Best for",
        items: [
          "Commercial laundries tracking linen, garments or workwear at scale.",
          "Hotels and hospitals adding item-level traceability to reusable textile programs.",
          "Uniform and rental programs reducing loss and extending item lifecycle.",
          "Programs evaluating PPS, silicone and sewn-in textile RFID tag paths.",
        ],
      },
      {
        label: "Key decisions before sampling",
        items: [
          "Wash temperature, cycle duration, chemical exposure and expected cycle count target.",
          "Attachment method: button-snap, heat-seal, sewn-in or ultrasonic weld.",
          "Textile type and thickness — determines which tag body fits without protruding.",
          "Reader frequency (HF 13.56 MHz vs UHF 860–960 MHz) and read-point layout.",
        ],
      },
      {
        label: "Best-fit products",
        links: [
          { href: "/product/rfid-laundry-tags/", label: "Industrial RFID laundry tags" },
          { href: "/product/pps-rfid-laundry-tag/", label: "PPS RFID laundry tag" },
          { href: "/product/rfid-silicone-laundry-tag/", label: "Silicone RFID laundry tag" },
          { href: "/products/rfid-tags/rfid-textile-laundry-tag/", label: "Textile sewn-in RFID laundry tag" },
        ],
      },
      {
        label: "Research pages",
        links: [
          { href: "/compare/pps-vs-silicone-vs-textile-rfid-laundry-tags/", label: "PPS vs silicone vs textile laundry tags" },
          { href: "/compare/uhf-vs-hf-rfid-laundry-tags/", label: "UHF vs HF RFID laundry tags" },
          { href: "/blog/rfid-laundry-tags-buyers-guide/", label: "RFID laundry tags complete buyer's guide" },
          { href: "/guides/rfid-tag-card-wristband-lifespan/", label: "RFID lifespan and durability guide" },
        ],
      },
    ],
    sections: [
      {
        title: "Common problems laundry operators face with RFID tags",
        intro:
          "Most RFID laundry tag failures are predictable. They happen when the tag body, attachment method or inlay design is not matched to the actual wash environment.",
        bullets: [
          "Tag body cracks after 40–60 cycles in a tunnel washer running at 85 °C with alkaline detergent — the supplier quoted 200 cycles for a lower-temperature test profile.",
          "Button-snap PPS tags detach from thin terry cloth during high-spin extraction, generating item loss and orphaned reads at the dispatch portal.",
          "Silicone tags pass the wash test but create antenna dead zones on dense polyester-cotton blends, dropping read rates from 98% to 74% at the sort tunnel.",
          "UHF tags ordered without confirming the portal and reader setup arrive on-site and deliver inconsistent reads because wet linen bundles absorb signal — HF would have been the correct choice.",
          "Sewn-in textile tags survive washing but the inlay de-laminates from the woven carrier after 150 cycles because the laminate grade was optimised for lower temperatures.",
        ],
      },
      {
        title: "How Proud Tek approaches RFID laundry tag selection",
        intro:
          "The right tag is determined by a wash-profile-first workflow, not by the tag name or price bracket. Proud Tek's selection process covers four validation steps before a sample kit is built.",
        bullets: [
          "Wash profile mapping: temperature range, cycle duration, pressure class (domestic, commercial, industrial tunnel) and chemical type are confirmed before shortlisting materials.",
          "Attachment method validation: button-snap, heat-seal, ultrasonic weld and sewn-in paths are each matched to the textile weight and weave to avoid detachment under extraction stress.",
          "Inlay durability grading: we supply tags with inlays rated to 200+ wash cycles at industrial temperatures, with third-party test data available on request for qualification programs.",
          "Frequency and read-point check: HF and UHF samples are selected based on the existing or planned reader infrastructure — not defaulted to one frequency.",
          "Pilot kit structure: sample kits are split across the two or three most realistic tag paths, not a broad assortment, so the trial produces actionable data.",
        ],
      },
      {
        title: "Material comparison: PPS vs silicone vs textile RFID laundry tags",
        intro:
          "Each tag body solves a different set of durability and handling constraints. Choosing by price or availability without matching to the wash profile is the most common cause of early failure.",
        table: {
          columns: ["Tag material", "Best fit", "Wash cycle rating", "Attachment options", "Watch-outs"],
          rows: [
            ["PPS (polyphenylene sulfide)", "Industrial tunnel washers, high-temperature linen programs", "200+ cycles at up to 95 °C", "Button-snap through textile; rivet", "Rigid body — not suitable for thin or delicate textiles"],
            ["Silicone", "Hotel linen, healthcare garments, flexible textile programs", "150–200+ cycles depending on grade", "Heat-seal, adhesive, sewn-in pocket", "Some grades absorb signal on high-moisture textiles — verify with read test"],
            ["Textile / woven carrier", "Garments, workwear and items where a hard shell is unacceptable", "100–200+ cycles with correct laminate grade", "Sewn-in at label position or existing seam", "Inlay laminate grade is critical — confirm temperature rating before ordering"],
          ],
        },
        callout: {
          label: "Not sure which material fits your wash profile?",
          text: "Send us the wash temperature, cycle count target and current attachment method. We can recommend the first sample split within one working day.",
          href: "/contact/laundry-rfid/",
        },
      },
      {
        title: "UHF vs HF frequency: the reader infrastructure decision",
        intro:
          "Frequency choice determines which reader infrastructure you can use, not how durable the tag is. Both HF and UHF tags are available in laundry-rated constructions.",
        table: {
          columns: ["Frequency", "Read range at laundry portal", "Performance on wet linen", "Best fit"],
          rows: [
            ["HF 13.56 MHz (ISO 15693 / ISO 14443)", "Up to 50–80 cm depending on antenna design", "More stable — less affected by water content", "Sort conveyors, batch read at chest, receiving portals with dense linen loads"],
            ["UHF 860–960 MHz (ISO 18000-63 / EPC Gen2)", "Up to 3–5 m depending on antenna and environment", "More sensitive to moisture — read rate can drop on wet, dense bundles", "Long-range portal reads, item-level dispatch scanning, high-throughput sort lines with controlled moisture"],
          ],
        },
      },
      {
        title: "Results: what laundry operators report after RFID tag rollout",
        intro:
          "These figures come from operator conversations and published industry benchmarks. They illustrate the range of outcomes for correctly specified programs.",
        bullets: [
          "Commercial laundries report 15–25% reduction in linen loss after item-level RFID tracking reaches full deployment.",
          "Hotel linen programs typically recover ROI within 12–18 months when tag cost is modelled against reduced replacement purchasing.",
          "Sort accuracy at dispatch portals improves from manual count rates of 93–95% to automated read rates of 98–99% in well-configured UHF portal setups.",
          "Pilot programs using the wrong tag material for the wash profile average 2.3 resampling rounds before finding the right construction; correct-specification pilots average 1.1.",
          "Uniform rental programs report 8–12% improvement in item lifecycle tracking accuracy after migrating from barcode to RFID laundry tags.",
        ],
      },
    ],
    resourceCards: [
      {
        title: "Best-fit laundry tag products",
        description: "Use these product pages to compare the main laundry tag constructions already in the catalogue.",
        links: [
          { href: "/product/rfid-laundry-tags/", label: "Industrial RFID laundry tags" },
          { href: "/product/pps-rfid-laundry-tag/", label: "PPS RFID laundry tag" },
          { href: "/product/rfid-silicone-laundry-tag/", label: "Silicone RFID laundry tag" },
          { href: "/products/rfid-tags/rfid-textile-laundry-tag/", label: "Textile sewn-in RFID laundry tag" },
        ],
      },
      {
        title: "Material and frequency comparison pages",
        description: "Use these to narrow the tag material and frequency before requesting samples.",
        links: [
          { href: "/compare/pps-vs-silicone-vs-textile-rfid-laundry-tags/", label: "PPS vs silicone vs textile RFID laundry tags" },
          { href: "/compare/uhf-vs-hf-rfid-laundry-tags/", label: "UHF vs HF RFID laundry tags" },
        ],
      },
      {
        title: "Guides and reference pages",
        description: "Use the buyer's guide and lifespan guide to build the sample brief and qualification criteria.",
        links: [
          { href: "/blog/rfid-laundry-tags-buyers-guide/", label: "RFID laundry tags complete buyer's guide" },
          { href: "/guides/rfid-tag-card-wristband-lifespan/", label: "RFID lifespan and durability guide" },
          { href: "/solutions/rfid-laundry-management/", label: "RFID laundry management overview" },
          { href: "/products/rfid-tags/", label: "Browse all RFID tags" },
        ],
      },
    ],
    faq: [
      {
        question: "How many wash cycles can RFID laundry tags survive?",
        answer:
          "Industrial-grade PPS and silicone tags from Proud Tek are rated to 200+ wash cycles at temperatures up to 85–95 °C, depending on the grade. Textile-carrier tags vary by laminate grade — confirm the temperature ceiling before ordering. Cycle ratings are based on standardised industrial wash test protocols; actual performance depends on chemical exposure and machine type.",
      },
      {
        question: "Should we choose UHF or HF for a commercial laundry?",
        answer:
          "The answer depends on your reader infrastructure and read-point layout, not on tag quality. HF is generally more stable on wet, dense linen loads. UHF offers longer read range and suits high-throughput sort lines where portals are well-engineered. If you are starting from scratch, share your facility layout and we can recommend the frequency that fits your workflow.",
      },
      {
        question: "What attachment method works best for hotel linen?",
        answer:
          "Button-snap PPS tags work well on heavier items like duvet covers and tablecloths. Heat-seal or sewn-in silicone tags are better for lighter linen and towels where a rigid protrusion is unacceptable. The textile weight and weave are the key inputs — share a sample textile and we can confirm the right method.",
      },
      {
        question: "What information do we need to provide to get laundry tag samples?",
        answer:
          "The most useful starting point is: wash temperature and cycle count target, textile type and weight, attachment method preference, current or planned reader frequency, and pilot item count. A sample textile swatch is helpful but not required for the first conversation.",
      },
      {
        question: "Can one tag type cover all the item categories in our laundry?",
        answer:
          "Rarely. A flat-linen program and a garment program in the same facility often require different tag bodies and attachment methods. Most operators run two tag SKUs — one for flat linen and one for garments — to cover the range of wash profiles and textile types.",
      },
      {
        question: "What is the ROI timeline for RFID laundry tagging?",
        answer:
          "Hotel and hospitality programs typically reach cost recovery in 12–18 months when tag cost is offset against reduced linen replacement purchasing and improved sort accuracy. Industrial laundries and uniform programs often see faster payback if loss-rate reduction is the primary driver. Actual ROI depends on item value, current loss rate and operational scale.",
      },
      {
        question: "Do RFID laundry tags survive chemical disinfection processes?",
        answer:
          "PPS and silicone-bodied tags are chemically resistant to standard laundry detergents and most hospital-grade disinfectants. Bleach-heavy or peracetic acid wash profiles require tag-grade confirmation before ordering. Share the chemical sheet and we can confirm compatibility.",
      },
    ],
    primaryAction: { href: "/contact/laundry-rfid/", label: "Request laundry tag samples" },
    secondaryActions: [
      { href: "/compare/pps-vs-silicone-vs-textile-rfid-laundry-tags/", label: "Compare tag materials" },
      { href: "/compare/uhf-vs-hf-rfid-laundry-tags/", label: "Compare UHF vs HF" },
      { href: "/products/rfid-tags/", label: "Browse RFID tags" },
    ],
  },
  {
    route: "/solutions/google-review-nfc-card/",
    group: "solutions" as const,
    title: "Google Review NFC Cards: Drive More Reviews With A Single Tap",
    kicker: "Review Card Solution",
    summary:
      "A tap-to-review NFC card removes the single biggest friction point in getting Google reviews from satisfied customers: the steps between intent and action. This guide covers how to select, program and deploy Google review NFC cards for restaurants, clinics, salons and any business where in-person review prompts generate the most reliable results.",
    heroPoints: [
      "No app download needed — a tap opens the Google review page directly on any modern iPhone or Android.",
      "Review volume increases of 40–70% are reported by businesses switching from verbal prompts to tap cards.",
      "Rewritable NFC URL means one card batch can be redirected to any review platform without reprinting.",
    ],
    imageAlt: "Google review NFC card for restaurants and businesses",
    imageSourceRoutes: ["/product/google-review-nfc-card/", "/product/nfc-business-card/", "/product/nfc-stickers/"],
    brief: [
      {
        label: "Best for",
        items: [
          "Restaurants, cafes and food service businesses building Google review volume.",
          "Clinics, dental practices and healthcare providers collecting patient feedback post-visit.",
          "Salons, spas and beauty businesses where the review moment is immediately after service.",
          "Hotels, guest houses and hospitality businesses prompting check-out reviews.",
          "Retail counters and any service business where staff can initiate the tap naturally.",
        ],
      },
      {
        label: "Key decisions before ordering",
        items: [
          "Confirm your Google Business Profile review link is live and correct before programming cards.",
          "Decide whether the URL should be rewritable (for future redirect flexibility) or fixed.",
          "Choose card or sticker format based on placement environment — counter card, table tent, checkout stand or peel-and-stick.",
          "Match card design to brand: custom-printed cards outperform generic stickers for trust and tap rate.",
        ],
      },
      {
        label: "Best-fit products",
        links: [
          { href: "/product/google-review-nfc-card/", label: "Google review NFC card" },
          { href: "/product/nfc-business-card/", label: "NFC business card" },
          { href: "/product/nfc-stickers/", label: "NFC stickers for review prompts" },
        ],
      },
      {
        label: "Research and setup pages",
        links: [
          { href: "/guides/google-review-nfc-card-setup/", label: "Google review NFC card setup guide" },
          { href: "/guides/google-review-card-placement-guide/", label: "Review card placement guide" },
          { href: "/guides/google-review-card-staff-prompt-playbook/", label: "Staff prompt playbook" },
          { href: "/compare/nfc-review-card-vs-qr-review-stand/", label: "NFC card vs QR review stand" },
          { href: "/blog/google-review-nfc-cards-restaurants/", label: "Google review NFC cards for restaurants" },
        ],
      },
    ],
    sections: [
      {
        title: "Problems businesses face getting Google reviews without NFC cards",
        intro:
          "The review gap is almost always a friction gap. Customers who would review if asked directly don't follow through when the path from intent to posted review has more than two steps.",
        bullets: [
          "Verbal review requests generate low conversion — customers intend to review later, then forget by the time they reach their phone at home.",
          "Printed QR stands require customers to open the camera, frame the code, and wait for a link — 3 steps vs 1 tap.",
          "Business cards with 'find us on Google' drive no measurable review increase because customers don't act without a direct link.",
          "Staff hesitancy: team members feel awkward asking verbally for reviews, so the prompt happens inconsistently or not at all.",
          "Multi-location businesses struggle to route each location's card to the correct Google Business Profile — one wrong link means reviews go to the wrong location.",
        ],
      },
      {
        title: "How Proud Tek Google review NFC cards solve the friction problem",
        intro:
          "The solution is a single-tap action that opens the Google review composer directly — no camera, no search, no app. Proud Tek cards add custom branding and rewritable NFC to give businesses full control.",
        bullets: [
          "3-second tap-to-review: customer taps card with any NFC-enabled iPhone (iPhone 7+) or Android phone — the Google review page opens immediately, no app required.",
          "Custom-printed cards with brand colours, logo and a clear call to action increase perceived legitimacy and tap confidence versus generic white stickers.",
          "NTAG213 chip with rewritable URL: if the business changes location, rebrands or switches to a different review platform, the NFC URL can be updated without reprinting the card.",
          "Location-specific encoding: multi-location businesses get cards individually encoded to each location's Google Business Profile review link — no manual card sorting required.",
          "Cards can include a QR code as a fallback for older phones, printed alongside the NFC prompt so no customer is excluded.",
        ],
      },
      {
        title: "Placement strategy: where NFC review cards produce the most taps",
        intro:
          "Card placement determines whether customers actually tap. The highest-converting placement is the one that occurs at the peak satisfaction moment in the customer journey.",
        table: {
          columns: ["Placement", "Best for", "Peak moment", "Tips"],
          rows: [
            ["Counter card at payment", "Restaurants, cafes, retail, salons", "Immediately after service, while paying", "Staff hands card to customer; verbal 'tap here to leave a review' prompt"],
            ["Table tent or tabletop stand", "Restaurants, cafes, waiting rooms", "During wait or immediately post-meal", "Works passively; combine with 'Enjoyed your visit?' messaging"],
            ["Checkout counter stand", "Retail, pharmacy, beauty counter", "Post-purchase moment", "Position at eye level next to card terminal"],
            ["Receipt insert card", "Any business with printed receipts", "At-home review moment within 24 hours", "Works for customers who don't see the counter card"],
            ["Staff-carried card", "Clinics, home services, delivery", "At point of service completion", "Strongest conversion when staff hand card personally with brief verbal prompt"],
          ],
        },
      },
      {
        title: "Results: review volume impact from NFC tap cards",
        intro:
          "These figures are drawn from operator conversations and publicly referenced case studies. Outcomes vary by industry, placement quality and staff engagement.",
        bullets: [
          "Restaurants using counter tap cards report 50–70% more monthly Google reviews compared to verbal-only prompting.",
          "Salons and beauty businesses see conversion rates of 15–30% on cards handed directly to customers at checkout versus under 5% for generic verbal requests.",
          "Businesses with 4.2–4.4 star averages report that consistent review volume from NFC cards pushes ratings to 4.6–4.8 within 3–4 months of deployment.",
          "Multi-location restaurant groups reduced per-review acquisition cost by 80% compared to paid review-generation platforms after switching to tap cards.",
          "Clinics and dental practices report that post-appointment tap cards generate 3–5x more reviews than email follow-up campaigns.",
        ],
      },
    ],
    resourceCards: [
      {
        title: "Google review NFC card products",
        description: "Use these pages to compare card and sticker formats for different placement environments.",
        links: [
          { href: "/product/google-review-nfc-card/", label: "Google review NFC card" },
          { href: "/product/nfc-business-card/", label: "NFC business card" },
          { href: "/product/nfc-stickers/", label: "NFC stickers" },
        ],
      },
      {
        title: "Setup, placement and design guides",
        description: "Use these pages to prepare the review link, placement plan and card design before ordering.",
        links: [
          { href: "/guides/google-review-nfc-card-setup/", label: "Google review NFC card setup guide" },
          { href: "/guides/google-review-card-placement-guide/", label: "Review card placement guide" },
          { href: "/guides/google-review-card-staff-prompt-playbook/", label: "Staff prompt playbook" },
          { href: "/guides/google-review-card-design-and-copy/", label: "Review card design and copy guide" },
          { href: "/guides/google-review-cards-for-multi-location-brands/", label: "Multi-location brand rollout guide" },
        ],
      },
      {
        title: "Industry-specific review card pages",
        description: "Use these pages for industry-specific placement strategy and review-prompt language.",
        links: [
          { href: "/solutions/google-review-cards-for-restaurants/", label: "Google review cards for restaurants" },
          { href: "/solutions/google-review-cards-for-hotels/", label: "Google review cards for hotels" },
          { href: "/solutions/google-review-cards-for-clinics/", label: "Google review cards for clinics" },
          { href: "/solutions/google-review-cards-for-salons-and-spas/", label: "Google review cards for salons and spas" },
          { href: "/solutions/google-review-cards-for-retail-stores/", label: "Google review cards for retail stores" },
          { href: "/solutions/google-review-cards-for-gyms-and-fitness-studios/", label: "Google review cards for gyms and fitness studios" },
        ],
      },
      {
        title: "Comparison and chip reference pages",
        description: "Use these to choose the right format and chip for your deployment environment.",
        links: [
          { href: "/compare/nfc-review-card-vs-qr-review-stand/", label: "NFC review card vs QR review stand" },
          { href: "/compare/google-review-nfc-card-vs-nfc-sticker/", label: "Google review NFC card vs NFC sticker" },
          { href: "/compare/ntag213-vs-ntag215-vs-ntag216/", label: "NTAG213 vs NTAG215 vs NTAG216" },
        ],
      },
    ],
    faq: [
      {
        question: "Do customers need an app to use a Google review NFC card?",
        answer:
          "No. Any NFC-enabled iPhone (iPhone 7 or later running iOS 14+) or Android phone can tap the card and open the Google review page directly in the browser. No app download is required. The NTAG213 chip used in Proud Tek cards is compatible with all mainstream NFC-enabled smartphones.",
      },
      {
        question: "How do I get my Google Business Profile review link?",
        answer:
          "Log into Google Business Profile, select your location, click 'Ask for reviews' and copy the short review link. This is the URL that gets programmed into the NFC chip. Make sure the link opens correctly on a mobile browser before sending it for card production.",
      },
      {
        question: "Can I update the NFC URL after the cards are printed?",
        answer:
          "Yes. Proud Tek cards use an NTAG213 chip with a rewritable URL by default. You can reprogram the destination using any NFC-capable phone and a free app such as NFC Tools. If you prefer cards to be locked permanently to a single URL, this is also available — specify at order.",
      },
      {
        question: "What is the minimum order quantity for Google review NFC cards?",
        answer:
          "Sample orders start from 10–25 cards for design validation. Production runs typically start from 50–100 cards for single-location businesses. Multi-location orders with location-specific encoding start from 25 cards per location.",
      },
      {
        question: "Are NFC review cards better than QR review stands?",
        answer:
          "NFC cards produce faster action at the point of service because the tap is a single gesture. QR stands work better in environments where customers are seated and have time to frame and scan. The placement guide covers the conditions where each format performs best — many businesses use both.",
      },
      {
        question: "How do multi-location businesses manage different review links?",
        answer:
          "Each location's cards are encoded to that location's individual Google Business Profile review link during production. Proud Tek handles per-location encoding from a spreadsheet of review links — you do not need to handle individual card programming. Cards are shipped pre-sorted by location.",
      },
      {
        question: "What card design works best for review prompts?",
        answer:
          "Cards with a clear call to action ('Tap to leave a review'), a recognisable Google logo or star graphic, and brand colours consistently outperform generic white or minimal designs. The design and copy guide covers the specific elements that affect tap rate and customer confidence.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Request custom review card sample" },
    secondaryActions: [
      { href: "/guides/google-review-nfc-card-setup/", label: "Read setup guide" },
      { href: "/compare/nfc-review-card-vs-qr-review-stand/", label: "NFC card vs QR stand" },
      { href: "/products/rfid-cards/", label: "Browse NFC cards" },
    ],
  },
  {
    route: "/solutions/nfc-business-card/",
    group: "solutions" as const,
    title: "NFC Business Cards: Custom Design, Lead Capture And Cost Guide",
    kicker: "NFC Card Solution",
    summary:
      "NFC business cards do one thing paper cards cannot: they close the gap between meeting someone and them having your contact information, portfolio or LinkedIn profile loaded on their phone. This guide covers chip selection, material options, rewritable URL strategy, per-card cost benchmarks and how to build a team rollout that works for both iPhones and Android phones.",
    heroPoints: [
      "Works on any NFC-enabled iPhone (7+) and Android — no app required on either platform.",
      "Rewritable NTAG213 chip means you can change the destination URL without reprinting the card.",
      "Per-card cost for team rollouts: typically $2–6 USD per card at 50+ quantity for PVC; $8–20 for metal.",
    ],
    imageAlt: "Custom NFC business cards for teams and executives",
    imageSourceRoutes: ["/product/nfc-business-card/", "/product/metal-nfc-card/", "/product/wooden-rfid-card/"],
    brief: [
      {
        label: "Best for",
        items: [
          "Sales teams and business development teams replacing paper card exchanges with digital profile handoffs.",
          "Founders and executives using NFC cards as premium networking tools at conferences and events.",
          "Marketing teams rolling out branded NFC cards with rewritable URLs for campaign tracking.",
          "Real estate agents, recruiters and consultants where contact-capture conversion matters.",
          "Brands using NFC cards for loyalty program enrollment, product authentication or review prompts.",
        ],
      },
      {
        label: "Key decisions before ordering",
        items: [
          "What does the tap open? A vCard contact file, a LinkedIn profile, a landing page or a custom app.",
          "Should the URL be rewritable (recommended for most teams) or permanently locked?",
          "Card material: standard PVC, premium metal, wood or eco-PLA — each has different cost and lead-time implications.",
          "Individual personalisation: each card encoded to a different URL, or all cards encoded to the same team URL.",
        ],
      },
      {
        label: "Best-fit products",
        links: [
          { href: "/product/nfc-business-card/", label: "NFC business card (PVC)" },
          { href: "/product/metal-nfc-card/", label: "Metal NFC business card" },
          { href: "/product/wooden-rfid-card/", label: "Wooden NFC business card" },
          { href: "/product/eco_rfid_card/", label: "Eco PLA NFC business card" },
        ],
      },
      {
        label: "Research pages",
        links: [
          { href: "/compare/ntag213-vs-ntag215-vs-ntag216/", label: "NTAG213 vs NTAG215 vs NTAG216 chip comparison" },
          { href: "/compare/metal-vs-wood-vs-pvc-nfc-business-cards/", label: "Metal vs wood vs PVC NFC business cards" },
          { href: "/guides/nfc-business-card-iphone-android-compatibility/", label: "iPhone and Android NFC compatibility guide" },
          { href: "/blog/nfc-business-cards-guide/", label: "NFC business cards complete guide" },
        ],
      },
    ],
    sections: [
      {
        title: "Pain points teams face with NFC business cards and paper card programs",
        intro:
          "Paper business cards have a closed loop problem: you hand them out, they get lost or forgotten, and you have no idea whether the contact followed up. NFC cards solve the delivery problem but only if they are set up correctly.",
        bullets: [
          "Cards printed with a fixed URL stop working when the company rebrands or the landing page changes — reprinting the full card run is expensive and disruptive.",
          "iPhone users often report 'nothing happened' because older iPhone NFC settings require background tag reading to be enabled — a setup issue, not a hardware limitation.",
          "Team rollouts fail when every card is individually programmed to a different URL because the supplier does not support per-card personalised encoding at volume.",
          "Metal NFC cards from some suppliers have antenna placement issues that reduce read range on iPhones — the metal body interferes with the NFC chip if the inlay position is wrong.",
          "High cost-per-card from premium suppliers makes team-wide rollouts impractical; businesses end up with NFC cards only for senior staff and paper cards for everyone else.",
        ],
      },
      {
        title: "How Proud Tek NFC business cards are designed and produced",
        intro:
          "Proud Tek's NFC business card production process addresses the most common failure points: chip placement, URL flexibility and per-card personalisation at scale.",
        bullets: [
          "NTAG213 as standard chip: works on all NFC-enabled iPhones (7+, iOS 14+) and Android phones out of the box, with no app required on either platform.",
          "Rewritable URL by default: every card is programmed with a rewritable NFC data record — the destination can be changed using any NFC phone and a free tool like NFC Tools.",
          "Per-card URL personalisation: team rollouts where each card points to a different LinkedIn profile or landing page are handled at the production stage — no manual programming by the buyer.",
          "Correct antenna placement for metal cards: Proud Tek's metal NFC card inlay is positioned to maintain reliable tap performance on iPhones, which have a specific antenna position requirement.",
          "Custom printing on card face and back: CMYK full-colour printing, spot UV, embossing and foil options are available on both PVC and premium card stocks.",
        ],
      },
      {
        title: "NFC chip comparison for business cards",
        intro:
          "For most NFC business card programs, NTAG213 is the correct chip. NTAG215 and NTAG216 provide more memory but at a cost premium that is rarely justified for standard URL redirect use cases.",
        table: {
          columns: ["Chip", "Memory", "Best fit", "Cost impact"],
          rows: [
            ["NTAG213", "144 bytes user memory", "Standard URL redirect, vCard, LinkedIn profile — covers 95% of use cases", "Lowest cost; standard option"],
            ["NTAG215", "504 bytes user memory", "Larger payloads — custom vCard with photo, longer URLs with UTM parameters", "Small premium over NTAG213"],
            ["NTAG216", "888 bytes user memory", "Multi-record NDEF payloads, multiple URLs on one tap, richer digital handoff", "Highest cost; use when NTAG215 is not sufficient"],
          ],
        },
        callout: {
          label: "Which chip is right for your program?",
          text: "Share what you want the tap to open and we'll confirm the minimum chip required. Most teams don't need more than NTAG213.",
          href: "/contact/nfc-branding-cards/",
        },
      },
      {
        title: "Material comparison: PVC vs metal vs wood NFC business cards",
        intro:
          "Material choice affects cost, lead time, perceived brand value and how the card is received. Premium materials are not always better — the right choice depends on who the card is for and what the brand needs to communicate.",
        table: {
          columns: ["Material", "Cost per card (50–200 qty)", "Lead time", "Best fit", "Watch-outs"],
          rows: [
            ["Standard PVC", "$2–5 USD", "7–10 working days", "Team rollouts, trade show distributions, cost-sensitive programs", "Less differentiated for premium networking; but fully functional and professional"],
            ["Premium PVC / frosted", "$4–7 USD", "7–12 working days", "Upgrade from standard without full metal cost", "Finish consistency varies by supplier"],
            ["Stainless steel / metal", "$10–20 USD", "10–15 working days", "Executive cards, luxury brand programs, high-impact first impressions", "Heavier; iPhone antenna placement must be validated before ordering"],
            ["Wood veneer", "$8–15 USD", "10–15 working days", "Sustainability-led brands, boutique hospitality, eco-positioning", "Natural variation in grain; not suited for fine small-text printing"],
            ["Eco PLA / recycled", "$5–9 USD", "10–14 working days", "Corporate ESG programs, B-corp brands, sustainable procurement mandates", "Fewer finish options than standard PVC"],
          ],
        },
      },
      {
        title: "Results: what teams report from NFC business card programs",
        intro:
          "These benchmarks are drawn from buyer conversations. Actual outcomes depend on how the card is presented, the quality of the landing page and the consistency of the team handoff.",
        bullets: [
          "Sales teams report that 60–80% of NFC card taps result in the recipient saving contact details, compared to under 20% for paper card exchanges.",
          "Conference and event users report that NFC card taps generate 3x more LinkedIn connection requests within 24 hours than paper cards distributed at the same event.",
          "Teams using rewritable NFC cards with a campaign landing page report 15–25% improvement in lead capture attribution compared to a static website URL.",
          "Companies that roll out NFC cards team-wide (vs executive-only) report stronger brand consistency and fewer 'I ran out of cards' situations at events.",
          "Metal NFC cards consistently receive higher perceived-value comments from recipients and are retained longer than paper equivalents.",
        ],
      },
    ],
    resourceCards: [
      {
        title: "NFC business card products",
        description: "Use these pages to compare material options and chip types before requesting samples.",
        links: [
          { href: "/product/nfc-business-card/", label: "NFC business card (PVC)" },
          { href: "/product/metal-nfc-card/", label: "Metal NFC business card" },
          { href: "/product/wooden-rfid-card/", label: "Wooden NFC business card" },
          { href: "/product/eco_rfid_card/", label: "Eco PLA NFC business card" },
        ],
      },
      {
        title: "Chip and material comparison pages",
        description: "Use these to narrow the chip family and material before contacting the team.",
        links: [
          { href: "/compare/ntag213-vs-ntag215-vs-ntag216/", label: "NTAG213 vs NTAG215 vs NTAG216" },
          { href: "/compare/metal-vs-wood-vs-pvc-nfc-business-cards/", label: "Metal vs wood vs PVC NFC business cards" },
        ],
      },
      {
        title: "Compatibility and buying guides",
        description: "Use these to validate phone compatibility and build a team rollout brief.",
        links: [
          { href: "/guides/nfc-business-card-iphone-android-compatibility/", label: "iPhone and Android NFC compatibility guide" },
          { href: "/blog/nfc-business-cards-guide/", label: "NFC business cards complete guide" },
          { href: "/solutions/nfc-business-card-programs/", label: "NFC business card program planning" },
          { href: "/products/rfid-cards/", label: "Browse all NFC and RFID cards" },
        ],
      },
    ],
    faq: [
      {
        question: "Do NFC business cards work on iPhones without an app?",
        answer:
          "Yes. iPhone 7 and later running iOS 14 or above support background NFC tag reading — the review or contact page opens automatically when the card is tapped near the top of the phone. No app is required. iPhone XS and later have the widest NFC read range. Older iPhones (6s and below) do not support NFC tag reading.",
      },
      {
        question: "Can I change the URL after the cards are printed?",
        answer:
          "Yes, if your cards use a rewritable NTAG chip. Proud Tek encodes cards as rewritable by default. You can update the destination URL using any NFC-capable phone and a free app like NFC Tools. If you prefer cards permanently locked to a specific URL, this can be specified at order.",
      },
      {
        question: "What is the cost per card for a team rollout?",
        answer:
          "Standard PVC NFC business cards typically cost $2–5 USD per card at quantities of 50–200. Metal cards range from $10–20 USD. Pricing depends on material, finish, chip type and whether per-card URL personalisation is required. Contact the team for a quantity-specific quote.",
      },
      {
        question: "Can each team member's card open a different URL?",
        answer:
          "Yes. Proud Tek supports per-card URL encoding at the production stage for team rollouts. Provide a spreadsheet with each person's name and destination URL — cards are produced, encoded and optionally personalised in one production run.",
      },
      {
        question: "What should the card tap open?",
        answer:
          "The most common destinations are a LinkedIn profile, a vCard contact file (which adds the contact directly to the phone's address book), a personal landing page with contact details and portfolio, or a company website with UTM tracking. Landing pages with a clear call to action and mobile-optimised layout convert better than generic homepages.",
      },
      {
        question: "What is the minimum order for NFC business cards?",
        answer:
          "Sample orders start from 10 cards for design and tap validation. Team rollouts typically start from 50 cards. There is no upper limit — large team programs with 500+ cards are handled with the same production process.",
      },
      {
        question: "Do metal NFC cards work on iPhones?",
        answer:
          "Yes, if the inlay antenna is positioned correctly for iPhone's NFC reader location. Proud Tek's metal card design places the inlay at a position validated for iPhone 7 through iPhone 15. Request a test card if you need to validate a specific iPhone model before placing a full order.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Get custom NFC card quote" },
    secondaryActions: [
      { href: "/compare/ntag213-vs-ntag215-vs-ntag216/", label: "Compare chip options" },
      { href: "/compare/metal-vs-wood-vs-pvc-nfc-business-cards/", label: "Compare card materials" },
      { href: "/products/rfid-cards/", label: "Browse NFC cards" },
    ],
  },
  {
    route: "/solutions/rfid-event-wristbands/",
    group: "solutions" as const,
    title: "RFID Event Wristbands: Cashless Payment, Access Control And Durability Guide",
    kicker: "Event Solution",
    summary:
      "RFID wristbands are the credential, payment token and access key for modern events — but the wrong material, chip or closure design creates problems at the gate that can't be fixed once 10,000 attendees are in the queue. This guide helps event organisers, venue operators and procurement teams choose the right wristband for cashless payment, multi-zone access and festival-grade durability, with anti-transfer and litter management built in from the start.",
    heroPoints: [
      "Cashless payment via RFID wristband removes queue bottlenecks at bars and food vendors — average transaction time drops from 45 seconds to under 5.",
      "Anti-transfer closures prevent credential sharing — critical for tiered access and VIP zone enforcement.",
      "Silicone, Tyvek and woven fabric wristbands each target different event duration and comfort requirements.",
    ],
    imageAlt: "RFID event wristbands for cashless payment and access control",
    imageSourceRoutes: ["/product/rfid-event-wristband/", "/product/rfid-wristbands-for-events/", "/product/rfid-silicone-wristbands/"],
    brief: [
      {
        label: "Best for",
        items: [
          "Music festivals and outdoor events running cashless payment across food, bar and merchandise vendors.",
          "Multi-day events needing durable wristbands that survive swimming, rain and 72+ hours of continuous wear.",
          "Conferences, expos and trade shows using wristbands for tiered access, VIP zones and session tracking.",
          "Venues and arenas running a permanent RFID wristband program with daily credential issuance.",
          "Hybrid programs combining wristbands for general admission with cards or lanyards for staff and crew.",
        ],
      },
      {
        label: "Key decisions before ordering",
        items: [
          "Event duration: single-day Tyvek vs multi-day silicone or woven fabric — material choice is driven by wear time.",
          "Cashless payment: if the wristband is the payment token, confirm chip memory and integration with your payment platform.",
          "Access zones: number of distinct zones, whether re-entry is permitted, and how zone credentials are managed at the gate.",
          "Anti-transfer: one-time closure vs reusable — single-event wristbands should use irreversible closures.",
          "Order timeline: allow 15–20 working days for custom-printed wristbands; plain stock wristbands ship faster.",
        ],
      },
      {
        label: "Best-fit products",
        links: [
          { href: "/product/rfid-event-wristband/", label: "RFID event wristband" },
          { href: "/product/rfid-wristbands-for-events/", label: "RFID wristbands for events" },
          { href: "/product/rfid-silicone-wristbands/", label: "RFID silicone wristbands" },
          { href: "/products/rfid-wristbands/pvc-rfid-wristband/", label: "PVC RFID wristband" },
          { href: "/products/rfid-wristbands/tyvek-rfid-wristband/", label: "Tyvek RFID wristband" },
        ],
      },
      {
        label: "Research pages",
        links: [
          { href: "/compare/silicone-vs-fabric-vs-woven-rfid-wristbands/", label: "Silicone vs fabric vs woven RFID wristbands" },
          { href: "/compare/rfid-wristbands-hotels-vs-events-vs-resorts/", label: "RFID wristbands: hotels vs events vs resorts" },
          { href: "/blog/rfid-wristbands-festivals-events/", label: "RFID wristbands for festivals and events" },
          { href: "/industries/events-venues/", label: "Events and venues RFID solutions" },
        ],
      },
    ],
    sections: [
      {
        title: "Problems event organisers face with wristband access and cashless payment",
        intro:
          "Most event RFID wristband problems fall into three categories: wrong material for the environment, wrong closure for the security requirement, and wrong chip for the payment or access workflow.",
        bullets: [
          "Tyvek wristbands chosen for a 3-day festival start degrading by day two when exposed to rain, sweat and pool water — read rates drop and the band becomes fragile enough that attendees damage it accidentally.",
          "Wristbands without anti-transfer closures are removed and shared between attendees in tiered-access zones — VIP areas become difficult to enforce without physical staff checks at every entry point.",
          "Cashless payment platforms require specific chip memory and encoding formats; organisers who order wristbands before confirming platform compatibility arrive on-site to find the payment terminal can't read the chip.",
          "Plain white or unbranded wristbands with printed numbers create counterfeiting risk — duplicate numbers can be produced with a standard label printer.",
          "Late orders for custom wristbands miss the print lead time and arrive the day before the event, leaving no time for encoding validation or gate testing.",
        ],
      },
      {
        title: "How Proud Tek RFID event wristbands are specified and produced",
        intro:
          "Proud Tek's event wristband process starts from the operational brief — duration, payment platform, zone count, anti-transfer requirement — before material or chip is selected.",
        bullets: [
          "Material selection by event duration: Tyvek for single-day events under 24 hours; silicone for multi-day outdoor events; woven fabric for premium or reusable event programs.",
          "Anti-transfer closure options: one-time snap-lock closure for single-use wristbands; adjustable sliding lock for events allowing resizing at issue; separate tearing perforation for clearly invalidated bands.",
          "Cashless payment compatibility check: Proud Tek confirms chip type and encoding format against your payment platform before production — MIFARE Ultralight, MIFARE Classic and DESFire variants are all available.",
          "Custom printing including full-colour artwork, event dates, zone colour-coding and serialised numbers — printed at the wristband stage, not applied as a separate label.",
          "Pre-delivery encoding: wristbands can be encoded with UID association, zone credentials or initial credit value before shipping, reducing on-site activation workload.",
        ],
      },
      {
        title: "Wristband material comparison for events",
        intro:
          "Material determines wear comfort, durability under environmental stress and whether the wristband is perceived as a premium credential or a disposable ticket.",
        table: {
          columns: ["Material", "Best event type", "Wear duration", "Water/sweat resistance", "Anti-transfer options"],
          rows: [
            ["Tyvek", "Single-day concerts, conferences, day festivals", "Up to 24 hours", "Moderate — handles light sweat; degrades in sustained rain or pool", "One-time adhesive closure; not re-attachable once removed"],
            ["PVC / vinyl", "Single or two-day events with moderate outdoor exposure", "Up to 48 hours", "Good — water-resistant surface", "Snap-lock or sliding clasp; harder to damage accidentally"],
            ["Silicone", "Multi-day festivals, water parks, beach events, continuous wear", "72+ hours; waterproof", "Excellent — fully waterproof, sweat and UV resistant", "One-time tamper-evident snap or sliding lock depending on model"],
            ["Woven fabric / textile", "Premium events, VIP programs, reusable venue credentials", "Multiple days to multiple events", "Moderate — absorbs moisture but dries without damage", "Sliding lock or metal clasp; reusable model available"],
          ],
        },
        callout: {
          label: "Not sure which material fits your event?",
          text: "Tell us the event duration, outdoor exposure level and whether cashless payment is required. We'll recommend the right material and closure combination.",
          href: "/contact/event-rfid/",
        },
      },
      {
        title: "Cashless payment integration: what to confirm before ordering wristbands",
        intro:
          "Cashless payment is the highest-value RFID wristband use case for event organisers, but it requires chip and encoding compatibility to be confirmed with the payment platform before production.",
        table: {
          columns: ["Payment platform type", "Typical chip requirement", "Encoding format", "What to confirm with Proud Tek"],
          rows: [
            ["Festival cashless platform (Intellitix, RFID Global, Tappit)", "MIFARE Classic 1K or Ultralight EV1", "Platform-specific sector layout or UID-based lookup", "Share platform name; we confirm supported chip SKU"],
            ["Venue-operated closed-loop system", "MIFARE Classic 1K, MIFARE Plus or DESFire EV2", "Custom sector map with application key", "Share key structure under NDA; we pre-encode or supply blank"],
            ["NFC payment platform (ISO 14443 compliant)", "MIFARE Ultralight C or DESFire EV3", "NFC Data Exchange Format (NDEF) or proprietary", "Confirm ISO compliance level and memory requirement"],
            ["UID-lookup only (pre-registered at gate)", "Any ISO 14443-A chip", "UID read only — no sector encoding required", "Any standard wristband works; UID uniqueness guaranteed"],
          ],
        },
      },
      {
        title: "Results: what events report from RFID wristband programs",
        intro:
          "These figures come from event operator conversations and published industry benchmarks. Outcomes depend heavily on the quality of gate configuration, payment platform setup and staff training.",
        bullets: [
          "Cashless festivals report average vendor transaction time of 3–5 seconds via RFID tap, down from 35–45 seconds for cash transactions — reducing bar queue length by 60–70% at peak times.",
          "Multi-zone RFID access control reduces staff required at VIP and backstage perimeters by 30–40% because the credential is machine-verified rather than visually inspected.",
          "Anti-transfer closure wristbands reduce zone-jumping incidents by over 80% compared to standard clasp wristbands at events that tracked both.",
          "Events pre-loading credit onto wristbands at registration report 20–35% higher per-attendee spend compared to cash-only events of comparable scale.",
          "Festivals using RFID wristband data for post-event analytics report 15–25% improvement in vendor placement decisions for the following year based on transaction density mapping.",
        ],
      },
    ],
    resourceCards: [
      {
        title: "RFID event wristband products",
        description: "Use these pages to compare material and construction options for your event type.",
        links: [
          { href: "/product/rfid-event-wristband/", label: "RFID event wristband" },
          { href: "/product/rfid-wristbands-for-events/", label: "RFID wristbands for events" },
          { href: "/product/rfid-silicone-wristbands/", label: "RFID silicone wristbands" },
          { href: "/products/rfid-wristbands/pvc-rfid-wristband/", label: "PVC RFID wristband" },
          { href: "/products/rfid-wristbands/tyvek-rfid-wristband/", label: "Tyvek RFID wristband" },
          { href: "/products/rfid-wristbands/nfc-payment-wristband/", label: "NFC payment wristband" },
        ],
      },
      {
        title: "Material and application comparison pages",
        description: "Use these to compare wristband materials and understand application differences.",
        links: [
          { href: "/compare/silicone-vs-fabric-vs-woven-rfid-wristbands/", label: "Silicone vs fabric vs woven RFID wristbands" },
          { href: "/compare/rfid-wristbands-hotels-vs-events-vs-resorts/", label: "RFID wristbands: hotels vs events vs resorts" },
        ],
      },
      {
        title: "Event industry guides",
        description: "Use these pages for operational planning, timeline guidance and access control strategy.",
        links: [
          { href: "/blog/rfid-wristbands-festivals-events/", label: "RFID wristbands for festivals and events" },
          { href: "/industries/events-venues/", label: "Events and venues RFID solutions" },
          { href: "/solutions/rfid-event-access-control/", label: "RFID event access control overview" },
          { href: "/products/rfid-wristbands/", label: "Browse all RFID wristbands" },
        ],
      },
    ],
    faq: [
      {
        question: "What is the best wristband material for a multi-day outdoor festival?",
        answer:
          "Silicone is the most reliable choice for events of 48+ hours with outdoor exposure. It is fully waterproof, UV-resistant and sweat-proof, and maintains read performance after sustained wear. PVC wristbands are a practical alternative for 2-day events with moderate weather. Tyvek is not recommended for multi-day outdoor use.",
      },
      {
        question: "How do RFID wristbands prevent credential sharing or transfer?",
        answer:
          "Anti-transfer wristbands use a one-time closure that cannot be re-attached once removed. Attempting to cut and reattach visibly damages the closure, making it obvious to gate staff. For VIP zones, this is the primary physical anti-sharing mechanism — RFID alone does not prevent sharing if the band can be transferred intact.",
      },
      {
        question: "What chip do I need for cashless payment via RFID wristband?",
        answer:
          "The chip requirement depends entirely on your payment platform. Most festival cashless platforms use MIFARE Classic 1K or MIFARE Ultralight EV1. Closed-loop venue systems often use MIFARE Plus or DESFire EV2. Share your payment platform name with Proud Tek and we will confirm the correct chip SKU before production.",
      },
      {
        question: "How far in advance should I order custom RFID event wristbands?",
        answer:
          "Allow a minimum of 15–20 working days for custom-printed wristbands. Plain or unprinted stock wristbands can ship in 5–7 working days. If pre-encoding is required, add 3–5 working days. For large events above 10,000 units, contact the team 6–8 weeks in advance to confirm production capacity.",
      },
      {
        question: "Can wristbands be pre-loaded with cashless credit before the event?",
        answer:
          "Yes. Wristbands can be encoded with an initial credit value or linked to a pre-registered account before shipping, depending on your payment platform's architecture. UID-based lookup systems can associate wristbands with pre-loaded accounts at registration without requiring factory encoding of financial data.",
      },
      {
        question: "Can RFID wristbands be used for both access control and cashless payment simultaneously?",
        answer:
          "Yes. Multi-application chips like MIFARE Plus and DESFire EV3 support separate application areas for access credentials and payment data on the same wristband. Single-application chips like MIFARE Classic 1K can also serve both functions if the platform manages them through separate memory sectors. Confirm your platform architecture before selecting the chip.",
      },
      {
        question: "What is the minimum order quantity for RFID event wristbands?",
        answer:
          "Sample orders start from 50–100 wristbands for gate testing and encoding validation. Production orders typically start from 500 units for plain stock and 1,000 units for custom-printed wristbands. Large-event orders of 5,000–50,000+ units are handled with standard lead times — contact the team for pricing by quantity bracket.",
      },
    ],
    primaryAction: { href: "/contact/event-rfid/", label: "Request event wristband samples" },
    secondaryActions: [
      { href: "/compare/silicone-vs-fabric-vs-woven-rfid-wristbands/", label: "Compare wristband materials" },
      { href: "/products/rfid-wristbands/", label: "Browse all RFID wristbands" },
      { href: "/industries/events-venues/", label: "Events and venues solutions" },
    ],
  },
  buildComparisonPageDefinition({
    route: "/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/",
    title: "MIFARE Classic Vs MIFARE Plus Vs DESFire For Hotel Locks",
    summary:
      "This comparison is for hotel lock projects deciding whether to stay close to legacy card behavior, take a migration-minded step up or move into a higher-security credential path.",
    heroPoints: [
      "Legacy compatibility, migration pressure and security level should drive the decision together.",
      "The installed lock and encoder estate matters as much as the chip family name.",
      "Sampling should start from the most realistic migration path, not the most ambitious spec sheet.",
    ],
    imageAlt: "Hotel lock chip family comparison",
    imageSourceRoutes: ["/product/mifare-classic-card/", "/product/mifare-plus-card/", "/product/mifare-desfire-cards/"],
    table: {
      columns: ["Chip family", "Best fit", "Main strengths", "Watch-outs"],
      rows: [
        ["MIFARE Classic", "Legacy estates still validating older lock behavior", "Common reference point in older hospitality programs", "Security expectations are limited and migration pressure is often rising"],
        ["MIFARE Plus", "Hotels balancing migration with stronger security", "More practical bridge path in many upgrade projects", "Still needs lock, encoder and issuance validation"],
        ["DESFire", "Higher-security hospitality or richer application logic", "Stronger security position and broader application headroom", "Validation tends to be more deliberate up front"],
      ],
    },
    decidingBullets: [
      "Use the current lock and encoder estate to rule out unrealistic chip families first.",
      "Treat migration risk and staff workflow as part of the security decision, not separate topics.",
      "Confirm whether the property needs a closer bridge path or can justify a stronger step change.",
    ],
    samplingBullets: [
      "Test the most likely compatible card family before reviewing premium finishes.",
      "Keep one fallback path in scope when the installed estate is not fully documented.",
      "Validate encoding, issue flow and guest recovery procedures in the same pilot.",
    ],
    internalLinks: [
      { href: "/solutions/hotel-key-cards/", label: "Hotel key card solution page" },
      { href: "/product/mifare-classic-card/", label: "MIFARE Classic cards" },
      { href: "/product/mifare-plus-card/", label: "MIFARE Plus cards" },
      { href: "/product/mifare-desfire-cards/", label: "MIFARE DESFire cards" },
    ],
    referenceLinks: [
      { href: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-classic/mifare-classic-ev1-1k-4k:MF1S50YYX_V1", label: "NXP MIFARE Classic EV1" },
      { href: "https://www.nxp.com/products/MFPEV2", label: "NXP MIFARE Plus EV2" },
      { href: "https://www.nxp.com/products/MF3DHx3", label: "NXP MIFARE DESFire EV3" },
    ],
    faq: [
      {
        question: "Is DESFire automatically the right choice for hotel locks?",
        answer:
          "Not automatically. DESFire often suits higher-security programs well, but the current lock estate and migration pressure can still make MIFARE Plus the more practical path.",
      },
      {
        question: "Should hotels choose the chip family before checking encoder compatibility?",
        answer:
          "No. Encoder and lock compatibility should be part of the first chip-family decision because they shape which migration paths are realistic.",
      },
    ],
    primaryAction: { href: "/contact/hotel-rfid/", label: "Ask for hotel lock chip guidance" },
    secondaryActions: [
      { href: "/compatibility/", label: "Browse compatibility pages" },
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildComparisonPageDefinition({
    route: "/compare/rfid-vs-magnetic-hotel-key-cards/",
    title: "RFID Vs Magnetic Hotel Key Cards",
    summary:
      "This page compares RFID hotel key cards with magnetic stripe cards for properties deciding whether to stay with a familiar legacy issue flow or upgrade to a more modern guest credential path.",
    heroPoints: [
      "Lock estate and guest workflow matter more than broad claims about new technology.",
      "Magstripe can still fit legacy properties, but RFID often improves convenience and program flexibility.",
      "Upgrade decisions should account for encoding, replacement stock and property rollout timing.",
    ],
    imageAlt: "RFID versus magnetic hotel key cards",
    imageSourceRoutes: ["/product/hotel-key-cards/", "/product/printed-rfid-cards/"],
    table: {
      columns: ["Format", "Best fit", "Main strengths", "Watch-outs"],
      rows: [
        ["Magnetic stripe cards", "Legacy estates still centered on magstripe issue flows", "Familiar, simple and often easier to refresh in place", "Lower flexibility and weaker long-term upgrade story"],
        ["RFID hotel key cards", "Hotels modernizing guest access and amenity logic", "Faster guest use, stronger upgrade path and broader credential options", "Needs a clearer compatibility and encoding brief first"],
      ],
    },
    decidingBullets: [
      "Start with the installed lock and encoder environment, not the desired material.",
      "Use guest-flow friction, card replacement behavior and amenity access needs to frame the upgrade case.",
      "Treat rollout timing and staff retraining as part of the format decision.",
    ],
    samplingBullets: [
      "Validate one lock-compatible RFID option against the current magstripe benchmark.",
      "Keep artwork and premium materials out of the first comparison round when the upgrade path is still being proven.",
      "Test reissue, replacement and front-desk handling in the pilot, not only door opening.",
    ],
    internalLinks: [
      { href: "/solutions/hotel-key-cards/", label: "Hotel key card solution page" },
      { href: "/product/hotel-key-cards/", label: "Hotel key cards" },
      { href: "/guides/hotel-key-card-encoding/", label: "Hotel key card encoding guide" },
    ],
    referenceLinks: [],
    faq: [
      {
        question: "When should a hotel keep magstripe instead of switching immediately?",
        answer:
          "Keeping magstripe can still make sense when the installed estate is deeply tied to it and the upgrade case is not yet strong enough to justify broader change.",
      },
      {
        question: "Does RFID only matter for room access?",
        answer:
          "No. RFID becomes more valuable when the property wants to connect room access with amenity logic, faster reissue or a more modern guest experience.",
      },
    ],
    primaryAction: { href: "/contact/hotel-rfid/", label: "Discuss RFID upgrade options" },
    secondaryActions: [
      { href: "/compatibility/", label: "Browse compatibility pages" },
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildComparisonPageDefinition({
    route: "/compare/pps-vs-silicone-vs-textile-rfid-laundry-tags/",
    title: "PPS Vs Silicone Vs Textile RFID Laundry Tags",
    summary:
      "This comparison helps laundry buyers decide which tag family fits their wash conditions, textile behavior and attachment model before the first pilot starts.",
    heroPoints: [
      "PPS, silicone and textile tags solve different durability and integration problems.",
      "The right first sample set comes from wash profile and attachment style, not from material preference alone.",
      "Textile flexibility and reader workflow should be validated together.",
    ],
    imageAlt: "PPS silicone textile laundry tag comparison",
    imageSourceRoutes: ["/product/pps-rfid-laundry-tag/", "/product/rfid-silicone-laundry-tag/", "/product/rfid-laundry-tags/"],
    table: {
      columns: ["Tag family", "Best fit", "Main strengths", "Watch-outs"],
      rows: [
        ["PPS", "Compact hard-shell laundry use", "Strong durability profile for many harsher wash conditions", "Less flexible for soft textile integration"],
        ["Silicone", "Garments and textiles needing more bend", "Better flexibility and wearer comfort in many programs", "Needs tighter heat and handling validation"],
        ["Textile tag", "Sewn-in workflows where tag feel matters", "More natural fit with some linen and garment programs", "Attachment method and lifecycle testing matter earlier"],
      ],
    },
    decidingBullets: [
      "Use wash temperature, pressure and chemicals to narrow the material path first.",
      "Treat attachment style and garment feel as real decision points, not later refinements.",
      "Confirm whether the reader workflow favors a harder-shell or sewn-in style.",
    ],
    samplingBullets: [
      "Pilot each realistic tag family on the real textile and in the real wash environment.",
      "Track read performance and physical wear in the same trial, not as separate tests.",
      "Use one clear success metric for retention, readability and handling convenience.",
    ],
    internalLinks: [
      { href: "/solutions/rfid-laundry-tags/", label: "Laundry tag solution page" },
      { href: "/product/pps-rfid-laundry-tag/", label: "PPS RFID laundry tag" },
      { href: "/product/rfid-silicone-laundry-tag/", label: "Silicone RFID laundry tag" },
      { href: "/product/rfid-laundry-tags/", label: "Industrial RFID laundry tags" },
    ],
    referenceLinks: [],
    faq: [
      {
        question: "Should every laundry project test all three tag families?",
        answer:
          "No. Once wash profile, textile type and attachment style are clear, some projects can rule out at least one tag family before sampling.",
      },
      {
        question: "Is the most durable tag always the best choice?",
        answer:
          "Not always. A harder tag can be less suitable if garment feel, bend or attachment method is just as important as durability.",
      },
    ],
    primaryAction: { href: "/contact/laundry-rfid/", label: "Ask for laundry tag guidance" },
    secondaryActions: [
      { href: "/products/rfid-tags/", label: "Browse RFID tags" },
      { href: "/guides/", label: "Browse buying guides" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildComparisonPageDefinition({
    route: "/compare/ntag213-vs-ntag215-vs-ntag216/",
    title: "NTAG213 Vs NTAG215 Vs NTAG216",
    summary:
      "This page compares NTAG213, NTAG215 and NTAG216 for buyers deciding which NTAG memory path best fits simple redirects, branded NFC cards, review taps or larger payload use cases.",
    heroPoints: [
      "The right NTAG choice depends on payload, edit model and the real tap workflow.",
      "Most commercial projects do not need the largest memory option by default.",
      "Phone compatibility is usually shared; payload planning is what separates the shortlist.",
    ],
    imageAlt: "NTAG chip family comparison",
    imageSourceRoutes: ["/product/nfc-stickers/", "/product/nfc-business-card/", "/product/google-review-nfc-card/"],
    table: {
      columns: ["Chip", "Best fit", "Main strengths", "Watch-outs"],
      rows: [
        ["NTAG213", "Simple redirects and lighter NFC payloads", "Efficient default for many tap-to-link projects", "Can feel tight if the payload grows later"],
        ["NTAG215", "Mid-range payload flexibility", "Balanced option when the project needs more headroom", "Still needs a clear content model before rollout"],
        ["NTAG216", "Larger payload or future-growth headroom", "More space for broader use cases", "Can be overspecified for simple tap journeys"],
      ],
    },
    decidingBullets: [
      "Start from payload size and update model rather than choosing the biggest chip automatically.",
      "Use the actual landing flow, QR fallback and admin workflow to pressure-test the memory need.",
      "Treat chip cost and rollout scale as a second-layer decision after the payload is understood.",
    ],
    samplingBullets: [
      "Prototype the live redirect or payload on the intended phones before final chip selection.",
      "Keep one lower-memory and one higher-memory option in scope if the content model is still moving.",
      "Confirm whether the project needs only URL delivery or broader NFC data handling.",
    ],
    internalLinks: [
      { href: "/solutions/google-review-nfc-card/", label: "Google review NFC card solution" },
      { href: "/solutions/nfc-business-card/", label: "NFC business card solution" },
      { href: "/product/nfc-stickers/", label: "NFC stickers" },
      { href: "/product/nfc-business-card/", label: "NFC business cards" },
    ],
    referenceLinks: [
      { href: "https://www.nxp.com/products/NTAG213_215_216", label: "NXP NTAG 213/215/216" },
    ],
    faq: [
      {
        question: "Is NTAG216 always the safest choice?",
        answer:
          "Not always. It gives more headroom, but many commercial tap-to-link projects work well on smaller NTAG variants once the payload is defined clearly.",
      },
      {
        question: "What decides the NTAG choice fastest?",
        answer:
          "The fastest path is to define the payload, redirect model and update workflow first, then choose the smallest realistic chip family that still leaves comfortable headroom.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Ask which NTAG fits your project" },
    secondaryActions: [
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/products/rfid-labels/", label: "Browse RFID labels" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildComparisonPageDefinition({
    route: "/compare/rfid-wristbands-hotels-vs-events-vs-resorts/",
    title: "RFID Wristbands For Hotels Vs Events Vs Resorts",
    summary:
      "This comparison helps buyers decide how wristband requirements shift across hotels, events and resort environments before choosing the first material and chip path.",
    heroPoints: [
      "Hotels, events and resorts use wristbands differently even when the hardware looks similar.",
      "Guest stay length, water exposure and branding expectations change the shortlist fast.",
      "The right chip and material path comes after the operating model is clear.",
    ],
    imageAlt: "RFID wristband use-case comparison",
    imageSourceRoutes: ["/product/rfid-wristbands-for-hotels/", "/product/rfid-event-wristband/", "/product/rfid-silicone-wristbands/"],
    table: {
      columns: ["Use case", "Best fit", "Main strengths", "Watch-outs"],
      rows: [
        ["Hotels", "Amenity-heavy guest access", "Hands-free convenience for pools, spas and lockers", "Compatibility and guest-comfort questions arrive early"],
        ["Events", "Short-cycle access and attendee segmentation", "Fast issue, crowd flow and easy visual grouping", "Durability needs can be lower but issue speed matters more"],
        ["Resorts", "Mixed stay and amenity access", "Supports richer guest journeys with fewer lost credentials", "Material and water exposure matter more"],
      ],
    },
    decidingBullets: [
      "Use wear time, water exposure and issue volume to narrow the shortlist first.",
      "Treat branding and color-coding as part of operations, not just aesthetics.",
      "Confirm whether the wristband controls only entry or a broader amenity workflow.",
    ],
    samplingBullets: [
      "Pilot the likely material on the real body-wear and reader environment.",
      "Test issue speed, lock or gate reads and replacement handling together.",
      "Use the pilot to confirm whether one wristband format can cover all zones or not.",
    ],
    internalLinks: [
      { href: "/product/rfid-wristbands-for-hotels/", label: "RFID wristbands for hotels" },
      { href: "/product/rfid-event-wristband/", label: "RFID event wristband" },
      { href: "/product/rfid-silicone-wristbands/", label: "RFID silicone wristbands" },
      { href: "/solutions/hotel-rfid-access-control/", label: "Hotel RFID access solution" },
    ],
    referenceLinks: [],
    faq: [
      {
        question: "Can one wristband format work for hotels, events and resorts?",
        answer:
          "Sometimes, but not by default. Wear time, environment and access logic often push the best-fit material and chip path in different directions.",
      },
      {
        question: "What should decide the first wristband material choice?",
        answer:
          "The first choice should come from environment, wear time and guest experience rather than brand appearance alone.",
      },
    ],
    primaryAction: { href: "/contact/event-rfid/", label: "Request wristband guidance" },
    secondaryActions: [
      { href: "/products/rfid-wristbands/", label: "Browse RFID wristbands" },
      { href: "/compare/", label: "Browse comparison pages" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildComparisonPageDefinition({
    route: "/compare/silicone-vs-fabric-vs-woven-rfid-wristbands/",
    title: "Silicone Vs Fabric Vs Woven RFID Wristbands",
    summary:
      "This comparison is for teams deciding which wristband material fits comfort, branding, water exposure and wear duration before they lock the first sample round.",
    heroPoints: [
      "Material should follow wear conditions and guest experience, not the other way around.",
      "Silicone, fabric and woven wristbands communicate different operational and brand choices.",
      "The real wristband decision often comes from environment and issue logic more than chip type.",
    ],
    imageAlt: "RFID wristband material comparison",
    imageSourceRoutes: ["/product/rfid-silicone-wristbands/", "/product/rfid-event-wristband/", "/product/rfid-wristbands-for-hotels/"],
    table: {
      columns: ["Material", "Best fit", "Main strengths", "Watch-outs"],
      rows: [
        ["Silicone", "Water-heavy, comfort-led or reusable wear", "Durable, familiar and often easy for resort or pool contexts", "Visual feel can be less premium for some branded programs"],
        ["Fabric", "Event and guest programs wanting a softer branded look", "Comfortable and visually flexible", "Need to confirm durability and attachment details"],
        ["Woven", "Longer-wear branded access with stronger visual identity", "Good perceived value and branding story", "Production details and closure choice matter more"],
      ],
    },
    decidingBullets: [
      "Use water exposure, wear time and replacement behavior to narrow the material path first.",
      "Treat comfort and closure style as operational questions, not only design choices.",
      "Confirm whether the wristband is disposable, semi-reusable or part of a longer stay.",
    ],
    samplingBullets: [
      "Test the real closure, print and wear behavior on the intended user group.",
      "Keep one conservative material in the sample round if the premium option is still unproven.",
      "Validate branding, readability and comfort together instead of sequentially.",
    ],
    internalLinks: [
      { href: "/products/rfid-wristbands/", label: "Browse RFID wristbands" },
      { href: "/product/rfid-silicone-wristbands/", label: "RFID silicone wristbands" },
      { href: "/product/rfid-event-wristband/", label: "RFID event wristband" },
    ],
    referenceLinks: [],
    faq: [
      {
        question: "Is silicone always the most durable wristband option?",
        answer:
          "Silicone often performs well in demanding environments, but the most suitable wristband still depends on wear time, closure logic and guest experience expectations.",
      },
      {
        question: "Should teams decide the material before the issue model?",
        answer:
          "No. Whether the band is disposable, event-limited or part of a longer guest stay should shape the material shortlist first.",
      },
    ],
    primaryAction: { href: "/contact/event-rfid/", label: "Discuss wristband materials" },
    secondaryActions: [
      { href: "/products/rfid-wristbands/", label: "Browse RFID wristbands" },
      { href: "/guides/", label: "Browse buying guides" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildComparisonPageDefinition({
    route: "/compare/uhf-vs-hf-rfid-laundry-tags/",
    title: "UHF Vs HF RFID Laundry Tags",
    summary:
      "This comparison helps laundry teams decide which frequency path fits their read points, textile flow and tracking model before the first pilot gets overcomplicated.",
    heroPoints: [
      "Reader layout and portal design matter as much as tag construction.",
      "UHF and HF solve different range and workflow problems in laundry environments.",
      "Frequency should be chosen with the real read scenario, not in isolation.",
    ],
    imageAlt: "UHF and HF laundry tag comparison",
    imageSourceRoutes: ["/product/rfid-laundry-tags/", "/product/pps-rfid-laundry-tag/", "/product/rfid-silicone-laundry-tag/"],
    table: {
      columns: ["Frequency path", "Best fit", "Main strengths", "Watch-outs"],
      rows: [
        ["UHF", "Bulk reads, portals and longer-range workflows", "Better fit for many high-throughput identification points", "Needs tighter control of read zones and environment"],
        ["HF", "Closer-range and more deliberate read interactions", "More contained read behavior in many workflows", "Can feel limiting if the process needs wider capture"],
      ],
    },
    decidingBullets: [
      "Use the real read point and item density to decide the frequency path first.",
      "Treat portal geometry, item handling and interference as part of the selection, not later tuning.",
      "Validate whether the process needs broad capture or deliberate close-range reads.",
    ],
    samplingBullets: [
      "Pilot frequency, tag form factor and attachment method in the same test cycle.",
      "Measure read accuracy and operational handling together instead of comparing lab-only numbers.",
      "Avoid expanding into too many tag materials until the frequency path is already credible.",
    ],
    internalLinks: [
      { href: "/solutions/rfid-laundry-tags/", label: "Laundry tag solution page" },
      { href: "/product/rfid-laundry-tags/", label: "Industrial RFID laundry tags" },
      { href: "/compare/pps-vs-silicone-vs-textile-rfid-laundry-tags/", label: "Compare laundry tag materials" },
    ],
    referenceLinks: [],
    faq: [
      {
        question: "Is UHF always the better laundry tag choice?",
        answer:
          "Not always. UHF can suit bulk-read workflows very well, but HF can still be more practical when the process favors contained close-range reads.",
      },
      {
        question: "Can the team choose frequency before the reader layout is clear?",
        answer:
          "That usually creates unnecessary pilot risk. Frequency decisions are far more reliable when the real read points and handling flow are already described.",
      },
    ],
    primaryAction: { href: "/contact/laundry-rfid/", label: "Ask for laundry frequency guidance" },
    secondaryActions: [
      { href: "/products/rfid-tags/", label: "Browse RFID tags" },
      { href: "/compare/", label: "Browse comparison pages" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildComparisonPageDefinition({
    route: "/compare/pvc-vs-wood-vs-pla-hotel-key-cards/",
    title: "PVC Vs Wood Vs PLA Hotel Key Cards",
    summary:
      "This comparison helps hospitality teams decide which hotel card material fits scale, sustainability goals and guest experience before premium samples start consuming time.",
    heroPoints: [
      "Material should support the property's issue model and brand story together.",
      "PVC remains the practical baseline in many rollouts, while wood and PLA need clearer brand justification.",
      "The compatibility path should still be confirmed before material upgrades.",
    ],
    imageAlt: "Hotel key card material comparison",
    imageSourceRoutes: ["/product/hotel-key-cards/", "/product/wooden-rfid-card/", "/product/eco_rfid_card/"],
    table: {
      columns: ["Material", "Best fit", "Main strengths", "Watch-outs"],
      rows: [
        ["PVC", "High-volume standard hotel issue", "Practical, scalable and familiar", "Less differentiated on sustainability or premium feel"],
        ["Wood", "Boutique or eco-led premium guest experience", "Distinct look and stronger tactile brand story", "Material consistency and finish validation matter more"],
        ["PLA", "Eco-positioned programs wanting a more familiar card form", "Supports sustainability messaging while staying close to standard card handling", "Needs clearer validation on finish and supply expectations"],
      ],
    },
    decidingBullets: [
      "Treat compatibility as a baseline requirement, then compare materials against brand and issue model.",
      "Use card replacement rate, property scale and guest expectations to pressure-test the material decision.",
      "Keep packaging and finish expectations in scope if the property wants a premium reveal moment.",
    ],
    samplingBullets: [
      "Validate one baseline compatible card before expanding to eco or premium materials.",
      "Test guest feel, print outcome and operational handling in the same sample review.",
      "Use the pilot to confirm whether the material story is strong enough to justify rollout complexity.",
    ],
    internalLinks: [
      { href: "/solutions/hotel-key-cards/", label: "Hotel key card solution page" },
      { href: "/product/hotel-key-cards/", label: "Hotel key cards" },
      { href: "/product/wooden-rfid-card/", label: "Wooden RFID cards" },
      { href: "/product/eco_rfid_card/", label: "Eco RFID cards" },
    ],
    referenceLinks: [],
    faq: [
      {
        question: "Should hotels begin with wood or PLA if sustainability is the goal?",
        answer:
          "Only after the baseline compatible card path is already clear. The safer route is to prove compatibility first, then test whether wood or PLA adds enough brand value.",
      },
      {
        question: "Is PVC still a reasonable hotel card choice?",
        answer:
          "Yes. PVC remains the practical baseline in many hospitality rollouts, especially where scale, cost control and consistent handling matter most.",
      },
    ],
    primaryAction: { href: "/contact/hotel-rfid/", label: "Discuss hotel card materials" },
    secondaryActions: [
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/compatibility/", label: "Browse compatibility pages" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildComparisonPageDefinition({
    route: "/compare/nfc-review-card-vs-qr-review-stand/",
    title: "NFC Review Card Vs QR Review Stand",
    summary:
      "This comparison helps local businesses decide whether a tap-first review card or a scan-first QR stand fits the real customer moment better.",
    heroPoints: [
      "NFC and QR formats solve different in-person behavior patterns.",
      "The best format depends on where the customer is standing, how quickly staff can prompt and which phones dominate.",
      "Many businesses end up using a mixed format once the first pilot reveals real behavior.",
    ],
    imageAlt: "NFC review card versus QR review stand",
    imageSourceRoutes: ["/product/google-review-nfc-card/", "/product/nfc-stickers/", "/product/nfc-business-card/"],
    table: {
      columns: ["Format", "Best fit", "Main strengths", "Watch-outs"],
      rows: [
        ["NFC review card", "Counter, checkout or handover moments where tap is natural", "Fast interaction and premium physical feel", "Needs phone compatibility and placement validation"],
        ["QR review stand", "Static point-of-sale or tabletop prompts", "Easy to understand visually and works without tap behavior", "Can be ignored if placement is weak or the visual prompt is not strong"],
        ["Mixed format", "Businesses testing several customer moments", "Covers both tap and scan preferences", "Needs clearer creative and operational consistency"],
      ],
    },
    decidingBullets: [
      "Use the real customer handoff moment to decide whether tap or scan is more natural.",
      "Treat phone mix, staff prompting and tabletop behavior as part of the format choice.",
      "Keep the live review link and redirect ownership stable across whichever format wins.",
    ],
    samplingBullets: [
      "Pilot one NFC and one QR format in the same real environment before scaling.",
      "Measure actual customer response, not only staff preference.",
      "Keep branding and premium materials secondary until the best interaction model is clear.",
    ],
    internalLinks: [
      { href: "/solutions/google-review-nfc-card/", label: "Google review NFC card solution" },
      { href: "/product/google-review-nfc-card/", label: "Google review NFC card" },
      { href: "/product/nfc-stickers/", label: "NFC stickers" },
    ],
    referenceLinks: [
      {
        href: "https://support.google.com/business/answer/3474122?hl=en-GB&p=search_more_reviews",
        label: "Google Business Profile review guidance",
      },
    ],
    faq: [
      {
        question: "Is NFC always better than QR for review collection?",
        answer:
          "No. NFC can feel faster and more premium, but QR can still perform better when the customer naturally scans at a static location.",
      },
      {
        question: "What should be tested first?",
        answer:
          "Test the actual customer interaction moment first: where the prompt appears, how staff introduces it and whether the phone behavior is reliable enough to scale.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Ask which review format fits best" },
    secondaryActions: [
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/guides/", label: "Browse buying guides" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildComparisonPageDefinition({
    route: "/compare/mifare-plus-ev2-vs-desfire-ev3/",
    title: "MIFARE Plus EV2 Vs DESFire EV3",
    summary:
      "This comparison is for projects that have already moved beyond generic chip-family talk and need a practical view on MIFARE Plus EV2 versus DESFire EV3 in real card programs.",
    heroPoints: [
      "This is usually a migration-versus-security-depth decision, not a simple feature race.",
      "Infrastructure fit and application complexity should guide the shortlist first.",
      "The more advanced card is not automatically the more practical one.",
    ],
    imageAlt: "MIFARE Plus EV2 versus DESFire EV3",
    imageSourceRoutes: ["/product/mifare-plus-card/", "/product/mifare-desfire-cards/", "/product/mifare-desfire-ev2-cards/"],
    table: {
      columns: ["Option", "Best fit", "Main strengths", "Watch-outs"],
      rows: [
        ["MIFARE Plus EV2", "Projects balancing stronger security with migration pressure", "Practical upgrade route in many existing estates", "Still needs careful reader and application validation"],
        ["DESFire EV3", "Programs targeting stronger security and richer application logic", "More headroom for complex or longer-horizon deployments", "Can add more integration and validation work up front"],
      ],
    },
    decidingBullets: [
      "Use current infrastructure and migration pressure to frame the decision before security marketing language does.",
      "Treat application complexity and credential lifecycle as part of the selection, not afterthoughts.",
      "Choose the option the estate can support well, not only the option with the bigger headline.",
    ],
    samplingBullets: [
      "Validate the likely winner on the real reader environment before broad card purchasing decisions.",
      "Keep one fallback path in scope if estate documentation is incomplete.",
      "Test application behavior, personalization and operational handling together.",
    ],
    internalLinks: [
      { href: "/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/", label: "Hotel lock chip-family comparison" },
      { href: "/product/mifare-plus-card/", label: "MIFARE Plus cards" },
      { href: "/product/mifare-desfire-cards/", label: "MIFARE DESFire cards" },
    ],
    referenceLinks: [
      { href: "https://www.nxp.com/products/MFPEV2", label: "NXP MIFARE Plus EV2" },
      { href: "https://www.nxp.com/products/MF3DHx3", label: "NXP MIFARE DESFire EV3" },
    ],
    faq: [
      {
        question: "Is DESFire EV3 the best choice for every new project?",
        answer:
          "Not automatically. It often fits stronger-security programs well, but projects still need to weigh migration fit, integration effort and the actual reader estate.",
      },
      {
        question: "When does MIFARE Plus EV2 stay attractive?",
        answer:
          "It stays attractive when the project wants stronger security than older cards but still values a more migration-minded path within the installed estate.",
      },
    ],
    primaryAction: { href: "/contact/custom-rfid-cards/", label: "Ask for secure card guidance" },
    secondaryActions: [
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/compare/", label: "Browse comparison pages" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildComparisonPageDefinition({
    route: "/compare/keyfob-vs-card-vs-wristband-access-control/",
    title: "Keyfob Vs Card Vs Wristband For Access Control",
    summary:
      "This comparison helps access-control buyers decide which credential format fits user behavior, replacement patterns and operating environment before they commit to a large issue program.",
    heroPoints: [
      "The right credential format follows how users carry and replace it in real life.",
      "Cards, keyfobs and wristbands each solve different convenience and environment problems.",
      "Reader compatibility matters, but format choice still changes the user experience dramatically.",
    ],
    imageAlt: "Access-control credential format comparison",
    imageSourceRoutes: ["/product/rfid-key-fob/", "/product/blank-rfid-card/", "/product/rfid-silicone-wristbands/"],
    table: {
      columns: ["Format", "Best fit", "Main strengths", "Watch-outs"],
      rows: [
        ["Card", "Standard employee, membership or visitor issue", "Familiar, scalable and easy to brand", "Can be easier to forget or lose"],
        ["Keyfob", "Daily-use access where users prefer something attached to keys", "Convenient and durable for repeated everyday carry", "Branding and credential size are more limited"],
        ["Wristband", "Hands-free or environment-specific access", "Harder to lose and useful in active or wet environments", "Comfort, sizing and material choice matter earlier"],
      ],
    },
    decidingBullets: [
      "Use daily carry behavior and replacement patterns to narrow the format first.",
      "Treat environment and user convenience as core access-control requirements, not extras.",
      "Confirm whether the program wants a standard issue format or several credential paths for different user groups.",
    ],
    samplingBullets: [
      "Pilot the leading format with the actual reader environment and user group.",
      "Include replacement, issuance and branding questions in the trial, not only read success.",
      "Use the pilot to learn whether one format can cover all users or whether a mixed issue model is better.",
    ],
    internalLinks: [
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/products/rfid-keyfobs/", label: "Browse RFID keyfobs" },
      { href: "/products/rfid-wristbands/", label: "Browse RFID wristbands" },
      { href: "/product/rfid-key-fob/", label: "RFID key fobs" },
    ],
    referenceLinks: [],
    faq: [
      {
        question: "Is there one best credential format for all access-control projects?",
        answer:
          "No. The right format depends on how users actually carry the credential, how often it gets replaced and what the operating environment demands.",
      },
      {
        question: "When is a mixed credential program useful?",
        answer:
          "It can make sense when employees, residents, visitors or amenity users clearly benefit from different formats instead of a single compromise option.",
      },
    ],
    primaryAction: { href: "/contact/access-control-keyfobs/", label: "Discuss credential format options" },
    secondaryActions: [
      { href: "/products/all/", label: "Browse all products" },
      { href: "/compare/", label: "Browse comparison pages" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildCompatibilityPageDefinition({
    route: "/compatibility/saflok-hotel-key-cards/",
    title: "Saflok Hotel Key Cards Compatibility Guide",
    summary:
      "Use this page when the property already knows it runs on a Saflok estate and needs a faster path to compatible hotel card samples, material choices and pre-encoding discussion.",
    imageAlt: "Saflok hotel key card compatibility",
    imageSourceRoutes: ["/product/hotel-key-cards/", "/product/printed-rfid-cards/"],
    bestFit: [
      "Hotels refreshing Saflok room-key stock without broad platform change.",
      "Properties validating card material upgrades after baseline compatibility is understood.",
      "Teams comparing standard issue cards with branded or premium variants.",
    ],
    whatToSend: [
      "Saflok lock or encoder reference, or a current guest card sample.",
      "Need for plain stock, branded printing, numbering or pre-encoding.",
      "Chip family notes, magstripe requirements and pilot quantity.",
    ],
    testChecklist: [
      "Validate opening behavior on the real lock estate before artwork refinement.",
      "Confirm encoding workflow and front-desk issue logic in the same pilot.",
      "Keep one baseline compatible card in scope before moving into premium materials.",
    ],
    productLinks: [
      { href: "/product/hotel-key-cards/", label: "Hotel key cards" },
      { href: "/product/printed-rfid-cards/", label: "Printed RFID cards" },
      { href: "/compare/pvc-vs-wood-vs-pla-hotel-key-cards/", label: "Hotel card material comparison" },
    ],
    referenceLinks: [
      { href: "https://www.dormakaba.com/us-en/offering/products/lodging-systems/electronic-hotel-locks/saflok-quantumiv--dk_310", label: "dormakaba Saflok QuantumIV" },
    ],
    faq: [
      {
        question: "What helps a Saflok card request move fastest?",
        answer:
          "A current guest card sample or a clear Saflok lock reference usually shortens the path to a realistic sample set the most.",
      },
      {
        question: "Should the property choose premium materials first?",
        answer:
          "Usually no. Start with baseline compatibility, then move into material upgrades once the card path is already proven.",
      },
    ],
    primaryAction: { href: "/contact/hotel-rfid/", label: "Check Saflok card compatibility" },
  }),
  buildCompatibilityPageDefinition({
    route: "/compatibility/onity-hotel-key-cards/",
    title: "Onity Hotel Key Cards Compatibility Guide",
    summary:
      "Use this page when the project already knows it needs Onity-compatible hotel key cards and wants a tighter sampling and compatibility checklist before ordering.",
    imageAlt: "Onity hotel key card compatibility",
    imageSourceRoutes: ["/product/hotel-key-cards/", "/product/printed-rfid-cards/"],
    bestFit: [
      "Properties refreshing Onity-compatible guest card stock.",
      "Hotels comparing plain replacement cards with branded or premium variants.",
      "Teams narrowing the first sample set before pre-encoding or rollout planning.",
    ],
    whatToSend: [
      "Onity lock or front-desk reference, or a current guest card sample.",
      "Chip family, magstripe or encoding notes if available.",
      "Artwork needs, pilot quantity and target delivery date.",
    ],
    testChecklist: [
      "Validate lock behavior and issue flow before premium finishes enter the discussion.",
      "Confirm whether the property needs plain stock, numbered cards or pre-encoding in the first round.",
      "Use one conservative baseline card in the sample plan even if premium materials remain attractive.",
    ],
    productLinks: [
      { href: "/product/hotel-key-cards/", label: "Hotel key cards" },
      { href: "/product/printed-rfid-cards/", label: "Printed RFID cards" },
      { href: "/guides/hotel-key-card-encoding/", label: "Hotel key card encoding guide" },
    ],
    referenceLinks: [
      { href: "https://buildings.honeywell.com/us/en/brands/our-brands/onity/what-we-do/electronic-locking-systems/front-desk-systems", label: "Onity electronic locking systems" },
    ],
    faq: [
      {
        question: "What is the most useful first proof for an Onity compatibility request?",
        answer:
          "The most useful proof is usually a current guest card sample or a clear lock or encoder reference from the property.",
      },
      {
        question: "Can properties move straight to eco or premium materials?",
        answer:
          "They can, but it is usually safer to confirm the baseline compatible card path first so the upgrade does not complicate the initial validation round.",
      },
    ],
    primaryAction: { href: "/contact/hotel-rfid/", label: "Check Onity card compatibility" },
  }),
  buildCompatibilityPageDefinition({
    route: "/compatibility/salto-hotel-key-cards/",
    title: "SALTO Hotel Key Cards Compatibility Guide",
    summary:
      "Use this page when the project already knows it runs on a SALTO environment and needs a more focused path into compatible hotel key card samples, chip options and encoding questions.",
    imageAlt: "SALTO hotel key card compatibility",
    imageSourceRoutes: ["/product/hotel-key-cards/", "/product/mifare-desfire-cards/", "/product/mifare-plus-card/"],
    bestFit: [
      "Hotels and hospitality programs validating SALTO-compatible RFID cards.",
      "Properties comparing chip families and materials before guest-card refresh.",
      "Teams moving from generic catalog browsing into a compatibility-first sample set.",
    ],
    whatToSend: [
      "SALTO lock or encoder reference, or a current guest card sample.",
      "Known chip family, project notes on security expectations and any encoding requirements.",
      "Material goals, pilot quantity and rollout timing.",
    ],
    testChecklist: [
      "Validate the likely chip family and the real issue flow before reviewing premium materials.",
      "Keep security expectations and estate compatibility in the same conversation.",
      "Use the pilot to confirm whether one card path covers all user groups or not.",
    ],
    productLinks: [
      { href: "/product/hotel-key-cards/", label: "Hotel key cards" },
      { href: "/product/mifare-plus-card/", label: "MIFARE Plus cards" },
      { href: "/product/mifare-desfire-cards/", label: "MIFARE DESFire cards" },
      { href: "/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/", label: "Hotel lock chip-family comparison" },
    ],
    referenceLinks: [
      { href: "https://saltosystems.com/en-us/industries/hospitality/", label: "SALTO hospitality access" },
    ],
    faq: [
      {
        question: "What usually decides the first SALTO card shortlist?",
        answer:
          "The shortlist usually becomes clearer once the estate reference, likely chip family and the property's security expectations are all stated together.",
      },
      {
        question: "Should SALTO projects compare chip families early?",
        answer:
          "Yes. Chip-family comparison usually belongs in the first decision round because it shapes both compatibility and the later encoding path.",
      },
    ],
    primaryAction: { href: "/contact/hotel-rfid/", label: "Check SALTO card compatibility" },
  }),
  buildGuidePageDefinition({
    route: "/guides/hotel-key-card-encoding/",
    title: "Hotel Key Card Encoding Guide",
    kicker: "Hospitality Guide",
    summary:
      "This guide helps hotel teams scope card encoding work, reduce avoidable compatibility mistakes and prepare a tighter brief before asking for encoded samples or production support.",
    heroPoints: [
      "Encoding should be planned together with compatibility, not after the card material is chosen.",
      "The current lock and encoder estate determines what is realistic first.",
      "A small pilot should validate issue flow and guest recovery procedures, not only opening behavior.",
    ],
    imageAlt: "Hotel key card encoding workflow",
    imageSourceRoutes: ["/product/hotel-key-cards/", "/product/printed-rfid-cards/"],
    coverageBullets: [
      "How to collect the right property and lock-estate details before asking for encoded cards.",
      "How to keep compatibility, chip family and encoding workflow in one first brief.",
      "How to structure a pilot that tests both technical performance and front-desk handling.",
    ],
    workflowBullets: [
      "Confirm the installed lock and encoder environment first.",
      "Define chip family, numbering, pre-encoding and artwork requirements in one document.",
      "Pilot the encoded cards on the real locks and in the real front-desk issue flow.",
      "Use the pilot to capture opening behavior, replacement handling and staff feedback before scaling.",
    ],
    mistakeBullets: [
      "Choosing the card finish before confirming the encoding path.",
      "Treating compatibility and encoding as separate workstreams too late in the process.",
      "Testing only door opening and skipping front-desk issue or replacement workflows.",
    ],
    resourceLinks: [
      { href: "/solutions/hotel-key-cards/", label: "Hotel key card solution page" },
      { href: "/compatibility/", label: "Hotel compatibility pages" },
      { href: "/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/", label: "Hotel chip-family comparison" },
      { href: "/product/hotel-key-cards/", label: "Hotel key cards" },
    ],
    faq: [
      {
        question: "What should a hotel send before asking for pre-encoded card samples?",
        answer:
          "The best first brief includes the lock or encoder environment, likely chip family, numbering rules, artwork needs and the pilot quantity and deadline.",
      },
      {
        question: "What should an encoding pilot validate besides lock opening?",
        answer:
          "It should also validate front-desk issue logic, replacement handling, staff workflow and whether the encoded card path is practical enough to scale.",
      },
    ],
    primaryAction: { href: "/contact/hotel-rfid/", label: "Ask about pre-encoding support" },
    secondaryActions: [
      { href: "/compatibility/", label: "Browse compatibility pages" },
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildGuidePageDefinition({
    route: "/guides/rfid-tag-card-wristband-lifespan/",
    title: "How Long RFID Tags, Cards And Wristbands Last",
    kicker: "Durability Guide",
    summary:
      "This guide helps buyers think about lifespan more practically across RFID tags, cards and wristbands by tying durability back to environment, handling and material choice instead of generic year counts.",
    heroPoints: [
      "Lifespan is driven by environment and handling, not only by chip family.",
      "Cards, laundry tags and wristbands fail for different operational reasons.",
      "The best way to estimate lifespan is to test the real workflow, not to rely on a generic durability claim.",
    ],
    imageAlt: "RFID durability and lifespan planning",
    imageSourceRoutes: ["/product/hotel-key-cards/", "/product/rfid-laundry-tags/", "/product/rfid-silicone-wristbands/"],
    coverageBullets: [
      "How lifespan changes across cards, tags and wristbands.",
      "Why material, environment and replacement behavior matter more than generic chip claims.",
      "What to validate in a pilot when durability is commercially important.",
    ],
    workflowBullets: [
      "Map the real environment: wash, water, abrasion, pocket carry, bending or daily contact.",
      "Choose the likely format and material path based on how the credential is carried and used.",
      "Pilot the likely option on the real reader setup and in the real handling workflow.",
      "Track physical wear, read performance and replacement behavior together before scaling.",
    ],
    mistakeBullets: [
      "Assuming all RFID products age the same way because the chip is contactless.",
      "Using a generic lifespan claim without testing the actual environment.",
      "Ignoring how users carry, bend, wash or replace the item in daily operation.",
    ],
    resourceLinks: [
      { href: "/solutions/rfid-laundry-tags/", label: "RFID laundry tag solution page" },
      { href: "/solutions/hotel-key-cards/", label: "Hotel key card solution page" },
      { href: "/products/rfid-wristbands/", label: "Browse RFID wristbands" },
      { href: "/products/rfid-tags/", label: "Browse RFID tags" },
    ],
    faq: [
      {
        question: "What usually shortens RFID product lifespan fastest?",
        answer:
          "The fastest wear usually comes from environment and handling: repeated washing, bending, abrasion, water exposure or rough daily carry can all matter more than the nominal chip type.",
      },
      {
        question: "How should a buyer validate durability before a large order?",
        answer:
          "The safest route is a focused pilot that measures both physical wear and read performance in the real operating workflow before full rollout.",
      },
    ],
    primaryAction: { href: "/contact/", label: "Ask for durability guidance" },
    secondaryActions: [
      { href: "/guides/", label: "Browse buying guides" },
      { href: "/products/all/", label: "Browse all products" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildSolutionLaunchDefinition({
    route: "/solutions/rfid-keyfobs-access-control/",
    title: "RFID Keyfobs For Access Control Buyer's Guide",
    kicker: "Access Control Solution",
    summary:
      "Use this page when the project already knows it wants access-control keyfobs and needs a tighter decision on reader fit, credential format, shell style and rollout practicality before asking for pricing.",
    heroPoints: [
      "Reader compatibility and credential format matter before shell color or print finish.",
      "Keyfob programs work best when carry behavior and replacement patterns are part of the first shortlist.",
      "Numbering, branding and attachment style should be scoped with the first sample round, not after it.",
    ],
    imageAlt: "RFID keyfob access control planning",
    imageSourceRoutes: ["/product/rfid-key-fob/", "/product/proximity-fobs/", "/products/rfid-keyfobs/"],
    bestFor: [
      "Office, apartment, gym and club programs where users naturally carry credentials on keys.",
      "Parking, gate and daily-use access scenarios that need a compact, durable credential.",
      "Projects comparing generic proximity fobs with more branded RFID keyfob options.",
    ],
    whatToConfirm: [
      "Current reader frequency, credential format and whether the project is still tied to a legacy UID workflow.",
      "Need for plain stock, logo printing, laser numbering, barcode or serialized issuance.",
      "How users carry the credential, expected loss or replacement rate and whether several shell sizes are realistic.",
      "Pilot quantity, installation count and any launch date controlling the first order.",
    ],
    productLinks: [
      { href: "/product/rfid-key-fob/", label: "RFID key fob" },
      { href: "/product/proximity-fobs/", label: "Proximity fobs" },
      { href: "/products/rfid-keyfobs/", label: "Browse RFID keyfobs" },
      { href: "/product/blank-rfid-card/", label: "Blank RFID cards" },
    ],
    researchLinks: [
      { href: "/compare/keyfob-vs-card-vs-wristband-access-control/", label: "Compare keyfob vs card vs wristband" },
      { href: "/solutions/hotel-rfid-access-control/", label: "RFID access-control solution page" },
      { href: "/solutions/rfid-readers-and-encoding/", label: "RFID readers and encoding guide" },
      { href: "/guides/rfid-reader-writer-selection/", label: "RFID reader selection guide" },
    ],
    faq: [
      {
        question: "When do keyfobs beat cards in access control?",
        answer:
          "Keyfobs usually win when users naturally carry keys every day and the program values compact carry, durability and quick repeated presentation more than a larger printable card face.",
      },
      {
        question: "What makes a keyfob inquiry more useful?",
        answer:
          "The best first inquiry states the reader environment, credential format, numbering or branding needs and how the credential will actually be carried and replaced in daily use.",
      },
    ],
    primaryAction: { href: "/contact/access-control-keyfobs/", label: "Request keyfob guidance" },
    secondaryActions: [
      { href: "/products/rfid-keyfobs/", label: "Browse RFID keyfobs" },
      { href: "/compare/", label: "Browse comparison pages" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildSolutionLaunchDefinition({
    route: "/solutions/rfid-readers-and-encoding/",
    title: "RFID Reader And Card Encoding Buyer's Guide",
    kicker: "Reader Solution",
    summary:
      "This page is for teams choosing RFID readers, USB encoders or test benches and still deciding which protocol, SDK support and operating workflow fit the real enrollment or issuance job.",
    heroPoints: [
      "Protocol and software environment should drive the first shortlist before reader form factor does.",
      "A reader is only a fit if it matches the cards, tags and host workflow the team actually uses.",
      "The best pilot validates drivers, SDK behavior and card handling together, not in separate steps.",
    ],
    imageAlt: "RFID reader and encoding workflow",
    imageSourceRoutes: ["/product/acr122u/", "/product/nfc-reader-writer-with-free-sdks/", "/products/rfid-readers/"],
    bestFor: [
      "Teams enrolling, testing or encoding cards on a desktop or front-desk workstation.",
      "Software and hardware teams validating NFC, MIFARE or HF card behavior before deployment.",
      "Projects that need a clearer path into USB readers, SDK-supported writers or small encoding benches.",
    ],
    whatToConfirm: [
      "Card or tag family, LF/HF/UHF protocol and which exact credentials the reader must handle first.",
      "Host environment, interface and whether the workflow depends on SDKs, drivers or custom app integration.",
      "Desktop, handheld or bench-top use plus the expected read distance, speed and operator behavior.",
      "Pilot timeline, quantity and whether the first goal is lab testing, issuance or live deployment support.",
    ],
    productLinks: [
      { href: "/product/acr122u/", label: "ACR122U NFC reader" },
      { href: "/product/nfc-reader-writer-with-free-sdks/", label: "NFC reader writer with SDKs" },
      { href: "/products/rfid-readers/", label: "Browse RFID readers" },
    ],
    researchLinks: [
      { href: "/guides/rfid-reader-writer-selection/", label: "RFID reader and writer selection guide" },
      { href: "/guides/hotel-key-card-encoding/", label: "Hotel key card encoding guide" },
      { href: "/solutions/hotel-key-cards/", label: "Hotel key card solution page" },
      { href: "/solutions/nfc-business-card/", label: "NFC business card solution page" },
    ],
    faq: [
      {
        question: "What should decide the first RFID reader shortlist?",
        answer:
          "The first shortlist should come from the exact card or tag family, host environment and integration workflow the team needs to support rather than from the reader brand or enclosure style alone.",
      },
      {
        question: "Why do reader projects stall so often after purchase?",
        answer:
          "They often stall because teams choose hardware before defining the software environment, the real credential set and the operating workflow the reader must support.",
      },
    ],
    primaryAction: { href: "/contact/rfid-readers/", label: "Request reader guidance" },
    secondaryActions: [
      { href: "/products/rfid-readers/", label: "Browse RFID readers" },
      { href: "/guides/", label: "Browse buying guides" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildComparisonPageDefinition({
    route: "/compare/hf-vs-uhf-rfid-for-asset-tracking/",
    title: "HF Vs UHF RFID For Asset Tracking",
    summary:
      "This comparison helps asset-tracking teams decide whether HF or UHF fits the real read distance, item density and deployment environment before labels, readers and middleware are selected too broadly.",
    heroPoints: [
      "Read distance and workflow control usually decide the first frequency shortlist fastest.",
      "Surface, environment and item density matter just as much as the tag price.",
      "The best pilot validates reader behavior, placement and software flow together.",
    ],
    imageAlt: "HF versus UHF RFID asset tracking comparison",
    imageSourceRoutes: ["/product/rfid-tag-with-led-light/", "/products/rfid-labels/", "/products/rfid-tags/"],
    table: {
      columns: ["Frequency path", "Best fit", "Main strengths", "Watch-outs"],
      rows: [
        ["HF RFID", "Controlled close-range scans, tap workflows and denser item environments", "More deliberate reads and easier user-controlled presentation in many workflows", "Shorter read range and less suitable when bulk reads or gates matter most"],
        ["UHF RFID", "Longer-range asset visibility, portal reads and faster multi-item capture", "Better fit for hands-free or wider-area reading workflows", "More environment tuning and placement discipline are often needed up front"],
      ],
    },
    decidingBullets: [
      "Start with the real read distance, operator behavior and whether the workflow needs close control or faster bulk capture.",
      "Treat metal, liquid, shelving and item density as frequency-level decision points, not later tag-only details.",
      "Use the software and process design to decide whether deliberate scans or wider-area reads make more sense.",
    ],
    samplingBullets: [
      "Pilot one realistic HF path and one realistic UHF path only when both still fit the workflow.",
      "Test tags, readers and placement in the real environment before large label or reader purchases begin.",
      "Measure read accuracy, operator friction and middleware fit together so the winning path is commercially usable.",
    ],
    internalLinks: [
      { href: "/solutions/rfid-asset-tracking-labels/", label: "RFID asset-tracking labels solution" },
      { href: "/compare/on-metal-nfc-labels-vs-standard-nfc-stickers/", label: "On-metal vs standard label comparison" },
      { href: "/products/rfid-labels/", label: "Browse RFID labels" },
      { href: "/products/rfid-tags/", label: "Browse RFID tags" },
      { href: "/contact/rfid-labels-tags/", label: "RFID labels inquiry page" },
    ],
    referenceLinks: [],
    faq: [
      {
        question: "Is UHF automatically better for asset tracking because the range is longer?",
        answer:
          "No. UHF is attractive when longer-range or multi-item reads matter, but HF can still be the better fit when the workflow wants tighter user-controlled scans or denser item environments.",
      },
      {
        question: "What should be tested before choosing HF or UHF?",
        answer:
          "The most useful tests cover the real environment, item density, placement options, read distance and the software flow the operators will actually use.",
      },
    ],
    primaryAction: { href: "/contact/rfid-labels-tags/", label: "Request asset-tracking guidance" },
    secondaryActions: [
      { href: "/products/rfid-labels/", label: "Browse RFID labels" },
      { href: "/products/rfid-tags/", label: "Browse RFID tags" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildCompatibilityPageDefinition({
    route: "/compatibility/vingcard-hotel-key-cards/",
    title: "VingCard Hotel Key Cards Compatibility Guide",
    summary:
      "Use this page when the property already knows it needs VingCard-compatible hotel key cards and wants a faster path into the right chip, card material and sample plan.",
    imageAlt: "VingCard hotel key card compatibility",
    imageSourceRoutes: ["/product/hotel-key-cards/", "/product/printed-rfid-cards/"],
    bestFit: [
      "Hotels replacing VingCard-compatible guest card stock without widening the scope into a full access-system change.",
      "Properties comparing baseline compatible cards with branded, eco or premium material upgrades.",
      "Teams that want a compatibility-first sample plan before discussing larger rollout pricing.",
    ],
    whatToSend: [
      "VingCard lock, encoder or system reference, or a current guest card sample from the property.",
      "Known chip family, encoding notes and whether the project still involves magstripe or a legacy transition path.",
      "Need for plain stock, printed cards, numbering, pre-encoding or a premium material option.",
    ],
    testChecklist: [
      "Validate the baseline compatible card on the real lock estate before artwork or premium finishes take over the discussion.",
      "Confirm front-desk issue flow, replacement handling and any encoding support in the same pilot.",
      "Keep one conservative card path in scope even if the property plans to move into wood, PLA or other upgrades later.",
    ],
    productLinks: [
      { href: "/product/hotel-key-cards/", label: "Hotel key cards" },
      { href: "/product/printed-rfid-cards/", label: "Printed RFID cards" },
      { href: "/compare/pvc-vs-wood-vs-pla-hotel-key-cards/", label: "Hotel card material comparison" },
      { href: "/guides/hotel-key-card-encoding/", label: "Hotel key card encoding guide" },
    ],
    referenceLinks: [{ href: "https://www.vingcard.com/en/", label: "VingCard hospitality access" }],
    faq: [
      {
        question: "What helps a VingCard compatibility request move fastest?",
        answer:
          "The fastest requests usually include a current guest card sample or a clear VingCard lock or encoder reference plus notes on chip, encoding and whether the property wants plain or printed cards.",
      },
      {
        question: "Should VingCard projects start with premium card materials?",
        answer:
          "Usually no. It is safer to prove the baseline compatible card path first, then expand into premium materials once the estate and issue flow are already validated.",
      },
    ],
    primaryAction: { href: "/contact/hotel-rfid/", label: "Check VingCard card compatibility" },
  }),
  buildGuidePageDefinition({
    route: "/guides/rfid-reader-writer-selection/",
    title: "How To Choose RFID Readers And Writers",
    kicker: "Reader Guide",
    summary:
      "This guide helps buyers choose RFID readers and writers more practically by tying the hardware shortlist back to tag protocol, host environment and the real enrollment or issuance workflow.",
    heroPoints: [
      "The right reader follows the cards, tags and software workflow, not the other way around.",
      "SDK, driver and interface fit usually matter earlier than enclosure design.",
      "A small proof-of-workflow is more useful than a broad hardware wish list.",
    ],
    imageAlt: "RFID reader and writer selection guide",
    imageSourceRoutes: ["/product/acr122u/", "/product/nfc-reader-writer-with-free-sdks/", "/products/rfid-readers/"],
    coverageBullets: [
      "How protocol, interface and host environment shape the first hardware shortlist.",
      "How to separate lab testing, desktop issuance and live deployment reader needs.",
      "What to validate in a reader pilot before larger hardware or software commitments start.",
    ],
    workflowBullets: [
      "List the exact card or tag families the reader must support first.",
      "Confirm the host environment, SDK expectations and any operating system constraints.",
      "Choose the reader form factor only after the workflow and read distance are already clear.",
      "Pilot the reader on the real credentials and in the real operator workflow before scaling.",
    ],
    mistakeBullets: [
      "Choosing the cheapest reader before defining the card, tag or software environment.",
      "Mixing HF, NFC and UHF assumptions in the same shortlist without a real use case for each.",
      "Treating SDK or driver support as an afterthought once the hardware has already been purchased.",
    ],
    resourceLinks: [
      { href: "/solutions/rfid-readers-and-encoding/", label: "RFID readers and encoding solution page" },
      { href: "/product/acr122u/", label: "ACR122U NFC reader" },
      { href: "/product/nfc-reader-writer-with-free-sdks/", label: "NFC reader writer with SDKs" },
      { href: "/guides/hotel-key-card-encoding/", label: "Hotel key card encoding guide" },
    ],
    faq: [
      {
        question: "What should decide the first RFID reader test purchase?",
        answer:
          "The first test purchase should be driven by the exact credential family, host environment and workflow the team wants to validate rather than by generic feature lists.",
      },
      {
        question: "When does a reader shortlist go wrong most often?",
        answer:
          "It usually goes wrong when teams buy hardware before confirming protocol fit, SDK needs and whether the reader is for testing, issuance or live operational use.",
      },
    ],
    primaryAction: { href: "/contact/rfid-readers/", label: "Ask for reader and writer guidance" },
    secondaryActions: [
      { href: "/products/rfid-readers/", label: "Browse RFID readers" },
      { href: "/solutions/", label: "Browse solution pages" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildGuidePageDefinition({
    route: "/guides/nfc-business-card-iphone-android-compatibility/",
    title: "NFC Business Card iPhone And Android Compatibility Guide",
    kicker: "Phone Compatibility Guide",
    summary:
      "This guide helps teams launch NFC business cards with fewer support issues by focusing on iPhone and Android behavior, redirect setup and the need for a reliable QR fallback.",
    heroPoints: [
      "A simple web-link workflow usually scales better than a more complex payload.",
      "Phone compatibility should be tested on the real device mix, not assumed from one successful tap.",
      "QR fallback remains valuable even when the NFC experience works well.",
    ],
    imageAlt: "NFC business card phone compatibility planning",
    imageSourceRoutes: ["/product/nfc-business-card/", "/product/metal-nfc-card/", "/product/wooden-rfid-card/"],
    coverageBullets: [
      "How iPhone and Android behavior changes the safest landing-page and redirect strategy.",
      "Why chip choice, QR fallback and editable links matter in a real business-card rollout.",
      "What to test before ordering premium materials for a team-wide NFC card program.",
    ],
    workflowBullets: [
      "Choose the landing page or profile URL that the card should open first.",
      "Keep the encoded action simple and add a visible QR fallback for edge cases.",
      "Test the tap flow across representative iPhone and Android devices in the real handoff moment.",
      "Only move into premium materials or wider rollout once the phone behavior is stable enough.",
    ],
    mistakeBullets: [
      "Encoding an overcomplicated payload when a clean web redirect would work better.",
      "Assuming all Android phones behave the same way because one test device worked.",
      "Launching premium materials before the team has validated the live phone experience and fallback path.",
    ],
    resourceLinks: [
      { href: "/solutions/nfc-business-card/", label: "NFC business card solution page" },
      { href: "/compare/ntag213-vs-ntag215-vs-ntag216/", label: "NTAG chip comparison" },
      { href: "/compare/metal-vs-wood-vs-pvc-nfc-business-cards/", label: "NFC card material comparison" },
      { href: "/product/nfc-business-card/", label: "NFC business card product page" },
    ],
    faq: [
      {
        question: "Do NFC business cards need a QR fallback?",
        answer:
          "In most real rollouts, yes. A QR fallback keeps the handoff usable when a phone is not tapped correctly, NFC is disabled or the user simply prefers to scan.",
      },
      {
        question: "What should be tested before a larger NFC business card order?",
        answer:
          "The team should test the live tap flow, iPhone and Android behavior, the landing-page experience and the QR fallback in the real networking moment before scaling the order.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Ask about phone compatibility" },
    secondaryActions: [
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/guides/", label: "Browse buying guides" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildSolutionLaunchDefinition({
    route: "/solutions/google-review-cards-for-restaurants/",
    title: "Google Review NFC Cards For Restaurants",
    kicker: "Restaurant Review Solution",
    summary:
      "Use this page when a restaurant, cafe or bar wants more Google reviews from in-person traffic and needs to decide whether a tap card, table prompt or mixed review format fits the real guest moment best.",
    heroPoints: [
      "The best restaurant review format follows the guest handoff moment, not just the printed design.",
      "Tap cards, QR stands and stickers each work differently at the table, counter and takeaway pickup.",
      "A small live pilot usually reveals more than broad assumptions about staff prompting or phone behavior.",
    ],
    imageAlt: "Google review card planning for restaurants",
    imageSourceRoutes: ["/product/google-review-nfc-card/", "/product/nfc-stickers/", "/product/nfc-business-card/"],
    bestFor: [
      "Restaurants, cafes and bars asking for more reviews at checkout or table-side.",
      "Multi-location food brands that want a cleaner, more repeatable review prompt format.",
      "Teams comparing premium tap cards with lower-cost stickers or tabletop prompts.",
    ],
    whatToConfirm: [
      "Whether the review prompt happens at the table, counter, pickup area or after payment.",
      "Google Business Profile review link ownership, redirect control and the need for editable URLs.",
      "Phone mix, staff prompting style and whether customers naturally tap, scan or ignore a static prompt.",
      "Pilot quantity, location count and whether the rollout needs branded packaging or table-ready formats.",
    ],
    productLinks: [
      { href: "/product/google-review-nfc-card/", label: "Google review NFC card" },
      { href: "/product/nfc-stickers/", label: "NFC stickers" },
      { href: "/product/nfc-business-card/", label: "NFC business card" },
    ],
    researchLinks: [
      { href: "/solutions/google-review-nfc-card/", label: "Google review NFC card guide" },
      { href: "/compare/nfc-review-card-vs-qr-review-stand/", label: "NFC review card vs QR review stand" },
      { href: "/compare/google-review-nfc-card-vs-nfc-sticker/", label: "Google review card vs NFC sticker" },
      { href: "/guides/google-review-nfc-card-setup/", label: "Google review NFC card setup guide" },
    ],
    faq: [
      {
        question: "What usually works best for restaurants asking for reviews?",
        answer:
          "It depends on the actual guest handoff moment. Some restaurants perform better with a hand-delivered tap card, while others get more consistent results from a counter or tabletop prompt.",
      },
      {
        question: "Should restaurants start with a large review-card rollout?",
        answer:
          "Usually no. A smaller pilot across one or a few locations is more useful because it shows which placement and staff prompt actually creates review completions.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Request restaurant review card guidance" },
    secondaryActions: [
      { href: "/compare/", label: "Browse comparison pages" },
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildSolutionLaunchDefinition({
    route: "/solutions/google-review-cards-for-hotels/",
    title: "Google Review NFC Cards For Hotels",
    kicker: "Hotel Review Solution",
    summary:
      "This page is for hotels and resorts that want more Google reviews from real guest interactions and need to decide where a review card, sticker or QR prompt belongs in the guest journey.",
    heroPoints: [
      "Hotel review prompts work best when they match check-in, checkout or concierge moments that already exist.",
      "Phone behavior, redirect control and branding all matter, but placement and staff workflow usually decide the first pilot most.",
      "Review tools should feel like part of the guest experience, not an awkward extra step at the desk.",
    ],
    imageAlt: "Google review card planning for hotels",
    imageSourceRoutes: ["/product/google-review-nfc-card/", "/product/nfc-stickers/", "/product/hotel-key-cards/"],
    bestFor: [
      "Hotels, resorts and serviced apartments collecting more guest reviews at checkout or concierge touchpoints.",
      "Hospitality teams that want branded review cards instead of ad hoc printed QR sheets.",
      "Groups testing whether a front-desk card, room prompt or amenity-area sticker creates better guest response.",
    ],
    whatToConfirm: [
      "Where the review prompt should appear: front desk, concierge, room wallet, shuttle desk or amenity zone.",
      "Live review link control, QR fallback and whether each property needs location-specific routing.",
      "Guest phone mix, staff handoff behavior and how premium the prompt needs to feel in the brand experience.",
      "Pilot quantity, property count and whether the rollout includes multiple hotels or one flagship location first.",
    ],
    productLinks: [
      { href: "/product/google-review-nfc-card/", label: "Google review NFC card" },
      { href: "/product/nfc-stickers/", label: "NFC stickers" },
      { href: "/product/hotel-key-cards/", label: "Hotel key cards" },
    ],
    researchLinks: [
      { href: "/solutions/google-review-nfc-card/", label: "Google review NFC card guide" },
      { href: "/compare/nfc-review-card-vs-qr-review-stand/", label: "NFC review card vs QR review stand" },
      { href: "/compare/google-review-nfc-card-vs-nfc-sticker/", label: "Google review card vs NFC sticker" },
      { href: "/guides/google-review-nfc-card-setup/", label: "Google review NFC card setup guide" },
    ],
    faq: [
      {
        question: "Where do hotel review cards usually work best?",
        answer:
          "They usually work best at checkout, concierge or other service moments where staff already interacts with guests and can naturally invite a review.",
      },
      {
        question: "Should hotels use the same review prompt format everywhere?",
        answer:
          "Not always. Some hotels do better with a desk-delivered card, while others benefit more from a static QR or sticker prompt in a specific guest area.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Request hotel review card guidance" },
    secondaryActions: [
      { href: "/compare/", label: "Browse comparison pages" },
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildSolutionLaunchDefinition({
    route: "/solutions/google-review-cards-for-clinics/",
    title: "Google Review NFC Cards For Clinics",
    kicker: "Clinic Review Solution",
    summary:
      "Use this page when clinics, dental practices or med-spa teams want more Google reviews and need a lower-friction way to prompt patients after check-in, checkout or treatment completion.",
    heroPoints: [
      "Clinic review prompts work best when they respect patient flow and do not interrupt the service experience.",
      "Acrylic review cards, countertop prompts and stickers each fit different reception and checkout setups.",
      "The first pilot should test staff handoff, patient phone behavior and the actual review completion moment together.",
    ],
    imageAlt: "Google review card planning for clinics",
    imageSourceRoutes: ["/product/google-review-nfc-card/", "/product/nfc-stickers/", "/product/nfc-business-card/"],
    bestFor: [
      "Clinics, dental offices, med-spas and specialist practices collecting reviews after successful visits.",
      "Healthcare teams that want a branded, cleaner prompt instead of paper QR signs at reception.",
      "Operators comparing desk-delivered review cards with a more static counter prompt.",
    ],
    whatToConfirm: [
      "Whether the review ask happens at reception, payment desk, consultation room exit or follow-up desk.",
      "Google review link control, privacy expectations and whether every location needs its own routing path.",
      "Phone mix, patient handoff behavior and whether staff can naturally invite a tap or scan after service.",
      "Pilot quantity, number of practices and whether the rollout includes several departments or one front desk first.",
    ],
    productLinks: [
      { href: "/product/google-review-nfc-card/", label: "Google review NFC card" },
      { href: "/product/nfc-stickers/", label: "NFC stickers" },
      { href: "/product/nfc-business-card/", label: "NFC business card" },
    ],
    researchLinks: [
      { href: "/solutions/google-review-nfc-card/", label: "Google review NFC card guide" },
      { href: "/compare/nfc-review-card-vs-qr-review-stand/", label: "NFC review card vs QR review stand" },
      { href: "/compare/google-review-nfc-card-vs-nfc-sticker/", label: "Google review card vs NFC sticker" },
      { href: "/guides/google-review-nfc-card-setup/", label: "Google review NFC card setup guide" },
    ],
    faq: [
      {
        question: "Where do clinic review cards usually work best?",
        answer:
          "They usually work best at a calm checkout or reception moment where staff can naturally invite feedback without slowing patient flow or interrupting care.",
      },
      {
        question: "Should clinics use a card or sticker first?",
        answer:
          "That depends on the reception workflow. A delivered card often works better in guided interactions, while a sticker can fit a stable desk prompt when staff involvement is lighter.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Request clinic review card guidance" },
    secondaryActions: [
      { href: "/compare/", label: "Browse comparison pages" },
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildSolutionLaunchDefinition({
    route: "/solutions/google-review-cards-for-salons-and-spas/",
    title: "Google Review NFC Cards For Salons And Spas",
    kicker: "Salon Review Solution",
    summary:
      "This page is for salons, spas and beauty studios that want more Google reviews from happy clients and need a branded prompt format that feels natural at reception, mirror stations or checkout.",
    heroPoints: [
      "Beauty and wellness review prompts work best when they feel like part of the brand experience, not a hard sales ask.",
      "Card, stand and sticker formats each suit different salon layouts and staff habits.",
      "The first pilot should test the real moment clients are most likely to respond positively after service.",
    ],
    imageAlt: "Google review card planning for salons and spas",
    imageSourceRoutes: ["/product/google-review-nfc-card/", "/product/nfc-stickers/", "/product/metal-nfc-card/"],
    bestFor: [
      "Hair salons, nail studios, spas and beauty clinics asking for more reviews after service.",
      "Brands that want a premium-looking review prompt instead of a plain QR printout at reception.",
      "Operators comparing a staff-delivered card with static prompts at mirrors, counters or waiting areas.",
    ],
    whatToConfirm: [
      "Whether the review ask happens at checkout, reception, mirror stations or membership follow-up points.",
      "Need for premium design, QR fallback and whether the review card should also support a social or booking link later.",
      "Phone mix, staff prompting style and whether clients are more likely to tap, scan or take the card away mentally first.",
      "Pilot quantity, number of locations and whether the rollout is for a flagship salon or a chain.",
    ],
    productLinks: [
      { href: "/product/google-review-nfc-card/", label: "Google review NFC card" },
      { href: "/product/nfc-stickers/", label: "NFC stickers" },
      { href: "/product/metal-nfc-card/", label: "Metal NFC card" },
    ],
    researchLinks: [
      { href: "/solutions/google-review-nfc-card/", label: "Google review NFC card guide" },
      { href: "/compare/nfc-review-card-vs-qr-review-stand/", label: "NFC review card vs QR review stand" },
      { href: "/compare/google-review-nfc-card-vs-nfc-sticker/", label: "Google review card vs NFC sticker" },
      { href: "/guides/google-review-nfc-card-setup/", label: "Google review NFC card setup guide" },
    ],
    faq: [
      {
        question: "Why do review cards often suit salons and spas well?",
        answer:
          "They often suit salons and spas because the card can feel more premium and intentional, which matches brand positioning better than a low-cost improvised sign.",
      },
      {
        question: "Should salons test static prompts as well as hand-delivered cards?",
        answer:
          "Yes. Many teams learn the most by testing one staff-delivered prompt and one static prompt in the same location before scaling a format chain-wide.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Request salon review card guidance" },
    secondaryActions: [
      { href: "/compare/", label: "Browse comparison pages" },
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildSolutionLaunchDefinition({
    route: "/solutions/google-review-cards-for-retail-stores/",
    title: "Google Review NFC Cards For Retail Stores",
    kicker: "Retail Review Solution",
    summary:
      "Use this page when retail teams want more Google reviews from in-store shoppers and need a review prompt that works at the counter, product handoff or bagging area without slowing checkout.",
    heroPoints: [
      "Retail review prompts succeed when they fit fast counter interactions and predictable shopper flow.",
      "Cards and stickers solve different needs across cashier desks, display counters and pickup points.",
      "The first rollout should test real shopper behavior, not just whether the design looks visible enough.",
    ],
    imageAlt: "Google review card planning for retail stores",
    imageSourceRoutes: ["/product/google-review-nfc-card/", "/product/nfc-stickers/", "/product/nfc-business-card/"],
    bestFor: [
      "Retail counters, boutiques, showrooms and pickup desks asking for more local reviews.",
      "Brands that want a cleaner review prompt than paper QR codes taped to the till area.",
      "Teams comparing tap cards, countertop signs and sticker placements by store type.",
    ],
    whatToConfirm: [
      "Where the review ask happens: cashier desk, product handoff, click-and-collect counter or service area.",
      "Review link control, QR fallback and whether each store needs its own location-specific review route.",
      "Phone mix, shopper dwell time and whether staff has time to introduce the prompt naturally.",
      "Pilot quantity, store count and whether the first rollout targets one location type or several formats.",
    ],
    productLinks: [
      { href: "/product/google-review-nfc-card/", label: "Google review NFC card" },
      { href: "/product/nfc-stickers/", label: "NFC stickers" },
      { href: "/product/nfc-business-card/", label: "NFC business card" },
    ],
    researchLinks: [
      { href: "/solutions/google-review-nfc-card/", label: "Google review NFC card guide" },
      { href: "/compare/google-review-nfc-card-vs-nfc-sticker/", label: "Google review card vs NFC sticker" },
      { href: "/compare/nfc-review-card-vs-qr-review-stand/", label: "NFC review card vs QR review stand" },
      { href: "/guides/google-review-nfc-card-setup/", label: "Google review NFC card setup guide" },
    ],
    faq: [
      {
        question: "What usually works best for retail review prompts?",
        answer:
          "The best format depends on how quickly the shopper moves through the counter and whether staff can naturally point to the prompt at the end of the purchase.",
      },
      {
        question: "Should retail teams start with stickers or review cards?",
        answer:
          "They should start with the format that matches the checkout behavior best, and many teams learn fastest by testing one card and one sticker in live store conditions.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Request retail review card guidance" },
    secondaryActions: [
      { href: "/compare/", label: "Browse comparison pages" },
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildSolutionLaunchDefinition({
    route: "/solutions/google-review-cards-for-gyms-and-fitness-studios/",
    title: "Google Review NFC Cards For Gyms And Fitness Studios",
    kicker: "Fitness Review Solution",
    summary:
      "This page is for gyms, yoga studios and fitness clubs that want more Google reviews from active members and need a review prompt that fits reception, class check-in or post-session interaction without feeling awkward.",
    heroPoints: [
      "Fitness review prompts work best when they align with reception and member check-out moments that already exist.",
      "Cards, stickers and desk prompts each fit different club layouts and member flow.",
      "The first pilot should test member response at peak and off-peak times, not only in a quiet sample window.",
    ],
    imageAlt: "Google review card planning for gyms and fitness studios",
    imageSourceRoutes: ["/product/google-review-nfc-card/", "/product/nfc-stickers/", "/product/rfid-silicone-wristbands/"],
    bestFor: [
      "Gyms, yoga studios, pilates clubs and fitness centers asking for more local reviews from active members.",
      "Membership teams that want a branded prompt at reception or check-out instead of improvised paper signage.",
      "Operators comparing front-desk cards with static prompts near exits, smoothie bars or service counters.",
    ],
    whatToConfirm: [
      "Whether the review ask should happen at reception, class exit, membership desk or another natural service touchpoint.",
      "Review link control, QR fallback and whether the club wants one review path or location-specific routing.",
      "Member phone behavior, staff prompting style and how busy the peak-time interaction moment becomes.",
      "Pilot quantity, number of clubs and whether the rollout starts in one studio format or a broader network.",
    ],
    productLinks: [
      { href: "/product/google-review-nfc-card/", label: "Google review NFC card" },
      { href: "/product/nfc-stickers/", label: "NFC stickers" },
      { href: "/product/rfid-silicone-wristbands/", label: "RFID silicone wristbands" },
    ],
    researchLinks: [
      { href: "/solutions/google-review-nfc-card/", label: "Google review NFC card guide" },
      { href: "/compare/google-review-nfc-card-vs-nfc-sticker/", label: "Google review card vs NFC sticker" },
      { href: "/compare/nfc-review-card-vs-qr-review-stand/", label: "NFC review card vs QR review stand" },
      { href: "/guides/google-review-nfc-card-setup/", label: "Google review NFC card setup guide" },
    ],
    faq: [
      {
        question: "Where should gyms place review cards first?",
        answer:
          "They usually start best at reception or another staffed checkout moment where members are already stopping briefly and staff can naturally introduce the prompt.",
      },
      {
        question: "Do gyms need a different review format than restaurants or retail?",
        answer:
          "Often yes, because member flow, peak-time pressure and club layout change how practical a card or sticker prompt will be in daily use.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Request gym review card guidance" },
    secondaryActions: [
      { href: "/compare/", label: "Browse comparison pages" },
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildSolutionLaunchDefinition({
    route: "/solutions/google-review-cards-for-front-desks/",
    title: "Google Review NFC Cards For Front Desks",
    kicker: "Front Desk Review Solution",
    summary:
      "Use this page when the review prompt is meant to live at a front desk or reception point and the main question is how to make the ask feel natural without slowing check-in or checkout flow.",
    heroPoints: [
      "Front-desk review prompts succeed when they fit the service handoff already happening at reception.",
      "A delivered review card, countertop stand or sticker each changes how staff introduces the ask.",
      "The first pilot should test queue pressure, staff behavior and guest phone response together.",
    ],
    imageAlt: "Google review card planning for front desks",
    imageSourceRoutes: ["/product/google-review-nfc-card/", "/product/nfc-stickers/", "/product/nfc-business-card/"],
    bestFor: [
      "Hotels, clinics, salons, gyms and other service businesses with a defined reception or front-desk point.",
      "Teams that want a review prompt to feel guided rather than left as a passive sign.",
      "Operators comparing a staff-delivered card with a fixed desk prompt near reception.",
    ],
    whatToConfirm: [
      "How busy the front desk gets and whether staff can naturally introduce the review prompt.",
      "Whether the review link should be shared through a card handoff, a desk stand or a sticker on the counter.",
      "Phone mix, QR fallback and whether guests tend to stop long enough to tap or scan at reception.",
      "Pilot quantity, number of desks and whether the rollout starts with one flagship location first.",
    ],
    productLinks: [
      { href: "/product/google-review-nfc-card/", label: "Google review NFC card" },
      { href: "/product/nfc-stickers/", label: "NFC stickers" },
      { href: "/product/nfc-business-card/", label: "NFC business card" },
    ],
    researchLinks: [
      { href: "/solutions/google-review-nfc-card/", label: "Google review NFC card guide" },
      { href: "/compare/nfc-review-card-vs-qr-review-stand/", label: "NFC review card vs QR review stand" },
      { href: "/compare/google-review-nfc-card-vs-nfc-sticker/", label: "Google review card vs NFC sticker" },
      { href: "/guides/google-review-nfc-card-setup/", label: "Google review NFC card setup guide" },
    ],
    faq: [
      {
        question: "What works best at a front desk: a card or a fixed prompt?",
        answer:
          "That depends on how staff interacts with customers. A delivered card often works better in guided service moments, while a fixed prompt can suit desks where staff cannot reliably add another handoff step.",
      },
      {
        question: "What should a front-desk pilot measure first?",
        answer:
          "It should measure staff willingness to prompt, customer phone behavior, queue pressure and whether the review action fits naturally into the reception workflow.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Request front-desk review card guidance" },
    secondaryActions: [
      { href: "/compare/", label: "Browse comparison pages" },
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildSolutionLaunchDefinition({
    route: "/solutions/google-review-cards-for-checkout-counters/",
    title: "Google Review NFC Cards For Checkout Counters",
    kicker: "Checkout Review Solution",
    summary:
      "This page is for businesses that want to ask for Google reviews right at checkout and need a prompt format that works in a short, high-speed payment moment without creating friction.",
    heroPoints: [
      "Checkout review prompts must fit a fast, transactional moment with minimal extra explanation.",
      "Cards, stickers and stands each change how visible and actionable the review prompt becomes at the counter.",
      "The first pilot should test actual completion, not just whether the prompt looks noticeable enough to staff.",
    ],
    imageAlt: "Google review card planning for checkout counters",
    imageSourceRoutes: ["/product/google-review-nfc-card/", "/product/nfc-stickers/", "/product/nfc-business-card/"],
    bestFor: [
      "Retail counters, restaurant tills, salon checkouts and service desks asking for more local reviews.",
      "Teams that want a branded review prompt instead of a paper QR sign near payment terminals.",
      "Operators comparing a quick tap card handoff with a fixed prompt visible during payment.",
    ],
    whatToConfirm: [
      "How long customers stop at checkout and whether staff can introduce the review prompt naturally.",
      "Whether the best format is a hand-delivered card, a sticker on the till area or a small stand on the counter.",
      "Phone mix, QR fallback and how often customers have free hands during payment or bagging.",
      "Pilot quantity, number of counters and whether different store or counter types need separate tests.",
    ],
    productLinks: [
      { href: "/product/google-review-nfc-card/", label: "Google review NFC card" },
      { href: "/product/nfc-stickers/", label: "NFC stickers" },
      { href: "/product/nfc-business-card/", label: "NFC business card" },
    ],
    researchLinks: [
      { href: "/solutions/google-review-nfc-card/", label: "Google review NFC card guide" },
      { href: "/compare/google-review-nfc-card-vs-nfc-sticker/", label: "Google review card vs NFC sticker" },
      { href: "/compare/nfc-review-card-vs-qr-review-stand/", label: "NFC review card vs QR review stand" },
      { href: "/guides/google-review-nfc-card-setup/", label: "Google review NFC card setup guide" },
    ],
    faq: [
      {
        question: "What usually works best at checkout: a card or a sticker?",
        answer:
          "It depends on whether staff can reliably hand over a card and whether the customer has enough time and free attention to tap or scan during payment.",
      },
      {
        question: "What should be tested first at a checkout counter?",
        answer:
          "The best first test measures customer response, payment-speed impact, staff prompting comfort and whether the phone interaction actually fits the counter workflow.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Request checkout review card guidance" },
    secondaryActions: [
      { href: "/compare/", label: "Browse comparison pages" },
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildSolutionLaunchDefinition({
    route: "/solutions/google-review-cards-for-tabletop-prompts/",
    title: "Google Review NFC Cards For Tabletop Prompts",
    kicker: "Tabletop Review Solution",
    summary:
      "Use this page when the review prompt is meant to sit on a table, counter surface or waiting-area stand and the goal is to make it visible enough to drive taps or scans without staff explaining every time.",
    heroPoints: [
      "Tabletop prompts depend on placement, design clarity and how obvious the action feels without staff help.",
      "Acrylic cards, mini stands and sticker-backed prompts each solve different surface and visibility problems.",
      "The first pilot should test where customers naturally notice and act on the prompt, not just where the team wants it to sit.",
    ],
    imageAlt: "Google review card planning for tabletop prompts",
    imageSourceRoutes: ["/product/google-review-nfc-card/", "/product/nfc-stickers/", "/product/metal-nfc-card/"],
    bestFor: [
      "Restaurants, cafes, hotel lounges, salons and waiting areas where a review prompt sits in a fixed visible position.",
      "Teams that want the review prompt to work without a staff handoff every time.",
      "Operators comparing a small acrylic card, desk stand or fixed sticker prompt on a surface.",
    ],
    whatToConfirm: [
      "Which surfaces are realistic: table tops, reception counters, waiting-room side tables or service desks.",
      "How visible the prompt needs to be, whether it should include QR fallback and how much space is available.",
      "Phone mix, tap comfort and whether customers are likely to pick up the card or only notice a fixed prompt.",
      "Pilot quantity, number of surfaces and whether several placement spots should be tested in parallel.",
    ],
    productLinks: [
      { href: "/product/google-review-nfc-card/", label: "Google review NFC card" },
      { href: "/product/nfc-stickers/", label: "NFC stickers" },
      { href: "/product/metal-nfc-card/", label: "Metal NFC card" },
    ],
    researchLinks: [
      { href: "/solutions/google-review-nfc-card/", label: "Google review NFC card guide" },
      { href: "/compare/nfc-review-card-vs-qr-review-stand/", label: "NFC review card vs QR review stand" },
      { href: "/compare/google-review-nfc-card-vs-nfc-sticker/", label: "Google review card vs NFC sticker" },
      { href: "/guides/google-review-nfc-card-setup/", label: "Google review NFC card setup guide" },
    ],
    faq: [
      {
        question: "What matters most for a tabletop review prompt?",
        answer:
          "Placement and clarity usually matter most, because the prompt often has to work without staff explanation and must attract attention on its own.",
      },
      {
        question: "Should a tabletop prompt always be a rigid card?",
        answer:
          "Not always. A rigid card can feel more premium, but a sticker or integrated stand can be better when the surface, cleaning routine or available space changes the practical fit.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Request tabletop review card guidance" },
    secondaryActions: [
      { href: "/compare/", label: "Browse comparison pages" },
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildSolutionLaunchDefinition({
    route: "/solutions/google-review-cards-for-pickup-counters/",
    title: "Google Review NFC Cards For Pickup Counters",
    kicker: "Pickup Counter Review Solution",
    summary:
      "This page is for takeaway, click-and-collect and service-pickup counters where the review prompt has to fit a short handoff moment without blocking order collection or creating confusion.",
    heroPoints: [
      "Pickup counters need a review prompt that works in a short, practical handoff moment.",
      "Cards and stickers solve different problems depending on how much space and staff attention the counter really has.",
      "The first pilot should test order flow, queue pressure and customer response during pickup, not only in a quiet sample period.",
    ],
    imageAlt: "Google review card planning for pickup counters",
    imageSourceRoutes: ["/product/google-review-nfc-card/", "/product/nfc-stickers/", "/product/nfc-business-card/"],
    bestFor: [
      "Takeaway, click-and-collect, bakery, pharmacy and service counters where customers collect items quickly.",
      "Teams that want a review prompt to fit the pickup handoff without slowing queue movement.",
      "Operators comparing a small delivered review card with a fixed sticker or sign at the pickup zone.",
    ],
    whatToConfirm: [
      "How fast the pickup handoff is and whether staff can realistically introduce a review prompt.",
      "Whether a delivered card, sticker or stand is the most practical format in the available counter space.",
      "Phone mix, QR fallback and whether customers usually have enough free attention during collection to tap or scan.",
      "Pilot quantity, number of pickup stations and whether several service formats need separate tests.",
    ],
    productLinks: [
      { href: "/product/google-review-nfc-card/", label: "Google review NFC card" },
      { href: "/product/nfc-stickers/", label: "NFC stickers" },
      { href: "/product/nfc-business-card/", label: "NFC business card" },
    ],
    researchLinks: [
      { href: "/solutions/google-review-nfc-card/", label: "Google review NFC card guide" },
      { href: "/compare/google-review-nfc-card-vs-nfc-sticker/", label: "Google review card vs NFC sticker" },
      { href: "/compare/nfc-review-card-vs-qr-review-stand/", label: "NFC review card vs QR review stand" },
      { href: "/guides/google-review-nfc-card-setup/", label: "Google review NFC card setup guide" },
    ],
    faq: [
      {
        question: "What usually works best at pickup counters?",
        answer:
          "The best format depends on how brief the pickup moment is and whether staff has enough time to point out the prompt or whether it must work as a visible self-serve cue.",
      },
      {
        question: "Why should pickup counters test format before scaling?",
        answer:
          "Because queue speed, handoff pressure and customer attention at pickup often behave very differently from a normal checkout or seated service environment.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Request pickup review card guidance" },
    secondaryActions: [
      { href: "/compare/", label: "Browse comparison pages" },
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildComparisonPageDefinition({
    route: "/compare/google-review-nfc-card-vs-nfc-sticker/",
    title: "Google Review NFC Card Vs NFC Sticker",
    summary:
      "This comparison helps businesses decide whether a handheld review card or a fixed NFC sticker fits the real customer interaction moment better before they order a larger branded batch.",
    heroPoints: [
      "Cards and stickers solve different placement and customer-behavior problems.",
      "The best first format depends on whether staff hands over the prompt or the customer discovers it on a surface.",
      "Many businesses learn the right answer fastest by testing one card and one sticker in the same live environment.",
    ],
    imageAlt: "Google review NFC card versus NFC sticker comparison",
    imageSourceRoutes: ["/product/google-review-nfc-card/", "/product/nfc-stickers/", "/product/nfc-business-card/"],
    table: {
      columns: ["Format", "Best fit", "Main strengths", "Watch-outs"],
      rows: [
        ["NFC review card", "Hand-delivered review prompts at checkout or after service", "Feels premium, easy for staff to introduce and works well in guided interactions", "Needs staff behavior and handoff timing to be reliable"],
        ["NFC sticker", "Fixed prompts on counters, tables, windows or packaging", "Lower friction to place at scale and useful for static surfaces", "Can be ignored more easily if placement or design is weak"],
        ["Mixed format", "Businesses testing several customer moments", "Lets the team compare hand-delivered and static prompts together", "Needs a cleaner rollout plan and consistent link tracking"],
      ],
    },
    decidingBullets: [
      "Use the real customer interaction moment to decide whether a staff-delivered card or a fixed sticker is more natural.",
      "Treat placement, phone mix and staff prompting as part of the format decision, not later creative details.",
      "Keep the live review URL and QR fallback stable so the test measures format, not link confusion.",
    ],
    samplingBullets: [
      "Pilot one card and one sticker in the real environment before ordering a large branded run.",
      "Measure actual customer response and review completion, not only how the team feels about the design.",
      "Keep the encoded action simple and use a clear QR fallback so the format test is fair.",
    ],
    internalLinks: [
      { href: "/solutions/google-review-nfc-card/", label: "Google review NFC card guide" },
      { href: "/solutions/google-review-cards-for-restaurants/", label: "Google review cards for restaurants" },
      { href: "/product/google-review-nfc-card/", label: "Google review NFC card" },
      { href: "/product/nfc-stickers/", label: "NFC stickers" },
    ],
    referenceLinks: [
      {
        href: "https://support.google.com/business/answer/3474122?hl=en-GB&p=search_more_reviews",
        label: "Google Business Profile review guidance",
      },
    ],
    faq: [
      {
        question: "Is an NFC review card always better than a sticker?",
        answer:
          "No. Cards work well in guided staff interactions, but stickers can outperform them when the review prompt needs to live on a fixed surface that customers naturally notice.",
      },
      {
        question: "What should a first format test measure?",
        answer:
          "The first test should measure actual customer use, phone behavior, placement quality and review completion rather than only internal preference for one format.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Ask which review format fits best" },
    secondaryActions: [
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/products/rfid-labels/", label: "Browse RFID labels" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildCompatibilityPageDefinition({
    route: "/compatibility/miwa-hotel-key-cards/",
    title: "MIWA Hotel Key Cards Compatibility Guide",
    summary:
      "Use this page when the property already knows it runs on a MIWA hospitality lock environment and needs a faster path to the right hotel key card sample set, material path and encoding discussion.",
    imageAlt: "MIWA hotel key card compatibility",
    imageSourceRoutes: ["/product/hotel-key-cards/", "/product/printed-rfid-cards/", "/product/felica-card/"],
    bestFit: [
      "Hotels replacing MIWA-compatible guest card stock without expanding into a wider lock-system change.",
      "Properties that want to validate baseline card compatibility before moving into eco or premium card materials.",
      "Teams collecting the right technical and operational inputs before asking for encoded or printed card samples.",
    ],
    whatToSend: [
      "MIWA lock, encoder or front-desk system reference, or a current guest card sample from the property.",
      "Known card technology notes, encoding details and whether the property is replacing an older credential path.",
      "Need for plain stock, numbering, printed cards, pre-encoding or a premium material upgrade.",
    ],
    testChecklist: [
      "Validate a baseline compatible card on the real lock estate before discussing premium materials or larger rollout quantities.",
      "Check issue flow, replacement handling and any pre-encoding requirement in the same pilot round.",
      "Keep one conservative compatibility-first sample in scope so the property does not overcomplicate the first validation step.",
    ],
    productLinks: [
      { href: "/product/hotel-key-cards/", label: "Hotel key cards" },
      { href: "/product/printed-rfid-cards/", label: "Printed RFID cards" },
      { href: "/guides/hotel-key-card-encoding/", label: "Hotel key card encoding guide" },
      { href: "/guides/hotel-key-card-material-selection/", label: "Hotel key card material selection" },
    ],
    referenceLinks: [{ href: "https://www.miwalock.com/products/alv2-widetype/", label: "MIWA ALV2 hotel card lock" }],
    faq: [
      {
        question: "What helps a MIWA compatibility request move fastest?",
        answer:
          "The fastest requests usually include a current guest card sample or a clear MIWA lock or encoder reference together with notes on printing, encoding and whether the property needs plain or premium cards.",
      },
      {
        question: "Should MIWA projects start with premium materials?",
        answer:
          "Usually no. It is safer to confirm the baseline compatible card path first, then add eco or premium material options once the property already knows the technical fit works.",
      },
    ],
    primaryAction: { href: "/contact/hotel-rfid/", label: "Check MIWA card compatibility" },
  }),
  buildCompatibilityPageDefinition({
    route: "/compatibility/hafele-dialock-hotel-key-cards/",
    title: "Hafele Dialock Hotel Key Cards Compatibility Guide",
    summary:
      "Use this page when the property already knows it runs on a Hafele Dialock environment and needs a more focused path into card compatibility, credential format and the first realistic sample set.",
    imageAlt: "Hafele Dialock hotel key card compatibility",
    imageSourceRoutes: ["/product/hotel-key-cards/", "/product/printed-rfid-cards/", "/product/mifare-desfire-cards/"],
    bestFit: [
      "Hotels validating card compatibility on a Hafele Dialock hospitality or mixed-access environment.",
      "Properties narrowing the first sample set before moving into upgraded materials or printed credentials.",
      "Teams that want compatibility and issuance workflow discussed in the same first brief.",
    ],
    whatToSend: [
      "Dialock lock, terminal or system reference, or a current guest credential sample from the property.",
      "Known card technology, encoding notes and whether the project is extending an existing system or refreshing stock.",
      "Need for plain stock, printed cards, numbering, pre-encoding or a premium material path.",
    ],
    testChecklist: [
      "Validate the baseline compatible credential on the real estate before premium materials or broader design changes take over the project.",
      "Test issue flow, guest handling and any encoder or software touchpoint in the same pilot round.",
      "Keep one conservative compatibility-first card path in scope even if the property expects a later material upgrade.",
    ],
    productLinks: [
      { href: "/product/hotel-key-cards/", label: "Hotel key cards" },
      { href: "/product/printed-rfid-cards/", label: "Printed RFID cards" },
      { href: "/guides/hotel-key-card-encoding/", label: "Hotel key card encoding guide" },
      { href: "/guides/hotel-key-card-material-selection/", label: "Hotel key card material selection" },
    ],
    referenceLinks: [{ href: "https://www.hafele.com/us/en/info/about-haefele/haefele-exclusive/haefele-dialock/90552/", label: "Hafele Dialock access control" }],
    faq: [
      {
        question: "What helps a Dialock compatibility request move fastest?",
        answer:
          "A clear Dialock system reference or a current guest credential sample usually makes the first shortlist much more realistic than a broad request for generic hotel cards.",
      },
      {
        question: "Should a Dialock project start with premium materials first?",
        answer:
          "Usually no. The safer path is to prove the baseline compatible credential first, then explore upgraded materials once the technical fit and issuance workflow are already clearer.",
      },
    ],
    primaryAction: { href: "/contact/hotel-rfid/", label: "Check Dialock card compatibility" },
  }),
  buildCompatibilityPageDefinition({
    route: "/compatibility/be-tech-hotel-key-cards/",
    title: "Be-Tech Hotel Key Cards Compatibility Guide",
    summary:
      "Use this page when the project already knows it uses a Be-Tech hotel lock estate and wants a cleaner path into the right RFID card, material option and sample validation plan.",
    imageAlt: "Be-Tech hotel key card compatibility",
    imageSourceRoutes: ["/product/hotel-key-cards/", "/product/printed-rfid-cards/", "/product/mifare-classic-card/"],
    bestFit: [
      "Hotels and resorts refreshing guest card stock on a Be-Tech lock environment.",
      "Properties that want a compatibility-first pilot before discussing printed or upgraded material options.",
      "Teams narrowing the first card sample set while keeping lock fit, issue flow and rollout timing connected.",
    ],
    whatToSend: [
      "Be-Tech lock, software or system reference, or a current guest card sample from the property.",
      "Known credential notes, encoding details and whether the property is replacing an older card path.",
      "Need for plain stock, printed cards, numbering, pre-encoding or a premium material upgrade.",
    ],
    testChecklist: [
      "Validate one baseline compatible card on the real lock estate before moving into broader material or branding choices.",
      "Check issue flow, guest handling and any encoding touchpoint in the same pilot round.",
      "Keep one lower-risk sample in scope even if the property expects a later premium or eco material option.",
    ],
    productLinks: [
      { href: "/product/hotel-key-cards/", label: "Hotel key cards" },
      { href: "/product/printed-rfid-cards/", label: "Printed RFID cards" },
      { href: "/guides/hotel-key-card-encoding/", label: "Hotel key card encoding guide" },
      { href: "/guides/hotel-key-card-material-selection/", label: "Hotel key card material selection" },
    ],
    referenceLinks: [{ href: "https://www.betechlock.com/hotels-and-resorts", label: "Be-Tech hotels and resorts solution" }],
    faq: [
      {
        question: "What helps a Be-Tech compatibility request move fastest?",
        answer:
          "The fastest requests usually include a current card sample or a clear Be-Tech lock or system reference along with notes on printing, encoding and any material preference.",
      },
      {
        question: "Should Be-Tech hotels jump straight to upgraded materials?",
        answer:
          "Usually no. It is safer to validate the baseline compatible card path first, then add upgraded material options once the estate fit is already proven.",
      },
    ],
    primaryAction: { href: "/contact/hotel-rfid/", label: "Check Be-Tech card compatibility" },
  }),
  buildGuidePageDefinition({
    route: "/guides/google-review-nfc-card-setup/",
    title: "Google Review NFC Card Setup Guide",
    kicker: "Review Card Guide",
    summary:
      "This guide helps businesses set up Google review NFC cards with fewer avoidable failures by focusing on the live review link, redirect control, phone testing and a reliable QR fallback.",
    heroPoints: [
      "A simple review-link workflow usually works better than a complicated NFC payload.",
      "The live tap experience should be tested on the real phones customers use, not only on one internal device.",
      "Placement and staff prompting matter almost as much as the encoded link itself.",
    ],
    imageAlt: "Google review NFC card setup workflow",
    imageSourceRoutes: ["/product/google-review-nfc-card/", "/product/nfc-stickers/", "/product/nfc-business-card/"],
    coverageBullets: [
      "How to choose the right live review link and keep redirect ownership under control.",
      "How to structure the encoded action, QR fallback and on-card design for real-world use.",
      "What to test before ordering a wider branded batch for several locations or teams.",
    ],
    workflowBullets: [
      "Confirm the correct Google review destination and who controls the live URL first.",
      "Encode a simple web-link action and pair it with a visible QR fallback for edge cases.",
      "Test the card on representative iPhone and Android devices in the real customer interaction moment.",
      "Roll out wider only after the team has proved the placement, phone behavior and response rate are stable enough.",
    ],
    mistakeBullets: [
      "Using the wrong review link or a redirect path the business cannot control later.",
      "Skipping QR fallback and assuming every customer will tap the card correctly on the first try.",
      "Printing a large branded batch before validating phone behavior and the live customer handoff.",
    ],
    resourceLinks: [
      { href: "/solutions/google-review-nfc-card/", label: "Google review NFC card guide" },
      { href: "/solutions/google-review-cards-for-restaurants/", label: "Google review cards for restaurants" },
      { href: "/solutions/google-review-cards-for-hotels/", label: "Google review cards for hotels" },
      { href: "/compare/google-review-nfc-card-vs-nfc-sticker/", label: "Google review NFC card vs NFC sticker" },
    ],
    faq: [
      {
        question: "What should be set up first on a Google review NFC card?",
        answer:
          "The first setup priority is the live review destination and who controls it, because every later design, encoding and rollout choice depends on that link working reliably.",
      },
      {
        question: "Why is QR fallback still important on an NFC review card?",
        answer:
          "QR fallback keeps the review prompt usable when a customer does not tap correctly, NFC is disabled or the phone behavior is inconsistent enough to need another path.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Ask for Google review card setup help" },
    secondaryActions: [
      { href: "/guides/", label: "Browse buying guides" },
      { href: "/compare/", label: "Browse comparison pages" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildGuidePageDefinition({
    route: "/guides/hotel-key-card-material-selection/",
    title: "Hotel Key Card Material Selection Guide",
    kicker: "Material Guide",
    summary:
      "This guide helps hotels choose key card materials more practically by connecting PVC, wood, PLA and other options to compatibility, guest handling, brand expectations and rollout risk.",
    heroPoints: [
      "Compatibility and issue flow still come before material story in the first hotel card shortlist.",
      "PVC, wood and eco materials solve different branding and operational problems.",
      "The right material decision often follows a baseline-compatible pilot, not the first mood board.",
    ],
    imageAlt: "Hotel key card material selection planning",
    imageSourceRoutes: ["/product/hotel-key-cards/", "/product/wooden-rfid-card/", "/product/eco_rfid_card/"],
    coverageBullets: [
      "How hotels should evaluate standard, eco and premium card materials against real operational needs.",
      "Why guest handling, replacement behavior and print finish matter alongside sustainability or luxury positioning.",
      "What to test before moving from a baseline-compatible card into upgraded materials.",
    ],
    workflowBullets: [
      "Confirm the baseline compatible card path and encoding workflow first.",
      "Define the real brand goal: cost control, eco story, luxury feel or a balanced middle path.",
      "Sample the most realistic upgraded material only after the baseline card already works in operation.",
      "Test durability, guest handling and print quality together before a wider rollout decision.",
    ],
    mistakeBullets: [
      "Choosing wood, PLA or other premium materials before the baseline compatibility path is already proven.",
      "Treating eco or luxury messaging as separate from front-desk handling and replacement behavior.",
      "Sampling too many premium materials at once before the hotel has a clear shortlist and rollout plan.",
    ],
    resourceLinks: [
      { href: "/solutions/hotel-key-cards/", label: "Hotel key card solution page" },
      { href: "/compare/pvc-vs-wood-vs-pla-hotel-key-cards/", label: "PVC vs wood vs PLA hotel key cards" },
      { href: "/product/wooden-rfid-card/", label: "Wooden RFID card" },
      { href: "/product/eco_rfid_card/", label: "Eco RFID card" },
    ],
    faq: [
      {
        question: "Should hotels start with premium materials or standard PVC?",
        answer:
          "Most projects move faster when they validate a standard compatible card first, then compare upgraded materials only once the property understands the technical and operational baseline.",
      },
      {
        question: "What usually decides a hotel card material choice most?",
        answer:
          "The decision usually comes down to guest experience goals, replacement behavior, print expectations, compatibility confidence and whether the property truly benefits from a stronger eco or premium story.",
      },
    ],
    primaryAction: { href: "/contact/hotel-rfid/", label: "Ask which hotel card material fits" },
    secondaryActions: [
      { href: "/guides/", label: "Browse buying guides" },
      { href: "/compatibility/", label: "Browse compatibility pages" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildGuidePageDefinition({
    route: "/guides/google-review-card-placement-guide/",
    title: "Google Review Card Placement Guide",
    kicker: "Placement Guide",
    summary:
      "This guide helps teams place Google review cards more deliberately by tying the format to the real customer moment, surface constraints and whether staff needs to prompt the action.",
    heroPoints: [
      "Placement often decides response rate before artwork or chip choice does.",
      "Front desks, checkout counters, tabletops and pickup zones all behave differently.",
      "The best first rollout tests one or two live placements instead of spreading prompts everywhere.",
    ],
    imageAlt: "Google review card placement planning",
    imageSourceRoutes: ["/product/google-review-nfc-card/", "/product/nfc-stickers/", "/product/nfc-business-card/"],
    coverageBullets: [
      "How to match front-desk, checkout, tabletop and pickup placements to the real customer flow.",
      "What to validate about phone behavior, QR fallback and line-of-sight before ordering a larger batch.",
      "Why a small live placement test is more useful than debating formats in theory.",
    ],
    workflowBullets: [
      "Map the exact moment when the customer is most likely to notice and act on the prompt.",
      "Choose whether the prompt is staff-delivered, fixed on a surface or tested in both formats.",
      "Pilot one or two realistic locations first and track actual review completion, not only scans or taps.",
      "Scale only after the winning placement has been proven in the real environment.",
    ],
    mistakeBullets: [
      "Placing the prompt where the team prefers it instead of where customers naturally pause.",
      "Testing too many surfaces at once and learning nothing clear about what worked.",
      "Treating design quality as the main problem when the placement moment is still wrong.",
    ],
    resourceLinks: [
      { href: "/solutions/google-review-nfc-card/", label: "Google review NFC card guide" },
      { href: "/solutions/google-review-cards-for-front-desks/", label: "Google review cards for front desks" },
      { href: "/solutions/google-review-cards-for-checkout-counters/", label: "Google review cards for checkout counters" },
      { href: "/solutions/google-review-cards-for-tabletop-prompts/", label: "Google review cards for tabletop prompts" },
      { href: "/solutions/google-review-cards-for-pickup-counters/", label: "Google review cards for pickup counters" },
    ],
    faq: [
      {
        question: "What usually matters most in review-card placement?",
        answer:
          "The most important factor is usually the customer moment itself: where people already pause, have a free hand and can act without creating queue friction or confusion.",
      },
      {
        question: "Should teams test several placements at once?",
        answer:
          "Usually only a small number. One or two controlled live placements are easier to compare than a broad rollout across every possible counter or table surface.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Ask about review card placement" },
    secondaryActions: [
      { href: "/guides/", label: "Browse buying guides" },
      { href: "/compare/", label: "Browse comparison pages" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildGuidePageDefinition({
    route: "/guides/google-review-card-staff-prompt-playbook/",
    title: "Google Review Card Staff Prompt Playbook",
    kicker: "Prompt Guide",
    summary:
      "This guide helps service teams roll out Google review cards with a more natural staff prompt by connecting the ask to timing, wording and the level of handoff that the team can really sustain.",
    heroPoints: [
      "The best staff prompt feels like part of service, not an awkward extra script.",
      "Different teams can support a hand-delivered card, a quick pointer to a stand or a lighter self-serve prompt.",
      "A rollout works better when managers test staff behavior before printing a large batch.",
    ],
    imageAlt: "Google review card staff-prompt planning",
    imageSourceRoutes: ["/product/google-review-nfc-card/", "/product/nfc-business-card/", "/product/nfc-stickers/"],
    coverageBullets: [
      "How to decide whether the staff prompt should be spoken, lightly gestured or mostly self-serve.",
      "What to validate with the team before assuming a hand-delivered review card will happen consistently.",
      "Why the real service rhythm matters more than the perfect script written in isolation.",
    ],
    workflowBullets: [
      "Choose the service moment where staff can introduce the prompt without slowing the workflow.",
      "Keep the wording short and practical so the team can repeat it naturally under pressure.",
      "Pilot the prompt with a small number of staff and locations before wider print deployment.",
      "Refine the physical format only after the team has shown it can sustain the handoff or cue.",
    ],
    mistakeBullets: [
      "Writing a long script that no one can realistically use during service.",
      "Assuming staff will hand over every card when the operation rarely allows for it.",
      "Blaming the product format before checking whether the prompt timing itself is weak.",
    ],
    resourceLinks: [
      { href: "/solutions/google-review-nfc-card/", label: "Google review NFC card guide" },
      { href: "/guides/google-review-card-placement-guide/", label: "Google review card placement guide" },
      { href: "/solutions/google-review-cards-for-restaurants/", label: "Google review cards for restaurants" },
      { href: "/solutions/google-review-cards-for-hotels/", label: "Google review cards for hotels" },
      { href: "/compare/nfc-review-card-vs-qr-review-stand/", label: "NFC review card vs QR review stand" },
    ],
    faq: [
      {
        question: "Should every review-card rollout rely on a staff prompt?",
        answer:
          "Not always. Some environments benefit from a light self-serve prompt, while others get better results when staff introduces the card during an existing service handoff.",
      },
      {
        question: "What should a staff-prompt pilot measure first?",
        answer:
          "It should measure whether staff actually uses the prompt, whether customers understand the action and whether the handoff fits the real service rhythm without adding friction.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Ask for staff-prompt guidance" },
    secondaryActions: [
      { href: "/guides/", label: "Browse buying guides" },
      { href: "/solutions/", label: "Browse solution pages" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildGuidePageDefinition({
    route: "/guides/google-review-cards-for-multi-location-brands/",
    title: "Google Review Cards For Multi-Location Brands",
    kicker: "Rollout Guide",
    summary:
      "This guide helps multi-location operators deploy Google review cards without routing mistakes by focusing on location-level links, print control and how to pilot one branch before scaling the full network.",
    heroPoints: [
      "Multi-location review programs fail fastest when link ownership and routing are unclear.",
      "The rollout plan should decide how many variants, links and print batches the team really needs.",
      "A flagship-location pilot usually removes more risk than launching everywhere at once.",
    ],
    imageAlt: "Google review card planning for multi-location brands",
    imageSourceRoutes: ["/product/google-review-nfc-card/", "/product/nfc-stickers/", "/product/nfc-business-card/"],
    coverageBullets: [
      "How to decide whether each location needs its own review link, card variant or redirect path.",
      "Why operations, print control and editable routing matter before the first bulk order.",
      "What to prove in a flagship pilot before expanding to a broader location set.",
    ],
    workflowBullets: [
      "List the locations, ownership model and whether each branch needs a dedicated review destination.",
      "Choose a redirect structure that stays editable as branches change, open or close.",
      "Pilot one or two representative locations before approving a wider branded print run.",
      "Scale only after the team has validated routing, staff behavior and replenishment logic.",
    ],
    mistakeBullets: [
      "Printing a network-wide batch before confirming which link each location should use.",
      "Treating all branches as identical when service flow and counter layouts vary widely.",
      "Launching a large rollout without a replenishment plan for damaged or lost prompts.",
    ],
    resourceLinks: [
      { href: "/solutions/google-review-nfc-card/", label: "Google review NFC card guide" },
      { href: "/guides/google-review-nfc-card-setup/", label: "Google review NFC card setup guide" },
      { href: "/guides/google-review-card-placement-guide/", label: "Google review card placement guide" },
      { href: "/guides/google-review-cards-for-restaurant-franchises/", label: "Google review cards for restaurant franchises" },
      { href: "/guides/google-review-cards-for-dental-groups/", label: "Google review cards for dental groups" },
      { href: "/guides/google-review-cards-for-hotel-groups/", label: "Google review cards for hotel groups" },
      { href: "/guides/google-review-cards-for-fitness-franchises/", label: "Google review cards for fitness franchises" },
      { href: "/solutions/google-review-cards-for-restaurants/", label: "Google review cards for restaurants" },
      { href: "/solutions/google-review-cards-for-hotels/", label: "Google review cards for hotels" },
    ],
    faq: [
      {
        question: "Do multi-location brands always need different cards for every site?",
        answer:
          "Not always. Some programs can share a common print design with editable routing, while others genuinely need location-specific cards because the review destination and operating flow are different.",
      },
      {
        question: "What should a multi-location pilot prove first?",
        answer:
          "It should prove that the routing logic, branch-level behavior, staff workflow and replenishment approach still work before the brand commits to a wider print run.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Ask about multi-location routing" },
    secondaryActions: [
      { href: "/guides/", label: "Browse buying guides" },
      { href: "/compare/", label: "Browse comparison pages" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildGuidePageDefinition({
    route: "/guides/google-review-card-design-and-copy/",
    title: "Google Review Card Design And Copy Guide",
    kicker: "Design Guide",
    summary:
      "This guide helps brands design Google review cards more practically by balancing tap instructions, QR fallback, copy clarity and the amount of branding the card can carry without hiding the action.",
    heroPoints: [
      "A review card has to explain the action quickly before it can look premium.",
      "Design should support tap, scan and brand recall without overcrowding the card.",
      "The strongest first design usually comes from one clear action, not too many optional paths.",
    ],
    imageAlt: "Google review card design planning",
    imageSourceRoutes: ["/product/google-review-nfc-card/", "/product/nfc-business-card/", "/product/metal-nfc-card/"],
    coverageBullets: [
      "How to balance brand identity, tap instructions, QR fallback and the main call to action.",
      "Why surface size, placement and customer dwell time should shape the printed copy.",
      "What to validate in a sample before finalizing a larger branded print run.",
    ],
    workflowBullets: [
      "Start from the single action the customer should understand within a few seconds.",
      "Choose whether the card needs both NFC and QR instructions or one format should lead visually.",
      "Review the design in the real placement environment before approving the production artwork.",
      "Scale the final print only after the team has validated clarity, handling and customer response.",
    ],
    mistakeBullets: [
      "Letting branding dominate the layout so the tap or scan action becomes unclear.",
      "Adding too much copy for a customer who only glances at the card briefly.",
      "Approving production artwork without checking readability in the real lighting and placement context.",
    ],
    resourceLinks: [
      { href: "/solutions/google-review-nfc-card/", label: "Google review NFC card guide" },
      { href: "/guides/google-review-card-placement-guide/", label: "Google review card placement guide" },
      { href: "/compare/google-review-nfc-card-vs-nfc-sticker/", label: "Google review card vs NFC sticker" },
      { href: "/product/google-review-nfc-card/", label: "Google review NFC card" },
      { href: "/product/nfc-stickers/", label: "NFC stickers" },
    ],
    faq: [
      {
        question: "What should be most visible on a review card design?",
        answer:
          "The main action should be most visible, whether that is a tap, a scan or a short cue that tells the customer what to do next within a few seconds.",
      },
      {
        question: "Should review cards include both NFC and QR?",
        answer:
          "Often yes, but the design still needs one obvious lead action so the customer is not confused by competing cues or too much copy.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Ask about review card design" },
    secondaryActions: [
      { href: "/guides/", label: "Browse buying guides" },
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildGuidePageDefinition({
    route: "/guides/hotel-key-card-sample-planning/",
    title: "Hotel Key Card Sample Planning Guide",
    kicker: "Sampling Guide",
    summary:
      "This guide helps hotel teams request better key card samples by tying the first sample set back to lock compatibility, material priorities, encoding needs and rollout timing.",
    heroPoints: [
      "The best sample set answers one decision at a time instead of covering every possible card option.",
      "Compatibility should drive the control sample before premium or eco materials enter the mix.",
      "A tighter sample brief often saves more time than asking for a larger assortment.",
    ],
    imageAlt: "Hotel key card sample planning",
    imageSourceRoutes: ["/product/hotel-key-cards/", "/product/printed-rfid-cards/", "/product/wooden-rfid-card/"],
    coverageBullets: [
      "How to define a control sample and a small number of upgraded options without overcomplicating the first round.",
      "What lock, encoder, material and print details help a supplier reply with a more realistic sample set.",
      "Why sample planning should stay connected to rollout timing, not treated as a separate exercise.",
    ],
    workflowBullets: [
      "Start with the current lock estate or guest card reference and define the baseline compatible path first.",
      "Choose one control sample plus only the most realistic premium or eco alternatives.",
      "Bundle encoding, numbering and artwork needs into the same first sample brief when they matter.",
      "Use the pilot to validate issue flow, handling and compatibility before expanding the assortment.",
    ],
    mistakeBullets: [
      "Requesting too many card materials before the baseline compatibility path is clear.",
      "Separating sample approval from the actual rollout timing and front-desk workflow.",
      "Treating the sample round like a design exercise when the first question is still technical fit.",
    ],
    resourceLinks: [
      { href: "/solutions/hotel-key-cards/", label: "Hotel key card solution page" },
      { href: "/compatibility/", label: "Hotel compatibility page library" },
      { href: "/guides/hotel-key-card-encoding/", label: "Hotel key card encoding guide" },
      { href: "/guides/hotel-key-card-material-selection/", label: "Hotel key card material selection" },
      { href: "/product/hotel-key-cards/", label: "Hotel key cards" },
    ],
    faq: [
      {
        question: "How many hotel key card samples should a first round include?",
        answer:
          "Usually only a control sample plus a small number of realistic alternatives. Too many variants often slow the project without creating a clearer decision.",
      },
      {
        question: "What speeds up a hotel sample request most?",
        answer:
          "A current card sample or clear lock reference, together with notes on encoding, material preference, print needs and rollout timing, usually produces the best first shortlist.",
      },
    ],
    primaryAction: { href: "/contact/hotel-rfid/", label: "Ask for hotel sample planning" },
    secondaryActions: [
      { href: "/guides/", label: "Browse buying guides" },
      { href: "/compatibility/", label: "Browse compatibility pages" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildGuidePageDefinition({
    route: "/guides/hotel-key-card-artwork-and-printing-checklist/",
    title: "Hotel Key Card Artwork And Printing Checklist",
    kicker: "Artwork Guide",
    summary:
      "This guide helps hotel teams prepare key card artwork and print details without derailing compatibility work by keeping branding, numbering, finish and operational needs in one checklist.",
    heroPoints: [
      "Artwork moves faster when the compatibility and numbering rules are already known.",
      "Hotel card printing should support issue flow, replacement handling and brand standards together.",
      "A clean artwork checklist reduces revision loops before the production sample is approved.",
    ],
    imageAlt: "Hotel key card artwork and printing planning",
    imageSourceRoutes: ["/product/hotel-key-cards/", "/product/printed-rfid-cards/", "/product/eco_rfid_card/"],
    coverageBullets: [
      "How to combine branding, numbering, finish and operational handling in one production-ready checklist.",
      "Why print planning should follow compatibility confidence rather than replace it.",
      "What to confirm before approving a hotel key card proof or production sample.",
    ],
    workflowBullets: [
      "Confirm the baseline card format, chip path and any numbering or encoding rule before artwork review begins.",
      "List the print faces, finish expectations, numbering logic and packaging needs in one document.",
      "Review the proof against both brand requirements and front-desk handling realities.",
      "Approve production only after the sample has passed compatibility, readability and handling checks together.",
    ],
    mistakeBullets: [
      "Pushing full artwork revisions before the card format and compatibility path are stable.",
      "Treating numbering or issue-flow details as minor add-ons instead of part of the first print brief.",
      "Approving a visually attractive proof without checking how it performs in real hotel operations.",
    ],
    resourceLinks: [
      { href: "/solutions/hotel-key-cards/", label: "Hotel key card solution page" },
      { href: "/guides/hotel-key-card-sample-planning/", label: "Hotel key card sample planning" },
      { href: "/guides/hotel-key-card-material-selection/", label: "Hotel key card material selection" },
      { href: "/product/printed-rfid-cards/", label: "Printed RFID cards" },
      { href: "/product/hotel-key-cards/", label: "Hotel key cards" },
    ],
    faq: [
      {
        question: "When should hotel teams start detailed artwork work?",
        answer:
          "Detailed artwork work usually moves best once the baseline card format, compatibility path and numbering rules are already stable enough to avoid repeated revisions.",
      },
      {
        question: "What does a useful hotel card print checklist include?",
        answer:
          "It should include print faces, numbering rules, finish expectations, encoding notes, packaging requirements and any operational constraints that affect how the card is issued or replaced.",
      },
    ],
    primaryAction: { href: "/contact/hotel-rfid/", label: "Ask about hotel card artwork" },
    secondaryActions: [
      { href: "/guides/", label: "Browse buying guides" },
      { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildGuidePageDefinition({
    route: "/guides/google-review-cards-for-restaurant-franchises/",
    title: "Google Review Cards For Restaurant Franchises",
    kicker: "Franchise Guide",
    summary:
      "This guide helps restaurant franchises deploy Google review cards across company-owned and franchise locations by focusing on branch routing, counter variation and how to keep the print rollout operationally realistic.",
    heroPoints: [
      "Restaurant franchises usually need location-level routing before they need more design variants.",
      "Pickup, checkout and tabletop moments often behave differently from one store format to another.",
      "A flagship-store pilot is safer than sending a network-wide batch before the routing logic is proven.",
    ],
    imageAlt: "Google review card planning for restaurant franchises",
    imageSourceRoutes: ["/product/google-review-nfc-card/", "/product/nfc-stickers/", "/product/nfc-business-card/"],
    coverageBullets: [
      "How franchise brands decide between shared print, editable routing and location-specific review destinations.",
      "Why restaurant counter layout, tabletop usage and pickup flow change the best review format.",
      "What to test with one or two representative stores before expanding to a larger franchise network.",
    ],
    workflowBullets: [
      "Separate owned stores, franchise stores and any special-format locations before the first print plan is approved.",
      "Choose whether the rollout needs one shared card design with editable redirects or store-specific variants.",
      "Pilot the format in representative dine-in, takeaway or hybrid stores before printing broadly.",
      "Scale only after routing, staff behavior and replenishment all work under real service conditions.",
    ],
    mistakeBullets: [
      "Treating every restaurant unit as identical when service flow varies by format and footprint.",
      "Printing franchise-wide stock before finalizing how each store's review destination will be managed.",
      "Assuming tabletop and checkout prompts can be judged from a desk review instead of a live pilot.",
    ],
    resourceLinks: [
      { href: "/guides/google-review-cards-for-multi-location-brands/", label: "Google review cards for multi-location brands" },
      { href: "/solutions/google-review-cards-for-restaurants/", label: "Google review cards for restaurants" },
      { href: "/guides/google-review-card-placement-guide/", label: "Google review card placement guide" },
      { href: "/solutions/google-review-cards-for-checkout-counters/", label: "Google review cards for checkout counters" },
      { href: "/solutions/google-review-cards-for-pickup-counters/", label: "Google review cards for pickup counters" },
    ],
    faq: [
      {
        question: "Do restaurant franchises need different review cards for every store?",
        answer:
          "Not always. Some networks can share one design with editable routing, but others need location-specific versions because ownership, layout or review destinations differ too much.",
      },
      {
        question: "What should a restaurant franchise pilot prove first?",
        answer:
          "It should prove the routing logic, store-format fit, staff behavior and replenishment model before the brand commits to a larger cross-network print run.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Ask about franchise review rollout" },
    secondaryActions: [
      { href: "/guides/", label: "Browse buying guides" },
      { href: "/solutions/", label: "Browse solution pages" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildGuidePageDefinition({
    route: "/guides/google-review-cards-for-dental-groups/",
    title: "Google Review Cards For Dental Groups",
    kicker: "Dental Group Guide",
    summary:
      "This guide helps dental groups roll out Google review cards across several practices by keeping branch-level routing, front-desk consistency and patient handoff moments connected in one launch plan.",
    heroPoints: [
      "Dental groups need location-level routing and front-desk behavior aligned before volume printing starts.",
      "The patient handoff moment matters more than the visual style of the card alone.",
      "A practice-level pilot is safer than assuming every clinic can use the same exact prompt flow.",
    ],
    imageAlt: "Google review card planning for dental groups",
    imageSourceRoutes: ["/product/google-review-nfc-card/", "/product/nfc-stickers/", "/product/nfc-business-card/"],
    coverageBullets: [
      "How dental groups handle review routing across several practices without mixing up locations.",
      "Why reception, checkout and treatment-completion moments produce different review-card behavior.",
      "What to validate before a group-wide print run is approved for multiple clinics.",
    ],
    workflowBullets: [
      "Map each practice location, review destination and whether the group needs branch-specific routing.",
      "Choose whether the prompt is staff-delivered at checkout, fixed at reception or tested in both formats.",
      "Pilot one or two representative practices before producing a larger group order.",
      "Scale only after the group has validated routing, front-desk handling and reorder logic.",
    ],
    mistakeBullets: [
      "Assuming every clinic has the same reception flow and patient dwell time.",
      "Rolling out group-wide print before confirming which review destination belongs to each practice.",
      "Ignoring replenishment needs for damaged or worn prompts in busy reception areas.",
    ],
    resourceLinks: [
      { href: "/guides/google-review-cards-for-multi-location-brands/", label: "Google review cards for multi-location brands" },
      { href: "/solutions/google-review-cards-for-clinics/", label: "Google review cards for clinics" },
      { href: "/solutions/google-review-cards-for-front-desks/", label: "Google review cards for front desks" },
      { href: "/guides/google-review-card-staff-prompt-playbook/", label: "Google review card staff-prompt playbook" },
      { href: "/guides/google-review-nfc-card-setup/", label: "Google review NFC card setup guide" },
    ],
    faq: [
      {
        question: "Should dental groups standardize one review-card format across every clinic?",
        answer:
          "Often they can standardize the visual system, but the routing and exact prompt placement may still need to adapt to how each practice handles reception and checkout.",
      },
      {
        question: "What should a dental-group rollout prove first?",
        answer:
          "It should prove the branch routing, front-desk handoff and patient response before the group commits to a full multi-practice print batch.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Ask about dental-group rollout" },
    secondaryActions: [
      { href: "/guides/", label: "Browse buying guides" },
      { href: "/solutions/", label: "Browse solution pages" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildGuidePageDefinition({
    route: "/guides/google-review-cards-for-salon-chains/",
    title: "Google Review Cards For Salon Chains",
    kicker: "Salon Chain Guide",
    summary:
      "This guide helps salon and spa chains deploy Google review cards more consistently by connecting branch routing, reception behavior and premium brand presentation to one workable rollout plan.",
    heroPoints: [
      "Salon chains need a prompt that matches reception and checkout rhythm without feeling cheap or improvised.",
      "Branch-level routing usually matters more than producing too many visual variations early.",
      "One or two pilot salons often reveal more than a broad chain-wide launch deck.",
    ],
    imageAlt: "Google review card planning for salon chains",
    imageSourceRoutes: ["/product/google-review-nfc-card/", "/product/nfc-stickers/", "/product/metal-nfc-card/"],
    coverageBullets: [
      "How salon chains balance premium presentation, branch-level review links and front-desk practicality.",
      "Why checkout counters, mirror stations and reception desks should not be treated as the same prompt environment.",
      "What to prove before a wider chain rollout is printed and shipped.",
    ],
    workflowBullets: [
      "List each salon format, review destination and whether the chain needs branch-specific routing.",
      "Choose the handoff moment that the team can actually sustain during reception or checkout.",
      "Pilot the card or stand in representative stores before approving a larger chain batch.",
      "Scale only after the chain has validated routing, visual fit and staff adoption in real service conditions.",
    ],
    mistakeBullets: [
      "Treating the card as a brand item first and an operational prompt second.",
      "Using one rollout plan for very different salon formats without a live test.",
      "Ignoring reorder and replacement needs when prompts are handled frequently at reception.",
    ],
    resourceLinks: [
      { href: "/guides/google-review-cards-for-multi-location-brands/", label: "Google review cards for multi-location brands" },
      { href: "/solutions/google-review-cards-for-salons-and-spas/", label: "Google review cards for salons and spas" },
      { href: "/guides/google-review-card-design-and-copy/", label: "Google review card design and copy" },
      { href: "/solutions/google-review-cards-for-front-desks/", label: "Google review cards for front desks" },
      { href: "/guides/google-review-card-placement-guide/", label: "Google review card placement guide" },
    ],
    faq: [
      {
        question: "Do salon chains need a more premium review-card format than other sectors?",
        answer:
          "Sometimes yes, because brand presentation matters more, but the format still has to fit the real reception and checkout behavior to be commercially useful.",
      },
      {
        question: "What should a salon-chain pilot prove first?",
        answer:
          "It should prove routing, staff adoption, branch fit and whether the physical prompt supports the chain's brand without hurting daily workflow.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Ask about salon-chain rollout" },
    secondaryActions: [
      { href: "/guides/", label: "Browse buying guides" },
      { href: "/solutions/", label: "Browse solution pages" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildGuidePageDefinition({
    route: "/guides/google-review-cards-for-auto-dealerships/",
    title: "Google Review Cards For Auto Dealerships",
    kicker: "Dealership Guide",
    summary:
      "This guide helps auto dealerships deploy Google review cards across sales and service locations by focusing on branch routing, handoff timing and whether the prompt belongs at the desk, delivery point or service pickup counter.",
    heroPoints: [
      "Dealership review prompts often split between sales delivery and service handoff moments.",
      "Branch routing needs to be stable before a group starts printing several store batches.",
      "The strongest pilot tests one sales-side and one service-side workflow before scaling.",
    ],
    imageAlt: "Google review card planning for auto dealerships",
    imageSourceRoutes: ["/product/google-review-nfc-card/", "/product/nfc-stickers/", "/product/nfc-business-card/"],
    coverageBullets: [
      "How dealer groups separate sales, service and pickup workflows before choosing the review format.",
      "Why branch-level routing and location ownership matter before group printing starts.",
      "What to validate in a pilot before rolling review prompts out to multiple rooftops.",
    ],
    workflowBullets: [
      "Map each dealership location and separate sales delivery from service pickup or cashier moments.",
      "Choose whether the prompt is staff-delivered, fixed on a counter or split by department.",
      "Pilot one representative store and one representative department mix before wider printing.",
      "Scale only after routing, handoff behavior and reorder needs are clear enough to support the network.",
    ],
    mistakeBullets: [
      "Using one generic rollout plan for both sales delivery and service pickup.",
      "Approving multi-store print before confirming which location or department each prompt should route to.",
      "Treating the format decision as purely visual when desk flow and handoff timing are the real blockers.",
    ],
    resourceLinks: [
      { href: "/guides/google-review-cards-for-multi-location-brands/", label: "Google review cards for multi-location brands" },
      { href: "/solutions/google-review-cards-for-checkout-counters/", label: "Google review cards for checkout counters" },
      { href: "/solutions/google-review-cards-for-pickup-counters/", label: "Google review cards for pickup counters" },
      { href: "/guides/google-review-card-placement-guide/", label: "Google review card placement guide" },
      { href: "/guides/google-review-card-staff-prompt-playbook/", label: "Google review card staff-prompt playbook" },
    ],
    faq: [
      {
        question: "Should dealerships use one review-card setup for sales and service?",
        answer:
          "Not always. Sales delivery and service pickup often create different handoff moments, so the routing and physical format may need to differ even within one store.",
      },
      {
        question: "What should a dealership pilot prove first?",
        answer:
          "It should prove branch routing, department-level placement and whether the handoff actually fits sales and service workflow before a broader group rollout begins.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Ask about dealership review rollout" },
    secondaryActions: [
      { href: "/guides/", label: "Browse buying guides" },
      { href: "/solutions/", label: "Browse solution pages" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildGuidePageDefinition({
    route: "/guides/google-review-cards-for-hotel-groups/",
    title: "Google Review Cards For Hotel Groups",
    kicker: "Hotel Group Guide",
    summary:
      "This guide helps hotel groups deploy Google review cards across several properties by keeping property-level routing, front-desk consistency and brand standards aligned before a larger order is printed.",
    heroPoints: [
      "Hotel groups usually need property-level review routing before they need more card variants.",
      "Front desk, concierge and checkout moments can behave differently across brands and property types.",
      "A pilot across one or two representative hotels is safer than a network-wide rollout from day one.",
    ],
    imageAlt: "Google review card planning for hotel groups",
    imageSourceRoutes: ["/product/google-review-nfc-card/", "/product/nfc-stickers/", "/product/hotel-key-cards/"],
    coverageBullets: [
      "How hotel groups keep location-specific review routing clean across several brands or property formats.",
      "Why front-desk, concierge and checkout moments should be tested separately before a chain rollout.",
      "What to validate before shipping printed review prompts to several properties at once.",
    ],
    workflowBullets: [
      "List the properties, brand tiers and review destinations before the print structure is approved.",
      "Choose whether a common design with editable routing is enough or whether each property needs its own variant.",
      "Pilot the prompt at representative hotels before printing for the full group.",
      "Scale only after routing, guest response and replenishment handling are already stable enough to repeat.",
    ],
    mistakeBullets: [
      "Printing one property-wide batch before confirming how each hotel's review destination will be managed.",
      "Assuming luxury, select-service and resort properties can use the same prompt flow without testing.",
      "Treating the card as a brand item first and an operational guest-touchpoint second.",
    ],
    resourceLinks: [
      { href: "/guides/google-review-cards-for-multi-location-brands/", label: "Google review cards for multi-location brands" },
      { href: "/solutions/google-review-cards-for-hotels/", label: "Google review cards for hotels" },
      { href: "/solutions/google-review-cards-for-front-desks/", label: "Google review cards for front desks" },
      { href: "/guides/google-review-card-placement-guide/", label: "Google review card placement guide" },
      { href: "/guides/google-review-card-design-and-copy/", label: "Google review card design and copy" },
    ],
    faq: [
      {
        question: "Do hotel groups need different review cards for every property?",
        answer:
          "Not always. Some groups can use shared print with editable routing, but mixed brand tiers or property types often need more location-specific handling than teams expect.",
      },
      {
        question: "What should a hotel-group pilot prove first?",
        answer:
          "It should prove property-level routing, front-desk fit and whether the guest prompt can be repeated consistently before the group prints for several hotels at once.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Ask about hotel-group rollout" },
    secondaryActions: [
      { href: "/guides/", label: "Browse buying guides" },
      { href: "/solutions/", label: "Browse solution pages" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
  buildGuidePageDefinition({
    route: "/guides/google-review-cards-for-fitness-franchises/",
    title: "Google Review Cards For Fitness Franchises",
    kicker: "Fitness Franchise Guide",
    summary:
      "This guide helps fitness franchises deploy Google review cards across several clubs by connecting branch-level routing, reception flow and member-service timing before a larger rollout is approved.",
    heroPoints: [
      "Fitness franchises need branch routing and reception behavior aligned before printing at scale.",
      "Peak and off-peak club traffic can change how practical the prompt really is.",
      "A club-level pilot often reveals more than a broad franchise-wide launch plan.",
    ],
    imageAlt: "Google review card planning for fitness franchises",
    imageSourceRoutes: ["/product/google-review-nfc-card/", "/product/nfc-stickers/", "/product/rfid-silicone-wristbands/"],
    coverageBullets: [
      "How fitness franchises manage branch-level review routing across several clubs or territories.",
      "Why reception flow, tour moments and member-service timing change the best physical prompt.",
      "What to test at one or two representative clubs before rolling out across the network.",
    ],
    workflowBullets: [
      "List the clubs, review destinations and whether the network needs branch-specific routing.",
      "Choose the reception or member-service moment the staff can sustain during real club traffic.",
      "Pilot the format in representative peak and off-peak periods before wider production.",
      "Scale only after routing, staff adoption and replacement logic are stable enough to repeat.",
    ],
    mistakeBullets: [
      "Assuming quiet-hour behavior reflects how the prompt performs during actual club peaks.",
      "Rolling out franchise-wide stock before the branch-routing model is settled.",
      "Ignoring how often reception teams will need replacements for handled countertop prompts.",
    ],
    resourceLinks: [
      { href: "/guides/google-review-cards-for-multi-location-brands/", label: "Google review cards for multi-location brands" },
      { href: "/solutions/google-review-cards-for-gyms-and-fitness-studios/", label: "Google review cards for gyms and fitness studios" },
      { href: "/solutions/google-review-cards-for-front-desks/", label: "Google review cards for front desks" },
      { href: "/guides/google-review-card-placement-guide/", label: "Google review card placement guide" },
      { href: "/guides/google-review-card-staff-prompt-playbook/", label: "Google review card staff-prompt playbook" },
    ],
    faq: [
      {
        question: "Do fitness franchises need different review-card handling for peak times?",
        answer:
          "Often yes, because peak check-in pressure can change whether a staff-delivered card is realistic or whether the prompt needs a more self-serve reception format.",
      },
      {
        question: "What should a fitness-franchise pilot prove first?",
        answer:
          "It should prove branch routing, reception fit and whether the prompt still works during live club traffic before the network commits to a wider rollout.",
      },
    ],
    primaryAction: { href: "/contact/nfc-branding-cards/", label: "Ask about fitness-franchise rollout" },
    secondaryActions: [
      { href: "/guides/", label: "Browse buying guides" },
      { href: "/solutions/", label: "Browse solution pages" },
      { href: "/contact/", label: "General contact details" },
    ],
  }),
];

const EDITORIAL_DEFINITIONS: EditorialDefinition[] = [
  ...BASE_EDITORIAL_DEFINITIONS,
  DESFIRE_EV3_LANDING,
  ...PRODUCT_LANDING_DEFINITIONS,
  ...PRODUCT_LANDING_DEFINITIONS_BATCH2,
  ...PRODUCT_LANDING_DEFINITIONS_BATCH3,
  ...PRODUCT_LANDING_DEFINITIONS_BATCH4,
  ...PRODUCT_LANDING_DEFINITIONS_BATCH5,
  ...PRODUCT_LANDING_DEFINITIONS_BATCH6,
  ...PRODUCT_LANDING_DEFINITIONS_BATCH7,
  ...PRODUCT_LANDING_DEFINITIONS_BATCH8,
  ...INDUSTRY_LANDING_DEFINITIONS,
  ...PROGRAMMATIC_EDITORIAL_DEFINITIONS,
  ...CONTACT_SCENARIOS.map((scenario) => buildContactDefinition(scenario)),
  ...BLOG_DEFINITIONS,
].map((definition) => normalizeEditorialDefinition(definition));

function buildSolutionLaunchDefinition({
  route,
  title,
  kicker,
  summary,
  heroPoints,
  imageAlt,
  imageSourceRoutes,
  bestFor,
  whatToConfirm,
  productLinks,
  researchLinks,
  faq,
  primaryAction,
  secondaryActions,
}: {
  route: string;
  title: string;
  kicker: string;
  summary: string;
  heroPoints: string[];
  imageAlt: string;
  imageSourceRoutes: string[];
  bestFor: string[];
  whatToConfirm: string[];
  productLinks: EditorialLink[];
  researchLinks: EditorialLink[];
  faq: EditorialFaq[];
  primaryAction: EditorialLink;
  secondaryActions: EditorialLink[];
}): EditorialDefinition {
  return {
    route,
    group: "solutions",
    title,
    kicker,
    summary,
    heroPoints,
    imageAlt,
    imageSourceRoutes,
    brief: [
      { label: "Best for", items: bestFor },
      { label: "What to confirm", items: whatToConfirm },
      { label: "Best-fit products", links: productLinks.slice(0, 5) },
      { label: "Research pages", links: researchLinks.slice(0, 5) },
    ],
    sections: [
      {
        title: "Where this solution page fits",
        intro:
          "Use this page when the use case is already clear and the next step is not more broad browsing, but a tighter shortlist and sample plan.",
        bullets: bestFor,
      },
      {
        title: "What should decide the first shortlist",
        intro:
          "These are the details that usually remove the wrong formats, materials, or chip families before the first quote or sample round starts.",
        bullets: whatToConfirm,
      },
    ],
    resourceCards: [
      {
        title: "Best-fit products",
        description: "Use these product pages to move from the solution page into the closest likely product formats.",
        links: productLinks,
      },
      {
        title: "Related research pages",
        description: "Use these comparisons, guides or external references to answer the next question before contacting the team.",
        links: researchLinks,
      },
    ],
    faq,
    primaryAction,
    secondaryActions,
  };
}

function buildComparisonPageDefinition({
  route,
  title,
  summary,
  heroPoints,
  imageAlt,
  imageSourceRoutes,
  table,
  decidingBullets,
  samplingBullets,
  internalLinks,
  referenceLinks,
  faq,
  primaryAction,
  secondaryActions,
}: {
  route: string;
  title: string;
  summary: string;
  heroPoints: string[];
  imageAlt: string;
  imageSourceRoutes: string[];
  table: EditorialTable;
  decidingBullets: string[];
  samplingBullets: string[];
  internalLinks: EditorialLink[];
  referenceLinks: EditorialLink[];
  faq: EditorialFaq[];
  primaryAction: EditorialLink;
  secondaryActions: EditorialLink[];
}): EditorialDefinition {
  const resourceCards: EditorialResourceCard[] = [
    {
      title: "Related product and solution pages",
      description: "Use these internal pages to move from comparison into the closest solution, product or support route.",
      links: internalLinks,
    },
  ];

  if (referenceLinks.length > 0) {
    resourceCards.push({
      title: "Official references",
      description: "These external references help validate chip families, standards or platform guidance behind the comparison.",
      links: referenceLinks,
    });
  }

  return {
    route,
    group: "compare",
    title,
    kicker: "Comparison Page",
    summary,
    heroPoints,
    imageAlt,
    imageSourceRoutes,
    sections: [
      { title: "Quick comparison", table },
      {
        title: "What usually decides it",
        intro:
          "The best comparison pages remove one high-friction decision. These are the details that usually decide the first shortlist fastest.",
        bullets: decidingBullets,
      },
      {
        title: "What to confirm before broader ordering",
        intro:
          "Use the first sample round to validate the assumptions below before the project expands into premium materials or large quantities.",
        bullets: samplingBullets,
      },
    ],
    resourceCards,
    faq,
    primaryAction,
    secondaryActions,
  };
}

function buildCompatibilityPageDefinition({
  route,
  title,
  summary,
  imageAlt,
  imageSourceRoutes,
  bestFit,
  whatToSend,
  testChecklist,
  productLinks,
  referenceLinks,
  faq,
  primaryAction,
}: {
  route: string;
  title: string;
  summary: string;
  imageAlt: string;
  imageSourceRoutes: string[];
  bestFit: string[];
  whatToSend: string[];
  testChecklist: string[];
  productLinks: EditorialLink[];
  referenceLinks: EditorialLink[];
  faq: EditorialFaq[];
  primaryAction: EditorialLink;
}): EditorialDefinition {
  return {
    route,
    group: "compatibility",
    title,
    kicker: "Compatibility Guide",
    summary,
    heroPoints: [
      "Start with the installed lock estate and current card reference first.",
      "Use compatibility pages to cut out the wrong card paths before artwork review.",
      "Keep encoding, material and pilot planning in the same first conversation.",
    ],
    imageAlt,
    imageSourceRoutes,
    brief: [
      { label: "Best fit", items: bestFit },
      { label: "What to send", items: whatToSend },
      { label: "Testing checklist", items: testChecklist },
    ],
    sections: [
      {
        title: "Where this compatibility page helps most",
        intro:
          "Use this page when the property already knows the installed platform and the next step is not broad browsing, but a more targeted compatibility-first sample request.",
        bullets: bestFit,
      },
      {
        title: "What to send before the first sample round",
        intro:
          "The more specific the first message is, the faster the project can move from brand-level compatibility talk to a realistic test set.",
        bullets: whatToSend,
      },
      {
        title: "How to validate before scaling",
        intro:
          "A compatibility-first pilot should prove both technical fit and operational handling before premium materials or larger volumes enter the discussion.",
        bullets: testChecklist,
      },
    ],
    resourceCards: [
      {
        title: "Useful internal pages",
        description: "Use these internal pages to move from compatibility into product, guide or comparison detail.",
        links: productLinks,
      },
      {
        title: "Platform references",
        description: "These external references help anchor the platform discussion before the sample request is submitted.",
        links: referenceLinks,
      },
    ],
    faq,
    primaryAction,
    secondaryActions: [
      { href: "/solutions/hotel-key-cards/", label: "View hotel solution page" },
      { href: "/compatibility/", label: "Browse compatibility pages" },
      { href: "/contact/", label: "General contact details" },
    ],
  };
}

function buildGuidePageDefinition({
  route,
  title,
  kicker,
  summary,
  heroPoints,
  imageAlt,
  imageSourceRoutes,
  coverageBullets,
  workflowBullets,
  mistakeBullets,
  resourceLinks,
  faq,
  primaryAction,
  secondaryActions,
}: {
  route: string;
  title: string;
  kicker: string;
  summary: string;
  heroPoints: string[];
  imageAlt: string;
  imageSourceRoutes: string[];
  coverageBullets: string[];
  workflowBullets: string[];
  mistakeBullets: string[];
  resourceLinks: EditorialLink[];
  faq: EditorialFaq[];
  primaryAction: EditorialLink;
  secondaryActions: EditorialLink[];
}): EditorialDefinition {
  return {
    route,
    group: "guides",
    title,
    kicker,
    summary,
    heroPoints,
    imageAlt,
    imageSourceRoutes,
    sections: [
      {
        title: "What this guide covers",
        intro:
          "Use this guide when the project already knows the use case, but still needs a tighter implementation or validation workflow before requesting samples or pricing.",
        bullets: coverageBullets,
      },
      {
        title: "Recommended workflow",
        intro:
          "These steps keep the first sample or deployment round focused on the questions that change the buying decision most.",
        bullets: workflowBullets,
      },
      {
        title: "Common mistakes to avoid",
        intro:
          "These are the patterns that often slow down projects because the team moves into samples or pricing before the core workflow is clear enough.",
        bullets: mistakeBullets,
      },
    ],
    resourceCards: [
      {
        title: "Related pages",
        description: "Use these solution, comparison and product pages to move from the guide into a sharper shortlist.",
        links: resourceLinks,
      },
    ],
    faq,
    primaryAction,
    secondaryActions,
  };
}

export function mergeEditorialPages(siteData: SiteData): SiteData {
  const extraPages = buildEditorialPages(siteData);
  const existingRoutes = new Set(siteData.pages.map((page) => page.route));
  const pages = [...siteData.pages];

  extraPages.forEach((page) => {
    if (!existingRoutes.has(page.route)) {
      pages.push(page);
    }
  });

  return {
    ...siteData,
    pageCount: pages.length,
    pages,
  };
}

function buildContactDefinition(scenario: ContactScenario): EditorialDefinition {
  return {
    route: scenario.route,
    group: "contact",
    title: scenario.title,
    kicker: scenario.kicker,
    summary: scenario.summary,
    heroPoints: scenario.heroPoints,
    imageAlt: scenario.imageAlt,
    imageSourceRoutes: scenario.imageSourceRoutes,
    brief: buildContactBrief(scenario),
    sections: [
      {
        title: "Best fit for this contact path",
        intro:
          "Use this route when the project already matches one of the situations below and you want the first reply to reflect the real application.",
        bullets: scenario.bestFit,
      },
      {
        title: "What to include in your first message",
        intro:
          "A short, specific message usually gets a better answer than a generic request for catalog pricing. These details help the team recommend the right products faster.",
        bullets: scenario.checklist,
      },
      {
        title: "What happens after you contact us",
        intro:
          "Most qualified inquiries follow the same path from initial message to sample approval.",
        bullets: [
          "We review compatibility, material and deployment constraints against the use case.",
          "We narrow the likely product paths and suggest the smallest useful sample set.",
          "We confirm branding, encoding, numbering or packaging requirements if needed.",
          "We align lead time, pilot quantity and the next production decision point.",
        ],
      },
    ],
    resourceCards: [
      {
        title: "Best starting products",
        description: "Use these product pages if you still need to confirm the best-fit products before sending your inquiry.",
        links: scenario.productLinks,
      },
      {
        title: "Useful reference pages",
        description: "These pages provide the application, comparison or FAQ context that often speeds up the first conversation.",
        links: scenario.resourceLinks,
      },
    ],
    faq: [
      {
        question: "Should the first message already include exact specifications?",
        answer:
          "Not necessarily. It should include enough context to remove the wrong product paths early, even if some technical details are still being validated.",
      },
      {
        question: "Is it better to ask for a broad catalog first?",
        answer:
          "Usually no. The more useful route is to share the use case, environment and sample target so the response can focus on the most realistic options.",
      },
    ],
    primaryAction: {
      href: buildContactMailtoHref(scenario),
      label: scenario.primaryLabel,
    },
    secondaryActions: [
      { href: "/contact/", label: "General contact details" },
      { href: "/faq/", label: "Review FAQ" },
      scenario.resourceLinks[0] ?? { href: "/products/all/", label: "Browse products" },
    ],
  };
}

function rewriteEditorialLink(link: EditorialLink): EditorialLink {
  const rewrite = EDITORIAL_LINK_REWRITES[link.href];
  return rewrite ? { ...link, ...rewrite } : link;
}

function rewriteEditorialLinks(links: EditorialLink[]): EditorialLink[] {
  const seen = new Set<string>();

  return links
    .map((link) => rewriteEditorialLink(link))
    .filter((link) => {
      if (seen.has(link.href)) {
        return false;
      }

      seen.add(link.href);
      return true;
    });
}

function normalizeEditorialDefinition(definition: EditorialDefinition): EditorialDefinition {
  const primaryAction = rewriteEditorialLink(definition.primaryAction);
  const secondaryActions = rewriteEditorialSecondaryActions(definition, primaryAction);

  return {
    ...definition,
    brief: definition.brief?.map((field) =>
      field.links && field.links.length > 0
        ? {
            ...field,
            links: rewriteEditorialLinks(field.links),
          }
        : field,
    ),
    resourceCards: definition.resourceCards.map((card) => ({
      ...card,
      links: rewriteEditorialLinks(card.links),
    })),
    primaryAction: {
      ...primaryAction,
      label: EDITORIAL_PRIMARY_ACTION_LABELS[definition.route] ?? primaryAction.label,
    },
    secondaryActions,
  };
}

function rewriteEditorialSecondaryActions(
  definition: EditorialDefinition,
  primaryAction: EditorialLink,
): EditorialLink[] {
  const specialistPrimary =
    definition.group !== "contact" &&
    primaryAction.href !== "/contact/" &&
    !primaryAction.href.startsWith("mailto:");

  return rewriteEditorialLinks(definition.secondaryActions).filter((link) => {
    if (!specialistPrimary) {
      return true;
    }

    return link.href !== "/contact/";
  });
}

function buildContactBrief(scenario: ContactScenario): EditorialBriefField[] {
  return [
    { label: "Best-fit projects", items: scenario.bestFit },
    { label: "Email subject", text: scenario.mailSubject },
    { label: "Put these in the first email", items: scenario.checklist },
    { label: "Sample plan", items: scenario.samplePlan },
    { label: "Timeline watchouts", items: scenario.leadTimeFocus },
    { label: "Reference pages", links: pickBriefSourceLinks(scenario) },
  ];
}

function buildContactMailtoHref(scenario: ContactScenario): string {
  const body = [
    "Hello Proud Tek team,",
    "",
    "Please help us with samples, pricing or compatibility for this project:",
    "",
    ...scenario.checklist.map((item) => `${item.replace(/\.$/, "")}: `),
    "",
    "Questions to confirm:",
    "",
    "Best regards,",
  ].join("\n");

  return `mailto:info@proudtek.com?subject=${encodeURIComponent(scenario.mailSubject)}&body=${encodeURIComponent(body)}`;
}

function pickBriefSourceLinks(scenario: ContactScenario): EditorialLink[] {
  const seen = new Set<string>();

  return [...scenario.resourceLinks, ...scenario.productLinks].filter((link) => {
    if (seen.has(link.href)) {
      return false;
    }

    seen.add(link.href);
    return true;
  }).slice(0, 5);
}

function buildEditorialPages(siteData: SiteData): SnapshotPage[] {
  const template = siteData.pages.find((page) => page.route === "/about/") ?? siteData.pages.find((page) => page.route === "/");
  if (!template) {
    return [];
  }

  // Build WordPress product image lookup for industry product grids
  _wpProductImageMap.clear();
  for (const page of siteData.pages) {
    if (page.route.startsWith("/product/")) {
      const $ = load(`<body>${page.bodyHtml}</body>`);
      const img = $(".woocommerce-product-gallery__image img, .wp-post-image").first().attr("src") ?? "";
      if (img) {
        _wpProductImageMap.set(page.route, { title: page.title, image: img });
      }
    }
  }

  const headHtml = sanitizeTemplateHead(template.headHtml);

  return EDITORIAL_DEFINITIONS.map((definition) => ({
    route: definition.route,
    sourceUrl: `${siteData.siteOrigin}${definition.route}`,
    title: definition.title,
    htmlAttrs: { ...template.htmlAttrs },
    bodyAttrs: buildBodyAttrs(template.bodyAttrs, definition),
    headHtml,
    bodyHtml: buildBodyHtml(template.bodyHtml, definition, resolveIllustration(siteData, definition)),
  }));
}

function sanitizeTemplateHead(headHtml: string): string {
  const $ = load(`<head>${headHtml}</head>`);

  $(
    [
      "title",
      'meta[name="description"]',
      'meta[name="robots"]',
      'meta[property^="og:"]',
      'meta[name^="twitter:"]',
      'link[rel="canonical"]',
      'link[rel="alternate"]',
      'link[rel="shortlink"]',
      'link[rel="EditURI"]',
      'link[rel="https://api.w.org/"]',
      'script[type="application/ld+json"]',
    ].join(","),
  ).remove();

  return $("head").html() ?? "";
}

function buildBodyAttrs(baseAttrs: Record<string, string>, definition: EditorialDefinition): Record<string, string> {
  const classTokens = (baseAttrs.class ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => !/^page-id-\d+$/.test(token))
    .filter((token) => !/^post-\d+$/.test(token))
    .filter((token) => token !== "post")
    .filter((token) => token !== "page-id-14");

  classTokens.push("codex-editorial-body", `codex-editorial-${definition.group}`);

  return {
    ...baseAttrs,
    class: Array.from(new Set(classTokens)).join(" "),
  };
}

function buildBodyHtml(templateBodyHtml: string, definition: EditorialDefinition, illustration: { src: string; alt: string } | null): string {
  const $ = load(`<body>${templateBodyHtml}</body>`);
  const main = $("main#main, main.site-main").first();

  if (!main.length) {
    return templateBodyHtml;
  }

  main.html(renderEditorialMain(definition, illustration));
  return $("body").html() ?? templateBodyHtml;
}

/** Build lookup maps for product images */
const _editorialImageMap: Map<string, { title: string; heroImage: string }> = new Map();
for (const def of EDITORIAL_DEFINITIONS) {
  if (def.heroImage) {
    _editorialImageMap.set(def.route, { title: def.title, heroImage: def.heroImage });
  }
}
const _wpProductImageMap: Map<string, { title: string; image: string }> = new Map();

/** Render a product card grid for industry landing pages */
function renderIndustryProductGrid(definition: EditorialDefinition): string {
  if (!definition.route.startsWith("/industries/")) return "";

  const category = INDUSTRY_CATEGORIES.find((cat) => cat.href === definition.route);
  if (!category || category.productRoutes.length === 0) return "";

  const cards = category.productRoutes.map((route) => {
    // Try editorial (landing pages) first, then WordPress products
    const editorial = _editorialImageMap.get(route);
    const wpProduct = _wpProductImageMap.get(route);
    const name = editorial?.title
      ?? wpProduct?.title
      ?? route.split("/").filter(Boolean).pop()?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      ?? route;
    const shortName = name.length > 50 ? name.slice(0, 47).trimEnd() + "..." : name;
    const img = editorial?.heroImage ?? wpProduct?.image ?? "";

    return `
      <a href="${escapeAttribute(route)}" class="ind-cat-card">
        ${img ? `<img src="${escapeAttribute(img)}" alt="${escapeAttribute(shortName)}" loading="lazy">` : `<div class="ind-cat-card__placeholder"></div>`}
        <div class="ind-cat-card__body">
          <h3>${escapeHtml(shortName)}</h3>
          <span class="ind-cat-card__arrow">&rarr;</span>
        </div>
      </a>`;
  }).join("");

  return `
    <section class="ind-cat-products" aria-label="Products for ${escapeAttribute(category.title)}">
      <h2 class="ind-cat-products__title">Featured ${escapeHtml(category.title)} Products</h2>
      <p class="ind-cat-products__sub">Explore our complete range of RFID solutions for ${escapeHtml(category.title.toLowerCase())}.</p>
      <div class="ind-cat-products__grid">${cards}</div>
    </section>`;
}

function renderEditorialMain(definition: EditorialDefinition, illustration: { src: string; alt: string } | null): string {
  const outline = buildEditorialOutline(definition);

  return `
    <div class="woocommerce kadence-woo-messages-none-woo-pages woocommerce-notices-wrapper"></div>
    <div class="content-wrap">
      <article class="entry content-bg single-entry page type-page status-publish hentry codex-editorial-page">
        <div class="entry-content-wrap">
          <div class="entry-content single-content">
            ${renderTrail(definition)}
            <section class="codex-editorial-hero" data-page-type="${escapeAttribute(resolvePageType(definition.group))}">
              <div class="codex-editorial-hero-copy">
                <p class="codex-editorial-kicker">${escapeHtml(definition.kicker)}</p>
                <h1>${escapeHtml(definition.title)}</h1>
                <div class="codex-editorial-answer" aria-label="Quick answer">
                  <p class="codex-editorial-answer-label">Quick answer</p>
                  <p class="codex-editorial-summary">${escapeHtml(definition.summary)}</p>
                </div>
                <ul class="codex-editorial-points">
                  ${definition.heroPoints.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                </ul>
                ${definition.group !== "contact" ? `<div class="codex-hero-cta">
                  <a class="codex-hero-cta-btn" href="${escapeAttribute(definition.primaryAction.href)}">${escapeHtml(definition.primaryAction.label)}</a>
                </div>
                <div class="codex-hero-trust-bar">
                  <span><strong>10+</strong> Years</span>
                  <span><strong>ISO 9001</strong></span>
                  <span><strong>500+</strong> Clients</span>
                  <span><strong>50+</strong> Countries</span>
                </div>` : ""}
              </div>
              ${
                illustration
                  ? `<figure class="codex-editorial-figure">
                      <img src="${escapeAttribute(illustration.src)}" alt="${escapeAttribute(illustration.alt)}" loading="lazy" decoding="async">
                    </figure>`
                  : ""
              }
            </section>
            ${renderIndustryProductGrid(definition)}
            ${renderDecisionSnapshot(definition, outline.snapshotId)}
            ${renderJumpNav(outline.jumpLinks)}
            ${outline.filteredSections.map((section, index) => renderSection(section, outline.sectionLinks[index]?.id ?? "section")).join("")}
            ${renderResourceGrid(definition.resourceCards, outline.resourcesId)}
            ${definition.faq.length > 0 && outline.faqId ? renderFaq(definition.faq, outline.faqId) : ""}
            ${definition.group !== "contact" ? renderTrustSignals() : ""}
            ${definition.group !== "contact" ? renderInlineRfqForm(definition) : ""}
            ${renderActionBar(definition, outline.nextStepId)}
          </div>
        </div>
      </article>
    </div>
  `;
}

function renderTrail(definition: EditorialDefinition): string {
  const links: EditorialLink[] = [{ href: "/", label: "Home" }];

  if (definition.route.startsWith("/products/rfid-cards/")) {
    links.push({ href: "/products/rfid-cards/", label: "RFID Cards" });
  } else if (definition.route.startsWith("/products/rfid-labels/")) {
    links.push({ href: "/products/rfid-labels/", label: "RFID Labels" });
  } else if (definition.route.startsWith("/products/rfid-tags/")) {
    links.push({ href: "/products/rfid-tags/", label: "RFID Tags" });
  } else if (definition.route.startsWith("/industries/")) {
    links.push({ href: "/industries/hospitality/", label: "Industries" });
  } else if (definition.route.startsWith("/products/rfid-wristbands/")) {
    links.push({ href: "/products/rfid-wristbands/", label: "RFID Wristbands" });
  } else if (definition.route.startsWith("/products/rfid-keyfobs/")) {
    links.push({ href: "/products/rfid-keyfobs/", label: "RFID Keyfobs" });
  } else if (definition.route.startsWith("/products/")) {
    links.push({ href: "/products/all/", label: "Products" });
  } else if (definition.group === "solutions") {
    links.push({ href: "/solutions/", label: "Solutions" });
  } else if (definition.group === "compare") {
    links.push({ href: "/compare/", label: "Compare" });
  } else if (definition.group === "compatibility") {
    links.push({ href: "/compatibility/", label: "Compatibility" });
  } else if (definition.group === "guides") {
    links.push({ href: "/guides/", label: "Guides" });
  } else if (definition.group === "blog") {
    links.push({ href: "/blog/", label: "Blog" });
  } else {
    links.push({ href: "/contact/", label: "Contact" });
  }

  if (!isSectionRoot(definition.route)) {
    links.push({ href: definition.route, label: definition.title });
  }

  return `<nav class="codex-editorial-trail" aria-label="Breadcrumb">
    ${links
      .map((link, index) =>
        index === links.length - 1
          ? `<span aria-current="page">${escapeHtml(link.label)}</span>`
          : `<a href="${escapeAttribute(link.href)}">${escapeHtml(link.label)}</a>`,
      )
      .join("<span>/</span>")}
  </nav>`;
}

function buildEditorialOutline(definition: EditorialDefinition): {
  snapshotId: string;
  briefId: string | null;
  sectionLinks: Array<{ id: string; label: string }>;
  filteredSections: EditorialSection[];
  resourcesId: string;
  faqId: string | null;
  nextStepId: string;
  jumpLinks: Array<{ id: string; label: string }>;
} {
  const used = new Set<string>();
  const createId = (label: string): string => {
    const base =
      label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "section";
    let candidate = base;
    let suffix = 2;

    while (used.has(candidate)) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
    }

    used.add(candidate);
    return candidate;
  };

  const snapshotId = createId("At a glance");
  const briefId = definition.brief && definition.brief.length > 0 ? createId("Project checklist") : null;
  // Filter out "Where this ... fits" sections — their content is redundant with the snapshot
  const filteredSections = definition.sections.filter(
    (section) => !/^where\s+this\s+/i.test(section.title),
  );
  const sectionLinks = filteredSections.map((section) => ({ id: createId(section.title), label: section.title }));
  const resourcesId = createId("Useful next pages");
  const faqId = definition.faq.length > 0 ? createId("FAQ") : null;
  const nextStepId = createId("Next step");
  const jumpLinks = [
    { id: snapshotId, label: "At a glance" },
    ...sectionLinks,
    { id: resourcesId, label: "Useful next pages" },
    ...(faqId ? [{ id: faqId, label: "FAQ" }] : []),
    { id: nextStepId, label: "Next step" },
  ];

  return {
    snapshotId,
    briefId,
    sectionLinks,
    filteredSections,
    resourcesId,
    faqId,
    nextStepId,
    jumpLinks,
  };
}

function renderJumpNav(links: Array<{ id: string; label: string }>): string {
  if (links.length === 0) {
    return "";
  }

  return `<nav class="codex-editorial-jump-nav" aria-label="On this page">
    <p class="codex-editorial-kicker">On this page</p>
    <div class="codex-editorial-jump-links">
      ${links.map((link) => `<a class="codex-editorial-jump-link" href="#${escapeAttribute(link.id)}">${escapeHtml(link.label)}</a>`).join("")}
    </div>
  </nav>`;
}

function renderDecisionSnapshot(definition: EditorialDefinition, id: string): string {
  const cards = buildDecisionSnapshotCards(definition);

  // Include extra brief fields (beyond the first 2 already in cards) as supplementary items
  const extraBriefFields = (definition.brief ?? []).slice(2);
  const extraBriefHtml = extraBriefFields.length > 0
    ? `<dl class="codex-editorial-brief-grid" style="margin-top: 1rem;">
        ${extraBriefFields.map((field) => renderBriefField(field)).join("")}
      </dl>`
    : "";

  return `<section class="codex-editorial-section codex-editorial-snapshot" id="${escapeAttribute(id)}">
    <h2>At a glance</h2>
    <p class="codex-editorial-section-intro">Use these short answers to decide whether this page matches the project before moving into the detail.</p>
    <div class="codex-editorial-snapshot-grid">
      ${cards
        .map(
          (card) => `<article class="codex-editorial-snapshot-card">
            <p class="codex-editorial-answer-label">${escapeHtml(card.label)}</p>
            <p>${escapeHtml(card.text)}</p>
            ${card.link ? `<a class="codex-editorial-snapshot-link" href="${escapeAttribute(card.link.href)}">${escapeHtml(card.link.label)}</a>` : ""}
          </article>`,
        )
        .join("")}
    </div>
    ${extraBriefHtml}
  </section>`;
}

function buildDecisionSnapshotCards(definition: EditorialDefinition): Array<{ label: string; text: string; link?: EditorialLink }> {
  if (definition.group === "compare") {
    return buildComparisonDecisionSnapshot(definition);
  }

  const cards: Array<{ label: string; text: string; link?: EditorialLink }> = [];
  const primaryField = definition.brief?.[0];
  const secondaryField = definition.brief?.[1];
  const secondarySection = definition.sections[0];

  if (primaryField) {
    cards.push({ label: primaryField.label, text: summarizeBriefField(primaryField) });
  } else if (definition.heroPoints[0]) {
    cards.push({ label: "Key takeaway", text: definition.heroPoints[0] });
  }

  if (secondaryField) {
    cards.push({ label: secondaryField.label, text: summarizeBriefField(secondaryField) });
  } else if (secondarySection) {
    cards.push({ label: secondarySection.title, text: summarizeSection(secondarySection) });
  }

  cards.push({
    label: "Next step",
    text: "Ready to move forward? Start your inquiry to get specific answers for this project.",
    link: definition.primaryAction,
  });

  return cards.slice(0, 3);
}

function buildComparisonDecisionSnapshot(definition: EditorialDefinition): Array<{ label: string; text: string; link?: EditorialLink }> {
  const decisionTable = definition.sections.find((section) => Boolean(section.table))?.table;
  const decidingSection = definition.sections.find((section) => /decides/i.test(section.title));
  const confirmSection = definition.sections.find((section) => /confirm/i.test(section.title));
  const cards: Array<{ label: string; text: string; link?: EditorialLink }> = [];

  if (decisionTable && decisionTable.rows.length > 0) {
    const [firstRow] = decisionTable.rows;
    cards.push({
      label: "Best-fit option",
      text: truncateEditorialText(firstRow.slice(0, 3).join(" - "), 170),
    });
  }

  if (decidingSection) {
    cards.push({
      label: "Fastest decision filter",
      text: summarizeSection(decidingSection),
    });
  }

  cards.push({
    label: "Next step",
    text: confirmSection ? summarizeSection(confirmSection) : "Ready to narrow the options? Start a conversation with the details from this comparison.",
    link: definition.primaryAction,
  });

  return cards.slice(0, 3);
}

function summarizeBriefField(field: EditorialBriefField): string {
  if (field.text) {
    return truncateEditorialText(field.text, 170);
  }

  if (field.items && field.items.length > 0) {
    return truncateEditorialText(field.items.slice(0, 2).join(" "), 170);
  }

  if (field.links && field.links.length > 0) {
    return truncateEditorialText(field.links.slice(0, 2).map((link) => link.label).join(" / "), 170);
  }

  return "Use the checklist below to prepare a clear inquiry before you contact the team.";
}

function summarizeSection(section: EditorialSection): string {
  if (section.intro) {
    return truncateEditorialText(section.intro, 170);
  }

  if (section.paragraphs && section.paragraphs.length > 0) {
    return truncateEditorialText(section.paragraphs[0], 170);
  }

  if (section.bullets && section.bullets.length > 0) {
    return truncateEditorialText(section.bullets.slice(0, 2).join(" "), 170);
  }

  return "Use the section below to choose the best option and what your inquiry should include.";
}

function truncateEditorialText(value: string, limit: number): string {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= limit) {
    return normalized;
  }

  return `${normalized.slice(0, Math.max(0, limit - 1)).trimEnd()}...`;
}

function renderInlineLinks(text: string): string {
  // Convert markdown-style [label](url) to HTML links, escape everything else
  return escapeHtml(text).replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_match, label, url) => `<a href="${escapeAttribute(url)}">${label}</a>`,
  );
}

function detectSectionType(title: string): string {
  const lower = title.toLowerCase();
  // Check solution FIRST — "How Proud Tek solves ... challenges" should be green, not red
  if (/solution|how .* solve|how .* help|our approach|how proud tek|what we offer/.test(lower)) return "solution";
  if (/result|case|success|outcome|client|customer .* story|impact|roi/.test(lower)) return "results";
  if (/pain|problem|challenge|issue|common .* face|why .* fail|risk|obstacle/.test(lower)) return "pain";
  return "";
}

function renderSection(section: EditorialSection, id: string): string {
  const introHtml = section.intro ? `<p class="codex-editorial-section-intro">${renderInlineLinks(section.intro)}</p>` : "";
  const paragraphsHtml = (section.paragraphs ?? []).map((paragraph) => `<p>${renderInlineLinks(paragraph)}</p>`).join("");
  const bulletsHtml = renderSectionList(section);
  const tableHtml = section.table ? renderTable(section.table) : "";
  const imageHtml = section.image
    ? `<figure class="codex-editorial-figure"><img src="${escapeAttribute(section.image.src)}" alt="${escapeAttribute(section.image.alt)}" loading="lazy" decoding="async"></figure>`
    : "";
  const calloutHtml = section.callout
    ? `<aside class="codex-editorial-callout">
        <strong>${escapeHtml(section.callout.label)}</strong>
        <p>${renderInlineLinks(section.callout.text)}</p>
        ${section.callout.href ? `<a href="${escapeAttribute(section.callout.href)}" class="codex-editorial-callout__link">Learn more →</a>` : ""}
      </aside>`
    : "";

  const sectionType = detectSectionType(section.title);
  const typeAttr = sectionType ? ` data-section-type="${sectionType}"` : "";

  return `<section class="codex-editorial-section"${typeAttr} id="${escapeAttribute(id)}">
    <h2>${escapeHtml(section.title)}</h2>
    ${introHtml}
    ${imageHtml}
    ${paragraphsHtml}
    ${bulletsHtml}
    ${tableHtml}
    ${calloutHtml}
  </section>`;
}

function renderSectionList(section: EditorialSection): string {
  if (!section.bullets || section.bullets.length === 0) {
    return "";
  }

  if (isWorkflowSection(section.title)) {
    return `<ol class="codex-editorial-step-list">
      ${section.bullets
        .map(
          (item, index) => `<li class="codex-editorial-step">
            <span class="codex-editorial-step-index">Step ${index + 1}</span>
            <div class="codex-editorial-step-copy">${renderInlineLinks(item)}</div>
          </li>`,
        )
        .join("")}
    </ol>`;
  }

  return `<ul class="codex-editorial-list">${section.bullets.map((item) => `<li>${renderInlineLinks(item)}</li>`).join("")}</ul>`;
}

function isWorkflowSection(title: string): boolean {
  return /workflow|steps|playbook/i.test(title);
}

function renderBrief(fields: EditorialBriefField[], id: string): string {
  return `<section class="codex-editorial-section codex-editorial-brief" id="${escapeAttribute(id)}">
    <h2>Project checklist</h2>
    <p class="codex-editorial-section-intro">Use this checklist to write a clear first inquiry and shorten the back-and-forth on samples, pricing, or compatibility.</p>
    <dl class="codex-editorial-brief-grid">
      ${fields.map((field) => renderBriefField(field)).join("")}
    </dl>
  </section>`;
}

function renderBriefField(field: EditorialBriefField): string {
  const textHtml = field.text ? `<p>${escapeHtml(field.text)}</p>` : "";
  const itemsHtml =
    field.items && field.items.length > 0
      ? `<ul class="codex-editorial-list">${field.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
      : "";
  const linksHtml =
    field.links && field.links.length > 0
      ? `<div class="codex-editorial-brief-links">
          ${field.links
            .map((link) => `<a class="codex-editorial-brief-link" href="${escapeAttribute(link.href)}">${escapeHtml(link.label)}</a>`)
            .join("")}
        </div>`
      : "";

  return `<div class="codex-editorial-brief-card">
    <dt>${escapeHtml(field.label)}</dt>
    <dd>
      ${textHtml}
      ${itemsHtml}
      ${linksHtml}
    </dd>
  </div>`;
}

function renderTable(table: EditorialTable): string {
  const headerHtml = table.columns.map((column) => `<th scope="col">${escapeHtml(column)}</th>`).join("");
  const rowsHtml = table.rows
    .map((row) => {
      const [first, ...rest] = row;
      return `<tr><th scope="row">${escapeHtml(first)}</th>${rest.map((value) => `<td>${escapeHtml(value)}</td>`).join("")}</tr>`;
    })
    .join("");

  return `<div class="codex-editorial-table-wrap">
    <table class="codex-editorial-table">
      <thead><tr>${headerHtml}</tr></thead>
      <tbody>${rowsHtml}</tbody>
    </table>
  </div>`;
}

function renderResourceCard(card: EditorialResourceCard): string {
  return `<section class="codex-editorial-card">
    <h2>${escapeHtml(card.title)}</h2>
    <p>${escapeHtml(card.description)}</p>
    <div class="codex-editorial-link-list">
      ${card.links
        .map(
          (link) => `<a class="codex-editorial-link-card" href="${escapeAttribute(link.href)}">
            <strong>${escapeHtml(link.label)}</strong>
            ${link.description ? `<span>${escapeHtml(link.description)}</span>` : ""}
          </a>`,
        )
        .join("")}
    </div>
  </section>`;
}

function renderResourceGrid(cards: EditorialResourceCard[], id: string): string {
  return `<section class="codex-editorial-section codex-editorial-resource-shell" id="${escapeAttribute(id)}">
    <h2>Useful next pages</h2>
    <p class="codex-editorial-section-intro">Use these linked product, guide and comparison pages to keep the next click specific and practical.</p>
    <div class="codex-editorial-resource-grid">
      ${cards.map((card) => renderResourceCard(card)).join("")}
    </div>
  </section>`;
}

function renderFaq(faq: EditorialFaq[], id: string): string {
  return `<section class="codex-editorial-section" id="${escapeAttribute(id)}">
    <h2>FAQ</h2>
    <div class="codex-editorial-faq">
      ${faq
        .map(
          (entry) => `<details>
            <summary>${escapeHtml(entry.question)}</summary>
            <p>${escapeHtml(entry.answer)}</p>
          </details>`,
        )
        .join("")}
    </div>
  </section>`;
}

function renderTrustSignals(): string {
  return `<section class="codex-trust-signals">
    <div class="codex-trust-stats">
      <div class="codex-trust-stat">
        <strong>10+</strong>
        <span>Years RFID Manufacturing</span>
      </div>
      <div class="codex-trust-stat">
        <strong>ISO 9001</strong>
        <span>Certified Factory</span>
      </div>
      <div class="codex-trust-stat">
        <strong>500+</strong>
        <span>Enterprise Clients</span>
      </div>
      <div class="codex-trust-stat">
        <strong>50+</strong>
        <span>Countries Served</span>
      </div>
    </div>
    <p class="codex-trust-note">Proud Tek is a Shenzhen-based RFID &amp; NFC manufacturer supplying hotel chains, transit operators, event venues and retail brands worldwide. Every order includes free samples, RF testing and dedicated project support.</p>
  </section>`;
}

function renderInlineRfqForm(definition: EditorialDefinition): string {
  const productName = escapeAttribute(definition.title);
  return `<section class="codex-inline-rfq">
    <h2>Get a Quick Quote</h2>
    <p>Tell us about your project and we'll respond within one business day.</p>
    <form action="https://formspree.io/f/xlgorlog" method="POST" class="codex-inline-rfq-form">
      <input type="hidden" name="_subject" value="Inquiry: ${productName}" />
      <input type="hidden" name="product" value="${productName}" />
      <div class="codex-inline-rfq-row">
        <input type="email" name="email" placeholder="Your email *" required />
        <input type="text" name="company" placeholder="Company name" />
      </div>
      <div class="codex-inline-rfq-row">
        <input type="text" name="quantity" placeholder="Quantity (e.g. 5,000 pcs)" />
        <input type="text" name="application" placeholder="Application (e.g. hotel, event)" />
      </div>
      <textarea name="message" rows="3" placeholder="Additional details (chip preference, timeline, special requirements...)"></textarea>
      <button type="submit">Send Inquiry</button>
    </form>
  </section>`;
}

function renderActionBar(definition: EditorialDefinition, id: string): string {
  const heading = definition.group === "contact" ? "Send your project details" : "Ready to discuss your project?";
  const description =
    definition.group === "contact"
      ? "The main button opens a prefilled email for this route. Use it if the project already fits, or keep reviewing the linked product and reference pages first."
      : "Use the contact route when you are ready for pricing, samples, or compatibility help, or continue into the linked product and comparison pages below.";

  const mailtoSubject = encodeURIComponent(`Inquiry: ${definition.title}`);
  const mailtoBody = encodeURIComponent(`Hi Proud Tek,\n\nI'm interested in: ${definition.title}\n\nProject details:\n- Application:\n- Chip / frequency requirement:\n- Quantity:\n- Target date:\n\nPlease advise on next steps.\n\nThanks`);
  const mailtoHref = `mailto:info@proudtek.com?subject=${mailtoSubject}&body=${mailtoBody}`;

  return `<section class="codex-editorial-action-bar" id="${escapeAttribute(id)}">
    <div>
      <p class="codex-editorial-kicker">Next step</p>
      <h2>${escapeHtml(heading)}</h2>
      <p>${escapeHtml(description)}</p>
    </div>
    <div class="codex-editorial-action-links">
      <a class="codex-editorial-primary" href="${escapeAttribute(definition.primaryAction.href)}">${escapeHtml(definition.primaryAction.label)}</a>
      <a class="codex-editorial-secondary" href="${escapeAttribute(mailtoHref)}">✉ Email inquiry directly</a>
      ${definition.secondaryActions
        .map((link) => `<a class="codex-editorial-secondary" href="${escapeAttribute(link.href)}">${escapeHtml(link.label)}</a>`)
        .join("")}
    </div>
  </section>`;
}

function resolveIllustration(
  siteData: SiteData,
  definition: EditorialDefinition,
): { src: string; alt: string } | null {
  if (definition.heroImage) {
    return { src: definition.heroImage, alt: definition.imageAlt };
  }

  for (const route of definition.imageSourceRoutes) {
    const page = siteData.pages.find((entry) => entry.route === route);
    if (!page) {
      continue;
    }

    const src = findMeaningfulImage(page.bodyHtml);
    if (src) {
      return {
        src,
        alt: definition.imageAlt,
      };
    }
  }

  return null;
}

function findMeaningfulImage(bodyHtml: string): string | null {
  const $ = load(`<body>${bodyHtml}</body>`);
  const candidates = $(
    ".woocommerce-product-gallery__image img, .entry-content img, .post-thumbnail img, main img, img",
  ).toArray();

  for (const element of candidates) {
    const src = cleanText(
      $(element).attr("data-large_image") ??
        $(element).attr("data-src") ??
        $(element).attr("src") ??
        "",
    );

    if (!src || /logo|icon|emoji|flag|avatar/i.test(src)) {
      continue;
    }

    return src;
  }

  return null;
}

function isSectionRoot(route: string): boolean {
  return route === "/solutions/" || route === "/compare/" || route === "/compatibility/" || route === "/guides/" || route === "/contact/";
}

function resolvePageType(group: EditorialGroup): string {
  switch (group) {
    case "solutions": return "solution";
    case "compare": return "compare";
    case "guides": return "guide";
    case "compatibility": return "compatibility";
    case "contact": return "contact";
    case "products": return "product";
    default: return "";
  }
}

function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value: string): string {
  return escapeHtml(value);
}

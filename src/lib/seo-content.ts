import type {
  GrowthGroup,
  ArticleSupportProfile,
  CollectionSupportProfile,
  CoreSupportProfile,
  ProductSourceProfile,
} from "./seo";

export const SITE_ORIGIN = process.env.SITE_ORIGIN ?? "https://proudtek.com";

function absoluteUrl(value: string): string {
  if (!value) {
    return `${SITE_ORIGIN}/`;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const path = value.startsWith("/") ? value : `/${value}`;
  return `${SITE_ORIGIN}${path}`;
}

export const SITE_NAME = "Proud Tek";
export const ORGANIZATION_NAME = "Proud Tek Co., Limited";
export const EDITORIAL_TEAM_NAME = "Proud Tek Editorial Team";
export const DEFAULT_IMAGE = "/site-assets/wp-content/uploads/2024/04/cropped-cropped-proudtek-logo.png";
export const DEFAULT_DESCRIPTION =
  "Proud Tek manufactures custom RFID cards, NFC tags, RFID labels, readers, wristbands and keyfobs for OEM, industrial, hotel and access-control use.";
export const ORGANIZATION_KNOWS_ABOUT = [
  "RFID cards",
  "NFC cards",
  "RFID tags",
  "RFID labels",
  "RFID readers",
  "RFID wristbands",
  "RFID keyfobs",
  "Hotel key cards",
  "Laundry RFID tags",
  "Custom RFID manufacturing",
];
export const ORGANIZATION_CONTACT = {
  email: "info@proudtek.com",
  telephone: "+86 15815501857",
  whatsapp: "+86 18665820632",
  streetAddress: "A2110, Zhantao Building, #1079 Minzhi Rd, Longhua",
  addressLocality: "Shenzhen",
  addressCountry: "CN",
};

export const HOME_GROWTH_GROUPS: GrowthGroup[] = [
  {
    title: "Pick your industry",
    description: "Find the right product path for your application.",
    cards: [
      {
        eyebrow: "Hotel",
        title: "Hotel Key Card Solutions",
        href: "/solutions/hotel-key-cards/",
        description: "Match card materials and chip families to your lock system before ordering samples.",
      },
      {
        eyebrow: "Laundry",
        title: "RFID Laundry Tag Solutions",
        href: "/solutions/rfid-laundry-tags/",
        description: "Choose the right tag form, chip and attachment for hotel, hospital or uniform programs.",
      },
      {
        eyebrow: "Review NFC",
        title: "Google Review NFC Cards",
        href: "/solutions/google-review-nfc-card/",
        description: "Boost review volume with tap-to-review cards — no app needed, works with all modern phones.",
      },
      {
        eyebrow: "NFC Cards",
        title: "NFC Business Cards",
        href: "/solutions/nfc-business-card/",
        description: "Branded digital business cards with lead capture, custom design and rewritable URLs.",
      },
    ],
  },
];

export const HOME_COMPARE_LINKS: Array<{ label: string; href: string }> = [
  { label: "MIFARE Classic vs Plus vs DESFire", href: "/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/" },
  { label: "RFID vs Magnetic Hotel Key Cards", href: "/compare/rfid-vs-magnetic-hotel-key-cards/" },
  { label: "NFC Review Card vs QR Stand", href: "/compare/nfc-review-card-vs-qr-review-stand/" },
  { label: "NTAG213 vs NTAG215 vs NTAG216", href: "/compare/ntag213-vs-ntag215-vs-ntag216/" },
];

export const BLOG_GROWTH_GROUPS: GrowthGroup[] = [
  {
    title: "Start with the buying guides",
    description: "These solution pages answer the sourcing questions that come right after initial research.",
    cards: [
      {
        eyebrow: "Hotel",
        title: "Hotel Key Card Compatibility Guide",
        href: "/solutions/hotel-key-cards/",
        description: "Find the right card material and chip family for your hotel lock system.",
      },
      {
        eyebrow: "Laundry",
        title: "RFID Laundry Tags Buyer's Guide",
        href: "/solutions/rfid-laundry-tags/",
        description: "Choose tag form and attachment method for textile-tracking programs.",
      },
      {
        eyebrow: "Review NFC",
        title: "Google Review NFC Card Guide",
        href: "/solutions/google-review-nfc-card/",
        description: "Understand tap-to-review setup, phone support, and custom printing options.",
      },
      {
        eyebrow: "NFC Cards",
        title: "NFC Business Card Guide",
        href: "/solutions/nfc-business-card/",
        description: "Plan a branded digital business card project with lead capture and custom design.",
      },
    ],
  },
  {
    title: "Then narrow the options",
    description: "Use comparison and planning guides to move from general research into a shortlist.",
    cards: [
      {
        eyebrow: "Guide",
        title: "Google Review Card Placement Guide",
        href: "/guides/google-review-card-placement-guide/",
        description: "Decide where to place review cards for the best tap rate and customer response.",
      },
      {
        eyebrow: "Compare",
        title: "NFC Review Card vs QR Review Stand",
        href: "/compare/nfc-review-card-vs-qr-review-stand/",
        description: "Choose between a tap card and a QR stand based on cost, durability, and behavior.",
      },
      {
        eyebrow: "Guide",
        title: "Google Review Cards For Multi-Location Brands",
        href: "/guides/google-review-cards-for-multi-location-brands/",
        description: "Plan a group rollout across multiple locations with per-store redirect URLs.",
      },
      {
        eyebrow: "Guide",
        title: "Hotel Key Card Sample Planning",
        href: "/guides/hotel-key-card-sample-planning/",
        description: "Prepare a focused sample request with the right chip, material, and quantity details.",
      },
    ],
  },
];

export const HOME_GROWTH_BRIEF = [
  "Application and industry scenario",
  "Chip, frequency, lock or reader environment",
  "Material, printing, encoding, placement or redirect requirement",
  "Sample quantity and target launch date",
];

export const GROWTH_ACTIONS: Array<{ label: string; href: string }> = [
  { label: "Request free samples", href: "/contact/" },
  { label: "Get a custom quote", href: "/contact/" },
];

export const PAGE_IMAGE_OVERRIDES: Record<string, { url: string; alt: string }> = {
  "/": {
    url: "/site-assets/wp-content/uploads/2024/08/rfid_factories.jpg",
    alt: "Proud Tek RFID manufacturing facility",
  },
  "/about/": {
    url: "/site-assets/wp-content/uploads/2024/08/rfid_factories.jpg",
    alt: "Proud Tek RFID manufacturing facility in Shenzhen",
  },
  "/contact/": {
    url: "/site-assets/wp-content/uploads/2024/04/proudtek-logo.png",
    alt: "Proud Tek contact information",
  },
  "/2024/12/22/rfid-laundry-tags/": {
    url: "/site-assets/wp-content/uploads/2023/12/rfid_laundry_tags.jpg",
    alt: "RFID laundry tags",
  },
  "/2024/12/24/rfid-event-wristband/": {
    url: "/site-assets/wp-content/uploads/2024/10/RFID_Event_wristband_with_RFID_reader.jpg",
    alt: "RFID event wristband with RFID reader",
  },
  "/2024/12/24/rfid-wooden-card/": {
    url: "/site-assets/wp-content/uploads/2024/10/wood_RFID_card.jpg",
    alt: "RFID wooden card",
  },
  "/2024/12/25/rfid-hotel-key-card/": {
    url: "/site-assets/wp-content/uploads/2024/08/rfid_hotel_key_card.jpg",
    alt: "RFID hotel key card",
  },
  "/2025/11/04/mifare_plus_card/": {
    url: "/site-assets/wp-content/uploads/2025/11/2329aa5d-56de-495a-ae1b-e226cf35c4c7.jpg",
    alt: "MIFARE Plus card application illustration",
  },
};

export const PAGE_DESCRIPTION_OVERRIDES: Record<string, string> = {
  "/product/125khz-rfid-sticker/":
    "125 kHz RFID stickers for compact LF access-control or identification projects where adhesive labels work better than cards or keyfobs.",
  "/product/em4200-card/":
    "EM4200 125 kHz RFID cards for simple read-only proximity credentials, suited to access control, attendance and low-cost LF card issuance.",
  "/product/em4305-card/":
    "EM4305 rewritable 125 kHz RFID cards for access control, hotel keys and LF migration projects, with configurable memory for credential formats.",
  "/product/felica-card/":
    "FeliCa smart cards for high-speed transit, campus, loyalty and secure access applications, built around Sony's 13.56 MHz contactless platform.",
  "/product/hitag-2-card/":
    "HITAG 2 cards for secure 125 kHz access control, parking and mobility credentials, with cryptographic challenge-response for protected LF deployments.",
  "/product/java-card/":
    "Java smart cards for secure applet-based identity, authentication and multi-application credential programs, with programmable chip platforms for OEM.",
  "/product/legic-card/":
    "LEGIC smart cards for secure access, hospitality, mobility and multi-application identity programs, available for authorized LEGIC credential projects.",
  "/product/acr122u/":
    "ACR122U USB NFC reader writer for MIFARE, ISO 14443 A/B and FeliCa workflows, suited to desktop enrollment, testing and integration projects.",
  "/product/blank-rfid-card/":
    "Blank printable RFID cards for on-site badge printing, encoding and personalization, with LF, HF and UHF chip options for access and ID programs.",
  "/product/bluetooth-rfid-scanner/":
    "Bluetooth LF RFID scanner for animal ear tag reading and livestock identification, with portable data capture for breeding and farm management.",
  "/product/car-transponder-chip/":
    "Automotive transponder chips for car key replacement, key programming and immobilizer integration across common vehicle security platforms.",
  "/product/clamshell-card/":
    "125 kHz clamshell RFID cards for rugged access control and legacy proximity systems, with thicker ABS construction for repeated daily use.",
  "/product/combi-card/":
    "Combi RFID cards with dual-frequency or multi-chip construction for migration projects, multi-application credentials and mixed-reader environments.",
  "/product/desfire-tag/":
    "MIFARE DESFire tags for secure access control, resort credentials, lockers and cashless applications that need DESFire-class encryption in tag form.",
  "/product/dual-interface-card/":
    "Dual interface smart cards combine contact and contactless operation in one credential for payment, identity, healthcare and enterprise card programs.",
  "/product/125-khz-rfid-card/":
    "125 kHz RFID cards for legacy access control and attendance systems, available across common LF chip families from low-cost UID to rewritable options.",
  "/product/hotel-key-cards/":
    "Custom RFID hotel key cards for Saflok, Onity, SALTO and other hotel lock systems, with PVC, wood, PLA, printing and pre-encoding options.",
  "/product/rfid-laundry-tags/":
    "Industrial RFID laundry tags for hotel linen, uniforms and healthcare textiles, with wash-resistant formats for long-life commercial laundry tracking.",
  "/product/google-review-nfc-card/":
    "Custom Google review NFC cards with tap and QR workflows that send guests to your review link, with branded card, stand and chip options.",
  "/product/inkjet-pvc-id-card/":
    "Inkjet PVC ID cards for in-house badge printing and RFID encoding, suited to employee IDs, visitor cards, event passes and membership programs.",
  "/product/mifare-classic-card/":
    "MIFARE Classic cards for legacy 13.56 MHz access, ticketing and stored-value programs, with 1K and 4K memory options for high-volume deployments.",
  "/product/mifare-desfire-cards/":
    "MIFARE DESFire cards for high-security multi-application credentials in transit, access control, loyalty and cashless payment environments.",
  "/product/mifare-desfire-ev2-cards/":
    "MIFARE DESFire EV2 cards for advanced secure access, ticketing and multi-service city or campus deployments with stronger application flexibility.",
  "/product/mifare-4k-card/":
    "MIFARE 4K cards for higher-memory 13.56 MHz credentials in access, ticketing and multi-application legacy MIFARE deployments.",
  "/product/mifare-plus-card/":
    "MIFARE Plus cards for upgrading MIFARE Classic systems to AES-based security while preserving migration flexibility across existing infrastructures.",
  "/product/mifare-stickers/":
    "MIFARE stickers and labels for 13.56 MHz access, event and asset-identification projects that need MIFARE compatibility in adhesive form factors.",
  "/product/nfc-business-card/":
    "Custom NFC business cards with NTAG chip options, editable tap destinations, and PVC, metal, wood or eco material choices for digital contact sharing.",
  "/product/nfc-cards/":
    "Custom NFC cards for business cards, hotel keys, membership, review prompts and branded tap interactions, with NTAG and other 13.56 MHz chip options.",
  "/product/nfc-reader-writer-with-free-sdks/":
    "13.56 MHz NFC reader writer with free SDKs and API support for development, encoding and integration projects across ISO 14443 A/B applications.",
  "/product/nfc-ring/":
    "NFC smart rings in ceramic, wood and other materials for wearable access, profile sharing and tap-triggered interactions in a ring form factor.",
  "/product/nfc-sticker/":
    "Custom NFC stickers with NTAG chip options for packaging, smart labels, tap-to-open links, review prompts and branded NFC touchpoints.",
  "/product/nfc-stickers/":
    "Custom NFC stickers with NTAG chip options for packaging, smart labels, tap-to-open links, review prompts and branded NFC touchpoints.",
  "/product/proximity-fobs/":
    "Proximity key fobs for access control and attendance systems, available in LF, HF and UHF formats with multiple shell styles and customization options.",
  "/product/rfid-key-fob/":
    "Custom RFID key fobs for offices, apartments, hotels and parking systems, with LF, HF and NFC chip choices plus logo and numbering options.",
  "/product/rfid-paper-card/":
    "RFID paper cards and tickets for transit, event and single-use identification workflows, with printable eco-friendly construction and chip options.",
  "/product/printed-rfid-cards/":
    "Custom printed RFID cards with full-color graphics, barcodes, magnetic stripes and chip encoding for hotel, access, membership and event programs.",
  "/product/rfid-event-wristband/":
    "Eco RFID event wristbands in wood, coconut shell and other custom formats for festival access control, attendee tracking and cashless event programs.",
  "/product/rfid-sticker-on-headlight/":
    "UHF RFID headlight labels for vehicle registration, gated-community access and tamper-evident identification programs installed inside headlights.",
  "/product/rfid-tag-with-led-light/":
    "UHF RFID tags with LED indicators for fast item locating, warehouse picking and asset-search workflows where visual confirmation speeds retrieval.",
  "/product/rfid-windshield-tag/":
    "UHF RFID windshield tags for parking, tolling, fleet entry and vehicle identification programs that need fast hands-free reads through glass.",
  "/product/pps-rfid-laundry-tag/":
    "PPS RFID laundry tags for high-temperature industrial laundry tracking, built as durable button-style tags for linen, garments and textile circulation.",
  "/product/t5577-card/":
    "T5577 rewritable RFID cards for 125 kHz access control projects, compatible with configurable LF credential formats and custom encoding workflows.",
  "/product/rfid-wristbands-for-events/":
    "Custom RFID wristbands for events in fabric, silicone, Tyvek, wood and other materials for entry control, cashless payment and attendee tracking.",
  "/product/rfid-wristbands-for-hotels/":
    "Custom RFID wristbands for hotels and resorts with room access, guest identification and cashless amenity workflows in comfortable reusable formats.",
  "/product/uhf-wristband/":
    "UHF RFID wristbands with longer read range for event check-in, participant tracking, access control and hands-free identification workflows.",
  "/product/rfid-silicone-wristbands/":
    "Reusable RFID silicone wristbands for water parks, gyms, resorts and events, with waterproof construction and LF, HF, NFC or UHF chip options.",
  "/product/rfid-silicone-laundry-tag/":
    "Silicone RFID laundry tags for soft, flexible textile tracking in uniforms, garments and linens, designed to survive repeated commercial wash cycles.",
  "/product/coconut-shell-rfid-wristband/":
    "Eco-friendly coconut shell RFID wristbands for events, resorts and membership programs, with natural materials plus custom chip and branding options.",
  "/product/eco_rfid_card/":
    "Eco RFID cards in wood, PLA and paper materials for sustainable hotel, membership, access and branded credential programs.",
  "/product/metal-nfc-card/":
    "Premium metal NFC cards for digital business cards, luxury membership programs and branded tap-to-share experiences with stainless steel finishes.",
  "/product/wooden-rfid-card/":
    "Wooden RFID and NFC cards for eco-minded hotel keys, membership cards, business cards and branded hospitality credentials.",
  "/products/rfid-cards/standard-rfid-wood-card/":
    "Standard RFID wood cards with eco-friendly natural wood materials and LF, HF or NFC chip options for hospitality, membership and access control.",
  "/products/rfid-keyfobs/rfid-wooden-keyfob/":
    "RFID wooden keyfobs with sustainable wooden shells and LF, HF or NFC credential options for branded access control, membership and hotel programs.",
};

export const PRODUCT_BEST_FIT_OVERRIDES: Record<string, string> = {
  "/product/125khz-rfid-sticker/":
    "Best for adhesive low-frequency identification where a sticker format is easier to deploy than cards or keyfobs on equipment, lockers, books, or fixed assets.",
  "/product/em4200-card/":
    "Best for low-cost read-only access cards, attendance credentials, parking permits, and simple LF proximity programs that do not need rewritable memory.",
  "/product/em4305-card/":
    "Best for rewritable low-frequency credentials, hotel lock cards, and LF migration projects that need configurable memory and format flexibility.",
  "/product/felica-card/":
    "Best for Japan- and Asia-oriented transit, campus, payment, loyalty, and secure access projects that rely on the FeliCa ecosystem.",
  "/product/hitag-2-card/":
    "Best for protected low-frequency access, parking, mobility, and credential programs that need stronger LF security than basic read-only cards.",
  "/product/java-card/":
    "Best for applet-based identity, PKI, secure authentication, and OEM smart-card projects that require programmable application logic on card.",
  "/product/legic-card/":
    "Best for enterprise, hospitality, mobility, and industrial ID programs that specify LEGIC technology for secure multi-application credentials.",
  "/product/acr122u/":
    "Best for desktop NFC enrollment, card testing, proof-of-concept work, and USB-connected MIFARE or ISO 14443 application integration.",
  "/product/blank-rfid-card/":
    "Best for printer-ready badge programs, on-site issuance, visitor cards, membership cards, and custom RFID projects that need local printing or encoding.",
  "/product/bluetooth-rfid-scanner/":
    "Best for livestock, breeding, and animal identification workflows that need portable low-frequency tag reading with Bluetooth data transfer.",
  "/product/car-transponder-chip/":
    "Best for automotive key replacement, locksmith supply, and immobilizer-enabled vehicle key programs that require compatible transponder chips.",
  "/product/clamshell-card/":
    "Best for rugged low-frequency access cards in older proximity systems where thicker cards and dependable daily wear matter more than premium print finish.",
  "/product/combi-card/":
    "Best for migration projects, mixed-reader estates, and multi-application credentials that need two technologies in a single card body.",
  "/product/desfire-tag/":
    "Best for secure resort, locker, cashless, and access-control tag deployments where DESFire-class encryption is needed in a compact tag format.",
  "/product/dual-interface-card/":
    "Best for payment, citizen ID, healthcare, transport, and enterprise card programs that require both contact and contactless interaction on one credential.",
  "/product/125-khz-rfid-card/":
    "Best for legacy access control, attendance, parking, and membership systems that still rely on low-frequency card credentials.",
  "/product/hotel-key-cards/":
    "Best for hotel room access, guest credential programs, resort amenities, and branded hospitality key-card rollouts.",
  "/product/google-review-nfc-card/":
    "Best for restaurant, hotel, clinic, retail, and service-business review campaigns that send customers to a Google review link with a tap or QR scan.",
  "/product/inkjet-pvc-id-card/":
    "Best for organizations that want in-house card printing and quick issuance for staff IDs, visitor badges, membership cards, and short-run credential programs.",
  "/product/mifare-classic-card/":
    "Best for established 13.56 MHz access, event, hotel, and transit systems that still use MIFARE Classic credentials at scale.",
  "/product/mifare-desfire-cards/":
    "Best for secure multi-application deployments in transit, corporate access, loyalty, campus, and cashless payment systems.",
  "/product/mifare-desfire-ev2-cards/":
    "Best for advanced city, campus, transport, and enterprise programs that want DESFire-class security with stronger application management flexibility.",
  "/product/mifare-4k-card/":
    "Best for legacy MIFARE deployments that need more memory than 1K cards for multi-application storage, ticketing, or higher-data credential use cases.",
  "/product/mifare-plus-card/":
    "Best for MIFARE Classic upgrade paths where projects need stronger AES security without replacing the full installed infrastructure at once.",
  "/product/mifare-stickers/":
    "Best for applying MIFARE-compatible credentials to labels, equipment, compact surfaces or other form factors where rigid cards are not practical.",
  "/product/nfc-business-card/":
    "Best for digital business cards, tap-to-share contact exchange, lead capture, and branded NFC card programs across iPhone and Android.",
  "/product/nfc-cards/":
    "Best for branded tap interactions across business cards, hotel keys, review cards, memberships and promotional campaigns that need a familiar card shape.",
  "/product/nfc-reader-writer-with-free-sdks/":
    "Best for software teams, system integrators, and device builders that need a 13.56 MHz reader writer with SDK access for custom workflows.",
  "/product/nfc-ring/":
    "Best for wearable NFC access, quick profile sharing, smart-scene triggering and niche branded programs where a ring is the preferred form factor.",
  "/product/nfc-sticker/":
    "Best for packaging, smart labels, product authentication, tap-to-open links, and NFC-triggered campaign or review touchpoints.",
  "/product/nfc-stickers/":
    "Best for packaging, smart labels, product authentication, tap-to-open links, and NFC-triggered campaign or review touchpoints.",
  "/product/proximity-fobs/":
    "Best for simple access control, attendance, locker, and gate-entry systems that need compact proximity credentials in keychain form.",
  "/product/rfid-key-fob/":
    "Best for branded keychain credentials across offices, residential access, hotel facilities, parking, loyalty, and membership programs.",
  "/product/rfid-paper-card/":
    "Best for transit tickets, event passes, temporary visitor credentials, and eco-friendly single- or short-use RFID card programs.",
  "/product/printed-rfid-cards/":
    "Best for branded card programs that need finished print, variable data, chip encoding and ready-to-issue RFID credentials.",
  "/product/rfid-event-wristband/":
    "Best for festivals, concerts, and eco-branded event programs that want wearable access control, attendee tracking, and cashless spending in natural-material formats.",
  "/product/rfid-sticker-on-headlight/":
    "Best for tamper-evident vehicle identification programs that need a hidden UHF label mounted inside the headlight rather than on exposed glass.",
  "/product/rfid-tag-with-led-light/":
    "Best for warehouse, tool, archive, and asset-tracking workflows where operators need RFID-assisted item finding with a visible LED confirmation.",
  "/product/rfid-windshield-tag/":
    "Best for parking, gated entry, tolling, and fleet programs that need windshield-mounted UHF vehicle credentials with fast drive-through reads.",
  "/product/pps-rfid-laundry-tag/":
    "Best for industrial laundry programs that need a hard, button-style RFID tag able to survive repeated washing, drying, chemicals and heat.",
  "/product/rfid-laundry-tags/":
    "Best for hotel linen, hospital textiles, uniforms and commercial laundry programs that need washable RFID tracking across many wash cycles.",
  "/product/t5577-card/":
    "Best for low-frequency projects that need rewritable cards, configurable credential formats, and custom encoding for legacy reader compatibility.",
  "/product/rfid-wristbands-for-events/":
    "Best for concerts, sports events, conferences, and festivals that need scalable entry control, attendee tracking, and cashless event workflows.",
  "/product/rfid-wristbands-for-hotels/":
    "Best for resorts, hotels, and leisure properties that want room access, guest identification, and cashless amenity use in a wearable credential.",
  "/product/uhf-wristband/":
    "Best for longer-range attendee, visitor, or staff identification when HF and NFC wristbands do not provide enough read distance.",
  "/product/rfid-silicone-wristbands/":
    "Best for reusable wristband programs in water parks, gyms, resorts, clubs, and events where comfort, waterproofing, and frequent reuse matter.",
  "/product/rfid-silicone-laundry-tag/":
    "Best for laundry programs that need a softer, garment-friendly RFID tag format for uniforms, workwear and textiles exposed to repeated wash cycles.",
  "/product/coconut-shell-rfid-wristband/":
    "Best for eco-forward resorts, festivals, and membership programs that want a natural-material wristband without losing RFID credential functionality.",
  "/product/eco_rfid_card/":
    "Best for sustainable hospitality, membership, gift-card, and brand programs that want an eco material story without dropping RFID or NFC functionality.",
  "/product/metal-nfc-card/":
    "Best for premium digital business cards, executive networking, luxury membership, and brand campaigns that need a more durable high-end NFC card.",
  "/product/wooden-rfid-card/":
    "Best for eco-conscious hotel key cards, membership cards, business cards, and hospitality credentials where natural material is part of the brand experience.",
};

export const PRODUCT_LEAD_PARAGRAPH_OVERRIDES: Record<string, string> = {
  "/product/125khz-rfid-sticker/":
    "125 kHz RFID stickers provide a compact low-frequency credential format for projects that need adhesive identification instead of a card or keyfob.",
  "/product/em4200-card/":
    "EM4200 cards are 125 kHz read-only RFID credentials for simple access control and attendance use cases where low cost, stable UID behavior and broad LF reader compatibility matter.",
  "/product/em4305-card/":
    "EM4305 cards are rewritable 125 kHz RFID credentials with configurable memory, making them suitable for LF system migration, hotel lock cards and other programmable proximity deployments.",
  "/product/felica-card/":
    "FeliCa cards are high-speed contactless smart cards used for transit, campus, payment and secure access programs, especially where Sony's FeliCa ecosystem is already specified.",
  "/product/hitag-2-card/":
    "HITAG 2 cards provide a more secure low-frequency credential option for access, parking and mobility systems that need cryptographic protection beyond basic LF cards.",
  "/product/java-card/":
    "Java smart cards provide a programmable secure element for applet-based identity, authentication and multi-application credential programs that need flexible on-card logic.",
  "/product/legic-card/":
    "LEGIC smart cards are used in secure enterprise, hospitality, mobility and industrial ID systems where the project requires LEGIC-based multi-application credentials.",
  "/product/acr122u/":
    "ACR122U is a USB NFC reader writer for desktop card enrollment, testing and application integration across MIFARE, ISO 14443 Type A and B, and FeliCa workflows.",
  "/product/blank-rfid-card/":
    "Blank RFID cards are printer-ready credentials for on-site personalization, making them suitable for visitor badges, staff IDs, membership cards and other custom issuance programs.",
  "/product/bluetooth-rfid-scanner/":
    "This Bluetooth RFID scanner is designed for portable low-frequency ear tag reading in livestock operations, helping farms capture and transfer animal identification data in the field.",
  "/product/car-transponder-chip/":
    "Car transponder chips are used in immobilizer-enabled vehicle keys and support replacement, key programming and other automotive security workflows.",
  "/product/clamshell-card/":
    "Clamshell RFID cards are thicker 125 kHz proximity credentials built for rugged, everyday access control use in offices, campuses, industrial sites and other legacy reader environments.",
  "/product/combi-card/":
    "Combi RFID cards combine two credential technologies in one card, making them useful for phased migration, mixed-reader estates and multi-purpose access or attendance programs.",
  "/product/desfire-tag/":
    "MIFARE DESFire tags bring DESFire-class security into a compact tag form factor for resorts, lockers, access systems and other secure contactless deployments.",
  "/product/dual-interface-card/":
    "Dual interface smart cards combine contact and contactless communication in one credential, supporting payment, identity and enterprise programs that need both reader modes.",
  "/product/125-khz-rfid-card/":
    "125 kHz RFID cards support a wide range of legacy access control and attendance systems, from simple UID credentials to rewritable and higher-security LF chip options.",
  "/product/hotel-key-cards/":
    "Custom RFID hotel key cards for Saflok, Onity, SALTO and other lock systems, with PVC, wood and PLA material options plus printing, numbering and pre-encoding support.",
  "/product/rfid-laundry-tags/":
    "Industrial RFID laundry tags designed for hotel linen, uniforms and healthcare textiles, with washable and heat-resistant formats for long-cycle commercial laundry tracking.",
  "/product/google-review-nfc-card/":
    "Custom Google review NFC cards that send guests to your review link with a tap or QR scan, suitable for restaurants, hotels, clinics, retail counters and other in-person service teams.",
  "/product/inkjet-pvc-id-card/":
    "Inkjet PVC ID cards are made for organizations that want to print and personalize RFID cards in-house using compatible inkjet card printers.",
  "/product/mifare-classic-card/":
    "MIFARE Classic cards are widely used 13.56 MHz credentials for legacy access, event, ticketing and hospitality systems that still rely on established MIFARE Classic infrastructure.",
  "/product/mifare-desfire-cards/":
    "MIFARE DESFire cards are built for high-security multi-application credentials across transit, enterprise access, campus, loyalty and cashless payment deployments.",
  "/product/mifare-desfire-ev2-cards/":
    "MIFARE DESFire EV2 cards deliver advanced security and multi-service flexibility for city, campus, transport and enterprise programs that need stronger contactless credentials.",
  "/product/mifare-4k-card/":
    "MIFARE 4K cards provide higher memory than standard 1K credentials, making them suitable for legacy MIFARE projects that need more on-card application storage.",
  "/product/mifare-plus-card/":
    "MIFARE Plus cards help projects move from MIFARE Classic to AES-based security while preserving a practical migration path across existing readers and installed systems.",
  "/product/mifare-stickers/":
    "MIFARE stickers put 13.56 MHz MIFARE functionality into an adhesive label format for access, asset tagging and event workflows.",
  "/product/nfc-business-card/":
    "Custom NFC business cards built around NTAG chip options for tap-to-share profiles, lead capture and digital contact exchange on iPhone and Android.",
  "/product/nfc-cards/":
    "Custom NFC cards combine a familiar card shape with tap-based interactions for business profiles, reviews, memberships, hotel programs and branded campaigns.",
  "/product/nfc-reader-writer-with-free-sdks/":
    "This NFC reader writer with free SDKs is aimed at development and integration teams that need a 13.56 MHz desktop device with API support for custom encoding and reader applications.",
  "/product/nfc-ring/":
    "NFC rings bring contactless functionality into a wearable ring format for access, sharing and other tap-triggered interactions without carrying a card or keyfob.",
  "/product/nfc-sticker/":
    "Custom NFC stickers for smart packaging, tap-to-open links, authentication and review or campaign touchpoints, with common NTAG213, NTAG215 and NTAG216 options.",
  "/product/nfc-stickers/":
    "Custom NFC stickers for smart packaging, tap-to-open links, authentication and review or campaign touchpoints, with common NTAG213, NTAG215 and NTAG216 options.",
  "/product/proximity-fobs/":
    "Proximity fobs are compact access credentials for doors, attendance terminals and lockers, available in multiple shell formats and LF, HF or UHF technology combinations.",
  "/product/rfid-key-fob/":
    "Custom RFID key fobs provide a durable keychain credential for offices, apartments, hotels, parking systems and other everyday access-control deployments.",
  "/product/rfid-paper-card/":
    "RFID paper cards combine printable paper construction with embedded RFID technology for transit tickets, event passes and other temporary or eco-minded credential programs.",
  "/product/printed-rfid-cards/":
    "Printed RFID cards combine full-color card printing with embedded contactless chips for ready-to-issue hotel keys, staff IDs, membership cards and event credentials.",
  "/product/rfid-event-wristband/":
    "Eco RFID event wristbands in wood, coconut shell and other natural materials for festivals, concerts and branded activations that need custom access control and cashless workflows.",
  "/product/rfid-sticker-on-headlight/":
    "RFID headlight labels are tamper-evident UHF vehicle identifiers designed to sit inside the headlight, helping keep the label hidden, protected and hard to transfer.",
  "/product/rfid-tag-with-led-light/":
    "RFID tags with LED indicators help teams find the right item faster by pairing UHF reads with visible light feedback during search and picking tasks.",
  "/product/rfid-windshield-tag/":
    "RFID windshield tags are built for vehicle identification programs that need quick hands-free reads for parking, tolling and controlled-entry checkpoints.",
  "/product/pps-rfid-laundry-tag/":
    "PPS RFID laundry tags are hard button-style tags built for industrial washing environments where temperature, chemicals and mechanical stress are too harsh for lighter tag formats.",
  "/product/t5577-card/":
    "T5577 cards are rewritable 125 kHz credentials that suit access-control projects needing configurable LF card formats, custom encoding and migration-friendly deployment.",
  "/product/rfid-wristbands-for-events/":
    "Custom RFID wristbands for events in fabric, silicone, Tyvek, wood and other material options, built for entry control, attendee tracking, cashless spend and sponsor activations.",
  "/product/rfid-wristbands-for-hotels/":
    "RFID wristbands for hotels and resorts that combine guest identification, room access, cashless spending and activity management in one wearable credential.",
  "/product/uhf-wristband/":
    "UHF RFID wristbands designed for longer read-range identification, making them suitable for participant tracking, event operations and hands-free access workflows.",
  "/product/rfid-silicone-wristbands/":
    "Reusable RFID silicone wristbands with waterproof, comfortable construction for water parks, gyms, resorts and event access or payment programs.",
  "/product/rfid-silicone-laundry-tag/":
    "Silicone RFID laundry tags give garment and textile programs a softer, flexible tracking tag that still survives repeated washing, drying and handling.",
  "/product/coconut-shell-rfid-wristband/":
    "Coconut shell RFID wristbands combine eco-friendly natural shells with custom chip options for event credentials, resort access and branded membership programs.",
  "/product/eco_rfid_card/":
    "Eco RFID cards use materials such as wood, PLA and paper to give hospitality, membership and branding programs a more sustainable credential option.",
  "/product/metal-nfc-card/":
    "Metal NFC cards combine stainless-steel styling with tap-to-share functionality, making them a premium choice for branded networking and membership programs.",
  "/product/wooden-rfid-card/":
    "Wooden RFID and NFC cards pair natural materials with contactless chip options for hotels, clubs, memberships and other programs that want a stronger eco aesthetic.",
};

export const PRODUCT_HEADING_OVERRIDES: Record<string, string> = {
  "/product/125-khz-rfid-card/": "125 kHz RFID Cards",
  "/product/125khz-rfid-sticker/": "125 kHz RFID Stickers",
  "/product/acr122u/": "ACR122U NFC Reader Writer",
  "/product/blank-rfid-card/": "Blank RFID Cards",
  "/product/bluetooth-rfid-scanner/": "Bluetooth RFID Ear Tag Reader",
  "/product/car-transponder-chip/": "Car Transponder Chips",
  "/product/clamshell-card/": "Clamshell RFID Cards",
  "/product/combi-card/": "Combi RFID Cards",
  "/product/desfire-tag/": "MIFARE DESFire Tags",
  "/product/dual-interface-card/": "Dual Interface Smart Cards",
  "/product/em4200-card/": "EM4200 RFID Cards",
  "/product/em4305-card/": "EM4305 RFID Cards",
  "/product/eco_rfid_card/": "Eco RFID Cards",
  "/product/felica-card/": "FeliCa Smart Cards",
  "/product/google-review-nfc-card/": "Google Review NFC Cards",
  "/product/hitag-2-card/": "HITAG 2 RFID Cards",
  "/product/hotel-key-cards/": "Hotel Key Cards",
  "/product/inkjet-pvc-id-card/": "Inkjet PVC ID Cards",
  "/product/java-card/": "Java Smart Cards",
  "/product/legic-card/": "LEGIC Smart Cards",
  "/product/metal-nfc-card/": "Metal NFC Cards",
  "/product/mifare-4k-card/": "MIFARE 4K Cards",
  "/product/mifare-classic-card/": "MIFARE Classic Cards",
  "/product/mifare-desfire-cards/": "MIFARE DESFire Cards",
  "/product/mifare-desfire-ev2-cards/": "MIFARE DESFire EV2 Cards",
  "/product/mifare-plus-card/": "MIFARE Plus Cards",
  "/product/mifare-stickers/": "MIFARE Stickers",
  "/product/nfc-business-card/": "NFC Business Cards",
  "/product/nfc-cards/": "Custom NFC Cards",
  "/product/nfc-reader-writer-with-free-sdks/": "NFC Reader Writer with SDKs",
  "/product/nfc-ring/": "NFC Smart Rings",
  "/product/nfc-sticker/": "NFC Stickers",
  "/product/nfc-stickers/": "NFC Stickers",
  "/product/proximity-fobs/": "RFID Proximity Fobs",
  "/product/pps-rfid-laundry-tag/": "PPS RFID Laundry Tags",
  "/product/printed-rfid-cards/": "Printed RFID Cards",
  "/product/rfid-event-wristband/": "Eco RFID Event Wristbands",
  "/product/rfid-key-fob/": "RFID Key Fobs",
  "/product/rfid-laundry-tags/": "Industrial RFID Laundry Tags",
  "/product/rfid-paper-card/": "RFID Paper Cards",
  "/product/rfid-silicone-laundry-tag/": "Silicone RFID Laundry Tags",
  "/product/rfid-silicone-wristbands/": "RFID Silicone Wristbands",
  "/product/rfid-sticker-on-headlight/": "RFID Headlight Labels",
  "/product/rfid-tag-with-led-light/": "RFID Tags with LED Light",
  "/product/rfid-windshield-tag/": "RFID Windshield Tags",
  "/product/rfid-wristbands-for-events/": "RFID Wristbands for Events",
  "/product/rfid-wristbands-for-hotels/": "RFID Wristbands for Hotels",
  "/product/t5577-card/": "T5577 RFID Cards",
  "/product/uhf-wristband/": "UHF RFID Wristbands",
  "/product/wooden-rfid-card/": "Wooden RFID and NFC Cards",
  "/product/coconut-shell-rfid-wristband/": "Coconut Shell RFID Wristbands",
};

export const PRODUCT_SOURCE_LINKS: ProductSourceProfile = {
  "/product/acr122u/": [
    { name: "ACS ACR122U USB NFC Reader", url: "https://www.acs.com.hk/en/products/3/acr122u-usb-nfc-reader/" },
    { name: "ACS ACR122U User Manual", url: "https://docs.acs.com.hk/acr122u-user-manual/" },
    { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
    { name: "ISO/IEC 18092:2023", url: "https://www.iso.org/standard/85054.html" },
  ],
  "/product/nfc-reader-writer-with-free-sdks/": [
    { name: "ACS ACR122U USB NFC Reader", url: "https://www.acs.com.hk/en/products/3/acr122u-usb-nfc-reader/" },
    { name: "ACS ACR122U User Manual", url: "https://docs.acs.com.hk/acr122u-user-manual/" },
    { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
    { name: "ISO/IEC 18092:2023", url: "https://www.iso.org/standard/85054.html" },
  ],
  "/product/mifare-classic-card/": [
    { name: "NXP MIFARE Classic EV1", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-classic/mifare-classic-ev1-1k-4k:MF1S50YYX_V1" },
    { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
  ],
  "/product/mifare-plus-card/": [
    { name: "NXP MIFARE Plus Family", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-plus%3AMC_57609" },
    { name: "NXP MIFARE Plus EV2", url: "https://www.nxp.com/products/MFPEV2" },
    { name: "NXP MIFARE Plus SE", url: "https://www.nxp.com/products/MIFARE_PLUS_SE_1K" },
    { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
  ],
  "/product/mifare-desfire-cards/": [
    { name: "NXP MIFARE DESFire Family", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-desfire%3AMC_5348" },
    { name: "NXP MIFARE DESFire EV2", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-desfire/mifare-desfire-ev2%3AMF3Dx2" },
    { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
  ],
  "/product/mifare-desfire-ev2-cards/": [
    { name: "NXP MIFARE DESFire EV2", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-desfire/mifare-desfire-ev2%3AMF3Dx2" },
    { name: "NXP MIFARE DESFire Family", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-desfire%3AMC_5348" },
    { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
  ],
  "/product/felica-card/": [
    { name: "Sony FeliCa Overview", url: "https://www.sony.co.jp/en/Products/felica/about/" },
    { name: "Sony FeliCa Products", url: "https://www.sony.co.jp/en/Products/felica/business/products/" },
    { name: "Sony FeliCa Lite-S Announcement", url: "https://www.sony.co.jp/en/Products/felica/business/information/111111.html" },
    { name: "ISO/IEC 18092:2023", url: "https://www.iso.org/standard/85054.html" },
  ],
  "/product/legic-card/": [
    { name: "LEGIC Smartcard ICs", url: "https://www.legic.com/products/smartcards/legic-smartcard-ics" },
    { name: "LEGIC Advant Card-in-Card Applet", url: "https://www.legic.com/products/smartcards/legic-card-in-card-applet" },
    { name: "LEGIC ATC4096-MP313", url: "https://www.legic.com/insights/news/detail/info/legic-atc4096-mp313-smartcard-ic-supports-legic-advant-mifare-desfire-ev3" },
    { name: "LEGIC Company Overview", url: "https://www.legic.com/company/about" },
  ],
  "/product/java-card/": [
    { name: "Oracle Java Card Technology", url: "https://www.oracle.com/apac/java/java-card/" },
    { name: "Oracle Java Card 3.1 Documentation", url: "https://docs.oracle.com/javacard/" },
    { name: "Oracle Java Card Platform Specification 2.2.2", url: "https://www.oracle.com/java/technologies/java-card/platform-specification-v222.html" },
    { name: "NXP JCOP ID 1", url: "https://www.nxp.com/products/JCOP-ID-1" },
  ],
  "/product/dual-interface-card/": [
    { name: "Oracle Dual Interface Cards", url: "https://docs.oracle.com/en/java/javacard/3.2/jcdksu/dual-interface-cards.html" },
    { name: "Oracle Java Card Platform Specification 2.2.2", url: "https://www.oracle.com/java/technologies/java-card/platform-specification-v222.html" },
    { name: "NXP JCOP Pay", url: "https://www.nxp.com/products/security-and-authentication/jcop-for-payment-and-identity/jcop-pay%3AJCOP-PAY" },
    { name: "ISO/IEC 7816-3:2006", url: "https://www.iso.org/standard/38770.html" },
    { name: "ISO/IEC 14443-4:2018", url: "https://www.iso.org/standard/73599.html" },
  ],
  "/product/eco_rfid_card/": [
    { name: "EM4200 | EM Microelectronic", url: "https://www.emmicroelectronic.com/product/lf-animal-access-ics/em4200" },
    { name: "NXP MIFARE Classic EV1", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-classic/mifare-classic-ev1-1k-4k:MF1S50YYX_V1" },
    { name: "NXP UCODE 8/8m", url: "https://www.nxp.com/products/rfid-nfc/ucode-rain-rfid-uhf/ucode-8-8m%3ASL3S1205-15" },
    { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
    { name: "ISO/IEC 18000-63:2021", url: "https://www.iso.org/standard/78309.html" },
  ],
  "/product/coconut-shell-rfid-wristband/": [
    { name: "NXP MIFARE Classic EV1", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-classic/mifare-classic-ev1-1k-4k:MF1S50YYX_V1" },
    { name: "NXP MIFARE Ultralight EV1", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-ultralight/mifare-ultralight-ev1:MF0ULX1" },
    { name: "NXP NTAG 213/215/216", url: "https://www.nxp.com/products/rfid-nfc/nfc-hf/ntag-for-tags-and-labels/ntag-213-215-216:NTAG213_215_216" },
    { name: "NXP ICODE SLIX2", url: "https://www.nxp.com/products/SL2S2602" },
    { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
  ],
  "/product/em4200-card/": [
    { name: "EM4200 | EM Microelectronic", url: "https://www.emmicroelectronic.com/product/lf-animal-access-ics/em4200" },
    { name: "EM4095 | EM Microelectronic", url: "https://www.emmicroelectronic.com/product/rf-reader-ics/em4095" },
    { name: "ISO 11784", url: "https://www.iso.org/standard/62806.html" },
    { name: "ISO 11785", url: "https://www.iso.org/standard/51784.html" },
  ],
  "/product/em4305-card/": [
    { name: "EM4205 / EM4305 | EM Microelectronic", url: "https://www.emmicroelectronic.com/zh-hans/node/10" },
    { name: "EMDB409 | EM Microelectronic", url: "https://www.emmicroelectronic.com/index.php/product/rfid-tools-support/emdb409" },
    { name: "ISO 11784", url: "https://www.iso.org/standard/62806.html" },
    { name: "ISO 11785", url: "https://www.iso.org/standard/51784.html" },
  ],
  "/product/hitag-2-card/": [
    { name: "HT2x | NXP Semiconductors", url: "https://www.nxp.com/products/rfid-nfc/hitag-lf/hitag-2-transponder-ic%3AHT2X" },
    { name: "HITAG (LF) | NXP Semiconductors", url: "https://www.nxp.com/products/rfid-nfc/hitag-lf%3AMC_42027" },
    { name: "ISO 11784", url: "https://www.iso.org/standard/62806.html" },
    { name: "ISO 11785", url: "https://www.iso.org/standard/51784.html" },
  ],
  "/product/nfc-ring/": [
    { name: "NFC Forum Type 2 Tag Specification", url: "https://nfc-forum.org/build/specifications/type-2-tag-specification/" },
    { name: "NFC Forum Type 4 Tag Specification", url: "https://nfc-forum.org/build/specifications/type-4-tag-specification/" },
    { name: "ISO/IEC 18092:2023", url: "https://www.iso.org/standard/85054.html" },
    { name: "ISO/IEC 14443-4:2018", url: "https://www.iso.org/standard/73599.html" },
  ],
  "/product/proximity-fobs/": [
    { name: "HID Proximity 1346 ProxKey III", url: "https://www.hidglobal.com/products/1346" },
    { name: "HID Indala Proximity CX Series", url: "https://www.hidglobal.com/products/indala-cx-series" },
    { name: "EM4200 | EM Microelectronic", url: "https://www.emmicroelectronic.com/product/lf-animal-access-ics/em4200" },
    { name: "EM4205 / EM4305 | EM Microelectronic", url: "https://www.emmicroelectronic.com/zh-hans/node/10" },
  ],
  "/product/car-transponder-chip/": [
    { name: "HT2x | NXP Semiconductors", url: "https://www.nxp.com/products/rfid-nfc/hitag-lf/hitag-2-transponder-ic%3AHT2X" },
    { name: "HITAG (LF) | NXP Semiconductors", url: "https://www.nxp.com/products/rfid-nfc/hitag-lf%3AMC_42027" },
    { name: "ATA5577C | Microchip", url: "https://www.microchip.com/en-us/product/ATA5577C" },
    { name: "EM4200 | EM Microelectronic", url: "https://www.emmicroelectronic.com/product/lf-animal-access-ics/em4200" },
  ],
  "/product/t5577-card/": [
    { name: "ATA5577C | Microchip", url: "https://www.microchip.com/en-us/product/ATA5577C" },
    { name: "EM4200 | EM Microelectronic", url: "https://www.emmicroelectronic.com/product/lf-animal-access-ics/em4200" },
    { name: "EM4205 / EM4305 | EM Microelectronic", url: "https://www.emmicroelectronic.com/zh-hans/node/10" },
    { name: "ISO/IEC 18000-2", url: "https://www.iso.org/standard/50958.html" },
  ],
  "/product/clamshell-card/": [
    { name: "HID ProxCard II 1326", url: "https://www.hidglobal.com/products/1326" },
    { name: "EM4200 | EM Microelectronic", url: "https://www.emmicroelectronic.com/product/lf-animal-access-ics/em4200" },
    { name: "EM4205 / EM4305 | EM Microelectronic", url: "https://www.emmicroelectronic.com/zh-hans/node/10" },
    { name: "ATA5577C | Microchip", url: "https://www.microchip.com/en-us/product/ATA5577C" },
  ],
  "/product/rfid-key-fob/": [
    { name: "HID Proximity 1346 ProxKey III", url: "https://www.hidglobal.com/products/1346" },
    { name: "NXP MIFARE Classic EV1", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-classic/mifare-classic-ev1-1k-4k:MF1S50YYX_V1" },
    { name: "NXP MIFARE DESFire Family", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-desfire%3AMC_5348" },
    { name: "EM4200 | EM Microelectronic", url: "https://www.emmicroelectronic.com/product/lf-animal-access-ics/em4200" },
    { name: "EM4205 / EM4305 | EM Microelectronic", url: "https://www.emmicroelectronic.com/zh-hans/node/10" },
  ],
  "/product/125-khz-rfid-card/": [
    { name: "EM4200 | EM Microelectronic", url: "https://www.emmicroelectronic.com/product/lf-animal-access-ics/em4200" },
    { name: "EM4205 / EM4305 | EM Microelectronic", url: "https://www.emmicroelectronic.com/zh-hans/node/10" },
    { name: "ATA5577C | Microchip", url: "https://www.microchip.com/en-us/product/ATA5577C" },
    { name: "HT2x | NXP Semiconductors", url: "https://www.nxp.com/products/rfid-nfc/hitag-lf/hitag-2-transponder-ic%3AHT2X" },
    { name: "ISO/IEC 18000-2", url: "https://www.iso.org/standard/50958.html" },
  ],
  "/product/125khz-rfid-sticker/": [
    { name: "EM4200 | EM Microelectronic", url: "https://www.emmicroelectronic.com/product/lf-animal-access-ics/em4200" },
    { name: "EM4205 / EM4305 | EM Microelectronic", url: "https://www.emmicroelectronic.com/zh-hans/node/10" },
    { name: "ATA5577C | Microchip", url: "https://www.microchip.com/en-us/product/ATA5577C" },
    { name: "ISO/IEC 18000-2", url: "https://www.iso.org/standard/50958.html" },
  ],
  "/product/bluetooth-rfid-scanner/": [
    { name: "ISO 11784", url: "https://www.iso.org/standard/62806.html" },
    { name: "ISO 11785", url: "https://www.iso.org/standard/51784.html" },
    { name: "Bluetooth Core Specification", url: "https://www.bluetooth.com/specifications/specs/core-specification-5-4/" },
    { name: "Bluetooth SIG", url: "https://www.bluetooth.com/" },
  ],
  "/product/blank-rfid-card/": [
    { name: "EM4200 | EM Microelectronic", url: "https://www.emmicroelectronic.com/product/lf-animal-access-ics/em4200" },
    { name: "NXP MIFARE Classic EV1", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-classic/mifare-classic-ev1-1k-4k:MF1S50YYX_V1" },
    { name: "NXP MIFARE DESFire Family", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-desfire%3AMC_5348" },
    { name: "NXP UCODE 8/8m", url: "https://www.nxp.com/products/rfid-nfc/ucode-rain-rfid-uhf/ucode-8-8m%3ASL3S1205-15" },
    { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
  ],
  "/product/combi-card/": [
    { name: "EM4200 | EM Microelectronic", url: "https://www.emmicroelectronic.com/product/lf-animal-access-ics/em4200" },
    { name: "NXP MIFARE Classic EV1", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-classic/mifare-classic-ev1-1k-4k:MF1S50YYX_V1" },
    { name: "NXP UCODE 8/8m", url: "https://www.nxp.com/products/rfid-nfc/ucode-rain-rfid-uhf/ucode-8-8m%3ASL3S1205-15" },
    { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
    { name: "ISO/IEC 18000-63:2021", url: "https://www.iso.org/standard/78309.html" },
  ],
  "/product/desfire-tag/": [
    { name: "NXP MIFARE DESFire Family", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-desfire%3AMC_5348" },
    { name: "NXP MIFARE DESFire EV2", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-desfire/mifare-desfire-ev2%3AMF3Dx2" },
    { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
  ],
  "/product/google-review-nfc-card/": [
    { name: "Google Business Profile Help: Get more reviews", url: "https://support.google.com/business/answer/3474122" },
    { name: "NFC Forum Type 2 Tag Specification", url: "https://nfc-forum.org/build/specifications/type-2-tag-specification/" },
    { name: "NXP NTAG 213/215/216", url: "https://www.nxp.com/products/rfid-nfc/nfc-hf/ntag-for-tags-and-labels/ntag-213-215-216:NTAG213_215_216" },
    { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
  ],
  "/product/hotel-key-cards/": [
    { name: "NXP MIFARE Classic EV1", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-classic/mifare-classic-ev1-1k-4k:MF1S50YYX_V1" },
    { name: "NXP MIFARE Plus Family", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-plus%3AMC_57609" },
    { name: "NXP MIFARE DESFire Family", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-desfire%3AMC_5348" },
    { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
  ],
  "/product/mifare-4k-card/": [
    { name: "NXP MIFARE Classic EV1", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-classic/mifare-classic-ev1-1k-4k:MF1S50YYX_V1" },
    { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
  ],
  "/product/mifare-stickers/": [
    { name: "NXP MIFARE Classic EV1", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-classic/mifare-classic-ev1-1k-4k:MF1S50YYX_V1" },
    { name: "NXP MIFARE Plus Family", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-plus%3AMC_57609" },
    { name: "NXP MIFARE DESFire Family", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-desfire%3AMC_5348" },
    { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
  ],
  "/product/metal-nfc-card/": [
    { name: "NFC Forum Type 2 Tag Specification", url: "https://nfc-forum.org/build/specifications/type-2-tag-specification/" },
    { name: "NXP NTAG 213/215/216", url: "https://www.nxp.com/products/rfid-nfc/nfc-hf/ntag-for-tags-and-labels/ntag-213-215-216:NTAG213_215_216" },
    { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
  ],
  "/product/nfc-business-card/": [
    { name: "NFC Forum Type 2 Tag Specification", url: "https://nfc-forum.org/build/specifications/type-2-tag-specification/" },
    { name: "NXP NTAG 213/215/216", url: "https://www.nxp.com/products/rfid-nfc/nfc-hf/ntag-for-tags-and-labels/ntag-213-215-216:NTAG213_215_216" },
    { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
  ],
  "/product/nfc-cards/": [
    { name: "NFC Forum Type 2 Tag Specification", url: "https://nfc-forum.org/build/specifications/type-2-tag-specification/" },
    { name: "NXP NTAG 213/215/216", url: "https://www.nxp.com/products/rfid-nfc/nfc-hf/ntag-for-tags-and-labels/ntag-213-215-216:NTAG213_215_216" },
    { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
  ],
  "/product/nfc-sticker/": [
    { name: "NFC Forum Type 2 Tag Specification", url: "https://nfc-forum.org/build/specifications/type-2-tag-specification/" },
    { name: "NXP NTAG 213/215/216", url: "https://www.nxp.com/products/rfid-nfc/nfc-hf/ntag-for-tags-and-labels/ntag-213-215-216:NTAG213_215_216" },
    { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
  ],
  "/product/nfc-stickers/": [
    { name: "NFC Forum Type 2 Tag Specification", url: "https://nfc-forum.org/build/specifications/type-2-tag-specification/" },
    { name: "NFC Forum Type 4 Tag Specification", url: "https://nfc-forum.org/build/specifications/type-4-tag-specification/" },
    { name: "NXP NTAG 213/215/216", url: "https://www.nxp.com/products/rfid-nfc/nfc-hf/ntag-for-tags-and-labels/ntag-213-215-216:NTAG213_215_216" },
    { name: "ISO/IEC 14443-4:2018", url: "https://www.iso.org/standard/73599.html" },
  ],
  "/product/printed-rfid-cards/": [
    { name: "EM4200 | EM Microelectronic", url: "https://www.emmicroelectronic.com/product/lf-animal-access-ics/em4200" },
    { name: "NXP MIFARE Classic EV1", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-classic/mifare-classic-ev1-1k-4k:MF1S50YYX_V1" },
    { name: "NXP MIFARE DESFire Family", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-desfire%3AMC_5348" },
    { name: "NXP UCODE 8/8m", url: "https://www.nxp.com/products/rfid-nfc/ucode-rain-rfid-uhf/ucode-8-8m%3ASL3S1205-15" },
    { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
  ],
  "/product/pps-rfid-laundry-tag/": [
    { name: "NXP ICODE SLIX2", url: "https://www.nxp.com/products/SL2S2602" },
    { name: "NXP ICODE SLIX", url: "https://www.nxp.com/products/SL2S2002_SL2S2102" },
    { name: "ISO/IEC 15693-3:2019", url: "https://www.iso.org/standard/73602.html" },
  ],
  "/product/rfid-laundry-tags/": [
    { name: "NXP ICODE SLIX2", url: "https://www.nxp.com/products/SL2S2602" },
    { name: "NXP ICODE SLIX", url: "https://www.nxp.com/products/SL2S2002_SL2S2102" },
    { name: "GS1 EPC UHF Gen2 Air Interface Protocol", url: "https://www.gs1.org/standards/rfid/uhf-air-interface-protocol" },
    { name: "ISO/IEC 15693-3:2019", url: "https://www.iso.org/standard/73602.html" },
    { name: "ISO/IEC 18000-63:2021", url: "https://www.iso.org/standard/78309.html" },
  ],
  "/product/rfid-paper-card/": [
    { name: "NXP MIFARE Classic EV1", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-classic/mifare-classic-ev1-1k-4k:MF1S50YYX_V1" },
    { name: "NXP UCODE 8/8m", url: "https://www.nxp.com/products/rfid-nfc/ucode-rain-rfid-uhf/ucode-8-8m%3ASL3S1205-15" },
    { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
    { name: "ISO/IEC 18000-63:2021", url: "https://www.iso.org/standard/78309.html" },
  ],
  "/product/rfid-silicone-laundry-tag/": [
    { name: "GS1 EPC UHF Gen2 Air Interface Protocol", url: "https://www.gs1.org/standards/rfid/uhf-air-interface-protocol" },
    { name: "ISO/IEC 18000-63:2021", url: "https://www.iso.org/standard/78309.html" },
    { name: "NXP UCODE 8/8m", url: "https://www.nxp.com/products/rfid-nfc/ucode-rain-rfid-uhf/ucode-8-8m%3ASL3S1205-15" },
    { name: "Impinj Monza R6 Tag Chip", url: "https://www.impinj.com/about-us/news-room/2014/impinj-introduces-monza-r6-tag-chip-to-drive-retail-applications" },
    { name: "RAIN Alliance Standards", url: "https://therainalliance.org/standards/" },
  ],
  "/product/rfid-silicone-wristbands/": [
    { name: "EM4200 | EM Microelectronic", url: "https://www.emmicroelectronic.com/product/lf-animal-access-ics/em4200" },
    { name: "ATA5577C | Microchip", url: "https://www.microchip.com/en-us/product/ATA5577C" },
    { name: "NXP MIFARE Classic EV1", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-classic/mifare-classic-ev1-1k-4k:MF1S50YYX_V1" },
    { name: "NXP MIFARE DESFire Family", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-desfire%3AMC_5348" },
    { name: "NXP NTAG 213/215/216", url: "https://www.nxp.com/products/rfid-nfc/nfc-hf/ntag-for-tags-and-labels/ntag-213-215-216:NTAG213_215_216" },
  ],
  "/product/rfid-sticker-on-headlight/": [
    { name: "GS1 EPC UHF Gen2 Air Interface Protocol", url: "https://www.gs1.org/standards/rfid/uhf-air-interface-protocol" },
    { name: "ISO/IEC 18000-63:2021", url: "https://www.iso.org/standard/78309.html" },
    { name: "Impinj Monza 4QT", url: "https://www.impinj.com/products/tag-chips/impinj-monza-4-series" },
  ],
  "/product/rfid-tag-with-led-light/": [
    { name: "GS1 EPC UHF Gen2 Air Interface Protocol", url: "https://www.gs1.org/standards/rfid/uhf-air-interface-protocol" },
    { name: "ISO/IEC 18000-63:2021", url: "https://www.iso.org/standard/78309.html" },
    { name: "RAIN Alliance Standards", url: "https://therainalliance.org/standards/" },
  ],
  "/product/rfid-windshield-tag/": [
    { name: "GS1 EPC UHF Gen2 Air Interface Protocol", url: "https://www.gs1.org/standards/rfid/uhf-air-interface-protocol" },
    { name: "ISO/IEC 18000-63:2021", url: "https://www.iso.org/standard/78309.html" },
    { name: "NXP UCODE 8/8m", url: "https://www.nxp.com/products/rfid-nfc/ucode-rain-rfid-uhf/ucode-8-8m%3ASL3S1205-15" },
    { name: "NXP UCODE DNA", url: "https://www.nxp.com/products/rfid-nfc/ucode-rain-rfid-uhf/ucode-dna-uhf-tag-ic-for-secure-authentication%3ASL3S5002N0FUD" },
    { name: "Impinj Monza 4QT", url: "https://www.impinj.com/products/tag-chips/impinj-monza-4-series" },
  ],
  "/product/uhf-wristband/": [
    { name: "GS1 EPC UHF Gen2 Air Interface Protocol", url: "https://www.gs1.org/standards/rfid/uhf-air-interface-protocol" },
    { name: "ISO/IEC 18000-63:2021", url: "https://www.iso.org/standard/78309.html" },
    { name: "Impinj Monza R6 Tag Chip", url: "https://www.impinj.com/about-us/news-room/2014/impinj-introduces-monza-r6-tag-chip-to-drive-retail-applications" },
  ],
  "/product/inkjet-pvc-id-card/": [
    { name: "ISO/IEC 7810:2019", url: "https://www.iso.org/standard/70483.html" },
    { name: "EM4200 | EM Microelectronic", url: "https://www.emmicroelectronic.com/product/lf-animal-access-ics/em4200" },
    { name: "NXP MIFARE Classic EV1", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-classic/mifare-classic-ev1-1k-4k:MF1S50YYX_V1" },
    { name: "NXP NTAG 213/215/216", url: "https://www.nxp.com/products/rfid-nfc/nfc-hf/ntag-for-tags-and-labels/ntag-213-215-216:NTAG213_215_216" },
    { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
  ],
  "/product/wooden-rfid-card/": [
    { name: "NXP MIFARE Classic EV1", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-classic/mifare-classic-ev1-1k-4k:MF1S50YYX_V1" },
    { name: "NXP NTAG 213/215/216", url: "https://www.nxp.com/products/rfid-nfc/nfc-hf/ntag-for-tags-and-labels/ntag-213-215-216:NTAG213_215_216" },
    { name: "NXP ICODE SLIX2", url: "https://www.nxp.com/products/SL2S2602" },
    { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
    { name: "ISO/IEC 15693-3:2019", url: "https://www.iso.org/standard/73602.html" },
  ],
  "/product/rfid-event-wristband/": [
    { name: "NXP MIFARE Classic EV1", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-classic/mifare-classic-ev1-1k-4k:MF1S50YYX_V1" },
    { name: "NXP MIFARE Ultralight EV1", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-ultralight/mifare-ultralight-ev1:MF0ULX1" },
    { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
  ],
  "/product/rfid-wristbands-for-events/": [
    { name: "NXP MIFARE Classic EV1", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-classic/mifare-classic-ev1-1k-4k:MF1S50YYX_V1" },
    { name: "NXP MIFARE Ultralight EV1", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-ultralight/mifare-ultralight-ev1:MF0ULX1" },
    { name: "NXP NTAG 213/215/216", url: "https://www.nxp.com/products/rfid-nfc/nfc-hf/ntag-for-tags-and-labels/ntag-213-215-216:NTAG213_215_216" },
    { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
  ],
  "/product/rfid-wristbands-for-hotels/": [
    { name: "EM4200 | EM Microelectronic", url: "https://www.emmicroelectronic.com/product/lf-animal-access-ics/em4200" },
    { name: "ATA5577C | Microchip", url: "https://www.microchip.com/en-us/product/ATA5577C" },
    { name: "NXP MIFARE Classic EV1", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-classic/mifare-classic-ev1-1k-4k:MF1S50YYX_V1" },
    { name: "NXP MIFARE DESFire Family", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-desfire%3AMC_5348" },
    { name: "NXP NTAG 213/215/216", url: "https://www.nxp.com/products/rfid-nfc/nfc-hf/ntag-for-tags-and-labels/ntag-213-215-216:NTAG213_215_216" },
  ],
};

export const ARTICLE_SUPPORT_PROFILES: Record<string, ArticleSupportProfile> = {
  "/2024/12/22/rfid-laundry-tags/": {
    takeaways: [
      "Explains how RFID laundry tags survive wash, drying, sterilization, and repeated textile-handling cycles.",
      "Highlights where PPS, silicone, and textile laundry tags fit different linen, garment, and uniform workflows.",
      "Gives buyers a practical checklist for pilot testing, including attachment method, read points, and wash conditions.",
    ],
    guidanceFields: [
      {
        label: "Best for",
        value: "Commercial laundries, hospital linen programs, workwear rental, and textile traceability projects with repeated wash cycles.",
      },
      {
        label: "Compare first",
        value: "Compare PPS, silicone, and textile tag formats against wash temperature, chemical exposure, attachment method, and read distance.",
      },
      {
        label: "What to confirm",
        value: "Send garment or linen type, attachment method, wash temperature, detergent environment, reader location, and expected cycle count.",
      },
      {
        label: "Next step",
        value: "Shortlist a standard laundry tag, PPS tag, or silicone laundry tag and request a pilot sample before volume rollout.",
      },
    ],
    relatedPages: [
      { name: "Standard RFID Laundry Tags", url: absoluteUrl("/product/rfid-laundry-tags/") },
      { name: "PPS RFID Laundry Tag", url: absoluteUrl("/product/pps-rfid-laundry-tag/") },
      { name: "Silicone RFID Laundry Tag", url: absoluteUrl("/product/rfid-silicone-laundry-tag/") },
      { name: "Contact Proud Tek", url: absoluteUrl("/contact/") },
    ],
    sourceLinks: [
      { name: "Markets and Markets RFID Market Report", url: "https://www.marketsandmarkets.com/Market-Reports/rfid-market-446.html" },
      { name: "RFID Journal", url: "https://www.rfidjournal.com/" },
      { name: "ISO 15693 Standard Overview", url: "https://www.iso.org/standard/73591.html" },
    ],
  },
  "/2024/12/24/rfid-event-wristband/": {
    takeaways: [
      "Breaks down how RFID event wristbands support entry control, cashless operations, and attendee analytics in one credential.",
      "Compares common wristband materials and explains how environment, wear time, and branding goals affect the choice.",
      "Translates event-use benefits into a concrete buying checklist for chip choice, reader placement, and guest flow.",
    ],
    guidanceFields: [
      {
        label: "Best for",
        value: "Festivals, conferences, resorts, clubs, waterparks, and branded access-control programs that need durable wearable credentials.",
      },
      {
        label: "Compare first",
        value: "Compare silicone, woven, paper, and fabric wristbands based on event duration, water exposure, security needs, and print area.",
      },
      {
        label: "What to confirm",
        value: "Share expected attendance, chip or frequency preference, reader type, anti-transfer needs, artwork, and delivery deadline.",
      },
      {
        label: "Next step",
        value: "Match the event workflow to a standard event wristband, hotel wristband, or silicone wristband sample set before ordering.",
      },
    ],
    relatedPages: [
      { name: "RFID Event Wristband", url: absoluteUrl("/product/rfid-event-wristband/") },
      { name: "RFID Wristbands for Events", url: absoluteUrl("/product/rfid-wristbands-for-events/") },
      { name: "RFID Silicone Wristbands", url: absoluteUrl("/product/rfid-silicone-wristbands/") },
      { name: "Contact Proud Tek", url: absoluteUrl("/contact/") },
    ],
    sourceLinks: [
      { name: "RFID Journal", url: "https://www.rfidjournal.com/" },
      { name: "ISO/IEC 14443 Standard", url: "https://www.iso.org/standard/73596.html" },
      { name: "Event Manager Blog", url: "https://www.eventmanagerblog.com/" },
      { name: "Event Industry Council", url: "https://www.eventindustrycouncil.org/" },
    ],
  },
  "/2024/12/24/rfid-wooden-card/": {
    takeaways: [
      "Positions wooden RFID cards as a premium, sustainability-led alternative to standard plastic credentials.",
      "Explains where wood veneer cards fit best, including hospitality, membership, brand campaigns, and eco-forward gifting.",
      "Helps buyers balance visual finish, NFC function, durability expectations, and print customization before sampling.",
    ],
    guidanceFields: [
      {
        label: "Best for",
        value: "Eco-focused brand activations, premium membership cards, hotel credentials, and NFC business cards with a natural-material finish.",
      },
      {
        label: "Compare first",
        value: "Compare wooden cards with eco PVC or paper-based cards based on finish expectations, chip needs, durability, and budget.",
      },
      {
        label: "What to confirm",
        value: "Send preferred wood finish, chip type, print or laser-marking needs, quantity, and whether the card is for access, tap, or branding.",
      },
      {
        label: "Next step",
        value: "Review wooden card and eco card samples together so appearance and tap performance can be approved before production.",
      },
    ],
    relatedPages: [
      { name: "Wooden RFID Cards", url: absoluteUrl("/product/wooden-rfid-card/") },
      { name: "Eco RFID Cards", url: absoluteUrl("/product/eco_rfid_card/") },
      { name: "NFC Business Cards", url: absoluteUrl("/product/nfc-business-card/") },
      { name: "Contact Proud Tek", url: absoluteUrl("/contact/") },
    ],
    sourceLinks: [
      { name: "RFID Journal", url: "https://www.rfidjournal.com/" },
      { name: "FSC", url: "https://fsc.org/" },
      { name: "Markets and Markets", url: "https://www.marketsandmarkets.com/" },
      { name: "NFC Forum", url: "https://nfc-forum.org/" },
    ],
  },
  "/2024/12/25/rfid-hotel-key-card/": {
    takeaways: [
      "Explains why hotels replace magnetic keys with RFID credentials for faster guest access, stronger control, and easier room-key management.",
      "Maps hotel key-card choices to compatibility, branding, encoding, and guest-experience requirements.",
      "Turns the guide into a hotel-buyer checklist covering lock system, chip family, artwork, and rollout logistics.",
    ],
    guidanceFields: [
      {
        label: "Best for",
        value: "Hotels, resorts, serviced apartments, and guest-access programs that need encoded room keys with branded card production.",
      },
      {
        label: "Compare first",
        value: "Confirm hotel lock compatibility, chip family, encoding workflow, and whether a card or wristband format fits the guest journey better.",
      },
      {
        label: "What to confirm",
        value: "Share hotel lock brand, card standard, encoding or numbering needs, artwork files, quantity by property, and delivery schedule.",
      },
      {
        label: "Next step",
        value: "Validate compatibility with a small encoded sample batch before placing a multi-property or seasonal room-key order.",
      },
    ],
    relatedPages: [
      { name: "Hotel Key Cards", url: absoluteUrl("/product/hotel-key-cards/") },
      { name: "RFID Wristbands for Hotels", url: absoluteUrl("/product/rfid-wristbands-for-hotels/") },
      { name: "MIFARE Classic Cards", url: absoluteUrl("/product/mifare-classic-card/") },
      { name: "Contact Proud Tek", url: absoluteUrl("/contact/") },
    ],
    sourceLinks: [
      { name: "Hotel Management Magazine", url: "https://www.hotelmanagement.net/" },
      { name: "American Hotel & Lodging Association", url: "https://www.ahla.com/" },
      { name: "Hospitality Net", url: "https://www.hospitalitynet.org/" },
      { name: "Cornell Hospitality Research", url: "https://www.cornellcenter.sha.cornell.edu/" },
    ],
  },
  "/2025/11/04/mifare_plus_card/": {
    takeaways: [
      "Explains how MIFARE Plus improves security over legacy credentials while keeping migration paths practical for existing systems.",
      "Breaks down the variant choices, including memory options, security posture, and where EV2 or higher-assurance versions make sense.",
      "Helps technical buyers connect protocol, reader compatibility, firmware readiness, and certification checks before procurement.",
    ],
    guidanceFields: [
      {
        label: "Best for",
        value: "Projects upgrading from MIFARE Classic to stronger AES-based credentials in transport, access control, campus, or multi-application programs.",
      },
      {
        label: "Compare first",
        value: "Compare MIFARE Plus against Classic and DESFire based on security level, migration path, memory size, and backend-reader compatibility.",
      },
      {
        label: "What to confirm",
        value: "Share required variant, memory size, reader firmware status, certification expectations, encoding plan, and migration constraints.",
      },
      {
        label: "Next step",
        value: "Review MIFARE Plus and DESFire samples on a reference reader before locking the final credential family for deployment.",
      },
    ],
    relatedPages: [
      { name: "MIFARE Plus Cards", url: absoluteUrl("/product/mifare-plus-card/") },
      { name: "MIFARE DESFire Cards", url: absoluteUrl("/product/mifare-desfire-cards/") },
      { name: "MIFARE DESFire EV2 Cards", url: absoluteUrl("/product/mifare-desfire-ev2-cards/") },
      { name: "ACR122U NFC Reader Writer", url: absoluteUrl("/product/acr122u/") },
    ],
    sourceLinks: [
      { name: "NXP MIFARE Plus Family", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-plus%3AMC_57609" },
      { name: "NXP MIFARE Plus EV2", url: "https://www.nxp.com/products/MFPEV2" },
      { name: "NXP MIFARE Plus SE", url: "https://www.nxp.com/products/MIFARE_PLUS_SE_1K" },
      { name: "NXP AN12057 Reader Infrastructure Guidance", url: "https://www.nxp.com/docs/en/application-note/AN12057.pdf" },
      { name: "NXP AN10927 MIFARE UID Handling", url: "https://www.nxp.com/docs/en/application-note/AN10927.pdf" },
      { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
    ],
  },
};

export const COLLECTION_SUPPORT_PROFILES: Record<string, CollectionSupportProfile> = {
  "/products/all/": {
    takeaways: [
      "Presents the full English Proud Tek catalog across RFID cards, tags, labels, readers, keyfobs and wristbands.",
      "Works best as a first-pass shortlist when buyers still need to narrow the project by protocol, form factor and deployment environment.",
      "Helps procurement teams move from broad catalog review into a smaller set of compatible product families before sampling.",
    ],
    guidanceFields: [
      {
        label: "Start from your project type",
        value: "Hotel access → RFID cards. Laundry tracking → RFID tags. Phone-tap marketing → NFC labels. Event check-in → wristbands. Desktop encoding → readers.",
      },
      {
        label: "Narrow by protocol first",
        value: "125 kHz for legacy proximity systems, 13.56 MHz (MIFARE/NFC) for modern access and smart interactions, 860–960 MHz UHF for long-range vehicle or asset tracking.",
      },
      {
        label: "Jump to the right collection",
        value: "Each product family page shows only relevant SKUs and lets you compare materials, chips and form factors side by side instead of scrolling through 51 products.",
      },
      {
        label: "What to include in your inquiry",
        value: "Target application, installed reader or lock brand, chip preference, sample quantity, and your timeline for testing or production delivery.",
      },
    ],
    relatedPages: [
      { name: "RFID Cards", url: absoluteUrl("/products/rfid-cards/") },
      { name: "RFID Tags", url: absoluteUrl("/products/rfid-tags/") },
      { name: "RFID Labels", url: absoluteUrl("/products/rfid-labels/") },
      { name: "RFID Readers", url: absoluteUrl("/products/rfid-readers/") },
      { name: "RFID Keyfobs", url: absoluteUrl("/products/rfid-keyfobs/") },
      { name: "RFID Wristbands", url: absoluteUrl("/products/rfid-wristbands/") },
    ],
    sourceLinks: [
      { name: "ISO/IEC 7810:2019", url: "https://www.iso.org/standard/70483.html" },
      { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
      { name: "ISO/IEC 15693-3:2019", url: "https://www.iso.org/standard/73602.html" },
      { name: "GS1 EPC UHF Gen2 Air Interface Protocol", url: "https://www.gs1.org/standards/rfid/uhf-air-interface-protocol" },
      { name: "ISO/IEC 18000-63:2021", url: "https://www.iso.org/standard/78309.html" },
      { name: "NFC Forum Type 2 Tag Specification", url: "https://nfc-forum.org/build/specifications/type-2-tag-specification/" },
    ],
    faqEntries: [
      {
        question: "How should buyers use the full RFID product catalog first?",
        answer:
          "Use the full catalog to decide the right product family first, then move into cards, tags, labels, readers, keyfobs or wristbands based on the application, installed readers and operating environment.",
      },
      {
        question: "What details matter most before shortlisting products from the full catalog?",
        answer:
          "The key inputs are target application, chip or frequency preference, read range, material or mounting environment, customization needs and expected sample or delivery timing.",
      },
      {
        question: "When should buyers move from the full catalog into a narrower product collection?",
        answer:
          "As soon as the project is clearly about one workflow such as hotel cards, laundry tags, NFC labels, desktop readers or wearable wristbands, a narrower collection makes comparison and quoting faster.",
      },
    ],
  },
  "/products/rfid-cards/": {
    takeaways: [
      "Covers LF, HF and NFC card formats for access control, hospitality, membership and custom printed card projects.",
      "Helps buyers compare blank, pre-printed, hotel, MIFARE and dual-interface cards before sampling.",
      "Works best when chip family, print finish, encoding flow and card thickness are confirmed together.",
    ],
    guidanceFields: [
      {
        label: "Check lock or reader compatibility first",
        value: "Your door lock brand decides the chip: Assa Abloy Vingcard usually needs MIFARE Classic, Salto works with DESFire, and legacy 125 kHz systems need EM4100 or T5577 cards.",
      },
      {
        label: "Then pick your card material",
        value: "Standard PVC for everyday use, PET for thinner hotel keys, ABS for extra durability, or wood and eco-material for premium branding.",
      },
      {
        label: "Decide printing and encoding",
        value: "Choose between blank stock, single-side or dual-side offset printing, UV spot, foil stamping, numbering, QR codes, or pre-encoded chip data.",
      },
      {
        label: "What to include in your inquiry",
        value: "Lock or reader brand, chip family, card thickness (0.84 mm standard), print artwork files, encoding specs, and sample quantity with timeline.",
      },
    ],
    relatedPages: [
      { name: "Hotel Key Cards", url: absoluteUrl("/product/hotel-key-cards/") },
      { name: "MIFARE Classic Cards", url: absoluteUrl("/product/mifare-classic-card/") },
      { name: "Blank RFID Cards", url: absoluteUrl("/product/blank-rfid-card/") },
      { name: "Dual Interface Smart Cards", url: absoluteUrl("/product/dual-interface-card/") },
      { name: "Custom NFC Cards", url: absoluteUrl("/product/nfc-cards/") },
    ],
    sourceLinks: [
      { name: "ISO/IEC 7810:2019", url: "https://www.iso.org/standard/70483.html" },
      { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
      { name: "NXP MIFARE Classic EV1", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-classic/mifare-classic-ev1-1k-4k:MF1S50YYX_V1" },
      { name: "NXP MIFARE DESFire Family", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-desfire%3AMC_5348" },
      { name: "NXP NTAG 213/215/216", url: "https://www.nxp.com/products/rfid-nfc/nfc-hf/ntag-for-tags-and-labels/ntag-213-215-216:NTAG213_215_216" },
    ],
    faqEntries: [
      {
        question: "Which RFID card family should buyers shortlist first?",
        answer:
          "Start from the use case: hotel access usually begins with hotel key cards, mainstream access control often starts with MIFARE Classic or DESFire, and tap-to-share or smart business use usually starts with NFC card families such as NTAG.",
      },
      {
        question: "What should buyers confirm before ordering custom RFID cards?",
        answer:
          "Confirm reader or lock compatibility, chip family, card material, print finish, encoding or numbering requirement, and whether the card needs to work with an existing software or door-lock workflow.",
      },
      {
        question: "Can one supplier support blank, printed and encoded card projects together?",
        answer:
          "Yes. The main decision is whether you only need blank stock, fully printed cards, or cards that also require numbering, QR, magnetic stripe or chip encoding before delivery.",
      },
    ],
  },
  "/products/rfid-cards/standard-rfid-wood-card/": {
    takeaways: [
      "Covers wooden RFID and NFC card options for eco-focused hospitality, membership, access-control and branded credential programs.",
      "Helps buyers compare natural wood card materials with the right LF, HF or NFC chip family before sampling.",
      "Works best when card thickness, engraving or print method, chip family and guest-facing brand goals are confirmed together.",
    ],
    guidanceFields: [
      {
        label: "When to choose wood over PVC",
        value: "Pick wooden cards when guest perception, eco-branding, or premium unboxing experience matters more than unit cost — common in boutique hotels, co-working spaces, and membership programs.",
      },
      {
        label: "Laser engraving vs UV printing",
        value: "Laser engraving gives a tactile, permanent mark ideal for logos and room numbers. UV printing adds full-color artwork but sits on the surface. Many projects combine both.",
      },
      {
        label: "Chip compatibility is the same as PVC",
        value: "Wood cards embed the same MIFARE Classic, DESFire, NTAG, or EM4100 chips as standard PVC. Your existing locks and readers work without changes.",
      },
      {
        label: "What to include in your inquiry",
        value: "Wood species preference (bamboo, walnut, cherry), chip family, engraving artwork, card thickness, and sample quantity.",
      },
    ],
    relatedPages: [
      { name: "Wooden RFID and NFC Cards", url: absoluteUrl("/product/wooden-rfid-card/") },
      { name: "Eco RFID Cards", url: absoluteUrl("/product/eco_rfid_card/") },
      { name: "Blank RFID Cards", url: absoluteUrl("/product/blank-rfid-card/") },
      { name: "Printed RFID Cards", url: absoluteUrl("/product/printed-rfid-cards/") },
      { name: "Contact Proud Tek", url: absoluteUrl("/contact/") },
    ],
    sourceLinks: [
      { name: "ISO/IEC 7810:2019", url: "https://www.iso.org/standard/70483.html" },
      { name: "NXP MIFARE Classic EV1", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-classic/mifare-classic-ev1-1k-4k:MF1S50YYX_V1" },
      { name: "NXP NTAG 213/215/216", url: "https://www.nxp.com/products/rfid-nfc/nfc-hf/ntag-for-tags-and-labels/ntag-213-215-216:NTAG213_215_216" },
      { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
      { name: "ISO/IEC 15693-3:2019", url: "https://www.iso.org/standard/73602.html" },
    ],
    faqEntries: [
      {
        question: "When should buyers choose a wooden RFID card instead of PVC?",
        answer:
          "Choose a wooden RFID card when the project needs a more natural, premium or eco-forward presentation while still supporting RFID or NFC credential functions.",
      },
      {
        question: "What should buyers confirm before ordering wooden RFID cards?",
        answer:
          "Confirm chip family, card thickness, print or engraving method, expected reader or lock compatibility, and whether the project needs numbering or encoding before delivery.",
      },
      {
        question: "Can wooden RFID cards support hotel, membership and NFC sharing projects?",
        answer:
          "Yes. They are commonly shortlisted for hospitality, branded membership, premium event credentials and NFC tap-to-share programs when aesthetics matter as much as chip functionality.",
      },
    ],
  },
  "/products/rfid-tags/": {
    takeaways: [
      "Covers industrial RFID tags for laundry, textiles, vehicle ID, asset tracking and fast item-location workflows.",
      "Helps buyers separate HF laundry tags from UHF tracking tags before comparing material, read range and environment fit.",
      "Performs best when wash cycles, mounting surface, read point and required read distance are defined early.",
    ],
    guidanceFields: [
      {
        label: "Two very different tag families live here",
        value: "HF laundry tags (13.56 MHz) survive 200+ wash cycles sewn into textiles. UHF tracking tags (860–960 MHz) read at 3–10 meters through vehicle windshields or on warehouse assets. Pick your path first.",
      },
      {
        label: "For laundry: confirm wash cycle and attachment",
        value: "PPS tags handle industrial autoclaving (rated to 200 °C). Silicone tags flex with garments (wash 85 °C, press/ironing 180 °C). Textile tags sew flat into uniforms. The wash environment decides the housing.",
      },
      {
        label: "For vehicle and asset tracking: confirm read range",
        value: "Windshield tags stick behind glass for toll or parking. Headlight stickers survive outdoor UV. LED-enabled tags let operators locate items visually from 30+ meters.",
      },
      {
        label: "What to include in your inquiry",
        value: "Tagged item (garment, vehicle, asset), mounting method, operating temperature, required read distance, chip preference, and pilot quantity.",
      },
    ],
    relatedPages: [
      { name: "Industrial RFID Laundry Tags", url: absoluteUrl("/product/rfid-laundry-tags/") },
      { name: "PPS RFID Laundry Tag", url: absoluteUrl("/product/pps-rfid-laundry-tag/") },
      { name: "RFID Silicone Laundry Tag", url: absoluteUrl("/product/rfid-silicone-laundry-tag/") },
      { name: "RFID Windshield Tag", url: absoluteUrl("/product/rfid-windshield-tag/") },
      { name: "RFID Tag with LED Light", url: absoluteUrl("/product/rfid-tag-with-led-light/") },
    ],
    sourceLinks: [
      { name: "ISO/IEC 15693-3:2019", url: "https://www.iso.org/standard/73602.html" },
      { name: "GS1 EPC UHF Gen2 Air Interface Protocol", url: "https://www.gs1.org/standards/rfid/uhf-air-interface-protocol" },
      { name: "ISO/IEC 18000-63:2021", url: "https://www.iso.org/standard/78309.html" },
      { name: "NXP ICODE SLIX2", url: "https://www.nxp.com/products/SL2S2602" },
      { name: "RAIN Alliance Standards", url: "https://therainalliance.org/standards/" },
    ],
    faqEntries: [
      {
        question: "How do buyers choose between laundry tags and UHF tracking tags?",
        answer:
          "Laundry tags are selected when wash durability, sterilization and textile attachment matter. UHF tracking tags are selected when longer read range, portals or fast inventory counts are more important than wash-cycle endurance.",
      },
      {
        question: "What project details matter most before sampling RFID tags?",
        answer:
          "The key inputs are item material, where the tag will be mounted, target read distance, reader type, operating environment, and whether tamper resistance or anti-transfer behavior is required.",
      },
      {
        question: "Can one tag collection cover vehicle, laundry and industrial projects together?",
        answer:
          "Not with one tag model. The collection is broad, but the right shortlist normally splits by environment: textile laundry tags, vehicle windshield or headlight labels, and UHF industrial or LED-enabled asset tags.",
      },
    ],
  },
  "/products/rfid-readers/": {
    takeaways: [
      "Covers desktop NFC readers, reader-writer kits and mobile or Bluetooth-style RFID scanning workflows.",
      "Helps buyers separate card encoding, NFC development and portable field-reading use cases before selecting hardware.",
      "Selection becomes faster when chip family, connection method and required SDK or app environment are confirmed first.",
    ],
    guidanceFields: [
      {
        label: "Desktop encoding or field scanning?",
        value: "ACR122U plugs into USB for encoding hotel cards, writing NFC tags, or testing chips at a desk. Bluetooth scanners go into the field for inventory, event check-in, or warehouse reads.",
      },
      {
        label: "Match the reader to your chip",
        value: "13.56 MHz readers (ACR122U, SDK kit) work with MIFARE, DESFire, and NTAG chips. UHF readers work with EPC Gen2 tags. Make sure reader frequency matches your tags.",
      },
      {
        label: "SDK and OS matter for integration",
        value: "The SDK reader kit ships with Windows, macOS, and Linux libraries. ACR122U supports PC/SC on most platforms. Bluetooth scanners pair with Android and iOS apps.",
      },
      {
        label: "What to include in your inquiry",
        value: "Chip or tag type you need to read/write, host OS, desktop or mobile workflow, SDK language preference, and pilot quantity.",
      },
    ],
    relatedPages: [
      { name: "ACR122U NFC Reader Writer", url: absoluteUrl("/product/acr122u/") },
      { name: "NFC Reader Writer With Free SDKs", url: absoluteUrl("/product/nfc-reader-writer-with-free-sdks/") },
      { name: "Bluetooth RFID Scanner", url: absoluteUrl("/product/bluetooth-rfid-scanner/") },
      { name: "Browse RFID Cards", url: absoluteUrl("/products/rfid-cards/") },
      { name: "Browse RFID Tags", url: absoluteUrl("/products/rfid-tags/") },
    ],
    sourceLinks: [
      { name: "ACS ACR122U USB NFC Reader", url: "https://www.acs.com.hk/en/products/3/acr122u-usb-nfc-reader/" },
      { name: "ACS ACR122U User Manual", url: "https://docs.acs.com.hk/acr122u-user-manual/" },
      { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
      { name: "ISO/IEC 18092:2023", url: "https://www.iso.org/standard/85054.html" },
      { name: "Bluetooth Core Specification", url: "https://www.bluetooth.com/specifications/specs/core-specification-5-4/" },
    ],
    faqEntries: [
      {
        question: "Which RFID reader should buyers start with for desktop NFC work?",
        answer:
          "Desktop NFC projects usually start with ACR122U-class readers because they support common 13.56 MHz workflows, card testing and encoding on standard USB-connected systems.",
      },
      {
        question: "When should buyers choose a Bluetooth or handheld RFID reader?",
        answer:
          "Choose Bluetooth or portable readers when scanning must happen away from a desk, in field conditions, or through a mobile workflow rather than fixed USB workstations.",
      },
      {
        question: "What should buyers confirm before sourcing RFID readers?",
        answer:
          "Confirm the tag protocol, operating system, software environment, USB or wireless connection preference, and whether the project needs only reading, or both reading and writing or encoding.",
      },
    ],
  },
  "/products/rfid-labels/": {
    takeaways: [
      "Covers NFC stickers, MIFARE labels and UHF vehicle or tracking labels used for packaging, events, automotive and smart-label projects.",
      "Helps buyers split HF and NFC label jobs from UHF windshield or headlight label jobs before sampling.",
      "Selection is faster when mounting surface, print requirement and read-range target are defined together.",
    ],
    guidanceFields: [
      {
        label: "Phone-tap NFC or long-range UHF?",
        value: "NFC stickers (NTAG213/215) let customers tap with a phone — great for Google Review cards, smart packaging, and marketing touchpoints. UHF windshield labels read at 3–8 meters for vehicle ID and tolling.",
      },
      {
        label: "Surface and adhesive decide the format",
        value: "Flat surfaces use standard wet-inlay stickers. Metal surfaces need anti-metal labels with ferrite backing. Curved bottles or tubes need flexible face stock. Outdoor use needs UV-resistant lamination.",
      },
      {
        label: "Tamper-evident or reusable?",
        value: "One-time windshield labels fracture on removal to prevent transfer. Reusable NFC stickers on products can be reprogrammed. Decide this before choosing adhesive strength.",
      },
      {
        label: "What to include in your inquiry",
        value: "Mounting surface (glass, metal, paper, plastic), label diameter, chip family, print artwork, tamper requirement, and roll quantity.",
      },
    ],
    relatedPages: [
      { name: "NFC Stickers", url: absoluteUrl("/product/nfc-stickers/") },
      { name: "MIFARE Stickers", url: absoluteUrl("/product/mifare-stickers/") },
      { name: "RFID Windshield Tag", url: absoluteUrl("/product/rfid-windshield-tag/") },
      { name: "RFID Sticker on Headlight", url: absoluteUrl("/product/rfid-sticker-on-headlight/") },
    ],
    sourceLinks: [
      { name: "NFC Forum Type 2 Tag Specification", url: "https://nfc-forum.org/build/specifications/type-2-tag-specification/" },
      { name: "NXP MIFARE Classic EV1", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-classic/mifare-classic-ev1-1k-4k:MF1S50YYX_V1" },
      { name: "GS1 EPC UHF Gen2 Air Interface Protocol", url: "https://www.gs1.org/standards/rfid/uhf-air-interface-protocol" },
      { name: "ISO/IEC 18000-63:2021", url: "https://www.iso.org/standard/78309.html" },
      { name: "NXP UCODE 8/8m", url: "https://www.nxp.com/products/rfid-nfc/ucode-rain-rfid-uhf/ucode-8-8m%3ASL3S1205-15" },
    ],
    faqEntries: [
      {
        question: "How should buyers choose between NFC, MIFARE and UHF labels?",
        answer:
          "NFC and MIFARE labels are usually selected for short-range tap or credential workflows, while UHF labels are selected when longer read range, vehicle ID or portal-style reading is required.",
      },
      {
        question: "What details matter most before ordering RFID labels?",
        answer:
          "The key inputs are mounting surface, label size, print area, adhesive requirement, chip family, operating environment and expected read distance.",
      },
      {
        question: "Can one label collection support both vehicle and smart-label projects?",
        answer:
          "Yes at the collection level, but not with one label SKU. Vehicle programs usually split into windshield or headlight UHF labels, while smart packaging or tap workflows usually start with NFC or MIFARE sticker formats.",
      },
    ],
  },
  "/products/rfid-keyfobs/": {
    takeaways: [
      "Covers low-frequency proximity fobs, HF secure keyfobs and specialty wearable or token-style credential formats.",
      "Helps buyers separate HID-style proximity, MIFARE or DESFire security needs before sampling a keyfob line.",
      "The shortlist becomes clearer when credential format, reader compatibility and attachment style are confirmed together.",
    ],
    guidanceFields: [
      {
        label: "Check your access control system first",
        value: "HID ProxPoint readers need 125 kHz EM or HID fobs. MIFARE-based systems need 13.56 MHz fobs. DESFire or iCLASS systems need matching secure fobs. The reader decides the chip.",
      },
      {
        label: "Shell material and form factor",
        value: "ABS keyfobs are the standard durable option. Epoxy fobs are smaller and lighter. Silicone wearables clip to lanyards. NFC rings offer hands-free tap. Wood fobs add a premium feel.",
      },
      {
        label: "Branding and numbering",
        value: "Most fobs support laser engraving for logos, sequential numbering for facility management, and custom color matching for brand consistency.",
      },
      {
        label: "What to include in your inquiry",
        value: "Installed reader brand and model, chip family, fob shape preference, logo artwork, numbering range, and sample quantity.",
      },
    ],
    relatedPages: [
      { name: "RFID Key Fobs", url: absoluteUrl("/product/rfid-key-fob/") },
      { name: "RFID Proximity Fobs", url: absoluteUrl("/product/proximity-fobs/") },
      { name: "DESFire Tag", url: absoluteUrl("/product/desfire-tag/") },
      { name: "NFC Smart Rings", url: absoluteUrl("/product/nfc-ring/") },
      { name: "RFID Cards Collection", url: absoluteUrl("/products/rfid-cards/") },
    ],
    sourceLinks: [
      { name: "HID Proximity 1346 ProxKey III", url: "https://www.hidglobal.com/products/1346" },
      { name: "NXP MIFARE Classic EV1", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-classic/mifare-classic-ev1-1k-4k:MF1S50YYX_V1" },
      { name: "NXP MIFARE DESFire Family", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-desfire%3AMC_5348" },
      { name: "NXP NTAG 213/215/216", url: "https://www.nxp.com/products/rfid-nfc/nfc-hf/ntag-for-tags-and-labels/ntag-213-215-216:NTAG213_215_216" },
      { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
    ],
    faqEntries: [
      {
        question: "Which keyfob format should buyers start with for access control?",
        answer:
          "Start with the installed reader base. LF proximity systems usually begin with proximity fobs, while newer secure systems typically begin with MIFARE or DESFire-compatible keyfob formats.",
      },
      {
        question: "When should buyers choose a DESFire or NFC-based keyfob instead of a basic proximity fob?",
        answer:
          "Choose DESFire or NFC-based formats when stronger security, application flexibility, phone-tap style interaction or higher-value credential management matters more than simple low-frequency access control.",
      },
      {
        question: "What should buyers confirm before ordering RFID keyfobs?",
        answer:
          "Confirm reader compatibility, required chip family, shell material or form factor, numbering or encoding needs, and whether the project expects LF proximity, HF secure access or NFC interaction.",
      },
    ],
  },
  "/products/rfid-keyfobs/rfid-wooden-keyfob/": {
    takeaways: [
      "Covers wooden RFID keyfob options for eco-friendly access control, loyalty, hotel and branded credential programs.",
      "Helps buyers compare natural wooden shells with LF, HF or NFC credential options before selecting attachment style and chip family.",
      "Works best when the installed reader base, branding method and expected durability are confirmed before sampling.",
    ],
    guidanceFields: [
      {
        label: "When to choose wood over ABS",
        value: "Pick wooden keyfobs when the credential is guest-facing — boutique hotels, co-working spaces, or membership programs where the fob IS the brand touchpoint.",
      },
      {
        label: "Same chips, different shell",
        value: "Wooden fobs embed the same EM4100, MIFARE Classic, DESFire, or NTAG chips as standard ABS keyfobs. Your existing readers and software work without any changes.",
      },
      {
        label: "Engraving creates the premium feel",
        value: "Laser-engraved logos, room numbers, or QR codes look and feel more upscale than printed ABS. Bamboo, walnut, and cherry each give a different grain and color tone.",
      },
      {
        label: "What to include in your inquiry",
        value: "Reader brand, chip family, wood species preference, engraving artwork, attachment style (keyring, lanyard hole), and sample quantity.",
      },
    ],
    relatedPages: [
      { name: "RFID Key Fobs", url: absoluteUrl("/product/rfid-key-fob/") },
      { name: "RFID Proximity Fobs", url: absoluteUrl("/product/proximity-fobs/") },
      { name: "Wooden RFID and NFC Cards", url: absoluteUrl("/product/wooden-rfid-card/") },
      { name: "RFID Keyfobs Collection", url: absoluteUrl("/products/rfid-keyfobs/") },
      { name: "Contact Proud Tek", url: absoluteUrl("/contact/") },
    ],
    sourceLinks: [
      { name: "HID Proximity 1346 ProxKey III", url: "https://www.hidglobal.com/products/1346" },
      { name: "NXP MIFARE Classic EV1", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-classic/mifare-classic-ev1-1k-4k:MF1S50YYX_V1" },
      { name: "NXP NTAG 213/215/216", url: "https://www.nxp.com/products/rfid-nfc/nfc-hf/ntag-for-tags-and-labels/ntag-213-215-216:NTAG213_215_216" },
      { name: "NXP MIFARE DESFire Family", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-desfire%3AMC_5348" },
      { name: "ISO/IEC 14443-3:2011", url: "https://www.iso.org/standard/50942.html" },
    ],
    faqEntries: [
      {
        question: "When should buyers choose a wooden RFID keyfob?",
        answer:
          "Choose a wooden RFID keyfob when the project needs a branded or eco-forward credential that still works with the required LF, HF or NFC reader environment.",
      },
      {
        question: "What should buyers confirm before ordering wooden RFID keyfobs?",
        answer:
          "Confirm reader compatibility, chip family, shell shape, engraving or logo method, attachment hardware and whether numbering or encoding is required before shipment.",
      },
      {
        question: "Are wooden RFID keyfobs suitable for hospitality and access control programs?",
        answer:
          "Yes. They are suitable for hotel, resort, apartment, loyalty and branded access-control programs when buyers want a more premium natural-material keyfob format.",
      },
    ],
  },
  "/products/rfid-wristbands/": {
    takeaways: [
      "Covers event, hotel, silicone, eco and UHF wristband formats for wearable access, guest services and tracking workflows.",
      "Helps buyers separate short-range HF or NFC wristbands from UHF tracking wristbands before deciding on material and fit.",
      "Works best when wear duration, water exposure, guest experience and reader type are confirmed before sampling.",
    ],
    guidanceFields: [
      {
        label: "Match the band to the scenario",
        value: "Multi-day festivals → disposable Tyvek or fabric bands with anti-transfer clips. Hotel resorts and waterparks → reusable silicone bands. Healthcare → disposable soft PVC with patient ID print.",
      },
      {
        label: "Water, heat, and wear duration",
        value: "Silicone bands handle pools, spas, and repeated daily use. Eco/fabric bands are single-event disposable. UHF bands survive outdoor exposure but are selected for read range, not comfort.",
      },
      {
        label: "Anti-transfer and security",
        value: "One-time snap closures prevent band swapping between guests. Tamper-evident clips fracture on removal. Reusable silicone bands use buckle or RFID-lock closures for multi-day stays.",
      },
      {
        label: "What to include in your inquiry",
        value: "Event type or hotel workflow, expected wear duration, water exposure level, closure style, chip family, artwork, wrist size range (adult/child), and quantity with event date.",
      },
    ],
    relatedPages: [
      { name: "RFID Silicone Wristbands", url: absoluteUrl("/product/rfid-silicone-wristbands/") },
      { name: "RFID Event Wristband", url: absoluteUrl("/product/rfid-event-wristband/") },
      { name: "RFID Wristbands for Events", url: absoluteUrl("/product/rfid-wristbands-for-events/") },
      { name: "RFID Wristbands for Hotels", url: absoluteUrl("/product/rfid-wristbands-for-hotels/") },
      { name: "UHF Wristband", url: absoluteUrl("/product/uhf-wristband/") },
    ],
    sourceLinks: [
      { name: "NXP MIFARE Classic EV1", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-classic/mifare-classic-ev1-1k-4k:MF1S50YYX_V1" },
      { name: "NXP MIFARE Ultralight EV1", url: "https://www.nxp.com/products/rfid-nfc/mifare-hf/mifare-ultralight/mifare-ultralight-ev1:MF0ULX1" },
      { name: "NXP NTAG 213/215/216", url: "https://www.nxp.com/products/rfid-nfc/nfc-hf/ntag-for-tags-and-labels/ntag-213-215-216:NTAG213_215_216" },
      { name: "GS1 EPC UHF Gen2 Air Interface Protocol", url: "https://www.gs1.org/standards/rfid/uhf-air-interface-protocol" },
      { name: "ISO/IEC 18000-63:2021", url: "https://www.iso.org/standard/78309.html" },
    ],
    faqEntries: [
      {
        question: "How should buyers choose between HF wristbands and UHF wristbands?",
        answer:
          "HF or NFC wristbands are usually selected for access, guest services and close-range interactions, while UHF wristbands are selected when longer read range or faster multi-item capture is required.",
      },
      {
        question: "What matters most before ordering RFID wristbands?",
        answer:
          "The key decisions are event or hotel workflow, expected wear duration, material comfort, water exposure, reader compatibility, artwork method and anti-transfer or tamper needs.",
      },
      {
        question: "Which wristband type is the safest starting point for sampling?",
        answer:
          "Silicone wristbands are usually the easiest baseline sample for durability and general fit. From there, buyers can compare eco, fabric or UHF variants against the exact guest or tracking workflow.",
      },
    ],
  },
};

export const CORE_SUPPORT_PROFILES: Record<string, CoreSupportProfile> = {
  "/": {
    takeaways: [
      "Introduces Proud Tek as an English-language entry point for custom RFID and NFC manufacturing across cards, tags, labels, readers, keyfobs and wristbands.",
      "Helps buyers start from the broad catalog, then narrow into the right product family for hospitality, access control, laundry, vehicle ID and OEM workflows.",
      "Works best as the first step before moving into the highest-intent evergreen solution, comparison or contact route.",
    ],
    guidanceFields: [
      {
        label: "Best for",
        value: "First-pass supplier and catalog review for buyers who need to identify the right RFID or NFC product family before requesting samples.",
      },
      {
        label: "Compare first",
        value: "Separate the project into hotel cards, laundry tags, review NFC cards, NFC business cards, labels, readers, keyfobs or wristbands before opening the closest evergreen page.",
      },
      {
        label: "Where to go next",
        value: "Move into the most relevant evergreen solution or comparison page first, then open the matching product collection or contact route once the shortlist is clearer.",
      },
      {
        label: "What to send",
        value: "Share the target application, preferred chip or frequency, quantity, customization or encoding need, and sample or launch timing.",
      },
    ],
    relatedPages: [
      { name: "Hotel Key Card Compatibility Guide", url: absoluteUrl("/solutions/hotel-key-cards/") },
      { name: "RFID Laundry Tags Buyer's Guide", url: absoluteUrl("/solutions/rfid-laundry-tags/") },
      { name: "Google Review NFC Card Guide", url: absoluteUrl("/solutions/google-review-nfc-card/") },
      { name: "NFC Business Card Guide", url: absoluteUrl("/solutions/nfc-business-card/") },
      { name: "NTAG213 vs NTAG215 vs NTAG216", url: absoluteUrl("/compare/ntag213-vs-ntag215-vs-ntag216/") },
      { name: "Contact Proud Tek", url: absoluteUrl("/contact/") },
    ],
    sourceLinks: [
      { name: "Hotel Key Card Compatibility Guide", url: absoluteUrl("/solutions/hotel-key-cards/") },
      { name: "RFID Laundry Tags Buyer's Guide", url: absoluteUrl("/solutions/rfid-laundry-tags/") },
      { name: "Google Review NFC Card Guide", url: absoluteUrl("/solutions/google-review-nfc-card/") },
      { name: "NTAG213 vs NTAG215 vs NTAG216", url: absoluteUrl("/compare/ntag213-vs-ntag215-vs-ntag216/") },
      { name: "Hotel Key Card Encoding Guide", url: absoluteUrl("/guides/hotel-key-card-encoding/") },
      { name: "Compatibility Pages", url: absoluteUrl("/compatibility/") },
    ],
    faqEntries: [
      {
        question: "What does the Proud Tek homepage help buyers do first?",
        answer:
          "It helps buyers identify the right RFID or NFC product family first, then move into cards, tags, labels, readers, keyfobs or wristbands based on the application and deployment workflow.",
      },
      {
        question: "When should buyers move from the homepage into a product collection?",
        answer:
          "Move into a solution or comparison page as soon as the workflow is clear, then open a product collection once the form factor is already known.",
      },
      {
        question: "What should buyers prepare before contacting Proud Tek from the homepage?",
        answer:
          "Prepare the application, preferred chip or frequency, quantity, customization or encoding requirements, and the sample or delivery timeline.",
      },
    ],
  },
  "/about/": {
    takeaways: [
      "Introduces Proud Tek as a Shenzhen-based RFID and NFC manufacturer focused on custom cards, tags, labels, readers, wristbands and keyfobs.",
      "Helps buyers confirm whether the supplier fits OEM, hospitality, access-control, laundry and industrial identification programs.",
      "Works best when buyers use it together with product collections, FAQ guidance and the main contact page before requesting samples.",
    ],
    guidanceFields: [
      {
        label: "Best for",
        value: "Supplier qualification, OEM capability review, and early-stage sourcing checks for RFID and NFC manufacturing projects.",
      },
      {
        label: "What to confirm",
        value: "Confirm the target product family, chip or protocol, customization scope, encoding or numbering need, quantity band and delivery timing.",
      },
      {
        label: "Operations focus",
        value: "Use the company page to understand catalog breadth, manufacturing location, and whether Proud Tek fits the program before moving into product-level review.",
      },
      {
        label: "Next step",
        value: "Review the most relevant product collection, then send the project brief through the contact page with sample and timeline requirements.",
      },
    ],
    relatedPages: [
      { name: "All Products", url: absoluteUrl("/products/all/") },
      { name: "RFID Cards", url: absoluteUrl("/products/rfid-cards/") },
      { name: "RFID Tags", url: absoluteUrl("/products/rfid-tags/") },
      { name: "RFID Wristbands", url: absoluteUrl("/products/rfid-wristbands/") },
      { name: "Contact Proud Tek", url: absoluteUrl("/contact/") },
    ],
    sourceLinks: [
      { name: "Proud Tek Home", url: absoluteUrl("/") },
      { name: "All Products", url: absoluteUrl("/products/all/") },
      { name: "RFID Cards Collection", url: absoluteUrl("/products/rfid-cards/") },
      { name: "RFID Tags Collection", url: absoluteUrl("/products/rfid-tags/") },
      { name: "Contact Proud Tek", url: absoluteUrl("/contact/") },
    ],
    faqEntries: [
      {
        question: "What does Proud Tek manufacture?",
        answer:
          "Proud Tek manufactures RFID and NFC cards, tags, labels, readers, wristbands and keyfobs for custom OEM, hospitality, access-control, laundry and industrial projects.",
      },
      {
        question: "Who should use the Proud Tek company page first?",
        answer:
          "Buyers, sourcing teams and product managers should use it first when they want to confirm manufacturing fit, product scope and the next path into collections, FAQ guidance or contact.",
      },
      {
        question: "What should buyers prepare before contacting Proud Tek?",
        answer:
          "Prepare the product family, chip or frequency target, quantity, artwork or encoding needs, sample expectations and the deadline or launch timing.",
      },
    ],
  },
  "/contact/": {
    takeaways: [
      "Works as the main English contact page for RFID and NFC product inquiries, sample requests and manufacturing discussions.",
      "Performs best when buyers send a brief with product family, environment, quantity and timing instead of a generic catalog request.",
      "Routes buyers into the most relevant specialist contact page when the application is already clear, which usually shortens the first quoting cycle.",
    ],
    guidanceFields: [
      {
        label: "Best for",
        value: "Quote requests, sample requests, OEM customization, lead-time checks and compatibility questions before placing trial or production orders.",
      },
      {
        label: "What to send",
        value: "Share application, product type, chip or frequency, quantity, artwork, encoding or numbering need, testing environment and desired sample or ship date.",
      },
      {
        label: "Fastest path",
        value: "Use the specialist contact route when the project already fits hotel RFID, laundry RFID, review cards, readers, keyfobs, labels or vehicle identification.",
      },
      {
        label: "Next step",
        value: "If the product family is still unclear, use the general form with a short project brief, then move into the matching specialist route after the first reply.",
      },
    ],
    relatedPages: [
      { name: "All Products", url: absoluteUrl("/products/all/") },
      { name: "FAQ", url: absoluteUrl("/faq/") },
      { name: "RFID Cards", url: absoluteUrl("/products/rfid-cards/") },
      { name: "RFID Tags", url: absoluteUrl("/products/rfid-tags/") },
      { name: "About Proud Tek", url: absoluteUrl("/about/") },
    ],
    sourceLinks: [
      { name: "About Proud Tek", url: absoluteUrl("/about/") },
      { name: "FAQ", url: absoluteUrl("/faq/") },
      { name: "All Products", url: absoluteUrl("/products/all/") },
      { name: "RFID Cards Collection", url: absoluteUrl("/products/rfid-cards/") },
      { name: "RFID Tags Collection", url: absoluteUrl("/products/rfid-tags/") },
    ],
    faqEntries: [
      {
        question: "What should buyers send through the Proud Tek contact page?",
        answer:
          "Send the application, product family, chip or protocol, quantity, artwork or encoding need, test environment, sample requirement and the expected delivery timeline.",
      },
      {
        question: "When should buyers use the contact page instead of browsing more products?",
        answer:
          "Use the contact page once the project is specific enough to quote, sample or validate compatibility. If the application already matches a specialist contact route, use that route for a faster first reply.",
      },
      {
        question: "Can the contact page be used for both samples and production inquiries?",
        answer:
          "Yes. It is the main path for sampling, OEM customization, pricing and production discussions across the English product catalog.",
      },
      {
        question: "Does Proud Tek have separate contact paths for hotel, laundry or review-card projects?",
        answer:
          "Yes. Buyers can use the specialist contact pages for hotel RFID, laundry RFID, NFC branding cards, readers, keyfobs, labels and vehicle projects when the application is already clear.",
      },
    ],
  },
  "/faq/": {
    takeaways: [
      "Consolidates common English buying and compatibility questions across RFID cards, tags, labels, readers, wristbands and keyfobs.",
      "Works as a pre-quote filter so buyers can resolve basic fit, chip, customization and order-process questions before contacting sales.",
      "Pairs best with the product catalog and contact page when a project needs both technical clarification and quoting.",
    ],
    guidanceFields: [
      {
        label: "Best for",
        value: "Buyers who need quick answers on compatibility, customization, samples, ordering flow and production questions before requesting a quote.",
      },
      {
        label: "Compare first",
        value: "Use the FAQ to narrow the chip, protocol, material or order-process questions that still need confirmation before browsing or contacting sales.",
      },
      {
        label: "What to send",
        value: "After the FAQ resolves the basics, send the product type, chip target, quantity, customization needs and timing through the contact page.",
      },
      {
        label: "Next step",
        value: "Move from FAQ answers into the relevant product collection or directly into the contact page once the project brief is clear.",
      },
    ],
    relatedPages: [
      { name: "All Products", url: absoluteUrl("/products/all/") },
      { name: "Contact Proud Tek", url: absoluteUrl("/contact/") },
      { name: "RFID Cards", url: absoluteUrl("/products/rfid-cards/") },
      { name: "RFID Tags", url: absoluteUrl("/products/rfid-tags/") },
      { name: "Blog", url: absoluteUrl("/blog/") },
    ],
    sourceLinks: [
      { name: "All Products", url: absoluteUrl("/products/all/") },
      { name: "Contact Proud Tek", url: absoluteUrl("/contact/") },
      { name: "RFID Cards Collection", url: absoluteUrl("/products/rfid-cards/") },
      { name: "RFID Tags Collection", url: absoluteUrl("/products/rfid-tags/") },
      { name: "Blog", url: absoluteUrl("/blog/") },
    ],
  },
  "/blog/": {
    takeaways: [
      "Collects English RFID and NFC buying guides, application explainers and chip comparison articles from the Proud Tek catalog.",
      "Helps buyers move from broad education into shortlist decisions on cards, tags, labels, readers and wristbands.",
      "Works best when readers pair each guide with the matching product collection or contact step for sampling and quoting.",
    ],
    guidanceFields: [
      {
        label: "Best for",
        value: "Buyers researching RFID and NFC applications, comparing chip families and preparing sourcing or specification discussions.",
      },
      {
        label: "Compare first",
        value: "Use the blog to understand deployment differences, then confirm compatibility, material and customization requirements on the matching product page.",
      },
      {
        label: "What to read next",
        value: "Start with the most relevant article, then move into the related product collection or contact page once the use case is clear.",
      },
      {
        label: "Next step",
        value: "Turn the article into a solution, comparison or product shortlist before moving into samples or quoting.",
      },
    ],
    relatedPages: [
      { name: "Hotel Key Card Compatibility Guide", url: absoluteUrl("/solutions/hotel-key-cards/") },
      { name: "RFID Laundry Tags Buyer's Guide", url: absoluteUrl("/solutions/rfid-laundry-tags/") },
      { name: "Google Review NFC Card Guide", url: absoluteUrl("/solutions/google-review-nfc-card/") },
      { name: "NTAG213 vs NTAG215 vs NTAG216", url: absoluteUrl("/compare/ntag213-vs-ntag215-vs-ntag216/") },
      { name: "RFID Cards Collection", url: absoluteUrl("/products/rfid-cards/") },
      { name: "Contact Proud Tek", url: absoluteUrl("/contact/") },
    ],
    sourceLinks: [
      { name: "Hotel Key Card Compatibility Guide", url: absoluteUrl("/solutions/hotel-key-cards/") },
      { name: "RFID Laundry Tags Buyer's Guide", url: absoluteUrl("/solutions/rfid-laundry-tags/") },
      { name: "Google Review NFC Card Guide", url: absoluteUrl("/solutions/google-review-nfc-card/") },
      { name: "NFC Business Card Guide", url: absoluteUrl("/solutions/nfc-business-card/") },
      { name: "MIFARE Plus EV2 vs DESFire EV3", url: absoluteUrl("/compare/mifare-plus-ev2-vs-desfire-ev3/") },
    ],
    faqEntries: [
      {
        question: "What does the Proud Tek blog help buyers understand?",
        answer:
          "It helps buyers understand RFID and NFC applications, chip choices, deployment differences and the next product families to review before sampling or quoting.",
      },
      {
        question: "When should buyers move from a blog article into a product page?",
        answer:
          "Move into the matching product page once the application is clear enough to compare chip family, material, customization and compatibility details.",
      },
      {
        question: "Can the blog be used as the first step before contacting Proud Tek?",
        answer:
          "Yes. The blog works well as a discovery layer before narrowing into a product collection or sending a structured inquiry through the contact page.",
      },
    ],
  },
};


export interface LinkItem {
  href: string;
  label: string;
}

export interface ActionItem extends LinkItem {
  kind?: "primary" | "secondary";
}

export interface ConversionCard {
  title: string;
  description?: string;
  items?: string[];
  actions?: ActionItem[];
}

export interface ProductProfile {
  kicker: string;
  title: string;
  description: string;
  cards: ConversionCard[];
}

export interface ArticleProfile {
  kicker: string;
  title: string;
  description: string;
  fitItems: string[];
  briefItems: string[];
  recommendationDescription: string;
  recommendationLinks: ActionItem[];
  collection: ActionItem | null;
  primaryLabel: string;
  ctaDescription: string;
}

export type ProductSegment =
  | "hotel-access"
  | "hotel-wristband"
  | "laundry-tag"
  | "event-wristband"
  | "reader"
  | "vehicle-id"
  | "keyfob"
  | "nfc-branding"
  | "label-tag"
  | "smart-card";

interface ProductProfileArgs {
  contentTitle: string;
  contactHref: string;
  collection: ActionItem | null;
  guide: ActionItem;
  route: string;
  uniqueActions: (actions: Array<ActionItem | null | undefined>, currentRoute?: string) => ActionItem[];
}

interface ArticleProfileArgs {
  contentTitle: string;
  uniqueActions: (actions: Array<ActionItem | null | undefined>, currentRoute?: string) => ActionItem[];
}

export const PRODUCT_PROFILES: Record<ProductSegment, (args: ProductProfileArgs) => ProductProfile> = {
  "hotel-access": ({ contentTitle, contactHref, collection, guide, route, uniqueActions }) => ({
    kicker: "Hotel Access",
    title: `Planning a hotel access rollout with ${contentTitle}?`,
    description:
      "Use this product page as the starting point for guest-room cards, spa access cards or branded hotel credentials. The fastest quote comes from sharing your lock platform, card stock and encoding needs.",
    cards: [
      {
        title: "Best fit for",
        items: [
          "Hotel room access and guest card issuance",
          "Resort, spa and loyalty credentials",
          "Branded key card programs with data encoding",
        ],
      },
      {
        title: "Fast RFQ checklist",
        items: [
          "Hotel lock, encoder or PMS compatibility",
          "Chip platform, magstripe or dual-interface requirement",
          "Card material, finish, artwork and numbering",
          "Pilot size, annual volume and launch window",
        ],
      },
      {
        title: "Customization points",
        items: [
          "PVC, recycled, wood or premium card construction",
          "Full-color print, foil, signature panel or barcode",
          "UID, sector data, magstripe or QR setup",
          "Sleeving, backing card or room-number packaging",
        ],
      },
      {
        title: "Next step",
        description: "Move from browsing to a spec-ready hotel brief.",
        actions: uniqueActions(
          [
            { href: contactHref, label: "Request hotel card quote", kind: "primary" },
            { href: "/solutions/hotel-rfid-access-control/", label: "See hotel RFID solution" },
            { href: "/compare/hotel-key-cards-vs-hotel-wristbands/", label: "Compare cards vs wristbands" },
            { href: "/product/rfid-wristbands-for-hotels/", label: "See hotel wristbands" },
            collection,
            guide,
            { href: "/faq/", label: "Review card samples and lead times" },
          ],
          route,
        ),
      },
    ],
  }),

  "hotel-wristband": ({ contentTitle, contactHref, collection, guide, route, uniqueActions }) => ({
    kicker: "Guest Experience",
    title: `Need hotel-ready wristbands for ${contentTitle}?`,
    description:
      "Hotel and resort wristbands usually combine room access, locker control and guest identification. Sharing your lock system, material preference and branding needs makes quoting much faster.",
    cards: [
      {
        title: "Best fit for",
        items: [
          "Hotels replacing disposable guest cards",
          "Resort pools, spas and locker access",
          "Family-friendly guest ID or cashless programs",
        ],
      },
      {
        title: "Fast RFQ checklist",
        items: [
          "Lock or reader compatibility and chip type",
          "Silicone, woven or reusable band preference",
          "Branding artwork, numbering and color variants",
          "Sample quantity, occupancy scale and delivery target",
        ],
      },
      {
        title: "Customization points",
        items: [
          "Adult or child sizing, clasp style and durability",
          "Raised logo, print, laser code or QR pairing",
          "Encoded UID, staff grouping or guest numbering",
          "Packaging plan for check-in or seasonal programs",
        ],
      },
      {
        title: "Next step",
        description: "Pair hotel wristbands with your access-control workflow.",
        actions: uniqueActions(
          [
            { href: contactHref, label: "Request hotel wristband quote", kind: "primary" },
            { href: "/solutions/hotel-rfid-access-control/", label: "See hotel RFID solution" },
            { href: "/compare/hotel-key-cards-vs-hotel-wristbands/", label: "Compare cards vs wristbands" },
            { href: "/product/hotel-key-cards/", label: "Compare hotel key cards" },
            collection,
            guide,
            { href: "/faq/", label: "Read hotel RFID FAQ" },
          ],
          route,
        ),
      },
    ],
  }),

  "laundry-tag": ({ contentTitle, contactHref, collection, guide, route, uniqueActions }) => ({
    kicker: "Laundry Tracking",
    title: `Preparing a laundry RFID rollout for ${contentTitle}?`,
    description:
      "Laundry deployments succeed or fail on attachment method, wash-cycle durability and reader compatibility. Use this block to build a tighter sample brief before asking for pricing.",
    cards: [
      {
        title: "Best fit for",
        items: [
          "Hotel linen and uniform tracking",
          "Industrial laundry plants and rental textiles",
          "Healthcare garments and reusable inventory",
        ],
      },
      {
        title: "Fast RFQ checklist",
        items: [
          "Expected wash cycles, heat profile and chemicals",
          "Sew-in, pouch, silicone or button-style attachment",
          "Frequency, read-range target and reader environment",
          "Sample quantity, rollout volume and validation timeline",
        ],
      },
      {
        title: "Customization points",
        items: [
          "Form factor, flexibility and textile-safe housing",
          "Serialized encoding, barcode or mixed ID format",
          "Batch packing by site, route or linen category",
          "Pilot kit split for wash testing and field trials",
        ],
      },
      {
        title: "Next step",
        description: "Compare the main laundry tag form factors before you buy samples.",
        actions: uniqueActions(
          [
            { href: contactHref, label: "Request laundry tag quote", kind: "primary" },
            { href: "/solutions/rfid-laundry-management/", label: "See laundry RFID solution" },
            { href: "/compare/pps-vs-silicone-vs-textile-rfid-laundry-tags/", label: "Compare PPS vs silicone vs textile" },
            { href: "/product/pps-rfid-laundry-tag/", label: "Compare PPS laundry tags" },
            { href: "/product/rfid-silicone-laundry-tag/", label: "Compare silicone laundry tags" },
            collection,
            guide,
          ],
          route,
        ),
      },
    ],
  }),

  "event-wristband": ({ contentTitle, contactHref, collection, guide, route, uniqueActions }) => ({
    kicker: "Event Activation",
    title: `Building an attendee flow around ${contentTitle}?`,
    description:
      "Event wristband projects need the product choice, encoding plan and gate setup to line up early. The more you define around entry flow and branding, the easier it is to recommend the right band.",
    cards: [
      {
        title: "Best fit for",
        items: [
          "Festivals, expos and venue access control",
          "Cashless activation and VIP attendee programs",
          "Branded resort or theme-park guest journeys",
        ],
      },
      {
        title: "Fast RFQ checklist",
        items: [
          "Expected attendance, gate count and scan flow",
          "One-time-use, reusable or premium band preference",
          "Chip family, encoding, numbering or wallet-link needs",
          "Launch date, sample target and reorder cadence",
        ],
      },
      {
        title: "Customization points",
        items: [
          "Silicone, woven, bamboo shell or fabric construction",
          "Color segmentation for ticket tiers or access zones",
          "Printed logo, QR, barcode or UID pre-encoding",
          "Packaging by day, zone or event series",
        ],
      },
      {
        title: "Next step",
        description: "Shortlist the wristband styles that match your gate and branding setup.",
        actions: uniqueActions(
          [
            { href: contactHref, label: "Request event wristband quote", kind: "primary" },
            { href: "/solutions/rfid-event-access-control/", label: "See event RFID solution" },
            { href: "/product/uhf-wristband/", label: "See UHF wristbands" },
            { href: "/product/coconut-shell-rfid-wristband/", label: "See premium wristbands" },
            collection,
            guide,
          ],
          route,
        ),
      },
    ],
  }),

  reader: ({ contentTitle, contactHref, route, uniqueActions }) => ({
    kicker: "Reader Integration",
    title: `Need ${contentTitle} to fit an existing workflow?`,
    description:
      "Reader projects usually depend on protocol support, SDK expectations and deployment constraints. Sharing those details early prevents wasted samples and speeds up system-fit recommendations.",
    cards: [
      {
        title: "Best fit for",
        items: [
          "Desktop enrollment and card issuing stations",
          "Field capture, validation and data-collection setups",
          "OEM or software teams testing protocol compatibility",
        ],
      },
      {
        title: "Fast RFQ checklist",
        items: [
          "Chip standards, frequency and read-range target",
          "USB, Bluetooth, serial or embedded interface needs",
          "SDK, middleware or app-environment expectations",
          "Pilot quantity, accessory needs and deployment timeline",
        ],
      },
      {
        title: "Customization points",
        items: [
          "Reader housing, mounting and cable requirements",
          "Keyboard emulation, API or demo-app support",
          "Regional power or certification considerations",
          "Bundle planning with cards, tags or labels for pilot tests",
        ],
      },
      {
        title: "Next step",
        description: "Tie the reader choice back to the tags or cards you plan to deploy.",
        actions: uniqueActions(
          [
            { href: contactHref, label: "Request reader integration help", kind: "primary" },
            { href: "/products/rfid-readers/", label: "Browse RFID readers" },
            { href: "/products/rfid-cards/", label: "Browse compatible cards" },
            { href: "/products/rfid-tags/", label: "Browse compatible tags" },
            { href: "/faq/", label: "Review SDK and lead-time FAQ" },
          ],
          route,
        ),
      },
    ],
  }),

  "vehicle-id": ({ contentTitle, contactHref, collection, route, uniqueActions }) => ({
    kicker: "Vehicle Identification",
    title: `Specifying ${contentTitle} for vehicle access or parking?`,
    description:
      "Vehicle tags are sensitive to mounting position, windshield material and read-lane design. A stronger inquiry includes how the vehicle moves through the checkpoint and how IDs will be managed.",
    cards: [
      {
        title: "Best fit for",
        items: [
          "Parking access control and gated communities",
          "Fleet or campus vehicle identification",
          "Automotive key, immobilizer or windshield labeling programs",
        ],
      },
      {
        title: "Fast RFQ checklist",
        items: [
          "Checkpoint layout, reader model and lane speed",
          "Mounting surface, windshield tint or headlight material",
          "Numbering, barcode, tamper or authentication requirements",
          "Pilot fleet size, annual volume and installation plan",
        ],
      },
      {
        title: "Customization points",
        items: [
          "Passive label, hard tag or transponder format",
          "Adhesive choice, print durability and anti-transfer needs",
          "Serialized UID, barcode or license-plate matching",
          "Packaging by site, lane or installer workflow",
        ],
      },
      {
        title: "Next step",
        description: "Compare the formats that work best on windshields, headlights or vehicle parts.",
        actions: uniqueActions(
          [
            { href: contactHref, label: "Request vehicle tag quote", kind: "primary" },
            { href: "/solutions/vehicle-rfid-identification/", label: "See vehicle RFID solution" },
            { href: "/product/rfid-windshield-tag/", label: "See windshield tags" },
            { href: "/product/rfid-sticker-on-headlight/", label: "See headlight tags" },
            collection,
            { href: "/faq/", label: "Review mounting and sample FAQ" },
          ],
          route,
        ),
      },
    ],
  }),

  keyfob: ({ contentTitle, contactHref, collection, route, uniqueActions }) => ({
    kicker: "Access Control",
    title: `Need a keyfob program around ${contentTitle}?`,
    description:
      "Keyfob inquiries convert better when the chip family, housing style and branding plan are defined. This section helps push the page from catalog browsing into a deployment-ready brief.",
    cards: [
      {
        title: "Best fit for",
        items: [
          "Residential and office access control",
          "Gym, membership and locker credentials",
          "OEM keychain ID or staff credential programs",
        ],
      },
      {
        title: "Fast RFQ checklist",
        items: [
          "Chip family or reader compatibility requirement",
          "Housing shape, color and attachment preference",
          "Logo, laser number, QR or barcode needs",
          "Sample target, reorder plan and total volume",
        ],
      },
      {
        title: "Customization points",
        items: [
          "ABS, epoxy or specialty shell construction",
          "Ring hardware, tab design and durability target",
          "UID pre-encoding or grouped number ranges",
          "Bagging, labeling or bundled accessory requests",
        ],
      },
      {
        title: "Next step",
        description: "Compare the common fob styles before asking for production pricing.",
        actions: uniqueActions(
          [
            { href: contactHref, label: "Request keyfob quote", kind: "primary" },
            { href: "/product/rfid-key-fob/", label: "See RFID key fob styles" },
            { href: "/product/proximity-fobs/", label: "See proximity fobs" },
            collection,
            { href: "/faq/", label: "Read access-control FAQ" },
          ],
          route,
        ),
      },
    ],
  }),

  "nfc-branding": ({ contentTitle, contactHref, guide, route, uniqueActions }) => ({
    kicker: "Brand Activation",
    title: `Using ${contentTitle} for a contactless marketing project?`,
    description:
      "NFC-led lead capture and review campaigns convert better when material, mobile compatibility and encoding are locked down before sampling. This section keeps the inquiry focused on decision-ready inputs.",
    cards: [
      {
        title: "Best fit for",
        items: [
          "Digital business cards and sales enablement",
          "Google review or tap-to-landing campaigns",
          "Eco or premium branded contact-sharing programs",
        ],
      },
      {
        title: "Fast RFQ checklist",
        items: [
          "Target phones, chip family and memory requirement",
          "Material, finish, thickness and visual direction",
          "URL, vCard, social link or review-link encoding setup",
          "Sample quantity, team rollout size and packaging needs",
        ],
      },
      {
        title: "Customization points",
        items: [
          "Metal, wood, PVC, paper or recycled construction",
          "Laser engraving, print, epoxy or tactile finishes",
          "UID lock, redirect setup or profile-management workflow",
          "Gift box, individual sleeve or team-kit packaging",
        ],
      },
      {
        title: "Next step",
        description: "Pair the card or token style with the campaign you want to launch.",
        actions: uniqueActions(
          [
            { href: contactHref, label: "Request NFC sample quote", kind: "primary" },
            { href: "/solutions/nfc-business-card-programs/", label: "See NFC card solution" },
            { href: "/compare/metal-vs-wood-vs-pvc-nfc-business-cards/", label: "Compare card materials" },
            { href: "/product/nfc-business-card/", label: "Compare NFC business cards" },
            { href: "/product/google-review-nfc-card/", label: "See review NFC cards" },
            guide,
            { href: "/faq/", label: "Read NFC compatibility FAQ" },
          ],
          route,
        ),
      },
    ],
  }),

  "label-tag": ({ contentTitle, contactHref, collection, guide, route, uniqueActions }) => ({
    kicker: "Labeling And Tracking",
    title: `Need ${contentTitle} for packaging, assets or product ID?`,
    description:
      "Sticker and tag projects move faster when the environment, surface and data model are specific. The blocks below are meant to turn a generic inquiry into something production and testing teams can act on.",
    cards: [
      {
        title: "Best fit for",
        items: [
          "Asset identification and internal tracking",
          "Packaging intelligence and smart labeling",
          "Authentication, audit or process-control workflows",
        ],
      },
      {
        title: "Fast RFQ checklist",
        items: [
          "Surface type, adhesive needs and on-metal exposure",
          "Chip family, read distance and scan environment",
          "Label size, print content and data-encoding format",
          "Sample quantity, application method and order volume",
        ],
      },
      {
        title: "Customization points",
        items: [
          "Paper, PET, fragile, tamper or specialty face stock",
          "Dry inlay, wet inlay or finished-label delivery",
          "Barcode, EPC, URL, QR or mixed serialization",
          "Roll direction, liner format or operator-friendly packaging",
        ],
      },
      {
        title: "Next step",
        description: "Use the most relevant collection or guide to narrow the label format.",
        actions: uniqueActions(
          [
            { href: contactHref, label: "Request RFID label quote", kind: "primary" },
            { href: "/solutions/rfid-asset-tracking-labels/", label: "See label solution" },
            { href: "/compare/on-metal-nfc-labels-vs-standard-nfc-stickers/", label: "Compare label paths" },
            collection,
            { href: "/products/rfid-labels/", label: "Browse RFID labels" },
            { href: "/products/rfid-tags/", label: "Browse RFID tags" },
            guide,
          ],
          route,
        ),
      },
    ],
  }),

  "smart-card": ({ contentTitle, contactHref, collection, guide, route, uniqueActions }) => ({
    kicker: "RFID Card Sourcing",
    title: `Need a custom quote for ${contentTitle}?`,
    description:
      "Card projects usually depend on chip family, material, print detail and encoding. Use these blocks to shape a tighter inquiry before asking for samples or production pricing.",
    cards: [
      {
        title: "Best fit for",
        items: [
          "Access control and membership credentials",
          "OEM card programs with chip or security requirements",
          "Printed smart cards with encoding or numbering",
        ],
      },
      {
        title: "Fast RFQ checklist",
        items: [
          "Chip family, memory and protocol requirement",
          "Card stock, finish, thickness and artwork",
          "Numbering, barcode, magstripe or sector encoding",
          "Sample quantity, order volume and delivery target",
        ],
      },
      {
        title: "Customization points",
        items: [
          "PVC, composite, clamshell or specialty construction",
          "CMYK print, foil, UV or signature-panel options",
          "UID lists, data files or grouped serial numbering",
          "Packaging, sleeves or card carrier requirements",
        ],
      },
      {
        title: "Next step",
        description: "Move from catalog review to a spec-ready card inquiry.",
        actions: uniqueActions(
          [
            { href: contactHref, label: "Request card quote", kind: "primary" },
            collection,
            guide,
            { href: "/products/rfid-cards/", label: "Browse RFID cards" },
            { href: "/faq/", label: "Read card FAQ" },
          ],
          route,
        ),
      },
    ],
  }),
};

interface ArticlePatternEntry {
  pattern: RegExp;
  profile: (args: ArticleProfileArgs) => ArticleProfile;
}

export const ARTICLE_PROFILES: ArticlePatternEntry[] = [
  {
    pattern: /rfid-laundry-tags/,
    profile: ({ uniqueActions }) => ({
      kicker: "Laundry RFID Planning",
      title: "Turning a laundry RFID guide into a pilot plan?",
      description:
        "Laundry RFID projects need tag selection, wash validation and reader workflow to line up early. This block narrows the next step to the inputs an operations or sourcing team should send first.",
      fitItems: [
        "Hotels, hospitals and laundries comparing tag form factors",
        "Teams validating wash-cycle durability before rollout",
        "Operators choosing between PPS, silicone and textile-safe tags",
      ],
      briefItems: [
        "Textile type, wash-cycle target and exposure to heat or chemicals",
        "Attachment method and the maximum tag size or thickness allowed",
        "Reader setup, read point and how linen IDs are managed today",
        "Pilot batch size, trial sites and the date you need samples by",
      ],
      recommendationDescription: "Start with the laundry tag pages that help compare material and attachment style.",
      recommendationLinks: uniqueActions([
        { href: "/product/rfid-laundry-tags/", label: "Industrial RFID laundry tags" },
        { href: "/product/pps-rfid-laundry-tag/", label: "PPS RFID laundry tag" },
        { href: "/product/rfid-silicone-laundry-tag/", label: "Silicone laundry tag" },
        { href: "/solutions/rfid-laundry-management/", label: "Laundry RFID solution page" },
        { href: "/compare/pps-vs-silicone-vs-textile-rfid-laundry-tags/", label: "PPS vs silicone vs textile comparison" },
      ]),
      collection: { href: "/products/rfid-tags/", label: "Browse RFID tags" },
      primaryLabel: "Request laundry RFID recommendations",
      ctaDescription:
        "If you send your textile type, wash profile and preferred attachment method, Proud Tek can narrow the sample set much faster.",
    }),
  },
  {
    pattern: /rfid-event-wristband/,
    profile: ({ uniqueActions }) => ({
      kicker: "Event RFID Planning",
      title: "Need help turning this event wristband guide into an attendee workflow?",
      description:
        "Event RFID projects depend on gate design, attendee segmentation and the right band construction. This section is geared toward organizers who are moving from concept to sample selection.",
      fitItems: [
        "Festivals, venues and expos planning tap-based entry",
        "Teams adding cashless spend, VIP zones or brand activation",
        "Buyers comparing reusable, disposable and premium wristband styles",
      ],
      briefItems: [
        "Expected attendance, number of access points and scan flow",
        "Single-day, multi-day or reusable-event requirement",
        "Branding, numbering, encoding or ticket-tier color segmentation",
        "Pilot quantity, delivery deadline and reprint contingency needs",
      ],
      recommendationDescription: "Shortlist wristbands by material and read setup before asking for pricing.",
      recommendationLinks: uniqueActions([
        { href: "/product/rfid-event-wristband/", label: "RFID event wristband" },
        { href: "/product/rfid-wristbands-for-events/", label: "RFID wristbands for events" },
        { href: "/product/uhf-wristband/", label: "UHF wristband" },
        { href: "/solutions/rfid-event-access-control/", label: "Event RFID solution page" },
      ]),
      collection: { href: "/products/rfid-wristbands/", label: "Browse RFID wristbands" },
      primaryLabel: "Request event wristband recommendations",
      ctaDescription:
        "Send the event scale, chip preference and wristband style you are considering, and the team can narrow it down to the right sample kit.",
    }),
  },
  {
    pattern: /rfid-wooden-card/,
    profile: ({ uniqueActions }) => ({
      kicker: "Eco Card Planning",
      title: "Using this wooden card guide to source an eco card program?",
      description:
        "Eco and wooden card projects are usually part product choice and part brand decision. The best next step is to align on finish, chip compatibility and what premium feel the card has to deliver.",
      fitItems: [
        "Hotels, clubs and premium venues replacing standard PVC cards",
        "Brands looking for sustainable or premium NFC touchpoints",
        "Teams comparing wood, bamboo, recycled and composite card options",
      ],
      briefItems: [
        "Use case, target phones or readers and chip family requirement",
        "Desired material, thickness, color tone and surface finish",
        "Artwork, engraving, print, UID or URL encoding plan",
        "Sample target, approval workflow and launch quantity",
      ],
      recommendationDescription: "Compare the eco card formats that balance sustainability, durability and mobile compatibility.",
      recommendationLinks: uniqueActions([
        { href: "/product/wooden-rfid-card/", label: "Wooden RFID card / NFC card" },
        { href: "/product/eco_rfid_card/", label: "Eco RFID card" },
        { href: "/product/nfc-business-card/", label: "NFC business card" },
        { href: "/solutions/nfc-business-card-programs/", label: "NFC card solution page" },
        { href: "/compare/metal-vs-wood-vs-pvc-nfc-business-cards/", label: "Compare card materials" },
      ]),
      collection: { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      primaryLabel: "Request eco card recommendations",
      ctaDescription:
        "If you already know the chip family or the visual feel you need, the quickest path is to send those details with your target sample quantity.",
    }),
  },
  {
    pattern: /rfid-hotel-key-card/,
    profile: ({ uniqueActions }) => ({
      kicker: "Hotel Access Planning",
      title: "Building a hotel key card program from this guide?",
      description:
        "Hotel key card sourcing is easier once the lock platform, card format and guest-experience goals are clear. This section converts the guide into a practical RFQ checklist and product shortlist.",
      fitItems: [
        "Hotels replacing existing RFID or magstripe room keys",
        "Resorts combining room access with spa or guest services",
        "Teams comparing standard PVC cards with premium or wearable formats",
      ],
      briefItems: [
        "Hotel lock or encoder system and current card format",
        "Material, finish, branding and numbering requirements",
        "Need for magstripe, RFID encoding or mixed-room key stock",
        "Pilot quantity, property count and rollout timeline",
      ],
      recommendationDescription: "Start with the hotel access products that match room-key and guest-ID programs.",
      recommendationLinks: uniqueActions([
        { href: "/product/hotel-key-cards/", label: "Hotel key cards" },
        { href: "/product/rfid-wristbands-for-hotels/", label: "RFID wristbands for hotels" },
        { href: "/product/printed-rfid-cards/", label: "Printed RFID cards" },
        { href: "/solutions/hotel-rfid-access-control/", label: "Hotel RFID solution page" },
        { href: "/compare/hotel-key-cards-vs-hotel-wristbands/", label: "Compare cards vs wristbands" },
      ]),
      collection: { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      primaryLabel: "Request hotel access recommendations",
      ctaDescription:
        "Send a photo of the current room key or lock platform, and Proud Tek can narrow the right chip, material and encoding path quickly.",
    }),
  },
  {
    pattern: /mifare_plus_card/,
    profile: ({ uniqueActions }) => ({
      kicker: "Secure Card Selection",
      title: "Comparing secure smart cards after reading this MIFARE guide?",
      description:
        "Security-card projects benefit from a tighter brief around chip family, memory, reader estate and migration plan. These prompts help turn the guide into a concrete product shortlist.",
      fitItems: [
        "Access-control teams moving beyond older low-security cards",
        "Integrators comparing MIFARE Plus with DESFire variants",
        "Buyers aligning chip choice with reader compatibility and lifecycle",
      ],
      briefItems: [
        "Current reader estate, desired migration path and protocol support",
        "Memory, sector, security-level or application requirements",
        "Card print finish, numbering and personalization needs",
        "Pilot quantity, issuance workflow and deployment deadline",
      ],
      recommendationDescription: "Use the product pages below to compare security level, memory and deployment fit.",
      recommendationLinks: uniqueActions([
        { href: "/product/mifare-plus-card/", label: "MIFARE Plus card" },
        { href: "/product/mifare-desfire-cards/", label: "MIFARE DESFire cards" },
        { href: "/product/mifare-desfire-ev2-cards/", label: "MIFARE DESFire EV2 cards" },
        { href: "/compare/mifare-plus-ev2-vs-desfire-ev3/", label: "MIFARE Plus EV2 vs DESFire EV3" },
      ]),
      collection: { href: "/products/rfid-cards/", label: "Browse RFID cards" },
      primaryLabel: "Request secure card recommendations",
      ctaDescription:
        "If you share the reader environment and the security level you are targeting, the team can help narrow the most realistic card path.",
    }),
  },
];

export const DEFAULT_ARTICLE_PROFILE: (args: ArticleProfileArgs & { contentTitle: string }) => ArticleProfile = ({
  contentTitle,
  uniqueActions,
}) => ({
  kicker: "Project Planning",
  title: `Need help turning ${contentTitle.toLowerCase()} into an RFID project?`,
  description:
    "Proud Tek can recommend the right card, tag, label, reader or wristband based on your use case, environment, sample target and production timeline.",
  fitItems: [
    "Teams moving from research to a sample-ready shortlist",
    "Buyers comparing product formats before contacting suppliers",
    "Projects that need matching products, encoding and delivery planning",
  ],
  briefItems: [
    "Your use case, environment and read-range target",
    "Preferred form factor, chip family or frequency",
    "Printing, encoding, numbering or packaging needs",
    "Sample quantity, production volume and delivery timeline",
  ],
  recommendationDescription: "Start with the pages that most closely match the article topic.",
  recommendationLinks: uniqueActions([
    { href: "/products/all/", label: "Browse products" },
    { href: "/contact/", label: "Contact Proud Tek" },
    { href: "/faq/", label: "Review FAQ" },
  ]),
  collection: { href: "/products/all/", label: "Browse products" },
  primaryLabel: "Talk to an RFID engineer",
  ctaDescription:
    "If you already know the use case, the fastest path is to contact the team with your target spec and quantity.",
});

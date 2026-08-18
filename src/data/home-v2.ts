export interface HomePathway {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}

export interface HomeFamily {
  name: string;
  href: string;
  description: string;
  fit: string;
}

export interface HomeEvidence {
  status: string;
  title: string;
  detail: string;
  href: string;
  linkLabel: string;
}

export const HOME_PATHWAYS: HomePathway[] = [
  {
    eyebrow: "Product brief",
    title: "I know the form factor",
    description: "Start with cards, labels, tags, readers, keyfobs or wristbands, then narrow by chip and environment.",
    href: "/products/all/",
    linkLabel: "Browse the catalog",
  },
  {
    eyebrow: "Operating problem",
    title: "I know the application",
    description: "Begin with hospitality, laundry, retail, healthcare, logistics, events or brand protection.",
    href: "/industries/",
    linkLabel: "Choose an industry",
  },
  {
    eyebrow: "Shortlist decision",
    title: "I am comparing options",
    description: "Settle the frequency, chip, material and deployment trade-off before you order samples.",
    href: "/compare/",
    linkLabel: "Compare options",
  },
  {
    eyebrow: "Compatibility constraint",
    title: "I have a reader or lock",
    description: "Start from the installed system so the chip, protocol and credential format fit the environment.",
    href: "/compatibility/",
    linkLabel: "Check compatibility",
  },
];

export const HOME_FAMILIES: HomeFamily[] = [
  { name: "RFID cards", href: "/products/rfid-cards/", description: "HF, LF, NFC and dual-frequency credentials for access, membership and hospitality.", fit: "Cards · HF/LF/NFC" },
  { name: "RFID tags", href: "/products/rfid-tags/", description: "On-metal, high-temperature, embedded and hard-tag formats for demanding assets.", fit: "Hard tags · UHF/HF" },
  { name: "RFID labels", href: "/products/rfid-labels/", description: "Wet and dry inlays, NFC stickers and UHF labels for item-level identification.", fit: "Labels · NFC/UHF" },
  { name: "RFID wristbands", href: "/products/rfid-wristbands/", description: "Silicone, fabric, paper and Tyvek formats for events, hospitality and healthcare.", fit: "Wearables · HF/UHF" },
  { name: "RFID keyfobs", href: "/products/rfid-keyfobs/", description: "Compact credentials for access control, membership and OEM replacement programs.", fit: "Fobs · LF/HF" },
  { name: "RFID readers", href: "/products/rfid-readers/", description: "Desktop, handheld and fixed readers for encoding, pilots and integrated deployments.", fit: "Readers · USB/Bluetooth" },
];

export const HOME_EVIDENCE: HomeEvidence[] = [
  {
    status: "Verified certificate",
    title: "ISO 9001:2015",
    detail: "Certificate 98026Q00274R000. Published scope: sales service of smart cards and RFID tags. Valid to 09 June 2029.",
    href: "/about/certifications/",
    linkLabel: "View certificate scope",
  },
  {
    status: "Company-stated record",
    title: "Factory and process evidence",
    detail: "Two Shenzhen production sites, ten lines and 305+ pieces of process equipment are published as operational claims, separate from ISO scope.",
    href: "/about/factory/",
    linkLabel: "Review factory record",
  },
  {
    status: "Available per program",
    title: "Documentation pack",
    detail: "RoHS, REACH, FCC, CE and functional test documentation can be matched to the SKU and shipment brief.",
    href: "/about/certifications/",
    linkLabel: "Review compliance path",
  },
];

export const HOME_CASES = [
  { label: "Hospitality", title: "Credential compatibility before the card order", description: "Map the hotel lock, encoder and card technology before a pilot is approved.", href: "/solutions/hotel-key-cards/" },
  { label: "Industrial laundry", title: "Wash-cycle proof before the rollout", description: "Match housing, attachment method and read performance to the textile duty cycle.", href: "/solutions/rfid-laundry-tags/" },
  { label: "Brand protection", title: "Tap-to-verify experiences with a real chip brief", description: "Connect NFC security, material, encoding and the digital product journey in one program.", href: "/solutions/nfc-brand-authentication/" },
];

export const HOME_PROCESS = [
  ["Project brief", "Application, reader environment, material and annual volume."],
  ["Compatibility", "Chip, protocol, lock or reader constraints are checked before sampling."],
  ["Sample plan", "Select a small set of physical options for the real test environment."],
  ["Specification lock", "Artwork, antenna, encoding, numbering and packaging become explicit."],
  ["Quote", "Receive MOQ, lead-time and documentation requirements for the selected SKU."],
  ["QA release", "Approve the pilot and define the functional checks for production."],
  ["Reorder", "Keep the approved specification and lot documentation attached to the program."],
] as const;

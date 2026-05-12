/**
 * Blog topic taxonomy + per-post thumbnail mapping.
 *
 * Author kickers in the editorial collection are extremely long-tail
 * (50+ variants across 90 posts), so we map each kicker to a small set
 * of broad topics that make sense as a left-rail navigator — same UX
 * pattern as the /products/all/ catalog rail (Product Families). Order
 * here is the order shown in the rail.
 *
 * Companion to `src/data/guide-clusters.ts` and
 * `src/data/compare-categories.ts` — keeps blog navigation taxonomy
 * out of the cheerio-injection pipeline so both the native /blog/ hub
 * and the WP-snapshot enhance path can consume it.
 */

export interface BlogTopic {
  /** URL-safe id used in data-rail-key + #topic-{id} anchors. */
  id: string;
  /** Display label shown in the rail. */
  label: string;
  /** Single-emoji visual marker. */
  icon: string;
  /** Kicker patterns that classify into this topic. First match wins. */
  kickers: RegExp[];
}

export const BLOG_TOPICS: BlogTopic[] = [
  {
    id: "fundamentals",
    label: "RFID & NFC Basics",
    icon: "📡",
    kickers: [
      /^RFID Technology$/i,
      /^NFC Technology$/i,
      /^Smart Cards$/i,
      /^How RFID Cards Work$/i,
      /^NFC vs\.? RFID/i,
      /^NFC Chip Memory/i,
      /^RFID (Read Range|Card Demagnetization)/i,
      /^UHF RFID Read Range$/i,
      /^Procurement$/i,
      /^RAIN RFID/i,
    ],
  },
  {
    id: "hotels",
    label: "Hotels & Hospitality",
    icon: "🏨",
    kickers: [/Hotel/i],
  },
  {
    id: "events",
    label: "Events & Experiences",
    icon: "🎟️",
    kickers: [
      /^Event Technology$/i,
      /Festival/i,
      /Conference/i,
      /Marathon/i,
      /Wristband/i,
      /Ski Pass/i,
    ],
  },
  {
    id: "industrial",
    label: "Industrial & Warehouse",
    icon: "🏭",
    kickers: [
      /^Industrial RFID$/i,
      /Warehouse/i,
      /Asset Tracking/i,
      /Inventory/i,
      /Manual Counting/i,
      /Interference on Metal/i,
      /Vehicle RFID/i,
      /AI-Powered RFID/i,
      /Laundry/i,
      /RFID Tag Lifespan/i,
      /Shrinkage/i,
    ],
  },
  {
    id: "nfc-marketing",
    label: "NFC Marketing",
    icon: "📱",
    kickers: [
      /^NFC Marketing$/i,
      /NFC Wearables/i,
      /Google Review/i,
      /Christmas Gift/i,
      /Wedding Favor/i,
      /NFC.*(Cloning|Cloned|Clone)/i,
    ],
  },
  {
    id: "security",
    label: "Security & Access",
    icon: "🔐",
    kickers: [/^Access Control$/i, /Access Card Copied/i],
  },
  {
    id: "costs",
    label: "Costs & ROI",
    icon: "💰",
    kickers: [
      /Cost/i,
      /Pricing/i,
      /ROI/i,
      /Revenue Impact/i,
    ],
  },
  {
    id: "trends",
    label: "Industry Trends",
    icon: "📈",
    kickers: [/Industry Trends/i, /Industry Applications/i, /Best Hotel RFID Card/i],
  },
  {
    id: "sustainability",
    label: "Sustainability",
    icon: "🌱",
    kickers: [/Eco RFID/i, /Sustainability/i],
  },
  {
    id: "troubleshooting",
    label: "Troubleshooting & Fixes",
    icon: "🔧",
    kickers: [/^Fix:/i, /Troubleshooting/i, /Barcode Label Peeling/i],
  },
];

export const BLOG_TOPIC_FALLBACK_ID = "fundamentals";

/**
 * Classify a kicker string into a topic id. Returns the fallback topic
 * when no pattern matches — never returns undefined.
 */
export function classifyBlogKicker(kicker: string): string {
  const k = kicker.trim();
  for (const topic of BLOG_TOPICS) {
    if (topic.kickers.some((re) => re.test(k))) {
      return topic.id;
    }
  }
  return BLOG_TOPIC_FALLBACK_ID;
}

/* ── Blog post → thumbnail image mapping ──────────────────────────── */

const BLOG_THUMBNAIL_MAP: Record<string, string> = {
  "/blog/how-hotel-rfid-key-cards-work/": "/blog-images/hotel-rfid-key-cards.jpg",
  "/blog/rfid-laundry-tags-buyers-guide/": "/blog-images/laundry-tags.jpg",
  "/blog/nfc-business-cards-guide/": "/blog-images/metal-card.jpg",
  "/blog/rfid-frequencies-lf-hf-uhf-explained/": "/blog-images/nfc-chip.jpg",
  "/blog/rfid-wristbands-festivals-events/": "/blog-images/festival-wristband.jpg",
  "/blog/mifare-classic-vs-desfire-hotel-chips/": "/blog-images/hotel-chip-compare.jpg",
  "/blog/hotel-key-card-suppliers-guide/": "/blog-images/hotel-lobby.jpg",
  "/blog/hotel-key-card-encoding-explained/": "/blog-images/hotel-reception.jpg",
  "/blog/magnetic-stripe-vs-rfid-hotel-cards/": "/blog-images/hotel-door.jpg",
  "/blog/rfid-key-fob-access-control/": "/blog-images/access-control.jpg",
  "/blog/pps-vs-silicone-vs-textile-laundry-tags/": "/blog-images/laundry-roi.jpg",
  "/blog/rfid-laundry-system-roi/": "/blog-images/laundry-tags.jpg",
  "/blog/rfid-asset-tracking-warehouses/": "/blog-images/warehouse.jpg",
  "/blog/rfid-led-tags-warehouse-location/": "/blog-images/warehouse-led.jpg",
  "/blog/rfid-windshield-tags-vehicle-id/": "/blog-images/windshield-tag.jpg",
  "/blog/google-review-nfc-cards-restaurants/": "/blog-images/restaurant-review.jpg",
  "/blog/nfc-stickers-marketing-campaigns/": "/blog-images/nfc-marketing.jpg",
  "/blog/metal-nfc-cards-business-networking/": "/blog-images/metal-card.jpg",
  "/blog/ntag213-vs-ntag215-vs-ntag216/": "/blog-images/nfc-chip.jpg",
  "/blog/how-nfc-tags-work-smartphones/": "/blog-images/smartphone-nfc.jpg",
  "/blog/nfc-product-authentication/": "/blog-images/product-auth.jpg",
  "/blog/nfc-smart-rings-guide/": "/blog-images/smart-ring.jpg",
  "/blog/how-to-program-nfc-tags/": "/blog-images/program-nfc.jpg",
  "/blog/wooden-nfc-cards-eco-branding/": "/blog-images/eco-wood.jpg",
  "/blog/silicone-vs-fabric-vs-tyvek-wristbands/": "/blog-images/festival-wristband.jpg",
  "/blog/cashless-payment-rfid-wristbands/": "/blog-images/cashless-payment.jpg",
  "/blog/rfid-event-access-control-setup/": "/blog-images/event-access.jpg",
  "/blog/uhf-rfid-wristbands-long-range/": "/blog-images/uhf-wristband-event.jpg",
  "/blog/rfid-vs-qr-codes-events/": "/blog-images/rfid-vs-qr.jpg",
  "/blog/what-is-mifare-complete-guide/": "/blog-images/mifare-guide.jpg",
  "/blog/rfid-card-materials-pvc-pet-abs-wood/": "/blog-images/card-materials.jpg",
  "/blog/how-rfid-readers-work/": "/blog-images/rfid-readers.jpg",
  "/blog/em4100-vs-t5577-125khz-comparison/": "/blog-images/chip-125khz.jpg",
  "/blog/java-cards-smart-card-os-explained/": "/blog-images/java-smartcard.jpg",
  "/blog/desfire-ev1-vs-ev2-vs-ev3/": "/blog-images/desfire-security.jpg",
  "/blog/rfid-data-encoding-memory/": "/blog-images/data-encoding.jpg",
  "/blog/rfid-healthcare-patient-tracking/": "/blog-images/healthcare-rfid.jpg",
  "/blog/rfid-retail-inventory-management/": "/blog-images/retail-inventory.jpg",
  "/blog/digital-product-passports-nfc/": "/blog-images/digital-passport.jpg",
  "/blog/rfid-logistics-supply-chain/": "/blog-images/logistics.jpg",
  "/blog/eco-friendly-rfid-sustainable-cards/": "/blog-images/eco-sustainable.jpg",
  "/blog/rfid-market-trends-forecast/": "/blog-images/market-trends.jpg",
  "/blog/rfid-wristbands-hotels-resorts/": "/blog-images/hotel-resort.jpg",
  "/blog/nfc-door-locks-rfid-cards/": "/blog-images/nfc-door-lock.jpg",
  "/blog/hotel-key-card-design-printing/": "/blog-images/card-design.jpg",
  "/blog/rfid-elevator-floor-access/": "/blog-images/elevator-building.jpg",
  "/blog/waterproof-rfid-tags-outdoor/": "/blog-images/waterproof-outdoor.jpg",
  "/blog/coconut-shell-rfid-wristbands-eco/": "/blog-images/coconut-eco.jpg",
  "/blog/anti-counterfeiting-rfid-events/": "/blog-images/anti-counterfeit.jpg",
  "/blog/uhf-vs-hf-rfid-frequency-choice/": "/blog-images/uhf-vs-hf.jpg",
};

export function getBlogThumbnails(): Record<string, string> {
  return BLOG_THUMBNAIL_MAP;
}

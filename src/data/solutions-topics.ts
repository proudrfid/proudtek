/**
 * Solutions topic taxonomy + per-solution route mapping.
 *
 * The 37 entries under `src/content/editorial/solutions/` are explicit
 * use-case landing pages (each one targets a single buyer query like
 * "hotel key cards" or "rfid event wristbands"). To give the
 * `/solutions/` hub the same scannable left-rail UX as `/blog/`, we
 * group them into 8 topical buckets keyed off the route path.
 *
 * Order here is the order shown in the rail. Each solution belongs to
 * exactly one topic; if the route doesn't match any topic regex, the
 * post falls back to the catch-all "other" topic id (kept off the rail
 * but still rendered in the flat grid).
 *
 * Companion to `src/data/blog-topics.ts`; consumed by the native
 * `/solutions/` hub at `src/pages/solutions/index.astro`.
 */

export interface SolutionTopic {
  /** URL-safe id used in data-rail-key + #topic-{id} anchors. */
  id: string;
  /** Display label shown in the rail. */
  label: string;
  /** Single-emoji visual marker. */
  icon: string;
  /** Route patterns that classify into this topic. First match wins. */
  routes: RegExp[];
}

export const SOLUTIONS_TOPICS: SolutionTopic[] = [
  {
    id: "access-control",
    label: "Access Control & Identification",
    icon: "🔐",
    routes: [
      /^\/solutions\/rfid-access-control\/$/,
      /^\/solutions\/hotel-rfid-access-control\/$/,
      /^\/solutions\/rfid-keyfobs-access-control\/$/,
      /^\/solutions\/rfid-event-access-control\/$/,
      /^\/solutions\/rfid-attendance-system\/$/,
      /^\/solutions\/vehicle-rfid-identification\/$/,
      /^\/solutions\/rfid-parking-management\/$/,
    ],
  },
  {
    id: "hotels-laundry",
    label: "Hotels & Industrial Laundry",
    icon: "🏨",
    routes: [
      /^\/solutions\/hotel-key-cards\/$/,
      /^\/solutions\/rfid-laundry-management\/$/,
      /^\/solutions\/rfid-laundry-tags\/$/,
      /^\/solutions\/rfid-laundry-tracking\/$/,
    ],
  },
  {
    id: "inventory-supply-chain",
    label: "Inventory & Supply Chain",
    icon: "📦",
    routes: [
      /^\/solutions\/rfid-inventory-tracking\/$/,
      /^\/solutions\/rfid-warehouse-management\/$/,
      /^\/solutions\/rfid-supply-chain-management\/$/,
      /^\/solutions\/rfid-asset-tracking-labels\/$/,
      /^\/solutions\/rfid-tool-tracking\/$/,
      /^\/solutions\/digital-product-passport\/$/,
    ],
  },
  {
    id: "events",
    label: "Events & Experiences",
    icon: "🎟️",
    routes: [
      /^\/solutions\/rfid-event-wristbands\/$/,
      /^\/solutions\/rfid-race-timing\/$/,
    ],
  },
  {
    id: "healthcare-library",
    label: "Healthcare & Library",
    icon: "🏥",
    routes: [
      /^\/solutions\/rfid-patient-tracking\/$/,
      /^\/solutions\/rfid-library-management\/$/,
    ],
  },
  {
    id: "nfc-branding",
    label: "NFC Branding & Authentication",
    icon: "🏷️",
    routes: [
      /^\/solutions\/nfc-business-card\/$/,
      /^\/solutions\/nfc-business-card-programs\/$/,
      /^\/solutions\/nfc-brand-authentication\/$/,
      /^\/solutions\/nfc-luxury-authentication\/$/,
    ],
  },
  {
    id: "google-review",
    label: "Google Review Cards",
    icon: "⭐",
    routes: [
      /^\/solutions\/google-review-nfc-card\/$/,
      /^\/solutions\/google-review-cards-for-/,
    ],
  },
  {
    id: "readers-encoding",
    label: "Readers & Encoding",
    icon: "🛠️",
    routes: [
      /^\/solutions\/rfid-readers-and-encoding\/$/,
    ],
  },
];

/** Catch-all id for solutions that don't match any topic regex. */
export const UNCATEGORIZED_TOPIC_ID = "other";

/**
 * Classify a solution by its route path. Returns the first matching
 * topic id or the uncategorized fallback. Mirrors classifyBlogKicker()
 * in src/data/blog-topics.ts but matches on route instead of kicker
 * (solution kickers are too inconsistent for taxonomy classification).
 */
export function classifySolutionRoute(route: string): string {
  for (const topic of SOLUTIONS_TOPICS) {
    if (topic.routes.some((re) => re.test(route))) {
      return topic.id;
    }
  }
  return UNCATEGORIZED_TOPIC_ID;
}

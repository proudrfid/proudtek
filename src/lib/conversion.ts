import type { CheerioAPI } from "cheerio";

import type { SnapshotPage } from "./site-data";
import type { ActionItem, ConversionCard, ProductProfile, ArticleProfile, ProductSegment } from "./conversion-profiles";
import { PRODUCT_PROFILES, ARTICLE_PROFILES, DEFAULT_ARTICLE_PROFILE } from "./conversion-profiles";
import { html, raw } from "./html";

interface ConversionContext {
  canonicalUrl: string;
  contentTitle: string;
  description: string;
}

export function injectConversionBlocks(
  $body: CheerioAPI,
  page: SnapshotPage,
  kind: "product" | "article" | "contact" | "other",
  context: ConversionContext,
): void {
  if ($body(".codex-conversion-shell").length > 0) {
    return;
  }

  if (kind === "product") {
    injectProductBlock($body, page, context);
    return;
  }

  if (kind === "article") {
    injectArticleBlock($body, page, context);
    return;
  }

  if (kind === "contact") {
    injectContactBlock($body);
  }
}

function injectProductBlock($body: CheerioAPI, page: SnapshotPage, context: ConversionContext): void {
  const summary = $body(".summary.entry-summary").first();
  const utility = $body(".codex-product-utility").first();

  if (!summary.length) {
    return;
  }

  const collection = resolveProductCollectionLink($body);
  const guide = resolveRelatedGuide(page.route);
  const profile = resolveProductProfile(page.route, context.contentTitle, collection, guide);
  const html = renderConversionSection({
    kicker: profile.kicker,
    title: profile.title,
    description: profile.description,
    cards: profile.cards,
  });

  if (utility.length) {
    utility.append(html);
    return;
  }

  // Insert into the full-width product container, not the narrow summary sidebar
  const product = $body("div.product").first();
  const specSheet = product.find(".codex-product-spec-sheet").first();
  const support = product.find(".codex-product-support").first();
  const tabs = product.find(".woocommerce-tabs").first();

  if (specSheet.length) {
    specSheet.before(html);
  } else if (support.length) {
    support.before(html);
  } else if (tabs.length) {
    tabs.after(html);
  } else {
    summary.after(html);
  }
}

function injectArticleBlock($body: CheerioAPI, page: SnapshotPage, context: ConversionContext): void {
  const content = $body(".entry-content").first();

  if (!content.length) {
    return;
  }

  // Preferred anchors, in order:
  //  1. The action bar (insert BEFORE so Project Planning sits above the final Next Step CTA).
  //  2. The last top-level <article> that is NOT a snapshot card / conversion card (legacy WP content).
  // Avoid matching `.codex-editorial-snapshot-card` elements — they are <article> tags
  // rendered inside `.codex-editorial-snapshot-grid`; inserting after one nests the
  // conversion shell INSIDE the grid and squeezes the At-A-Glance layout.
  const actionBar = content.children(".codex-editorial-action-bar").last();
  const legacyArticles = content.find("article").filter((_, el) => {
    const $el = $body(el);
    return (
      !$el.hasClass("codex-editorial-snapshot-card") &&
      !$el.hasClass("codex-conversion-card") &&
      $el.closest(".codex-editorial-snapshot-grid").length === 0 &&
      $el.closest(".codex-conversion-grid").length === 0
    );
  });
  const anchor = actionBar.length > 0 ? actionBar : legacyArticles.last();
  const insertBefore = actionBar.length > 0;
  const profile = resolveArticleProfile(page.route, context.contentTitle);
  const html = renderConversionSection({
    kicker: profile.kicker,
    title: profile.title,
    description: profile.description,
    cards: [
      {
        title: "Best fit for",
        items: profile.fitItems,
      },
      {
        title: "What to send us",
        items: profile.briefItems,
      },
      {
        title: "Recommended next pages",
        description: profile.recommendationDescription,
        actions: profile.recommendationLinks,
      },
      {
        title: "Talk to Proud Tek",
        description: profile.ctaDescription,
        actions: uniqueActions(
          [
            { href: resolveContactRouteForArticle(page.route), label: profile.primaryLabel, kind: "primary" },
            profile.collection,
            { href: "/faq/", label: "Review samples and lead times" },
          ],
          page.route,
        ),
      },
    ],
  });

  if (anchor.length) {
    if (insertBefore) {
      anchor.before(html);
    } else {
      anchor.after(html);
    }
    return;
  }

  content.append(html);
}

function injectContactBlock($body: CheerioAPI): void {
  const content = $body(".entry-content").first();

  if (!content.length) {
    return;
  }

  const html = renderConversionSection({
    kicker: "Project Routing",
    title: "Choose the fastest contact path for your RFID project",
    description:
      "Use the links below when the project already fits a clear application or product path. That gives the first reply more context than a generic contact request.",
    cards: [
      {
        title: "Hospitality and events",
        description: "Best for hotels, resorts, guest credentials, event wristbands and attendee access planning.",
        actions: [
          { href: "/contact/hotel-rfid/", label: "Hotel RFID contact", kind: "primary" },
          { href: "/contact/event-rfid/", label: "Event RFID contact" },
        ],
      },
      {
        title: "Laundry and labels",
        description: "Best for textile tracking, laundry validation, RFID labels, NFC stickers and asset-tag projects.",
        actions: [
          { href: "/contact/laundry-rfid/", label: "Laundry RFID contact", kind: "primary" },
          { href: "/contact/rfid-labels-tags/", label: "Labels and tags contact" },
        ],
      },
      {
        title: "Cards and branding",
        description: "Best for custom RFID cards, secure smart cards, NFC business cards and premium branded card programs.",
        actions: [
          { href: "/contact/custom-rfid-cards/", label: "Custom RFID cards", kind: "primary" },
          { href: "/contact/nfc-branding-cards/", label: "NFC branding cards" },
        ],
      },
      {
        title: "Devices and access control",
        description: "Best for readers, keyfobs, access control hardware bundles and vehicle-identification projects.",
        actions: [
          { href: "/contact/rfid-readers/", label: "RFID readers", kind: "primary" },
          { href: "/contact/access-control-keyfobs/", label: "Keyfobs and access control" },
          { href: "/contact/vehicle-rfid/", label: "Vehicle RFID" },
        ],
      },
    ],
  });

  content.append(html);
}

function resolveProductProfile(
  route: string,
  contentTitle: string,
  collection: ActionItem | null,
  guide: ActionItem,
): ProductProfile {
  const segment = inferProductSegment(route);
  const contactHref = resolveContactRouteForProductSegment(segment);

  return PRODUCT_PROFILES[segment]({ contentTitle, contactHref, collection, guide, route, uniqueActions });
}

function resolveArticleProfile(route: string, contentTitle: string): ArticleProfile {
  const normalized = route.toLowerCase();
  const args = { contentTitle, uniqueActions };

  for (const entry of ARTICLE_PROFILES) {
    if (entry.pattern.test(normalized)) {
      return entry.profile(args);
    }
  }

  return DEFAULT_ARTICLE_PROFILE(args);
}

function renderConversionSection(input: {
  kicker: string;
  title: string;
  description: string;
  cards: ConversionCard[];
}): string {
  const cardsHtml = input.cards
    .map((card) => {
      const itemsHtml =
        card.items && card.items.length > 0
          ? html`<ul class="codex-conversion-list">${raw(card.items.map((item) => html`<li>${item}</li>`).join(""))}</ul>`
          : "";
      const actionsHtml =
        card.actions && card.actions.length > 0
          ? html`<div class="codex-conversion-actions">${raw(card.actions
              .map((action) =>
                action.kind === "primary"
                  ? html`<a class="codex-conversion-button" href="${action.href}">${action.label}</a>`
                  : html`<a class="codex-conversion-link" href="${action.href}">${action.label}</a>`,
              )
              .join(""))}</div>`
          : "";

      return html`<article class="codex-conversion-card">
        <h3>${card.title}</h3>
        ${raw(card.description ? html`<p>${card.description}</p>` : "")}
        ${raw(itemsHtml)}
        ${raw(actionsHtml)}
      </article>`;
    })
    .join("");

  return html`<section class="codex-conversion-shell">
    <div class="codex-conversion-header">
      <p class="codex-conversion-kicker">${input.kicker}</p>
      <h2>${input.title}</h2>
      <p>${input.description}</p>
    </div>
    <div class="codex-conversion-grid">${raw(cardsHtml)}</div>
  </section>`;
}

function inferProductSegment(route: string): ProductSegment {
  const normalized = route.toLowerCase();

  if (/rfid-wristbands-for-hotels/.test(normalized)) {
    return "hotel-wristband";
  }

  if (/(hotel|room-key|key-card)/.test(normalized)) {
    return "hotel-access";
  }

  if (/(laundry|linen)/.test(normalized)) {
    return "laundry-tag";
  }

  if (/(wristband|event|coconut-shell)/.test(normalized)) {
    return "event-wristband";
  }

  if (/(reader|scanner|acr122u)/.test(normalized)) {
    return "reader";
  }

  if (/(windshield|vehicle|headlight|transponder|\bcar\b)/.test(normalized)) {
    return "vehicle-id";
  }

  if (/(key-fob|keyfob|fob)/.test(normalized)) {
    return "keyfob";
  }

  if (/(business-card|google-review|metal-nfc-card|wooden-rfid-card|eco_rfid_card|nfc-ring|nfc-cards?)/.test(normalized)) {
    return "nfc-branding";
  }

  if (/(label|sticker|tag)/.test(normalized)) {
    return "label-tag";
  }

  return "smart-card";
}

function resolveContactRouteForProductSegment(segment: ProductSegment): string {
  switch (segment) {
    case "hotel-access":
    case "hotel-wristband":
      return "/contact/hotel-rfid/";
    case "laundry-tag":
      return "/contact/laundry-rfid/";
    case "event-wristband":
      return "/contact/event-rfid/";
    case "reader":
      return "/contact/rfid-readers/";
    case "vehicle-id":
      return "/contact/vehicle-rfid/";
    case "keyfob":
      return "/contact/access-control-keyfobs/";
    case "nfc-branding":
      return "/contact/nfc-branding-cards/";
    case "label-tag":
      return "/contact/rfid-labels-tags/";
    default:
      return "/contact/custom-rfid-cards/";
  }
}

function resolveContactRouteForArticle(route: string): string {
  const normalized = route.toLowerCase();

  if (/rfid-laundry-tags/.test(normalized)) {
    return "/contact/laundry-rfid/";
  }

  if (/rfid-event-wristband/.test(normalized)) {
    return "/contact/event-rfid/";
  }

  if (/rfid-wooden-card/.test(normalized)) {
    return "/contact/nfc-branding-cards/";
  }

  if (/rfid-hotel-key-card/.test(normalized)) {
    return "/contact/hotel-rfid/";
  }

  if (/mifare_plus_card/.test(normalized)) {
    return "/contact/custom-rfid-cards/";
  }

  return "/contact/custom-rfid-cards/";
}

function resolveProductCollectionLink($body: CheerioAPI): ActionItem | null {
  const links = $body(".product_meta .posted_in a").toArray();

  for (let index = links.length - 1; index >= 0; index -= 1) {
    const href = $body(links[index]).attr("href") ?? "";
    const label = cleanText($body(links[index]).text());

    if (!href || !label || href === "/products/all/") {
      continue;
    }

    return {
      href,
      label: `Browse ${label}`,
    };
  }

  return {
    href: "/products/all/",
    label: "Browse products",
  };
}

function resolveRelatedGuide(route: string): ActionItem {
  const normalized = route.toLowerCase();

  if (/(google-review|review-card|qr-review|review-stand)/.test(normalized) && /(restaurant|cafe|bar)/.test(normalized) && /(franchise|chain|multi-location)/.test(normalized)) {
    return {
      href: "/guides/google-review-cards-for-restaurant-franchises/",
      label: "Google review cards for restaurant franchises",
    };
  }

  if (/(google-review|review-card|qr-review|review-stand)/.test(normalized) && /(dental|dentist|orthodontic|clinic-group)/.test(normalized)) {
    return { href: "/guides/google-review-cards-for-dental-groups/", label: "Google review cards for dental groups" };
  }

  if (/(google-review|review-card|qr-review|review-stand)/.test(normalized) && /(salon|spa|beauty)/.test(normalized) && /(chain|group|multi-location)/.test(normalized)) {
    return { href: "/guides/google-review-cards-for-salon-chains/", label: "Google review cards for salon chains" };
  }

  if (/(google-review|review-card|qr-review|review-stand)/.test(normalized) && /(dealer|dealership|automotive|auto)/.test(normalized)) {
    return { href: "/guides/google-review-cards-for-auto-dealerships/", label: "Google review cards for auto dealerships" };
  }

  if (/(google-review|review-card|qr-review|review-stand)/.test(normalized) && /(hotel|resort|hospitality)/.test(normalized) && /(group|chain|multi-location)/.test(normalized)) {
    return { href: "/guides/google-review-cards-for-hotel-groups/", label: "Google review cards for hotel groups" };
  }

  if (/(google-review|review-card|qr-review|review-stand)/.test(normalized) && /(gym|fitness|club)/.test(normalized) && /(franchise|chain|multi-location|group)/.test(normalized)) {
    return {
      href: "/guides/google-review-cards-for-fitness-franchises/",
      label: "Google review cards for fitness franchises",
    };
  }

  if (/(hotel|room-key|key-card)/.test(normalized) && /(sample|sampling|pilot)/.test(normalized)) {
    return { href: "/guides/hotel-key-card-sample-planning/", label: "Hotel key card sample planning" };
  }

  if (/(hotel|room-key|key-card)/.test(normalized) && /(artwork|printing|print|design|numbering)/.test(normalized)) {
    return {
      href: "/guides/hotel-key-card-artwork-and-printing-checklist/",
      label: "Hotel key card artwork and printing",
    };
  }

  if (/(google-review|review-card|qr-review|review-stand)/.test(normalized) && /(multi-location|franchise|chain|location)/.test(normalized)) {
    return {
      href: "/guides/google-review-cards-for-multi-location-brands/",
      label: "Google review cards for multi-location brands",
    };
  }

  if (/(google-review|review-card|qr-review|review-stand)/.test(normalized) && /(front-desk|checkout|counter|tabletop|pickup|placement|table)/.test(normalized)) {
    return { href: "/guides/google-review-card-placement-guide/", label: "Google review card placement guide" };
  }

  if (/(google-review|review-card|qr-review|review-stand)/.test(normalized) && /(staff|prompt|script|handoff|reception)/.test(normalized)) {
    return {
      href: "/guides/google-review-card-staff-prompt-playbook/",
      label: "Google review card staff-prompt playbook",
    };
  }

  if (/(google-review|review-card|qr-review|review-stand)/.test(normalized) && /(design|copy|layout|artwork|\bqr\b)/.test(normalized)) {
    return { href: "/guides/google-review-card-design-and-copy/", label: "Google review card design and copy" };
  }

  if (/(hotel|room-key|key-card)/.test(normalized)) {
    return { href: "/solutions/hotel-key-cards/", label: "Hotel key card solution guide" };
  }

  if (/(laundry|linen)/.test(normalized)) {
    return { href: "/solutions/rfid-laundry-tags/", label: "RFID laundry tag buyer's guide" };
  }

  if (/(event|wristband)/.test(normalized)) {
    return { href: "/solutions/rfid-event-access-control/", label: "RFID event access control guide" };
  }

  if (/(keyfob|key-fob|proximity-fob)/.test(normalized)) {
    return { href: "/solutions/rfid-keyfobs-access-control/", label: "RFID keyfob access-control guide" };
  }

  if (/(reader|writer|scanner|acr122u|sdk)/.test(normalized)) {
    return { href: "/solutions/rfid-readers-and-encoding/", label: "RFID readers and encoding guide" };
  }

  if (/(google-review|review-card|qr-review|review-stand)/.test(normalized)) {
    return { href: "/guides/google-review-nfc-card-setup/", label: "Google review NFC card setup guide" };
  }

  if (/(asset|on-metal|label)/.test(normalized)) {
    return { href: "/compare/hf-vs-uhf-rfid-for-asset-tracking/", label: "HF vs UHF RFID for asset tracking" };
  }

  if (/wood/.test(normalized)) {
    return { href: "/compare/metal-vs-wood-vs-pvc-nfc-business-cards/", label: "NFC card material comparison" };
  }

  if (/mifare/.test(normalized)) {
    return { href: "/compare/mifare-plus-ev2-vs-desfire-ev3/", label: "MIFARE Plus EV2 vs DESFire EV3" };
  }

  return { href: "/blog/", label: "Explore more RFID guides" };
}

function uniqueActions(actions: Array<ActionItem | null | undefined>, currentRoute?: string): ActionItem[] {
  const seen = new Set<string>();

  return actions.filter((action): action is ActionItem => {
    if (!action || !action.href || !action.label) {
      return false;
    }

    if (currentRoute && action.href === currentRoute) {
      return false;
    }

    if (seen.has(action.href)) {
      return false;
    }

    seen.add(action.href);
    return true;
  });
}

function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}


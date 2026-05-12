/**
 * Legacy URL redirect SEO output.
 *
 * Produces a noindex stub page with `<meta refresh>` + JS redirect for
 * old WordPress URLs that have been merged into a current canonical page.
 * The stub still ships visible HTML so accidental indexes degrade
 * gracefully and crawlers see a clear "this URL has moved" hint.
 *
 * Extracted from seo.ts during the P4a split (2026-05-08).
 */
import type { CheerioAPI } from "cheerio";

import type { SnapshotPage } from "../site-data";
import type { PageSeoData } from "../seo";

import { DEFAULT_IMAGE } from "../seo-content";

import {
  absoluteUrl,
  buildRobotsValue,
  escapeXml,
  normalizeRoute,
  sanitizeBodyAttrs,
  sanitizeHtmlAttrs,
  slugToTitle,
  stripNoiseHtmlComments,
} from "./utils";

import { resolveImageOverride } from "./image-utils";

interface LegacyRedirectProfile {
  title: string;
  description: string;
  inquiryHref: string;
  inquiryLabel: string;
}

export function buildLegacyRedirectSeo(page: SnapshotPage, $head: CheerioAPI, targetRoute: string): PageSeoData {
  const normalizedTarget = normalizeRoute(targetRoute);
  const canonicalUrl = absoluteUrl(normalizedTarget);
  const profile = resolveLegacyRedirectProfile(normalizedTarget);
  const imageOverride = resolveImageOverride(normalizedTarget);

  return {
    htmlAttrs: sanitizeHtmlAttrs(page.htmlAttrs),
    bodyAttrs: sanitizeBodyAttrs(page.bodyAttrs),
    headHtml: `${stripNoiseHtmlComments($head("head").html() ?? "")}
<meta http-equiv="refresh" content="0;url=${escapeXml(canonicalUrl)}">`,
    bodyHtml: buildLegacyRedirectBody(page.route, normalizedTarget, profile),
    kind: "page",
    contentTitle: profile.title,
    title: `Moved: ${profile.title} | Proud Tek`,
    description: profile.description,
    canonicalUrl,
    robots: buildRobotsValue(false),
    indexable: false,
    jsonLd: [],
    imageUrl: imageOverride?.url ? absoluteUrl(imageOverride.url) : absoluteUrl(DEFAULT_IMAGE),
    imageAlt: imageOverride?.alt ?? profile.title,
    imageGallery: imageOverride?.url ? [{ url: absoluteUrl(imageOverride.url), alt: imageOverride.alt }] : [],
    faqEntries: [],
    procurementFields: [],
    collectionSummary: [],
    collectionGuidanceFields: [],
    collectionRelatedPages: [],
    collectionSourceLinks: [],
    coreSummary: [],
    coreGuidanceFields: [],
    coreRelatedPages: [],
    coreSourceLinks: [],
    articleSummary: [],
    articleGuidanceFields: [],
    articleRelatedPages: [],
    articleSourceLinks: [],
    productRelatedPages: [],
    productSourceLinks: [],
    ogType: "website",
    articleMeta: null,
  };
}

export function buildLegacyRedirectBody(route: string, targetRoute: string, profile: LegacyRedirectProfile): string {
  const escapedRoute = escapeXml(route);
  const escapedTargetRoute = escapeXml(targetRoute);
  const escapedTargetUrl = escapeXml(absoluteUrl(targetRoute));
  const escapedTargetLabel = escapeXml(profile.title);
  const escapedDescription = escapeXml(profile.description);
  const escapedInquiryHref = escapeXml(profile.inquiryHref);
  const escapedInquiryLabel = escapeXml(profile.inquiryLabel);
  const redirectScript = `window.location.replace(${JSON.stringify(targetRoute)});`;

  return `
    <main class="codex-legacy-redirect-shell">
      <section class="codex-legacy-redirect" aria-labelledby="legacy-redirect-title">
        <p class="codex-legacy-redirect__eyebrow">Legacy URL</p>
        <h1 id="legacy-redirect-title">This page has moved</h1>
        <p class="codex-legacy-redirect__lead">
          Proud Tek merged older posts and duplicate routes into one current page so buyers can use the most up-to-date guidance and inquiry path.
        </p>
        <dl class="codex-legacy-redirect__details">
          <div>
            <dt>Old URL</dt>
            <dd>${escapedRoute}</dd>
          </div>
          <div>
            <dt>Current page</dt>
            <dd><a href="${escapedTargetRoute}">${escapedTargetLabel}</a></dd>
          </div>
        </dl>
        <p>${escapedDescription}</p>
        <div class="codex-legacy-redirect__actions">
          <a class="codex-legacy-redirect__action codex-legacy-redirect__action--primary" href="${escapedTargetRoute}">Open current page</a>
          <a class="codex-legacy-redirect__action" href="${escapedInquiryHref}">${escapedInquiryLabel}</a>
        </div>
        <p class="codex-legacy-redirect__meta">
          Redirecting to <a href="${escapedTargetRoute}">${escapedTargetUrl}</a>. If it does not open automatically, use the button above.
        </p>
        <script>${redirectScript}</script>
      </section>
    </main>
  `;
}

export function resolveLegacyRedirectProfile(targetRoute: string): LegacyRedirectProfile {
  const normalized = normalizeRoute(targetRoute);

  if (normalized === "/solutions/hotel-key-cards/") {
    return {
      title: "Hotel Key Card Compatibility Guide",
      description:
        "The current guide combines hotel lock compatibility, card materials, encoding options and early quote requirements in one canonical page.",
      inquiryHref: "/contact/hotel-rfid/",
      inquiryLabel: "Get hotel lock compatibility check",
    };
  }

  if (normalized === "/solutions/rfid-laundry-tags/") {
    return {
      title: "RFID Laundry Tags Buyer's Guide",
      description:
        "The current evergreen guide now holds the material, wash-cycle, frequency and sample-planning details that used to be split across older posts.",
      inquiryHref: "/contact/laundry-rfid/",
      inquiryLabel: "Request laundry tag samples",
    };
  }

  if (normalized === "/solutions/rfid-event-access-control/") {
    return {
      title: "RFID Event Access Control Guide",
      description:
        "The current evergreen guide covers event wristbands, attendee flow, access control setup and custom project planning in one place.",
      inquiryHref: "/contact/event-rfid/",
      inquiryLabel: "Request event RFID quote",
    };
  }

  if (normalized === "/compare/metal-vs-wood-vs-pvc-nfc-business-cards/") {
    return {
      title: "Metal vs Wood vs PVC NFC Business Cards",
      description:
        "The current comparison page concentrates material tradeoffs, branding considerations and shortlist decisions before you request samples or pricing.",
      inquiryHref: "/contact/nfc-branding-cards/",
      inquiryLabel: "Request custom review card",
    };
  }

  if (normalized === "/compare/mifare-plus-ev2-vs-desfire-ev3/") {
    return {
      title: "MIFARE Plus EV2 vs DESFire EV3",
      description:
        "The current comparison page is the canonical place for upgrade-path, security and deployment guidance around MIFARE Plus and DESFire card choices.",
      inquiryHref: "/contact/custom-rfid-cards/",
      inquiryLabel: "Get custom RFID card quote",
    };
  }

  if (normalized === "/compare/pps-vs-silicone-vs-textile-rfid-laundry-tags/") {
    return {
      title: "PPS vs Silicone vs Textile RFID Laundry Tags",
      description:
        "The current comparison page keeps the laundry tag material decision, durability tradeoffs and sampling questions under one evergreen URL.",
      inquiryHref: "/contact/laundry-rfid/",
      inquiryLabel: "Request laundry tag samples",
    };
  }

  if (normalized === "/product/nfc-stickers/") {
    return {
      title: "NFC Stickers",
      description:
        "The current product page is the canonical source for NFC sticker formats, chip options, phone behavior and custom quote requests.",
      inquiryHref: "/contact/rfid-labels-tags/",
      inquiryLabel: "Request NFC sticker quote",
    };
  }

  return {
    title: slugToTitle(normalized.split("/").filter(Boolean).pop() ?? "Current page"),
    description: "This legacy Proud Tek URL now points to the current canonical page for the same topic.",
    inquiryHref: "/contact/custom-rfid-cards/",
    inquiryLabel: "Get custom RFID card quote",
  };
}

/**
 * Per-kind cheerio body normalizers.
 *
 * Owns the cheerio mutations that transform the WordPress-imported
 * page body into Proud Tek's static-site shape. Includes:
 *
 *   - Per-kind body normalizers: product / collection / article
 *     (core kinds — home/about/contact/faq/blog — stay in seo.ts
 *     because they call enhance* helpers tightly coupled with seo.ts)
 *   - Legacy URL rewrite (a[href] → canonical)
 *   - Buyer-facing copy clarification
 *   - Keyword-based internal link injection
 *   - Inquiry action resolver (article CTAs)
 *   - Guidance-title resolver + collection support block (collection
 *     CTA + buyer guidance)
 *
 * Extracted from seo.ts during the P4d-2b split (2026-05-08).
 */
import type { CheerioAPI } from "cheerio";

import type { SnapshotPage } from "../site-data";
import type { PageContext } from "./types";

import { ROUTE_CANONICAL_OVERRIDES } from "../route-overrides";
import {
  PRODUCT_LEAD_PARAGRAPH_OVERRIDES,
  PRODUCT_HEADING_OVERRIDES,
  PAGE_IMAGE_OVERRIDES,
} from "../seo-content";
import { injectConversionBlocks } from "../conversion";

import { absoluteUrl, cleanText, escapeXml, normalizeRoute } from "./utils";
import {
  resolveProductCtaProfile,
  renderProductCta,
  resolveCollectionCtaProfile,
} from "./cta-profiles";
import {
  renderProductSpecSheet,
  renderProductSupportBlock,
} from "./product";
import { renderArticleSupportBlock } from "./render-blocks";


/* ── Contextual link map (used by injectContextualLinks) ─────── */

// Exported so the shadow render path (src/lib/editorial-shadow-normalizers.ts)
// can reuse the identical pattern list — keeps the two paths from drifting.
// Added 2026-05-12 for Stage 3 cutover sprint 1.
export const CONTEXTUAL_LINK_MAP: Array<{ pattern: RegExp; href: string; label: string }> = [
  { pattern: /\bhotel key cards?\b/i, href: "/solutions/hotel-key-cards/", label: "hotel key cards" },
  { pattern: /\blaundry (?:rfid )?tags?\b/i, href: "/solutions/rfid-laundry-tags/", label: "laundry tags" },
  { pattern: /\bgoogle review (?:nfc )?cards?\b/i, href: "/solutions/google-review-nfc-card/", label: "Google review NFC cards" },
  { pattern: /\bnfc business cards?\b/i, href: "/solutions/nfc-business-card/", label: "NFC business cards" },
  { pattern: /\bMIFARE Classic\b/i, href: "/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/", label: "MIFARE Classic" },
  { pattern: /\bMIFARE DESFire\b/i, href: "/compare/mifare-classic-vs-plus-vs-desfire-hotel-locks/", label: "MIFARE DESFire" },
  { pattern: /\bNTAG21[356]\b/i, href: "/compare/ntag213-vs-ntag215-vs-ntag216/", label: "NTAG chips" },
  { pattern: /\brfid wristbands?\b/i, href: "/products/rfid-wristbands/", label: "RFID wristbands" },
  { pattern: /\brfid readers?\b/i, href: "/products/rfid-readers/", label: "RFID readers" },
  { pattern: /\brfid labels?\b/i, href: "/products/rfid-labels/", label: "RFID labels" },
];


/* ── injectContextualLinks (keyword → internal link injection) ─ */

export function injectContextualLinks($body: CheerioAPI, container: ReturnType<CheerioAPI>, currentRoute: string): void {
  if (!container.length) return;

  let injected = 0;
  const maxLinks = 3;
  const usedHrefs = new Set<string>();

  container.find("p").each((_, element) => {
    if (injected >= maxLinks) return;

    const $p = $body(element);
    // Skip paragraphs that already contain links
    if ($p.find("a").length > 0) return;

    const text = $p.text();

    for (const entry of CONTEXTUAL_LINK_MAP) {
      if (injected >= maxLinks) break;
      if (usedHrefs.has(entry.href)) continue;
      // Don't link to the current page
      if (currentRoute === entry.href) continue;

      const match = entry.pattern.exec(text);
      if (match) {
        const original = match[0];
        const html = $p.html() ?? "";
        const newHtml = html.replace(
          original,
          `<a href="${entry.href}" title="${entry.label}">${original}</a>`,
        );
        $p.html(newHtml);
        usedHrefs.add(entry.href);
        injected++;
        break; // Only one link per paragraph
      }
    }
  });
}

/* ── Inquiry action resolver (used by normalizeArticleBody) ───── */

export function resolveArticleInquiryAction(route: string, contentTitle: string): { href: string; label: string } {
  const normalized = `${route} ${contentTitle}`.toLowerCase();

  if (/(hotel|room-key|saflok|onity|salto|vingcard)/.test(normalized)) {
    return { href: `/rfq/?product=rfid-cards&route=${encodeURIComponent(route)}`, label: "Request a hotel RFID quote" };
  }

  if (/(laundry|linen)/.test(normalized)) {
    return { href: `/rfq/?product=rfid-tags&route=${encodeURIComponent(route)}`, label: "Request a laundry RFID quote" };
  }

  if (/(wristband|event|festival)/.test(normalized)) {
    return { href: `/rfq/?product=rfid-wristbands&route=${encodeURIComponent(route)}`, label: "Request an event RFID quote" };
  }

  if (/(reader|acr122u|scanner|writer)/.test(normalized)) {
    return { href: `/rfq/?product=rfid-readers&route=${encodeURIComponent(route)}`, label: "Request an RFID reader quote" };
  }

  if (/(vehicle|windshield|headlight|transponder|\bcar\b)/.test(normalized)) {
    return { href: `/rfq/?product=rfid-labels&route=${encodeURIComponent(route)}`, label: "Request a vehicle RFID quote" };
  }

  if (/(keyfob|key-fob|fob)/.test(normalized)) {
    return { href: `/rfq/?product=rfid-keyfobs&route=${encodeURIComponent(route)}`, label: "Request a keyfob quote" };
  }

  if (/(review|google review|business card|wooden card|metal nfc|ntag|nfc)/.test(normalized)) {
    return { href: `/rfq/?product=rfid-cards&freq=hf&route=${encodeURIComponent(route)}`, label: "Request an NFC quote" };
  }

  if (/(label|sticker|tag|asset tracking)/.test(normalized)) {
    return { href: `/rfq/?product=rfid-labels&route=${encodeURIComponent(route)}`, label: "Request an RFID label quote" };
  }

  return { href: `/rfq/?product=rfid-cards&route=${encodeURIComponent(route)}`, label: "Request a custom RFID card quote" };
}


/* ── Guidance title (used by renderCollectionSupportBlock) ───── */

export function resolveGuidanceTitle(route: string): string {
  const normalized = normalizeRoute(route);
  const titles: Record<string, string> = {
    "/products/all/": "How to navigate this catalog",
    "/products/rfid-cards/": "How to choose the right RFID card",
    "/products/rfid-tags/": "How to choose the right RFID tag",
    "/products/rfid-readers/": "How to choose the right RFID reader",
    "/products/rfid-labels/": "How to choose the right RFID label",
    "/products/rfid-keyfobs/": "How to choose the right RFID keyfob",
    "/products/rfid-wristbands/": "How to choose the right RFID wristband",
  };

  if (titles[normalized]) {
    return titles[normalized];
  }

  // Sub-collection pages use their parent collection title
  for (const [prefix, title] of Object.entries(titles)) {
    if (normalized.startsWith(prefix) && normalized !== prefix) {
      return title;
    }
  }

  return "How to compare options";
}


/* ── Render collection support block (used by normalizeCollectionBody) ─ */

export function renderCollectionSupportBlock(context: PageContext): string {
  const canonicalPath = normalizeRoute(new URL(context.canonicalUrl).pathname);
  const profile = resolveCollectionCtaProfile(canonicalPath);
  const briefHtml = profile.briefItems
    .map((item) => `<li><span class="codex-collection-cta__check">✓</span> ${escapeXml(item)}</li>`)
    .join("");

  const ctaHtml = `<div class="codex-collection-cta">
      <div class="codex-collection-cta__copy">
        <p class="codex-collection-cta__eyebrow">Need help choosing?</p>
        <h2>${escapeXml(profile.label)}</h2>
        <p>${escapeXml(profile.description)}</p>
      </div>
      <ul class="codex-collection-cta__brief">${briefHtml}</ul>
      <div class="codex-collection-cta__actions">
        <a class="codex-collection-cta__primary" href="${escapeXml(profile.href)}">Start a conversation →</a>
      </div>
    </div>`;

  const guidanceTitle = resolveGuidanceTitle(canonicalPath);
  const guidanceHtml =
    context.collectionGuidanceFields.length > 0
      ? `<section class="codex-collection-guidance" aria-label="${escapeXml(guidanceTitle)}">
          <h2 class="codex-collection-guidance__title">${escapeXml(guidanceTitle)}</h2>
          <ol class="codex-collection-guidance__steps">${context.collectionGuidanceFields
            .map(
              (entry, index) =>
                `<li class="codex-collection-guidance__step">
                  <span class="codex-collection-guidance__num">${index + 1}</span>
                  <div class="codex-collection-guidance__body">
                    <strong>${escapeXml(entry.label)}</strong>
                    <p>${escapeXml(entry.value)}</p>
                  </div>
                </li>`,
            )
            .join("")}</ol></section>`
      : "";

  if (!guidanceHtml) {
    return "";
  }

  return `<div class="codex-collection-buying-support">${ctaHtml}${guidanceHtml}</div>`;
}


/* ── Legacy internal link rewriting ──────────────────────────── */

export function rewriteLegacyInternalLinks($body: CheerioAPI): void {
  $body("a[href]").each((_, element) => {
    const href = $body(element).attr("href") ?? "";
    const rewrittenHref = rewriteLegacyInternalHref(href);

    if (rewrittenHref && rewrittenHref !== href) {
      $body(element).attr("href", rewrittenHref);
    }
  });
}

export function rewriteLegacyInternalHref(href: string): string {
  const normalized = normalizeRoute(href);

  if (!normalized) {
    return href;
  }

  const canonicalOverride = ROUTE_CANONICAL_OVERRIDES[normalized];
  if (canonicalOverride) {
    return canonicalOverride;
  }

  const catalogPageMatch = normalized.match(/^\/product-category\/products\/page\/(\d+)\/$/);

  if (catalogPageMatch) {
    const pageNumber = Number(catalogPageMatch[1]);
    return pageNumber <= 1 ? "/products/all/" : `/products/all/page/${pageNumber}/`;
  }

  const categoryPageMatch = normalized.match(/^\/product-category\/products\/([^/]+)\/page\/(\d+)\/$/);

  if (categoryPageMatch) {
    const [, slug, pageNumber] = categoryPageMatch;
    return Number(pageNumber) <= 1 ? `/products/${slug}/` : `/products/${slug}/page/${pageNumber}/`;
  }

  const categoryMatch = normalized.match(/^\/product-category\/products\/([^/]+)\/$/);

  if (categoryMatch) {
    return `/products/${categoryMatch[1]}/`;
  }

  if (normalized === "/product-category/products/") {
    return "/products/all/";
  }

  return href;
}


/* ── Body content clarifier ──────────────────────────────────── */

export function clarifyBuyerFacingCopy($body: CheerioAPI): void {
  const replacements: Array<[string, string]> = [
    ["Decision table", "Quick comparison"],
    ["RFQ checklist", "Project checklist"],
    ["What to put in the first RFQ brief", "What to include in your first message"],
    ["What happens after you send the brief", "What happens after you contact us"],
    ["Move from product browsing into a more operational RFQ.", "Move from product browsing into a clearer quote request."],
    [
      "Expansion pages that help move from a first shortlist into a cleaner RFQ.",
      "Expansion pages that help turn a first shortlist into a clearer quote request.",
    ],
    [
      "Use this guide when the project already knows the use case, but still needs a tighter implementation or validation workflow before moving into RFQ or sample review.",
      "Use this guide when the project already knows the use case, but still needs a tighter implementation or validation workflow before requesting samples or pricing.",
    ],
    [
      "These are the details that usually remove the wrong formats, materials or chip families before the first RFQ or sample round starts.",
      "These are the details that usually remove the wrong formats, materials, or chip families before the first quote or sample round starts.",
    ],
    ["What makes a label RFQ more useful?", "What makes a label inquiry more useful?"],
    [
      "Procurement teams that need a compatibility-first sample plan before RFQ.",
      "Procurement teams that need a compatibility-first sample plan before requesting a quote.",
    ],
    [
      "When the team wants to avoid a generic RFQ and send a tighter technical brief instead.",
      "When the team wants to avoid a generic quote request and send tighter technical details instead.",
    ],
  ];

  replacements.forEach(([from, to]) => {
    $body("h1, h2, h3, p, a, li, summary").each((_, element) => {
      const node = $body(element);
      if (cleanText(node.text()) === from) {
        node.text(to);
      }
    });
  });

  // Fix grammar issues in WP snapshot content
  const grammarFixes: Array<[RegExp, string]> = [
    [/ProudTek prioritize\b/g, "Proud Tek prioritizes"],
  ];

  $body("p").each((_, element) => {
    const node = $body(element);
    const html = node.html() ?? "";
    let fixed = html;
    grammarFixes.forEach(([pattern, replacement]) => {
      fixed = fixed.replace(pattern, replacement);
    });
    if (fixed !== html) {
      node.html(fixed);
    }
  });
}


/* ── Per-kind body normalizers ───────────────────────────────── */

export function normalizeProductBody($body: CheerioAPI, page: SnapshotPage, context: PageContext): void {
  const product = $body("div.product").first();

  if (!product.length) {
    return;
  }

  product.find("h1.product_title, .summary.entry-summary > h1").first().text(context.contentTitle);
  const canonicalPath = normalizeRoute(new URL(context.canonicalUrl).pathname);
  const leadOverride = PRODUCT_LEAD_PARAGRAPH_OVERRIDES[canonicalPath];
  if (leadOverride) {
    const shortDescription = product.find(".summary.entry-summary .woocommerce-product-details__short-description").first();
    const leadParagraph = shortDescription.find("p").filter((_, element) => cleanText($body(element).text()).length > 0).first();

    if (leadParagraph.length) {
      leadParagraph.text(leadOverride);
    } else if (shortDescription.length) {
      shortDescription.prepend(`<p>${escapeXml(leadOverride)}</p>`);
    }
  }

  product.find("p.price").each((_, element) => {
    if (!cleanText($body(element).text())) {
      $body(element).remove();
    }
  });

  product.find(".woocommerce-product-gallery").each((_, element) => {
    const $gallery = $body(element);
    const style = $gallery.attr("style") ?? "";

    if (!style) {
      return;
    }

    const nextStyle = style
      .replace(/opacity\s*:\s*0\s*;?/gi, "")
      .replace(/transition\s*:\s*opacity\s*\.25s\s*ease-in-out\s*;?/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim()
      .replace(/^;|;$/g, "");

    if (nextStyle) {
      $gallery.attr("style", nextStyle);
      return;
    }

    $gallery.removeAttr("style");
  });

  product.find(".codex-product-support").remove();
  product.find(".codex-product-cta").remove();
  product.find(".single-product-extras").remove();

  const ctaProfile = resolveProductCtaProfile(canonicalPath, context.contentTitle);
  product.find('a[href="/contact/"], a[href="https://proudtek.com/contact/"]').each((_, element) => {
    $body(element).attr("href", ctaProfile.href);
  });

  // Legacy renderProductCta removed — now handled by injectConversionBlocks()

  const supportHtml = renderProductSupportBlock(context);
  if (supportHtml) {
    const anchor = product.find(".woocommerce-tabs").first();

    if (anchor.length) {
      anchor.after(supportHtml);
    } else {
      product.find(".summary.entry-summary").after(supportHtml);
    }
  }

  const specSheetHtml = renderProductSpecSheet(canonicalPath);
  if (specSheetHtml) {
    const specAnchor = product.find(".codex-product-support").first();
    if (specAnchor.length) {
      specAnchor.after(specSheetHtml);
    } else {
      const tabAnchor = product.find(".woocommerce-tabs").first();
      if (tabAnchor.length) {
        tabAnchor.after(specSheetHtml);
      } else {
        product.find(".summary.entry-summary").after(specSheetHtml);
      }
    }
  }

  injectConversionBlocks($body, page, "product", {
    canonicalUrl: context.canonicalUrl,
    contentTitle: context.contentTitle,
    description: context.description,
  });
}

export function normalizeCollectionBody($body: CheerioAPI, context: PageContext): void {
  $body(".codex-collection-support").remove();

  const canonicalPath = normalizeRoute(new URL(context.canonicalUrl).pathname);
  const ctaProfile = resolveCollectionCtaProfile(canonicalPath);
  const main = $body("main").first();
  if (main.length) {
    main.find('a[href="/contact/"], a[href="https://proudtek.com/contact/"]').each((_, element) => {
      $body(element).attr("href", ctaProfile.href);
    });
  }

  const supportHtml = renderCollectionSupportBlock(context);
  if (!supportHtml) {
    return;
  }

  // Inject the "Need help choosing?" CTA + "How to navigate" guidance at the
  // BOTTOM of the page, after all product category sections — so shoppers
  // browse the catalog first and fall into the help block only if they scroll
  // past without finding what they need.
  const mainEl = $body("main#main, main.site-main, main").first();
  if (mainEl.length) {
    mainEl.append(supportHtml);
    return;
  }

  // Fallbacks — try to place after the last product list, else after header.
  const productLists = $body("ul.products, .products");
  if (productLists.length) {
    productLists.last().after(supportHtml);
    return;
  }

  const header = $body(".woocommerce-products-header").first();
  if (header.length) {
    header.after(supportHtml);
  }
}


/* ── Article body normalization ──────────────────────────────── */

export function normalizeArticleBody($body: CheerioAPI, page: SnapshotPage, context: PageContext): void {
  const { articleMeta } = context;

  if (!articleMeta) {
    return;
  }

  $body('a[href^="/author/"]').each((_, element) => {
    $body(element).attr("href", articleMeta.authorUrl).text(articleMeta.authorName);
  });

  $body(".posted-by .author, .author.vcard").each((_, element) => {
    const link = $body(element).find("a").first();

    if (link.length) {
      link.attr("href", articleMeta.authorUrl).text(articleMeta.authorName);
      return;
    }

    $body(element).text(articleMeta.authorName);
  });

  $body(".article-meta p, .article-footer p").each((_, element) => {
    const text = cleanText($body(element).text());

    if (!text) {
      return;
    }

    if (/Last Updated:/i.test(text) || text.includes("[Current Date]")) {
      $body(element).text(`Last Updated: ${articleMeta.modifiedLabel}`);
      return;
    }

    if (/^Author:/i.test(text)) {
      $body(element).text(`Author: ${articleMeta.authorName}`);
    }
  });

  $body('.article-footer a.share-button[href="#"], .article-footer a.share-button[href=""]').remove();
  $body(".article-footer p").each((_, element) => {
    const text = cleanText($body(element).text());

    if (/^Share this article:/i.test(text) && $body(element).find("a").length === 0) {
      $body(element).remove();
    }
  });

  $body('img[src*="["], img[src*="%5B"]').remove();

  const bodyHtml = $body("body").html() ?? "";
  const cleanedHtml = bodyHtml.replace(
    /Would you like me to continue with the next sections\?\s*I.?ll maintain this level of detail and formatting throughout the article while incorporating all required elements and links\./gi,
    "",
  );

  if (cleanedHtml !== bodyHtml) {
    $body("body").html(cleanedHtml);
  }

  const imageOverride = PAGE_IMAGE_OVERRIDES[page.route];
  if (imageOverride) {
    $body(`img[src="${imageOverride.url}"], img[src="${absoluteUrl(imageOverride.url)}"]`).attr("alt", imageOverride.alt);
  }

  const articleInquiry = resolveArticleInquiryAction(page.route, context.contentTitle);
  const entryContent = $body("article .entry-content, .entry-content.single-content, .entry-content").first();
  entryContent
    .find('a[href="/contact/"], a[href="https://proudtek.com/contact/"]')
    .each((_, element) => {
      $body(element).attr("href", articleInquiry.href);
    });

  // Inject contextual internal links for unlinked keyword mentions (max 3 per article)
  injectContextualLinks($body, entryContent, page.route);

  $body(".codex-article-support").remove();
  const articleHtml = renderArticleSupportBlock(context);
  if (articleHtml) {
    if (entryContent.length) {
      entryContent.append(articleHtml);
    } else {
      const contentWrap = $body(".entry-content-wrap").first();
      if (contentWrap.length) {
        contentWrap.append(articleHtml);
      }
    }
  }

  injectConversionBlocks($body, page, "article", {
    canonicalUrl: context.canonicalUrl,
    contentTitle: context.contentTitle,
    description: context.description,
  });
}


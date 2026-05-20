/**
 * Image-selection / alt-inference / scoring utilities.
 *
 * These read DOM via cheerio but do not mutate it. Used by the SEO
 * pipeline to pick a representative og:image, generate accessible
 * alt text, and score image candidates by keyword relevance.
 *
 * Extracted from seo.ts during the P1 split (2026-05-08).
 */
import type { CheerioAPI, BasicAcceptedElems } from "cheerio";
import type { AnyNode } from "domhandler";

import type { EditorialDefinition } from "../editorial-types";
import { DEFAULT_IMAGE, PAGE_IMAGE_OVERRIDES, SITE_ORIGIN } from "../seo-content";

import { absoluteUrl, cleanText, parseDimension, type PageKind } from "./utils";

import type { ImageCandidate, ImageSelection, PageContext } from "./types";

/* ── Page-level image override ─────────────────────────────────── */

export function resolveImageOverride(route: string): ImageSelection | null {
  const override = PAGE_IMAGE_OVERRIDES[route];
  if (!override) {
    return null;
  }

  return {
    url: absoluteUrl(override.url),
    alt: override.alt,
  };
}

/* ── Image URL extraction ──────────────────────────────────────── */

export function selectImageUrl($body: CheerioAPI, element: BasicAcceptedElems<AnyNode>): string {
  return cleanText(
    $body(element).attr("data-large_image") ??
      $body(element).attr("data-src") ??
      $body(element).attr("src") ??
      "",
  );
}

/* ── Image classification ──────────────────────────────────────── */

export function isDecorativeImageUrl(value: string): boolean {
  return /(logo|favicon|emoji|flag|avatar|icon)/i.test(value);
}

export function isPlaceholderImageUrl(value: string): boolean {
  return /(?:%5b|\[).*(?:url|badge).*(?:%5d|\])/i.test(value);
}

export function isTinyImageVariant(value: string): boolean {
  return /-(?:100|150|180|192|225|270|300)x(?:81|97|100|150|164|180|192|200|225|261|270|300|327)\./i.test(value);
}

export function getLowValueImagePenalty(value: string, alt: string, kind: PageKind, route: string): number {
  const haystack = `${value} ${alt}`.toLowerCase();
  let penalty = 0;

  if (/(badge|certif|certificate|iso[_-]?9001|iso[_-]?14001|oeko|rohs|reach)/i.test(haystack)) {
    penalty += 40;
  }

  if (kind !== "product" && /(legic|impinj|nxp|atmel|fm|issi|microelectronic|\bst\b|\bti\b)/i.test(haystack)) {
    penalty += route === "/about/" ? 80 : 45;
  }

  if (kind === "home" && /(badge|logo)/i.test(haystack)) {
    penalty += 36;
  }

  return penalty;
}

export function isWeakImageAlt(value: string): boolean {
  return !value || /^(image|photo|picture|product)$/i.test(value);
}

/* ── Alt text inference ────────────────────────────────────────── */

export function guessImageAlt(
  $body: CheerioAPI,
  element: BasicAcceptedElems<AnyNode>,
  contentTitle: string,
  kind: PageKind,
): string {
  const src = selectImageUrl($body, element);

  if (!src) {
    return fallbackImageAlt(contentTitle, kind);
  }

  if ($body(element).closest(".site-branding, .custom-logo, .footer-html, footer").length > 0 || /logo/i.test(src)) {
    return "Proud Tek logo";
  }

  if (/favicon/i.test(src)) {
    return "Proud Tek favicon";
  }

  const loopTitle =
    cleanText(
      $body(element)
        .closest("li.product, .product")
        .find(".woocommerce-loop-product__title, .product_title")
        .first()
        .text(),
    ) || cleanText($body(element).closest("a").attr("aria-label") ?? "");

  if (loopTitle) {
    return `${loopTitle} product image`;
  }

  const filenameTitle = filenameToTitle(src);
  if (filenameTitle && !/^[a-f0-9-]{16,}$/i.test(filenameTitle.replace(/\s+/g, ""))) {
    return kind === "product" ? `${filenameTitle} product image` : filenameTitle;
  }

  return fallbackImageAlt(contentTitle, kind);
}

export function fallbackImageAlt(contentTitle: string, kind: PageKind): string {
  if (kind === "product") {
    return `${contentTitle} product image`;
  }

  if (kind === "article") {
    return `${contentTitle} illustration`;
  }

  return contentTitle;
}

export function filenameToTitle(value: string): string {
  const filename = value.split("/").pop() ?? "";

  return decodeURIComponent(filename)
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/-\d+x\d+$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* ── Keyword scoring ───────────────────────────────────────────── */

export function scoreKeywordMatches(value: string, keywords: Set<string>): number {
  const haystack = value.toLowerCase();
  let score = 0;

  keywords.forEach((keyword) => {
    if (haystack.includes(keyword)) {
      score += 1;
    }
  });

  return score;
}

export function buildImageKeywordSet(contentTitle: string, route: string): Set<string> {
  const stopWords = new Set([
    "the",
    "and",
    "for",
    "with",
    "from",
    "into",
    "your",
    "guide",
    "complete",
    "ultimate",
    "2024",
    "2025",
    "proud",
    "tek",
  ]);

  const tokens = `${contentTitle} ${route}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !stopWords.has(token));

  return new Set(tokens);
}

export function buildSpecificImageKeywordSet(contentTitle: string, route: string): Set<string> {
  const broadTerms = new Set([
    "rfid",
    "nfc",
    "card",
    "cards",
    "tag",
    "tags",
    "sticker",
    "stickers",
    "label",
    "labels",
    "reader",
    "readers",
    "wristband",
    "wristbands",
    "product",
  ]);

  return new Set(Array.from(buildImageKeywordSet(contentTitle, route)).filter((token) => !broadTerms.has(token)));
}
/* ── refreshNormalizedImageContext ─────────────────────────────── */

export function refreshNormalizedImageContext($body: CheerioAPI, route: string, context: PageContext): void {
  if (context.kind !== "blog") {
    return;
  }

  const primaryImage = resolveImageSelection(null, $body, context.kind, context.contentTitle, route);
  context.imageUrl = primaryImage.url;
  context.imageAlt = primaryImage.alt;
  context.imageGallery = resolveImageGallery($body, context.kind, context.contentTitle, route, primaryImage);
}


/* ── Image selection / gallery (uses collectImageCandidates) ───── */

export function resolveImageSelection(
  $head: CheerioAPI | null,
  $body: CheerioAPI,
  kind: PageKind,
  contentTitle: string,
  route: string,
  editorialDef?: EditorialDefinition,
): ImageSelection {
  const imageOverride = resolveImageOverride(route);
  if (imageOverride) {
    return imageOverride;
  }

  // P0-4 (2026-05-19): if editorial JSON declares a heroImage, prefer it
  // over the body-img scan. Editorial routes don't have a meaningful
  // og:image in the WP snapshot head; without this fast-path, 585/605
  // pages fall back to DEFAULT_IMAGE (the cropped corporate logo).
  if (editorialDef?.heroImage) {
    return {
      url: absoluteUrl(editorialDef.heroImage),
      alt: editorialDef.imageAlt || fallbackImageAlt(contentTitle, kind),
    };
  }

  const candidates = collectImageCandidates($head, $body, kind, contentTitle, route);

  const best = candidates.sort((left, right) => right.score - left.score)[0];

  if (best) {
    return {
      url: best.url,
      alt: best.alt,
    };
  }

  return {
    url: absoluteUrl(DEFAULT_IMAGE),
    alt: fallbackImageAlt(contentTitle, kind),
  };
}

export function resolveImageGallery(
  $body: CheerioAPI,
  kind: PageKind,
  contentTitle: string,
  route: string,
  primaryImage: ImageSelection,
): ImageSelection[] {
  const gallery = [primaryImage];
  const seen = new Set([primaryImage.url]);
  const candidates = collectImageCandidates(null, $body, kind, contentTitle, route);
  const keywords = buildImageKeywordSet(contentTitle, route);
  const specificKeywords = buildSpecificImageKeywordSet(contentTitle, route);

  candidates
    .sort((left, right) => right.score - left.score)
    .forEach((candidate) => {
      if (seen.has(candidate.url)) {
        return;
      }

      const keywordHits = scoreKeywordMatches(`${candidate.alt} ${filenameToTitle(candidate.url)}`, keywords);
      const specificKeywordHits = scoreKeywordMatches(`${candidate.alt} ${filenameToTitle(candidate.url)}`, specificKeywords);
      const lowValueMarker = `${candidate.url} ${candidate.alt}`;

      if (kind === "article" && (keywordHits < 2 || specificKeywordHits < 1)) {
        return;
      }

      if ((kind === "home" || kind === "about" || kind === "contact") && /(badge|logo|legic|impinj|nxp|atmel|fm|issi|microelectronic|\bst\b|\bti\b)/i.test(lowValueMarker)) {
        return;
      }

      if (candidate.score < (kind === "product" ? 18 : 30)) {
        return;
      }

      seen.add(candidate.url);
      gallery.push({
        url: candidate.url,
        alt: candidate.alt,
      });
    });

  return gallery.slice(0, kind === "product" ? 6 : 2);
}

export function collectImageCandidates(
  $head: CheerioAPI | null,
  $body: CheerioAPI,
  kind: PageKind,
  contentTitle: string,
  route: string,
): ImageCandidate[] {
  const selectors =
    kind === "product"
      ? [".woocommerce-product-gallery__image img", ".wp-post-image", ".entry-content img", "main img"]
      : kind === "article"
        ? ["article .entry-content img", ".entry-content img", ".post-thumbnail img", "main img"]
        : ["main img", ".entry-content img", "img"];
  const keywords = buildImageKeywordSet(contentTitle, route);
  const candidates: ImageCandidate[] = [];

  selectors.forEach((selector, selectorIndex) => {
    $body(selector)
      .toArray()
      .forEach((element, elementIndex) => {
        const rawUrl = selectImageUrl($body, element);

        if (!rawUrl || isDecorativeImageUrl(rawUrl) || isPlaceholderImageUrl(rawUrl)) {
          return;
        }

        if (
          $body(element).closest("header, footer, nav, form, .site-header, .site-footer, .related, .products, .widget, .entry-author, .trp-language-switcher").length > 0
        ) {
          return;
        }

        const rawAlt = cleanText($body(element).attr("alt") ?? "");
        const alt = !isWeakImageAlt(rawAlt) ? rawAlt : guessImageAlt($body, element, contentTitle, kind);
        const filename = filenameToTitle(rawUrl);
        const width = parseDimension($body(element).attr("width"));
        const height = parseDimension($body(element).attr("height"));
        const matchScore = scoreKeywordMatches(`${alt} ${filename}`, keywords);
        const sizeScore = width >= 700 || height >= 450 ? 24 : width >= 450 || height >= 300 ? 14 : 4;
        const variantPenalty = isTinyImageVariant(rawUrl) ? 14 : 0;
        const lowValuePenalty = getLowValueImagePenalty(rawUrl, alt, kind, route);

        candidates.push({
          url: absoluteUrl(rawUrl),
          alt: alt || fallbackImageAlt(contentTitle, kind),
          score: 90 - selectorIndex * 10 - elementIndex + matchScore * 14 + sizeScore - variantPenalty - lowValuePenalty,
        });
      });
  });

  if ($head) {
    const headImage = cleanText($head('meta[property="og:image"]').attr("content") ?? "");
    if (headImage && !isDecorativeImageUrl(headImage) && !isPlaceholderImageUrl(headImage)) {
      const headAlt = cleanText($head('meta[property="og:image:alt"]').attr("content") ?? "") || fallbackImageAlt(contentTitle, kind);

      candidates.push({
        url: absoluteUrl(headImage),
        alt: headAlt,
        score: 32 + scoreKeywordMatches(`${headAlt} ${filenameToTitle(headImage)}`, keywords) * 10,
      });
    }
  }

  return candidates;
}


/* ── Image accessibility (alt text injection) ─────────────────── */

export function applyImageAccessibility($body: CheerioAPI, context: PageContext): void {
  $body("img").each((index, element) => {
    const $image = $body(element);

    // H1: Ensure all images have loading and decoding attributes
    if (!$image.attr("loading")) {
      $image.attr("loading", index < 2 ? "eager" : "lazy");
    }
    if (!$image.attr("decoding")) {
      $image.attr("decoding", "async");
    }

    const currentAlt = cleanText($image.attr("alt") ?? "");

    if (!isWeakImageAlt(currentAlt)) {
      return;
    }

    const nextAlt = guessImageAlt($body, element, context.contentTitle, context.kind);

    if (!nextAlt) {
      return;
    }

    $image.attr("alt", nextAlt);

    const wrapper = $image.closest(".woocommerce-product-gallery__image");
    if (wrapper.length && !cleanText(wrapper.attr("data-thumb-alt") ?? "")) {
      wrapper.attr("data-thumb-alt", nextAlt);
    }
  });

  if (context.kind === "article" && context.articleMeta) {
    const { modifiedLabel } = context.articleMeta;
    $body("time.updated").each((_, element) => {
      $body(element).text(modifiedLabel);
    });
  }

  const canonicalImage = $body(`img[src="${context.imageUrl.replace(SITE_ORIGIN, "")}"], img[data-large_image="${context.imageUrl}"]`).first();
  if (canonicalImage.length) {
    canonicalImage.attr("alt", context.imageAlt);
  }
}



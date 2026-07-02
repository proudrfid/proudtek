/**
 * Pure text / route / date utilities used by SEO pipelines.
 *
 * No cheerio, no I/O, no side effects. All functions are deterministic
 * given their inputs. Safe to import from anywhere in the codebase.
 *
 * Extracted from seo.ts during the P1 split (2026-05-08).
 */
import { ROUTE_CANONICAL_OVERRIDES } from "../route-overrides";
import { SITE_ORIGIN, IS_CANONICAL_ORIGIN } from "../seo-content";
// Type-only imports — erased at compile time, no runtime cycle.
import type { BreadcrumbItem, ProductSpec } from "../seo";
import type { PageContext } from "./types";

/* ── Shared types ──────────────────────────────────────────────── */

export type PageKind =
  | "home"
  | "product"
  | "article"
  | "faq"
  | "contact"
  | "about"
  | "blog"
  | "collection"
  | "archive"
  | "utility"
  | "page";

/* ── Text utilities ────────────────────────────────────────────── */

export function cleanText(value: string): string {
  return value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function truncateText(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  const budget = maxLength - 3;
  const slice = value.slice(0, budget);

  // Prefer ending on a complete sentence when one falls in the back half of
  // the budget — a shorter complete thought reads better in SERP/AI snippets
  // than a longer cut-off one, and needs no ellipsis (2026-07-02: 204/315
  // commercial pages had their meta description cut mid-clause).
  const sentenceEnd = Math.max(
    slice.lastIndexOf(". "),
    slice.lastIndexOf("! "),
    slice.lastIndexOf("? "),
  );
  if (sentenceEnd > budget * 0.55) {
    return slice.slice(0, sentenceEnd + 1);
  }

  // Next best: a clause boundary (still ellipsised — thought is incomplete,
  // but the cut lands somewhere a reader expects a pause).
  const clauseEnd = Math.max(
    slice.lastIndexOf("; "),
    slice.lastIndexOf(" — "),
    slice.lastIndexOf(": "),
    slice.lastIndexOf(", "),
  );
  if (clauseEnd > budget * 0.6) {
    return `${slice.slice(0, clauseEnd)}...`;
  }

  const boundary = slice.lastIndexOf(" ");

  return `${slice.slice(0, boundary > 60 ? boundary : slice.length)}...`;
}

export function uniqueTextEntries(values: string[]): string[] {
  const seen = new Set<string>();
  const results: string[] = [];

  values.forEach((value) => {
    const key = value.toLowerCase();

    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    results.push(value);
  });

  return results;
}

export function firstSentence(value: string): string {
  const match = cleanText(value).match(/^.*?[.!?](?:\s|$)/);
  return match ? cleanText(match[0]) : cleanText(value);
}

export function cleanSnapshotTitle(value: string): string {
  return cleanText(value)
    .replace(/ExpandToggle Menu.*$/i, "")
    .replace(/GridList.*$/i, "")
    .replace(/ContinueLoadingDone.*$/i, "")
    .replace(/PreviousContinue.*$/i, "")
    .replace(/FacebookTwitterInstagramLinkedinYouTubePhoneWhatsAppEmail.*$/i, "")
    .replace(/\s*[|–-]\s*Custom RFID.*$/i, "")
    .replace(/\s*[|–-]\s*Proud Tek.*$/i, "")
    .trim();
}

export function isBoilerplateText(value: string): boolean {
  return (
    /Toggle Menu/i.test(value) ||
    /RFID Tags RFID Labels RFID Readers RFID cards RFID Keyfobs RFID Wristbands/i.test(value) ||
    /FacebookTwitterInstagramLinkedinYouTubePhoneWhatsAppEmail/i.test(value) ||
    /^[{}[\]":,@.\s-]+$/.test(value)
  );
}

export function stripNoiseHtmlComments(value: string): string {
  return value
    .replace(/<!--\s*Google tag \(gtag\.js\) snippet added by Site Kit\s*-->/gi, "")
    .replace(/<!--\s*Google Analytics snippet added by Site Kit\s*-->/gi, "")
    .replace(/<!--\s*Google AdSense meta tags added by Site Kit\s*-->/gi, "")
    .replace(/<!--\s*End Google AdSense meta tags added by Site Kit\s*-->/gi, "")
    // 2026-07-01: the fourth (and last — audited exhaustively against every
    // "added by Site Kit" comment string across src/data/pages/**/*.json)
    // Site Kit block. sanitizeBody/sanitizeHead remove the *functional*
    // <script src="accounts.google.com/gsi/client"> element via a CSS
    // selector, but a CSS selector can only ever remove elements — the
    // surrounding HTML comment markers are separate sibling nodes and
    // survive untouched. Harmless (no request, not rendered) but still
    // dead bytes shipped on every page that carries this WP admin-login
    // leftover — closing it here for consistency with the other three.
    .replace(/<!--\s*Sign in with Google button added by Site Kit\s*-->/gi, "")
    .replace(/<!--\s*End Sign in with Google button added by Site Kit\s*-->/gi, "")
    .replace(/<!--\s*Analytics by WP Statistics[\s\S]*?-->/gi, "")
    .replace(/\n\s*\n\s*\n+/g, "\n\n");
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function slugToTitle(value: string): string {
  return decodeURIComponent(value)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function hostnameToLabel(value: string): string {
  try {
    const hostname = new URL(value).hostname.replace(/^www\./i, "");
    return slugToTitle(hostname.split(".")[0] ?? hostname);
  } catch {
    return "";
  }
}

/* ── Route utilities ───────────────────────────────────────────── */

export function normalizeRoute(route: string): string {
  if (!route) {
    return "";
  }

  if (/^https?:\/\//i.test(route)) {
    try {
      const url = new URL(route);
      route = url.pathname;
    } catch {
      return "";
    }
  } else if (route.startsWith("//")) {
    return "";
  } else if (/^[a-z]+:/i.test(route) || route.startsWith("#")) {
    return "";
  }

  let normalized = route.startsWith("/") ? route : `/${route}`;

  // The trailing slash belongs on the path only — split off any ?query /
  // #fragment first so `/about/#peter-zhang` normalizes to
  // `/about/#peter-zhang`, not `/about/#peter-zhang/`.
  let suffix = "";
  const suffixIndex = normalized.search(/[?#]/);
  if (suffixIndex !== -1) {
    suffix = normalized.slice(suffixIndex);
    normalized = normalized.slice(0, suffixIndex);
  }

  if (!normalized.endsWith("/") && !/\.[a-z0-9]+$/i.test(normalized)) {
    normalized = `${normalized}/`;
  }

  return `${normalized}${suffix}`;
}

export function resolveCanonicalRoute(route: string): string {
  const normalized = normalizeRoute(route);
  return normalized ? ROUTE_CANONICAL_OVERRIDES[normalized] ?? normalized : normalized;
}

export function resolveLegacyRedirectPath(route: string): string {
  const normalized = normalizeRoute(route);

  if (!normalized) {
    return "";
  }

  const canonicalOverride = ROUTE_CANONICAL_OVERRIDES[normalized];
  return canonicalOverride && canonicalOverride !== normalized ? canonicalOverride : "";
}

export function absoluteUrl(value: string): string {
  if (!value) {
    return `${SITE_ORIGIN}/`;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (value.startsWith("//")) {
    return `https:${value}`;
  }

  return new URL(normalizeRoute(value), `${SITE_ORIGIN}/`).toString();
}

/* ── Date utilities ────────────────────────────────────────────── */

export function normalizeDateTime(value: string, fallback: string): string {
  const normalized = value || fallback;

  return /^\d{4}-\d{2}-\d{2}T/.test(normalized) ? normalized : fallback;
}

export function formatDisplayDate(value: string): string {
  const datePart = value.slice(0, 10);
  const parsed = new Date(`${datePart}T00:00:00Z`);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

/* ── Misc ──────────────────────────────────────────────────────── */

export function parseDimension(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? "", 10);

  return Number.isFinite(parsed) ? parsed : 0;
}

export function buildRobotsValue(
  indexable: boolean,
  isCanonicalOrigin: boolean = IS_CANONICAL_ORIGIN,
): string {
  // Index only on the canonical production origin. Any other origin (e.g. a
  // staging/preview *.vercel.app build of the in-progress rebuild) is forced
  // to `noindex` so it stays out of search and never competes with the live
  // site. A page that is already non-indexable stays noindex. The origin flag
  // is a parameter (defaulting to the build's resolved origin) for testability.
  const effectiveIndexable = indexable && isCanonicalOrigin;
  return `${effectiveIndexable ? "index" : "noindex"},follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1`;
}

/* ── Indexability + machine-readable route helpers ─────────────── */

export function isIndexableRoute(route: string): boolean {
  if (resolveCanonicalRoute(route) !== normalizeRoute(route)) {
    return false;
  }

  if (
    route.startsWith("/cart/") ||
    route.startsWith("/checkout/") ||
    route.startsWith("/my-account/") ||
    route.startsWith("/product-tag/") ||
    route.startsWith("/tag/") ||
    route.startsWith("/category/") ||
    route.startsWith("/author/") ||
    route.startsWith("/product-category/")
  ) {
    return false;
  }

  return !/\/page\/\d+\/$/.test(route);
}

export function buildMachineRoute(route: string, extension: "json" | "txt"): string {
  const normalized = normalizeRoute(route);

  if (normalized === "/") {
    return `/machine/index.${extension}`;
  }

  return `/machine${normalized.slice(0, -1)}.${extension}`;
}

/* ── HTML / body attribute sanitizers ──────────────────────────── */

export function sanitizeHtmlAttrs(attrs: Record<string, string>): Record<string, string> {
  const nextAttrs = { ...attrs };
  delete nextAttrs.itemtype;
  delete nextAttrs.itemscope;
  delete nextAttrs.prefix;

  return {
    ...nextAttrs,
    lang: "en-US",
  };
}

export function sanitizeBodyAttrs(attrs: Record<string, string>): Record<string, string> {
  const nextAttrs = { ...attrs };
  delete nextAttrs.itemtype;
  delete nextAttrs.itemscope;
  delete nextAttrs.prefix;

  return nextAttrs;
}

/* ── Page-kind helpers ─────────────────────────────────────────── */

export function isCoreSupportKind(kind: PageKind): boolean {
  return kind === "home" || kind === "about" || kind === "contact" || kind === "faq" || kind === "blog";
}

export function findProductSpecValue(specs: ProductSpec[], names: string[]): string {
  const normalizedNames = new Set(names.map((name) => name.toLowerCase()));
  return specs.find((entry) => normalizedNames.has(entry.name.toLowerCase()))?.value ?? "";
}

export function resolveContextSourceLinks(context: PageContext): BreadcrumbItem[] {
  return context.kind === "article"
    ? context.articleSourceLinks
    : context.kind === "collection"
      ? context.collectionSourceLinks
      : isCoreSupportKind(context.kind)
        ? context.coreSourceLinks
      : context.productSourceLinks;
}

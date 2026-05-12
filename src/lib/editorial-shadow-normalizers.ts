/**
 * Shadow-render-path equivalents of the cheerio body mutations performed by
 * `src/lib/seo/normalize-body.ts` for the article kind.
 *
 * The legacy render path (`renderEditorialMain` → `seo.bodyHtml` → cheerio
 * normalize) applies several post-render mutations INSIDE `<main>`. The
 * Stage 3 shadow path (`EditorialArticle.astro` → `<EditorialPageLayout>`
 * regex-split around `<main>`) bypasses those mutations entirely, which
 * caused 315 REAL DIFFs in `npm run stage3:diff -- all` on 2026-05-12.
 *
 * Sprint 1 retrofits 3 of those mutations into the shadow path:
 *
 *   1. `rewriteContactHref(href, route, title)` — mirrors the
 *      `a[href="/contact/"]` rewrite in normalize-body.ts (~line 540).
 *      Wraps `resolveArticleInquiryAction` and returns the routed
 *      inquiry path when href is `/contact/` (or its absolute form).
 *
 *   2. `injectContextualLinksToParagraphs(paragraphs, currentRoute)` —
 *      mirrors `injectContextualLinks` (~line 63). Walks raw paragraph
 *      strings in order, injects up to 3 markdown links matching the
 *      shared `CONTEXTUAL_LINK_MAP`, skipping paragraphs that already
 *      contain `[..](..)` markdown links.
 *
 *   3. `resolveHeroAltOverride(route, currentSrc)` — mirrors the
 *      `PAGE_IMAGE_OVERRIDES` lookup (~line 532). When `currentSrc`
 *      matches the route's image-override URL, returns the override's
 *      `alt` text; otherwise returns null (caller keeps existing alt).
 *
 * Sprint 2 (deferred) will tackle the `renderArticleSupportBlock`
 * conversion-shell append — the highest-volume remaining mutation.
 */

import {
  resolveArticleInquiryAction,
  CONTEXTUAL_LINK_MAP,
} from "./seo/normalize-body";
import { PAGE_IMAGE_OVERRIDES, SITE_ORIGIN } from "./seo-content";
import type { EditorialSectionData, EditorialResourceCard } from "./editorial-types";

/* ── 1. /contact/ href rewrite ──────────────────────────────────── */

/**
 * If `href` is the canonical contact route (`/contact/` or its absolute
 * `${SITE_ORIGIN}/contact/` form), rewrite it to the routed inquiry path
 * via `resolveArticleInquiryAction(route, title)`. Otherwise returns the
 * input href unchanged.
 *
 * Mirrors the cheerio block in normalize-body.ts (~line 539-543) but at
 * the shadow-component layer, so the rewrite happens BEFORE the link is
 * rendered (instead of AFTER, via post-parse mutation).
 */
export function rewriteContactHref(href: string, route: string, title: string): string {
  if (href === "/contact/" || href === `${SITE_ORIGIN}/contact/`) {
    return resolveArticleInquiryAction(route, title).href;
  }
  return href;
}

/**
 * Pre-process `resourceCards` for the shadow render path: every `link.href`
 * that targets bare `/contact/` is rewritten to the routed inquiry path
 * via `resolveArticleInquiryAction`. Mirrors the legacy cheerio sweep that
 * touches all `a[href="/contact/"]` inside `.entry-content` — ResourceGrid
 * cards render as `<a>` tags inside entry-content, so the legacy path picks
 * them up but the shadow path didn't (until now).
 *
 * Returns a new array; cards that don't have any /contact/ links pass
 * through by reference.
 */
export function rewriteResourceCardsContactLinks(
  cards: readonly EditorialResourceCard[],
  route: string,
  title: string,
): EditorialResourceCard[] {
  return cards.map((card) => {
    let mutated = false;
    const nextLinks = card.links.map((link) => {
      const nextHref = rewriteContactHref(link.href, route, title);
      if (nextHref === link.href) return link;
      mutated = true;
      return { ...link, href: nextHref };
    });
    return mutated ? { ...card, links: nextLinks } : card;
  });
}

/**
 * Pre-process sections for the shadow render path: rewrite any
 * `section.callout.href` that targets bare `/contact/` to the routed
 * inquiry path. EditorialCallout renders `Learn more →` as an `<a>` tag
 * inside entry-content, so the legacy cheerio sweep catches it.
 *
 * Returns a new sections array; sections without a /contact/ callout
 * href pass through by reference. Pure — no mutation.
 *
 * (Section bullets / paragraph markdown links also reach cheerio, but
 * those are inside `renderInlineLinks` text and are handled at
 * editorial-pages.ts authoring time — fixtures don't use bare /contact/
 * as a markdown link target so no shadow-side rewrite is needed.)
 */
export function rewriteSectionsContactLinks(
  sections: readonly EditorialSectionData[],
  route: string,
  title: string,
): EditorialSectionData[] {
  return sections.map((section) => {
    if (!section.callout?.href) return section;
    const nextHref = rewriteContactHref(section.callout.href, route, title);
    if (nextHref === section.callout.href) return section;
    return {
      ...section,
      callout: { ...section.callout, href: nextHref },
    };
  });
}

/* ── 2. Contextual link injection ───────────────────────────────── */

/**
 * Walk paragraph strings in order. For each paragraph that DOESN'T already
 * contain a markdown link `[..](..)`, try to match a `CONTEXTUAL_LINK_MAP`
 * pattern and inject ONE markdown link in place of the first match.
 *
 * Stops after `maxLinks` (3 by default) total injections across the entire
 * sequence — same global cap as the legacy cheerio path.
 *
 * Pure function: returns a NEW array; never mutates the input. Paragraphs
 * that don't trigger an injection are returned unchanged (by reference).
 *
 * NOTE: emits markdown with a title segment — `[label](href "title")`. The
 * existing `renderInlineLinks` regex was extended (2026-05-12) to capture
 * the optional title group so this produces the same `<a href="..."
 * title="...">..</a>` markup the legacy cheerio path emitted.
 */
export function injectContextualLinksToParagraphs(
  paragraphs: readonly string[],
  currentRoute: string,
  maxLinks = 3,
): string[] {
  const out: string[] = [];
  let injected = 0;
  const usedHrefs = new Set<string>();

  // `[..](..)` (with or without a title segment) — used to short-circuit
  // injection on already-linked paragraphs, matching the cheerio version's
  // "skip $p.find('a').length > 0" guard.
  const HAS_MD_LINK = /\[[^\]]+\]\([^)]+\)/;

  for (const paragraph of paragraphs) {
    if (injected >= maxLinks || HAS_MD_LINK.test(paragraph)) {
      out.push(paragraph);
      continue;
    }

    let nextValue = paragraph;
    for (const entry of CONTEXTUAL_LINK_MAP) {
      if (usedHrefs.has(entry.href)) continue;
      if (currentRoute === entry.href) continue;

      const match = entry.pattern.exec(paragraph);
      if (match) {
        const original = match[0];
        // Replace first occurrence with markdown-with-title syntax.
        // renderInlineLinks turns this into `<a href=".." title="..">..</a>`.
        const replacement = `[${original}](${entry.href} "${entry.label}")`;
        nextValue = paragraph.replace(original, replacement);
        usedHrefs.add(entry.href);
        injected++;
        break; // One link per paragraph
      }
    }
    out.push(nextValue);
  }

  return out;
}

export interface ContextualLinksResult {
  /** Possibly rewritten summary string (for the hero). */
  summary: string;
  /** Possibly rewritten sections array (for the section map). */
  sections: EditorialSectionData[];
}

/**
 * Page-level convenience: walk the editorial body's text-bearing slots in
 * DOM order, applying contextual-link injection with the global max-3 cap
 * shared across the whole page. Walk order matches the legacy cheerio path
 * (which iterates all `<p>` elements in DOM order):
 *
 *   1. hero summary (rendered first as `<p class="codex-editorial-summary">`)
 *   2. for each section in order:
 *      a. intro          (rendered as `<p class="codex-editorial-section-intro">`)
 *      b. each paragraph (rendered as `<p>`)
 *      c. callout.text   (rendered as `<p>` inside the callout)
 *
 * Bullets / checklist items render as `<li>` not `<p>`, so the legacy
 * cheerio selector `container.find("p")` doesn't touch them — neither
 * do we.
 *
 * Returns a NEW `{ summary, sections }` pair so the caller can thread the
 * possibly-rewritten summary into the hero. Slots that didn't trigger an
 * injection are returned by reference for sections that are otherwise
 * unchanged.
 */
export function preProcessContextualLinks(
  summary: string,
  sections: readonly EditorialSectionData[],
  currentRoute: string,
  maxLinks = 3,
): ContextualLinksResult {
  let remaining = maxLinks;
  const usedHrefs = new Set<string>();
  const HAS_MD_LINK = /\[[^\]]+\]\([^)]+\)/;

  const tryInject = (text: string): string => {
    if (remaining <= 0 || HAS_MD_LINK.test(text)) return text;
    for (const entry of CONTEXTUAL_LINK_MAP) {
      if (usedHrefs.has(entry.href)) continue;
      if (currentRoute === entry.href) continue;
      const match = entry.pattern.exec(text);
      if (match) {
        const original = match[0];
        const replacement = `[${original}](${entry.href} "${entry.label}")`;
        usedHrefs.add(entry.href);
        remaining -= 1;
        return text.replace(original, replacement);
      }
    }
    return text;
  };

  // Step 1: hero summary (first <p> in DOM order)
  const nextSummary = tryInject(summary);

  // Step 2: per-section intro, paragraphs, callout text
  const nextSections = sections.map((section) => {
    if (remaining <= 0) return section;

    const nextIntro = section.intro ? tryInject(section.intro) : section.intro;
    const nextParagraphs = section.paragraphs
      ? section.paragraphs.map((p) => tryInject(p))
      : section.paragraphs;
    const nextCallout = section.callout
      ? { ...section.callout, text: tryInject(section.callout.text) }
      : section.callout;

    return {
      ...section,
      intro: nextIntro,
      paragraphs: nextParagraphs,
      callout: nextCallout,
    };
  });

  return { summary: nextSummary, sections: nextSections };
}

/* ── 3. Page image alt override ─────────────────────────────────── */

/**
 * Look up the page-level image override for `route`. If found AND the
 * override's `url` matches `currentSrc` (in either relative or absolute
 * `${SITE_ORIGIN}` form), return the override's `alt` text. Otherwise
 * return null and the caller should keep the existing alt.
 *
 * Mirrors normalize-body.ts ~line 532-535. The selector there matches
 * `img[src="${url}"], img[src="${absoluteUrl(url)}"]` so we accept both.
 */
export function resolveHeroAltOverride(route: string, currentSrc: string): string | null {
  const override = PAGE_IMAGE_OVERRIDES[route];
  if (!override) return null;
  const absUrl = `${SITE_ORIGIN}${override.url}`;
  if (override.url === currentSrc || absUrl === currentSrc) {
    return override.alt;
  }
  return null;
}

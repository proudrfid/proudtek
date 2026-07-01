/**
 * Blog body normalization & article-grid injection.
 *
 * Owns the blog-specific cheerio mutations:
 *   - injectBlogArticleGrid: builds the topic-rail + article-card grid
 *     that replaces the WordPress archive on /blog/ index pages
 *   - normalizeBlogArchiveCards: rewrites WP archive grid cards to
 *     the codex card layout
 *   - getBlogThumbnails / classifyBlogKicker / buildArchiveCardTitle /
 *     formatArchiveTitle: helper utilities used by the above
 *
 * Also owns the blog-definitions cache populated at build start by
 * initBlogDefinitions() — the function is re-exported from ../seo so
 * existing callers (site-data.ts) keep working.
 *
 * Extracted from seo.ts during the P4d-1 split (2026-05-08).
 */
import type { CheerioAPI } from "cheerio";
import { getCollection } from "astro:content";

import type { SnapshotPage } from "../site-data";
import { EDITORIAL_TEAM_NAME } from "../seo-content";
import { getAuthorRecord } from "../authors";
import { ARTICLE_AUTHOR_MAP } from "../../data/article-author-map";
import { cleanText, escapeXml, normalizeRoute, slugToTitle, truncateText } from "./utils";
import { buildRailHtml, buildRailFilterScript } from "./rail";
import { resolveChipPlaceholdersDeep } from "../chip-placeholders";
import {
  BLOG_TOPICS,
  classifyBlogKicker,
  getBlogThumbnails,
} from "../../data/blog-topics";

/* External re-exports so callers that imported `classifyBlogKicker` /
 * `getBlogThumbnails` from ./blog-body keep working. The `export … from`
 * form is used (instead of `export { classifyBlogKicker, getBlogThumbnails }`)
 * so Vite's SSR loader resolves the binding directly from the source
 * module — avoids the HMR-cache hazard where a locally-rebound symbol
 * races with downstream consumers.
 *
 * The companion `import { … }` above is still needed because functions
 * defined in this module (e.g. `injectBlogArticleGrid`) call
 * `getBlogThumbnails()` directly and need a local binding to resolve. */
export { classifyBlogKicker, getBlogThumbnails } from "../../data/blog-topics";

/* ── Blog definitions from Content Collections (lazy cache) ──────────── */

interface BlogDefEntry { route: string; title: string; summary: string; kicker: string; heroImage: string }
let _blogDefsCache: BlogDefEntry[] | null = null;

/** Pre-load blog definitions into sync cache. Must be called once before buildPageSeo. */
export async function initBlogDefinitions(): Promise<void> {
  if (_blogDefsCache) return;
  const entries = await getCollection("editorial");
  _blogDefsCache = entries
    .filter((e) => !e.id.startsWith("_unused/") && e.data.group === "blog" && e.data.route !== "/blog/")
    .map((e) => {
      // Resolve {chip:slug:field} placeholders before caching. Today's live
      // consumers (buildBlogTopicsRailHtml, getBlogTopicForRoute) only read
      // .kicker, so this cache isn't part of the confirmed /blog/ card-leak
      // bug — but title/summary/heroImage are stored here too and the only
      // other reader (injectBlogArticleGrid) reads them raw. Resolving up
      // front keeps the cache safe for any future consumer.
      const data = resolveChipPlaceholdersDeep(e.data);
      return {
        route: data.route,
        title: data.title,
        summary: data.summary,
        kicker: data.kicker,
        heroImage: data.heroImage ?? "",
      };
    });
}

/**
 * Build the Blog Topics left-rail HTML via the shared `buildRailHtml`.
 *
 * Used on both the /blog/ hub itself (where the inline filter script
 * intercepts rail-link clicks and filters the in-page grid) and on
 * per-blog-post pages (where the rail link href navigates back to the
 * hub at /blog/#topic-{id} — the filter script then re-applies on load).
 *
 * Pass `activeTopicId` to highlight the topic of the current article.
 */
export function buildBlogTopicsRailHtml(opts: {
  hrefPrefix?: string;
  activeTopicId?: string;
} = {}): string {
  if (!_blogDefsCache || _blogDefsCache.length === 0) return "";

  const hrefPrefix = opts.hrefPrefix ?? "";

  // Compute counts per topic (and total).
  const topicCounts: Record<string, number> = {};
  let totalPosts = 0;
  for (const blog of _blogDefsCache) {
    const kicker = blog.kicker || "RFID Technology";
    const topicId = classifyBlogKicker(kicker);
    topicCounts[topicId] = (topicCounts[topicId] ?? 0) + 1;
    totalPosts++;
  }

  const items = BLOG_TOPICS
    .filter((t) => (topicCounts[t.id] ?? 0) > 0)
    .map((t) => ({
      id: t.id,
      label: t.label,
      icon: t.icon,
      count: topicCounts[t.id] ?? 0,
      // On the hub itself we anchor (#topic-id) so the filter handler picks
      // it up; per-post pages prepend /blog/ so the click navigates back.
      href: `${hrefPrefix}#topic-${t.id}`,
    }));

  return buildRailHtml({
    modifier: "blog",
    groupLabel: "Topics",
    toggleIcon: "📚",
    toggleAriaLabel: "Show blog topics",
    asideAriaLabel: "Blog topics",
    closeAriaLabel: "Close topics",
    items,
    allLink: {
      label: "All articles",
      icon: "📚",
      href: `${hrefPrefix}#topic-all`,
      count: totalPosts,
    },
    activeId: opts.activeTopicId,
  });
}

/**
 * Look up the active topic id for a blog post by its route.
 * Returns undefined if the route isn't in the blog cache (e.g. before init).
 */
export function getBlogTopicForRoute(route: string): string | undefined {
  if (!_blogDefsCache) return undefined;
  const blog = _blogDefsCache.find((b) => b.route === route);
  if (!blog) return undefined;
  return classifyBlogKicker(blog.kicker || "RFID Technology");
}

export function injectBlogArticleGrid($body: CheerioAPI, _page?: SnapshotPage): void {
  if (!_blogDefsCache || _blogDefsCache.length === 0) {
    return;
  }

  // Collect all posts; classify each into a normalized topic so the left rail
  // shows ~10 stable categories instead of 50+ raw kicker strings.
  const thumbMap = getBlogThumbnails();
  const allPosts: Array<{
    route: string;
    title: string;
    summary: string;
    kicker: string;
    topicId: string;
    thumb: string;
  }> = [];
  for (const blog of _blogDefsCache) {
    const kicker = blog.kicker || "RFID Technology";
    allPosts.push({
      route: blog.route,
      title: blog.title,
      summary: blog.summary,
      kicker,
      topicId: classifyBlogKicker(kicker),
      thumb: blog.heroImage || thumbMap[blog.route] || "",
    });
  }

  // All cards in a flat 3-column grid. data-rail-key is the normalized topic
  // id so the shared rail click-handler can filter by topic. We keep the
  // human kicker as the visible card tag.
  const cardsHtml = allPosts
    .map(
      (post) =>
        `<a class="codex-card codex-blog-grid-card" href="${escapeXml(post.route)}" data-rail-key="${escapeXml(post.topicId)}" data-kicker="${escapeXml(post.kicker)}">
          ${post.thumb ? `<img class="codex-blog-grid-card__thumb" src="${escapeXml(post.thumb)}" alt="${escapeXml(post.title)}" width="1200" height="675" loading="lazy" decoding="async" />` : ""}
          <span class="codex-blog-grid-card__tag">${escapeXml(post.kicker)}</span>
          <strong>${escapeXml(post.title)}</strong>
          <p>${escapeXml(truncateText(post.summary, 120))}</p>
          <span class="codex-blog-grid-card__cta">Read guide →</span>
        </a>`,
    )
    .join("");

  // Left rail mirroring /products/all/. Built via shared helper so per-blog
  // post pages can use the same markup (see enhance-page.ts blog single-page
  // branch). On the hub itself we pass hrefPrefix="" so anchors filter the
  // in-page article grid via the JS handler below; per-post pages pass
  // hrefPrefix="/blog/" so anchors jump back here.
  const railHtml = buildBlogTopicsRailHtml({ hrefPrefix: "", activeTopicId: undefined });

  const filterScript = buildRailFilterScript({
    filterMode: "in-place",
    hubAnchorId: "topic-all",
    hubPath: "/blog/",
  });

  const sectionHtml = `${railHtml}
  <section class="codex-blog-index codex-blog-index--with-rail" id="topic-all" aria-label="Blog articles">
    <div class="codex-blog-index__header">
      <h1>RFID &amp; NFC Knowledge Base</h1>
      <p>${allPosts.length} technical guides for procurement teams evaluating RFID cards, tags, labels, readers, keyfobs and wristbands.</p>
    </div>
    <div class="codex-blog-index__grid">
      ${cardsHtml}
    </div>
    <div class="codex-blog-index__empty" hidden>
      <div class="codex-blog-index__empty-icon" aria-hidden="true">🔍</div>
      <h3>No articles in this topic yet</h3>
      <p>Try another topic, or view all articles.</p>
      <button type="button" class="codex-blog-index__empty-clear">Show all articles</button>
    </div>
    <script>${filterScript}</script>
  </section>`;

  const main = $body("main#main, main.site-main").first();
  if (main.length) {
    main.append(sectionHtml);
  }
}

export function normalizeBlogArchiveCards($body: CheerioAPI): void {
  $body("article.loop-entry, .archive-posts article, .kadence-posts article").each((_, element) => {
    const card = $body(element);
    const titleLink = card.find(".entry-title a").first();
    const href = titleLink.attr("href") ?? "";
    const title = buildArchiveCardTitle(href, titleLink.text());

    if (titleLink.length && title) {
      titleLink.text(title);
      card.find(".more-link-wrap .screen-reader-text").first().text(` ${title}`);
      card.find(".post-thumbnail img").first().attr("alt", title);
    }

    // 2026-06-11: archive cards previously flattened every byline to the
    // institutional team name while the page's Article JSON-LD credited the
    // mapped expert (sam-yao / mia-li / peter-zhang) — a visible-vs-LD
    // mismatch. Resolve the SAME map the LD uses so reader-visible bylines
    // and structured data agree; fall back to the editorial board record
    // (and its review-board anchor) when a route has no mapping.
    const cardRoute = normalizeRoute(href);
    const mappedAuthor = getAuthorRecord(cardRoute ? ARTICLE_AUTHOR_MAP[cardRoute] : undefined);
    const boardRecord = getAuthorRecord("editorial-board");
    const bylineName = mappedAuthor?.name ?? boardRecord?.name ?? EDITORIAL_TEAM_NAME;
    const bylineHref = mappedAuthor?.url ?? boardRecord?.url ?? "/about/review-board/";

    const authorLink = card.find(".posted-by .author a, .posted-by a, .author.vcard a").first();
    if (authorLink.length) {
      authorLink.attr("href", bylineHref).text(bylineName);
    } else {
      card.find(".posted-by .author, .author.vcard").first().text(bylineName);
    }
  });
}

export function buildArchiveCardTitle(href: string, fallbackTitle: string): string {
  const route = normalizeRoute(href);

  if (!route) {
    return cleanText(fallbackTitle);
  }

  if (/^\/(solutions|compare|guides|compatibility)\//.test(route)) {
    const slug = route.split("/").filter(Boolean).slice(1).join("-");
    return formatArchiveTitle(slug);
  }

  return cleanText(fallbackTitle);
}

export function formatArchiveTitle(slug: string): string {
  let title = slugToTitle(slug).replace(/\bVs\b/g, "vs").replace(/\bAnd\b/g, "and");
  const replacements: Array<[RegExp, string]> = [
    [/\bRfid\b/g, "RFID"],
    [/\bNfc\b/g, "NFC"],
    [/\bHf\b/g, "HF"],
    [/\bUhf\b/g, "UHF"],
    [/\bMifare\b/g, "MIFARE"],
    [/\bDesfire\b/g, "DESFire"],
    [/\bNtag213\b/g, "NTAG213"],
    [/\bNtag215\b/g, "NTAG215"],
    [/\bNtag216\b/g, "NTAG216"],
    [/\bEv1\b/g, "EV1"],
    [/\bEv2\b/g, "EV2"],
    [/\bEv3\b/g, "EV3"],
    [/\bMiwa\b/g, "MIWA"],
    [/\bPvc\b/g, "PVC"],
    [/\bPla\b/g, "PLA"],
    [/\bQr\b/g, "QR"],
    [/\bGoogle Review\b/g, "Google Review"],
  ];

  replacements.forEach(([pattern, value]) => {
    title = title.replace(pattern, value);
  });

  return title;
}


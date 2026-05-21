/**
 * Per-kind body normalization & page-specific cheerio enhancements.
 *
 * Owns:
 *   - normalizePageBody: top-level body normalization dispatcher.
 *     Calls into normalize-body.ts for product/collection/article and
 *     into normalizeCoreBody (below) for home/about/contact/faq/blog.
 *   - normalizeCoreBody: core/support page dispatcher that runs the
 *     5 enhance* functions, conversion-block injection, blog grid
 *     injection, and inquiry-link normalization.
 *   - enhanceHomeHero / enhanceAboutPage / enhanceFaqPage /
 *     enhanceKadenceA11y / enhancePrimaryContactPage: per-page
 *     hand-tuned cheerio mutations.
 *
 * Extracted from seo.ts during the P4d-2c split (2026-05-08).
 */
import type { CheerioAPI } from "cheerio";

import type { SnapshotPage } from "../site-data";
import type { PageContext } from "./types";

import { injectConversionBlocks } from "../conversion";

import { cleanText, escapeXml, isCoreSupportKind } from "./utils";

import {
  applyImageAccessibility,
  refreshNormalizedImageContext,
} from "./image-utils";

import {
  clarifyBuyerFacingCopy,
  rewriteLegacyInternalLinks,
  normalizeProductBody,
  normalizeCollectionBody,
  normalizeArticleBody,
} from "./normalize-body";

import { normalizeGlobalInquiryEntry } from "./inquiry-rewrite";

import {
  injectBlogArticleGrid,
  normalizeBlogArchiveCards,
  buildBlogTopicsRailHtml,
  getBlogTopicForRoute,
} from "./blog-body";

import {
  buildGuideClustersRailHtml,
  getActiveClusterForGuidesRoute,
} from "./guides-rail";

import { buildCompareCategoriesRailHtml } from "./compare-rail";
import { buildCompatibilityRailHtml } from "./compatibility-rail";

import {
  COMPARE_CATEGORIES,
  getActiveCategoryForCompareRoute,
} from "../../data/compare-categories";
import { GUIDE_CLUSTERS } from "../../data/guide-clusters";
import { getActiveCategoryForCompatibilityRoute } from "../../data/compatibility-vendors";

const GUIDE_CLUSTER_IDS = new Set(GUIDE_CLUSTERS.map((c) => c.id));

/**
 * Shared rail-injection helper. Used by three hubs (guides / compare / blog)
 * to replace the editorial-pages.ts default "Resources" rail with a
 * hub-specific rail, without re-implementing the cheerio swap three times.
 *
 * Skips any route the hub renders as a native .astro template (those pages
 * render their rail directly inside their template, not through this path).
 */
function injectHubRail(
  $body: CheerioAPI,
  route: string,
  opts: {
    prefix: string;
    isNativeHubRoute: (route: string) => boolean;
    buildRail: (route: string) => string;
  },
): void {
  if (!route.startsWith(opts.prefix)) return;
  if (opts.isNativeHubRoute(route)) return;

  const existingPanel = $body("#codex-catalog-rail-panel");
  if (existingPanel.length === 0) return;

  const railHtml = opts.buildRail(route);
  if (!railHtml) return;

  // Original DOM (from editorial-pages renderHubRail):
  //   [old toggle button] [old backdrop div] [old <aside> panel]
  // Replace the panel with the full new triplet (toggle + backdrop + new
  // aside), then strip the leftover old toggle + backdrop that sit before it.
  existingPanel.replaceWith(railHtml);
  $body(".codex-catalog-rail-toggle").first().remove();
  $body(".codex-catalog-rail-backdrop").first().remove();
}

import {
  renderTrustBar,
  renderHomeGrowthHub,
  renderHomeQuoteBrief,
  renderHomeResourceTrio,
  renderBlogGrowthHub,
} from "./render-blocks";

export function normalizePageBody($body: CheerioAPI, page: SnapshotPage, context: PageContext): void {
  rewriteLegacyInternalLinks($body);

  if (context.kind === "product") {
    normalizeProductBody($body, page, context);
  }

  if (context.kind === "collection") {
    normalizeCollectionBody($body, context);
  }

  if (context.kind === "article" && context.articleMeta) {
    normalizeArticleBody($body, page, context);
  }

  if (isCoreSupportKind(context.kind)) {
    normalizeCoreBody($body, page, context);
  }

  // Per-hub rail injection. Three hubs (blog, guides, compare) all want to
  // replace the editorial-pages.ts default "Resources" rail with their own
  // hub-specific rail. The shape is identical: detect a route prefix, skip
  // any sub-page that already renders its own rail via a native .astro
  // template, find #codex-catalog-rail-panel, swap it. `injectHubRail`
  // factors this out so each hub is a 5-line config.
  injectHubRail($body, page.route, {
    prefix: "/guides/",
    isNativeHubRoute: (route) => {
      // /guides/ itself is a native .astro hub (src/pages/guides/index.astro)
      // and /guides/{cluster}/ are native cluster hubs (src/pages/guides/[cluster].astro).
      // Those pages render the rail themselves; only single guide pages
      // /guides/{slug}/ flow through the cheerio path.
      if (route === "/guides/") return true;
      const slug = route.replace(/^\/guides\/|\/$/g, "");
      return GUIDE_CLUSTER_IDS.has(slug);
    },
    buildRail: (route) => buildGuideClustersRailHtml(getActiveClusterForGuidesRoute(route)),
  });

  injectHubRail($body, page.route, {
    prefix: "/compare/",
    isNativeHubRoute: (route) => {
      if (route === "/compare/") return true;
      const slug = route.replace(/^\/compare\/|\/$/g, "");
      return COMPARE_CATEGORIES.some((c) => c.id === slug);
    },
    buildRail: (route) => buildCompareCategoriesRailHtml(getActiveCategoryForCompareRoute(route)),
  });

  injectHubRail($body, page.route, {
    prefix: "/blog/",
    // /blog/ hub itself is still snapshot-rendered via injectBlogArticleGrid,
    // which produces its own rail; only single blog posts flow through here.
    isNativeHubRoute: (route) => route === "/blog/",
    buildRail: (route) => buildBlogTopicsRailHtml({
      hrefPrefix: "/blog/",
      activeTopicId: getBlogTopicForRoute(route),
    }),
  });

  injectHubRail($body, page.route, {
    prefix: "/compatibility/",
    // /compatibility/ itself is a native .astro hub
    // (src/pages/compatibility/index.astro); only single vendor pages
    // /compatibility/{slug}-hotel-key-cards/ flow through here.
    isNativeHubRoute: (route) => route === "/compatibility/",
    buildRail: (route) => buildCompatibilityRailHtml(getActiveCategoryForCompatibilityRoute(route)),
  });

  clarifyBuyerFacingCopy($body);
  normalizeGlobalInquiryEntry($body, page);
  // Legacy injectIndustriesMenu() removed — primary-menu Industries/Solutions/Resources
  // dropdowns are now fully provided by injectCustomNav() in render-snapshot.ts
  // (driven by menu-structure.ts). Re-enabling this here produced a DUPLICATE
  // "Industries" item beside the new mega-menu.
  refreshNormalizedImageContext($body, page.route, context);
  applyImageAccessibility($body, context);
}

export function normalizeCoreBody($body: CheerioAPI, page: SnapshotPage, context: PageContext): void {
  $body(".codex-core-support").remove();
  $body(".codex-growth-hub").remove();
  $body(".codex-contact-form-brief").remove();

  // DS-15 Phase 6 #3 — Run Kadence-layer a11y fixes on every page.
  // Empty overlay links + testimonial heading-order ship across
  // home + about + 17 industry pages via WP block markup in data
  // fixtures, so the pass is unconditional.
  enhanceKadenceA11y($body);

  if (context.kind === "home") {
    enhanceHomeHero($body);
  }

  // /blog/ is now rendered as a native .astro hub (src/pages/blog/index.astro)
  // and is in NATIVE_HUB_ROUTES — this branch is unreachable. Kept as dead
  // code for now (alongside injectBlogArticleGrid in src/lib/seo/blog-body.ts)
  // until the next cleanup pass; removing it requires also dropping the
  // export and any test fixtures still referencing it. Per-post pages
  // (/blog/{slug}/) still flow through `normalizeBlogArchiveCards` in the
  // `else if` branch below — that path is live.
  if (context.kind === "blog" && page.route === "/blog/") {
    $body(".content-wrap").remove();
    $body(".entry-content").remove();
    $body(".archive-posts").remove();
    $body(".kadence-posts").remove();
    injectBlogArticleGrid($body, page);
  } else if (context.kind === "blog") {
    normalizeBlogArchiveCards($body);
  }

  if (page.route === "/about/") {
    enhanceAboutPage($body);
  }

  if (page.route === "/faq/") {
    enhanceFaqPage($body);
  }

  if (context.kind === "contact" && page.route === "/contact/") {
    enhancePrimaryContactPage($body);
    injectConversionBlocks($body, page, "contact", {
      canonicalUrl: context.canonicalUrl,
      contentTitle: context.contentTitle,
      description: context.description,
    });
  }

  const supportHtml = "";
  // P1.14: when the page already rendered through the editorial pipeline
  // (mergeEditorialPages set codex-editorial-page on <article>), the home
  // and blog snapshot-era injections (growth hub, trust bar, quote brief,
  // industry selector) become duplicates that visually break the page.
  // The editorial render already provides hero + CTA + trust signals via
  // EditorialPage.astro / renderEditorialMain. Skip the snapshot-era
  // injections when an editorial body is detected.
  const isEditorialBody = $body(".codex-editorial-page").length > 0;
  const trustBarHtml = context.kind === "home" && !isEditorialBody ? renderTrustBar() : "";
  // P0-N2 (2026-05-13): home resource trio surfaces the P0 entry pages
  // (Case Studies / Sample Pack / Compare Library) right under the hero,
  // before the existing industry selector. Without this strip the three
  // pages are reachable only from the nav, not from the homepage flow.
  const resourceTrioHtml = context.kind === "home" && !isEditorialBody ? renderHomeResourceTrio() : "";
  const growthHtml =
    context.kind === "home" && !isEditorialBody
      ? resourceTrioHtml + renderHomeGrowthHub() + trustBarHtml
      : context.kind === "blog" && page.route !== "/blog/" && !isEditorialBody
        ? renderBlogGrowthHub()
        : "";
  const insertedHtml = [growthHtml, supportHtml].filter(Boolean).join("");
  if (!insertedHtml) {
    return;
  }

  if (context.kind === "home") {
    // P1.14: skip snapshot-era injections when an editorial body has
    // already been rendered (mergeEditorialPages set codex-editorial-page).
    // The editorial render handles hero, CTA, trust signals, sections and
    // resource cards through EditorialPage.astro / renderEditorialMain;
    // re-injecting the WP growth hub / quote brief produces duplicate hero,
    // 5× trust bars and a stray industry selector grid.
    if (isEditorialBody) {
      return;
    }
    const heroBlock = $body(".entry-content > .wp-block-cover, .entry-content > .wp-block-group, .entry-content > *").first();
    if (heroBlock.length) {
      heroBlock.after(insertedHtml);
    }
    // Inject quote brief near the bottom — after the "Easy Process" section or before the last section
    const quoteBriefHtml = renderHomeQuoteBrief();
    const easyProcess = $body(".kt-infobox-textcontent:contains('06.')").closest(".kb-row-layout-wrap");
    if (easyProcess.length) {
      easyProcess.closest(".entry-content > *").after(quoteBriefHtml);
    } else {
      // Fallback: append before the last content block
      const lastBlock = $body(".entry-content > *").last();
      if (lastBlock.length) {
        lastBlock.before(quoteBriefHtml);
      }
    }
    return;
  }

  if (context.kind === "blog") {
    const posts = $body("article, .wp-block-query, .kadence-posts, .archive-posts").first();
    if (posts.length) {
      posts.before(insertedHtml);
      return;
    }
  }

  if (context.kind === "contact" && page.route === "/contact/") {
    const formWrap = $body(".wp-block-kadence-form").first();
    const formBrief = formWrap.prev(".codex-contact-form-brief");

    if (formBrief.length) {
      formBrief.before(insertedHtml);
      return;
    }

    if (formWrap.length) {
      formWrap.before(insertedHtml);
      return;
    }
  }

  const entryContent = $body(".entry-content").first();
  if (entryContent.length) {
    entryContent.prepend(insertedHtml);
    return;
  }

  const main = $body(".site-main, main").first();
  if (main.length) {
    main.prepend(insertedHtml);
    return;
  }

  $body("body").prepend(insertedHtml);
}

export function enhanceHomeHero($body: CheerioAPI): void {
  const heroHeading = $body(".entry-content .wp-block-cover h1").first();

  if (!heroHeading.length) {
    return;
  }

  // P0 T1 (2026-05-13, refined 2026-05-15): the homepage hero carries the
  // primary keyword surface for search / LLM retrieval. Original P0 stuffed
  // the full product-family list into a single multi-line H1 + long lead
  // paragraph ("Two Shenzhen factories. 18+ years...one business day."),
  // which rendered as 6-line H1 + dense 4-line paragraph — visually
  // overwhelming per user feedback 2026-05-15 (字太密了).
  //
  // Refined hierarchy (preserves all keywords across H1 + subtitle):
  //   H1:       "Custom RFID & NFC Manufacturer in China"
  //   subtitle: "— Cards, Tags, Labels, Wristbands, Keyfobs & Readers
  //              for OEM/ODM Buyers"
  // The dense description paragraph is dropped — its facts (Two Shenzhen
  // factories, 18+ years, ISO 9001, OEM/ODM samples) all live in the
  // Capabilities stat grid + About blocks below, so no keyword surface is
  // lost. The subtitle is tagged with `codex-hero-subtitle` so CSS can
  // render it bigger than body copy but smaller than H1.
  heroHeading.text("Custom RFID & NFC Manufacturer in China");

  const heroLead = heroHeading
    .nextAll("p")
    .filter((_, element) => cleanText($body(element).text()).length > 0)
    .first();

  if (heroLead.length) {
    heroLead.text("— Cards, Tags, Labels, Wristbands, Keyfobs & Readers for OEM/ODM Buyers");
    heroLead.addClass("codex-hero-subtitle");
  }

  heroHeading
    .nextAll("p")
    .filter((_, element) => cleanText($body(element).text()).length === 0)
    .remove();
}

export function enhanceAboutPage($body: CheerioAPI): void {
  const entryContent = $body(".entry-content").first();
  const aboutHeading = $body("h2").filter((_, element) => cleanText($body(element).text()) === "About Us").first();

  if (!$body("h1").length && entryContent.length) {
    entryContent.prepend(
      `<div class="codex-about-header">
        <h1>About Proud Tek</h1>
        <p>Proud Tek is a Shenzhen-based RFID and NFC manufacturer supporting custom cards, tags, labels, readers, keyfobs and wristbands for global B2B sourcing programs.</p>
      </div>`,
    );
  }

  if (aboutHeading.length) {
    aboutHeading.text("Company overview");
  }

  $body("h2")
    .filter((_, element) => /We look forward to creating something for you to treasure\./i.test(cleanText($body(element).text())))
    .first()
    .text("Manufacturing support for custom RFID programs");

  $body("h2")
    .filter((_, element) => /What our awesome customers think/i.test(cleanText($body(element).text())))
    .first()
    .text("Customer feedback");

  $body("h2")
    .filter((_, element) => /We cooperate with popular brands all over the world/i.test(cleanText($body(element).text())))
    .first()
    .text("Global customer base");

  // DS-15 Phase 6 #5 — strip placeholder social link block.
  // Lighthouse `crawlable-anchors` flagged 3 anchors with href="https://#"
  // (Kadence social-link-block scaffolding that was never wired to real
  // URLs). They contribute nothing to UX or SEO and tank the SEO score
  // by 8 points. Removing the whole <ul class="wp-block-social-links">
  // — anchor + parent + sibling icons — fixes the audit. Safe because
  // /about/ is the only page that ships this block in any data fixture.
  $body("ul.wp-block-social-links").remove();
}

/**
 * DS-15 Phase 6 #3 — Kadence layer a11y fixes.
 *
 * Lighthouse baseline (2026-04-27) flagged the WP/Kadence adapter layer
 * for: empty `.kb-section-link-overlay` links (link-name audit), and
 * `<h5 class="kt-testimonial-title">` after section `<h4>` (heading-order
 * audit). Color-contrast violations are fixed in codex.css; this function
 * handles the structural HTML transforms that need a cheerio pass.
 *
 * Runs on every page in normalizeCoreBody — the offending markup ships
 * via JSON data fixtures across home + about + 17+ industry pages.
 */
export function enhanceKadenceA11y($body: CheerioAPI): void {
  // (1) link-name — inject aria-label on empty overlay links from the
  //     nearest heading inside the same Kadence column.
  $body("a.kb-section-link-overlay").each((_, element) => {
    const $link = $body(element);
    if ($link.attr("aria-label")) return;
    if (cleanText($link.text()).length > 0) return; // already has visible text

    let label = "";
    const $col = $link.closest(".wp-block-kadence-column, .kt-inside-inner-col, .kb-row-layout-wrap");
    if ($col.length) {
      const heading = $col.find("h1, h2, h3, h4, h5, h6").first();
      if (heading.length) label = cleanText(heading.text());
    }
    if (!label) {
      // Fallback to href slug as a last-resort label.
      const href = $link.attr("href") ?? "";
      const slug = href.split("/").filter(Boolean).pop() ?? "";
      label = slug.replace(/-/g, " ").trim();
    }
    if (label) $link.attr("aria-label", label);
  });

  // (2) heading-order — demote <h5 class="kt-testimonial-title"> to <p>.
  //     Testimonial titles aren't sectioning headings; the visual weight
  //     is preserved by p.kt-testimonial-title styling in codex.css.
  $body("h5.kt-testimonial-title").each((_, element) => {
    const $el = $body(element);
    const html = $el.html() ?? "";
    const className = $el.attr("class") ?? "";
    $el.replaceWith(`<p class="${className}">${html}</p>`);
  });

  // (3) heading-order iter-2 — demote Kadence advanced-heading h6
  //     blocks to <p>. These are decorative/section-label uses on
  //     /about/ that emit as <h6> after section <h2> (skipping h3/h4/h5)
  //     and trigger Lighthouse heading-order. Same pattern as testimonial:
  //     keep class so existing CSS still applies, drop the heading
  //     semantic so the audit ignores it.
  $body("h6.wp-block-kadence-advancedheading, h6[class*='kt-adv-heading']").each((_, element) => {
    const $el = $body(element);
    const html = $el.html() ?? "";
    const className = $el.attr("class") ?? "";
    $el.replaceWith(`<p class="${className}">${html}</p>`);
  });

  // (4) heading-order iter-3 — demote Kadence "stat pill" H2s on the
  //     home page Capabilities grid ("18+ Years of Industry Experience",
  //     "2 Self-owned Factories", etc.) to <p>. These render at 17px /
  //     700 — visually a label, not a section heading — but Kadence
  //     emits them as <h2>, which puts H2 17px AFTER H2 38px section
  //     headings and skips H3/H4 levels. The result is a broken
  //     heading outline that hurts SEO + a11y.
  //
  //     Filter is conservative: must be wp-block-heading H2 with
  //     short numeric-prefix text (digit + optional +, space, then
  //     a couple words). Nothing else on the site uses this exact
  //     pattern as a heading. Keep class so existing CSS still
  //     applies; drop the heading semantic.
  $body("h2.wp-block-heading").each((_, element) => {
    const $el = $body(element);
    const text = ($el.text() ?? "").trim();
    if (text.length === 0 || text.length > 60) return;
    if (!/^\d+\+?\s+\S/.test(text)) return;
    const html = $el.html() ?? "";
    const className = $el.attr("class") ?? "";
    $el.replaceWith(`<p class="${className}">${html}</p>`);
  });
}

export function enhanceFaqPage($body: CheerioAPI): void {
  const faqHeading = $body("h2").filter((_, element) => cleanText($body(element).text()) === "FAQ Help Center").first();

  if (faqHeading.length) {
    faqHeading.replaceWith("<h1>RFID FAQ for Buyers</h1>");
    const intro = $body("h1").filter((_, element) => cleanText($body(element).text()) === "RFID FAQ for Buyers").first().nextAll("p").first();

    if (intro.length) {
      intro.text("Use this page to answer compatibility, sample, ordering, and shipping questions before you request pricing or samples.");
    }
  } else if (!$body("h1").length) {
    const entryContent = $body(".entry-content").first();
    entryContent.prepend("<h1>RFID FAQ for Buyers</h1>");
  }

  $body("h2")
    .filter((_, element) => cleanText($body(element).text()) === "Sample & order")
    .first()
    .text("Samples and orders");

  $body("h2")
    .filter((_, element) => cleanText($body(element).text()) === "Shipping & Recent Orders")
    .first()
    .text("Shipping and order handling");

  // Phase 9 — Migrate Kadence accordion → .codex-disclosure pattern.
  // Each `.wp-block-kadence-accordion` becomes a <div class="codex-faq">
  // with native <details>/<summary> children styled as codex-disclosure.
  // Eliminates the 13 KB kt-accordion.min.js dependency (stripped by
  // render-snapshot's UNUSED_HEAD_ASSET_PATTERNS) and unifies accordion
  // semantics with DS-12 #4A. Browser-native expand/collapse means
  // keyboard + screen-reader behavior comes free; no JS handler needed.
  $body(".wp-block-kadence-accordion").each((_, accordion) => {
    const $accordion = $body(accordion);
    const items: string[] = [];

    $accordion.find(".wp-block-kadence-pane").each((_, pane) => {
      const $pane = $body(pane);
      const question = cleanText($pane.find(".kt-blocks-accordion-title").first().text());
      const $answerInner = $pane.find(".kt-accordion-panel-inner").first();
      const answerHtml = ($answerInner.html() ?? "").trim();

      if (!question || !answerHtml) return;

      items.push(
        `<details class="codex-disclosure codex-faq__item">
          <summary class="codex-disclosure__summary">
            <span class="codex-disclosure__label">${escapeXml(question)}</span>
          </summary>
          <div class="codex-disclosure__body">${answerHtml}</div>
        </details>`,
      );
    });

    if (items.length > 0) {
      $accordion.replaceWith(`<div class="codex-faq">${items.join("\n")}</div>`);
    }
  });
}

// Blog-specific hero images (Unsplash, free commercial use)

export function enhancePrimaryContactPage($body: CheerioAPI): void {
  const heroHeading = $body("h2").filter((_, element) => $body(element).text().trim() === "Contact Us").first();
  if (heroHeading.length) {
    heroHeading.replaceWith("<h1>Contact Proud Tek</h1>");
    const heroSubheading = $body("h1").filter((_, element) => cleanText($body(element).text()) === "Contact Proud Tek").first().nextAll("p").first();
    if (heroSubheading.length) {
      heroSubheading.text("Share your RFID project details for samples, pricing, compatibility checks, or custom production support.");
    }
  }

  const helperHeading = $body("h2").filter((_, element) => /Have a question\?/i.test($body(element).text())).first();
  if (helperHeading.length) {
    helperHeading.text("Choose the best contact path");
    const helperSubheading = helperHeading.nextAll("p").first();
    if (helperSubheading.length) {
      helperSubheading.text("Use a specialist path if the application is already clear. Otherwise, use the general form with product type, environment, quantity, and timing.");
    }
  }

  const formHeading = $body("h2").filter((_, element) => /Send a Message/i.test($body(element).text())).first();
  if (formHeading.length) {
    formHeading.text("Send your project details");
    const formSubheading = formHeading.nextAll("p").first();
    if (formSubheading.length) {
      formSubheading.text("Use the form for samples, pricing, customization, or compatibility checks. A short structured message usually gets the fastest reply.");
    }
  }

  $body("script").each((_, element) => {
    const content = $body(element).html() ?? "";

    if (content.includes("kb_google_map") && (content.includes("37.8201") || content.includes("-122.4781"))) {
      $body(element).remove();
    }
  });

  const form = $body(".wp-block-kadence-form .kb-form").first();
  if (!form.length) {
    return;
  }

  // Point the form to Formspree for submission
  form.attr("action", "https://formspree.io/f/xlgorlog");
  form.attr("method", "POST");

  const formWrap = form.closest(".wp-block-kadence-form");
  formWrap.attr("id", "contact-rfq-form");

  const nameInput = form.find('input[id*="_0"]').first();
  const emailInput = form.find('input[type="email"]').first();
  const phoneInput = form.find('input[id*="_2"]').first();
  const subjectInput = form.find('input[id*="_3"]').first();
  const messageInput = form.find("textarea").first();
  const submitButton = form.find("button").first();

  if (nameInput.length) {
    nameInput.attr("placeholder", "Your name / company");
    nameInput.attr("name", "name");
  }

  if (emailInput.length) {
    emailInput.attr("placeholder", "you@company.com");
    emailInput.attr("name", "email");
  }

  if (phoneInput.length) {
    phoneInput.attr("placeholder", "+1 555 123 4567");
    phoneInput.attr("name", "phone");
  }

  if (subjectInput.length) {
    subjectInput.attr("placeholder", "Example: Hotel RFID card sample request - Saflok - 5,000 pcs");
    subjectInput.attr("name", "_subject");
  }

  if (messageInput.length) {
    messageInput.attr(
      "placeholder",
      [
        "Application / use case:",
        "Product format:",
        "Chip / lock / reader / phone environment:",
        "Quantity / sample target:",
        "Artwork / encoding / numbering / redirect needs:",
        "Target date:",
        "Questions to confirm:",
      ].join("\n"),
    );
    messageInput.attr("name", "message");
  }

  if (submitButton.length) {
    submitButton.text("Send Inquiry");
  }

  // DS-11 #5b — Bring the Kadence form up to the same a11y bar as the
  // editorial inline RFQ. Kadence ships data-required="yes" but no native
  // HTML5 required, no aria-required, no error containers, and no
  // aria-describedby. We add all four so screen readers + the inline
  // form-validation JS in BaseLayout can both work.
  form.attr("novalidate", "true");
  form.attr("data-codex-rfq", "");
  // Each <input> / <textarea> with data-required gets HTML5 required +
  // aria-required + an error sibling tagged role="alert" aria-live=polite.
  form.find('[data-required="yes"]').each((_, element) => {
    const $el = form.find(element);
    const id = $el.attr("id");
    if (!id) return;
    $el.attr("required", "");
    $el.attr("aria-required", "true");
    const errId = `${id}-error`;
    const hintId = `${id}-hint`;
    // Build aria-describedby: existing values + hint + err.
    const existing = ($el.attr("aria-describedby") || "").split(/\s+/).filter(Boolean);
    const merged = Array.from(new Set([...existing, hintId, errId])).join(" ");
    $el.attr("aria-describedby", merged);
    // Insert hint + error immediately after the field's wrapper. Kadence wraps
    // each field in a .kadence-blocks-form-field <div>, so we close the field
    // by appending these spans inside that wrapper.
    const fieldWrap = $el.closest(".kadence-blocks-form-field");
    if (fieldWrap.length) {
      // Insert a hint only if a label exists and we don't already have one.
      if (!fieldWrap.find(`#${hintId}`).length) {
        const labelText = ($el.attr("data-label") || "").toLowerCase();
        const hintCopy =
          labelText.includes("email") ? "We'll only use this to reply to your inquiry."
          : labelText.includes("message") ? "Include application, quantity, environment and timing for the fastest reply."
          : "This field is required.";
        fieldWrap.append(`<span id="${hintId}" class="codex-inline-rfq-hint">${hintCopy}</span>`);
      }
      if (!fieldWrap.find(`#${errId}`).length) {
        fieldWrap.append(`<span id="${errId}" class="codex-inline-rfq-error" role="alert" aria-live="polite"></span>`);
      }
    }
  });
}


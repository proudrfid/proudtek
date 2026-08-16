/**
 * Cheerio body mutations that normalize inquiry entry points.
 *
 * Walks the WP-imported page DOM and rewrites the various legacy
 * inquiry / contact / get-a-quote links and buttons so they all land
 * on the canonical Proud Tek inquiry routes (footer, mobile, hero).
 *
 *   - normalizeGlobalInquiryEntry  (top-level dispatcher)
 *   - rewriteGlobalInquiryLinks    (header/menu inquiry links)
 *   - rewriteFooterInquirySection  (footer inquiry block)
 *   - normalizeHomeHeroInquiryButtons (home hero buttons)
 *   - ensureMobileInquiryEntry     (mobile-specific append)
 *
 * Extracted from seo.ts during the P4c split (2026-05-08).
 */
import type { CheerioAPI } from "cheerio";

import type { SnapshotPage } from "../site-data";

import { cleanText } from "./utils";

export function normalizeGlobalInquiryEntry($body: CheerioAPI, page: SnapshotPage): void {
  ensureMobileInquiryEntry($body, page);
  rewriteGlobalInquiryLinks($body);
  rewriteFooterInquirySection($body);

  if (page.route === "/") {
    normalizeHomeHeroInquiryButtons($body);
  }
}

export function ensureMobileInquiryEntry($body: CheerioAPI, page: SnapshotPage): void {
  const mobileMenu = $body("#mobile-menu").first();

  if (!mobileMenu.length || mobileMenu.find('a[href="/rfq/"], a[href="/contact/"], a[href="https://proudtek.com/rfq/"], a[href="https://proudtek.com/contact/"]').length) {
    return;
  }

  const currentClass =
    page.route === "/rfq/" || page.route.startsWith("/rfq/")
      ? " current-menu-item current_page_item"
      : "";

  mobileMenu.append(
    `<li class="menu-item menu-item-type-post_type menu-item-object-page codex-nav-rfq-item${currentClass}"><a href="/rfq/" class="codex-nav-rfq-link" title="Request a quote from Proud Tek" aria-label="Request a quote from Proud Tek">Request Quote</a></li>`,
  );
}

export function rewriteGlobalInquiryLinks($body: CheerioAPI): void {
  const navSelectors = [
    'nav#site-navigation a[href="/contact/"]',
    'nav#site-navigation a[href="https://proudtek.com/contact/"]',
    'nav#mobile-site-navigation a[href="/contact/"]',
    'nav#mobile-site-navigation a[href="https://proudtek.com/contact/"]',
    'nav#footer-navigation a[href="/contact/"]',
    'nav#footer-navigation a[href="https://proudtek.com/contact/"]',
  ].join(", ");

  $body(navSelectors).each((_, element) => {
    const link = $body(element);
    const label = cleanText(link.text());

    if (/^contact$/i.test(label)) {
      link.text("Request Quote");
    }

    link.attr("href", "/rfq/");
    link.attr("title", "Request a quote from Proud Tek");
    link.attr("aria-label", "Request a quote from Proud Tek");
    link.addClass("codex-nav-rfq-link");
    link.parent("li").addClass("codex-nav-rfq-item");
  });

  $body('a[href="/contact/"], a[href="https://proudtek.com/contact/"]').each((_, element) => {
    const link = $body(element);
    const label = cleanText(link.text());

    if (/^contact proud tek$/i.test(label)) {
      link.text("Request Quote from Proud Tek");
      link.attr("title", "Request Quote from Proud Tek");
    }
  });
}

export function rewriteFooterInquirySection($body: CheerioAPI): void {
  $body("footer p, footer h2, footer h3, footer h4").each((_, element) => {
    const block = $body(element);
    const rawText = block.text();
    const label = cleanText(rawText);

    if (label === "Contact Us") {
      block.text("Quote & Contact");
      return;
    }

    if (/^Emai:/i.test(label)) {
      block.text(rawText.replace(/^Emai:/i, "Email:"));
    }
  });

  const footerInfo = $body("footer .site-footer-bottom-section-3 .site-info-inner").first();
  if (!footerInfo.length || footerInfo.find(".codex-footer-rfq-entry").length) {
    return;
  }

  const headingWidget = footerInfo
    .find("section.widget")
    .filter((_, element) => /Quote & Contact|RFQ & Contact|Contact Us/i.test(cleanText($body(element).text())))
    .first();
  const rfqHtml = `<section class="widget widget_block codex-footer-rfq-entry"><p><a class="codex-footer-rfq-link" href="/rfq/">Request a quote</a></p></section>`;

  if (headingWidget.length) {
    headingWidget.after(rfqHtml);
    return;
  }

  footerInfo.prepend(rfqHtml);
}

/* ── Industries mega-menu injection (REMOVED) ──────────────────────────
 * This legacy injection path has been replaced by injectCustomNav() in
 * render-snapshot.ts, which is driven by menu-structure.ts and handles
 * Industries/Solutions/Resources as a unified mega-menu. Keeping the old
 * injector here caused a DUPLICATE "Industries" top-level item on every
 * page (the legacy simple dropdown plus the new mega-menu item).
 * INDUSTRIES_MENU_GROUPS + injectIndustriesMenu() were removed intentionally.
 * ──────────────────────────────────────────────────────────────────── */

export function normalizeHomeHeroInquiryButtons($body: CheerioAPI): void {
  $body('.wp-block-kadence-advancedbtn a[href="/contact/"], .wp-block-kadence-advancedbtn a[href="https://proudtek.com/contact/"]')
    .each((_, element) => {
      const button = $body(element);
      const label = cleanText(button.text()).toLowerCase();
      const innerText = button.find(".kt-btn-inner-text").first();

      if (/get a free quote/.test(label)) {
        if (innerText.length) {
          innerText.text("Request Quote");
        } else {
          button.text("Request Quote");
        }

        button.attr("href", "/rfq/");
        return;
      }

      if (/request samples/.test(label)) {
        if (innerText.length) {
          innerText.text("Request Samples");
        } else {
          button.text("Request Samples");
        }

        button.attr("href", "/sample-pack/");
      }
    });
}


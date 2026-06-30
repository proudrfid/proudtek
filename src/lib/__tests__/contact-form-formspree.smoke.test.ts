/**
 * Regression guard for the dead /contact/ form (fixed 2026-06-09).
 *
 * Runs the full SnapshotLayout pipeline on the real /contact/ fixture:
 * prepareSnapshot (redesignContactPage re-parents form.kb-form into
 * .codex-contact__form-card, destroying the .wp-block-kadence-form wrapper)
 * → buildPageSeo (enhancePrimaryContactPage). Before the fix the enhancer's
 * selector only matched the legacy wrapper, silently early-returned, and the
 * form shipped with action="" — a native POST to a static route (405, lead
 * lost). These assertions pin the Formspree rewrite to the REDESIGNED
 * structure so a future re-ordering or markup change can't silently kill
 * the primary lead form again.
 */
import { describe, expect, it } from "vitest";
import { load } from "cheerio";

import contactPage from "../../data/pages/contact.json";
import { prepareSnapshot } from "../render-snapshot";
import { buildPageSeo } from "../seo";
import type { SnapshotPage } from "../site-data";

describe("contact form Formspree wiring (post-redesign)", () => {
  const page = contactPage as unknown as SnapshotPage;
  const snapshot = prepareSnapshot(page);
  const seo = buildPageSeo({
    ...page,
    htmlAttrs: snapshot.htmlAttrs,
    bodyAttrs: snapshot.bodyAttrs,
    headHtml: snapshot.headHtml,
    bodyHtml: snapshot.bodyHtml,
  });
  const $ = load(seo.bodyHtml);
  const form = $("form.kb-form").first();

  it("finds the re-parented form inside the redesigned card", () => {
    expect(form.length).toBe(1);
    expect(form.closest(".codex-contact__form-card").length).toBe(1);
  });

  it("points the form at Formspree", () => {
    expect(form.attr("action")).toBe("https://formspree.io/f/xlgorlog");
    expect((form.attr("method") ?? "").toUpperCase()).toBe("POST");
  });

  it("keeps the #contact-rfq-form anchor the homepage links to", () => {
    expect($("#contact-rfq-form").length).toBe(1);
  });

  it("opts in to the BaseLayout validation/analytics JS", () => {
    expect(form.attr("data-codex-rfq")).toBeDefined();
    expect(form.attr("novalidate")).toBeDefined();
  });

  it("renames fields to Formspree-friendly names matching the visible labels", () => {
    expect(form.find('[name="name"]').length).toBe(1);
    expect(form.find('[name="email"]').length).toBe(1);
    expect(form.find('[name="country"]').length).toBe(1); // label: Country (not phone)
    expect(form.find('[name="quantity"]').length).toBe(1); // label: Estimated quantity (not _subject)
    expect(form.find('textarea[name="message"]').length).toBe(1);
    expect(form.find('[name^="kb_field_"]').length).toBe(0);
  });

  it("injects a hidden _subject and swaps the honeypot to _gotcha", () => {
    expect(form.find('input[name="_subject"]').attr("type")).toBe("hidden");
    expect(form.find('input[name="_gotcha"]').length).toBe(1);
    expect(form.find('[name="_kb_verify_email"]').length).toBe(0);
  });

  it("drops the WP-era AJAX router fields", () => {
    expect(form.find('[name="_kb_form_id"], [name="_kb_form_post_id"], [name="action"]').length).toBe(0);
  });
});

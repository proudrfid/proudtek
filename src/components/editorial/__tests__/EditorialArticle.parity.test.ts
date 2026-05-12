/**
 * End-to-end parity — EditorialArticle.astro ↔ renderEditorialMain.
 *
 * Stage 2 finale. This is the proof that the entire shadow component tree
 * produces byte-equivalent (after normalization) HTML to the TS template-
 * literal pipeline for every fixture covered by the integration snapshot
 * test. When all 5 cases pass, Stage 3 cutover is engineering-only: either
 * (a) renderEditorialMain delegates to container.renderToString of this
 * component (once Container API is GA), or (b) page routes flip behind a
 * flag from `<Fragment set:html>` to direct `<EditorialArticle>` rendering.
 *
 * Determinism: fixtures are loaded from src/content/editorial/*.json with
 * publishedAt/modifiedAt pinned (matches the existing
 * editorial-pages-integration.snapshot.test.ts strategy).
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { experimental_AstroContainer as AstroContainer } from "astro/container";
import * as cheerio from "cheerio";
import EditorialArticle from "../EditorialArticle.astro";
import { __TEST__ } from "../../../lib/editorial-pages";
import { normalizeHtml } from "./_parity-helpers";
import type { EditorialDefinition } from "../../../lib/editorial-types";
import {
  injectContextualLinks,
  resolveArticleInquiryAction,
} from "../../../lib/seo/normalize-body";
import { PAGE_IMAGE_OVERRIDES, SITE_ORIGIN } from "../../../lib/seo-content";

/**
 * Apply the cheerio post-process the legacy `normalize-body.ts` runs against
 * `renderEditorialMain` output BEFORE the page is served. The shadow
 * EditorialArticle path (Stage 3 sprint 1) now applies the equivalent
 * transforms at component-render time, so to preserve byte parity the test
 * must run the legacy cheerio post-process on the reference output.
 *
 * Mirrors three mutations from normalize-body.ts:
 *   1. /contact/ a[href] rewrite      → resolveArticleInquiryAction
 *   2. PAGE_IMAGE_OVERRIDES alt patch
 *   3. injectContextualLinks (max 3 keyword→link injections per page)
 *
 * Other mutations (renderArticleSupportBlock, clarifyBuyerFacingCopy, etc.)
 * are NOT applied — sprint 2 will retrofit them into the shadow path and
 * this helper will grow accordingly.
 */
function applyLegacyArticlePostProcess(html: string, definition: EditorialDefinition): string {
  const $ = cheerio.load(html, { decodeEntities: false }, false);
  const entryContent = $("article .entry-content, .entry-content.single-content, .entry-content").first();

  // 1. /contact/ rewrite
  const articleInquiry = resolveArticleInquiryAction(definition.route, definition.title);
  entryContent
    .find('a[href="/contact/"], a[href="https://proudtek.com/contact/"]')
    .each((_, el) => {
      $(el).attr("href", articleInquiry.href);
    });

  // 2. PAGE_IMAGE_OVERRIDES alt rewrite
  const imageOverride = PAGE_IMAGE_OVERRIDES[definition.route];
  if (imageOverride) {
    const absUrl = `${SITE_ORIGIN}${imageOverride.url}`;
    $(`img[src="${imageOverride.url}"], img[src="${absUrl}"]`).attr("alt", imageOverride.alt);
  }

  // 3. Contextual link injection
  injectContextualLinks($, entryContent, definition.route);

  return $.html();
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_ROOT = resolve(__dirname, "../../../content/editorial");

function loadDefinition(relativePath: string): EditorialDefinition {
  const raw = JSON.parse(readFileSync(resolve(CONTENT_ROOT, relativePath), "utf8")) as EditorialDefinition;
  return {
    ...raw,
    publishedAt: raw.publishedAt ?? "2026-01-15T00:00:00.000Z",
    modifiedAt: raw.modifiedAt ?? "2026-05-01T00:00:00.000Z",
  };
}

async function renderArticleAstro(definition: EditorialDefinition): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(EditorialArticle, {
    props: { definition, illustration: null },
  });
}

// Same fixtures used by editorial-pages-integration.snapshot.test.ts — one
// per major route group. End-to-end parity here implies the existing
// integration snapshots remain valid for both render paths.
const FIXTURES = [
  ["lp", "lp/rfid-tag-wholesale.json"],
  ["industries", "industries/luxury-brands.json"],
  ["compare", "compare/google-review-nfc-card-vs-nfc-sticker.json"],
  ["guides", "guides/icode-slix-chip-encyclopedia.json"],
  ["blog", "blog/case-study-restaurant-group-nfc-review-cards-google-reviews-320-percent.json"],
] as const;

describe("EditorialArticle.astro ↔ renderEditorialMain end-to-end parity", () => {
  it.each(FIXTURES)("%s group: %s", async (_group, path) => {
    const definition = loadDefinition(path);
    const tsHtml = applyLegacyArticlePostProcess(
      __TEST__.renderEditorialMain(definition, null),
      definition,
    );
    const astroHtml = await renderArticleAstro(definition);
    expect(normalizeHtml(astroHtml)).toBe(normalizeHtml(tsHtml));
  });
});

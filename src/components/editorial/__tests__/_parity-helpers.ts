/**
 * Helpers for Stage 2 parity tests.
 *
 * Stage 2 builds shadow .astro components that produce the same HTML as the
 * editorial-pages.ts template-literal renderers. Parity is asserted by
 * rendering both sides for the same fixture and comparing strings.
 *
 * Two sources of cosmetic difference need to be normalized away before
 * comparison, neither of which affects production output:
 *
 *   1. **Astro dev-mode source attributes** — the Astro compiler injects
 *      `data-astro-source-file="..."` and `data-astro-source-loc="..."` on
 *      elements when bundled through vitest's vite pipeline. These don't
 *      appear in a real `astro build` HTML. Strip them.
 *
 *   2. **Whitespace formatting** — Astro typically preserves source-level
 *      indentation between tags; the template-literal renderers in
 *      editorial-pages.ts have their own indentation conventions. The DOM
 *      is identical either way; collapse interior whitespace runs so we're
 *      comparing structure, not formatting.
 *
 * `normalizeHtml()` applies both transforms. Use it on BOTH sides of every
 * parity comparison so the result reflects only meaningful differences.
 */

/** Remove Astro's dev-only source-mapping attributes. */
function stripAstroDebugAttrs(html: string): string {
  return html
    .replace(/\s+data-astro-source-file="[^"]*"/g, "")
    .replace(/\s+data-astro-source-loc="[^"]*"/g, "")
    // Astro's `data-astro-cid-*` scoped-style markers are also dev-only
    // (real builds strip them too if no scoped CSS is present). Drop them.
    .replace(/\s+data-astro-cid-[a-z0-9]+(?:="[^"]*")?/g, "");
}

/** Collapse interior whitespace runs (between tags or in text content). */
function collapseWhitespace(html: string): string {
  return html
    // Whitespace between adjacent tags `>   <` → `><`
    .replace(/>\s+</g, "><")
    // Leading whitespace at start of doc and trailing whitespace at end
    .replace(/^\s+|\s+$/g, "")
    // Tabs / CR / LF → space FIRST so the multi-run collapse below catches
    // both the converted newlines AND any existing space runs in one pass.
    // (Previous order let `[ \t]{2,}` collapse first, then `\n` → ` ` would
    // emit a second space and create stable double-spaces inside multi-line
    // tag attribute lists like `<button type="..."\n  class="...">`.)
    .replace(/[\n\r\t]+/g, " ")
    // Multi-space runs (now includes line-converted spaces) → single space
    .replace(/[ \t]{2,}/g, " ");
}

/**
 * Canonicalize HTML character references.
 *
 * Astro's attribute serializer emits the 4 syntactically-significant ASCII
 * chars (`"`, `&`, `<`, `>`) as numeric entities (`&#34;` etc.); the TS
 * `escapeAttribute` in editorial-types.ts emits them as named entities
 * (`&quot;`, `&amp;`, `&lt;`, `&gt;`). Both produce identical DOM after
 * parsing — browsers, SEO crawlers, and accessibility tools see the same
 * characters — but the byte-level strings differ.
 *
 * Rewrite Astro's numeric form to the TS named form so byte-comparison
 * reflects only structural diffs. Apostrophe is `&#39;` on both sides so
 * it doesn't need touching. Em-dash and other non-ASCII numeric references
 * (`&#x2014;` etc.) are left alone.
 */
function canonicalizeEntities(html: string): string {
  return html
    .replace(/&#34;/g, "&quot;")
    .replace(/&#38;/g, "&amp;")
    .replace(/&#60;/g, "&lt;")
    .replace(/&#62;/g, "&gt;")
    // Apostrophe: TS `escapeHtml` emits `&#39;`; Astro's attribute serializer
    // leaves `'` raw (HTML5 does not require it to be escaped inside double-
    // quoted attribute values). Both parse to the same character. Canonicalize
    // to the un-escaped form because that matches Astro's behavior in body
    // text too — apostrophes in text content survive both pipelines as `'`.
    .replace(/&#39;/g, "'");
}

/**
 * Canonicalize `<` and `>` inside attribute values.
 *
 * HTML5 permits raw `<` and `>` inside double-quoted attribute values — they
 * lose their tag-delimiting meaning between the quotes. The TS `escapeAttribute`
 * helper escapes them anyway (`&lt;` / `&gt;`) for defensive purposes; Astro
 * passes them through. Both forms parse to the same attribute string at the
 * DOM level.
 *
 * Match `="<value>"` boundary regions and convert raw `<` / `>` inside the
 * value to entities to match the TS form. Attribute values cannot contain
 * literal `"` (they use `&quot;` instead), so the boundary regex is unambiguous.
 */
function escapeAttributeAngleBrackets(html: string): string {
  return html.replace(/="([^"]*)"/g, (_match, value) => {
    if (value.indexOf("<") === -1 && value.indexOf(">") === -1) return _match;
    return `="${value.replace(/</g, "&lt;").replace(/>/g, "&gt;")}"`;
  });
}

/**
 * Strip stray whitespace immediately before a closing `>` inside any tag.
 *
 * The TS template literals occasionally leave a residual space when a
 * conditional `${}` placeholder evaluates to empty — e.g.
 *   `<th scope="col" ${index === 0 ? "" : "data-sort-col=...whatever"}>`
 * yields `<th scope="col" >` for index === 0. Astro's serializer emits the
 * equivalent `<th scope="col">` (no extra space). Both produce identical
 * DOM; the space is a serialization artifact, not a semantic difference.
 *
 * Safe because unescaped `>` only appears as a tag terminator in real HTML —
 * authored body text uses `&gt;`. So `[ \t]+>` only matches inside-tag.
 */
function stripPreCloseTagWhitespace(html: string): string {
  return html.replace(/[ \t]+>/g, ">");
}

/**
 * Canonicalize void-element self-close form.
 *
 * HTML5 void elements (`<img>`, `<br>`, `<hr>`, `<input>`, `<meta>`, `<link>`,
 * `<source>`, `<area>`, `<col>`, `<base>`, `<embed>`, `<wbr>`, `<track>`)
 * have no end tag. Two equivalent serializations exist:
 *   1. Explicit self-close:   `<img src="..." />`   ← TS template literals
 *   2. Implicit close:        `<img src="...">`     ← Astro's output
 * Both produce identical DOM. Strip the optional `/` so byte-comparison
 * reflects structural rather than serialization differences.
 */
function stripVoidSelfClose(html: string): string {
  return html.replace(/(<(?:img|br|hr|input|meta|link|source|area|col|base|embed|wbr|track)\b[^>]*?)\s*\/>/gi, "$1>");
}

/**
 * Canonicalize empty SVG-element serialization.
 *
 * SVG shape elements (`<path>`, `<rect>`, `<circle>`, `<line>`, etc.) accept
 * either XML self-close shorthand (`<rect attrs/>` — what TS templates emit)
 * or empty open/close pair (`<rect attrs></rect>` — what Astro emits). Both
 * produce identical SVG DOM nodes. Converge on TS's self-close form so the
 * byte-level comparison reflects structural rather than serialization
 * differences.
 *
 * Element list covers the common SVG primitives. Container elements like
 * `<g>` / `<svg>` / `<defs>` are NOT included because they routinely carry
 * children; converting `<g></g>` to `<g/>` only matters if it's empty, in
 * which case the empty-content match captures it the same way.
 */
function canonicalizeSvgEmptyElements(html: string): string {
  return html.replace(
    /<(path|rect|circle|line|polyline|polygon|ellipse|use|stop)([^<>]*)><\/\1>/gi,
    "<$1$2/>",
  );
}

/**
 * Strip build-time ISO 8601 timestamps wherever they appear in the
 * document so two builds separated by a few minutes still byte-compare
 * equal. Mirrors the same rule in `scripts/stage3-diff.mjs`.
 *
 * The match requires a millisecond fraction (`\.\d+Z`) — the signature
 * of `new Date().toISOString()` at build time. Deliberately-pinned
 * fixture timestamps don't include fractional seconds, so they pass
 * through untouched. Catches `<time datetime="...">`, meta tag
 * `article:published_time` / `article:modified_time`, and JSON-LD
 * `datePublished` / `dateModified` / `lastReviewed` fields.
 */
function canonicalizeBuildTimestamps(html: string): string {
  return html.replace(
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z/g,
    "<BUILD_TIMESTAMP>",
  );
}

/**
 * HTML5 boolean / bare-attr serialization: `attr` (Astro shorthand) ↔
 * `attr=""` (cheerio's explicit-empty form used by the legacy TS render
 * path that round-trips through cheerio normalize-body). Both parse to the
 * same DOM. Strip `=""` to canonicalize on the shorthand form.
 *
 * Mirrors `canonicalizeBooleanAttributes` in scripts/stage3-diff.mjs (added
 * in task #65, propagated here 2026-05-12 for sprint 1 to cover the
 * cheerio-post-processed legacy reference output in EditorialArticle.parity).
 */
function canonicalizeBooleanAttributes(html: string): string {
  return html.replace(/ ([a-zA-Z][a-zA-Z0-9-]*)=""/g, " $1");
}

/**
 * Decode common named-character references inside text content (between `>`
 * and `<`), leaving attribute values alone.
 *
 * Cheerio's serializer (`$.html()`) decodes a set of named-entity character
 * references to their Unicode codepoint in text nodes because they are
 * valid raw chars there. The shadow render path emits the named entity as
 * authored in the source template. Both forms parse to the same DOM.
 * Canonicalize on the decoded form so byte-comparison reflects only
 * structural diffs.
 *
 *   `&quot;`  →  `"`     (escaped by renderInlineLinks; cheerio decodes)
 *   `&rarr;`  →  `→`     (literal in Astro template; cheerio decodes)
 *
 * Sprint 2 may extend this list as more entities surface in fixtures.
 *
 * Added 2026-05-12 for sprint 1's EditorialArticle parity test where the
 * legacy reference output is round-tripped through cheerio.
 */
function decodeNamedEntitiesInTextContent(html: string): string {
  return html.replace(/>([^<]*)</g, (_match, text) => {
    return `>${text
      .replace(/&quot;/g, '"')
      .replace(/&rarr;/g, "→")}<`;
  });
}

/**
 * Apply the cheerio-side `a[href="/contact/"]` rewrite that the production
 * normalize-body.ts pass runs against legacy `renderEditorialMain` output.
 * Stage 3 sprint 1 retrofitted this rewrite into the shadow components
 * (Trail, DecisionSnapshot, ActionBar secondary actions, etc.), so to
 * preserve byte-for-byte parity we apply the same rewrite to the LEGACY
 * reference output before normalizing.
 *
 * Pure string replacement is sufficient because the legacy renderers emit
 * `/contact/` and `https://proudtek.com/contact/` only as exact-match href
 * attribute values — never as substrings of longer URLs.
 *
 * The `route` + `title` pair determines the destination via
 * `resolveArticleInquiryAction`; both must match what the shadow component
 * sees in its props.
 */
export function rewriteLegacyContactLinks(html: string, routedHref: string): string {
  return html
    .replaceAll('href="/contact/"', `href="${routedHref}"`)
    .replaceAll('href="https://proudtek.com/contact/"', `href="${routedHref}"`);
}

/** Normalize HTML for parity comparison. Apply to BOTH sides. */
export function normalizeHtml(html: string): string {
  return decodeNamedEntitiesInTextContent(
    canonicalizeBooleanAttributes(
      canonicalizeBuildTimestamps(
        escapeAttributeAngleBrackets(
          stripPreCloseTagWhitespace(
            canonicalizeSvgEmptyElements(
              stripVoidSelfClose(
                canonicalizeEntities(
                  collapseWhitespace(
                    stripAstroDebugAttrs(html),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  );
}

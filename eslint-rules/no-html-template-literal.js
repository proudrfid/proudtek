/**
 * editorial-debt/no-html-template-literal
 *
 * Forbids HTML-like content inside template literals — the "string-concat
 * HTML" pattern that editorial-pages.ts already carries. This rule blocks
 * the debt from spreading to new files. The existing renderer in
 * editorial-pages.ts is exempted in eslint.config.js and is instead
 * protected by snapshot tests under src/lib/__tests__/.
 *
 * Heuristic: any TemplateElement.value.raw that contains a likely HTML
 * opening tag (`<word`, optionally followed by attributes, until `>` or
 * end of element). Common false positives — generic types like `<T>` or
 * `<Record<string, ...>>` — are partially excluded by requiring a
 * lowercase tag name and either `>` or whitespace before end.
 *
 * If you genuinely need an inline HTML literal (e.g. an SVG icon string,
 * a fenced code block, a one-off mailto template), add an explicit
 * `// eslint-disable-next-line editorial-debt/no-html-template-literal`
 * — the rule is intentionally noisy so that exceptions are visible.
 */
export default {
  meta: {
    type: "problem",
    docs: {
      description: "Forbid HTML in template literals (path-4 editorial-rendering debt guardrail).",
    },
    schema: [],
    messages: {
      noHtml:
        "[debt:editorial-pages] HTML inside a template literal is forbidden in new code. Use an .astro component, a structured builder, or — if truly necessary — add an explicit eslint-disable. See docs/architecture/editorial-rendering-debt.md.",
    },
  },
  create(context) {
    // Match `<` followed by lowercase ASCII tag name, then either a
    // whitespace, `/`, `>` or end of slice. Excludes generics like `<T>`,
    // `<Map<string, X>>`, and conditional types `T extends infer U ? ...`.
    const HTML_TAG_RE = /<([a-z][a-z0-9]*)\b[^<]*?(?:>|\/>|\son[a-z]+=)/i;

    return {
      TemplateElement(node) {
        const raw = (node.value && node.value.raw) || "";
        if (!raw) return;
        if (!HTML_TAG_RE.test(raw)) return;
        context.report({ node, messageId: "noHtml" });
      },
    };
  },
};

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

import noHtmlTemplateLiteral from "./eslint-rules/no-html-template-literal.js";

/**
 * ESLint flat config (ESLint 10).
 *
 * Path-4 guardrail (see docs/architecture/editorial-rendering-debt.md):
 *  - `editorial-debt/no-html-template-literal` blocks new TypeScript files
 *    from using HTML inside template literals (the "string-concat HTML"
 *    anti-pattern that editorial-pages.ts already carries).
 *  - Existing renderers in src/lib/editorial-pages.ts and the seo render
 *    helpers are exempted to avoid forcing a refactor that the codebase
 *    isn't ready for. They are protected instead by snapshot tests under
 *    src/lib/__tests__/.
 */
export default [
  // Global ignores
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      ".astro/**",
      "reports/**",
      "public/**",
      "scripts/_legacy/**",
      "src/data/**",
      "src/content/**",
    ],
  },

  // Base recommended rules
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Project-wide language options
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: { ...globals.node, ...globals.browser },
    },
  },

  // Path-4 guardrail rule — forbid new HTML-in-template-literal usage
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    plugins: {
      "editorial-debt": {
        rules: {
          "no-html-template-literal": noHtmlTemplateLiteral,
        },
      },
    },
    rules: {
      "editorial-debt/no-html-template-literal": "warn",
      // Loosen a few defaults that are too noisy for our existing TS
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-empty": ["warn", { allowEmptyCatch: true }],
    },
  },

  // Legacy rendering files exempt — protected by snapshot tests instead.
  // Also turn off no-unused-vars: many of these are public helper exports
  // imported across boundaries that the linter can't see (e.g. via Astro
  // virtual modules / dynamic imports).
  //
  // The complete list of files that emit HTML via template literals — the
  // path-3 rewrite scope. See docs/architecture/editorial-rendering-debt.md.
  {
    files: [
      "src/lib/editorial-pages.ts",
      "src/lib/editorial-types.ts",
      "src/lib/utility-pages.ts",
      "src/lib/catalog-pages.ts",
      "src/lib/conversion.ts",
      "src/lib/faq-page.ts",
      "src/lib/icons.ts",
      "src/lib/seo-feeds.ts",
      "src/lib/seo/**/*.ts",
      "src/lib/seo.ts",
      "src/lib/render-snapshot.ts",
      "src/lib/site-data.ts",
    ],
    rules: {
      "editorial-debt/no-html-template-literal": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },

  // Test files — relax some rules
  {
    files: ["src/**/__tests__/**/*.ts", "**/*.test.ts", "**/*.spec.ts"],
    rules: {
      "editorial-debt/no-html-template-literal": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },

  // ESLint custom rule files (CommonJS-ish ESM)
  {
    files: ["eslint-rules/**/*.js"],
    languageOptions: { sourceType: "module" },
    rules: {
      "editorial-debt/no-html-template-literal": "off",
    },
  },
];

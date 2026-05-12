import { getViteConfig } from "astro/config";

/**
 * Vitest config — only runs unit tests under src/**\/__tests__/.
 *
 * Snapshot tests in src/lib/__tests__/ are the editorial-rendering debt
 * safety net. See docs/architecture/editorial-rendering-debt.md for context.
 *
 * Wrapped with Astro's `getViteConfig` so `.astro` files can be imported
 * inside tests — needed for Stage 2 parity tests that render shadow Astro
 * components via experimental_AstroContainer and compare them byte-for-byte
 * against the editorial-pages.ts template-literal renderers.
 */
export default getViteConfig({
  test: {
    include: ["src/**/__tests__/**/*.test.ts"],
    environment: "node",
    coverage: {
      provider: "v8",
      include: ["src/lib/editorial-pages.ts", "src/lib/editorial-types.ts"],
      reporter: ["text", "html"],
      reportsDirectory: "reports/coverage",
    },
  },
  resolve: {
    // Astro virtual modules used by editorial-pages.ts. We stub them in tests.
    alias: {
      "astro:content": new URL("./src/lib/__tests__/stubs/astro-content.ts", import.meta.url).pathname,
    },
  },
});

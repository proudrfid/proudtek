import { getViteConfig } from "astro/config";
import type { ViteUserConfig } from "vitest/config";

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
 *
 * `getViteConfig` types its argument as Vite's `UserConfig` which lacks
 * vitest's `test` field. Casting through `ViteUserConfig` (re-exported by
 * vitest/config with the `test` field merged in) lets TypeScript accept
 * the config object without runtime change.
 */
export default getViteConfig({
  test: {
    include: ["src/**/__tests__/**/*.test.ts"],
    environment: "node",
    /**
     * Registers the path-normalisation snapshot serializer (see
     * src/lib/__tests__/setup/vitest-setup.ts) so committed `.snap`
     * files don't carry the developer's home-directory path verbatim.
     * Without this, Astro's `data-astro-source-file` attributes pin the
     * snapshot content to whoever generated it — and CI on Ubuntu
     * runners then fails on every PR with hundreds of path-only diffs.
     */
    setupFiles: ["./src/lib/__tests__/setup/vitest-setup.ts"],
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
} as ViteUserConfig);

import { defineConfig } from "astro/config";

export default defineConfig({
  site: process.env.SITE_ORIGIN ?? "https://proudtek.com",
  output: "static",
  outDir: process.env.ASTRO_OUT_DIR || "./dist",
  cacheDir: process.env.ASTRO_CACHE_DIR || "./node_modules/.astro",
  trailingSlash: "always",
  vite: {
    cacheDir: process.env.VITE_CACHE_DIR || "node_modules/.vite",
    build: {
      emptyOutDir: true,
    },
  },
});

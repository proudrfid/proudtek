import { defineConfig } from "astro/config";

export default defineConfig({
  site: process.env.SITE_ORIGIN ?? "https://proudtek.com",
  output: "static",
  outDir: "./dist-restored",
  trailingSlash: "always",
  vite: {
    build: {
      emptyOutDir: true,
    },
  },
});

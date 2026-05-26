// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  // Static output (default) — generates pre-rendered HTML for all pages
  output: "static",

  // Your production domain (used for sitemap & canonical URLs)
  site: "https://www.eclipseelectricalservices.ca",

  // Build options
  build: {
    // Inline stylesheets under 4 kB for faster LCP
    inlineStylesheets: "auto",
  },

  // Vite config for fine-grained optimisation
  vite: {
    build: {
      // Aggressive code-splitting threshold
      cssCodeSplit: true,
      // Minify with esbuild (faster than terser, same quality)
      minify: "esbuild",
    },
  },
});

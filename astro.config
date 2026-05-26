// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  output: "static",

  site: "https://www.eclipseelectricalservices.ca",

  // Netlify resolves /about → /about/index.html correctly with "always"
  trailingSlash: "never",

  build: {
    inlineStylesheets: "auto",
  },

  vite: {
    build: {
      cssCodeSplit: true,
      minify: "esbuild",
    },
  },
});

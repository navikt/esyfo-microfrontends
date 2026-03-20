import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig, envField } from "astro/config";
import prefixer from "postcss-prefix-selector";
import { rollupImportMapPlugin } from "rollup-plugin-import-map";
import importmap from "./importmap.json";

// https://astro.build/config
export default defineConfig({
  build: {
    assetsPrefix: "https://cdn.nav.no/min-side/aktivitetskrav-microfrontend",
    inlineStylesheets: "always",
  },
  vite: {
    css: {
      postcss: {
        plugins: [
          prefixer({
            prefix: ".aktivitetskrav-microfrontend",
            ignoreFiles: [/module.css/, /ds-css/],
          }),
        ],
      },
    },
    ssr: {
      noExternal: ["@astrojs/react"],
    },
  },
  integrations: [
    react(),
    {
      name: "importmap",
      hooks: {
        "astro:build:setup": ({ vite, target }) => {
          if (target === "client") {
            vite.plugins.push({
              // Import map externalizes React to NAV CDN — only needed when using client:only islands
              ...rollupImportMapPlugin(importmap),
              enforce: "pre",
              apply: "build",
            });
          }
        },
      },
    },
  ],
  i18n: {
    defaultLocale: "nb",
    locales: ["nb", "nn", "en"],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  env: {
    schema: {
      AKTIVITETSKRAV_API_URL: envField.string({
        context: "server",
        access: "secret",
        default: "http://localhost:4000/api/aktivitetsplikt",
      }),
      AKTIVITETSKRAV_CLIENT_ID: envField.string({
        context: "server",
        access: "secret",
        default: "local:teamsykefravr:aktivietskrav-api",
      }),
      AKTIVITETSKRAV_URL: envField.string({
        context: "server",
        access: "secret",
        default: "http://localhost:3000/syk/aktivitetskrav",
      }),
    },
  },
});

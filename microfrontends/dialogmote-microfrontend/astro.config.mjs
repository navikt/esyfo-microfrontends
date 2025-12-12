import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig, envField } from "astro/config";
import prefixer from "postcss-prefix-selector";
import { rollupImportMapPlugin } from "rollup-plugin-import-map";
import importmap from "./importmap.json";

// https://astro.build/config
export default defineConfig({
  build: {
    assetsPrefix: "https://cdn.nav.no/min-side/tms-microfrontend-template-ssr",
    inlineStylesheets: "always",
  },
  vite: {
    css: {
      postcss: {
        plugins: [
          prefixer({
            prefix: ".dialogmote-microfrontend",
            ignoreFiles: [/module.css/],
          }),
        ],
      },
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
    },
  },
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  env: {
    schema: {
      ISDIALOGMOTE_API_URL: envField.string({
        context: "server",
        access: "secret",
        default: "http://localhost:3000/api/dialogmote",
      }),
      ISDIALOGMOTE_CLIENT_ID: envField.string({
        context: "server",
        access: "secret",
        default: "local:teamsykefravr:isdialogmote",
      }),
      SYFOMOTEBEHOV_API_URL: envField.string({
        context: "server",
        access: "secret",
        default: "http://localhost:3000/api/motebehov",
      }),
      SYFOMOTEBEHOV_CLIENT_ID: envField.string({
        context: "server",
        access: "secret",
        default: "dev-gcp:team-esyfo:syfomotebehov",
      }),
      DIALOGMOTE_URL: envField.string({
          context: "server",
          access: "secret",
          default: "http://localhost:3000/syk/dialogmoter/sykmeldt",
      }),
    },
  },
});

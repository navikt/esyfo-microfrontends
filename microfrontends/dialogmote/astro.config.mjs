import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig, envField } from "astro/config";
import prefixer from "postcss-prefix-selector";

// https://astro.build/config
export default defineConfig({
  build: {
    assetsPrefix: "https://cdn.nav.no/min-side/dialogmote-microfrontend",
    inlineStylesheets: "always",
  },
  vite: {
    css: {
      postcss: {
        plugins: [
          prefixer({
            prefix: ".dialogmote-microfrontend",
            ignoreFiles: [/module.css/, /ds-css/],
          }),
        ],
      },
    },
    ssr: {
      noExternal: ["@astrojs/react"],
    },
  },
  integrations: [react()],
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
      DIALOGMOTE_URL: envField.string({
        context: "server",
        access: "secret",
        default: "http://localhost:3000/syk/dialogmoter/sykmeldt",
      }),
    },
  },
});

import node from "@astrojs/node";
import react from "@astrojs/react";
import { defineConfig, envField } from "astro/config";
import prefixer from "postcss-prefix-selector";

// https://astro.build/config
export default defineConfig({
  build: {
    assetsPrefix: "https://cdn.nav.no/min-side/meroppfolging-microfrontend",
    inlineStylesheets: "always",
  },
  vite: {
    css: {
      postcss: {
        plugins: [
          prefixer({
            prefix: ".meroppfolging-microfrontend",
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
      MEROPPFOLGING_BACKEND_HOST: envField.string({
        context: "server",
        access: "secret",
        default: "http://localhost:3000",
      }),
      MEROPPFOLGING_CLIENT_ID: envField.string({
        context: "server",
        access: "secret",
        default: "local:team-esyfo:meroppfolging-backend",
      }),
      SSPS_URL: envField.string({
        context: "server",
        access: "secret",
        default:
          "https://www.nav.no/syk/meroppfolging/snart-slutt-pa-sykepengene",
      }),
      KARTLEGGING_URL: envField.string({
        context: "server",
        access: "secret",
        default: "https://www.nav.no/syk/kartleggingssporsmal",
      }),
    },
  },
});

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    passWithNoTests: true,
    projects: [
      "packages/shared",
      "microfrontends/dialogmote",
      "microfrontends/motebehov",
      "microfrontends/aktivitetskrav",
    ],
  },
});

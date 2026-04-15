import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      "packages/shared",
      "microfrontends/dialogmote",
      "microfrontends/aktivitetskrav",
      "microfrontends/meroppfolging",
    ],
  },
});

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@schema": new URL("./schema", import.meta.url).pathname,
      "@src": new URL("./src", import.meta.url).pathname,
    },
  },
  test: {
    include: ["src/**/*.test.ts", "schema/**/*.test.ts"],
    setupFiles: ["./vitest.setup.ts"],
  },
});

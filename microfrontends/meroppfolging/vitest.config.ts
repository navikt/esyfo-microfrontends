import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    include: ["src/**/*.test.ts", "schema/**/*.test.ts"],
    setupFiles: ["./vitest.setup.ts"],
  },
});

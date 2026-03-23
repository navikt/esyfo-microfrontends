import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import tsconfigPaths from "vite-tsconfig-paths";

const storybookDir = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: [
    "../packages/*/src/**/*.stories.tsx",
    "../microfrontends/*/src/**/*.stories.tsx",
  ],
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "astro:env/server": resolve(storybookDir, "mocks/astro-env-server.ts"),
    };

    return {
      ...config,
      plugins: [...(config.plugins ?? []), tsconfigPaths()],
    };
  },
};

export default config;

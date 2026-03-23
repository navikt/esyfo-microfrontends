import type { StorybookConfig } from "@storybook/react-vite";
import tsconfigPaths from "vite-tsconfig-paths";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: [
    "../packages/*/src/**/*.stories.tsx",
    "../microfrontends/*/src/**/*.stories.tsx",
  ],
  viteFinal: async (config) => {
    return {
      ...config,
      plugins: [...(config.plugins ?? []), tsconfigPaths()],
    };
  },
};

export default config;

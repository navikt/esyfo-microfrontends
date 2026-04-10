import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: [
    "../packages/*/src/**/*.stories.tsx",
    "../microfrontends/*/src/**/*.stories.tsx",
  ],
  viteFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...(config.resolve ?? {}),
        tsconfigPaths: true,
      },
    };
  },
};

export default config;

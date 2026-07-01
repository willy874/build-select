import type { StorybookConfig } from "@storybook/vue3-vite";

const config: StorybookConfig = {
  stories: ["../src/packages/**/*.mdx", "../src/packages/**/*.stories.@(js|ts)"],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },
};

export default config;

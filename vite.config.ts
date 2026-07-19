import { fileURLToPath, URL } from "node:url";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@v1": fileURLToPath(new URL("./src/packages/v1", import.meta.url)),
      "@v2": fileURLToPath(new URL("./src/packages/v2", import.meta.url)),
      "@v3": fileURLToPath(new URL("./src/packages/v3", import.meta.url)),
      "@v4": fileURLToPath(new URL("./src/packages/v4", import.meta.url)),
      "@v5": fileURLToPath(new URL("./src/packages/v5", import.meta.url)),
      "@v6": fileURLToPath(new URL("./src/packages/v6", import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/packages/v1/index.ts"),
      name: "BuildSelect",
      fileName: "build-select",
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});

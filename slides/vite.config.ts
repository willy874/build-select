import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

// 讓簡報的 live demo 用與元件庫內部一致的 @vN 寫法引用原始碼，
// 之後元件庫搬動目錄時只要改這裡，不必動每支 SelectDemoVN.vue。
export default defineConfig({
  resolve: {
    alias: {
      "@v1": fileURLToPath(new URL("../src/packages/v1", import.meta.url)),
      "@v2": fileURLToPath(new URL("../src/packages/v2", import.meta.url)),
      "@v3": fileURLToPath(new URL("../src/packages/v3", import.meta.url)),
      "@v4": fileURLToPath(new URL("../src/packages/v4", import.meta.url)),
      "@v5": fileURLToPath(new URL("../src/packages/v5", import.meta.url)),
      "@v6": fileURLToPath(new URL("../src/packages/v6", import.meta.url)),
      "@v7": fileURLToPath(new URL("../src/packages/v7", import.meta.url)),
      "@v8": fileURLToPath(new URL("../src/packages/v8", import.meta.url)),
    },
  },
});

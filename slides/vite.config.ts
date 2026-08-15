import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// SLIDEV_SINGLEFILE=1 時改成「全部塞進一支 index.html」的產出模式，
// 給 Claude Artifact 這種只吃單檔、又擋掉所有外部請求的環境用。
// 平常 dev / build 不受影響。
const singleFile = process.env.SLIDEV_SINGLEFILE === "1";

// 讓簡報的 live demo 用與元件庫內部一致的 @vN 寫法引用原始碼，
// 之後元件庫搬動目錄時只要改這裡，不必動每支 SelectDemoVN.vue。
export default defineConfig({
  plugins: singleFile
    ? [
        viteSingleFile({ removeViteModuleLoader: true }),
        {
          // Slidev 自己有設 manualChunks，而 singlefile 會關掉 code splitting，
          // 兩者在 rolldown 互斥；這裡在設定定案後把分包設定拔掉。
          name: "artifact:drop-chunking",
          enforce: "post" as const,
          configResolved(config: any) {
            const outputs = [config.build.rollupOptions.output ?? {}].flat();
            for (const o of outputs) {
              delete o.manualChunks;
              delete o.advancedChunks;
              delete o.chunkFileNames;
            }
            config.build.rollupOptions.output = outputs;
          },
        },
      ]
    : [],
  build: singleFile
    ? {
        // 圖片一律轉 data URI，不要另外吐檔案出來
        assetsInlineLimit: Number.MAX_SAFE_INTEGER,
        cssCodeSplit: false,
        rollupOptions: { output: { inlineDynamicImports: true } },
      }
    : {},
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

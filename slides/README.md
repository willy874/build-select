# Select 元件升級之旅 · Slidev 簡報

以 [Slidev](https://sli.dev/) 記錄 `build-select` 中 `Select` 元件的**逐版升級歷程**。
這是一份「會長大」的簡報：元件庫每新增一版 Select，就在這裡加一頁。

## 開發指令

本目錄是 repo root 的 pnpm workspace 成員，依賴由 root 統一安裝：

```bash
pnpm install      # 在 repo root 執行，一次裝好元件庫與簡報
```

之後在 repo root 執行：

```bash
pnpm slides                                # 啟動簡報（http://localhost:3030）
pnpm slides:build                          # 產出靜態網站到 slides/dist/
pnpm --filter build-select-slides export   # 匯出成 PDF
```

或在 `slides/` 目錄下直接跑 `pnpm dev` / `pnpm build` / `pnpm export`。

## 結構

```
slides/
├── slides.md              # 主檔：封面、用 src: 串接各版本、結尾「八版走過來」總覽表、最後的工商頁
├── vite.config.ts         # @v1..@v8 alias → 元件庫原始碼
├── tsconfig.json          # 同一組 alias，給編輯器用
├── pages/
│   ├── about.md           # 01 關於竹子（含待填欄位）
│   ├── why.md             # 02 怎麼會開始想造輪子
│   ├── v1.md              # 03 每個版本一個檔案（v1~v8）
│   ├── library.md         # 04 除了做出來，怎麼變成 Library
│   ├── closing.md         # 05 結語
│   └── bonus-refactor.md  # 加映（謝謝頁之後）：大型團隊 / 大型專案的重構困難
├── assets/
│   ├── photo.jpeg         # 講者頭像
│   ├── threads-qr.svg     # Threads @f2e_willy（about 頁與工商頁共用）
│   └── merak-qr.svg       # Merak 產品頁（工商頁）
└── components/
    └── SelectDemoV1.vue   # 每版的「實際跑跑看」live demo
```

Live demo 透過 `@vN` alias 直接 `import` 元件庫原始碼（`../src/packages/vN`），
所以簡報裡跑的永遠是**真的元件**，不會與實作走鐘。

## 每新增一版 Select 時（逐版更新流程）

假設元件庫新增了 `src/packages/v2`：

1. **新增內容頁**：複製 `pages/v1.md` 成 `pages/v2.md`，改寫該版的設計目標 / 相對前版差異 / 實際跑跑看。
   deck 不放程式碼實作解說，實作細節留在該版的 `CHANGELOG.md`。
2. **新增 live demo**：複製 `components/SelectDemoV1.vue` 成 `SelectDemoV2.vue`，把 import 改成 `@v2`，並在 `v2.md` 用 `<SelectDemoV2 />`。
   若該版的 alias 還沒建（目前已備妥 `@v1`~`@v8`），在 `vite.config.ts` 與 `tsconfig.json` 各補一行。
3. **串接進主檔**：在 `slides.md` 的 v1 `src:` 區塊下方，照樣加一段：

   ```md
   ---
   src: ./pages/v2.md
   ---
   ```

4. **更新版本總覽表**：在 `slides.md` 結尾「八版走過來」的表格補一列（版本 / 主題 / 核心變化）。
   該頁高度已無餘裕，補列後記得把 `.version-table` 的 `font-size` 往下調（目前 `0.92rem`）並確認上下沒被切掉。

就這樣，一版一頁，簡報跟著元件庫一起演進。

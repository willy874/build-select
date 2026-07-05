# Select 元件升級之旅 · Slidev 簡報

以 [Slidev](https://sli.dev/) 記錄 `build-select` 中 `Select` 元件的**逐版升級歷程**。
這是一份「會長大」的簡報：元件庫每新增一版 Select，就在這裡加一頁。

## 開發指令

在 `slides/` 目錄下執行：

```bash
pnpm install      # 第一次先安裝
pnpm dev          # 啟動簡報（http://localhost:3030）
pnpm build        # 產出靜態網站到 dist/
pnpm export       # 匯出成 PDF
```

## 結構

```
slides/
├── slides.md              # 主檔：封面、版本總覽，用 src: 串接各版本
├── pages/
│   └── v1.md              # 每個版本一個檔案
└── components/
    └── SelectDemoV1.vue   # 每版的「實際跑跑看」live demo
```

Live demo 直接 `import` 元件庫原始碼（`../../src/packages/vN`），
所以簡報裡跑的永遠是**真的元件**，不會與實作走鐘。

## 每新增一版 Select 時（逐版更新流程）

假設元件庫新增了 `src/packages/v2`：

1. **新增內容頁**：複製 `pages/v1.md` 成 `pages/v2.md`，改寫該版的設計目標 / API / 程式碼 / 限制。
2. **新增 live demo**：複製 `components/SelectDemoV1.vue` 成 `SelectDemoV2.vue`，把 import 指向 `../../src/packages/v2`，並在 `v2.md` 用 `<SelectDemoV2 />`。
3. **串接進主檔**：在 `slides.md` 的 v1 `src:` 區塊下方，照樣加一段：

   ```md
   ---
   src: ./pages/v2.md
   ---
   ```

4. **更新版本總覽表**：在 `slides.md` 的「版本總覽」表格補一列，把 v2 狀態改成 ✅。

就這樣，一版一頁，簡報跟著元件庫一起演進。

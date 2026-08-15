# build-select

Vue 3 component library, built with Vite + TypeScript and documented with Storybook.

## 架構

本 repo 是 pnpm workspace：root 本身就是元件庫（發布用），`slides/` 是掛在 workspace 下的 Slidev 簡報。
依賴由 root 的 `pnpm-lock.yaml` 統一管理，兩邊共用同一份 `vue`。

```
build-select/
├── pnpm-workspace.yaml   # packages: ['slides']
├── src/packages/v1..v8/  # 元件庫本體
└── slides/               # Slidev 簡報（build-select-slides）
```

在 root 執行一次 `pnpm install` 即可同時安裝兩邊。

元件依版本收納於 `src/packages/v*`：

```
src/packages/v1/
├── components/
│   └── Button/
│       ├── Button.vue          # 元件實作
│       ├── Button.stories.ts   # Storybook stories
│       └── index.ts            # 對外匯出
└── index.ts                    # 版本進入點（library entry）
```

## 開發指令

| 指令 | 說明 |
| --- | --- |
| `pnpm storybook` | 啟動 Storybook（http://localhost:6006） |
| `pnpm build` | 產出函式庫至 `dist/`（ESM + UMD + CSS + d.ts） |
| `pnpm build-storybook` | 產出靜態 Storybook 至 `storybook-static/` |
| `pnpm type-check` | 以 `vue-tsc` 進行型別檢查 |
| `pnpm slides` | 啟動 Slidev 簡報（http://localhost:3030） |
| `pnpm slides:build` | 產出靜態簡報至 `slides/dist/` |

## 使用方式

```ts
import { Button } from "build-select";
import "build-select/style.css";
```

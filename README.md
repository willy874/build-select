# build-select

Vue 3 component library, built with Vite + TypeScript and documented with Storybook.

## 架構

元件依版本收納於 `src/packages/v*`，目前為 `v1`：

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

## 使用方式

```ts
import { Button } from "build-select";
import "build-select/style.css";
```

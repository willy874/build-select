# Select v2 — CHANGELOG

本檔記錄 `@v2` 版 `Select` 相對於 `@v1` 的差異。

v2 的核心目標：**把原生 `<select>` 重構成自訂的 `<div>` 下拉選單**，
在維持 v1 對外 API 相容的前提下，取回下拉面板的外觀主導權。

> v2 製作「點擊開合、點選選項、點外部關閉」，

---

## 與 v1 的差異總覽

| 面向 | v1 | v2 |
| --- | --- | --- |
| 底層結構 | 原生 `<select>` / `<option>` | 自訂 `<div>` trigger + `<ul>`/`<li>` 面板 |
| 下拉外觀 | 瀏覽器原生（各 OS 不一致） | 完全自訂、跨平台一致 |
| option 樣式 | 無法自訂 | 可自訂（hover、selected、disabled、箭頭動畫、陰影） |
| 對外 API | — | **與 v1 完全相同（可直接替換）** |

## API 相容性

v2 **未變更**對外介面，v1 使用端可無痛切換：

- Props：`modelValue`、`options`、`placeholder`、`size`、`disabled`
- Emits：`update:modelValue`、`change`
- 型別：`SelectOption = { label: string; value: string | number; disabled?: boolean }`

> 差別只在 import 來源：`@v1` → `@v2`。

## 新增能力

- **自訂下拉面板**：`div`/`ul`/`li` 結構，樣式可完全掌控
  - 旋轉箭頭（開/合狀態切換）
  - option 的 hover / selected / disabled 視覺狀態（純 CSS `:hover`）
  - 面板陰影、圓角、最大高度 `240px` 內捲動
- **互動行為**
  - 點擊 trigger 開合面板
  - 點擊選項選取並收合（`disabled` 選項略過）
  - 點擊 root 外自動收合（`pointerdown`）
  - 空 `options` 顯示「無選項」提示

## 行為差異（需注意）

- **下拉面板不再是原生元素**：不受瀏覽器原生下拉樣式限制，但也不再享有原生的行動裝置原生選單（如 iOS 滾輪）；改由自訂面板呈現。
- **面板定位**採 `position: absolute`，若父層有 `overflow: hidden` 可能被裁切（未來可考慮 Teleport / floating 定位處理）。

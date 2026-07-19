# Select v3 — CHANGELOG

本檔記錄 `@v3` 版相對於 `@v2` 的差異。

v3 的核心目標：**新增 `Portal` 元件，解決 v2 下拉面板被父層 `overflow` 裁切的問題**，
並在維持對外 API 完全相容的前提下，讓面板不再受祖先層的 `overflow` / stacking context 束縛。

---

## v2 的缺陷（v3 要解決的問題）

v2 的下拉面板用 `position: absolute` 相對元件父層定位。
只要任何祖先層設了 `overflow: hidden / auto / scroll`
（卡片、對話框、表格、側邊欄等），超出容器的面板就會被裁切，選項無法完整顯示或點選。

> 對照 Storybook：`v2/Select` → **ClippedInOverflowContainer**（面板被裁切）
> vs. `v3/Select` → **NotClippedInOverflowContainer**（同一卡片，面板完整浮出）

## 新增：`Portal` 元件

- 對 Vue 內建 `<Teleport>` 的薄封裝，提供合理預設（`to="body"`）與型別化 API
- Props：`to`（CSS selector 或 DOM 節點，預設 `body`）、`disabled`（停用傳送、內容留在原地）
- 作為浮層元件（下拉、Modal、Tooltip）的共用基礎元件
- 對照 Storybook：`v3/Portal` → **Basic**

## Select 的改動

| 面向 | v2 | v3 |
| --- | --- | --- |
| 面板掛載位置 | 元件父層內（`<ul>` 為 root 子節點） | 透過 `Portal` 傳送到 `<body>` |
| 定位方式 | `position: absolute` 相對父層 | `position: fixed` + trigger 的 viewport 座標 |
| 受父層 `overflow` 影響 | ⚠️ 會被裁切 | ✅ 不受影響 |
| 捲動 / resize | 面板隨父層 | 監聽 `scroll`(capture) / `resize`，即時校正座標 |
| 外部點擊關閉 | 判定 root 是否包含目標 | 同時排除 trigger 與（已傳送的）面板 |

## API 相容性

v3 **未變更** Select 對外介面，v2 使用端可無痛切換：

- Props：`modelValue`、`options`、`placeholder`、`size`、`disabled`
- Emits：`update:modelValue`、`change`
- 型別：`SelectOption = { label: string; value: string | number; disabled?: boolean }`

> 差別只在 import 來源：`@v2` → `@v3`。

## 已知限制 / 後續可做

- 目前面板固定向下展開，尚未依視窗剩餘空間做上翻（flip）；
  超長清單靠近視窗底部時可能溢出視窗（面板本身有 `max-height: 240px` 內捲動）。
- 尚未接鍵盤操作（方向鍵 / Enter / Esc）與 focus 管理，屬後續 a11y 課題。

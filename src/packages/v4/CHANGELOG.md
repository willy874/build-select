# Select v4 — CHANGELOG

本檔記錄 `@v4` 版相對於 `@v3` 的差異。

v4 的核心目標：**補回 v1 原生 `<select>` 本就具備、但 v2 改為自訂 `<div>` 後遺失的鍵盤操作與無障礙（a11y）能力**，
並在維持對外 API 完全相容的前提下，讓自訂 Select 用純鍵盤與螢幕閱讀器也能完整操作。

---

## 背景：v2 改自訂 `<div>` 時遺失了什麼

v1 用原生 `<select>`，瀏覽器免費附送：可 `Tab` 聚焦、方向鍵移動、打字跳項、
`Enter` / `Esc` 開合、以及螢幕閱讀器可理解的語意。

v2 為了取回外觀主導權改用自訂 `<div>` / `<ul>` / `<li>`，這些能力全部消失：
面板只能用滑鼠點、無法 `Tab` 聚焦、沒有 focus ring、螢幕閱讀器讀不出「這是一個選擇器」。
v3 專注解 overflow 裁切，未觸及這塊。v4 把這筆債補齊。

## 新增：鍵盤操作

trigger 可經 `Tab` 聚焦（`disabled` 時移出 tab 序），聚焦後：

| 按鍵 | 行為 |
| --- | --- |
| `↓` / `↑` | 關閉時開啟面板；開啟時上下移動高亮 |
| `Home` / `End` | 跳到第一 / 最後一個可選項 |
| `Enter` / `Space` | 開啟面板，或選取目前高亮項 |
| `Esc` | 關閉面板，焦點收回 trigger |
| `Tab` | 關閉面板並放行預設行為（焦點自然離開） |
| 可列印字元 | **typeahead**：跳到 label 符合輸入開頭的選項（500ms 內連打可累積） |

- 鍵盤導覽會**自動略過 `disabled` 選項**
- 高亮項超出面板可視範圍時，自動 `scrollIntoView({ block: "nearest" })` 捲入

## 新增：焦點管理

- trigger 加上 `:focus-visible` 樣式，鍵盤聚焦時顯示清楚的 focus ring
- 面板開合期間 DOM 焦點**始終停在 trigger**（見下方 ARIA combobox 模式）
- 以鍵盤 / `Esc` 關閉時，焦點明確收回 trigger，鍵盤操作流不中斷
- 點擊外部關閉時不搶回焦點（使用者本意是移往他處）

## 新增：ARIA 語意

採 **ARIA combobox + listbox** 模式，讓螢幕閱讀器讀得懂：

- trigger：`role="combobox"`、`aria-haspopup="listbox"`、`aria-expanded`、
  `aria-controls`（指向面板）、`aria-activedescendant`（指向高亮選項）、`aria-disabled`
- 面板：`role="listbox"`
- 選項：`role="option"`、`aria-selected`、`aria-disabled`
- 每個實例用 Vue 3.5 內建 `useId()` 產生穩定且唯一的 id，串起三者的 ARIA 關聯

> **為何用 `aria-activedescendant` 而非把焦點移進面板？**
> 面板被 Portal 傳送到 `<body>`、且開合會頻繁掛載 / 卸載，把 DOM 焦點移進去難以管理。
> combobox 模式讓焦點固定在 trigger，用 `aria-activedescendant` 指向高亮選項達成「虛擬焦點」，
> 螢幕閱讀器一樣能正確播報目前所在選項。

## 內部視覺調整

- 選項高亮從單純的 CSS `:hover` 改為由 `activeIndex` 驅動的 `--active` 狀態
- 鍵盤方向鍵與滑鼠 `mouseenter` 都更新同一個 `activeIndex`，
  因此鍵盤與滑鼠操作看到的高亮**完全一致**

## API 相容性

v4 **未變更** Select 對外介面，v3 使用端可無痛切換：

- Props：`modelValue`、`options`、`placeholder`、`size`、`disabled`
- Emits：`update:modelValue`、`change`
- 型別：`SelectOption = { label: string; value: string | number; disabled?: boolean }`

> 差別只在 import 來源：`@v3` → `@v4`。新增的鍵盤 / a11y 能力皆為內建行為，呼叫端不需任何改動。

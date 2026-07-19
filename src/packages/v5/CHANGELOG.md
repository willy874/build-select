# Select v5 — CHANGELOG

本檔記錄 `@v5` 版相對於 `@v4` 的差異。

v5 有兩條主線,且在維持對外 API 完全相容的前提下完成:

1. **子元件拆分**:把 v4 約 500 行的單檔 Select 重構成「大腦(composables)+ 臉(呈現子元件)」。
2. **智慧定位(flip)**:面板下方空間不足時自動向上展開,並依可用空間夾住高度。

---

## 一、子元件拆分

v4 的 `Select.vue` 把狀態機、定位、清單導覽、typeahead、選取、渲染六件事綁在一起。
v5 沿「**不變的邏輯 / 會變的內容**」與「**大腦 / 臉**」兩條縫拆開:

### 大腦(composables,無 template)

| Composable | 職責 |
| --- | --- |
| `useFloatingPosition` | 浮層定位:fixed 座標 + flip + 高度夾住(可被其他浮層元件重用) |
| `useListNavigation` | 高亮索引 `activeIndex`、方向移動、略過 disabled(無 DOM 依賴,可純函式測試) |
| `useTypeahead` | 打字累積 buffer + 比對 label 開頭 |
| `useSelect` | 總機:組合上面三者 + 開合 / 提交 / 鍵盤分派 / 外部點擊 / ARIA id |

### 臉(呈現子元件,props / emits,非 provide/inject)

| 元件 | 職責 |
| --- | --- |
| `SelectTrigger` | combobox 殼:`role` / `tabindex` / `aria-*` / `focus()` / 鍵盤轉發;內容走 slot |
| `SelectValue` | 顯示已選 label 或 placeholder(從 trigger 殼獨立出的「會變內容區」) |
| `SelectDropdown` | 組合 `Portal` + `useFloatingPosition`;選項走 slot |
| `SelectOption` | `<li role="option">`;內容以 slot 佔位 |
| `Select.vue` | 協調者:呼叫 `useSelect`,把回傳接到子元件,約 100 行 |

### 拆分取捨

- **props / emits 而非 provide/inject**:對外仍是 options 驅動,顯式傳遞最清楚。
- **`scrollIntoView` 留在 `Select.vue`**:唯一需要 DOM 的導覽動作不進 composable,換取 `useListNavigation` 可純函式測試。
- **定位 composable 放 `SelectDropdown`**:它同時持有 anchor 與 panel 兩個 ref,讓「浮層 + 座標」的 DOM 關注封在同一元件。
- **會變的內容先留 slot**:`SelectOption` 的內容、trigger 的值區都以 slot 佔位。

## 二、智慧定位(flip)

`useFloatingPosition` 新增翻面與夾高邏輯:

- **翻面**:量測 trigger 下方可用空間,若放不下且上方較寬,面板改以「底邊貼齊 trigger 上緣」**向上展開**。
- **高度夾住**:依展開方向的可用空間動態設定 `max-height`,面板永遠不溢出視窗(超出則內捲)。
- **穩定判斷**:以面板 `scrollHeight`(完整內容高)決定翻面,避免被夾高後的高度回授造成抖動。
- 開啟與 `scroll`(capture)/ `resize` 期間即時重算,面板始終貼齊 trigger 並待在視窗內。

## API 相容性

v5 **未變更** Select 對外介面,v4 使用端可無痛切換:

- Props：`modelValue`、`options`、`placeholder`、`size`、`disabled`
- Emits：`update:modelValue`、`change`
- 型別：`SelectOption = { label: string; value: string | number; disabled?: boolean }`

> 差別只在 import 來源：`@v4` → `@v5`。拆分為內部重構、flip 為內建行為,呼叫端皆不需改動。

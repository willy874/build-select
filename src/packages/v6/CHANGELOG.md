# Select v6 — CHANGELOG

本檔記錄 `@v6` 版相對於 `@v5` 的差異。

v6 新增 **Filter / Search(搜尋過濾)**:以 `filterable` prop 選擇性開啟,
開啟後 trigger 變成可輸入的 combobox,打字即過濾,支援**拼音模糊比對**與命中高亮。

---

## 新增:`filterable` prop(預設 `false`)

- `filterable: false`(預設):行為與 v5 **完全相同**——靜態 trigger + typeahead 跳項。
- `filterable: true`:trigger 換成可輸入的搜尋 combobox,打字即過濾選項。

## 搜尋比對:拼音 + 子字串

新增 `useFilter` composable,對每個選項的 label 求命中:

1. **一般子字串**(忽略大小寫)——可直接打中文字或拉丁 label。
2. **拼音模糊比對**(套件 `pinyin-pro` 的 `match`)——支援首字母 / 全拼 / 混合:
   - 首字母:`pg` → 蘋果、`xj` → 香蕉、`qyg` → 奇異果
   - 全拼:`xiangjiao` → 香蕉、`putao` → 葡萄

兩者命中皆回傳**命中字元索引**,直接餵給選項高亮。過濾為純函式 `filterOptions`,可單獨測試。

## 命中高亮

`SelectOption` 依 `matched` 索引把命中的字元以 `<mark>` 標記(實色 / 加粗),
未命中片段維持原樣。

## 無結果狀態

過濾後無命中時,面板顯示「無結果」(與空 `options` 的「無選項」區分)。

## 新增元件:`SelectSearchInput`

filterable 模式的 trigger,依 ARIA editable combobox 模式:

- `role="combobox"`、`aria-autocomplete="list"` 落在 `<input>` 本身。
- input 的值**永遠等於 query**;已選值 / placeholder 以一層非互動 overlay 顯示(query 為空時),避免「已選 label 混進搜尋字串」。
- 關閉時清空 query,overlay 顯示已選值;開啟時可輸入,`Esc` / 選取後焦點收回 input。

> 非 filterable 時仍用 v5 的 `SelectTrigger`(`<div role="combobox">`);Select.vue 依 `filterable` 擇一渲染。

## 鍵盤行為(filterable 時)

- `↑` / `↓` 移動高亮、`Enter` 選取、`Esc` 關閉——與非 filterable 一致。
- `Home` / `End` 與可列印字元(含空白)**交給 input**(移動游標、輸入文字),不被攔截。
- 過濾後高亮自動移到第一個命中項;停用選項不會被命中選取。

## API 相容性

v6 **未移除或變更**既有對外介面,v5 使用端可無痛切換:

- 既有 Props：`modelValue`、`options`、`placeholder`、`size`、`disabled`(行為不變)
- 新增 Props：`filterable`(預設 `false`)
- Emits：`update:modelValue`、`change`
- 型別：`SelectOption = { label: string; value: string | number; disabled?: boolean }`

> 差別只在 import 來源：`@v5` → `@v6`。不加 `filterable` 時與 v5 完全一致;搜尋為選擇性能力。
>
> 新增執行期相依:`pinyin-pro`(拼音比對)。

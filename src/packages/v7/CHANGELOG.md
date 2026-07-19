# Select v7 — CHANGELOG

本檔記錄 `@v7` 版相對於 `@v6` 的差異。

v7 新增 **多選(multiple)**:以 `multiple` prop 選擇性開啟,`modelValue` 變為陣列,
已選以**可移除 chips** 呈現;並可與 `filterable` 併用,成為**可搜尋的多選**。

---

## 新增:`multiple` prop(預設 `false`)

- `multiple: false`(預設):行為與 v6 **完全相同**(單選,`modelValue` 為純量)。
- `multiple: true`:`modelValue` 為**陣列**;選取改為 toggle(加入 / 移除)且**面板不關**,方便連續多選。

## 已選呈現:可移除 chips

- 已選項在 trigger 內顯示為 chips,每個帶 `×` 可移除(新元件 `SelectChips`)。
- 面板中已選項顯示勾選 `✓`(`SelectOption` 新增 `multiple` 呈現)。
- listbox 標記 `aria-multiselectable="true"`;選項 `aria-selected` 反映多選狀態。

## multiple × filterable:可搜尋的多選

兩個 prop 正交,可任意組合。組合矩陣對應三種 trigger:

| filterable | multiple | trigger |
| --- | --- | --- |
| false | false | `SelectTrigger`(`<div role=combobox>`,v5/v6) |
| true | false | `SelectSearchInput`(`<input>`,v6) |
| false | true | `SelectMultiTrigger`(chips + `<div role=combobox>`) |
| true | true | `SelectSearchInput` + chips(chips + 搜尋 `<input>`) |

`multiple + filterable` 時:

- chips 顯示在搜尋框前;打字(可拼音)過濾,`Enter` 加入後**清空搜尋**可續選。
- 搜尋框為空時按 `Backspace` 移除**最後一個 chip**。

## 選取邏輯的變動(關在 useSelect)

如 v5 拆分時所預期,多選的差異幾乎只落在 `useSelect` 的選取邏輯:

- `selectedValues` 統一把單選 / 多選正規化成值集合;`commit` 依 `multiple` 走 toggle 或取代。
- 新增 `selectedOptions`(給 chips)、`onRemoveChip`;`SelectOption` 的 `selected` 改為集合判定。
- 導覽 / 過濾 / 定位 / 鍵盤主幹皆沿用,`SelectDropdown`、`SelectOption` 只加多選呈現。

## API 相容性

v7 **未移除或變更**既有對外介面,v6 使用端可無痛切換:

- 既有 Props：`modelValue`、`options`、`placeholder`、`size`、`disabled`、`filterable`(行為不變)
- 新增 Props：`multiple`(預設 `false`)
- `modelValue` 型別擴充為 `SelectValue | SelectValue[] | null`(`multiple` 時為陣列)
- Emits：`update:modelValue`、`change`

> 差別只在 import 來源：`@v6` → `@v7`。不加 `multiple` 時與 v6 完全一致;多選為選擇性能力。

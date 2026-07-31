---
theme: seriph
title: Select 元件升級之旅
info: |
  ## build-select · Select 元件升級之旅
  以 Slidev 記錄 Select 元件的逐版演進。
  每新增一版元件，就在 pages/ 加一個 vN.md 並於本檔引入。
class: text-center
transition: slide-left
mdc: true
---

# Select 元件升級之旅

`build-select` 元件庫 · 逐版演進記錄

<div class="pt-8 text-sm opacity-60">
  按 <kbd>空白鍵</kbd> 或 <kbd>→</kbd> 開始
</div>

<!--
講者備忘：這份簡報會隨著 Select 元件每次升級而長大，
一版一頁（pages/vN.md），主檔只負責串接。
-->

---
layout: center
class: text-center
---

# 為什麼要做這份簡報？

<div class="text-left max-w-2xl mx-auto pt-4 leading-relaxed">

- 元件庫的 `Select` 會**逐版升級**（`src/packages/v1`, `v2`, …）
- 每一版都有它**當時的取捨**與**留下的限制**
- 用一份會長大的簡報，把「**為什麼這樣改**」記錄下來
- 每新增一版元件 → 加一頁 → 簡報就是活的升級史

</div>

<!-- ↓↓↓ 各版本內容：每新增一版就在下面加一行 src: 引用 ↓↓↓ -->

---
src: ./pages/v1.md
---

---
src: ./pages/v2.md
---

---
src: ./pages/v3.md
---

---
src: ./pages/v4.md
---

---
src: ./pages/v5.md
---

---
src: ./pages/v6.md
---

---
src: ./pages/v7.md
---

---
src: ./pages/v8.md
---

<!-- ↑↑↑ 未來新增版本時，複製上面的 src 區塊指向 ./pages/v9.md 即可 ↑↑↑ -->

---
layout: center
---

# 八版走過來

<div class="version-table">

| 版本 | 主題 | 核心變化 |
| --- | --- | --- |
| **v1** | 原生 `<select>` 包裝 | v-model、options、size、disabled |
| **v2** | 自訂 `<div>` 下拉選單 | 自訂面板、外觀可控（陽春版），API 相容 v1 |
| **v3** | Portal 傳送下拉面板 | 面板送 `body`、fixed 定位、解 overflow 裁切 |
| **v4** | 鍵盤操作與無障礙 | 補回原生鍵盤 / 焦點 / ARIA 語意 |
| **v5** | 智慧定位與子元件拆分 | 面板貼底翻面、composables + 呈現元件拆分 |
| **v6** | Filter / Search | 打字即過濾、拼音模糊比對、命中高亮 |
| **v7** | 多選（multiple） | 陣列 v-model、可移除 chips、可搜尋的多選 |
| **v8** | 遠端 · 無限滾動 · 虛擬列表 | 只渲染可視範圍、捲到底載下一頁、遠端查詢 |

</div>

<div class="pt-3 text-xs opacity-60 text-center">
每一版都與前一版 API 相容 —— import 從 <code>@vN</code> 換成 <code>@vN+1</code> 即可
</div>

<style>
h1 { margin-bottom: 0.6rem; }
.version-table table { font-size: 0.92rem; line-height: 1.35; }
.version-table th,
.version-table td { padding-top: 0.42rem; padding-bottom: 0.42rem; }
</style>

---
layout: two-cols-header
---

# 總結 · 這顆 Select 現在會什麼

<div class="text-sm opacity-70 -mt-2">八版走完的成果與底層結構</div>

::left::

**能力**

- 單選 / 多選（可移除 chips）
- 搜尋過濾（拼音 `pinyin-pro` + 命中高亮）
- 遠端 + 無限滾動 + 虛擬列表
- 完整鍵盤操作 + ARIA（combobox / listbox）
- 智慧定位（flip + 高度夾住）、Portal 浮層

::right::

**架構**

- 大腦：composables
  <div class="text-xs opacity-70">useSelect · useListNavigation · useTypeahead · useFilter · useFloatingPosition · useVirtualList</div>
- 臉：呈現子元件
  <div class="text-xs opacity-70">Trigger 系列 · Dropdown · Option · Chips · SearchInput</div>
- 每版對外 API 相容：`@vN` → `@vN+1` 無痛切換

---
layout: two-cols-header
---

# 未完成遺珠

<div class="text-sm opacity-70 -mt-2">這趟停在 v8；想做、但這輪沒做到的</div>

::left::

**選項呈現**

- 豐富選項：icon / 頭像 / 次要描述
- 自訂渲染 slots（選項 / 已選值 / chip）
- 選項分組（分類標題）

**輸入便利**

- 可清除（clearable 一鍵清空）
- 自由建立新選項（creatable / tags）
- 多選「全選 / 反選」

::right::

**狀態 · 韌性**

- 遠端錯誤與重試、請求競態取消
- 空 / 載入 / 錯誤更細緻的呈現

**整合 · 品質**

- 原生表單整合（name / 提交 / 驗證）
- 單元測試（composables 可純函式測）
- 深色模式 / RTL、開闔過場動畫

---
layout: center
class: text-center
---

# 謝謝

<div class="pt-6 text-sm opacity-60">
build-select · Select 元件升級之旅
</div>

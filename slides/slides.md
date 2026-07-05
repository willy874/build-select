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

---
layout: center
---

# 版本總覽

<div class="pt-4">

| 版本 | 主題 | 核心變化 | 狀態 |
| --- | --- | --- | --- |
| **v1** | 原生 `<select>` 包裝 | v-model、options、size、disabled | ✅ 基礎 |
| **v2** | 自訂 `<div>` 下拉選單 | 自訂面板、外觀可控、API 相容 v1（陽春版） | ✅ 目前 |

</div>

<div class="pt-8 text-sm opacity-60 text-center">
每次新增一版，就在這張表補一列、在 pages/ 加一頁
</div>

<!-- ↓↓↓ 各版本內容：每新增一版就在下面加一行 src: 引用 ↓↓↓ -->

---
src: ./pages/v1.md
---

---
src: ./pages/v2.md
---

<!-- ↑↑↑ 未來新增版本時，複製上面的 src 區塊指向 ./pages/v3.md 即可 ↑↑↑ -->

---
layout: center
class: text-center
---

# 待續 …

下一版 Select 升級時，這份簡報會再長出一頁

<div class="pt-6 text-sm opacity-60">
build-select · Select 元件升級之旅
</div>

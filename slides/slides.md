---
theme: seriph
title: 來造一個下拉選單的輪子
info: |
  ## build-select · 來造一個下拉選單的輪子
  用 Slidev 記錄一顆 Select 被我重寫八次的過程。
  每多做一版，就在 pages/ 加一個 vN.md，然後在這裡引進來。
class: text-center
transition: slide-left
mdc: true
---

# 來造一個下拉選單的輪子

人家說不要重複造輪子，我偏要造一個七彩霓虹的輪子

---
layout: center
---

# 今天要講什麼

<div class="text-sm opacity-70 -mt-2">從一個念頭，到一顆真的轉得動的輪子</div>

<div class="agenda">

<div class="item">
  <span class="no">01</span>
  <div class="txt">
    <div class="t">關於竹子</div>
    <div class="d">我是誰、平常都在寫些什麼</div>
  </div>
</div>

<div class="item">
  <span class="no">02</span>
  <div class="txt">
    <div class="t">怎麼會開始想造輪子？</div>
    <div class="d">現成的元件庫哪裡不夠用，我幹嘛自己再做一顆</div>
  </div>
</div>

<div class="item is-main">
  <span class="no">03</span>
  <div class="txt">
    <div class="t">做一個下拉選單</div>
    <div class="d">從包一層原生 <code>&lt;select&gt;</code> 開始，一路長大</div>
  </div>
</div>

<div class="item">
  <span class="no">04</span>
  <div class="txt">
    <div class="t">除了做出來，怎麼變成 Library</div>
    <div class="d">打包、型別、版本、發佈——能用，不等於能給別人用</div>
  </div>
</div>

<div class="item">
  <span class="no">05</span>
  <div class="txt">
    <div class="t">結語</div>
    <div class="d">走完這一趟，回頭才看懂的事</div>
  </div>
</div>

</div>

<style>
.agenda {
  width: 42rem;
  max-width: 100%;
  margin: 1.6rem auto 0;
}
.agenda .item {
  display: grid;
  grid-template-columns: 2.6rem 1fr;
  align-items: baseline;
  padding: 0.5rem 0.75rem;
  border-radius: 0.35rem;
}
.agenda .item + .item {
  border-top: 1px solid rgba(125, 125, 125, 0.18);
}
.agenda .no {
  font-family: var(--slidev-code-font-family, monospace);
  font-size: 0.9rem;
  opacity: 0.35;
  font-variant-numeric: tabular-nums;
}
.agenda .t {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.4;
}
.agenda .d {
  font-size: 0.78rem;
  opacity: 0.6;
  line-height: 1.45;
  margin-top: 0.1rem;
}
.agenda .d code {
  font-size: 0.9em;
  padding: 0 0.15em;
}
.agenda .tag {
  margin-left: 0.55rem;
  padding: 0.1rem 0.42rem;
  border-radius: 0.28rem;
  background: rgba(125, 125, 125, 0.14);
  font-family: var(--slidev-code-font-family, monospace);
  font-size: 0.68rem;
  font-weight: 400;
  letter-spacing: 0.02em;
  vertical-align: 0.12em;
  opacity: 0.75;
}
.agenda .is-main {
  background: rgba(125, 125, 125, 0.08);
}
.agenda .is-main .no { opacity: 0.6; }
</style>

<!--
講者備忘：整份就這五段，講完就沒了。
第 3 段（v1~v8）是主體，一版一頁，每版只講兩件事：當時卡在哪、這版怎麼解掉。
-->

---
src: ./pages/about.md
---

---
src: ./pages/why.md
---

---
layout: section
---

# 03 · 做一個下拉選單

v1 ~ v8，一版只解一件當時最痛的事

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

# 八版，就這樣走過來了

<div class="version-table">

| 版本 | 這版在幹嘛 | 做了什麼 |
| --- | --- | --- |
| **v1** | 包一層原生 `<select>` | v-model、options、size、disabled |
| **v2** | 自己刻一個 `<div>` 下拉 | 面板自己畫、外觀終於管得到（陽春版），API 沒動 |
| **v3** | 把面板 Portal 出去 | 面板丟去 `body`、改 fixed 定位、不再被 overflow 切掉 |
| **v4** | 鍵盤跟無障礙 | 把原生免費給、被我弄丟的鍵盤 / 焦點 / ARIA 補回來 |
| **v5** | 智慧定位＋拆元件 | 空間不夠就往上翻、單檔拆成 composables + 子元件 |
| **v6** | Filter / Search | 打字就過濾、拼音也能搜、命中的字會高亮 |
| **v7** | 多選（multiple） | v-model 變陣列、已選變 chips、還能邊搜邊選 |
| **v8** | 遠端 · 無限滾動 · 虛擬列表 | 只渲染看得到的、捲到底載下一頁、丟去後端查 |

</div>

<div class="pt-3 text-xs opacity-60 text-center">
每一版對前一版都相容 —— import 從 <code>@vN</code> 改成 <code>@vN+1</code>，就這樣而已
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

# 所以現在這顆 Select 會什麼

<div class="text-sm opacity-70 -mt-2">八版之後，它長成什麼樣子</div>

::left::

**會做的事**

- 單選、多選（chips 可以一個一個拔掉）
- 打字就過濾（拼音靠 `pinyin-pro`，命中還會高亮）
- 遠端查詢 + 捲到底載下一頁 + 虛擬列表
- 鍵盤整套都能用，ARIA 也補齊（combobox / listbox）
- 空間不夠會自己翻面、高度會自己夾住，面板走 Portal

::right::

**裡面長怎樣**

- 大腦：composables
  <div class="text-xs opacity-70">useSelect · useListNavigation · useTypeahead · useFilter · useFloatingPosition · useVirtualList</div>
- 臉：負責呈現的子元件
  <div class="text-xs opacity-70">Trigger 系列 · Dropdown · Option · Chips · SearchInput</div>
- 每一版對外都相容：`@vN` → `@vN+1`，換完不會痛

---
layout: two-cols-header
---

# 遺珠之憾

<div class="text-sm opacity-70 -mt-2">不是做不到，是這趟就停在 v8——這些都還躺在待辦裡</div>

::left::

**選項長相**

- 選項想放 icon / 頭像 / 次要說明
- 開 slots 讓人自己畫（選項 / 已選值 / chip）
- 選項分組，加分類標題

**輸入順手一點**

- 一鍵清空（clearable）
- 打什麼就建什麼（creatable / tags）
- 多選的「全選 / 反選」、選取上限
- chips 可以拖曳排序

::right::

**狀態撐不撐得住**

- 遠端出錯要能重試，還要處理請求打架
- 空的 / 載入中 / 錯誤，都該長得更清楚
- 只拿得到 id 的時候，已選值的名字要補得回來

**接得起來、信得過**

- 接原生表單（name / 提交 / 驗證）
- 補測試（composables 都是純函式，好測）
- 深色模式 / RTL，還有開合的過場動畫
- SSR 站得住、手機上改成從底部推上來

---
src: ./pages/library.md
---

---
src: ./pages/closing.md
---

---
layout: center
class: text-center
---

# 結束

<div class="pt-6 text-sm opacity-60">
所以就這樣？？？
</div>

---
src: ./pages/bonus-refactor.md
---

---
layout: center
---

# 工商時間

<div class="text-sm opacity-70 -mt-2">真的最後了，借一分鐘講兩件跟 Select 沒關係的事</div>

<div class="promo">

<div class="card">

[![Threads @f2e_willy](./assets/threads-qr.svg)](https://www.threads.com/@f2e_willy)

<div class="cap">
  <div class="t">Threads · @f2e_willy</div>
  <div class="d">平常在這裡碎碎念，偶爾會分享一些技術</div>
  <div class="u"><a href="https://www.threads.com/@f2e_willy" target="_blank" rel="noopener">threads.com/@f2e_willy</a></div>
</div>

</div>

<div class="card">

[![Merak · 坤安科技](./assets/merak-qr.svg)](https://kunansec.com/solutions/merak/)

<div class="cap">
  <div class="t">Merak · 坤安科技</div>
  <div class="d">零信任隱形網路防護平台——用 SDP 架構讓服務從公開網路上消失</div>
  <div class="u"><a href="https://kunansec.com/solutions/merak/" target="_blank" rel="noopener">kunansec.com/solutions/merak</a></div>
</div>

</div>

</div>

<style>
.promo {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2.2rem;
  width: 46rem;
  max-width: 100%;
  margin: 2rem auto 0;
}
.promo .card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.1rem 1rem;
  border-radius: 0.5rem;
  background: rgba(125, 125, 125, 0.08);
}
.promo .card img {
  width: 9rem;
  height: 9rem;
  border-radius: 0.35rem;
  box-shadow: 0 0 0 1px rgba(125, 125, 125, 0.18);
}
.promo .cap { margin-top: 0.85rem; }
.promo .cap .t {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.35;
}
.promo .cap .d {
  font-size: 0.78rem;
  opacity: 0.65;
  line-height: 1.5;
  margin-top: 0.3rem;
}
.promo .cap .u {
  font-family: var(--slidev-code-font-family, monospace);
  font-size: 0.72rem;
  margin-top: 0.35rem;
}
.promo .cap .u a {
  color: inherit;
  opacity: 0.5;
  text-decoration: none;
  border-bottom: 1px dashed rgba(125, 125, 125, 0.45);
  transition: opacity 0.15s;
}
.promo .cap .u a:hover { opacity: 0.9; }
.promo .card a { cursor: pointer; }
.promo .card > p { margin: 0; }
</style>

<!--
講者備忘：純工商，30~60 秒。
左邊是自己的 Threads，右邊是公司的產品 Merak（坤安科技的零信任 / SDP 平台）。
掃碼要留時間——講完停個十秒再翻頁。
-->

---
layout: center
class: text-center
---

# 謝謝大家

<div class="pt-6 text-sm opacity-60">
掃完了嗎？沒掃完我可以再停一下。
</div>

---
layout: center
class: text-center
---

# Q & A

<div class="text-sm opacity-70 -mt-2">有問題可以直接舉手，或掃 QR Code 丟到 Slido</div>

<div class="qa">

[![Slido Q&A](./assets/slido-qr.svg)](https://app.sli.do/event/ghy93JiL38xHc1Yebt4Y5A/live/questions)

<div class="cap">
  <div class="t">Slido · 線上提問</div>
  <div class="d">不用具名，也可以幫別人的問題按讚</div>
  <div class="u"><a href="https://app.sli.do/event/ghy93JiL38xHc1Yebt4Y5A/live/questions" target="_blank" rel="noopener">app.sli.do/event/ghy93JiL38xHc1Yebt4Y5A</a></div>
</div>

</div>

<style>
.qa {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 22rem;
  max-width: 100%;
  margin: 2rem auto 0;
  padding: 1.2rem 1rem;
  border-radius: 0.5rem;
  background: rgba(125, 125, 125, 0.08);
}
.qa img {
  width: 11rem;
  height: 11rem;
  border-radius: 0.35rem;
  box-shadow: 0 0 0 1px rgba(125, 125, 125, 0.18);
}
.qa .cap { margin-top: 0.85rem; }
.qa .cap .t {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.35;
}
.qa .cap .d {
  font-size: 0.78rem;
  opacity: 0.65;
  line-height: 1.5;
  margin-top: 0.3rem;
}
.qa .cap .u {
  font-family: var(--slidev-code-font-family, monospace);
  font-size: 0.72rem;
  margin-top: 0.35rem;
}
.qa .cap .u a {
  color: inherit;
  opacity: 0.5;
  text-decoration: none;
  border-bottom: 1px dashed rgba(125, 125, 125, 0.45);
  transition: opacity 0.15s;
}
.qa .cap .u a:hover { opacity: 0.9; }
.qa a { cursor: pointer; }
.qa > p { margin: 0; }
</style>

<!--
講者備忘：QA 環節。
QR Code 掃進去是 Slido，讓不好意思舉手的人也能問。
留在這一頁不要翻，一邊看 Slido 一邊回答。
-->

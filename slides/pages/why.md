---
layout: section
---

# 02 · 怎麼會開始想造輪子？

不就一個下拉選單，是能有多難？

---
layout: center
---

# 事情是這樣的

<div class="text-sm opacity-70 -mt-2">〈填：真實觸發點——哪一次需求 / 哪一個 bug 讓我動了念頭〉</div>

<div class="max-w-2xl mx-auto pt-6 leading-relaxed">

- 需求就一句話：「下拉選單長得跟設計稿一樣」
- 結果原生 `<select>` 的面板**根本改不動**——樣式全在瀏覽器手上
- 那找現成的元件庫總行了吧，然後就卡在：
  - 客製化只能改到某一層，再往裡面就得 hack
  - 為了一顆 Select，扛進一整包依賴
  - 真的出事的時候，我看不懂它**為什麼**要那樣寫

</div>

<div class="pt-6 text-center text-sm opacity-60">
於是那句話就冒出來了：「這我自己做應該也不難吧？」
</div>

<!--
講者備忘：這頁的張力就在「我以為很簡單」。
先讓聽眾點頭「對啊不就一個下拉選單」，後面 v3 的 overflow、v4 的鍵盤跟 ARIA 才會有落差感。
-->

---
layout: two-cols-header
---

# 那我造這顆輪子，到底是為了什麼？

<div class="text-sm opacity-70 -mt-2">先把目的講清楚，後面每一版的取捨才有得靠</div>

::left::

**是為了**

- 搞懂一顆 Select **到底難在哪**
- 把「別人早就幫我處理掉的事」自己踩一遍
- 有一顆**我說了算**的元件當練習場
- 逼自己從「會用」走到「敢設計 API」

::right::

**不是為了**

- 取代 Element Plus / Naive UI / Ant Design
- 證明現成元件庫做得不好

<div class="pt-4 text-sm opacity-70">
造輪子的產出從來不只是那顆輪子，<br />而是「看懂別人的輪子」這件事。
</div>

---
layout: center
class: text-center
---

# 那就開始吧

<div class="pt-4 text-sm opacity-70">
從最慫的一版開始：先包一層原生 <code>&lt;select&gt;</code>，再一版一版把它拆掉
</div>

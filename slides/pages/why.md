---
layout: section
---

# 02 · 怎麼會開始想造輪子？

不就一個下拉選單，是能有多難？

---
layout: center
---

# 事情是這樣的

<div class="text-sm opacity-70 -mt-2">起點不是「我想造輪子」，是一個搬不動的遷移案</div>

<div class="max-w-2xl mx-auto pt-6 leading-relaxed">

- 公司有一套**改不動**的 UI Library，於是我們想遷移到主流的那幾套
- 結果一對照就卡住了：**API 落差太大**，需求的方向跟現成 Library 想像的使用方式差太多
- 硬要接，最後就是包一層又一層的 adapter，把兩邊的壞處都扛回來
- 那條路走不通，剩下的選項就只有**自己手刻**

</div>

<div class="pt-6 text-center text-sm opacity-60">
於是真正的問題變成：<strong>要挑哪一顆底層的 Library 來墊底，才撐得住這些需求？</strong>
</div>

<!--
講者備忘：這頁要把「造輪子」從興趣講成**被逼出來的選項**。
重點是那個落差——不是現成的做得爛，是它跟我們的需求方向不一樣。
講完停一下，下一頁才接「那我造這顆輪子到底是為了什麼」。
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
---

# 叫 AI 做可以嗎？

<div class="text-sm opacity-70 -mt-2">可以。所以問題不是「做不做得出來」，是「你接不接得住」</div>

<div class="max-w-2xl mx-auto pt-6 leading-relaxed">

- 一句「幫我做一顆 Select」，現在真的生得出來，而且看起來還會動
- 但你得看得出來它**缺什麼**——鍵盤、ARIA、overflow、大量資料，少一樣就是使用者的 bug
- 你得判斷這些**有沒有必要**——不是每個專案都需要虛擬列表，多做的每一層都是要養的
- 你還得知道**怎麼測試**——沒有驗收標準的時候，「看起來會動」就是唯一的標準

</div>

<div class="pt-6 text-center text-sm opacity-70">
這三件事都不是 prompt 給得出來的，是自己踩過一遍才長出來的。
</div>

<!--
講者備忘：不要跟 AI 對立，反而要承認它做得出來。
重點是把價值從「寫得出來」挪到「看得懂、判斷得了、驗收得了」。
講完直接帶到下一頁的宣告：所以今天不看程式碼。
-->

---
layout: center
class: text-center
---

# 所以今天，我們不看任何程式碼

<div class="pt-6 text-xl leading-relaxed max-w-2xl mx-auto">
既然 AI 都寫得出來，<br />那今天就只講一件事：<strong>每一版背後藏著什麼故事。</strong>
</div>

<div class="pt-8 text-sm opacity-60">
會看到的只有畫面、行為，跟每一版壞掉的地方。
</div>

<!--
講者備忘：這是給聽眾的一個承諾，後面要守住——不貼 diff、不逐行講實作。
真的有人想看程式碼，repo 開著，會後再聊。
-->

---
layout: center
class: text-center
---

# 那就開始吧

<div class="pt-4 text-sm opacity-70">
從最慫的一版開始：先包一層原生 <code>&lt;select&gt;</code>，再一版一版把它拆掉
</div>

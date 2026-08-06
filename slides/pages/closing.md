---
layout: section
---

# 05 · 結語

要造一個輪子之前，請先去研究過別人的輪子

---
layout: center
---

# 八版之後，我才看懂別人為什麼那樣寫

<div class="text-sm opacity-70 -mt-2">那些「看起來很囉嗦」的設計，其實每一行都在還債</div>

<div class="max-w-3xl mx-auto pt-5 leading-relaxed text-sm">

| 以前看到 | 心裡想 | 自己做過才知道 |
| --- | --- | --- |
| 面板 `teleport` 到 `body` | 幹嘛這麼麻煩 | 不然一定被 `overflow: hidden` 切掉（v3） |
| 一整排 `aria-*` 屬性 | 這有人在用嗎 | 那是原生 `<select>` 免費送的，自己做就得全補（v4） |
| 定位算式又臭又長 | 過度工程吧 | 面板貼底要翻面，還要把高度夾住（v5） |
| 選項列表寫得超級繞 | 直接 `v-for` 是會怎樣 | 幾千筆的時候，只能渲染看得到的那幾列（v8） |

</div>

<div class="pt-5 text-center text-sm opacity-70">
每一版的複雜度，都不是設計者愛炫技，是被真實情境逼出來的。
</div>

---
layout: center
---

# 所以我的建議是

<div class="text-sm opacity-70 -mt-2">不是叫你「別造輪子」，是「換個順序造」</div>

<div class="max-w-2xl mx-auto pt-6 leading-relaxed">

1. **先去讀別人的輪子**——看它的 API、翻它的 issue、想它為什麼要加那個 prop
2. **再自己做一次**——不用做完，做到痛點冒出來就夠了
3. **然後回頭再讀一次**——這時候你看到的東西，跟第一次完全不一樣

</div>

<div class="pt-8 max-w-2xl mx-auto text-sm opacity-70 leading-relaxed">

造輪子最大的收穫從來不是那顆輪子，
是下次**選型**的時候，你問得出來的問題不一樣了。

</div>

---
layout: center
class: text-center
---

# 造輪子不是為了取代誰

<div class="pt-6 text-xl leading-relaxed max-w-2xl mx-auto">
是為了下次<strong>用別人的輪子</strong>的時候，<br />知道自己到底在用什麼。
</div>

<div class="pt-10 text-sm opacity-60">
所以：要造一個輪子之前，請先去研究過別人的輪子。
</div>

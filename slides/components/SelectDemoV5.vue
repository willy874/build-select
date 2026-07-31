<script setup lang="ts">
import { ref } from "vue";
// 直接引用元件庫原始碼中的 v4 / v5 Select —— 簡報 demo 與實作永遠同步
import { Select as SelectV4 } from "@v4";
import { Select as SelectV5 } from "@v5";
import type { SelectOption } from "@v5";

const fruits: SelectOption[] = [
  { label: "蘋果", value: "apple" },
  { label: "香蕉", value: "banana" },
  { label: "櫻桃", value: "cherry" },
  { label: "榴槤（缺貨）", value: "durian", disabled: true },
  { label: "葡萄", value: "grape" },
  { label: "奇異果", value: "kiwi" },
];

const modelV4 = ref<string | number | null>(null);
const modelV5 = ref<string | number | null>(null);
</script>

<template>
  <!-- spacer 把兩顆 Select 推到接近視窗底部,讓下方空間不足以觸發 flip -->
  <div class="demo">
    <div class="demo__spacer">↓ 兩顆都貼近視窗底部,同一高度展開比一比</div>
    <div class="demo__row">
      <div class="demo__col">
        <div class="demo__label demo__label--bad">v4 · 固定向下</div>
        <SelectV4 v-model="modelV4" :options="fruits" placeholder="請選擇水果" />
        <div class="demo__note demo__note--bad">⚠️ 面板往下開,超出視窗底部</div>
      </div>
      <div class="demo__col">
        <div class="demo__label demo__label--good">v5 · 智慧翻面</div>
        <SelectV5 v-model="modelV5" :options="fruits" placeholder="請選擇水果" />
        <div class="demo__note demo__note--good">✅ 空間不足 → 自動向上翻、夾住高度</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo {
  display: flex;
  flex-direction: column;
}
.demo__spacer {
  height: 34vh;
  display: flex;
  align-items: flex-end;
  color: #9ca3af;
  font-size: 12px;
}
.demo__row {
  display: flex;
  gap: 24px;
}
.demo__col {
  flex: 1;
  min-width: 0;
}
.demo__label {
  margin-bottom: 8px;
  font-size: 12px;
  font-family: ui-monospace, monospace;
}
.demo__label--bad {
  color: #ef4444;
}
.demo__label--good {
  color: #16a34a;
}
.demo__note {
  margin-top: 8px;
  font-size: 12px;
}
.demo__note--bad {
  color: #ef4444;
}
.demo__note--good {
  color: #16a34a;
}
</style>

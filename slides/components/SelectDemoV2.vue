<script setup lang="ts">
import { ref } from "vue";
// 直接引用元件庫原始碼中的 v2 Select —— 簡報 demo 與實作永遠同步
import { Select } from "@v2";
import type { SelectOption } from "@v2";

const fruits: SelectOption[] = [
  { label: "蘋果", value: "apple" },
  { label: "香蕉", value: "banana" },
  { label: "櫻桃", value: "cherry" },
  { label: "榴槤（缺貨）", value: "durian", disabled: true },
];

const model = ref<string | number | null>(null);
</script>

<template>
  <!-- @keydown/@keyup.stop: 讓 demo 裡的鍵盤操作不要冒泡出去觸發 Slidev 的翻頁快捷鍵 -->
  <div class="demo" @keydown.stop @keyup.stop>
    <Select v-model="model" :options="fruits" placeholder="請選擇水果" />
    <div class="demo__state">
      目前選取：<code>{{ model ?? "null" }}</code>
    </div>
  </div>
</template>

<style scoped>
.demo {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
}
.demo__state {
  font-size: 14px;
  color: #6b7280;
}
.demo__state code {
  padding: 2px 6px;
  border-radius: 4px;
  background: #f3f4f6;
  color: #2563eb;
}
</style>

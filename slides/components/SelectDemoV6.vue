<script setup lang="ts">
import { ref } from "vue";
// 直接引用元件庫原始碼中的 v6 Select —— 簡報 demo 與實作永遠同步
import { Select as SelectV6 } from "../../src/packages/v6";
import type { SelectOption } from "../../src/packages/v6";

const fruits: SelectOption[] = [
  { label: "蘋果", value: "apple" },
  { label: "香蕉", value: "banana" },
  { label: "櫻桃", value: "cherry" },
  { label: "榴槤（缺貨）", value: "durian", disabled: true },
  { label: "葡萄", value: "grape" },
  { label: "奇異果", value: "kiwi" },
  { label: "芒果", value: "mango" },
  { label: "西瓜", value: "watermelon" },
];

const model = ref<string | number | null>(null);
</script>

<template>
  <div class="demo">
    <div class="demo__label">v6 · filterable(可打拼音)</div>
    <SelectV6 v-model="model" :options="fruits" filterable placeholder="搜尋水果" />

    <ul class="demo__hints">
      <li>首字母:<kbd>pg</kbd>→蘋果、<kbd>xj</kbd>→香蕉、<kbd>qyg</kbd>→奇異果</li>
      <li>全拼:<kbd>xiangjiao</kbd>→香蕉、<kbd>putao</kbd>→葡萄</li>
      <li>直接打中文:<kbd>果</kbd>、<kbd>瓜</kbd></li>
      <li>命中片段會<b>高亮</b>;無命中顯示「無結果」</li>
    </ul>
  </div>
</template>

<style scoped>
.demo {
  display: flex;
  flex-direction: column;
}
.demo__label {
  margin-bottom: 8px;
  font-size: 12px;
  font-family: ui-monospace, monospace;
  color: #16a34a;
}
.demo__hints {
  margin: 16px 0 0;
  padding-left: 2px;
  list-style: none;
  font-size: 12px;
  line-height: 2;
  color: #4b5563;
}
.demo__hints kbd {
  padding: 1px 6px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #f9fafb;
  font-size: 11px;
}
.demo__hints b {
  color: #2563eb;
}
</style>

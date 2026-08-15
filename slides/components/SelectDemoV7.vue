<script setup lang="ts">
import { ref } from "vue";
// 直接引用元件庫原始碼中的 v7 Select —— 簡報 demo 與實作永遠同步
import { Select as SelectV7 } from "@v7";
import type { SelectOption, SelectValue } from "@v7";

const cities: SelectOption[] = [
  { label: "臺北", value: "tpe" },
  { label: "新北", value: "ntpc" },
  { label: "桃園", value: "tyn" },
  { label: "臺中", value: "txg" },
  { label: "臺南", value: "tnn" },
  { label: "高雄", value: "khh" },
  { label: "基隆", value: "kel" },
  { label: "新竹", value: "hsz" },
  { label: "嘉義", value: "cyi" },
  { label: "花蓮", value: "hun" },
];

const many = ref<SelectValue[]>(["tpe", "khh"]);
const plain = ref<SelectValue[]>([]);
</script>

<template>
  <!-- @keydown/@keyup.stop: 讓 demo 裡的鍵盤操作不要冒泡出去觸發 Slidev 的翻頁快捷鍵 -->
  <div class="demo" @keydown.stop @keyup.stop>
    <div class="demo__block">
      <div class="demo__label">multiple + filterable(可搜尋的多選)</div>
      <SelectV7
        v-model="many"
        :options="cities"
        multiple
        filterable
        placeholder="搜尋並多選縣市"
      />
    </div>

    <div class="demo__block">
      <div class="demo__label">multiple(純多選,chips)</div>
      <SelectV7 v-model="plain" :options="cities" multiple placeholder="請選擇縣市" />
    </div>

    <ul class="demo__hints">
      <li>點選項 toggle 加入 / 移除,面板<b>不關</b>,已選顯示 <b>✓</b></li>
      <li>chips 的 <kbd>×</kbd> 或搜尋框空按 <kbd>Backspace</kbd> 移除</li>
      <li>搜尋可打拼音:<kbd>gx</kbd>→高雄、<kbd>tn</kbd>→臺南</li>
    </ul>
  </div>
</template>

<style scoped>
.demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.demo__label {
  margin-bottom: 8px;
  font-size: 12px;
  font-family: ui-monospace, monospace;
  color: #16a34a;
}
.demo__hints {
  margin: 4px 0 0;
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

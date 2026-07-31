<script setup lang="ts">
import { ref } from "vue";
// 直接引用元件庫原始碼中的 v2 / v3 Select —— 簡報 demo 與實作永遠同步
import { Select as SelectV2 } from "@v2";
import { Select as SelectV3 } from "@v3";
import type { SelectOption } from "@v3";

const fruits: SelectOption[] = [
  { label: "蘋果", value: "apple" },
  { label: "香蕉", value: "banana" },
  { label: "櫻桃", value: "cherry" },
  { label: "榴槤（缺貨）", value: "durian", disabled: true },
];

const modelV2 = ref<string | number | null>(null);
const modelV3 = ref<string | number | null>(null);
</script>

<template>
  <div class="cmp">
    <!-- 同一張 overflow: hidden 的矮卡片，左右分別放 v2 / v3 -->
    <div class="cmp__col">
      <div class="cmp__label cmp__label--bad">v2 · position: absolute</div>
      <div class="cmp__card cmp__card--bad">
        <SelectV2 v-model="modelV2" :options="fruits" placeholder="請選擇水果" />
      </div>
      <div class="cmp__note cmp__note--bad">⚠️ 面板被卡片 overflow 裁切</div>
    </div>

    <div class="cmp__col">
      <div class="cmp__label cmp__label--good">v3 · Portal → body</div>
      <div class="cmp__card cmp__card--good">
        <SelectV3 v-model="modelV3" :options="fruits" placeholder="請選擇水果" />
      </div>
      <div class="cmp__note cmp__note--good">✅ 面板浮出卡片、完整顯示</div>
    </div>
  </div>
</template>

<style scoped>
.cmp {
  display: flex;
  gap: 24px;
}
.cmp__col {
  flex: 1;
  min-width: 0;
}
.cmp__label {
  margin-bottom: 6px;
  font-size: 12px;
  font-family: ui-monospace, monospace;
}
.cmp__label--bad {
  color: #ef4444;
}
.cmp__label--good {
  color: #16a34a;
}
.cmp__card {
  height: 84px;
  padding: 16px;
  border-radius: 8px;
  overflow: hidden;
}
.cmp__card--bad {
  border: 1px dashed #ef4444;
  background: #fff7f7;
}
.cmp__card--good {
  border: 1px dashed #22c55e;
  background: #f3fdf6;
}
.cmp__note {
  margin-top: 8px;
  font-size: 12px;
}
.cmp__note--bad {
  color: #ef4444;
}
.cmp__note--good {
  color: #16a34a;
}
</style>

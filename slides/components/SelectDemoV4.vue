<script setup lang="ts">
import { ref } from "vue";
// 直接引用元件庫原始碼中的 v2 / v4 Select —— 簡報 demo 與實作永遠同步
import { Select as SelectV2 } from "@v2";
import { Select as SelectV4 } from "@v4";
import type { SelectOption } from "@v4";

const fruits: SelectOption[] = [
  { label: "蘋果", value: "apple" },
  { label: "香蕉", value: "banana" },
  { label: "櫻桃", value: "cherry" },
  { label: "榴槤（缺貨）", value: "durian", disabled: true },
  { label: "葡萄", value: "grape" },
  { label: "奇異果", value: "kiwi" },
];

const modelV2 = ref<string | number | null>(null);
const modelV4 = ref<string | number | null>(null);
</script>

<template>
  <div class="cmp">
    <!-- 左：v2 自訂 div，只能用滑鼠 -->
    <div class="cmp__col">
      <div class="cmp__label cmp__label--bad">v2 · 自訂 div，無鍵盤</div>
      <div class="cmp__stage">
        <SelectV2 v-model="modelV2" :options="fruits" placeholder="請選擇水果" />
      </div>
      <ul class="cmp__note cmp__note--bad">
        <li>✗ 無法 <kbd>Tab</kbd> 聚焦、沒有 focus ring</li>
        <li>✗ 方向鍵 / 打字 / <kbd>Enter</kbd> 全無反應</li>
        <li>✗ 螢幕閱讀器讀不出語意</li>
      </ul>
    </div>

    <!-- 右：v4 補回鍵盤 + a11y -->
    <div class="cmp__col">
      <div class="cmp__label cmp__label--good">v4 · combobox，全鍵盤可操作</div>
      <div class="cmp__stage">
        <SelectV4 v-model="modelV4" :options="fruits" placeholder="請選擇水果" />
      </div>
      <ul class="cmp__note cmp__note--good">
        <li>✓ <kbd>Tab</kbd> 聚焦、清楚 focus ring</li>
        <li>✓ <kbd>↑</kbd><kbd>↓</kbd><kbd>Home</kbd><kbd>End</kbd> 移動、<kbd>Enter</kbd> 選取、<kbd>Esc</kbd> 關閉</li>
        <li>✓ 打字 typeahead、停用項自動略過</li>
        <li>✓ <code>role=combobox / listbox / option</code> 語意</li>
      </ul>
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
  margin-bottom: 8px;
  font-size: 12px;
  font-family: ui-monospace, monospace;
}
.cmp__label--bad {
  color: #ef4444;
}
.cmp__label--good {
  color: #16a34a;
}
.cmp__stage {
  padding: 16px;
  border-radius: 8px;
  border: 1px dashed #d1d5db;
  background: #fafafa;
}
.cmp__note {
  margin: 10px 0 0;
  padding-left: 2px;
  list-style: none;
  font-size: 12px;
  line-height: 1.9;
}
.cmp__note--bad {
  color: #ef4444;
}
.cmp__note--good {
  color: #16a34a;
}
.cmp__note kbd {
  padding: 1px 5px;
  border: 1px solid currentColor;
  border-radius: 4px;
  font-size: 11px;
  opacity: 0.9;
}
.cmp__note code {
  font-size: 11px;
}
</style>

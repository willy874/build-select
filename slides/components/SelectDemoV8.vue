<script setup lang="ts">
import { ref } from "vue";
// 直接引用元件庫原始碼中的 v8 Select —— 簡報 demo 與實作永遠同步
import { Select as SelectV8 } from "@v8";
import type { SelectOption, SelectValue } from "@v8";

// 模擬遠端資料源:1000 筆使用者,依 query 過濾後分頁回傳
const ALL: SelectOption[] = Array.from({ length: 1000 }, (_, i) => ({
  label: `使用者 ${String(i + 1).padStart(4, "0")}`,
  value: i + 1,
}));
const PAGE = 30;
function fetchPage(query: string, page: number) {
  const pool = query.trim() ? ALL.filter((u) => u.label.includes(query)) : ALL;
  const start = page * PAGE;
  const items = pool.slice(start, start + PAGE);
  return new Promise<{ items: SelectOption[]; hasMore: boolean }>((res) =>
    setTimeout(() => res({ items, hasMore: start + PAGE < pool.length }), 400)
  );
}

const model = ref<SelectValue | null>(null);
const options = ref<SelectOption[]>([]);
const loading = ref(false);
const finished = ref(false);
const q = ref("");
let page = 0;

async function load(reset: boolean) {
  if (loading.value) return;
  loading.value = true;
  if (reset) {
    page = 0;
    options.value = [];
    finished.value = false;
  }
  const { items, hasMore } = await fetchPage(q.value, page);
  options.value = reset ? items : [...options.value, ...items];
  finished.value = !hasMore;
  page += 1;
  loading.value = false;
}

function onSearch(query: string) {
  q.value = query;
  load(true);
}
function onLoadMore() {
  if (!finished.value) load(false);
}
</script>

<template>
  <!-- @keydown/@keyup.stop: 讓 demo 裡的鍵盤操作不要冒泡出去觸發 Slidev 的翻頁快捷鍵 -->
  <div class="demo" @keydown.stop @keyup.stop>
    <div class="demo__label">remote + 無限滾動 + 虛擬列表(1000 筆使用者)</div>
    <SelectV8
      v-model="model"
      :options="options"
      :loading="loading"
      :finished="finished"
      remote
      filterable
      virtual
      placeholder="搜尋使用者"
      @search="onSearch"
      @load-more="onLoadMore"
    />

    <ul class="demo__hints">
      <li>聚焦即載入第一頁;捲到底自動載下一頁(顯示「載入中…」)</li>
      <li>打字(如 <kbd>0123</kbd>)重新遠端查詢</li>
      <li>DOM 只渲染可視範圍的十幾列——上千筆也不卡</li>
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
</style>

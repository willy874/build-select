<script setup lang="ts">
/**
 * Portal — 把 slot 內容「傳送」到 DOM 樹的其他位置（預設 <body>）。
 *
 * 這是對 Vue 內建 <Teleport> 的一層薄封裝，額外提供：
 * - 合理的預設目標（body），避免每個呼叫端重寫 `to="body"`
 * - 型別化的 `to` / `disabled` API，作為元件庫的可重用基礎元件
 *
 * 典型用途：下拉面板、Modal、Tooltip 等「需要脫離父層 overflow /
 * stacking context 束縛」的浮層內容。
 */
withDefaults(
  defineProps<{
    /** 傳送目標：CSS selector 或 DOM 節點，預設 <body> */
    to?: string | HTMLElement;
    /** 停用傳送：內容留在原地渲染（方便除錯或 SSR 降級） */
    disabled?: boolean;
  }>(),
  {
    to: "body",
    disabled: false,
  }
);
</script>

<template>
  <Teleport :to="to" :disabled="disabled">
    <slot />
  </Teleport>
</template>

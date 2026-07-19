<script setup lang="ts">
/**
 * SelectValue — 只負責顯示「已選 label 或 placeholder」。
 *
 * 從 trigger 殼中獨立出來的「會變的內容區」:值的呈現方式未來可能改變,
 * 但 trigger 殼的 combobox / aria / 鍵盤 / focus 行為不變——沿這條縫拆開。
 */
defineProps<{
  /** 要顯示的文字(已選項的 label,或未選時的 placeholder) */
  label: string;
  /** 是否為 placeholder 狀態(套用淡色樣式) */
  isPlaceholder: boolean;
}>();
</script>

<template>
  <span
    class="bs-select__value"
    :class="{ 'bs-select__value--placeholder': isPlaceholder }"
  >
    {{ label }}
  </span>
</template>

<style scoped>
.bs-select__value {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bs-select__value--placeholder {
  color: #9ca3af;
}
</style>

<script setup lang="ts">
import type { SelectOption, SelectValue } from "./types";

/**
 * SelectChips — 多選時已選項的可移除標籤(chips)。
 * 純呈現:收已選項清單,發 remove 事件。供 SelectMultiTrigger 與
 * filterable 的 SelectSearchInput 共用。
 */
defineProps<{
  options: SelectOption[];
  disabled: boolean;
}>();

const emit = defineEmits<{
  (e: "remove", value: SelectValue): void;
}>();
</script>

<template>
  <span
    v-for="opt in options"
    :key="opt.value"
    class="bs-select__chip"
  >
    <span class="bs-select__chip-label">{{ opt.label }}</span>
    <button
      v-if="!disabled"
      type="button"
      class="bs-select__chip-x"
      tabindex="-1"
      :aria-label="`移除 ${opt.label}`"
      @click.stop="emit('remove', opt.value)"
      @mousedown.stop.prevent
    >
      ×
    </button>
  </span>
</template>

<style scoped>
.bs-select__chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  padding: 1px 4px 1px 8px;
  border-radius: 4px;
  background-color: #eff6ff;
  color: #1d4ed8;
  font-size: 12px;
  line-height: 1.6;
}

.bs-select__chip-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bs-select__chip-x {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  border: none;
  border-radius: 3px;
  background: transparent;
  color: #1d4ed8;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
}

.bs-select__chip-x:hover {
  background-color: #dbeafe;
}
</style>

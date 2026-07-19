<script setup lang="ts">
import type { SelectOption } from "./types";

/**
 * SelectOption — 單一選項列(<li role="option">)。
 *
 * 純呈現:收 props、發事件,不持有業務狀態。內容以 default slot 佔位
 * (預設顯示 label),為未來的自訂選項渲染保留縫隙。
 */
defineProps<{
  option: SelectOption;
  /** 是否為目前已選值 */
  selected: boolean;
  /** 是否為鍵盤 / 滑鼠高亮項 */
  active: boolean;
  /** 選項 id(對應 aria-activedescendant) */
  id: string;
}>();

const emit = defineEmits<{
  (e: "select"): void;
  (e: "activate"): void;
}>();
</script>

<template>
  <li
    :id="id"
    role="option"
    class="bs-select__option"
    :class="{
      'bs-select__option--selected': selected,
      'bs-select__option--active': active,
      'bs-select__option--disabled': option.disabled,
    }"
    :aria-selected="selected"
    :aria-disabled="option.disabled || undefined"
    @click="emit('select')"
    @mouseenter="!option.disabled && emit('activate')"
  >
    <slot>{{ option.label }}</slot>
  </li>
</template>

<style scoped>
.bs-select__option {
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}

/* 鍵盤高亮(active)與滑鼠 hover 統一為同一種視覺,由 active 驅動 */
.bs-select__option--active {
  background-color: #eff6ff;
}

.bs-select__option--selected {
  color: #2563eb;
  font-weight: 600;
}

.bs-select__option--disabled {
  color: #9ca3af;
  cursor: not-allowed;
}
</style>

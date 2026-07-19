<script setup lang="ts">
import { ref } from "vue";
import type { SelectSize } from "./types";

/**
 * SelectTrigger — combobox「殼」:只管互動與無障礙語意,不管顯示什麼內容。
 *
 * 穩定不變的職責(aria / tabindex / focus / 鍵盤轉發)封在這裡;
 * 會變的內容(值 / 未來的輸入框)由 default slot 提供。
 */
defineProps<{
  isOpen: boolean;
  disabled: boolean;
  size: SelectSize;
  /** 對應面板的 id(aria-controls) */
  controls: string;
  /** 目前高亮選項的 id(aria-activedescendant) */
  activeDescendant?: string;
}>();

const emit = defineEmits<{
  (e: "toggle"): void;
  (e: "keydown", ev: KeyboardEvent): void;
}>();

const el = ref<HTMLElement | null>(null);
function focus() {
  el.value?.focus();
}
// 讓父層在關閉面板時能把焦點收回 trigger
defineExpose({ focus });
</script>

<template>
  <div
    ref="el"
    class="bs-select__trigger"
    :class="[
      `bs-select__trigger--${size}`,
      { 'bs-select__trigger--open': isOpen, 'bs-select__trigger--disabled': disabled },
    ]"
    role="combobox"
    :tabindex="disabled ? -1 : 0"
    :aria-expanded="isOpen"
    :aria-controls="controls"
    aria-haspopup="listbox"
    :aria-activedescendant="activeDescendant"
    :aria-disabled="disabled || undefined"
    @click="emit('toggle')"
    @keydown="emit('keydown', $event)"
  >
    <slot />
    <span class="bs-select__arrow" />
  </div>
</template>

<style scoped>
.bs-select__trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  min-width: 160px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: #fff;
  cursor: pointer;
  user-select: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  font-size: 14px;
  line-height: 1.4;
  color: #111827;
}

/* a11y:鍵盤聚焦時顯示清楚的 focus ring */
.bs-select__trigger:focus-visible {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.35);
}

.bs-select__trigger--open {
  border-color: #2563eb;
}

.bs-select__trigger--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f3f4f6;
}

.bs-select__arrow {
  flex: none;
  width: 8px;
  height: 8px;
  border-right: 1.5px solid #6b7280;
  border-bottom: 1.5px solid #6b7280;
  transform: rotate(45deg) translateY(-2px);
  transition: transform 0.15s ease;
}

.bs-select__trigger--open .bs-select__arrow {
  transform: rotate(-135deg) translateY(-2px);
}

.bs-select__trigger--small {
  padding: 4px 8px;
  font-size: 12px;
}

.bs-select__trigger--medium {
  padding: 8px 12px;
  font-size: 14px;
}

.bs-select__trigger--large {
  padding: 12px 16px;
  font-size: 16px;
}
</style>

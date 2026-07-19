<script setup lang="ts">
import { ref } from "vue";
import type { SelectSize } from "./types";

/**
 * SelectSearchInput — filterable 模式的 trigger:可輸入的 combobox。
 *
 * 依 ARIA editable combobox 模式,`role="combobox"` 與 `aria-autocomplete="list"`
 * 落在 input 本身。input 的值**永遠等於 query**;已選值 / placeholder 以一層
 * 非互動的 overlay 顯示(query 為空時),避免「已選 label 混進搜尋字串」的問題。
 */
defineProps<{
  isOpen: boolean;
  disabled: boolean;
  size: SelectSize;
  /** 搜尋關鍵字(= input 的值) */
  query: string;
  /** 已選項的顯示文字(query 為空時以 overlay 顯示) */
  selectedLabel: string | null;
  placeholder: string;
  controls: string;
  activeDescendant?: string;
}>();

const emit = defineEmits<{
  (e: "input", value: string): void;
  (e: "toggle"): void;
  (e: "keydown", ev: KeyboardEvent): void;
}>();

const el = ref<HTMLInputElement | null>(null);
function focus() {
  el.value?.focus();
}
defineExpose({ focus });
</script>

<template>
  <div
    class="bs-select__trigger"
    :class="[
      `bs-select__trigger--${size}`,
      { 'bs-select__trigger--open': isOpen, 'bs-select__trigger--disabled': disabled },
    ]"
    @mousedown="!disabled && !isOpen && emit('toggle')"
  >
    <span class="bs-select__field">
      <input
        ref="el"
        class="bs-select__input"
        type="text"
        role="combobox"
        autocomplete="off"
        :value="query"
        :disabled="disabled"
        :tabindex="disabled ? -1 : 0"
        :aria-expanded="isOpen"
        :aria-controls="controls"
        aria-haspopup="listbox"
        aria-autocomplete="list"
        :aria-activedescendant="activeDescendant"
        @input="emit('input', ($event.target as HTMLInputElement).value)"
        @keydown="emit('keydown', $event)"
      />
      <!-- query 為空時顯示已選值(實色)或 placeholder(淡色);不攔截互動 -->
      <span
        v-if="query === ''"
        class="bs-select__overlay"
        :class="{ 'bs-select__overlay--placeholder': !selectedLabel }"
      >
        {{ selectedLabel ?? placeholder }}
      </span>
    </span>
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
  cursor: text;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  font-size: 14px;
  line-height: 1.4;
  color: #111827;
}

/* a11y:input 聚焦時,整個 trigger 顯示 focus ring */
.bs-select__trigger:focus-within {
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

.bs-select__field {
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
}

.bs-select__input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: inherit;
}

.bs-select__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  pointer-events: none;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #111827;
}

.bs-select__overlay--placeholder {
  color: #9ca3af;
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
}
.bs-select__trigger--small .bs-select__input,
.bs-select__trigger--small .bs-select__overlay {
  font-size: 12px;
}
.bs-select__trigger--medium {
  padding: 8px 12px;
}
.bs-select__trigger--medium .bs-select__input,
.bs-select__trigger--medium .bs-select__overlay {
  font-size: 14px;
}
.bs-select__trigger--large {
  padding: 12px 16px;
}
.bs-select__trigger--large .bs-select__input,
.bs-select__trigger--large .bs-select__overlay {
  font-size: 16px;
}
</style>

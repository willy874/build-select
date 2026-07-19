<script setup lang="ts">
import { ref } from "vue";
import SelectChips from "./SelectChips.vue";
import type { SelectOption, SelectSize, SelectValue } from "./types";

/**
 * SelectMultiTrigger — 多選 + 非 filterable 的 trigger。
 * `<div role="combobox">` 內放 chips(已選)與 placeholder(未選時),整體可 Tab 聚焦。
 */
defineProps<{
  isOpen: boolean;
  disabled: boolean;
  size: SelectSize;
  selectedOptions: SelectOption[];
  placeholder: string;
  controls: string;
  activeDescendant?: string;
}>();

const emit = defineEmits<{
  (e: "toggle"): void;
  (e: "keydown", ev: KeyboardEvent): void;
  (e: "remove", value: SelectValue): void;
}>();

const el = ref<HTMLElement | null>(null);
function focus() {
  el.value?.focus();
}
defineExpose({ focus });
</script>

<template>
  <div
    ref="el"
    class="bs-select__trigger bs-select__trigger--multi"
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
    <span class="bs-select__chips">
      <SelectChips
        :options="selectedOptions"
        :disabled="disabled"
        @remove="emit('remove', $event)"
      />
      <span v-if="!selectedOptions.length" class="bs-select__value--placeholder">
        {{ placeholder }}
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
  cursor: pointer;
  user-select: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  font-size: 14px;
  line-height: 1.4;
  color: #111827;
}

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

.bs-select__chips {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
}

.bs-select__value--placeholder {
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
  font-size: 12px;
}
.bs-select__trigger--medium {
  padding: 6px 12px;
  font-size: 14px;
}
.bs-select__trigger--large {
  padding: 10px 16px;
  font-size: 16px;
}
</style>

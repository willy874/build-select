<script setup lang="ts">
import { computed, ref } from "vue";
import SelectChips from "./SelectChips.vue";
import type { SelectOption, SelectSize, SelectValue } from "./types";

/**
 * SelectSearchInput — filterable 模式的 trigger:可輸入的 combobox。
 *
 * `role="combobox"` / `aria-autocomplete="list"` 落在 `<input>`;input 值永遠 = query。
 * 單選時已選值以 overlay 顯示;多選(v7)時已選以 chips 顯示在 input 前(可移除)。
 */
const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    disabled: boolean;
    size: SelectSize;
    query: string;
    /** 單選:已選項的顯示文字(query 為空時以 overlay 顯示) */
    selectedLabel: string | null;
    placeholder: string;
    controls: string;
    activeDescendant?: string;
    /** 多選:已選 chips */
    multiple?: boolean;
    chips?: SelectOption[];
  }>(),
  { multiple: false, chips: () => [] }
);

const emit = defineEmits<{
  (e: "input", value: string): void;
  (e: "toggle"): void;
  (e: "keydown", ev: KeyboardEvent): void;
  (e: "remove", value: SelectValue): void;
}>();

const el = ref<HTMLInputElement | null>(null);
function focus() {
  el.value?.focus();
}
defineExpose({ focus });

// query 為空時顯示 overlay:多選看 chips 是否為空、單選看已選 label
const showOverlay = computed(() => {
  if (props.query !== "") return false;
  return props.multiple ? props.chips.length === 0 : true;
});
const overlayText = computed(() =>
  props.multiple ? props.placeholder : props.selectedLabel ?? props.placeholder
);
const overlayMuted = computed(() =>
  props.multiple ? true : !props.selectedLabel
);
</script>

<template>
  <div
    class="bs-select__trigger"
    :class="[
      `bs-select__trigger--${size}`,
      {
        'bs-select__trigger--open': isOpen,
        'bs-select__trigger--disabled': disabled,
        'bs-select__trigger--multi': multiple,
      },
    ]"
    @mousedown="!disabled && !isOpen && emit('toggle')"
  >
    <span class="bs-select__control">
      <SelectChips
        v-if="multiple"
        :options="chips"
        :disabled="disabled"
        @remove="emit('remove', $event)"
      />
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
        <span
          v-if="showOverlay"
          class="bs-select__overlay"
          :class="{ 'bs-select__overlay--placeholder': overlayMuted }"
        >
          {{ overlayText }}
        </span>
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

.bs-select__control {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
}

.bs-select__field {
  position: relative;
  flex: 1;
  min-width: 60px;
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
  padding: 6px 12px;
}
.bs-select__trigger--medium .bs-select__input,
.bs-select__trigger--medium .bs-select__overlay {
  font-size: 14px;
}
.bs-select__trigger--large {
  padding: 8px 16px;
}
.bs-select__trigger--large .bs-select__input,
.bs-select__trigger--large .bs-select__overlay {
  font-size: 16px;
}
</style>

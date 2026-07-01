<script setup lang="ts">
import { computed } from "vue";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

type SelectSize = "small" | "medium" | "large";

const props = withDefaults(
  defineProps<{
    /** 目前選取的值（v-model） */
    modelValue?: string | number | null;
    /** 選項清單 */
    options?: SelectOption[];
    /** 未選取時的提示文字 */
    placeholder?: string;
    /** 尺寸 */
    size?: SelectSize;
    /** 是否停用 */
    disabled?: boolean;
  }>(),
  {
    modelValue: null,
    options: () => [],
    placeholder: "請選擇",
    size: "medium",
    disabled: false,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number | null): void;
  (e: "change", value: string | number | null): void;
}>();

const classes = computed(() => ["bs-select", `bs-select--${props.size}`]);

function onChange(event: Event) {
  const raw = (event.target as HTMLSelectElement).value;
  const matched = props.options.find((opt) => String(opt.value) === raw);
  const value = matched ? matched.value : null;
  emit("update:modelValue", value);
  emit("change", value);
}
</script>

<template>
  <select
    :class="classes"
    :disabled="disabled"
    :value="modelValue === null ? '' : String(modelValue)"
    @change="onChange"
  >
    <option value="" disabled hidden>{{ placeholder }}</option>
    <option
      v-for="opt in options"
      :key="opt.value"
      :value="String(opt.value)"
      :disabled="opt.disabled"
    >
      {{ opt.label }}
    </option>
  </select>
</template>

<style scoped>
.bs-select {
  display: inline-flex;
  box-sizing: border-box;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: #fff;
  color: #111827;
  font-size: 14px;
  line-height: 1.4;
  cursor: pointer;
  transition: border-color 0.15s ease;
}

.bs-select:focus {
  outline: none;
  border-color: #2563eb;
}

.bs-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f3f4f6;
}

.bs-select--small {
  padding: 4px 8px;
  font-size: 12px;
}

.bs-select--medium {
  padding: 8px 12px;
  font-size: 14px;
}

.bs-select--large {
  padding: 12px 16px;
  font-size: 16px;
}
</style>

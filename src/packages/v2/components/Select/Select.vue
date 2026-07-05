<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

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

const rootRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);

const selectedOption = computed(
  () => props.options.find((opt) => opt.value === props.modelValue) ?? null
);

const rootClasses = computed(() => [
  "bs-select",
  `bs-select--${props.size}`,
  {
    "bs-select--open": isOpen.value,
    "bs-select--disabled": props.disabled,
  },
]);

function toggle() {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
}

function selectOption(opt: SelectOption) {
  if (opt.disabled) return;
  if (opt.value !== props.modelValue) {
    emit("update:modelValue", opt.value);
    emit("change", opt.value);
  }
  isOpen.value = false;
}

function onDocumentPointerDown(event: PointerEvent) {
  if (!rootRef.value?.contains(event.target as Node)) isOpen.value = false;
}

onMounted(() => {
  document.addEventListener("pointerdown", onDocumentPointerDown);
});

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onDocumentPointerDown);
});
</script>

<template>
  <div ref="rootRef" :class="rootClasses">
    <div class="bs-select__trigger" @click="toggle">
      <span
        class="bs-select__value"
        :class="{ 'bs-select__value--placeholder': !selectedOption }"
      >
        {{ selectedOption ? selectedOption.label : placeholder }}
      </span>
      <span class="bs-select__arrow" />
    </div>

    <ul v-show="isOpen" class="bs-select__dropdown">
      <li
        v-for="opt in options"
        :key="opt.value"
        class="bs-select__option"
        :class="{
          'bs-select__option--selected': opt.value === modelValue,
          'bs-select__option--disabled': opt.disabled,
        }"
        @click="selectOption(opt)"
      >
        {{ opt.label }}
      </li>
      <li v-if="!options.length" class="bs-select__empty">無選項</li>
    </ul>
  </div>
</template>

<style scoped>
.bs-select {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 1.4;
  color: #111827;
}

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
  transition: border-color 0.15s ease;
}

.bs-select--open .bs-select__trigger {
  border-color: #2563eb;
}

.bs-select--disabled .bs-select__trigger {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f3f4f6;
}

.bs-select__value {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.bs-select--open .bs-select__arrow {
  transform: rotate(-135deg) translateY(-2px);
}

.bs-select__dropdown {
  position: absolute;
  z-index: 10;
  top: calc(100% + 4px);
  left: 0;
  box-sizing: border-box;
  min-width: 100%;
  max-height: 240px;
  margin: 0;
  padding: 4px;
  overflow-y: auto;
  list-style: none;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.bs-select__option {
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}

.bs-select__option:hover {
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

.bs-select__option--disabled:hover {
  background-color: transparent;
}

.bs-select__empty {
  padding: 6px 10px;
  color: #9ca3af;
}

.bs-select--small .bs-select__trigger {
  padding: 4px 8px;
  font-size: 12px;
}

.bs-select--medium .bs-select__trigger {
  padding: 8px 12px;
  font-size: 14px;
}

.bs-select--large .bs-select__trigger {
  padding: 12px 16px;
  font-size: 16px;
}

.bs-select--small {
  font-size: 12px;
}

.bs-select--large {
  font-size: 16px;
}
</style>

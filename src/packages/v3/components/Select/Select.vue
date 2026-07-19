<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, nextTick, ref, watch } from "vue";
import Portal from "../Portal/Portal.vue";

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
const dropdownRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);

/**
 * 面板的行內定位樣式。
 *
 * v3 關鍵：面板被 Portal 傳送到 <body> 後，已脫離元件原本的父層，
 * 因此不能再用 `position: absolute` 相對父層定位；改用 `position: fixed`
 * 搭配 trigger 的 viewport 座標（getBoundingClientRect）即時計算。
 * 如此一來父層無論 overflow / z-index 如何，面板都不會被裁切或壓在下方。
 */
const dropdownStyle = ref<Record<string, string>>({});

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

const dropdownClasses = computed(() => [
  "bs-select__dropdown",
  `bs-select__dropdown--${props.size}`,
]);

function updatePosition() {
  const el = rootRef.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  dropdownStyle.value = {
    position: "fixed",
    top: `${Math.round(rect.bottom + 4)}px`,
    left: `${Math.round(rect.left)}px`,
    minWidth: `${Math.round(rect.width)}px`,
  };
}

async function open() {
  isOpen.value = true;
  // 先計算一次，等面板掛載後再校正（此時可拿到 trigger 尺寸）
  updatePosition();
  await nextTick();
  updatePosition();
}

function close() {
  isOpen.value = false;
}

function toggle() {
  if (props.disabled) return;
  isOpen.value ? close() : open();
}

function selectOption(opt: SelectOption) {
  if (opt.disabled) return;
  if (opt.value !== props.modelValue) {
    emit("update:modelValue", opt.value);
    emit("change", opt.value);
  }
  close();
}

function onDocumentPointerDown(event: PointerEvent) {
  const target = event.target as Node;
  // 面板已被 Portal 傳送到 body，因此外部點擊判定需同時排除 trigger 與面板
  if (rootRef.value?.contains(target)) return;
  if (dropdownRef.value?.contains(target)) return;
  close();
}

// 面板採 fixed 定位，開啟期間需隨捲動 / 尺寸改變重新校正座標。
// scroll 用 capture 以攔截任何祖先層（含巢狀捲動容器）的捲動事件。
watch(isOpen, (openNow) => {
  if (openNow) {
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
  } else {
    window.removeEventListener("scroll", updatePosition, true);
    window.removeEventListener("resize", updatePosition);
  }
});

onMounted(() => {
  document.addEventListener("pointerdown", onDocumentPointerDown);
});

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onDocumentPointerDown);
  window.removeEventListener("scroll", updatePosition, true);
  window.removeEventListener("resize", updatePosition);
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

    <Portal>
      <ul
        v-show="isOpen"
        ref="dropdownRef"
        :class="dropdownClasses"
        :style="dropdownStyle"
      >
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
    </Portal>
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

/*
 * 面板被 Portal 傳送到 <body>，定位由行內 style（fixed + 座標）負責，
 * 這裡只保留外觀樣式。scoped 樣式仍會套用到被傳送的節點，
 * 因為 slot 內容在本元件的渲染脈絡下編譯，帶有相同的 scope id。
 */
.bs-select__dropdown {
  z-index: 1000;
  box-sizing: border-box;
  max-height: 240px;
  margin: 0;
  padding: 4px;
  overflow-y: auto;
  list-style: none;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: #111827;
  font-size: 14px;
  line-height: 1.4;
}

.bs-select__dropdown--small {
  font-size: 12px;
}

.bs-select__dropdown--large {
  font-size: 16px;
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

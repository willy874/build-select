<script setup lang="ts">
import { computed, nextTick, watch } from "vue";
import SelectTrigger from "./SelectTrigger.vue";
import SelectValue from "./SelectValue.vue";
import SelectDropdown from "./SelectDropdown.vue";
import SelectOption from "./SelectOption.vue";
import { useSelect } from "./composables/useSelect";
import type { SelectOption as SelectOptionType, SelectSize } from "./types";

const props = withDefaults(
  defineProps<{
    /** 目前選取的值（v-model） */
    modelValue?: string | number | null;
    /** 選項清單 */
    options?: SelectOptionType[];
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

// 協調者:所有邏輯來自 useSelect,這裡只負責把回傳接到子元件
const {
  rootRef,
  triggerRef,
  dropdownRef,
  isOpen,
  activeIndex,
  selectedOption,
  listboxId,
  optionId,
  activeDescendant,
  toggle,
  onKeydown,
  onOptionClick,
  onOptionActivate,
} = useSelect(props, emit);

const valueLabel = computed(() =>
  selectedOption.value ? selectedOption.value.label : props.placeholder
);
const isPlaceholder = computed(() => !selectedOption.value);

/**
 * scrollIntoView 是唯一需要 DOM 元素的導覽動作,刻意留在元件層,
 * 讓 useListNavigation 保持無 DOM 依賴。高亮改變後把該項捲入可視範圍。
 */
watch(activeIndex, async (index) => {
  if (!isOpen.value || index < 0) return;
  await nextTick();
  const panel = dropdownRef.value?.el;
  panel
    ?.querySelector<HTMLElement>(`#${CSS.escape(optionId(index))}`)
    ?.scrollIntoView({ block: "nearest" });
});
</script>

<template>
  <div
    ref="rootRef"
    class="bs-select"
    :class="`bs-select--${size}`"
  >
    <SelectTrigger
      ref="triggerRef"
      :is-open="isOpen"
      :disabled="disabled"
      :size="size"
      :controls="listboxId"
      :active-descendant="activeDescendant"
      @toggle="toggle"
      @keydown="onKeydown"
    >
      <SelectValue :label="valueLabel" :is-placeholder="isPlaceholder" />
    </SelectTrigger>

    <SelectDropdown
      ref="dropdownRef"
      :is-open="isOpen"
      :anchor="rootRef"
      :id="listboxId"
      :size="size"
    >
      <SelectOption
        v-for="(opt, index) in options"
        :id="optionId(index)"
        :key="opt.value"
        :option="opt"
        :selected="opt.value === modelValue"
        :active="index === activeIndex"
        @select="onOptionClick(opt)"
        @activate="onOptionActivate(index)"
      />
      <li v-if="!options.length" class="bs-select__empty" role="presentation">
        無選項
      </li>
    </SelectDropdown>
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

.bs-select--small {
  font-size: 12px;
}

.bs-select--large {
  font-size: 16px;
}

/* 空狀態的 <li> 在此 template 撰寫(slot 內容),故樣式留在這裡 */
.bs-select__empty {
  padding: 6px 10px;
  color: #9ca3af;
}
</style>

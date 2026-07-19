<script setup lang="ts">
import { computed, nextTick, watch } from "vue";
import SelectTrigger from "./SelectTrigger.vue";
import SelectValue from "./SelectValue.vue";
import SelectSearchInput from "./SelectSearchInput.vue";
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
    /** 是否開啟搜尋過濾（打字即過濾，支援拼音） */
    filterable?: boolean;
  }>(),
  {
    modelValue: null,
    options: () => [],
    placeholder: "請選擇",
    size: "medium",
    disabled: false,
    filterable: false,
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
  query,
  activeIndex,
  visible,
  selectedOption,
  listboxId,
  optionId,
  activeDescendant,
  toggle,
  onKeydown,
  onQueryInput,
  onOptionClick,
  onOptionActivate,
} = useSelect(props, emit);

const valueLabel = computed(() =>
  selectedOption.value ? selectedOption.value.label : props.placeholder
);
const isPlaceholder = computed(() => !selectedOption.value);
const selectedLabel = computed(() => selectedOption.value?.label ?? null);

/** 過濾後無命中(僅 filterable 且開啟時) */
const noResults = computed(
  () => props.filterable && isOpen.value && visible.value.length === 0
);

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
  <div ref="rootRef" class="bs-select" :class="`bs-select--${size}`">
    <!-- filterable:可輸入的搜尋 combobox;否則:v5 的靜態 trigger -->
    <SelectSearchInput
      v-if="filterable"
      ref="triggerRef"
      :is-open="isOpen"
      :disabled="disabled"
      :size="size"
      :query="query"
      :selected-label="selectedLabel"
      :placeholder="placeholder"
      :controls="listboxId"
      :active-descendant="activeDescendant"
      @input="onQueryInput"
      @toggle="toggle"
      @keydown="onKeydown"
    />
    <SelectTrigger
      v-else
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
        v-for="(item, index) in visible"
        :id="optionId(index)"
        :key="item.option.value"
        :option="item.option"
        :matched="item.matched"
        :selected="item.option.value === modelValue"
        :active="index === activeIndex"
        @select="onOptionClick(item.option)"
        @activate="onOptionActivate(index)"
      />
      <li v-if="noResults" class="bs-select__empty" role="presentation">
        無結果
      </li>
      <li
        v-else-if="!options.length"
        class="bs-select__empty"
        role="presentation"
      >
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

/* 空狀態 / 無結果的 <li> 在此 template 撰寫(slot 內容),故樣式留在這裡 */
.bs-select__empty {
  padding: 6px 10px;
  color: #9ca3af;
}
</style>

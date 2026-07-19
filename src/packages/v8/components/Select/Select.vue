<script setup lang="ts">
import { computed, nextTick, toRef, watch } from "vue";
import SelectTrigger from "./SelectTrigger.vue";
import SelectValue from "./SelectValue.vue";
import SelectSearchInput from "./SelectSearchInput.vue";
import SelectMultiTrigger from "./SelectMultiTrigger.vue";
import SelectDropdown from "./SelectDropdown.vue";
import SelectOption from "./SelectOption.vue";
import { useSelect } from "./composables/useSelect";
import { useVirtualList } from "./composables/useVirtualList";
import type {
  SelectOption as SelectOptionType,
  SelectSize,
  SelectModelValue,
} from "./types";

const props = withDefaults(
  defineProps<{
    /** 目前選取的值（v-model）；multiple 時為陣列 */
    modelValue?: SelectModelValue;
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
    /** 是否多選（modelValue 為陣列，選取以 chips 呈現） */
    multiple?: boolean;
    /** 遠端模式：不本地過濾，query 變動送出 search 事件由外部查詢 */
    remote?: boolean;
    /** 遠端載入中（顯示載入狀態、暫停觸發 load-more） */
    loading?: boolean;
    /** 已無更多資料（停止觸發 load-more） */
    finished?: boolean;
    /** 啟用虛擬列表（只渲染可視範圍，避免長清單渲染超載） */
    virtual?: boolean;
    /** 虛擬列表的單列固定高度（px） */
    itemHeight?: number;
  }>(),
  {
    modelValue: null,
    options: () => [],
    placeholder: "請選擇",
    size: "medium",
    disabled: false,
    filterable: false,
    multiple: false,
    remote: false,
    loading: false,
    finished: false,
    virtual: false,
    itemHeight: 34,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: SelectModelValue): void;
  (e: "change", value: SelectModelValue): void;
  /** 遠端模式：query 變動（debounce 後）送出 */
  (e: "search", query: string): void;
  /** 無限滾動：捲到接近底部時送出 */
  (e: "loadMore"): void;
}>();

const {
  rootRef,
  triggerRef,
  dropdownRef,
  isOpen,
  query,
  activeIndex,
  visible,
  selectedOption,
  selectedOptions,
  isSelected,
  listboxId,
  optionId,
  activeDescendant,
  toggle,
  onKeydown,
  onQueryInput,
  onOptionClick,
  onOptionActivate,
  onRemoveChip,
} = useSelect(props, emit);

// 虛擬列表:項目數 = 可見清單長度
const vlist = useVirtualList(
  computed(() => visible.value.length),
  toRef(props, "itemHeight")
);

// 虛擬化時只渲染窗內項目;非虛擬化時渲染全部。renderStart 用來還原絕對索引
const renderStart = computed(() => (props.virtual ? vlist.range.value.start : 0));
const renderItems = computed(() =>
  props.virtual
    ? visible.value.slice(vlist.range.value.start, vlist.range.value.end)
    : visible.value
);

// 單選顯示用
const valueLabel = computed(() =>
  selectedOption.value ? selectedOption.value.label : props.placeholder
);
const isPlaceholder = computed(() => !selectedOption.value);
const selectedLabel = computed(() => selectedOption.value?.label ?? null);

const hasItems = computed(() => visible.value.length > 0);
/** 分頁載入中(已有項目時,底部顯示載入列) */
const showLoadingMore = computed(
  () => props.remote && props.loading && hasItems.value
);
/** 無項目時的整體狀態 */
const emptyState = computed<
  "loading" | "prompt" | "no-results" | "no-options" | null
>(() => {
  if (hasItems.value) return null;
  if (props.remote && props.loading) return "loading";
  if (props.remote && props.filterable && query.value.trim() === "")
    return "prompt";
  if (props.filterable || props.remote || query.value.trim() !== "")
    return "no-results";
  return props.options.length ? null : "no-options";
});

/** 面板捲動:更新虛擬視窗 + 觸發無限滾動 load-more */
function onPanelScroll(e: Event) {
  const el = e.target as HTMLElement;
  if (props.virtual) vlist.setViewport(el.scrollTop, el.clientHeight);
  if (props.remote && !props.loading && !props.finished) {
    const threshold = props.itemHeight * 3;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - threshold) {
      emit("loadMore");
    }
  }
}

// 開啟時量測面板可視高度,初始化虛擬視窗
watch(isOpen, async (open) => {
  if (!open || !props.virtual) return;
  await nextTick();
  const panel = dropdownRef.value?.el;
  if (panel) vlist.setViewport(panel.scrollTop, panel.clientHeight);
});

/**
 * 高亮改變後把該項捲入可視範圍。
 * 虛擬化:算出目標 scrollTop 並設定(同步更新視窗,確保 active 項有被渲染);
 * 非虛擬化:沿用 scrollIntoView。
 */
watch(activeIndex, async (index) => {
  if (!isOpen.value || index < 0) return;
  await nextTick();
  const panel = dropdownRef.value?.el;
  if (!panel) return;
  if (props.virtual) {
    const offset = vlist.scrollOffsetFor(index);
    if (offset != null) panel.scrollTop = offset;
    vlist.setViewport(panel.scrollTop, panel.clientHeight);
  } else {
    panel
      .querySelector<HTMLElement>(`#${CSS.escape(optionId(index))}`)
      ?.scrollIntoView({ block: "nearest" });
  }
});
</script>

<template>
  <div ref="rootRef" class="bs-select" :class="`bs-select--${size}`">
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
      :multiple="multiple"
      :chips="multiple ? selectedOptions : []"
      @input="onQueryInput"
      @toggle="toggle"
      @keydown="onKeydown"
      @remove="onRemoveChip"
    />
    <SelectMultiTrigger
      v-else-if="multiple"
      ref="triggerRef"
      :is-open="isOpen"
      :disabled="disabled"
      :size="size"
      :selected-options="selectedOptions"
      :placeholder="placeholder"
      :controls="listboxId"
      :active-descendant="activeDescendant"
      @toggle="toggle"
      @keydown="onKeydown"
      @remove="onRemoveChip"
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
      :multiselectable="multiple"
      :virtual="virtual"
      :total-height="vlist.totalHeight.value"
      :offset-y="vlist.offsetY.value"
      :item-height="itemHeight"
      @scroll="onPanelScroll"
    >
      <SelectOption
        v-for="(item, i) in renderItems"
        :id="optionId(renderStart + i)"
        :key="item.option.value"
        :option="item.option"
        :matched="item.matched"
        :multiple="multiple"
        :selected="isSelected(item.option.value)"
        :active="renderStart + i === activeIndex"
        :setsize="virtual ? visible.length : undefined"
        :posinset="virtual ? renderStart + i + 1 : undefined"
        @select="onOptionClick(item.option)"
        @activate="onOptionActivate(renderStart + i)"
      />

      <template #footer>
        <li
          v-if="emptyState === 'loading'"
          class="bs-select__empty"
          role="presentation"
        >
          載入中…
        </li>
        <li
          v-else-if="emptyState === 'prompt'"
          class="bs-select__empty"
          role="presentation"
        >
          輸入關鍵字搜尋
        </li>
        <li
          v-else-if="emptyState === 'no-results'"
          class="bs-select__empty"
          role="presentation"
        >
          無結果
        </li>
        <li
          v-else-if="emptyState === 'no-options'"
          class="bs-select__empty"
          role="presentation"
        >
          無選項
        </li>
        <li
          v-if="showLoadingMore"
          class="bs-select__empty bs-select__loading-more"
          role="presentation"
        >
          載入中…
        </li>
      </template>
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

.bs-select__empty {
  padding: 6px 10px;
  color: #9ca3af;
}

.bs-select__loading-more {
  text-align: center;
}
</style>

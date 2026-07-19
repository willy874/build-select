<script setup lang="ts">
import { computed } from "vue";
import type { SelectOption } from "./types";

/**
 * SelectOption — 單一選項列(<li role="option">)。
 *
 * 純呈現:收 props、發事件。內容以 default slot 佔位(預設顯示 label,
 * 並依 `matched` 高亮命中字元),為未來的自訂選項渲染保留縫隙。
 */
const props = withDefaults(
  defineProps<{
    option: SelectOption;
    /** 是否為目前已選值 */
    selected: boolean;
    /** 是否為鍵盤 / 滑鼠高亮項 */
    active: boolean;
    /** 選項 id(對應 aria-activedescendant) */
    id: string;
    /** 命中的字元索引(搜尋高亮);空陣列 = 不高亮 */
    matched?: number[];
  }>(),
  { matched: () => [] }
);

const emit = defineEmits<{
  (e: "select"): void;
  (e: "activate"): void;
}>();

/** 把 label 切成字元,標記哪些索引要高亮。 */
const segments = computed(() => {
  const chars = Array.from(props.option.label);
  const set = new Set(props.matched);
  return chars.map((ch, i) => ({ ch, hit: set.has(i) }));
});
const hasHighlight = computed(() => props.matched.length > 0);
</script>

<template>
  <li
    :id="id"
    role="option"
    class="bs-select__option"
    :class="{
      'bs-select__option--selected': selected,
      'bs-select__option--active': active,
      'bs-select__option--disabled': option.disabled,
    }"
    :aria-selected="selected"
    :aria-disabled="option.disabled || undefined"
    @click="emit('select')"
    @mouseenter="!option.disabled && emit('activate')"
  >
    <slot>
      <template v-if="hasHighlight">
        <template v-for="(seg, i) in segments" :key="i"
          ><mark v-if="seg.hit" class="bs-select__hl">{{ seg.ch }}</mark
          ><template v-else>{{ seg.ch }}</template></template
        >
      </template>
      <template v-else>{{ option.label }}</template>
    </slot>
  </li>
</template>

<style scoped>
.bs-select__option {
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}

/* 鍵盤高亮(active)與滑鼠 hover 統一為同一種視覺,由 active 驅動 */
.bs-select__option--active {
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

/* 搜尋命中片段的高亮 */
.bs-select__hl {
  background-color: transparent;
  color: #2563eb;
  font-weight: 700;
}
</style>

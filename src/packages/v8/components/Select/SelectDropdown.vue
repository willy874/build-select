<script setup lang="ts">
import { ref, toRef } from "vue";
import Portal from "../Portal/Portal.vue";
import { useFloatingPosition } from "./composables/useFloatingPosition";
import type { SelectSize } from "./types";

/**
 * SelectDropdown — 浮層面板:組合 Portal(傳送到 body)與 useFloatingPosition
 * (fixed 座標 + flip 定位)。「浮出父層 + 座標計算」這組 DOM 關注封在這裡,
 * 讓 Select.vue 不必碰 rect。選項內容由 default slot 提供。
 */
const props = defineProps<{
  isOpen: boolean;
  /** 定位基準元素(trigger 的外框) */
  anchor: HTMLElement | null;
  /** 面板 id(對應 trigger 的 aria-controls) */
  id: string;
  size: SelectSize;
  /** 多選:listbox 標記 aria-multiselectable */
  multiselectable?: boolean;
  /** 虛擬化:啟用後只渲染窗內項目 */
  virtual?: boolean;
  /** 虛擬化:所有項目的總高(px),撐出捲軸 */
  totalHeight?: number;
  /** 虛擬化:目前渲染窗的頂端偏移(px) */
  offsetY?: number;
  /** 虛擬化:單列固定高度(px),用來鎖定每列高度以對齊計算 */
  itemHeight?: number;
}>();

const emit = defineEmits<{
  (e: "scroll", ev: Event): void;
}>();

const panelRef = ref<HTMLElement | null>(null);
const { style } = useFloatingPosition(
  toRef(props, "anchor"),
  panelRef,
  toRef(props, "isOpen")
);

// 供父層做「外部點擊關閉」判定,以及量測 / 捲動控制
defineExpose({
  get el() {
    return panelRef.value;
  },
});
</script>

<template>
  <Portal>
    <ul
      v-show="isOpen"
      :id="id"
      ref="panelRef"
      role="listbox"
      :aria-multiselectable="multiselectable || undefined"
      class="bs-select__dropdown"
      :class="`bs-select__dropdown--${size}`"
      :style="style"
      @scroll="emit('scroll', $event)"
    >
      <!-- 虛擬化:phantom 撐出總高,窗內項目用 translateY 偏移 -->
      <li
        v-if="virtual"
        role="presentation"
        class="bs-select__phantom"
        :style="{ height: `${totalHeight}px` }"
      >
        <div
          class="bs-select__window"
          :style="{
            transform: `translateY(${offsetY}px)`,
            '--bs-item-height': `${itemHeight}px`,
          }"
        >
          <slot />
        </div>
      </li>
      <slot v-else />
      <slot name="footer" />
    </ul>
  </Portal>
</template>

<style scoped>
.bs-select__dropdown {
  z-index: 1000;
  box-sizing: border-box;
  /* max-height 由 useFloatingPosition 以行內 style 動態夾住;此為保底 fallback */
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

/* 虛擬化:phantom 撐高、window 承載窗內項目 */
.bs-select__phantom {
  position: relative;
  width: 100%;
}
.bs-select__window {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
/* 鎖定窗內每列高度 = itemHeight,確保虛擬化偏移計算精準 */
.bs-select__window > :deep(*) {
  height: var(--bs-item-height);
  box-sizing: border-box;
}
</style>

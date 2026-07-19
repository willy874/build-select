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
}>();

const panelRef = ref<HTMLElement | null>(null);
const { style } = useFloatingPosition(
  toRef(props, "anchor"),
  panelRef,
  toRef(props, "isOpen")
);

// 供父層做「外部點擊關閉」時判定點擊是否落在面板內
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
      class="bs-select__dropdown"
      :class="`bs-select__dropdown--${size}`"
      :style="style"
    >
      <slot />
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
</style>

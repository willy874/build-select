<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  nextTick,
  ref,
  useId,
  watch,
} from "vue";
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
const triggerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);

/**
 * v4 關鍵：鍵盤「虛擬焦點」索引。
 *
 * 面板被 Portal 傳送到 <body>，若把 DOM 焦點移進面板，反而難以管理
 * （面板脫離父層、開合會頻繁掛載/卸載）。因此 v4 採 ARIA combobox 模式：
 * DOM 焦點**始終停在 trigger**，用 `activeIndex` 標記「目前高亮的選項」，
 * 再透過 `aria-activedescendant` 指向該選項的 id，讓螢幕閱讀器讀出來。
 * -1 代表沒有任何高亮項。
 */
const activeIndex = ref(-1);

/**
 * a11y 關鍵：每個實例需要穩定且唯一的 id，
 * 用來串起 trigger（combobox）↔ listbox ↔ option 的 ARIA 關聯。
 * `useId()` 為 Vue 3.5+ 內建，SSR / CSR 兩端一致，不需自行亂數。
 */
const uid = useId();
const listboxId = `${uid}-listbox`;
const optionId = (index: number) => `${uid}-option-${index}`;

/**
 * 面板的行內定位樣式（沿用 v3）：面板 Portal 到 <body> 後改用
 * `position: fixed` + trigger 的 viewport 座標即時定位。
 */
const dropdownStyle = ref<Record<string, string>>({});

const selectedOption = computed(
  () => props.options.find((opt) => opt.value === props.modelValue) ?? null
);

const selectedIndex = computed(() =>
  props.options.findIndex((opt) => opt.value === props.modelValue)
);

const activeDescendant = computed(() =>
  isOpen.value && activeIndex.value >= 0 ? optionId(activeIndex.value) : undefined
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

// ── 鍵盤導覽：在可選（未 disabled）的選項之間移動 ──────────────

/** 從 `from` 起，往 `dir` 方向找下一個未停用選項；找不到就停在原地（不環繞）。 */
function nextEnabled(from: number, dir: 1 | -1): number {
  let i = from;
  for (;;) {
    i += dir;
    if (i < 0 || i >= props.options.length) return from < 0 ? edgeEnabled(dir) : from;
    if (!props.options[i]?.disabled) return i;
  }
}

/** 取頭 / 尾端的第一個未停用選項（dir=1 從頭找、dir=-1 從尾找）。 */
function edgeEnabled(dir: 1 | -1): number {
  const list = props.options;
  if (dir === 1) {
    for (let i = 0; i < list.length; i++) if (!list[i].disabled) return i;
  } else {
    for (let i = list.length - 1; i >= 0; i--) if (!list[i].disabled) return i;
  }
  return -1;
}

function setActive(index: number) {
  activeIndex.value = index;
  if (index >= 0) scrollActiveIntoView();
}

function moveActive(dir: 1 | -1) {
  setActive(nextEnabled(activeIndex.value, dir));
}

/** 開啟後把高亮定位到「已選項」，若無已選則定位到第一個可選項。 */
function initActive() {
  const sel = selectedIndex.value;
  activeIndex.value =
    sel >= 0 && !props.options[sel]?.disabled ? sel : edgeEnabled(1);
}

async function scrollActiveIntoView() {
  await nextTick();
  const panel = dropdownRef.value;
  if (!panel || activeIndex.value < 0) return;
  const el = panel.querySelector<HTMLElement>(`#${CSS.escape(optionId(activeIndex.value))}`);
  el?.scrollIntoView({ block: "nearest" });
}

async function open() {
  if (props.disabled || isOpen.value) return;
  isOpen.value = true;
  initActive();
  updatePosition();
  await nextTick();
  updatePosition();
  scrollActiveIntoView();
}

function close() {
  if (!isOpen.value) return;
  isOpen.value = false;
  activeIndex.value = -1;
  // combobox 模式下焦點本就在 trigger，關閉後明確收回，確保鍵盤流不中斷
  triggerRef.value?.focus();
}

function toggle() {
  if (props.disabled) return;
  isOpen.value ? close() : open();
}

function commit(opt: SelectOption) {
  if (opt.disabled) return;
  if (opt.value !== props.modelValue) {
    emit("update:modelValue", opt.value);
    emit("change", opt.value);
  }
  close();
}

function selectActive() {
  const opt = props.options[activeIndex.value];
  if (opt) commit(opt);
}

function onOptionClick(opt: SelectOption) {
  commit(opt);
}

// ── typeahead：連續打字跳到符合開頭的選項 ──────────────────────
let typeBuffer = "";
let typeTimer: ReturnType<typeof setTimeout> | null = null;

function onTypeahead(char: string) {
  typeBuffer += char.toLowerCase();
  if (typeTimer) clearTimeout(typeTimer);
  typeTimer = setTimeout(() => (typeBuffer = ""), 500);

  const match = props.options.findIndex(
    (opt) => !opt.disabled && opt.label.toLowerCase().startsWith(typeBuffer)
  );
  if (match >= 0) {
    if (!isOpen.value) open();
    setActive(match);
  }
}

function isPrintableKey(e: KeyboardEvent): boolean {
  return e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
}

/**
 * v4 核心：trigger 上的鍵盤操作，補回 v1 原生 <select> 的鍵盤能力。
 * - 關閉時：↑ / ↓ / Enter / Space 開啟面板
 * - 開啟時：↑ / ↓ 移動高亮、Home / End 首尾、Enter / Space 選取、Esc 關閉
 * - Tab：關閉面板但放行預設行為（焦點自然離開）
 * - 可列印字元：typeahead
 */
function onKeydown(e: KeyboardEvent) {
  if (props.disabled) return;

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      isOpen.value ? moveActive(1) : open();
      break;
    case "ArrowUp":
      e.preventDefault();
      isOpen.value ? moveActive(-1) : open();
      break;
    case "Home":
      if (isOpen.value) {
        e.preventDefault();
        setActive(edgeEnabled(1));
      }
      break;
    case "End":
      if (isOpen.value) {
        e.preventDefault();
        setActive(edgeEnabled(-1));
      }
      break;
    case "Enter":
      e.preventDefault();
      isOpen.value ? selectActive() : open();
      break;
    case " ":
      // typeahead 進行中時，空白鍵視為輸入字元；否則作為開啟 / 選取
      if (typeBuffer) {
        e.preventDefault();
        onTypeahead(" ");
        break;
      }
      e.preventDefault();
      isOpen.value ? selectActive() : open();
      break;
    case "Escape":
      if (isOpen.value) {
        e.preventDefault();
        close();
      }
      break;
    case "Tab":
      if (isOpen.value) close();
      break;
    default:
      if (isPrintableKey(e)) {
        e.preventDefault();
        onTypeahead(e.key);
      }
  }
}

function onDocumentPointerDown(event: PointerEvent) {
  const target = event.target as Node;
  // 面板已被 Portal 傳送到 body，外部點擊判定需同時排除 trigger 與面板
  if (rootRef.value?.contains(target)) return;
  if (dropdownRef.value?.contains(target)) return;
  if (!isOpen.value) return;
  // 點外部關閉：不搶回焦點（使用者是要點別處，不是要繼續操作 Select）
  isOpen.value = false;
  activeIndex.value = -1;
}

// 面板採 fixed 定位，開啟期間需隨捲動 / 尺寸改變重新校正座標。
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
  if (typeTimer) clearTimeout(typeTimer);
});
</script>

<template>
  <div ref="rootRef" :class="rootClasses">
    <!--
      trigger 即 ARIA combobox：
      - tabindex 讓它可被 Tab 聚焦（disabled 時移出 tab 序）
      - role/aria-* 讓螢幕閱讀器理解「這是一個可展開的下拉選擇器」
      - aria-activedescendant 指向目前高亮選項，達成「虛擬焦點」
    -->
    <div
      ref="triggerRef"
      class="bs-select__trigger"
      role="combobox"
      :tabindex="disabled ? -1 : 0"
      :aria-expanded="isOpen"
      :aria-controls="listboxId"
      aria-haspopup="listbox"
      :aria-activedescendant="activeDescendant"
      :aria-disabled="disabled || undefined"
      @click="toggle"
      @keydown="onKeydown"
    >
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
        :id="listboxId"
        ref="dropdownRef"
        role="listbox"
        :class="dropdownClasses"
        :style="dropdownStyle"
      >
        <li
          v-for="(opt, index) in options"
          :id="optionId(index)"
          :key="opt.value"
          role="option"
          class="bs-select__option"
          :class="{
            'bs-select__option--selected': opt.value === modelValue,
            'bs-select__option--active': index === activeIndex,
            'bs-select__option--disabled': opt.disabled,
          }"
          :aria-selected="opt.value === modelValue"
          :aria-disabled="opt.disabled || undefined"
          @click="onOptionClick(opt)"
          @mouseenter="!opt.disabled && (activeIndex = index)"
        >
          {{ opt.label }}
        </li>
        <li v-if="!options.length" class="bs-select__empty" role="presentation">
          無選項
        </li>
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
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

/* a11y：鍵盤聚焦時給出清楚的 focus ring（原生 <select> 免費附送、v2 起遺失） */
.bs-select__trigger:focus-visible {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.35);
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

/*
 * v4：鍵盤高亮（active）與滑鼠 hover 統一為同一種視覺。
 * active 由 activeIndex 驅動（鍵盤 / mouseenter 都會更新），
 * 因此不再單獨依賴 CSS :hover，鍵盤與滑鼠操作外觀一致。
 */
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

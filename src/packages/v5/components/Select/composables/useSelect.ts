import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  useId,
} from "vue";
import type { SelectOption } from "../types";
import { useListNavigation } from "./useListNavigation";
import { useTypeahead } from "./useTypeahead";

/** useSelect 讀取的 props 形狀(Select.vue 的 props 子集)。 */
export interface UseSelectProps {
  modelValue: string | number | null;
  options: SelectOption[];
  disabled: boolean;
}

/** useSelect 需要的 emit 形狀。 */
export interface UseSelectEmit {
  (e: "update:modelValue", value: string | number | null): void;
  (e: "change", value: string | number | null): void;
}

/** SelectTrigger 對外暴露的介面(供收回焦點)。 */
interface TriggerExpose {
  focus: () => void;
}
/** SelectDropdown 對外暴露的介面(供外部點擊判定)。 */
interface DropdownExpose {
  el: HTMLElement | null;
}

/**
 * useSelect — Select 的「大腦 / 總機」。
 *
 * 組合 {@link useListNavigation}(高亮導覽)與 {@link useTypeahead}(打字跳項),
 * 並掌管:開合狀態、選取提交、鍵盤事件分派、外部點擊關閉、以及 combobox 的
 * ARIA 關聯(id)。回傳給 Select.vue template 綁定的一整包。
 *
 * 定位(flip)不在這裡——那屬於 DOM 幾何,交給 SelectDropdown 內的
 * useFloatingPosition;scrollIntoView 亦留在元件層,以保持這裡不碰 DOM 佈局。
 */
export function useSelect(props: UseSelectProps, emit: UseSelectEmit) {
  const rootRef = ref<HTMLElement | null>(null);
  const triggerRef = ref<TriggerExpose | null>(null);
  const dropdownRef = ref<DropdownExpose | null>(null);
  const isOpen = ref(false);

  const uid = useId();
  const listboxId = `${uid}-listbox`;
  const optionId = (index: number) => `${uid}-option-${index}`;

  const options = computed(() => props.options);
  const selectedOption = computed(
    () => options.value.find((opt) => opt.value === props.modelValue) ?? null
  );
  const selectedIndex = computed(() =>
    options.value.findIndex((opt) => opt.value === props.modelValue)
  );

  const nav = useListNavigation(options, { selectedIndex });
  const activeIndex = nav.activeIndex;

  const activeDescendant = computed(() =>
    isOpen.value && activeIndex.value >= 0 ? optionId(activeIndex.value) : undefined
  );

  const typeahead = useTypeahead(options, (index) => {
    if (!isOpen.value) open();
    nav.setActive(index);
  });

  function open() {
    if (props.disabled || isOpen.value) return;
    isOpen.value = true;
    nav.initActive();
  }

  function close() {
    if (!isOpen.value) return;
    isOpen.value = false;
    nav.reset();
    // combobox 模式下焦點本就在 trigger,關閉後明確收回,確保鍵盤流不中斷
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
    const opt = options.value[activeIndex.value];
    if (opt) commit(opt);
  }

  function onOptionClick(opt: SelectOption) {
    commit(opt);
  }
  function onOptionActivate(index: number) {
    if (!options.value[index]?.disabled) nav.setActive(index);
  }

  function isPrintableKey(e: KeyboardEvent): boolean {
    return e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
  }

  /**
   * trigger 上的鍵盤操作:
   * - 關閉時:↑ / ↓ / Enter / Space 開啟
   * - 開啟時:↑ / ↓ 移動、Home / End 首尾、Enter / Space 選取、Esc 關閉
   * - Tab:關閉面板但放行預設行為
   * - 可列印字元:typeahead
   */
  function onKeydown(e: KeyboardEvent) {
    if (props.disabled) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        isOpen.value ? nav.moveActive(1) : open();
        break;
      case "ArrowUp":
        e.preventDefault();
        isOpen.value ? nav.moveActive(-1) : open();
        break;
      case "Home":
        if (isOpen.value) {
          e.preventDefault();
          nav.moveEdge(1);
        }
        break;
      case "End":
        if (isOpen.value) {
          e.preventDefault();
          nav.moveEdge(-1);
        }
        break;
      case "Enter":
        e.preventDefault();
        isOpen.value ? selectActive() : open();
        break;
      case " ":
        if (typeahead.isBuffering()) {
          e.preventDefault();
          typeahead.onChar(" ");
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
          typeahead.onChar(e.key);
        }
    }
  }

  function onDocumentPointerDown(event: PointerEvent) {
    const target = event.target as Node;
    // rootRef 只包住 trigger(面板已 Portal 到 body),故 trigger 側判定用 rootRef
    if (rootRef.value?.contains(target)) return;
    if (dropdownRef.value?.el?.contains(target)) return;
    if (!isOpen.value) return;
    // 點外部關閉:不搶回焦點(使用者是要點別處)
    isOpen.value = false;
    nav.reset();
  }

  onMounted(() => {
    document.addEventListener("pointerdown", onDocumentPointerDown);
  });
  onBeforeUnmount(() => {
    document.removeEventListener("pointerdown", onDocumentPointerDown);
    typeahead.clear();
  });

  return {
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
    close,
    onKeydown,
    onOptionClick,
    onOptionActivate,
  };
}

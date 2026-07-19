import { computed, onBeforeUnmount, onMounted, ref, useId } from "vue";
import type { SelectOption } from "../types";
import { useListNavigation } from "./useListNavigation";
import { useTypeahead } from "./useTypeahead";
import { useFilter, type FilteredOption } from "./useFilter";

/** useSelect 讀取的 props 形狀(Select.vue 的 props 子集)。 */
export interface UseSelectProps {
  modelValue: string | number | null;
  options: SelectOption[];
  disabled: boolean;
  /** 是否開啟搜尋過濾(v6) */
  filterable: boolean;
}

/** useSelect 需要的 emit 形狀。 */
export interface UseSelectEmit {
  (e: "update:modelValue", value: string | number | null): void;
  (e: "change", value: string | number | null): void;
}

interface TriggerExpose {
  focus: () => void;
}
interface DropdownExpose {
  el: HTMLElement | null;
}

/**
 * useSelect — Select 的「大腦 / 總機」。
 *
 * 組合 {@link useListNavigation}、{@link useTypeahead} 與(v6){@link useFilter},
 * 掌管開合、選取提交、鍵盤分派、外部點擊關閉、combobox 的 ARIA 關聯。
 *
 * v6 的 filterable 分支:開啟時以 `query` 過濾出 `visible` 清單,導覽 / 渲染
 * 皆改吃 visible;此時打字交給搜尋 input(不再做 typeahead 跳項)。
 */
export function useSelect(props: UseSelectProps, emit: UseSelectEmit) {
  const rootRef = ref<HTMLElement | null>(null);
  const triggerRef = ref<TriggerExpose | null>(null);
  const dropdownRef = ref<DropdownExpose | null>(null);
  const isOpen = ref(false);
  /** 搜尋關鍵字(僅 filterable 時有意義) */
  const query = ref("");

  const uid = useId();
  const listboxId = `${uid}-listbox`;
  const optionId = (index: number) => `${uid}-option-${index}`;

  const options = computed(() => props.options);
  const selectedOption = computed(
    () => options.value.find((opt) => opt.value === props.modelValue) ?? null
  );

  const { filtered } = useFilter(options, query);

  /**
   * 目前「可見」的選項清單(帶原始索引與高亮索引):
   * filterable 且開啟 → 過濾後結果;否則 → 全部(不標高亮)。
   */
  const visible = computed<FilteredOption[]>(() =>
    props.filterable && isOpen.value
      ? filtered.value
      : options.value.map((option, index) => ({ option, index, matched: [] }))
  );
  const visibleOptions = computed(() => visible.value.map((v) => v.option));
  const visibleSelectedIndex = computed(() =>
    visible.value.findIndex((v) => v.option.value === props.modelValue)
  );

  const nav = useListNavigation(visibleOptions, {
    selectedIndex: visibleSelectedIndex,
  });
  const activeIndex = nav.activeIndex;

  const activeDescendant = computed(() =>
    isOpen.value && activeIndex.value >= 0 ? optionId(activeIndex.value) : undefined
  );

  // typeahead 僅用於「非 filterable」時(filterable 時打字交給搜尋 input)
  const typeahead = useTypeahead(options, (index) => {
    if (!isOpen.value) open();
    nav.setActive(index);
  });

  function open() {
    if (props.disabled || isOpen.value) return;
    if (props.filterable) query.value = "";
    isOpen.value = true;
    nav.initActive();
  }

  function close() {
    if (!isOpen.value) return;
    isOpen.value = false;
    nav.reset();
    if (props.filterable) query.value = "";
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
    const opt = visibleOptions.value[activeIndex.value];
    if (opt) commit(opt);
  }

  function onOptionClick(opt: SelectOption) {
    commit(opt);
  }
  function onOptionActivate(index: number) {
    if (!visibleOptions.value[index]?.disabled) nav.setActive(index);
  }

  /** 搜尋 input 的輸入:確保開啟(open 會先清空 query)、寫入輸入值、高亮移到第一個命中項。 */
  function onQueryInput(value: string) {
    // 先 open(filterable 時 open 會清空 query),再寫入這次的輸入值,
    // 否則「打字開啟面板」的第一個字會被 open 的清空動作吃掉。
    if (!isOpen.value) open();
    query.value = value;
    nav.moveEdge(1);
  }

  function isPrintableKey(e: KeyboardEvent): boolean {
    return e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
  }

  /**
   * 鍵盤操作。filterable 時:方向鍵 / Enter / Esc 照舊,但 Home / End 與可列印
   * 字元(含空白)交給搜尋 input(移動游標、輸入文字),不被攔截。
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
        if (!props.filterable && isOpen.value) {
          e.preventDefault();
          nav.moveEdge(1);
        }
        break;
      case "End":
        if (!props.filterable && isOpen.value) {
          e.preventDefault();
          nav.moveEdge(-1);
        }
        break;
      case "Enter":
        e.preventDefault();
        isOpen.value ? selectActive() : open();
        break;
      case " ":
        if (props.filterable) break; // 交給 input 輸入空白
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
        if (!props.filterable && isPrintableKey(e)) {
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
    if (props.filterable) query.value = "";
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
    query,
    activeIndex,
    visible,
    selectedOption,
    listboxId,
    optionId,
    activeDescendant,
    toggle,
    close,
    onKeydown,
    onQueryInput,
    onOptionClick,
    onOptionActivate,
  };
}

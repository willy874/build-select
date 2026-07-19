import { computed, onBeforeUnmount, onMounted, ref, useId } from "vue";
import type { SelectOption, SelectValue, SelectModelValue } from "../types";
import { useListNavigation } from "./useListNavigation";
import { useTypeahead } from "./useTypeahead";
import { useFilter, type FilteredOption } from "./useFilter";

/** useSelect 讀取的 props 形狀(Select.vue 的 props 子集)。 */
export interface UseSelectProps {
  modelValue: SelectModelValue;
  options: SelectOption[];
  disabled: boolean;
  /** 是否開啟搜尋過濾(v6) */
  filterable: boolean;
  /** 是否多選(v7);為 true 時 modelValue 為陣列 */
  multiple: boolean;
}

/** useSelect 需要的 emit 形狀。 */
export interface UseSelectEmit {
  (e: "update:modelValue", value: SelectModelValue): void;
  (e: "change", value: SelectModelValue): void;
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
 * 組合 {@link useListNavigation}、{@link useTypeahead}、{@link useFilter},
 * 掌管開合、選取提交、鍵盤分派、外部點擊關閉、combobox 的 ARIA 關聯。
 *
 * v6 filterable:開啟時以 query 過濾出 visible;打字交給搜尋 input。
 * v7 multiple:modelValue 為陣列,選取改為 toggle 且**不關閉面板**,
 *   已選以 chips 呈現(可移除);filterable + multiple 時 query 為空按 Backspace 移除最後一個。
 */
export function useSelect(props: UseSelectProps, emit: UseSelectEmit) {
  const rootRef = ref<HTMLElement | null>(null);
  const triggerRef = ref<TriggerExpose | null>(null);
  const dropdownRef = ref<DropdownExpose | null>(null);
  const isOpen = ref(false);
  const query = ref("");

  const uid = useId();
  const listboxId = `${uid}-listbox`;
  const optionId = (index: number) => `${uid}-option-${index}`;

  const options = computed(() => props.options);

  /** 目前已選的值集合(單選 → 至多 1 個;多選 → 陣列)。 */
  const selectedValues = computed<SelectValue[]>(() => {
    if (props.multiple) {
      return Array.isArray(props.modelValue) ? props.modelValue : [];
    }
    return props.modelValue == null || Array.isArray(props.modelValue)
      ? []
      : [props.modelValue];
  });
  const isSelected = (value: SelectValue) => selectedValues.value.includes(value);

  /** 單選顯示用:目前已選項(取第一個)。 */
  const selectedOption = computed(
    () => options.value.find((opt) => isSelected(opt.value)) ?? null
  );
  /** 多選顯示用:依 modelValue 陣列順序對應的已選項(給 chips)。 */
  const selectedOptions = computed(() =>
    selectedValues.value
      .map((v) => options.value.find((opt) => opt.value === v))
      .filter((opt): opt is SelectOption => !!opt)
  );

  const { filtered } = useFilter(options, query);

  const visible = computed<FilteredOption[]>(() =>
    props.filterable && isOpen.value
      ? filtered.value
      : options.value.map((option, index) => ({ option, index, matched: [] }))
  );
  const visibleOptions = computed(() => visible.value.map((v) => v.option));
  const visibleSelectedIndex = computed(() =>
    visible.value.findIndex((v) => isSelected(v.option.value))
  );

  const nav = useListNavigation(visibleOptions, {
    selectedIndex: visibleSelectedIndex,
  });
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
    if (props.filterable) query.value = "";
    isOpen.value = true;
    nav.initActive();
  }

  function close() {
    if (!isOpen.value) return;
    isOpen.value = false;
    nav.reset();
    if (props.filterable) query.value = "";
    triggerRef.value?.focus();
  }

  function toggle() {
    if (props.disabled) return;
    isOpen.value ? close() : open();
  }

  /** 送出新的 modelValue(單選為純量、多選為陣列)。 */
  function emitValue(value: SelectModelValue) {
    emit("update:modelValue", value);
    emit("change", value);
  }

  function commit(opt: SelectOption) {
    if (opt.disabled) return;
    if (props.multiple) {
      // toggle 加入 / 移除;面板保持開啟以便連續多選
      const cur = selectedValues.value;
      const next = cur.includes(opt.value)
        ? cur.filter((v) => v !== opt.value)
        : [...cur, opt.value];
      emitValue(next);
      if (props.filterable) query.value = ""; // 清空搜尋,可繼續找下一個
    } else {
      if (opt.value !== props.modelValue) emitValue(opt.value);
      close();
    }
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

  /** 移除某個已選 chip(僅 multiple)。 */
  function onRemoveChip(value: SelectValue) {
    if (props.disabled || !props.multiple) return;
    emitValue(selectedValues.value.filter((v) => v !== value));
  }

  function onQueryInput(value: string) {
    if (!isOpen.value) open();
    query.value = value;
    nav.moveEdge(1);
  }

  function isPrintableKey(e: KeyboardEvent): boolean {
    return e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
  }

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
      case "Backspace":
        // filterable + multiple:query 為空時 Backspace 移除最後一個 chip
        if (
          props.multiple &&
          props.filterable &&
          query.value === "" &&
          selectedValues.value.length
        ) {
          e.preventDefault();
          onRemoveChip(selectedValues.value[selectedValues.value.length - 1]);
        }
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
    if (rootRef.value?.contains(target)) return;
    if (dropdownRef.value?.el?.contains(target)) return;
    if (!isOpen.value) return;
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
    selectedOptions,
    isSelected,
    listboxId,
    optionId,
    activeDescendant,
    toggle,
    close,
    onKeydown,
    onQueryInput,
    onOptionClick,
    onOptionActivate,
    onRemoveChip,
  };
}

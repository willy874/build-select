import { computed, type Ref } from "vue";
import { match } from "pinyin-pro";
import type { SelectOption } from "../types";

/** 過濾後的選項:帶原始索引與命中字元索引(供高亮)。 */
export interface FilteredOption {
  option: SelectOption;
  /** 在原始 options 中的索引 */
  index: number;
  /** 命中的字元索引(label 內);空陣列表示未特別標記 */
  matched: number[];
}

/**
 * 判斷 query 是否只含 ASCII(用來決定要不要走拼音比對)。
 * 打中文字時 query 非 ASCII,直接走子字串即可。
 */
function isAscii(str: string): boolean {
  return /^[\x00-\x7F]*$/.test(str);
}

/**
 * 對單一 label 求命中字元索引:
 * 1. 一般子字串(忽略大小寫)——可打中文字或拉丁 label
 * 2. 拼音比對(pinyin-pro:首字母 / 全拼 / 混合)——可打拼音
 * 回傳命中索引;皆未命中回 `null`。
 */
function matchLabel(label: string, query: string): number[] | null {
  const lower = query.toLowerCase();
  const at = label.toLowerCase().indexOf(lower);
  if (at >= 0) {
    return Array.from({ length: lower.length }, (_, i) => at + i);
  }
  if (isAscii(query)) {
    try {
      const py = match(label, query);
      if (py && py.length) return py;
    } catch {
      // pinyin-pro 對某些輸入可能拋錯,視為未命中
    }
  }
  return null;
}

/**
 * 純函式:依 query 過濾 options,回傳命中清單(含高亮索引)。
 * query 為空時回傳全部(matched 為空)。抽成純函式以便單獨測試。
 */
export function filterOptions(
  options: SelectOption[],
  query: string
): FilteredOption[] {
  const q = query.trim();
  if (!q) {
    return options.map((option, index) => ({ option, index, matched: [] }));
  }
  const result: FilteredOption[] = [];
  options.forEach((option, index) => {
    const matched = matchLabel(option.label, q);
    if (matched) result.push({ option, index, matched });
  });
  return result;
}

/**
 * useFilter — 把 filterOptions 包成響應式 computed。
 *
 * 支援拼音模糊比對(pinyin-pro)與一般子字串,命中索引可餵給選項高亮。
 */
export function useFilter(options: Ref<SelectOption[]>, query: Ref<string>) {
  const filtered = computed(() => filterOptions(options.value, query.value));
  return { filtered };
}

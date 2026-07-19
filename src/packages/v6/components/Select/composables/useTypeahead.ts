import type { Ref } from "vue";
import type { SelectOption } from "../types";

/** 連續打字的累積視窗(毫秒);逾時後 buffer 歸零。 */
const TYPE_RESET_MS = 500;

/**
 * useTypeahead — 打字跳到符合開頭的選項。
 *
 * 累積使用者輸入成 buffer,在 `TYPE_RESET_MS` 內連打會續接,
 * 逾時歸零。比對 label 開頭(忽略大小寫、略過 disabled),命中就回呼 `onMatch`。
 *
 * @param options 選項清單
 * @param onMatch 命中選項時的回呼,參數為命中索引
 */
export function useTypeahead(
  options: Ref<SelectOption[]>,
  onMatch: (index: number) => void
) {
  let buffer = "";
  let timer: ReturnType<typeof setTimeout> | null = null;

  function onChar(char: string) {
    buffer += char.toLowerCase();
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => (buffer = ""), TYPE_RESET_MS);

    const match = options.value.findIndex(
      (opt) => !opt.disabled && opt.label.toLowerCase().startsWith(buffer)
    );
    if (match >= 0) onMatch(match);
  }

  /** buffer 是否進行中(用來判斷 Space 該當輸入字元或選取)。 */
  function isBuffering() {
    return buffer.length > 0;
  }

  function clear() {
    buffer = "";
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  return { onChar, isBuffering, clear };
}

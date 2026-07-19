import { ref, type Ref } from "vue";
import type { SelectOption } from "../types";

/**
 * useListNavigation — 鍵盤清單導覽的「虛擬焦點」狀態機。
 *
 * 只負責計算 `activeIndex`(目前高亮的選項索引),自動略過 disabled 選項。
 * **刻意不碰 DOM**:`scrollIntoView` 之類需要元素的動作留給元件層,
 * 換取這個 composable 可用純函式方式測試、也可被其他清單型元件重用。
 *
 * @param options       選項清單
 * @param ctx.selectedIndex 目前已選項的索引(開啟時高亮定位到它)
 */
export function useListNavigation(
  options: Ref<SelectOption[]>,
  ctx: { selectedIndex: Ref<number> }
) {
  /** 目前高亮的索引;-1 代表沒有任何高亮。 */
  const activeIndex = ref(-1);

  /** 取頭 / 尾端第一個未停用選項(dir=1 從頭找、dir=-1 從尾找)。 */
  function edgeEnabled(dir: 1 | -1): number {
    const list = options.value;
    if (dir === 1) {
      for (let i = 0; i < list.length; i++) if (!list[i].disabled) return i;
    } else {
      for (let i = list.length - 1; i >= 0; i--) if (!list[i].disabled) return i;
    }
    return -1;
  }

  /** 從 `from` 往 `dir` 找下一個未停用選項;找不到就停在原地(不環繞)。 */
  function nextEnabled(from: number, dir: 1 | -1): number {
    let i = from;
    for (;;) {
      i += dir;
      if (i < 0 || i >= options.value.length) {
        return from < 0 ? edgeEnabled(dir) : from;
      }
      if (!options.value[i]?.disabled) return i;
    }
  }

  function setActive(index: number) {
    activeIndex.value = index;
  }
  function moveActive(dir: 1 | -1) {
    setActive(nextEnabled(activeIndex.value, dir));
  }
  function moveEdge(dir: 1 | -1) {
    setActive(edgeEnabled(dir));
  }
  /** 開啟時把高亮定位到已選項;若無已選或已選為 disabled,定位到第一個可選項。 */
  function initActive() {
    const sel = ctx.selectedIndex.value;
    activeIndex.value =
      sel >= 0 && !options.value[sel]?.disabled ? sel : edgeEnabled(1);
  }
  function reset() {
    activeIndex.value = -1;
  }

  return { activeIndex, setActive, moveActive, moveEdge, initActive, reset };
}

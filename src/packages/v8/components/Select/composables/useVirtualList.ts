import { computed, ref, type Ref } from "vue";

/**
 * useVirtualList — 固定列高的清單虛擬化(windowing)。
 *
 * 只渲染可視範圍(加上 overscan)內的項目,避免上千筆選項全進 DOM。
 * 純計算,不持有 DOM 元素:呼叫端在 scroll / 開啟時以 `setViewport` 餵入
 * 目前的 scrollTop 與容器高度,再依 `range` / `offsetY` / `totalHeight` 渲染。
 *
 * @param itemCount   項目總數(響應式)
 * @param itemHeight  單列固定高度(px,響應式)
 * @param overscan    可視範圍上下額外多渲染的列數(緩衝),預設 4
 */
export function useVirtualList(
  itemCount: Ref<number>,
  itemHeight: Ref<number>,
  overscan = 4
) {
  const scrollTop = ref(0);
  const viewportHeight = ref(0);

  const totalHeight = computed(() => itemCount.value * itemHeight.value);

  const range = computed(() => {
    const h = itemHeight.value;
    if (h <= 0 || viewportHeight.value <= 0) {
      return { start: 0, end: itemCount.value };
    }
    const start = Math.max(0, Math.floor(scrollTop.value / h) - overscan);
    const visibleCount = Math.ceil(viewportHeight.value / h);
    const end = Math.min(itemCount.value, start + visibleCount + overscan * 2);
    return { start, end };
  });

  /** 目前渲染窗的頂端偏移(px),配合 transform: translateY 使用。 */
  const offsetY = computed(() => range.value.start * itemHeight.value);

  /** 由 scroll / resize / 開啟時更新視窗狀態。 */
  function setViewport(top: number, height: number) {
    scrollTop.value = top;
    viewportHeight.value = height;
  }

  /**
   * 計算並回傳「要讓 index 進入可視範圍」所需的 scrollTop;
   * 若已在範圍內回傳 null(不需捲動)。呼叫端據此設定容器 scrollTop。
   */
  function scrollOffsetFor(index: number): number | null {
    const h = itemHeight.value;
    const top = index * h;
    const bottom = top + h;
    if (top < scrollTop.value) return top;
    if (bottom > scrollTop.value + viewportHeight.value) {
      return bottom - viewportHeight.value;
    }
    return null;
  }

  /** 是否已捲動到接近底部(供無限滾動觸發 load-more)。 */
  function isNearBottom(threshold = itemHeight.value * 3): boolean {
    return (
      scrollTop.value + viewportHeight.value >= totalHeight.value - threshold
    );
  }

  return {
    scrollTop,
    viewportHeight,
    totalHeight,
    range,
    offsetY,
    setViewport,
    scrollOffsetFor,
    isNearBottom,
  };
}

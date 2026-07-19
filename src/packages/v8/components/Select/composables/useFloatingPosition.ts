import { nextTick, onBeforeUnmount, ref, watch, type Ref } from "vue";

/** 面板預設最大高度；實際會依可用空間再往下夾。 */
const DEFAULT_MAX_HEIGHT = 240;
/** trigger 與面板之間的間距。 */
const GAP = 4;
/** 面板與視窗邊緣至少保留的邊距。 */
const VIEWPORT_MARGIN = 8;

/**
 * useFloatingPosition — 浮層定位(v3 的 fixed 座標定位獨立成 composable)。
 *
 * v5 新增「智慧定位(flip)」:
 * - 量測 trigger 下方可用空間,若不足且上方較寬,面板改為**向上展開**。
 * - 依展開方向的可用空間**動態夾住 max-height**,面板永遠不溢出視窗(超出則內捲)。
 *
 * 之所以住在 composable:定位是與 Select 業務無關的純幾何問題,
 * Modal / Tooltip 等浮層元件都能共用同一套 anchor → floating 的座標計算。
 *
 * @param anchor   觸發器(定位基準)的 DOM 元素
 * @param floating 浮層(面板)的 DOM 元素,用來量測內容高度以決定翻面
 * @param isOpen   是否開啟;開啟期間監聽 scroll(capture)/resize 即時校正
 */
export function useFloatingPosition(
  anchor: Ref<HTMLElement | null>,
  floating: Ref<HTMLElement | null>,
  isOpen: Ref<boolean>
) {
  const style = ref<Record<string, string>>({});

  function update() {
    const el = anchor.value;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const viewportH = window.innerHeight;

    const spaceBelow = viewportH - rect.bottom - GAP - VIEWPORT_MARGIN;
    const spaceAbove = rect.top - GAP - VIEWPORT_MARGIN;

    // 用 scrollHeight(完整內容高)判斷翻面,避免被夾住後的高度回授造成抖動
    const content = floating.value?.scrollHeight ?? 0;
    const desired = Math.min(DEFAULT_MAX_HEIGHT, content);

    // 下方放不下且上方比下方寬 → 向上展開
    const openUp = desired > spaceBelow && spaceAbove > spaceBelow;
    const available = Math.max(0, openUp ? spaceAbove : spaceBelow);
    const maxHeight = Math.min(DEFAULT_MAX_HEIGHT, available);

    const next: Record<string, string> = {
      position: "fixed",
      left: `${Math.round(rect.left)}px`,
      minWidth: `${Math.round(rect.width)}px`,
      maxHeight: `${Math.round(maxHeight)}px`,
    };

    if (openUp) {
      // 以「面板底邊貼齊 trigger 上緣」定位,面板隨 max-height 向上長
      next.bottom = `${Math.round(viewportH - rect.top + GAP)}px`;
    } else {
      next.top = `${Math.round(rect.bottom + GAP)}px`;
    }

    style.value = next;
  }

  function addListeners() {
    // scroll 用 capture 以攔截任何祖先層(含巢狀捲動容器)的捲動
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
  }
  function removeListeners() {
    window.removeEventListener("scroll", update, true);
    window.removeEventListener("resize", update);
  }

  watch(isOpen, async (open) => {
    if (open) {
      addListeners();
      update();
      // 面板掛載後再量一次(此時 scrollHeight 才反映真實內容)以校正翻面與夾高
      await nextTick();
      update();
    } else {
      removeListeners();
    }
  });

  onBeforeUnmount(removeListeners);

  return { style, update };
}

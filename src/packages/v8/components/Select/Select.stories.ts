import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref, watch } from "vue";
import Select from "./Select.vue";
import type { SelectOption } from "./types";

// 5000 筆本地選項,用來示範虛擬列表
const bigList: SelectOption[] = Array.from({ length: 5000 }, (_, i) => ({
  label: `項目 ${String(i + 1).padStart(4, "0")}`,
  value: i + 1,
}));

// 模擬遠端資料源:1000 筆「使用者」,依 query 過濾後分頁回傳
const ALL_USERS: SelectOption[] = Array.from({ length: 1000 }, (_, i) => ({
  label: `使用者 ${String(i + 1).padStart(4, "0")}`,
  value: i + 1,
}));
const PAGE_SIZE = 30;
function fetchUsers(
  query: string,
  page: number
): Promise<{ items: SelectOption[]; hasMore: boolean }> {
  const q = query.trim();
  const pool = q ? ALL_USERS.filter((u) => u.label.includes(q)) : ALL_USERS;
  const start = page * PAGE_SIZE;
  const items = pool.slice(start, start + PAGE_SIZE);
  return new Promise((resolve) =>
    setTimeout(
      () => resolve({ items, hasMore: start + PAGE_SIZE < pool.length }),
      400
    )
  );
}

const fruits: SelectOption[] = [
  { label: "蘋果", value: "apple" },
  { label: "香蕉", value: "banana" },
  { label: "櫻桃", value: "cherry" },
  { label: "榴槤（缺貨）", value: "durian", disabled: true },
  { label: "葡萄", value: "grape" },
  { label: "奇異果", value: "kiwi" },
];

const cities: SelectOption[] = [
  { label: "臺北", value: "tpe" },
  { label: "新北", value: "ntpc" },
  { label: "桃園", value: "tyn" },
  { label: "臺中", value: "txg" },
  { label: "臺南", value: "tnn" },
  { label: "高雄", value: "khh" },
  { label: "基隆", value: "kel" },
  { label: "新竹", value: "hsz" },
  { label: "嘉義", value: "cyi" },
  { label: "花蓮", value: "hun" },
];

const meta: Meta<typeof Select> = {
  title: "v8/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    disabled: { control: "boolean" },
    filterable: { control: "boolean" },
    multiple: { control: "boolean" },
    virtual: { control: "boolean" },
    placeholder: { control: "text" },
    "onUpdate:modelValue": { action: "update:modelValue" },
    onChange: { action: "change" },
  },
  args: {
    options: fruits,
    placeholder: "請選擇水果",
    size: "medium",
    disabled: false,
    filterable: false,
    multiple: false,
  },
  render: (args) => ({
    components: { Select },
    setup() {
      const model = ref(args.modelValue ?? null);
      watch(
        () => args.modelValue,
        (v) => (model.value = v ?? null)
      );
      return { args, model };
    },
    template: `<Select v-bind="args" v-model="model" />`,
  }),
};

export default meta;
type Story = StoryObj<typeof Select>;

/**
 * 預設(`filterable: false`)行為與 v5 完全相同:靜態 trigger + typeahead 跳項,
 * 鍵盤 `↑↓` / `Home` / `End` / `Enter` / `Esc`、disabled 略過、智慧定位皆不變。
 */
export const Default: Story = {};

export const Preselected: Story = {
  args: { modelValue: "banana" },
};

export const Large: Story = {
  args: { size: "large" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Empty: Story = {
  args: { options: [] },
};

/**
 * ✅ v7 的多選(`multiple: true`):`modelValue` 為陣列,已選以可移除 chips 呈現,
 * 選取為 toggle(加入 / 移除)且**面板不關**,已選項顯示勾選 ✓。
 *
 * 操作:點選項 toggle、點 chip 的 × 移除、`↑↓` 移動、`Enter` toggle、`Esc` 關閉。
 */
export const Multiple: Story = {
  args: { multiple: true, modelValue: [], placeholder: "請選擇水果（可多選）" },
};

export const MultiplePreselected: Story = {
  args: { multiple: true, modelValue: ["apple", "grape"] },
};

/**
 * ✅ v7 的完整型態:multiple + filterable —— 可**搜尋的多選**。
 *
 * chips 顯示在搜尋框前,打字(可拼音)過濾、`Enter` 加入、選取後清空搜尋可續選;
 * 搜尋框為空時按 `Backspace` 移除最後一個 chip。
 */
export const MultipleFilterable: Story = {
  args: {
    multiple: true,
    filterable: true,
    options: cities,
    modelValue: [],
    placeholder: "搜尋並多選縣市（可打拼音）",
  },
};

/**
 * ✅ v6 的搜尋過濾(`filterable: true`):trigger 變成可輸入的 combobox,
 * 打字即過濾,支援**拼音**(pinyin-pro)與一般子字串,命中片段會高亮。
 *
 * 試著輸入:
 * - 首字母 `pg`(蘋果)、`xj`(香蕉)、`qyg`(奇異果)
 * - 全拼 `xiangjiao`(香蕉)、`putao`(葡萄)
 * - 直接打中文字 `葡` 或 `果`
 *
 * 鍵盤:`↑↓` 移動、`Enter` 選取、`Esc` 關閉;停用項(榴槤)不會被命中選取。
 */
export const Filterable: Story = {
  args: { filterable: true, placeholder: "搜尋水果（可打拼音）" },
};

/**
 * filterable + 較長清單(台灣縣市),更適合展示搜尋。
 * 例:`tp`(臺北 / 臺南初步)、`taipei` 走不通但 `tb`/`tn` 首字母可,或直接打「臺」。
 */
export const FilterableCities: Story = {
  args: {
    filterable: true,
    options: cities,
    placeholder: "搜尋縣市（可打拼音）",
  },
};

/**
 * filterable + 已選值:關閉時 input 顯示已選 label,開啟時清空供輸入、
 * placeholder 提示原選擇。
 */
export const FilterablePreselected: Story = {
  args: { filterable: true, modelValue: "grape" },
};

/**
 * 長清單 + typeahead(非 filterable):高亮項會自動捲入可視範圍。
 */
export const LongListTypeahead: Story = {
  args: {
    options: Array.from({ length: 30 }, (_, i) => ({
      label: `選項 ${String(i + 1).padStart(2, "0")}`,
      value: i + 1,
    })),
    placeholder: "30 項長清單",
  },
};

/**
 * ✅ v8 的虛擬列表(`virtual: true`):**5000 筆**本地選項,但 DOM 只渲染可視範圍
 * 內的十幾列(phantom 撐出捲軸 + translateY 偏移),避免渲染超載。
 *
 * 捲動 / 用 `↑↓` 都會即時換窗;可 filterable 一起打字過濾(仍虛擬化)。
 */
export const VirtualLongList: Story = {
  args: {
    virtual: true,
    filterable: true,
    options: bigList,
    placeholder: "5000 筆(虛擬列表)",
  },
};

/**
 * ✅ v8 的遠端 + 無限滾動 + 虛擬列表:輸入送出 `search`、捲到底送出 `load-more`,
 * 由外部(這裡用 setTimeout 模擬)分頁 fetch 後 append 進 `options`。
 *
 * 操作:聚焦即載入第一頁;捲到底自動載入下一頁(顯示「載入中…」);
 * 打字(如 `使用者 01`、`0123`)重新查詢;`finished` 後停止載入。
 */
export const RemoteInfiniteScroll: Story = {
  render: () => ({
    components: { Select },
    setup() {
      const model = ref<string | number | null>(null);
      const options = ref<SelectOption[]>([]);
      const loading = ref(false);
      const finished = ref(false);
      const currentQuery = ref("");
      let page = 0;

      async function load(reset: boolean) {
        if (loading.value) return;
        loading.value = true;
        if (reset) {
          page = 0;
          options.value = [];
          finished.value = false;
        }
        const { items, hasMore } = await fetchUsers(currentQuery.value, page);
        options.value = reset ? items : [...options.value, ...items];
        finished.value = !hasMore;
        page += 1;
        loading.value = false;
      }

      function onSearch(q: string) {
        currentQuery.value = q;
        load(true);
      }
      function onLoadMore() {
        if (!finished.value) load(false);
      }

      return { model, options, loading, finished, onSearch, onLoadMore };
    },
    template: `
      <Select
        v-model="model"
        :options="options"
        :loading="loading"
        :finished="finished"
        remote
        filterable
        virtual
        placeholder="搜尋使用者（遠端 + 無限滾動）"
        @search="onSearch"
        @load-more="onLoadMore"
      />
    `,
  }),
};

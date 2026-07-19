import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref, watch } from "vue";
import Select from "./Select.vue";
import type { SelectOption } from "./types";

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
  title: "v7/Select",
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

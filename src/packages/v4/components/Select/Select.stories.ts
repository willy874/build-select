import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref, watch } from "vue";
import Select from "./Select.vue";
import type { SelectOption } from "./Select.vue";

const fruits: SelectOption[] = [
  { label: "蘋果", value: "apple" },
  { label: "香蕉", value: "banana" },
  { label: "櫻桃", value: "cherry" },
  { label: "榴槤（缺貨）", value: "durian", disabled: true },
  { label: "葡萄", value: "grape" },
  { label: "奇異果", value: "kiwi" },
];

const meta: Meta<typeof Select> = {
  title: "v4/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    "onUpdate:modelValue": { action: "update:modelValue" },
    onChange: { action: "change" },
  },
  args: {
    options: fruits,
    placeholder: "請選擇水果",
    size: "medium",
    disabled: false,
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
 * v4 補回 v1 原生 `<select>` 起就該有、但 v2 改自訂 `<div>` 後遺失的鍵盤與無障礙能力。
 *
 * 試著用鍵盤操作（先 `Tab` 聚焦到觸發器）：
 * - `↑` / `↓`：開啟面板、上下移動高亮
 * - `Home` / `End`：跳到第一 / 最後一個可選項
 * - `Enter` / `Space`：選取目前高亮項
 * - `Esc`：關閉面板，焦點收回觸發器
 * - 直接打字（如「香」「k」）：typeahead 跳到符合開頭的選項
 * - 停用選項（榴槤）在鍵盤導覽時會被自動略過
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
 * a11y 驗證：焦點與鍵盤流。
 *
 * 用 `Tab` 在三個 Select 之間移動，可看到清楚的 focus ring（`:focus-visible`）——
 * 這是 v2 改自訂 `<div>` 後遺失、v4 補回的能力。
 * 每個 Select 開合互不干擾，關閉後焦點都會收回自己的觸發器。
 */
export const KeyboardFocusFlow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "三個相鄰 Select，示範 Tab 焦點流轉與 focus ring。用純鍵盤即可完成聚焦 → 展開 → 選取 → 關閉的完整操作。",
      },
    },
  },
  render: (args) => ({
    components: { Select },
    setup() {
      const a = ref<string | number | null>(null);
      const b = ref<string | number | null>(null);
      const c = ref<string | number | null>(null);
      return { args, a, b, c };
    },
    template: `
      <div style="display: flex; gap: 16px; align-items: flex-start;">
        <Select v-bind="args" v-model="a" placeholder="第一個" />
        <Select v-bind="args" v-model="b" placeholder="第二個" />
        <Select v-bind="args" v-model="c" placeholder="第三個" />
      </div>
    `,
  }),
};

/**
 * typeahead 與長清單捲動：高亮項會自動捲入可視範圍（`scrollIntoView`）。
 *
 * 聚焦後連續打字（例如注音 / 英文開頭），面板會跳到第一個符合的選項；
 * 用 `↓` 一路往下，高亮超出面板可視區時會自動捲動跟上。
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

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

const meta: Meta<typeof Select> = {
  title: "v5/Select",
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
 * v5 把 v4 的單檔 Select 拆成「大腦(composables)+ 臉(呈現子元件)」,
 * 對外 API、鍵盤操作與 a11y 與 v4 完全相同,並新增智慧定位(flip)。
 *
 * 鍵盤(先 `Tab` 聚焦):`↑↓` / `Home` / `End` / `Enter` / `Esc` / 打字 typeahead,
 * disabled 選項自動略過。
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
 * ✅ v5 的智慧定位(flip):Select 貼近視窗底部時,面板下方空間不足,
 * 自動改為**向上展開**,並依可用空間夾住高度,面板不溢出視窗。
 *
 * 這個 story 用一大塊 spacer 把 Select 推到視窗底部;展開下拉即可看到面板往上翻。
 */
export const FlipsUpNearBottom: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Select 被推到視窗底部,下方放不下 → 面板自動向上展開(flip),並夾住高度不超出視窗。",
      },
    },
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
    template: `
      <div>
        <div style="height: 78vh; display: flex; align-items: flex-end; color: #9ca3af; font-size: 13px;">
          ↓ 下方的 Select 貼近視窗底部,展開時面板會向上翻
        </div>
        <Select v-bind="args" v-model="model" />
      </div>
    `,
  }),
};

/**
 * 長清單 + typeahead:高亮項會自動捲入可視範圍;貼近底部時同樣會 flip 上翻。
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

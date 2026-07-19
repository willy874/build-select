import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref, watch } from "vue";
import Select from "./Select.vue";
import type { SelectOption } from "./Select.vue";

const fruits: SelectOption[] = [
  { label: "蘋果", value: "apple" },
  { label: "香蕉", value: "banana" },
  { label: "櫻桃", value: "cherry" },
  { label: "榴槤（缺貨）", value: "durian", disabled: true },
];

const meta: Meta<typeof Select> = {
  title: "v3/Select",
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
 * ✅ v3 的解法：面板不再被父層 `overflow` 裁切。
 *
 * v3 用 **Portal** 元件把下拉面板傳送到 `<body>`，並改以
 * `position: fixed` + trigger 的 viewport 座標即時定位。
 * 面板已脫離元件父層，因此任何祖先的 `overflow: hidden / auto / scroll`
 * 都無法再裁切它。
 *
 * 這是與 v2「ClippedInOverflowContainer」**完全相同**的外層卡片，
 * 但 v3 的面板可以完整浮出卡片邊界。
 */
export const NotClippedInOverflowContainer: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "與 v2 缺陷案例相同的 `overflow: hidden` 矮卡片。v3 透過 Portal 把面板傳送到 body，展開後面板完整顯示、不再被裁切。",
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
      <div style="max-width: 320px;">
        <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px;">
          外層卡片：<code>overflow: hidden</code> + 固定高度（與 v2 案例相同）
        </p>
        <div style="
          height: 96px;
          padding: 16px;
          border: 1px dashed #22c55e;
          border-radius: 8px;
          overflow: hidden;
          background: #f3fdf6;
        ">
          <Select v-bind="args" v-model="model" />
        </div>
        <p style="margin: 8px 0 0; color: #16a34a; font-size: 13px;">
          ✅ 展開下拉——面板由 Portal 傳送到 body，完整浮出卡片、不被裁切。
        </p>
      </div>
    `,
  }),
};

/**
 * 進一步驗證：即使外層是**可捲動容器**，面板依然能正確定位並隨捲動更新。
 *
 * v3 的 `position: fixed` 定位會在捲動 / resize 時重新校正 trigger 座標，
 * 因此面板始終貼齊觸發器。
 */
export const InsideScrollContainer: Story = {
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
      <div style="
        height: 160px;
        width: 320px;
        padding: 16px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        overflow: auto;
        background: #fafafa;
      ">
        <div style="height: 60px;"></div>
        <Select v-bind="args" v-model="model" />
        <div style="height: 400px;"></div>
      </div>
    `,
  }),
};

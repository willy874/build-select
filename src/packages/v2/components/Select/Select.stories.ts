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
  title: "v2/Select",
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

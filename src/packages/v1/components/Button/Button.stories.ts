import type { Meta, StoryObj } from "@storybook/vue3-vite";
import Button from "./Button.vue";

const meta: Meta<typeof Button> = {
  title: "v1/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "danger"],
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    disabled: { control: "boolean" },
    onClick: { action: "click" },
  },
  args: {
    variant: "primary",
    size: "medium",
    disabled: false,
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: `<Button v-bind="args">Button</Button>`,
  }),
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

export const Danger: Story = {
  args: { variant: "danger" },
};

export const Large: Story = {
  args: { size: "large" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

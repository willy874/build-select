import type { Meta, StoryObj } from "@storybook/vue3-vite";
import Portal from "./Portal.vue";

/**
 * `Portal` 把 slot 內容傳送到 DOM 樹的其他位置（預設 `<body>`）。
 *
 * 它是對 Vue 內建 `<Teleport>` 的薄封裝，提供合理預設（body）與型別化 API，
 * 作為 Select 等浮層元件的共用基礎。核心價值：讓面板 / Modal / Tooltip
 * 脫離父層的 `overflow` 與 stacking context 束縛。
 */
const meta: Meta<typeof Portal> = {
  title: "v7/Portal",
  component: Portal,
  tags: ["autodocs"],
  argTypes: {
    to: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    to: "body",
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Portal>;

/**
 * 對照組：左側方塊在 `overflow: hidden` 容器內「原地」渲染（`disabled`），
 * 會被容器裁切；右側方塊透過 Portal 傳送到 `<body>`，完整浮出。
 *
 * 切換 controls 的 `disabled` 即可看到 Portal 開 / 關的差異。
 */
export const Basic: Story = {
  render: (args) => ({
    components: { Portal },
    setup() {
      return { args };
    },
    template: `
      <div>
        <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px;">
          容器：<code>overflow: hidden</code>，高度 80px
        </p>
        <div style="
          position: relative;
          height: 80px;
          width: 260px;
          padding: 12px;
          border: 1px dashed #6366f1;
          border-radius: 8px;
          overflow: hidden;
          background: #f5f5ff;
        ">
          方塊會浮出容器下緣 →
          <Portal v-bind="args">
            <div style="
              position: fixed;
              margin-top: 12px;
              padding: 12px 16px;
              border-radius: 8px;
              background: #6366f1;
              color: #fff;
              box-shadow: 0 6px 16px rgba(0,0,0,0.2);
              z-index: 1000;
            ">
              我被 Portal 傳送到 &lt;body&gt;，不受容器裁切。
            </div>
          </Portal>
        </div>
      </div>
    `,
  }),
};

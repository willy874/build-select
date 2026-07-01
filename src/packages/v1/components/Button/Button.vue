<script setup lang="ts">
import { computed } from "vue";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "small" | "medium" | "large";

const props = withDefaults(
  defineProps<{
    /** 視覺樣式 */
    variant?: ButtonVariant;
    /** 尺寸 */
    size?: ButtonSize;
    /** 是否停用 */
    disabled?: boolean;
  }>(),
  {
    variant: "primary",
    size: "medium",
    disabled: false,
  }
);

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const classes = computed(() => [
  "bs-button",
  `bs-button--${props.variant}`,
  `bs-button--${props.size}`,
]);

function onClick(event: MouseEvent) {
  if (props.disabled) return;
  emit("click", event);
}
</script>

<template>
  <button :class="classes" :disabled="disabled" type="button" @click="onClick">
    <slot />
  </button>
</template>

<style scoped>
.bs-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.bs-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.bs-button--primary {
  background-color: #2563eb;
  color: #fff;
}

.bs-button--secondary {
  background-color: #e5e7eb;
  color: #111827;
}

.bs-button--danger {
  background-color: #dc2626;
  color: #fff;
}

.bs-button--small {
  padding: 4px 10px;
  font-size: 12px;
}

.bs-button--medium {
  padding: 8px 16px;
  font-size: 14px;
}

.bs-button--large {
  padding: 12px 22px;
  font-size: 16px;
}
</style>

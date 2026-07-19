/** 單一選項的值型別。 */
export type SelectValue = string | number;

export interface SelectOption {
  label: string;
  value: SelectValue;
  disabled?: boolean;
}

export type SelectSize = "small" | "medium" | "large";

/**
 * v-model 的值型別:
 * - 單選:`SelectValue | null`
 * - 多選(multiple):`SelectValue[]`
 */
export type SelectModelValue = SelectValue | SelectValue[] | null;

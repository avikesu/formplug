export type TextFieldSize = "xsmall" | "small" | "medium" | "large";

export const textFieldSizeOptions: Array<{
  value: TextFieldSize;
  label: string;
}> = [
  { value: "xsmall", label: "X-Small" },
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

export const titleSizeClassMap: Record<TextFieldSize, string> = {
  xsmall: "text-2xl",
  small: "text-3xl",
  medium: "text-4xl",
  large: "text-5xl",
};

export const subTitleSizeClassMap: Record<TextFieldSize, string> = {
  xsmall: "text-base",
  small: "text-lg",
  medium: "text-xl",
  large: "text-2xl",
};

export const paragraphSizeClassMap: Record<TextFieldSize, string> = {
  xsmall: "text-xs",
  small: "text-sm",
  medium: "text-base",
  large: "text-lg",
};

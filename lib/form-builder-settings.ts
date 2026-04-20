export type FormLayoutWidth = "narrow" | "regular" | "wide";
export type FormLayoutAlignment = "left" | "center";
export type FormSurfaceStyle = "soft" | "outline" | "elevated";

export type FormBuilderSettings = {
  showHeader: boolean;
  width: FormLayoutWidth;
  alignment: FormLayoutAlignment;
  surfaceStyle: FormSurfaceStyle;
};

export const defaultFormBuilderSettings: FormBuilderSettings = {
  showHeader: true,
  width: "regular",
  alignment: "center",
  surfaceStyle: "elevated",
};

export function normalizeFormBuilderSettings(
  value: unknown,
): FormBuilderSettings {
  if (!value || typeof value !== "object") {
    return defaultFormBuilderSettings;
  }

  const candidate = value as Partial<FormBuilderSettings>;

  return {
    showHeader:
      typeof candidate.showHeader === "boolean"
        ? candidate.showHeader
        : defaultFormBuilderSettings.showHeader,
    width:
      candidate.width === "narrow" ||
      candidate.width === "regular" ||
      candidate.width === "wide"
        ? candidate.width
        : defaultFormBuilderSettings.width,
    alignment:
      candidate.alignment === "left" || candidate.alignment === "center"
        ? candidate.alignment
        : defaultFormBuilderSettings.alignment,
    surfaceStyle:
      candidate.surfaceStyle === "soft" ||
      candidate.surfaceStyle === "outline" ||
      candidate.surfaceStyle === "elevated"
        ? candidate.surfaceStyle
        : defaultFormBuilderSettings.surfaceStyle,
  };
}

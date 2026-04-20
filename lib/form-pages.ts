import type { FormElementInstance } from "@/components/FormElements";

export type FormPageQuestionTitleLocation =
  | "default"
  | "top"
  | "bottom"
  | "left"
  | "hidden";

export type FormPageQuestionErrorLocation = "default" | "top" | "bottom";

export type FormPageQuestionOrder = "default" | "initial" | "random";

export type FormPageShowQuestionNumbers =
  | "default"
  | "recursive"
  | "onpanel"
  | "off";

export type FormPageState = "default" | "expanded" | "collapsed";

export type FormPageSurfaceRadius = "xl" | "2xl" | "3xl";

export type FormPageSurfaceShadow = "none" | "soft" | "medium" | "strong";

export type FormPageDocument = {
  id: string;
  name: string;
  title: string;
  description: string;
  visible: boolean;
  visibleIf: string;
  readOnly: boolean;
  enableIf: string;
  requiredIf: string;
  requiredErrorText: string;
  questionTitleLocation: FormPageQuestionTitleLocation;
  questionTitleWidth: string;
  questionErrorLocation: FormPageQuestionErrorLocation;
  questionOrder: FormPageQuestionOrder;
  showQuestionNumbers: FormPageShowQuestionNumbers;
  questionStartIndex: string;
  state: FormPageState;
  width: string;
  minWidth: string;
  maxWidth: string;
  gridLayoutColumns: string;
  canvasBackgroundColor: string;
  pageBackgroundColor: string;
  pageHeaderBackgroundColor: string;
  pageBorderColor: string;
  questionBackgroundColor: string;
  questionBorderColor: string;
  headingColor: string;
  bodyTextColor: string;
  surfaceRadius: FormPageSurfaceRadius;
  surfaceShadow: FormPageSurfaceShadow;
  contentPadding: string;
  elements: FormElementInstance[];
};

export const defaultFormPageProperties: Omit<FormPageDocument, "id" | "name"> =
  {
    title: "",
    description: "",
    visible: true,
    visibleIf: "",
    readOnly: false,
    enableIf: "",
    requiredIf: "",
    requiredErrorText: "",
    questionTitleLocation: "default",
    questionTitleWidth: "",
    questionErrorLocation: "default",
    questionOrder: "default",
    showQuestionNumbers: "default",
    questionStartIndex: "1",
    state: "default",
    width: "",
    minWidth: "",
    maxWidth: "",
    gridLayoutColumns: "",
    canvasBackgroundColor: "",
    pageBackgroundColor: "",
    pageHeaderBackgroundColor: "",
    pageBorderColor: "",
    questionBackgroundColor: "",
    questionBorderColor: "",
    headingColor: "",
    bodyTextColor: "",
    surfaceRadius: "2xl",
    surfaceShadow: "soft",
    contentPadding: "1.5rem",
    elements: [],
  };

export const pageSurfaceRadiusClassMap: Record<FormPageSurfaceRadius, string> =
  {
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
  };

export const pageSurfaceShadowClassMap: Record<FormPageSurfaceShadow, string> =
  {
    none: "shadow-none",
    soft: "shadow-[0_12px_40px_-30px_rgba(15,23,42,0.5)]",
    medium: "shadow-[0_22px_55px_-32px_rgba(15,23,42,0.45)]",
    strong: "shadow-[0_30px_80px_-34px_rgba(15,23,42,0.4)]",
  };

export function createDefaultFormPage(index = 0): FormPageDocument {
  const pageNumber = index + 1;

  return {
    ...defaultFormPageProperties,
    id: `page-${pageNumber}`,
    name: `page${pageNumber}`,
    title: `Page ${pageNumber}`,
    elements: [],
  };
}

export function normalizeFormPageDocument(
  page: unknown,
  fallbackIndex = 0,
): FormPageDocument {
  const fallbackPage = createDefaultFormPage(fallbackIndex);

  if (!page || typeof page !== "object") {
    return fallbackPage;
  }

  const candidate = page as Partial<FormPageDocument>;

  return {
    id:
      typeof candidate.id === "string" && candidate.id.trim().length > 0
        ? candidate.id
        : fallbackPage.id,
    name:
      typeof candidate.name === "string" && candidate.name.trim().length > 0
        ? candidate.name
        : fallbackPage.name,
    title:
      typeof candidate.title === "string"
        ? candidate.title
        : fallbackPage.title,
    description:
      typeof candidate.description === "string"
        ? candidate.description
        : fallbackPage.description,
    visible:
      typeof candidate.visible === "boolean"
        ? candidate.visible
        : fallbackPage.visible,
    visibleIf:
      typeof candidate.visibleIf === "string"
        ? candidate.visibleIf
        : fallbackPage.visibleIf,
    readOnly:
      typeof candidate.readOnly === "boolean"
        ? candidate.readOnly
        : fallbackPage.readOnly,
    enableIf:
      typeof candidate.enableIf === "string"
        ? candidate.enableIf
        : fallbackPage.enableIf,
    requiredIf:
      typeof candidate.requiredIf === "string"
        ? candidate.requiredIf
        : fallbackPage.requiredIf,
    requiredErrorText:
      typeof candidate.requiredErrorText === "string"
        ? candidate.requiredErrorText
        : fallbackPage.requiredErrorText,
    questionTitleLocation:
      candidate.questionTitleLocation === "top" ||
      candidate.questionTitleLocation === "bottom" ||
      candidate.questionTitleLocation === "left" ||
      candidate.questionTitleLocation === "hidden" ||
      candidate.questionTitleLocation === "default"
        ? candidate.questionTitleLocation
        : fallbackPage.questionTitleLocation,
    questionTitleWidth:
      typeof candidate.questionTitleWidth === "string"
        ? candidate.questionTitleWidth
        : fallbackPage.questionTitleWidth,
    questionErrorLocation:
      candidate.questionErrorLocation === "top" ||
      candidate.questionErrorLocation === "bottom" ||
      candidate.questionErrorLocation === "default"
        ? candidate.questionErrorLocation
        : fallbackPage.questionErrorLocation,
    questionOrder:
      candidate.questionOrder === "initial" ||
      candidate.questionOrder === "random" ||
      candidate.questionOrder === "default"
        ? candidate.questionOrder
        : fallbackPage.questionOrder,
    showQuestionNumbers:
      candidate.showQuestionNumbers === "recursive" ||
      candidate.showQuestionNumbers === "onpanel" ||
      candidate.showQuestionNumbers === "off" ||
      candidate.showQuestionNumbers === "default"
        ? candidate.showQuestionNumbers
        : fallbackPage.showQuestionNumbers,
    questionStartIndex:
      typeof candidate.questionStartIndex === "string"
        ? candidate.questionStartIndex
        : fallbackPage.questionStartIndex,
    state:
      candidate.state === "expanded" ||
      candidate.state === "collapsed" ||
      candidate.state === "default"
        ? candidate.state
        : fallbackPage.state,
    width:
      typeof candidate.width === "string"
        ? candidate.width
        : fallbackPage.width,
    minWidth:
      typeof candidate.minWidth === "string"
        ? candidate.minWidth
        : fallbackPage.minWidth,
    maxWidth:
      typeof candidate.maxWidth === "string"
        ? candidate.maxWidth
        : fallbackPage.maxWidth,
    gridLayoutColumns:
      typeof candidate.gridLayoutColumns === "string"
        ? candidate.gridLayoutColumns
        : fallbackPage.gridLayoutColumns,
    canvasBackgroundColor:
      typeof candidate.canvasBackgroundColor === "string"
        ? candidate.canvasBackgroundColor
        : fallbackPage.canvasBackgroundColor,
    pageBackgroundColor:
      typeof candidate.pageBackgroundColor === "string"
        ? candidate.pageBackgroundColor
        : fallbackPage.pageBackgroundColor,
    pageHeaderBackgroundColor:
      typeof candidate.pageHeaderBackgroundColor === "string"
        ? candidate.pageHeaderBackgroundColor
        : fallbackPage.pageHeaderBackgroundColor,
    pageBorderColor:
      typeof candidate.pageBorderColor === "string"
        ? candidate.pageBorderColor
        : fallbackPage.pageBorderColor,
    questionBackgroundColor:
      typeof candidate.questionBackgroundColor === "string"
        ? candidate.questionBackgroundColor
        : fallbackPage.questionBackgroundColor,
    questionBorderColor:
      typeof candidate.questionBorderColor === "string"
        ? candidate.questionBorderColor
        : fallbackPage.questionBorderColor,
    headingColor:
      typeof candidate.headingColor === "string"
        ? candidate.headingColor
        : fallbackPage.headingColor,
    bodyTextColor:
      typeof candidate.bodyTextColor === "string"
        ? candidate.bodyTextColor
        : fallbackPage.bodyTextColor,
    surfaceRadius:
      candidate.surfaceRadius === "xl" ||
      candidate.surfaceRadius === "2xl" ||
      candidate.surfaceRadius === "3xl"
        ? candidate.surfaceRadius
        : fallbackPage.surfaceRadius,
    surfaceShadow:
      candidate.surfaceShadow === "none" ||
      candidate.surfaceShadow === "soft" ||
      candidate.surfaceShadow === "medium" ||
      candidate.surfaceShadow === "strong"
        ? candidate.surfaceShadow
        : fallbackPage.surfaceShadow,
    contentPadding:
      typeof candidate.contentPadding === "string"
        ? candidate.contentPadding
        : fallbackPage.contentPadding,
    elements: Array.isArray(candidate.elements)
      ? (candidate.elements as FormElementInstance[])
      : fallbackPage.elements,
  };
}

export function flattenPageElements(
  pages: FormPageDocument[],
): FormElementInstance[] {
  return pages.flatMap((page) => page.elements);
}

export function sanitizeCssValue(value: string, fallback: string): string {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return fallback;
  }

  return /^[#(),.%/\-\sa-zA-Z0-9]+$/.test(trimmedValue)
    ? trimmedValue
    : fallback;
}

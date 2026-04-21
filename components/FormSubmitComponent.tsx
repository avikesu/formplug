"use client";

import { useFormElements } from "./context/FormElementsContext";
import {
  FormElementSidebarGroup,
  FormElementsRegistry,
  getFormElement,
} from "./FormElements";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { Button } from "./ui/button";
import { HiCursorClick } from "react-icons/hi";
import { toast } from "sonner";
import { ImSpinner2 } from "react-icons/im";
import { FormSubmissionValues } from "@/lib/forms";
import { FormElementsProvider } from "./context/FormElementsContext";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, Send, Sparkles } from "lucide-react";
import {
  defaultFormBuilderSettings,
  FormBuilderSettings,
} from "@/lib/form-builder-settings";
import {
  FormPageDocument,
  pageSurfaceRadiusClassMap,
  pageSurfaceShadowClassMap,
  sanitizeCssValue,
} from "@/lib/form-pages";
import {
  getElementContainerClassName,
  getElementInnerSpacingClassName,
  getElementLayout,
  sortElementsByLayout,
} from "@/lib/form-element-layout";

type FormSubmitContentProps = {
  formUrl: string;
  pages: FormPageDocument[];
  formName?: string | null;
  formDescription?: string;
  settings?: FormBuilderSettings;
  initialPageId?: string;
  previewMode?: boolean;
  onSubmit: (formUrl: string, values: FormSubmissionValues) => Promise<unknown>;
};

function FormSubmitContent({
  formUrl,
  pages,
  formName,
  formDescription,
  settings = defaultFormBuilderSettings,
  initialPageId,
  previewMode = false,
  onSubmit,
}: FormSubmitContentProps) {
  const { registry } = useFormElements();

  const [formValues, setFormValues] = useState<FormSubmissionValues>({});
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();
  const visiblePages = pages.filter((page) => page.visible);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const currentPage = visiblePages[currentPageIndex] ?? visiblePages[0] ?? null;
  const pageClassName = useMemo(
    () =>
      `page-layout-${(currentPage?.id ?? "default").replace(
        /[^a-zA-Z0-9_-]/g,
        "-",
      )}`,
    [currentPage?.id],
  );
  const widthClass =
    settings.width === "narrow"
      ? "max-w-2xl"
      : settings.width === "wide"
        ? "max-w-5xl"
        : "max-w-4xl";
  const contentWidthClass =
    settings.width === "narrow"
      ? "max-w-xl"
      : settings.width === "wide"
        ? "max-w-3xl"
        : "max-w-2xl";
  const alignmentClass =
    settings.alignment === "left" ? "ml-0 mr-auto" : "mx-auto";
  const surfaceClass =
    settings.surfaceStyle === "soft"
      ? "border-sky-100 bg-sky-50/70 shadow-none"
      : settings.surfaceStyle === "outline"
        ? "border-slate-300 bg-white shadow-none"
        : "border-sky-100 bg-white shadow-[0_30px_120px_-40px_rgba(14,165,233,0.45)]";
  const pageWidthCss = useMemo(() => {
    if (!currentPage) {
      return ".page-layout-default { width: auto; }";
    }

    return `
      .${pageClassName} {
        width: ${sanitizeCssValue(currentPage.width, "auto")};
        min-width: ${sanitizeCssValue(currentPage.minWidth, "0")};
        max-width: ${sanitizeCssValue(currentPage.maxWidth, "none")};
      }
    `;
  }, [currentPage, pageClassName]);
  const pageRadiusClass = currentPage
    ? pageSurfaceRadiusClassMap[currentPage.surfaceRadius]
    : pageSurfaceRadiusClassMap["2xl"];
  const pageShadowClass = currentPage
    ? pageSurfaceShadowClassMap[currentPage.surfaceShadow]
    : pageSurfaceShadowClassMap.soft;
  const pageAppearanceCss = useMemo(() => {
    if (!currentPage) {
      return "";
    }

    const cssRules: string[] = [];

    if (currentPage.canvasBackgroundColor.trim()) {
      cssRules.push(`
        .${pageClassName}-canvas {
          background-color: ${sanitizeCssValue(currentPage.canvasBackgroundColor, "#f8fafc")};
        }
      `);
    }

    if (
      currentPage.pageBackgroundColor.trim() ||
      currentPage.bodyTextColor.trim() ||
      currentPage.contentPadding.trim()
    ) {
      cssRules.push(`
        .${pageClassName}.form-page-surface {
          ${currentPage.bodyTextColor.trim() ? `color: ${sanitizeCssValue(currentPage.bodyTextColor, "#475569")};` : ""}
        }
      `);
    }

    if (
      currentPage.pageBackgroundColor.trim() ||
      currentPage.contentPadding.trim()
    ) {
      cssRules.push(`
        .${pageClassName}-content {
          ${currentPage.pageBackgroundColor.trim() ? `background-color: ${sanitizeCssValue(currentPage.pageBackgroundColor, "#ffffff")};` : ""}
          ${currentPage.contentPadding.trim() ? `padding: ${sanitizeCssValue(currentPage.contentPadding, "1.5rem")};` : ""}
        }
      `);
    }

    if (
      currentPage.pageHeaderBackgroundColor.trim() ||
      currentPage.pageBorderColor.trim()
    ) {
      cssRules.push(`
        .${pageClassName}-header {
          ${currentPage.pageHeaderBackgroundColor.trim() ? `background-color: ${sanitizeCssValue(currentPage.pageHeaderBackgroundColor, "#ffffff")};` : ""}
          ${currentPage.pageBorderColor.trim() ? `border-color: ${sanitizeCssValue(currentPage.pageBorderColor, "#e2e8f0")};` : ""}
        }
      `);
    }

    if (currentPage.bodyTextColor.trim()) {
      cssRules.push(`
        .${pageClassName}-eyebrow,
        .${pageClassName}-body,
        .${pageClassName}-badge {
          color: ${sanitizeCssValue(currentPage.bodyTextColor, "#475569")};
        }
      `);
    }

    if (currentPage.headingColor.trim()) {
      cssRules.push(`
        .${pageClassName}-heading {
          color: ${sanitizeCssValue(currentPage.headingColor, "#0f172a")};
        }
      `);
    }

    if (currentPage.pageBorderColor.trim()) {
      cssRules.push(`
        .${pageClassName}-badge {
          border-color: ${sanitizeCssValue(currentPage.pageBorderColor, "#e2e8f0")};
        }
      `);
    }

    if (
      currentPage.questionBackgroundColor.trim() ||
      currentPage.questionBorderColor.trim() ||
      currentPage.bodyTextColor.trim()
    ) {
      cssRules.push(`
        .${pageClassName}-question {
          ${currentPage.questionBackgroundColor.trim() ? `background-color: ${sanitizeCssValue(currentPage.questionBackgroundColor, "#ffffff")};` : ""}
          ${currentPage.questionBorderColor.trim() ? `border-color: ${sanitizeCssValue(currentPage.questionBorderColor, "#e2e8f0")};` : ""}
          ${currentPage.bodyTextColor.trim() ? `color: ${sanitizeCssValue(currentPage.bodyTextColor, "#475569")};` : ""}
        }
      `);
    }

    cssRules.push(`
      .${pageClassName}-question.form-page-question-error {
        background-color: rgba(254, 226, 226, 0.55);
        border-color: rgb(252, 165, 165);
      }
    `);

    return cssRules.join("\n");
  }, [currentPage, pageClassName]);

  useEffect(() => {
    setCurrentPageIndex((currentIndex) => {
      if (visiblePages.length === 0) {
        return 0;
      }

      return Math.min(currentIndex, visiblePages.length - 1);
    });
  }, [visiblePages.length]);

  useEffect(() => {
    if (!initialPageId || visiblePages.length === 0) {
      return;
    }

    const nextPageIndex = visiblePages.findIndex(
      (page) => page.id === initialPageId,
    );

    if (nextPageIndex >= 0) {
      setCurrentPageIndex(nextPageIndex);
    }
  }, [initialPageId, visiblePages]);

  const validateForm: () => boolean = useCallback(() => {
    const nextErrors: Record<string, boolean> = {};

    for (const page of visiblePages) {
      for (const element of page.elements) {
        const actualValue = formValues[element.id] || "";
        const valid = getFormElement(registry, element.type).validate(
          element,
          actualValue,
        );

        if (!valid) {
          nextErrors[element.id] = true;
        }
      }
    }

    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return false;
    }

    return true;
  }, [formValues, registry, visiblePages]);

  const submitValue = useCallback((key: string, value: string) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }));
    setFormErrors((currentErrors) => {
      if (!currentErrors[key]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[key];
      return nextErrors;
    });
  }, []);

  const submitForm = async () => {
    const validFrom = validateForm();
    if (!validFrom) {
      toast.error(
        previewMode
          ? "Preview validation failed. Fix the highlighted fields to continue."
          : "Please fix the errors in the form before submitting.",
      );
      return;
    }

    if (previewMode) {
      toast.success("Preview validation passed.", {
        description:
          "This preview lets you test validation and field behavior, but it never stores a real submission.",
      });
      return;
    }

    try {
      await onSubmit(formUrl, formValues);
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong while submitting the form.");
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.16),transparent_30%),linear-gradient(180deg,rgba(248,250,252,0.98),rgba(241,245,249,0.92))] p-6 md:p-10">
        <div
          className={cn(
            "w-full overflow-hidden rounded-4xl border",
            widthClass,
            surfaceClass,
          )}
        >
          <div className="border-b border-sky-100 bg-linear-to-r from-sky-50 via-cyan-50 to-white px-8 py-8">
            <div className="flex items-center gap-3 text-sky-700">
              <CheckCircle2 className="size-6" />
              <span className="text-sm font-semibold uppercase tracking-[0.24em]">
                Submission complete
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
              Thank you. Your response has been recorded.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Your form has been submitted successfully.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.16),transparent_30%),linear-gradient(180deg,rgba(248,250,252,0.98),rgba(241,245,249,0.92))] p-6 md:p-10">
      <style>{pageWidthCss}</style>
      <style>{pageAppearanceCss}</style>
      <div
        className={cn(
          "w-full overflow-hidden rounded-4xl border",
          widthClass,
          alignmentClass,
          surfaceClass,
        )}
      >
        {settings.showHeader && (
          <div className="border-b border-sky-100 bg-linear-to-r from-sky-50 via-cyan-50 to-white px-6 py-8 md:px-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Badge
                variant="secondary"
                className="rounded-full border border-sky-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700"
              >
                <Sparkles className="mr-1 size-3.5" />
                {previewMode ? "Preview" : "Live form"}
              </Badge>
              <span className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Formplug
              </span>
            </div>
            <div className="mt-6 space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                {formName?.trim() || "Untitled form"}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                {formDescription?.trim() ||
                  "Complete the form below and submit your response when you are ready."}
              </p>
            </div>
            {previewMode && (
              <p className="mt-4 text-sm text-sky-700">
                This preview uses the same renderer as the public submit page.
              </p>
            )}
          </div>
        )}

        <div
          className={cn(
            "bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(248,250,252,0.96))] px-6 py-8 md:px-10 md:py-10",
            `${pageClassName}-canvas`,
          )}
        >
          <div
            className={cn(
              "form-page-surface flex w-full flex-col gap-6",
              pageClassName,
              contentWidthClass,
              alignmentClass,
              pageRadiusClass,
              pageShadowClass,
            )}
          >
            {currentPage && (currentPage.title || currentPage.description) && (
              <div
                className={cn(
                  "border border-slate-200/80 bg-white/85 p-5",
                  `${pageClassName}-header`,
                  pageRadiusClass,
                  pageShadowClass,
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p
                      className={cn(
                        "text-xs font-medium uppercase tracking-[0.24em]",
                        `${pageClassName}-eyebrow`,
                      )}
                    >
                      {currentPage.name}
                    </p>
                    {currentPage.title && (
                      <h2
                        className={cn(
                          "mt-2 text-2xl font-semibold text-slate-900",
                          `${pageClassName}-heading`,
                        )}
                      >
                        {currentPage.title}
                      </h2>
                    )}
                    {currentPage.description && (
                      <p
                        className={cn(
                          "mt-2 text-sm leading-6 text-slate-600",
                          `${pageClassName}-body`,
                        )}
                      >
                        {currentPage.description}
                      </p>
                    )}
                  </div>
                  <span
                    className={cn(
                      "rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500",
                      `${pageClassName}-badge`,
                    )}
                  >
                    Page {currentPageIndex + 1} of{" "}
                    {Math.max(visiblePages.length, 1)}
                  </span>
                </div>
              </div>
            )}
            <div
              className={cn(
                "flex flex-col gap-6 p-4",
                `${pageClassName}-content`,
              )}
            >
              {!currentPage || currentPage.elements.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-sky-200 bg-sky-50/60 px-6 py-14 text-center text-sm text-slate-500">
                  This page has no fields yet.
                </div>
              ) : (
                <div
                  className={cn(
                    "grid grid-cols-12 gap-6",
                    currentPage.readOnly && "pointer-events-none opacity-80",
                  )}
                >
                  {sortElementsByLayout(currentPage.elements).map((element) => {
                    const FormElement = getFormElement(
                      registry,
                      element.type,
                    ).formComponent;
                    const layout = getElementLayout(element.properties);

                    return (
                      <div
                        key={element.id}
                        className={cn(
                          "border border-slate-200/80 bg-white/90 p-5 transition-colors",
                          `${pageClassName}-question`,
                          formErrors[element.id] && "form-page-question-error",
                          getElementContainerClassName(layout),
                          pageRadiusClass,
                          pageShadowClass,
                        )}
                      >
                        <div
                          className={getElementInnerSpacingClassName(layout)}
                        >
                          <FormElement
                            elementInstance={element}
                            submitValue={submitValue}
                            isInvalid={formErrors[element.id]}
                            defaultValue={formValues[element.id]}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPageIndex((currentIndex) =>
                      Math.max(currentIndex - 1, 0),
                    )
                  }
                  disabled={currentPageIndex === 0 || pending}
                >
                  Previous page
                </Button>

                {currentPageIndex < visiblePages.length - 1 ? (
                  <Button
                    className="h-12 rounded-xl bg-slate-950 text-base font-medium text-white shadow-[0_20px_50px_-25px_rgba(15,23,42,0.8)] hover:bg-slate-800"
                    onClick={() =>
                      setCurrentPageIndex((currentIndex) =>
                        Math.min(currentIndex + 1, visiblePages.length - 1),
                      )
                    }
                    disabled={pending}
                  >
                    Next page
                  </Button>
                ) : (
                  <Button
                    className="h-12 rounded-xl bg-slate-950 text-base font-medium text-white shadow-[0_20px_50px_-25px_rgba(15,23,42,0.8)] hover:bg-slate-800"
                    onClick={() => {
                      startTransition(() => {
                        submitForm();
                      });
                    }}
                    disabled={pending || currentPage?.readOnly}
                  >
                    {!pending && (
                      <>
                        {previewMode ? (
                          <Send className="mr-2 size-4" />
                        ) : (
                          <HiCursorClick className="mr-2" />
                        )}
                        {previewMode ? "Validate preview" : "Submit form"}
                      </>
                    )}
                    {pending && <ImSpinner2 className="animate-spin" />}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        <style jsx>{pageWidthCss}</style>
      </div>
    </div>
  );
}

function FormSubmitComponent({
  formUrl,
  pages,
  formName,
  formDescription,
  settings,
  initialPageId,
  previewMode,
  onSubmit,
  registry,
  sidebarGroups,
}: {
  formUrl: string;
  pages: FormPageDocument[];
  formName?: string | null;
  formDescription?: string;
  settings?: FormBuilderSettings;
  initialPageId?: string;
  previewMode?: boolean;
  onSubmit: (formUrl: string, values: FormSubmissionValues) => Promise<unknown>;
  registry?: FormElementsRegistry;
  sidebarGroups?: FormElementSidebarGroup[];
}) {
  return (
    <FormElementsProvider registry={registry} sidebarGroups={sidebarGroups}>
      <FormSubmitContent
        formUrl={formUrl}
        pages={pages}
        formName={formName}
        formDescription={formDescription}
        settings={settings}
        initialPageId={initialPageId}
        previewMode={previewMode}
        onSubmit={onSubmit}
      />
    </FormElementsProvider>
  );
}

export default FormSubmitComponent;

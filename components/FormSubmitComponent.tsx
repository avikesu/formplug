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
import { FormPageDocument, sanitizeCssValue } from "@/lib/form-pages";
import {
  getElementContainerClassName,
  getElementInnerSpacingClassName,
  getElementLayout,
  sortElementsByLayout,
} from "@/lib/form-element-layout";
import { flattenElementTree } from "./element-tree";

const layoutOnlyElementTypes = new Set([
  "TitleField",
  "SubTitleField",
  "ParagraphField",
  "SeparatorField",
  "SpacerField",
  "ImageField",
]);

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
  const hasMultiplePages = visiblePages.length > 1;
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
      ? "border-border bg-card/80 shadow-none backdrop-blur-sm"
      : settings.surfaceStyle === "outline"
        ? "border-border bg-card shadow-none"
        : "border-border bg-card shadow-sm";
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
  const pageAppearanceCss = useMemo(() => {
    if (!currentPage) {
      return "";
    }

    const cssRules: string[] = [];

    if (currentPage.canvasBackgroundColor.trim()) {
      cssRules.push(`
        .${pageClassName}-canvas {
          background-color: ${sanitizeCssValue(currentPage.canvasBackgroundColor, "var(--muted)")};
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
          ${currentPage.bodyTextColor.trim() ? `color: ${sanitizeCssValue(currentPage.bodyTextColor, "var(--foreground)")};` : ""}
        }
      `);
    }

    if (
      currentPage.pageBackgroundColor.trim() ||
      currentPage.contentPadding.trim()
    ) {
      cssRules.push(`
        .${pageClassName}-content {
          ${currentPage.pageBackgroundColor.trim() ? `background-color: ${sanitizeCssValue(currentPage.pageBackgroundColor, "var(--card)")};` : ""}
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
          ${currentPage.pageHeaderBackgroundColor.trim() ? `background-color: ${sanitizeCssValue(currentPage.pageHeaderBackgroundColor, "var(--card)")};` : ""}
          ${currentPage.pageBorderColor.trim() ? `border-color: ${sanitizeCssValue(currentPage.pageBorderColor, "var(--border)")};` : ""}
        }
      `);
    }

    if (currentPage.bodyTextColor.trim()) {
      cssRules.push(`
        .${pageClassName}-eyebrow,
        .${pageClassName}-body,
        .${pageClassName}-badge {
          color: ${sanitizeCssValue(currentPage.bodyTextColor, "var(--muted-foreground)")};
        }
      `);
    }

    if (currentPage.headingColor.trim()) {
      cssRules.push(`
        .${pageClassName}-heading {
          color: ${sanitizeCssValue(currentPage.headingColor, "var(--foreground)")};
        }
      `);
    }

    if (currentPage.pageBorderColor.trim()) {
      cssRules.push(`
        .${pageClassName}-badge {
          border-color: ${sanitizeCssValue(currentPage.pageBorderColor, "var(--border)")};
        }
      `);
    }

    // Remove questionBackgroundColor and questionBorderColor support

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

    for (const element of flattenElementTree(
      visiblePages.flatMap((page) => page.elements),
    )) {
      const actualValue = formValues[element.id] || "";
      const valid = getFormElement(registry, element.type).validate(
        element,
        actualValue,
      );

      if (!valid) {
        nextErrors[element.id] = true;
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
      <div className="flex min-h-full w-full justify-center bg-muted/40 p-6 text-foreground md:p-10">
        <div
          className={cn(
            "w-full overflow-hidden rounded-xl border",
            widthClass,
            surfaceClass,
          )}
        >
          <div className="border-b border-border bg-card px-8 py-8">
            <div className="flex items-center gap-3 text-emerald-600">
              <CheckCircle2 className="size-6" />
              <span className="text-sm font-semibold uppercase tracking-wide">
                Submission complete
              </span>
            </div>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
              Thank you. Your response has been recorded.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Your form has been submitted successfully.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full w-full justify-center bg-muted/40 p-6 text-foreground md:p-10">
      <style>{pageWidthCss}</style>
      <style>{pageAppearanceCss}</style>
      <div
        className={cn(
          "w-full overflow-hidden rounded-xl border",
          widthClass,
          alignmentClass,
          surfaceClass,
        )}
      >
        {settings.showHeader && (
          <div className="border-b border-border px-6 py-6 md:px-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Badge
                variant="secondary"
                className="rounded-full border border-border bg-muted px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
              >
                <Sparkles className="mr-1 size-3.5" />
                {previewMode ? "Preview" : "Live form"}
              </Badge>
              <span className="text-xs tracking-wide text-muted-foreground/80">
                Formplug
              </span>
            </div>
            <div className="mt-5 space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                {formName?.trim() || "Untitled form"}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                {formDescription?.trim() ||
                  "Complete the form below and submit your response when you are ready."}
              </p>
            </div>
            {previewMode && (
              <p className="mt-3 text-xs text-muted-foreground/80">
                This preview uses the same renderer as the public submit page.
              </p>
            )}
          </div>
        )}

        <div
          className={cn(
            "px-6 py-6 md:px-10 md:py-8",
            `${pageClassName}-canvas`,
          )}
        >
          <div
            className={cn(
              "form-page-surface flex w-full flex-col gap-5",
              pageClassName,
              contentWidthClass,
              alignmentClass,
            )}
          >
            {settings.showPageHeader && currentPage && (
              <div className={cn("pb-4", `${pageClassName}-header`)}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    {currentPage.showName && (
                      <p
                        className={cn(
                          "text-xs font-medium uppercase tracking-wide text-muted-foreground/80",
                          `${pageClassName}-eyebrow`,
                        )}
                      >
                        {currentPage.name}
                      </p>
                    )}
                    {currentPage.showTitle && currentPage.title && (
                      <h2
                        className={cn(
                          "mt-1 text-lg font-semibold text-foreground",
                          `${pageClassName}-heading`,
                        )}
                      >
                        {currentPage.title}
                      </h2>
                    )}
                    {currentPage.showDescription && currentPage.description && (
                      <p
                        className={cn(
                          "mt-1 text-sm leading-6 text-muted-foreground",
                          `${pageClassName}-body`,
                        )}
                      >
                        {currentPage.description}
                      </p>
                    )}
                  </div>
                  {hasMultiplePages && (
                    <span
                      className={cn(
                        "shrink-0 text-xs font-medium text-muted-foreground/80",
                        `${pageClassName}-badge`,
                      )}
                    >
                      {currentPageIndex + 1} / {visiblePages.length}
                    </span>
                  )}
                </div>
              </div>
            )}
            <div
              className={cn("flex flex-col gap-4", `${pageClassName}-content`)}
            >
              {!currentPage || currentPage.elements.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border px-6 py-14 text-center text-sm text-muted-foreground">
                  This page has no fields yet.
                </div>
              ) : (
                <div
                  className={cn(
                    "grid grid-cols-12 gap-x-4 gap-y-5",
                    currentPage.readOnly && "pointer-events-none opacity-80",
                  )}
                >
                  {sortElementsByLayout(currentPage.elements).map((element) => {
                    const FormElement = getFormElement(
                      registry,
                      element.type,
                    ).formComponent;
                    const layout = getElementLayout(element.properties);
                    const isLayoutOnlyElement = layoutOnlyElementTypes.has(
                      element.type,
                    );

                    return (
                      <div
                        key={element.id}
                        className={cn(
                          `${pageClassName}-question`,
                          getElementContainerClassName(layout),
                          getElementInnerSpacingClassName(layout),
                          "p-0 text-foreground transition-colors",
                        )}
                      >
                        <FormElement
                          elementInstance={element}
                          submitValue={submitValue}
                          isInvalid={formErrors[element.id]}
                          defaultValue={formValues[element.id]}
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              <div
                className={cn(
                  "mt-2 flex flex-wrap items-center gap-3 border-t border-border/70 pt-5",
                  hasMultiplePages ? "justify-between" : "justify-end",
                )}
              >
                {hasMultiplePages && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPageIndex((currentIndex) =>
                        Math.max(currentIndex - 1, 0),
                      )
                    }
                    disabled={currentPageIndex === 0 || pending}
                  >
                    Previous page
                  </Button>
                )}

                {hasMultiplePages &&
                currentPageIndex < visiblePages.length - 1 ? (
                  <Button
                    className="rounded-lg bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90"
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
                    className="rounded-lg bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90"
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
                        {previewMode ? "Validate preview" : "Submit"}
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

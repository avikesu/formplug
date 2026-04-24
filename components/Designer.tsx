"use client";

import { cn } from "@/lib/utils";
import DesignerSidebar from "./DesignerSidebar";
import FormElementSidebar from "./FormElementSidebar";
import {
  DragEndEvent,
  useDndMonitor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import useDesigner from "./hooks/useDesigner";
import {
  ElementsType,
  FormElementInstance,
  getFormElement,
} from "./FormElements";
import { idGenerator } from "@/lib/idGenerator";
import { useState } from "react";
import { Button } from "./ui/button";
import { BiSolidTrash } from "react-icons/bi";
import { useFormElements } from "./context/FormElementsContext";
import { BsPlusLg } from "react-icons/bs";
import { TbForms } from "react-icons/tb";
import {
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

function Designer({ formName }: { formName: string | null }) {
  const { registry } = useFormElements();
  const {
    pages,
    activePage,
    activePageId,
    setActivePageId,
    addPage,
    removePage: removePageFromContext,
    elements,
    addElement,
    removeElement,
    selectedElement,
    setSelectedElement,
  } = useDesigner();
  const { isOver, setNodeRef: setDropAreaNodeRef } = useDroppable({
    id: "designer-drop-area",
    data: { isDesignerDropArea: true },
  });
  const pageRadiusClass = activePage
    ? pageSurfaceRadiusClassMap[activePage.surfaceRadius]
    : pageSurfaceRadiusClassMap["2xl"];
  const pageShadowClass = activePage
    ? pageSurfaceShadowClassMap[activePage.surfaceShadow]
    : pageSurfaceShadowClassMap.soft;
  const pageClassName = activePage
    ? `designer-page-${activePage.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`
    : "designer-page-default";
  const pageAppearanceCss = activePage
    ? [
        activePage.canvasBackgroundColor.trim() ||
        activePage.pageBorderColor.trim()
          ? `
              .${pageClassName}-canvas {
                ${activePage.canvasBackgroundColor.trim() ? `background-color: ${sanitizeCssValue(activePage.canvasBackgroundColor, "#f8fafc")};` : ""}
                ${activePage.pageBorderColor.trim() ? `border-color: ${sanitizeCssValue(activePage.pageBorderColor, "#e2e8f0")};` : ""}
              }
            `
          : "",
        activePage.pageHeaderBackgroundColor.trim() ||
        activePage.pageBorderColor.trim()
          ? `
              .${pageClassName}-header {
                ${activePage.pageHeaderBackgroundColor.trim() ? `background-color: ${sanitizeCssValue(activePage.pageHeaderBackgroundColor, "#ffffff")};` : ""}
                ${activePage.pageBorderColor.trim() ? `border-color: ${sanitizeCssValue(activePage.pageBorderColor, "#e2e8f0")};` : ""}
              }
            `
          : "",
        activePage.bodyTextColor.trim()
          ? `
              .${pageClassName}-eyebrow,
              .${pageClassName}-description,
              .${pageClassName}-question {
                color: ${sanitizeCssValue(activePage.bodyTextColor, "#475569")};
              }
            `
          : "",
        activePage.headingColor.trim()
          ? `
              .${pageClassName}-heading {
                color: ${sanitizeCssValue(activePage.headingColor, "#0f172a")};
              }
            `
          : "",
        activePage.pageBackgroundColor.trim() ||
        activePage.contentPadding.trim()
          ? `
              .${pageClassName}-content {
                ${activePage.pageBackgroundColor.trim() ? `background-color: ${sanitizeCssValue(activePage.pageBackgroundColor, "#ffffff")};` : ""}
                ${activePage.contentPadding.trim() ? `padding: ${sanitizeCssValue(activePage.contentPadding, "1.5rem")};` : ""}
              }
            `
          : "",
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  useDndMonitor({
    onDragEnd: (event: DragEndEvent) => {
      const { over, active } = event;
      if (!over || !active) return;

      const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement;
      const isDroppingOverDesignerDropArea =
        over.data?.current?.isDesignerDropArea;

      const droppingSiderbarBtnOverDesignerDropArea =
        isDesignerBtnElement && isDroppingOverDesignerDropArea;
      if (droppingSiderbarBtnOverDesignerDropArea) {
        const type = active.data?.current?.type;
        const newElement = getFormElement(
          registry,
          type as ElementsType,
        ).construct(idGenerator());
        addElement(elements.length, newElement);
        return;
      }

      const isDroppingOverDesignerElementTopHalf =
        over.data?.current?.isTopHalfDesignerElement;
      const isDroppingOverDesignerElementBottomHalf =
        over.data?.current?.isBottomHalfDesignerElement;
      const isDroppingOverDesignerElement =
        isDroppingOverDesignerElementTopHalf ||
        isDroppingOverDesignerElementBottomHalf;
      const droppingSidebarBtnOverDesignerElement =
        isDesignerBtnElement && isDroppingOverDesignerElement;

      if (droppingSidebarBtnOverDesignerElement) {
        const type = active.data?.current?.type;
        const newElement = getFormElement(
          registry,
          type as ElementsType,
        ).construct(idGenerator());

        const overElementIndex = elements.findIndex(
          (el) => el.id === over.data?.current?.elementId,
        );
        if (overElementIndex === -1) {
          throw new Error("Element not found.");
        }

        let indexForNewelement = overElementIndex;
        if (isDroppingOverDesignerElementBottomHalf) {
          indexForNewelement = overElementIndex + 1;
        }
        addElement(indexForNewelement, newElement);
        return;
      }

      const isDraggingDesignerElement = active.data?.current?.isDesignerElement;
      const draggingDesignerElementOverAnotherDesignerElement =
        isDraggingDesignerElement && isDroppingOverDesignerElement;
      if (draggingDesignerElementOverAnotherDesignerElement) {
        const activeElementId = active.data?.current?.elementId;
        const overElementId = over.data?.current?.elementId;
        const activeElementIndex = elements.findIndex(
          (el) => el.id === activeElementId,
        );
        const overElementIndex = elements.findIndex(
          (el) => el.id === overElementId,
        );

        if (activeElementIndex === -1 || overElementIndex === -1) {
          throw new Error("Element not found.");
        }

        const activeElement = { ...elements[activeElementIndex] };
        removeElement?.(activeElementId);

        let indexForNewelement = overElementIndex;
        if (isDroppingOverDesignerElementBottomHalf) {
          indexForNewelement = overElementIndex + 1;
        }
        addElement(indexForNewelement, activeElement);
      }
    },
  });

  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden">
      <style>{pageAppearanceCss}</style>
      <aside className="hidden h-full min-h-0 w-[320px] shrink-0 border-r-2 border-muted bg-background xl:flex xl:flex-col xl:overflow-hidden">
        <div className="h-full overflow-y-auto p-4">
          <FormElementSidebar />
        </div>
      </aside>
      <div
        className="flex min-h-0 flex-1 flex-col overflow-hidden p-4"
        onClick={() => {
          if (selectedElement) setSelectedElement(null);
        }}
      >
        <div className="mx-auto mb-4 flex w-full max-w-[920px] shrink-0 items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/95 px-4 py-3 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            {pages.map((page, index) => (
              <Button
                key={page.id}
                variant={page.id === activePageId ? "default" : "outline"}
                className="gap-2"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedElement(null);
                  setActivePageId(page.id);
                }}
              >
                <TbForms />
                {page.showName
                  ? page.title || `Page ${index + 1}`
                  : `Page ${index + 1}`}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={(event) => {
                event.stopPropagation();
                addPage();
              }}
            >
              <BsPlusLg />
              Add page
            </Button>
          </div>
          {activePage && pages.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground"
              onClick={(event) => {
                event.stopPropagation();
                removePageFromContext(activePage.id);
              }}
            >
              <BiSolidTrash className="h-4 w-4" />
              Remove page
            </Button>
          )}
        </div>
        <div
          ref={setDropAreaNodeRef}
          className={cn(
            "bg-background m-auto flex h-full min-h-0 w-full max-w-[920px] flex-1 flex-col items-center justify-start overflow-y-auto rounded-xl border border-border/60",
            `${pageClassName}-canvas`,
            pageRadiusClass,
            pageShadowClass,
            isOver && "ring-4 ring-primary ring-inset",
          )}
        >
          {activePage && (
            <div
              className={cn(
                "w-full border-b border-border/60 px-6 py-5",
                `${pageClassName}-header`,
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {activePage.showName && (
                      <p
                        className={cn(
                          "text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground",
                          `${pageClassName}-eyebrow`,
                        )}
                      >
                        Form: {formName?.trim() || "Untitled form"}
                      </p>
                    )}
                    <span className="rounded-full border border-border/70 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      {activePage.visible ? "Visible" : "Hidden"}
                    </span>
                  </div>
                  {activePage.showTitle && (
                    <h3
                      className={cn(
                        "mt-2 text-2xl font-semibold text-foreground",
                        `${pageClassName}-heading`,
                      )}
                    >
                      {activePage.title || "Untitled page"}
                    </h3>
                  )}
                  {activePage.showDescription && activePage.description && (
                    <p
                      className={cn(
                        "mt-2 max-w-2xl text-sm text-muted-foreground",
                        `${pageClassName}-description`,
                      )}
                    >
                      {activePage.description}
                    </p>
                  )}
                </div>
                {!activePage.visible && (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                    Hidden page
                  </span>
                )}
              </div>
            </div>
          )}
          {!isOver && elements.length === 0 && (
            <p className="text-3xl text-muted-foreground flex grow items-center font-bold">
              Drop here
            </p>
          )}
          {isOver && elements.length === 0 && (
            <div className="p-4 w-full">
              <div className="h-[120px] rounded-md bg-primary/20"></div>
            </div>
          )}
          {elements.length > 0 && (
            <div
              className={cn(
                "grid w-full grid-cols-12 gap-3 p-4",
                `${pageClassName}-content`,
              )}
            >
              {sortElementsByLayout(elements).map((el) => (
                <DesignerElementWrapper key={el.id} element={el} />
              ))}
            </div>
          )}
        </div>
      </div>
      <DesignerSidebar />
    </div>
  );
}

function DesignerElementWrapper({ element }: { element: FormElementInstance }) {
  const { registry } = useFormElements();
  const { activePage, removeElement, setSelectedElement } = useDesigner();
  const [mouseIsOver, setMouseIsOver] = useState<boolean>(false);
  const { isOver: isTopHalfOver, setNodeRef: setTopHalfNodeRef } = useDroppable(
    {
      id: `top-${element.id}`,
      data: {
        type: element.type,
        elementId: element.id,
        isTopHalfDesignerElement: true,
      },
    },
  );

  const { isOver: isBottomHalfOver, setNodeRef: setBottomHalfNodeRef } =
    useDroppable({
      id: `bottom-${element.id}`,
      data: {
        type: element.type,
        elementId: element.id,
        isBottomHalfDesignerElement: true,
      },
    });

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef,
    isDragging,
  } = useDraggable({
    id: `${element.id}-drag-handler`,
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true,
    },
  });

  if (isDragging) return null;

  const DesignerElement = getFormElement(
    registry,
    element.type,
  ).designerComponent;
  const layout = getElementLayout(element.properties);

  return (
    <div
      ref={setDraggableNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "relative flex min-h-[120px] flex-col rounded-md border text-foreground hover:cursor-pointer ring-1 ring-accent ring-inset",
        getElementContainerClassName(layout),
        activePage
          ? `designer-page-${activePage.id.replace(/[^a-zA-Z0-9_-]/g, "-")}-question`
          : undefined,
        activePage
          ? pageSurfaceRadiusClassMap[activePage.surfaceRadius]
          : pageSurfaceRadiusClassMap["2xl"],
      )}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement(element);
      }}
    >
      <div
        ref={setTopHalfNodeRef}
        className="absolute w-full h-1/2 rounded-t-md"
      ></div>
      <div
        ref={setBottomHalfNodeRef}
        className="absolute w-full h-1/2 bottom-0 rounded-b-md"
      ></div>
      {mouseIsOver && (
        <>
          <div className="absolute right-0 h-full">
            <Button
              className="flex justify-center h-full border rounded-md rounded-l-none bg-red-500"
              variant={"destructive"}
              onClick={(e) => {
                e.stopPropagation();
                removeElement?.(element.id);
              }}
            >
              <BiSolidTrash className="h-6 w-6" />
            </Button>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
            <p className="text-muted-foreground text-sm">
              Click for properties or drag to move.
            </p>
          </div>
        </>
      )}
      {isTopHalfOver && (
        <div className="absolute top-0 w-full rounded-md h-[7px] bg-primary rounded-b-none" />
      )}
      <div
        className={cn(
          "flex min-h-[120px] w-full items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none opacity-100",
          mouseIsOver && "opacity-30",
        )}
      >
        <div className={cn("w-full", getElementInnerSpacingClassName(layout))}>
          <DesignerElement elementInstance={element} />
        </div>
      </div>
      {isBottomHalfOver && (
        <div className="absolute bottom-0 w-full rounded-md h-[7px] bg-primary rounded-t-none" />
      )}
    </div>
  );
}

export default Designer;

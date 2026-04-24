"use client";

import { FormElementInstance } from "../FormElements";
import {
  defaultFormBuilderSettings,
  FormBuilderSettings,
} from "@/lib/form-builder-settings";
import { createDefaultFormPage, FormPageDocument } from "@/lib/form-pages";
import {
  appendElementToGrid,
  removeElementFromTree,
  updateElementInTree,
} from "../element-tree";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";

type DesignerContextType = {
  pages: FormPageDocument[];
  setPages: Dispatch<SetStateAction<FormPageDocument[]>>;
  activePage: FormPageDocument | null;
  activePageId: string | null;
  setActivePageId: Dispatch<SetStateAction<string | null>>;
  addPage: () => void;
  removePage: (id: string) => void;
  updatePage: (id: string, page: FormPageDocument) => void;
  updateCurrentPage: (page: Partial<FormPageDocument>) => void;
  elements: FormElementInstance[];
  setElements: Dispatch<SetStateAction<FormElementInstance[]>>;
  settings: FormBuilderSettings;
  setSettings: Dispatch<SetStateAction<FormBuilderSettings>>;
  updateSettings: (settings: Partial<FormBuilderSettings>) => void;
  addElement: (index: number, element: FormElementInstance) => void;
  addElementToGrid: (gridId: string, element: FormElementInstance) => void;
  removeElement?: (id: string) => void;

  selectedElement: FormElementInstance | null;
  setSelectedElement: Dispatch<SetStateAction<FormElementInstance | null>>;

  updateElement: (id: string, element: FormElementInstance) => void;
};

export const DesignerContext = createContext<DesignerContextType | null>(null);

export default function DesignerContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [pages, setPages] = useState<FormPageDocument[]>([
    createDefaultFormPage(0),
  ]);
  const [activePageId, setActivePageId] = useState<string | null>("page-1");
  const [settings, setSettings] = useState<FormBuilderSettings>(
    defaultFormBuilderSettings,
  );
  const [selectedElement, setSelectedElement] =
    useState<FormElementInstance | null>(null);

  const activePage =
    pages.find((page) => page.id === activePageId) ?? pages[0] ?? null;
  const elements = activePage?.elements ?? [];

  const setElements: Dispatch<SetStateAction<FormElementInstance[]>> = (
    value,
  ) => {
    setPages((currentPages) => {
      const currentActivePageId =
        activePageId ?? currentPages[0]?.id ?? createDefaultFormPage(0).id;

      return currentPages.map((page) => {
        if (page.id !== currentActivePageId) {
          return page;
        }

        const nextElements =
          typeof value === "function" ? value(page.elements) : value;

        return {
          ...page,
          elements: nextElements,
        };
      });
    });
  };

  const updateSettings = (nextSettings: Partial<FormBuilderSettings>) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      ...nextSettings,
    }));
  };

  const addPage = () => {
    setPages((currentPages) => {
      const newPage = createDefaultFormPage(currentPages.length);
      return [...currentPages, newPage];
    });
    setActivePageId(() => {
      const nextIndex = pages.length;
      return createDefaultFormPage(nextIndex).id;
    });
    setSelectedElement(null);
  };

  const removePage = (id: string) => {
    setPages((currentPages) => {
      if (currentPages.length <= 1) {
        return currentPages;
      }

      const nextPages = currentPages.filter((page) => page.id !== id);

      if (!nextPages.some((page) => page.id === activePageId)) {
        setActivePageId(nextPages[0]?.id ?? null);
      }

      return nextPages;
    });
    setSelectedElement(null);
  };

  const updatePage = (id: string, nextPage: FormPageDocument) => {
    setPages((currentPages) =>
      currentPages.map((page) => (page.id === id ? nextPage : page)),
    );
  };

  const updateCurrentPage = (nextPage: Partial<FormPageDocument>) => {
    if (!activePage) {
      return;
    }

    updatePage(activePage.id, {
      ...activePage,
      ...nextPage,
    });
  };

  const addelement = (index: number, element: FormElementInstance) => {
    setElements((prev) => {
      const newElements = [...prev];
      newElements.splice(index, 0, element);
      return newElements;
    });
  };

  const removeElement = (id: string) => {
    setSelectedElement((currentSelectedElement) =>
      currentSelectedElement?.id === id ? null : currentSelectedElement,
    );
    setElements((prev) => removeElementFromTree(prev, id));
  };

  const updateElement = (id: string, element: FormElementInstance) => {
    setSelectedElement((currentSelectedElement) =>
      currentSelectedElement?.id === id ? element : currentSelectedElement,
    );
    setElements((prev) => {
      return updateElementInTree(prev, id, element);
    });
  };

  const addElementToGrid = (gridId: string, element: FormElementInstance) => {
    setElements((prev) => appendElementToGrid(prev, gridId, element));
  };

  return (
    <DesignerContext.Provider
      value={{
        pages,
        setPages,
        activePage,
        activePageId,
        setActivePageId,
        addPage,
        removePage,
        updatePage,
        updateCurrentPage,
        elements,
        settings,
        addElement: addelement,
        addElementToGrid,
        setElements,
        setSettings,
        updateSettings,
        removeElement,
        selectedElement,
        setSelectedElement,

        updateElement,
      }}
    >
      {children}
    </DesignerContext.Provider>
  );
}

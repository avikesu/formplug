"use client";

import {
  FormElementSidebarGroup,
  FormElements,
  FormElementsRegistry,
  defaultFormElementSidebarGroups,
} from "../FormElements";
import { ReactNode, createContext, useContext, useMemo } from "react";

type FormElementsContextValue = {
  registry: FormElementsRegistry;
  sidebarGroups: FormElementSidebarGroup[];
};

const FormElementsContext = createContext<FormElementsContextValue | null>(
  null,
);

export function FormElementsProvider({
  children,
  registry,
  sidebarGroups,
}: {
  children: ReactNode;
  registry?: FormElementsRegistry;
  sidebarGroups?: FormElementSidebarGroup[];
}) {
  const value = useMemo<FormElementsContextValue>(
    () => ({
      registry: registry ?? FormElements,
      sidebarGroups: sidebarGroups ?? defaultFormElementSidebarGroups,
    }),
    [registry, sidebarGroups],
  );

  return (
    <FormElementsContext.Provider value={value}>
      {children}
    </FormElementsContext.Provider>
  );
}

export function useFormElements() {
  const context = useContext(FormElementsContext);

  if (!context) {
    throw new Error(
      "useFormElements must be used within a FormElementsProvider",
    );
  }

  return context;
}

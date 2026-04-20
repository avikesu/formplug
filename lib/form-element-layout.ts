import { cn } from "@/lib/utils";

export type FormElementLayout = {
  row: number;
  columnSpan: number;
  marginTop: number;
  marginBottom: number;
  padding: number;
  indent: number;
};

export const defaultFormElementLayout: FormElementLayout = {
  row: 0,
  columnSpan: 12,
  marginTop: 0,
  marginBottom: 0,
  padding: 0,
  indent: 0,
};

const columnSpanClassMap: Record<number, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
};

const rowStartClassMap: Record<number, string> = {
  0: "",
  1: "row-start-1",
  2: "row-start-2",
  3: "row-start-3",
  4: "row-start-4",
  5: "row-start-5",
  6: "row-start-6",
  7: "row-start-7",
  8: "row-start-8",
  9: "row-start-9",
  10: "row-start-10",
  11: "row-start-11",
  12: "row-start-12",
};

const marginTopClassMap: Record<number, string> = {
  0: "mt-0",
  1: "mt-1",
  2: "mt-2",
  3: "mt-3",
  4: "mt-4",
  5: "mt-5",
  6: "mt-6",
  7: "mt-7",
  8: "mt-8",
  9: "mt-9",
  10: "mt-10",
  11: "mt-11",
  12: "mt-12",
};

const marginBottomClassMap: Record<number, string> = {
  0: "mb-0",
  1: "mb-1",
  2: "mb-2",
  3: "mb-3",
  4: "mb-4",
  5: "mb-5",
  6: "mb-6",
  7: "mb-7",
  8: "mb-8",
  9: "mb-9",
  10: "mb-10",
  11: "mb-11",
  12: "mb-12",
};

const paddingClassMap: Record<number, string> = {
  0: "p-0",
  1: "p-1",
  2: "p-2",
  3: "p-3",
  4: "p-4",
  5: "p-5",
  6: "p-6",
  7: "p-7",
  8: "p-8",
  9: "p-9",
  10: "p-10",
  11: "p-11",
  12: "p-12",
};

const indentClassMap: Record<number, string> = {
  0: "pl-0",
  1: "pl-2",
  2: "pl-4",
  3: "pl-6",
  4: "pl-8",
  5: "pl-10",
  6: "pl-12",
  7: "pl-14",
  8: "pl-16",
};

function normalizeBoundedNumber(
  value: unknown,
  fallback: number,
  min: number,
  max: number,
) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(Math.max(Math.round(value), min), max)
    : fallback;
}

export function getElementLayout(
  source: Record<string, unknown>,
): FormElementLayout {
  return {
    row: normalizeBoundedNumber(source.row, 0, 0, 12),
    columnSpan: normalizeBoundedNumber(source.columnSpan, 12, 1, 12),
    marginTop: normalizeBoundedNumber(source.marginTop, 0, 0, 12),
    marginBottom: normalizeBoundedNumber(source.marginBottom, 0, 0, 12),
    padding: normalizeBoundedNumber(source.padding, 0, 0, 12),
    indent: normalizeBoundedNumber(source.indent, 0, 0, 8),
  };
}

export function getElementContainerClassName(layout: FormElementLayout) {
  return cn(
    rowStartClassMap[layout.row] ?? rowStartClassMap[0],
    columnSpanClassMap[layout.columnSpan] ?? columnSpanClassMap[12],
    marginTopClassMap[layout.marginTop] ?? marginTopClassMap[0],
    marginBottomClassMap[layout.marginBottom] ?? marginBottomClassMap[0],
    indentClassMap[layout.indent] ?? indentClassMap[0],
  );
}

export function getElementInnerSpacingClassName(layout: FormElementLayout) {
  return paddingClassMap[layout.padding] ?? paddingClassMap[0];
}

export function sortElementsByLayout<T extends { properties: Record<string, unknown> }>(
  elements: T[],
): T[] {
  return [...elements].sort((left, right) => {
    const leftLayout = getElementLayout(left.properties);
    const rightLayout = getElementLayout(right.properties);

    const leftRow = leftLayout.row === 0 ? Number.MAX_SAFE_INTEGER : leftLayout.row;
    const rightRow = rightLayout.row === 0 ? Number.MAX_SAFE_INTEGER : rightLayout.row;

    if (leftRow !== rightRow) {
      return leftRow - rightRow;
    }

    return 0;
  });
}
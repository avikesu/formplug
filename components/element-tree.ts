import { FormElementInstance } from "./FormElements";

function getChildren(element: FormElementInstance): FormElementInstance[] {
  const children = (element.properties as { children?: unknown }).children;
  return Array.isArray(children) ? (children as FormElementInstance[]) : [];
}

function setChildren(
  element: FormElementInstance,
  children: FormElementInstance[],
): FormElementInstance {
  return {
    ...element,
    properties: {
      ...element.properties,
      children,
    },
  };
}

export function flattenElementTree(
  elements: FormElementInstance[],
): FormElementInstance[] {
  return elements.flatMap((element) => [
    element,
    ...flattenElementTree(getChildren(element)),
  ]);
}

export function removeElementFromTree(
  elements: FormElementInstance[],
  targetId: string,
): FormElementInstance[] {
  return elements
    .filter((element) => element.id !== targetId)
    .map((element) =>
      setChildren(
        element,
        removeElementFromTree(getChildren(element), targetId),
      ),
    );
}

export function updateElementInTree(
  elements: FormElementInstance[],
  targetId: string,
  nextElement: FormElementInstance,
): FormElementInstance[] {
  return elements.map((element) => {
    if (element.id === targetId) {
      return nextElement;
    }

    return setChildren(
      element,
      updateElementInTree(getChildren(element), targetId, nextElement),
    );
  });
}

export function appendElementToGrid(
  elements: FormElementInstance[],
  gridId: string,
  nextElement: FormElementInstance,
): FormElementInstance[] {
  return elements.map((element) => {
    if (element.id === gridId) {
      const children = getChildren(element);
      return setChildren(element, [...children, nextElement]);
    }

    return setChildren(
      element,
      appendElementToGrid(getChildren(element), gridId, nextElement),
    );
  });
}

export function getElementChildren(element: FormElementInstance) {
  return getChildren(element);
}

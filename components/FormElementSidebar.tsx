import React from "react";
import SidebarBtnElement from "./SidebarBtnElement";
import { getFormElement } from "./FormElements";
import { Separator } from "./ui/separator";
import { useFormElements } from "./context/FormElementsContext";

function FormElementSidebar() {
  const { registry, sidebarGroups } = useFormElements();

  return (
    <div>
      <p className="text-sm text-foreground/70">Drag and drop elements</p>
      <Separator className="my-2" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {sidebarGroups.map((group) => (
          <React.Fragment key={group.label}>
            <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 my-2">
              {group.label}
            </p>
            {group.elementTypes.map((elementType) => (
              <SidebarBtnElement
                key={elementType}
                formElement={getFormElement(registry, elementType)}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default FormElementSidebar;

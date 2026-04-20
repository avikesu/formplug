import React from "react";
import useDesigner from "./hooks/useDesigner";
import { getFormElement } from "./FormElements";
import { Button } from "./ui/button";
import { AiOutlineClose } from "react-icons/ai";
import { Separator } from "./ui/separator";
import { useFormElements } from "./context/FormElementsContext";
import ElementLayoutSection from "./ElementLayoutSection";

function PropertiesFormSidebar() {
  const { selectedElement, setSelectedElement } = useDesigner();
  const { registry } = useFormElements();
  if (!selectedElement) return null;

  const PropertiesForm = getFormElement(
    registry,
    selectedElement.type,
  ).propertiesComponent;

  return (
    <div className="flex flex-col p-2">
      <div className="flex justify-between items-center">
        <p className="text-sm text-foreground/70">Element properties</p>
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => setSelectedElement(null)}
        >
          <AiOutlineClose />
        </Button>
      </div>
      <Separator className="mb-4" />
      <PropertiesForm elementInstance={selectedElement} />
      <ElementLayoutSection element={selectedElement} />
    </div>
  );
}

export default PropertiesFormSidebar;

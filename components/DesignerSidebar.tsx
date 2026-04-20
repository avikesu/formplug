import React from "react";
import useDesigner from "./hooks/useDesigner";
import PropertiesFormSidebar from "./PropertiesFormSidebar";
import PagePropertiesSidebar from "./PagePropertiesSidebar";

function DesignerSidebar() {
  const { selectedElement } = useDesigner();
  return (
    <aside className="hidden h-full min-h-0 w-[360px] max-w-[360px] shrink-0 border-l-2 border-muted bg-background lg:flex lg:flex-col lg:overflow-hidden">
      <div className="flex h-full min-h-0 flex-col overflow-y-auto p-4">
        {selectedElement ? (
          <PropertiesFormSidebar />
        ) : (
          <PagePropertiesSidebar />
        )}
      </div>
    </aside>
  );
}

export default DesignerSidebar;

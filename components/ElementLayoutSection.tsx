"use client";

import useDesigner from "./hooks/useDesigner";
import { FormElementInstance } from "./FormElements";
import {
  getElementLayout,
  type FormElementLayout,
} from "@/lib/form-element-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

function LayoutSelect({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ElementLayoutSection({
  element,
}: {
  element: FormElementInstance;
}) {
  const { updateElement } = useDesigner();
  const layout = getElementLayout(element.properties);

  const updateLayout = (nextLayout: Partial<FormElementLayout>) => {
    updateElement(element.id, {
      ...element,
      properties: {
        ...element.properties,
        ...layout,
        ...nextLayout,
      },
    });
  };

  return (
    <div className="space-y-4">
      <Separator />
      <div>
        <p className="text-sm text-foreground/70">Element layout</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Control width, spacing, and indentation without changing the field
          type itself.
        </p>
      </div>

      <div className="space-y-4 rounded-xl border p-4">
        <LayoutSelect
          label="Row"
          value={String(layout.row)}
          onValueChange={(value) => updateLayout({ row: Number(value) })}
          options={[
            { value: "0", label: "Auto flow" },
            { value: "1", label: "Row 1" },
            { value: "2", label: "Row 2" },
            { value: "3", label: "Row 3" },
            { value: "4", label: "Row 4" },
            { value: "5", label: "Row 5" },
            { value: "6", label: "Row 6" },
          ]}
        />

        <LayoutSelect
          label="Width"
          value={String(layout.columnSpan)}
          onValueChange={(value) =>
            updateLayout({ columnSpan: Number(value) })
          }
          options={[
            { value: "12", label: "Full width" },
            { value: "8", label: "Two thirds" },
            { value: "6", label: "Half width" },
            { value: "4", label: "One third" },
            { value: "3", label: "One quarter" },
          ]}
        />

        <LayoutSelect
          label="Padding"
          value={String(layout.padding)}
          onValueChange={(value) => updateLayout({ padding: Number(value) })}
          options={[
            { value: "0", label: "0" },
            { value: "2", label: "2" },
            { value: "4", label: "4" },
            { value: "6", label: "6" },
            { value: "8", label: "8" },
          ]}
        />

        <LayoutSelect
          label="Margin top"
          value={String(layout.marginTop)}
          onValueChange={(value) =>
            updateLayout({ marginTop: Number(value) })
          }
          options={[
            { value: "0", label: "0" },
            { value: "2", label: "2" },
            { value: "4", label: "4" },
            { value: "6", label: "6" },
            { value: "8", label: "8" },
          ]}
        />

        <LayoutSelect
          label="Margin bottom"
          value={String(layout.marginBottom)}
          onValueChange={(value) =>
            updateLayout({ marginBottom: Number(value) })
          }
          options={[
            { value: "0", label: "0" },
            { value: "2", label: "2" },
            { value: "4", label: "4" },
            { value: "6", label: "6" },
            { value: "8", label: "8" },
          ]}
        />

        <LayoutSelect
          label="Container indent"
          value={String(layout.indent)}
          onValueChange={(value) => updateLayout({ indent: Number(value) })}
          options={[
            { value: "0", label: "0" },
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
          ]}
        />
      </div>
    </div>
  );
}

export default ElementLayoutSection;
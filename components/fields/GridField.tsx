"use client";

import {
  ElementsType,
  FormElement,
  FormElementInstance,
} from "../FormElements";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import useDesigner from "../hooks/useDesigner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { TbGridDots } from "react-icons/tb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { Switch } from "../ui/switch";
import { useFormElements } from "../context/FormElementsContext";
import { FormElementInstance as FormElementInstanceType } from "../FormElements";
import { getElementChildren } from "../element-tree";
import ElementLayoutSection from "../ElementLayoutSection";
import { sanitizeCssValue } from "@/lib/form-pages";

const justifyOptions = ["start", "center", "end", "stretch"] as const;
const alignOptions = ["start", "center", "end", "stretch"] as const;

const properties = {
  title: "Grid",
  visible: true,
  columns: 2,
  gap: 4,
  justifyItems: "stretch" as (typeof justifyOptions)[number],
  alignItems: "stretch" as (typeof alignOptions)[number],
  backgroundColor: "",
  borderColor: "#d4d4d8",
  minHeight: "160px",
  children: [] as FormElementInstanceType[],
};

const propertiesSchema = z.object({
  title: z.string().min(2).max(100),
  visible: z.boolean(),
  columns: z.number().int().min(1).max(6),
  gap: z.number().int().min(0).max(12),
  justifyItems: z.enum(["start", "center", "end", "stretch"]),
  alignItems: z.enum(["start", "center", "end", "stretch"]),
  backgroundColor: z.string().max(50),
  borderColor: z.string().max(50),
  minHeight: z.string().max(32),
  children: z.array(z.any()),
});

const type: ElementsType = "GridField";
export const GridFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    properties: {
      ...properties,
      children: [],
    },
  }),
  designerBtnElement: {
    icon: TbGridDots,
    label: "Grid",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: () => true,
};

type CustomInstance = FormElementInstance & {
  properties: typeof properties;
};

function ColorSettingField({
  label,
  value,
  onChange,
  fallbackColor = "#ffffff",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  fallbackColor?: string;
}) {
  const colorPickerValue = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)
    ? value
    : fallbackColor;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-background px-3 py-2">
        <Input
          type="color"
          value={colorPickerValue}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-14 shrink-0 cursor-pointer border-0 bg-transparent p-0"
        />
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Default"
        />
      </div>
    </div>
  );
}

function getProperties(source: Record<string, unknown>) {
  return {
    ...properties,
    ...source,
  } as typeof properties;
}

function GridChildrenPreview({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const { registry } = useFormElements();
  const { setSelectedElement } = useDesigner();
  const children = getElementChildren(elementInstance);

  if (children.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/70 bg-background/60 px-4 py-8 text-center text-sm text-muted-foreground">
        Drop elements here to build the grid.
      </div>
    );
  }

  return (
    <div
      className="grid gap-3 pointer-events-auto"
      style={{
        gridTemplateColumns: `repeat(${getProperties(elementInstance.properties).columns}, minmax(0, 1fr))`,
      }}
    >
      {children.map((child) => {
        const ChildDesigner = registry[child.type]?.designerComponent;
        if (!ChildDesigner) {
          return null;
        }

        return (
          <div
            key={child.id}
            onClick={(event) => {
              event.stopPropagation();
              setSelectedElement(child);
            }}
            className="pointer-events-auto cursor-pointer rounded-xl border border-border/60 bg-background p-3 text-left transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <ChildDesigner elementInstance={child} />
          </div>
        );
      })}
    </div>
  );
}

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const instance = elementInstance as CustomInstance;
  const {
    title,
    visible,
    columns,
    gap,
    justifyItems,
    alignItems,
    backgroundColor,
    borderColor,
    minHeight,
  } = getProperties(instance.properties);

  const { setNodeRef, isOver } = useDroppable({
    id: `grid-drop-${instance.id}`,
    data: {
      isGridDropArea: true,
      elementId: instance.id,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-full flex-col gap-3 rounded-2xl border p-4 transition-colors",
        !visible && "border-red-200 bg-slate-50/80 opacity-75",
        isOver && "ring-4 ring-primary ring-inset",
      )}
      style={{
        backgroundColor: backgroundColor
          ? sanitizeCssValue(backgroundColor, "transparent")
          : "transparent",
        borderColor: sanitizeCssValue(borderColor, "#d4d4d8"),
        minHeight,
      }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Label className="text-muted-foreground">Grid element</Label>
        <Badge
          variant="outline"
          className="text-[11px] uppercase tracking-wide"
        >
          {columns} cols
        </Badge>
        <Badge
          variant="outline"
          className="text-[11px] uppercase tracking-wide"
        >
          gap {gap}
        </Badge>
        <Badge
          variant="outline"
          className="text-[11px] uppercase tracking-wide"
        >
          {justifyItems}
        </Badge>
        <Badge
          variant="outline"
          className="text-[11px] uppercase tracking-wide"
        >
          {alignItems}
        </Badge>
      </div>
      <GridChildrenPreview elementInstance={elementInstance} />
    </div>
  );
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const instance = elementInstance as CustomInstance;
  const {
    title,
    visible,
    columns,
    gap,
    justifyItems,
    alignItems,
    backgroundColor,
    minHeight,
  } = getProperties(instance.properties);
  const { registry } = useFormElements();
  const children = getElementChildren(instance);

  if (!visible) {
    return null;
  }

  return (
    <div
      className="w-full rounded-2xl border px-4 py-4"
      style={{
        backgroundColor: backgroundColor
          ? sanitizeCssValue(backgroundColor, "transparent")
          : "transparent",
        minHeight,
      }}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-foreground">
          {title && title.trim() !== "Grid" ? title : ""}
        </span>
      </div>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: `${gap}px`,
          justifyItems,
          alignItems,
        }}
      >
        {children.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-border/70 px-4 py-8 text-center text-sm text-muted-foreground">
            This grid is empty.
          </div>
        ) : (
          children.map((child) => {
            const ChildForm = registry[child.type]?.formComponent;
            if (!ChildForm) {
              return null;
            }

            return <ChildForm key={child.id} elementInstance={child} />;
          })
        )}
      </div>
    </div>
  );
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;
function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const instance = elementInstance as CustomInstance;
  const { updateElement } = useDesigner();
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: getProperties(instance.properties),
  });

  useEffect(() => {
    form.reset(getProperties(instance.properties));
  }, [instance, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    updateElement(instance.id, {
      ...instance,
      properties: {
        ...instance.properties,
        ...values,
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(event) => {
          event.preventDefault();
        }}
        className="space-y-4"
      >
        <Tabs defaultValue="general" className="flex flex-col gap-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="condition">Conditions</TabsTrigger>
          </TabsList>

          <TabsContent
            value="general"
            className="space-y-4 rounded-xl border p-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.currentTarget.blur();
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Displayed above the grid area.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visible"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Visible</FormLabel>
                    <FormDescription>
                      Show or hide the grid container.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent
            value="layout"
            className="space-y-4 rounded-xl border p-4"
          >
            <FormField
              control={form.control}
              name="columns"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Columns</FormLabel>
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select columns" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Controls how many items can sit side by side.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gap"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gap</FormLabel>
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select gap" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="12">12</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Spacing between the grid children.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="justifyItems"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horizontal alignment</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select alignment" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {justifyOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Align children horizontally inside each cell.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="alignItems"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vertical alignment</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select alignment" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {alignOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Align children vertically inside each cell.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ColorSettingField
              label="Background color"
              value={form.watch("backgroundColor")}
              fallbackColor="#ffffff"
              onChange={(value) => form.setValue("backgroundColor", value)}
            />

            <ColorSettingField
              label="Border color"
              value={form.watch("borderColor")}
              fallbackColor="#d4d4d8"
              onChange={(value) => form.setValue("borderColor", value)}
            />

            <FormField
              control={form.control}
              name="minHeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum height</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="160px"
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.currentTarget.blur();
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Reserve enough vertical space for the grid area.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ElementLayoutSection element={elementInstance} />
          </TabsContent>

          <TabsContent value="condition" className="rounded-xl border p-4">
            <div className="rounded-lg border border-dashed border-border/80 bg-muted/20 p-4 text-sm text-muted-foreground">
              Grid conditions can be added here later.
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}

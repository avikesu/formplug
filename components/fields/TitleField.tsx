"use client";

import {
  ElementsType,
  FormElement,
  FormElementInstance,
} from "../FormElements";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import useDesigner from "../hooks/useDesigner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { LuHeading1 } from "react-icons/lu";
import {
  textFieldSizeOptions,
  titleSizeClassMap,
  type TextFieldSize,
} from "./textFieldVariants";

const properties = {
  title: "Title Field",
  fontSize: "medium" as TextFieldSize,
  visible: true,
};

const propertiesSchema = z.object({
  title: z.string().min(2).max(100),
  fontSize: z.enum(["xsmall", "small", "medium", "large"]),
  visible: z.boolean(),
});

const type: ElementsType = "TitleField";
export const TitleFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    properties,
  }),
  designerBtnElement: {
    icon: LuHeading1,
    label: "Title Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: () => true,
};

type CustomInstance = FormElementInstance & {
  properties: typeof properties;
};

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const instance = elementInstance as CustomInstance;
  const { title, fontSize, visible } = instance.properties;
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Label className="text-muted-foreground">Title field</Label>
        <Badge
          variant="outline"
          className="text-[11px] uppercase tracking-wide"
        >
          {fontSize}
        </Badge>
        <Badge
          variant={visible ? "secondary" : "outline"}
          className="text-[11px] uppercase tracking-wide"
        >
          {visible ? "Visible" : "Hidden"}
        </Badge>
      </div>
      <p className={titleSizeClassMap[fontSize]}>{title}</p>
    </div>
  );
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const instance = elementInstance as CustomInstance;

  const { title, fontSize, visible } = instance.properties;
  if (!visible) {
    return null;
  }
  return (
    <p
      className={`font-semibold tracking-tight text-foreground ${titleSizeClassMap[fontSize]}`}
    >
      {title}
    </p>
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
    defaultValues: {
      title: instance.properties.title,
      fontSize: instance.properties.fontSize,
      visible: instance.properties.visible,
    },
  });

  useEffect(() => {
    form.reset(instance.properties);
  }, [instance, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { title, fontSize, visible } = values;
    updateElement(instance.id, {
      ...instance,
      properties: {
        ...instance.properties,
        title,
        fontSize,
        visible,
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-4"
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
                  maxLength={100}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Maximum 100 characters.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fontSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font size</FormLabel>
              <FormControl>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
                  value={field.value}
                  onChange={field.onChange}
                >
                  {textFieldSizeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Title sizes always stay above subtitle sizes.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
          <div>
            <FormLabel className="text-sm font-medium">Visible</FormLabel>
            <p className="mt-1 text-xs text-muted-foreground">
              Hide or show this title block.
            </p>
          </div>
          <FormField
            control={form.control}
            name="visible"
            render={({ field }) => (
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            )}
          />
        </div>
      </form>
    </Form>
  );
}

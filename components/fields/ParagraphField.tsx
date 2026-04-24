"use client";

import {
  ElementsType,
  FormElement,
  FormElementInstance,
} from "../FormElements";
import { Label } from "../ui/label";
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
import { BsTextParagraph } from "react-icons/bs";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import {
  paragraphSizeClassMap,
  textFieldSizeOptions,
  type TextFieldSize,
} from "./textFieldVariants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";

const properties = {
  text: "Text here",
  fontSize: "medium" as TextFieldSize,
  visible: true,
};

const propertiesSchema = z.object({
  text: z.string().min(2).max(1000),
  fontSize: z.enum(["xsmall", "small", "medium", "large"]),
  visible: z.boolean(),
});

const type: ElementsType = "ParagraphField";
export const ParagraphFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    properties,
  }),
  designerBtnElement: {
    icon: BsTextParagraph,
    label: "Paragraph Field",
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
  const { text, fontSize, visible } = instance.properties;
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-wrap items-center gap-2">
        <Label className="text-muted-foreground">Paragraph field</Label>
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
      <p className={paragraphSizeClassMap[fontSize]}>{text}</p>
    </div>
  );
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const instance = elementInstance as CustomInstance;

  const { text, fontSize, visible } = instance.properties;
  if (!visible) {
    return null;
  }
  return (
    <p
      className={`w-full whitespace-pre-wrap leading-7 text-foreground ${paragraphSizeClassMap[fontSize]}`}
    >
      {text}
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
      text: instance.properties.text,
      fontSize: instance.properties.fontSize,
      visible: instance.properties.visible,
    },
  });

  useEffect(() => {
    form.reset(instance.properties);
  }, [instance, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { text, fontSize, visible } = values;
    updateElement(instance.id, {
      ...instance,
      properties: {
        ...instance.properties,
        text,
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
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text</FormLabel>
              <FormControl>
                <Textarea
                  rows={6}
                  maxLength={1000}
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Maximum 1000 characters.
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
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    {textFieldSizeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
          <div>
            <FormLabel className="text-sm font-medium">Visible</FormLabel>
            <p className="mt-1 text-xs text-muted-foreground">
              Hide or show this paragraph block.
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

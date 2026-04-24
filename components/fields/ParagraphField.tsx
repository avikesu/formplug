"use client";

import {
  ElementsType,
  FormElement,
  FormElementInstance,
} from "../FormElements";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
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
import { BsTextParagraph } from "react-icons/bs";
import { Textarea } from "../ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { cn } from "@/lib/utils";
import ElementLayoutSection from "../ElementLayoutSection";
import { sanitizeCssValue } from "@/lib/form-pages";
import { Input } from "../ui/input";

const paragraphAlignmentOptions = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
] as const;

const paragraphAlignmentClassMap = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

const paragraphWrapClassMap = {
  true: "whitespace-pre-wrap",
  false: "whitespace-pre overflow-x-auto",
} as const;

type ParagraphAlignment = (typeof paragraphAlignmentOptions)[number]["value"];

const properties = {
  text: "Text here",
  fontSize: "medium" as TextFieldSize,
  alignment: "left" as ParagraphAlignment,
  textWrap: true,
  backgroundColor: "",
  visible: true,
};

const propertiesSchema = z.object({
  text: z.string().min(2).max(1000),
  fontSize: z.enum(["xsmall", "small", "medium", "large"]),
  alignment: z.enum(["left", "center", "right"]),
  textWrap: z.boolean(),
  backgroundColor: z.string().max(50),
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

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const instance = elementInstance as CustomInstance;
  const { text, fontSize, alignment, textWrap, backgroundColor, visible } =
    getProperties(instance.properties);

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-2 rounded-xl border border-dashed border-transparent px-4 py-3",
        !visible && "border-red-200 bg-slate-50/80 opacity-75",
      )}
      style={{
        backgroundColor: backgroundColor
          ? sanitizeCssValue(backgroundColor, "transparent")
          : "transparent",
      }}
    >
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
        <Badge
          variant="outline"
          className="text-[11px] uppercase tracking-wide"
        >
          {alignment}
        </Badge>
        <Badge
          variant="outline"
          className="text-[11px] uppercase tracking-wide"
        >
          {textWrap ? "Wrap" : "No wrap"}
        </Badge>
      </div>
      <p
        className={cn(
          paragraphSizeClassMap[fontSize],
          paragraphAlignmentClassMap[alignment],
          paragraphWrapClassMap[String(textWrap) as "true" | "false"],
        )}
      >
        {text}
      </p>
    </div>
  );
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const instance = elementInstance as CustomInstance;
  const { text, fontSize, alignment, textWrap, backgroundColor, visible } =
    getProperties(instance.properties);

  if (!visible) {
    return null;
  }

  return (
    <div
      className="w-full rounded-xl border border-border/60 px-4 py-3"
      style={{
        backgroundColor: backgroundColor
          ? sanitizeCssValue(backgroundColor, "transparent")
          : "transparent",
      }}
    >
      <p
        className={cn(
          "w-full leading-7 text-foreground",
          paragraphSizeClassMap[fontSize],
          paragraphAlignmentClassMap[alignment],
          paragraphWrapClassMap[String(textWrap) as "true" | "false"],
        )}
      >
        {text}
      </p>
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
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={6}
                      maxLength={1000}
                      {...field}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.currentTarget.blur();
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>Maximum 1000 characters.</FormDescription>
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
              name="fontSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Font size</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
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
                  <FormDescription>
                    Control the paragraph text size.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="alignment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text alignment</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select alignment" />
                      </SelectTrigger>
                      <SelectContent>
                        {paragraphAlignmentOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Align the paragraph left, center, or right.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="textWrap"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
                  <div>
                    <FormLabel className="text-sm font-medium">
                      Text wrap
                    </FormLabel>
                    <FormDescription>
                      Allow the paragraph to wrap onto multiple lines.
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

            <ColorSettingField
              label="Background color"
              value={form.watch("backgroundColor")}
              fallbackColor="#ffffff"
              onChange={(value) => form.setValue("backgroundColor", value)}
            />

            <FormField
              control={form.control}
              name="visible"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
                  <div>
                    <FormLabel className="text-sm font-medium">
                      Visible
                    </FormLabel>
                    <FormDescription>
                      Hide or show this paragraph block.
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

            <ElementLayoutSection element={elementInstance} />
          </TabsContent>

          <TabsContent
            value="condition"
            className="space-y-4 rounded-xl border p-4"
          >
            <div className="rounded-lg border border-dashed border-border/80 bg-muted/20 p-4 text-sm text-muted-foreground">
              Additional conditional rules can be added here later.
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}

"use client";

import {
  ElementsType,
  FormElement,
  FormElementInstance,
  SubmitFunction,
} from "../FormElements";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
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
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { cn } from "@/lib/utils";
import { MdImage } from "react-icons/md";
import ElementLayoutSection from "../ElementLayoutSection";
import HiddenDesignerIndicator from "../HiddenDesignerIndicator";

type ImageAlignment = "left" | "center" | "right";
type ImageFit = "contain" | "cover";
type ImageHeight = "sm" | "md" | "lg";

type ImageFieldProperties = {
  src: string;
  alt: string;
  caption: string;
  visible: boolean;
  showCaption: boolean;
  alignment: ImageAlignment;
  fit: ImageFit;
  height: ImageHeight;
};

const properties: ImageFieldProperties = {
  src: "",
  alt: "Logo",
  caption: "",
  visible: true,
  showCaption: false,
  alignment: "left",
  fit: "contain",
  height: "md",
};

const propertiesSchema = z.object({
  src: z.string().max(2000),
  alt: z.string().max(120),
  caption: z.string().max(240),
  visible: z.boolean(),
  showCaption: z.boolean(),
  alignment: z.enum(["left", "center", "right"]),
  fit: z.enum(["contain", "cover"]),
  height: z.enum(["sm", "md", "lg"]),
});

const alignmentClassMap: Record<ImageAlignment, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

const objectFitClassMap: Record<ImageFit, string> = {
  contain: "object-contain",
  cover: "object-cover",
};

const imageHeightClassMap: Record<ImageHeight, string> = {
  sm: "h-16",
  md: "h-24",
  lg: "h-32",
};

function getProperties(source: Record<string, unknown>): ImageFieldProperties {
  return {
    ...properties,
    ...source,
  } as ImageFieldProperties;
}

const type: ElementsType = "ImageField";
export const ImageFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    properties,
  }),
  designerBtnElement: {
    icon: MdImage,
    label: "Image Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: () => true,
};

type CustomInstance = FormElementInstance & {
  properties: ImageFieldProperties;
};

function ImagePreview({ properties }: { properties: ImageFieldProperties }) {
  if (!properties.src.trim()) {
    return (
      <div className="flex h-24 w-full items-center justify-center rounded-xl border border-dashed border-muted-foreground/30 bg-muted/20 text-sm text-muted-foreground">
        Add an image URL to display a logo or media block.
      </div>
    );
  }

  return (
    <img
      src={properties.src}
      alt={properties.alt || "Image"}
      className={cn(
        "max-w-full rounded-lg",
        imageHeightClassMap[properties.height],
        objectFitClassMap[properties.fit],
      )}
    />
  );
}

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const instance = elementInstance as CustomInstance;
  const normalizedProperties = getProperties(instance.properties);

  return (
    <div
      className={cn(
        "relative flex w-full flex-col gap-3 rounded-lg border border-dashed border-transparent p-3",
        alignmentClassMap[normalizedProperties.alignment],
        !normalizedProperties.visible && "border-red-200 bg-slate-50/80 opacity-75",
      )}
    >
      {!normalizedProperties.visible && <HiddenDesignerIndicator />}
      <ImagePreview properties={normalizedProperties} />
      {normalizedProperties.showCaption && normalizedProperties.caption && (
        <p className="text-[0.8rem] text-muted-foreground">
          {normalizedProperties.caption}
        </p>
      )}
    </div>
  );
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
  submitValue?: SubmitFunction;
  isInvalid?: boolean;
  defaultValue?: string;
}) {
  const instance = elementInstance as CustomInstance;
  const normalizedProperties = getProperties(instance.properties);

  if (!normalizedProperties.visible) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-3",
        alignmentClassMap[normalizedProperties.alignment],
      )}
    >
      <ImagePreview properties={normalizedProperties} />
      {normalizedProperties.showCaption && normalizedProperties.caption && (
        <p className="text-sm text-muted-foreground">
          {normalizedProperties.caption}
        </p>
      )}
    </div>
  );
}

type PropertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const instance = elementInstance as CustomInstance;
  const { updateElement } = useDesigner();
  const form = useForm<PropertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: getProperties(instance.properties),
  });

  useEffect(() => {
    form.reset(getProperties(instance.properties));
  }, [instance, form]);

  function applyChanges(values: PropertiesFormSchemaType) {
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
            <TabsTrigger value="condition">Condition</TabsTrigger>
          </TabsList>

          <TabsContent
            value="general"
            className="space-y-4 rounded-xl border p-4"
          >
            <FormField
              control={form.control}
              name="src"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://example.com/logo.png"
                      onKeyDown={(event) => {
                        if (event.key === "Enter") event.currentTarget.blur();
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Use a direct image URL for logos or media.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="alt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alt text</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") event.currentTarget.blur();
                      }}
                    />
                  </FormControl>
                  <FormDescription>Accessibility text for the image.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caption</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormDescription>
                    Optional supporting text below the image.
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
                    <FormDescription>Show or hide the image.</FormDescription>
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

            <FormField
              control={form.control}
              name="showCaption"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Show caption</FormLabel>
                    <FormDescription>
                      Render the caption under the image.
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
              name="alignment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alignment</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select alignment" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fit</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select fit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="contain">Contain</SelectItem>
                      <SelectItem value="cover">Cover</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select height" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sm">Small</SelectItem>
                      <SelectItem value="md">Medium</SelectItem>
                      <SelectItem value="lg">Large</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ElementLayoutSection element={elementInstance} />
          </TabsContent>

          <TabsContent value="condition" className="rounded-xl border p-4">
            <div className="rounded-lg border border-dashed border-border/80 bg-muted/20 p-4 text-sm text-muted-foreground">
              Conditions are empty for now.
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}
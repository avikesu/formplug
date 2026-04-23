"use client";

import {
  ElementsType,
  FormElement,
  FormElementInstance,
  SubmitFunction,
} from "../FormElements";
import { MdArrowDropDownCircle } from "react-icons/md";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
import ElementLayoutSection from "../ElementLayoutSection";
import HiddenDesignerIndicator from "../HiddenDesignerIndicator";

type CollapseState = "locked" | "collapsed" | "expanded";
type Alignment = "left" | "center" | "right";

type DropdownFieldProperties = {
  label: string;
  helpertext: string;
  placeholder: string;
  visible: boolean;
  readOnly: boolean;
  showTitle: boolean;
  showDescription: boolean;
  collapseState: CollapseState;
  alignment: Alignment;
  indent: number;
  required: boolean;
  options: string;
};

const properties: DropdownFieldProperties = {
  label: "Dropdown Field",
  helpertext: "Helper text",
  placeholder: "Select an option",
  visible: true,
  readOnly: false,
  showTitle: true,
  showDescription: true,
  collapseState: "expanded",
  alignment: "left",
  indent: 0,
  required: false,
  options: "Option 1\nOption 2\nOption 3",
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helpertext: z.string().max(200),
  placeholder: z.string().max(50),
  visible: z.boolean(),
  readOnly: z.boolean(),
  showTitle: z.boolean(),
  showDescription: z.boolean(),
  collapseState: z.enum(["locked", "collapsed", "expanded"]),
  alignment: z.enum(["left", "center", "right"]),
  indent: z.number().int().min(0).max(3),
  required: z.boolean(),
  options: z.string().max(2000),
});

const alignmentClassMap: Record<Alignment, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const indentClassMap: Record<number, string> = {
  0: "pl-0",
  1: "pl-4",
  2: "pl-8",
  3: "pl-12",
};

function getProperties(source: Record<string, unknown>): DropdownFieldProperties {
  return {
    ...properties,
    ...source,
  } as DropdownFieldProperties;
}

function getWrapperClassName(alignment: Alignment, indent: number) {
  return cn(
    "flex w-full flex-col gap-2",
    alignmentClassMap[alignment],
    indentClassMap[indent] ?? indentClassMap[0],
  );
}

function getOptions(source: string) {
  return Array.from(
    new Set(
      source
        .split(/\r?\n/)
        .map((option) => option.trim())
        .filter(Boolean),
    ),
  );
}

const type: ElementsType = "DropdownField";
export const DropdownFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    properties,
  }),
  designerBtnElement: {
    icon: MdArrowDropDownCircle,
    label: "Dropdown Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (
    formElement: FormElementInstance,
    currentValue: string,
  ): boolean => {
    const element = formElement as CustomInstance;
    const normalizedProperties = getProperties(element.properties);
    const options = getOptions(normalizedProperties.options);

    if (
      !normalizedProperties.visible ||
      normalizedProperties.readOnly ||
      normalizedProperties.collapseState === "collapsed" ||
      normalizedProperties.collapseState === "locked"
    ) {
      return true;
    }

    if (currentValue.trim().length === 0) {
      return !normalizedProperties.required;
    }

    return options.includes(currentValue);
  },
};

type CustomInstance = FormElementInstance & {
  properties: DropdownFieldProperties;
};

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const instance = elementInstance as CustomInstance;
  const {
    label,
    required,
    placeholder,
    helpertext,
    visible,
    showTitle,
    showDescription,
    collapseState,
    alignment,
    indent,
    options,
  } = getProperties(instance.properties);
  const optionList = getOptions(options);

  return (
    <div
      className={cn(
        getWrapperClassName(alignment, indent),
        "relative rounded-lg border border-dashed border-transparent p-3",
        !visible && "border-red-200 bg-slate-50/80 opacity-75",
      )}
    >
      {!visible && <HiddenDesignerIndicator />}
      {showTitle && (
        <Label className={alignmentClassMap[alignment]}>
          {label}
          {required ? "*" : ""}
        </Label>
      )}
      {collapseState !== "collapsed" && (
        <div className="space-y-2">
          {optionList.length > 0 ? (
            <Select value="" disabled>
              <SelectTrigger className={cn("w-full", alignmentClassMap[alignment])}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {optionList.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="rounded-md border border-dashed border-border px-3 py-2 text-sm text-muted-foreground">
              No dropdown options configured.
            </div>
          )}
        </div>
      )}
      {showDescription && helpertext && (
        <p
          className={cn(
            "text-[0.8rem] text-muted-foreground",
            alignmentClassMap[alignment],
          )}
        >
          {helpertext}
        </p>
      )}
    </div>
  );
}

function FormComponent({
  elementInstance,
  submitValue,
  isInvalid,
  defaultValue,
}: {
  elementInstance: FormElementInstance;
  submitValue?: SubmitFunction;
  isInvalid?: boolean;
  defaultValue?: string;
}) {
  const instance = elementInstance as CustomInstance;
  const [value, setValue] = useState(defaultValue || "");
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(isInvalid === true);
  }, [isInvalid]);

  useEffect(() => {
    setValue(defaultValue || "");
  }, [defaultValue]);

  const {
    label,
    required,
    placeholder,
    helpertext,
    visible,
    readOnly,
    showTitle,
    showDescription,
    collapseState,
    alignment,
    indent,
    options,
  } = getProperties(instance.properties);
  const optionList = getOptions(options);

  if (!visible) return null;
  return (
    <div className={cn(getWrapperClassName(alignment, indent), "relative")}>
      {showTitle && (
        <Label
          className={cn(
            alignmentClassMap[alignment],
            error && "text-red-500",
          )}
        >
          {label}
          {required ? "*" : ""}
        </Label>
      )}
      {collapseState !== "collapsed" && (
        <div className="space-y-2">
          {optionList.length > 0 ? (
            <Select
              value={value}
              onValueChange={(nextValue) => {
                if (readOnly || collapseState === "locked") {
                  return;
                }

                setValue(nextValue);
                const valid = DropdownFieldFormElement.validate(
                  elementInstance,
                  nextValue,
                );
                setError(!valid);
                if (!valid || !submitValue) {
                  return;
                }

                submitValue(elementInstance.id, nextValue);
              }}
              disabled={readOnly || collapseState === "locked"}
            >
              <SelectTrigger
                className={cn(
                  "w-full",
                  alignmentClassMap[alignment],
                  error && "border-red-500",
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {optionList.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="rounded-md border border-dashed border-border px-3 py-2 text-sm text-muted-foreground">
              No dropdown options configured.
            </div>
          )}
        </div>
      )}
      {showDescription && helpertext && (
        <p
          className={cn(
            "text-[0.8rem] text-muted-foreground",
            alignmentClassMap[alignment],
            error && "text-red-500",
          )}
        >
          {helpertext}
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
    const {
      label,
      helpertext,
      placeholder,
      visible,
      readOnly,
      showTitle,
      showDescription,
      collapseState,
      alignment,
      indent,
      required,
      options,
    } = values;

    updateElement(instance.id, {
      ...instance,
      properties: {
        ...instance.properties,
        label,
        helpertext,
        placeholder,
        visible,
        readOnly,
        showTitle,
        showDescription,
        collapseState,
        alignment,
        indent,
        required,
        options,
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

          <TabsContent value="general" className="space-y-4 rounded-xl border p-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") e.currentTarget.blur();
                      }}
                    />
                  </FormControl>
                  <FormDescription>Displayed above the dropdown field.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="helpertext"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                          e.currentTarget.blur();
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>Displayed below the dropdown field.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="placeholder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placeholder</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") e.currentTarget.blur();
                      }}
                    />
                  </FormControl>
                  <FormDescription>Shown when no option has been selected.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="options"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Options</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={5}
                      placeholder={"Option 1\nOption 2\nOption 3"}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                          e.currentTarget.blur();
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>Enter one option per line.</FormDescription>
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
                    <FormDescription>Show or hide the field.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="required"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Required</FormLabel>
                    <FormDescription>Require a selection before submission.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="readOnly"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Read-only</FormLabel>
                    <FormDescription>Display the field without allowing edits.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="showTitle"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Show title</FormLabel>
                    <FormDescription>Render the title above the field.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="showDescription"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Show description</FormLabel>
                    <FormDescription>Render the description below the field.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="layout" className="space-y-4 rounded-xl border p-4">
            <FormField
              control={form.control}
              name="collapseState"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collapse state</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select collapse state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="locked">Locked</SelectItem>
                      <SelectItem value="collapsed">Collapsed</SelectItem>
                      <SelectItem value="expanded">Expanded</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Control whether the field is shown, hidden, or locked.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <FormDescription>Align the title, field, and description.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="indent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Indent</FormLabel>
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select indent" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Offset the field from the left edge of the layout.</FormDescription>
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

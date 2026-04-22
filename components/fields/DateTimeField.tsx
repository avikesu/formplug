
"use client";

import {
  ElementsType,
  FormElement,
  FormElementInstance,
  SubmitFunction,
} from "../FormElements";
import { MdOutlineMoreTime } from "react-icons/md";
import { CalendarIcon, Clock3Icon } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
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
import { Textarea } from "../ui/textarea";
import ElementLayoutSection from "../ElementLayoutSection";
import HiddenDesignerIndicator from "../HiddenDesignerIndicator";

type CollapseState = "locked" | "collapsed" | "expanded";
type Alignment = "left" | "center" | "right";

type DateTimeFieldProperties = {
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
  useCurrentDateTime: boolean;
};

const properties: DateTimeFieldProperties = {
  label: "Date & Time Field",
  helpertext: "Records the browser's current date and time.",
  placeholder: "Select date and time",
  visible: true,
  readOnly: true,
  showTitle: true,
  showDescription: true,
  collapseState: "expanded",
  alignment: "left",
  indent: 0,
  required: false,
  useCurrentDateTime: true,
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
  useCurrentDateTime: z.boolean(),
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

function getProperties(
  source: Record<string, unknown>,
): DateTimeFieldProperties {
  return {
    ...properties,
    ...source,
  } as DateTimeFieldProperties;
}

function getWrapperClassName(alignment: Alignment, indent: number) {
  return cn(
    "flex w-full flex-col gap-2",
    alignmentClassMap[alignment],
    indentClassMap[indent] ?? indentClassMap[0],
  );
}

function getCurrentBrowserDateTime() {
  const now = new Date();
  const offsetMilliseconds = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offsetMilliseconds)
    .toISOString()
    .slice(0, 16);
}

function parseDateTimeValue(value: string) {
  if (!value) {
    return undefined;
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return undefined;
  }

  return parsedDate;
}

function getTimeValue(value: string) {
  if (!value || !value.includes("T")) {
    return "";
  }

  return value.split("T")[1]?.slice(0, 5) ?? "";
}

function toLocalDateTimeValue(date: Date, timeValue: string) {
  const normalizedTime = timeValue || "00:00";
  const [hours, minutes] = normalizedTime.split(":").map(Number);

  const nextDate = new Date(date);
  nextDate.setHours(Number.isNaN(hours) ? 0 : hours);
  nextDate.setMinutes(Number.isNaN(minutes) ? 0 : minutes);
  nextDate.setSeconds(0);
  nextDate.setMilliseconds(0);

  const offsetMilliseconds = nextDate.getTimezoneOffset() * 60_000;
  return new Date(nextDate.getTime() - offsetMilliseconds)
    .toISOString()
    .slice(0, 16);
}

function formatDateTimeDisplay(value: string, placeholder: string) {
  const parsedDate = parseDateTimeValue(value);
  if (!parsedDate) {
    return placeholder;
  }

  return parsedDate.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function DateTimePicker({
  value,
  placeholder,
  disabled,
  readOnly,
  invalid,
  className,
  onChange,
}: {
  value: string;
  placeholder: string;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  className?: string;
  onChange?: (nextValue: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedDate = parseDateTimeValue(value);
  const timeValue = getTimeValue(value);
  const isDisabled = disabled || readOnly;

  return (
    <Popover open={isDisabled ? false : open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={isDisabled}
          className={cn(
            "w-full justify-between font-normal",
            !selectedDate && "text-muted-foreground",
            invalid && "border-red-500",
            className,
          )}
        >
          <span className="truncate">
            {formatDateTimeDisplay(value, placeholder)}
          </span>
          <CalendarIcon className="ml-2 size-4 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(nextDate) => {
              if (!nextDate) {
                return;
              }

              onChange?.(toLocalDateTimeValue(nextDate, timeValue));
            }}
            initialFocus
            captionLayout="dropdown"
          />
          <div className="flex items-center gap-3 border-t p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock3Icon className="size-4" />
              <span>Time</span>
            </div>
            <Input
              type="time"
              step="60"
              value={timeValue}
              onChange={(event) => {
                const nextTime = event.target.value;
                const baseDate = selectedDate ?? new Date();
                onChange?.(toLocalDateTimeValue(baseDate, nextTime));
              }}
              className="h-9"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

const type: ElementsType = "DateTimeField";
export const DateTimeFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    properties,
  }),
  designerBtnElement: {
    icon: MdOutlineMoreTime,
    label: "Date & Time",
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

    if (
      !normalizedProperties.visible ||
      normalizedProperties.collapseState === "collapsed" ||
      normalizedProperties.collapseState === "locked"
    ) {
      return true;
    }

    if (normalizedProperties.required) {
      return currentValue.length > 0;
    }

    return true;
  },
};

type CustomInstance = FormElementInstance & {
  properties: DateTimeFieldProperties;
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
    readOnly,
    showTitle,
    showDescription,
    collapseState,
    alignment,
    indent,
    useCurrentDateTime,
  } = getProperties(instance.properties);

  return (
    <div
      className={cn(
        getWrapperClassName(alignment, indent),
        "relative rounded-lg border border-dashed border-transparent p-3",
        !visible && "border-red-200 bg-slate-50/80 opacity-75",
      )}
    >
      {!visible && (
        <HiddenDesignerIndicator />
      )}
      {showTitle && (
        <Label className={alignmentClassMap[alignment]}>
          {label}
          {required ? "*" : ""}
        </Label>
      )}
      {collapseState !== "collapsed" && (
        <DateTimePicker
          value={useCurrentDateTime && visible ? getCurrentBrowserDateTime() : ""}
          placeholder={placeholder}
          readOnly
          disabled={readOnly || collapseState === "locked"}
          className={alignmentClassMap[alignment]}
        />
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
  const [error, setError] = useState(false);
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
    useCurrentDateTime,
  } = getProperties(instance.properties);
  const [value, setValue] = useState(
    defaultValue || (useCurrentDateTime ? getCurrentBrowserDateTime() : ""),
  );

  useEffect(() => {
    setError(isInvalid === true);
  }, [isInvalid]);

  useEffect(() => {
    const nextValue =
      defaultValue || (useCurrentDateTime ? getCurrentBrowserDateTime() : "");
    setValue(nextValue);

    if (submitValue && useCurrentDateTime && nextValue.length > 0) {
      submitValue(elementInstance.id, nextValue);
    }
  }, [defaultValue, elementInstance.id, submitValue, useCurrentDateTime]);

  if (!visible) {
    return null;
  }

  return (
    <div className={getWrapperClassName(alignment, indent)}>
      {showTitle && (
        <Label
          className={cn(alignmentClassMap[alignment], error && "text-red-500")}
        >
          {label}
          {required ? "*" : ""}
        </Label>
      )}
      {collapseState !== "collapsed" && (
        <DateTimePicker
          value={useCurrentDateTime ? getCurrentBrowserDateTime() : value}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={collapseState === "locked"}
          invalid={error}
          className={alignmentClassMap[alignment]}
          onChange={(nextValue) => {
            setValue(nextValue);

            if (!submitValue || readOnly || collapseState === "locked") {
              return;
            }

            const valid = DateTimeFieldFormElement.validate(
              elementInstance,
              nextValue,
            );
            setError(!valid);
            if (!valid) {
              return;
            }

            submitValue(elementInstance.id, nextValue);
          }}
        />
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
              name="label"
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
                    Displayed above the date and time field.
                  </FormDescription>
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
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter" &&
                          (event.ctrlKey || event.metaKey)
                        ) {
                          event.currentTarget.blur();
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Displayed below the date and time field.
                  </FormDescription>
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
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.currentTarget.blur();
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Shown when the field is not auto-filled.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="useCurrentDateTime"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Use current browser date and time</FormLabel>
                    <FormDescription>
                      Automatically capture the visitor's current local date and time in the browser.
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
              name="required"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Required</FormLabel>
                    <FormDescription>
                      Require a date and time before the form can be submitted.
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

            <FormField
              control={form.control}
              name="readOnly"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Read-only</FormLabel>
                    <FormDescription>
                      Display the date and time without allowing edits.
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

            <FormField
              control={form.control}
              name="showTitle"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Show title</FormLabel>
                    <FormDescription>
                      Render the title above the field.
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

            <FormField
              control={form.control}
              name="showDescription"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Show description</FormLabel>
                    <FormDescription>
                      Render the description below the field.
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
                  <FormDescription>
                    Control whether the field is shown, hidden, or locked.
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
                  <FormDescription>
                    Align the title, date-time input, and description.
                  </FormDescription>
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
                  <FormDescription>
                    Offset the field from the left edge of the layout.
                  </FormDescription>
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
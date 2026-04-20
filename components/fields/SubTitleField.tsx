"use client";

import {
  ElementsType,
  FormElement,
  FormElementInstance,
} from "../FormElements";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import useDesigner from "../hooks/useDesigner";
const properties = {
  title: "SubTitle Field",
};

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { LuHeading2 } from "react-icons/lu";

const propertiesSchema = z.object({
  title: z.string().min(2).max(50),
});

const type: ElementsType = "SubTitleField";
export const SubTitleFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    properties,
  }),
  designerBtnElement: {
    icon: LuHeading2,
    label: "SubTitle Field",
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
  const { title } = instance.properties;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground">SubTitle field</Label>
      <p className="text-lg">{title}</p>
    </div>
  );
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const instance = elementInstance as CustomInstance;

  const { title } = instance.properties;
  return <p className="text-lg">{title}</p>;
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
    },
  });

  useEffect(() => {
    form.reset(instance.properties);
  }, [instance, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { title } = values;
    updateElement(instance.id, {
      ...instance,
      properties: {
        ...instance.properties,
        title,
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

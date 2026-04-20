import { CheckboxFieldFormElement } from "./fields/CheckboxField";
import { ImageFieldFormElement } from "./fields/ImageField";
import { NumberFieldFormElement } from "./fields/NumberField";
import { ParagraphFieldFormElement } from "./fields/ParagraphField";
import { SeparatorFieldFormElement } from "./fields/SeparatorField";
import { SpacerFieldFormElement } from "./fields/SpacerField";
import { SubTitleFieldFormElement } from "./fields/SubTitleField";
import { TextAreaFieldFormElement } from "./fields/TextAreaField";
import { TextFieldFormElement } from "./fields/TextField";
import { TitleFieldFormElement } from "./fields/TitleField";

export type DefaultElementsType =
  | "CheckboxField"
  | "ImageField"
  | "TextField"
  | "TitleField"
  | "SubTitleField"
  | "ParagraphField"
  | "SeparatorField"
  | "SpacerField"
  | "NumberField"
  | "TextAreaField";

export type ElementsType = DefaultElementsType | (string & {});

export type SubmitFunction = (key: string, value: string) => void;
export type FormElement = {
  type: ElementsType;

  construct: (id: string) => FormElementInstance;
  designerBtnElement: {
    icon: React.ElementType;
    label: string;
  };

  designerComponent: React.FC<{
    elementInstance: FormElementInstance;
  }>;
  formComponent: React.FC<{
    elementInstance: FormElementInstance;
    submitValue?: SubmitFunction;
    isInvalid?: boolean;
    defaultValue?: string;
  }>;
  propertiesComponent: React.FC<{
    elementInstance: FormElementInstance;
  }>;

  validate: (formElement: FormElementInstance, currentValue: string) => boolean;
};

export type FormElementInstance = {
  id: string;
  type: ElementsType;
  properties: Record<string, unknown>;
};

export type FormElementsRegistry = {
  [key: string]: FormElement;
};

export type FormElementSidebarGroup = {
  label: string;
  elementTypes: ElementsType[];
};

const defaultFormElements: FormElementsRegistry = {
  CheckboxField: CheckboxFieldFormElement,
  ImageField: ImageFieldFormElement,
  TextField: TextFieldFormElement,
  TitleField: TitleFieldFormElement,
  SubTitleField: SubTitleFieldFormElement,
  ParagraphField: ParagraphFieldFormElement,
  SeparatorField: SeparatorFieldFormElement,
  SpacerField: SpacerFieldFormElement,
  NumberField: NumberFieldFormElement,
  TextAreaField: TextAreaFieldFormElement,
};

export const defaultFormElementSidebarGroups: FormElementSidebarGroup[] = [
  {
    label: "Layout elements",
    elementTypes: [
      "TitleField",
      "SubTitleField",
      "ParagraphField",
      "SeparatorField",
      "SpacerField",
    ],
  },
  {
    label: "Media elements",
    elementTypes: ["ImageField"],
  },
  {
    label: "Form elements",
    elementTypes: ["TextField", "NumberField", "TextAreaField", "CheckboxField"],
  },
];

export function createFormElementRegistry(
  customElements: FormElement[] = [],
): FormElementsRegistry {
  const registry: FormElementsRegistry = { ...defaultFormElements };

  customElements.forEach((element) => {
    registry[element.type] = element;
  });

  return registry;
}

export function getFormElement(
  registry: FormElementsRegistry,
  type: ElementsType,
): FormElement {
  const formElement = registry[type];

  if (!formElement) {
    throw new Error(`Unsupported form element type: ${type}`);
  }

  return formElement;
}

export const FormElements = createFormElementRegistry();

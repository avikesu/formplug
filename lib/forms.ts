import type { FormElementInstance } from "@/components/FormElements";
import {
  defaultFormBuilderSettings,
  FormBuilderSettings,
  normalizeFormBuilderSettings,
} from "@/lib/form-builder-settings";
import {
  createDefaultFormPage,
  flattenPageElements,
  FormPageDocument,
  normalizeFormPageDocument,
} from "@/lib/form-pages";

export type SerializedFormRecord = {
  id: number;
  name: string | null;
  description: string;
  published: boolean;
  shareURL: string;
  content: string;
};

export type FormBuilderDocument = {
  id: number;
  name: string | null;
  description: string;
  published: boolean;
  shareURL: string;
  settings: FormBuilderSettings;
  pages: FormPageDocument[];
};

export type FormBuilderContentDocument = {
  version: 1;
  settings: FormBuilderSettings;
  pages: FormPageDocument[];
};

export type FormSubmissionValues = Record<string, string>;

export type SaveFormContentHandler = (
  id: number,
  document: Pick<FormBuilderDocument, "settings" | "pages">,
) => Promise<unknown>;

export type PublishFormHandler = (id: number) => Promise<unknown>;

export type SubmitFormHandler = (
  formUrl: string,
  values: FormSubmissionValues,
) => Promise<unknown>;

export type FormBuilderPersistenceAdapter = {
  save: SaveFormContentHandler;
  publish: PublishFormHandler;
};

export function coerceFormContentDocument(
  parsedContent: unknown,
): FormBuilderContentDocument {
  if (Array.isArray(parsedContent)) {
    return {
      version: 1,
      settings: defaultFormBuilderSettings,
      pages: [
        {
          ...createDefaultFormPage(0),
          elements: parsedContent as FormElementInstance[],
        },
      ],
    };
  }

  if (!parsedContent || typeof parsedContent !== "object") {
    return {
      version: 1,
      settings: defaultFormBuilderSettings,
      pages: [createDefaultFormPage(0)],
    };
  }

  const contentDocument = parsedContent as {
    settings?: unknown;
    elements?: unknown;
    pages?: unknown;
  };

  if (Array.isArray(contentDocument.pages)) {
    const pages = contentDocument.pages.map((page, index) =>
      normalizeFormPageDocument(page, index),
    );

    return {
      version: 1,
      settings: normalizeFormBuilderSettings(contentDocument.settings),
      pages: pages.length > 0 ? pages : [createDefaultFormPage(0)],
    };
  }

  const legacyElements = Array.isArray(contentDocument.elements)
    ? (contentDocument.elements as FormElementInstance[])
    : [];

  return {
    version: 1,
    settings: normalizeFormBuilderSettings(contentDocument.settings),
    pages: [
      {
        ...createDefaultFormPage(0),
        elements: legacyElements,
      },
    ],
  };
}

export function parseFormContentDocument(
  content: string,
): FormBuilderContentDocument {
  try {
    return coerceFormContentDocument(JSON.parse(content) as unknown);
  } catch {
    return {
      version: 1,
      settings: defaultFormBuilderSettings,
      pages: [createDefaultFormPage(0)],
    };
  }
}

export function parseFormElements(content: string): FormElementInstance[] {
  return flattenPageElements(parseFormContentDocument(content).pages);
}

export function serializeFormElements(elements: FormElementInstance[]): string {
  return JSON.stringify(elements);
}

export function serializeFormContentDocument(
  document: Pick<FormBuilderDocument, "settings" | "pages">,
): string {
  return JSON.stringify({
    version: 1,
    settings: document.settings,
    pages: document.pages,
  });
}

export function deserializeFormDocument(
  form: SerializedFormRecord,
): FormBuilderDocument {
  const contentDocument = parseFormContentDocument(form.content);

  return {
    id: form.id,
    name: form.name,
    description: form.description,
    published: form.published,
    shareURL: form.shareURL,
    settings: contentDocument.settings,
    pages: contentDocument.pages,
  };
}

export function parseSubmissionValues(content: string): FormSubmissionValues {
  try {
    const parsedContent = JSON.parse(content);
    if (!parsedContent || typeof parsedContent !== "object") {
      return {};
    }

    return Object.entries(parsedContent).reduce<FormSubmissionValues>(
      (values, [key, value]) => {
        values[key] = typeof value === "string" ? value : String(value ?? "");
        return values;
      },
      {},
    );
  } catch {
    return {};
  }
}

export function serializeSubmissionValues(
  values: FormSubmissionValues,
): string {
  return JSON.stringify(values);
}

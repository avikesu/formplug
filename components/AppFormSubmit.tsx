"use client";

import { submitFormResponse } from "@/lib/form-app-adapters";
import FormSubmitComponent from "./FormSubmitComponent";
import { FormBuilderSettings } from "@/lib/form-builder-settings";
import { FormPageDocument } from "@/lib/form-pages";

function AppFormSubmit({
  formUrl,
  pages,
  formName,
  formDescription,
  settings,
  previewMode,
}: {
  formUrl: string;
  pages: FormPageDocument[];
  formName?: string | null;
  formDescription?: string;
  settings?: FormBuilderSettings;
  previewMode?: boolean;
}) {
  return (
    <FormSubmitComponent
      formUrl={formUrl}
      pages={pages}
      formName={formName}
      formDescription={formDescription}
      settings={settings}
      previewMode={previewMode}
      onSubmit={submitFormResponse}
    />
  );
}

export default AppFormSubmit;

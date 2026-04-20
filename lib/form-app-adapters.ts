import { PublishForm, SubmitForm, UpdateFormContent } from "@/actions/form";
import {
  FormBuilderPersistenceAdapter,
  FormBuilderDocument,
  FormSubmissionValues,
  SubmitFormHandler,
  serializeFormContentDocument,
  serializeSubmissionValues,
} from "@/lib/forms";

async function saveFormContent(
  id: number,
  document: Pick<FormBuilderDocument, "settings" | "pages">,
) {
  return UpdateFormContent(id, serializeFormContentDocument(document));
}

async function publishForm(id: number) {
  return PublishForm(id);
}

export const appFormBuilderAdapter: FormBuilderPersistenceAdapter = {
  save: saveFormContent,
  publish: publishForm,
};

export const submitFormResponse: SubmitFormHandler = async (
  formUrl: string,
  values: FormSubmissionValues,
) => {
  return SubmitForm(formUrl, serializeSubmissionValues(values));
};

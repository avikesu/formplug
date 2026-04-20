import { GetFormById } from "@/actions/form";
import AppFormBuilder from "@/components/AppFormBuilder";
import { deserializeFormDocument } from "@/lib/forms";

async function BuilderPage(props: { params: Promise<{ id: string }> }) {
  //throw new Error('Test error page');
  const { id } = await props.params;

  if (!id) {
    throw new Error("Missing route param");
  }
  const formId = Number(id);
  if (Number.isNaN(formId)) {
    throw new Error(`Invalid route param: ${formId}`);
  }
  const form = await GetFormById(formId);
  if (!form) {
    throw new Error("Form not found");
  }
  return <AppFormBuilder form={deserializeFormDocument(form)} />;
}

export default BuilderPage;

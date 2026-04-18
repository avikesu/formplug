import { GetFormContentByUrl } from "@/actions/form";
import { FormElementInstance } from "@/components/FormElements";
import FormSubmitComponent from "@/components/FormSubmitComponent";

async function SubmitPage({
  params,
}: {
  params: Promise<{
    formUrl: string;
  }>;
}) {
  const { formUrl } = await params;
  const form = await GetFormContentByUrl(formUrl);

  if (!form) {
    throw new Error("Form not found");
  }
  const formContent = JSON.parse(form.content) as FormElementInstance[];
  return <FormSubmitComponent formUrl={formUrl} content={formContent} />;
}

export default SubmitPage;

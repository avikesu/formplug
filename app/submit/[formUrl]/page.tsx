import { GetFormContentByUrl } from "@/actions/form";
import AppFormSubmit from "@/components/AppFormSubmit";
import { parseFormContentDocument } from "@/lib/forms";

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
  const contentDocument = parseFormContentDocument(form.content);

  return (
    <AppFormSubmit
      formUrl={formUrl}
      formName={form.name}
      formDescription={form.description}
      settings={contentDocument.settings}
      pages={contentDocument.pages}
    />
  );
}

export default SubmitPage;

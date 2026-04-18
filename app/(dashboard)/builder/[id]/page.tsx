import { GetFormById } from '@/actions/form';
import FormBuilder from '@/components/FormBuilder';


async function BuilderPage(props: {
  params: Promise<{ id: string }>
}) {
  //throw new Error('Test error page');
  const { id } = await props.params;

  if (!id) {
  throw new Error('Missing route param');
}
const formId = Number(id);
if (Number.isNaN(formId)) {
  throw new Error(`Invalid route param: ${formId}`);
}
  const form = await GetFormById(formId);
  if (!form) {
    throw new Error('Form not found');
  }
  return <FormBuilder form={form} />;
}

export default BuilderPage;

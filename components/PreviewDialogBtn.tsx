import { Button } from "./ui/button";
import { MdPreview } from "react-icons/md";
import useDesigner from "./hooks/useDesigner";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { getFormElement } from "./FormElements";
import { useFormElements } from "./context/FormElementsContext";

function PreviewDialogBtn() {
  const { elements } = useDesigner();
  const { registry } = useFormElements();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="gap-2">
          <MdPreview className="h-6 w-6" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-h-screen max-w-full flex flex-col grow p-0 gap-0">
        <div className="px-4 py-2 border-b">
          <DialogTitle className="text-lg font-bold text-muted-foreground">
            Form Preview
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            This is how your form will look like.
          </p>
        </div>
        <div className="bg-accent flex flex-col grow items-center justify-center p-4 bg-[url(/arangeboard.svg)] dark:bg-[url(/arangeboard-dark.svg)] overflow-y-auto">
          <div className="max-w-[620px] flex flex-col gap-4 grow bg-background h-full w-full rounded-2xl p-8 overflow-y-auto">
            {elements.map((element) => {
              const FormComponent = getFormElement(
                registry,
                element.type,
              ).formComponent;
              return (
                <FormComponent key={element.id} elementInstance={element} />
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PreviewDialogBtn;

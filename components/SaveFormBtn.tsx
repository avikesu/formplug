import { useTransition } from "react";
import { Button } from "./ui/button";
import { HiSaveAs } from "react-icons/hi";
import useDesigner from "./hooks/useDesigner";
import { toast } from "sonner";
import { FaSpinner } from "react-icons/fa";
import { SaveFormContentHandler } from "@/lib/forms";

function SaveFormBtn({
  id,
  onSave,
}: {
  id: number;
  onSave: SaveFormContentHandler;
}) {
  const { pages, settings } = useDesigner();
  const [loading, startTransition] = useTransition();

  const updateFormContent = async () => {
    try {
      await onSave(id, { pages, settings });
      toast.success("Form saved successfully");
    } catch {
      toast.error("Error", {
        description: "Failed to save form",
      });
    }
  };
  return (
    <Button
      variant={"outline"}
      className="gap-2"
      disabled={loading}
      onClick={() => startTransition(() => updateFormContent())}
    >
      <HiSaveAs className="h-6 w-6" />
      Save
      {loading && <FaSpinner className="animate-spin" />}
    </Button>
  );
}

export default SaveFormBtn;

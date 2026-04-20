import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { MdOutlinePublish } from "react-icons/md";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogAction,
} from "./ui/alert-dialog";
import { FaIcons } from "react-icons/fa";
import { PublishFormHandler } from "@/lib/forms";
import { useRouter } from "next/navigation";

function PublishFormBtn({
  id,
  onPublish,
}: {
  id: number;
  onPublish: PublishFormHandler;
}) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  async function publishForm() {
    try {
      await onPublish(id);
      toast.success("Form published to be used in public successfully");
      router.refresh();
    } catch {
      toast.error("Error", {
        description: "Failed to publish form",
      });
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="gap-2 text-white bg-linear-to-r from-indigo-400 to-cyan-400">
          <MdOutlinePublish className="h-4 w-4" />
          Publish
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to publish this form?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Once published, your form will be live and accessible to anyone with
            the link. You will not be able to edit this form.
            <br />
            <span className="font-medium">
              By publishing this form you will make it available to the public
              and you will be able to collect submissions.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              startTransition(publishForm);
            }}
          >
            Proceed {loading && <FaIcons className="animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default PublishFormBtn;

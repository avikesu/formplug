"use client";

import { appFormBuilderAdapter } from "@/lib/form-app-adapters";
import { FormBuilderDocument } from "@/lib/forms";
import FormBuilder from "./FormBuilder";
import SaveFormBtn from "./SaveFormBtn";
import PublishFormBtn from "./PublishFormBtn";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import Confetti from "react-confetti";

function PublishedFormView({ form }: { form: FormBuilderDocument }) {
  const shareUrl = `${window.location.origin}/submit/${form.shareURL}`;

  return (
    <>
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={900}
      />
      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="max-w-md">
          <h1 className="text-center text-4xl font-bold text-primary border-b pb-2 mb-10">
            🎊Form Published🎊
          </h1>
          <h2 className="text-2xl">Share this form</h2>
          <h3 className="text-xl text-muted-foreground border-b pb-10">
            Anyone with the link can view and submit the form
          </h3>
          <div className="my-4 flex flex-col gap-2 items-center w-full border-b pb-4">
            <Input className="w-full" readOnly value={shareUrl} />
            <Button
              className="mt-2 w-full"
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                toast.success("Link copied to clipboard");
              }}
            >
              Copy Link
            </Button>
          </div>
          <div className="flex justify-between">
            <Button variant={"link"} asChild>
              <Link href={"/"} className="gap-2">
                <BsArrowLeft />
                Go Back home
              </Link>
            </Button>
            <Button variant={"link"} asChild>
              <Link href={`/forms/${form.id}`} className="gap-2">
                Form Details
                <BsArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function AppFormBuilder({ form }: { form: FormBuilderDocument }) {
  return (
    <FormBuilder
      form={form}
      toolbar={
        <>
          {!form.published && (
            <>
              <SaveFormBtn id={form.id} onSave={appFormBuilderAdapter.save} />
              <PublishFormBtn
                id={form.id}
                onPublish={appFormBuilderAdapter.publish}
              />
            </>
          )}
        </>
      }
      publishedView={<PublishedFormView form={form} />}
    />
  );
}

export default AppFormBuilder;

"use client";
import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ImShare } from "react-icons/im";
import { toast } from "sonner";

function FormLinkShare({ shareUrl }: { shareUrl: string }) {
  if (typeof window === "undefined") return null;

  const shareLink = `${window.location.origin}/submit/${shareUrl}`;
  return (
    <div className="flex grow gap-4 items-center">
      <Input value={shareLink} readOnly />
      <Button
        className="w-[250px]"
        onClick={() => {
          navigator.clipboard.writeText(shareLink);
          toast.success("Share link copied to clipboard");
        }}
      >
        <ImShare className="mr-2 h-4 w-4" />
        Share link
      </Button>
    </div>
  );
}

export default FormLinkShare;

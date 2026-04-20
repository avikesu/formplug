"use client";
import React from "react";
import { Button } from "./ui/button";

function VisitBtn({ shareUrl }: { shareUrl: string }) {
  if (typeof window === "undefined") return null;

  const shareLink = `${window.location.origin}/submit/${shareUrl}`;
  return (
    <Button
      className="w-[200px]"
      onClick={() => {
        window.open(shareLink, "_blank");
      }}
    >
      Visit
    </Button>
  );
}

export default VisitBtn;

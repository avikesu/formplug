import { EyeOff } from "lucide-react";

export default function HiddenDesignerIndicator() {
  return (
    <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full border border-red-300 bg-slate-100/95 px-2.5 py-1 text-xs font-medium text-red-700 shadow-sm">
      <EyeOff className="size-3.5" />
      <span>Hidden</span>
    </div>
  );
}
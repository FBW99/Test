import type { LucideIcon } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E5E5DC] bg-white px-6 py-12 text-center dark:border-[#243329] dark:bg-[#121A15]">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-[#F2F2EA] text-[#166534] dark:bg-[#18231C] dark:text-[#4ADE80]">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="font-display text-base font-semibold text-[#1F2937] dark:text-[#F1F5F2]">
        {title}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm text-[#4B5563] dark:text-[#B4C2B9]">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-5" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

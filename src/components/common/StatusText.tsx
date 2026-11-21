import {
  AlertCircle,
  CheckCircle2,
  Clock,
  PackageCheck,
  Truck,
  XCircle,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

type Tone = "success" | "warning" | "danger" | "neutral" | "info";

function getToneForStatus(status: string): Tone {
  const s = status.toLowerCase();
  if (
    s.includes("delivered") ||
    s.includes("approved") ||
    s === "active" ||
    s === "resolved" ||
    s === "ready for pickup" ||
    s === "completed"
  ) {
    return "success";
  }
  if (
    s.includes("pending") ||
    s.includes("preparing") ||
    s.includes("awaiting") ||
    s.includes("assigned") ||
    s.includes("placed") ||
    s === "open"
  ) {
    return "warning";
  }
  if (
    s.includes("transit") ||
    s.includes("delivery") ||
    s.includes("picked") ||
    s.includes("confirmed") ||
    s.includes("accepted")
  ) {
    return "info";
  }
  if (
    s.includes("reject") ||
    s.includes("cancel") ||
    s.includes("fail") ||
    s.includes("suspend")
  ) {
    return "danger";
  }
  return "neutral";
}

export function StatusText({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const tone = getToneForStatus(status);

  const colorClasses: Record<Tone, string> = {
    success: "text-[#166534] dark:text-[#4ADE80]",
    warning: "text-[#B45309] dark:text-[#FBBF24]",
    info: "text-[#0F766E] dark:text-[#2DD4BF]",
    danger: "text-[#B91C1C] dark:text-[#F87171]",
    neutral: "text-[#4B5563] dark:text-[#B4C2B9]",
  };

  const Icon =
    tone === "success"
      ? status.toLowerCase().includes("ready")
        ? PackageCheck
        : CheckCircle2
      : tone === "info"
        ? Truck
        : tone === "warning"
          ? Clock
          : tone === "danger"
            ? XCircle
            : AlertCircle;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap",
        colorClasses[tone],
        className
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
}

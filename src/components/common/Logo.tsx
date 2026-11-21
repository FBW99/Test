import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface LogoProps {
  to?: string;
  className?: string;
}

export function Logo({ to = "/", className }: LogoProps) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex items-center gap-2 font-display text-lg font-bold tracking-tight text-[#166534] dark:text-[#4ADE80] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] dark:focus-visible:ring-[#4ADE80] rounded-md",
        className
      )}
    >
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#166534] dark:bg-[#15803D] text-white shrink-0">
        <Leaf className="h-4 w-4" aria-hidden="true" />
      </span>
      <span>HERBIZ</span>
    </Link>
  );
}

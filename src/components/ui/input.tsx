import * as React from "react";
import { cn } from "@/src/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-[#E5E5DC] bg-white px-3.5 py-2 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] focus-visible:border-[#166534] dark:border-[#243329] dark:bg-[#0F1612] dark:text-[#F1F5F2] dark:placeholder:text-[#6E7E74] dark:focus-visible:ring-[#4ADE80] dark:focus-visible:border-[#4ADE80] disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

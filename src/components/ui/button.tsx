import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#166534] text-white hover:bg-[#14532D] shadow-xs",
        secondary:
          "bg-[#F2F2EA] text-[#1F2937] hover:bg-[#E5E5DC]",
        outline:
          "border border-[#E5E5DC] bg-white text-[#1F2937] hover:bg-[#FAFAF5] hover:border-[#166534]/40",
        ghost:
          "text-[#1F2937] hover:bg-[#F2F2EA]",
        amber:
          "bg-[#F59E0B] text-white hover:bg-[#D97706] shadow-xs",
        destructive:
          "bg-[#DC2626] text-white hover:bg-[#B91C1C]",
        link: "text-[#166534] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/src/context/ThemeContext";
import { cn } from "@/src/lib/utils";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to night mode"}
      title={isDark ? "Day Mode" : "Night Mode"}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#E5E5DC] bg-white px-2.5 text-sm font-medium text-[#4B5563] hover:bg-[#F2F2EA] hover:text-[#1F2937] dark:border-[#243329] dark:bg-[#121A15] dark:text-[#B4C2B9] dark:hover:bg-[#18231C] dark:hover:text-[#F1F5F2] transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] dark:focus-visible:ring-[#4ADE80]",
        className
      )}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-[#FBBF24] shrink-0" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4 text-[#166534] shrink-0" aria-hidden="true" />
      )}
      {showLabel && (
        <span className="text-xs font-medium">
          {isDark ? "Day Mode" : "Night Mode"}
        </span>
      )}
    </button>
  );
}

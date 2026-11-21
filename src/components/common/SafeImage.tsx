import { useState } from "react";
import { Package } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function SafeImage({
  src,
  alt,
  className,
  fallbackTitle,
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 bg-[#F2F2EA] text-[#4B5563] p-4 text-center",
          className
        )}
      >
        <Package className="h-7 w-7 text-[#166534]/70" aria-hidden="true" />
        <span className="text-xs font-medium line-clamp-2 max-w-[180px]">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
    />
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  fallback?: string | React.ReactNode;
}

const SIZE_CLASSES = {
  sm: "w-7 h-7 md:w-8 md:h-8",
  md: "w-8 h-8 md:w-10 md:h-10",
  lg: "w-16 h-16",
} as const;

const FALLBACK_TEXT_SIZE = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-2xl",
} as const;

export function Avatar({ src, alt, size = "sm", className, fallback = "AI" }: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={cn(
        "rounded-full overflow-hidden chatbot-avatar-bg ring-2 ring-cyan-400/30 flex items-center justify-center flex-shrink-0",
        SIZE_CLASSES[size],
        className
      )}
    >
      {!hasError ? (
        <Image
          src={src}
          alt={alt}
          width={size === "lg" ? 64 : size === "md" ? 40 : 32}
          height={size === "lg" ? 64 : size === "md" ? 40 : 32}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className={cn("w-full h-full flex items-center justify-center text-white font-bold", FALLBACK_TEXT_SIZE[size])}>
          {typeof fallback === "string" ? fallback : fallback}
        </div>
      )}
    </div>
  );
}


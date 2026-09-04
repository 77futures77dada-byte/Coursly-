import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Use on every async screen — never show a blank while data loads. */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-surface-muted", className)}
      {...props}
    />
  );
}

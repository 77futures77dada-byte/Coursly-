import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  // shine: a diagonal highlight sweep on hover (see .shine in globals.css) —
  // the indigo fill underneath is unchanged, this is a light reflection on top.
  primary: "shine bg-accent text-accent-fg hover:opacity-90 shadow-xs",
  // frost: translucent glass instead of a solid panel, glow appears only on
  // hover (not at rest — that stays for the one standout CTA using .glow-accent).
  secondary:
    "glow-accent-hover bg-glass/10 text-text border border-glass/15 backdrop-blur hover:bg-glass/20",
  ghost: "glow-accent-hover text-text-muted hover:bg-glass/10 hover:text-text",
  danger: "bg-danger text-white hover:opacity-90",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

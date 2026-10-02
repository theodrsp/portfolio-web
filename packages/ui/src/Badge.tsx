import type { HTMLAttributes } from "react";

type Variant = "default" | "gold" | "success" | "warning" | "danger";

const variants: Record<Variant, string> = {
  default: "bg-yoru-light text-mist",
  gold: "border border-maya/40 text-maya",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
};

type Props = HTMLAttributes<HTMLSpanElement> & { variant?: Variant };

export function Badge({ variant = "default", className = "", ...props }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
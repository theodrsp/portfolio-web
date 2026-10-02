import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-torii text-washi hover:bg-vermilion",
  secondary: "bg-yoru-light text-washi border border-line hover:border-maya",
  ghost: "text-mist hover:text-washi hover:bg-yoru-light",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

export function Button({
  variant = "primary",
  type = "button",
  className = "",
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maya disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
import type { InputHTMLAttributes } from "react";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-lg border border-line bg-yoru px-4 py-2.5 text-sm text-washi placeholder:text-mist/60 focus:border-maya focus:outline-none ${className}`}
      {...props}
    />
  );
}
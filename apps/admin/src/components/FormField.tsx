import type { ReactNode } from "react";

type Props = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export function FormField({ label, htmlFor, error, hint, children }: Props) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="text-sm">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-mist">{hint}</p>}
      {error && (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
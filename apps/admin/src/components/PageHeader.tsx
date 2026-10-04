import type { ReactNode } from "react";

type Props = { title: string; description?: string; action?: ReactNode };

export function PageHeader({ title, description, action }: Props) {
  return (
    <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-heading text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-mist">{description}</p>}
      </div>
      {action}
    </header>
  );
}
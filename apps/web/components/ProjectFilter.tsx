"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { LocalizedProject } from "@/lib/localize";
import { ProjectCard } from "@/components/ProjectCard";

export function ProjectFilter({ projects }: { projects: LocalizedProject[] }) {
  const t = useTranslations("Projects");
  const tc = useTranslations("Common");
  const [selected, setSelected] = useState<string | null>(null); // null = semua

  const tags = useMemo(
    () => Array.from(new Set(projects.flatMap((p) => p.tags))),
    [projects],
  );

  const visible = useMemo(() => {
    const list =
      selected === null ? projects : projects.filter((p) => p.tags.includes(selected));
    return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [projects, selected]);

  const chip = (active: boolean) =>
    active
      ? "inline-flex min-h-11 items-center justify-center rounded-full bg-torii px-4 py-2 text-sm text-washi"
      : "inline-flex min-h-11 items-center justify-center rounded-full border border-line px-4 py-2 text-sm text-mist hover:text-washi";

  return (
    <>
      <div role="group" aria-label={t("filterLabel")} className="mt-8 flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={selected === null}
          onClick={() => setSelected(null)}
          className={chip(selected === null)}
        >
          {tc("all")}
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            aria-pressed={selected === tag}
            onClick={() => setSelected(tag)}
            className={chip(selected === tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 text-mist">{t("empty")}</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </>
  );
}
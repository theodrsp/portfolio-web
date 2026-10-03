"use client";

import { useMemo, useState } from "react";

import { ProjectCard } from "@/components/ProjectCard";
import type { publicProjectSchema } from "@portfolio/shared";
import type { z } from "zod";

type Project = z.infer<typeof publicProjectSchema>;
const ALL = "Semua";

export function ProjectFilter({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState(ALL);

  // daftar tag unik dari semua proyek, dihitung ulang hanya bila data berubah
  const tags = useMemo(
    () => [ALL, ...Array.from(new Set(projects.flatMap((p) => p.tags)))],
    [projects],
  );

  const visible = useMemo(() => {
    const list =
      selected === ALL ? projects : projects.filter((p) => p.tags.includes(selected));
    // yang Unggulan tampil lebih dulu; sort di JS stabil, jadi urutan lain tetap
    return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [projects, selected]);

  return (
    <>
      <div role="group" aria-label="Filter proyek" className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            aria-pressed={selected === tag}
            onClick={() => setSelected(tag)}
            className={
              selected === tag
                ? "rounded-full bg-torii px-4 py-2 text-sm text-washi"
                : "rounded-full border border-line px-4 py-2 text-sm text-mist hover:text-washi"
            }
          >
            {tag}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 text-mist">Belum ada proyek untuk kategori ini.</p>
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
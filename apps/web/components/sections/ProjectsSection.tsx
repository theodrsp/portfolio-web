import { ProjectFilter } from "@/components/ProjectFilter";
import type { publicProjectSchema } from "@portfolio/shared";
import type { z } from "zod";

type Project = z.infer<typeof publicProjectSchema>;

export function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section id="proyek" className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-heading text-3xl">Proyek Aplikasi</h2>
        <p className="mt-2 text-mist">Aplikasi yang saya bangun sendiri.</p>
        <ProjectFilter projects={projects} />
      </div>
    </section>
  );
}
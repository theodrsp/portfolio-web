import Image from "next/image";
import type { publicProjectSchema } from "@portfolio/shared";
import type { z } from "zod";

type Project = z.infer<typeof publicProjectSchema>;

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-line bg-yoru">
      <div className="relative aspect-video bg-yoru-light">
        {project.coverUrl ? (
          <Image
            src={project.coverUrl}
            alt={`Tampilan proyek ${project.titleId}`}
            fill
            sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-heading text-2xl text-mist">
            {project.titleId}
          </div>
        )}
        {project.featured && (
          <span className="absolute left-3 top-3 rounded bg-torii px-2 py-1 text-xs font-medium text-washi">
            Unggulan
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-xl">{project.titleId}</h3>
        <p className="mt-2 flex-1 text-sm text-mist">{project.summaryId}</p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li key={tag} className="rounded-full border border-line px-3 py-1 text-xs text-mist">
              {tag}
            </li>
          ))}
        </ul>

        {(project.demoUrl || project.repoUrl) && (
          <div className="mt-5 flex gap-4 text-sm">
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-maya hover:underline">
                Lihat Demo
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-mist hover:text-washi">
                Kode Sumber
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
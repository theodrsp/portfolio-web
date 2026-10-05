import { ProjectFilter } from "@/components/ProjectFilter";
import { useTranslations } from "next-intl";
import type { LocalizedProject } from "@/lib/localize";

export function ProjectsSection({ projects }: { projects: LocalizedProject[] }) {
  const t = useTranslations("Projects");

  return (
    <section id="proyek" className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="reveal">
          <h2 className="font-heading text-3xl">{t("title")}</h2>
          <p className="mt-2 text-mist">{t("intro")}</p>
        </div>
        <ProjectFilter projects={projects} />
      </div>
    </section>
  );
}
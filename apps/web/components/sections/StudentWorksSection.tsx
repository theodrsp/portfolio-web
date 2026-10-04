import { StudentGallery } from "@/components/StudentGallery";
import { Suspense } from "react";
import { useTranslations } from "next-intl";
import type { LocalizedProject } from "@/lib/localize";

export function StudentWorksSection({ works }: { works: LocalizedProject[] }) {
  const t = useTranslations("StudentWorks");

  return (
    <section id="karya-murid" className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-heading text-3xl">{t("title")}</h2>
        <p className="mt-2 text-mist">{t("intro")}</p>
        {/* Suspense wajib karena galeri memakai useSearchParams */}
        <Suspense fallback={null}>
          <StudentGallery works={works} />
        </Suspense>
      </div>
    </section>
  );
}
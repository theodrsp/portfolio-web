import { StudentGallery } from "@/components/StudentGallery";
import { Suspense } from "react";
import type { publicProjectSchema } from "@portfolio/shared";
import type { z } from "zod";

type StudentWork = z.infer<typeof publicProjectSchema>;

export function StudentWorksSection({ works }: { works: StudentWork[] }) {
  return (
    <section id="karya-murid" className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-heading text-3xl">Karya Murid</h2>
        <p className="mt-2 text-mist">Hasil belajar murid-murid saya.</p>
        {/* Suspense wajib karena galeri memakai useSearchParams */}
        <Suspense fallback={null}>
          <StudentGallery works={works} />
        </Suspense>
      </div>
    </section>
  );
}
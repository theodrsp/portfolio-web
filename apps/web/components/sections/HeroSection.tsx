import type { skillSchema } from "@portfolio/shared";
import type { LocalizedProfile } from "@/lib/localize";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { z } from "zod";

type Skill = z.infer<typeof skillSchema>;

export function HeroSection({
  profile,
  skills,
}: {
  profile: LocalizedProfile;
  skills: Skill[];
}) {
  const t = useTranslations("Hero");
  const stats = [
    { value: profile.projectsDoneCount, label: t("statProjects") },
    { value: profile.teachingYears, label: t("statYears") },
    { value: profile.studentsTaught, label: t("statStudents") },
  ];
  const strip = skills.filter((s) => s.showInStrip);

  return (
    <section id="beranda" aria-labelledby="hero-judul" className="px-4 pb-16 pt-28">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        <div>
          <h1 id="hero-judul" className="font-heading text-4xl text-washi md:text-5xl">{profile.nameDisplay}</h1>
          <p className="mt-3 text-lg text-mist">{profile.headline}</p>

          <dl className="mt-8 grid grid-cols-3 gap-4 animate-fade-up" style={{ animationDelay: "150ms" }}>
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="text-sm text-mist">{s.label}</dt>
                <dd className="font-heading text-3xl text-maya">{s.value}+</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex gap-3 animate-fade-up" style={{ animationDelay: "300ms" }}>
            <a href="#proyek" className="rounded bg-torii px-5 py-3 text-washi transition hover:bg-vermilion hover:text-kage">
              {t("ctaProjects")}
            </a>
            <a href="#kontak" className="rounded border border-line px-5 py-3 text-washi transition hover:bg-yoru-light">
              {t("ctaContact")}
            </a>
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg border border-line bg-yoru">
          <Image
            src="/profile-photo-png.png"
            alt={t("photoAlt", { name: profile.nameDisplay })}
            fill
            priority
            sizes="(min-width: 768px) 384px, (min-width: 420px) 384px, 100vw"
            className="object-cover object-top"
          />
        </div>
      </div>

      {/* Strip teknologi */}
      <ul className="mx-auto mt-14 flex max-w-6xl flex-wrap gap-2">
        {strip.map((s) => (
          <li key={s.id} className="rounded-full border border-line bg-yoru px-4 py-1.5 text-sm text-mist">
            {s.name}
          </li>
        ))}
      </ul>
    </section>
  );
}
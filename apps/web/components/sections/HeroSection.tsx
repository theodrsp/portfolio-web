import type { profileSchema, skillSchema } from "@portfolio/shared";

import Image from "next/image";
import type { z } from "zod";

type Profile = z.infer<typeof profileSchema>;
type Skill = z.infer<typeof skillSchema>;

export function HeroSection({
  profile,
  skills,
}: {
  profile: Profile;
  skills: Skill[];
}) {
  const stats = [
    { value: profile.projectsDoneCount, label: "Proyek selesai" },
    { value: profile.teachingYears, label: "Tahun mengajar" },
    { value: profile.studentsTaught, label: "Murid diajar" },
  ];
  const strip = skills.filter((s) => s.showInStrip);

  return (
    <section id="beranda" className="px-4 pb-16 pt-28">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        <div>
          <h1 className="font-heading text-4xl text-washi md:text-5xl">{profile.nameDisplay}</h1>
          <p className="mt-3 text-lg text-mist">{profile.headlineId}</p>

          <dl className="mt-8 grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="text-sm text-mist">{s.label}</dt>
                <dd className="font-heading text-3xl text-maya">{s.value}+</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex gap-3">
            <a href="#proyek" className="rounded bg-torii px-5 py-3 text-washi transition hover:bg-vermilion">
              Lihat Proyek
            </a>
            <a href="#kontak" className="rounded border border-line px-5 py-3 text-washi transition hover:bg-yoru-light">
              Hubungi Saya
            </a>
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg border border-line bg-yoru">
          <Image
            src="/profile-photo-png.png"
            alt={`Foto ${profile.nameDisplay}`}
            fill
            priority
            sizes="(min-width: 768px) 384px, 100vw"
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
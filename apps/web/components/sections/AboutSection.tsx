import Image from "next/image";
import type { profileSchema } from "@portfolio/shared";
import type { z } from "zod";

type Profile = z.infer<typeof profileSchema>;

export function AboutSection({ profile }: { profile: Profile }) {
  return (
    <section id="tentang" className="px-4 py-20">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_2fr]">
        <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-lg border border-line bg-yoru">
          <Image
            src="/profile-photo-png.png"
            alt={`Foto ${profile.nameDisplay}`}
            fill
            sizes="(min-width: 768px) 320px, 100vw"
            className="object-cover object-top"
          />
        </div>

        <div>
          <h2 className="font-heading text-3xl text-washi">Tentang Saya</h2>
          <p className="mt-4 leading-relaxed text-mist">{profile.bioId}</p>

          <h3 className="mt-10 font-heading text-2xl text-washi">Pengalaman Mengajar</h3>
          <p className="mt-4 leading-relaxed text-mist">{profile.teachingPhilosophyId}</p>
        </div>
      </div>
    </section>
  );
}
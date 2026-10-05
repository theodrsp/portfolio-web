import Image from "next/image";
import { useTranslations } from "next-intl";
import type { LocalizedProfile } from "@/lib/localize";

export function AboutSection({ profile }: { profile: LocalizedProfile }) {
  const t = useTranslations("About");

  return (
    <section id="tentang" className="px-4 py-20">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_2fr]">
        <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-lg border border-line bg-yoru">
          <Image
            src="/profile-photo-png.png"
            alt={t("photoAlt", { name: profile.nameDisplay })}
            fill
            sizes="(min-width: 768px) 320px, 100vw"
            className="object-cover object-top"
          />
        </div>

        <div className="reveal">
          <h2 className="font-heading text-3xl text-washi">{t("title")}</h2>
          <p className="mt-4 leading-relaxed text-mist">{profile.bio}</p>

          <h3 className="mt-10 font-heading text-2xl text-washi">{t("teaching")}</h3>
          <p className="mt-4 leading-relaxed text-mist">{profile.teachingPhilosophy}</p>
        </div>
      </div>
    </section>
  );
}
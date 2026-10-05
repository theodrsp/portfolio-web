import { ContactForm } from "./ContactForm";
import type { LocalizedProfile } from "@/lib/localize";
import { useTranslations } from "next-intl";

export function ContactSection({ profile }: { profile: LocalizedProfile }) {
  const t = useTranslations("Contact");

  // wa.me hanya menerima angka dengan kode negara, tanpa +, spasi, atau strip
  const waNumber = profile.whatsapp.replace(/\D/g, "");

  const channels = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}`, external: false },
    { label: "WhatsApp", value: profile.whatsapp, href: `https://wa.me/${waNumber}`, external: true },
    { label: "LinkedIn", value: t("openProfile"), href: profile.linkedinUrl, external: true },
    { label: "GitHub", value: t("openProfile"), href: profile.githubUrl, external: true },
  ];

  return (
    <section id="kontak" className="px-4 py-20">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
        <div>
          <h2 className="font-heading text-3xl">{t("title")}</h2>
          <p className="mt-2 text-mist">{t("intro")}</p>

          <ul className="mt-8 space-y-4">
            {channels.map((c) => (
              <li key={c.label}>
                <span className="block text-sm text-mist">{c.label}</span>
                <a
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="text-maya hover:underline"
                >
                  {c.value}
                </a>
              </li>
            ))}
          </ul>

          {profile.cvUrl && (
            <a
              href={profile.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded border border-line px-5 py-3 text-washi hover:border-torii"
            >
              {t("downloadCv")}
            </a>
          )}
        </div>

        <div>
          <h3 id="form-kontak-judul" className="font-heading text-xl">
            {t("formTitle")}
          </h3>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
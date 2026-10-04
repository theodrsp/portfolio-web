import type { z } from "zod";
import type { profileSchema } from "@portfolio/shared";

type Profile = z.infer<typeof profileSchema>;

const field =
  "mt-1 w-full rounded border border-line bg-yoru px-4 py-3 text-washi placeholder:text-mist focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maya";

export function ContactSection({ profile }: { profile: Profile }) {
  // wa.me hanya menerima angka dengan kode negara, tanpa +, spasi, atau strip
  const waNumber = profile.whatsapp.replace(/\D/g, "");

  const channels = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}`, external: false },
    { label: "WhatsApp", value: profile.whatsapp, href: `https://wa.me/${waNumber}`, external: true },
    { label: "LinkedIn", value: "Buka profil", href: profile.linkedinUrl, external: true },
    { label: "GitHub", value: "Buka profil", href: profile.githubUrl, external: true },
  ];

  return (
    <section id="kontak" className="px-4 py-20">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
        <div>
          <h2 className="font-heading text-3xl">Kontak</h2>
          <p className="mt-2 text-mist">
            Punya proyek, pertanyaan, atau ingin anak Anda belajar koding? Hubungi saya.
          </p>

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
              Unduh CV
            </a>
          )}
        </div>

        {/* Form: tampilan saja, difungsikan di Tahap 8 */}
        <form aria-labelledby="form-kontak-judul" className="space-y-4">
          <h3 id="form-kontak-judul" className="font-heading text-xl">
            Kirim pesan
          </h3>

          <div>
            <label htmlFor="nama" className="text-sm text-mist">Nama</label>
            <input id="nama" name="name" type="text" autoComplete="name" required maxLength={100} className={field} />
          </div>
          <div>
            <label htmlFor="email" className="text-sm text-mist">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required maxLength={200} className={field} />
          </div>
          <div>
            <label htmlFor="pesan" className="text-sm text-mist">Pesan</label>
            <textarea id="pesan" name="message" rows={5} required maxLength={2000} className={field} />
          </div>

          <button
            type="submit"
            disabled
            className="rounded bg-torii px-5 py-3 text-washi disabled:cursor-not-allowed disabled:opacity-50"
          >
            Kirim
          </button>
          <p className="text-sm text-mist">Pengiriman pesan segera tersedia.</p>
        </form>
      </div>
    </section>
  );
}

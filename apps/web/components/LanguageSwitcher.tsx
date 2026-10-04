"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

// nama bahasa ditulis dalam bahasanya sendiri, jadi tidak masuk kamus
const LABELS: Record<Locale, { short: string; name: string }> = {
  id: { short: "ID", name: "Bahasa Indonesia" },
  en: { short: "EN", name: "English" },
};

export function LanguageSwitcher() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname(); // tanpa awalan bahasa, misalnya "/"

  function switchTo(next: Locale) {
    if (next === locale) return;
    // bawa serta query yang ada (misalnya ?karya=slug) agar modal tetap terbuka
    const query = Object.fromEntries(new URLSearchParams(window.location.search));
    router.replace({ pathname, query }, { locale: next, scroll: false });
  }

  return (
    <div role="group" aria-label={t("language")} className="flex items-center gap-1 text-sm">
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={l === locale}
          aria-label={`${LABELS[l].short} – ${LABELS[l].name}`}
          onClick={() => switchTo(l)}
          className={
            l === locale
              ? "rounded px-3 py-2 bg-torii text-washi"
              : "rounded px-3 py-2 text-mist hover:text-washi"
          }
        >
          {LABELS[l].short}
        </button>
      ))}
    </div>
  );
}
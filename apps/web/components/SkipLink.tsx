import { useTranslations } from "next-intl";

export function SkipLink() {
  const t = useTranslations("Common");
  return (
    <a
      href="#konten"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-torii focus:px-4 focus:py-3 focus:text-washi"
    >
      {t("skipToContent")}
    </a>
  );
}

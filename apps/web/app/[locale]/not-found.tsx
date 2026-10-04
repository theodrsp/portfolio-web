import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-heading text-4xl">{t("title")}</h1>
      <p className="max-w-md text-mist">{t("description")}</p>
      <Link href="/" className="rounded bg-torii px-5 py-3 text-washi hover:opacity-90">
        {t("back")}
      </Link>
    </main>
  );
}

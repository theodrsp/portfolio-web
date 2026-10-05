import { useTranslations } from "next-intl";

export function Footer({ nameDisplay }: { nameDisplay: string }) {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-kage px-4 py-8 text-center text-sm text-mist">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p>{t("copyright", { year, name: nameDisplay })}</p>
        <p>{t("builtWith")}</p>
      </div>
    </footer>
  );
}

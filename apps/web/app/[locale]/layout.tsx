import "../globals.css";

import { Inter, Noto_Serif_JP } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SkipLink } from "@/components/SkipLink";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const notoSerifJP = Noto_Serif_JP({
  weight: ["500", "600", "700"],
  preload: false, // font Jepang besar, jangan di-preload
  variable: "--font-noto-serif-jp",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: { template: "%s | Portofolio", default: "Portofolio" },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${inter.variable} ${notoSerifJP.variable}`}>
      <body>
        <NextIntlClientProvider>
          <SkipLink />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
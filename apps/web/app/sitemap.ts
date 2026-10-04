import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL ?? "http://localhost:3000";

  const languages = {
    ...Object.fromEntries(routing.locales.map((l) => [l, `${base}/${l}`])),
    "x-default": `${base}/${routing.defaultLocale}`,
  };

  return routing.locales.map((locale) => ({
    url: `${base}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages },
  }));
}

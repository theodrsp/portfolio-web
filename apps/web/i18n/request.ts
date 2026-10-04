import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

type Messages = { [key: string]: string | Messages };

// mode periksa: bungkus setiap teks kamus dengan ⟦ ⟧
const mark = (m: Messages): Messages =>
  Object.fromEntries(
    Object.entries(m).map(([k, v]) => [k, typeof v === "string" ? `⟦${v}⟧` : mark(v)]),
  );

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const messages = (await import(`../messages/${locale}.json`)).default as Messages;

  return {
    locale,
    messages: process.env.I18N_DEBUG === "1" ? mark(messages) : messages,
  };
});
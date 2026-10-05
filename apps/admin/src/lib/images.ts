// Path lokal seed (/placeholder/...) dilayani situs publik, bukan admin
export function resolveImage(url: string): string {
  const site = (import.meta.env.VITE_SITE_URL as string | undefined) ?? "";
  return url.startsWith("/") ? `${site}${url}` : url;
}
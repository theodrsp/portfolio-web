import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // lewati api, file internal Next, dan semua file ber-titik (icon.png, sitemap.xml, dll.)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
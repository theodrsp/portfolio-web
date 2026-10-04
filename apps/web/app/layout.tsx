import "./globals.css";

import { Inter, Noto_Serif_JP } from "next/font/google";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${notoSerifJP.variable}`}>
      <body>{children}</body>
    </html>
  );
}
"use client";

import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@portfolio/ui";
import { SECTIONS } from "@/lib/sections";
import { useTranslations } from "next-intl";

export function Navbar() {
  const t = useTranslations("Nav");
  const [active, setActive] = useState<string>(SECTIONS[0].id);
  const [open, setOpen] = useState(false);

  // penanda section aktif
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // tutup menu HP dengan tombol Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const linkClass = (id: string) =>
    active === id ? "text-torii font-medium" : "text-mist hover:text-washi";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-kage/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a href="#beranda" className="flex items-center">
          <Logo />
        </a>

        {/* Desktop: menu + pengalih bahasa */}
        <div className="hidden items-center gap-6 md:flex">
          <ul className="flex gap-6 text-sm">
            {SECTIONS.map(({ id, key }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? "true" : undefined}
                  className={linkClass(id)}
                >
                  {t(key)}
                </a>
              </li>
            ))}
          </ul>
          <LanguageSwitcher />
        </div>

        {/* HP: pengalih bahasa + tombol hamburger */}
        <div className="flex items-center gap-1 md:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            className="p-2 text-washi"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            aria-expanded={open}
            aria-controls="menu-hp"
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" className="text-2xl leading-none">
              {open ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </nav>

      {/* Panel menu HP */}
      {open && (
        <ul
          id="menu-hp"
          className="border-t border-line bg-yoru px-4 py-2 md:hidden"
        >
          {SECTIONS.map(({ id, key }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={() => setOpen(false)}
                aria-current={active === id ? "true" : undefined}
                className={`block py-3 ${linkClass(id)}`}
              >
                {t(key)}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
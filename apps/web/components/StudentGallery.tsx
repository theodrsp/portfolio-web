"use client";

import { useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Image from "next/image";
import { StudentWorkModal } from "@/components/StudentWorkModal";
import type { publicProjectSchema } from "@portfolio/shared";
import type { z } from "zod";

type StudentWork = z.infer<typeof publicProjectSchema>;
const ALL = "Semua";

export function StudentGallery({ works }: { works: StudentWork[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedTool, setSelectedTool] = useState(ALL);
  const openedInApp = useRef(false); // true bila modal dibuka lewat klik, bukan tautan langsung

  const activeSlug = searchParams.get("karya");
  const activeWork = works.find((w) => w.slug === activeSlug) ?? null;

  const tools = useMemo(
    () => [ALL, ...Array.from(new Set(works.map((w) => w.tool).filter((t): t is string => !!t)))],
    [works],
  );
  const visible = selectedTool === ALL ? works : works.filter((w) => w.tool === selectedTool);

  function openWork(slug: string) {
    openedInApp.current = true;
    router.push(`${pathname}?karya=${encodeURIComponent(slug)}#karya-murid`, { scroll: false });
  }

  function closeWork() {
    if (!activeSlug) return; // sudah tertutup (mis. lewat tombol Back), abaikan
    if (openedInApp.current) {
      openedInApp.current = false;
      router.back(); // kembali ke URL sebelum modal dibuka
    } else {
      // pengunjung datang dari tautan langsung: jangan back, nanti keluar dari situs
      router.replace(`${pathname}#karya-murid`, { scroll: false });
    }
  }

  return (
    <>
      <div role="group" aria-label="Filter karya murid" className="mt-8 flex flex-wrap gap-2">
        {tools.map((tool) => (
          <button
            key={tool}
            type="button"
            aria-pressed={selectedTool === tool}
            onClick={() => setSelectedTool(tool)}
            className={
              selectedTool === tool
                ? "rounded-full bg-torii px-4 py-2 text-sm text-washi"
                : "rounded-full border border-line px-4 py-2 text-sm text-mist hover:text-washi"
            }
          >
            {tool}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 text-mist">Belum ada karya untuk kategori ini.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => openWork(w.slug)}
              className="overflow-hidden rounded-lg border border-line bg-yoru text-left transition hover:border-torii focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maya"
            >
              <div className="relative aspect-video bg-yoru-light">
                <Image
                  src={w.coverUrl ?? w.images[0]}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
                {w.tool && (
                  <span className="absolute left-3 top-3 rounded bg-black/70 px-2 py-1 text-xs text-washi">
                    {w.tool}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-heading text-lg">{w.titleId}</h3>
                <p className="mt-1 text-sm text-mist">
                  {w.studentDisplayName}
                  {w.studentAgeRange ? ` · ${w.studentAgeRange}` : ""}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      <StudentWorkModal work={activeWork} onClose={closeWork} />
    </>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { LocalizedProject } from "@/lib/localize";

export function StudentWorkModal({
  work,
  onClose,
}: {
  work: LocalizedProject | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // buka/tutup dialog mengikuti ada-tidaknya karya aktif (yang berasal dari URL)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (work && !dialog.open) dialog.showModal();
    else if (!work && dialog.open) dialog.close();
  }, [work]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose} // dipicu oleh Esc, tombol tutup, klik latar, maupun close() dari kode
      onClick={(e) => {
        // klik pada latar gelap (::backdrop) dianggap klik pada elemen dialog itu sendiri
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      aria-labelledby="karya-judul"
      className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-lg border border-line bg-yoru-light p-0 text-washi backdrop:bg-black/80"
    >
      {work && (
        <ModalContent
          key={work.slug} // ganti karya = state gambar aktif di-reset
          work={work}
          onCloseClick={() => dialogRef.current?.close()}
        />
      )}
    </dialog>
  );
}

function ModalContent({
  work,
  onCloseClick,
}: {
  work: LocalizedProject;
  onCloseClick: () => void;
}) {
  const t = useTranslations("StudentWorks");
  const [index, setIndex] = useState(0);
  const images = work.images.length > 0 ? work.images : work.coverUrl ? [work.coverUrl] : [];

  return (
    <div className="p-5 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          {work.tool && <p className="text-sm text-maya">{work.tool}</p>}
          <h2 id="karya-judul" className="font-heading text-2xl">
            {work.title}
          </h2>
          <p className="mt-1 text-sm text-mist">
            {work.studentDisplayName}
            {work.studentAgeRange ? ` · ${t("age", { range: work.studentAgeRange })}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={onCloseClick}
          aria-label={t("close")}
          className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded text-2xl leading-none text-mist hover:text-washi"
        >
          ✕
        </button>
      </div>

      {images.length > 0 && (
        <>
          <div className="relative mt-5 aspect-video overflow-hidden rounded bg-black">
            <Image
              src={images[index]}
              alt={t("screenshotAlt", { current: index + 1, total: images.length, title: work.title })}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-contain"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={t("viewScreenshot", { number: i + 1 })}
                  aria-current={i === index ? "true" : undefined}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden rounded border ${
                    i === index ? "border-torii" : "border-line"
                  }`}
                >
                  <Image src={src} alt="" fill sizes="96px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {work.description && (
        <p className="mt-5 whitespace-pre-line text-mist">{work.description}</p>
      )}

      {work.learningOutcomes && (
        <>
          <h3 className="mt-6 font-heading text-lg">{t("learningOutcomes")}</h3>
          <p className="mt-2 whitespace-pre-line text-mist">{work.learningOutcomes}</p>
        </>
      )}
    </div>
  );
}
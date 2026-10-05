"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { contactInputSchema } from "@portfolio/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const field =
  "mt-1 w-full rounded border border-mist/60 bg-yoru px-4 py-3 text-washi placeholder:text-mist focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maya aria-invalid:border-danger";

type Values = { name: string; email: string; message: string; website: string };
type FieldKey = "name" | "email" | "message";
type Errors = Partial<Record<FieldKey, string>>;
type Status = "idle" | "sending" | "success" | "invalid" | "rateLimited" | "error";

const EMPTY: Values = { name: "", email: "", message: "", website: "" };
const FIELD_ORDER: FieldKey[] = ["name", "email", "message"];
const FIELD_ID: Record<FieldKey, string> = { name: "nama", email: "email", message: "pesan" };
const ERROR_KEY = {
  name: "errors.name",
  email: "errors.email",
  message: "errors.message",
} as const;

export function ContactForm() {
  const t = useTranslations("Contact");
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  function onChange(key: keyof Values) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setValues((v) => ({ ...v, [key]: value }));
      if (key !== "website") setErrors((er) => ({ ...er, [key]: undefined }));
      if (status !== "sending") setStatus("idle");
    };
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const parsed = contactInputSchema.safeParse({
      name: values.name,
      email: values.email,
      message: values.message,
    });

    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if ((key === "name" || key === "email" || key === "message") && !next[key]) {
          next[key] = t(ERROR_KEY[key]);
        }
      }
      setErrors(next);
      setStatus("invalid");
      const first = FIELD_ORDER.find((k) => next[k]);
      if (first) document.getElementById(FIELD_ID[first])?.focus();
      return;
    }

    if (!API_URL) {
      setStatus("error");
      return;
    }

    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, website: values.website }),
      });
      if (res.status === 201) {
        setValues(EMPTY);
        setStatus("success");
      } else if (res.status === 429) {
        setStatus("rateLimited");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const statusText =
    status === "success"
      ? t("success")
      : status === "invalid"
        ? t("invalidForm")
        : status === "rateLimited"
          ? t("rateLimited")
          : status === "error"
            ? t("error")
            : "";

  return (
    <form
      aria-labelledby="form-kontak-judul"
      onSubmit={handleSubmit}
      noValidate
      className="mt-4 space-y-4"
    >
      <div>
        <label htmlFor="nama" className="text-sm text-mist">{t("name")}</label>
        <input
          id="nama"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={100}
          value={values.name}
          onChange={onChange("name")}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "nama-error" : undefined}
          className={field}
        />
        {errors.name && (
          <p id="nama-error" className="mt-1 text-sm text-danger">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="text-sm text-mist">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={200}
          value={values.email}
          onChange={onChange("email")}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={field}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-danger">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="pesan" className="text-sm text-mist">{t("message")}</label>
        <textarea
          id="pesan"
          name="message"
          rows={5}
          required
          maxLength={2000}
          value={values.message}
          onChange={onChange("message")}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "pesan-error" : undefined}
          className={field}
        />
        {errors.message && (
          <p id="pesan-error" className="mt-1 text-sm text-danger">{errors.message}</p>
        )}
      </div>

      {/* Honeypot: tersembunyi dari manusia dan pembaca layar, hanya bot yang mengisinya */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={onChange("website")}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        aria-busy={status === "sending"}
        className="rounded bg-torii px-5 py-3 text-washi hover:bg-vermilion hover:text-kage focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maya disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "sending" ? t("sending") : t("send")}
      </button>

      {/* Live region: hasil pengiriman diumumkan ke pembaca layar */}
      <div role="status" aria-live="polite" className="min-h-6 text-sm">
        {statusText && (
          <p className={status === "success" ? "text-success" : "text-danger"}>{statusText}</p>
        )}
      </div>

      <p className="text-sm text-mist">{t("privacy")}</p>
    </form>
  );
}
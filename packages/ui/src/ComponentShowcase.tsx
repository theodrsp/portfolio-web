import { Badge } from "./Badge";
import { Button } from "./Button";
import { Card } from "./Card";
import { Input } from "./Input";
import { Logo } from "./Logo";
import type { ReactNode } from "react";

// Class ditulis utuh supaya Tailwind menemukannya.
// Sengaja TIDAK menampilkan hex: hex hanya boleh ada di tokens.css.
const swatches = [
  { name: "kage", cls: "bg-kage" },
  { name: "yoru", cls: "bg-yoru" },
  { name: "yoru-light", cls: "bg-yoru-light" },
  { name: "line", cls: "bg-line" },
  { name: "washi", cls: "bg-washi" },
  { name: "mist", cls: "bg-mist" },
  { name: "torii", cls: "bg-torii" },
  { name: "vermilion", cls: "bg-vermilion" },
  { name: "maya", cls: "bg-maya" },
  { name: "success", cls: "bg-success" },
  { name: "warning", cls: "bg-warning" },
  { name: "danger", cls: "bg-danger" },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-heading text-2xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export function ComponentShowcase() {
  return (
    <main className="mx-auto max-w-4xl space-y-12 px-6 py-12">
      <Section title="Logo">
        <Logo />
      </Section>

      <Section title="Warna">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {swatches.map((s) => (
            <div key={s.name} className="space-y-2">
              <div className={`h-16 rounded-lg border border-line ${s.cls}`} />
              <p className="text-xs text-mist">{s.name}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Tipografi">
        <Card className="space-y-3">
          <p className="font-heading text-3xl font-semibold">
            提摩太 Timotius Theodearson
          </p>
          <p className="font-sans text-base">
            Teks isi memakai Inter. The quick brown fox jumps over the lazy dog.
          </p>
          <p className="text-sm text-mist">Teks sekunder memakai warna mist.</p>
        </Card>
      </Section>

      <Section title="Button">
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
        </div>
      </Section>

      <Section title="Badge">
        <div className="flex flex-wrap gap-3">
          <Badge>Default</Badge>
          <Badge variant="gold">Gold</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </div>
      </Section>

      <Section title="Input">
        <div className="max-w-sm space-y-3">
          <Input placeholder="Nama kamu" />
          <Input type="email" placeholder="email@contoh.com" />
        </div>
      </Section>

      <Section title="Card">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <h3 className="font-heading text-lg font-semibold">Judul kartu</h3>
            <p className="mt-2 text-sm text-mist">Isi kartu dengan teks sekunder.</p>
          </Card>
          <Card className="hover:bg-yoru-light">
            <h3 className="font-heading text-lg font-semibold">Kartu dengan hover</h3>
            <p className="mt-2 text-sm text-mist">Arahkan kursor ke sini.</p>
          </Card>
        </div>
      </Section>
    </main>
  );
}
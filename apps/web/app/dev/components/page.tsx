import { ComponentShowcase } from "@portfolio/ui";
import { notFound } from "next/navigation";

export default function ComponentsPage() {
  // Halaman uji hanya untuk development.
  if (process.env.NODE_ENV === "production") notFound();
  return <ComponentShowcase />;
}
import { PageHeader } from "../components/PageHeader";

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <PageHeader title={title} description="Halaman ini dibangun pada tahap berikutnya." />
  );
}
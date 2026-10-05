import { Link, useParams } from "react-router";
import { PROJECT_CONFIG, useProject, type ProjectType } from "../lib/projects";
import { PageHeader } from "../components/PageHeader";
import { ProjectForm } from "../components/ProjectForm";

export default function ProjectEditPage({ type }: { type: ProjectType }) {
  const cfg = PROJECT_CONFIG[type];
  const { id: idParam } = useParams();
  const isNew = idParam === undefined;
  const id = isNew ? null : Number(idParam);
  const validId = id !== null && Number.isInteger(id) && id > 0;
  const { data, isLoading, error } = useProject(validId ? id : null);

  return (
    <>
      <PageHeader
        title={isNew ? cfg.add : `Edit ${cfg.noun}`}
        action={
          <Link to={cfg.base} className="text-sm text-mist hover:text-washi">
            ← Kembali ke daftar
          </Link>
        }
      />

      {isNew && <ProjectForm type={type} />}
      {!isNew && !validId && (
        <p role="alert" className="text-danger">
          ID tidak valid.
        </p>
      )}
      {validId && isLoading && <p className="text-mist">Memuat...</p>}
      {validId && error && (
        <p role="alert" className="text-danger">
          Gagal memuat: {error.message}
        </p>
      )}
      {data && data.type !== type && (
        <p role="alert" className="text-danger">
          Data ini bukan {cfg.noun}.
        </p>
      )}
      {data && data.type === type && <ProjectForm key={data.id} type={type} project={data} />}
    </>
  );
}
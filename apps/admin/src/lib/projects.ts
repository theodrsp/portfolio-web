import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ProjectInput } from "@portfolio/shared";
import { api } from "./api";

export type ProjectType = "APP" | "STUDENT_WORK";
export type ProjectStatus = "DRAFT" | "PUBLISHED";

// Bentuk data yang dikembalikan API (semua kolom tabel Project)
export type ProjectRecord = {
  id: number;
  slug: string;
  type: ProjectType;
  titleId: string;
  titleEn: string;
  summaryId: string;
  summaryEn: string;
  descriptionId: string | null;
  descriptionEn: string | null;
  tags: string[];
  coverUrl: string | null;
  images: string[];
  demoUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
  status: ProjectStatus;
  order: number;
  tool: string | null;
  studentDisplayName: string | null;
  studentAgeRange: string | null;
  learningOutcomesId: string | null;
  learningOutcomesEn: string | null;
};

export const PROJECT_CONFIG = {
  APP: {
    base: "/projects",
    title: "Proyek Aplikasi",
    noun: "proyek",
    add: "Tambah Proyek",
    description: "Aplikasi buatan sendiri yang tampil di bagian Proyek.",
  },
  STUDENT_WORK: {
    base: "/student-works",
    title: "Karya Murid",
    noun: "karya",
    add: "Tambah Karya",
    description: "Hasil belajar murid yang tampil di bagian Karya Murid.",
  },
} as const;

export function useProjects(type: ProjectType) {
  return useQuery({
    queryKey: ["admin", "projects", type],
    queryFn: () => api.get<ProjectRecord[]>(`/api/admin/projects?type=${type}`),
  });
}

export function useProject(id: number | null) {
  return useQuery({
    queryKey: ["admin", "project", id],
    queryFn: () => api.get<ProjectRecord>(`/api/admin/projects/${id}`),
    enabled: id !== null,
  });
}

export function useSaveProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: number; data: ProjectInput }) =>
      id
        ? api.put<ProjectRecord>(`/api/admin/projects/${id}`, data)
        : api.post<ProjectRecord>("/api/admin/projects", data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "projects"] });
      void qc.invalidateQueries({ queryKey: ["admin", "project"] });
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete<void>(`/api/admin/projects/${id}`),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "projects"] });
    },
  });
}
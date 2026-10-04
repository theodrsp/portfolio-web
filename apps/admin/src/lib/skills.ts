import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { SkillInput } from "@portfolio/shared";
import { api } from "./api";

export type Skill = SkillInput & { id: number };

const KEY = ["admin", "skills"] as const;

export function useSkills() {
  return useQuery({ queryKey: KEY, queryFn: () => api.get<Skill[]>("/api/admin/skills") });
}

export function useSaveSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: number; data: SkillInput }) =>
      id
        ? api.put<Skill>(`/api/admin/skills/${id}`, data)
        : api.post<Skill>("/api/admin/skills", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete<void>(`/api/admin/skills/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
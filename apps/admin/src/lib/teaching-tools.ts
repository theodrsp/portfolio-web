import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { TeachingToolInput } from "@portfolio/shared";
import { api } from "./api";

export type TeachingTool = TeachingToolInput & { id: number };

const KEY = ["admin", "teaching-tools"] as const;

export function useTeachingTools() {
  return useQuery({ queryKey: KEY, queryFn: () => api.get<TeachingTool[]>("/api/admin/teaching-tools") });
}

export function useSaveTeachingTool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id?: number; data: TeachingToolInput }) =>
      id
        ? api.put<TeachingTool>(`/api/admin/teaching-tools/${id}`, data)
        : api.post<TeachingTool>("/api/admin/teaching-tools", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteTeachingTool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete<void>(`/api/admin/teaching-tools/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ProfileInput } from "@portfolio/shared";
import { api } from "./api";

export type Profile = ProfileInput & { id: number };

const KEY = ["admin", "profile"] as const;

export function useProfile() {
  return useQuery({ queryKey: KEY, queryFn: () => api.get<Profile>("/api/admin/profile") });
}

export function useSaveProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProfileInput) => api.put<Profile>("/api/admin/profile", data),
    onSuccess: (saved) => qc.setQueryData(KEY, saved),
  });
}
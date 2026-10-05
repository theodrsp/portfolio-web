import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "./api";

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  isRead: boolean;
};

const KEY = ["admin", "messages"] as const;

export function useMessages() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => api.get<ContactMessage[]>("/api/admin/messages"),
    refetchInterval: 60_000, // segarkan tiap menit agar pesan baru terdeteksi
  });
}

export function useSetMessageRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isRead }: { id: number; isRead: boolean }) =>
      api.patch<ContactMessage>(`/api/admin/messages/${id}`, { isRead }),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete<void>(`/api/admin/messages/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
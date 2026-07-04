import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMeApi, updateMeApi } from "@/api/me.api";
import { useAppSelector } from "@/app/store";
import type { UpdateMeRequest } from "@/types/api/me";

export function useMe() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  return useQuery({
    queryKey: ["me"],
    queryFn: getMeApi,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateMe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateMeRequest) => updateMeApi(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });
}
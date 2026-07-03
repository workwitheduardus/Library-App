import { useQuery } from "@tanstack/react-query";
import { getMeApi } from "@/api/me.api";
import { useAppSelector } from "@/app/store";

export function useMe() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  return useQuery({
    queryKey: ["me"],
    queryFn: getMeApi,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}

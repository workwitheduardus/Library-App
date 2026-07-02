import { useQuery } from "@tanstack/react-query";
import { getAdminUsersApi } from "@/api/admin.api";
import type { GetAdminUsersQuery } from "@/types/api/admin";

export function useAdminUsers(query: GetAdminUsersQuery) {
  return useQuery({
    queryKey: ["admin", "users", query],
    queryFn: () => getAdminUsersApi(query),
    placeholderData: (prev) => prev,
  });
}

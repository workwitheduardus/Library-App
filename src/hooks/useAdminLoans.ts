import { useQuery } from "@tanstack/react-query";
import { getAdminLoansApi } from "@/api/loans.api";
import type { GetAdminLoansQuery } from "@/types/api/admin";

export function useAdminLoans(query: GetAdminLoansQuery) {
  return useQuery({
    queryKey: ["admin", "loans", query],
    queryFn: () => getAdminLoansApi(query),
    placeholderData: (prev) => prev,
  });
}

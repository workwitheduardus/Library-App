import { useQuery } from "@tanstack/react-query";
import { getMyLoansApi } from "@/api/loans.api";
import type { GetMyLoansQuery } from "@/types/api/loans";

export function useMyLoans(query: GetMyLoansQuery) {
  return useQuery({
    queryKey: ["my-loans", query],
    queryFn: () => getMyLoansApi(query),
    placeholderData: (prev) => prev,
  });
}

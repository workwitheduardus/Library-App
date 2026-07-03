import { useQuery } from "@tanstack/react-query";
import { getBookDetailApi } from "@/api/books.api";

export function useBookDetail(id: number | null) {
  return useQuery({
    queryKey: ["book", id],
    queryFn: () => getBookDetailApi(id!),
    enabled: id !== null && id > 0,
    staleTime: 5 * 60 * 1000,
  });
}

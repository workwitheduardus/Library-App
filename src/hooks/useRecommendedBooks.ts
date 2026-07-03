import { useQuery } from "@tanstack/react-query";
import { getRecommendedBooksApi } from "@/api/books.api";
import type { GetRecommendedBooksQuery } from "@/types/api/books";

export function useRecommendedBooks(query: GetRecommendedBooksQuery = {}) {
  return useQuery({
    queryKey: ["books", "recommended", query],
    queryFn: () => getRecommendedBooksApi(query),
    staleTime: 5 * 60 * 1000,
  });
}

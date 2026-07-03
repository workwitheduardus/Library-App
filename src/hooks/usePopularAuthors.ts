import { useQuery } from "@tanstack/react-query";
import { getPopularAuthorsApi } from "@/api/authors.api";

export function usePopularAuthors(limit = 4) {
  return useQuery({
    queryKey: ["authors", "popular", limit],
    queryFn: () => getPopularAuthorsApi(limit),
    staleTime: 5 * 60 * 1000,
  });
}

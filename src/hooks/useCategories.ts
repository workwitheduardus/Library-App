import { useQuery } from "@tanstack/react-query";
import { getCategoriesApi } from "@/api/categories.api";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesApi,
    staleTime: 10 * 60 * 1000,
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyReviewsApi, deleteReviewApi } from "@/api/reviews.api";
import type { GetMeReviewsQuery } from "@/types/api/me";

export function useMyReviews(query: GetMeReviewsQuery = {}) {
  return useQuery({
    queryKey: ["my-reviews", query],
    queryFn: () => getMyReviewsApi(query),
    placeholderData: (prev) => prev,
  });
}

export function useDeleteMyReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteReviewApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-reviews"] }),
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBookReviewsApi,
  createReviewApi,
  deleteReviewApi,
} from "@/api/reviews.api";
import type { CreateReviewRequest } from "@/types/api/reviews";

export function useBookReviews(bookId: number, page = 1) {
  return useQuery({
    queryKey: ["reviews", bookId, page],
    queryFn: () => getBookReviewsApi(bookId, page),
    enabled: !!bookId,
  });
}

export function useCreateReview(bookId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewRequest) => createReviewApi(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews", bookId] });
      qc.invalidateQueries({ queryKey: ["book", bookId] });
    },
  });
}

export function useDeleteReview(bookId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: number) => deleteReviewApi(reviewId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews", bookId] });
    },
  });
}

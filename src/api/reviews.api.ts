import type {
  GetBookReviewsResponse,
  CreateReviewRequest,
  CreateReviewResponse,
  DeleteReviewResponse,
} from "@/types/api/reviews";
import type { ApiResponse } from "@/types/api/common";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("booky_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getBookReviewsApi(
  bookId: number,
  page = 1,
  limit = 10,
): Promise<GetBookReviewsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const res = await fetch(`${BASE_URL}/api/reviews/book/${bookId}?${params}`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  const json = (await res.json()) as ApiResponse<GetBookReviewsResponse>;
  return json.data;
}

export async function createReviewApi(
  payload: CreateReviewRequest,
): Promise<CreateReviewResponse> {
  const res = await fetch(`${BASE_URL}/api/reviews`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message ?? "Failed to submit review",
    );
  }
  const json = (await res.json()) as ApiResponse<CreateReviewResponse>;
  return json.data;
}

export async function deleteReviewApi(
  id: number,
): Promise<DeleteReviewResponse> {
  const res = await fetch(`${BASE_URL}/api/reviews/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete review");
  return res.json() as Promise<DeleteReviewResponse>;
}

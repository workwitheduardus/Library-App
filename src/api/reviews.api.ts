import type {
  GetBookReviewsResponse,
  CreateReviewRequest,
  CreateReviewResponse,
  DeleteReviewResponse,
} from "@/types/api/reviews";
import type { ApiResponse } from "@/types/api/common";
import type { GetMeReviewsQuery, GetMeReviewsResponse } from "@/types/api/me";

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

export async function getMyReviewsApi(
  query: GetMeReviewsQuery = {},
): Promise<GetMeReviewsResponse> {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));

  const token = localStorage.getItem("booky_token");
  const res = await fetch(`${BASE_URL}/api/me/reviews?${params}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch reviews");
  const json = (await res.json()) as ApiResponse<GetMeReviewsResponse>;
  return json.data;
}
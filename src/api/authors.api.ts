import type { ApiResponse } from "@/types/api/common";
import type {
  GetPopularAuthorsResponse,
  GetAuthorBooksResponse,
} from "@/types/api/authors";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export async function getPopularAuthorsApi(
  limit = 4,
): Promise<GetPopularAuthorsResponse> {
  const res = await fetch(`${BASE_URL}/api/authors/popular?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch popular authors");
  const json = (await res.json()) as ApiResponse<GetPopularAuthorsResponse>;
  return json.data;
}

export async function getAuthorBooksApi(
  authorId: number,
  page = 1,
  limit = 12,
): Promise<GetAuthorBooksResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const res = await fetch(
    `${BASE_URL}/api/authors/${authorId}/books?${params}`,
  );
  if (!res.ok) throw new Error("Author not found");
  const json = (await res.json()) as ApiResponse<GetAuthorBooksResponse>;
  return json.data;
}

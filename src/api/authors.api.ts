import type { GetPopularAuthorsResponse } from "@/types/api/authors";
import type { ApiResponse } from "@/types/api/common";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export async function getPopularAuthorsApi(
  limit = 4,
): Promise<GetPopularAuthorsResponse> {
  const res = await fetch(`${BASE_URL}/api/authors/popular?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch popular authors");
  const json = (await res.json()) as ApiResponse<GetPopularAuthorsResponse>;
  return json.data;
}

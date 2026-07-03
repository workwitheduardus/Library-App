import type { GetCategoriesResponse } from "@/types/api/categories";
import type { ApiResponse } from "@/types/api/common";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export async function getCategoriesApi(): Promise<GetCategoriesResponse> {
  const res = await fetch(`${BASE_URL}/api/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  const json = (await res.json()) as ApiResponse<GetCategoriesResponse>;
  return json.data;
}

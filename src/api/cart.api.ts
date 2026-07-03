import type { GetCartResponse } from "@/types/api/cart";
import type { ApiResponse } from "@/types/api/common";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("booky_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getCartApi(): Promise<GetCartResponse> {
  const res = await fetch(`${BASE_URL}/api/cart`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch cart");
  const json = (await res.json()) as ApiResponse<GetCartResponse>;
  return json.data;
}

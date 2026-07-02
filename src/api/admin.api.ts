import type {
  GetAdminUsersQuery,
  GetAdminUsersResponse,
} from "@/types/api/admin";
import type { ApiResponse } from "@/types/api/common";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("booky_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getAdminUsersApi(
  query: GetAdminUsersQuery,
): Promise<GetAdminUsersResponse> {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));

  const res = await fetch(`${BASE_URL}/api/admin/users?${params.toString()}`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message ?? "Failed to fetch users",
    );
  }

  const json = (await res.json()) as ApiResponse<GetAdminUsersResponse>;
  return json.data;
}

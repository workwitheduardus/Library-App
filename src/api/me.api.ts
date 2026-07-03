import type { MeProfile } from "@/types/api/me";
import type { ApiResponse } from "@/types/api/common";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("booky_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getMeApi(): Promise<MeProfile> {
  const res = await fetch(`${BASE_URL}/api/me`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  const json = (await res.json()) as ApiResponse<MeProfile>;
  return json.data;
}

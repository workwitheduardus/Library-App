import type {
  MeProfile,
  UpdateMeRequest,
  UpdateMeResponse,
} from "@/types/api/me";
import type { ApiResponse } from "@/types/api/common";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export async function getMeApi(): Promise<MeProfile> {
  const token = localStorage.getItem("booky_token");
  const res = await fetch(`${BASE_URL}/api/me`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  const json = (await res.json()) as ApiResponse<MeProfile>;
  return json.data;
}

export async function updateMeApi(
  payload: UpdateMeRequest,
): Promise<UpdateMeResponse> {
  const token = localStorage.getItem("booky_token");
  const form = new FormData();
  if (payload.name) form.append("name", payload.name);
  if (payload.phone) form.append("phone", payload.phone);
  if (payload.profilePhoto) form.append("profilePhoto", payload.profilePhoto);

  const res = await fetch(`${BASE_URL}/api/me`, {
    method: "PATCH",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message ?? "Failed to update profile",
    );
  }

  const json = (await res.json()) as ApiResponse<UpdateMeResponse>;
  return json.data;
}
import type {
  GetCartResponse,
  EmptyCartResponse,
  RemoveCartItemResponse,
} from "@/types/api/cart";
import type { ApiResponse } from "@/types/api/common";
import type {
  CreateLoansFromCartRequest,
  CreateLoansFromCartResponse,
} from "@/types/api/loans";

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

export async function removeCartItemApi(
  itemId: number,
): Promise<RemoveCartItemResponse> {
  const res = await fetch(`${BASE_URL}/api/cart/items/${itemId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to remove item");
  const json = (await res.json()) as ApiResponse<RemoveCartItemResponse>;
  return json.data;
}

export async function emptyCartApi(): Promise<EmptyCartResponse> {
  const res = await fetch(`${BASE_URL}/api/cart`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to empty cart");
  const json = (await res.json()) as ApiResponse<EmptyCartResponse>;
  return json.data;
}

export async function borrowFromCartApi(
  payload: CreateLoansFromCartRequest,
): Promise<CreateLoansFromCartResponse> {
  const res = await fetch(`${BASE_URL}/api/loans/from-cart`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message ?? "Failed to borrow books",
    );
  }
  const json = (await res.json()) as ApiResponse<CreateLoansFromCartResponse>;
  return json.data;
}
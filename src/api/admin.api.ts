import type {
  GetAdminUsersQuery,
  GetAdminUsersResponse,
} from "@/types/api/admin";
import type { ApiResponse } from "@/types/api/common";
import type {CreateBookRequest, UpdateBookRequest, Book} from "@/types/api/books";

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

export async function createBookApi(payload: CreateBookRequest): Promise<Book> {
    const token = localStorage.getItem("booky_token");
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("isbn", payload.isbn);
    formData.append("categoryId", String(payload.categoryId));
    if (payload.authorId) formData.append("authorId", String(payload.authorId));
    if (payload.authorName) formData.append("authorName", payload.authorName);
    if (payload.coverImage) formData.append("coverImage", payload.coverImage);
    if (payload.description) formData.append("description", payload.description);
    if (payload.publishedYear) formData.append("publishedYear", String(payload.publishedYear));
    if (payload.totalCopies) formData.append("totalCopies", String(payload.totalCopies));

    const res = await fetch(`${BASE_URL}/api/admin/books`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
            (err as { message?: string }).message ?? "Failed to create book",
        );
    }
    const json = (await res.json()) as ApiResponse<Book>;
    return json.data;
}

export async function updateBookApi(id: number, payload: UpdateBookRequest): Promise<Book> {
    const res = await fetch(`${BASE_URL}/api/books/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });

    if (!res.ok) { const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message ?? "Failed to update book"
    );
  }
    
    const json = (await res.json()) as ApiResponse<Book>;
    return json.data;
}
import type { BookDetail, GetBooksQuery, GetBooksResponse } from "@/types/api/books";
import type { ApiResponse } from "@/types/api/common";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("booky_token");
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getBooksApi(query: GetBooksQuery): Promise<GetBooksResponse> {
  const params = new URLSearchParams();
  if (query.q)          params.set("q",          query.q);
  if (query.categoryId) params.set("categoryId", String(query.categoryId));
  if (query.page)       params.set("page",       String(query.page));
  if (query.limit)      params.set("limit",      String(query.limit));

  const res = await fetch(`${BASE_URL}/api/books?${params}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch books");
  const json = await res.json() as ApiResponse<GetBooksResponse>;
  return json.data;
}

export async function getBookDetailApi(id: number): Promise<BookDetail> {
  const res = await fetch(`${BASE_URL}/api/books/${id}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Book not found");
  const json = await res.json() as ApiResponse<BookDetail>;
  return json.data;
}

export async function deleteBookApi(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/books/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete book");
}
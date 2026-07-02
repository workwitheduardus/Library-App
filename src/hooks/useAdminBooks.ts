import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBooksApi, getBookDetailApi, deleteBookApi } from "@/api/books.api";
import { createBookApi, updateBookApi } from "@/api/admin.api";
import type { GetBooksQuery } from "@/types/api/books";
import type { CreateBookRequest, UpdateBookRequest } from "@/types/api/books";

export function useBooks(query: GetBooksQuery) {
  return useQuery({
    queryKey: ["books", query],
    queryFn: () => getBooksApi(query),
    placeholderData: (prev) => prev,
  });
}

export function useBookDetail(id: number | null) {
  return useQuery({
    queryKey: ["book", id],
    queryFn: () => getBookDetailApi(id!),
    enabled: id !== null,
  });
}

export function useDeleteBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteBookApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["books"] }),
  });
}

export function useCreateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBookRequest) => createBookApi(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["books"] }),
  });
}

export function useUpdateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateBookRequest }) =>
      updateBookApi(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["books"] }),
  });
}
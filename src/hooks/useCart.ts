import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCartApi,
  removeCartItemApi,
  emptyCartApi,
  borrowFromCartApi,
} from "@/api/cart.api";
import { useAppSelector } from "@/app/store";
import type { CreateLoansFromCartRequest } from "@/types/api/loans";

export function useCart() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  return useQuery({
    queryKey: ["cart"],
    queryFn: getCartApi,
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: number) => removeCartItemApi(itemId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useEmptyCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: emptyCartApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useBorrowFromCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLoansFromCartRequest) =>
      borrowFromCartApi(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
}
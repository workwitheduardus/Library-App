import { useQuery } from "@tanstack/react-query";
import { getCartApi } from "@/api/cart.api";
import { useAppSelector } from "@/app/store";

export function useCart() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  return useQuery({
    queryKey: ["cart"],
    queryFn: getCartApi,
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  });
}

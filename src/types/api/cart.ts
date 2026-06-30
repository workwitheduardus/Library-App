import type { Book } from "./books";

export interface CartItem {
  id: number;
  bookId: number;
  book?: Book;
  addedAt: string;
}

export interface Cart {
  cartId: number;
  items: CartItem[];
}

export type GetCartResponse = Cart;

export type EmptyCartResponse = { message: string };

export interface CartCheckoutPreview {
  user: {
    name: string;
  };
  items: CartItem[];
}

export type GetCartCheckoutResponse = CartCheckoutPreview;

export interface AddCartItemRequest {
  bookId: number;
}

export type AddCartItemResponse = Cart;

export type RemoveCartItemResponse = { message: string };

import type { PaginatedResponse } from "./common";

export interface Review {
  id: number;
  bookId: number;
  userId: number;
  star: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  userName?: string;
}

export interface CreateReviewRequest {
  bookId: number;
  star: number;
  comment: string;
}

export type CreateReviewResponse = Review;

export interface GetBookReviewsQuery {
  page?: number;
  limit?: number;
}

export type GetBookReviewsResponse = PaginatedResponse<Review>;

export type DeleteReviewResponse = { message: string };

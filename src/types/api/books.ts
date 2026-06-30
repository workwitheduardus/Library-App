import type { BasePaginationQuery, PaginatedResponse } from './common';
import type { Author } from './authors';
import type { Category } from './categories';
import type { Review } from './reviews';

export interface Book {
  id: number;
  title: string;
  description: string;
  isbn: string;
  publishedYear: number;
  coverImage: string | null;
  rating: number;
  reviewCount: number;
  totalCopies: number;
  availableCopies: number;
  borrowCount: number;
  authorId: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookDetail extends Book {
  author: Author;
  category: Category;
  reviews: Review[];
}

export interface GetBooksQuery extends BasePaginationQuery {
  q?: string;
  categoryId?: number;
  authorId?: number;
  minRating?: number;
}

export type GetBooksResponse = PaginatedResponse<Book>;


export interface CreateBookRequest {
  title: string;
  isbn: string;
  categoryId: number;
  authorId?: number;
  authorName?: string;
  coverImage?: File;
  description?: string;
  publishedYear?: number;
  totalCopies?: number;
  availableCopies?: number;
}

export interface UpdateBookRequest {
  title?: string;
  description?: string;
  isbn?: string;
  publishedYear?: number;
  coverImage?: string;
  authorId?: number;
  authorName?: string;
  categoryId?: number;
  totalCopies?: number;
  availableCopies?: number;
}

export type RecommendSortBy = 'rating' | 'popular';

export interface GetRecommendedBooksQuery {
  by?: RecommendSortBy;
  categoryId?: number;
  page?: number;
  limit?: number;
}

export type GetRecommendedBooksResponse = PaginatedResponse<Book>;
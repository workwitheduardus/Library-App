import type { BasePaginationQuery, PaginatedResponse } from "./common";
import type { Book } from "./books";

export interface Author {
  id: number;
  name: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAuthorsQuery {
  q?: string;
}

export type GetAuthorsResponse = Author[];

export interface CreateAuthorRequest {
  name: string;
  bio: string;
}

export interface GetPopularAuthorsQuery {
  limit?: number;
}

export interface PopularAuthor extends Author {
  bookCount: number;
  accumulatedScore: number;
}

export type GetPopularAuthorsResponse = PopularAuthor[];


export interface GetAuthorBooksQuery extends BasePaginationQuery {}

export interface GetAuthorBooksResponse {
  author: Author;
  books: PaginatedResponse<Book>;
}

export interface UpdateAuthorRequest {
  name: string;
  bio: string;
}

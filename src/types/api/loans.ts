import type { Book } from "./books";
import type { PaginatedResponse } from "./common";

export type LoanStatus = "BORROWED" | "LATE" | "RETURNED";

export interface Loan {
  id: number;
  bookId: number;
  userId: number;
  status: LoanStatus;
  borrowedAt: string;
  dueAt: string;
  durationDays: number;
  returnedAt: string | null;
  book?: Book;
}

export interface CreateLoanRequest {
  bookId: number;
  days: number;
}

export type CreateLoanResponse = Loan;

export type ReturnLoanResponse = Loan;


export interface CreateLoansFromCartRequest {
  itemIds: number[];
  days: number;
  borrowDate: string;
}

export type CreateLoansFromCartResponse = Loan[];

export type LoanStatusFilter = "all" | "active" | "returned" | "overdue";

export interface GetMyLoansQuery {
  status?: LoanStatusFilter;
  q?: string;
  page?: number;
  limit?: number;
}

export type GetMyLoansResponse = PaginatedResponse<Loan>;

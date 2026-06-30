import type { PaginatedResponse } from "./common";
import type { Book } from "./books";
import type { Loan, LoanStatus } from "./loans";
import type { AuthUser } from "./auth";

export type AdminBookStatusFilter =
  | "all"
  | "available"
  | "borrowed"
  | "returned";

export interface GetAdminBooksQuery {
  status?: AdminBookStatusFilter;
  q?: string;
  categoryId?: number;
  authorId?: number;
  page?: number;
  limit?: number;
}

export type GetAdminBooksResponse = PaginatedResponse<Book>;

export interface AdminCreateLoanRequest {
  userId: number;
  bookId: number;
  dueAt: string;
}

export type AdminCreateLoanResponse = Loan;

export type AdminLoanStatusFilter = "all" | "active" | "returned" | "overdue";

export interface GetAdminLoansQuery {
  status?: AdminLoanStatusFilter;
  q?: string;
  page?: number;
  limit?: number;
}

export interface AdminLoan extends Loan {
  borrower: AuthUser;
}

export type GetAdminLoansResponse = PaginatedResponse<AdminLoan>;

export interface UpdateAdminLoanRequest {
  dueAt?: string;
  status?: LoanStatus;
}

export type UpdateAdminLoanResponse = AdminLoan;

export interface GetOverdueLoansQuery {
  page?: number;
  limit?: number;
}

export type GetOverdueLoansResponse = PaginatedResponse<AdminLoan>;

export interface AdminOverview {
  totalBooks: number;
  totalUsers: number;
  totalActiveLoans: number;
  totalOverdueLoans: number;
}

export interface GetAdminUsersQuery {
  q?: string;
  page?: number;
  limit?: number;
}

export interface AdminUser extends AuthUser {
  phone: string;
  createdAt: string;
}

export type GetAdminUsersResponse = PaginatedResponse<AdminUser>;

import type { PaginatedResponse } from "./common";
import type { Loan, LoanStatus } from "./loans";
import type { Review } from "./reviews";
import type { AuthUser } from "./auth";

export interface MeProfile extends AuthUser {
  phone: string;
  profilePhoto: string | null;
}

export interface UpdateMeRequest {
  name?: string;
  phone?: string;
  profilePhoto?: File;
}

export type UpdateMeResponse = MeProfile;

export interface GetMeLoansQuery {
  status?: LoanStatus;
  page?: number;
  limit?: number;
}

export type GetMeLoansResponse = PaginatedResponse<Loan>;

export interface GetMeReviewsQuery {
  q?: string;
  page?: number;
  limit?: number;
}

export type GetMeReviewsResponse = PaginatedResponse<Review>;

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export type RegisterResponse = LoginResponse;

export interface LoginRequest {
  email: string;
  password: string;
}

export type UserRole = "ADMIN" | "USER";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

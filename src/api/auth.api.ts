import type {LoginRequest, LoginResponse, RegisterRequest, RegisterResponse} from "../types/api/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export async function loginApi(payload: LoginRequest): Promise<LoginResponse> {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error (
            (err as {message?: string}) .message ?? "Login failed"
        );
    }

    return res.json () as Promise<LoginResponse>;
}

export async function registerApi(payload: RegisterRequest): Promise<RegisterResponse> {
    const res =  await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
            (err as {message?: string}).message ?? "Registration failed"
        );
    }
    
    return res.json() as Promise<RegisterResponse>;
}
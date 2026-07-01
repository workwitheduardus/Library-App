import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {AuthUser} from "../../types/api/auth";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

const TOKEN_KEY = "booky_token";
const USER_KEY = "booky_user";

const initialState: AuthState = {
    token: localStorage.getItem(TOKEN_KEY),
    user: (() => {
        try {
            const raw = localStorage.getItem(USER_KEY);
            return raw ? (JSON.parse(raw) as AuthUser) : null;
        } catch {
            return null;
        }
    })(),
    isAuthenticated: !!localStorage.getItem(TOKEN_KEY),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials(state, 
            action: PayloadAction<{ token: string; user: AuthUser }>) {
                const { token, user } = action.payload;
                state.token = token;
                state.user = user;
                state.isAuthenticated = true;
                localStorage.setItem(TOKEN_KEY, token);
                localStorage.setItem(USER_KEY, JSON.stringify(user));
            },
            logout(state) {
                state.token = null;
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
            },
        },
    });

export const {setCredentials, logout} = authSlice.actions;
export default authSlice.reducer;
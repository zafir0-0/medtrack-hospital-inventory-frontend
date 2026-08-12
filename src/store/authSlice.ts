import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../auth/types";

// Shape of auth state
interface AuthState {
    user: User | null;            // logged-in user
    isAuthenticated: boolean;     // login flag
}

// Load persisted user from localStorage
const persistedUser = localStorage.getItem("user");

// Initial state
const initialState: AuthState = {
    user: persistedUser ? JSON.parse(persistedUser) : null,
    isAuthenticated: !!persistedUser,
};

// Create auth slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem("user", JSON.stringify(action.payload)); // persist
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem("user"); // remove persisted data
        },
    },
});

// Export actions
export const { loginSuccess, logout } = authSlice.actions;

// Export reducer
export default authSlice.reducer;

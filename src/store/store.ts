import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

// Create Redux store
export const store = configureStore({
    reducer: {
        auth: authReducer,        // register auth slice
    },
});

// Types for hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

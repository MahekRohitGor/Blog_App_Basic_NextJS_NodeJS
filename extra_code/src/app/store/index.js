"use client";

import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "./slice/BlogSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            blogs: blogReducer,
        },
    });
}
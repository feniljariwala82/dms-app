import { configureStore } from "@reduxjs/toolkit";
import { api } from "../features/apiSlice";
import authReducer from "../features/auth/authSlice";
import documentReducer from "../features/documents/documentsSlice";
import themeReducer from "../features/theme/themeReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    document: documentReducer,
    [api.reducerPath]: api.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

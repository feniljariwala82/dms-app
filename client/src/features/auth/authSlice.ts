import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface UserType {
  _id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  exp: number; // token expiry time
  iat: number; // token initiation time
}

// Define a type for the slice state
interface AuthState {
  isLoading: boolean;
  isLoggedIn: boolean;
  user?: UserType;
}

// Define the initial state using that type
const initialState: AuthState = {
  isLoading: true,
  isLoggedIn: false,
  user: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, { payload }: PayloadAction<string>) => {
      state.isLoggedIn = true;
      localStorage.setItem("auth_token", payload);
    },
    logout: (state) => {
      state.user = undefined;
      state.isLoggedIn = false;
      localStorage.removeItem("auth_token");
    },
    setUser: (state, { payload }: PayloadAction<UserType>) => {
      state.isLoggedIn = true;
      state.user = payload;
    },
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
  },
});

export const { login, logout, setUser, setLoading } = authSlice.actions;

export default authSlice.reducer;

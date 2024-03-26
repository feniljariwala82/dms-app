import { LoginFormBody, SignupFormBody } from "../../types";
import { api } from "../apiSlice";

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => ({
        url: "users",
        method: "GET",
      }),
    }),
    login: builder.mutation({
      query: (data: LoginFormBody) => ({
        url: "users/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: () => [{ type: "Document", id: "LIST" }],
    }),
    signup: builder.mutation({
      query: (data: SignupFormBody) => ({
        url: "users/signup",
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "users/logout",
        method: "POST",
      }),
      invalidatesTags: ["Document"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetUserQuery,
  useSignupMutation,
} = authApi;

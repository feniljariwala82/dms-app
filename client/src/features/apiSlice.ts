import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/api/",
  prepareHeaders: (headers) => {
    const authToken = localStorage.getItem("auth_token");

    headers.set("Accept", "application/json");

    if (authToken) {
      headers.set("Authorization", `Bearer ${authToken}`);
    }

    return headers;
  },
  credentials: "include", // This allows server to set cookies
});

// Define a service using a base URL and expected endpoints
export const api = createApi({
  baseQuery,
  /**
   * api level definition of tag types
   */
  tagTypes: ["User", "Document"],
  endpoints: () => ({}),
});

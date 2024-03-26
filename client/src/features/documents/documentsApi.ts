import { api } from "../apiSlice";

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // get document list
    documents: builder.query({
      query: () => ({
        url: "/documents",
        method: "GET",
      }),
      providesTags: () => [{ type: "Document", id: "LIST" }],
    }),

    // destroy
    destroy: builder.mutation({
      query: (id: string) => ({
        url: `/documents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Document", id },
        { type: "Document", id: "LIST" }, // Invalidate the documents list
      ],
    }),

    // destroy bulk
    destroyBulk: builder.mutation({
      query: (ids: string[]) => ({
        url: `/documents/destroy/bulk/`,
        method: "DELETE",
        body: ids,
      }),
      invalidatesTags: () => [
        { type: "Document", id: "LIST" }, // Invalidate the documents list
      ],
    }),
  }),
});

export const { useDocumentsQuery, useDestroyMutation, useDestroyBulkMutation } =
  authApi;

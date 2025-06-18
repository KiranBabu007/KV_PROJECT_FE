import baseApi from "../api";
import type { ResumePayload, ResumeResponse } from "./types";

export const resumeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getResume: builder.query<ResumeResponse, string>({
      query: (id) => ({
        url: `/resume/${id}`,
        method: "GET",
      }),
      providesTags: ["RESUME"],
    }),

    sendResume: builder.mutation<{ id: string }, FormData>({
      query: (formData) => ({
        url: "/resume",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["RESUME"],
    }),
  }),
});

export const { useGetResumeQuery, useSendResumeMutation } = resumeApi;

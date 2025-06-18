import baseApi from "../api";
import type { ResumePayload, ResumeResponse } from "./types";

export const resumeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getResume: builder.mutation<ResumeResponse,number>({
      query: (id) => ({
        
        url: `/resume/${id}`,
        method: "GET",
        responseHandler: async (response) => window.open(window.URL.createObjectURL(await response.blob()),'_blank'),
      }),
      
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


export const { useGetResumeMutation, useSendResumeMutation } = resumeApi;


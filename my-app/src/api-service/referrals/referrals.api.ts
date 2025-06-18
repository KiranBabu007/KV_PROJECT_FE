import type { Referral } from "@/types";
import baseApi from "../api";
import type { EmployeeReferralsResponse } from "./types";
import type { ReferralsResponse } from "../candidate/types";

export const referralApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all referrals
    getReferralsList: builder.query<Referral[], void>({
      query: () => ({
        url: "/referral",
        method: "GET",
      }),
      providesTags: ["Referral"],
    }),

    // Get referral by ID
    getReferralById: builder.query<Referral, number>({
      query: (id) => ({
        url: `/referral/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Referral", id }],
    }),

    createReferral: builder.mutation<
      Referral,
      {
        referrerId: number;
        referred: {
          person: {
            name: string;
            phone: string;
            email: string;
          };
          yearsOfExperience: number;
        };
        jobPostingId: number;
        resumeId: number;
      }
    >({
      query: (payload) => ({
        url: "/referral",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Referral"],
    }),

    // Update referral status
    updateReferralStatus: builder.mutation<
      Referral,
      { id: number; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/referral/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Referral", id },
        "Referral",
      ],
    }),

    // Get formatted response
    getReferralResponse: builder.query<ReferralsResponse, number>({
      query: (id) => ({
        url: `/referral/response/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Referral", id }],
    }),

    // Get employee referrals
    getEmployeeReferrals: builder.query<EmployeeReferralsResponse[], number>({
      query: (employeeId) => ({
        url: `/referral/employee/${employeeId}`,
        method: "GET",
      }),
      providesTags: (result, error, employeeId) => [
        { type: "Referral", id: `EMPLOYEE-${employeeId}` },
      ],
    }),
  }),
});

export const {
  useGetReferralsListQuery,
  useGetReferralByIdQuery,
  useCreateReferralMutation,
  useUpdateReferralStatusMutation,
  useGetReferralResponseQuery,
  useGetEmployeeReferralsQuery,
} = referralApi;

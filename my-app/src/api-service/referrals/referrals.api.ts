import baseApi from "../api";
import type { EmployeeReferralsResponse } from "./types";

export const referralApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeReferrals: builder.query<EmployeeReferralsResponse[], string>({
      query: (payload) => ({
        url: `/referral/employee/${payload}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetEmployeeReferralsQuery } = referralApi;

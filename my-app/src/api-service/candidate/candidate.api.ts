import baseApi from "../api";
import type { NotificationsResponse, ReferralsResponse } from "./types";

export const referralApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReferral: builder.query<ReferralsResponse, string>({
      query: (payload) => ({
        url: `/referral/response/${payload}`,
        method: "GET",
      }),
    }),
    getReferralNotifications: builder.query<NotificationsResponse, string>({
      query: (payload) => ({
        url: `/notificatons/referral/${payload}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetReferralQuery, useGetReferralNotificationsQuery } =
  referralApi;

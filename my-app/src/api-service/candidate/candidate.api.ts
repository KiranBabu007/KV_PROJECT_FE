import baseApi from "../api";
import type {
  NotificationsPayload,
  NotificationsResponse,
  ReferralsPayload,
  ReferralsResponse,
} from "./types";

export const referralApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReferral: builder.query<ReferralsResponse, ReferralsPayload>({
      query: (payload) => ({
        url: `/referral/response/${payload}`,
        method: "GET",
      }),
    }),
    getReferralNotifications: builder.query<
      NotificationsResponse,
      NotificationsPayload
    >({
      query: (payload) => ({
        url: `/notificatons/referral/${payload}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetReferralQuery, useGetReferralNotificationsQuery } =
  referralApi;

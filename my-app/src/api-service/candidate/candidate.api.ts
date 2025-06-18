import baseApi from "../api";
import type {
  NotificationsResponse,
  ReadPayload,
  ReadResponse,
  ReferralsResponse,
} from "./types";

export const referralApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReferral: builder.query<ReferralsResponse, string>({
      query: (payload) => ({
        url: `/referral/response/${payload}`,
        method: "GET",
      }),
    }),
    getReferralNotifications: builder.query<NotificationsResponse[], string>({
      query: (payload) => ({
        url: `/notifications/referral/${payload}`,
        method: "GET",
      }),
    }),
    setAsRead: builder.mutation<ReadResponse, ReadPayload>({
      query: (payload) => ({
        url: `/notifications/${payload.id}/read`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useGetReferralQuery,
  useGetReferralNotificationsQuery,
  useSetAsReadMutation,
} = referralApi;

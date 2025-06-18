import baseApi from "../api";

export const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPersonNotifications: builder.query({
            query: ({ id }) => `/notifications/person/${id}`,
            providesTags: ["NOTIFICATIONS"],
        }),

        markasRead: builder.mutation({
            query: ({ id }) => ({
                url: `/notifications/${id}/read`,
                method: "PATCH",
            }),
            invalidatesTags: ["NOTIFICATIONS"],
        }),
    }),
});

export const { useGetPersonNotificationsQuery, useMarkasReadMutation } =
    notificationApi;

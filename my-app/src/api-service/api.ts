import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseApi = createApi({
  reducerPath: "globalApi",
  tagTypes:['JOBS','RESUME','Referral'],
  baseQuery: fetchBaseQuery({
    baseUrl: "https://recruitment-platform-backend-production.up.railway.app",

    prepareHeaders: (headers) => {
      // Retrieve the token from the state (assuming it's stored in the auth slice)

      const token = localStorage.getItem("token");

      console.log("token", token);

      // If a token exists, add it to the headers

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  refetchOnMountOrArgChange: true,

  refetchOnReconnect: true,

  endpoints: () => ({}),
});

export default baseApi;
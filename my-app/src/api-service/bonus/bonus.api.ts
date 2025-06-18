import baseApi from "../api";

export const bonusApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all bonuses
        getBonusList: builder.query({
            query: () => '/bonus',
            providesTags: ['BONUS']
        }),
        
        // Get bonuses for specific employee
        getEmployeeBonuses: builder.query({
            query: (employeeId) => `/bonus/employee/${employeeId}`,
            providesTags: (result, error, employeeId) => [
                { type: 'BONUS', id: `EMPLOYEE-${employeeId}` }
            ]
        }),
        
        // Patch a bonus
        patchBonus: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/bonus/${id}`,
                method: 'PATCH',
                body: patch
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'BONUS', id },
                'BONUS'
            ]
        }),
    })
});

export const {
    useGetBonusListQuery,
    useGetEmployeeBonusesQuery,
    usePatchBonusMutation,
} = bonusApi;
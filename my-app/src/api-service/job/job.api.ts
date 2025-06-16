import jobBaseApi from "../api";

export const jobsApi = jobBaseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all job postings
        getJobsList: builder.query({
            query: () => '/jobpostings',
            providesTags: ['JOBS']
        }),
        
        // Get single job posting by ID
        getJob: builder.query({
            query: ({id}) => `/jobpostings/${id}`,
            providesTags: (result, error, {id}) => [{ type: 'JOBS', id }]
        }),
        
        // Create new job posting
        addJob: builder.mutation({
            query: (jobData) => ({
                url: '/jobpostings',
                method: 'POST',
                body: jobData
            }),
            invalidatesTags: ['JOBS']
        }),
        
        // Update job posting (full update)
        updateJob: builder.mutation({
            query: (jobData) => ({
                url: `/jobpostings/${jobData.id}`,
                method: 'PUT',
                body: jobData
            }),
            invalidatesTags: ['JOBS']
        }),
        
        // Partially update job posting
        patchJob: builder.mutation({
            query: ({id, ...patch}) => ({
                url: `/jobpostings/${id}`,
                method: 'PATCH',
                body: patch
            }),
            invalidatesTags: ['JOBS']
        }),
        
        // Delete job posting
        deleteJob: builder.mutation({
            query: ({id}) => ({
                url: `/jobpostings/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['JOBS']
        })
    })
});

export const {
    useGetJobsListQuery,
    useGetJobQuery,
    useAddJobMutation,
    useUpdateJobMutation,
    usePatchJobMutation,
    useDeleteJobMutation
} = jobsApi;
import { apiSlice } from './apiSlice'
import { USERS_URL } from '../constants'

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ LOGIN
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),

    // ✅ LOGOUT
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),

    // ✅ REGISTER
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    // ✅ PROFILE (Update current user)
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      })
    }),

    // ✅ GET ALL USERS
    getUsers: builder.query({ // Fixed typo: 'buidler' -> 'builder'
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 5,
    }),

    // ✅ DELETE USER
    deleteUser: builder.mutation({ // Changed .query to .mutation
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ['User'], // Added to refresh the list after deletion
    }),

    // ✅ GET USER DETAILS
    getUserDetails: builder.query({ // Renamed for clarity
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),

    // ✅ UPDATE USER (Admin)
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`, // Fixed template literal syntax error
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['User'],
    })
  }),
})

// ✅ Export hooks (Names must exactly match the endpoints above)
export const { 
  useLoginMutation, 
  useLogoutMutation, 
  useRegisterMutation, 
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation, // Fixed name to match 'deleteUser'
  useGetUserDetailsQuery, // Fixed name to match 'getUserDetails'
  useUpdateUserMutation,
} = userApiSlice;
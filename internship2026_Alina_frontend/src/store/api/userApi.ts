import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['UserProfile'],
  endpoints: builder => ({
    updateAvatar: builder.mutation<{ avatarUrl: string }, File>({
      query: file => {
        const formData = new FormData();

        formData.append('file', file);

        return {
          url: '/users/profile/avatar',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['UserProfile'],
    }),


    updateBackground: builder.mutation<{ backgroundUrl: string }, File>({
      query: file => {
        const formData = new FormData();

        formData.append('file', file);

        return {
          url: '/users/profile/background',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['UserProfile'],
    }),

    getProfile: builder.query<any, void>({
      query: () => '/users/profile',
      providesTags: ['UserProfile'],
    }),
  }),
});

export const {
  useUpdateAvatarMutation,
  useUpdateBackgroundMutation,
  useGetProfileQuery
} = userApi;

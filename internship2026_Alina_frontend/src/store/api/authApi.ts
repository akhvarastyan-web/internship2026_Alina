import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import { User } from '../slices/auth/auth.types';
import {
  LoginRequest,
  RegisterRequest,
  ResetPasswordData,
  ChangePasswordData,
  ChangeNameData,
} from './types/interfaces';


export const authApi = createApi({
  reducerPath: 'authApi',

  baseQuery: baseQueryWithReauth,

  tagTypes: ['User'],

  endpoints: builder => ({
    getMe: builder.query<User, void>({
      query: () => '/auth/profile',

      providesTags: ['User'],
    }),

    login: builder.mutation<{ access_token: string }, LoginRequest>({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    register: builder.mutation<{ access_token: string }, RegisterRequest>({
      query: body => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),

    forgotPassword: builder.mutation<void, string>({
      query: email => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),

    resetPassword: builder.mutation<void, ResetPasswordData>({
      query: body => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),

    changeName: builder.mutation<User, ChangeNameData>({
      query: body => ({
        url: '/user/profile',

        method: 'PATCH',

        body,
      }),

      invalidatesTags: ['User'],
    }),

    changePassword: builder.mutation<void, ChangePasswordData>({
      query: body => ({
        url: '/auth/change-password',

        method: 'PATCH',

        body,
      }),
    }),
  }),
});

export const {
  useGetMeQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangeNameMutation,
  useChangePasswordMutation,
} = authApi;


import {
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { RootState, AppDispatch } from './../index';
import { logout, setCredentials } from '../slices/auth/auth.slice';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,

  credentials: 'include',

  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshResult = await rawBaseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const { accessToken } =
        refreshResult.data as {
          accessToken: string;
        };

      (api.dispatch as AppDispatch)(
        setCredentials({
          accessToken,
        })
      );

      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      (api.dispatch as AppDispatch)(logout());
    }
  }

  return result;
};

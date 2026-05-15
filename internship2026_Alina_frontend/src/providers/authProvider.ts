import { PropsWithChildren, useEffect } from 'react';
import {
  logout,
  setInitialized,
  setUser,
} from '../store/slices/auth/auth.slice';
import { useGetMeQuery } from '../store/api/authApi';
import { useAppDispatch, useAppSelector } from '../hooks/redux';

export const AuthProvider = ({
  children,
}: PropsWithChildren) => {
  const dispatch = useAppDispatch();

  const token = useAppSelector(state => state.auth.accessToken);

  const { data, isLoading, isSuccess, isError } = useGetMeQuery(undefined, {
    skip: !token,
  });


  useEffect(() => {
    if (!token) {
      dispatch(setInitialized());
      return;
    }

    if (isSuccess && data) {
      dispatch(setUser(data));
      dispatch(setInitialized());
    }

    if (isError) {
      dispatch(logout());
      dispatch(setInitialized());
    }
  }, [token, data, isSuccess, isError, dispatch]);


  return children;
};

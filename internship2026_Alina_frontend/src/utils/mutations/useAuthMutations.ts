import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type {
  RegisterMutationParams,
  LoginMutationParams,
  AuthResponse,
  ResetPasswordData,
} from '../../type/MutationParams';

export const useAuthMutations = () => {
  const navigate = useNavigate();

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        },
      );

      let data: { message?: string } | null = null;

      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        throw new Error(data?.message || 'User not found');
      }

      return true;
    },
  });

  const registerMutation = useMutation({
  mutationFn: async ({
    registerData,
    keepLoggedIn,
  }: RegisterMutationParams) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      }
    );

    let data: AuthResponse;

    try {
        data = await res.json();
    } catch {
      throw new Error('Invalid server response');
    }

    if (!res.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return {
      data,
      keepLoggedIn,
    };
  },

  onSuccess: ({ data, keepLoggedIn }) => {
    const token = data.access_token;

    if (keepLoggedIn) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }

    navigate('/');
  },
});

  const loginMutation = useMutation({
    mutationFn: async ({ loginData, keepLoggedIn }: LoginMutationParams) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      let data: AuthResponse;

      try {
        data = await res.json();
      } catch {
        throw new Error('Invalid server response');
      }

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return {
        data,
        keepLoggedIn,
      };
    },

    onSuccess: ({ data, keepLoggedIn }) => {
      const token = data.access_token;

      if (keepLoggedIn) {
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('token', token);
      }

      navigate('/');
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ password, token }: ResetPasswordData) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password, token }),
      });

     let data: { message?: string } | null = null;

      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        throw new Error(
          data?.message || 'Link expired or invalid token'
        );
      }

      return true;
    },

    onSuccess: () => {
      navigate('/auth/password-saved');
    },
  });

  return {
    registerMutation,
    forgotPasswordMutation,
    loginMutation,
    resetPasswordMutation,
  };
};

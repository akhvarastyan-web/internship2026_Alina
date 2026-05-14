import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from './auth.types';



const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
      }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;

      localStorage.setItem('accessToken', action.payload.accessToken);
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },

    logout: state => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem('accessToken');
    },

    setInitialized: state => {
      state.isInitialized = true;
    },
  },
});

export const { setCredentials, setUser, logout, setInitialized } =
  authSlice.actions;

export default authSlice.reducer;

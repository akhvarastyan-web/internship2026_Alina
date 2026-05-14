import { createListenerMiddleware } from '@reduxjs/toolkit';

import { authApi } from './api/authApi';

import { logout } from './slices/auth/auth.slice';

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: logout,

  effect: async (_, api) => {
    api.dispatch(authApi.util.resetApiState());
  },
});

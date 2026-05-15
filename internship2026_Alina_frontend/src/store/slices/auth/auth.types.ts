export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

type RegisterData = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

export type RegisterMutationParams = {
  registerData: RegisterData;
  keepLoggedIn: boolean;
};

export type LoginData = {
  email: string;
  password: string;
};

export type LoginMutationParams = {
  loginData: LoginData;
  keepLoggedIn: boolean;
};

export type AuthResponse = {
  access_token: string;
  message?: string;
};

export type ResetPasswordData = {
  password: string;
  token: string | null;
};

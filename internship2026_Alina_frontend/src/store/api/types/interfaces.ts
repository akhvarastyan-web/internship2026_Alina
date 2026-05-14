export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  access_token: string;
  message?: string;
}

export interface ResetPasswordData {
  password: string;
  token: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

export interface ChangeNameData {
  firstname: string;
  lastname: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
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

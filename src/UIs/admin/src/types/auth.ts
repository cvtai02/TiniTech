import { User } from '.';

export interface loginForm {
  email: string;
  password: string;
}

export interface LoginResponse {
  isAuthenticated: boolean;
  accessTokenExpiresTime: Date | null;
  refreshTokenExpiresTime: Date | null;
  user: User | null;
}

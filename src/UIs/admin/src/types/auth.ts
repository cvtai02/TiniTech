import { User } from '.';

export interface loginForm {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  expiresIn: number;
  message?: string;
}

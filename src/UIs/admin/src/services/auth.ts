import { loginForm } from '../types/auth';
import { apiFetch } from './api-interceptor';

const API_URL = import.meta.env.VITE_CORE_API_URL || '';

export const login = async (form: loginForm) => {
  // const { email, password } = form;
  console.log('login', JSON.stringify(form));
  const response = await apiFetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify(form),
  });
  console.log('response', response);
  const body = await response.json();
  return body.data;
};

export const logout = async () => {
  const response = await apiFetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
  });
  return response.json();
};

import { Attribute } from '../types/attribute';
import { apiFetch } from './api-interceptor';
const API_URL = import.meta.env.VITE_CORE_API_URL || '';

export const fetchAttributes = async (): Promise<Attribute[]> => {
  const res = await apiFetch(`${API_URL}/api/attributes`);
  const body = await res.json();
  return body.data;
};

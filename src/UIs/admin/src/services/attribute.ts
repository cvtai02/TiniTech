import { AttributeDto, CreateAttributeDto } from '../types/attribute';
import { apiFetch } from './api-interceptor';
const API_URL = import.meta.env.VITE_CORE_API_URL || '';

export const getAttributesFn = async (): Promise<AttributeDto[]> => {
  const res = await apiFetch(`${API_URL}/api/attributes`);
  const body = await res.json();
  return body.data;
};

export const createAttributeFn = async (
  data: CreateAttributeDto,
): Promise<AttributeDto> => {
  const res = await apiFetch(`${API_URL}/api/attributes`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const body = await res.json();
  return body.data;
};

export const deleteAttributeFn = async (id: string): Promise<void> => {
  await apiFetch(`${API_URL}/api/attributes/${id}`, {
    method: 'DELETE',
  });
};

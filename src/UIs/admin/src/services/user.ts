import { PaginatedList, User } from '../types';
import { apiFetch } from './api-interceptor';

const API_URL = import.meta.env.VITE_CORE_API_URL || '';

export const fetchUsers = async (
  page = 1,
  searchTerm = '',
  pageSize = 8,
): Promise<PaginatedList<User>> => {
  const res = await apiFetch(
    `${API_URL}/api/users?page=${page}&pageSize=${pageSize}&search=${searchTerm}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }

  const body = await res.json();
  return body.data;
};

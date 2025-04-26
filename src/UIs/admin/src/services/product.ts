import { apiFetch, postForm } from './api-interceptor';
import {
  CreateProductDto,
  ProductBriefDto,
  GetProductsQueryParams as GetProductsQuery,
  PaginatedList,
} from '../types';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_CORE_API_URL || '';

export const createProduct = async (data: CreateProductDto) => {
  console.log('data', data);
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('description', data.description);
  formData.append('sku', data.sku);
  formData.append('price', data.price.toString());
  formData.append('categoryId', data.categoryId);

  data.images.forEach((image) => {
    formData.append('images', image);
  });
  const res = await postForm(`${API_URL}/api/products`, {
    method: 'POST',
    body: formData,
  });

  if (res.status === 201) {
    toast.success('Thêm sản phẩm thành công!');
  }

  const body = await res.json();

  return body.data;
};

export const updateProductStatus = async (
  id: string,
  status: 'Active' | 'Deleted',
): Promise<boolean> => {
  const res = await apiFetch(`${API_URL}/api/products/status`, {
    method: 'PATCH',
    body: JSON.stringify({ id, status }),
  });

  if (res.status === 200) {
    toast.success('Cập nhật trạng thái sản phẩm thành công!');
  }
  const body = await res.json();
  return body.data;
};

export const getProductsFn = async (
  data: GetProductsQuery,
): Promise<PaginatedList<ProductBriefDto>> => {
  var queryString = data.getQueryString();

  const res = await apiFetch(`${API_URL}/api/products${queryString}`);
  const body = await res.json();
  return body.data;
};

import { apiFetch } from './api-interceptor';
import { CreateProductDto, ProductBrief } from '../types/product';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_CORE_API_URL || '';

export const createProduct = async (data: CreateProductDto) => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('description', data.description);
  formData.append('sku', data.sku);
  formData.append('price', data.price.toString());
  formData.append('categoryId', data.categoryId);
  data.attributeIds.forEach((attributeId) => {
    formData.append('attributeIds', attributeId);
  });
  data.images.forEach((image) => {
    formData.append('images', image);
  });
  const res = await apiFetch(`${API_URL}/api/products`, {
    method: 'POST',
    body: formData,
  });
  const body = await res.json();
  if (body.statusCode === 201) {
    toast.success('Thêm sản phẩm thành công!');
    return null;
  }
  return body.data;
};

export const getNewProducts = async (
  page: number,
  page_size: number,
): Promise<ProductBrief[]> => {
  const res = await apiFetch(
    `${API_URL}/api/products/new?page=${page}&page_size=${page_size}`,
  );
  const body = await res.json();
  return body.data.items;
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
    }

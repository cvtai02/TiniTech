import { apiFetch, postForm } from './api-interceptor';
import {
  CreateProductDto,
  ProductBriefDto,
  CreateVariantDto,
  ProductDetailDto,
  GetProductsQuery,
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

  if (data.attributeIds[0] == '') {
    data.attributeIds[0] = '-1';
  }

  data.attributeIds.forEach((attributeId) => {
    formData.append('attributeIds', attributeId);
  });

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

export const createVariant = async (data: CreateVariantDto) => {
  const res = await apiFetch(`${API_URL}/api/products/variants`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (res.status === 201) {
    toast.success('Thêm biến thể sản phẩm thành công!');
  }
  const body = await res.json();

  return body.data;
};

export const getProducts = async (
  data: GetProductsQuery,
): Promise<ProductBriefDto[]> => {
  var queryString = data.getQueryString();

  const res = await apiFetch(`${API_URL}/api/products${queryString}`);
  const body = await res.json();
  return body.data.items;
};

export const createProductAttribute = async (data: {
  productId: string;
  attributeId: string;
}) => {
  const res = await apiFetch(`${API_URL}/api/products/attributes`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (res.status === 201) {
    toast.success('Thêm thuộc tính sản phẩm thành công!');
  }
  const body = await res.json();

  return body.data;
};

export const deleteProductAttribute = async (
  productId: string,
  attributeId: string,
) => {
  const res = await apiFetch(`${API_URL}/api/products/attributes`, {
    method: 'DELETE',
    body: JSON.stringify({ productId, attributeId }),
  });
  if (res.status === 200) {
    toast.success('Xóa thuộc tính sản phẩm thành công!');
  }
  const body = await res.json();

  return body.data;
};

export const addProductAttributeValue = async (data: {
  productId: string;
  attributeId: string;
  value: string;
}) => {
  const res = await apiFetch(`${API_URL}/api/products/attributes/values`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (res.status === 201) {
    toast.success('Thêm thuộc tính sản phẩm thành công!');
  }
  const body = await res.json();

  return body.data;
};

export const deleteProductAttributeValue = async (
  productId: string,
  attributeId: string,
  value: string,
) => {
  const res = await apiFetch(`${API_URL}/api/products/attributes/values`, {
    method: 'DELETE',
    body: JSON.stringify({ productId, attributeId, value }),
  });
  if (res.status === 200) {
    toast.success('Xóa thuộc tính sản phẩm thành công!');
  }
  const body = await res.json();

  return body.data;
};

export const getProductAttribute = async (productId: string) => {
  const res = await apiFetch(`${API_URL}/api/products/${productId}/attributes`);
  const body = await res.json();
  return body.data;
};

export const getProductDetailBySlug = async (
  slug: string,
): Promise<ProductDetailDto> => {
  const res = await apiFetch(`${API_URL}/api/products/${slug}`);
  const body = await res.json();
  return body.data;
};

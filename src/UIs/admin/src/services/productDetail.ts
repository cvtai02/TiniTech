import {
  ProductDetailDto,
  UpdateProductImagesDto,
  UpdateProductInfoDto,
} from '../types';
import { apiFetch, postForm } from './api-interceptor';

const API_URL = import.meta.env.VITE_CORE_API_URL || '';
export const getProductDetailBySlugFn = async (
  slug: string,
): Promise<ProductDetailDto> => {
  const res = await apiFetch(`${API_URL}/api/products/${slug}`);
  const body = await res.json();
  return body.data;
};

export const updateProductImagesFn = async (
  data: UpdateProductImagesDto,
): Promise<string> => {
  console.log('data', data);
  const formData = new FormData();
  formData.append('productId', data.productId);

  if (data.addImages) {
    data.addImages.forEach((image) => {
      formData.append('addImages', image);
    });
  }

  if (data.addImagesOrderPriority) {
    data.addImagesOrderPriority.forEach((priority) => {
      formData.append('addImagesOrderPriority', priority.toString());
    });
  }

  if (data.removeImageIds) {
    data.removeImageIds.forEach((imageId) => {
      formData.append('removeImageIds', imageId);
    });
  }

  if (data.defaultImageUrl) {
    formData.append('defaultImageUrl', data.defaultImageUrl);
  }

  if (data.defaultImageIndexInAdding !== undefined) {
    formData.append(
      'defaultImageIndexInAdding',
      data.defaultImageIndexInAdding.toString(),
    );
  }

  const res = await postForm(`${API_URL}/api/products/images`, {
    method: 'PATCH',
    body: formData,
  });

  const body = await res.json();

  return body.data;
};

export const updateProductInfoFn = async (
  data: UpdateProductInfoDto,
): Promise<string> => {
  console.log('data', data);
  const res = await apiFetch(`${API_URL}/api/products`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

  const body = await res.json();

  return body.data;
};

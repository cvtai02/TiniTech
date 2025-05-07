import { SkuItem, createImportReceiptDto } from '../types/inventory';
import { apiFetch } from './api-interceptor';

const API_URL = import.meta.env.VITE_CORE_API_URL || '';

export const createImportReceipt = async (
  data: createImportReceiptDto,
): Promise<boolean> => {
  const res = await apiFetch(`${API_URL}/api/import-receipts`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  const body = await res.json();
  return body.data;
};

export const searchBySku = async (sku: string): Promise<SkuItem[]> => {
  const res = await apiFetch(`${API_URL}/api/products/sku-search?q=${sku}`, {
    method: 'GET',
  });
  const body = await res.json();
  return body.data;
};

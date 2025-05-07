import { createImportReceiptDto } from '../types/import-receipt';
import { apiFetch } from './api-interceptor';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_CORE_API_URL || '';

export const createImportReceipt = async (
  data: createImportReceiptDto,
): Promise<boolean> => {
  try {
    const res = await apiFetch(`${API_URL}/api/imports`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (res.status === 201 || res.status === 200) {
      toast.success('Import receipt created successfully!');
      return true;
    } else {
      const errorData = await res.json();
      toast.error(errorData.message || 'Failed to create import receipt');
      return false;
    }
  } catch (error) {
    console.error('Error creating import receipt:', error);
    toast.error('An error occurred while creating the import receipt');
    return false;
  }
};

export const saveImportReceiptDraft = async (
  data: createImportReceiptDto,
): Promise<boolean> => {
  try {
    const res = await apiFetch(`${API_URL}/api/imports/draft`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (res.status === 201 || res.status === 200) {
      toast.success('Import receipt draft saved successfully!');
      return true;
    } else {
      const errorData = await res.json();
      toast.error(errorData.message || 'Failed to save import receipt draft');
      return false;
    }
  } catch (error) {
    console.error('Error saving import receipt draft:', error);
    toast.error('An error occurred while saving the import receipt draft');
    return false;
  }
};

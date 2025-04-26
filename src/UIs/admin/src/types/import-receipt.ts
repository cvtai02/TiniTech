export type ImportReceiptDto = {
  Code: string;
  receiptDate: string;
  status: 'pending' | 'completed' | 'failed';
  totalAmount: number;
  totalProductCount: number;
  totalProductAddedCount: number;
  totalProductFailedCount: number;
  failedProducts: {
    productId: string;
    errorMessage: string;
  }[];
};

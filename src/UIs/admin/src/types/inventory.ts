export type createImportReceiptDto = {
  Code: string;
  receiptDate: Date;
  items: CreateImportItemDto[];
};

export type CreateImportItemDto = {
  productId: number;
  variantId: number;
  sku: string;
  quantity: number;
  unitCost: number;
};

export interface SkuItem {
  productId: number;
  variantId: number;
  sku: string;
  name: string;
  identityName: string;
  imageUrl: string;
}

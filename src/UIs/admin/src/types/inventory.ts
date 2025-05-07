export type createImportReceiptDto = {
  Code: string;
  receiptDate: Date;
  items: CreateImportItemDto[];
};

export type CreateImportItemDto = {
  sku: string;
  quantity: number;
  unitCost: number;
};

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export interface SkuItem {
  id: string;
  sku: string;
  name: string;
  identityName: string;
  imageUrl: string;
}

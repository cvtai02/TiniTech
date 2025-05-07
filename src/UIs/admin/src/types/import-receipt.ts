export type createImportReceiptDto = {
  Code: string;
  receiptDate: string;
  items: CreateImportItemDto[];
}[];

export type CreateImportItemDto = {
  sku: string;
  quantity: number;
  unitCost: number;
};

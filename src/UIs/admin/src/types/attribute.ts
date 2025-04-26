export interface AttributeValueDto {
  value: string;
  imageUrl?: string;
  orderPriority?: number;
}

export interface AttributeDto {
  attributeId: string;
  name: string;
  isPrimary: boolean;
  orderPriority: number;
  values: AttributeValueDto[];
}

export type CreateAttributeDto = {
  name: string;
};

export type DeleteAttributeDto = {
  id: string;
};

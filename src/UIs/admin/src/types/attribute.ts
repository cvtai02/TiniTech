export interface AttributeDto {
  attributeId: number;
  name: string;
}

export type CreateAttributeDto = {
  name: string;
};

export type DeleteAttributeDto = {
  id: string;
};

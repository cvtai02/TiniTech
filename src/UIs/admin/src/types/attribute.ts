

export interface AttributeDto {
  id: string;
  name: string;
}

export type CreateAttributeDto = {
  name: string;
};

export type DeleteAttributeDto = {
  id: string;
};

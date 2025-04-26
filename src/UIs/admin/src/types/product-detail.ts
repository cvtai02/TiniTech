// DTOs
export interface ProductDetailDto {
  id: number;
  slug: string;
  name: string;
  price: number;
  sku: string;
  status: 'active' | 'draft' | 'deleted';
  defaultImageUrl: string;
  categoryId: number;
  description: string;
  images: {
    id: string;
    imageUrl: string;
    orderPriority: number;
  }[];
  rating: number;
  ratingCount: number;
  stock: number;
  sold: number;
  featuredPoint: number;
  attributes: ProductAttributeDto[];
  variants: VariantDto[];
}

export interface ProductAttributeDto {
  attributeId: string;
  name: string;
  isPrimary: boolean;
  orderPriority: number;
  values: ProductAttributeValueDto[];
}

export interface ProductAttributeValueDto {
  value: string;
  imageUrl?: string;
  orderPriority?: number;
}

export interface VariantDto {
  price: number;
  sku: string;
  stock: number;
  variantAttributes: VariantAttributeDto[];
}

export interface VariantAttributeDto {
  attributeId: string;
  value: string;
}

export type CreateProductDto = {
  name: string;
  description: string;
  sku: string;
  price: number;
  categoryId: string;
  images: File[];
};

export type UpdateProductImagesDto = {
  productId: string;
  addImages?: File[];
  addImagesOrderPriority?: number[];
  removeImageIds?: string[];
  defaultImageUrl?: string;
  defaultImageIndexInAdding?: number;
};

export type UpdateProductInfoDto = {
  new: ProductDetailDto;
};

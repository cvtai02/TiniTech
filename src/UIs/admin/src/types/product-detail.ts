export type CreateProductDto = {
  name: string;
  description: string;
  sku: string;
  price: number;
  categoryId: string;
  images: File[];
  attributeIds: string[];
};

// DTOs
export interface ProductDetailDto {
  id: number;
  slug: string;
  name: string;
  price: number;
  categoryId: number;
  description: string;
  imageUrls: string[];
  rating: number;
  ratingCount: number;
  stock: number;
  sold: number;
  featuredPoint: number;
  attributes: AttributeDto[];
  variants: VariantDto[];
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

export interface AttributeValueDto {
  orderPriority: number;
  value: string;
  imageUrl?: string;
}

export interface AttributeDto {
  attributeId: number;
  name: string;
  orderPriority: number;
  isPrimary: boolean;
  values: AttributeValueDto[];
}

export type CreateVariantDto = {
  productId: string;
  sku: string;
  price: number;
  attributes: {
    attributeId: string;
    value: string;
  }[];
};

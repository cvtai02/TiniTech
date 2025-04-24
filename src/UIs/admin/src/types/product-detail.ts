import { ProductStatus } from './product';

// DTOs
export interface ProductDetailDto {
  id: number;
  slug: string;
  name: string;
  price: number;
  sku: string;
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

export type CreateProductDto = {
  name: string;
  description: string;
  sku: string;
  price: number;
  categoryId: string;
  images: File[];
  attributeIds: string[];
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
  productId: string;
  name?: string;
  sku?: string;
  price?: number;
  categoryId?: string;
  description?: string;
  status?: ProductStatus;
  variants?: {
    addList?: {
      price: number;
      sku: string;
      attributes: {
        attributeId: string;
        value: string;
      }[];
    }[];
    updateList?: {
      variantsId: string;
      price?: number;
      sku?: string;
      isDeleted?: boolean;
    }[];
  };
  attributes?: {
    addList?: {
      attributeId: string;
      isPrimary: boolean;
      orderPriority: number;
      values: {
        value: string;
        orderPriority: number;
        imageUrl?: string;
      };
    }[];
    removeList?: {
      attributeId: string;
      values: string[];
    }[];
  };
};

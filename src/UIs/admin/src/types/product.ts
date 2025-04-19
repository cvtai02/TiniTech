export interface ProductBrief {
  id: string;
  slug: string;
  name: string;
  price: string;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  stock: number;
  sold: number;
}

export interface CreateProductDto {
  name: string;
  description: string;
  categoryId: string;
  images: File[];
  attributeIds: string[];
}

export interface ProductDetail {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  description: string;
  price: string;
  imageUrls: string[];
  rating: number;
  ratingCount: number;
  stock: number;
  sold: number;
  attributes: {
    name: string;
    orderPriority: number;
    isPrimary: boolean;
    values: {
      value: string;
      orderPriority: number;
      imageUrl?: string | null;
    }[];
  }[];

  variants: {
    price: string;
    sku: string;
    stock: number;
    variantAttributes: {
      name: string;
      value: string;
    }[];
  }[];
}

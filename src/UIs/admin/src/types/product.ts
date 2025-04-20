export type ProductBrief = {
  id: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  stock: number;
  sold: number;
};

export type CreateProductDto = {
  name: string;
  description: string;
  sku: string;
  price: number;
  categoryId: string;
  images: File[];
  attributeIds: string[];
};

export type ProductDetail = {
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
};

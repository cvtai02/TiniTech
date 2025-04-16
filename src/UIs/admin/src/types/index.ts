export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId?: string;
  subcategories?: Category[];
}

export interface Product {
  name: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
}

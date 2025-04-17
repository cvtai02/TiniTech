export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export interface Category {
  id?: string;
  name: string;
  slug: string;
  description: string;
  parentId?: string | null;
  subcategories?: Category[] | null;
}

export interface ProductBrief {
  name: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
}

export interface CustomerBilling {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
}

export interface OrderBrief {
  id: string;
  customerName: string;
  orderDate: string;
  status: 'pending' | 'completed' | 'cancelled';
  totalAmount: number;
  items: number;
}

export interface CreateProduct {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  image: File | null;
}

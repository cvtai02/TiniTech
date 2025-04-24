export const ProductStatusList = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Draft',
    value: 'draft',
  },
  {
    label: 'Deleted',
    value: 'deleted',
  },
];
export const OrderCriteriaList = [
  {
    label: 'Created Date',
    value: 'createdDate',
  },
  {
    label: 'Rating',
    value: 'rating',
  },
  {
    label: 'Price',
    value: 'price',
  },
  {
    label: 'Sold',
    value: 'sold',
  },
  {
    label: 'Stock',
    value: 'stock',
  },
  {
    label: 'Featured Point',
    value: 'featuredPoint',
  },
];
export const OrderDirectionList = [
  {
    label: 'Ascending',
    value: 'ascending',
  },
  {
    label: 'Descending',
    value: 'descending',
  },
];

export type ProductStatus = 'active' | 'draft' | 'deleted';
export type OrderCriteria =
  | 'createdDate'
  | 'rating'
  | 'price'
  | 'sold'
  | 'stock'
  | 'featuredPoint';
export type OrderDirection = 'ascending' | 'descending';

export interface ProductBriefDto {
  id: string;
  slug: string;
  name: string;
  sku: string;
  price: number;
  featuredPoint: number;
  status: string;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  stock: number;
  sold: number;
}

export class GetProductsQueryParams {
  page: number = 1;
  pageSize: number = 8;
  search?: string | null;
  categorySlug?: string | null;
  status: string[] = ['active', 'draft'];
  orderBy?: string;
  orderDirection?: string;

  constructor(init?: Partial<GetProductsQueryParams>) {
    Object.assign(this, init);
  }

  getQueryString(): string {
    const params = new URLSearchParams();

    if (this.page != null) params.append('pageNumber', String(this.page));
    if (this.pageSize != null) params.append('pageSize', String(this.pageSize));
    if (this.search) params.append('search', this.search);
    if (this.categorySlug) params.append('categorySlug', this.categorySlug);
    if (this.status && this.status.length > 0) {
      this.status.forEach((s) => params.append('status', s));
    }
    if (this.orderBy) params.append('orderBy', this.orderBy);
    if (this.orderDirection)
      params.append('orderDirection', this.orderDirection);

    if (params.toString().length !== 0) {
      return `?${params.toString()}`;
    }

    return params.toString();
  }
}

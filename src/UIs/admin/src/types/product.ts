export const ProductStatusList = [
  {
    label: 'Active',
    value: 'Active',
  },
  {
    label: 'Draft',
    value: 'Draft',
  },
  {
    label: 'Deleted',
    value: 'Deleted',
  },
  {
    label: 'Discontinued',
    value: 'Discontinued',
  },
];
export const OrderCriteriaList = [
  {
    label: 'Created Date',
    value: 'CreatedDate',
  },
  {
    label: 'Rating',
    value: 'Rating',
  },
  {
    label: 'Price',
    value: 'Price',
  },
  {
    label: 'Sold',
    value: 'Sold',
  },
  {
    label: 'Stock',
    value: 'Stock',
  },
  {
    label: 'Featured Point',
    value: 'FeaturedPoint',
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

export type ProductStatus = 'Active' | 'Draft' | 'Deleted' | 'Discontinued';
export type OrderCriteria =
  | 'CreatedDate'
  | 'Rating'
  | 'Price'
  | 'Sold'
  | 'Stock'
  | 'FeaturedPoint';
export type OrderDirection = 'Ascending' | 'Descending';

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
  created: Date;
  lastModified: Date;
}

export class GetProductsQueryParams {
  page: number = 1;
  pageSize: number = 10;
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

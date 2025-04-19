export interface Category {
  id?: string;
  name: string;
  slug: string;
  description: string;
  status?: 'Active' | 'Inactive' | 'Deleted';
  parentId?: string | null;
  subcategories?: Category[] | null;
}

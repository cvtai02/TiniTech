/// follow tree structure
export type Category = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  status?: 'Active' | 'Inactive' | 'Deleted';
  parentId?: string | null;
  subcategories?: Category[] | null;
};

export type CreateCategoryDto = {
  name: string;
  description: string;
  parentId?: string | null;
};

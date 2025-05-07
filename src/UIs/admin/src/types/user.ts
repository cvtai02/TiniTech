export interface User {
  id: number;
  name: string;
  email: string;
  imageUrl: string;
  role: string;
  claims: string[];
  phone: string;
  locked: Date | null;
  createdAt: Date;
}


export interface GetUsersQuery {
  page: number ;
  pageSize: number;
  search: string | null;
  isActive: boolean | null;
}
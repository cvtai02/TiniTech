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

export type CustomerBilling = {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
};

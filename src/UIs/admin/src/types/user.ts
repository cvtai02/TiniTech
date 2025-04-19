export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export interface CustomerBilling {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
}

export type User = {
  id: number;
  name: string;
  email: string;
  roles: string[];
  isLocked: boolean;
  
};

export type CustomerBilling = {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
};

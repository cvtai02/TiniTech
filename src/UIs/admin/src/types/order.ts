export interface OrderBrief {
  id: string;
  customerName: string;
  orderDate: string;
  status: 'pending' | 'completed' | 'cancelled';
  totalAmount: number;
  items: number;
}

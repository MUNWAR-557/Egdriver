export type OrderStatus = 'Available' | 'Accepted' | 'Picked Up' | 'En Route' | 'Arrived' | 'Delivered';

export interface Order {
  id: string;
  pickupLocation: string;
  deliveryAddress: string;
  orderItems: string;
  deliveryTimeframe: string;
  status: OrderStatus;
  estimatedEarnings: number;
}

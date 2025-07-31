export type TaskStatus = 'Available' | 'Accepted' | 'Picked Up' | 'En Route' | 'Arrived' | 'Delivered';

export interface Task {
  id: string;
  pickupLocation: string;
  deliveryAddress: string;
  orderItems: string;
  deliveryTimeframe: string;
  status: TaskStatus;
  estimatedEarnings: number;
}

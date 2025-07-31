export type TaskStatus = 'Available' | 'Accepted' | 'En Route' | 'Delivered' | 'Arrived';

export interface Task {
  id: string;
  pickupLocation: string;
  deliveryAddress: string;
  orderItems: string;
  deliveryTimeframe: string;
  status: TaskStatus;
  estimatedEarnings: number;
}

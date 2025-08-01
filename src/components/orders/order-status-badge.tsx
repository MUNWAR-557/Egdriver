'use client';

import type { OrderStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Package,
  Truck,
  CheckCircle2,
  CircleDotDashed,
  ShieldCheck,
} from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const variants: Record<
    OrderStatus,
    { variant: 'default' | 'secondary' | 'outline' | 'destructive'; icon: React.ReactNode; text: string }
  > = {
    Available: { variant: 'secondary', icon: <CircleDotDashed className="h-3 w-3" />, text: 'Available' },
    Accepted: { variant: 'default', icon: <Package className="h-3 w-3" />, text: 'Accepted' },
    'Picked Up': { variant: 'default', icon: <ShieldCheck className="h-3 w-3" />, text: 'Picked Up' },
    'En Route': { variant: 'outline', icon: <Truck className="h-3 w-3" />, text: 'En Route' },
    Arrived: { variant: 'outline', icon: <MapPin className="h-3 w-3" />, text: 'Arrived' },
    Delivered: { variant: 'default', icon: <CheckCircle2 className="h-3 w-3" />, text: 'Delivered' },
  };

  const currentVariant = variants[status];

  return (
    <Badge
      variant={currentVariant.variant}
      className={`flex items-center gap-1.5 ${
        status === 'Delivered'
          ? 'bg-green-500 text-white hover:bg-green-600'
          : ''
      } ${
        status === 'Picked Up' ? 'bg-blue-500 text-white hover:bg-blue-600' : ''
      }`}
    >
      {currentVariant.icon}
      <span>{currentVariant.text}</span>
    </Badge>
  );
}

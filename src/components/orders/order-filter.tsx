
'use client';

import * as React from 'react';
import type { OrderStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const statuses: (OrderStatus | 'All')[] = [
  'All',
  'Available',
  'Accepted',
  'Picked Up',
  'Arrived',
  'Delivered',
];

interface OrderFilterProps {
  onStatusChange: (status: OrderStatus | 'All') => void;
  initialStatus?: OrderStatus | 'All';
}

export function OrderFilter({
  onStatusChange,
  initialStatus = 'All',
}: OrderFilterProps) {
  const [activeStatus, setActiveStatus] = React.useState<OrderStatus | 'All'>(
    initialStatus
  );

  const handleStatusClick = (status: OrderStatus | 'All') => {
    setActiveStatus(status);
    onStatusChange(status);
  };

  return (
    <div className="inline-flex flex-wrap items-center gap-2 rounded-md bg-muted p-1">
      {statuses.map((status) => (
        <Button
          key={status}
          variant="ghost"
          className={cn(
            'h-8 px-3 text-sm',
            activeStatus === status
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
              : 'text-foreground/80 hover:bg-accent hover:text-accent-foreground'
          )}
          onClick={() => handleStatusClick(status)}
        >
          {status}
        </Button>
      ))}
    </div>
  );
}

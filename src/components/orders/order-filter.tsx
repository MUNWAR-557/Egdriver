
'use client';

import * as React from 'react';
import type { OrderStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const statuses: (OrderStatus | 'All')[] = [
  'All',
  'Available',
  'Accepted',
  'Picked Up',
  'En Route',
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
    <ScrollArea className="w-full whitespace-nowrap">
        <div className="inline-flex w-max items-center justify-start gap-1 rounded-md bg-muted p-1">
        {statuses.map((status) => (
            <Button
            key={status}
            variant="ghost"
            size="sm"
            className={cn(
                'h-8 px-3 shrink-0',
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
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

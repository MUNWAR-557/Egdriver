
'use client';

import * as React from 'react';
import type { TaskStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const statuses: (TaskStatus | 'All')[] = [
  'All',
  'Available',
  'Accepted',
  'Picked Up',
  'Arrived',
  'Delivered',
];

interface TaskFilterProps {
  onStatusChange: (status: TaskStatus | 'All') => void;
  onSearchChange: (query: string) => void;
  initialStatus?: TaskStatus | 'All';
}

export function TaskFilter({
  onStatusChange,
  onSearchChange,
  initialStatus = 'All',
}: TaskFilterProps) {
  const [activeStatus, setActiveStatus] = React.useState<TaskStatus | 'All'>(
    initialStatus
  );

  const handleStatusClick = (status: TaskStatus | 'All') => {
    setActiveStatus(status);
    onStatusChange(status);
  };

  return (
    <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by Order ID..."
          className="pl-9 focus:border-primary"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2 rounded-md bg-muted p-1">
        {statuses.map((status) => (
          <Button
            key={status}
            variant="ghost"
            className={cn(
              'h-8 px-3 text-sm',
              activeStatus === status
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'hover:bg-primary/10 hover:text-primary'
            )}
            onClick={() => handleStatusClick(status)}
          >
            {status}
          </Button>
        ))}
      </div>
    </div>
  );
}

'use client';

import type { TaskStatus } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const statuses: (TaskStatus | 'All')[] = [
  'All',
  'Available',
  'Accepted',
  'Picked Up',
  'En Route',
  'Arrived',
  'Delivered',
];

interface TaskFilterProps {
  onStatusChange: (status: TaskStatus | 'All') => void;
}

export function TaskFilter({ onStatusChange }: TaskFilterProps) {
  return (
    <Select onValueChange={(value) => onStatusChange(value as TaskStatus | 'All')} defaultValue="All">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

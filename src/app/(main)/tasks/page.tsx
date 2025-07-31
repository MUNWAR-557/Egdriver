
'use client';

import { useState, useMemo } from 'react';
import type { Task, TaskStatus } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Clock, MapPin, Package, Truck, Bot } from 'lucide-react';
import Image from 'next/image';

import { useToast } from '@/hooks/use-toast';
import { AiSuggestions } from '@/components/tasks/ai-suggestions';
import { ScanQrDialog } from '@/components/tasks/scan-qr-dialog';
import { CompleteDeliveryDialog } from '@/components/tasks/complete-delivery-dialog';
import { TaskStatusBadge } from '@/components/tasks/task-status-badge';
import { TaskFilter } from '@/components/tasks/task-filter';

const initialTasks: Task[] = [
  { id: 'TSK001', pickupLocation: '123 Main St, Gourmet Plaza', deliveryAddress: '456 Oak Ave, Apt 7B', orderItems: '2x Pepperoni Pizza, 1x Coke', deliveryTimeframe: '6:30 PM - 7:00 PM', status: 'Available', estimatedEarnings: 12.50 },
  { id: 'TSK002', pickupLocation: '789 Pine St, Tech Park', deliveryAddress: '101 Maple Dr, Suburbia', orderItems: '1x Laptop, 1x Mouse', deliveryTimeframe: 'ASAP', status: 'Available', estimatedEarnings: 25.00 },
  { id: 'TSK003', pickupLocation: '210 Broad St, Central Market', deliveryAddress: '314 River Rd, Waterside', orderItems: 'Groceries (5 items)', deliveryTimeframe: '7:00 PM - 7:45 PM', status: 'Accepted', estimatedEarnings: 15.75 },
  { id: 'TSK004', pickupLocation: '555 High St, Fashion District', deliveryAddress: '777 Low St, Downtown', orderItems: '1x Dress, 2x T-shirts', deliveryTimeframe: 'Flexible', status: 'Picked Up', estimatedEarnings: 18.00 },
  { id: 'TSK005', pickupLocation: '888 Industrial Ave', deliveryAddress: '999 Residential Blvd', orderItems: 'Electronics', deliveryTimeframe: '10:00 AM - 11:00 AM', status: 'Delivered', estimatedEarnings: 30.00 },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const handleStatusUpdate = (taskId: string, newStatus: TaskStatus) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handlePickup = (taskId: string) => {
    handleStatusUpdate(taskId, 'Picked Up');
    toast({
      title: 'Pickup Confirmed!',
      description: `Task ${taskId} is now "Picked Up". Ready to roll!`,
    });
  };

  const handleDeliveryComplete = (taskId: string, earnings: number) => {
    handleStatusUpdate(taskId, 'Delivered');
    toast({
      title: 'Delivery Complete!',
      description: `Task ${taskId} is finished. You've earned ₹${earnings.toFixed(2)}.`,
      className: 'bg-green-500 text-white',
    });
  };

  const getNextAction = (task: Task): React.ReactNode => {
    switch (task.status) {
      case 'Available':
        return (
          <Button onClick={() => handleStatusUpdate(task.id, 'Accepted')} size="sm">
            Accept Task
          </Button>
        );
      case 'Accepted':
        return (
          <ScanQrDialog
            taskId={task.id}
            onScanSuccess={() => handlePickup(task.id)}
          />
        );
      case 'Picked Up':
        return (
          <Button onClick={() => handleStatusUpdate(task.id, 'En Route')} size="sm">
            <Truck className="mr-2 h-4 w-4" /> Start Driving
          </Button>
        );
      case 'En Route':
        return (
          <Button onClick={() => handleStatusUpdate(task.id, 'Arrived')} size="sm">
            <MapPin className="mr-2 h-4 w-4" /> Arrived
          </Button>
        );
      case 'Arrived':
        return (
          <CompleteDeliveryDialog
            taskId={task.id}
            onOtpVerified={() =>
              handleDeliveryComplete(task.id, task.estimatedEarnings)
            }
          />
        );
      default:
        return null;
    }
  };

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    if (filterStatus !== 'All') {
      filtered = filtered.filter((task) => task.status === filterStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter((task) =>
        task.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [tasks, filterStatus, searchQuery]);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col gap-4 mb-6">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Your Tasks</h2>
          <AiSuggestions />
        </div>
        <TaskFilter onStatusChange={setFilterStatus} onSearchChange={setSearchQuery} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            return (
              <Card key={task.id} className="flex flex-col text-sm">
                <CardHeader className="p-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{task.id}</CardTitle>
                    <TaskStatusBadge status={task.status} />
                  </div>
                  <CardDescription className="text-xs">{task.deliveryAddress}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-2 p-3 pt-0">
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3 w-3 mt-0.5 text-primary flex-shrink-0" />
                      <span>
                        <strong>From:</strong> {task.pickupLocation}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Package className="h-3 w-3 mt-0.5 text-primary flex-shrink-0" />
                      <span>
                        <strong>Items:</strong> {task.orderItems}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-primary flex-shrink-0" />
                      <span>
                        <strong>Time:</strong> {task.deliveryTimeframe}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-md overflow-hidden border">
                    <Image
                      src="https://placehold.co/400x150.png"
                      width={400}
                      height={150}
                      alt="Route map"
                      data-ai-hint="route map"
                      className="w-full object-cover"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-stretch p-3 pt-0">
                  <div className="text-center mb-2">
                    <p className="text-xs text-muted-foreground">
                      Earnings
                    </p>
                    <p className="text-lg font-bold text-primary">
                      ₹{task.estimatedEarnings.toFixed(2)}
                    </p>
                  </div>
                  {getNextAction(task)}
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <p className="text-muted-foreground col-span-full text-center">
            No tasks found for the selected filters.
          </p>
        )}
      </div>
    </div>
  );
}

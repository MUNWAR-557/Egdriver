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
import { Clock, MapPin, Package, Truck } from 'lucide-react';
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
          <Button onClick={() => handleStatusUpdate(task.id, 'Accepted')}>
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
          <Button onClick={() => handleStatusUpdate(task.id, 'En Route')}>
            <Truck className="mr-2" /> Start Driving
          </Button>
        );
      case 'En Route':
        return (
          <Button onClick={() => handleStatusUpdate(task.id, 'Arrived')}>
            <MapPin className="mr-2" /> Arrived at Destination
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
    if (filterStatus === 'All') {
      return tasks;
    }
    return tasks.filter((task) => task.status === filterStatus);
  }, [tasks, filterStatus]);

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Your Tasks</h2>
        <div className="flex items-center gap-2">
            <TaskFilter onStatusChange={setFilterStatus} />
            <AiSuggestions />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            return (
              <Card key={task.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{task.id}</CardTitle>
                    <TaskStatusBadge status={task.status} />
                  </div>
                  <CardDescription>{task.deliveryAddress}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                      <span>
                        <strong>From:</strong> {task.pickupLocation}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Package className="h-4 w-4 mt-0.5 text-primary" />
                      <span>
                        <strong>Items:</strong> {task.orderItems}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>
                        <strong>Time:</strong> {task.deliveryTimeframe}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg overflow-hidden border">
                    <Image
                      src="https://placehold.co/400x200.png"
                      width={400}
                      height={200}
                      alt="Route map"
                      data-ai-hint="route map"
                      className="w-full object-cover"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-stretch">
                  <div className="text-center mb-4">
                    <p className="text-sm text-muted-foreground">
                      Estimated Earnings
                    </p>
                    <p className="text-2xl font-bold text-primary">
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
            No tasks found for the selected status.
          </p>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import type { Task, TaskStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Package, Truck, CheckCircle2, Bot, CircleDotDashed, Loader2, QrCode, ShieldCheck, KeyRound } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { suggestTaskNotifications, SuggestTaskNotificationsOutput } from '@/ai/flows/suggest-task-notifications';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { QrScanner } from '@/components/ui/qr-scanner';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const initialTasks: Task[] = [
  { id: 'TSK001', pickupLocation: '123 Main St, Gourmet Plaza', deliveryAddress: '456 Oak Ave, Apt 7B', orderItems: '2x Pepperoni Pizza, 1x Coke', deliveryTimeframe: '6:30 PM - 7:00 PM', status: 'Available', estimatedEarnings: 12.50 },
  { id: 'TSK002', pickupLocation: '789 Pine St, Tech Park', deliveryAddress: '101 Maple Dr, Suburbia', orderItems: '1x Laptop, 1x Mouse', deliveryTimeframe: 'ASAP', status: 'Available', estimatedEarnings: 25.00 },
  { id: 'TSK003', pickupLocation: '210 Broad St, Central Market', deliveryAddress: '314 River Rd, Waterside', orderItems: 'Groceries (5 items)', deliveryTimeframe: '7:00 PM - 7:45 PM', status: 'Accepted', estimatedEarnings: 15.75 },
  { id: 'TSK004', pickupLocation: '555 High St, Fashion District', deliveryAddress: '777 Low St, Downtown', orderItems: '1x Dress, 2x T-shirts', deliveryTimeframe: 'Flexible', status: 'Picked Up', estimatedEarnings: 18.00 },
];

function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const variants: Record<TaskStatus, { variant: "default" | "secondary" | "outline" | "destructive"; icon: React.ReactNode; text: string }> = {
    Available: { variant: 'secondary', icon: <CircleDotDashed className="h-3 w-3" />, text: 'Available' },
    Accepted: { variant: 'default', icon: <Package className="h-3 w-3" />, text: 'Accepted' },
    'Picked Up': { variant: 'default', icon: <ShieldCheck className="h-3 w-3" />, text: 'Picked Up' },
    'En Route': { variant: 'outline', icon: <Truck className="h-3 w-3" />, text: 'En Route' },
    Arrived: { variant: 'outline', icon: <MapPin className="h-3 w-3" />, text: 'Arrived' },
    Delivered: { variant: 'default', icon: <CheckCircle2 className="h-3 w-3" />, text: 'Delivered' },
  };

  const currentVariant = variants[status];
  
  return (
    <Badge variant={currentVariant.variant} className={`flex items-center gap-1.5 ${status === 'Delivered' ? 'bg-green-500 text-white hover:bg-green-600' : ''} ${status === 'Picked Up' ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}>
      {currentVariant.icon}
      <span>{currentVariant.text}</span>
    </Badge>
  );
}

function AiSuggestions() {
  const [suggestions, setSuggestions] = useState<SuggestTaskNotificationsOutput['suggestedTasks'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestions(null);
    try {
      const result = await suggestTaskNotifications({
        driverId: 'driver-007',
        currentLocation: { latitude: 34.0522, longitude: -118.2437 },
        availableCapacity: 3,
      });
      setSuggestions(result.suggestedTasks && result.suggestedTasks.length > 0 ? result.suggestedTasks : []);
    } catch (err) {
      setError('Failed to fetch AI suggestions. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Bot className="mr-2 h-4 w-4" />
          Get AI Suggestions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>AI-Powered Task Suggestions</DialogTitle>
          <DialogDescription>
            Let our AI find the most optimal tasks for you based on your location and capacity.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <Button onClick={handleGetSuggestions} disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
            {isLoading ? 'Analyzing...' : 'Suggest Me Tasks Now'}
          </Button>
        </div>
        <div className="space-y-4 max-h-[50vh] overflow-y-auto p-1">
          {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
          {suggestions === null && !isLoading && <p className="text-center text-muted-foreground">Click the button to get your personalized task suggestions.</p>}
          {suggestions && suggestions.length === 0 && !isLoading && <p className="text-center text-muted-foreground">No new suggestions found at the moment.</p>}
          {suggestions && suggestions.map((task) => (
            <Card key={task.taskId} className="bg-secondary">
              <CardHeader>
                <CardTitle className="text-base">Deliver to: {task.deliveryAddress}</CardTitle>
                <CardDescription>Estimated Earnings: <span className="font-bold text-primary">₹{task.estimatedEarnings.toFixed(2)}</span></CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Pickup: {task.pickupLocation.latitude}, {task.pickupLocation.longitude}</p>
                <p>Items: {task.orderItems}</p>
                <p>Timeframe: {task.deliveryTimeframe}</p>
              </CardContent>
              <CardFooter>
                <Button size="sm" className="w-full">Accept Suggested Task</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ScanQrDialog({ taskId, onScanSuccess }: { taskId: string, onScanSuccess: () => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <QrCode className="mr-2 h-4 w-4" />
          Scan &amp; Start Delivery
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scan Package QR Code</DialogTitle>
          <DialogDescription>
            Please scan the QR code on the package for task {taskId} to confirm pickup.
          </DialogDescription>
        </DialogHeader>
        <QrScanner
          expectedValue={taskId}
          onScanSuccess={() => {
            onScanSuccess();
          }}
        />
        <DialogClose asChild>
           <Button variant="outline" className="mt-4">Cancel</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

function CompleteDeliveryDialog({ taskId, onOtpVerified }: { taskId: string; onOtpVerified: () => void }) {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const handleVerify = () => {
    setIsVerifying(true);
    // Simulate API call for OTP verification
    setTimeout(() => {
      // For demo, any 6-digit code is valid
      if (otp.length === 6 && /^\d+$/.test(otp)) {
        toast({
          title: 'OTP Verified!',
          description: `Delivery for task ${taskId} is complete.`,
        });
        onOtpVerified();
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid OTP',
          description: 'Please enter the 6-digit OTP sent to the customer.',
        });
      }
      setIsVerifying(false);
    }, 1000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Complete Delivery
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Delivery for {taskId}</DialogTitle>
          <DialogDescription>
            Please enter the 6-digit OTP from the customer to finalize this delivery.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="otp">Customer OTP</Label>
                <Input 
                    id="otp" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                />
            </div>
            <Button onClick={handleVerify} disabled={isVerifying} className="w-full">
                {isVerifying ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <KeyRound className="mr-2 h-4 w-4" />
                )}
                {isVerifying ? 'Verifying...' : 'Verify & Complete'}
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const { toast } = useToast();

  const handleStatusUpdate = (taskId: string, newStatus: TaskStatus) => {
    setTasks(currentTasks =>
      currentTasks.map(task =>
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
        className: 'bg-green-500 text-white'
    });
  };

  const getNextAction = (task: Task): React.ReactNode => {
    switch (task.status) {
      case 'Available':
        return <Button onClick={() => handleStatusUpdate(task.id, 'Accepted')}>Accept Task</Button>;
      case 'Accepted':
        return <ScanQrDialog taskId={task.id} onScanSuccess={() => handlePickup(task.id)} />;
      case 'Picked Up':
        return <Button onClick={() => handleStatusUpdate(task.id, 'En Route')}>
          <Truck className="mr-2" /> Start Driving
        </Button>;
      case 'En Route':
        return <Button onClick={() => handleStatusUpdate(task.id, 'Arrived')}>
          <MapPin className="mr-2" /> Arrived at Destination
        </Button>;
      case 'Arrived':
        return <CompleteDeliveryDialog taskId={task.id} onOtpVerified={() => handleDeliveryComplete(task.id, task.estimatedEarnings)} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Available Tasks</h2>
        <AiSuggestions />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => {
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
                    <span><strong>From:</strong> {task.pickupLocation}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Package className="h-4 w-4 mt-0.5 text-primary" />
                    <span><strong>Items:</strong> {task.orderItems}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span><strong>Time:</strong> {task.deliveryTimeframe}</span>
                  </div>
                </div>
                <div className="rounded-lg overflow-hidden border">
                  <Image src="https://placehold.co/400x200.png" width={400} height={200} alt="Route map" data-ai-hint="route map" className="w-full object-cover"/>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-stretch">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground">Estimated Earnings</p>
                  <p className="text-2xl font-bold text-primary">₹{task.estimatedEarnings.toFixed(2)}</p>
                </div>
                {getNextAction(task)}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

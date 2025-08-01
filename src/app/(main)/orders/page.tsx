
'use client';

import { useState, useMemo } from 'react';
import type { Order, OrderStatus } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Clock, MapPin, Package, Truck, WifiOff } from 'lucide-react';
import Image from 'next/image';

import { useToast } from '@/hooks/use-toast';
import { AiSuggestions } from '@/components/orders/ai-suggestions';
import { ScanQrDialog } from '@/components/orders/scan-qr-dialog';
import { CompleteDeliveryDialog } from '@/components/orders/complete-delivery-dialog';
import { OrderStatusBadge } from '@/components/orders/order-status-badge';
import { OrderFilter } from '@/components/orders/order-filter';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AnimatedSwitch } from '@/components/ui/animated-switch';

const initialOrders: Order[] = [
  { id: 'TSK001', pickupLocation: '123 Main St, Gourmet Plaza', deliveryAddress: '456 Oak Ave, Apt 7B', orderItems: '2x Pepperoni Pizza, 1x Coke', deliveryTimeframe: '6:30 PM - 7:00 PM', status: 'Available', estimatedEarnings: 12.50 },
  { id: 'TSK002', pickupLocation: '789 Pine St, Tech Park', deliveryAddress: '101 Maple Dr, Suburbia', orderItems: '1x Laptop, 1x Mouse', deliveryTimeframe: 'ASAP', status: 'Available', estimatedEarnings: 25.00 },
  { id: 'TSK003', pickupLocation: '210 Broad St, Central Market', deliveryAddress: '314 River Rd, Waterside', orderItems: 'Groceries (5 items)', deliveryTimeframe: '7:00 PM - 7:45 PM', status: 'Accepted', estimatedEarnings: 15.75 },
  { id: 'TSK004', pickupLocation: '555 High St, Fashion District', deliveryAddress: '777 Low St, Downtown', orderItems: '1x Dress, 2x T-shirts', deliveryTimeframe: 'Flexible', status: 'Picked Up', estimatedEarnings: 18.00 },
  { id: 'TSK005', pickupLocation: '888 Industrial Ave', deliveryAddress: '999 Residential Blvd', orderItems: 'Electronics', deliveryTimeframe: '10:00 AM - 11:00 AM', status: 'Delivered', estimatedEarnings: 30.00 },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const { toast } = useToast();

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handlePickup = (orderId: string) => {
    handleStatusUpdate(orderId, 'Picked Up');
    toast({
      title: 'Pickup Confirmed!',
      description: `Order ${orderId} is now "Picked Up". Ready to roll!`,
    });
  };

  const handleDeliveryComplete = (orderId: string, earnings: number) => {
    handleStatusUpdate(orderId, 'Delivered');
    toast({
      title: 'Delivery Complete!',
      description: `Order ${orderId} is finished. You've earned ₹${earnings.toFixed(2)}.`,
      className: 'bg-green-500 text-white',
    });
  };

  const handleOnlineToggle = (online: boolean) => {
    setIsOnline(online);
    toast({
      title: `You are now ${online ? 'Online' : 'Offline'}`,
      description: online ? 'You will now receive new order notifications.' : 'You will not receive new order notifications.',
    });
  }

  const getNextAction = (order: Order): React.ReactNode => {
    switch (order.status) {
      case 'Available':
        return (
          <Button onClick={() => handleStatusUpdate(order.id, 'Accepted')} size="sm">
            Accept Order
          </Button>
        );
      case 'Accepted':
        return (
          <ScanQrDialog
            orderId={order.id}
            onScanSuccess={() => handlePickup(order.id)}
          />
        );
      case 'Picked Up':
        return (
          <Button onClick={() => handleStatusUpdate(order.id, 'En Route')} size="sm">
            <Truck className="mr-2 h-4 w-4" /> Start Driving
          </Button>
        );
      case 'En Route':
        return (
          <Button onClick={() => handleStatusUpdate(order.id, 'Arrived')} size="sm">
            <MapPin className="mr-2 h-4 w-4" /> Arrived
          </Button>
        );
      case 'Arrived':
        return (
          <CompleteDeliveryDialog
            orderId={order.id}
            onOtpVerified={() =>
              handleDeliveryComplete(order.id, order.estimatedEarnings)
            }
          />
        );
      default:
        return null;
    }
  };

  const filteredOrders = useMemo(() => {
    if (!isOnline) return [];

    let filtered = orders;

    if (filterStatus !== 'All') {
      filtered = filtered.filter((order) => order.status === filterStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter((order) =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (locationQuery) {
        filtered = filtered.filter(order => 
            order.pickupLocation.toLowerCase().includes(locationQuery.toLowerCase()) ||
            order.deliveryAddress.toLowerCase().includes(locationQuery.toLowerCase())
        );
    }

    return filtered;
  }, [orders, filterStatus, searchQuery, locationQuery, isOnline]);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="Driver" data-ai-hint="driver avatar" />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">John Doe</span>
                <AnimatedSwitch checked={isOnline} onCheckedChange={handleOnlineToggle} />
            </div>
            <div className="flex-1">
                <OrderFilter onStatusChange={setFilterStatus} />
            </div>
        </div>

        <div className="flex w-full items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Order ID..."
              className="pl-9 focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative w-full max-w-sm">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Location..."
              className="pl-9 focus:border-primary"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
            />
          </div>
          <AiSuggestions />
        </div>
      </div>
      
      {isOnline ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {filteredOrders.length > 0 ? (
           filteredOrders.map((order) => {
             return (
               <Card key={order.id} className="flex flex-col text-sm">
                 <CardHeader className="p-3">
                   <div className="flex justify-between items-start">
                     <CardTitle className="text-base">{order.id}</CardTitle>
                     <OrderStatusBadge status={order.status} />
                   </div>
                   <CardDescription className="text-xs">{order.deliveryAddress}</CardDescription>
                 </CardHeader>
                 <CardContent className="flex-grow space-y-2 p-3 pt-0">
                   <div className="space-y-1 text-xs text-muted-foreground">
                     <div className="flex items-start gap-2">
                       <MapPin className="h-3 w-3 mt-0.5 text-primary flex-shrink-0" />
                       <span>
                         <strong>From:</strong> {order.pickupLocation}
                       </span>
                     </div>
                     <div className="flex items-start gap-2">
                       <Package className="h-3 w-3 mt-0.5 text-primary flex-shrink-0" />
                       <span>
                         <strong>Items:</strong> {order.orderItems}
                       </span>
                     </div>
                     <div className="flex items-center gap-2">
                       <Clock className="h-3 w-3 text-primary flex-shrink-0" />
                       <span>
                         <strong>Time:</strong> {order.deliveryTimeframe}
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
                       ₹{order.estimatedEarnings.toFixed(2)}
                     </p>
                   </div>
                   {getNextAction(order)}
                 </CardFooter>
               </Card>
             );
           })
         ) : (
           <p className="text-muted-foreground col-span-full text-center">
             No orders found for the selected filters.
           </p>
         )}
       </div>
      ) : (
        <Card className="col-span-full text-center p-8">
            <CardHeader>
                <div className="mx-auto bg-secondary rounded-full h-16 w-16 flex items-center justify-center">
                    <WifiOff className="h-8 w-8 text-muted-foreground" />
                </div>
                <CardTitle className="mt-4">You Are Offline</CardTitle>
                <CardDescription>
                    You are not currently visible for new orders. Please switch to "Online" to start receiving delivery requests.
                </CardDescription>
            </CardHeader>
        </Card>
      )}
    </div>
  );
}

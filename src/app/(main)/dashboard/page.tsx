
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PackageCheck, TrendingUp } from 'lucide-react';

const chartData = [
  { month: 'Jan', earnings: 1860.45 },
  { month: 'Feb', earnings: 3050.87 },
  { month: 'Mar', earnings: 2370.12 },
  { month: 'Apr', earnings: 730.98 },
  { month: 'May', earnings: 2090.33 },
  { month: 'Jun', earnings: 2140.67 },
];

const chartConfig = {
  earnings: {
    label: 'Earnings',
    color: 'hsl(var(--primary))',
  },
};

const deliveryHistory = [
  { id: 'DLV001', date: '2023-06-12', earnings: 15.50, status: 'Completed' },
  { id: 'DLV002', date: '2023-06-12', earnings: 22.00, status: 'Completed' },
  { id: 'DLV003', date: '2023-06-11', earnings: 8.75, status: 'Completed' },
  { id: 'DLV004', date: '2023-06-11', earnings: 19.25, status: 'Completed' },
  { id: 'DLV005', date: '2023-06-10', earnings: 35.00, status: 'Completed' },
];

const fullDeliveryHistory = [
    { id: 'TSK001', pickupLocation: '123 Main St, Gourmet Plaza', deliveryAddress: '456 Oak Ave, Apt 7B', orderItems: '2x Pepperoni Pizza, 1x Coke', deliveryTimeframe: '6:30 PM - 7:00 PM', status: 'Delivered', estimatedEarnings: 12.50, date: '2023-06-20' },
    { id: 'TSK002', pickupLocation: '789 Pine St, Tech Park', deliveryAddress: '101 Maple Dr, Suburbia', orderItems: '1x Laptop, 1x Mouse', deliveryTimeframe: 'ASAP', status: 'Delivered', estimatedEarnings: 25.00, date: '2023-06-20' },
    { id: 'TSK003', pickupLocation: '210 Broad St, Central Market', deliveryAddress: '314 River Rd, Waterside', orderItems: 'Groceries (5 items)', deliveryTimeframe: '7:00 PM - 7:45 PM', status: 'Delivered', estimatedEarnings: 15.75, date: '2023-06-19' },
    { id: 'TSK004', pickupLocation: '555 High St, Fashion District', deliveryAddress: '777 Low St, Downtown', orderItems: '1x Dress, 2x T-shirts', deliveryTimeframe: 'Flexible', status: 'Delivered', estimatedEarnings: 18.00, date: '2023-06-19' },
    { id: 'TSK005', pickupLocation: '888 Industrial Ave', deliveryAddress: '999 Residential Blvd', orderItems: 'Electronics', deliveryTimeframe: '10:00 AM - 11:00 AM', status: 'Delivered', estimatedEarnings: 30.00, date: '2023-06-18' },
    { id: 'TSK006', pickupLocation: '123 Main St, Gourmet Plaza', deliveryAddress: '456 Oak Ave, Apt 7B', orderItems: '2x Pepperoni Pizza, 1x Coke', deliveryTimeframe: '6:30 PM - 7:00 PM', status: 'Delivered', estimatedEarnings: 12.50, date: '2023-06-18' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">₹</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹4,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Deliveries</CardTitle>
            <PackageCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+235</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.9/5.0</div>
            <p className="text-xs text-muted-foreground">+2 since last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Earnings Overview</CardTitle>
            <CardDescription>Your earnings over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip cursor={false} content={<ChartTooltipContent formatter={(value) => `₹${value.toLocaleString()}`} />} />
                <Bar dataKey="earnings" fill="var(--color-earnings)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Deliveries</CardTitle>
            <CardDescription>A history of your most recent deliveries.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Earnings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliveryHistory.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-medium">{delivery.id}</TableCell>
                    <TableCell>{delivery.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{delivery.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">₹{delivery.earnings.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Delivery History</CardTitle>
          <CardDescription>A complete history of all your deliveries.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Pickup</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Earnings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fullDeliveryHistory.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell className="font-medium">{delivery.id}</TableCell>
                  <TableCell>{delivery.date}</TableCell>
                  <TableCell>{delivery.pickupLocation}</TableCell>
                  <TableCell>{delivery.deliveryAddress}</TableCell>
                  <TableCell>{delivery.orderItems}</TableCell>
                  <TableCell>
                    <Badge variant={delivery.status === 'Delivered' ? 'default' : 'secondary'} className={delivery.status === 'Delivered' ? 'bg-green-500 text-white' : ''}>
                      {delivery.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">₹{delivery.estimatedEarnings.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

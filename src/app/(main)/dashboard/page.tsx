'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, PackageCheck, TrendingUp } from 'lucide-react';

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

export default function DashboardPage() {
  return (
    <div className="container mx-auto space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,231.89</div>
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
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip cursor={false} content={<ChartTooltipContent />} />
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
                  <TableHead>Task ID</TableHead>
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
                      <Badge variant="outline" className="text-accent-foreground border-accent">{delivery.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">${delivery.earnings.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

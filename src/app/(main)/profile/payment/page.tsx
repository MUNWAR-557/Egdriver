'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function PaymentMethodsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>
          Manage your saved payment methods for receiving payouts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-lg p-4 flex justify-between items-center">
            <div>
                <p className="font-semibold">**** **** **** 1234</p>
                <p className="text-sm text-muted-foreground">Bank of Example</p>
            </div>
            <Button variant="outline" size="sm">Remove</Button>
        </div>
        <Button className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Bank Account
        </Button>
      </CardContent>
    </Card>
  );
}


'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Landmark,
  PlusCircle,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddBankAccountDialog } from '@/components/profile/add-bank-account-dialog';
import { AddUpiDialog } from '@/components/profile/add-upi-dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

interface BankAccount {
  id: string;
  accountNumber: string;
  bankName: string;
  isDefault: boolean;
}

interface UpiId {
  id: string;
  fullName: string;
  upiId: string;
  isDefault: boolean;
}

const initialBankAccounts: BankAccount[] = [
  {
    id: 'ba_1',
    accountNumber: '**** **** **** 1234',
    bankName: 'Bank of Example',
    isDefault: true,
  },
   {
    id: 'ba_2',
    accountNumber: '**** **** **** 5678',
    bankName: 'Demo Commercial Bank',
    isDefault: false,
  },
];

const initialUpiIds: UpiId[] = [
  { id: 'upi_1', fullName: 'John Doe', upiId: 'driver@exampleupi', isDefault: true },
];

export default function PaymentMethodsPage() {
  const [bankAccounts, setBankAccounts] =
    useState<BankAccount[]>(initialBankAccounts);
  const [upiIds, setUpiIds] = useState<UpiId[]>(initialUpiIds);

  const addBankAccount = (details: Omit<BankAccount, 'id' | 'isDefault'>) => {
    const newAccount: BankAccount = {
      ...details,
      id: `ba_${Date.now()}`,
      isDefault: bankAccounts.length === 0,
    };
    setBankAccounts([...bankAccounts, newAccount]);
  };

  const addUpiId = (details: Omit<UpiId, 'id' | 'isDefault'>) => {
    const newUpi: UpiId = {
      ...details,
      id: `upi_${Date.now()}`,
      isDefault: upiIds.length === 0,
    };
    setUpiIds([...upiIds, newUpi]);
  };

  const removeBankAccount = (id: string) => {
    setBankAccounts(bankAccounts.filter((acc) => acc.id !== id));
  };

  const removeUpiId = (id: string) => {
    setUpiIds(upiIds.filter((upi) => upi.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>
          Manage your saved payment methods for receiving payouts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bank" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-md">
            <TabsTrigger value="bank" className="data-[state=active]:bg-lime-300 data-[state=inactive]:bg-white rounded-md">Bank Accounts</TabsTrigger>
            <TabsTrigger value="upi" className="data-[state=active]:bg-lime-300 data-[state=inactive]:bg-white rounded-md">UPI IDs</TabsTrigger>
          </TabsList>
          <TabsContent value="bank" className="mt-4 space-y-4">
            {bankAccounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  <Landmark className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{account.accountNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {account.bankName}
                    </p>
                  </div>
                </div>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently remove this bank account from your profile.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => removeBankAccount(account.id)} className="bg-destructive hover:bg-destructive/90">
                                Yes, remove
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                 </AlertDialog>
              </div>
            ))}
            <AddBankAccountDialog onSave={addBankAccount} />
          </TabsContent>
          <TabsContent value="upi" className="mt-4 space-y-4">
            {upiIds.map((upi) => (
              <div
                key={upi.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                    <div className="font-mono text-xs font-bold bg-muted text-muted-foreground p-2 rounded-md">UPI</div>
                     <div>
                        <p className="font-semibold">{upi.upiId}</p>
                        <p className="text-sm text-muted-foreground">{upi.fullName}</p>
                     </div>
                </div>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently remove this UPI ID from your profile.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => removeUpiId(upi.id)} className="bg-destructive hover:bg-destructive/90">
                                Yes, remove
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                 </AlertDialog>
              </div>
            ))}
            <AddUpiDialog onSave={addUpiId} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

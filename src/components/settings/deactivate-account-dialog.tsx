
'use client';

import { useState } from 'react';
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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export function DeactivateAccountDialog() {
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeactivating, setIsDeactivating] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const confirmationWord = 'DELETE';

  const handleDeactivate = () => {
    setIsDeactivating(true);
    // Simulate API call for deactivation
    setTimeout(() => {
      setIsDeactivating(false);
      toast({
        title: 'Account Deactivated',
        description: 'Your account has been successfully deactivated.',
      });
      // Redirect to login page after deactivation
      router.push('/login');
    }, 1500);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Deactivate Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently deactivate your
            account and remove your data from our servers. To confirm, please type{' '}
            <strong className="text-destructive">{confirmationWord}</strong> below.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-2">
          <Label htmlFor="confirmation" className="sr-only">
            Confirmation Text
          </Label>
          <Input
            id="confirmation"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder={`Type "${confirmationWord}" to confirm`}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={confirmationText !== confirmationWord || isDeactivating}
            onClick={handleDeactivate}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeactivating && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isDeactivating ? 'Deactivating...' : 'Deactivate Account'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

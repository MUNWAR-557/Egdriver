
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, KeyRound, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CompleteDeliveryDialogProps {
  orderId: string;
  onOtpVerified: () => void;
}

export function CompleteDeliveryDialog({
  orderId,
  onOtpVerified,
}: CompleteDeliveryDialogProps) {
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
          description: `Delivery for order ${orderId} is complete.`,
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
        <Button size="sm">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Complete Delivery
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Delivery for {orderId}</DialogTitle>
          <DialogDescription>
            Please enter the 6-digit OTP from the customer to finalize this
            delivery.
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
          <Button
            onClick={handleVerify}
            disabled={isVerifying}
            className="w-full"
          >
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

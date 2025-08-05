
'use client';

import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, KeyRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { authenticate, type AuthState } from '@/lib/actions';

const initialState: AuthState = {
  message: '',
  success: false,
  step: 'phone',
};

function SubmitButton({ step }: { step: 'phone' | 'otp' }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {step === 'phone' ? 'Send OTP' : <>
        <KeyRound className="mr-2 h-4 w-4" />
        Verify & Log In
      </>}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(authenticate, initialState);
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        if (state.step === 'otp') {
          toast({
            title: 'OTP Sent!',
            description: `An OTP has been sent to ${phoneNumber}.`,
          });
        } else if (state.step === 'done') {
          router.push('/dashboard');
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Authentication Failed',
          description: state.message,
        });
      }
    }
  }, [state, toast, router, phoneNumber]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {state.step === 'phone' ? 'Welcome Back!' : 'Enter OTP'}
        </CardTitle>
        <CardDescription>
          {state.step === 'phone'
            ? 'Enter your phone number to receive a login OTP.'
            : `We've sent a 6-digit code to ${phoneNumber}.`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state.step === 'phone' ? (
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="9876543210"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              {state.errors?.phone && <p className="text-sm text-destructive">{state.errors.phone.join(', ')}</p>}
            </div>
          ) : (
            <div className="space-y-2">
              <input type="hidden" name="phone" value={phoneNumber} />
              <Label htmlFor="otp">6-Digit OTP</Label>
              <Input
                id="otp"
                name="otp"
                type="text"
                maxLength={6}
                placeholder="XXXXXX"
                required
              />
               {state.errors?.otp && <p className="text-sm text-destructive">{state.errors.otp.join(', ')}</p>}
            </div>
          )}
          <SubmitButton step={state.step} />
          {state.step === 'otp' && (
            <Button
              variant="link"
              size="sm"
              className="w-full"
              onClick={() => {
                // This would ideally be a state reset dispatch
                window.location.reload(); 
              }}
            >
              Use a different phone number
            </Button>
          )}
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

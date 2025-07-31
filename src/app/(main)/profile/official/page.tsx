'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { updateProfile, type ProfileFormState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, Loader2 } from 'lucide-react';

const initialState: ProfileFormState = {
  message: '',
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Save className="mr-2 h-4 w-4" />
      )}
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}

export default function OfficialInfoPage() {
  const [state, formAction] = useFormState(updateProfile, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success!' : 'Oops!',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Official Information</CardTitle>
          <CardDescription>
            Manage your official details for verification.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deliveryAgentNumber">Delivery Agent Number</Label>
            <Input
              id="deliveryAgentNumber"
              name="deliveryAgentNumber"
              defaultValue="DA-98765"
            />
            {state.errors?.deliveryAgentNumber && (
              <p className="text-sm text-destructive">
                {state.errors.deliveryAgentNumber.join(', ')}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="drivingLicenseNumber">
              Driving License Number
            </Label>
            <Input
              id="drivingLicenseNumber"
              name="drivingLicenseNumber"
              defaultValue="DL-123456789"
            />
            {state.errors?.drivingLicenseNumber && (
              <p className="text-sm text-destructive">
                {state.errors.drivingLicenseNumber.join(', ')}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="aadharCardNumber">Aadhar Card Number</Label>
            <Input
              id="aadharCardNumber"
              name="aadharCardNumber"
              defaultValue="1234 5678 9012"
            />
            {state.errors?.aadharCardNumber && (
              <p className="text-sm text-destructive">
                {state.errors.aadharCardNumber.join(', ')}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}

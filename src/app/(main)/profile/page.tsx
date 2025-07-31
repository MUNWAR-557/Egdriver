'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { updateProfile, type ProfileFormState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}

export default function ProfilePage() {
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
    <div className="container mx-auto max-w-2xl">
      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Manage your personal details and contact preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" defaultValue="John Doe" />
              {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name.join(', ')}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" defaultValue="john.doe@example.com" />
              {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email.join(', ')}</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
            <CardDescription>Keep your vehicle information up to date.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleModel">Vehicle Model</Label>
              <Input id="vehicleModel" name="vehicleModel" defaultValue="Honda Civic 2022" />
              {state.errors?.vehicleModel && <p className="text-sm text-destructive">{state.errors.vehicleModel.join(', ')}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="licensePlate">License Plate</Label>
              <Input id="licensePlate" name="licensePlate" defaultValue="DRI-V3R" />
              {state.errors?.licensePlate && <p className="text-sm text-destructive">{state.errors.licensePlate.join(', ')}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

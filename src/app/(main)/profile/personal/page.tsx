
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
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
import { Save, Loader2, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

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

export default function PersonalInfoPage() {
  const [state, formAction] = useActionState(updateProfile, initialState);
  const { toast } = useToast();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    'https://placehold.co/100x100.png'
  );

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Manage your personal details and contact preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarPreview ?? undefined} alt="Driver" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Label htmlFor="profilePic">Profile Picture</Label>
                <div className="flex gap-2">
                  <Input
                    id="profilePic"
                    name="profilePic"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                   <Label htmlFor="profilePic" className="cursor-pointer">
                    <Button asChild variant="outline">
                      <div>
                        <Upload className="mr-2" />
                        Upload
                      </div>
                    </Button>
                  </Label>
                </div>
                {state.errors?.profilePic && (
                  <p className="text-sm text-destructive">
                    {state.errors.profilePic.join(', ')}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" defaultValue="John Doe" />
              {state.errors?.name && (
                <p className="text-sm text-destructive">
                  {state.errors.name.join(', ')}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue="john.doe@example.com"
              />
              {state.errors?.email && (
                <p className="text-sm text-destructive">
                  {state.errors.email.join(', ')}
                </p>
              )}
            </div>
             <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                defaultValue="123 Main St, Anytown, USA"
              />
              {state.errors?.address && (
                <p className="text-sm text-destructive">
                  {state.errors.address.join(', ')}
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

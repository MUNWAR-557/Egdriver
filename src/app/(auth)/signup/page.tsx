
'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Must be a valid 10-digit phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  drivingLicense: z.custom<File>((v) => v instanceof File, {
    message: 'Driving license is required.',
  }),
  aadharNumber: z
    .string()
    .regex(/^\d{12}$/, 'Must be a valid 12-digit Aadhar number'),
  profilePhoto: z.custom<File>((v) => v instanceof File, {
    message: 'Profile photo is required.',
  }),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;

const steps = [
  { id: 1, title: 'Personal Details', fields: ['fullName', 'email', 'phone', 'password', 'confirmPassword'] },
  { id: 2, title: 'Document Upload', fields: ['drivingLicense', 'aadharNumber', 'profilePhoto'] },
];

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      aadharNumber: '',
      drivingLicense: undefined,
      profilePhoto: undefined,
    },
  });

  const { handleSubmit, trigger } = form;

  const handleNext = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields as any, { shouldFocus: true });
    if (!output) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: ProfileFormData) => {
    console.log('Form data submitted:', data);
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
        setIsSubmitting(false);
        // Redirect to dashboard or a "pending approval" page
        window.location.href = '/dashboard';
    }, 2000);
  };

  return (
    <FormProvider {...form}>
      <Card>
        <CardHeader>
          <CardTitle>Driver Registration</CardTitle>
          <CardDescription>
            {steps[currentStep].title}
          </CardDescription>
          <Progress value={((currentStep + 1) / steps.length) * 100} className="mt-2" />
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {currentStep === 0 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {currentStep === 1 && (
                <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="drivingLicense"
                  render={({ field: { onChange, value, ...props } }) => (
                    <FormItem>
                      <FormLabel>Driving License (Image)</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files?.[0])} {...props} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="aadharNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aadhar Card Number</FormLabel>
                      <FormControl>
                        <Input placeholder="XXXX XXXX XXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profilePhoto"
                  render={({ field: { onChange, value, ...props } }) => (
                    <FormItem>
                      <FormLabel>Your Photo</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files?.[0])} {...props} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="flex justify-between">
              {currentStep > 0 ? (
                <Button type="button" variant="outline" onClick={handlePrev}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
              ) : <div></div>}
              
              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={handleNext}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                   {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Application
                </Button>
              )}
            </div>
             <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <Link href="/login" className="underline">
                    Log in
                </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
}

'use server';

import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  vehicleModel: z.string().min(2, 'Vehicle model is required'),
  licensePlate: z.string().min(4, 'License plate seems too short'),
});

export type ProfileFormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    vehicleModel?: string[];
    licensePlate?: string[];
  };
  success: boolean;
};

export async function updateProfile(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const validatedFields = profileSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    vehicleModel: formData.get('vehicleModel'),
    licensePlate: formData.get('licensePlate'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your inputs.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  // Here you would typically save the data to a database.
  // We'll simulate a successful save.
  console.log('Profile updated:', validatedFields.data);

  return {
    message: 'Profile updated successfully!',
    success: true,
  };
}

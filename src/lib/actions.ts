'use server';

import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address seems too short'),
  deliveryAgentNumber: z.string().min(5, 'Enter a valid agent number'),
  drivingLicenseNumber: z.string().min(5, 'Enter a valid license number'),
  aadharCardNumber: z
    .string()
    .regex(/^\d{4}\s\d{4}\s\d{4}$/, 'Invalid Aadhar number format (XXXX XXXX XXXX)'),
  vehicleModel: z.string().min(2, 'Vehicle model is required'),
  licensePlate: z.string().min(4, 'License plate seems too short'),
  profilePic: z
    .any()
    .refine((file) => file?.size === 0 || file?.size, 'Profile picture is required.')
    .refine(
      (file) => file?.size === 0 || file?.size < 5 * 1024 * 1024,
      'Max image size is 5MB.'
    )
    .refine(
      (file) =>
        file?.size === 0 ||
        (file?.type && ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    )
    .optional(),
});

export type ProfileFormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    address?: string[];
    deliveryAgentNumber?: string[];
    drivingLicenseNumber?: string[];
    aadharCardNumber?: string[];
    vehicleModel?: string[];
    licensePlate?: string[];
    profilePic?: string[];
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
    address: formData.get('address'),
    deliveryAgentNumber: formData.get('deliveryAgentNumber'),
    drivingLicenseNumber: formData.get('drivingLicenseNumber'),
    aadharCardNumber: formData.get('aadharCardNumber'),
    vehicleModel: formData.get('vehicleModel'),
    licensePlate: formData.get('licensePlate'),
    profilePic: formData.get('profilePic'),
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

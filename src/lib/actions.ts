
'use server';

import { z } from 'zod';

// LOGIN ACTION
const phoneSchema = z.string().regex(/^\d{10}$/, 'Must be a valid 10-digit phone number');
const otpSchema = z.string().length(6, 'OTP must be 6 digits');

export type AuthState = {
  message: string;
  errors?: {
    phone?: string[];
    otp?: string[];
  };
  success: boolean;
  step: 'phone' | 'otp' | 'done';
};

export async function authenticate(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const step = formData.get('otp') !== null ? 'otp' : 'phone';

  if (step === 'phone') {
    const validatedPhone = phoneSchema.safeParse(formData.get('phone'));
    if (!validatedPhone.success) {
      return {
        message: 'Invalid phone number.',
        errors: validatedPhone.error.flatten().fieldErrors,
        success: false,
        step: 'phone',
      };
    }
    // Simulate sending OTP
    console.log(`Sending OTP to ${validatedPhone.data}`);
    return {
      message: 'OTP sent successfully.',
      success: true,
      step: 'otp',
    };
  } else if (step === 'otp') {
    const validatedOtp = otpSchema.safeParse(formData.get('otp'));
    if (!validatedOtp.success) {
        return {
            ...prevState, // keep phone number state
            message: 'Invalid OTP.',
            errors: validatedOtp.error.flatten().fieldErrors,
            success: false,
            step: 'otp',
        };
    }
    // Simulate OTP verification
    console.log(`Verifying OTP ${validatedOtp.data}`);
    // In a real app, you would set a session cookie here
    return {
        message: 'Login successful!',
        success: true,
        step: 'done',
    };
  }

  return {
    message: 'Invalid state.',
    success: false,
    step: 'phone',
  }
}


// SIGNUP ACTION
const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Must be a valid 10-digit phone number'),
  drivingLicense: z.instanceof(File).refine(file => file.size > 0, 'Driving license is required.'),
  aadharNumber: z
    .string()
    .regex(/^\d{12}$/, 'Must be a valid 12-digit Aadhar number'),
  profilePhoto: z.instanceof(File).refine(file => file.size > 0, 'Profile photo is required.'),
});

export type SignupFormState = {
  message: string;
  errors?: z.ZodError<z.infer<typeof signupSchema>>['formErrors']['fieldErrors'];
  success: boolean;
};

export async function signup(prevState: SignupFormState, formData: FormData): Promise<SignupFormState> {
  const validatedFields = signupSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      message: "Validation failed. Please check your inputs.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { profilePhoto, drivingLicense, ...userData } = validatedFields.data;

  console.log("Registering user:", userData);
  console.log("Uploading profile photo:", profilePhoto.name);
  console.log("Uploading driving license:", drivingLicense.name);

  // Simulate user creation and file upload
  await new Promise(res => setTimeout(res, 1500));

  return {
    message: "Registration successful! Your application is under review.",
    success: true,
  };
}


// PROFILE ACTIONS
const personalInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address seems too short'),
  profilePic: z
    .any()
    .refine((file) => !file || file.size === 0 || file.size, 'Profile picture is required.')
    .refine(
      (file) => !file || file.size === 0 || file.size < 5 * 1024 * 1024,
      'Max image size is 5MB.'
    )
    .refine(
      (file) =>
        !file || file.size === 0 ||
        (file.type && ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    )
    .optional(),
});

const officialInfoSchema = z.object({
  deliveryAgentNumber: z.string().min(5, 'Enter a valid agent number'),
  drivingLicenseNumber: z.string().min(5, 'Enter a valid license number'),
  aadharCardNumber: z
    .string()
    .regex(/^\d{4}\s\d{4}\s\d{4}$/, 'Invalid Aadhar number format (XXXX XXXX XXXX)'),
});

const vehicleInfoSchema = z.object({
    vehicleModel: z.string().min(2, 'Vehicle model is required'),
    licensePlate: z.string().min(4, 'License plate seems too short'),
});


export type FormState = {
  message: string;
  errors?: {
    [key: string]: string[] | undefined;
  };
  success: boolean;
};


export async function updatePersonalInfo(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = personalInfoSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    address: formData.get('address'),
    profilePic: formData.get('profilePic'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your inputs.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  console.log('Personal info updated:', validatedFields.data);

  return {
    message: 'Personal info updated successfully!',
    success: true,
  };
}


export async function updateOfficialInfo(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = officialInfoSchema.safeParse({
    deliveryAgentNumber: formData.get('deliveryAgentNumber'),
    drivingLicenseNumber: formData.get('drivingLicenseNumber'),
    aadharCardNumber: formData.get('aadharCardNumber'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your inputs.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  console.log('Official info updated:', validatedFields.data);

  return {
    message: 'Official info updated successfully!',
    success: true,
  };
}


export async function updateVehicleInfo(
    prevState: FormState,
    formData: FormData
  ): Promise<FormState> {
    const validatedFields = vehicleInfoSchema.safeParse({
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
  
    console.log('Vehicle info updated:', validatedFields.data);
  
    return {
      message: 'Vehicle info updated successfully!',
      success: true,
    };
  }

import { z } from 'zod';

const registerBaseSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters'),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),

  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),

  confirmPassword: z.string().min(1, 'Please confirm your password'),

  tvName: z
    .string()
    .min(1, 'WhatsApp TV name is required')
    .min(2, 'TV name must be at least 2 characters'),

  whatsappNumber: z.string().refine((value) => {
    const trimmed = value.trim();

    return (
      /^\+234\d{10}$/.test(trimmed) ||
      /^0\d{10}$/.test(trimmed) ||
      /^\d{10}$/.test(trimmed)
    );
  }, 'Enter a valid Nigerian WhatsApp number'),

  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase and use hyphens only',
    ),

  otp: z.string().regex(/^\d{4}$/, 'Enter the 4-digit OTP'),
});

export const registerSchema = registerBaseSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  },
);

export type RegisterFormData = z.infer<typeof registerBaseSchema>;

export const initialFormData: RegisterFormData = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  tvName: '',
  whatsappNumber: '+234',
  slug: '',
  otp: '',
};

export const registerAccountSchema = registerBaseSchema
  .pick({
    fullName: true,
    email: true,
    password: true,
    confirmPassword: true,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const registerWorkspaceSchema = registerBaseSchema.pick({
  tvName: true,
  whatsappNumber: true,
  slug: true,
});

export const registerOtpSchema = registerBaseSchema.pick({
  otp: true,
});

export type RegisterWorkspaceFormData = z.infer<typeof registerWorkspaceSchema>;

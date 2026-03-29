import { z } from 'zod';

export const registerAccountSchema = z
  .object({
    user_name: z
      .string()
      .min(1, 'Username is required')
      .min(2, 'Username must be at least 2 characters'),

    email: z
      .string()
      .min(1, 'Email is required')
      .email('Enter a valid email address'),

    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),

    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const registerChannelSchema = z.object({
  tv_name: z
    .string()
    .min(1, 'WhatsApp TV name is required')
    .min(2, 'TV name must be at least 2 characters'),

  whatsapp_number: z.string().refine((value) => {
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
});

export const registerOtpSchema = z.object({
  otp: z.string().regex(/^\d{4}$/, 'Enter the 4-digit OTP'),
});

export type RegisterAccountFormData = z.infer<typeof registerAccountSchema>;
export type RegisterChannelFormData = z.infer<typeof registerChannelSchema>;
export type RegisterOtpFormData = z.infer<typeof registerOtpSchema>;

export type RegisterFormData = RegisterAccountFormData &
  RegisterChannelFormData &
  RegisterOtpFormData;

export const initialFormData: RegisterFormData = {
  user_name: '',
  email: '',
  password: '',
  confirmPassword: '',
  tv_name: '',
  whatsapp_number: '+234',
  slug: '',
  otp: '',
};
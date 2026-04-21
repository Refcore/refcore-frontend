import { User } from '@/model/user.model';
import { z } from 'zod';


const MAX_FILE_SIZE = 5 * 1024 * 1024;

const profilePictureSchema = z
  .union([
    z.string().trim(),
    z.instanceof(File),
    z.null(),
    z.undefined(),
  ])
  .refine((value) => {
    if (!value) return true;
    if (typeof value === 'string') return true;
    return value.size <= MAX_FILE_SIZE;
  }, 'Profile picture must not exceed 5MB');

export const accountSettingsSchema = z.object({
  user_name: z
    .string()
    .trim()
    .min(2, 'Username must be at least 2 characters')
    .max(50, 'Username must not exceed 50 characters'),

  full_name: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(80, 'Full name must not exceed 80 characters')
    .optional()
    .or(z.literal('')),

  email: z
    .string()
    .trim()
    .email('Enter a valid email address')
    .optional()
    .or(z.literal('')),

  profile_picture: profilePictureSchema,
});

export type AccountSettingsFormValues = z.infer<typeof accountSettingsSchema>;

export const getInitialAccountSettingsFormValues = (
  user: User,
): AccountSettingsFormValues => ({
  user_name: user?.user_name ?? '',
  email: user?.email ?? '',
  profile_picture: user?.profile_picture ?? '',
});
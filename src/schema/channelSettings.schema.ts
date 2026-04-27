import { MyChannel } from '@/types/channel.type';
import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const channelBannerSchema = z
  .union([z.string().trim(), z.instanceof(File), z.null(), z.undefined()])
  .refine((value) => {
    if (!value) return true;
    if (typeof value === 'string') return true;
    return value.size <= MAX_FILE_SIZE;
  }, 'Channel banner must not exceed 5MB');

export const channelSettingsSchema = z.object({
  tv_name: z
    .string()
    .trim()
    .min(2, 'TV name must be at least 2 characters')
    .max(80, 'TV name must not exceed 80 characters'),

  slug: z
    .string()
    .trim()
    .min(3, 'Slug must be at least 3 characters')
    .max(80, 'Slug must not exceed 80 characters')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must use lowercase letters, numbers, and hyphens only.',
    ),

  whatsapp_number: z
    .string()
    .trim()
    .regex(
      /^\+?[1-9]\d{7,14}$/,
      'Enter a valid WhatsApp number in international format.',
    ),

  channel_members_limit: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        return /^\d+$/.test(value);
      },
      {
        message: 'Channel members limit must be a whole number',
      },
    )
    .refine(
      (value) => {
        if (!value) return true;
        return Number(value) >= 0;
      },
      {
        message: 'Channel members limit cannot be negative',
      },
    ),

  channel_banner: channelBannerSchema,
});

export type ChannelSettingsFormValues = z.infer<typeof channelSettingsSchema>;

export const getInitialChannelSettingsFormValues = (
  channel: MyChannel,
): ChannelSettingsFormValues => ({
  tv_name: channel.tv_name ?? '',
  slug: channel.slug ?? '',
  whatsapp_number: channel.whatsapp_number ?? '',
  channel_members_limit: channel.channel_members_limit ?? '',
   channel_banner: channel.channel_banner ?? '',
});

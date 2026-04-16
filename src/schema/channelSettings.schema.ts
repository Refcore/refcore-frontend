import { MyChannel } from '@/types/channel.type';
import { z } from 'zod';

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
    .union([z.number().int().positive(), z.null()])
    .optional(),
});

export type ChannelSettingsFormValues = z.infer<typeof channelSettingsSchema>;

export const getInitialChannelSettingsFormValues = (
  channel: MyChannel,
): ChannelSettingsFormValues => ({
  tv_name: channel.tv_name ?? '',
  slug: channel.slug ?? '',
  whatsapp_number: channel.whatsapp_number ?? '',
  channel_members_limit: channel.channel_members_limit ?? null,
});
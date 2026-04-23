import { z } from 'zod';
import { ContestDefaults } from '@/types/contest.type';
import {
  contestTimingModeOptions,
  contestVisibilityOptions,
} from './contest.schema';

export const contestDefaultsSchema = z.object({
  visibility: z.enum(contestVisibilityOptions, {
    message: 'Select a valid contest visibility',
  }),

  contest_timing_mode: z.enum(contestTimingModeOptions, {
    message: 'Select a valid contest timing mode',
  }),

  referral_code_prefix: z
    .string()
    .trim()
    .max(10, 'Referral code prefix must not exceed 10 characters')
    .regex(
      /^[A-Z0-9]*$/,
      'Referral code prefix must contain only uppercase letters and numbers',
    ),

  reward_description: z
    .string()
    .trim()
    .max(300, 'Reward description must not exceed 300 characters'),

  max_winners: z.coerce
    .number({
      message: 'Maximum winners must be a number',
    })
    .int('Maximum winners must be a whole number')
    .min(1, 'Maximum winners must be at least 1'),
});

export type ContestDefaultsFormValues = z.infer<typeof contestDefaultsSchema>;

export const getInitialContestDefaultsFormValues = (
  defaults?: ContestDefaults | null,
): ContestDefaultsFormValues => ({
  visibility: defaults?.visibility ?? 'public',
  contest_timing_mode: defaults?.contest_timing_mode ?? 'manual',
  referral_code_prefix: defaults?.referral_code_prefix ?? '',
  reward_description: defaults?.reward_description ?? '',
  max_winners: defaults?.max_winners ?? 1,
});

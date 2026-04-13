import { z } from 'zod';

export const contestVisibilityOptions = ['public', 'private'] as const;

export const contestVisibilityDropdownOptions = contestVisibilityOptions.map(
  (value) => ({
    label: value.charAt(0).toUpperCase() + value.slice(1),
    value,
  }),
);

export const contestTimingModeOptions = ['manual', 'automatic'] as const;

export const contestTimingModeDropdownOptions = contestTimingModeOptions.map(
  (value) => ({
    label: value === 'manual' ? 'Manual' : 'Automatic',
    value,
  }),
);

export const createContestSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Contest title is required')
      .max(120, 'Contest title must not exceed 120 characters'),

    slug: z
      .string()
      .min(1, 'Slug is required')
      .max(120, 'Slug must not exceed 120 characters')
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Slug must be lowercase and can only contain letters, numbers, and hyphens',
      ),

    description: z
      .string()
      .min(1, 'Description is required')
      .max(500, 'Description must not exceed 500 characters'),

    visibility: z.enum(contestVisibilityOptions, {
      message: 'Select a valid contest visibility',
    }),

    referral_code_prefix: z
      .string()
      .min(1, 'Referral code prefix is required')
      .max(10, 'Referral code prefix must not exceed 10 characters')
      .regex(
        /^[A-Z0-9]+$/,
        'Referral code prefix must contain only uppercase letters and numbers',
      ),

    contest_timing_mode: z.enum(contestTimingModeOptions, {
      message: 'Select a valid contest timing mode',
    }),

    start_date: z.string().nullable(),

    end_date: z.string().nullable(),

    reward_description: z
      .string()
      .min(1, 'Reward description is required')
      .max(300, 'Reward description must not exceed 300 characters'),

    max_winners: z.coerce
      .number({
        message: 'Maximum winners must be a number',
      })
      .int('Maximum winners must be a whole number')
      .min(1, 'Maximum winners must be at least 1'),
  })
  .superRefine((data, ctx) => {
    if (data.contest_timing_mode === 'manual') {
      return;
    }

    if (!data.start_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start date is required when timing is automatic',
        path: ['start_date'],
      });
    }

    if (!data.end_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End date is required when timing is automatic',
        path: ['end_date'],
      });
    }

    if (data.start_date && data.end_date) {
      if (new Date(data.end_date) < new Date(data.start_date)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'End date cannot be before start date',
          path: ['end_date'],
        });
      }
    }
  });

export type CreateContestFormValues = z.infer<typeof createContestSchema>;

export const initialCreateContestFormValues: CreateContestFormValues = {
  title: '',
  slug: '',
  description: '',
  visibility: 'public',
  contest_timing_mode: 'manual',
  referral_code_prefix: '',
  start_date: '',
  end_date: null,
  reward_description: '',
  max_winners: 1,
};
